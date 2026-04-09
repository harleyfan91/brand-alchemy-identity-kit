import type { Step1Offer, Step1Transformation } from './form.js'
import { getStep1ControlledOptions, resolveControlledOptionLabel } from './step1ControlledOptions.js'

function clean(value?: string): string {
  return value?.trim().replace(/\s+/g, ' ') ?? ''
}

export function resolveOfferSelections(
  offer: Step1Offer,
  industry: string,
): { offerLabel: string; audienceLabel: string; deliveryLabel: string } {
  const options = getStep1ControlledOptions(industry)
  return {
    offerLabel: resolveControlledOptionLabel(options.offer, offer.offerId, offer.offerOther),
    audienceLabel: resolveControlledOptionLabel(options.audience, offer.audienceId, offer.audienceOther),
    deliveryLabel: resolveControlledOptionLabel(options.delivery, offer.deliveryId ?? '', offer.deliveryOther),
  }
}

export function resolveTransformationSelections(
  transformation: Step1Transformation,
  industry: string,
): { beforeLabel: string; afterLabel: string; mechanismLabel: string } {
  const options = getStep1ControlledOptions(industry)
  return {
    beforeLabel: resolveControlledOptionLabel(options.before, transformation.beforeId, transformation.beforeOther),
    afterLabel: resolveControlledOptionLabel(options.after, transformation.afterId, transformation.afterOther),
    mechanismLabel: resolveControlledOptionLabel(
      options.mechanism,
      transformation.mechanismId,
      transformation.mechanismOther,
    ),
  }
}

export function assembleOfferLine(offer: Step1Offer, industry: string): string {
  const { offerLabel, audienceLabel, deliveryLabel } = resolveOfferSelections(offer, industry)

  const base =
    offerLabel && audienceLabel ? `${offerLabel} for ${audienceLabel}` : clean(offerLabel) || clean(audienceLabel)
  if (!base) return ''
  return deliveryLabel ? `${base} through ${deliveryLabel}` : base
}

export function assembleTransformationLine(transformation: Step1Transformation, industry: string): string {
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(transformation, industry)
  const beforeState = clean(beforeLabel)
  const afterState = clean(afterLabel)
  const mechanism = clean(mechanismLabel)

  if (beforeState && afterState && mechanism) {
    return `Moves customers from ${beforeState} to ${afterState} through ${mechanism}.`
  }
  if (beforeState && afterState) {
    return `Moves customers from ${beforeState} to ${afterState}.`
  }
  if (afterState && mechanism) {
    return `Helps customers get to ${afterState} through ${mechanism}.`
  }
  if (afterState) {
    return `Helps customers get to ${afterState}.`
  }
  if (mechanism) {
    return `Helps customers through ${mechanism}.`
  }
  return ''
}

export function assembleTransformationMovement(transformation: Step1Transformation, industry: string): string {
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(transformation, industry)
  const beforeState = clean(beforeLabel)
  const afterState = clean(afterLabel)
  const mechanism = clean(mechanismLabel)

  if (beforeState && afterState && mechanism) {
    return `move from ${beforeState} to ${afterState} through ${mechanism}`
  }
  if (beforeState && afterState) {
    return `move from ${beforeState} to ${afterState}`
  }
  if (afterState && mechanism) {
    return `get to ${afterState} through ${mechanism}`
  }
  if (afterState) {
    return `get to ${afterState}`
  }
  if (mechanism) {
    return `work through ${mechanism}`
  }
  return 'make progress'
}
