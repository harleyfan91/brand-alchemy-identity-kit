const DEFAULT_TIMEOUT_MS = 60_000
const MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024

/**
 * Fetch image bytes into memory — never persisted as the original file.
 */
export async function downloadImageToBuffer(sourceUrl: string): Promise<Buffer> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent': 'identity-kit-image-bank-ingest/1.0',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`Download failed (${response.status} ${response.statusText})`)
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType && !contentType.startsWith('image/')) {
      throw new Error(`Unexpected content-type: ${contentType}`)
    }

    const contentLength = response.headers.get('content-length')
    if (contentLength && Number(contentLength) > MAX_DOWNLOAD_BYTES) {
      throw new Error(`Remote file too large (${contentLength} bytes)`)
    }

    const arrayBuffer = await response.arrayBuffer()
    if (arrayBuffer.byteLength > MAX_DOWNLOAD_BYTES) {
      throw new Error(`Downloaded file too large (${arrayBuffer.byteLength} bytes)`)
    }

    return Buffer.from(arrayBuffer)
  } finally {
    clearTimeout(timeout)
  }
}
