import type { BusinessOperatingModel, GuideFocus, IdentityKitForm } from './form.js'

export const BUSINESS_OPERATING_MODEL_IDS: readonly BusinessOperatingModel[] = [
  'customer_visits_us',
  'we_travel_to_customers',
  'online_only',
  'hybrid',
  'mostly_events_or_markets',
] as const

const PHYSICAL_OVERRIDE_INDUSTRY = new Set([
  'food_beverage',
  'retail',
  'home_services',
  'automotive',
  'fitness_sports',
])

const SOLO_EXPERT_PHYSICAL = new Set(['construction_trades', 'automotive', 'home_services'])

const LOCAL_TEAM_SOCIAL_PRODUCT = new Set(['beauty_personal_care', 'pet_services'])

const PRODUCT_LED_SOCIAL_PRODUCT = new Set(['beauty_personal_care', 'health_wellness'])

/**
 * Infer operating model from legacy signals (narrator + industry), matching the old
 * touchpoint-cluster intent for migration only.
 */
export function inferBusinessOperatingModel(form: IdentityKitForm): BusinessOperatingModel {
  const narrator = form.step1.brandNarrator?.trim() || ''
  const industry = form.step1.industry

  if (!narrator) {
    return 'online_only'
  }

  if (narrator === 'solo_expert') {
    if (SOLO_EXPERT_PHYSICAL.has(industry)) return 'we_travel_to_customers'
    return 'online_only'
  }

  if (narrator === 'solo_maker') {
    if (industry === 'food_beverage') return 'customer_visits_us'
    return 'online_only'
  }

  if (narrator === 'local_team') {
    if (PHYSICAL_OVERRIDE_INDUSTRY.has(industry)) return 'customer_visits_us'
    if (LOCAL_TEAM_SOCIAL_PRODUCT.has(industry)) return 'customer_visits_us'
    return 'hybrid'
  }

  if (narrator === 'product_led') {
    if (industry === 'food_beverage') return 'customer_visits_us'
    if (PRODUCT_LED_SOCIAL_PRODUCT.has(industry)) return 'customer_visits_us'
    return 'online_only'
  }

  if (narrator === 'mission_community') {
    return 'hybrid'
  }

  return 'online_only'
}

function inferGuideFocus(form: IdentityKitForm): GuideFocus {
  const primaryGoal = form.step1.primaryGoal?.trim()
  if (primaryGoal === 'audience_growth') return 'sound_more_consistent'
  if (primaryGoal === 'retention') return 'know_what_to_fix_first'
  if (primaryGoal === 'lead_gen') return 'look_more_professional'
  if (primaryGoal === 'direct_sales') {
    return form.step1.touchpoints?.length ? 'know_what_to_fix_first' : 'look_more_professional'
  }
  return 'look_more_professional'
}

const CURRENT_INTAKE_SCHEMA_VERSION = 3

/**
 * Path C: one-time backfill of newer Step 1 routing signals + version bump for older payloads.
 * Idempotent when `intakeSchemaVersion >= 3` (no further inference).
 */
export function migrateIdentityKitForm(form: IdentityKitForm): IdentityKitForm {
  const version = form.intakeSchemaVersion ?? 1

  // v3+ forms: never mutate (explicit model or in-progress empty — no backfill).
  if (version >= CURRENT_INTAKE_SCHEMA_VERSION) {
    return form
  }

  const existing = form.step1.businessOperatingModel?.trim()
  const businessOperatingModel =
    version >= 2 ? form.step1.businessOperatingModel : ((existing || inferBusinessOperatingModel(form)) as BusinessOperatingModel)
  const existingGuideFocus = form.step1.guideFocus?.trim()
  const guideFocus = (existingGuideFocus || inferGuideFocus(form)) as GuideFocus
  return {
    ...form,
    intakeSchemaVersion: CURRENT_INTAKE_SCHEMA_VERSION,
    step1: {
      ...form.step1,
      businessOperatingModel,
      guideFocus,
    },
  }
}

export function getIntakeSchemaVersion(): number {
  return CURRENT_INTAKE_SCHEMA_VERSION
}
