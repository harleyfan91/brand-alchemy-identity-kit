import type { IdentityKitForm } from '@identity-kit/shared'

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
 * Primary signal: brand narrator. Industry overrides when it implies different primary touchpoints.
 * Empty narrator → social_service (safest generic default per refactor spec).
 */
export function touchpointClusterFromForm(form: IdentityKitForm): TouchpointCluster {
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
