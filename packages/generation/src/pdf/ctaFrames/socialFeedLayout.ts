/**
 * Fixed pt layout constants for social CTA shells and shared folio 05 slot geometry.
 * Keep these values deterministic and shared between frame components and the dev explorer.
 *
 * Normative contract: docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md § Normative slot geometry (v1).
 */
export const SOCIAL_POST_CARD_PADDING_PT = 8

/** Wide feed shell uses full column width in the PDF. */
export const SOCIAL_FEED_CARD_FULL_WIDTH = '100%'

/** Feed card media (~1.91:1), centered: professional-network feed shell (`desktop_wide`). */
export const SOCIAL_PRO_MEDIA_WIDTH_PT = 136
export const SOCIAL_PRO_MEDIA_HEIGHT_PT = Math.round(SOCIAL_PRO_MEDIA_WIDTH_PT / 1.91)

/** Square media (1:1), centered: profile-grid photo shell (`compact_chip`). */
export const SOCIAL_CREATOR_MEDIA_PT = 100

/** Mobile-like outer shell widths for vertical/square social families. */
/**
 * Story/reel outer device (pt). Inner 9:16 width is `SOCIAL_VERTICAL_MEDIA_WIDTH_PT` (card inner = this minus 2×`guideCard` border).
 */
export const SOCIAL_STORY_CARD_WIDTH_PT = 96
/** Reel uses the same outer shell width as story so both read as one device size. */
export const SOCIAL_REEL_CARD_WIDTH_PT = SOCIAL_STORY_CARD_WIDTH_PT
export const SOCIAL_GRID_CARD_WIDTH_PT = 140
export const SOCIAL_CAROUSEL_CARD_WIDTH_PT = 148
export const SOCIAL_TEXT_ONLY_CARD_WIDTH_PT = 148
export const SOCIAL_PIN_STANDARD_CARD_WIDTH_PT = 148

/** Story / reel: 9:16 **stage** width (pt). Keep `SOCIAL_STORY_CARD_WIDTH_PT === this + 2` for 1 pt `guideCard` borders. */
export const SOCIAL_VERTICAL_MEDIA_WIDTH_PT = 94
/** Reel 9:16 **stage** height (pt). Story uses `SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT` for one full-bleed canvas. */
export const SOCIAL_VERTICAL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_VERTICAL_MEDIA_WIDTH_PT * 16) / 9)

/** Caption body size for story/reel overlays — matches feed/grid social shells (`SocialFeedCardFrame`, `SocialGridPhotoFrame`). */
export const SOCIAL_SHELL_CAPTION_FONT_SIZE_PT = 8.25

/** Height (pt) of reel content **below** the 9:16 stage (`SocialActionsRow` + wrapper padding). */
export const SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT = 24

/** Full-bleed story canvas height (pt) = reel stage + below-stage so both shells share the same outer size. */
export const SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT =
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT + SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT

/**
 * Reel: caption sits in a bottom overlay band inside the stage (not a second stacked card).
 * Scales with shorter `mobile_tall` stage heights.
 */
export const SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT = Math.min(56, Math.round(SOCIAL_VERTICAL_MEDIA_HEIGHT_PT * 0.32))

/** Alias of `SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT` (reel caption overlay band inside the stage). */
export const SOCIAL_REEL_FOOTER_HEIGHT_PT = SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT

/** Carousel portrait slide slot (4:5). */
export const SOCIAL_CAROUSEL_MEDIA_WIDTH_PT = 108
export const SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_CAROUSEL_MEDIA_WIDTH_PT * 5) / 4)

/** Pinterest standard pin slot (2:3). */
export const SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT = 108
export const SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT = Math.round((SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT * 3) / 2)

/** Link-preview shell content block. */
export const SOCIAL_LINK_PREVIEW_THUMB_PT = 40

/** Marketplace listing shell constants (`compact_chip`). */
export const MARKETPLACE_LISTING_CARD_WIDTH_PT = 172
export const MARKETPLACE_LISTING_IMAGE_PT = 96

/** Email snippet shell constants. */
export const EMAIL_CARD_FULL_WIDTH = '100%'
export const EMAIL_IMAGE_MEDIA_HEIGHT_PT = 92

/** Website hero shell: wide image band below top bar (`desktop_wide`). */
export const WEBSITE_HERO_MEDIA_HEIGHT_PT = 92

/** Shared hero/listing strip height for full-column shells (`desktop_wide`). */
export const DESKTOP_WIDE_MEDIA_STRIP_HEIGHT_PT = WEBSITE_HERO_MEDIA_HEIGHT_PT

/** Local directory post card: wide image strip (maps-style post body). */
export const DIRECTORY_POST_MEDIA_HEIGHT_PT = DESKTOP_WIDE_MEDIA_STRIP_HEIGHT_PT

/** Sponsored directory listing row: square thumbnail beside snippet placeholders. */
export const DIRECTORY_SPONSORED_THUMB_PT = 44

/** Upper bound reference for compact card outer widths (pin/carousel/text-only families). */
export const COMPACT_CHIP_MAX_CARD_WIDTH_PT = 156
