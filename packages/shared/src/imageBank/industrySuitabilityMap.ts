import type { ImageBankIndustrySuitability } from './tags.js'

/**
 * Maps Step 1 `industry` id → zero or more bank industry-suitability tags.
 * Many images stay industry-agnostic (no tags); these refine ranking when present.
 *
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Industry suitability
 */
export const INDUSTRY_ID_TO_IMAGE_BANK_SUITABILITY: Record<string, readonly ImageBankIndustrySuitability[]> = {
  legal_professional_services: ['professional_services'],
  finance: ['professional_services'],
  consulting_coaching: ['professional_services', 'b2b_tech'],
  real_estate: ['professional_services', 'lifestyle_consumer'],
  education: ['professional_services', 'lifestyle_consumer'],
  technology: ['b2b_tech'],
  creative_services: ['creative_agency', 'makers_artisans'],
  photography_media: ['creative_agency', 'makers_artisans'],
  food_beverage: ['hospitality_food'],
  retail: ['retail_commerce', 'makers_artisans'],
  health_wellness: ['wellness_healthcare'],
  beauty_personal_care: ['wellness_healthcare', 'lifestyle_consumer'],
  fitness_sports: ['wellness_healthcare', 'lifestyle_consumer'],
  pet_services: ['wellness_healthcare', 'lifestyle_consumer'],
  home_services: ['lifestyle_consumer', 'professional_services'],
  construction_trades: ['lifestyle_consumer', 'professional_services'],
  automotive: ['lifestyle_consumer', 'retail_commerce'],
  nonprofit_community: ['lifestyle_consumer', 'professional_services'],
  other: [],
}

export function industrySuitabilityFromIndustryId(industryId: string): ImageBankIndustrySuitability[] {
  const id = industryId?.trim().toLowerCase()
  if (!id) return []
  return [...(INDUSTRY_ID_TO_IMAGE_BANK_SUITABILITY[id] ?? [])]
}
