import { describe, expect, it } from 'vitest'

import { VISUAL_REFERENCE_BANK_METADATA_REQUIREMENTS, VISUAL_REFERENCE_LAYOUTS } from './visualReferenceLayouts.js'

describe('visualReferenceLayouts', () => {
  it('slot manifests sum to photoCount with correct orientation totals', () => {
    for (const layout of Object.values(VISUAL_REFERENCE_LAYOUTS)) {
      const landscapes = layout.slots.filter((s) => s.orientation === 'landscape').length
      const portraits = layout.slots.filter((s) => s.orientation === 'portrait').length

      expect(layout.slots.length).toBe(layout.photoCount)
      expect(landscapes).toBe(layout.landscapeCount)
      expect(portraits).toBe(layout.portraitCount)
    }
  })

  it('documents required bank metadata fields including orientation', () => {
    const requiredFields = VISUAL_REFERENCE_BANK_METADATA_REQUIREMENTS.requiredFields.map((f) => f.field)
    expect(requiredFields).toContain('orientation')
    expect(requiredFields).toContain('sceneType')
    expect(requiredFields).toContain('imageId')
  })

  it('vr_6 grid slots include two landscapes and two portraits on folio 08', () => {
    const gridSlots = VISUAL_REFERENCE_LAYOUTS.vr_6.slots.filter((s) => s.folio === 'grid')
    expect(gridSlots.map((s) => s.slotId)).toEqual(['grid_a', 'grid_b', 'grid_c', 'grid_d'])
    expect(gridSlots.filter((s) => s.orientation === 'landscape')).toHaveLength(2)
    expect(gridSlots.filter((s) => s.orientation === 'portrait')).toHaveLength(2)
  })
})
