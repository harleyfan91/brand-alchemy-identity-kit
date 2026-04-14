import type { BusinessOperatingModel, IdentityKitForm } from './form.js'

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

const CURRENT_INTAKE_SCHEMA_VERSION = 2

/**
 * Path C: one-time backfill of `businessOperatingModel` + version bump for pre-v2 payloads.
 * Idempotent when `intakeSchemaVersion >= 2` (no further inference).
 */
export function migrateIdentityKitForm(form: IdentityKitForm): IdentityKitForm {
  const version = form.intakeSchemaVersion ?? 1

  // v2+ forms: never mutate (explicit model or in-progress empty — no backfill).
  if (version >= CURRENT_INTAKE_SCHEMA_VERSION) {
    return form
  }

  const inferred = inferBusinessOperatingModel(form)
  const existing = form.step1.businessOperatingModel?.trim()
  const businessOperatingModel = (existing || inferred) as BusinessOperatingModel
  return {
    ...form,
    intakeSchemaVersion: CURRENT_INTAKE_SCHEMA_VERSION,
    step1: {
      ...form.step1,
      businessOperatingModel,
    },
  }
}

export function getIntakeSchemaVersion(): number {
  return CURRENT_INTAKE_SCHEMA_VERSION
}
