import {
  resolveBuyerArchetypeTitle,
  resolveOfferSelections,
  resolveTransformationSelections,
  type BriefIdealCustomerRewrite,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { idealCustomerNarratorCue } from './coreAssembly.js'

function splitList(value: string | undefined, max: number): string[] {
  if (!value?.trim()) return []
  return value
    .split(/[;•]|(?:\.\s+(?=[A-Z]))/)
    .map((s) => s.trim().replace(/^[-–—]\s*/, ''))
    .filter(Boolean)
    .slice(0, max)
}

function ensureMinItems(items: string[], min: number, fallback: string): string[] {
  const out = [...items]
  while (out.length < min) out.push(fallback)
  return out
}

/** Plain-text body for Brand Brief → Ideal customer (PDF-safe, structured). */
export function formatBriefIdealCustomerForPdf(snapshot: BriefIdealCustomerRewrite): string {
  const traitLines = snapshot.traits.map((t) => `• ${t.trim()}`).join('\n')
  const careLines = snapshot.caresAbout.map((c) => `• ${c.trim()}`).join('\n')

  return [snapshot.summaryLine.trim(), '', 'What defines them', traitLines, '', 'What they care about', careLines].join(
    '\n',
  )
}

/**
 * Deterministic structured snapshot for Brand Brief → Ideal customer.
 * Shared by Core, Pro (--no-ai), and AI scaffold fallback.
 */
export function idealCustomerSnapshotFromIntake(form: IdentityKitForm): BriefIdealCustomerRewrite {
  const { step1, step2, step4 } = form
  const audienceTitle = resolveBuyerArchetypeTitle(step2.customerArchetype, step1.industry)
  const { audienceLabel } = resolveOfferSelections(step1.offer, step1.industry)
  const fieldsCited: string[] = []

  let summaryLine = audienceTitle.trim()
  if (!summaryLine && audienceLabel) summaryLine = audienceLabel
  if (!summaryLine) summaryLine = 'Ideal customer not fully specified on intake.'
  else if (!summaryLine.endsWith('.')) summaryLine = `${summaryLine}.`
  if (step2.customerArchetype?.trim()) fieldsCited.push('customerArchetype')

  const traits: string[] = []
  if (step2.customerArchetype?.trim()) {
    traits.push(idealCustomerNarratorCue(step1.brandNarrator))
    fieldsCited.push('brandNarrator')
  }

  if (audienceLabel) {
    const titleLower = audienceTitle.toLowerCase()
    const audLower = audienceLabel.toLowerCase()
    if (!titleLower.includes(audLower.slice(0, Math.min(12, audLower.length)))) {
      traits.push(`Offer built for ${audienceLabel}`)
      fieldsCited.push('offer.audienceId')
    }
  }

  if (step1.businessOperatingModel === 'we_travel_to_customers') {
    traits.push('On-site or local service; not a fully remote relationship')
    fieldsCited.push('businessOperatingModel')
  } else if (step1.businessOperatingModel === 'customer_visits_us') {
    traits.push('In-person visits and local presence matter')
    fieldsCited.push('businessOperatingModel')
  } else if (step1.businessOperatingModel === 'online_only') {
    traits.push('Primarily discovers and evaluates the brand online')
    fieldsCited.push('businessOperatingModel')
  }

  for (const pain of splitList(step2.painPoints, 2)) {
    traits.push(pain)
    fieldsCited.push('painPoints')
  }

  if (traits.length < 2 && step4.missionStatement?.trim()) {
    traits.push(step4.missionStatement.trim().replace(/\.$/, ''))
    fieldsCited.push('missionStatement')
  }
  if (traits.length < 2 && step1.businessDescription?.trim()) {
    const first = step1.businessDescription.trim().split(/(?<=[.!?])\s+/)[0]?.replace(/\.$/, '')
    if (first) {
      traits.push(first)
      fieldsCited.push('businessDescription')
    }
  }

  const { beforeLabel, afterLabel } = resolveTransformationSelections(step1.transformation, step1.industry)
  const caresAbout: string[] = []
  for (const outcome of splitList(step2.desiredOutcomes, 3)) {
    caresAbout.push(outcome)
    fieldsCited.push('desiredOutcomes')
  }
  if (afterLabel?.trim()) {
    caresAbout.push(`Move toward ${afterLabel.trim()}`)
    fieldsCited.push('transformation.afterId')
  }
  if (caresAbout.length < 2 && beforeLabel?.trim()) {
    caresAbout.push(`Relief from ${beforeLabel.trim().replace(/^./, (c) => c.toLowerCase())}`)
    fieldsCited.push('transformation.beforeId')
  }

  return {
    summaryLine,
    traits: ensureMinItems(traits, 2, 'Primary audience from intake archetype selection').slice(0, 4),
    caresAbout: ensureMinItems(caresAbout, 2, 'Outcomes aligned with the transformation on intake').slice(0, 3),
    fieldsCited: [...new Set(fieldsCited)],
  }
}
