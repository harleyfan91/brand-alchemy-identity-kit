import type { IdentityKitForm } from '../types'
import { getStep1ControlledOptions, resolveControlledOptionLabel } from '../data/step1ControlledOptions'

function clean(value?: string): string {
  return value?.trim().replace(/\s+/g, ' ') ?? ''
}

export function resolveOfferSelections(form: IdentityKitForm): {
  offerLabel: string
  audienceLabel: string
  deliveryLabel: string
} {
  const options = getStep1ControlledOptions(form.step1.industry)
  return {
    offerLabel: resolveControlledOptionLabel(options.offer, form.step1.offer.offerId, form.step1.offer.offerOther),
    audienceLabel: resolveControlledOptionLabel(
      options.audience,
      form.step1.offer.audienceId,
      form.step1.offer.audienceOther,
    ),
    deliveryLabel: resolveControlledOptionLabel(
      options.delivery,
      form.step1.offer.deliveryId ?? '',
      form.step1.offer.deliveryOther,
    ),
  }
}

export function resolveTransformationSelections(form: IdentityKitForm): {
  beforeLabel: string
  afterLabel: string
  mechanismLabel: string
} {
  const options = getStep1ControlledOptions(form.step1.industry)
  return {
    beforeLabel: resolveControlledOptionLabel(
      options.before,
      form.step1.transformation.beforeId,
      form.step1.transformation.beforeOther,
    ),
    afterLabel: resolveControlledOptionLabel(
      options.after,
      form.step1.transformation.afterId,
      form.step1.transformation.afterOther,
    ),
    mechanismLabel: resolveControlledOptionLabel(
      options.mechanism,
      form.step1.transformation.mechanismId,
      form.step1.transformation.mechanismOther,
    ),
  }
}

export function assembleOfferLine(form: IdentityKitForm): string {
  const { offerLabel, audienceLabel, deliveryLabel } = resolveOfferSelections(form)
  const base =
    clean(offerLabel) && clean(audienceLabel) ? `${offerLabel} for ${audienceLabel}` : clean(offerLabel) || clean(audienceLabel)
  if (!base) return ''
  return deliveryLabel ? `${base} through ${deliveryLabel}` : base
}

export function assembleTransformationLine(form: IdentityKitForm): string {
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(form)

  if (beforeLabel && afterLabel && mechanismLabel) {
    return `Moves customers from ${beforeLabel} to ${afterLabel} through ${mechanismLabel}.`
  }
  if (beforeLabel && afterLabel) {
    return `Moves customers from ${beforeLabel} to ${afterLabel}.`
  }
  if (afterLabel && mechanismLabel) {
    return `Helps customers get to ${afterLabel} through ${mechanismLabel}.`
  }
  if (afterLabel) {
    return `Helps customers get to ${afterLabel}.`
  }
  if (mechanismLabel) {
    return `Helps customers through ${mechanismLabel}.`
  }
  return ''
}

export function offerPreviewSentence(form: IdentityKitForm, includeDeliverySlot = true): string {
  const { offerLabel, audienceLabel, deliveryLabel } = resolveOfferSelections(form)
  const offer = offerLabel || '[main offer]'
  const audience = audienceLabel || '[audience]'

  if (includeDeliverySlot) {
    const delivery = deliveryLabel || '[delivery]'
    return `We provide ${offer} for ${audience} through ${delivery}.`
  }

  return deliveryLabel
    ? `We provide ${offer} for ${audience} through ${deliveryLabel}.`
    : `We provide ${offer} for ${audience}.`
}

export function transformationPreviewSentence(form: IdentityKitForm): string {
  const { audienceLabel } = resolveOfferSelections(form)
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(form)
  const audience = audienceLabel || '[audience]'
  const before = beforeLabel || '[before]'
  const after = afterLabel || '[after]'
  const mechanism = mechanismLabel || '[mechanism]'
  return `We help ${audience} go from ${before} to ${after} through ${mechanism}.`
}
