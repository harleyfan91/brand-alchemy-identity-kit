/**
 * Maps frameId to React-PDF components for folio 05 CTAs.
 */
import type { ReactNode } from 'react'
import { SocialFeedCardFrame } from './SocialFeedCardFrame.js'
import { SocialGridPhotoFrame } from './SocialGridPhotoFrame.js'
import { SocialReelCoverFrame } from './SocialReelCoverFrame.js'
import { SocialStoryFrame } from './SocialStoryFrame.js'
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
    default:
      return null
  }
}
