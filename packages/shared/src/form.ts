import type { MoodAdjective } from './step6MoodAdjectives.js'
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
  /**
   * Pro-only deep narrative (free text, soft 300–800 chars). Primary grounding signal
   * for AI Strategy Memo + brief rewrites. See OUTPUT_TRANSLATION_SPEC §2.2.
   */
  businessDescription?: string
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
  /**
   * Pro-only short voice snippets (1–5 entries, ~50–200 chars each) the AI uses
   * to match register. See OUTPUT_TRANSLATION_SPEC §2.2.
   */
  voiceSamples?: string[]
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

/**
 * Pro-only existing-brand track payload. Populated when `Step6Aesthetic.hasExistingBrand`
 * is true. Field shapes are locked by OUTPUT_TRANSLATION_SPEC §2.2 / §5.6.
 *
 * `logoRef` and `referenceImageRef` are storage paths in the `pro-uploads` bucket
 * (e.g. `"pro-uploads/sess_abc/logo.png"`), not signed URLs. Signed read URLs are
 * minted at fulfillment time per AI_INTEGRATION_PLAYBOOK §6.4.
 *
 * During the Pro-D ship the `/uploads/sign` and `/uploads/confirm` endpoints are
 * not yet wired (see OUTPUT_TRANSLATION_SPEC §5.6.0 scope note); the UI writes a
 * placeholder path string until Pro-E lands.
 */
export interface ExistingBrand {
  /** Storage path of the uploaded logo (PNG/JPG/SVG, ≤4MB). */
  logoRef?: string
  /** Storage path of the uploaded reference image (PNG/JPG, ≤4MB). */
  referenceImageRef?: string
  /** 1–6 manually-entered hex strings (with or without leading `#`). */
  hexColors?: string[]
  /**
   * Up to 6 dominant hex values from client-side `color-thief` extraction of
   * the uploaded logo. Treated as authoritative — auto-fills `hexColors` when
   * the buyer has not entered manual values. See OUTPUT_TRANSLATION_SPEC §2.2.
   */
  logoExtractedColors?: string[]
  /**
   * Up to 6 dominant hex values from client-side `color-thief` extraction of
   * the uploaded reference image. Surfaced as additive suggestions in the hex
   * chips picker — never auto-fills, since reference-image colors are
   * inspirational rather than authoritative.
   */
  referenceExtractedColors?: string[]
  /** Optional brand website URL — text context only in v1, no scrape. */
  url?: string
}

export interface Step6Aesthetic {
  selectedPalette: string
  selectedStyle: string
  /** Optional: fonts the business already uses — kit recommendations respect or complement this */
  existingTypeface?: string
  /**
   * Pro-only multi-select from the 16-value controlled vocabulary in
   * OUTPUT_TRANSLATION_SPEC §5.8.2; drives moodboard tag-match scoring.
   */
  moodAdjectives?: MoodAdjective[]
  /**
   * Pro-only free-text visual direction notes. Replaces the legacy
   * `colorMoodNotes` + `styleNotes` pair (merged via v3→v4 migration).
   */
  visualNotes?: string
  /**
   * Pro-only gate for the existing-brand track. When `true`, the conditional
   * `c6_eb*` and `c6_s3` micro-steps appear in the flow per
   * OUTPUT_TRANSLATION_SPEC §5.6.5.
   */
  hasExistingBrand?: boolean
  /** Pro-only existing-brand payload; see `ExistingBrand`. */
  existingBrand?: ExistingBrand
  /** @deprecated v4 — read-compat only; merged into `visualNotes` via migration. Removed in Pro-C audit pass. */
  colorMoodNotes?: string
  /** @deprecated v4 — read-compat only; merged into `visualNotes` via migration. Removed in Pro-C audit pass. */
  styleNotes?: string
  /** @deprecated v5 — superseded by `existingBrand.referenceImageRef`. Migrated via v4→v5 shim. Removed in Pro-C audit pass. */
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
   * Intake JSON schema revision. Omitted or `1` = pre operating-model field;
   * `2` = includes `businessOperatingModel` + Path C migration applied;
   * `3` = adds `guideFocus` backfill;
   * `4` = visualNotes merge + new Pro fields (businessDescription, voiceSamples, moodAdjectives);
   * `5` = existing-brand track (`hasExistingBrand` + `existingBrand.*`); `referenceUploadName` shimmed into `existingBrand.referenceImageRef`;
   * `6` = split `existingBrand.extractedColors` into `logoExtractedColors` + `referenceExtractedColors` (logo extraction = authoritative; reference extraction = additive suggestions only).
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
