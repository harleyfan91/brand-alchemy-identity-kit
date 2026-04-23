/**
 * In-context CTA frame ids for folio 05 (see docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).
 * Add new ids here when registering components in registry.tsx.
 */
import type { CoreKitPdfStyles } from '../CoreKitDocuments.js'

export const CTA_FRAME_IDS = [
  'social_feed_v1',
  'social_story_v1',
  'social_reel_cover_v1',
  'social_grid_photo_v1',
] as const

export type CtaFrameId = (typeof CTA_FRAME_IDS)[number]

export function isCtaFrameId(value: string): value is CtaFrameId {
  return (CTA_FRAME_IDS as readonly string[]).includes(value)
}

/**
 * Drives **fixed layout geometry** for `social_feed_v1` (not interchangeable).
 * - `professional_network_feed` — **Wide horizontal media** (~1.91:1), same family as LinkedIn / Facebook feed link-image posts (not IG square).
 * - `creator_visual_feed` — **Square media** (1:1), same family as an Instagram profile-grid photo (not Stories, not LinkedIn-wide image).
 */
export type SocialFeedVariant = 'professional_network_feed' | 'creator_visual_feed'

export interface GuideCtaPresentation {
  frameId: CtaFrameId
  /**
   * Human labels for selected social touchpoints (e.g. `LinkedIn · Instagram`).
   * Used for the folio module label next to the frame, not inside `social_feed_v1`.
   */
  platformSummary?: string
  /** Fixed post + media proportions; see `SocialFeedVariant` and CTA frame playbook. */
  socialFeedVariant?: SocialFeedVariant
  /**
   * Deterministic social family selection based on selected touchpoints.
   * - feed: classic feed post shell
   * - story: full-height 9:16 story shell
   * - reel_cover: 9:16 vertical short-video cover shell
   * - grid_photo: square-first profile-grid post shell
   */
  socialSurfaceFamily?: 'feed' | 'story' | 'reel_cover' | 'grid_photo'
}

export type CtaFrameHyphenation = (word: string) => string[]

export interface CtaFrameBaseProps {
  styles: CoreKitPdfStyles
  businessName: string
  lines: string[]
  hyphenationCallback: CtaFrameHyphenation
  platformSummary?: string
  socialFeedVariant?: SocialFeedVariant
}
