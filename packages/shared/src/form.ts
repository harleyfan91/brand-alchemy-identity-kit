import type { TouchpointId } from './touchpoints.js'

export type Tier = 'core' | 'pro'

/** How customers meet the business / where work happens (Step 1 operating model). */
export type BusinessOperatingModel =
  | 'customer_visits_us'
  | 'we_travel_to_customers'
  | 'online_only'
  | 'hybrid'
  | 'mostly_events_or_markets'

export type BrandNarrator =
  | 'solo_expert'
  | 'solo_maker'
  | 'local_team'
  | 'product_led'
  | 'mission_community'
  | ''

export type PrimaryGoal = 'direct_sales' | 'lead_gen' | 'audience_growth' | 'retention' | ''

/**
 * What the customer most wants the guide to help with first.
 * This is primarily a routing / density signal, not a guaranteed visible section.
 */
export type GuideFocus =
  | 'look_more_professional'
  | 'sound_more_consistent'
  | 'give_clear_direction'
  | 'know_what_to_fix_first'
  | ''

export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type FulfillmentStatus = 'not_started' | 'in_progress' | 'complete' | 'error'

export type Screen =
  | 'landing'
  | 'step'
  | 'review'
  | 'payment'
  | 'processing'
  | 'edit'
  | 'confirm'

export interface Step1Offer {
  offerId: string
  offerOther?: string
  audienceId: string
  audienceOther?: string
  deliveryId?: string
  deliveryOther?: string
}

export interface Step1Transformation {
  beforeId: string
  beforeOther?: string
  afterId: string
  afterOther?: string
  mechanismId: string
  mechanismOther?: string
}

export interface Step1Snapshot {
  businessName: string
  offer: Step1Offer
  transformation: Step1Transformation
  industry: string
  stage: string
  brandNarrator: BrandNarrator
  /** First-class channel alignment input (v3): ordered relevant touchpoints. */
  touchpoints: TouchpointId[]
  /** Primary business objective used to prioritize deterministic recommendations. */
  primaryGoal: PrimaryGoal
  /**
   * Main practical use case for the guide. Helps output decide what to emphasize
   * first without forcing another visible section into the final PDF.
   */
  guideFocus: GuideFocus
  /**
   * How customers meet the business (fixed location, travel, online-only, etc.).
   * Empty until the user selects on Business Basics `c1_s2`; migration backfills for legacy JSON.
   */
  businessOperatingModel: BusinessOperatingModel | ''
}

export interface Step2Customer {
  customerArchetype: string
  painPoints?: string
  desiredOutcomes?: string
}

export interface VoiceSliders {
  formality: number
  energy: number
  directness: number
  warmth: number
  playfulness: number
}

export interface Step3Personality {
  tonePreset: 'friendly' | 'professional' | 'bold' | ''
  voiceSliders: VoiceSliders
  customVoiceNotes?: string
}

export interface Step4Values {
  values: string[]
  missionStatement?: string
}

export interface Step5Story {
  originArchetype: string
  originSummary?: string
  motivation?: string
}

export interface Step6Aesthetic {
  selectedPalette: string
  selectedStyle: string
  /** Optional: fonts the business already uses — kit recommendations respect or complement this */
  existingTypeface?: string
  colorMoodNotes?: string
  styleNotes?: string
  referenceUploadName?: string
}

export interface Step7Industry {
  competitors: string[]
  differentiation?: string
}

export interface IdentityKitForm {
  tier: Tier | null
  sessionId: string
  orderId: string | null
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  /**
   * Intake JSON schema revision. Omitted or `1` = pre operating-model field; `2` = includes `businessOperatingModel` + Path C migration applied.
   */
  intakeSchemaVersion?: number
  step1: Step1Snapshot
  step2: Step2Customer
  step3: Step3Personality
  step4: Step4Values
  step5: Step5Story
  step6: Step6Aesthetic
  step7: Step7Industry
  createdAt: string
  updatedAt: string
}

export type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type StepErrors = Record<string, string>

export interface TierConfig {
  id: Tier
  name: string
  priceLabel: string
  description: string
  bullets: string[]
}
