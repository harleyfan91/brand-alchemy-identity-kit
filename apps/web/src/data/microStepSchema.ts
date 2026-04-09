import type { Tier } from '../types'

/**
 * Canonical micro-step configuration for the intake wizard.
 *
 * Source of truth for chapter / micro-step breakdown: `INTAKE_UX_REFACTOR.md` (Proposed Mobile-First Screen Map).
 *
 * `microStepTotal` is the count of all micro-step rows defined for that chapter in this schema (Pro-inclusive).
 * For Core-only progress denominators, filter with `tier === 'both' || tier === 'core'` (see `getMicroStepsForTier`).
 *
 * Not wired into `useFlowState` or UI yet — data layer only.
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
        key: 'step1.offer.offerId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S4OfferSentence',
      },
      {
        key: 'step1.offer.offerOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S4OfferSentence',
      },
      {
        key: 'step1.offer.audienceId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S4OfferSentence',
      },
      {
        key: 'step1.offer.audienceOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S4OfferSentence',
      },
      {
        key: 'step1.offer.deliveryId',
        required: false,
        inputType: 'choices',
        validationRuleRef: 'validateC1S4OfferSentence',
      },
      {
        key: 'step1.offer.deliveryOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S4OfferSentence',
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
        key: 'step1.offer.audienceId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.offer.audienceOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.beforeId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.beforeOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.afterId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.afterOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.mechanismId',
        required: true,
        inputType: 'choices',
        validationRuleRef: 'validateC1S5TransformationSentence',
      },
      {
        key: 'step1.transformation.mechanismOther',
        required: false,
        inputType: 'text',
        validationRuleRef: 'validateC1S5TransformationSentence',
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

const CHAPTER_6: MicroStep[] = [
  {
    id: 'c6_s1',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 1,
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
    microStepIndex: 2,
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
    id: 'c6_s3',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 3,
    microStepTotal: 0,
    tier: 'both',
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
    id: 'c6_s4',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 4,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.referenceUploadName',
        required: false,
        inputType: 'upload',
        validationRuleRef: 'validateC6S4',
      },
    ],
  },
  {
    id: 'c6_s5',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 5,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.colorMoodNotes',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC6S5',
      },
    ],
  },
  {
    id: 'c6_s6',
    chapterIndex: 6,
    chapterLabel: 'Visual Direction',
    microStepIndex: 6,
    microStepTotal: 0,
    tier: 'pro',
    fields: [
      {
        key: 'step6.styleNotes',
        required: false,
        inputType: 'textarea',
        validationRuleRef: 'validateC6S6',
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
        required: true,
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

export function getMicroStepsForTier(tier: Tier | null): MicroStep[] {
  return MICRO_STEP_SCHEMA.filter((step) => isMicroStepVisibleForTier(step, tier))
}

export function getFirstMicroStepForChapter(
  chapterIndex: number,
  tier: Tier | null,
): MicroStep | undefined {
  return getMicroStepsForTier(tier).find((step) => step.chapterIndex === chapterIndex)
}
