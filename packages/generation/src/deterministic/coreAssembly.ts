import type { IdentityKitForm } from '@identity-kit/shared'

import { type BriefEmphasis, getNarratorProfile } from './narratorProfiles.js'

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
// Brand Brief
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

export function brandBriefBlocks(form: IdentityKitForm): Block[] {
  const { step1, step2, step4, step5, step7 } = form
  const profile = getNarratorProfile(step1.brandNarrator)
  const industry = industryLabels[step1.industry] ?? step1.industry
  const stage = stageLabels[step1.stage] ?? step1.stage
  const originAngle = originLabels[step5.originArchetype] ?? step5.originArchetype

  const storyBody = [
    originAngle,
    step5.originSummary ? step5.originSummary : '',
  ]
    .filter(Boolean)
    .join('. ')

  const coreBlocks: Block[] = [
    { heading: 'Brand overview', body: `${step1.businessName} — ${step1.offer} (${industry}, ${stage}).` },
    { heading: 'Ideal customer', body: step2.customerArchetype },
    { heading: 'Core transformation', body: step1.transformation },
    { heading: 'Values', body: step4.values.join(', ') },
    { heading: 'Brand story angle', body: storyBody },
    {
      heading: 'Differentiation',
      body:
        step7.competitors.length > 0
          ? `Compared with ${step7.competitors.join(', ')}.`
          : 'Competitive set not specified on intake.',
    },
  ]

  const ordered = reorderBriefBlocks(coreBlocks, profile.brand_brief_emphasis)

  return [
    { heading: 'Brand anchor', body: brandAnchorSentence(form) },
    ...ordered,
  ]
}

// ---------------------------------------------------------------------------
// Style Guide
// ---------------------------------------------------------------------------

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

export function styleGuideBlocks(form: IdentityKitForm): Block[] {
  const { step6 } = form
  return [
    { heading: 'Palette', body: `Selected palette: ${step6.selectedPalette}` },
    { heading: 'Visual direction', body: `Style: ${step6.selectedStyle}` },
    { heading: 'Notes', body: [step6.colorMoodNotes, step6.styleNotes].filter(Boolean).join('\n\n') || '—' },
    { heading: 'Where to apply this first', body: narratorUsageNotes(form) },
  ]
}

// ---------------------------------------------------------------------------
// Voice Playbook
// ---------------------------------------------------------------------------

function narratorMessagingThemes(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const industry = industryLabels[form.step1.industry] ?? form.step1.industry
  const themes = profile.tone_of_voice_themes

  // Build 3 theme lines: first two from narrator themes, third anchored to transformation
  const themeLines = [
    `${capitalize(themes[0] ?? 'your expertise')} — lead with what makes this brand distinct in ${industry}.`,
    `${capitalize(themes[1] ?? 'your process')} — show the how behind the work, not just the result.`,
    `Customer transformation — return to: ${form.step1.transformation}`,
  ]

  if (themes[2]) {
    themeLines.push(`${capitalize(themes[2])} — the character that runs through every channel.`)
  }

  return themeLines.join('\n')
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function voicePlaybookBlocks(form: IdentityKitForm): Block[] {
  const { step3 } = form
  const blocks: Block[] = [
    { heading: 'Tone preset', body: step3.tonePreset || '—' },
    {
      heading: 'Voice axes (snapshot)',
      body: `Formality ${step3.voiceSliders.formality}, energy ${step3.voiceSliders.energy}, directness ${step3.voiceSliders.directness}, warmth ${step3.voiceSliders.warmth}, playfulness ${step3.voiceSliders.playfulness}`,
    },
    { heading: 'Messaging themes', body: narratorMessagingThemes(form) },
  ]

  if (step3.customVoiceNotes?.trim()) {
    blocks.push({ heading: 'Custom voice notes', body: step3.customVoiceNotes.trim() })
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Quick Start
// ---------------------------------------------------------------------------

export function quickStartBlocks(form: IdentityKitForm): Block[] {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const primaryChannel = profile.primary_channels[0] ?? 'your primary channel'
  const allChannels = profile.primary_channels.join(', ')
  const palette = form.step6.selectedPalette || 'your palette'
  const style = form.step6.selectedStyle || 'your style direction'

  return [
    {
      heading: 'Week 1',
      body: `Set up your brand on ${primaryChannel}: update your bio, profile name, and cover image using your new brand direction and anchor sentence.`,
    },
    {
      heading: 'Week 2',
      body: `Apply your brand voice to ${primaryChannel}: rewrite your description and update 2–3 posts or listings using your messaging themes.`,
    },
    {
      heading: 'Week 3',
      body: `Apply your palette (${palette}) and style direction (${style}) consistently to ${allChannels}.`,
    },
    {
      heading: 'Week 4',
      body: `Audit brand consistency across ${allChannels}: check that voice, visuals, and CTA language all feel aligned.`,
    },
  ]
}
