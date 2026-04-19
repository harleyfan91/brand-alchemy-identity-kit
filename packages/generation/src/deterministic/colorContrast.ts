/**
 * Shared color helpers for the deterministic guide model and PDF render.
 *
 * - `hexToRgb` / `relativeLuminanceSrgb` are the WCAG building blocks.
 * - `contrastRatio(fg, bg)` is the generic pair-contrast helper used by the
 *   model when ranking palette pairs for the wordmark color blocks on
 *   folio 02b, and by the renderer when picking readable foregrounds.
 * - `contrastRatioOnWhite(hex)` is a thin wrapper kept for back-compat.
 * - `friendlyColorName(hex)` returns an editorial friendly name for a hex
 *   (e.g. "Deep Navy", "Pale Sky", "Off White") derived deterministically
 *   from the color's HSL bucket. No external dependency.
 *
 * The friendly-name buckets are intentionally coarse: the goal is a stable,
 * non-prescriptive label per swatch on folio 02a — not a perceptual
 * color-science classifier.
 */

export type Rgb = { r: number; g: number; b: number }

/** Parse `#RRGGBB` (or `#RGB`) into 0–255 channels. Returns null for unparseable input. */
export function hexToRgb(hex: string): Rgb | null {
  if (typeof hex !== 'string') return null
  let h = hex.trim()
  if (h.startsWith('#')) h = h.slice(1)
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

/** WCAG-style relative luminance for sRGB hex (0–1). */
export function relativeLuminance(rgb: Rgb): number {
  const lin = (c: number) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b)
}

/** Generic pair contrast ratio per WCAG 2.x. Falls back to 1 when either input is unparseable. */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex)
  const bg = hexToRgb(bgHex)
  if (!fg || !bg) return 1
  const Lf = relativeLuminance(fg)
  const Lb = relativeLuminance(bg)
  const lighter = Math.max(Lf, Lb)
  const darker = Math.min(Lf, Lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Back-compat wrapper for renderers that just need contrast against a white page. */
export function contrastRatioOnWhite(hex: string): number {
  return contrastRatio(hex, '#FFFFFF')
}

// ---------------------------------------------------------------------------
// Friendly color names
// ---------------------------------------------------------------------------

/**
 * Convert sRGB 0–255 channels to HSL (h: 0–360, s/l: 0–1).
 * Local helper — kept private because external callers should use
 * `friendlyColorName` instead of leaking the bucket math.
 */
function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60
        break
      case gn:
        h = ((bn - rn) / d + 2) * 60
        break
      default:
        h = ((rn - gn) / d + 4) * 60
    }
  }
  return { h, s, l }
}

/**
 * Six-bucket lightness label, intentionally coarse so the names read as
 * editorial labels (Deep / Dark / Mid / Soft / Pale / Off-) rather than
 * paint-chip taxonomy.
 */
function lightnessBucket(l: number): 'deep' | 'dark' | 'mid' | 'soft' | 'pale' | 'near-white' {
  if (l < 0.12) return 'deep'
  if (l < 0.3) return 'dark'
  if (l < 0.55) return 'mid'
  if (l < 0.75) return 'soft'
  if (l < 0.92) return 'pale'
  return 'near-white'
}

/**
 * Hue family for saturated colors. Returns null when saturation is too
 * low — neutrals are named separately so we never produce something like
 * "Pale Cyan" for an essentially-grey swatch.
 */
function hueFamily(h: number):
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'magenta'
  | 'pink' {
  const hue = ((h % 360) + 360) % 360
  if (hue < 12 || hue >= 350) return 'red'
  if (hue < 28) return 'orange'
  if (hue < 44) return 'amber'
  if (hue < 62) return 'yellow'
  if (hue < 82) return 'lime'
  if (hue < 155) return 'green'
  if (hue < 185) return 'teal'
  if (hue < 205) return 'cyan'
  if (hue < 235) return 'blue'
  if (hue < 260) return 'indigo'
  if (hue < 290) return 'violet'
  if (hue < 320) return 'magenta'
  return 'pink'
}

/** Pretty noun for a hue family at a given lightness — biased toward editorial noun usage. */
function colorNoun(hue: ReturnType<typeof hueFamily>, lightness: ReturnType<typeof lightnessBucket>): string {
  const base: Record<ReturnType<typeof hueFamily>, string> = {
    red: 'Red',
    orange: 'Orange',
    amber: 'Amber',
    yellow: 'Yellow',
    lime: 'Lime',
    green: 'Green',
    teal: 'Teal',
    cyan: 'Sky',
    blue: 'Blue',
    indigo: 'Indigo',
    violet: 'Violet',
    magenta: 'Magenta',
    pink: 'Pink',
  }
  if (hue === 'blue' && (lightness === 'deep' || lightness === 'dark')) return 'Navy'
  if (hue === 'green' && (lightness === 'deep' || lightness === 'dark')) return 'Forest'
  if (hue === 'green' && lightness === 'mid') return 'Moss'
  if (hue === 'green' && (lightness === 'soft' || lightness === 'pale')) return 'Sage'
  if (hue === 'cyan' && lightness === 'pale') return 'Sky'
  if (hue === 'teal' && (lightness === 'deep' || lightness === 'dark')) return 'Teal'
  if (hue === 'red' && (lightness === 'deep' || lightness === 'dark')) return 'Wine'
  if (hue === 'orange' && (lightness === 'deep' || lightness === 'dark')) return 'Rust'
  if (hue === 'amber' && (lightness === 'deep' || lightness === 'dark')) return 'Bronze'
  if (hue === 'yellow' && (lightness === 'deep' || lightness === 'dark')) return 'Mustard'
  if (hue === 'pink' && lightness === 'pale') return 'Blush'
  if (hue === 'magenta' && (lightness === 'deep' || lightness === 'dark')) return 'Plum'
  return base[hue]
}

/** Adjective for a lightness bucket. */
function colorAdjective(lightness: ReturnType<typeof lightnessBucket>): string {
  switch (lightness) {
    case 'deep':
      return 'Deep'
    case 'dark':
      return 'Dark'
    case 'mid':
      return ''
    case 'soft':
      return 'Soft'
    case 'pale':
      return 'Pale'
    case 'near-white':
      return 'Pale'
  }
}

/** Neutral name for a low-saturation color. */
function neutralName(lightness: ReturnType<typeof lightnessBucket>): string {
  switch (lightness) {
    case 'deep':
      return 'Near Black'
    case 'dark':
      return 'Charcoal'
    case 'mid':
      return 'Stone'
    case 'soft':
      return 'Warm Gray'
    case 'pale':
      return 'Cream'
    case 'near-white':
      return 'Off White'
  }
}

/**
 * Friendly editorial name for a hex (e.g. "Deep Navy", "Pale Sky",
 * "Off White"). Deterministic; no external dependency. See module
 * doc-comment for naming intent.
 */
export function friendlyColorName(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'Color'
  const { h, s, l } = rgbToHsl(rgb)
  const lightness = lightnessBucket(l)
  if (s < 0.12) return neutralName(lightness)
  const hue = hueFamily(h)
  const noun = colorNoun(hue, lightness)
  const adjective = colorAdjective(lightness)
  return adjective ? `${adjective} ${noun}` : noun
}
