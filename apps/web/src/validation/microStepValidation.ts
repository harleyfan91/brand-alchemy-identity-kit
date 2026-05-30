import type { IdentityKitForm, StepErrors } from '../types'
import type { MicroStep } from '../data/microStepSchema'
import { STEP1_OTHER_OPTION_ID } from '../data/step1ControlledOptions'
import { normalizeTouchpoints } from '../types'

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
  validateC1S1: (form) => {
    const errors: StepErrors = {
      'step1.businessName': required(form.step1.businessName),
    }
    const website = form.step1.businessWebsite?.trim()
    if (website) {
      try {
        const candidate =
          website.startsWith('http://') || website.startsWith('https://')
            ? website
            : `https://${website}`
        void new URL(candidate)
      } catch {
        errors['step1.businessWebsite'] = 'Use a valid URL (e.g. example.com).'
      }
    }
    return errors
  },
  validateC1S2: (form) => ({
    'step1.industry': required(form.step1.industry),
    'step1.stage': required(form.step1.stage),
    'step1.businessOperatingModel': required(form.step1.businessOperatingModel ?? ''),
  }),
  validateC1S3: (form) => ({
    'step1.brandNarrator': required(form.step1.brandNarrator),
  }),
  validateC1S4: (form) => {
    const rawTouchpoints = (form.step1.touchpoints as unknown as string[] | undefined) ?? []
    const touchpoints = normalizeTouchpoints(rawTouchpoints)
    return {
      'step1.touchpoints':
        touchpoints.length === 0
          ? 'Pick at least one touchpoint.'
          : rawTouchpoints.length > 4
            ? 'Choose up to 4 touchpoints.'
            : '',
      'step1.primaryGoal': required(form.step1.primaryGoal),
      'step1.guideFocus': required(form.step1.guideFocus ?? ''),
    }
  },
  validateC1S5OfferSentence: (form) =>
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
  validateC1S6TransformationSentence: (form) =>
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
  validateC6S4Gate: (form) => ({
    'step6.hasExistingBrand':
      typeof form.step6.hasExistingBrand === 'boolean'
        ? ''
        : 'Let us know if you have any visual material to share.',
  }),
  validateC6Eb1LogoUpload: () => ({}),
  validateC6Eb2ReferenceImage: () => ({}),
  validateC6Eb3HexColors: (form) => {
    const colors = form.step6.existingBrand?.hexColors ?? []
    if (colors.length === 0) return {} as StepErrors
    const invalid = colors.find((c) => !isValidHex(c))
    return invalid
      ? ({
          'step6.existingBrand.hexColors': 'Use 3- or 6-character hex codes (e.g. #A37BFF).',
        } as StepErrors)
      : ({} as StepErrors)
  },
  validateC6S5MoodAdjectives: () => ({}),
  validateC6S5bPhotoColorRelationship: () => ({}),
  validateC6S6VisualNotes: () => ({}),
  validateC7S1: () => ({}),
  validateC7S2: () => ({}),
  validateC1S7: () => ({}),
  validateC3S3VoiceSamples: () => ({}),
}

const HEX_PATTERN = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/
function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value.trim())
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
