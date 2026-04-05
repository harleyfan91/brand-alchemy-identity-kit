import type { IdentityKitForm } from '@identity-kit/shared'

import { computeBrandProfile } from './brandProfile.js'
import type { StageContext, TouchpointCluster } from './brandProfile.js'
import { type BriefEmphasis, type NarratorId, getNarratorProfile } from './narratorProfiles.js'
import {
  showTypographyLogoClosing,
  typographyLogoClosingParagraph,
  typographyLicensingLines,
  typographySectionLeads,
  typographySpecimenBlurbs,
  typographyWordmarkBoldRowNote,
} from './typographyMatrix.js'
import { getIndustryVoiceProfile, industryVoiceGuardrailLine } from './industryProfiles.js'
import { styleGuideVisualVoiceBridge, voicePlaybookToneVisualClosing } from './voiceVisualBridge.js'

export { touchpointClusterFromForm } from './brandProfile.js'
export type { BrandProfile, StageContext, TouchpointCluster, TypographyContext } from './brandProfile.js'
export { getIndustryVoiceProfile } from './industryProfiles.js'
export { paletteColorRolesParagraph } from './paletteColorRoles.js'
export { styleGuideVisualVoiceBridge, voicePlaybookToneVisualClosing } from './voiceVisualBridge.js'

/** Deterministic Core Kit copy — template assembly only (no AI). */
export function assertCoreTier(form: IdentityKitForm): void {
  if (form.tier !== 'core') {
    throw new Error(`Core PDF pipeline expected tier "core", got ${String(form.tier)}`)
  }
}

// ---------------------------------------------------------------------------
// Label maps
// ---------------------------------------------------------------------------

const industryLabels: Record<string, string> = {
  creative_services: 'Creative Services',
  health_wellness: 'Health and Wellness',
  beauty_personal_care: 'Beauty and Personal Care',
  fitness_sports: 'Fitness and Sports',
  technology: 'Technology',
  food_beverage: 'Food and Beverage',
  home_services: 'Home Services',
  real_estate: 'Real Estate',
  education: 'Education',
  finance: 'Finance',
  legal_professional_services: 'Legal and Professional Services',
  consulting_coaching: 'Consulting and Coaching',
  construction_trades: 'Construction and Trades',
  automotive: 'Automotive',
  photography_media: 'Photography and Media',
  pet_services: 'Pet Services',
  retail: 'Retail',
  nonprofit_community: 'Nonprofit and Community',
  other: 'Other',
}

const stageLabels: Record<string, string> = {
  idea: 'Idea stage',
  new: 'New business',
  growing: 'Growing',
  established: 'Established',
}

const originLabels: Record<string, string> = {
  side_hustle_leap: 'Built from a side project',
  industry_insider: 'Deep industry experience',
  problem_solver: 'Built to solve a real gap',
  creative_calling: 'A creative calling',
  fresh_start: 'A bold fresh start',
}

const toneLabels: Record<string, string> = {
  friendly: 'warm and conversational',
  professional: 'polished and professional',
  bold: 'bold and direct',
}

// ---------------------------------------------------------------------------
// Visual description maps (keyed to exact UI option IDs from Step6Aesthetic)
// ---------------------------------------------------------------------------

const paletteDescriptions: Record<string, string> = {
  midnight_luxe:
    'Rich near-blacks and dark navy grounded in depth, with a warm gold-tan accent — premium and high-contrast.',
  earthy_warmth:
    'Warm terracotta and caramel tones on a creamy neutral base — natural, handcrafted, and grounded.',
  ocean_calm:
    'Cool layered blues from deep navy to pale sky — confident, calm, and trustworthy without feeling corporate.',
  sunset_bold: 'Deep plum, burnt orange, and amber — expressive, warm, and designed to stand out.',
  forest_deep: 'Deep forest greens from near-black to fresh sage — organic, grounded, and quietly confident.',
  minimal_light: 'Near-black, cool mid-gray, and clean off-white — a versatile neutral system that lets content lead.',
}

const styleDescriptions: Record<string, string> = {
  clean_minimal:
    'Clean and minimal — white space is an active design element. Typography and content carry the brand; decoration stays out of the way.',
  bold_graphic:
    'Bold and graphic — high contrast, strong type, and decisive layout. Every element earns its place.',
  organic_natural:
    'Organic and natural — soft edges, earthy textures, and a handcrafted sensibility. Feels made by a person.',
  luxe_refined:
    'Luxe and refined — elegant proportions, quiet restraint, and a premium feel. Says a lot by doing less.',
}

// ---------------------------------------------------------------------------
// Shared utility
// ---------------------------------------------------------------------------

function capitalize(s: string): string {
  const t = s.trim()
  if (!t) return s
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// ---------------------------------------------------------------------------
// Brand anchor sentence
// ---------------------------------------------------------------------------

/** Single positioning sentence that appears at the top of every Brief. */
export function brandAnchorSentence(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const toneWord = toneLabels[form.step3.tonePreset] ?? 'clear'
  const audience = form.step2.customerArchetype || 'their customers'
  return `${form.step1.businessName} ${profile.anchor_verb} ${audience} — ${form.step1.transformation} — and sounds ${toneWord} while doing it.`
}

// ---------------------------------------------------------------------------
// Brand Brief helpers
// ---------------------------------------------------------------------------

type Block = { heading: string; body: string }

/** Heading keys used for ordering. Must match the heading strings in brandBriefBlocks. */
const BRIEF_HEADING_ORDER: Record<BriefEmphasis, string[]> = {
  story_then_transformation: [
    'Brand story angle',
    'Core transformation',
    'Values',
    'Brand overview',
    'Ideal customer',
    'Differentiation',
  ],
  story_then_values: [
    'Brand story angle',
    'Values',
    'Differentiation',
    'Brand overview',
    'Ideal customer',
    'Core transformation',
  ],
  transformation_then_customer: [
    'Core transformation',
    'Ideal customer',
    'Values',
    'Brand overview',
    'Brand story angle',
    'Differentiation',
  ],
  transformation_then_differentiation: [
    'Core transformation',
    'Differentiation',
    'Ideal customer',
    'Brand overview',
    'Brand story angle',
    'Values',
  ],
  values_then_transformation: [
    'Values',
    'Core transformation',
    'Brand story angle',
    'Brand overview',
    'Ideal customer',
    'Differentiation',
  ],
}

function reorderBriefBlocks(blocks: Block[], emphasis: BriefEmphasis): Block[] {
  const order = BRIEF_HEADING_ORDER[emphasis]
  const blockMap = new Map(blocks.map((b) => [b.heading, b]))
  const ordered: Block[] = []
  for (const heading of order) {
    const block = blockMap.get(heading)
    if (block) ordered.push(block)
  }
  // Append any blocks not in the order map (safety valve)
  for (const block of blocks) {
    if (!order.includes(block.heading)) ordered.push(block)
  }
  return ordered
}

function idealCustomerBriefBody(step2: IdentityKitForm['step2']): string {
  const parts: string[] = []
  if (step2.customerArchetype.trim()) parts.push(step2.customerArchetype.trim())
  if (step2.painPoints?.trim()) parts.push(`Pain points: ${step2.painPoints.trim()}`)
  if (step2.desiredOutcomes?.trim()) parts.push(`Desired outcomes: ${step2.desiredOutcomes.trim()}`)
  return parts.join('. ') || 'Customer profile not specified on intake.'
}

function valuesBriefBody(step4: IdentityKitForm['step4']): string {
  const bullets = step4.values.map((v) => `• ${capitalize(v)}`).join('\n')
  const mission = step4.missionStatement?.trim()
  if (!bullets && !mission) return 'Values not specified on intake.'
  if (mission) return bullets ? `${bullets}\n\nMission: ${mission}` : `Mission: ${mission}`
  return bullets
}

function differentiationBriefBody(step7: IdentityKitForm['step7']): string {
  const diff = step7.differentiation?.trim()
  if (step7.competitors.length > 0 && diff) {
    return `Compared with ${step7.competitors.join(', ')}. ${diff}`
  }
  if (step7.competitors.length > 0) {
    return `Compared with ${step7.competitors.join(', ')}.`
  }
  if (diff) return diff
  return 'Competitive set and differentiation not specified on intake.'
}

function brandStoryBriefBody(step5: IdentityKitForm['step5']): string {
  const originAngle = originLabels[step5.originArchetype] ?? step5.originArchetype
  const parts = [originAngle, step5.originSummary?.trim(), step5.motivation?.trim()].filter(Boolean) as string[]
  return parts.join('. ') || 'Origin story not specified on intake.'
}

export function brandBriefBlocks(form: IdentityKitForm): Block[] {
  const { step1, step2, step4, step5, step7 } = form
  const profile = getNarratorProfile(step1.brandNarrator)
  const industry = industryLabels[step1.industry] ?? step1.industry
  const stage = stageLabels[step1.stage] ?? step1.stage

  const coreBlocks: Block[] = [
    { heading: 'Brand overview', body: `${step1.businessName} — ${step1.offer} (${industry}, ${stage}).` },
    { heading: 'Ideal customer', body: idealCustomerBriefBody(step2) },
    { heading: 'Core transformation', body: step1.transformation },
    { heading: 'Values', body: valuesBriefBody(step4) },
    { heading: 'Brand story angle', body: brandStoryBriefBody(step5) },
    { heading: 'Differentiation', body: differentiationBriefBody(step7) },
  ]

  const ordered = reorderBriefBlocks(coreBlocks, profile.brand_brief_emphasis)

  return [
    { heading: 'Brand anchor', body: brandAnchorSentence(form) },
    ...ordered,
  ]
}

// ---------------------------------------------------------------------------
// Style Guide helpers
// ---------------------------------------------------------------------------

/** Phase 3: one narrator-specific do and don't appended to style-based rules. */
const styleDoAvoidNarratorLines: Record<NarratorId, { do: string; dont: string }> = {
  solo_expert: {
    do: 'Apply your palette and type consistently to any client-facing documents — proposals and follow-up emails are brand touchpoints too',
    dont: 'Avoid visual complexity that competes with credibility — the person should be the most recognizable thing, not the layout',
  },
  solo_maker: {
    do: 'Photograph your work with intention — backdrop, lighting direction, and color feel should reflect your style direction every time',
    dont: 'Avoid overproduced or obviously stock imagery — it erases the handmade signal that makes this kind of brand worth anything',
  },
  local_team: {
    do: "Use real photos of your space, your team, or your work — that's the differentiator no competitor can copy",
    dont: 'Avoid generic stock photography that could be any business — customers recognize authenticity and trust it more than polish',
  },
  product_led: {
    do: 'Keep your product the clearest element in every layout — white space and clean backgrounds are not empty space, they are frame',
    dont: "Avoid layout clutter that competes with the product — if someone has to work to find what you're selling, you've already lost them",
  },
  mission_community: {
    do: 'Keep hierarchy clear — your most important message should be impossible to miss, even on a quickly scrolled flyer or post',
    dont: 'Avoid visual styles that look corporate, exclusive, or polished in a way that creates distance from your community',
  },
}

/** Phase 3: two narrator lines (second is touchpoint-oriented) after style-based principles. */
const stylePrinciplesNarratorAdditions: Record<NarratorId, [string, string]> = {
  solo_expert: [
    'Every visual choice should reinforce the credibility of your work',
    'Consistency between your website, LinkedIn, and the documents you share with clients is where a visual direction becomes a recognizable brand',
  ],
  solo_maker: [
    'Your visual style should make people feel the care in what you make',
    'The same template energy that works in a grid post should carry through to your packaging, labels, and any materials someone holds in their hands',
  ],
  local_team: [
    'Consistent visuals across every touchpoint build local recognition fast',
    'What your storefront looks like, what your social feed looks like, and what your printed materials look like should feel like they came from the same hand',
  ],
  product_led: [
    'The product is the hero — your visual system frames it, not competes with it',
    'Your imagery, post templates, and website should all direct attention to the product — when the visual system is working, the product is always the most interesting thing in the frame',
  ],
  mission_community: [
    'Visual consistency builds trust; your audience needs to recognize you instantly',
    "Accessible, readable design is part of the mission — if the layout is confusing or the hierarchy is unclear, people disengage before they understand what you're asking them to do",
  ],
}

function stylePrinciplesBody(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const style = form.step6.selectedStyle

  const byStyle: Record<string, string[]> = {
    clean_minimal: [
      'White space is a design choice — use it generously',
      'One or two font styles max; let hierarchy do the visual work',
      'Color as accent, not background noise',
    ],
    bold_graphic: [
      'High contrast creates attention — use it intentionally',
      'Typography is part of the design, not just the text on top of it',
      'Say it once and say it big; repetition dilutes the impact',
    ],
    organic_natural: [
      'Imperfection is intentional — it signals handmade care',
      'Natural textures and materials should feel at home in your imagery',
      'Warmth and approachability win over polish',
    ],
    luxe_refined: [
      'Consistency is the luxury signal — same spacing, same type scale, always',
      'Let the work and proof do the talking; ornamentation is secondary',
      'Quiet confidence: restraint communicates premium better than decoration',
    ],
  }

  const base = byStyle[style] ?? [
    'Consistency is more important than perfection',
    'One clear visual idea per piece',
    'Your brand should look the same everywhere people find you',
  ]

  const [nFirst, nSecond] = stylePrinciplesNarratorAdditions[profile.narrator_id]
  const all = [...base, nFirst, nSecond]
  return all.map((p) => `• ${p}`).join('\n')
}

function styleDoAvoidBody(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const { stageContext } = computeBrandProfile(form)
  const style = form.step6.selectedStyle

  type DoAvoid = { dos: string[]; donts: string[] }
  const byStyle: Record<string, DoAvoid> = {
    clean_minimal: {
      dos: [
        'Use your primary palette color sparingly — one accent per layout goes a long way',
        'Leave breathing room between sections and elements on every page or post',
      ],
      donts: [
        'Avoid busy or textured backgrounds behind text',
        'Avoid using more than two font styles in a single piece',
      ],
    },
    bold_graphic: {
      dos: [
        'Use strong contrast between background and foreground text — readability first',
        'Let large type carry the visual weight; keep supporting copy smaller',
      ],
      donts: [
        "Avoid softening the palette into pastels — it undercuts the energy",
        'Avoid too many equal-weight elements — lead with one dominant focal point',
      ],
    },
    organic_natural: {
      dos: [
        'Choose photography that feels warm, real, and lived-in — not studio-perfect',
        'Natural textures (linen, wood, stone) work as backgrounds and supporting design elements',
      ],
      donts: [
        'Avoid overly polished stock photography — it reads as generic',
        'Avoid cold, flat vector graphics or hard geometric patterns',
      ],
    },
    luxe_refined: {
      dos: [
        'Keep consistent grid spacing and margins across all your materials',
        'Choose one typeface family and use weight and scale for variety',
      ],
      donts: [
        "Avoid decorative elements that don't add meaning or hierarchy",
        'Avoid inconsistent margins, unpredictable layouts, or competing visual focal points',
      ],
    },
  }

  const defaults: DoAvoid = {
    dos: [
      'Apply your palette consistently across all channels',
      'Let your style direction guide every design decision, even small ones',
    ],
    donts: [
      'Avoid mixing visual styles — pick one and stay there',
      'Avoid trendy fonts or colors that feel off-brand, even if popular right now',
    ],
  }

  const { dos, donts } = byStyle[style] ?? defaults

  const n = styleDoAvoidNarratorLines[profile.narrator_id]
  let dosAll = [...dos, n.do]
  let dontsAll = [...donts, n.dont]

  const stageRule = STYLE_DO_AVOID_STAGE[stageContext]
  if (stageRule.kind === 'do') dosAll = [...dosAll, stageRule.text]
  else dontsAll = [...dontsAll, stageRule.text]

  const doLines = dosAll.map((d) => `✓ ${d}`).join('\n')
  const dontLines = dontsAll.map((d) => `✗ ${d}`).join('\n')
  return `${doLines}\n\n${dontLines}`
}

function narratorUsageNotes(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const channels = profile.primary_channels
  const palette = form.step6.selectedPalette || 'your selected palette'
  const style = form.step6.selectedStyle || 'your selected style'

  const channelList = channels.join(', ')
  return [
    `Start with ${channels[0]}: apply your palette (${palette}) and style direction (${style}) to your profile, cover image, and any pinned content.`,
    `Extend to ${channelList}: keep colors, typography feel, and image style consistent across all active touchpoints.`,
    `Keep product photos and brand imagery on a backdrop that matches your style direction — light and neutral for minimal styles, textured or warm for organic or earthy directions.`,
    `When in doubt, use your primary palette color for any branded headers or call-to-action elements.`,
  ].join('\n')
}

/** Second paragraph when the customer already named a typeface—conversational, no bullets. */
const typographyComplementExisting: Record<string, string> = {
  clean_minimal:
    'For a minimal direction, think in terms of a neutral sans for everyday reading and a quieter serif for titles. The Inter and Source Serif samples above illustrate that split—map the same jobs onto your licensed fonts in production.',
  bold_graphic:
    'This direction still wants a bold sans up top and a patient sans below for long reads. Use the samples as a hierarchy reference even when your display face is something louder than Inter.',
  organic_natural:
    'Warm sans on daily surfaces plus a storytelling serif on heroes still fits an organic direction. Let the specimens guide how heavy each voice feels next to the other.',
  luxe_refined:
    'Refined systems usually lead with serif display and keep a crisp sans for everything functional. Align your existing face with whichever role it already plays, then mirror the contrast shown above.',
}

const typographyComplementExistingFallback = typographyComplementExisting.clean_minimal

export type TypographySpecimenSlot = {
  face: 'inter' | 'serif'
  roleEyebrow: string
  faceLabel: string
  blurb: string
  /** Optional note below Regular/Bold/Italic rows on the primary specimen (packaging / physical contexts). */
  wordmarkNoteAfterWeights?: string
}

/** Two slots in PDF render order; blurbs integrate role narrative + single per-face usage directive. */
const typographySpecimenPlans: Record<string, [TypographySpecimenSlot, TypographySpecimenSlot]> = {
  clean_minimal: [
    {
      face: 'inter',
      roleEyebrow: 'Primary typeface',
      faceLabel: 'Inter',
      blurb:
        'Inter carries most of what people read day to day—interfaces, paragraphs, and marketing copy. Use regular for body text, bold for emphasis and subheads, and italic sparingly for quotes or captions.',
    },
    {
      face: 'serif',
      roleEyebrow: 'Supporting typeface',
      faceLabel: 'Source Serif 4',
      blurb:
        'Source Serif 4 steps in for section titles and lines that deserve a calm, editorial serif without extra ornament. Prefer regular on display lines, bold only for small accents, and italic for quotes or gentle emphasis.',
    },
  ],
  luxe_refined: [
    {
      face: 'serif',
      roleEyebrow: 'Primary typeface',
      faceLabel: 'Source Serif 4',
      blurb:
        'Source Serif 4 carries elevated headlines and display lines. Stay mostly in regular; use bold and italic sparingly so the voice stays refined rather than busy.',
    },
    {
      face: 'inter',
      roleEyebrow: 'Supporting typeface',
      faceLabel: 'Inter',
      blurb:
        'Inter covers body text, captions, and UI. Use regular, bold, and italic for hierarchy inside this role without bringing in another family.',
    },
  ],
  bold_graphic: [
    {
      face: 'inter',
      roleEyebrow: 'Long-form & UI',
      faceLabel: 'Inter',
      blurb:
        'Long paragraphs, forms, and dense detail belong in a patient neutral like Inter. Your display sans should own headlines and CTAs; use the weight ladder here to see how the quiet voice behaves.',
    },
    {
      face: 'serif',
      roleEyebrow: 'Accent serif',
      faceLabel: 'Source Serif 4',
      blurb:
        'Source Serif 4 adds optional editorial warmth beside a strong geometric sans. Use it on pull quotes or softer moments, not in competition with your loud display face.',
    },
  ],
  organic_natural: [
    {
      face: 'inter',
      roleEyebrow: 'Everyday sans',
      faceLabel: 'Inter',
      blurb:
        'Inter stands in for a rounded, approachable sans on everyday surfaces. Regular for most UI and copy, bold for friendly headers, italic when you want a little warmth.',
    },
    {
      face: 'serif',
      roleEyebrow: 'Storytelling serif',
      faceLabel: 'Source Serif 4',
      blurb:
        'Source Serif 4 (or Fraunces / Lora in production) fits storytelling headings and hero moments. Use the regular/bold/italic samples as your hierarchy guide.',
    },
  ],
}

const typographySpecimenPlanFallback = typographySpecimenPlans.clean_minimal

/**
 * Ordered PDF specimen slots (embedded Inter + Source Serif 4 only).
 */
export function typographySpecimenSlots(form: IdentityKitForm): TypographySpecimenSlot[] {
  const { typographyContext } = computeBrandProfile(form)
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  const plan = typographySpecimenPlans[styleKey] ?? typographySpecimenPlanFallback
  const pairBlurbs = typographySpecimenBlurbs[typographyContext]?.[styleKey]
  const slots: TypographySpecimenSlot[] = plan.map((slot, i) => ({
    ...slot,
    blurb: pairBlurbs?.[i] ?? slot.blurb,
  }))
  const existing = form.step6.existingTypeface?.trim()
  if (!existing) {
    const note = typographyWordmarkBoldRowNote(typographyContext)
    if (note && slots[0]) {
      slots[0] = { ...slots[0], wordmarkNoteAfterWeights: note }
    }
  }
  return slots
}

/**
 * Opening line for the Typography PDF section—read first, then specimens.
 */
export function typographySectionLead(form: IdentityKitForm): string {
  const existing = form.step6.existingTypeface?.trim()
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  if (existing) {
    return `You are already using ${existing}. What follows shows how a sans and a serif typically divide regular, bold, and italic roles—map those jobs onto your licensed fonts.`
  }
  const { typographyContext } = computeBrandProfile(form)
  const byStyle = typographySectionLeads[typographyContext]
  return byStyle[styleKey] ?? typographySectionLeads.professional_and_digital.clean_minimal
}

/**
 * Order of faces for tests and any logic that only needs sequence.
 */
export function typographySpecimenFamilies(form: IdentityKitForm): Array<'inter' | 'serif'> {
  const [a, b] = typographySpecimenPlans[form.step6.selectedStyle] ?? typographySpecimenPlanFallback
  return [a.face, b.face]
}

function typographyRecommendationsBody(form: IdentityKitForm): string {
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  const existing = form.step6.existingTypeface?.trim()
  const { typographyContext, stageContext } = computeBrandProfile(form)
  const licensing = typographyLicensingLines[typographyContext]

  if (existing) {
    const complement = typographyComplementExisting[styleKey] ?? typographyComplementExistingFallback
    return [
      'Keep your existing face wherever it is established unless you are intentionally rebranding—that continuity is part of recognition.',
      complement,
      'If one family already covers both display and body, use size and hierarchy before you add another voice.',
      licensing,
    ].join('\n\n')
  }

  const parts = [licensing]
  if (showTypographyLogoClosing(typographyContext)) {
    parts.push(typographyLogoClosingParagraph(stageContext === 'protecting_recognition'))
  }
  return parts.join('\n\n')
}

function visualDirectionLogoParagraph(isEstablishedStage: boolean): string {
  if (isEstablishedStage) {
    return "A note on your logo: if you don't have a finalized mark yet, your name in your primary typeface is a strong, versatile starting point — especially during a period of brand standardization. When you're ready to invest in something custom, this Style Guide gives a designer your palette, type direction, and visual language in one document."
  }
  return "A note on your logo: you don't need a custom mark to build a recognizable brand. Many successful small businesses use their name set in their primary typeface as a wordmark, applied consistently across every surface. That is a real brand asset, and it scales from a business card to a sign to a social profile without the execution gaps that come with a symbol-based mark applied inconsistently. When you're ready to work with a designer on something custom, bring this Style Guide — it gives them your palette, your type direction, and your visual language in one document."
}

export function styleGuideBlocks(form: IdentityKitForm): Block[] {
  const { step6 } = form
  const { stageContext } = computeBrandProfile(form)
  const paletteDesc =
    paletteDescriptions[step6.selectedPalette] ??
    `Selected palette: ${step6.selectedPalette.replace(/_/g, ' ')}`
  const styleDesc =
    styleDescriptions[step6.selectedStyle] ?? `Style: ${step6.selectedStyle.replace(/_/g, ' ')}`
  const voiceVisualBridge = styleGuideVisualVoiceBridge(form.step3.tonePreset, step6.selectedStyle)
  const visualBody = [
    styleDesc,
    voiceVisualBridge,
    visualDirectionLogoParagraph(stageContext === 'protecting_recognition'),
  ].join('\n\n')

  const notesParts = [step6.colorMoodNotes?.trim(), step6.styleNotes?.trim()].filter(Boolean)
  const notesExtra = notesParts.length > 0 ? `\n\nAdditional notes: ${notesParts.join(' ')}` : ''

  return [
    { heading: 'Palette', body: `${paletteDesc}${notesExtra}` },
    { heading: 'Visual direction', body: visualBody },
    { heading: 'Typography', body: typographyRecommendationsBody(form) },
    { heading: 'Style principles', body: stylePrinciplesBody(form) },
    { heading: 'Do / avoid', body: styleDoAvoidBody(form) },
    { heading: 'Where to apply this first', body: narratorUsageNotes(form) },
  ]
}

// ---------------------------------------------------------------------------
// Voice Playbook helpers
// ---------------------------------------------------------------------------

/** Maps a 0–100 slider value into one of three description buckets. */
function sliderLabel(value: number, low: string, mid: string, high: string): string {
  if (value <= 33) return low
  if (value <= 66) return mid
  return high
}

function toneProfileBody(form: IdentityKitForm): string {
  const { step3, step6 } = form
  const { tonePreset, voiceSliders } = step3

  const presetDesc: Record<string, string> = {
    friendly: 'warm and conversational',
    professional: 'polished and trustworthy',
    bold: 'confident and direct',
  }

  const base = presetDesc[tonePreset] ?? tonePreset
  const energyWord = sliderLabel(voiceSliders.energy, 'calm and measured', 'steady and engaged', 'energetic and motivating')
  const warmthWord = sliderLabel(
    voiceSliders.warmth,
    'efficient and professional',
    'personable without being overly familiar',
    'warm and human — speaks like a trusted colleague',
  )
  const playWord = sliderLabel(
    voiceSliders.playfulness,
    'serious and grounded',
    'occasionally light — dry wit when it fits',
    'playful and expressive',
  )
  const directWord = sliderLabel(voiceSliders.directness, 'gentle and inviting', 'clear and purposeful', 'direct and action-forward')
  const formalWord = sliderLabel(
    voiceSliders.formality,
    'casual and relaxed',
    'approachable but professional when it counts',
    'polished and precise',
  )

  const main =
    `This brand sounds ${base} — ${energyWord}, ${warmthWord}. ` +
    `The writing style is ${formalWord}, ${directWord}, and ${playWord}. ` +
    `Whether it's a social caption, an email, or a product description, the tone should feel consistent and recognizable as the same business every time.`

  const visualClosing = voicePlaybookToneVisualClosing(tonePreset, step6.selectedStyle)
  const industryVoice = getIndustryVoiceProfile(form.step1.industry)
  return `${main} ${visualClosing} ${industryVoice.toneModifier}`
}

function voiceGuardrailsBody(form: IdentityKitForm): string {
  const { step3, step4 } = form
  const { tonePreset, voiceSliders } = step3

  const dos: string[] = []
  const donts: string[] = []

  if (tonePreset === 'friendly') {
    dos.push("Use contractions — \"you're\" not \"you are\"", "Write like you're talking to one specific person, not a crowd")
    donts.push('Avoid corporate jargon and buzzwords', "Don't be overly formal or stiff — that's not this brand")
  } else if (tonePreset === 'professional') {
    dos.push('Be specific — cite experience, results, or clear reasoning', 'Use precise, confident language that earns trust')
    donts.push('Avoid casual abbreviations or flippant language', "Don't over-explain — trust your reader to keep up")
  } else if (tonePreset === 'bold') {
    dos.push('Lead with strong verbs and clear, direct claims', 'Make a point and stand behind it — no hedging')
    donts.push('Avoid wishy-washy qualifiers like "kind of" or "maybe"', "Don't bury the point — say it first, explain it after")
  }

  if (voiceSliders.warmth >= 67) {
    dos.push('Use "you" often — speak directly to the reader, not at them')
  } else if (voiceSliders.warmth <= 33) {
    dos.push('Keep copy efficient — every word should earn its place')
  }

  if (voiceSliders.playfulness <= 33) {
    donts.push('Avoid forced humor — this brand only uses wit when it comes naturally')
  } else if (voiceSliders.playfulness >= 67) {
    dos.push("Let personality come through — wit is part of what makes this brand memorable")
  }

  if (step4.values.includes('clarity')) {
    dos.push('Say the simple thing first, then elaborate if needed')
  }
  if (step4.values.includes('craft')) {
    dos.push('Word choice reflects quality — write with as much care as the work itself')
  }
  if (step4.values.includes('momentum')) {
    dos.push('End on action — every piece of content should have a clear next step')
  }

  const industryDont = industryVoiceGuardrailLine(form.step1.industry)
  const dontsOrdered = industryDont ? [industryDont, ...donts] : [...donts]

  const doLines = dos.slice(0, 4).map((d) => `✓ ${d}`).join('\n')
  const dontLines = dontsOrdered.slice(0, 4).map((d) => `✗ ${d}`).join('\n')
  return `${doLines}\n\n${dontLines}`
}

function narratorMessagingThemes(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const industry = industryLabels[form.step1.industry] ?? form.step1.industry
  const themes = profile.tone_of_voice_themes
  const iv = getIndustryVoiceProfile(form.step1.industry)

  // Build 3 theme lines: first two from narrator themes, third anchored to transformation
  const themeLines = [
    `${capitalize(themes[0] ?? 'your expertise')} — lead with what makes this brand distinct in ${industry}.`,
    `${capitalize(themes[1] ?? 'your process')} — show the how behind the work, not just the result.`,
    `Customer transformation — return to: ${form.step1.transformation}`,
  ]

  if (themes[2]) {
    themeLines.push(`${capitalize(themes[2])} — the character that runs through every channel.`)
  }

  const pref = iv.preferredTerms.slice(0, 5).join(', ')
  const avoid = iv.avoidTerms.slice(0, 6).join(', ')
  themeLines.push(
    '',
    `Industry vocabulary — lean on terms your audience already trusts: ${pref}.`,
    `Steer around phrasing that reads off-brand or risky here: ${avoid}.`,
  )

  return themeLines.join('\n')
}

function samplePhrasesBody(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const iv = getIndustryVoiceProfile(form.step1.industry)
  const t0 = iv.preferredTerms[0] ?? 'results'
  const t1 = iv.preferredTerms[1] ?? 'process'
  const t2 = iv.preferredTerms[2] ?? 'how we work'

  const byNarrator: Record<NarratorId, string[]> = {
    solo_expert: [
      '"Here\'s what I\'ve seen work with clients like you..."',
      '"Let me walk you through this."',
      '"The thing most people miss about [topic] is..."',
      '"I work with [audience] who are ready to [outcome]."',
      '"After years in this work, here\'s my honest take:"',
      '"Book a call — let\'s figure out if this is the right fit."',
    ],
    solo_maker: [
      '"Made by hand, with..."',
      '"Here\'s a look at what went into this piece."',
      '"Every batch starts with..."',
      '"The detail that makes this different:"',
      '"This one\'s for the person who..."',
      '"Limited run — when it\'s gone, it\'s gone."',
    ],
    local_team: [
      '"We\'re right here in [neighborhood]."',
      '"Come see us — no appointment needed."',
      '"Our team loves when people ask about..."',
      '"We\'ve been part of this community for [time]."',
      '"Call us, stop by, or book online."',
      '"We know your name before you walk in the door."',
    ],
    product_led: [
      '"Here\'s what makes this different:"',
      '"See the results for yourself."',
      '"Made with [ingredient/material] — here\'s why that matters."',
      '"Before: [pain]. After: [outcome]."',
      '"Try it risk-free."',
      '"The thinking behind this product:"',
    ],
    mission_community: [
      '"Here\'s why this work matters:"',
      '"Together, we can..."',
      '"Every [action] supports [impact]."',
      '"Our community showed up for..."',
      '"Get involved — here\'s how:"',
      '"Change starts with showing up."',
    ],
  }

  const phrases = byNarrator[profile.narrator_id as NarratorId] ?? byNarrator.solo_expert
  const industryPhrases = [
    `"When we talk about ${t0}, we mean ${t1} — here's what that looks like for you."`,
    `"Ask about ${t1} and ${t2}; that's where we put our focus."`,
  ]
  return [...phrases.map((p) => `• ${p}`), ...industryPhrases.map((p) => `• ${p}`)].join('\n')
}

function writingDoAvoidBody(form: IdentityKitForm): string {
  const { step3 } = form
  const { tonePreset, voiceSliders } = step3

  const dos: string[] = [
    'Read every line out loud before publishing — if it sounds strange spoken, rewrite it',
    'Keep paragraphs to 2–3 sentences max on any digital channel',
    'End every piece of content with one clear next step, not three',
  ]

  const donts: string[] = [
    "Don't open every post with \"Excited to share...\" — lead with the value instead",
    'Avoid mixing formal and casual in the same sentence',
    "Don't pad copy — cut anything that doesn't add meaning",
  ]

  if (tonePreset === 'friendly') {
    dos.push('Use the word "you" — write to one person, not an audience')
    donts.push("Avoid \"We are pleased to announce\" — that's not this brand's voice")
  } else if (tonePreset === 'bold') {
    dos.push('Lead with the claim — back it up after, not before')
    donts.push('Avoid soft calls to action like "feel free to reach out"')
  } else if (tonePreset === 'professional') {
    dos.push('Be specific — a real result, credential, or fact beats a vague claim every time')
    donts.push('Avoid over-qualifying every statement — it erodes authority')
  }

  if (voiceSliders.formality <= 33) {
    dos.push("Contractions are on-brand — they're warmer and faster to read")
  }

  const doLines = dos.slice(0, 4).map((d) => `✓ ${d}`).join('\n')
  const dontLines = donts.slice(0, 4).map((d) => `✗ ${d}`).join('\n')
  return `${doLines}\n\n${dontLines}`
}

export function voicePlaybookBlocks(form: IdentityKitForm): Block[] {
  const { step3 } = form
  const blocks: Block[] = [
    { heading: 'Tone profile', body: toneProfileBody(form) },
    { heading: 'Voice guardrails', body: voiceGuardrailsBody(form) },
    { heading: 'Messaging themes', body: narratorMessagingThemes(form) },
    { heading: 'Sample phrases', body: samplePhrasesBody(form) },
    { heading: 'Writing do / avoid', body: writingDoAvoidBody(form) },
  ]

  if (step3.customVoiceNotes?.trim()) {
    blocks.push({ heading: 'Custom voice notes', body: step3.customVoiceNotes.trim() })
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Quick Start helpers
// ---------------------------------------------------------------------------

const QUICK_START_WEEK1_PREAMBLE: Record<StageContext, string> = {
  starting_fresh:
    "You are building from scratch — that's an advantage. Start with one channel, do it right, and the rest can follow what you establish here.",
  building_foundation:
    'Your business exists; now the brand needs to catch up. Start with the channel where the most customers find you first.',
  standardizing:
    "You've got presence across channels — the job now is to make them feel like the same brand. Start where the gap is most visible.",
  protecting_recognition:
    "There's equity in what you've already built. Week 1 is about auditing for consistency, not starting over.",
}

/** Phase 5: one extra line in Style Guide Do / avoid, keyed by stage context. */
const STYLE_DO_AVOID_STAGE: Record<StageContext, { kind: 'do' | 'dont'; text: string }> = {
  starting_fresh: {
    kind: 'do',
    text: 'Start with one thing done consistently rather than five things done partially — a small brand that looks the same everywhere is more recognizable than a bigger brand that looks different on every platform',
  },
  building_foundation: {
    kind: 'do',
    text: "Don't wait for everything to be perfect before putting the brand into market — consistency at 80% quality is more valuable than perfection that keeps getting pushed",
  },
  standardizing: {
    kind: 'do',
    text: 'Audit before you expand — make sure the channels you already have reflect your direction before adding new ones',
  },
  protecting_recognition: {
    kind: 'dont',
    text: 'Avoid changes that read as a restart rather than an evolution — customers who already know you should recognize the brand after an update, not feel like they found a different company',
  },
}

function week1Items(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)

  const byNarrator: Record<NarratorId, string[]> = {
    solo_expert: [
      'Update your LinkedIn headline using your brand anchor sentence',
      'Rewrite your LinkedIn "About" section to reflect your transformation statement',
      'Update your email signature with your business name and one clear call to action',
      'Refresh your website or portfolio homepage headline to match your brand positioning',
      'Add or confirm your booking or contact link is visible everywhere',
    ],
    solo_maker: [
      'Update your Etsy shop bio with your brand anchor sentence',
      'Rewrite your shop "About" section using your voice preset and values',
      'Update your cover photo and banner image to reflect your palette direction',
      'Refresh your first (featured) listing description using your transformation statement',
      'Add a consistent profile photo or branded avatar across all platforms',
    ],
    local_team: [
      'Update your Google Business profile description with your brand anchor sentence',
      'Add current photos that reflect your visual style direction',
      'Confirm your business name, hours, and address are accurate and consistent',
      'Respond to any unanswered reviews using your brand voice',
      'Update your Facebook "About" section to match your Google Business copy',
    ],
    product_led: [
      'Update your website homepage headline and subheadline with your brand positioning',
      'Rewrite your product description lead using your transformation statement',
      'Update your Instagram bio with your short-form brand anchor',
      'Audit your product photos — do they reflect your style direction?',
      "Add one clear CTA link (shop, try, or learn more) everywhere it's missing",
    ],
    mission_community: [
      'Update your Facebook page "About" section with your mission statement',
      'Rewrite your email newsletter header to reflect your anchor sentence',
      'Add your impact statement to your website homepage',
      'Update your social bio on every active platform to match your positioning',
      'Confirm CTA language is consistent everywhere (e.g. "Get involved" or "Support us")',
    ],
  }

  const items = byNarrator[profile.narrator_id as NarratorId] ?? byNarrator.solo_expert
  return items.map((i) => `☐ ${i}`).join('\n')
}

function week2Items(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const primaryChannel = profile.primary_channels[0] ?? 'your primary channel'
  const secondChannel = profile.primary_channels[1] ?? 'your second channel'
  const theme = profile.tone_of_voice_themes[0] ?? 'your messaging themes'

  const items = [
    `Apply your voice guardrails to ${primaryChannel}: rewrite your description and update 2–3 posts using your new tone`,
    'Draft a "what I do" post or listing update using your transformation statement',
    `Extend your voice to ${secondChannel}: update the bio or description to match your brand`,
    'Update your email signature or auto-reply with your brand anchor sentence',
    `Identify 3 upcoming posts and draft them using your messaging themes (${theme})`,
  ]

  return items.map((i) => `☐ ${i}`).join('\n')
}

/** Phase 6: Week 3 visual rollout checklist by touchpoint cluster (static copy from refactor spec). */
const WEEK3_ITEMS_BY_CLUSTER: Record<TouchpointCluster, string[]> = {
  physical_first: [
    'Apply your palette to any printed materials you currently hand out — business cards, stickers, packaging inserts. Even one element updated consistently makes a difference.',
    'Create a simple branded template for social posts using your palette and style direction — this becomes the pattern everything else follows.',
    'Audit your storefront, vehicle, or any physical space customers encounter — does it reflect your palette and style direction?',
    'Check that your profile photo or avatar feels consistent with your visual direction across every platform where customers look you up.',
    "Review any photos you've posted recently — do they feel like they came from the same brand?",
  ],
  social_product: [
    'Update your Instagram profile image, bio cover, and highlight icons to reflect your palette.',
    "Create a simple branded post template using your palette and style direction — apply it to your next three posts before you evaluate whether it's working.",
    'Check that your product photography feels consistent — does the backdrop and lighting match your style direction?',
    'Apply your palette to any packaging or label elements you control — labels, tissue paper, inserts, shipping stickers.',
    'Audit your shop banner and listing images — do they feel like they came from the same brand?',
  ],
  social_service: [
    'Update your LinkedIn cover image with your palette colors — it is the largest branded canvas most professional services brands have.',
    'Check that your website homepage reflects your palette — the hero section especially.',
    'Create or update a simple branded slide template for any presentations or proposals you send.',
    'Audit your profile image across every platform where clients find you — it should feel consistent with your visual direction.',
    'Review 5 recent posts or pieces of content — do they feel visually consistent?',
  ],
  local_community: [
    'Update your Google Business profile cover photo with an image that reflects your palette and style direction.',
    'Create a simple branded template for event flyers or social posts — even a basic Canva template with your colors is better than starting from scratch every time.',
    'Check that your Facebook cover image and profile photo feel consistent with each other and with your visual direction.',
    'Review any print materials you currently distribute — do they reflect your palette and style direction?',
    'Audit your Instagram or Facebook feed — does the visual feel consistent from post to post?',
  ],
  digital_brand: [
    'Audit your website homepage — does the hero section reflect your palette and style direction clearly?',
    'Create or update a branded post template for Instagram using your palette and style.',
    'Check that your product or service imagery reflects your visual direction — backdrop, lighting mood, and color feel.',
    'Review your email header or newsletter template — does it match your palette?',
    'Audit your social profiles for visual consistency — profile images, covers, and recent posts should feel like the same brand.',
  ],
}

function week3Items(form: IdentityKitForm): string {
  const { touchpointCluster } = computeBrandProfile(form)
  const items = WEEK3_ITEMS_BY_CLUSTER[touchpointCluster]
  return items.map((i) => `☐ ${i}`).join('\n')
}

function week4Items(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const allChannels = profile.primary_channels.join(', ')

  const items = [
    `Review all active channels (${allChannels}): does your voice feel consistent across all of them?`,
    'Check that your brand colors appear consistently everywhere — cover images, profile photos, posts',
    'Confirm your CTA language is the same style across all channels',
    'Note 3 places that still need updating and schedule them for next month',
    'Share your brand anchor sentence with anyone who helps you create content',
  ]

  return items.map((i) => `☐ ${i}`).join('\n')
}

export function quickStartBlocks(form: IdentityKitForm): Block[] {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const { stageContext } = computeBrandProfile(form)
  const primaryChannel = profile.primary_channels[0] ?? 'your primary channel'
  const week1Preamble = QUICK_START_WEEK1_PREAMBLE[stageContext]

  return [
    {
      heading: 'Week 1',
      body: `${week1Preamble}\n\nSet up your brand on ${primaryChannel} first.\n\n${week1Items(form)}`,
    },
    {
      heading: 'Week 2',
      body: `Apply your brand voice across your top channels.\n\n${week2Items(form)}`,
    },
    {
      heading: 'Week 3',
      body: `Roll out your visual direction consistently.\n\n${week3Items(form)}`,
    },
    {
      heading: 'Week 4',
      body: `Audit and tighten everything.\n\n${week4Items(form)}`,
    },
  ]
}
