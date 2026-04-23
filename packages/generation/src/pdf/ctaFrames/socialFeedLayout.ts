/**
 * Fixed pt layout constants for social CTA shells.
 * Keep these values deterministic and shared between frame components and the dev explorer.
 */
export const SOCIAL_POST_CARD_PADDING_PT = 8

/** Wide feed shell uses full column width in the PDF. */
export const SOCIAL_FEED_CARD_FULL_WIDTH = '100%'

/** Feed card media (~1.91:1), centered: professional-network feed shell. */
export const SOCIAL_PRO_MEDIA_WIDTH_PT = 136
export const SOCIAL_PRO_MEDIA_HEIGHT_PT = SOCIAL_PRO_MEDIA_WIDTH_PT

/** Square media (1:1), centered: profile-grid photo shell. */
export const SOCIAL_CREATOR_MEDIA_PT = 112

/** Mobile-like outer shell widths for vertical/square social families. */
/**
 * Story/reel outer device (pt). Inner 9:16 width is `SOCIAL_VERTICAL_MEDIA_WIDTH_PT` (card inner = this minus 2×`guideCard` border).
 */
export const SOCIAL_STORY_CARD_WIDTH_PT = 132
/** Reel uses the same outer shell width as story so both read as one device size. */
export const SOCIAL_REEL_CARD_WIDTH_PT = SOCIAL_STORY_CARD_WIDTH_PT
export const SOCIAL_GRID_CARD_WIDTH_PT = 148
export const SOCIAL_CAROUSEL_CARD_WIDTH_PT = 156
export const SOCIAL_TEXT_ONLY_CARD_WIDTH_PT = 154
export const SOCIAL_PIN_STANDARD_CARD_WIDTH_PT = 156

/** Story / reel: 9:16 **stage** width (pt) used by reel (and story width). Keep `SOCIAL_STORY_CARD_WIDTH_PT === this + 2` for 1 pt `guideCard` borders. */
export const SOCIAL_VERTICAL_MEDIA_WIDTH_PT = 130
/** Reel 9:16 **stage** height (pt). Story uses `SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT` for one full-bleed canvas. */
export const SOCIAL_VERTICAL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_VERTICAL_MEDIA_WIDTH_PT * 16) / 9)

/** Caption body size for story/reel overlays — matches feed/grid social shells (`SocialFeedCardFrame`, `SocialGridPhotoFrame`). */
export const SOCIAL_SHELL_CAPTION_FONT_SIZE_PT = 8.25

/** Height (pt) of reel content **below** the 9:16 stage (`SocialActionsRow` + wrapper padding). */
export const SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT = 28

/** Full-bleed story canvas height (pt) = reel stage + below-stage so both shells share the same outer size. */
export const SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT =
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT + SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT

/**
 * Reel: caption sits in a bottom overlay band inside the stage (not a second stacked card).
 * Replaces the old stacked `SOCIAL_REEL_FOOTER_HEIGHT_PT` block for layout parity with story height.
 */
export const SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT = 68

/** Alias of `SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT` (reel caption overlay band inside the stage). */
export const SOCIAL_REEL_FOOTER_HEIGHT_PT = SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT

/** Carousel portrait slide slot (4:5). */
export const SOCIAL_CAROUSEL_MEDIA_WIDTH_PT = 120
export const SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_CAROUSEL_MEDIA_WIDTH_PT * 5) / 4)

/** Pinterest standard pin slot (2:3). */
export const SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT = 114
export const SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT = Math.round((SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT * 3) / 2)

/** Link-preview shell content block. */
export const SOCIAL_LINK_PREVIEW_THUMB_PT = 44

/** Marketplace listing shell constants. */
export const MARKETPLACE_LISTING_CARD_WIDTH_PT = 184
export const MARKETPLACE_LISTING_IMAGE_PT = 108

/** Email snippet shell constants. */
export const EMAIL_CARD_FULL_WIDTH = '100%'
export const EMAIL_IMAGE_MEDIA_HEIGHT_PT = 116

/** Website hero shell: wide image band below top bar. */
export const WEBSITE_HERO_MEDIA_HEIGHT_PT = 100

/** Local directory post card: wide image strip (maps-style post body). */
export const DIRECTORY_POST_MEDIA_HEIGHT_PT = 76

/** Sponsored directory listing row: square thumbnail beside snippet placeholders. */
export const DIRECTORY_SPONSORED_THUMB_PT = 44
