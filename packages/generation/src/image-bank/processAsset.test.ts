import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { orientationFromDimensions, processImageBankAsset } from './processAsset.js'
import { deriveImageId, normalizeSourceUrlForDedup } from './sourceUrl.js'

describe('image-bank processAsset', () => {
  it('preserves aspect ratio and caps JPEG size', async () => {
    const source = await sharp({
      create: {
        width: 3200,
        height: 2400,
        channels: 3,
        background: { r: 180, g: 120, b: 90 },
      },
    })
      .jpeg()
      .toBuffer()

    const result = await processImageBankAsset(source)

    expect(result.orientation).toBe('landscape')
    expect(result.widthPx).toBeGreaterThan(result.heightPx)
    expect(Math.max(result.widthPx, result.heightPx)).toBeLessThanOrEqual(1600)
    expect(result.bytes).toBeLessThanOrEqual(250 * 1024)
    expect(result.jpegQuality).toBeGreaterThanOrEqual(65)
  })

  it('derives portrait orientation', () => {
    expect(orientationFromDimensions(900, 1200)).toBe('portrait')
    expect(orientationFromDimensions(1200, 900)).toBe('landscape')
  })
})

describe('image-bank sourceUrl', () => {
  it('normalizes unsplash URLs for dedup', () => {
    const a = normalizeSourceUrlForDedup(
      'https://images.unsplash.com/photo-123-abc?auto=format&w=2000',
    )
    const b = normalizeSourceUrlForDedup('https://images.unsplash.com/photo-123-abc?w=1200')
    expect(a).toBe(b)
  })

  it('derives readable unsplash image ids', () => {
    expect(
      deriveImageId('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000'),
    ).toBe('unsplash_1558618666-fcd25c85cd64')
  })
})
