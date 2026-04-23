/**
 * In-context CTA frame ids for folio 05 (see docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).
 * Add new ids here when registering components in registry.tsx.
 */
import type { CoreKitPdfStyles } from '../CoreKitDocuments.js'

export const CTA_FRAME_IDS = [
  'directory_post_offer_v1',
  'directory_sponsored_listing_v1',
  'email_text_only_v1',
  'email_image_v1',
  'marketplace_listing_v1',
  'social_feed_v1',
  'social_story_v1',
  'social_reel_cover_v1',
  'social_grid_photo_v1',
  'social_pin_standard_v1',
  'social_carousel_v1',
  'social_link_preview_v1',
  'social_text_only_v1',
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
   * - pin_standard: 2:3 Pinterest standard pin shell (on-media short CTA)
   * - carousel: 4:5 portrait carousel shell
   * - link_preview: headline + snippet + thumbnail link card
   * - text_only: text-led social post shell
   */
  socialSurfaceFamily?:
    | 'feed'
    | 'story'
    | 'reel_cover'
    | 'grid_photo'
    | 'pin_standard'
    | 'carousel'
    | 'link_preview'
    | 'text_only'
  emailSurfaceFamily?: 'text_only' | 'image'
  marketplaceSurfaceFamily?: 'listing'
  /** Machine-readable directory shell family; not shown inside frames. */
  directorySurfaceFamily?: 'post_offer' | 'sponsored_listing'
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
