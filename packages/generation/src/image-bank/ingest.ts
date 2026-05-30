import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import {
  IMAGE_BANK_ASSETS_DIR,
  IMAGE_BANK_MANIFEST_PATH,
  IMAGE_BANK_METADATA_PATH,
  IMAGE_BANK_WARN_BYTES,
} from './constants.js'
import { deriveImageId, normalizeSourceUrlForDedup, relativeAssetSrc } from './sourceUrl.js'
import { processImageBankAsset } from './processAsset.js'
import {
  ImageBankAsset,
  ImageBankIngestInput,
  ImageBankMetadataFileSchema,
  type ImageBankMetadataFile,
} from './types.js'

export function imageBankPaths() {
  return {
    root: dirname(IMAGE_BANK_METADATA_PATH),
    assetsDir: IMAGE_BANK_ASSETS_DIR,
    metadataPath: IMAGE_BANK_METADATA_PATH,
    manifestPath: IMAGE_BANK_MANIFEST_PATH,
  }
}

export async function readImageBankMetadata(): Promise<ImageBankMetadataFile> {
  try {
    const raw = await readFile(IMAGE_BANK_METADATA_PATH, 'utf8')
    return ImageBankMetadataFileSchema.parse(JSON.parse(raw))
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, assets: [] }
    }
    throw err
  }
}

export async function writeImageBankMetadata(metadata: ImageBankMetadataFile): Promise<void> {
  const validated = ImageBankMetadataFileSchema.parse(metadata)
  await mkdir(dirname(IMAGE_BANK_METADATA_PATH), { recursive: true })
  await writeFile(IMAGE_BANK_METADATA_PATH, `${JSON.stringify(validated, null, 2)}\n`, 'utf8')
}

export async function writeImageBankManifest(metadata: ImageBankMetadataFile): Promise<void> {
  const totalBytes = metadata.assets.reduce((sum, asset) => sum + asset.bytes, 0)
  const manifest = {
    generatedAt: new Date().toISOString(),
    assetCount: metadata.assets.length,
    totalBytes,
    totalMegabytes: Number((totalBytes / (1024 * 1024)).toFixed(2)),
    assets: Object.fromEntries(
      metadata.assets.map((asset) => [
        asset.imageId,
        {
          bytes: asset.bytes,
          orientation: asset.orientation,
          paletteFamily: asset.paletteFamily,
          sceneType: asset.sceneType,
          src: asset.src,
        },
      ]),
    ),
  }
  await writeFile(IMAGE_BANK_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
}

export function findAssetBySourceUrl(
  metadata: ImageBankMetadataFile,
  sourceUrl: string,
): ImageBankAsset | undefined {
  const key = normalizeSourceUrlForDedup(sourceUrl)
  return metadata.assets.find((asset) => normalizeSourceUrlForDedup(asset.sourceUrl) === key)
}

export type IngestImageBankAssetOptions = {
  /** When true, skip if sourceUrl already ingested. */
  skipDuplicates?: boolean
}

export type IngestImageBankAssetResult = {
  status: 'created' | 'skipped'
  asset: ImageBankAsset
}

/**
 * Download → process in memory → write optimized JPEG + metadata row.
 * The remote original is never written to disk.
 */
export async function ingestImageBankAsset(
  input: ImageBankIngestInput,
  download: (sourceUrl: string) => Promise<Buffer>,
  options: IngestImageBankAssetOptions = {},
): Promise<IngestImageBankAssetResult> {
  const metadata = await readImageBankMetadata()
  const existing = findAssetBySourceUrl(metadata, input.sourceUrl)
  if (existing) {
    if (options.skipDuplicates !== false) {
      return { status: 'skipped', asset: existing }
    }
    throw new Error(`Duplicate sourceUrl already ingested as ${existing.imageId}`)
  }

  const imageId = deriveImageId(input.sourceUrl, input.imageId)
  if (metadata.assets.some((asset) => asset.imageId === imageId)) {
    throw new Error(`imageId collision: ${imageId}`)
  }

  const originalBuffer = await download(input.sourceUrl)
  const processed = await processImageBankAsset(originalBuffer)

  await mkdir(IMAGE_BANK_ASSETS_DIR, { recursive: true })
  const assetPath = `${IMAGE_BANK_ASSETS_DIR}/${imageId}.jpg`
  await writeFile(assetPath, processed.buffer)

  const asset: ImageBankAsset = {
    imageId,
    sourceUrl: input.sourceUrl,
    sourcePageUrl: input.sourcePageUrl,
    orientation: processed.orientation,
    paletteFamily: input.paletteFamily,
    styleRegister: input.styleRegister,
    sceneType: input.sceneType,
    license: input.license,
    src: relativeAssetSrc(imageId),
    moodAdjectives: input.moodAdjectives,
    industrySuitability: input.industrySuitability,
    narratorAlignment: input.narratorAlignment,
    widthPx: processed.widthPx,
    heightPx: processed.heightPx,
    bytes: processed.bytes,
    jpegQuality: processed.jpegQuality,
    ingestedAt: new Date().toISOString(),
  }

  metadata.assets.push(asset)
  metadata.assets.sort((a, b) => a.imageId.localeCompare(b.imageId))
  await writeImageBankMetadata(metadata)
  await writeImageBankManifest(metadata)

  return { status: 'created', asset }
}

export function formatIngestSummary(result: IngestImageBankAssetResult): string {
  const { asset, status } = result
  const kb = (asset.bytes / 1024).toFixed(1)
  const warn = asset.bytes > IMAGE_BANK_WARN_BYTES ? ' ⚠ over warn threshold' : ''
  return `${status === 'skipped' ? 'Skipped (duplicate)' : 'Ingested'} ${asset.imageId} · ${asset.widthPx}×${asset.heightPx} · ${kb} KB · q${asset.jpegQuality}${warn}`
}
