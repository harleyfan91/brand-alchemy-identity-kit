import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import {
  VISUAL_REFERENCE_PHOTO_COUNTS,
  VISUAL_REFERENCE_SPREAD_COUNT,
  allVisualReferenceSlots,
  applyVisualReferencePhotoCount,
  buildStyleGuideVisualReferenceModel,
  mergeVisualReferenceRankerSelections,
  normalizeVisualReferencePhotoCount,
} from './styleGuideVisualReferenceScaffolds.js'
import { VISUAL_REFERENCE_LAYOUTS } from './visualReferenceLayouts.js'

describe('Visual Reference layout tiers', () => {
  it('locks three photo-count tiers with explicit landscape/portrait manifests', () => {
    expect(VISUAL_REFERENCE_PHOTO_COUNTS).toEqual([6, 8, 9])

    expect(VISUAL_REFERENCE_LAYOUTS.vr_6).toMatchObject({
      photoCount: 6,
      landscapeCount: 3,
      portraitCount: 3,
      leadPattern: 'compact_2',
    })
    expect(VISUAL_REFERENCE_LAYOUTS.vr_8).toMatchObject({
      photoCount: 8,
      landscapeCount: 5,
      portraitCount: 3,
      leadPattern: 'brick_3',
    })
    expect(VISUAL_REFERENCE_LAYOUTS.vr_9).toMatchObject({
      photoCount: 9,
      landscapeCount: 5,
      portraitCount: 4,
      leadPattern: 'brick_3',
    })
  })

  it('normalizes ranker counts to the nearest locked tier', () => {
    expect(normalizeVisualReferencePhotoCount(5)).toBe(6)
    expect(normalizeVisualReferencePhotoCount(6)).toBe(6)
    expect(normalizeVisualReferencePhotoCount(7)).toBe(8)
    expect(normalizeVisualReferencePhotoCount(8)).toBe(8)
    expect(normalizeVisualReferencePhotoCount(9)).toBe(9)
    expect(normalizeVisualReferencePhotoCount(12)).toBe(9)
  })
})

describe('Style Guide Visual Reference Spread model', () => {
  it('builds vr_9 scaffold by default (logo + 3 lead + 6 grid)', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildStyleGuideVisualReferenceModel(form)

    expect(VISUAL_REFERENCE_SPREAD_COUNT).toBe(2)
    expect(model.layoutId).toBe('vr_9')
    expect(model.photoCount).toBe(9)
    expect(model.logoSlot.kind).toBe('logo')
    expect(model.leadPhotoSlots).toHaveLength(3)
    expect(model.leadPhotoSlots.map((s) => s.orientation)).toEqual(['landscape', 'portrait', 'landscape'])
    expect(model.gridPhotoSlots).toHaveLength(6)
    expect(allVisualReferenceSlots(model)).toHaveLength(10)
  })

  it('builds vr_6 scaffold with two lead and four grid slots', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildStyleGuideVisualReferenceModel(form, { photoCount: 6 })

    expect(model.layoutId).toBe('vr_6')
    expect(model.photoCount).toBe(6)
    expect(model.leadPhotoSlots).toHaveLength(2)
    expect(model.gridPhotoSlots).toHaveLength(4)
    expect(model.leadPhotoSlots.map((s) => s.orientation)).toEqual(['landscape', 'portrait'])
    expect(model.gridPhotoSlots.map((s) => s.orientation)).toEqual([
      'landscape',
      'portrait',
      'landscape',
      'portrait',
    ])
  })

  it('rebuilds slot manifest when ranker tier changes', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const base = buildStyleGuideVisualReferenceModel(form, { photoCount: 9 })
    const downgraded = applyVisualReferencePhotoCount(base, 6)

    expect(downgraded.layoutId).toBe('vr_6')
    expect(downgraded.leadPhotoSlots).toHaveLength(2)
    expect(downgraded.gridPhotoSlots).toHaveLength(4)
  })

  it('merges ranker selections by slotId across logo, lead, and grid slots', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const base = buildStyleGuideVisualReferenceModel(form)
    const merged = mergeVisualReferenceRankerSelections(base, [
      { slotId: 'logo', imageId: 'logo_asset', imageSrc: '/logo.png' },
      { slotId: 'lead_1', imageId: 'bank_0142', imageSrc: '/bank/0142.jpg' },
      { slotId: 'grid_c', imageId: 'bank_0088' },
    ])

    expect(merged.logoSlot.imageId).toBe('logo_asset')
    expect(merged.leadPhotoSlots[0]?.imageId).toBe('bank_0142')
    expect(merged.gridPhotoSlots[2]?.imageId).toBe('bank_0088')
    expect(merged.layoutId).toBe('vr_6')
  })
})
