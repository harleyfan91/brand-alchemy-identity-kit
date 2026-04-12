/**
 * Curated font recipes for Core kits (Phase 2 data layer).
 *
 * Matching is deterministic: among eligible recipes, highest score wins;
 * ties break by lowest index in FONT_RECIPES (earlier = higher priority).
 *
 * Not wired into PDF or coreAssembly yet.
 */

import type { IdentityKitForm } from '@identity-kit/shared'

import { computeBrandProfile, type TouchpointCluster } from './brandProfile.js'

// ---------------------------------------------------------------------------
// Font shortlist
// ---------------------------------------------------------------------------

export type FontClassification = 'serif' | 'sans-serif' | 'display-serif' | 'display-sans'

export type FontRole = 'display' | 'body' | 'both'

export type FontEntry = {
  id: string
  /** Exact Google Fonts family name for API / future embed */
  family: string
  classification: FontClassification
  roles: FontRole[]
  variable: boolean
  personalityTags: string[]
  notes: string
}

export const FONT_SHORTLIST: FontEntry[] = [
  {
    id: 'playfair_display',
    family: 'Playfair Display',
    classification: 'display-serif',
    roles: ['display'],
    variable: false,
    personalityTags: ['editorial', 'refined', 'trustworthy', 'classic'],
    notes: 'Strong display serif for headlines; broad pairing range at large sizes.',
  },
  {
    id: 'fraunces',
    family: 'Fraunces',
    classification: 'display-serif',
    roles: ['display'],
    variable: true,
    personalityTags: ['expressive', 'craft', 'bold', 'personality-forward'],
    notes: 'Variable optical axis; expressive display for creative or organic directions.',
  },
  {
    id: 'dm_serif_display',
    family: 'DM Serif Display',
    classification: 'display-serif',
    roles: ['display'],
    variable: false,
    personalityTags: ['modern', 'editorial', 'clean'],
    notes: 'Contemporary display serif; pairs cleanly with humanist sans body.',
  },
  {
    id: 'cormorant_garamond',
    family: 'Cormorant Garamond',
    classification: 'display-serif',
    roles: ['display'],
    variable: false,
    personalityTags: ['refined', 'luxury', 'quiet', 'elegant'],
    notes: 'High-formality display; avoid pairing with very energetic positioning.',
  },
  {
    id: 'syne',
    family: 'Syne',
    classification: 'display-sans',
    roles: ['display'],
    variable: false,
    personalityTags: ['contemporary', 'design-forward', 'bold', 'creative'],
    notes: 'Distinctive display sans for bold / high-energy brand voice.',
  },
  {
    id: 'outfit',
    family: 'Outfit',
    classification: 'display-sans',
    roles: ['both'],
    variable: false,
    personalityTags: ['clean', 'modern', 'friendly', 'geometric'],
    notes: 'Geometric sans; can read as display or restrained UI when role-split.',
  },
  {
    id: 'inter',
    family: 'Inter',
    classification: 'sans-serif',
    roles: ['both'],
    variable: true,
    personalityTags: ['neutral', 'modern', 'ui-native'],
    notes: 'Default UI/body sans in current PDF stack.',
  },
  {
    id: 'dm_sans',
    family: 'DM Sans',
    classification: 'sans-serif',
    roles: ['body'],
    variable: true,
    personalityTags: ['friendly', 'approachable', 'clean'],
    notes: 'Humanist sans body; warms editorial display pairings.',
  },
  {
    id: 'manrope',
    family: 'Manrope',
    classification: 'sans-serif',
    roles: ['body'],
    variable: true,
    personalityTags: ['clean', 'geometric', 'contemporary'],
    notes: 'Geometric sans body; slightly more character than Inter.',
  },
  {
    id: 'lato',
    family: 'Lato',
    classification: 'sans-serif',
    roles: ['body'],
    variable: false,
    personalityTags: ['trustworthy', 'professional', 'conservative'],
    notes: 'Conservative body sans for established or formal tone.',
  },
  {
    id: 'open_sans',
    family: 'Open Sans',
    classification: 'sans-serif',
    roles: ['body'],
    variable: true,
    personalityTags: ['neutral', 'legible', 'approachable'],
    notes: 'High-glyph-coverage body; approachable and reliable.',
  },
  {
    id: 'roboto',
    family: 'Roboto',
    classification: 'sans-serif',
    roles: ['body'],
    variable: true,
    personalityTags: ['clean', 'functional', 'utility'],
    notes: 'Screen-native body for utility / service-forward kits.',
  },
  {
    id: 'source_serif_4',
    family: 'Source Serif 4',
    classification: 'serif',
    roles: ['body'],
    variable: true,
    personalityTags: ['readable', 'editorial', 'grounded'],
    notes: 'Long-form body serif; current specimen stand-in.',
  },
]

const fontById = new Map(FONT_SHORTLIST.map((f) => [f.id, f]))

export function getFontEntryById(id: string): FontEntry | undefined {
  return fontById.get(id)
}

/** Google family names (lowercase) for substring detection in free-text intake. */
const FAMILY_ALIASES: Record<string, string[]> = {
  'playfair display': ['playfair display'],
  fraunces: ['fraunces'],
  'dm serif display': ['dm serif display'],
  'cormorant garamond': ['cormorant garamond', 'cormorant'],
  syne: ['syne'],
  outfit: ['outfit'],
  inter: ['inter'],
  'dm sans': ['dm sans'],
  manrope: ['manrope'],
  lato: ['lato'],
  'open sans': ['open sans'],
  roboto: ['roboto'],
  'source serif 4': ['source serif 4', 'source serif'],
}

// ---------------------------------------------------------------------------
// Pairing model
// ---------------------------------------------------------------------------

export type PairingPattern = 'contrast' | 'system'

export type TypographyArchetype = 'pairing' | 'single_family_hierarchy'

export type TypographyPair = {
  primaryFont: string
  secondaryFont: string
  pattern: PairingPattern
  primaryRole: string
  secondaryRole: string
}

export type StageTier = 'any' | 'early' | 'established'

export type ClusterFilter = 'any' | 'screen_heavy' | 'not_screen_heavy'

export type TypographyRecipe = {
  id: string
  /** If set, selectedStyle must be one of these (after normalizing unknown → excluded from match). */
  styleMatch?: string[]
  /** If set, tonePreset must be non-empty and in this list. */
  toneMatch?: Array<'friendly' | 'professional' | 'bold'>
  stageTier: StageTier
  clusterFilter?: ClusterFilter
  /** If set, touchpoint cluster must be one of these. */
  clusterIds?: TouchpointCluster[]
  pattern: PairingPattern
  pair: TypographyPair
  /** UX label for PDF/wizard when wired. */
  archetypeLabel: TypographyArchetype
  rationale: string
}

/**
 * Screen-first clusters used for “system sans” and utility-style recipes.
 * Adjust here if product redefines digital vs blended touchpoints.
 */
export function isScreenHeavyCluster(cluster: TouchpointCluster): boolean {
  return cluster === 'digital_brand' || cluster === 'social_service'
}

const KNOWN_STYLES = new Set(['clean_minimal', 'bold_graphic', 'organic_natural', 'luxe_refined'])

function normalizedStyle(form: IdentityKitForm): string {
  const s = form.step6.selectedStyle?.trim()
  if (!s) return 'clean_minimal'
  return s
}

function isEarlyStage(stage: string): boolean {
  return stage === 'idea' || stage === 'new' || stage === 'growing'
}

function isEstablishedStage(stage: string): boolean {
  return stage === 'established'
}

function recipeEligible(recipe: TypographyRecipe, form: IdentityKitForm, cluster: TouchpointCluster): boolean {
  const style = normalizedStyle(form)
  if (recipe.styleMatch?.length) {
    if (!KNOWN_STYLES.has(style) || !recipe.styleMatch.includes(style)) return false
  }

  const stage = form.step1.stage
  if (recipe.stageTier === 'early' && !isEarlyStage(stage)) return false
  if (recipe.stageTier === 'established' && !isEstablishedStage(stage)) return false

  const screenHeavy = isScreenHeavyCluster(cluster)
  if (recipe.clusterFilter === 'screen_heavy' && !screenHeavy) return false
  if (recipe.clusterFilter === 'not_screen_heavy' && screenHeavy) return false

  if (recipe.clusterIds?.length && !recipe.clusterIds.includes(cluster)) return false

  const tone = form.step3.tonePreset
  if (recipe.toneMatch?.length) {
    if (tone !== 'friendly' && tone !== 'professional' && tone !== 'bold') return false
    if (!recipe.toneMatch.includes(tone)) return false
  }

  return true
}

function recipeScore(recipe: TypographyRecipe, form: IdentityKitForm, cluster: TouchpointCluster): number {
  let score = 0
  const style = normalizedStyle(form)
  if (recipe.styleMatch?.length && KNOWN_STYLES.has(style) && recipe.styleMatch.includes(style)) {
    score += 4
  }
  const tone = form.step3.tonePreset
  if (recipe.toneMatch?.length && (tone === 'friendly' || tone === 'professional' || tone === 'bold')) {
    if (recipe.toneMatch.includes(tone)) score += 2
  }
  const screenHeavy = isScreenHeavyCluster(cluster)
  if (recipe.clusterFilter === 'screen_heavy' && screenHeavy) score += 2
  if (recipe.clusterFilter === 'not_screen_heavy' && !screenHeavy) score += 2
  if (recipe.clusterIds?.length && recipe.clusterIds.includes(cluster)) score += 3
  const stage = form.step1.stage
  if (recipe.stageTier === 'established' && isEstablishedStage(stage)) score += 2
  if (recipe.stageTier === 'early' && isEarlyStage(stage)) score += 2
  return score
}

const FALLBACK_RECIPE: TypographyRecipe = {
  id: 'recipe_fallback_default',
  stageTier: 'any',
  pattern: 'contrast',
  archetypeLabel: 'pairing',
  pair: {
    primaryFont: 'playfair_display',
    secondaryFont: 'open_sans',
    pattern: 'contrast',
    primaryRole: 'Headlines & display',
    secondaryRole: 'Body & supporting text',
  },
  rationale: 'Default editorial display + neutral body when no higher-specificity recipe matches.',
}

/**
 * Ordered recipes: earlier entries win ties at equal score (deterministic).
 */
export const FONT_RECIPES: TypographyRecipe[] = [
  {
    id: 'clean_minimal_screen_system',
    styleMatch: ['clean_minimal'],
    stageTier: 'any',
    clusterFilter: 'screen_heavy',
    pattern: 'system',
    archetypeLabel: 'single_family_hierarchy',
    pair: {
      primaryFont: 'outfit',
      secondaryFont: 'outfit',
      pattern: 'system',
      primaryRole: 'Primary text & headlines',
      secondaryRole: 'Secondary text & UI (same family, different weights)',
    },
    rationale: 'Single geometric sans hierarchy for screen-first minimal brands.',
  },
  {
    id: 'bold_graphic_bold_syne',
    styleMatch: ['bold_graphic'],
    toneMatch: ['bold'],
    stageTier: 'any',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'syne',
      secondaryFont: 'manrope',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Design-forward display sans + geometric body for bold voice and graphic style.',
  },
  {
    id: 'luxe_refined_established_editorial',
    styleMatch: ['luxe_refined'],
    stageTier: 'established',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'playfair_display',
      secondaryFont: 'source_serif_4',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & long-form',
    },
    rationale: 'Established luxe: high-contrast display + grounded body serif.',
  },
  {
    id: 'luxe_refined_early_editorial',
    styleMatch: ['luxe_refined'],
    stageTier: 'early',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'dm_serif_display',
      secondaryFont: 'manrope',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Early-stage luxe: contemporary display serif + clean geometric sans.',
  },
  {
    id: 'luxe_formal_cormorant',
    styleMatch: ['luxe_refined'],
    toneMatch: ['professional'],
    stageTier: 'established',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'cormorant_garamond',
      secondaryFont: 'lato',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'High-formality luxe + conservative body for premium professional positioning.',
  },
  {
    id: 'utility_professional_social_service',
    /** Narrow: professional digital-service “utility” kit; avoids overriding bold_graphic / luxe recipes. */
    styleMatch: ['clean_minimal'],
    toneMatch: ['professional'],
    stageTier: 'any',
    clusterIds: ['social_service'],
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'outfit',
      secondaryFont: 'roboto',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & UI',
    },
    rationale: 'Utility-forward pairing for professional digital-service clusters.',
  },
  {
    id: 'professional_trust_pairing',
    toneMatch: ['professional'],
    styleMatch: ['clean_minimal', 'luxe_refined', 'organic_natural'],
    stageTier: 'any',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'playfair_display',
      secondaryFont: 'lato',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Trustworthy editorial display + conservative sans body.',
  },
  {
    id: 'friendly_approachable_pairing',
    toneMatch: ['friendly'],
    /** Omit organic_natural so it can resolve to organic_natural_pairing without tie. */
    styleMatch: ['clean_minimal', 'luxe_refined'],
    stageTier: 'any',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'dm_serif_display',
      secondaryFont: 'open_sans',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Warm display serif + approachable humanist body.',
  },
  {
    id: 'clean_minimal_mixed_outfit_open_sans',
    styleMatch: ['clean_minimal'],
    stageTier: 'any',
    clusterFilter: 'not_screen_heavy',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'outfit',
      secondaryFont: 'open_sans',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Minimal style with blended touchpoints: geometric display + neutral UI sans.',
  },
  {
    id: 'bold_graphic_expressive',
    styleMatch: ['bold_graphic'],
    stageTier: 'any',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'fraunces',
      secondaryFont: 'dm_sans',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Expressive variable serif + warm sans body for bold graphic systems.',
  },
  {
    id: 'organic_natural_pairing',
    styleMatch: ['organic_natural'],
    stageTier: 'any',
    clusterFilter: 'any',
    pattern: 'contrast',
    archetypeLabel: 'pairing',
    pair: {
      primaryFont: 'fraunces',
      secondaryFont: 'open_sans',
      pattern: 'contrast',
      primaryRole: 'Headlines & display',
      secondaryRole: 'Body & supporting text',
    },
    rationale: 'Craft-forward display serif + approachable body for organic natural style.',
  },
]

export function getRecipeForProfile(form: IdentityKitForm): TypographyRecipe {
  const { touchpointCluster } = computeBrandProfile(form)
  const style = normalizedStyle(form)
  if (!KNOWN_STYLES.has(style)) {
    return FALLBACK_RECIPE
  }

  let best: TypographyRecipe | null = null
  let bestScore = -1
  let bestIndex = Infinity

  FONT_RECIPES.forEach((recipe, index) => {
    if (!recipeEligible(recipe, form, touchpointCluster)) return
    const score = recipeScore(recipe, form, touchpointCluster)
    if (score > bestScore || (score === bestScore && index < bestIndex)) {
      bestScore = score
      bestIndex = index
      best = recipe
    }
  })

  return best ?? FALLBACK_RECIPE
}

export type ResolvedTypographyPair = {
  primaryFont: FontEntry
  secondaryFont: FontEntry
  pattern: PairingPattern
  primaryRole: string
  secondaryRole: string
  archetypeLabel: TypographyArchetype
}

export function resolveTypographyPair(recipe: TypographyRecipe): ResolvedTypographyPair {
  const a = getFontEntryById(recipe.pair.primaryFont)
  const b = getFontEntryById(recipe.pair.secondaryFont)
  if (!a || !b) {
    throw new Error(`Typography recipe "${recipe.id}" references unknown font id`)
  }
  return {
    primaryFont: a,
    secondaryFont: b,
    pattern: recipe.pair.pattern,
    primaryRole: recipe.pair.primaryRole,
    secondaryRole: recipe.pair.secondaryRole,
    archetypeLabel: recipe.archetypeLabel,
  }
}

function normalizeExisting(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** True if free-text intake appears to reference a variable font on the shortlist (heuristic). */
export function matchesVariableShortlistFamily(existingTypeface: string): boolean {
  const t = normalizeExisting(existingTypeface)
  if (!t) return false
  return FONT_SHORTLIST.some((f) => f.variable && t.includes(f.family.toLowerCase()))
}

/**
 * Whether a single-family hierarchy is a good default for this profile (for future wiring).
 * True when clean_minimal + screen-heavy cluster, or existing typeface mentions a variable shortlist family.
 */
export function shouldPreferSystemPairing(form: IdentityKitForm): boolean {
  const { touchpointCluster } = computeBrandProfile(form)
  const style = normalizedStyle(form)
  if (style === 'clean_minimal' && isScreenHeavyCluster(touchpointCluster)) return true
  const existing = form.step6.existingTypeface
  if (existing && matchesVariableShortlistFamily(existing)) return true
  return false
}

function findShortlistMatch(normalized: string): FontEntry | undefined {
  for (const font of FONT_SHORTLIST) {
    const fam = font.family.toLowerCase()
    if (normalized.includes(fam)) return font
    const aliases = FAMILY_ALIASES[fam] ?? []
    for (const a of aliases) {
      if (normalized.includes(a)) return font
    }
  }
  return undefined
}

function complementHint(matched: FontEntry): string {
  const canDisplay = matched.roles.includes('display') || matched.roles.includes('both')
  const canBody = matched.roles.includes('body') || matched.roles.includes('both')
  if (canBody && !canDisplay) {
    return 'Consider a contrasting display font (e.g. Playfair Display, Fraunces, or Syne) for headlines while keeping this face for body and UI.'
  }
  if (canDisplay && !canBody) {
    return 'Consider a neutral sans body (e.g. Open Sans, DM Sans, or Manrope) for long text and interfaces.'
  }
  return 'Use weight and size hierarchy within this family for primary vs secondary text, or add a second family for clearer role split.'
}

const GENERIC_EXISTING_GUIDANCE =
  'We could not match your note to the curated shortlist. Treat your existing font as the anchor for whichever role it already plays (headlines vs body), then choose a second, contrasting family from the kit recipe for the other role so the system stays to two voices.'

/**
 * Short guidance string for PDF/wizard when the customer lists fonts they already use.
 * Matching is best-effort substring against shortlist family names and aliases.
 */
export function getExistingTypefaceGuidance(existingTypeface: string): string {
  const normalized = normalizeExisting(existingTypeface)
  if (!normalized) {
    return GENERIC_EXISTING_GUIDANCE
  }
  const matched = findShortlistMatch(normalized)
  if (!matched) {
    return GENERIC_EXISTING_GUIDANCE
  }
  const roles = matched.roles.join(', ')
  const variableNote = matched.variable
    ? ' This is a variable family—weight axes can cover both hierarchy and a second “voice” if you stay within one family.'
    : ''
  return `Your note appears to reference “${matched.family}” (${matched.classification}; roles: ${roles}).${variableNote} ${complementHint(matched)}`
}
