/**
 * Pure mapping: which in-context frame (if any) applies to a CTA surface block.
 * Keep in sync with `GuideCtaSurfaceId` in brandIdentityGuideModel.ts (same string union).
 */
import type { CtaFrameId } from './types.js'

export type CtaSurfaceForPresentation = 'website' | 'email' | 'social' | 'marketplace' | 'directory'

export type SocialCtaToneForPresentation = 'professional' | 'casual'

export function pickCtaFrameId(
  surface: CtaSurfaceForPresentation,
  _socialTone: SocialCtaToneForPresentation,
): CtaFrameId | undefined {
  if (surface === 'social') return 'social_feed_v1'
  return undefined
}
