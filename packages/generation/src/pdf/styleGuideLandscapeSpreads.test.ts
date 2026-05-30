import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { depthStyleGuideBlocks } from '../deterministic/depthStyleGuideBlocks.js'
import { typographySectionLead } from '../deterministic/coreAssembly.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { CORE_STYLE_GUIDE_SPREAD_COUNT } from './StyleGuideLandscapeSpreads.js'

describe('Style Guide landscape spread plan', () => {
  it('maps depth blocks into five core spreads without dropping sections', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const blocks = depthStyleGuideBlocks(form)
    const headings = blocks.map((b) => b.heading)

    expect(CORE_STYLE_GUIDE_SPREAD_COUNT).toBe(5)
    expect(headings).toContain('How this document relates to your kit')
    expect(headings).toContain('Palette')
    expect(headings).toContain('Visual direction')
    expect(headings).not.toContain('Typography')
    expect(headings).toContain('Style principles')
    expect(headings).toContain('Do / avoid')
    expect(headings).toContain('Imagery direction')
    expect(headings).toContain('Visual application')
    expect(headings).not.toContain('Where to apply this first')
  })

  it('does not defer palette swatches to the Brand Identity Guide', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const palette = depthStyleGuideBlocks(form).find((b) => b.heading === 'Palette')
    expect(palette?.body).not.toMatch(/Brand Identity Guide/)
    expect(palette?.body).not.toMatch(/Swatches and hex/)
    expect(palette?.body).not.toMatch(/Look section/i)
  })

  it('typography usage lives on folio 03 via section lead, not a separate depth block', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    form.tier = 'pro'
    form.step6.existingTypeface = 'Futura on menus, Arial on receipts'
    const headings = depthStyleGuideBlocks(form).map((b) => b.heading)
    expect(headings).not.toContain('Typography')
    expect(typographySectionLead(form)).toMatch(/Futura on menus/i)
    expect(typographySectionLead(form)).toMatch(/kit embed fonts/i)
    expect(typographySectionLead(form)).not.toMatch(/Brand Identity Guide/)
  })

  it('visual application references spreads in this guide, not Look in the Brand Identity Guide', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const application = depthStyleGuideBlocks(form).find((b) => b.heading === 'Visual application')
    expect(application?.body).toMatch(/this guide/i)
    expect(application?.body).not.toMatch(/Brand Identity Guide → Look/)
  })

  it('kit intro frames Style Guide as the working visual reference', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const intro = depthStyleGuideBlocks(form).find((b) => b.heading === 'How this document relates to your kit')
    expect(intro?.body).toMatch(/working reference/i)
    expect(intro?.body).not.toMatch(/goes deeper on visual principles/)
  })
})
