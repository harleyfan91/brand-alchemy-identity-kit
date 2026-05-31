import { describe, expect, it } from 'vitest'

import type { IdentityKitForm } from '@identity-kit/shared'

import { composeDeterministicVisualReferenceCaption } from '../deterministic/visualReferenceCaptions.js'
import { allVisualReferenceSlots } from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { resolveStyleGuideVisualReferenceModel } from './resolveStyleGuideVisualReferenceModel.js'
import type { ImageBankAsset } from './types.js'

function minimalForm(): IdentityKitForm {
  return {
    tier: 'pro',
    step1: {
      businessName: 'Test Co',
      industry: 'food_beverage',
      brandNarrator: 'local_team',
      touchpoints: [],
      primaryGoal: '',
      guideFocus: '',
      businessOperatingModel: '',
      offer: { offerId: '', audienceId: '', transformationId: '' },
    },
    step2: { customerArchetype: '', painPoints: [], desiredOutcomes: [] },
    step3: { tonePreset: 'friendly', voiceSliders: { formality: 50, energy: 50, warmth: 50 }, customVoiceNotes: '' },
    step4: { values: [], missionStatement: '' },
    step5: { originArchetype: '', originSummary: '' },
    step6: {
      selectedPalette: 'earthy_warmth',
      selectedStyle: 'organic_natural',
      moodAdjectives: ['warm', 'organic'],
      photoColorRelationship: 'natural-full-color',
    },
    step7: { competitors: [], differentiation: '' },
  } as IdentityKitForm
}

function mockAsset(
  imageId: string,
  orientation: 'landscape' | 'portrait',
  sceneType: ImageBankAsset['sceneType'],
): ImageBankAsset {
  return {
    imageId,
    sourceUrl: `https://example.com/${imageId}.jpg`,
    orientation,
    paletteFamily: 'warm-earth',
    styleRegister: 'warm',
    sceneType,
    license: 'unsplash',
    src: `assets/${imageId}.jpg`,
    widthPx: orientation === 'landscape' ? 1600 : 1200,
    heightPx: orientation === 'landscape' ? 1200 : 1600,
    bytes: 100_000,
    jpegQuality: 80,
    ingestedAt: new Date().toISOString(),
  }
}

/** vr_6 slot manifest — six distinct picks for fulfillment tests. */
const vr6Assets: ImageBankAsset[] = [
  mockAsset('lead_1', 'landscape', 'environment'),
  mockAsset('lead_2', 'portrait', 'people'),
  mockAsset('grid_a', 'landscape', 'texture'),
  mockAsset('grid_b', 'portrait', 'lighting'),
  mockAsset('grid_c', 'landscape', 'pattern'),
  mockAsset('grid_d', 'portrait', 'environment'),
  mockAsset('extra', 'landscape', 'object'),
]

describe('resolveStyleGuideVisualReferenceModel', () => {
  it('returns null when the bank is too shallow', async () => {
    const result = await resolveStyleGuideVisualReferenceModel(minimalForm(), {
      assets: vr6Assets.slice(0, 2),
    })
    expect(result).toBeNull()
  })

  it('merges deterministic ranker picks and caption without AI', async () => {
    const result = await resolveStyleGuideVisualReferenceModel(minimalForm(), { assets: vr6Assets })
    expect(result).not.toBeNull()
    expect(result!.layoutId).toBe('vr_6')
    expect(result!.photoCount).toBe(6)

    const photoSlots = allVisualReferenceSlots(result!).filter((slot) => slot.kind === 'photo')
    expect(photoSlots.every((slot) => slot.imageId && slot.imageSrc)).toBe(true)
    expect(result!.selectionCaption).toBe(composeDeterministicVisualReferenceCaption(minimalForm()))
    expect(result!.selectionCaption).not.toMatch(/\[Scaffold\]/)
  })

  it('returns null for core tier', async () => {
    const form = { ...minimalForm(), tier: 'core' as const }
    const result = await resolveStyleGuideVisualReferenceModel(form, { assets: vr6Assets })
    expect(result).toBeNull()
  })
})
