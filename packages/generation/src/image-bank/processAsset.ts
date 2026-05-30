import sharp from 'sharp'

import type { ImageBankOrientation } from './types.js'
import {
  IMAGE_BANK_JPEG_QUALITY_MIN,
  IMAGE_BANK_JPEG_QUALITY_START,
  IMAGE_BANK_JPEG_QUALITY_STEP,
  IMAGE_BANK_LONG_EDGE_PX,
  IMAGE_BANK_MAX_BYTES,
} from './constants.js'

export type ProcessImageBankAssetResult = {
  buffer: Buffer
  widthPx: number
  heightPx: number
  orientation: ImageBankOrientation
  bytes: number
  jpegQuality: number
}

export function orientationFromDimensions(width: number, height: number): ImageBankOrientation {
  return height > width ? 'portrait' : 'landscape'
}

async function encodeJpegWithinCap(
  pipeline: sharp.Sharp,
  capBytes: number,
): Promise<{ buffer: Buffer; quality: number }> {
  for (let quality = IMAGE_BANK_JPEG_QUALITY_START; quality >= IMAGE_BANK_JPEG_QUALITY_MIN; quality -= IMAGE_BANK_JPEG_QUALITY_STEP) {
    const buffer = await pipeline
      .clone()
      .jpeg({
        quality,
        progressive: true,
        chromaSubsampling: '4:2:0',
        mozjpeg: true,
      })
      .toBuffer()

    if (buffer.length <= capBytes) {
      return { buffer, quality }
    }
  }

  throw new Error(
    `Could not compress image under ${Math.round(capBytes / 1024)} KB at quality >= ${IMAGE_BANK_JPEG_QUALITY_MIN}`,
  )
}

/**
 * Resize a downloaded buffer in memory — aspect preserved (`inside`), no crop.
 * Output is the only binary persisted to disk during ingest.
 */
export async function processImageBankAsset(input: Buffer): Promise<ProcessImageBankAssetResult> {
  const base = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({
      width: IMAGE_BANK_LONG_EDGE_PX,
      height: IMAGE_BANK_LONG_EDGE_PX,
      fit: 'inside',
      withoutEnlargement: true,
    })

  const { buffer, quality } = await encodeJpegWithinCap(base, IMAGE_BANK_MAX_BYTES)
  const meta = await sharp(buffer).metadata()
  const widthPx = meta.width ?? 0
  const heightPx = meta.height ?? 0

  if (widthPx <= 0 || heightPx <= 0) {
    throw new Error('Processed image has invalid dimensions')
  }

  return {
    buffer,
    widthPx,
    heightPx,
    orientation: orientationFromDimensions(widthPx, heightPx),
    bytes: buffer.length,
    jpegQuality: quality,
  }
}
