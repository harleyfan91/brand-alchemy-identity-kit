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
export const SOCIAL_STORY_CARD_WIDTH_PT = 136
export const SOCIAL_REEL_CARD_WIDTH_PT = 142
export const SOCIAL_GRID_CARD_WIDTH_PT = 148
export const SOCIAL_CAROUSEL_CARD_WIDTH_PT = 156
export const SOCIAL_TEXT_ONLY_CARD_WIDTH_PT = 154
export const SOCIAL_PIN_STANDARD_CARD_WIDTH_PT = 156

/** Story / reel vertical media (9:16), centered in the card. */
export const SOCIAL_VERTICAL_MEDIA_WIDTH_PT = 108
export const SOCIAL_VERTICAL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_VERTICAL_MEDIA_WIDTH_PT * 16) / 9)

/** Reel lower section is intentionally expanded (~33% of video-area height). */
export const SOCIAL_REEL_FOOTER_HEIGHT_PT = 64

/** Carousel portrait slide slot (4:5). */
export const SOCIAL_CAROUSEL_MEDIA_WIDTH_PT = 120
export const SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT = Math.round((SOCIAL_CAROUSEL_MEDIA_WIDTH_PT * 5) / 4)

/** Pinterest standard pin slot (2:3). */
export const SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT = 114
export const SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT = Math.round((SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT * 3) / 2)

/** Link-preview shell content block. */
export const SOCIAL_LINK_PREVIEW_THUMB_PT = 44
