import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { contentStarterBlocks } from './contentStarterBlocks.js'
import { buildContentStarterPdfModel, CSP_ONE_LINER_LABELS } from './contentStarterPdfModel.js'

describe('contentStarterBlocks', () => {
  it('splits Harbor Lane scaffolds across two pages', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const { page1, page2 } = contentStarterBlocks(form)

    expect(page1.map((b) => b.heading)).toEqual([
      'How this document relates to your kit',
      'Brand summaries',
      'Homepage messaging',
    ])
    expect(page2.map((b) => b.heading)).toEqual([
      'Short social bio',
      'Long bio / About',
      'Caption starters',
      'Content pillars',
      'Calls to action',
    ])

    const summaries = page1.find((b) => b.heading === 'Brand summaries')?.body ?? ''
    expect(summaries).toContain('Harbor Lane Studio')
    expect(summaries).toContain('Transformation-led')

    const pillars = page2.find((b) => b.heading === 'Content pillars')?.body ?? ''
    expect(pillars.length).toBeGreaterThan(40)
  })
})

describe('buildContentStarterPdfModel', () => {
  it('structures Harbor Lane scaffolds for CSP PDF components', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const model = buildContentStarterPdfModel(form)

    expect(model.summaries.oneLiners.length).toBeGreaterThanOrEqual(2)
    expect(model.summaries.oneLiners[0]?.label).toBe(CSP_ONE_LINER_LABELS.transformation)
    expect(model.summaries.elevator).toContain('Harbor Lane Studio')
    expect(model.homepage.routes.length).toBeGreaterThanOrEqual(2)
    expect(model.captions.length).toBeGreaterThanOrEqual(2)
    expect(model.pillars.length).toBeGreaterThanOrEqual(4)
    expect(model.pillars.every((p) => p.prompts.length === 2)).toBe(true)
    expect(model.cta.kind).toBe('surfaces')
    if (model.cta.kind === 'surfaces') {
      expect(model.cta.groups.length).toBeGreaterThan(0)
    }
  })
})
