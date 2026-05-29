import { describe, expect, it } from 'vitest'
import {
  industryArchetypes,
  isValidPaletteId,
  isValidStyleId,
  migrateIdentityKitForm,
} from '@identity-kit/shared'

import { depthBriefBlocks } from '../../deterministic/depthBriefBlocks.js'
import { loadProSmokeFixture, PRO_SMOKE_FIXTURE_IDS } from '../loadProSmokeFixture.js'

function isCardId(industry: string, id: string): boolean {
  const list = industryArchetypes[industry] ?? industryArchetypes.other ?? []
  return list.some((o) => o.id === id)
}

describe('pro-smoke fixtures', () => {
  it('text fixture is wizard-aligned creative_services B2B studio', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    expect(form.step1.industry).toBe('creative_services')
    expect(form.step1.offer.offerId).toBe('brand_identity')
    expect(form.step1.offer.audienceId).toBe('brands_outgrowing_diy')
    expect(isCardId(form.step1.industry, form.step2.customerArchetype)).toBe(true)
    expect(form.step2.painPoints?.trim().length).toBeGreaterThan(40)
    expect(form.step2.desiredOutcomes?.trim().length).toBeGreaterThan(40)
    expect(form.step1.businessDescription).toMatch(/design studio/i)
  })

  it('vision fixture uses food_beverage controlled Step 1 ids', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    expect(form.step1.industry).toBe('food_beverage')
    expect(form.step1.offer.offerId).toBe('specialty_coffee')
    expect(isCardId(form.step1.industry, form.step2.customerArchetype)).toBe(true)
    expect(form.step6.hasExistingBrand).toBe(true)
  })

  it('deterministic snapshot from text fixture is structured, not one paragraph', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const body = depthBriefBlocks(form).find((b) => b.heading === 'Ideal customer')?.body ?? ''

    expect(body).toContain('What defines them')
    expect(body).toContain('What they care about')
    expect(body).not.toContain('Pain points:')
    expect(body.split('\n\n').length).toBeGreaterThan(1)
  })

  it('exports both fixture ids', () => {
    expect(PRO_SMOKE_FIXTURE_IDS).toEqual(['text', 'vision'])
  })

  it('uses valid wizard palette and style ids', () => {
    for (const id of PRO_SMOKE_FIXTURE_IDS) {
      const form = migrateIdentityKitForm(loadProSmokeFixture(id))
      expect(isValidPaletteId(form.step6.selectedPalette)).toBe(true)
      expect(isValidStyleId(form.step6.selectedStyle)).toBe(true)
    }
  })
})
