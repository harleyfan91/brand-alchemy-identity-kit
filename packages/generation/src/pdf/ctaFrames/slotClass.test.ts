import { describe, expect, it } from 'vitest'

import { CTA_FRAME_IDS } from './types.js'
import { ctaFrameSlotClass } from './slotClass.js'

describe('ctaFrameSlotClass', () => {
  it('classifies every shipped frame id', () => {
    for (const frameId of CTA_FRAME_IDS) {
      const c =
        frameId === 'social_feed_v1'
          ? ctaFrameSlotClass(frameId, 'professional_network_feed')
          : ctaFrameSlotClass(frameId)
      expect(['mobile_tall', 'desktop_wide', 'compact_chip']).toContain(c)
    }
  })

  it('splits social_feed_v1 by variant', () => {
    expect(ctaFrameSlotClass('social_feed_v1', 'professional_network_feed')).toBe('desktop_wide')
    expect(ctaFrameSlotClass('social_feed_v1', 'creator_visual_feed')).toBe('compact_chip')
  })

  it('treats LinkedIn-style link preview as desktop-wide for folio layout', () => {
    expect(ctaFrameSlotClass('social_link_preview_v1')).toBe('desktop_wide')
  })
})
