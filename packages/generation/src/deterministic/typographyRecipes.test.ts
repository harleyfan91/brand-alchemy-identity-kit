import { describe, expect, it } from 'vitest'

import type { IdentityKitForm } from '@identity-kit/shared'

import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import {
  FONT_RECIPES,
  FONT_SHORTLIST,
  getExistingTypefaceGuidance,
  getFontEntryById,
  getRecipeForProfile,
  isScreenHeavyCluster,
  matchesVariableShortlistFamily,
  resolveTypographyPair,
  shouldPreferSystemPairing,
} from './typographyRecipes.js'

function minimalForm(overrides: Partial<IdentityKitForm> & Record<string, unknown> = {}): IdentityKitForm {
  const base = loadCoreSampleFixture()
  return { ...base, ...overrides } as IdentityKitForm
}

describe('typographyRecipes shortlist', () => {
  it('FONT_SHORTLIST ids are unique', () => {
    const ids = FONT_SHORTLIST.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every FONT_RECIPES pair references FONT_SHORTLIST ids', () => {
    for (const r of FONT_RECIPES) {
      expect(getFontEntryById(r.pair.primaryFont)).toBeDefined()
      expect(getFontEntryById(r.pair.secondaryFont)).toBeDefined()
    }
  })

  it('resolveTypographyPair resolves every FONT_RECIPES entry', () => {
    for (const r of FONT_RECIPES) {
      const resolved = resolveTypographyPair(r)
      expect(resolved.primaryFont.family.length).toBeGreaterThan(1)
      expect(resolved.secondaryFont.family.length).toBeGreaterThan(1)
      expect(resolved.pattern).toBe(r.pattern)
    }
  })

  it('system recipes use the same font family for both slots', () => {
    for (const r of FONT_RECIPES) {
      if (r.pattern !== 'system') continue
      const a = getFontEntryById(r.pair.primaryFont)
      const b = getFontEntryById(r.pair.secondaryFont)
      expect(a?.family).toBe(b?.family)
    }
  })
})

describe('getRecipeForProfile', () => {
  it('is deterministic for the same fixture', () => {
    const form = loadCoreSampleFixture()
    expect(getRecipeForProfile(form).id).toBe(getRecipeForProfile(form).id)
  })

  it('core sample fixture gets clean_minimal screen system (solo_expert + creative_services → social_service)', () => {
    const form = loadCoreSampleFixture()
    const recipe = getRecipeForProfile(form)
    expect(recipe.id).toBe('clean_minimal_screen_system')
    expect(recipe.pattern).toBe('system')
    expect(recipe.archetypeLabel).toBe('single_family_hierarchy')
  })

  it('returns fallback for unknown selectedStyle', () => {
    const form = minimalForm({
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'unknown_style_xyz' },
    })
    expect(getRecipeForProfile(form).id).toBe('recipe_fallback_default')
  })

  it('empty tonePreset still returns a defined recipe', () => {
    const form = minimalForm({
      step3: { ...loadCoreSampleFixture().step3, tonePreset: '' },
    })
    const id = getRecipeForProfile(form).id
    expect(id.length).toBeGreaterThan(3)
  })

  const styles = ['clean_minimal', 'bold_graphic', 'organic_natural', 'luxe_refined'] as const
  for (const style of styles) {
    it(`covers selectedStyle ${style} without fallback`, () => {
      const form = minimalForm({
        step1: { ...loadCoreSampleFixture().step1, stage: 'new', brandNarrator: 'solo_maker' },
        step3: { ...loadCoreSampleFixture().step3, tonePreset: 'friendly' },
        step6: { ...loadCoreSampleFixture().step6, selectedStyle: style },
      })
      const recipe = getRecipeForProfile(form)
      expect(recipe.id).not.toBe('recipe_fallback_default')
    })
  }

  it('bold_graphic + bold tone prefers Syne + Manrope over Fraunces', () => {
    const form = minimalForm({
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'bold_graphic' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'bold' },
    })
    const recipe = getRecipeForProfile(form)
    expect(recipe.id).toBe('bold_graphic_bold_syne')
    expect(recipe.pair.primaryFont).toBe('syne')
  })

  it('bold_graphic + professional tone uses Fraunces + DM Sans', () => {
    const form = minimalForm({
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'bold_graphic' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'professional' },
    })
    expect(getRecipeForProfile(form).id).toBe('bold_graphic_expressive')
  })

  it('luxe_refined + established + professional prefers Cormorant + Lato', () => {
    const form = minimalForm({
      step1: { ...loadCoreSampleFixture().step1, stage: 'established' },
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'luxe_refined' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'professional' },
    })
    expect(getRecipeForProfile(form).id).toBe('luxe_formal_cormorant')
  })

  it('luxe_refined + established + friendly uses Playfair + Source Serif 4', () => {
    const form = minimalForm({
      step1: { ...loadCoreSampleFixture().step1, stage: 'established' },
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'luxe_refined' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'friendly' },
    })
    expect(getRecipeForProfile(form).id).toBe('luxe_refined_established_editorial')
  })

  it('luxe_refined + early uses DM Serif Display + Manrope', () => {
    const form = minimalForm({
      step1: { ...loadCoreSampleFixture().step1, stage: 'new' },
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'luxe_refined' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'friendly' },
    })
    expect(getRecipeForProfile(form).id).toBe('luxe_refined_early_editorial')
  })

  it('clean_minimal + not screen-heavy uses Outfit + Open Sans', () => {
    const form = minimalForm({
      step1: { ...loadCoreSampleFixture().step1, brandNarrator: 'solo_maker', industry: 'food_beverage' },
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'clean_minimal' },
      /** Empty tone avoids professional_trust / friendly_approachable ties at score 6. */
      step3: { ...loadCoreSampleFixture().step3, tonePreset: '' },
    })
    expect(getRecipeForProfile(form).id).toBe('clean_minimal_mixed_outfit_open_sans')
  })

  it('professional + social_service + clean_minimal prefers utility Outfit + Roboto over system', () => {
    const form = minimalForm({
      step1: { ...loadCoreSampleFixture().step1, brandNarrator: 'solo_expert', industry: 'creative_services' },
      step3: { ...loadCoreSampleFixture().step3, tonePreset: 'professional' },
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'clean_minimal' },
    })
    expect(getRecipeForProfile(form).id).toBe('utility_professional_social_service')
  })

  it('organic_natural maps to Fraunces + Open Sans', () => {
    const form = minimalForm({
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'organic_natural' },
      step1: { ...loadCoreSampleFixture().step1, stage: 'growing', brandNarrator: 'solo_maker' },
    })
    expect(getRecipeForProfile(form).id).toBe('organic_natural_pairing')
  })
})

describe('isScreenHeavyCluster', () => {
  it('treats digital_brand and social_service as screen-heavy', () => {
    expect(isScreenHeavyCluster('digital_brand')).toBe(true)
    expect(isScreenHeavyCluster('social_service')).toBe(true)
    expect(isScreenHeavyCluster('physical_first')).toBe(false)
  })
})

describe('shouldPreferSystemPairing', () => {
  it('is true for core sample (clean_minimal + social_service)', () => {
    expect(shouldPreferSystemPairing(loadCoreSampleFixture())).toBe(true)
  })
})

describe('matchesVariableShortlistFamily', () => {
  it('detects Inter in free text', () => {
    expect(matchesVariableShortlistFamily('We use Inter for everything')).toBe(true)
  })
  it('returns false for unknown font', () => {
    expect(matchesVariableShortlistFamily('Comic Sans MS')).toBe(false)
  })
})

describe('getExistingTypefaceGuidance', () => {
  it('mentions family when substring matches shortlist', () => {
    const g = getExistingTypefaceGuidance('Headings in Playfair Display')
    expect(g).toMatch(/Playfair Display/i)
  })
  it('returns generic guidance when unmatched', () => {
    const g = getExistingTypefaceGuidance('Some obscure corporate font')
    expect(g).toMatch(/could not match/i)
  })
})

describe('fallback recipe', () => {
  it('resolveTypographyPair works for getRecipeForProfile fallback', () => {
    const form = minimalForm({
      step6: { ...loadCoreSampleFixture().step6, selectedStyle: 'unknown_style_xyz' },
    })
    const recipe = getRecipeForProfile(form)
    expect(() => resolveTypographyPair(recipe)).not.toThrow()
    const r = resolveTypographyPair(recipe)
    expect(r.primaryFont.id).toBe('playfair_display')
    expect(r.secondaryFont.id).toBe('open_sans')
  })
})
