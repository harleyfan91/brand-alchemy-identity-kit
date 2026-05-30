import { describe, expect, it } from 'vitest'

import {
  IMAGE_BANK_MIN_PER_CELL,
  PALETTE_IDS,
  STYLE_IDS,
  inferImagerySubjects,
  ReferenceVisionProfileSchema,
  assertCompletePaletteFamilyCoverage,
  assertCompleteStyleRegisterCoverage,
  defaultPhotoColorRelationship,
  imageBankCoverageCells,
  industrySuitabilityFromIndustryId,
  narratorAlignmentFromBrandNarrator,
  paletteFamilyFromPaletteId,
  primaryStyleRegisterFromSelectedStyle,
  referenceVisionProfileToFlatTags,
  styleRegistersForKitMatching,
  validateImageBankIngestTags,
  type IdentityKitForm,
} from '@identity-kit/shared'

describe('imageBank paletteFamilyMap', () => {
  it('covers every palette in PALETTE_CATALOG', () => {
    expect(() => assertCompletePaletteFamilyCoverage()).not.toThrow()
    expect(PALETTE_IDS.every((id) => paletteFamilyFromPaletteId(id))).toBe(true)
  })
})

describe('imageBank styleRegisterMap', () => {
  it('covers every wizard style id', () => {
    expect(() => assertCompleteStyleRegisterCoverage()).not.toThrow()
    expect(primaryStyleRegisterFromSelectedStyle('clean_minimal')).toBe('refined')
    expect(styleRegistersForKitMatching('bold_graphic')).toContain('sharp')
    expect(STYLE_IDS.every((id) => primaryStyleRegisterFromSelectedStyle(id))).toBe(true)
  })
})

describe('imageBank industry + narrator maps', () => {
  it('maps food to hospitality', () => {
    expect(industrySuitabilityFromIndustryId('food_beverage')).toEqual(['hospitality_food'])
  })

  it('maps product_led narrator to growing_co', () => {
    expect(narratorAlignmentFromBrandNarrator('product_led')).toBe('growing_co')
  })
})

describe('imageBank coverage matrix', () => {
  it('defines 36 style×scene cells at minimum 5 each', () => {
    const cells = imageBankCoverageCells()
    expect(cells).toHaveLength(36)
    expect(cells.every((cell) => cell.minimum === IMAGE_BANK_MIN_PER_CELL)).toBe(true)
  })
})

describe('photoColorRelationship defaults', () => {
  it('derives from selectedStyle', () => {
    expect(defaultPhotoColorRelationship('organic_natural')).toBe('natural-full-color')
    expect(defaultPhotoColorRelationship('clean_minimal')).toBe('neutral-backdrops')
  })
})

describe('ReferenceVisionProfileSchema', () => {
  it('parses structured reference output', () => {
    const parsed = ReferenceVisionProfileSchema.parse({
      photoColorCharacter: 'clean-monochrome',
      photoColorRelationship: 'neutral-backdrops',
      styleRegisters: ['austere', 'sharp'],
      imagerySubjects: ['architecture-built'],
      sceneTypes: ['environment', 'lighting'],
      moodAdjectives: ['austere', 'sharp'],
      compositionNotes: 'High contrast B&W architectural light.',
    })
    expect(referenceVisionProfileToFlatTags(parsed)).toContain('architecture-built')
  })
})

describe('inferImagerySubjects', () => {
  it('combines industry and style hints', () => {
    const form = {
      step1: { industry: 'food_beverage' },
      step6: { selectedStyle: 'organic_natural' },
    } as IdentityKitForm
    const subjects = inferImagerySubjects(form)
    expect(subjects).toContain('food-dining')
    expect(subjects).toContain('nature-outdoors')
  })
})

describe('validateImageBankIngestTags', () => {
  it('rejects unknown enum values', () => {
    const result = validateImageBankIngestTags({
      sourceUrl: 'https://images.unsplash.com/photo-1',
      license: 'unsplash',
      paletteFamily: 'not-a-family',
      styleRegister: 'warm',
      sceneType: 'texture',
    })
    expect(result.success).toBe(false)
  })

  it('accepts imagerySubjects on ingest tags', () => {
    const result = validateImageBankIngestTags({
      sourceUrl: 'https://images.unsplash.com/photo-1',
      license: 'unsplash',
      paletteFamily: 'warm-earth',
      styleRegister: 'warm',
      sceneType: 'environment',
      imagerySubjects: ['food-dining', 'hands-process'],
    })
    expect(result.success).toBe(true)
  })
})
