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
    expect(migrated.intakeSchemaVersion).toBe(4)
    expect(migrated.step1.businessOperatingModel).toBe('online_only')
    expect(migrated.step1.guideFocus).toBeTruthy()
  })

  it('is idempotent when already migrated', () => {
    const form = loadCoreSampleFixture()
    const twice = migrateIdentityKitForm(migrateIdentityKitForm(form))
    expect(twice).toEqual(migrateIdentityKitForm(form))
  })

  it('does not overwrite v2 in-progress empty selection while adding new guide signals', () => {
    const form = loadCoreSampleFixture()
    const draft = {
      ...form,
      intakeSchemaVersion: 2,
      step1: { ...form.step1, businessOperatingModel: '' },
    }
    const out = migrateIdentityKitForm(draft)
    expect(out.step1.businessOperatingModel).toBe('')
    expect(out.step1.guideFocus).toBeTruthy()
  })
})

describe('migrateIdentityKitForm v3 -> v4 visualNotes merge', () => {
  function makeV3Fixture(step6Patch: Partial<IdentityKitForm['step6']> = {}): IdentityKitForm {
    const base = loadCoreSampleFixture()
    return {
      ...base,
      intakeSchemaVersion: 3,
      step1: { ...base.step1, guideFocus: 'look_more_professional' },
      step6: { ...base.step6, ...step6Patch },
    }
  }

  it('merges both colorMoodNotes and styleNotes into visualNotes', () => {
    const form = makeV3Fixture({
      colorMoodNotes: 'Soft warm tones, dawn light',
      styleNotes: 'Clean serif headings, lots of negative space',
      visualNotes: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.intakeSchemaVersion).toBe(4)
    expect(out.step6.visualNotes).toBe(
      'Soft warm tones, dawn light Clean serif headings, lots of negative space',
    )
  })

  it('uses only colorMoodNotes when styleNotes is empty', () => {
    const form = makeV3Fixture({
      colorMoodNotes: 'Bold jewel tones',
      styleNotes: '',
      visualNotes: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.visualNotes).toBe('Bold jewel tones')
  })

  it('uses only styleNotes when colorMoodNotes is empty', () => {
    const form = makeV3Fixture({
      colorMoodNotes: '',
      styleNotes: 'Editorial photography, magazine-grade typography',
      visualNotes: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.visualNotes).toBe('Editorial photography, magazine-grade typography')
  })

  it('leaves visualNotes undefined when both legacy fields are empty', () => {
    const form = makeV3Fixture({
      colorMoodNotes: '',
      styleNotes: '',
      visualNotes: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.visualNotes).toBeUndefined()
  })

  it('preserves an explicit visualNotes value over the legacy pair', () => {
    const form = makeV3Fixture({
      colorMoodNotes: 'Should be ignored',
      styleNotes: 'Also ignored',
      visualNotes: 'Author-supplied notes',
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.visualNotes).toBe('Author-supplied notes')
  })

  it('is a no-op when already on v4', () => {
    const v4Form: IdentityKitForm = {
      ...makeV3Fixture({ visualNotes: 'Already merged' }),
      intakeSchemaVersion: 4,
    }
    const out = migrateIdentityKitForm(v4Form)
    expect(out).toBe(v4Form)
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
