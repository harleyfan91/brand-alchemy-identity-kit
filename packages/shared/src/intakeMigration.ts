import type { BusinessOperatingModel, ExistingBrand, GuideFocus, IdentityKitForm } from './form.js'

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

const CURRENT_INTAKE_SCHEMA_VERSION = 7

/**
 * Path C migration:
 *  - v1 → v2: backfill `businessOperatingModel` from narrator + industry signals.
 *  - v2 → v3: backfill `guideFocus` from `primaryGoal`.
 *  - v3 → v4: merge `step6.colorMoodNotes` + `step6.styleNotes` into the new
 *    `step6.visualNotes` field. Legacy fields stay readable for back-compat;
 *    Pro-C audit pass removes them.
 *  - v4 → v5: introduce existing-brand track. Initialize `step6.hasExistingBrand`
 *    to `false` when absent. When the legacy `step6.referenceUploadName` is set
 *    and `step6.existingBrand.referenceImageRef` is not, copy the filename into
 *    the new field as a read-compat shim. Pro-C audit pass removes the legacy field.
 *  - v5 → v6: split `step6.existingBrand.extractedColors` into the
 *    source-specific `logoExtractedColors` (authoritative; auto-fills hexColors)
 *    and `referenceExtractedColors` (additive suggestions only). Legacy
 *    `extractedColors` values migrate into `logoExtractedColors` when absent,
 *    since pre-v6 forms only ran extraction on whichever upload happened
 *    last — defaulting to logo preserves the more useful semantics.
 *  - v6 → v7: relocate `step6.existingBrand.url` to `step1.businessWebsite`.
 *    A website is a business identity attribute, not a visual signal, so it
 *    belongs on Step 1 with the business name. The legacy `existingBrand.url`
 *    field is dropped from the active payload during migration but the `url`
 *    property is retained on the `ExistingBrand` type for read-compat against
 *    persisted v6 JSON. `step1.businessWebsite` is preserved if already set.
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
  const existingBrandPayload = migrateExistingBrand(form)
  const hasExistingBrand = form.step6.hasExistingBrand ?? false

  const { existingBrand: existingBrandAfterUrlMove, businessWebsite } = migrateBusinessWebsite(
    existingBrandPayload,
    form.step1.businessWebsite,
  )

  return {
    ...form,
    intakeSchemaVersion: CURRENT_INTAKE_SCHEMA_VERSION,
    step1: {
      ...form.step1,
      businessOperatingModel,
      guideFocus,
      businessWebsite,
    },
    step6: {
      ...form.step6,
      visualNotes: mergedVisualNotes,
      hasExistingBrand,
      existingBrand: existingBrandAfterUrlMove,
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

/**
 * v4 → v5 + v5 → v6: produce the `existingBrand` payload.
 *
 * v5 work — copy the legacy `referenceUploadName` filename into
 * `referenceImageRef` when no real path is present yet. The shim keeps existing
 * forms readable; once Pro-E lands, the `/uploads/sign` flow overwrites
 * `referenceImageRef` with a real storage path.
 *
 * v6 work — migrate the legacy single-source `extractedColors` array into
 * `logoExtractedColors` (the authoritative source). Pre-v6 forms ran extraction
 * on whichever upload happened last and stored the result in one shared array,
 * so we cannot reliably tell which source produced it. Defaulting to logo
 * preserves the auto-fill semantics buyers experienced before the split.
 */
function migrateExistingBrand(form: IdentityKitForm): ExistingBrand {
  const existing: ExistingBrand = form.step6.existingBrand ?? {}
  let next: ExistingBrand = existing

  if (!existing.referenceImageRef) {
    const legacyName = form.step6.referenceUploadName?.trim()
    if (legacyName) next = { ...next, referenceImageRef: legacyName }
  }

  const legacyExtracted = (existing as ExistingBrand & { extractedColors?: string[] }).extractedColors
  if (legacyExtracted && legacyExtracted.length > 0 && !next.logoExtractedColors) {
    const { extractedColors: _legacy, ...rest } = next as ExistingBrand & { extractedColors?: string[] }
    next = { ...rest, logoExtractedColors: legacyExtracted }
  } else if (legacyExtracted) {
    const { extractedColors: _legacy, ...rest } = next as ExistingBrand & { extractedColors?: string[] }
    next = rest
  }

  return next
}

/**
 * v6 → v7: pull `existingBrand.url` up to `step1.businessWebsite` and drop the
 * legacy field from the active payload. If `step1.businessWebsite` is already
 * set (e.g. a partially-migrated draft), the existing value wins — we never
 * overwrite a value the buyer already provided on Step 1. The `url` key is
 * removed from the returned `ExistingBrand` object so persisted JSON stops
 * carrying duplicate state across the two locations.
 */
function migrateBusinessWebsite(
  existingBrand: ExistingBrand,
  currentBusinessWebsite: string | undefined,
): { existingBrand: ExistingBrand; businessWebsite: string | undefined } {
  const trimmedCurrent = currentBusinessWebsite?.trim()
  const legacyUrl = existingBrand.url?.trim()

  const nextWebsite = trimmedCurrent ? currentBusinessWebsite : (legacyUrl ? existingBrand.url : currentBusinessWebsite)

  if (existingBrand.url === undefined) {
    return { existingBrand, businessWebsite: nextWebsite }
  }

  const { url: _legacy, ...rest } = existingBrand
  return { existingBrand: rest, businessWebsite: nextWebsite }
}

export function getIntakeSchemaVersion(): number {
  return CURRENT_INTAKE_SCHEMA_VERSION
}
