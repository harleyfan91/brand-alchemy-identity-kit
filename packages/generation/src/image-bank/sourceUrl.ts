import { createHash } from 'node:crypto'

/**
 * Stable dedup key — query strings and resize params stripped where safe.
 */
export function normalizeSourceUrlForDedup(sourceUrl: string): string {
  const url = new URL(sourceUrl)

  if (url.hostname === 'images.unsplash.com') {
    return `unsplash:${url.pathname}`
  }

  if (url.hostname === 'images.pexels.com') {
    return `pexels:${url.pathname}`
  }

  url.search = ''
  url.hash = ''
  return url.toString()
}

/** Readable id when the URL encodes a provider photo slug; otherwise short hash. */
export function deriveImageId(sourceUrl: string, explicitId?: string): string {
  if (explicitId?.trim()) {
    return explicitId.trim()
  }

  const url = new URL(sourceUrl)
  const unsplashMatch = url.pathname.match(/\/photo-([a-z0-9-]+)/i)
  if (unsplashMatch) {
    return `unsplash_${unsplashMatch[1]}`
  }

  const pexelsMatch = url.pathname.match(/\/photos\/(\d+)/)
  if (pexelsMatch) {
    return `pexels_${pexelsMatch[1]}`
  }

  const hash = createHash('sha256').update(normalizeSourceUrlForDedup(sourceUrl)).digest('hex').slice(0, 12)
  return `img_${hash}`
}

export function relativeAssetSrc(imageId: string): string {
  return `packages/generation/dev/image-bank/assets/${imageId}.jpg`
}
