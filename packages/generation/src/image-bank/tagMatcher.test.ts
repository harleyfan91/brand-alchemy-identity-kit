import { describe, expect, it } from 'vitest'

import { resolveImageBankKitSignals } from '@identity-kit/shared'
import type { IdentityKitForm } from '@identity-kit/shared'

import { readImageBankMetadata } from './ingest.js'
import { rankImageBankAssets } from './tagMatcher.js'

function minimalForm(overrides: Partial<IdentityKitForm['step6']> = {}): IdentityKitForm {
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
      ...overrides,
    },
    step7: { competitors: [], differentiation: '' },
  } as IdentityKitForm
}

describe('tagMatcher', () => {
  it('ranks matching palette family and style above mismatches', async () => {
    const metadata = await readImageBankMetadata()
    if (metadata.assets.length === 0) {
      return
    }

    const signals = resolveImageBankKitSignals(minimalForm())
    const ranked = rankImageBankAssets(metadata.assets, signals, 10)

    expect(ranked.length).toBeGreaterThan(0)
    const top = ranked[0]!
    expect(top.score.photoColorCharacter).toBeGreaterThan(0)
    expect(top.asset.paletteFamily).toBe('warm-earth')
  })

  it('penalizes assets whose prominent hues are explicitly avoided', async () => {
    const metadata = await readImageBankMetadata()
    const yellowAsset = metadata.assets.find((asset) => asset.imageId === 'batch004_sharp_object')
    if (!yellowAsset) return

    const neutral = resolveImageBankKitSignals(minimalForm())
    const avoidYellow = resolveImageBankKitSignals(
      minimalForm({ visualNotes: 'Avoid yellow in moodboard photography.' }),
    )

    const neutralScore = rankImageBankAssets([yellowAsset], neutral, 1)[0]!.score.total
    const penalizedScore = rankImageBankAssets([yellowAsset], avoidYellow, 1)[0]!.score.total

    expect(penalizedScore).toBeLessThan(neutralScore)
    expect(rankImageBankAssets([yellowAsset], avoidYellow, 1)[0]!.score.prominentHueHarmony).toBe(-5)
  })

  it('boosts assets when brand hex maps to a tagged prominent hue', async () => {
    const metadata = await readImageBankMetadata()
    const tealAsset = metadata.assets.find((asset) => asset.imageId === 'batch004_sharp_texture')
    if (!tealAsset) return

    const baseline = resolveImageBankKitSignals(minimalForm())
    const echoTeal = resolveImageBankKitSignals(
      minimalForm({
        photoColorRelationship: 'echo-brand-colors',
        existingBrand: { hexColors: ['#008080'] },
      }),
    )

    const baselineScore = rankImageBankAssets([tealAsset], baseline, 1)[0]!.score.total
    const boostedScore = rankImageBankAssets([tealAsset], echoTeal, 1)[0]!.score.total

    expect(boostedScore).toBeGreaterThan(baselineScore)
    expect(rankImageBankAssets([tealAsset], echoTeal, 1)[0]!.score.prominentHueHarmony).toBe(5)
  })
})
