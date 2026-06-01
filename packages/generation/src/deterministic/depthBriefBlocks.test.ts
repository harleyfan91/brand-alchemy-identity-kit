import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { buildExistingBrandEntryModel } from './existingBrandEntryScaffolds.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { depthBriefBlocks } from './depthBriefBlocks.js'

describe('depthBriefBlocks pro overrides', () => {
  it('replaces Ideal customer body when briefIdealCustomerBody is set', () => {
    const form = loadProSmokeFixture('text')
    const deterministic = depthBriefBlocks(form)
    const idealBefore = deterministic.find((b) => b.heading === 'Ideal customer')
    expect(idealBefore).toBeDefined()

    const aiProse = `Independent retailers with 1–2 locations and no in-house designer.

What defines them
• Owner approves signage changes
• Staff rotate through weekend shifts

What they care about
• One template system
• Recognizable window presence`
    const withOverride = depthBriefBlocks(form, { briefIdealCustomerBody: aiProse })
    const idealAfter = withOverride.find((b) => b.heading === 'Ideal customer')

    expect(idealAfter?.body).toBe(aiProse)
    expect(idealAfter?.body).not.toBe(idealBefore?.body)
  })
})

describe('depthBriefBlocks substance', () => {
  it('Brand overview includes offer line and Pro businessDescription without in-section guide pointer', () => {
    const form = loadProSmokeFixture('text')
    const overview = depthBriefBlocks(form).find((b) => b.heading === 'Brand overview')?.body ?? ''

    expect(overview).toMatch(/^Harbor Lane Studio — /)
    expect(overview).toContain('brand identity systems')
    expect(overview).toContain('design studio')
    expect(overview).not.toMatch(/For the customer-facing one-liner/)
    expect(overview).not.toMatch(/the guide keeps the short paste-ready line/)
  })

  it('Differentiation leads with intake copy, not a guide pointer', () => {
    const form = loadProSmokeFixture('text')
    const body = depthBriefBlocks(form).find((b) => b.heading === 'Differentiation')?.body ?? ''
    expect(body.startsWith('Compared with ')).toBe(true)
    expect(body).toContain('80-page decks')
    expect(body).not.toMatch(/For the on-page trust cue/)
  })

  it('inserts starting-assets module after kit REF and before Brand anchor when entry is provided', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const entry = buildExistingBrandEntryModel(form)
    const headings = depthBriefBlocks(form, undefined, entry).map((b) => b.heading)
    const refIndex = headings.indexOf('How this document relates to your kit')
    const anchorIndex = headings.indexOf('Brand anchor')
    const moduleIndex = headings.indexOf('Your starting assets')
    expect(refIndex).toBe(0)
    expect(moduleIndex).toBe(1)
    expect(anchorIndex).toBe(2)
  })

  it('Ideal customer uses unified structured snapshot without pain/outcome label strings', () => {
    const form = loadProSmokeFixture('text')
    const body = depthBriefBlocks(form).find((b) => b.heading === 'Ideal customer')?.body ?? ''
    expect(body).toContain('What defines them')
    expect(body).toContain('What they care about')
    expect(body).not.toContain('Pain points:')
    expect(body).not.toContain('Desired outcomes:')
  })
})
