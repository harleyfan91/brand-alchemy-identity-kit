import {
  assembleOfferLine,
  resolveOfferSelections,
  resolveTransformationSelections,
  type IdentityKitForm,
} from '@identity-kit/shared'

import type { TouchpointCluster } from './brandProfile.js'
import { computeBrandProfile } from './brandProfile.js'
import { getIndustryVoiceProfile } from './industryProfiles.js'
import { getNarratorProfile } from './narratorProfiles.js'

type TonePreset = 'friendly' | 'professional' | 'bold'
type BeforeAfterPair = { label: string; before: string; after: string }
type RewriteScenario =
  | 'social_hook'
  | 'visit_or_listing'
  | 'service_intro'
  | 'profile_or_bio'
  | 'product_or_listing_proof'
  | 'mission_invite'

type RewriteContext = {
  tone: TonePreset
  businessName: string
  offerLine: string
  offerLabel: string
  audienceLabel: string
  beforeState: string
  afterState: string
  mechanism: string
  narratorId: ReturnType<typeof getNarratorProfile>['narrator_id']
  trustedPrimary: string
  trustedSecondary: string
  directness: number
  touchpointCluster: TouchpointCluster
  primaryGoal: IdentityKitForm['step1']['primaryGoal']
  primaryTouchpoint: string
}

const STYLE_IMAGERY_CORE: Record<string, string> = {
  clean_minimal:
    'Imagery should feel calm and intentional: soft light, generous space, and backgrounds that stay quiet so your subject or product reads first. Busy patterns and heavy filters fight this direction.',
  bold_graphic:
    'Visuals can carry strong contrast, clear shapes, and decisive cropping; poster energy is fine in the feed. Color blocks and type should feel as intentional as the photograph itself.',
  organic_natural:
    'Photographs should feel warm, tactile, and real, with natural textures, soft or earthy light, and honest imperfection. Icy studio polish usually reads corporate instead of handmade.',
  luxe_refined:
    'Imagery stays restrained and elevated: controlled palettes, refined composition, and quality over quantity. Every frame should feel considered, never loud or cluttered.',
}

const CLUSTER_IMAGERY_TAIL: Record<TouchpointCluster, string> = {
  physical_first:
    'Carry that mood through what people see on signs, in your space, on packaging, and in hero shots of the real environment, not only in digital templates.',
  social_product:
    'For products, keep backdrops simple so the item and your palette stay the story; posts and listings should look like one brand, shot the same way.',
  social_service:
    'For a professional presence, headshots and cover images should match this direction: specific, not stock-generic, with setting and wardrobe echoing your palette.',
  local_community:
    'Community-facing photos work when they show real people, places, and moments. Authentic beats overly glossy when you are asking people to show up.',
  digital_brand:
    'Website and social heroes should share the same rules: one clear focal point per frame, consistent backdrop language, color that echoes your palette.',
}

const LESS_CONCRETE_TERMS = new Set([
  'reliable',
  'secure',
  'evidence-based',
  'sustainable',
  'gentle',
  'seasonal',
  'made fresh',
  'small batch',
])

function normalizeTone(t: string): TonePreset {
  return t === 'professional' || t === 'bold' ? t : 'friendly'
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function cleanLine(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/\.$/, '')
}

function concreteIndustryTerms(terms: string[]): [string, string] {
  const ranked = terms.filter((term) => !LESS_CONCRETE_TERMS.has(term.toLowerCase()))
  const primary = ranked[0] ?? terms[0] ?? 'specific details'
  const secondary = ranked[1] ?? terms[1] ?? 'process'
  return [primary, secondary]
}

function readableTerm(term: string): string {
  if (term === 'sourced') return 'sourcing'
  return term
}

function offerPhrase(ctx: RewriteContext): string {
  return cleanLine(ctx.offerLabel || ctx.offerLine || 'what we offer')
}

function touchpointLabel(raw: string): string {
  return raw.replace(/_/g, ' ')
}

function goalActionTail(goal: RewriteContext['primaryGoal']): string {
  if (goal === 'direct_sales') return 'Start with an order or visit today.'
  if (goal === 'lead_gen') return 'Book a consult to see if it fits.'
  if (goal === 'audience_growth') return 'Follow along for useful updates.'
  return 'Come back when you are ready for the next step.'
}

function transformationBenefitClause(ctx: RewriteContext): string {
  const after = ctx.afterState.toLowerCase()
  if (after.includes('worth recommending')) return 'makes the stop worth coming back for and recommending'
  if (after.includes('looking forward to the experience')) return 'gives people something to look forward to'
  if (after.includes('taken care of')) return 'makes people feel taken care of'
  if (after.includes('hosting with confidence')) return 'helps people host with confidence'
  if (after.includes('able to explain what makes them different')) return 'makes the difference easier to understand'
  if (after.includes('professional online')) return 'makes the brand feel clear and professional'
  if (after.includes('better-fit clients')) return 'helps the right clients recognize the fit faster'
  if (after.includes('moving with clarity')) return 'makes the next step easier to act on'
  if (after.includes('evidence ready year-round')) return 'keeps the work ready year-round'
  if (after.includes("you'll actually print and frame")) return 'gives people photos they will actually keep'
  if (after.includes('back to normal fast')) return 'gets life back to normal faster'
  if (after.includes('relieved and taken care of')) return 'helps people feel relieved and looked after'
  return 'makes the result easier to trust'
}

function transformationBenefitSentence(ctx: RewriteContext): string {
  return `${ctx.businessName} ${transformationBenefitClause(ctx)}.`
}

function transformationAfter(ctx: RewriteContext): string {
  const offer = offerPhrase(ctx)
  const mechanism = readableTerm(ctx.mechanism)
  const benefit = transformationBenefitClause(ctx)
  const punchier = ctx.tone === 'bold' || ctx.directness >= 67

  if (ctx.narratorId === 'solo_expert') {
    if (punchier && mechanism) return `${ctx.businessName} helps with ${offer}, using ${mechanism}. ${transformationBenefitSentence(ctx)}`
    if (punchier) return `${ctx.businessName} helps with ${offer}. ${transformationBenefitSentence(ctx)}`
    if (mechanism) return `${ctx.businessName} helps with ${offer}, using ${mechanism} that ${benefit}.`
    return `${ctx.businessName} helps with ${offer}, and ${benefit}.`
  }

  if (ctx.narratorId === 'mission_community') {
    if (punchier && mechanism) {
      return `${ctx.businessName} supports people through ${offer}, with ${mechanism}. ${transformationBenefitSentence(ctx)}`
    }
    if (punchier) return `${ctx.businessName} supports people through ${offer}. ${transformationBenefitSentence(ctx)}`
    if (mechanism) return `${ctx.businessName} supports people through ${offer}, with ${mechanism} that ${benefit}.`
    return `${ctx.businessName} supports people through ${offer}, and ${benefit}.`
  }

  if (punchier && mechanism) return `${ctx.businessName} offers ${offer} with ${mechanism}. ${transformationBenefitSentence(ctx)}`
  if (punchier) return `${ctx.businessName} offers ${offer}. ${transformationBenefitSentence(ctx)}`
  if (mechanism) return `${ctx.businessName} offers ${offer} with ${mechanism}, and ${benefit}.`
  return `${ctx.businessName} offers ${offer}, and ${benefit}.`
}

function pickBeforeAfterScenarios(ctx: RewriteContext): [RewriteScenario, RewriteScenario] {
  if (ctx.narratorId === 'solo_maker' && ctx.touchpointCluster === 'physical_first') {
    return ['social_hook', 'visit_or_listing']
  }
  if (ctx.narratorId === 'solo_expert' && ctx.touchpointCluster === 'social_service') {
    return ['service_intro', 'profile_or_bio']
  }
  if (ctx.narratorId === 'mission_community') {
    return ['social_hook', 'mission_invite']
  }
  if (ctx.touchpointCluster === 'local_community' || ctx.narratorId === 'local_team') {
    return ['social_hook', 'visit_or_listing']
  }
  if (ctx.touchpointCluster === 'social_product' || ctx.narratorId === 'product_led') {
    return ['social_hook', 'product_or_listing_proof']
  }
  return ['social_hook', 'profile_or_bio']
}

function scenarioLabel(scenario: RewriteScenario): string {
  switch (scenario) {
    case 'social_hook':
      return 'Social hook rewrite'
    case 'visit_or_listing':
      return 'Visit or listing line rewrite'
    case 'service_intro':
      return 'Service intro rewrite'
    case 'profile_or_bio':
      return 'Profile or bio rewrite'
    case 'product_or_listing_proof':
      return 'Product or listing proof rewrite'
    case 'mission_invite':
      return 'Mission invitation rewrite'
  }
}

function beforeForScenario(scenario: RewriteScenario, ctx: RewriteContext): string {
  const offer = offerPhrase(ctx)
  switch (scenario) {
    case 'social_hook':
      return `We make ${offer}.`
    case 'visit_or_listing':
      return `Stop by for ${offer}.`
    case 'service_intro':
      return `We help clients with ${offer}.`
    case 'profile_or_bio':
      return `Helping people with ${offer}.`
    case 'product_or_listing_proof':
      return `${capitalize(offer)} made with care.`
    case 'mission_invite':
      return 'Support our mission.'
  }
}

function afterForScenario(scenario: RewriteScenario, ctx: RewriteContext): string {
  const offer = offerPhrase(ctx)
  const proofA = ctx.trustedPrimary
  const proofB = readableTerm(ctx.trustedSecondary)
  const channel = touchpointLabel(ctx.primaryTouchpoint || 'your main channel')
  const actionTail = goalActionTail(ctx.primaryGoal)
  const punchier = ctx.tone === 'bold' || ctx.directness >= 67

  switch (scenario) {
    case 'social_hook':
      return transformationAfter(ctx)
    case 'visit_or_listing':
      return `${ctx.businessName} serves ${offer} for ${ctx.audienceLabel}, with ${proofA} and ${proofB} people can trust.`
    case 'service_intro':
      return punchier
        ? `${ctx.businessName} helps people find ${offer} with ${proofA}, ${proofB}, and direct next steps.`
        : `${ctx.businessName} helps people find ${offer} with ${proofA}, ${proofB}, and clear next steps.`
    case 'profile_or_bio':
      return `${ctx.businessName} shows up clearly on ${channel}: ${offer}, ${proofA}, and ${actionTail}`
    case 'product_or_listing_proof':
      return `${capitalize(offer)} with ${proofA} and ${proofB} visible from the start, so people can decide without guessing.`
    case 'mission_invite':
      return `${ctx.businessName} makes the impact visible through ${offer}, with ${proofA} and ${proofB}. ${actionTail}`
  }
}

function buildRewriteContext(form: IdentityKitForm): RewriteContext {
  const tone = normalizeTone(form.step3.tonePreset)
  const { businessName, industry, brandNarrator } = form.step1
  const profile = computeBrandProfile(form)
  const offerLine = cleanLine(assembleOfferLine(form.step1.offer, industry))
  const { offerLabel, audienceLabel } = resolveOfferSelections(form.step1.offer, industry)
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(form.step1.transformation, industry)
  const narrator = getNarratorProfile(brandNarrator)
  const industryVoice = getIndustryVoiceProfile(industry)
  const [trustedPrimary, trustedSecondary] = concreteIndustryTerms(industryVoice.preferredTerms)

  return {
    tone,
    businessName,
    offerLine,
    offerLabel: cleanLine(offerLabel),
    audienceLabel: audienceLabel.trim() || 'people',
    beforeState: cleanLine(beforeLabel),
    afterState: cleanLine(afterLabel),
    mechanism: cleanLine(mechanismLabel),
    narratorId: narrator.narrator_id,
    trustedPrimary,
    trustedSecondary,
    directness: form.step3.voiceSliders.directness,
    touchpointCluster: profile.touchpointCluster,
    primaryGoal: form.step1.primaryGoal,
    primaryTouchpoint: form.step1.touchpoints[0] ?? '',
  }
}

function buildBeforeAfterPairs(form: IdentityKitForm): BeforeAfterPair[] {
  const ctx = buildRewriteContext(form)
  const [scenarioA, scenarioB] = pickBeforeAfterScenarios(ctx)

  return [
    {
      label: scenarioLabel(scenarioA),
      before: beforeForScenario(scenarioA, ctx),
      after: afterForScenario(scenarioA, ctx),
    },
    {
      label: scenarioLabel(scenarioB),
      before: beforeForScenario(scenarioB, ctx),
      after: afterForScenario(scenarioB, ctx),
    },
  ]
}

export function voicePlaybookBeforeAfterBody(form: IdentityKitForm): string {
  return buildBeforeAfterPairs(form)
    .map((pair) => [pair.label, `Before: "${pair.before}"`, `After: "${pair.after}"`].join('\n'))
    .join('\n\n')
}

export function styleGuideImageryDirectionBody(form: IdentityKitForm): string {
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  const { touchpointCluster } = computeBrandProfile(form)
  const core = STYLE_IMAGERY_CORE[styleKey] ?? STYLE_IMAGERY_CORE.clean_minimal
  const tail = CLUSTER_IMAGERY_TAIL[touchpointCluster]
  return `${core} ${tail}`
}
