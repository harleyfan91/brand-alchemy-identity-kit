import type { IdentityKitForm } from '../form.js'
import type { PhotoColorRelationship } from './photoColorRelationship.js'
import {
  coerceChromaticHueAlias,
  hexToProminentHueFamily,
  IMAGE_BANK_CHROMATIC_HUE_FAMILIES,
  type ImageBankChromaticHueFamily,
  type ImageBankProminentHueFamily,
} from './prominentHueFamilies.js'

export type KitHueSignals = {
  preferredHueFamilies: ImageBankProminentHueFamily[]
  avoidHueFamilies: ImageBankProminentHueFamily[]
}

function dedupeHues(values: ImageBankProminentHueFamily[]): ImageBankProminentHueFamily[] {
  return [...new Set(values)]
}

const CHROMATIC_HUE_PATTERN = new RegExp(
  `\\b(${[
    ...IMAGE_BANK_CHROMATIC_HUE_FAMILIES,
    'cyan',
    'aqua',
    'turquoise',
    'magenta',
    'pink',
    'purple',
    'gold',
    'amber',
    'rust',
    'navy',
    'indigo',
    'lime',
    'sage',
  ].join('|')})\\b`,
  'gi',
)

const AVOID_PREFIX =
  /\b(?:avoid|no|without|never|don't|dont|do not|steer clear of|skip|exclude|ban|keep out)\b/i
const PREFER_PREFIX =
  /\b(?:echo|feature|highlight|include|prefer|signal|use|lean|show|want|love|our brand|brand)\b/i

function parseHueClause(clause: string): KitHueSignals {
  const hues = dedupeHues(
    [...clause.matchAll(CHROMATIC_HUE_PATTERN)]
      .map((match) => coerceChromaticHueAlias(match[0]))
      .filter((hue): hue is ImageBankChromaticHueFamily => hue != null),
  )

  if (hues.length === 0) {
    return { preferredHueFamilies: [], avoidHueFamilies: [] }
  }

  const avoid = AVOID_PREFIX.test(clause)
  const prefer = PREFER_PREFIX.test(clause)

  if (prefer) {
    return { preferredHueFamilies: hues, avoidHueFamilies: [] }
  }
  if (avoid) {
    return { preferredHueFamilies: [], avoidHueFamilies: hues }
  }

  return { preferredHueFamilies: [], avoidHueFamilies: [] }
}

/**
 * Parse explicit hue prefer/avoid cues from Pro `visualNotes` free text.
 * Aliases (cyan, pink, etc.) coerce to canonical buckets.
 */
export function parseHueSignalsFromVisualNotes(notes: string): KitHueSignals {
  if (!notes.trim()) {
    return { preferredHueFamilies: [], avoidHueFamilies: [] }
  }

  const clauses = notes
    .split(/[.;!?]+/)
    .map((clause) => clause.trim())
    .filter(Boolean)

  const prefer: ImageBankProminentHueFamily[] = []
  const avoid: ImageBankProminentHueFamily[] = []

  for (const clause of clauses) {
    const parsed = parseHueClause(clause)
    prefer.push(...parsed.preferredHueFamilies)
    avoid.push(...parsed.avoidHueFamilies)
  }

  const preferredHueFamilies = dedupeHues(prefer)
  const avoidHueFamilies = dedupeHues(avoid.filter((hue) => !preferredHueFamilies.includes(hue)))

  return { preferredHueFamilies, avoidHueFamilies }
}

export function collectBrandHexColors(form: IdentityKitForm): string[] {
  const existingBrand = form.step6.existingBrand
  if (!existingBrand) return []

  const seen = new Set<string>()
  const ordered: string[] = []

  for (const raw of [...(existingBrand.hexColors ?? []), ...(existingBrand.logoExtractedColors ?? [])]) {
    const normalized = raw.trim().match(/^#?([0-9a-fA-F]{6})$/)
    if (!normalized) continue
    const hex = `#${normalized[1]!.toLowerCase()}`
    if (seen.has(hex)) continue
    seen.add(hex)
    ordered.push(hex)
  }

  return ordered
}

export function prominentHueFamiliesFromHexes(hexes: string[]): ImageBankProminentHueFamily[] {
  const mapped = hexes
    .map(hexToProminentHueFamily)
    .filter((hue): hue is ImageBankProminentHueFamily => hue != null && hue !== 'achromatic')
  return dedupeHues(mapped)
}

export { hexToProminentHueFamily } from './prominentHueFamilies.js'

/**
 * Kit-side hue alignment signals for the deterministic matcher.
 * Logo/hex colors suggest preferred hues only when `photoColorRelationship` is `echo-brand-colors`.
 * Explicit avoid cues in `visualNotes` always apply.
 */
export function inferKitHueSignals(
  form: IdentityKitForm,
  photoColorRelationship: PhotoColorRelationship,
): KitHueSignals {
  const fromNotes = parseHueSignalsFromVisualNotes(form.step6.visualNotes ?? '')

  const preferredFromHex =
    photoColorRelationship === 'echo-brand-colors'
      ? prominentHueFamiliesFromHexes(collectBrandHexColors(form))
      : []

  const preferredHueFamilies = dedupeHues([
    ...fromNotes.preferredHueFamilies,
    ...preferredFromHex,
  ])

  const avoidHueFamilies = dedupeHues(
    fromNotes.avoidHueFamilies.filter((hue) => !preferredHueFamilies.includes(hue)),
  )

  return { preferredHueFamilies, avoidHueFamilies }
}
