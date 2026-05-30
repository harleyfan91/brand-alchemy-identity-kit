import {
  assembleOfferLine,
  assembleTransformationLine,
  resolveBuyerArchetypeTitle,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { firstSentence, parseTensionResolutionBody, type TensionPair } from './landscapeDeckTypes.js'
import {
  STRATEGY_MEMO_ROADMAP_FRAMING,
  type StrategyMemoNarrative,
  type StrategyMemoPriorityNode,
  type StrategyMemoRoadmap,
} from './strategyMemoRoadmapTypes.js'

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

function substantive(text: string | undefined, min = 60): boolean {
  return Boolean(text?.trim() && text.trim().length >= min)
}

function pillarShortName(label: string): string {
  const emDash = label.match(/—\s*(.+)$/)
  if (emDash?.[1]?.trim()) return emDash[1].trim()
  const hyphen = label.match(/-\s*(.+)$/)
  if (hyphen?.[1]?.trim()) return hyphen[1].trim()
  return label.trim()
}

function firstClause(text: string): string {
  return text.split(/(?<=[.!?])\s+/)[0]?.trim() || text.trim()
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
  roadmap: StrategyMemoRoadmap
  narrative: StrategyMemoNarrative | null
}

function buildStrategyMemoRoadmap(
  form: IdentityKitForm,
  pillars: MessagingPillar[],
): StrategyMemoRoadmap {
  const name = form.step1.businessName.trim()
  const pillarShort = pillars.map((p) => pillarShortName(p.label))
  const pOffer = pillarShort[0] ?? 'Offer'
  const pAudience = pillarShort[1] ?? 'Audience'
  const diff = form.step7.differentiation?.trim()
  const pain = form.step2.painPoints?.trim()
  const outcomes = form.step2.desiredOutcomes?.trim()

  const priorities: StrategyMemoPriorityNode[] = [
    {
      kind: 'priority',
      order: 1,
      horizonLabel: 'Days 31–45',
      title: diff ? 'Lead with your differentiator in proof-led copy' : 'Make the value proposition repeatable',
      body: diff
        ? `Carry "${firstClause(diff)}" through case studies, wholesale outreach, and hero copy — not as a one-time tagline, but as the proof story teammates can reuse.`
        : `Turn the value proposition above into three proof points ${name} can reuse in proposals, site copy, and sales conversations.`,
      activatesPillars: [pOffer],
    },
    {
      kind: 'priority',
      order: 2,
      horizonLabel: 'Days 46–75',
      title: pain ? 'Close the recognition gap buyers already feel' : 'Build one flagship proof asset',
      body: pain
        ? `${firstClause(pain)} Address that gap in packaging, photography, and the stories you tell on primary channels — make the same brand show up before people read the name.`
        : `Publish one long-form proof piece (case study, founder note, or process story) that shows ${name} delivering the outcome you promise.`,
      activatesPillars: [pAudience],
    },
    {
      kind: 'priority',
      order: 3,
      horizonLabel: 'Days 76–90',
      title: 'Hand off the primary message to anyone creating copy',
      body: outcomes
        ? `Anchor the next quarter on: ${firstClause(outcomes)} Document the primary message and pillar phrases so contractors and teammates stay aligned after the first month.`
        : `Document the primary message and pillar phrases so anyone writing for ${name} after day 30 stays on the same strategic spine.`,
      activatesPillars: ['Primary message'],
    },
  ]

  return {
    framing: STRATEGY_MEMO_ROADMAP_FRAMING,
    nodes: [
      {
        kind: 'quick_start_bridge',
        horizonLabel: 'Days 1–30',
        title: '30-Day Quick Start',
        body: 'Run the week-by-week checklist in your Quick Start PDF — channel foundations, voice application, visual rollout, and consistency audit. This memo picks up where that leaves off.',
      },
      ...priorities,
    ],
  }
}

/** @see OUTPUT_TRANSLATION_SPEC.md §5.7.3 */
function buildStrategyMemoNarrative(form: IdentityKitForm): StrategyMemoNarrative | null {
  const diff = form.step7.differentiation?.trim()
  const competitors = (form.step7.competitors ?? []).filter((c) => c?.trim())
  const values = form.step4.values ?? []
  const mission = form.step4.missionStatement?.trim()
  const origin = form.step5.originSummary?.trim()
  const name = form.step1.businessName.trim()
  const pain = form.step2.painPoints?.trim()

  const problemEligible = substantive(diff) && competitors.length >= 1
  const manifestoEligible = values.length >= 2 && (substantive(mission) || substantive(origin))

  if (problemEligible) {
    const competitorLead = competitors[0]?.trim()
    return {
      kind: 'problem_story',
      title: 'Problem story',
      body:
        `${competitorLead ? `${competitorLead} and similar options ` : 'Many options in this category '}leave buyers guessing about ${pain ? firstClause(pain).toLowerCase() : 'what actually changes'}. ` +
        `${name} ${firstClause(diff!)} — that is the story to lead with on About pages, pitch decks, and homepage hero copy.`,
    }
  }

  if (manifestoEligible) {
    const belief = values.slice(0, 2).join(' and ')
    return {
      kind: 'brand_manifesto',
      title: 'Brand manifesto',
      body: `We believe ${belief.toLowerCase()} matter more than hype. ${mission || origin || `${name} exists to deliver that promise in every touchpoint.`}`,
    }
  }

  return null
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
    ? `Tension: ${name} promises ${firstClause(diff)} while operating as a ${narratorName}.\nResolution: Keep the promise visible in channel copy and proof points — sharpen emphasis, do not change palette, style, or narrator.`
    : '[Scaffold] Add differentiation in intake to surface strategic tensions here.'

  const tensions: TensionPair[] = []
  const parsedTension = parseTensionResolutionBody(tensionRaw)
  if (parsedTension) tensions.push(parsedTension)

  const contrarianFull = diff
    ? `Most peers in ${form.step1.industry.replace(/_/g, ' ')} lead with generic reliability language. ${name} can credibly lean into ${firstClause(diff)} because it is grounded in how you actually deliver.`
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
  const roadmap = buildStrategyMemoRoadmap(form, pillars)
  const narrative = buildStrategyMemoNarrative(form)

  return {
    readerFraming: STRATEGY_MEMO_READER_FRAMING,
    archetype: { body: archetypeBody },
    jtbd,
    behavioralAudience: { body: behavioralBody },
    tensions,
    contrarianAngle: { lead: firstSentence(contrarianFull), body: contrarianFull },
    messagingHierarchy: { valueProp, pillars, primaryMessage },
    roadmap,
    narrative,
  }
}
