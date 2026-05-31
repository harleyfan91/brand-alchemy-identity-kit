import { describe, expect, it } from 'vitest'

import {
  collectBrandHexColors,
  hexToProminentHueFamily,
  inferKitHueSignals,
  parseHueSignalsFromVisualNotes,
  prominentHueFamiliesFromHexes,
} from '@identity-kit/shared'
import type { IdentityKitForm } from '@identity-kit/shared'

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

describe('hexToProminentHueFamily', () => {
  it('maps saturated brand hexes to bank hue families', () => {
    expect(hexToProminentHueFamily('#FFD700')).toBe('yellow')
    expect(hexToProminentHueFamily('#008080')).toBe('teal')
    expect(hexToProminentHueFamily('#FF0000')).toBe('red')
  })

  it('returns achromatic for neutral greys', () => {
    expect(hexToProminentHueFamily('#808080')).toBe('achromatic')
    expect(hexToProminentHueFamily('#f5f5f5')).toBe('achromatic')
  })
})

describe('parseHueSignalsFromVisualNotes', () => {
  it('parses avoid and prefer cues', () => {
    expect(parseHueSignalsFromVisualNotes('Avoid yellow in photography; echo our teal accent.')).toEqual({
      preferredHueFamilies: ['teal'],
      avoidHueFamilies: ['yellow'],
    })
  })

  it('prefers explicit prefer over avoid when both mention the same hue', () => {
    expect(parseHueSignalsFromVisualNotes('No yellow backgrounds, but we want yellow props.')).toEqual({
      preferredHueFamilies: ['yellow'],
      avoidHueFamilies: [],
    })
  })
})

describe('inferKitHueSignals', () => {
  it('derives preferred hues from logo hex when echo-brand-colors', () => {
    const form = minimalForm({
      photoColorRelationship: 'echo-brand-colors',
      existingBrand: {
        hexColors: ['#008080'],
        logoExtractedColors: ['#FFD700'],
      },
    })

    expect(inferKitHueSignals(form, 'echo-brand-colors')).toEqual({
      preferredHueFamilies: ['teal', 'yellow'],
      avoidHueFamilies: [],
    })
  })

  it('does not derive preferred hues from hex when neutral-backdrops', () => {
    const form = minimalForm({
      photoColorRelationship: 'neutral-backdrops',
      existingBrand: { hexColors: ['#008080'] },
      visualNotes: 'Avoid yellow in photos.',
    })

    expect(inferKitHueSignals(form, 'neutral-backdrops')).toEqual({
      preferredHueFamilies: [],
      avoidHueFamilies: ['yellow'],
    })
  })
})

describe('collectBrandHexColors', () => {
  it('dedupes manual and logo hex values', () => {
    const form = minimalForm({
      existingBrand: {
        hexColors: ['#008080'],
        logoExtractedColors: ['#008080', '#ff0000'],
      },
    })

    expect(collectBrandHexColors(form)).toEqual(['#008080', '#ff0000'])
    expect(prominentHueFamiliesFromHexes(collectBrandHexColors(form))).toEqual(['teal', 'red'])
  })
})
