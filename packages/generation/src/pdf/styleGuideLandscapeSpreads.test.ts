import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { depthStyleGuideBlocks } from '../deterministic/depthStyleGuideBlocks.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { CORE_STYLE_GUIDE_SPREAD_COUNT } from './StyleGuideLandscapeSpreads.js'

describe('Style Guide landscape spread plan', () => {
  it('maps all depth blocks into six core spreads without dropping sections', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const blocks = depthStyleGuideBlocks(form)
    const headings = blocks.map((b) => b.heading)

    expect(CORE_STYLE_GUIDE_SPREAD_COUNT).toBe(6)
    expect(headings).toContain('How this document relates to your kit')
    expect(headings).toContain('Palette')
    expect(headings).toContain('Visual direction')
    expect(headings).toContain('Typography')
    expect(headings).toContain('Style principles')
    expect(headings).toContain('Do / avoid')
    expect(headings).toContain('Imagery direction')
    expect(headings).toContain('Visual application')
    expect(headings).not.toContain('Where to apply this first')
  })

  it('preserves full typography body for usage spread', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const typography = depthStyleGuideBlocks(form).find((b) => b.heading === 'Typography')
    expect(typography?.body).toMatch(/Brand Identity Guide/)
    expect(typography!.body.length).toBeGreaterThan(40)
  })
})
