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

const CURRENT_INTAKE_SCHEMA_VERSION = 4

/**
 * Path C migration:
 *  - v1 → v2: backfill `businessOperatingModel` from narrator + industry signals.
 *  - v2 → v3: backfill `guideFocus` from `primaryGoal`.
 *  - v3 → v4: merge `step6.colorMoodNotes` + `step6.styleNotes` into the new
 *    `step6.visualNotes` field. Legacy fields stay readable for back-compat;
 *    Pro-C audit pass removes them.
 *
 * Idempotent at `intakeSchemaVersion >= CURRENT_INTAKE_SCHEMA_VERSION`.
 */
export function migrateIdentityKitForm(form: IdentityKitForm): IdentityKitForm {
  const version = form.intakeSchemaVersion ?? 1

  if (version >= CURRENT_INTAKE_SCHEMA_VERSION) {
    return form
  }

  const existing = form.step1.businessOperatingModel?.trim()
  const businessOperatingModel =
    version >= 2 ? form.step1.businessOperatingModel : ((existing || inferBusinessOperatingModel(form)) as BusinessOperatingModel)
  const existingGuideFocus = form.step1.guideFocus?.trim()
  const guideFocus = (existingGuideFocus || inferGuideFocus(form)) as GuideFocus

  const mergedVisualNotes = mergeVisualNotes(form)

  return {
    ...form,
    intakeSchemaVersion: CURRENT_INTAKE_SCHEMA_VERSION,
    step1: {
      ...form.step1,
      businessOperatingModel,
      guideFocus,
    },
    step6: {
      ...form.step6,
      visualNotes: mergedVisualNotes,
    },
  }
}

/**
 * v3 → v4: backfill `step6.visualNotes` from the legacy `colorMoodNotes` +
 * `styleNotes` pair when no explicit `visualNotes` value already exists.
 * Returns the existing value (or `undefined`) if no backfill is needed.
 */
function mergeVisualNotes(form: IdentityKitForm): string | undefined {
  const existing = form.step6.visualNotes?.trim()
  if (existing) return form.step6.visualNotes

  const merged = [form.step6.colorMoodNotes, form.step6.styleNotes]
    .map((value) => value?.trim() ?? '')
    .filter(Boolean)
    .join(' ')
    .trim()

  return merged.length > 0 ? merged : form.step6.visualNotes
}

export function getIntakeSchemaVersion(): number {
  return CURRENT_INTAKE_SCHEMA_VERSION
}
