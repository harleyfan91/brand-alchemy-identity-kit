import type { CtaFrameId, SocialFeedVariant } from './types.js'

/** Folio 05 layout slot — see docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md § FrameId → slot class (v1). */
export type CtaSlotClass = 'mobile_tall' | 'desktop_wide' | 'compact_chip'

export function ctaFrameSlotClass(
  frameId: CtaFrameId,
  socialFeedVariant?: SocialFeedVariant,
): CtaSlotClass {
  switch (frameId) {
    case 'social_story_v1':
    case 'social_reel_cover_v1':
      return 'mobile_tall'
    case 'social_feed_v1':
      return socialFeedVariant === 'professional_network_feed' ? 'desktop_wide' : 'compact_chip'
    case 'social_grid_photo_v1':
    case 'social_carousel_v1':
    case 'social_pin_standard_v1':
    case 'social_link_preview_v1':
    case 'social_text_only_v1':
    case 'marketplace_listing_v1':
      return 'compact_chip'
    case 'email_text_only_v1':
    case 'email_image_v1':
    case 'website_hero_cta_v1':
    case 'directory_post_offer_v1':
    case 'directory_sponsored_listing_v1':
      return 'desktop_wide'
  }
}
