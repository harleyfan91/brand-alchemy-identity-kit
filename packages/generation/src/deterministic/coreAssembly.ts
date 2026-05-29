import {
  assembleOfferLine,
  assembleTransformationLine,
  type BrandNarrator,
  canonicalPaletteId,
  formatPaletteLeadSentence,
  formatStyleLeadSentence,
  getTouchpointDefinition,
  getTouchpointLabel,
  type IdentityKitForm,
  normalizeTouchpoints,
  type PrimaryGoal,
  resolveBuyerArchetypeTitle,
  type TouchpointBucketId,
  type TouchpointId,
} from '@identity-kit/shared'

import { computeBrandProfile } from './brandProfile.js'
import type { StageContext, TouchpointCluster, TypographyContext } from './brandProfile.js'
import { type BriefEmphasis, type NarratorId, getNarratorProfile } from './narratorProfiles.js'
import {
  typographyLicensingLines,
  typographySectionLeads,
  typographyWordmarkBoldRowNote,
} from './typographyMatrix.js'
import { getIndustryVoiceProfile, industryVoiceGuardrailLine } from './industryProfiles.js'
import { styleGuideImageryDirectionBody, voicePlaybookBeforeAfterBody } from './phase8Content.js'
import { styleGuideVisualVoiceBridge, voicePlaybookToneVisualClosing } from './voiceVisualBridge.js'
import { getRecipeForProfile, resolveTypographyPair } from './typographyRecipes.js'
import {
  composeQuickStartKitIntro,
  quickStartWeekGuidePointer,
} from './quickStartContent.js'
import {
  quickStartExpandSectionBlock,
  resolvePriorityChannelPlan,
} from './quickStartRecommendations.js'
import { customerFacingTransformationLine } from './transformationCopy.js'

export { touchpointClusterFromForm } from './brandProfile.js'
export type { BrandProfile, StageContext, TouchpointCluster, TypographyContext } from './brandProfile.js'
export { getIndustryVoiceProfile } from './industryProfiles.js'
export { paletteDescriptions } from '@identity-kit/shared'
export { styleGuideImageryDirectionBody, voicePlaybookBeforeAfterBody } from './phase8Content.js'
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
// Shared utility
// ---------------------------------------------------------------------------

function capitalize(s: string): string {
  const t = s.trim()
  if (!t) return s
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function normalizeForSet(value: string): string {
  return value.trim().toLowerCase()
}

function inlinePhrase(value: string): string {
  const t = value.trim()
  if (/^[A-Z][a-z]/.test(t)) return t.charAt(0).toLowerCase() + t.slice(1)
  return t
}

function softenBeforeState(value: string): string {
  return value.replace(/^stuck in /i, '').replace(/^settling for /i, '')
}

type ChannelPlan = {
  primary: string
  secondary: string
  all: string[]
  primaryBucket: TouchpointBucketId | null
  secondaryBucket: TouchpointBucketId | null
}

function resolveChannelPlan(form: IdentityKitForm): ChannelPlan {
  const priority = resolvePriorityChannelPlan(form)
  return {
    primary: priority.primary,
    secondary: priority.secondary ?? 'your other selected channel',
    all: priority.all,
    primaryBucket: priority.primaryBucket,
    secondaryBucket: priority.secondaryBucket,
  }
}

function hasSecondSelectedChannel(form: IdentityKitForm): boolean {
  return resolvePriorityChannelPlan(form).secondary !== null
}

/** Marketplace-first solo brand: use commerce-shaped Week 1 / phrases, not consulting-default bullets. */
function soloExpertCommerceLean(form: IdentityKitForm): boolean {
  if (form.step1.brandNarrator !== 'solo_expert') return false
  return resolveChannelPlan(form).primaryBucket === 'marketplace'
}

const PRIMARY_BUCKET_NOTE: Record<TouchpointBucketId, string> = {
  social:
    'Prioritize profile clarity, posting cadence, and visual consistency so each post reinforces recognition.',
  online_directory:
    'Prioritize profile completeness, review responses, and service details so discovery channels convert to real inquiries.',
  marketplace:
    'Prioritize listing quality, photography consistency, and offer clarity so shoppers can compare and buy quickly.',
  owned_channel:
    'Prioritize homepage or newsletter consistency so your owned channels become the most reliable conversion path.',
}

const PRIMARY_GOAL_LABELS: Record<Exclude<PrimaryGoal, ''>, string> = {
  direct_sales: 'direct sales',
  lead_gen: 'lead generation',
  audience_growth: 'audience growth',
  retention: 'retention',
}

function resolvePrimaryGoal(form: IdentityKitForm): Exclude<PrimaryGoal, ''> {
  if (form.step1.primaryGoal && form.step1.primaryGoal in PRIMARY_GOAL_LABELS) {
    return form.step1.primaryGoal as Exclude<PrimaryGoal, ''>
  }
  return 'direct_sales'
}

function touchpointEntries(form: IdentityKitForm): Array<{
  id: TouchpointId
  label: string
  bucket: TouchpointBucketId
}> {
  return normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? []).map((id) => ({
    id,
    label: getTouchpointLabel(id).trim(),
    bucket: getTouchpointDefinition(id).bucket,
  }))
}

function normalizedTouchpointIds(form: IdentityKitForm): TouchpointId[] {
  return touchpointEntries(form).map((e) => e.id)
}

function touchpointsIncludeEmail(form: IdentityKitForm): boolean {
  return normalizedTouchpointIds(form).includes('email_newsletter')
}

function touchpointsIncludeWebsite(form: IdentityKitForm): boolean {
  return normalizedTouchpointIds(form).includes('website')
}

function touchpointsIncludeOnlineDirectory(form: IdentityKitForm): boolean {
  return touchpointEntries(form).some((e) => e.bucket === 'online_directory')
}

/** Web-ish surface label from explicit website selection or narrator fallback strings like "brand website". */
function webSurfaceLabel(channelPlan: ChannelPlan, form: IdentityKitForm): string | null {
  if (touchpointsIncludeWebsite(form)) return getTouchpointLabel('website')
  const hit = channelPlan.all.find((l) => /website|site homepage|homepage/i.test(l))
  return hit ?? null
}

function firstDirectoryLabel(form: IdentityKitForm, channelPlan: ChannelPlan): string {
  const dir = touchpointEntries(form).find((e) => e.bucket === 'online_directory')
  if (dir) return dir.label
  if (channelPlan.primaryBucket === 'online_directory') return channelPlan.primary
  return 'Google Business'
}

function labelLooksSocial(label: string): boolean {
  return /instagram|facebook|tiktok|linkedin|threads|youtube|pinterest|snapchat/i.test(label)
}

/** User-selected profile surfaces for local Week 3 (social + owned website/blog/email surfaces), Step 1 order. */
function localCommunityUserProfileLabels(form: IdentityKitForm): string[] {
  const out: string[] = []
  const push = (label: string) => {
    const n = normalizeForSet(label)
    if (!n || out.some((x) => normalizeForSet(x) === n)) return
    out.push(label)
  }
  for (const e of touchpointEntries(form)) {
    if (e.bucket === 'social' || e.bucket === 'owned_channel') push(e.label)
  }
  return out
}

function substituteProfessionalDigitalLinkedIn(
  text: string,
  typographyContext: TypographyContext,
  form: IdentityKitForm,
): string {
  if (typographyContext !== 'professional_and_digital') return text
  const primary = resolveChannelPlan(form).primary
  return text.replace(/\bLinkedIn\b/g, primary)
}

function buildWeek3Checklist(form: IdentityKitForm, touchpointCluster: TouchpointCluster): string[] {
  const channelPlan = resolveChannelPlan(form)
  const p = channelPlan.primary
  const s = channelPlan.secondary
  const pb = channelPlan.primaryBucket

  switch (touchpointCluster) {
    case 'physical_first':
      return [
        'Apply your palette to any printed materials you currently hand out — business cards, stickers, packaging inserts. Even one element updated consistently makes a difference.',
        'Create a simple branded template for social posts using your palette and style direction — this becomes the pattern everything else follows.',
        'Audit your storefront, vehicle, or any physical space customers encounter — does it reflect your palette and style direction?',
        `Check that your profile photo or avatar feels consistent with your visual direction on ${p} and anywhere else customers look you up.`,
        "Review any photos you've posted recently — do they feel like they came from the same brand?",
      ]
    case 'social_product': {
      const shopLine =
        pb === 'marketplace'
          ? `Audit your ${p} shop banner and listing images — do they feel like they came from the same brand?`
          : `Audit your ${p} featured listings, shop banner, or catalog imagery — do they feel like they came from the same brand?`
      return [
        `Update your ${p} profile image, bio, and any cover or highlight sections to reflect your palette.`,
        "Create a simple branded post template using your palette and style direction — apply it to your next three posts before you evaluate whether it's working.",
        'Check that your product photography feels consistent — does the backdrop and lighting match your style direction?',
        'Apply your palette to any packaging or label elements you control — labels, tissue paper, inserts, shipping stickers.',
        shopLine,
      ]
    }
    case 'social_service': {
      const web = webSurfaceLabel(channelPlan, form)
      const line2 = web
        ? `Check that your ${web} homepage or hero section reflects your palette — the first screen especially.`
        : `Check that your primary landing content on ${p} reflects your palette — the first screen clients see.`
      return [
        `Update your ${p} cover or header image with your palette colors — it is often the largest branded canvas service brands control.`,
        line2,
        'Create or update a simple branded slide template for any presentations or proposals you send.',
        'Audit your profile image across every platform where clients find you — it should feel consistent with your visual direction.',
        'Review 5 recent posts or pieces of content — do they feel visually consistent?',
      ]
    }
    case 'local_community': {
      const dir = firstDirectoryLabel(form, channelPlan)
      const hasDirectory = touchpointsIncludeOnlineDirectory(form)
      const directoryLead = hasDirectory
        ? `Update your ${dir} cover photo with an image that reflects your palette and style direction.`
        : null

      const profiles = localCommunityUserProfileLabels(form)
      let coverLine: string
      let feedLine: string
      if (profiles.length >= 2) {
        const [a, b] = profiles
        coverLine = `Check that your ${a} cover image and profile photo feel consistent with each other and with your visual direction.`
        const feedSurfaces = normalizeForSet(b) !== normalizeForSet(a) ? `${a} or ${b}` : a
        feedLine = `Audit your ${feedSurfaces} feed — does the visual feel consistent from post to post?`
      } else if (profiles.length === 1) {
        const [a] = profiles
        coverLine = `Check that your ${a} cover image and profile photo feel consistent with your visual direction.`
        feedLine = `Audit your ${a} feed or recent posts — does the visual feel consistent from post to post?`
      } else {
        coverLine =
          'Check that your profile and cover imagery on the channels you use feel consistent with your visual direction.'
        feedLine =
          'Audit your recent posts or updates wherever you publish most — does the visual feel consistent from post to post?'
      }

      return [
        ...(directoryLead ? [directoryLead] : []),
        'Create a simple branded template for event flyers or social posts — even a basic Canva template with your colors is better than starting from scratch every time.',
        coverLine,
        'Review any print materials you currently distribute — do they reflect your palette and style direction?',
        feedLine,
      ]
    }
    case 'digital_brand': {
      const web = webSurfaceLabel(channelPlan, form)
      const line1 = web
        ? `Audit your ${web} — does the hero section reflect your palette and style direction clearly?`
        : `Audit your ${p} presence — does the hero or top-of-profile content reflect your palette and style direction clearly?`
      const socialSurface =
        pb === 'social'
          ? p
          : channelPlan.secondaryBucket === 'social'
            ? s
            : labelLooksSocial(p)
              ? p
              : channelPlan.all.find(labelLooksSocial) ?? s
      const line2 = `Create or update a branded post template for ${socialSurface} using your palette and style.`
      const line4 = touchpointsIncludeEmail(form)
        ? 'Review your email header or newsletter template — does it match your palette?'
        : `Review headers and templates on ${p} — do they match your palette where readers land first?`
      return [
        line1,
        line2,
        'Check that your product or service imagery reflects your visual direction — backdrop, lighting mood, and color feel.',
        line4,
        `Audit your ${p} and ${s} for visual consistency — profile images, covers, and recent posts should feel like the same brand.`,
      ]
    }
    default:
      return []
  }
}

// ---------------------------------------------------------------------------
// Brand anchor sentence
// ---------------------------------------------------------------------------

/** Single positioning sentence that appears at the top of every Brief. */
export function brandAnchorSentence(form: IdentityKitForm): string {
  const toneWord = toneLabels[form.step3.tonePreset] ?? 'clear'
  const rawArchetype = form.step2.customerArchetype.trim()
  const audience = rawArchetype
    ? inlinePhrase(resolveBuyerArchetypeTitle(rawArchetype, form.step1.industry))
    : ''
  const offerLine = assembleOfferLine(form.step1.offer, form.step1.industry)
  const narratorId: NarratorId = form.step1.brandNarrator || 'solo_expert'
  const lead =
    narratorId === 'solo_expert'
      ? audience
        ? `${form.step1.businessName} helps ${audience}.`
        : `${form.step1.businessName} helps people through ${offerLine}.`
      : narratorId === 'mission_community'
        ? audience
          ? `${form.step1.businessName} exists for ${audience}.`
          : `${form.step1.businessName} exists to support people through ${offerLine}.`
        : narratorId === 'product_led'
          ? audience
            ? `${form.step1.businessName} is built for ${audience}.`
            : `${form.step1.businessName} is built around ${offerLine}.`
          : audience
            ? `${form.step1.businessName} is for ${audience}.`
            : `${form.step1.businessName} is built around ${offerLine}.`
  const transformation = customerFacingTransformationLine(form)
  return [lead, transformation, `The voice stays ${toneWord}, never stiff or generic.`].filter(Boolean).join(' ')
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

/** What the brand must signal to this buyer type, keyed to narrator. */
const IDEAL_CUSTOMER_NARRATOR_CUE: Record<NarratorId, string> = {
  solo_expert:
    'They need credibility and less perceived risk before they commit.',
  solo_maker:
    'They want to feel the care and craft behind the product. The person matters as much as the thing.',
  local_team:
    'They want the business to feel immediately familiar, like it already knows the neighborhood and the people in it.',
  product_led:
    "They need to see the product's quality and difference quickly, before they read much copy.",
  mission_community:
    'They want proof that their time and money go somewhere real. Transparency and dignity are not optional.',
}

/** Narrator-specific buyer signal for Ideal customer snapshots (Core + Pro deterministic). */
export function idealCustomerNarratorCue(narrator: BrandNarrator): string {
  const narratorId: NarratorId = narrator || 'solo_expert'
  return IDEAL_CUSTOMER_NARRATOR_CUE[narratorId]
}

function idealCustomerBriefBody(
  step2: IdentityKitForm['step2'],
  narrator: BrandNarrator,
  industry: string,
): string {
  const narratorId: NarratorId = narrator || 'solo_expert'
  const parts: string[] = []
  const archetype = step2.customerArchetype.trim()
  if (archetype) {
    parts.push(resolveBuyerArchetypeTitle(archetype, industry))
    parts.push(IDEAL_CUSTOMER_NARRATOR_CUE[narratorId])
  }
  if (step2.painPoints?.trim()) parts.push(`Pain points: ${step2.painPoints.trim()}`)
  if (step2.desiredOutcomes?.trim()) parts.push(`Desired outcomes: ${step2.desiredOutcomes.trim()}`)
  return parts.join(' ') || 'Customer profile not specified on intake.'
}

function valuesBriefBody(step4: IdentityKitForm['step4']): string {
  const bullets = step4.values.map((v) => `• ${capitalize(v)}`).join('\n')
  const mission = step4.missionStatement?.trim()
  if (!bullets && !mission) return 'Values not specified on intake.'
  if (mission) return bullets ? `${bullets}\n\nMission: ${mission}` : `Mission: ${mission}`
  return bullets
}

/**
 * Directional positioning guidance for Core customers who provided no differentiation text.
 * References what typically creates meaningful difference for this narrator type.
 */
const DIFFERENTIATION_NARRATOR_FALLBACK: Record<NarratorId, string> = {
  solo_expert:
    'For a solo expert brand, differentiation most often lives in the specificity of who you work with, how you work, and what you have personally seen and solved. Use this Brief to develop that positioning.',
  solo_maker:
    'For a maker brand, differentiation usually comes from process, materials, or the person behind the work. Use this Brief as the place to articulate that edge.',
  local_team:
    'For a local business, differentiation often comes from relationships, presence, and the things a chain or national brand genuinely cannot replicate. Use this Brief to name yours.',
  product_led:
    'For a product-led brand, differentiation lives in what the product does differently, what it is made of, or who it is really built for. Use this Brief to sharpen that argument.',
  mission_community:
    'For a mission-driven brand, differentiation often comes from who you serve, how you report impact, and what makes your community trust you over larger or less transparent organizations.',
}

function differentiationBriefBody(step7: IdentityKitForm['step7'], narrator: BrandNarrator): string {
  const narratorId: NarratorId = narrator || 'solo_expert'
  const diff = step7.differentiation?.trim()
  const hasCompetitors = step7.competitors.length > 0
  if (hasCompetitors && diff) {
    return `Compared with ${step7.competitors.join(', ')}. ${diff}`
  }
  if (hasCompetitors && !diff) {
    return `${DIFFERENTIATION_NARRATOR_FALLBACK[narratorId]}\n\nNamed competitors: ${step7.competitors.join(', ')}.`
  }
  if (diff) return diff
  return DIFFERENTIATION_NARRATOR_FALLBACK[narratorId]
}

/**
 * One sentence per origin archetype that bridges the founding story to a current
 * positioning asset — what that origin means for trust, credibility, or appeal now.
 */
const ORIGIN_TRUST_SIGNAL: Record<string, string> = {
  side_hustle_leap:
    'That transition is proof of commitment. Customers trust people who bet on their own work.',
  industry_insider:
    'Deep prior experience is a credibility shortcut. It lets the brand skip the apprenticeship narrative.',
  problem_solver:
    'Building to solve a real gap makes the product its own best argument. The origin is the pitch.',
  creative_calling:
    'A calling gives the brand intrinsic motivation that shows in the work. Customers feel the difference.',
  fresh_start:
    'A deliberate fresh start signals clarity of purpose. This brand exists because the founder chose it.',
}

function brandStoryBriefBody(step5: IdentityKitForm['step5']): string {
  const originAngle = originLabels[step5.originArchetype] ?? step5.originArchetype
  const trustSignal = ORIGIN_TRUST_SIGNAL[step5.originArchetype]
  const parts = [originAngle, trustSignal, step5.originSummary?.trim(), step5.motivation?.trim()].filter(
    Boolean,
  ) as string[]
  return parts.join(' ') || 'Origin story not specified on intake.'
}

/** Deterministic scaffold for `brief.idealCustomer` (`ai_enhanced`). */
export function briefIdealCustomerScaffold(form: IdentityKitForm): string {
  const block = brandBriefBlocks(form).find((b) => b.heading === 'Ideal customer')
  return block?.body ?? 'Customer profile not specified on intake.'
}

export function brandBriefBlocks(form: IdentityKitForm): Block[] {
  const { step1, step2, step4, step5, step7 } = form
  const profile = getNarratorProfile(step1.brandNarrator)
  const industry = industryLabels[step1.industry] ?? step1.industry
  const stage = stageLabels[step1.stage] ?? step1.stage
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const transformationLine = customerFacingTransformationLine(form) || assembleTransformationLine(step1.transformation, step1.industry)

  const coreBlocks: Block[] = [
    { heading: 'Brand overview', body: `${step1.businessName}: ${offerLine} (${industry}, ${stage}).` },
    { heading: 'Ideal customer', body: idealCustomerBriefBody(step2, step1.brandNarrator, step1.industry) },
    { heading: 'Core transformation', body: transformationLine },
    { heading: 'Values', body: valuesBriefBody(step4) },
    { heading: 'Brand story angle', body: brandStoryBriefBody(step5) },
    { heading: 'Differentiation', body: differentiationBriefBody(step7, step1.brandNarrator) },
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
    'Consistency across the places people discover you, compare options, and say yes is where a visual direction becomes a recognizable brand',
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
  const channelPlan = resolveChannelPlan(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const palette = form.step6.selectedPalette || 'your selected palette'
  const style = form.step6.selectedStyle || 'your selected style'

  const channelList = channelPlan.all.join(', ')
  const goalLine =
    primaryGoal === 'direct_sales'
      ? 'Keep conversion friction low: make your primary offer and next step obvious at first glance.'
      : primaryGoal === 'lead_gen'
        ? 'Prioritize inquiry flow: every profile and page should point clearly to a quote, consult, or contact action.'
        : primaryGoal === 'audience_growth'
          ? 'Prioritize consistency and discoverability: make recurring content formats and profile value proposition easy to recognize.'
          : 'Prioritize relationship depth: keep messaging consistent for returning customers across updates, email, and profile touchpoints.'
  return [
    `Start with ${channelPlan.primary}: apply your palette (${palette}) and style direction (${style}) to your profile, cover image, and any pinned content.`,
    channelPlan.primaryBucket ? PRIMARY_BUCKET_NOTE[channelPlan.primaryBucket] : 'Prioritize consistency on your main channel first before expanding.',
    `Extend to ${channelList}: keep colors, typography feel, and image style consistent across all active touchpoints.`,
    goalLine,
    `Keep product photos and brand imagery on a backdrop that matches your style direction — light and neutral for minimal styles, textured or warm for organic or earthy directions.`,
    `When in doubt, use your primary palette color for any branded headers or call-to-action elements.`,
  ].join('\n')
}

/** Second paragraph when the customer already named a typeface—conversational, no bullets. */
const typographyComplementExisting: Record<string, string> = {
  clean_minimal:
    'For a minimal direction, think in terms of one cleaner typeface for everyday reading and one softer typeface for titles. The two specimens above show that split. Map the same jobs onto your licensed files in production.',
  bold_graphic:
    'This direction still wants a bold display face up top and patient body copy for long reads. Use the samples as a hierarchy reference even when your display face is more expressive than the body face shown.',
  organic_natural:
    'An organic direction usually works best with calm body reading and a more expressive display face. Let the specimens guide how heavy each face feels next to the other.',
  luxe_refined:
    'Refined systems usually lead with serif display and keep a crisp sans for everything functional. Align your existing face with whichever role it already plays, then mirror the contrast shown above.',
}

const typographyComplementExistingFallback = typographyComplementExisting.clean_minimal

/** Pro-only: Core kits do not collect `existingTypeface`; ignore stray values so PDFs stay consistent. */
export function typographyHonorsExistingTypeface(form: IdentityKitForm): boolean {
  return form.tier === 'pro' && Boolean(form.step6.existingTypeface?.trim())
}

export type TypographySpecimenSlot = {
  /** Registered React-PDF / `Font.register` family name (Google Fonts). */
  pdfFamily: string
  roleEyebrow: string
  faceLabel: string
  /** Optional note below Regular/Bold/Italic rows on the primary specimen (packaging / physical contexts). */
  wordmarkNoteAfterWeights?: string
}

function googleFontSpecimenHref(family: string): string {
  return `https://fonts.google.com/specimen/${family.replace(/\s+/g, '+')}`
}

/** Google Fonts download links for the active recipe (dedupes system pairings). */
export function typographyDownloadLinks(form: IdentityKitForm): { label: string; href: string }[] {
  const { primaryFont, secondaryFont } = resolveTypographyPair(getRecipeForProfile(form))
  const out: { label: string; href: string }[] = []
  const push = (family: string) => {
    if (out.some((x) => x.label === family)) return
    out.push({ label: family, href: googleFontSpecimenHref(family) })
  }
  push(primaryFont.family)
  push(secondaryFont.family)
  return out
}

function specimenRoleBandLabel(role: string): string {
  const t = role.trim()
  return (t.length > 0 ? t : 'Typeface').toUpperCase()
}

/**
 * Ordered PDF specimen slots — families and roles come from `typographyRecipes` for this intake.
 */
export function typographySpecimenSlots(form: IdentityKitForm): TypographySpecimenSlot[] {
  const recipe = getRecipeForProfile(form)
  const resolved = resolveTypographyPair(recipe)
  const a = resolved.primaryFont
  const b = resolved.secondaryFont
  const roleA = recipe.pair.primaryRole
  const roleB = recipe.pair.secondaryRole

  /** Left → right: primary (display/headlines) then secondary (body/supporting) — matches kit hierarchy and injected “X and Y” name order. */
  const primarySlot: TypographySpecimenSlot = {
    pdfFamily: a.family,
    roleEyebrow: specimenRoleBandLabel(roleA),
    faceLabel: a.family,
  }
  const secondarySlot: TypographySpecimenSlot = {
    pdfFamily: b.family,
    roleEyebrow: specimenRoleBandLabel(roleB),
    faceLabel: b.family,
  }

  const slots: TypographySpecimenSlot[] = [primarySlot, secondarySlot]

  if (!typographyHonorsExistingTypeface(form)) {
    const { typographyContext } = computeBrandProfile(form)
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
function injectTypographyLeadFamilies(text: string, primaryFamily: string, secondaryFamily: string): string {
  if (primaryFamily === secondaryFamily) {
    return text
      .replace(/Inter and Source Serif 4/g, primaryFamily)
      .replace(/Source Serif 4 and Inter/g, primaryFamily)
      .replace(/\bSource Serif 4\b/g, primaryFamily)
      .replace(/\bInter\b/g, primaryFamily)
  }
  /* Matrix copy uses “Source Serif 4” for display (primary) and “Inter” for body (secondary). Paired phrases list primary then secondary for left-to-right columns. */
  return text
    .replace(/Inter and Source Serif 4/g, `${primaryFamily} and ${secondaryFamily}`)
    .replace(/Source Serif 4 and Inter/g, `${primaryFamily} and ${secondaryFamily}`)
    .replace(/\bSource Serif 4\b/g, primaryFamily)
    .replace(/\bInter\b/g, secondaryFamily)
}

export function typographySectionLead(form: IdentityKitForm): string {
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  if (typographyHonorsExistingTypeface(form)) {
    const existing = form.step6.existingTypeface?.trim() ?? ''
    return `You are already using ${existing}. What follows shows how one cleaner everyday typeface and one more expressive heading typeface can divide regular, bold, and italic roles. Map those jobs onto your licensed fonts.`
  }
  const { typographyContext } = computeBrandProfile(form)
  const byStyle = typographySectionLeads[typographyContext]
  const raw = byStyle[styleKey] ?? typographySectionLeads.professional_and_digital.clean_minimal
  const sub = substituteProfessionalDigitalLinkedIn(raw, typographyContext, form)
  const { primaryFont, secondaryFont } = resolveTypographyPair(getRecipeForProfile(form))
  return injectTypographyLeadFamilies(sub, primaryFont.family, secondaryFont.family)
}

/** Display/primary family first, body/secondary second (matches `typographySpecimenSlots` and injected “X and Y” order). */
export function typographySpecimenFamilies(form: IdentityKitForm): [string, string] {
  const { primaryFont, secondaryFont } = resolveTypographyPair(getRecipeForProfile(form))
  return [primaryFont.family, secondaryFont.family]
}

/** Split for PDF layout: links + licensing share one row; other copy above/below. */
export function typographyFooterParts(form: IdentityKitForm): {
  licensing: string
  leadParagraphs: string[]
  trailParagraphs: string[]
} {
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  const { typographyContext } = computeBrandProfile(form)
  const licensing = typographyLicensingLines[typographyContext]

  if (typographyHonorsExistingTypeface(form)) {
    const complement = typographyComplementExisting[styleKey] ?? typographyComplementExistingFallback
    return {
      licensing,
      leadParagraphs: [
        'Keep your existing face wherever it is established unless you are intentionally rebranding. That continuity is part of recognition.',
        complement,
        'If one family already covers both display and body, use size and hierarchy before you add another typeface.',
      ],
      trailParagraphs: [],
    }
  }

  return { licensing, leadParagraphs: [], trailParagraphs: [] }
}

function typographyRecommendationsBody(form: IdentityKitForm): string {
  const { licensing, leadParagraphs, trailParagraphs } = typographyFooterParts(form)
  if (leadParagraphs.length > 0) {
    return [...leadParagraphs, licensing].join('\n\n')
  }
  const tail = trailParagraphs.filter(Boolean)
  return tail.length > 0 ? [licensing, ...tail].join('\n\n') : licensing
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
  const paletteDesc = formatPaletteLeadSentence(step6.selectedPalette)
  const styleDesc = formatStyleLeadSentence(step6.selectedStyle)
  const voiceVisualBridge = styleGuideVisualVoiceBridge(form.step3.tonePreset, step6.selectedStyle)
  const visualBody = [
    styleDesc,
    voiceVisualBridge,
    visualDirectionLogoParagraph(stageContext === 'protecting_recognition'),
  ].join('\n\n')

  const visualNotes = step6.visualNotes?.trim()
  const legacyNotes = [step6.colorMoodNotes?.trim(), step6.styleNotes?.trim()].filter(Boolean).join(' ')
  const notesText = visualNotes || legacyNotes
  const notesExtra = notesText ? `\n\nAdditional notes: ${notesText}` : ''

  return [
    { heading: 'Palette', body: `${paletteDesc}${notesExtra}` },
    { heading: 'Visual direction', body: visualBody },
    { heading: 'Typography', body: typographyRecommendationsBody(form) },
    { heading: 'Style principles', body: stylePrinciplesBody(form) },
    { heading: 'Do / avoid', body: styleDoAvoidBody(form) },
    { heading: 'Imagery direction', body: styleGuideImageryDirectionBody(form) },
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
    'warm and human, welcoming without trying too hard',
  )
  const playWord = sliderLabel(
    voiceSliders.playfulness,
    'serious and grounded',
    'occasionally light, with dry wit when it fits',
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
    `This brand sounds ${base}: ${energyWord} and ${warmthWord}. ` +
    `The writing style is ${formalWord}, ${directWord}, and ${playWord}. ` +
    `Whether it's a social caption, an email, or a product description, the tone should feel consistent and recognizable as the same business every time.`

  const visualClosing = voicePlaybookToneVisualClosing(tonePreset, step6.selectedStyle)
  const industryVoice = getIndustryVoiceProfile(form.step1.industry)
  return `${main} ${visualClosing} ${industryVoice.toneModifier}`
}

function voiceGuardrailsBody(form: IdentityKitForm): string {
  const { step3, step4 } = form
  const { tonePreset, voiceSliders } = step3

  // Value-keyed dos come first — these are the most intentional choices the customer
  // made, so they should not be crowded out by generic tone/slider lines.
  const dos: string[] = []
  const donts: string[] = []

  if (step4.values.includes('clarity')) {
    dos.push('Say the simple thing first, then elaborate if needed')
  }
  if (step4.values.includes('craftsmanship')) {
    dos.push('Word choice reflects quality — write with as much care as the work itself')
  }
  if (step4.values.includes('growth')) {
    dos.push('End on action — every piece of content should have a clear next step')
  }

  // Tone preset and slider lines follow — add up to the cap of 4.
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

  const transformationLine = assembleTransformationLine(form.step1.transformation, form.step1.industry).replace(
    /\.$/,
    '',
  )

  const framing =
    'Messaging themes are recurring topics and angles: the ideas you keep coming back to in bios, longer posts, emails, listings, and about copy. They are not your tone (that is Tone profile and Voice guardrails) and not the same as your closing ask (that belongs in Calls to action (CTAs) below). Use the lines below to stay specific to your narrator, your industry, and the transformation you promise, not generic quality claims.'

  // Theme lines: narrator categories + industry + transformation (deterministic structure)
  const themeLines = [
    `${capitalize(themes[0] ?? 'your expertise')}: in ${industry}, anchor this angle in what only your brand does or sees, not empty superlatives.`,
    `${capitalize(themes[1] ?? 'your process')}: show how the work happens in ${industry}: steps, craft, proof, or choices that back the story.`,
    `The transformation you repeat: ${transformationLine}.`,
  ]

  if (themes[2]) {
    themeLines.push(
      `${capitalize(themes[2])}: thread this through your channels so ${industry} audiences recognize the through-line.`,
    )
  }

  const pref = iv.preferredTerms.slice(0, 5).join(', ')
  const avoid = iv.avoidTerms.slice(0, 6).join(', ')
  themeLines.push(
    '',
    `Industry vocabulary: lean on terms your audience already trusts (${pref}).`,
    `Steer around phrasing that reads off-brand or risky here: ${avoid}.`,
  )

  return [framing, '', ...themeLines].join('\n')
}

function samplePhrasesBody(form: IdentityKitForm): string {
  const profile = getNarratorProfile(form.step1.brandNarrator)
  const iv = getIndustryVoiceProfile(form.step1.industry)
  const t0 = iv.preferredTerms[0] ?? 'results'
  const t1 = iv.preferredTerms[1] ?? 'process'
  const t2 = iv.preferredTerms[2] ?? 'how we work'

  const soloExpertPhrasesCommerce: string[] = [
    '"Here\'s what I\'ve learned shipping this myself..."',
    '"The detail I obsess over so you don\'t have to:"',
    '"If you\'re comparing options, here\'s what actually matters..."',
    '"I built this for people who want [outcome] without the usual tradeoffs."',
    '"New drop — here\'s the story behind this one."',
    '"Tap through when you want the full breakdown."',
  ]

  const soloExpertPhrasesService: string[] = [
    '"Here\'s what I\'ve seen work with clients like you..."',
    '"Let me walk you through this."',
    '"The thing most people miss about [topic] is..."',
    '"I work with [audience] who are ready to [outcome]."',
    '"After years in this work, here\'s my honest take:"',
    '"Book a call — let\'s figure out if this is the right fit."',
  ]

  const byNarrator: Record<NarratorId, string[]> = {
    solo_expert: soloExpertCommerceLean(form) ? soloExpertPhrasesCommerce : soloExpertPhrasesService,
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
    `"When we talk about ${t0}, we mean ${t1}. Here's what that looks like for you."`,
    `"Ask about ${t1} and ${t2}; that's where we put our focus."`,
  ]

  const usageNote =
    'These lines illustrate voice and rhythm. Use them in body copy, intros, and proof. They mix openers, specifics, and sometimes a natural close; not every line belongs as the last line of a post or profile. For your actual ask (shop, book, follow, etc.), use Calls to action (CTAs) below.'

  const bullets = [...phrases.map((p) => `• ${p}`), ...industryPhrases.map((p) => `• ${p}`)].join('\n')
  return `${usageNote}\n\n${bullets}`
}

function writingDoAvoidBody(form: IdentityKitForm): string {
  const { step3 } = form
  const { tonePreset, voiceSliders } = step3

  const dos: string[] = [
    'Read every line out loud before publishing — if it sounds strange spoken, rewrite it',
    'Keep paragraphs to 2–3 sentences max on any digital channel',
    'When you finish a piece, one clear ask beats a list. Align it with Calls to action (CTAs) above.',
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

/** Parsed in Voice Playbook PDF as: definition (anchor pull quote) | relevance | bullet list. */
export const VOICE_PLAYBOOK_CTA_BODY_SPLIT = '\n\n---\n\n'

export function voicePlaybookCtaBody(form: IdentityKitForm): string {
  const channelPlan = resolveChannelPlan(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const ch = channelPlan.primary

  const definition =
    'The line or button that asks the reader to do one specific thing next: shop, book, follow, message you, sign up, or similar. Your messaging themes above are what you keep talking about. Your CTAs are what you ask people to do when they are ready to move.'

  let relevance: string
  let exampleLines: string[]

  if (primaryGoal === 'direct_sales') {
    relevance = `For this brand, your stated goal is direct sales. Aim every short piece on ${ch} at one concrete action. Keep the last line specific, and avoid stacking several competing asks.`
    exampleLines = [
      '"Shop now" with your real product or service filled in',
      '"Book now"',
      '"Order today"',
    ]
  } else if (primaryGoal === 'lead_gen') {
    relevance = `For this brand, your stated goal is leads. Keep CTAs on ${ch} easy to act on. Match the wording to how people actually hire or buy from you. Use one CTA per short piece.`
    exampleLines = ['"Get a quote"', '"Book a consult"', '"Request details"']
  } else if (primaryGoal === 'audience_growth') {
    relevance = `For this brand, your stated goal is audience growth. Use ${ch} to invite people to stay connected. Pair CTAs with value so the follow feels earned, not noisy.`
    exampleLines = ['"Follow for…" and finish with what they get', '"Save this"', '"Share this"']
  } else {
    relevance = `For this brand, your stated goal is bringing customers back. Use ${ch} to nudge the next visit or purchase. Sound helpful, not pushy.`
    exampleLines = ['"Reorder"', '"Book your next session"', '"Stay updated"']
  }

  const bullets = exampleLines.map((line) => `• ${line}`).join('\n')
  return [definition, relevance, bullets].join(VOICE_PLAYBOOK_CTA_BODY_SPLIT)
}

/** Depth Voice Playbook: principles without paste-ready example bullets (guide Examples owns those). */
export function voicePlaybookCtaBodyForDepth(form: IdentityKitForm): string {
  const parts = voicePlaybookCtaBody(form).split(VOICE_PLAYBOOK_CTA_BODY_SPLIT)
  const definition = parts[0]?.trim() ?? ''
  const relevance = parts[1]?.trim() ?? ''
  return [
    definition,
    relevance,
    'For copy-ready lines and in-context examples, open Brand Identity Guide → Examples.',
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function voicePlaybookBlocks(form: IdentityKitForm): Block[] {
  const { step3 } = form
  const blocks: Block[] = [
    { heading: 'Tone profile', body: toneProfileBody(form) },
    { heading: 'Voice guardrails', body: voiceGuardrailsBody(form) },
    { heading: 'Messaging themes', body: narratorMessagingThemes(form) },
    { heading: 'Sample phrases', body: samplePhrasesBody(form) },
    { heading: 'Calls to action (CTAs)', body: voicePlaybookCtaBody(form) },
    { heading: 'Writing do / avoid', body: writingDoAvoidBody(form) },
    { heading: 'Before / after examples', body: voicePlaybookBeforeAfterBody(form) },
  ]

  if (step3.customVoiceNotes?.trim()) {
    blocks.push({ heading: 'Custom voice notes', body: step3.customVoiceNotes.trim() })
  }

  return blocks
}

// ---------------------------------------------------------------------------
// Quick Start helpers
// ---------------------------------------------------------------------------

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
  const channelPlan = resolveChannelPlan(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const primaryChannel = channelPlan.primary
  const secondaryChannel = channelPlan.secondary
  const multiChannel = hasSecondSelectedChannel(form)

  const byNarrator: Record<NarratorId, string[]> = {
    solo_expert: [
      `Update your ${primaryChannel} headline or profile summary using your one-line summary from the guide (Summary)`,
      `Rewrite your ${primaryChannel} short description using the Summary section of your guide`,
      touchpointsIncludeEmail(form)
        ? 'Update your email signature with your business name and one clear call to action'
        : 'Add or confirm your booking or contact link is visible on your primary profile',
      ...(multiChannel
        ? [`Refresh your ${secondaryChannel} headline or bio to match your brand positioning`]
        : []),
      'Add a consistent profile photo or branded avatar on your primary channel',
    ],
    solo_maker: [
      `Update your ${primaryChannel} bio using a line from the guide (Summary or Examples)`,
      `Rewrite your ${primaryChannel} "About" section using voice rules from the guide (Voice)`,
      'Update your cover photo and banner using colors from the guide (Look)',
      `Refresh your first featured ${primaryChannel} listing or post using a sample line from the guide (Examples)`,
      'Add a consistent profile photo or branded avatar across all platforms',
    ],
    local_team: [
      `Update your ${primaryChannel} profile description using your Summary lines from the guide`,
      'Add current photos that match the visual keywords in the guide (Look)',
      'Confirm your business name, hours, and address are accurate and consistent',
      'Respond to any unanswered reviews using your brand voice',
      ...(multiChannel
        ? [`Update your ${secondaryChannel} "About" section to match your primary profile copy`]
        : []),
    ],
    product_led: [
      `Update your ${primaryChannel} headline and subheadline using your Summary one-line from the guide`,
      'Rewrite your product description lead using a sample line from the guide (Examples)',
      ...(multiChannel
        ? [`Update your ${secondaryChannel} bio using a short line from the guide (Examples)`]
        : []),
      'Audit your product photos — do they reflect your style direction?',
      "Add one clear CTA link (shop, try, or learn more) everywhere it's missing",
    ],
    mission_community: [
      `Update your ${primaryChannel} "About" section using Personality or Summary from the guide`,
      touchpointsIncludeEmail(form)
        ? 'Rewrite your email newsletter header using a line from the guide (Voice or Examples)'
        : 'Update your social bio to match your positioning from the guide (Summary)',
      ...(multiChannel
        ? [`Add your impact statement to your ${secondaryChannel} homepage or profile`]
        : []),
      'Confirm CTA language is consistent on every channel you selected (e.g. "Get involved" or "Support us")',
    ],
  }

  const bucketKickoff =
    channelPlan.primaryBucket === 'online_directory'
      ? `Complete every field on ${primaryChannel} (hours, services, contact details, and imagery) before adding new channels`
      : channelPlan.primaryBucket === 'marketplace'
        ? `Audit your top ${primaryChannel} listings for headline clarity, image consistency, and trust-building details`
        : channelPlan.primaryBucket === 'owned_channel'
          ? `Strengthen your ${primaryChannel} first-touch experience (hero section, CTA, and brand anchor placement)`
          : `Publish one high-quality branded update on ${primaryChannel} before expanding your weekly cadence`

  const goalKickoff =
    primaryGoal === 'direct_sales'
      ? `Clarify the conversion path on ${primaryChannel}: make the offer and next action clear in the first screen.`
      : primaryGoal === 'lead_gen'
        ? `Set one primary lead action on ${primaryChannel} (quote, consult, or inquiry) and remove competing CTAs.`
        : primaryGoal === 'audience_growth'
          ? `Choose one repeatable content format on ${primaryChannel} so people know what to expect from you.`
          : `Add one repeat-customer message on ${primaryChannel} (update, reminder, or reorder note).`

  let narratorTaskLines = byNarrator[profile.narrator_id as NarratorId] ?? byNarrator.solo_expert
  if (profile.narrator_id === 'solo_expert' && soloExpertCommerceLean(form)) {
    narratorTaskLines = [
      `Update your ${primaryChannel} shop headline or profile summary using your guide Summary one-line`,
      `Rewrite your ${primaryChannel} shop or profile intro using voice rules from the guide (Voice)`,
      touchpointsIncludeEmail(form)
        ? 'Update your email signature with your business name and one clear call to action'
        : 'Update your cover photo and banner image to reflect your palette direction',
      `Refresh your first featured ${primaryChannel} listing or pinned post using a line from the guide (Examples)`,
      'Add a consistent profile photo or branded avatar across your key surfaces',
    ]
  }
  if (profile.narrator_id === 'local_team') {
    narratorTaskLines = [
      `Update your ${primaryChannel} profile description using your guide Summary lines`,
      'Add current photos that reflect your visual style direction',
      touchpointsIncludeOnlineDirectory(form)
        ? 'Confirm your business name, hours, and address are accurate and consistent'
        : 'If you list hours, a location, or service area on any public profile, keep those details consistent with your website.',
      'Respond to any unanswered reviews using your brand voice',
      ...(multiChannel
        ? [`Update your ${secondaryChannel} "About" section to match your primary profile copy`]
        : []),
    ]
  }

  if (form.step1.guideFocus === 'look_more_professional') {
    const voiceLine = `Apply one Voice rule from the guide to your ${primaryChannel} bio or profile description`
    narratorTaskLines = [voiceLine, ...narratorTaskLines.slice(0, 4)]
  }

  const items = [bucketKickoff, goalKickoff, ...narratorTaskLines]
  return items.map((i) => `☐ ${i}`).join('\n')
}

function week2Items(form: IdentityKitForm): string {
  const channelPlan = resolveChannelPlan(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const primaryChannel = channelPlan.primary
  const secondChannel = channelPlan.secondary
  const multiChannel = hasSecondSelectedChannel(form)

  const crossChannelTask =
    channelPlan.secondaryBucket === 'online_directory'
      ? `Use the same core message on ${secondChannel} in your business details and review replies`
      : channelPlan.secondaryBucket === 'marketplace'
        ? `Use the same core message on ${secondChannel} in listing intros and product bullet points`
        : channelPlan.secondaryBucket === 'owned_channel'
          ? `Use the same core message on ${secondChannel} page copy and CTA wording`
          : `Use the same core message on ${secondChannel} bios and profile sections`

  const goalSpecificTask =
    primaryGoal === 'direct_sales'
      ? `Publish one post on ${primaryChannel} with a clear buy or book CTA.`
      : primaryGoal === 'lead_gen'
        ? `Publish one post on ${primaryChannel} with a clear consult/quote CTA and tell people when you'll reply.`
        : primaryGoal === 'audience_growth'
          ? `Publish one post on ${primaryChannel} designed for saves/shares and include a follow prompt.`
          : `Publish one update on ${primaryChannel} for existing customers with one clear next step.`

  const voiceRefreshLine =
    channelPlan.primaryBucket === 'marketplace'
      ? `Use your Voice rules on ${primaryChannel}: update 2–3 listing titles or descriptions`
      : channelPlan.primaryBucket === 'owned_channel'
        ? `Use your Voice rules on ${primaryChannel}: rewrite key page copy and one featured section`
        : channelPlan.primaryBucket === 'online_directory'
          ? `Use your Voice rules on ${primaryChannel}: rewrite your business description and service details`
          : `Use your Voice rules on ${primaryChannel}: rewrite your bio and refresh 2–3 recent posts`

  const whatIDoLine =
    channelPlan.primaryBucket === 'marketplace'
      ? `Rewrite a short "what I offer" line for your top ${primaryChannel} listing using your Summary`
      : channelPlan.primaryBucket === 'owned_channel'
        ? `Draft a homepage or landing hero line using your Summary one-liner`
        : channelPlan.primaryBucket === 'online_directory'
          ? `Update your ${primaryChannel} services and specialties using your Summary`
          : `Draft a simple "what I do" post for ${primaryChannel} using an Examples line`

  const signatureOrProfileLine = touchpointsIncludeEmail(form)
    ? 'Update your email signature or auto-reply with a line from the guide (Examples)'
    : `Add a summary line from the guide (Summary) to your ${primaryChannel} profile, bio, or pinned post`

  const upcomingLine =
    channelPlan.primaryBucket === 'marketplace'
      ? 'Plan your next 3 listing updates and draft them using Voice topics from your guide'
      : 'Plan your next 3 posts and draft them using Voice topics from your guide'

  const items = [
    voiceRefreshLine,
    goalSpecificTask,
    whatIDoLine,
    ...(multiChannel
      ? [
          `Apply the same Voice rules on ${secondChannel}: update the bio or description to match your primary channel.`,
          crossChannelTask,
        ]
      : []),
    signatureOrProfileLine,
    upcomingLine,
  ]

  return items.map((i) => `☐ ${i}`).join('\n')
}

/** Labels for channels the customer actually selected (no narrator fallback extras). */
function userActiveChannelLabels(form: IdentityKitForm): string[] {
  const selected = normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? [])
  if (selected.length === 0) return resolveChannelPlan(form).all
  return selected.map((id) => getTouchpointLabel(id).trim()).filter(Boolean)
}

function channelRolloutChecklistLines(form: IdentityKitForm): string[] {
  const { stageContext } = computeBrandProfile(form)
  const channelPlan = resolveChannelPlan(form)
  const activeChannels = userActiveChannelLabels(form)
  const lines = [
    `Apply your palette and style direction to ${channelPlan.primary} first: profile, cover or banner, and pinned or hero content.`,
    `Match the same visual feel across ${activeChannels.join(', ')} before adding new channels.`,
  ]
  if (stageContext === 'starting_fresh') {
    lines.push('Finish one channel completely before spreading the same look everywhere else.')
  } else if (stageContext === 'protecting_recognition') {
    lines.push('Update in small steps so returning customers still recognize you.')
  }
  return lines
}

function appendExpandSection(taskBlock: string, form: IdentityKitForm): string {
  const expand = quickStartExpandSectionBlock(form)
  if (!expand) return taskBlock
  return `${taskBlock}\n\n${expand}`
}

function week3Items(form: IdentityKitForm): string {
  const { touchpointCluster } = computeBrandProfile(form)
  const rollout = channelRolloutChecklistLines(form)
  const items = [...rollout, ...buildWeek3Checklist(form, touchpointCluster)]
  const tasks = items.map((i) => `☐ ${i}`).join('\n')
  return appendExpandSection(tasks, form)
}

function week4Items(form: IdentityKitForm): string {
  const channelPlan = resolveChannelPlan(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const allChannels = channelPlan.all.join(', ')

  const handoffLine =
    form.step1.guideFocus === 'give_clear_direction'
      ? `Share your Brand Identity Guide PDF with whoever owns ${channelPlan.primary} day to day — highlight the Voice and Examples sections they should follow.`
      : 'Share your Brand Identity Guide PDF with anyone who helps you create content'

  const items = [
    `Review your selected channels (${allChannels}): do they sound like the same brand?`,
    'Check that your brand colors appear consistently everywhere — cover images, profile photos, posts',
    'Check that your CTA wording has the same tone across all channels',
    'Write down 3 places that still need updates and schedule them for next month',
    handoffLine,
    `Confirm your weekly content and CTA pattern still supports ${PRIMARY_GOAL_LABELS[primaryGoal]}.`,
  ]

  const tasks = items.map((i) => `☐ ${i}`).join('\n')
  return appendExpandSection(tasks, form)
}

export function quickStartBlocks(form: IdentityKitForm): Block[] {
  const channelPlan = resolveChannelPlan(form)
  const primaryChannel = channelPlan.primary

  const weekBody = (week: 1 | 2 | 3 | 4, taskBlock: string, lead: string) =>
    `${lead}\n\n${quickStartWeekGuidePointer(week, form)}\n\n${taskBlock}`

  return [
    { heading: 'Your kit', body: composeQuickStartKitIntro() },
    {
      heading: 'Week 1',
      body: weekBody(1, week1Items(form), `Set up your brand on ${primaryChannel} first.`),
    },
    {
      heading: 'Week 2',
      body: weekBody(
        2,
        week2Items(form),
        `Apply your voice on ${primaryChannel} first, then match it across your other active channels.`,
      ),
    },
    {
      heading: 'Week 3',
      body: weekBody(
        3,
        week3Items(form),
        `Roll out visuals on ${primaryChannel} first, then match the same look elsewhere.`,
      ),
    },
    {
      heading: 'Week 4',
      body: weekBody(
        4,
        week4Items(form),
        `Audit ${primaryChannel} first, then clean up anything that still feels inconsistent elsewhere.`,
      ),
    },
  ]
}
