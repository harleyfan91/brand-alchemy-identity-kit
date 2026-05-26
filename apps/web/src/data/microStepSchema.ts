import type { IdentityKitForm } from '@identity-kit/shared'

import type { Tier } from '../types'

/**
 * Canonical micro-step configuration for the intake wizard.
 *
 * Source of truth for chapter / micro-step breakdown: `SCREEN_COPY_MAP.md` (section A) and this file.
 *
 * `microStepTotal` is the count of all micro-step rows defined for that chapter in this schema (Pro-inclusive).
 * For Core-only progress denominators, filter with `tier === 'both' || tier === 'core'` (see `getMicroStepsForTier`).
 *
 * Wired into `useFlowState` (chapter + micro-step navigation) and `microStepValidation.ts`.
 */

export type MicroStepTierScope = 'both' | 'core' | 'pro'

export type FieldInputType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'cards'
  | 'choices'
  | 'grid'
  | 'slider'
  | 'chips'
  | 'upload'
  | 'deck'
  | 'gate'
  | 'hex-chips'

/**
 * Dot path into `IdentityKitForm` (and related `StepErrors` keys where applicable).
 * Nested slider keys use `step3.voiceSliders.<name>`.
 */
export type IdentityKitFormFieldPath = string

export interface MicroStepFieldDescriptor {
  key: IdentityKitFormFieldPath
  required: boolean
  inputType: FieldInputType
  /** Named validation entry point for this field or micro-step bundle; implement in a follow-up. */
  validationRuleRef: string
}

export interface MicroStep {
  id: string
  /** 0 = Landing; 1–7 = intake chapters (maps to current `stepIndex` / step keys). */
  chapterIndex: number
  chapterLabel: string
  /** 1-based within the chapter. */
  microStepIndex: number
  /**
   * Total micro-steps defined for this chapter in this schema (includes Pro-only rows).
   * Use `getMicroStepsForTier` when the displayed total should exclude Pro-only steps for Core.
   */
  microStepTotal: number
  /** Which kit tier sees this micro-step. */
  tier: MicroStepTierScope
  fields: MicroStepFieldDescriptor[]
  /**
   * Optional predicate evaluated against the live `IdentityKitForm`. When present
   * and returning `false`, the step is excluded from the active flow even if its
   * `tier` matches. Used by the existing-brand track per
   * OUTPUT_TRANSLATION_SPEC §5.6.5.
   */
  conditional?: (form: IdentityKitForm) => boolean
}

function chapterTotal(steps: MicroStep[]): number {
  return steps.length
}

const CHAPTER_0: MicroStep[] = [
  {
    id: 'c0_s1',
    chapterIndex: 0,
    chapterLabel: 'Get started',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'tier',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC0S1',
      },
    ],
  },
]

CHAPTER_0[0]!.microStepTotal = chapterTotal(CHAPTER_0)

const CHAPTER_1: MicroStep[] = [
  {
    id: 'c1_s1',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.businessName',
        required: true,
        inputType: 'text',
        validationRuleRef: 'validateC1S1',
      },
    ],
  },
  {
    id: 'c1_s2',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.industry',
        required: true,
        inputType: 'select',
        validationRuleRef: 'validateC1S2',
      },
      {
        key: 'step1.stage',
        required: true,
        inputType: 'select',
        validationRuleRef: 'validateC1S2',
      },
      {
        key: 'step1.businessOperatingModel',
        required: true,
        inputType: 'select',
        validationRuleRef: 'validateC1S2',
      },
    ],
  },
  {
    id: 'c1_s3',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.brandNarrator',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC1S3',
      },
    ],
  },
  {
    id: 'c1_s4',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 4,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.touchpoints',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC1S4',
      },
      {
        key: 'step1.primaryGoal',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC1S4',
      },
      {
        key: 'step1.guideFocus',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC1S4',
      },
    ],
  },
  {
    id: 'c1_s5',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 5,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.offer.offerId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
      {
        key: 'step1.offer.offerOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
      {
        key: 'step1.offer.audienceId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
      {
        key: 'step1.offer.audienceOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
      {
        key: 'step1.offer.deliveryId',
        required: false,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
      {
        key: 'step1.offer.deliveryOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5OfferSentence',
      },
    ],
  },
  {
    id: 'c1_s6',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 6,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step1.offer.audienceId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.offer.audienceOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.beforeId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.beforeOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.afterId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.afterOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.mechanismId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
      {
        key: 'step1.transformation.mechanismOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S6TransformationSentence',
      },
    ],
  },
  {
    id: 'c1_s7',
    chapterIndex: 1,
    chapterLabel: 'Business Basics',
    microStepIndex: 7,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step1.businessDescription',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC1S7',
      },
    ],
  },
]

const c1Total = chapterTotal(CHAPTER_1)
for (const s of CHAPTER_1) s.microStepTotal = c1Total

const CHAPTER_2: MicroStep[] = [
  {
    id: 'c2_s1',
    chapterIndex: 2,
    chapterLabel: 'Your Buyer',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step2.customerArchetype',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC2S1',
      },
    ],
  },
  {
    id: 'c2_s2',
    chapterIndex: 2,
    chapterLabel: 'Your Buyer',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step2.painPoints',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC2ProPainOrOutcomes',
      },
    ],
  },
  {
    id: 'c2_s3',
    chapterIndex: 2,
    chapterLabel: 'Your Buyer',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step2.desiredOutcomes',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC2ProPainOrOutcomes',
      },
    ],
  },
]

const c2Total = chapterTotal(CHAPTER_2)
for (const s of CHAPTER_2) s.microStepTotal = c2Total

const CHAPTER_3: MicroStep[] = [
  {
    id: 'c3_s1',
    chapterIndex: 3,
    chapterLabel: 'Brand Personality',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step3.tonePreset',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC3S1',
      },
      {
        key: 'step3.voiceSliders.formality',
        required: false,
        inputType: 'slider',
        validationRuleRef: 'validateC3S2',
      },
      {
        key: 'step3.voiceSliders.energy',
        required: false,
        inputType: 'slider',
        validationRuleRef: 'validateC3S2',
      },
      {
        key: 'step3.voiceSliders.directness',
        required: false,
        inputType: 'slider',
        validationRuleRef: 'validateC3S3',
      },
      {
        key: 'step3.voiceSliders.warmth',
        required: false,
        inputType: 'slider',
        validationRuleRef: 'validateC3S3',
      },
      {
        key: 'step3.voiceSliders.playfulness',
        required: false,
        inputType: 'slider',
        validationRuleRef: 'validateC3S3',
      },
    ],
  },
  {
    id: 'c3_s2',
    chapterIndex: 3,
    chapterLabel: 'Brand Personality',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step3.customVoiceNotes',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC3S4',
      },
    ],
  },
  {
    id: 'c3_s3',
    chapterIndex: 3,
    chapterLabel: 'Brand Personality',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step3.voiceSamples',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC3S3VoiceSamples',
      },
    ],
  },
]

const c3Total = chapterTotal(CHAPTER_3)
for (const s of CHAPTER_3) s.microStepTotal = c3Total

const CHAPTER_4: MicroStep[] = [
  {
    id: 'c4_s1',
    chapterIndex: 4,
    chapterLabel: 'Core Values',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step4.values',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC4S1',
      },
    ],
  },
  {
    id: 'c4_s2',
    chapterIndex: 4,
    chapterLabel: 'Core Values',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step4.missionStatement',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC4S2',
      },
    ],
  },
]

const c4Total = chapterTotal(CHAPTER_4)
for (const s of CHAPTER_4) s.microStepTotal = c4Total

const CHAPTER_5: MicroStep[] = [
  {
    id: 'c5_s1',
    chapterIndex: 5,
    chapterLabel: 'Brand Story',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step5.originArchetype',
        required: true,
        inputType: 'deck',
        validationRuleRef: 'validateC5S1',
      },
    ],
  },
  {
    id: 'c5_s2',
    chapterIndex: 5,
    chapterLabel: 'Brand Story',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step5.originSummary',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC5S2',
      },
    ],
  },
  {
    id: 'c5_s3',
    chapterIndex: 5,
    chapterLabel: 'Brand Story',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step5.motivation',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC5S3',
      },
    ],
  },
]

const c5Total = chapterTotal(CHAPTER_5)
for (const s of CHAPTER_5) s.microStepTotal = c5Total

/**
 * Predicate for the existing-brand track per OUTPUT_TRANSLATION_SPEC §5.6.5.
 * Steps using this are included only when the buyer toggles
 * `step6.hasExistingBrand: true`.
 */
const isExistingBrand = (form: IdentityKitForm): boolean =>
  form.step6.hasExistingBrand === true

/**
 * Chapter 6 order (per OUTPUT_TRANSLATION_SPEC §5.6.5):
 *
 *   Pro flow:  gate → (conditional) logo / ref / hex / typeface / URL → palette → style → mood → notes
 *   Core flow: palette → style (the gate and conditional steps are tier='pro' and filtered out)
 *
 * Putting the gate first lets the existing-brand uploads run color extraction
 * BEFORE the buyer commits to a palette, so the palette picker can surface the
 * nearest named match. Core's experience is unchanged because every Pro-only
 * step is filtered out by tier before any conditional logic runs.
 */
const CHAPTER_6: MicroStep[] = [
  {
    id: 'c6_s4',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.hasExistingBrand',
        required: true,
        inputType: 'gate',
        validationRuleRef: 'validateC6S4Gate',
      },
    ],
  },
  {
    id: 'c6_eb1',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    conditional: isExistingBrand,
    fields: [
      {
        key: 'step6.existingBrand.logoRef',
        required: false,
        inputType: 'upload',
        validationRuleRef: 'validateC6Eb1LogoUpload',
      },
    ],
  },
  {
    id: 'c6_eb2',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'pro',
    conditional: isExistingBrand,
    fields: [
      {
        key: 'step6.existingBrand.referenceImageRef',
        required: false,
        inputType: 'upload',
        validationRuleRef: 'validateC6Eb2ReferenceAndUrl',
      },
      {
        key: 'step6.existingBrand.url',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC6Eb2ReferenceAndUrl',
      },
    ],
  },
  {
    id: 'c6_eb3',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 4,
    microStepTotal: 0,
    tier: 'pro',
    conditional: isExistingBrand,
    fields: [
      {
        key: 'step6.existingBrand.hexColors',
        required: false,
        inputType: 'hex-chips',
        validationRuleRef: 'validateC6Eb3HexColors',
      },
    ],
  },
  {
    id: 'c6_s3',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 5,
    microStepTotal: 0,
    tier: 'pro',
    conditional: isExistingBrand,
    fields: [
      {
        key: 'step6.existingTypeface',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC6S3',
      },
    ],
  },
  {
    id: 'c6_s1',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 6,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step6.selectedPalette',
        required: true,
        inputType: 'cards',
        validationRuleRef: 'validateC6S1',
      },
    ],
  },
  {
    id: 'c6_s2',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 7,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step6.selectedStyle',
        required: true,
        inputType: 'grid',
        validationRuleRef: 'validateC6S2',
      },
    ],
  },
  {
    id: 'c6_s5',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 8,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.moodAdjectives',
        required: false,
        inputType: 'chips',
        validationRuleRef: 'validateC6S5MoodAdjectives',
      },
    ],
  },
  {
    id: 'c6_s6',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 9,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.visualNotes',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC6S6VisualNotes',
      },
    ],
  },
]

const c6Total = chapterTotal(CHAPTER_6)
for (const s of CHAPTER_6) s.microStepTotal = c6Total

const CHAPTER_7: MicroStep[] = [
  {
    id: 'c7_s1',
    chapterIndex: 7,
    chapterLabel: 'Stand Out',
    microStepIndex: 1,
    microStepTotal: 0,
    tier: 'both',
    fields: [
      {
        key: 'step7.competitors',
        required: false,
        inputType: 'chips',
        validationRuleRef: 'validateC7S1',
      },
    ],
  },
  {
    id: 'c7_s2',
    chapterIndex: 7,
    chapterLabel: 'Stand Out',
    microStepIndex: 2,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step7.differentiation',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC7S2',
      },
    ],
  },
]

const c7Total = chapterTotal(CHAPTER_7)
for (const s of CHAPTER_7) s.microStepTotal = c7Total

/** Full ordered list of intake micro-steps (Landing chapter 0 + chapters 1–7). Post-intake screens are not modeled here. */
export const MICRO_STEP_SCHEMA: MicroStep[] = [
  ...CHAPTER_0,
  ...CHAPTER_1,
  ...CHAPTER_2,
  ...CHAPTER_3,
  ...CHAPTER_4,
  ...CHAPTER_5,
  ...CHAPTER_6,
  ...CHAPTER_7,
]

export function getMicroStepsByChapter(chapterIndex: number): MicroStep[] {
  return MICRO_STEP_SCHEMA.filter((s) => s.chapterIndex === chapterIndex)
}

/**
 * Direct lookup for routing (e.g. Edit-from-review).
 * @param chapterId — same as `chapterIndex` (0 = Landing, 1–7 = intake).
 * @param microStepId — 1-based micro-step index within that chapter.
 */
export function getMicroStep(chapterId: number, microStepId: number): MicroStep | undefined {
  return MICRO_STEP_SCHEMA.find(
    (s) => s.chapterIndex === chapterId && s.microStepIndex === microStepId,
  )
}

export function isMicroStepVisibleForTier(step: MicroStep, tier: Tier | null): boolean {
  if (step.chapterIndex === 0) return true
  if (tier == null) return step.tier === 'both'
  return step.tier === 'both' || step.tier === tier
}

/**
 * Tier-only filter. Use `getMicroStepsForFlow` when form-value-conditional
 * predicates need to apply (e.g. existing-brand track per OUTPUT_TRANSLATION_SPEC §5.6.5).
 */
export function getMicroStepsForTier(tier: Tier | null): MicroStep[] {
  return MICRO_STEP_SCHEMA.filter((step) => isMicroStepVisibleForTier(step, tier))
}

/**
 * Apply tier filter, then conditional predicate per OUTPUT_TRANSLATION_SPEC §5.6.5.
 * Step `id` is preserved; `microStepIndex` and `microStepTotal` are NOT renumbered
 * here — `useFlowState` derives those for the active flow.
 */
export function getMicroStepsForFlow(form: IdentityKitForm): MicroStep[] {
  return getMicroStepsForTier(form.tier).filter(
    (step) => step.conditional == null || step.conditional(form),
  )
}

export function getFirstMicroStepForChapter(
  chapterIndex: number,
  tier: Tier | null,
): MicroStep | undefined {
  return getMicroStepsForTier(tier).find((step) => step.chapterIndex === chapterIndex)
}

/**
 * Conditional-aware variant of `getFirstMicroStepForChapter` for jumps from
 * the review screen / debug. Returns the first step in the chapter that
 * survives both tier and conditional filters.
 */
export function getFirstMicroStepForChapterInFlow(
  chapterIndex: number,
  form: IdentityKitForm,
): MicroStep | undefined {
  return getMicroStepsForFlow(form).find((step) => step.chapterIndex === chapterIndex)
}
