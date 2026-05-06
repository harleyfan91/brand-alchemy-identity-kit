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

export function lookupPrescriptiveTuples(
  ctx: PrescriptivePhrasePickContext & {
    primaryGoal: Exclude<PrimaryGoal, ''>
    industryGroup: CtaIndustryGroup
    voiceTone: CtaVoiceTone
  },
): Array<[string, string]> | null {
  const surfaceKey = resolvePrescriptiveSurfaceKey(ctx)
  const goal = ctx.primaryGoal
  const vt = ctx.voiceTone

  for (const ind of industryCandidates(ctx.industryGroup)) {
    const hit = PRESCRIPTIVE_CTA_CHUNKS.find(
      (c: PrescriptiveChunk) =>
        c.surface === surfaceKey &&
        c.goal === goal &&
        c.industry === ind &&
        voiceTierMatches(c.voice, vt) &&
        c.tuples.length > 0,
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
