import { getPalette } from 'colorthief'

/**
 * Client-side color extraction for the existing-brand track per
 * OUTPUT_TRANSLATION_SPEC §5.6.2. Reads up to 6 dominant hex values from a
 * `File` (logo or reference image). The caller decides which source-specific
 * field receives the result: logo uploads write to
 * `existingBrand.logoExtractedColors` (authoritative — also auto-fills
 * `hexColors` when the buyer has no manual entries); reference image uploads
 * write to `existingBrand.referenceExtractedColors` (additive suggestions
 * only).
 *
 * Returns an empty array when the file is unreadable or extraction fails.
 * Errors are swallowed deliberately — the existing-brand track must never block
 * fulfillment, and colors are a seed not a truth source.
 */
export async function extractColorsFromFile(file: File, colorCount = 6): Promise<string[]> {
  if (!file.type.startsWith('image/')) return []
  if (file.type === 'image/svg+xml') return []

  let objectUrl: string | undefined
  try {
    objectUrl = URL.createObjectURL(file)
    const image = await loadImage(objectUrl)
    const palette = await getPalette(image, { colorCount })
    if (!palette) return []
    return palette
      .map((color) => color.hex())
      .filter((hex): hex is string => typeof hex === 'string' && hex.length > 0)
      .slice(0, colorCount)
  } catch {
    return []
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image failed to load.'))
    image.src = src
  })
}
