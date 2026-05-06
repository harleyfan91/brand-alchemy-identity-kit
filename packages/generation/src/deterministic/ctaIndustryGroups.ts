/**
 * Coarse industry buckets for CTA phrase routing (paste-ready copy).
 * Maps canonical Step 1 `industry` ids from step1ControlledOptions catalogs.
 */

export type CtaIndustryGroup =
  | 'trades_home'
  | 'food_hospitality'
  | 'retail_maker'
  | 'health_wellness'
  | 'creative_pro'
  | 'regulated_services'
  | 'technology'
  | 'community'
  | 'default'

/** Normalize intake tone preset for CTA phrase selection. */
export type CtaVoiceTone = 'friendly' | 'professional' | 'bold'

export type CtaEmptyPresetSocialContext = 'professional' | 'casual'

/**
 * When `tonePreset` is empty or not one of friendly/bold/professional: LinkedIn-style social mix → professional;
 * casual social or no social → friendly (matches prescriptive bank authoring).
 */
export function normalizeCtaVoiceTone(
  tonePreset: string,
  opts?: { emptyPresetSocialTone?: CtaEmptyPresetSocialContext },
): CtaVoiceTone {
  const t = tonePreset.trim().toLowerCase()
  if (t === 'friendly' || t === 'bold') return t
  if (t === 'professional') return 'professional'
  const social = opts?.emptyPresetSocialTone ?? 'casual'
  return social === 'professional' ? 'professional' : 'friendly'
}

/**
 * Map Step 1 industry id to a small set of CTA phrase families.
 * Unknown / empty / `other` → default (creative-studio-ish neutral paste-ready lines).
 */
export function industryGroupFromIndustry(industry: string): CtaIndustryGroup {
  const id = industry.trim().toLowerCase()
  if (!id || id === 'other') return 'default'

  switch (id) {
    case 'construction_trades':
    case 'home_services':
    case 'automotive':
      return 'trades_home'
    case 'food_beverage':
      return 'food_hospitality'
    case 'retail':
      return 'retail_maker'
    case 'health_wellness':
    case 'beauty_personal_care':
    case 'fitness_sports':
      return 'health_wellness'
    case 'creative_services':
    case 'photography_media':
    case 'education':
      return 'creative_pro'
    case 'legal_professional_services':
    case 'finance':
    case 'consulting_coaching':
    case 'real_estate':
      return 'regulated_services'
    case 'technology':
      return 'technology'
    case 'nonprofit_community':
      return 'community'
    case 'pet_services':
      return 'default'
    default:
      return 'default'
  }
}
