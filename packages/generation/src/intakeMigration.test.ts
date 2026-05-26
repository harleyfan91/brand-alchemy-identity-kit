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
    expect(migrated.intakeSchemaVersion).toBe(7)
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
    expect(out.intakeSchemaVersion).toBe(7)
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

  it('runs v4 → v7 when already on v4 to seed existing-brand fields and split colors', () => {
    const v4Form: IdentityKitForm = {
      ...makeV3Fixture({ visualNotes: 'Already merged' }),
      intakeSchemaVersion: 4,
    }
    const out = migrateIdentityKitForm(v4Form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step6.visualNotes).toBe('Already merged')
    expect(out.step6.hasExistingBrand).toBe(false)
    expect(out.step6.existingBrand).toEqual({})
  })
})

describe('migrateIdentityKitForm v4 -> v5 existing-brand seed + reference shim', () => {
  function makeV4Fixture(step6Patch: Partial<IdentityKitForm['step6']> = {}): IdentityKitForm {
    const base = loadCoreSampleFixture()
    return {
      ...base,
      intakeSchemaVersion: 4,
      step6: { ...base.step6, ...step6Patch },
    }
  }

  it('seeds hasExistingBrand=false and an empty existingBrand when neither is set', () => {
    const form = makeV4Fixture({ hasExistingBrand: undefined, existingBrand: undefined })
    const out = migrateIdentityKitForm(form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step6.hasExistingBrand).toBe(false)
    expect(out.step6.existingBrand).toEqual({})
  })

  it('preserves an explicit hasExistingBrand=true', () => {
    const form = makeV4Fixture({ hasExistingBrand: true, existingBrand: undefined })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.hasExistingBrand).toBe(true)
    expect(out.step6.existingBrand).toEqual({})
  })

  it('shims legacy referenceUploadName into existingBrand.referenceImageRef when absent', () => {
    const form = makeV4Fixture({
      referenceUploadName: 'inspiration.png',
      existingBrand: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand?.referenceImageRef).toBe('inspiration.png')
  })

  it('does not overwrite an existing existingBrand.referenceImageRef', () => {
    const form = makeV4Fixture({
      referenceUploadName: 'old.png',
      existingBrand: { referenceImageRef: 'pro-uploads/sess_x/referenceImage.png' },
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand?.referenceImageRef).toBe(
      'pro-uploads/sess_x/referenceImage.png',
    )
  })

  it('leaves existingBrand empty when no legacy filename is present', () => {
    const form = makeV4Fixture({
      referenceUploadName: '',
      existingBrand: undefined,
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand).toEqual({})
  })

  it('runs v5 → v7 when already on v5 to split colors and lift url to step1', () => {
    const v5Form: IdentityKitForm = {
      ...makeV4Fixture({ hasExistingBrand: true, existingBrand: { url: 'https://example.com' } }),
      intakeSchemaVersion: 5,
    }
    const out = migrateIdentityKitForm(v5Form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step6.hasExistingBrand).toBe(true)
    expect(out.step6.existingBrand?.url).toBeUndefined()
    expect(out.step1.businessWebsite).toBe('https://example.com')
  })
})

describe('migrateIdentityKitForm v5 -> v6 extracted color split', () => {
  function makeV5Fixture(
    existingBrand: IdentityKitForm['step6']['existingBrand'] & {
      extractedColors?: string[]
    } = {},
  ): IdentityKitForm {
    const base = loadCoreSampleFixture()
    return {
      ...base,
      intakeSchemaVersion: 5,
      step6: {
        ...base.step6,
        hasExistingBrand: true,
        existingBrand,
      },
    }
  }

  it('migrates legacy extractedColors into logoExtractedColors when absent', () => {
    const form = makeV5Fixture({
      extractedColors: ['#A37BFF', '#1B1B1B', '#F0E6D2'],
    })
    const out = migrateIdentityKitForm(form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step6.existingBrand?.logoExtractedColors).toEqual([
      '#A37BFF',
      '#1B1B1B',
      '#F0E6D2',
    ])
    expect(
      (out.step6.existingBrand as { extractedColors?: string[] }).extractedColors,
    ).toBeUndefined()
  })

  it('does not overwrite a pre-existing logoExtractedColors when both are present', () => {
    const form = makeV5Fixture({
      extractedColors: ['#FFFFFF', '#000000'],
      logoExtractedColors: ['#A37BFF', '#1B1B1B'],
    })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand?.logoExtractedColors).toEqual(['#A37BFF', '#1B1B1B'])
    expect(
      (out.step6.existingBrand as { extractedColors?: string[] }).extractedColors,
    ).toBeUndefined()
  })

  it('leaves both extracted color fields undefined when no legacy data is present', () => {
    const form = makeV5Fixture({})
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand?.logoExtractedColors).toBeUndefined()
    expect(out.step6.existingBrand?.referenceExtractedColors).toBeUndefined()
  })

  it('runs v6 → v7 to lift legacy url to step1.businessWebsite', () => {
    const v6Form: IdentityKitForm = {
      ...makeV5Fixture({
        logoExtractedColors: ['#A37BFF'],
        referenceExtractedColors: ['#1B1B1B'],
        url: 'https://example.com',
      }),
      intakeSchemaVersion: 6,
    }
    const out = migrateIdentityKitForm(v6Form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step1.businessWebsite).toBe('https://example.com')
    expect(out.step6.existingBrand?.url).toBeUndefined()
    expect(out.step6.existingBrand?.logoExtractedColors).toEqual(['#A37BFF'])
    expect(out.step6.existingBrand?.referenceExtractedColors).toEqual(['#1B1B1B'])
  })

  it('is a no-op when already on v7', () => {
    const v7Form: IdentityKitForm = {
      ...makeV5Fixture({
        logoExtractedColors: ['#A37BFF'],
        referenceExtractedColors: ['#1B1B1B'],
      }),
      intakeSchemaVersion: 7,
    }
    const out = migrateIdentityKitForm(v7Form)
    expect(out).toBe(v7Form)
  })
})

describe('migrateIdentityKitForm v6 -> v7 business website relocation', () => {
  function makeV6Fixture(
    step6Patch: Partial<IdentityKitForm['step6']> = {},
    step1Patch: Partial<IdentityKitForm['step1']> = {},
  ): IdentityKitForm {
    const base = loadCoreSampleFixture()
    return {
      ...base,
      intakeSchemaVersion: 6,
      step1: { ...base.step1, ...step1Patch },
      step6: { ...base.step6, hasExistingBrand: true, ...step6Patch },
    }
  }

  it('lifts existingBrand.url to step1.businessWebsite and drops the legacy field', () => {
    const form = makeV6Fixture({
      existingBrand: { url: 'https://example.com', logoRef: 'pro-uploads/sess_x/logo.png' },
    })
    const out = migrateIdentityKitForm(form)
    expect(out.intakeSchemaVersion).toBe(7)
    expect(out.step1.businessWebsite).toBe('https://example.com')
    expect(out.step6.existingBrand?.url).toBeUndefined()
    expect(out.step6.existingBrand?.logoRef).toBe('pro-uploads/sess_x/logo.png')
  })

  it('preserves an explicit step1.businessWebsite value over a legacy url', () => {
    const form = makeV6Fixture(
      { existingBrand: { url: 'https://legacy.example.com' } },
      { businessWebsite: 'https://primary.example.com' },
    )
    const out = migrateIdentityKitForm(form)
    expect(out.step1.businessWebsite).toBe('https://primary.example.com')
    expect(out.step6.existingBrand?.url).toBeUndefined()
  })

  it('leaves businessWebsite undefined when neither location has a value', () => {
    const form = makeV6Fixture({ existingBrand: {} })
    const out = migrateIdentityKitForm(form)
    expect(out.step1.businessWebsite).toBeUndefined()
    expect(out.step6.existingBrand?.url).toBeUndefined()
  })

  it('strips legacy url even when value is empty string', () => {
    const form = makeV6Fixture({ existingBrand: { url: '' } })
    const out = migrateIdentityKitForm(form)
    expect(out.step6.existingBrand?.url).toBeUndefined()
    expect(out.step1.businessWebsite).toBeUndefined()
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
