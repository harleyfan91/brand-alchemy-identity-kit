import { describe, expect, it } from 'vitest'
import { pickCtaFrameId } from './pickPresentation.js'

describe('pickCtaFrameId', () => {
  it('returns social_feed_v1 for social surface', () => {
    expect(pickCtaFrameId('social', 'casual')).toBe('social_feed_v1')
    expect(pickCtaFrameId('social', 'professional')).toBe('social_feed_v1')
  })

  it('returns undefined for non-social surfaces', () => {
    expect(pickCtaFrameId('website', 'casual')).toBeUndefined()
    expect(pickCtaFrameId('email', 'professional')).toBeUndefined()
    expect(pickCtaFrameId('marketplace', 'casual')).toBeUndefined()
    expect(pickCtaFrameId('directory', 'professional')).toBeUndefined()
  })
})
