import type { IdentityKitForm, StepErrors } from '../types'
import type { MicroStep } from '../data/microStepSchema'
import { STEP1_OTHER_OPTION_ID } from '../data/step1ControlledOptions'

type ValidationRule = (form: IdentityKitForm) => StepErrors

const required = (value: string) => (value.trim() ? '' : 'This helps us shape your kit.')
const requiredWhenOther = (selectedId: string, value?: string) =>
  selectedId === STEP1_OTHER_OPTION_ID ? required(value ?? '') : ''

function mergeErrors(...errorSets: StepErrors[]): StepErrors {
  return Object.fromEntries(
    errorSets.flatMap((errors) => Object.entries(errors)).filter(([, value]) => Boolean(value)),
  ) as StepErrors
}

const RULES: Record<string, ValidationRule> = {
  validateC0S1: (form) => ({
    tier: form.tier ? '' : 'Choose Core or Pro to continue.',
  }),
  validateC1S1: (form) => ({
    'step1.businessName': required(form.step1.businessName),
  }),
  validateC1S2: (form) => ({
    'step1.industry': required(form.step1.industry),
    'step1.stage': required(form.step1.stage),
  }),
  validateC1S3: (form) => ({
    'step1.brandNarrator': required(form.step1.brandNarrator),
  }),
  validateC1S4OfferSentence: (form) =>
    mergeErrors(
      {
        'step1.offer.offerId': required(form.step1.offer.offerId),
        'step1.offer.offerOther': requiredWhenOther(form.step1.offer.offerId, form.step1.offer.offerOther),
      },
      {
        'step1.offer.audienceId': required(form.step1.offer.audienceId),
        'step1.offer.audienceOther': requiredWhenOther(form.step1.offer.audienceId, form.step1.offer.audienceOther),
      },
      {
        'step1.offer.deliveryOther': requiredWhenOther(
          form.step1.offer.deliveryId ?? '',
          form.step1.offer.deliveryOther,
        ),
      },
    ),
  validateC1S5TransformationSentence: (form) =>
    mergeErrors(
      {
        'step1.offer.audienceId': required(form.step1.offer.audienceId),
        'step1.offer.audienceOther': requiredWhenOther(form.step1.offer.audienceId, form.step1.offer.audienceOther),
      },
      {
        'step1.transformation.beforeId': required(form.step1.transformation.beforeId),
        'step1.transformation.beforeOther': requiredWhenOther(
          form.step1.transformation.beforeId,
          form.step1.transformation.beforeOther,
        ),
      },
      {
        'step1.transformation.afterId': required(form.step1.transformation.afterId),
        'step1.transformation.afterOther': requiredWhenOther(
          form.step1.transformation.afterId,
          form.step1.transformation.afterOther,
        ),
      },
      {
        'step1.transformation.mechanismId': required(form.step1.transformation.mechanismId),
        'step1.transformation.mechanismOther': requiredWhenOther(
          form.step1.transformation.mechanismId,
          form.step1.transformation.mechanismOther,
        ),
      },
    ),
  validateC2S1: (form) => ({
    'step2.customerArchetype': required(form.step2.customerArchetype),
  }),
  validateC2ProPainOrOutcomes: (form) => {
    if (form.step2.painPoints?.trim() || form.step2.desiredOutcomes?.trim()) return {} as StepErrors
    return {
      'step2.painPoints': 'Add pain points or desired outcomes for stronger personalization.',
      'step2.desiredOutcomes': 'Add pain points or desired outcomes for stronger personalization.',
    }
  },
  validateC3S1: (form) => ({
    'step3.tonePreset': required(form.step3.tonePreset),
  }),
  validateC3S2: () => ({}),
  validateC3S3: () => ({}),
  validateC3S4: () => ({}),
  validateC4S1: (form) => ({
    'step4.values': form.step4.values.length >= 2 ? '' : 'Select at least two values to guide the kit.',
  }),
  validateC4S2: () => ({}),
  validateC5S1: (form) => ({
    'step5.originArchetype': required(form.step5.originArchetype),
  }),
  validateC5S2: () => ({}),
  validateC5S3: () => ({}),
  validateC6S1: (form) => ({
    'step6.selectedPalette': required(form.step6.selectedPalette),
  }),
  validateC6S2: (form) => ({
    'step6.selectedStyle': required(form.step6.selectedStyle),
  }),
  validateC6S3: () => ({}),
  validateC6S4: () => ({}),
  validateC6S5: () => ({}),
  validateC6S6: () => ({}),
  validateC7S1: () => ({}),
  validateC7S2: (form) => ({
    'step7.differentiation': required(form.step7.differentiation ?? ''),
  }),
}

export function getValidationErrorsForRuleRef(
  form: IdentityKitForm,
  validationRuleRef: string,
): StepErrors {
  const validator = RULES[validationRuleRef]
  if (!validator) return {}
  return mergeErrors(validator(form))
}

export function getMicroStepValidationErrors(
  form: IdentityKitForm,
  microStep: MicroStep | undefined,
): StepErrors {
  if (!microStep) return {}
  return mergeErrors(
    ...microStep.fields.map((field) => getValidationErrorsForRuleRef(form, field.validationRuleRef)),
  )
}

export function isMicroStepValid(form: IdentityKitForm, microStep: MicroStep | undefined): boolean {
  return Object.keys(getMicroStepValidationErrors(form, microStep)).length === 0
}
