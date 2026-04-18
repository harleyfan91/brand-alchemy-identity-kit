import {
  canonicalPaletteId,
  getTouchpointLabel,
  normalizeTouchpoints,
  type GuideFocus,
  type IdentityKitForm,
  type PrimaryGoal,
  type VoiceSliders,
} from '@identity-kit/shared'

import {
  brandBriefBlocks,
  paletteColorRolesParagraph,
  styleGuideBlocks,
  typographySectionLead,
  typographySpecimenSlots,
  type TypographySpecimenSlot,
  voicePlaybookBlocks,
  VOICE_PLAYBOOK_CTA_BODY_SPLIT,
} from './coreAssembly.js'

type Block = { heading: string; body: string }
type PaletteRow = { hex: string; role: string; flex?: number }

export type GuideTemplateId = 'heroRail' | 'referenceGrid' | 'showcase' | 'visualBoard'
export type GuideEditorialLayoutId =
  | 'heroQuoteRail'
  | 'proseQuoteRail'
  | 'traitsSamples'
  | 'sampleShowcase'
  | 'visualSystemBoard'
export type GuideDekMode = 'full' | 'none'
export type GuideVisualOccupancy = 'light' | 'medium' | 'strong'
export type GuideExampleDensity = 'low' | 'medium' | 'high'

export interface GuideEditorialMeta {
  folio: string
  navLabel: string
  title: string
  deck?: string
  layout: GuideEditorialLayoutId
  dekMode: GuideDekMode
  visualOccupancy: GuideVisualOccupancy
  exampleDensity: GuideExampleDensity
  /**
   * Label for a generic editorial figure / system block.
   * This is intentionally non-logo-specific so sparse pages can
   * create visual occupancy without implying unavailable assets.
   */
  figureLabel?: string
}

export interface BrandIdentityGuideSignals {
  guideFocus: Exclude<GuideFocus, ''>
  primaryGoal: Exclude<PrimaryGoal, ''>
  primaryTouchpoint: string
  emphasis: 'voice' | 'visual' | 'handoff' | 'action'
  /** Normalized touchpoint ids (for density / channel breadth). */
  touchpointCount: number
  /**
   * Combined stage + touchpoint breadth: trims or enriches list caps and before/after pairs
   * (sparse early-stage / single-channel vs. richer multi-channel / established).
   */
  contentDensityBias: -1 | 0 | 1
}

export interface BrandIdentityGuideModel {
  signals: BrandIdentityGuideSignals
  summary: {
    template: 'heroRail'
    editorial: GuideEditorialMeta
    anchor: string
    whatWeDo: string
    whoItsFor: string
    transformation: string
    guidingTraits: string[]
    differentiator?: string
    focusLead: string
  }
  positioning: {
    template: 'heroRail',
    editorial: GuideEditorialMeta
    layoutVariant: 'storyHeavy' | 'supportHeavy'
    title: string
    focusLead: string
    storyNote?: string
    /**
     * When the brand story is omitted (too thin), page 02 still carries rollout context:
     * audience / shift lines from the brief plus a first-touchpoint line (see refactor plan).
     */
    applicationSnapshotRows?: Array<{ label: string; value: string }>
    trustNote?: string
    collaboratorNote?: string
  }
  voice: {
    template: 'referenceGrid'
    editorial: GuideEditorialMeta
    traits: string[]
    rules: string[]
    messagingAngles: string[]
    ctaPatterns: string[]
  }
  examples: {
    template: 'showcase'
    editorial: GuideEditorialMeta
    samplePhrases: string[]
    doLines: string[]
    avoidLines: string[]
    beforeAfter: Array<{ label: string; before: string; after: string }>
  }
  visual: {
    template: 'visualBoard'
    editorial: GuideEditorialMeta
    paletteId: string
    paletteRows: PaletteRow[]
    paletteRolesProse: string
    paletteMood: string
    visualSummary: string
    visualKeywords: string[]
    typography: {
      lead: string
      specimens: TypographySpecimenSlot[]
    }
    imageryDirection: string
    applicationLead: string
    applicationBullets: string[]
  }
}

const styleKeywordMap: Record<string, string[]> = {
  clean_minimal: ['clean', 'spacious', 'clear'],
  bold_graphic: ['bold', 'high-contrast', 'decisive'],
  organic_natural: ['warm', 'organic', 'handmade'],
  luxe_refined: ['refined', 'quiet', 'premium'],
}

const guidePaletteRows: Record<string, PaletteRow[]> = {
  midnight_luxe: [
    { role: 'Primary', hex: '#0B0B0F', flex: 4 },
    { role: 'Supporting', hex: '#222333', flex: 3 },
    { role: 'Accent', hex: '#7A6A4F', flex: 2 },
    { role: 'Canvas', hex: '#D4C4A8', flex: 5 },
  ],
  earthy_warmth: [
    { role: 'Accent', hex: '#5A3E36', flex: 2 },
    { role: 'Supporting', hex: '#A77C5D', flex: 3 },
    { role: 'Canvas', hex: '#E5C7A2', flex: 4 },
    { role: 'Primary', hex: '#F8EEDF', flex: 5 },
  ],
  ocean_calm: [
    { role: 'Primary', hex: '#0D3B66', flex: 4 },
    { role: 'Supporting', hex: '#2F6690', flex: 3 },
    { role: 'Accent', hex: '#3A7CA5', flex: 2 },
    { role: 'Canvas', hex: '#D9EDFF', flex: 5 },
  ],
  sunset_bold: [
    { role: 'Primary', hex: '#2D1E2F', flex: 4 },
    { role: 'Accent', hex: '#C8553D', flex: 3 },
    { role: 'Supporting', hex: '#F28F3B', flex: 2 },
    { role: 'Canvas', hex: '#F7D488', flex: 5 },
  ],
  sorbet_sunset: [
    { role: 'Primary', hex: '#3F0A1F', flex: 4 },
    { role: 'Accent', hex: '#DB2777', flex: 3 },
    { role: 'Supporting', hex: '#FB923C', flex: 2 },
    { role: 'Canvas', hex: '#FFF7ED', flex: 5 },
  ],
  forest_deep: [
    { role: 'Primary', hex: '#1B4332', flex: 4 },
    { role: 'Supporting', hex: '#2D6A4F', flex: 3 },
    { role: 'Accent', hex: '#40916C', flex: 2 },
    { role: 'Canvas', hex: '#D8F3DC', flex: 5 },
  ],
  minimal_light: [
    { role: 'Primary', hex: '#111111', flex: 4 },
    { role: 'Supporting', hex: '#666666', flex: 3 },
    { role: 'Accent', hex: '#CFCFCF', flex: 2 },
    { role: 'Canvas', hex: '#F7F7F7', flex: 5 },
  ],
  arctic_blue: [
    { role: 'Primary', hex: '#1A2F4D', flex: 4 },
    { role: 'Supporting', hex: '#3B6FB8', flex: 3 },
    { role: 'Accent', hex: '#89B4E8', flex: 2 },
    { role: 'Canvas', hex: '#F0F7FF', flex: 5 },
  ],
  ink_navy: [
    { role: 'Primary', hex: '#050A12', flex: 4 },
    { role: 'Supporting', hex: '#142233', flex: 3 },
    { role: 'Accent', hex: '#2A4A6E', flex: 2 },
    { role: 'Canvas', hex: '#D4DEE8', flex: 5 },
  ],
  paper_stone: [
    { role: 'Primary', hex: '#3A3634', flex: 4 },
    { role: 'Supporting', hex: '#6F6965', flex: 3 },
    { role: 'Accent', hex: '#C9C2BA', flex: 2 },
    { role: 'Canvas', hex: '#F6F3EE', flex: 5 },
  ],
  terracotta_clay: [
    { role: 'Primary', hex: '#5C2E24', flex: 4 },
    { role: 'Supporting', hex: '#9C5130', flex: 3 },
    { role: 'Accent', hex: '#D4996C', flex: 2 },
    { role: 'Canvas', hex: '#FDF5ED', flex: 5 },
  ],
  sand_dune: [
    { role: 'Primary', hex: '#4F4639', flex: 4 },
    { role: 'Supporting', hex: '#8F8170', flex: 3 },
    { role: 'Accent', hex: '#D8CAB8', flex: 2 },
    { role: 'Canvas', hex: '#FFFBF5', flex: 5 },
  ],
  moss_meadow: [
    { role: 'Primary', hex: '#1E3328', flex: 4 },
    { role: 'Supporting', hex: '#3D6B4F', flex: 3 },
    { role: 'Accent', hex: '#6FA67A', flex: 2 },
    { role: 'Canvas', hex: '#E8F5E9', flex: 5 },
  ],
  mint_fresh: [
    { role: 'Primary', hex: '#0F3430', flex: 4 },
    { role: 'Supporting', hex: '#115E59', flex: 3 },
    { role: 'Accent', hex: '#2DD4BF', flex: 2 },
    { role: 'Canvas', hex: '#ECFEFF', flex: 5 },
  ],
  citrus_pop: [
    { role: 'Primary', hex: '#3F1610', flex: 4 },
    { role: 'Supporting', hex: '#C2410C', flex: 3 },
    { role: 'Accent', hex: '#FBBF24', flex: 2 },
    { role: 'Canvas', hex: '#FFFBEB', flex: 5 },
  ],
  coastal_teal: [
    { role: 'Primary', hex: '#083344', flex: 4 },
    { role: 'Supporting', hex: '#0E7490', flex: 3 },
    { role: 'Accent', hex: '#22D3EE', flex: 2 },
    { role: 'Canvas', hex: '#ECFEFF', flex: 5 },
  ],
  sea_glass: [
    { role: 'Primary', hex: '#064E3B', flex: 4 },
    { role: 'Supporting', hex: '#047857', flex: 3 },
    { role: 'Accent', hex: '#34D399', flex: 2 },
    { role: 'Canvas', hex: '#D1FAE5', flex: 5 },
  ],
  lagoon_deep: [
    { role: 'Primary', hex: '#06343B', flex: 4 },
    { role: 'Supporting', hex: '#0F766E', flex: 3 },
    { role: 'Accent', hex: '#14B8A6', flex: 2 },
    { role: 'Canvas', hex: '#F0FDFA', flex: 5 },
  ],
  amber_glow: [
    { role: 'Primary', hex: '#713F12', flex: 4 },
    { role: 'Supporting', hex: '#B45309', flex: 3 },
    { role: 'Accent', hex: '#FBBF24', flex: 2 },
    { role: 'Canvas', hex: '#FFFBEB', flex: 5 },
  ],
  copper_spark: [
    { role: 'Primary', hex: '#431407', flex: 4 },
    { role: 'Supporting', hex: '#9A3412', flex: 3 },
    { role: 'Accent', hex: '#EA580C', flex: 2 },
    { role: 'Canvas', hex: '#FFEDD5', flex: 5 },
  ],
  honey_comb: [
    { role: 'Primary', hex: '#422006', flex: 4 },
    { role: 'Supporting', hex: '#A16207', flex: 3 },
    { role: 'Accent', hex: '#EAB308', flex: 2 },
    { role: 'Canvas', hex: '#FEFCE8', flex: 5 },
  ],
  rose_dusk: [
    { role: 'Primary', hex: '#2D0410', flex: 4 },
    { role: 'Supporting', hex: '#831843', flex: 3 },
    { role: 'Accent', hex: '#FB7185', flex: 2 },
    { role: 'Canvas', hex: '#FFF1F2', flex: 5 },
  ],
  bubblegum_pulse: [
    { role: 'Primary', hex: '#881337', flex: 4 },
    { role: 'Supporting', hex: '#E11D48', flex: 3 },
    { role: 'Accent', hex: '#FDA4AF', flex: 2 },
    { role: 'Canvas', hex: '#FFF1F2', flex: 5 },
  ],
  carnation_soft: [
    { role: 'Primary', hex: '#3F2D32', flex: 4 },
    { role: 'Supporting', hex: '#7C3A5F', flex: 3 },
    { role: 'Accent', hex: '#E8B4C2', flex: 2 },
    { role: 'Canvas', hex: '#FFF5F7', flex: 5 },
  ],
  violet_haze: [
    { role: 'Primary', hex: '#2E1065', flex: 4 },
    { role: 'Supporting', hex: '#6D28D9', flex: 3 },
    { role: 'Accent', hex: '#A78BFA', flex: 2 },
    { role: 'Canvas', hex: '#EDE9FE', flex: 5 },
  ],
  electric_orchid: [
    { role: 'Primary', hex: '#4C1D95', flex: 4 },
    { role: 'Supporting', hex: '#9333EA', flex: 3 },
    { role: 'Accent', hex: '#E879F9', flex: 2 },
    { role: 'Canvas', hex: '#FAF5FF', flex: 5 },
  ],
  plum_violet: [
    { role: 'Primary', hex: '#2F0F28', flex: 4 },
    { role: 'Supporting', hex: '#701A75', flex: 3 },
    { role: 'Accent', hex: '#A21CAF', flex: 2 },
    { role: 'Canvas', hex: '#FDF4FF', flex: 5 },
  ],
}

const focusMeta: Record<
  Exclude<GuideFocus, ''>,
  { emphasis: BrandIdentityGuideSignals['emphasis']; lead: string; collaborator?: string }
> = {
  look_more_professional: {
    emphasis: 'visual',
    lead: 'Make the brand feel clearer and more intentional wherever people first encounter it.',
    collaborator: 'Share the summary and visual pages first if someone else is helping apply the brand.',
  },
  sound_more_consistent: {
    emphasis: 'voice',
    lead: 'Keep the brand sounding recognizably like the same business everywhere it shows up.',
    collaborator: 'Share the summary, voice, and example pages together if someone else is helping with copy.',
  },
  give_clear_direction: {
    emphasis: 'handoff',
    lead: 'Use this as a short handoff so someone else can make faster on-brand decisions.',
    collaborator: 'This should work as a quick handoff: summary first, then visual direction, then example copy.',
  },
  know_what_to_fix_first: {
    emphasis: 'action',
    lead: 'Focus on the first few updates that will make the brand feel more cohesive.',
    collaborator: 'If someone else is implementing changes, start with the application and quick-start pages.',
  },
}

function blockByHeading(blocks: Block[], heading: string): string {
  return blocks.find((block) => block.heading === heading)?.body.trim() ?? ''
}

function toSentenceList(body: string): string[] {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function extractWhatWeDo(body: string): string {
  const match = body.match(/^[^:]+:\s*(.+?)\s+\([^()]+,\s*[^()]+\)\.?$/)
  return match?.[1]?.trim() ?? body.trim()
}

function extractAudience(body: string): string {
  const beforePain = body.split('Pain points:')[0] ?? body
  const beforeOutcomes = beforePain.split('Desired outcomes:')[0] ?? beforePain
  return beforeOutcomes.replace(/\.$/, '').trim()
}

function firstParagraphs(body: string, count: number): string {
  return body
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, count)
    .join(' ')
}

function firstSentences(body: string, count: number): string {
  return toSentenceList(body)
    .slice(0, count)
    .join(' ')
    .trim()
}

function extractDifferentiator(body: string, explicit?: string): string | undefined {
  const fromIntake = explicit?.trim()
  if (fromIntake) return fromIntake

  if (!body.trim()) return undefined
  const genericPatterns = [/Use this Brief to name yours/i, /often comes from relationships/i]
  if (genericPatterns.some((pattern) => pattern.test(body))) return undefined

  if (body.startsWith('Compared with ')) {
    const afterCompared = body.slice('Compared with '.length)
    const dotIdx = afterCompared.indexOf('.')
    const statement = dotIdx >= 0 ? afterCompared.slice(dotIdx + 1).trim() : afterCompared.trim()
    return statement || undefined
  }

  return body.replace(/\.$/, '').trim() || undefined
}

function extractStoryNote(body: string): string | undefined {
  const sentences = toSentenceList(body).filter((sentence) => !/not specified/i.test(sentence))
  if (sentences.length < 2) return undefined
  const story = sentences.slice(1).join(' ').trim()
  return story || undefined
}

function parseDoAvoidSections(body: string): { dos: string[]; avoids: string[] } {
  const dos: string[] = []
  const avoids: string[] = []
  let mode: 'do' | 'avoid' | null = null

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('✓ ')) {
      mode = 'do'
      dos.push(line.slice(2).trim())
      continue
    }
    if (line.startsWith('✗ ')) {
      mode = 'avoid'
      avoids.push(line.slice(2).trim())
      continue
    }
    if (line.startsWith('Do ')) {
      mode = 'do'
      dos.push(line.slice(3).trim())
      continue
    }
    if (line.startsWith('Avoid ')) {
      mode = 'avoid'
      avoids.push(line.slice(6).trim())
      continue
    }
    if (line.startsWith("Don't ")) {
      mode = 'avoid'
      avoids.push(line)
      continue
    }
    if (mode === 'do') dos.push(line)
    if (mode === 'avoid') avoids.push(line)
  }

  return { dos, avoids }
}

function extractQuotedLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('"') && line.endsWith('"'))
    .slice(0, maxCount)
}

function extractNumberedLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d{2}\s+/.test(line))
    .map((line) => line.replace(/^\d{2}\s+/, '').trim())
    .slice(0, maxCount)
}

function extractBulletLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('• '))
    .map((line) => line.slice(2).trim())
    .slice(0, maxCount)
}

function parseBeforeAfter(body: string): Array<{ label: string; before: string; after: string }> {
  const paragraphs = body.split('\n\n')
  const result: Array<{ label: string; before: string; after: string }> = []
  let i = 0
  while (i < paragraphs.length) {
    const block = paragraphs[i] ?? ''
    const lines = block.split('\n')
    if (lines.length >= 3) {
      result.push({
        label: lines[0] ?? '',
        before: (lines[1] ?? '').replace(/^Before:\s*"?/, '').replace(/"$/, ''),
        after: (lines[2] ?? '').replace(/^After:\s*"?/, '').replace(/"$/, ''),
      })
    } else if (lines.length === 1 && lines[0]) {
      const nextBlock = paragraphs[i + 1] ?? ''
      const nextLines = nextBlock.split('\n')
      if (nextLines.length >= 2) {
        result.push({
          label: lines[0],
          before: (nextLines[0] ?? '').replace(/^Before:\s*"?/, '').replace(/"$/, ''),
          after: (nextLines[1] ?? '').replace(/^After:\s*"?/, '').replace(/"$/, ''),
        })
        i += 1
      }
    }
    i += 1
  }
  return result.filter((pair) => pair.before && pair.after)
}

const MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS = 12
const MIN_STORY_WORDS_FOR_SURFACE = 6
const MIN_GUIDE_SURFACE_LINE_CHARS = 12

function isMeaningfulGuideSurfaceLine(text: string): boolean {
  const t = text.trim()
  if (t.length < MIN_GUIDE_SURFACE_LINE_CHARS) return false
  if (/not specified|not yet provided|\bn\/a\b|\btbd\b/i.test(t)) return false
  return true
}

/**
 * Page 02 application framing when the founder story is omitted: reuse brief surfaces
 * so the spread stays handoff-ready without inventing narrative (refactor plan).
 */
export function applicationSnapshotRowsForPositioning(
  summary: { whatWeDo: string; whoItsFor: string; transformation: string },
  primaryTouchpoint: string,
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = []
  const who = summary.whoItsFor.trim()
  const shift = summary.transformation.trim()
  const what = summary.whatWeDo.trim()

  if (isMeaningfulGuideSurfaceLine(who)) {
    rows.push({ label: "Who it's for", value: who })
  } else if (isMeaningfulGuideSurfaceLine(what)) {
    rows.push({ label: 'What we do', value: what })
  }

  if (isMeaningfulGuideSurfaceLine(shift)) {
    rows.push({ label: 'Core shift', value: shift })
  } else if (
    rows.length < 2 &&
    isMeaningfulGuideSurfaceLine(what) &&
    !rows.some((r) => r.label === 'What we do')
  ) {
    rows.push({ label: 'What we do', value: what })
  }

  rows.push({
    label: 'First surface',
    value: `Treat ${primaryTouchpoint} as the first place this positioning should read clearly, then mirror the same story elsewhere.`,
  })

  return rows.slice(0, 3)
}

function positioningApplicationDek(
  guideFocus: Exclude<GuideFocus, ''>,
  primaryTouchpoint: string,
): string {
  const tp = primaryTouchpoint
  switch (guideFocus) {
    case 'sound_more_consistent':
      return `Align on who you serve and what should sound consistent, then tighten copy starting on ${tp}.`
    case 'give_clear_direction':
      return `Use this page as a short contract for trust: audience, promise, and where execution starts (${tp}).`
    case 'know_what_to_fix_first':
      return `Anchor what matters first, then ship visible fixes starting on ${tp} before wider polish.`
    case 'look_more_professional':
    default:
      return `Ground the brand in who you help and what should feel different, then show it clearly on ${tp} first.`
  }
}

function isSubstantiveBeforeAfterPair(pair: { label: string; before: string; after: string }): boolean {
  return (
    pair.label.trim().length > 0 &&
    pair.before.trim().length >= MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS &&
    pair.after.trim().length >= MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS
  )
}

/**
 * Omit borderline “story” material so page 02 does not run a thin founder arc;
 * application framing (dek + snapshot) covers the no-story case instead.
 */
function refineStoryNoteForGuide(note: string | undefined): string | undefined {
  if (!note?.trim()) return undefined
  const words = note.trim().split(/\s+/).filter(Boolean)
  if (words.length < MIN_STORY_WORDS_FOR_SURFACE) return undefined
  return note.trim()
}

export function substantiveBeforeAfterForGuide(
  pairs: Array<{ label: string; before: string; after: string }>,
  maxPairs: number,
): Array<{ label: string; before: string; after: string }> {
  return pairs.filter(isSubstantiveBeforeAfterPair).slice(0, maxPairs)
}

function contentDensityBiasFromStageAndTouchpoints(stage: string, touchCount: number): -1 | 0 | 1 {
  const s = stage.toLowerCase()
  let score = 0
  if (s === 'new' || s === 'idea' || s === 'starting_fresh') score -= 1
  if (s === 'established' || s === 'protecting_recognition' || s === 'scaling') score += 1
  if (touchCount >= 4) score += 1
  if (touchCount <= 1) score -= 1
  if (score <= -1) return -1
  if (score >= 1) return 1
  return 0
}

/** Industries where shorter, tighter example surfaces reduce risk of overclaiming tone. */
const INDUSTRIES_DENSITY_TRIM = new Set([
  'legal_professional_services',
  'finance',
  'health_wellness',
])

function contentDensityOffsetFromIndustryAndSliders(industry: string, sliders: VoiceSliders): -1 | 0 | 1 {
  let score = 0
  if (INDUSTRIES_DENSITY_TRIM.has(industry)) score -= 1
  const expressiveAvg = (sliders.warmth + sliders.energy + sliders.playfulness) / 3
  if (expressiveAvg >= 68) score += 1
  if (sliders.formality >= 82 && sliders.directness >= 82) score -= 1
  if (score <= -1) return -1
  if (score >= 1) return 1
  return 0
}

function clampDensityBias(sum: number): -1 | 0 | 1 {
  if (sum <= -1) return -1
  if (sum >= 1) return 1
  return 0
}

function resolvePrimaryGoal(form: IdentityKitForm): Exclude<PrimaryGoal, ''> {
  return form.step1.primaryGoal || 'direct_sales'
}

function resolveGuideFocus(form: IdentityKitForm): Exclude<GuideFocus, ''> {
  return form.step1.guideFocus || 'look_more_professional'
}

function resolveNormalizedTouchpointIds(form: IdentityKitForm): string[] {
  return normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? [])
}

function resolveVoiceTraits(form: IdentityKitForm): string[] {
  const traits: string[] = []
  if (form.step3.tonePreset === 'friendly') traits.push('warm', 'clear')
  if (form.step3.tonePreset === 'professional') traits.push('polished', 'trustworthy')
  if (form.step3.tonePreset === 'bold') traits.push('direct', 'confident')
  if (form.step3.voiceSliders.warmth >= 75) traits.push('human')
  if (form.step3.voiceSliders.directness >= 75) traits.push('purposeful')
  if (form.step3.voiceSliders.playfulness >= 75) traits.push('light')
  if (form.step3.voiceSliders.formality >= 75) traits.push('composed')
  if (form.step3.voiceSliders.energy >= 75) traits.push('energetic')
  return [...new Set(traits)].slice(0, 3)
}

function focusApplicationLead(focus: Exclude<GuideFocus, ''>, touchpoint: string): string {
  switch (focus) {
    case 'sound_more_consistent':
      return `Start with the places where your words matter most first: ${touchpoint}, your website, and any short bio or profile copy.`
    case 'give_clear_direction':
      return `Start by sharing this page with the person helping you implement updates on ${touchpoint} and your other active surfaces.`
    case 'know_what_to_fix_first':
      return `Start with ${touchpoint} first, then use the quick-start checklist to keep the rest of the rollout simple.`
    case 'look_more_professional':
    default:
      return `Start with ${touchpoint} first so the first impression of the brand feels cleaner, clearer, and more intentional.`
  }
}

function resolvePaletteRows(paletteId: string): PaletteRow[] {
  const canonicalId = canonicalPaletteId(paletteId)
  return guidePaletteRows[canonicalId] ?? guidePaletteRows.minimal_light
}

export function buildBrandIdentityGuideModel(form: IdentityKitForm): BrandIdentityGuideModel {
  const guideFocus = resolveGuideFocus(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const touchpointIds = resolveNormalizedTouchpointIds(form)
  const primaryTouchpoint = touchpointIds[0] ? getTouchpointLabel(touchpointIds[0]) : 'your main channel'
  const stageTouchBias = contentDensityBiasFromStageAndTouchpoints(form.step1.stage, touchpointIds.length)
  const industrySliderBias = contentDensityOffsetFromIndustryAndSliders(
    form.step1.industry,
    form.step3.voiceSliders,
  )
  const contentDensityBias = clampDensityBias(stageTouchBias + industrySliderBias)
  const briefBlocks = brandBriefBlocks(form)
  const styleBlocks = styleGuideBlocks(form)
  const voiceBlocks = voicePlaybookBlocks(form)

  const toneBody = blockByHeading(voiceBlocks, 'Tone profile')
  const guardrailsBody = blockByHeading(voiceBlocks, 'Voice guardrails')
  const messagingThemesBody = blockByHeading(voiceBlocks, 'Messaging themes')
  const samplePhrasesBody = blockByHeading(voiceBlocks, 'Sample phrases')
  const ctaBody = blockByHeading(voiceBlocks, 'Calls to action (CTAs)')
  const writingBody = blockByHeading(voiceBlocks, 'Writing do / avoid')
  const beforeAfterBody = blockByHeading(voiceBlocks, 'Before / after examples')

  const { dos, avoids } = parseDoAvoidSections(writingBody || guardrailsBody)
  const ctaExamples = extractBulletLines(
    ctaBody.includes(VOICE_PLAYBOOK_CTA_BODY_SPLIT)
      ? ctaBody.split(VOICE_PLAYBOOK_CTA_BODY_SPLIT)[2] ?? ''
      : ctaBody,
    3,
  )
  const storyNote = refineStoryNoteForGuide(extractStoryNote(blockByHeading(briefBlocks, 'Brand story angle')))
  const differentiator = extractDifferentiator(
    blockByHeading(briefBlocks, 'Differentiation'),
    form.step7.differentiation,
  )
  const overviewBody = blockByHeading(briefBlocks, 'Brand overview')
  const idealCustomerBody = blockByHeading(briefBlocks, 'Ideal customer')
  const transformation = blockByHeading(briefBlocks, 'Core transformation')
  const whatWeDo = extractWhatWeDo(overviewBody)
  const whoItsFor = extractAudience(idealCustomerBody)
  const applicationSnapshotRows = storyNote
    ? undefined
    : applicationSnapshotRowsForPositioning({ whatWeDo, whoItsFor, transformation }, primaryTouchpoint)
  const focus = focusMeta[guideFocus]
  const emphasis = focus.emphasis
  const baseSamplePhraseCap =
    emphasis === 'visual' ? 3 : emphasis === 'voice' || emphasis === 'action' ? 6 : 4
  const maxSamplePhrases = Math.min(6, Math.max(2, baseSamplePhraseCap + contentDensityBias))
  const maxBeforeAfterPairs =
    emphasis === 'visual' ? 1 : contentDensityBias === -1 ? 1 : 2
  const voiceListCap = contentDensityBias === -1 ? 2 : 3
  const examplesExampleDensity: GuideExampleDensity =
    emphasis === 'voice' || emphasis === 'action' ? 'high' : emphasis === 'visual' ? 'low' : 'medium'
  const examplesVisualOccupancy: GuideVisualOccupancy = emphasis === 'voice' ? 'strong' : 'medium'
  const lookVisualOccupancy: GuideVisualOccupancy =
    emphasis === 'visual' ? 'strong' : emphasis === 'voice' ? 'light' : 'medium'
  const visualKeywords = styleKeywordMap[form.step6.selectedStyle] ?? ['clear', 'consistent', 'intentional']
  const paletteId = canonicalPaletteId(form.step6.selectedPalette)
  const typographyLead = typographySectionLead(form)
  const visualDirectionBody = blockByHeading(styleBlocks, 'Visual direction') || toneBody
  const imageryBody = blockByHeading(styleBlocks, 'Imagery direction')
  const typographySpecimens = typographySpecimenSlots(form)

  const beforeAfterPairs = substantiveBeforeAfterForGuide(
    parseBeforeAfter(beforeAfterBody),
    maxBeforeAfterPairs,
  )
  return {
    signals: {
      guideFocus,
      primaryGoal,
      primaryTouchpoint,
      emphasis: focus.emphasis,
      touchpointCount: touchpointIds.length,
      contentDensityBias,
    },
    summary: {
      template: 'heroRail',
      editorial: {
        folio: '01',
        navLabel: 'Summary',
        title: form.step1.businessName,
        layout: 'heroQuoteRail',
        dekMode: 'none',
        visualOccupancy: 'medium',
        exampleDensity: 'low',
        figureLabel: 'Anchor quote',
      },
      anchor: blockByHeading(briefBlocks, 'Brand anchor'),
      whatWeDo,
      whoItsFor,
      transformation,
      guidingTraits: form.step4.values.slice(0, 3),
      differentiator,
      focusLead: focus.lead,
    },
    positioning: {
      template: 'heroRail',
      editorial: {
        folio: '02',
        navLabel: 'Positioning',
        title: 'How this brand should land',
        layout: 'proseQuoteRail',
        dekMode: 'full',
        deck: storyNote
          ? 'Use this page as the trust and handoff frame for the brand.'
          : positioningApplicationDek(guideFocus, primaryTouchpoint),
        visualOccupancy: 'medium',
        exampleDensity: 'low',
        figureLabel: focus.emphasis === 'handoff' ? 'Collaborator handoff block' : 'Trust note',
      },
      layoutVariant: storyNote ? 'storyHeavy' : 'supportHeavy',
      title: form.step1.businessName,
      focusLead: focus.lead,
      storyNote,
      applicationSnapshotRows,
      trustNote: differentiator
        ? `${form.step1.businessName} should feel easy to trust because the positioning is clear, specific, and practical.`
        : `${form.step1.businessName} should feel trustworthy before it tries to sound impressive.`,
      collaboratorNote: focus.emphasis === 'handoff' ? focus.collaborator : undefined,
    },
    voice: {
      template: 'referenceGrid',
      editorial: {
        folio: '03',
        navLabel: 'Voice',
        title: 'Use this page when you need the brand to sound like itself fast',
        layout: 'traitsSamples',
        dekMode: 'none',
        visualOccupancy: emphasis === 'voice' ? 'strong' : emphasis === 'visual' ? 'light' : 'medium',
        exampleDensity: emphasis === 'voice' ? 'high' : 'medium',
        figureLabel: 'Voice examples',
      },
      traits: resolveVoiceTraits(form),
      rules: dos.slice(0, voiceListCap),
      messagingAngles: extractNumberedLines(messagingThemesBody, voiceListCap),
      ctaPatterns: ctaExamples,
    },
    examples: {
      template: 'showcase',
      editorial: {
        folio: '04',
        navLabel: 'Examples',
        title: 'Show the brand in practice',
        layout: 'sampleShowcase',
        dekMode: 'none',
        visualOccupancy: examplesVisualOccupancy,
        exampleDensity: examplesExampleDensity,
        figureLabel: 'Before / after examples',
      },
      samplePhrases: extractQuotedLines(samplePhrasesBody, maxSamplePhrases),
      doLines: dos.slice(0, voiceListCap),
      avoidLines: avoids.slice(0, Math.min(2, voiceListCap)),
      beforeAfter: beforeAfterPairs,
    },
    visual: {
      template: 'visualBoard',
      editorial: {
        folio: '05',
        navLabel: 'Look',
        title: 'Build the visual system around a few strong cues',
        layout: 'visualSystemBoard',
        dekMode: 'none',
        visualOccupancy: lookVisualOccupancy,
        exampleDensity: 'medium',
        figureLabel: 'Application reference',
      },
      paletteId,
      paletteRows: resolvePaletteRows(paletteId),
      paletteRolesProse: paletteColorRolesParagraph(paletteId),
      paletteMood: blockByHeading(styleBlocks, 'Palette'),
      visualSummary: firstSentences(visualDirectionBody, 1) || firstParagraphs(visualDirectionBody, 1),
      visualKeywords,
      typography: {
        lead: firstSentences(typographyLead, 1),
        specimens: typographySpecimens,
      },
      imageryDirection: firstSentences(imageryBody, 1) || imageryBody,
      applicationLead: focusApplicationLead(guideFocus, primaryTouchpoint),
      applicationBullets: extractNumberedLines(blockByHeading(styleBlocks, 'Where to apply this first'), 3),
    },
  }
}
