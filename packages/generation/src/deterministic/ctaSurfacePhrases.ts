/**
 * Paste-ready CTA line pairs for folio 05 — sourced from prescriptive banks (`ctaPhraseBankPrescriptive.gen.ts`).
 */

import type { PrimaryGoal } from '@identity-kit/shared'

import type { CtaIndustryGroup, CtaVoiceTone } from './ctaIndustryGroups.js'
import { lookupCtaTemplateTriple, lookupPrescriptiveTuples } from './ctaPrescriptiveLookup.js'

export type CtaSurfaceActionMode = 'shop' | 'book' | 'message' | 'save' | 'subscribe' | 'reengage'

export type CtaPhraseSurface =
  | 'website'
  | 'email'
  | 'marketplace'
  | 'directory'
  | 'social'
  | 'social_secondary'

export interface PasteReadyPhraseContext {
  surface: CtaPhraseSurface
  action: CtaSurfaceActionMode
  primaryGoal: Exclude<PrimaryGoal, ''>
  industryGroup: CtaIndustryGroup
  voiceTone: CtaVoiceTone
  socialTone: 'professional' | 'casual'
  lowPressure: boolean
  outcomeHint?: string
  painHint?: string
  expectationHint?: string
  directoryFamily?: 'post_offer' | 'sponsored_listing'
}

/** Merge duplicate-ish tuples; ensures ≥1 pair for fallback consumers. */
function dedupeTuples(rows: Array<[string, string]>): Array<[string, string]> {
  const seen = new Set<string>()
  const out: Array<[string, string]> = []
  for (const [a, b] of rows) {
    const key = `${a}|${b}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push([a, b])
  }
  return out
}

function finalizeVariants(rows: Array<[string, string]>): Array<[string, string]> {
  const filtered = rows.filter(([a]) => a.trim())
  const deduped = dedupeTuples(filtered)
  if (deduped.length === 0) return [['Say hello when you are ready.', 'Reply with what you need and we will point you to the next step.']]
  return deduped.slice(0, 12)
}

/**
 * Returns 3–12 variant pairs; caller picks deterministically.
 */
export function getPasteReadyCtaVariants(ctx: PasteReadyPhraseContext): Array<[string, string]> {
  const fromBank = lookupPrescriptiveTuples(ctx)
  if (fromBank && fromBank.length > 0) {
    return finalizeVariants(fromBank)
  }
  const fb = fallbackPasteReadyByGoal()[ctx.primaryGoal]
  return finalizeVariants(fb ?? [['Say hello when you are ready.', 'Reply with what you need and we will point you to the next step.']])
}

function stableHash(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function pickTemplateTriple<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error('pickTemplateTriple: empty')
  const idx = stableHash(seed) % items.length
  return items[idx] as T
}

/** Three paste-ready template lines when touchpoints are empty (folio 05 fallback module). */
export function buildCtaTemplateLines(args: {
  primaryGoal: Exclude<PrimaryGoal, ''>
  industryGroup: CtaIndustryGroup
  voiceTone: CtaVoiceTone
  sensitiveIndustry: boolean
  seedKey: string
}): string[] {
  const { primaryGoal, industryGroup, voiceTone } = args
  void args.sensitiveIndustry
  const vk = `${primaryGoal}|${industryGroup}|${voiceTone}|${args.sensitiveIndustry ? 's' : 'n'}|${args.seedKey}`
  const triple = lookupCtaTemplateTriple({
    primaryGoal,
    industryGroup,
    voiceTone,
    seedKey: args.seedKey,
  })
  if (triple && triple.length >= 3) {
    return [...triple].slice(0, 3)
  }

  const fallbackTriples: Record<Exclude<PrimaryGoal, ''>, string[][]> = {
    direct_sales: [['Say hello when you are ready.', 'Browse what fits.', 'Checkout stays straightforward.']],
    lead_gen: [['Say hello when you are ready.', 'Reply to start the conversation.', 'We keep responses clear and specific.']],
    audience_growth: [['Follow for weekly ideas.', 'Join the list for one short note.', 'Worth opening, we keep it lean.']],
    retention: [['Pick up where we left off.', 'See what is new since your last visit.', 'Come back when you are ready.']],
  }
  return pickTemplateTriple(fallbackTriples[primaryGoal], vk).slice(0, 3)
}

export function fallbackPasteReadyByGoal(): Record<
  'direct_sales' | 'lead_gen' | 'audience_growth' | 'retention',
  Array<[string, string]>
> {
  return {
    direct_sales: [
      ['Buy direct on this page.', 'Questions? Message us; we reply with clear next steps.'],
      ['Choose your bundle and checkout.', 'Support stays one thread from cart to delivery.'],
      ['Tap checkout once details look right.', 'Returns and timing show before you pay.'],
    ],
    lead_gen: [
      ['Tell us your project in two lines.', 'We reply with timing and what we need next.'],
      ['Book a short intro.', 'Calendars and prep questions send automatically.'],
      ['Send scope through the form.', 'Expect a structured reply same business day when possible.'],
    ],
    audience_growth: [
      ['Follow for weekly ideas.', 'Save posts you want to revisit.'],
      ['Join the list for one short note.', 'Short, useful, and easy to skim.'],
      ['Turn on alerts for launches.', 'No spam; only dates that matter.'],
    ],
    retention: [
      ['Pick up where you left off.', 'Your account keeps progress synced.'],
      ['Renew before your window closes.', 'We send reminders with clear pricing.'],
      ['Message us if priorities shifted.', 'We refresh your plan with what changed.'],
    ],
  }
}
