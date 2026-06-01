import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { buildExistingBrandEntryModel } from './existingBrandEntryScaffolds.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'

describe('existingBrandEntryScaffolds', () => {
  it('builds structured existing-brand entry with observation slots', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildExistingBrandEntryModel(form)

    expect(model.readerFraming).toMatch(/what you shared/i)
    expect(model.assets.businessName).toBe('Northwind Roasters')
    expect(model.assets.hexColors.length).toBeGreaterThan(0)
    expect(model.assets.logoOnFile).toBe(true)
    expect(model.assets.logoImageSrc).toMatch(/logo\.jpg$/)
    expect(model.assets.referenceImageSrc).toMatch(/reference\.jpg$/)
    expect(model.assets.colorSwatches.length).toBe(2)
    expect(model.assets.colorSwatches[0]?.name.length).toBeGreaterThan(0)
    expect(model.tension).not.toBeNull()
  })

  it('overlays all four vision observation fields when provided', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildExistingBrandEntryModel(form, {
      fieldsCited: ['step6.existingBrand.logoRef'],
      logoObservation: 'AI logo note',
      referenceImageObservation: 'AI reference note',
      voiceSamplesObservation: 'AI voice samples note',
      websiteObservation: 'AI website note',
    })

    const byLabel = Object.fromEntries(model.observations.map((o) => [o.label, o.body]))
    expect(byLabel.Logo).toBe('AI logo note')
    expect(byLabel['Reference image']).toBe('AI reference note')
    expect(byLabel['Voice samples']).toBe('AI voice samples note')
    expect(byLabel.Website).toBe('AI website note')
  })
})
