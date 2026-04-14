import { describe, expect, it } from 'vitest'

import {
  inferBusinessOperatingModel,
  migrateIdentityKitForm,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'

describe('migrateIdentityKitForm (Path C)', () => {
  it('backfills v1 payload without intakeSchemaVersion and businessOperatingModel', () => {
    const full = loadCoreSampleFixture()
    const v1 = { ...full, step1: { ...full.step1 } }
    delete (v1 as { intakeSchemaVersion?: number }).intakeSchemaVersion
    delete (v1.step1 as { businessOperatingModel?: string }).businessOperatingModel
    const migrated = migrateIdentityKitForm(v1 as IdentityKitForm)
    expect(migrated.intakeSchemaVersion).toBe(2)
    expect(migrated.step1.businessOperatingModel).toBe('online_only')
  })

  it('is idempotent when already v2 with model', () => {
    const form = loadCoreSampleFixture()
    const twice = migrateIdentityKitForm(migrateIdentityKitForm(form))
    expect(twice).toEqual(migrateIdentityKitForm(form))
  })

  it('does not overwrite v2 in-progress empty selection', () => {
    const form = loadCoreSampleFixture()
    const draft = {
      ...form,
      intakeSchemaVersion: 2,
      step1: { ...form.step1, businessOperatingModel: '' },
    }
    const out = migrateIdentityKitForm(draft)
    expect(out.step1.businessOperatingModel).toBe('')
  })
})

describe('inferBusinessOperatingModel', () => {
  it('maps construction_trades solo_expert to we_travel_to_customers', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'construction_trades'
    form.step1.brandNarrator = 'solo_expert'
    expect(inferBusinessOperatingModel(form)).toBe('we_travel_to_customers')
  })
})
