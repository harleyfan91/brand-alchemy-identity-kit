import type { PaletteOption } from '../data/visualDirection'

interface Rgb {
  r: number
  g: number
  b: number
}

/**
 * Parse `#RRGGBB` or `#RGB` (with or without leading `#`) into 0–255 channels.
 * Returns `null` for any unparseable input — the caller is expected to filter
 * those out before scoring.
 */
function hexToRgb(hex: string): Rgb | null {
  if (typeof hex !== 'string') return null
  let h = hex.trim()
  if (h.startsWith('#')) h = h.slice(1)
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return null
  const value = Number.parseInt(h, 16)
  if (Number.isNaN(value)) return null
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  }
}

/** Plain RGB Euclidean distance — fast and stable; quality is sufficient at this resolution. */
function rgbDistance(a: Rgb, b: Rgb): number {
  const dr = a.r - b.r
  const dg = a.g - b.g
  const db = a.b - b.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * Pick the palette from `palettes` whose 4 swatches collectively land closest
 * to the user-supplied `hexColors`. Implements the §5.6.2 "snap to nearest
 * named palette" contract: extracted or manually-entered hex codes seed a
 * recommendation but never ship as a freeform palette.
 *
 * Score model (RGB Euclidean):
 *  - For every palette swatch, find the closest user hex and use that distance.
 *  - Sum across the palette's swatches; lower = better fit.
 *  - This rewards palettes whose entire swatch set is near *some* user color
 *    (rather than just sharing a single dominant shade).
 *
 * Returns `undefined` when no useful comparison can be made (no valid user
 * hexes, no palettes, or every input fails to parse).
 */
export function nearestNamedPalette(
  hexColors: ReadonlyArray<string>,
  palettes: ReadonlyArray<PaletteOption>,
): string | undefined {
  if (palettes.length === 0) return undefined
  const userRgbs = hexColors
    .map((h) => hexToRgb(h))
    .filter((rgb): rgb is Rgb => rgb !== null)
  if (userRgbs.length === 0) return undefined

  let bestId: string | undefined
  let bestScore = Number.POSITIVE_INFINITY

  for (const palette of palettes) {
    const swatchRgbs = palette.swatches
      .map((h) => hexToRgb(h))
      .filter((rgb): rgb is Rgb => rgb !== null)
    if (swatchRgbs.length === 0) continue

    let score = 0
    for (const swatch of swatchRgbs) {
      let nearest = Number.POSITIVE_INFINITY
      for (const user of userRgbs) {
        const distance = rgbDistance(swatch, user)
        if (distance < nearest) nearest = distance
      }
      score += nearest
    }

    if (score < bestScore) {
      bestScore = score
      bestId = palette.id
    }
  }

  return bestId
}
