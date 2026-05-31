import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import {
  IMAGE_BANK_PREFLIGHT_MIN_DOWNLOAD_BYTES,
  preflightImageBankCandidate,
} from './preflightCandidate.js'

async function solidJpegBuffer(width: number, height: number): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 120, g: 90, b: 60 },
    },
  })
    .jpeg()
    .toBuffer()
}

describe('preflightImageBankCandidate', () => {
  it('passes a valid remote-sized buffer through process pipeline', async () => {
    const source = await solidJpegBuffer(2400, 1600)
    const result = await preflightImageBankCandidate('https://example.com/photo.jpg', async () => source, {
      id: 'test_landscape',
    })

    expect(result.ok).toBe(true)
    expect(result.orientation).toBe('landscape')
    expect(result.widthPx).toBeGreaterThan(result.heightPx!)
    expect(result.processedBytes).toBeLessThanOrEqual(250 * 1024)
  })

  it('fails tiny downloads', async () => {
    const result = await preflightImageBankCandidate('https://example.com/missing', async () =>
      Buffer.from('not-an-image'),
    )

    expect(result.ok).toBe(false)
    expect(result.reason).toContain('too small')
    expect(Buffer.from('not-an-image').length).toBeLessThan(IMAGE_BANK_PREFLIGHT_MIN_DOWNLOAD_BYTES)
  })

  it('surfaces download errors', async () => {
    const result = await preflightImageBankCandidate('https://example.com/nope', async () => {
      throw new Error('Download failed (404 Not Found)')
    })

    expect(result.ok).toBe(false)
    expect(result.reason).toContain('404')
  })
})
