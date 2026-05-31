import type { IdentityKitForm } from '../form.js'
import type { ImageBankPropCategory } from './propCategories.js'

/**
 * Soft prop hints for matcher — derived from Step 1 industry.
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Prop category
 */
const INDUSTRY_PROP_HINTS: Record<string, ImageBankPropCategory[]> = {
  food_beverage: ['food-beverage'],
  hospitality: ['food-beverage'],
  health_wellness: ['beauty-personal', 'neutral-generic'],
  beauty_personal_care: ['beauty-personal', 'fashion-accessories'],
  professional_services: ['neutral-generic', 'office-tech'],
  creative_agency: ['craft-tools', 'camera-media', 'neutral-generic'],
  retail_commerce: ['fashion-accessories', 'neutral-generic'],
  b2b_technology: ['office-tech', 'wearables-tech'],
  home_services: ['craft-tools', 'neutral-generic'],
  automotive: ['craft-tools', 'neutral-generic'],
  education: ['neutral-generic'],
  technology: ['office-tech', 'wearables-tech'],
  creative_services: ['craft-tools', 'camera-media', 'neutral-generic'],
  photography_media: ['camera-media', 'craft-tools'],
  retail: ['fashion-accessories', 'neutral-generic'],
  fitness_sports: ['neutral-generic'],
  pet_services: ['neutral-generic'],
  construction_trades: ['craft-tools'],
  nonprofit_community: ['neutral-generic'],
  real_estate: ['neutral-generic'],
  consulting_coaching: ['office-tech', 'neutral-generic'],
  finance: ['office-tech', 'neutral-generic'],
  legal_professional_services: ['office-tech', 'neutral-generic'],
  other: [],
}

export function inferPropCategoryHints(form: IdentityKitForm): ImageBankPropCategory[] {
  const id = form.step1.industry?.trim().toLowerCase()
  if (!id) return []
  return [...(INDUSTRY_PROP_HINTS[id] ?? [])]
}
