import type { IdentityKitForm, Step1Offer, Step1Transformation } from '../types'

const emptyOffer = (): Step1Offer => ({
  offerId: '',
  offerOther: '',
  audienceId: '',
  audienceOther: '',
  deliveryId: '',
  deliveryOther: '',
})

const emptyTransformation = (): Step1Transformation => ({
  beforeId: '',
  beforeOther: '',
  afterId: '',
  afterOther: '',
  mechanismId: '',
  mechanismOther: '',
})

function offerHasData(offer: Step1Offer): boolean {
  return Boolean(
    offer.offerId ||
      offer.offerOther?.trim() ||
      offer.audienceId ||
      offer.audienceOther?.trim() ||
      offer.deliveryId ||
      offer.deliveryOther?.trim(),
  )
}

function transformationHasData(transformation: Step1Transformation): boolean {
  return Boolean(
    transformation.beforeId ||
      transformation.beforeOther?.trim() ||
      transformation.afterId ||
      transformation.afterOther?.trim() ||
      transformation.mechanismId ||
      transformation.mechanismOther?.trim(),
  )
}

export function applyStep1ScalarField(
  step1: IdentityKitForm['step1'],
  field: 'businessName' | 'industry' | 'stage' | 'businessOperatingModel',
  value: string,
): IdentityKitForm['step1'] {
  if (field !== 'industry') {
    return { ...step1, [field]: value }
  }

  if (step1.industry === value) {
    return step1
  }

  const next = { ...step1, industry: value }
  if (!offerHasData(step1.offer) && !transformationHasData(step1.transformation)) {
    return next
  }

  return {
    ...next,
    offer: emptyOffer(),
    transformation: emptyTransformation(),
  }
}
