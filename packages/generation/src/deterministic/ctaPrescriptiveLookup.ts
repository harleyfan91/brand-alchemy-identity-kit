/**
 * Resolve prescriptive phrase tuples from generated bank chunks (verbatim source markdown).
 */

import type { PrimaryGoal } from '@identity-kit/shared'

import { PRESCRIPTIVE_CTA_CHUNKS, type PrescriptiveChunk } from './ctaPhraseBankPrescriptive.gen.js'
import type { CtaIndustryGroup, CtaVoiceTone } from './ctaIndustryGroups.js'

/** Minimal shape for surface routing (avoids circular import with ctaSurfacePhrases). */
export type PrescriptivePhrasePickContext = {
  surface: 'website' | 'email' | 'marketplace' | 'directory' | 'social' | 'social_secondary'
  socialTone: 'professional' | 'casual'
  directoryFamily?: 'post_offer' | 'sponsored_listing'
}

export function voiceTierMatches(chunkVoice: string | null | undefined, vt: CtaVoiceTone): boolean {
  if (chunkVoice === null || chunkVoice === undefined) return true
  if (chunkVoice === 'any') return true
  if (chunkVoice === 'bold_friendly') return vt === 'bold' || vt === 'friendly'
  if (chunkVoice === 'friendly_professional') return vt === 'friendly' || vt === 'professional'
  return chunkVoice === vt
}

export function resolvePrescriptiveSurfaceKey(ctx: PrescriptivePhrasePickContext): string {
  const surf = ctx.surface === 'social_secondary' ? 'social' : ctx.surface
  if (surf === 'website') return 'website'
  if (surf === 'email') return 'email'
  if (surf === 'marketplace') return 'marketplace'
  if (surf === 'directory') {
    return ctx.directoryFamily === 'sponsored_listing' ? 'directory_yelp' : 'directory_google'
  }
  if (surf === 'social') {
    return ctx.socialTone === 'professional' ? 'social_linkedin' : 'social_casual'
  }
  return 'website'
}

/** Try exact industry, then default bucket (prescriptive “all other industries”). */
function industryCandidates(group: CtaIndustryGroup): string[] {
  const u = [...new Set([group, 'default'])]
  return u
}

/** §4C tuned narrator per industry group (Wave E). */
const NARRATOR_TUNED_BY_INDUSTRY: Partial<Record<CtaIndustryGroup, string>> = {
  trades_home: 'local_team',
  food_hospitality: 'solo_maker',
  retail_maker: 'product_led',
  health_wellness: 'local_team',
  creative_pro: 'solo_expert',
  professional_svc: 'solo_expert',
}

function chunkMatches(
  c: PrescriptiveChunk,
  args: {
    surfaceKey: string
    goal: string
    industry: string
    voiceTone: CtaVoiceTone
    narrator: string | null | undefined
  },
): boolean {
  if (c.surface !== args.surfaceKey || c.goal !== args.goal || c.industry !== args.industry) return false
  if (!voiceTierMatches(c.voice, args.voiceTone)) return false
  if (c.tuples.length === 0) return false
  const cn = c.narrator ?? null
  const want = args.narrator ?? null
  return cn === want
}

export function lookupPrescriptiveTuples(
  ctx: PrescriptivePhrasePickContext & {
    primaryGoal: Exclude<PrimaryGoal, ''>
    industryGroup: CtaIndustryGroup
    voiceTone: CtaVoiceTone
    brandNarrator?: string
  },
): Array<[string, string]> | null {
  const surfaceKey = resolvePrescriptiveSurfaceKey(ctx)
  const goal = ctx.primaryGoal
  const vt = ctx.voiceTone
  const tuned = NARRATOR_TUNED_BY_INDUSTRY[ctx.industryGroup]
  const useTuned = tuned && ctx.brandNarrator === tuned ? tuned : null

  for (const ind of industryCandidates(ctx.industryGroup)) {
    if (useTuned) {
      const tunedHit = PRESCRIPTIVE_CTA_CHUNKS.find((c) =>
        chunkMatches(c, { surfaceKey, goal, industry: ind, voiceTone: vt, narrator: useTuned }),
      )
      if (tunedHit) return tunedHit.tuples
    }
    const hit = PRESCRIPTIVE_CTA_CHUNKS.find((c) =>
      chunkMatches(c, { surfaceKey, goal, industry: ind, voiceTone: vt, narrator: null }),
    )
    if (hit) return hit.tuples
  }
  return null
}

export function lookupCtaTemplateTriple(args: {
  primaryGoal: Exclude<PrimaryGoal, ''>
  industryGroup: CtaIndustryGroup
  voiceTone: CtaVoiceTone
  seedKey: string
}): readonly string[] | null {
  const { primaryGoal, industryGroup, voiceTone } = args
  const candidates = PRESCRIPTIVE_CTA_CHUNKS.filter(
    (c) =>
      c.surface === 'cta_templates' &&
      c.goal === primaryGoal &&
      c.triple &&
      c.triple.length >= 3 &&
      voiceTierMatches(c.voice, voiceTone),
  )
  for (const ind of industryCandidates(industryGroup)) {
    const hit = candidates.find((c) => c.industry === ind)
    if (hit?.triple) return hit.triple
  }
  return null
}
