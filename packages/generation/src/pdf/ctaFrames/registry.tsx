/**
 * Maps frameId to React-PDF components for folio 05 CTAs.
 */
import type { ReactNode } from 'react'
import type { CoreKitPdfStyles } from '../CoreKitDocuments.js'
import { SocialFeedCardFrame } from './SocialFeedCardFrame.js'
import type { CtaFrameHyphenation, CtaFrameId } from './types.js'

export function renderCtaFrame(args: {
  frameId: CtaFrameId
  styles: CoreKitPdfStyles
  businessName: string
  lines: string[]
  hyphenationCallback: CtaFrameHyphenation
}): ReactNode {
  const { frameId, styles, businessName, lines, hyphenationCallback } = args
  const common = { styles, businessName, lines, hyphenationCallback }
  switch (frameId) {
    case 'social_feed_v1':
      return <SocialFeedCardFrame {...common} />
    default:
      return null
  }
}
