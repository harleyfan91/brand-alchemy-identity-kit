import { describe, expect, it } from 'vitest'
import { pickCtaFrameId } from './pickPresentation.js'

describe('pickCtaFrameId', () => {
  it('maps social surface by primary social touchpoint family', () => {
    expect(pickCtaFrameId('social', 'professional', 'linkedin')).toBe('social_link_preview_v1')
    expect(pickCtaFrameId('social', 'casual', 'instagram')).toBe('social_grid_photo_v1')
    expect(pickCtaFrameId('social', 'casual', 'tiktok')).toBe('social_reel_cover_v1')
    expect(pickCtaFrameId('social', 'casual', 'facebook')).toBe('social_story_v1')
    expect(pickCtaFrameId('social', 'casual', 'pinterest')).toBe('social_pin_standard_v1')
    expect(pickCtaFrameId('social', 'casual', 'threads')).toBe('social_text_only_v1')
  })

  it('falls back deterministically when no primary social id is provided', () => {
    expect(pickCtaFrameId('social', 'professional')).toBe('social_feed_v1')
    expect(pickCtaFrameId('social', 'casual')).toBe('social_grid_photo_v1')
  })

  it('maps marketplace surface deterministically', () => {
    expect(pickCtaFrameId('marketplace', 'casual')).toBe('marketplace_listing_v1')
    expect(pickCtaFrameId('marketplace', 'professional')).toBe('marketplace_listing_v1')
  })

  it('maps email surface deterministically', () => {
    expect(pickCtaFrameId('email', 'casual')).toBe('email_text_only_v1')
    expect(pickCtaFrameId('email', 'professional')).toBe('email_text_only_v1')
  })

  it('returns undefined for surfaces without a frame mapping', () => {
    expect(pickCtaFrameId('website', 'casual')).toBeUndefined()
    expect(pickCtaFrameId('directory', 'professional')).toBeUndefined()
  })
})
