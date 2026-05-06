import { describe, expect, it } from 'vitest'
import { industryGroupFromIndustry, normalizeCtaVoiceTone } from './ctaIndustryGroups.js'

describe('ctaIndustryGroups', () => {
  it('maps canonical catalog ids to stable groups', () => {
    expect(industryGroupFromIndustry('construction_trades')).toBe('trades_home')
    expect(industryGroupFromIndustry('food_beverage')).toBe('food_hospitality')
    expect(industryGroupFromIndustry('retail')).toBe('retail_maker')
    expect(industryGroupFromIndustry('health_wellness')).toBe('health_wellness')
    expect(industryGroupFromIndustry('creative_services')).toBe('creative_pro')
    expect(industryGroupFromIndustry('legal_professional_services')).toBe('regulated_services')
    expect(industryGroupFromIndustry('technology')).toBe('technology')
    expect(industryGroupFromIndustry('nonprofit_community')).toBe('community')
    expect(industryGroupFromIndustry('pet_services')).toBe('default')
  })

  it('normalizes tone preset for CTA routing', () => {
    expect(normalizeCtaVoiceTone('')).toBe('friendly')
    expect(normalizeCtaVoiceTone('', { emptyPresetSocialTone: 'professional' })).toBe('professional')
    expect(normalizeCtaVoiceTone('', { emptyPresetSocialTone: 'casual' })).toBe('friendly')
    expect(normalizeCtaVoiceTone('friendly')).toBe('friendly')
    expect(normalizeCtaVoiceTone('bold')).toBe('bold')
    expect(normalizeCtaVoiceTone('professional')).toBe('professional')
  })

  it('handles empty and unknown industry safely', () => {
    expect(industryGroupFromIndustry('')).toBe('default')
    expect(industryGroupFromIndustry('other')).toBe('default')
    expect(industryGroupFromIndustry('unknown_vertical_xyz')).toBe('default')
  })
})
