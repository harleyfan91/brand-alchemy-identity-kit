/**
 * Pure mapping: which in-context frame (if any) applies to a CTA surface block.
 * Keep in sync with `GuideCtaSurfaceId` in brandIdentityGuideModel.ts (same string union).
 */
import type { TouchpointId } from '@identity-kit/shared'
import type { CtaFrameId } from './types.js'

export type CtaSurfaceForPresentation = 'website' | 'email' | 'social' | 'marketplace' | 'directory'

export type SocialCtaToneForPresentation = 'professional' | 'casual'

function frameForPrimaryDirectoryId(id: TouchpointId): CtaFrameId {
  switch (id) {
    case 'yelp':
    case 'tripadvisor':
    case 'bing_places':
      return 'directory_sponsored_listing_v1'
    case 'google_business':
    case 'apple_maps':
    case 'nextdoor':
    default:
      return 'directory_post_offer_v1'
  }
}

/** Maps primary directory touchpoint to phrase-bank family (Google-style vs Yelp-style lists). */
export function directoryListingFamilyFromPrimaryId(id?: TouchpointId): 'post_offer' | 'sponsored_listing' {
  if (!id) return 'post_offer'
  return frameForPrimaryDirectoryId(id) === 'directory_sponsored_listing_v1' ? 'sponsored_listing' : 'post_offer'
}

function frameForPrimarySocialId(id: TouchpointId): CtaFrameId {
  switch (id) {
    case 'linkedin':
      return 'social_link_preview_v1'
    case 'facebook':
      return 'social_story_v1'
    case 'youtube':
    case 'tiktok':
      return 'social_reel_cover_v1'
    case 'pinterest':
      return 'social_pin_standard_v1'
    case 'threads':
      return 'social_text_only_v1'
    case 'instagram':
      return 'social_grid_photo_v1'
    default:
      return 'social_grid_photo_v1'
  }
}

export function pickCtaFrameId(
  surface: CtaSurfaceForPresentation,
  socialTone: SocialCtaToneForPresentation,
  socialPrimaryId?: TouchpointId,
  directoryPrimaryId?: TouchpointId,
): CtaFrameId | undefined {
  if (surface === 'directory') {
    if (directoryPrimaryId) return frameForPrimaryDirectoryId(directoryPrimaryId)
    return 'directory_post_offer_v1'
  }
  if (surface === 'website') return 'website_hero_cta_v1'
  if (surface === 'email') return 'email_text_only_v1'
  if (surface === 'marketplace') return 'marketplace_listing_v1'
  if (surface === 'social') {
    if (socialPrimaryId) return frameForPrimarySocialId(socialPrimaryId)
    return socialTone === 'professional' ? 'social_feed_v1' : 'social_grid_photo_v1'
  }
  return undefined
}
