import {
  assembleOfferLine,
  assembleTransformationLine,
  resolveBuyerArchetypeTitle,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { firstSentence, parseTensionResolutionBody, type TensionPair } from './landscapeDeckTypes.js'

const NARRATOR_LABELS: Record<string, string> = {
  solo_expert: 'solo expert',
  solo_maker: 'solo maker',
  local_team: 'local team',
  product_led: 'product-led brand',
  mission_community: 'mission-led community',
}

function narratorLabel(id: string): string {
  return NARRATOR_LABELS[id] ?? id.replace(/_/g, ' ')
}

export const STRATEGY_MEMO_READER_FRAMING =
  'This memo analyzes your brand direction and surfaces productive tensions and strategic angles. It works alongside your Brand Identity Guide, Style Guide, Voice Playbook, and Quick Start — where tensions appear, they are opportunities to sharpen emphasis within the direction you have already chosen, not signals to change course.'

export type JtbdDimension = {
  label: 'Functional' | 'Emotional' | 'Social'
  body: string
}

export type MessagingPillar = {
  label: string
  body: string
}

export type StrategyMemoPdfModel = {
  readerFraming: string
  archetype: { body: string }
  jtbd: JtbdDimension[]
  behavioralAudience: { body: string }
  tensions: TensionPair[]
  contrarianAngle: { lead: string; body: string }
  messagingHierarchy: {
    valueProp: string
    pillars: MessagingPillar[]
    primaryMessage: string
  }
  roadmap: string[]
}

/**
 * Deterministic Strategy Memo scaffold (--no-ai / pre-Opus path).
 * @see DELIVERABLE_PRODUCTION_SPEC.md §6
 */
export function buildStrategyMemoPdfModel(form: IdentityKitForm): StrategyMemoPdfModel {
  const name = form.step1.businessName.trim()
  const narratorId = form.step1.brandNarrator || 'solo_expert'
  const narratorName = narratorLabel(narratorId)
  const audience = resolveBuyerArchetypeTitle(form.step2.customerArchetype, form.step1.industry)
  const offerLine = assembleOfferLine(form.step1.offer, form.step1.industry)
  const transformationLine = assembleTransformationLine(form.step1.transformation, form.step1.industry)
  const diff = form.step7.differentiation?.trim()

  const archetypeBody = `${name} reads through a ${narratorName} operating model. Your narrator choice shapes pronouns, CTAs, and which channels feel primary — keep that lens consistent across the kit.`

  const jtbd: JtbdDimension[] = [
    {
      label: 'Functional',
      body: audience
        ? `${audience} need ${offerLine || 'a clear offer they can act on'}.`
        : `Customers need ${offerLine || 'a clear offer they can act on'}.`,
    },
    {
      label: 'Emotional',
      body: `They want to feel ${form.step3.tonePreset === 'friendly' ? 'welcomed and confident' : 'clear and confident'} about the choice.`,
    },
    {
      label: 'Social',
      body: 'They want to recommend a brand that looks and sounds intentional.',
    },
  ]

  const behavioralBody = audience
    ? `${audience} evaluating ${name} look for proof that ${transformationLine || 'the outcome is real'}. They respond to specific language about ${form.step2.desiredOutcomes?.trim() || 'what changes after they buy in'}.`
    : `${name} serves buyers who need ${offerLine || 'clarity'} before they commit. Lead with specifics from your intake, not generic category claims.`

  const tensionRaw = diff
    ? `Tension: ${name} promises ${diff.split(/(?<=[.!?])\s+/)[0]?.trim() || diff} while operating as a ${narratorName}.\nResolution: Keep the promise visible in channel copy and proof points — sharpen emphasis, do not change palette, style, or narrator.`
    : '[Scaffold] Add differentiation in intake to surface strategic tensions here.'

  const tensions: TensionPair[] = []
  const parsedTension = parseTensionResolutionBody(tensionRaw)
  if (parsedTension) tensions.push(parsedTension)

  const contrarianFull = diff
    ? `Most peers in ${form.step1.industry.replace(/_/g, ' ')} lead with generic reliability language. ${name} can credibly lean into ${diff.split(/(?<=[.!?])\s+/)[0]?.trim() || 'a sharper point of view'} because it is grounded in how you actually deliver.`
    : `Most peers lead with generic claims. ${name} can stand out by naming ${transformationLine || offerLine || 'a specific outcome'} in plain language.`

  const valueProp = `${name} ${offerLine ? offerLine.charAt(0).toLowerCase() + offerLine.slice(1) : 'delivers focused brand clarity'}.`
  const pillars: MessagingPillar[] = [
    { label: 'Pillar 1 — Offer', body: offerLine || 'Name what you sell in customer language.' },
    {
      label: 'Pillar 2 — Audience',
      body: audience ? `Built for ${audience.toLowerCase()}.` : 'Name who this is for.',
    },
  ]
  const primaryMessage = transformationLine || diff || offerLine || name

  const roadmap = [
    'Align homepage and primary channel copy to the value proposition above.',
    'Publish one proof-led post or email using your voice samples as rhythm reference.',
    'Review CTAs on primary surfaces so they match your narrator action type.',
  ]

  return {
    readerFraming: STRATEGY_MEMO_READER_FRAMING,
    archetype: { body: archetypeBody },
    jtbd,
    behavioralAudience: { body: behavioralBody },
    tensions,
    contrarianAngle: { lead: firstSentence(contrarianFull), body: contrarianFull },
    messagingHierarchy: { valueProp, pillars, primaryMessage },
    roadmap,
  }
}
