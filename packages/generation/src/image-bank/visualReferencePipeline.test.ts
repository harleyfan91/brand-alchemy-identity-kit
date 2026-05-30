import { describe, expect, it } from 'vitest'

import type { IdentityKitForm } from '@identity-kit/shared'

import { assignDeterministicRankerPicks, buildVisualReferenceShortlist } from './visualReferencePipeline.js'
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
    },
    step7: { competitors: [], differentiation: '' },
  } as IdentityKitForm
}

const sampleAssets: ImageBankAsset[] = [
  {
    imageId: 'a1',
    sourceUrl: 'https://example.com/a1.jpg',
    orientation: 'landscape',
    paletteFamily: 'warm-earth',
    styleRegister: 'warm',
    sceneType: 'environment',
    license: 'unsplash',
    src: 'assets/a1.jpg',
    imagerySubjects: ['food-dining'],
    widthPx: 1600,
    heightPx: 1200,
    bytes: 100_000,
    jpegQuality: 80,
    ingestedAt: new Date().toISOString(),
  },
  {
    imageId: 'a2',
    sourceUrl: 'https://example.com/a2.jpg',
    orientation: 'portrait',
    paletteFamily: 'soft-organic',
    styleRegister: 'warm',
    sceneType: 'people',
    license: 'unsplash',
    src: 'assets/a2.jpg',
    widthPx: 1200,
    heightPx: 1600,
    bytes: 100_000,
    jpegQuality: 80,
    ingestedAt: new Date().toISOString(),
  },
]

describe('visualReferencePipeline', () => {
  it('builds a shortlist with broadening when needed', () => {
    const shortlist = buildVisualReferenceShortlist(sampleAssets, minimalForm())
    expect(shortlist.length).toBeGreaterThan(0)
  })

  it('assigns deterministic picks up to available assets', () => {
    const shortlist = buildVisualReferenceShortlist(sampleAssets, minimalForm())
    const picks = assignDeterministicRankerPicks(shortlist, 'vr_6')
    expect(picks.length).toBe(Math.min(6, sampleAssets.length))
    expect(new Set(picks.map((p) => p.imageId)).size).toBe(picks.length)
  })
})
