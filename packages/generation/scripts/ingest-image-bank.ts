#!/usr/bin/env tsx
/**
 * Ingest moodboard bank images from remote URLs.
 *
 * Downloads into memory only — optimized JPEG + metadata are the only local artifacts.
 *
 * Single asset:
 *   npm run ingest-image-bank -- \
 *     --url="https://images.unsplash.com/photo-..." \
 *     --license=unsplash \
 *     --palette-family=warm-earth \
 *     --style-register=warm \
 *     --scene-type=texture \
 *     --source-page="https://unsplash.com/photos/..."
 *
 * Batch queue (JSON):
 *   npm run ingest-image-bank -- --queue=dev/image-bank/queue.example.json
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { MOOD_ADJECTIVE_IDS } from '@identity-kit/shared'

import { downloadImageToBuffer } from '../src/image-bank/download.js'
import { formatIngestSummary, ingestImageBankAsset } from '../src/image-bank/ingest.js'
import {
  ImageBankIngestInputSchema,
  ImageBankQueueFileSchema,
} from '../src/image-bank/types.js'
import {
  IMAGE_BANK_PALETTE_FAMILIES,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
  validateImageBankIngestTags,
  warnImageBankIngestTags,
} from '@identity-kit/shared'

function usage(): never {
  console.error(`Usage:
  npm run ingest-image-bank -- --url=<download-url> --license=<unsplash|pexels|licensed_stock> \\
    --palette-family=<family> --style-register=<register> --scene-type=<type> \\
    [--source-page=<attribution-url>] [--mood=warm,calm] [--image-id=custom_id]

  npm run ingest-image-bank -- --queue=<path-to-json>

Families: ${IMAGE_BANK_PALETTE_FAMILIES.join(', ')}
Registers: ${IMAGE_BANK_STYLE_REGISTERS.join(', ')}
Scene types: ${IMAGE_BANK_SCENE_TYPES.join(', ')}
`)
  process.exit(1)
}

function parseCsvEnum<T extends string>(value: string | undefined, allowed: readonly T[], label: string): T[] | undefined {
  if (!value?.trim()) return undefined
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean)
  for (const part of parts) {
    if (!allowed.includes(part as T)) {
      throw new Error(`Invalid ${label}: ${part}`)
    }
  }
  return parts as T[]
}

function parseSingleAssetArgs(argv: string[]) {
  const get = (key: string) => argv.find((arg) => arg.startsWith(`${key}=`))?.slice(key.length + 1)

  const sourceUrl = get('--url')
  const license = get('--license')
  const paletteFamily = get('--palette-family')
  const styleRegister = get('--style-register')
  const sceneType = get('--scene-type')

  if (!sourceUrl || !license || !paletteFamily || !styleRegister || !sceneType) {
    usage()
  }

  return ImageBankIngestInputSchema.parse({
    sourceUrl,
    sourcePageUrl: get('--source-page'),
    license,
    paletteFamily,
    styleRegister,
    sceneType,
    moodAdjectives: parseCsvEnum(get('--mood'), MOOD_ADJECTIVE_IDS, 'mood adjective'),
    imageId: get('--image-id'),
  })
}

async function ingestOne(input: ReturnType<typeof parseSingleAssetArgs>) {
  const validated = validateImageBankIngestTags(input)
  if (!validated.success) {
    throw new Error(validated.issues.map((i) => `${i.field}: ${i.message}`).join('; '))
  }
  for (const warning of warnImageBankIngestTags(validated.data!)) {
    console.warn(`⚠️  ${warning}`)
  }

  const result = await ingestImageBankAsset(validated.data!, downloadImageToBuffer)
  console.log(formatIngestSummary(result))
  console.log(`  src: ${result.asset.src}`)
  console.log(`  sourceUrl: ${result.asset.sourceUrl}`)
}

async function ingestQueue(queuePath: string) {
  const absolute = resolve(process.cwd(), queuePath)
  const raw = JSON.parse(await readFile(absolute, 'utf8'))
  const queue = ImageBankQueueFileSchema.parse(raw)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const [index, asset] of queue.assets.entries()) {
    try {
      const validated = validateImageBankIngestTags(asset)
      if (!validated.success) {
        throw new Error(validated.issues.map((i) => `${i.field}: ${i.message}`).join('; '))
      }
      for (const warning of warnImageBankIngestTags(validated.data!)) {
        console.warn(`[${index + 1}/${queue.assets.length}] ⚠️  ${warning}`)
      }
      const result = await ingestImageBankAsset(validated.data!, downloadImageToBuffer)
      console.log(`[${index + 1}/${queue.assets.length}] ${formatIngestSummary(result)}`)
      if (result.status === 'created') created += 1
      else skipped += 1
    } catch (err) {
      failed += 1
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[${index + 1}/${queue.assets.length}] FAILED ${asset.sourceUrl}: ${message}`)
    }
  }

  console.log(`\nDone — created ${created}, skipped ${skipped}, failed ${failed}`)
  if (failed > 0) process.exit(1)
}

async function main() {
  const argv = process.argv.slice(2)
  const queueArg = argv.find((arg) => arg.startsWith('--queue='))?.slice('--queue='.length)

  if (queueArg) {
    await ingestQueue(queueArg)
    return
  }

  if (argv.includes('--help') || argv.includes('-h')) {
    usage()
  }

  await ingestOne(parseSingleAssetArgs(argv))
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})
