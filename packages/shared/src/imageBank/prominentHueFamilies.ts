/**
 * Closed vocabulary for salient hues in bank photographs.
 * Curators map real-world color to the **nearest bucket** — never invent labels outside this list.
 *
 * @see docs/research/MOODBOARD_BANK_HUE_DEFINITIONS.md
 */
export const IMAGE_BANK_PROMINENT_HUE_FAMILIES = [
  'yellow',
  'orange',
  'red',
  'violet',
  'blue',
  'teal',
  'green',
  'multicolor',
  'achromatic',
] as const

export type ImageBankProminentHueFamily = (typeof IMAGE_BANK_PROMINENT_HUE_FAMILIES)[number]

/** Chromatic buckets only — excludes `multicolor` and `achromatic`. */
export type ImageBankChromaticHueFamily = Exclude<
  ImageBankProminentHueFamily,
  'multicolor' | 'achromatic'
>

export const IMAGE_BANK_CHROMATIC_HUE_FAMILIES = IMAGE_BANK_PROMINENT_HUE_FAMILIES.filter(
  (hue): hue is ImageBankChromaticHueFamily => hue !== 'multicolor' && hue !== 'achromatic',
)

const prominentHueFamilySet = new Set<string>(IMAGE_BANK_PROMINENT_HUE_FAMILIES)

/** Buyer/curator language → canonical bucket. */
export const PROMINENT_HUE_ALIASES: Record<string, ImageBankChromaticHueFamily> = {
  yellow: 'yellow',
  gold: 'yellow',
  mustard: 'yellow',
  orange: 'orange',
  amber: 'orange',
  rust: 'orange',
  terracotta: 'orange',
  red: 'red',
  crimson: 'red',
  wine: 'red',
  magenta: 'violet',
  pink: 'violet',
  purple: 'violet',
  violet: 'violet',
  lilac: 'violet',
  blue: 'blue',
  navy: 'blue',
  indigo: 'blue',
  cyan: 'teal',
  aqua: 'teal',
  turquoise: 'teal',
  teal: 'teal',
  green: 'green',
  lime: 'green',
  sage: 'green',
  forest: 'green',
}

export function isImageBankProminentHueFamily(value: string): value is ImageBankProminentHueFamily {
  return prominentHueFamilySet.has(value)
}

export function coerceChromaticHueAlias(value: string): ImageBankChromaticHueFamily | null {
  const key = value.trim().toLowerCase()
  return PROMINENT_HUE_ALIASES[key] ?? (isImageBankChromaticHueFamily(key) ? key : null)
}

export function isImageBankChromaticHueFamily(value: string): value is ImageBankChromaticHueFamily {
  return (IMAGE_BANK_CHROMATIC_HUE_FAMILIES as readonly string[]).includes(value)
}

/**
 * Map HSL hue (0–360°) to the nearest canonical chromatic bucket.
 * Boundaries are half-open except red, which wraps 350–360 and 0–15.
 */
export function mapHueAngleToChromaticFamily(hueDegrees: number): ImageBankChromaticHueFamily {
  const hue = ((hueDegrees % 360) + 360) % 360
  if (hue >= 350 || hue < 15) return 'red'
  if (hue < 45) return 'orange'
  if (hue < 70) return 'yellow'
  if (hue < 150) return 'green'
  if (hue < 200) return 'teal'
  if (hue < 260) return 'blue'
  return 'violet'
}

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const trimmed = hex.trim()
  const match = trimmed.match(/^#?([0-9a-fA-F]{6})$/)
  if (!match) return null
  const value = match[1]!.toLowerCase()
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  }
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min

  if (d === 0) {
    return { h: 0, s: 0, l }
  }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      break
    case g:
      h = ((b - r) / d + 2) / 6
      break
    default:
      h = ((r - g) / d + 4) / 6
      break
  }

  return { h: h * 360, s, l }
}

/** Map a brand hex to the nearest chromatic bucket, or `achromatic` when saturation is negligible. */
export function hexToProminentHueFamily(hex: string): ImageBankProminentHueFamily | null {
  const rgb = parseHexColor(hex)
  if (!rgb) return null

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
  if (s < 0.12 || l < 0.06 || l > 0.97) {
    return 'achromatic'
  }

  return mapHueAngleToChromaticFamily(h)
}

export type ProminentHueTagValidationIssue = {
  field: string
  message: string
}

/**
 * Validate curator-assigned hue tags against closed-vocabulary rules.
 * @see docs/research/MOODBOARD_BANK_HUE_DEFINITIONS.md § Assignment rules
 */
export function validateProminentHueFamilies(
  tags: ImageBankProminentHueFamily[] | undefined,
): ProminentHueTagValidationIssue[] {
  if (!tags?.length) return []

  const issues: ProminentHueTagValidationIssue[] = []

  if (tags.length > 2) {
    issues.push({
      field: 'prominentHueFamilies',
      message: 'prefer 0–2 tags; use multicolor when no single bucket owns the frame',
    })
  }

  if (tags.includes('multicolor') && tags.length > 1) {
    issues.push({
      field: 'prominentHueFamilies',
      message: 'multicolor must be the only tag when used',
    })
  }

  if (tags.includes('achromatic') && tags.length > 1) {
    issues.push({
      field: 'prominentHueFamilies',
      message: 'achromatic must be the only tag when used',
    })
  }

  const chromatic = tags.filter(isImageBankChromaticHueFamily)
  if (chromatic.length > 2) {
    issues.push({
      field: 'prominentHueFamilies',
      message: 'at most two chromatic buckets; prefer one primary',
    })
  }

  return issues
}
