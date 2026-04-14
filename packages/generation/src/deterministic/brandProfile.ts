import {
  type BusinessOperatingModel,
  type IdentityKitForm,
  getTouchpointDefinition,
  normalizeTouchpoints,
} from '@identity-kit/shared'

import { getNarratorProfile } from './narratorProfiles.js'

/** Where the brand’s identity primarily shows up — drives typography framing and Quick Start (later phases). */
export type TouchpointCluster =
  | 'physical_first'
  | 'social_product'
  | 'social_service'
  | 'local_community'
  | 'digital_brand'

/** Framing for Style Guide typography copy — derived from touchpoint cluster. */
export type TypographyContext =
  | 'physical_and_digital'
  | 'social_and_packaging'
  | 'professional_and_digital'
  | 'community_and_local'
  | 'social_and_digital'

/** Brand lifecycle framing — drives Quick Start and do/avoid (later phases). */
export type StageContext = 'starting_fresh' | 'building_foundation' | 'standardizing' | 'protecting_recognition'

export type BrandProfile = {
  touchpointCluster: TouchpointCluster
  typographyContext: TypographyContext
  stageContext: StageContext
  primaryChannelSet: string[]
}

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
 * Legacy narrator + industry cluster (used when `businessOperatingModel` is unset or during migration inference).
 * Empty narrator → social_service (safest generic default per refactor spec).
 */
function legacyTouchpointClusterBaseFromForm(form: IdentityKitForm): TouchpointCluster {
  const narrator = form.step1.brandNarrator?.trim() || ''
  const industry = form.step1.industry

  if (!narrator) {
    return 'social_service'
  }

  if (narrator === 'solo_expert') {
    if (SOLO_EXPERT_PHYSICAL.has(industry)) return 'physical_first'
    return 'social_service'
  }

  if (narrator === 'solo_maker') {
    if (industry === 'food_beverage') return 'physical_first'
    return 'social_product'
  }

  if (narrator === 'local_team') {
    if (PHYSICAL_OVERRIDE_INDUSTRY.has(industry)) return 'physical_first'
    if (LOCAL_TEAM_SOCIAL_PRODUCT.has(industry)) return 'social_product'
    return 'local_community'
  }

  if (narrator === 'product_led') {
    if (industry === 'food_beverage') return 'physical_first'
    if (PRODUCT_LED_SOCIAL_PRODUCT.has(industry)) return 'social_product'
    return 'digital_brand'
  }

  if (narrator === 'mission_community') {
    return 'local_community'
  }

  return 'social_service'
}

/** Map explicit operating model + narrator/industry to checklist/typography cluster. */
function touchpointClusterFromOperatingModel(model: BusinessOperatingModel, form: IdentityKitForm): TouchpointCluster {
  const narrator = form.step1.brandNarrator?.trim() || ''

  switch (model) {
    case 'customer_visits_us':
    case 'we_travel_to_customers':
      return 'physical_first'
    case 'mostly_events_or_markets':
      return 'local_community'
    case 'online_only':
      if (narrator === 'solo_maker') return 'social_product'
      if (narrator === 'product_led') return 'digital_brand'
      if (narrator === 'local_team' || narrator === 'mission_community') return 'local_community'
      return 'social_service'
    case 'hybrid':
      if (narrator === 'local_team' || narrator === 'mission_community') return 'local_community'
      if (narrator === 'solo_maker') return 'social_product'
      if (narrator === 'product_led') return 'digital_brand'
      return 'social_service'
    default:
      return legacyTouchpointClusterBaseFromForm(form)
  }
}

function touchpointClusterBaseFromForm(form: IdentityKitForm): TouchpointCluster {
  const raw = form.step1.businessOperatingModel?.trim()
  if (!raw) {
    return legacyTouchpointClusterBaseFromForm(form)
  }
  return touchpointClusterFromOperatingModel(raw as BusinessOperatingModel, form)
}

/**
 * If the user's #1 touchpoint is a marketplace but the base cluster is still service-shaped,
 * use social_product so checklist and typography match shop-first selling.
 * Never overrides physical_first or local_community (narrator + industry physical/community signals win).
 */
function applyMarketplacePrimaryClusterOverride(
  base: TouchpointCluster,
  form: IdentityKitForm,
): TouchpointCluster {
  if (base === 'physical_first' || base === 'local_community') return base
  const ids = normalizeTouchpoints((form.step1.touchpoints as readonly string[] | undefined) ?? [])
  if (ids.length === 0) return base
  const firstBucket = getTouchpointDefinition(ids[0]).bucket
  if (base === 'social_service' && firstBucket === 'marketplace') return 'social_product'
  return base
}

export function touchpointClusterFromForm(form: IdentityKitForm): TouchpointCluster {
  const base = touchpointClusterBaseFromForm(form)
  return applyMarketplacePrimaryClusterOverride(base, form)
}

export function typographyContextFromCluster(cluster: TouchpointCluster): TypographyContext {
  const map: Record<TouchpointCluster, TypographyContext> = {
    physical_first: 'physical_and_digital',
    social_product: 'social_and_packaging',
    social_service: 'professional_and_digital',
    local_community: 'community_and_local',
    digital_brand: 'social_and_digital',
  }
  return map[cluster]
}

export function stageContextFromStage(stage: string): StageContext {
  if (stage === 'idea') return 'starting_fresh'
  if (stage === 'new') return 'building_foundation'
  if (stage === 'growing') return 'standardizing'
  if (stage === 'established') return 'protecting_recognition'
  return 'building_foundation'
}

export function computeBrandProfile(form: IdentityKitForm): BrandProfile {
  const touchpointCluster = touchpointClusterFromForm(form)
  const typographyContext = typographyContextFromCluster(touchpointCluster)
  const stageContext = stageContextFromStage(form.step1.stage)
  const profile = getNarratorProfile(form.step1.brandNarrator)
  return {
    touchpointCluster,
    typographyContext,
    stageContext,
    primaryChannelSet: [...profile.primary_channels],
  }
}
