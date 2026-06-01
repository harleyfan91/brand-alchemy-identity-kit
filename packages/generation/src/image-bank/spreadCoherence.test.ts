import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm, resolveImageBankKitSignals } from '@identity-kit/shared'

import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import type { ImageBankAsset } from './types.js'
import {
  isBrutalistFriendlyKit,
  isFuturisticMinimalAsset,
  isPatternFullSceneMisfile,
  slotAssignmentAdjustment,
  spreadCoherenceBonus,
} from './spreadCoherence.js'
import { assignDeterministicRankerPicks, buildVisualReferenceShortlist } from './visualReferencePipeline.js'
import { getVisualReferenceLayout } from '../deterministic/visualReferenceLayouts.js'

function asset(partial: Partial<ImageBankAsset> & Pick<ImageBankAsset, 'imageId' | 'orientation' | 'sceneType'>): ImageBankAsset {
  return {
    sourceUrl: 'https://example.com/x.jpg',
    paletteFamily: 'warm-earth',
    styleRegister: 'warm',
    license: 'unsplash',
    src: `assets/${partial.imageId}.jpg`,
    widthPx: 1600,
    heightPx: 1200,
    bytes: 100_000,
    jpegQuality: 82,
    ingestedAt: new Date().toISOString(),
    ...partial,
  }
}

describe('spreadCoherence', () => {
  it('flags sleek futuristic-min assets separately from brutalist-friendly kits', () => {
    expect(
      isFuturisticMinimalAsset(
        asset({
          imageId: 'geo',
          orientation: 'landscape',
          sceneType: 'pattern',
          moodAdjectives: ['futuristic', 'sharp', 'geometric'],
        }),
      ),
    ).toBe(true)

    expect(
      isFuturisticMinimalAsset(
        asset({
          imageId: 'brut',
          orientation: 'landscape',
          sceneType: 'pattern',
          moodAdjectives: ['austere', 'raw', 'geometric'],
        }),
      ),
    ).toBe(false)

    const brutalistKit = resolveImageBankKitSignals(
      migrateIdentityKitForm({
        ...loadProSmokeFixture('vision'),
        step6: {
          ...loadProSmokeFixture('vision').step6,
          selectedStyle: 'clean_minimal',
          moodAdjectives: ['austere', 'geometric', 'sharp'],
        },
      }),
    )
    expect(isBrutalistFriendlyKit(brutalistKit)).toBe(true)
  })

  it('penalizes full-room interiors mis-tagged as pattern', () => {
    const kitchenPattern = asset({
      imageId: 'kitchen',
      orientation: 'landscape',
      sceneType: 'pattern',
      imagerySubjects: ['materials-texture', 'interiors-spaces'],
    })
    const tilePattern = asset({
      imageId: 'tiles',
      orientation: 'landscape',
      sceneType: 'pattern',
      imagerySubjects: ['materials-texture', 'architecture-built'],
    })

    expect(isPatternFullSceneMisfile(kitchenPattern)).toBe(true)
    expect(isPatternFullSceneMisfile(tilePattern)).toBe(false)
  })

  it('penalizes futuristic-min pattern when spread already reads warm/organic', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const signals = resolveImageBankKitSignals(form)
    const picked = [
      asset({
        imageId: 'beans',
        orientation: 'landscape',
        sceneType: 'texture',
        moodAdjectives: ['warm', 'organic', 'premium'],
        industrySuitability: ['hospitality_food'],
      }),
    ]
    const futuristicPattern = asset({
      imageId: 'geo',
      orientation: 'landscape',
      sceneType: 'pattern',
      moodAdjectives: ['futuristic', 'sharp', 'geometric'],
      styleRegister: 'refined',
    })
    const warmPattern = asset({
      imageId: 'tiles',
      orientation: 'landscape',
      sceneType: 'pattern',
      moodAdjectives: ['warm', 'organic', 'refined'],
      styleRegister: 'warm',
      industrySuitability: ['hospitality_food'],
      imagerySubjects: ['materials-texture'],
    })

    expect(spreadCoherenceBonus(futuristicPattern, picked, signals)).toBeLessThan(
      spreadCoherenceBonus(warmPattern, picked, signals),
    )
  })
})

describe('assignDeterministicRankerPicks with coherence', () => {
  it('prefers hospitality tile pattern over kitchen misfile and futuristic geometry for Northwind', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const signals = resolveImageBankKitSignals(form)
    const patternSlot = getVisualReferenceLayout('vr_9').slots.find((slot) => slot.slotId === 'grid_c')!
    const assets: ImageBankAsset[] = [
      asset({
        imageId: 'lead_env',
        orientation: 'landscape',
        sceneType: 'environment',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'refined'],
        industrySuitability: ['hospitality_food'],
      }),
      asset({
        imageId: 'lead_people',
        orientation: 'portrait',
        sceneType: 'people',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'premium'],
        industrySuitability: ['hospitality_food'],
      }),
      asset({
        imageId: 'lead_object',
        orientation: 'landscape',
        sceneType: 'object',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'refined'],
        industrySuitability: ['hospitality_food'],
      }),
      asset({
        imageId: 'beans',
        orientation: 'landscape',
        sceneType: 'texture',
        styleRegister: 'warm',
        moodAdjectives: ['warm', 'organic', 'premium'],
        industrySuitability: ['hospitality_food'],
        propCategory: 'food-beverage',
      }),
      asset({
        imageId: 'light',
        orientation: 'portrait',
        sceneType: 'lighting',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'calm'],
      }),
      asset({
        imageId: 'kitchen_pattern',
        orientation: 'landscape',
        sceneType: 'pattern',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'refined', 'calm'],
        industrySuitability: ['hospitality_food'],
        imagerySubjects: ['materials-texture', 'interiors-spaces'],
      }),
      asset({
        imageId: 'geo_pattern',
        orientation: 'landscape',
        sceneType: 'pattern',
        styleRegister: 'refined',
        moodAdjectives: ['futuristic', 'sharp', 'geometric'],
        imagerySubjects: ['architecture-built', 'materials-texture'],
      }),
      asset({
        imageId: 'tile_pattern',
        orientation: 'landscape',
        sceneType: 'pattern',
        styleRegister: 'playful',
        moodAdjectives: ['warm', 'organic', 'playful'],
        industrySuitability: ['hospitality_food'],
        imagerySubjects: ['materials-texture', 'architecture-built'],
      }),
      asset({
        imageId: 'grid_env',
        orientation: 'portrait',
        sceneType: 'environment',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'calm'],
      }),
      asset({
        imageId: 'grid_object',
        orientation: 'landscape',
        sceneType: 'object',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'premium'],
      }),
      asset({
        imageId: 'grid_people',
        orientation: 'portrait',
        sceneType: 'people',
        styleRegister: 'refined',
        moodAdjectives: ['warm', 'premium'],
      }),
    ]

    const pickedBefore = assets.filter((a) =>
      ['lead_env', 'lead_people', 'lead_object', 'beans', 'light'].includes(a.imageId),
    )
    const kitchen = assets.find((a) => a.imageId === 'kitchen_pattern')!
    const tiles = assets.find((a) => a.imageId === 'tile_pattern')!
    expect(
      slotAssignmentAdjustment(kitchen, pickedBefore, signals, patternSlot),
    ).toBeLessThan(slotAssignmentAdjustment(tiles, pickedBefore, signals, patternSlot))

    const shortlist = buildVisualReferenceShortlist(assets, form)
    const picks = assignDeterministicRankerPicks(shortlist, 'vr_9', { signals, bankAssets: assets })
    expect(picks.find((pick) => pick.slotId === 'grid_c')?.imageId).toBe('tile_pattern')
  })
})
