import {
  getTouchpointDefinition,
  getTouchpointLabel,
  type BusinessOperatingModel,
  type IdentityKitForm,
  normalizeTouchpoints,
  type PrimaryGoal,
  type TouchpointBucketId,
  type TouchpointId,
} from '@identity-kit/shared'

import { computeBrandProfile } from './brandProfile.js'
import { getNarratorProfile } from './narratorProfiles.js'

/** Industry segment for Expand recommendations (Phase B matrix). */
export type QuickStartSegment = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6'

export type QuickStartExpandRecommendations = {
  /** First advisory Expand line (PDF). */
  r1: TouchpointId | null
  /** Second advisory Expand line (PDF). */
  r2: TouchpointId | null
  /** Internal slots 3–6 — not shown as checklist rows in v1. */
  considerLater: TouchpointId[]
  /** Full ordered queue after gates (for tests). */
  queue: TouchpointId[]
}

type SegmentMatrix = {
  industryGroups: Record<QuickStartSegment, readonly string[]>
  retailByOperatingModel: {
    local: readonly BusinessOperatingModel[]
    online: readonly BusinessOperatingModel[]
  }
  otherByNarrator: Partial<Record<Exclude<IdentityKitForm['step1']['brandNarrator'], ''>, QuickStartSegment>>
  otherLocalOperatingModels: readonly BusinessOperatingModel[]
}

type RecommendationSubtype =
  | 'food_local_review_driven'
  | 'food_local_social_first'
  | 'professional_b2b_expert'
  | 'professional_local_advisor'
  | 'commerce_etsy_first'
  | 'commerce_dtc_first'
  | 'beauty_local_service'
  | 'beauty_online_portfolio'
  | 'wellness_local_clinic'
  | 'fitness_local_studio'
  | 'pet_local_service'
  | 'real_estate_local'
  | 'other_local_service'
  | 'other_digital_default'

const LOCAL_OPERATING_MODELS = new Set<BusinessOperatingModel>([
  'customer_visits_us',
  'we_travel_to_customers',
  'hybrid',
  'mostly_events_or_markets',
])

/**
 * Pass-2 routing matrix (strategy -> code):
 * - Industry families map to segments.
 * - Retail is split by operating model.
 * - "other" routes by narrator, then local operating model fallback.
 */
const SEGMENT_MATRIX: SegmentMatrix = {
  industryGroups: {
    S1: ['food_beverage'],
    S2: ['legal_professional_services', 'consulting_coaching', 'finance', 'education', 'technology'],
    S3: ['creative_services', 'photography_media', 'beauty_personal_care'],
    S4: ['home_services', 'construction_trades', 'automotive', 'health_wellness', 'fitness_sports', 'pet_services', 'real_estate'],
    S5: ['nonprofit_community'],
    S6: [],
  },
  retailByOperatingModel: {
    local: ['customer_visits_us', 'hybrid', 'mostly_events_or_markets'],
    online: ['online_only', 'we_travel_to_customers'],
  },
  otherByNarrator: {
    mission_community: 'S5',
    product_led: 'S6',
    solo_maker: 'S3',
  },
  otherLocalOperatingModels: ['customer_visits_us', 'we_travel_to_customers', 'hybrid'],
}

const S2_LINKEDIN_INDUSTRIES = new Set(SEGMENT_MATRIX.industryGroups.S2)

const SEGMENT_QUEUES: Record<QuickStartSegment, readonly TouchpointId[]> = {
  S1: [
    'google_business',
    'website',
    'email_newsletter',
    'instagram',
    'facebook',
    'yelp',
    'pinterest',
    'tiktok',
    'apple_maps',
  ],
  S2: ['website', 'google_business', 'email_newsletter', 'facebook', 'youtube', 'linkedin'],
  S3: ['website', 'instagram', 'pinterest', 'email_newsletter', 'tiktok', 'youtube', 'linkedin', 'google_business'],
  S4: ['google_business', 'website', 'yelp', 'email_newsletter', 'nextdoor', 'facebook', 'apple_maps'],
  S5: ['website', 'email_newsletter', 'facebook', 'google_business', 'instagram', 'nextdoor', 'linkedin'],
  S6: [
    'marketplace_storefront',
    'website',
    'instagram',
    'pinterest',
    'email_newsletter',
    'tiktok',
    'shopify_marketplace',
    'amazon_storefront',
  ],
}

const WHY_LINE: Partial<Record<TouchpointId, string>> = {
  google_business:
    'so your hours, location, and photos show in Maps and Search — many walk-in customers check there even if they found you on social',
  website:
    'so people can see your offer, contact you, or book without scrolling your feed — use your Summary one-liner as starter website copy',
  email_newsletter:
    'so you can reach regulars and interested customers without relying on social algorithms',
  facebook: 'so people who discover you on your main channel can follow community updates and events there too',
  instagram: 'so people who discover you can see your visual style and stay in touch between visits or posts',
  yelp: 'so guests who read reviews before visiting see accurate hours, photos, and your brand story',
  pinterest: 'so gift and style shoppers can discover your work the way they search on Pinterest',
  marketplace_storefront: 'so buyers have a trusted place to browse and purchase, not just DM requests',
  shopify_marketplace: 'so you can own checkout and customer relationships as you grow beyond marketplace fees',
  linkedin:
    'if most of your clients are other businesses — optional after your website and core profiles are in place',
  nextdoor: 'so neighbors can find you when they ask for local recommendations',
  tiktok: 'if short video fits your audience — add when your core profiles are already consistent',
}

const SUBTYPE_PRIORITY: Partial<Record<RecommendationSubtype, readonly TouchpointId[]>> = {
  food_local_review_driven: ['google_business', 'yelp', 'website', 'instagram', 'email_newsletter'],
  food_local_social_first: ['google_business', 'website', 'instagram', 'facebook', 'email_newsletter', 'yelp'],
  professional_b2b_expert: ['website', 'email_newsletter', 'linkedin', 'youtube', 'facebook'],
  professional_local_advisor: ['website', 'google_business', 'email_newsletter', 'facebook'],
  commerce_etsy_first: ['marketplace_storefront', 'instagram', 'pinterest', 'website', 'email_newsletter'],
  commerce_dtc_first: ['website', 'email_newsletter', 'instagram', 'pinterest', 'shopify_marketplace', 'marketplace_storefront'],
  beauty_local_service: ['google_business', 'website', 'instagram', 'email_newsletter', 'pinterest'],
  beauty_online_portfolio: ['website', 'instagram', 'pinterest', 'email_newsletter'],
  wellness_local_clinic: ['google_business', 'website', 'email_newsletter', 'instagram'],
  fitness_local_studio: ['google_business', 'website', 'instagram', 'email_newsletter'],
  pet_local_service: ['google_business', 'website', 'nextdoor', 'instagram', 'email_newsletter'],
  real_estate_local: ['google_business', 'website', 'email_newsletter', 'facebook', 'instagram'],
  other_local_service: ['google_business', 'website', 'email_newsletter', 'facebook'],
  other_digital_default: ['website', 'email_newsletter', 'facebook', 'youtube'],
}

function resolvePrimaryGoal(form: IdentityKitForm): Exclude<PrimaryGoal, ''> {
  const goal = form.step1.primaryGoal
  if (goal === 'lead_gen' || goal === 'audience_growth' || goal === 'retention' || goal === 'direct_sales') {
    return goal
  }
  return 'direct_sales'
}

function selectedIds(form: IdentityKitForm): TouchpointId[] {
  return normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? [])
}

function isLocalPhysical(form: IdentityKitForm): boolean {
  const om = form.step1.businessOperatingModel
  return om ? LOCAL_OPERATING_MODELS.has(om) : false
}

function withPriorityFront(queue: TouchpointId[], orderedPriority: readonly TouchpointId[]): TouchpointId[] {
  if (orderedPriority.length === 0) return queue
  const front = orderedPriority.filter((id) => queue.includes(id))
  const rest = queue.filter((id) => !front.includes(id))
  return [...front, ...rest]
}

function resolveRecommendationSubtype(form: IdentityKitForm, segment: QuickStartSegment): RecommendationSubtype | null {
  const industry = form.step1.industry
  const local = isLocalPhysical(form)
  const goal = resolvePrimaryGoal(form)
  const hasWebsiteSelected = selectedIds(form).includes('website')

  if (industry === 'food_beverage' && local) {
    return goal === 'lead_gen' || (goal === 'direct_sales' && hasWebsiteSelected)
      ? 'food_local_review_driven'
      : 'food_local_social_first'
  }
  if (segment === 'S2') {
    if (local) return 'professional_local_advisor'
    if (isOnlineOnly(form) && (form.step1.brandNarrator === 'solo_expert' || goal === 'lead_gen')) {
      return 'professional_b2b_expert'
    }
  }
  if (segment === 'S6') {
    return marketplaceFirst(form) ? 'commerce_etsy_first' : 'commerce_dtc_first'
  }

  if (industry === 'beauty_personal_care') return local ? 'beauty_local_service' : 'beauty_online_portfolio'
  if (industry === 'health_wellness' && local) return 'wellness_local_clinic'
  if (industry === 'fitness_sports' && local) return 'fitness_local_studio'
  if (industry === 'pet_services' && local) return 'pet_local_service'
  if (industry === 'real_estate' && local) return 'real_estate_local'
  if (industry === 'other') return local ? 'other_local_service' : 'other_digital_default'
  if (segment === 'S4' && local) return 'other_local_service'
  return null
}

function isOnlineOnly(form: IdentityKitForm): boolean {
  return form.step1.businessOperatingModel === 'online_only'
}

function marketplaceFirst(form: IdentityKitForm): boolean {
  const ids = selectedIds(form)
  return ids.length > 0 && getTouchpointDefinition(ids[0]!).bucket === 'marketplace'
}

export function resolveQuickStartSegment(form: IdentityKitForm): QuickStartSegment {
  const industry = form.step1.industry
  const om = form.step1.businessOperatingModel
  const narrator = form.step1.brandNarrator

  if (marketplaceFirst(form)) return 'S6'
  if (industry === 'retail') {
    if (om && SEGMENT_MATRIX.retailByOperatingModel.online.includes(om)) return 'S6'
    if (om && SEGMENT_MATRIX.retailByOperatingModel.local.includes(om)) return 'S1'
    return 'S6'
  }

  for (const [segment, industries] of Object.entries(SEGMENT_MATRIX.industryGroups) as Array<
    [QuickStartSegment, readonly string[]]
  >) {
    if (industries.includes(industry)) return segment
  }

  if (industry === 'other') {
    if (narrator && narrator in SEGMENT_MATRIX.otherByNarrator) {
      return SEGMENT_MATRIX.otherByNarrator[narrator as Exclude<typeof narrator, ''>]!
    }
    if (om && SEGMENT_MATRIX.otherLocalOperatingModels.includes(om)) return 'S4'
    return 'S2'
  }
  if (marketplaceFirst(form) || selectedIds(form).some((id) => getTouchpointDefinition(id).bucket === 'marketplace')) {
    return 'S6'
  }
  return 'S2'
}

function shouldIncludeGoogle(form: IdentityKitForm, segment: QuickStartSegment): boolean {
  if (!isLocalPhysical(form)) return false
  if (segment === 'S2' && isOnlineOnly(form)) return false
  if (segment === 'S6') return false
  if (segment === 'S3') return form.step1.businessOperatingModel === 'customer_visits_us'
  if (segment === 'S5') return isLocalPhysical(form)
  return true
}

function passesYelpGate(form: IdentityKitForm, segment: QuickStartSegment): boolean {
  if (segment === 'S4') return form.step1.industry !== 'real_estate'
  if (segment === 'S1' && form.step1.industry === 'food_beverage') return true
  return false
}

function passesPinterestGate(form: IdentityKitForm, segment: QuickStartSegment): boolean {
  if (segment === 'S3' || segment === 'S6') return true
  if (segment === 'S1' && form.step1.industry === 'retail') return true
  return false
}

function passesLinkedInGate(form: IdentityKitForm, segment: QuickStartSegment): boolean {
  const industry = form.step1.industry
  const goal = resolvePrimaryGoal(form)
  if (goal === 'audience_growth') return false
  if (['food_beverage', 'home_services', 'construction_trades', 'automotive', 'nonprofit_community'].includes(industry)) {
    return false
  }
  if (segment === 'S2') {
    return (
      S2_LINKEDIN_INDUSTRIES.has(industry) &&
      (goal === 'lead_gen' ||
        form.step1.guideFocus === 'give_clear_direction' ||
        form.step1.brandNarrator === 'solo_expert')
    )
  }
  if (segment === 'S3') {
    return (
      industry === 'creative_services' &&
      (goal === 'lead_gen' || form.step1.guideFocus === 'give_clear_direction')
    )
  }
  if (segment === 'S5') return false
  return false
}

function passesIdGate(id: TouchpointId, form: IdentityKitForm, segment: QuickStartSegment): boolean {
  switch (id) {
    case 'google_business':
      return shouldIncludeGoogle(form, segment)
    case 'yelp':
      return passesYelpGate(form, segment)
    case 'pinterest':
      return passesPinterestGate(form, segment)
    case 'linkedin':
      return passesLinkedInGate(form, segment)
    case 'marketplace_storefront':
    case 'shopify_marketplace':
    case 'amazon_storefront':
      return segment === 'S6'
    case 'nextdoor':
      return segment === 'S4' || segment === 'S5'
    case 'tripadvisor':
    case 'bing_places':
    case 'blog':
    case 'threads':
    case 'ebay_storefront':
    case 'depop_store':
    case 'poshmark_store':
    case 'walmart_marketplace':
    case 'faire_wholesale':
      return false
    default:
      return true
  }
}

function applyRetentionBoost(queue: TouchpointId[], form: IdentityKitForm): TouchpointId[] {
  if (resolvePrimaryGoal(form) !== 'retention') return queue
  const email = 'email_newsletter'
  if (!queue.includes(email)) return queue
  const rest = queue.filter((id) => id !== email)
  const websiteIdx = rest.indexOf('website')
  if (websiteIdx === -1) return [email, ...rest]
  return [...rest.slice(0, websiteIdx + 1), email, ...rest.slice(websiteIdx + 1)]
}

/** Walk-in / local clusters: Maps discovery belongs in Expand when not selected (replaces inline Week 3 claim copy). */
function applyDiscoveryDirectoryBoost(queue: TouchpointId[], form: IdentityKitForm): TouchpointId[] {
  const { touchpointCluster } = computeBrandProfile(form)
  if (touchpointCluster !== 'local_community' && touchpointCluster !== 'physical_first') return queue
  if (selectedIds(form).includes('google_business')) return queue
  const segment = resolveQuickStartSegment(form)
  if (!shouldIncludeGoogle(form, segment)) return queue
  const rest = queue.filter((id) => id !== 'google_business')
  return ['google_business', ...rest]
}

function buildSegmentQueue(form: IdentityKitForm): TouchpointId[] {
  const segment = resolveQuickStartSegment(form)
  let queue = SEGMENT_QUEUES[segment].filter((id) => passesIdGate(id, form, segment))
  const subtype = resolveRecommendationSubtype(form, segment)
  if (subtype && SUBTYPE_PRIORITY[subtype]) {
    queue = withPriorityFront(queue, SUBTYPE_PRIORITY[subtype]!)
  }
  queue = applyRetentionBoost(queue, form)
  const selected = new Set(selectedIds(form))
  queue = queue.filter((id) => !selected.has(id))
  return applyDiscoveryDirectoryBoost(queue, form)
}

function applyAudienceGrowthCap(ids: TouchpointId[], form: IdentityKitForm): TouchpointId[] {
  if (resolvePrimaryGoal(form) !== 'audience_growth') return ids
  if (ids.length === 0) return ids
  const google = ids.includes('google_business') ? 'google_business' : null
  if (google && shouldIncludeGoogle(form, resolveQuickStartSegment(form))) return [google]
  return ids.slice(0, 1)
}

/** Ordered missing IDs — up to six Tier-1-priority slots for Expand. */
export function recommendableTouchpointQueue(form: IdentityKitForm): TouchpointId[] {
  const capped = applyAudienceGrowthCap(buildSegmentQueue(form), form)
  return capped.slice(0, 6)
}

export function inferQuickStartExpandRecommendations(form: IdentityKitForm): QuickStartExpandRecommendations {
  const queue = recommendableTouchpointQueue(form)
  return {
    r1: queue[0] ?? null,
    r2: queue[1] ?? null,
    considerLater: queue.slice(2, 6),
    queue,
  }
}

export type PriorityChannelPlan = {
  primary: string
  secondary: string | null
  all: string[]
  primaryBucket: TouchpointBucketId | null
  secondaryBucket: TouchpointBucketId | null
  primaryId: TouchpointId | null
  secondaryId: TouchpointId | null
}

/** Execute weeks: selected touchpoints only (narrator fallback when empty). */
export function resolvePriorityChannelPlan(form: IdentityKitForm): PriorityChannelPlan {
  const selected = normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? []).map(
    (id) => ({
      id,
      label: getTouchpointLabel(id).trim(),
      bucket: getTouchpointDefinition(id).bucket,
    }),
  )

  if (selected.length === 0) {
    const profile = getNarratorProfile(form.step1.brandNarrator)
    const fallback = profile.primary_channels.map((label) => label.trim()).filter(Boolean)
    const primary = fallback[0] ?? 'your primary channel'
    const secondary = fallback[1] ?? null
    return {
      primary,
      secondary,
      all: fallback.length > 0 ? fallback : [primary],
      primaryBucket: null,
      secondaryBucket: null,
      primaryId: null,
      secondaryId: null,
    }
  }

  const primaryEntry = selected[0]!
  const secondaryEntry = selected[1] ?? null
  return {
    primary: primaryEntry.label,
    secondary: secondaryEntry?.label ?? null,
    all: selected.map((e) => e.label),
    primaryBucket: primaryEntry.bucket,
    secondaryBucket: secondaryEntry?.bucket ?? null,
    primaryId: primaryEntry.id,
    secondaryId: secondaryEntry?.id ?? null,
  }
}

function expandLineForId(id: TouchpointId, form: IdentityKitForm): string {
  const label = getTouchpointLabel(id)
  const why = WHY_LINE[id] ?? 'when you are ready to add another high-impact channel'
  const bucket = getTouchpointDefinition(id).bucket
  const primary = resolvePriorityChannelPlan(form).primary

  switch (bucket) {
    case 'online_directory':
      return `Claim or complete your ${label} listing ${why} — use the same photos and short description as ${primary}.`
    case 'social':
      return `Set up ${label} ${why}.`
    case 'owned_channel':
      return id === 'email_newsletter'
        ? `Start a simple ${label} ${why}.`
        : `Add a simple ${label} ${why}.`
    case 'marketplace':
      return `Open a ${label} profile ${why}.`
    default:
      return `Add ${label} ${why}.`
  }
}

const EXPAND_SECTION_HEADING = 'Also worth setting up when you\'re ready'

/** Checkbox lines for Weeks 3–4 Expand (max 2 advisory channels). */
export function quickStartExpandCheckboxLines(form: IdentityKitForm): string[] {
  const { r1, r2 } = inferQuickStartExpandRecommendations(form)
  if (!r1 && !r2) return []
  const lines: string[] = [EXPAND_SECTION_HEADING]
  if (r1) lines.push(`☐ ${expandLineForId(r1, form)}`)
  if (r2) lines.push(`☐ ${expandLineForId(r2, form)}`)
  return lines
}

export function quickStartExpandSectionBlock(form: IdentityKitForm): string {
  return quickStartExpandCheckboxLines(form).join('\n')
}
