/**
 * Maps frameId to React-PDF components for folio 05 CTAs.
 */
import type { ReactNode } from 'react'
import { SocialCarouselFrame } from './SocialCarouselFrame.js'
import { SocialFeedCardFrame } from './SocialFeedCardFrame.js'
import { SocialGridPhotoFrame } from './SocialGridPhotoFrame.js'
import { SocialLinkPreviewFrame } from './SocialLinkPreviewFrame.js'
import { SocialPinStandardFrame } from './SocialPinStandardFrame.js'
import { SocialReelCoverFrame } from './SocialReelCoverFrame.js'
import { SocialStoryFrame } from './SocialStoryFrame.js'
import { SocialTextOnlyFrame } from './SocialTextOnlyFrame.js'
import type { CtaFrameBaseProps, CtaFrameId } from './types.js'

export function renderCtaFrame(
  args: CtaFrameBaseProps & { frameId: CtaFrameId },
): ReactNode {
  const { frameId, styles, businessName, lines, hyphenationCallback, platformSummary, socialFeedVariant } = args
  const common: CtaFrameBaseProps = {
    styles,
    businessName,
    lines,
    hyphenationCallback,
    platformSummary,
    socialFeedVariant,
  }
  switch (frameId) {
    case 'social_feed_v1':
      return <SocialFeedCardFrame {...common} />
    case 'social_story_v1':
      return <SocialStoryFrame {...common} />
    case 'social_reel_cover_v1':
      return <SocialReelCoverFrame {...common} />
    case 'social_grid_photo_v1':
      return <SocialGridPhotoFrame {...common} />
    case 'social_pin_standard_v1':
      return <SocialPinStandardFrame {...common} />
    case 'social_carousel_v1':
      return <SocialCarouselFrame {...common} />
    case 'social_link_preview_v1':
      return <SocialLinkPreviewFrame {...common} />
    case 'social_text_only_v1':
      return <SocialTextOnlyFrame {...common} />
    default:
      return null
  }
}
