import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import type { IdentityKitForm, Step1Offer, Step1Transformation, StepErrors } from '../../types'
import {
  STEP1_DELIVERY_WHEEL_SKIP_ID,
  STEP1_OTHER_OPTION_ID,
  STEP1_WHEEL_PLACEHOLDER_ID,
  type Step1ControlledOption,
  getStep1ControlledOptions,
  resolveControlledOptionLabel,
} from '../../data/step1ControlledOptions'
import type { Step1UxVariant } from '../../config/step1UxVariants'
import { Button } from '../ui/Button'
import { InputField } from '../ui/InputField'
import { SlotScrollWheel, type CenteredDescriptionPayload } from '../ui/SlotScrollWheel'

const STORAGE_OFFER_DELIVERY_SKIP = 'identityKit:step1:offerDeliverySkipDone'

/** Progressive step: sentence reads as page copy; picker row carries the single “tile”. */
const progressiveLayout = {
  sentenceStripSticky: 'sticky top-0 z-20 mx-auto w-full max-w-lg bg-gray-50/95 pb-2 backdrop-blur-sm',
  sentenceStripInline: 'mx-auto w-full max-w-lg',
  sentenceEyebrow: 'mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400',
  sentenceBody:
    'text-pretty text-center font-serif text-base leading-relaxed text-gray-900 [overflow-wrap:anywhere] sm:text-lg',
  /** Wheel + slot label — compact padding, clear affordance without bulking the sentence. */
  pickerRow:
    'flex w-full max-w-md flex-row flex-wrap items-center justify-center gap-2 rounded-xl border border-gray-200/90 bg-white px-3 py-2 shadow-sm sm:gap-3',
  helperRow: 'flex min-h-[3.25rem] w-full max-w-lg flex-col items-center justify-center gap-0 px-2 py-0.5',
  helperText: 'line-clamp-3 text-pretty text-center text-sm leading-relaxed text-gray-600 transition-opacity duration-200',
  helperTextStatic:
    'line-clamp-2 text-pretty text-center text-xs font-medium uppercase tracking-[0.12em] text-gray-500 transition-opacity duration-200',
} as const

const OTHER_FIELD_CLOSE_MS = 300

/**
 * Expands/collapses optional “Other” inputs without reserving empty space.
 * Stashes last child while closing so height can animate smoothly.
 */
function CollapsibleOtherFieldSlot({ open, children }: { open: boolean; children: ReactNode }) {
  const [stash, setStash] = useState<ReactNode>(null)

  useLayoutEffect(() => {
    if (open && children != null) setStash(children)
  }, [open, children])

  useEffect(() => {
    if (open) return
    const id = window.setTimeout(() => setStash(null), OTHER_FIELD_CLOSE_MS)
    return () => window.clearTimeout(id)
  }, [open])

  return (
    <div
      className="grid w-full max-w-lg transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
    >
      <div className="min-h-0 overflow-hidden">
        {stash ? (
          <div
            className={`transition-opacity duration-200 ease-out motion-reduce:transition-none ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {stash}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function readDeliverySkipStored(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_OFFER_DELIVERY_SKIP) === '1'
  } catch {
    return false
  }
}

function writeDeliverySkipStored(done: boolean) {
  try {
    if (done) sessionStorage.setItem(STORAGE_OFFER_DELIVERY_SKIP, '1')
    else sessionStorage.removeItem(STORAGE_OFFER_DELIVERY_SKIP)
  } catch {
    /* ignore */
  }
}

function mergeWheelHint(
  prev: { source: string; text: string } | null,
  wheelId: string,
  description: string | null,
): { source: string; text: string } | null {
  if (description != null && description.trim() !== '') {
    return { source: wheelId, text: description.trim() }
  }
  if (prev?.source === wheelId) return null
  return prev
}

type OfferFocus = 0 | 1 | 2 | null

interface ProgressiveOfferSentenceProps {
  form: IdentityKitForm
  errors: StepErrors
  onOfferChange: (field: keyof Step1Offer, value: string) => void
  industrySyncKey: string
  uxVariant: Step1UxVariant
  offerWheelOptions: Step1ControlledOption[]
  audienceWheelOptions: Step1ControlledOption[]
  deliveryWheelOptions: Step1ControlledOption[]
}

export function ProgressiveOfferSentence({
  form,
  errors,
  onOfferChange,
  industrySyncKey,
  uxVariant,
  offerWheelOptions,
  audienceWheelOptions,
  deliveryWheelOptions,
}: ProgressiveOfferSentenceProps) {
  const controlled = useMemo(() => getStep1ControlledOptions(form.step1.industry), [form.step1.industry])

  const [focusSlot, setFocusSlot] = useState<OfferFocus>(() => inferOfferFocus(form.step1.offer))
  const [draftOfferId, setDraftOfferId] = useState(() => form.step1.offer.offerId || '')
  const [draftOfferOther, setDraftOfferOther] = useState(() => form.step1.offer.offerOther ?? '')
  const [draftAudienceId, setDraftAudienceId] = useState(() => form.step1.offer.audienceId || '')
  const [draftAudienceOther, setDraftAudienceOther] = useState(() => form.step1.offer.audienceOther ?? '')
  const [draftDeliveryId, setDraftDeliveryId] = useState(() =>
    form.step1.offer.deliveryId?.trim() ? form.step1.offer.deliveryId : STEP1_DELIVERY_WHEEL_SKIP_ID,
  )
  const [draftDeliveryOther, setDraftDeliveryOther] = useState(() => form.step1.offer.deliveryOther ?? '')

  const [wheelHint, setWheelHint] = useState<{ source: string; text: string } | null>(null)
  const onWheelDescription = useCallback((payload: CenteredDescriptionPayload) => {
    setWheelHint((prev) => mergeWheelHint(prev, payload.wheelId, payload.description))
  }, [])

  const industry = form.step1.industry
  const prevIndustryRef = useRef(industry)
  useEffect(() => {
    if (prevIndustryRef.current !== industry) {
      writeDeliverySkipStored(false)
      prevIndustryRef.current = industry
    }
  }, [industry])

  useEffect(() => {
    setWheelHint(null)
  }, [focusSlot])

  useEffect(() => {
    const o = form.step1.offer
    if (focusSlot === 0) {
      setDraftOfferId(o.offerId || '')
      setDraftOfferOther(o.offerOther ?? '')
    } else if (focusSlot === 1) {
      setDraftAudienceId(o.audienceId || '')
      setDraftAudienceOther(o.audienceOther ?? '')
    } else if (focusSlot === 2) {
      setDraftDeliveryId(o.deliveryId?.trim() ? o.deliveryId : STEP1_DELIVERY_WHEEL_SKIP_ID)
      setDraftDeliveryOther(o.deliveryOther ?? '')
    }
  }, [focusSlot, form.step1.offer])

  const offerWheelValue = draftOfferId || STEP1_WHEEL_PLACEHOLDER_ID
  const audienceWheelValue = draftAudienceId || STEP1_WHEEL_PLACEHOLDER_ID
  const deliveryWheelValue = draftDeliveryId || STEP1_DELIVERY_WHEEL_SKIP_ID

  const canConfirmOffer =
    draftOfferId &&
    draftOfferId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftOfferId !== STEP1_OTHER_OPTION_ID || Boolean(draftOfferOther.trim()))

  const canConfirmAudience =
    draftAudienceId &&
    draftAudienceId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftAudienceId !== STEP1_OTHER_OPTION_ID || Boolean(draftAudienceOther.trim()))

  const canConfirmDelivery =
    draftDeliveryId &&
    (draftDeliveryId === STEP1_DELIVERY_WHEEL_SKIP_ID ||
      (draftDeliveryId !== STEP1_WHEEL_PLACEHOLDER_ID &&
        (draftDeliveryId !== STEP1_OTHER_OPTION_ID || Boolean(draftDeliveryOther.trim()))))

  const confirmDisabled =
    focusSlot === 0 ? !canConfirmOffer : focusSlot === 1 ? !canConfirmAudience : focusSlot === 2 ? !canConfirmDelivery : true

  const confirmCurrent = () => {
    if (focusSlot === 0) {
      onOfferChange('offerId', draftOfferId)
      onOfferChange('offerOther', draftOfferOther)
      setFocusSlot(1)
    } else if (focusSlot === 1) {
      onOfferChange('audienceId', draftAudienceId)
      onOfferChange('audienceOther', draftAudienceOther)
      setFocusSlot(2)
    } else if (focusSlot === 2) {
      if (draftDeliveryId === STEP1_DELIVERY_WHEEL_SKIP_ID) {
        onOfferChange('deliveryId', '')
        onOfferChange('deliveryOther', '')
        writeDeliverySkipStored(true)
      } else {
        onOfferChange('deliveryId', draftDeliveryId)
        onOfferChange('deliveryOther', draftDeliveryOther)
        writeDeliverySkipStored(false)
      }
      setFocusSlot(null)
    }
  }

  const openSlot = (slot: 0 | 1 | 2) => {
    setFocusSlot(slot)
  }

  const livingPreview = useMemo(() => {
    const o = form.step1.offer
    const parts: { key: string; slot: 0 | 1 | 2; label: string }[] = []

    const offerLabel =
      focusSlot === 0
        ? resolveControlledOptionLabel(controlled.offer, draftOfferId, draftOfferOther)
        : resolveControlledOptionLabel(controlled.offer, o.offerId, o.offerOther)
    if (offerLabel.trim()) {
      parts.push({ key: 'o', slot: 0, label: offerLabel })
    }

    const audLabel =
      focusSlot === 1
        ? resolveControlledOptionLabel(controlled.audience, draftAudienceId, draftAudienceOther)
        : resolveControlledOptionLabel(controlled.audience, o.audienceId, o.audienceOther)
    if (audLabel.trim()) {
      parts.push({ key: 'a', slot: 1, label: audLabel })
    }

    const delLabel =
      focusSlot === 2
        ? draftDeliveryId === STEP1_DELIVERY_WHEEL_SKIP_ID
          ? ''
          : resolveControlledOptionLabel(controlled.delivery, draftDeliveryId, draftDeliveryOther)
        : resolveControlledOptionLabel(controlled.delivery, o.deliveryId ?? '', o.deliveryOther)
    if (delLabel.trim()) {
      parts.push({ key: 'd', slot: 2, label: delLabel })
    }

    return parts
  }, [
    controlled,
    draftAudienceId,
    draftAudienceOther,
    draftDeliveryId,
    draftDeliveryOther,
    draftOfferId,
    draftOfferOther,
    focusSlot,
    form.step1.offer,
  ])

  const sentenceStripClass =
    uxVariant.helperMode === 'sticky'
      ? progressiveLayout.sentenceStripSticky
      : progressiveLayout.sentenceStripInline

  const slotLabels = ['We provide', 'for', 'through'] as const

  const showOtherOffer = draftOfferId === STEP1_OTHER_OPTION_ID
  const showOtherAudience = draftAudienceId === STEP1_OTHER_OPTION_ID
  const showOtherDelivery = draftDeliveryId === STEP1_OTHER_OPTION_ID
  const showOtherField =
    (focusSlot === 0 && showOtherOffer) ||
    (focusSlot === 1 && showOtherAudience) ||
    (focusSlot === 2 && showOtherDelivery)

  return (
    <div className="space-y-4">
      <div className={sentenceStripClass}>
        <p className={progressiveLayout.sentenceEyebrow}>Your sentence</p>
        <p className={progressiveLayout.sentenceBody}>
          {livingPreview.length === 0 ? (
            <span className="text-gray-400">Start below — each part locks in when you confirm.</span>
          ) : (
            <>
              <span className="font-sans font-medium text-gray-700">We provide </span>
              {livingPreview[0] ? (
                <button
                  type="button"
                  className="rounded-sm font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                  onClick={() => openSlot(0)}
                >
                  {livingPreview[0].label}
                </button>
              ) : (
                <span className="text-gray-400">…</span>
              )}
              {livingPreview[1] ? (
                <>
                  <span className="font-sans font-medium text-gray-700"> for </span>
                  <button
                    type="button"
                    className="rounded-sm font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                    onClick={() => openSlot(1)}
                  >
                    {livingPreview[1].label}
                  </button>
                </>
              ) : null}
              {livingPreview[2] ? (
                <>
                  <span className="font-sans font-medium text-gray-700"> through </span>
                  <button
                    type="button"
                    className="rounded-sm font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                    onClick={() => openSlot(2)}
                  >
                    {livingPreview[2].label}
                  </button>
                </>
              ) : null}
              .
            </>
          )}
        </p>
      </div>

      {focusSlot !== null ? (
        <div className="space-y-3">
          <div className="flex flex-col items-center gap-3">
            <div className={progressiveLayout.pickerRow}>
              <span className="shrink-0 font-sans text-base font-medium text-gray-900 sm:text-lg">{slotLabels[focusSlot]}</span>
              <SlotScrollWheel
                instanceId={
                  focusSlot === 0 ? 'offer' : focusSlot === 1 ? 'audience' : 'delivery'
                }
                syncKey={`${industrySyncKey}-p${focusSlot}`}
                options={
                  focusSlot === 0
                    ? offerWheelOptions
                    : focusSlot === 1
                      ? audienceWheelOptions
                      : deliveryWheelOptions
                }
                value={
                  focusSlot === 0
                    ? offerWheelValue
                    : focusSlot === 1
                      ? audienceWheelValue
                      : deliveryWheelValue
                }
                onChange={(id) => {
                  if (focusSlot === 0) {
                    setDraftOfferId(id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)
                  } else if (focusSlot === 1) {
                    setDraftAudienceId(id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)
                  } else {
                    if (id === STEP1_DELIVERY_WHEEL_SKIP_ID) {
                      setDraftDeliveryId(STEP1_DELIVERY_WHEEL_SKIP_ID)
                      setDraftDeliveryOther('')
                    } else {
                      setDraftDeliveryId(id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)
                    }
                  }
                }}
                ariaLabel={
                  focusSlot === 0 ? 'Main offer' : focusSlot === 1 ? 'Who it is for' : 'How it is delivered'
                }
                error={
                  focusSlot === 0
                    ? errors['step1.offer.offerId']
                    : focusSlot === 1
                      ? errors['step1.offer.audienceId']
                      : errors['step1.offer.deliveryOther']
                }
                onCenteredDescriptionChange={onWheelDescription}
                density={uxVariant.wheelDensity}
                typeface={uxVariant.wheelTypeface}
              />
            </div>

            <CollapsibleOtherFieldSlot open={showOtherField}>
              {focusSlot === 0 && showOtherOffer ? (
                <InputField
                  id="offerOtherProg"
                  label="Your offer in a few words"
                  value={draftOfferOther}
                  onChange={setDraftOfferOther}
                  placeholder="e.g. fractional CMO support"
                  maxLength={80}
                  error={errors['step1.offer.offerOther']}
                />
              ) : focusSlot === 1 && showOtherAudience ? (
                <InputField
                  id="audienceOtherProg"
                  label="Who this is mainly for"
                  value={draftAudienceOther}
                  onChange={setDraftAudienceOther}
                  placeholder="e.g. postpartum moms returning to training"
                  maxLength={80}
                  error={errors['step1.offer.audienceOther']}
                />
              ) : focusSlot === 2 && showOtherDelivery ? (
                <InputField
                  id="deliveryOtherProg"
                  label="How this is delivered"
                  value={draftDeliveryOther}
                  onChange={setDraftDeliveryOther}
                  placeholder="e.g. weekly voice-note check-ins"
                  maxLength={80}
                  error={errors['step1.offer.deliveryOther']}
                />
              ) : null}
            </CollapsibleOtherFieldSlot>

            <div className={progressiveLayout.helperRow} aria-live="polite" aria-relevant="text">
              {wheelHint?.text ? (
                <p className={progressiveLayout.helperText}>{wheelHint.text}</p>
              ) : (
                <span className="sr-only">No option description for the current selection.</span>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              fullWidth
              className="max-w-sm"
              disabled={confirmDisabled}
              onClick={confirmCurrent}
            >
              Confirm →
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Tap any phrase above to edit, or continue to the next step.</p>
      )}
    </div>
  )
}

function inferOfferFocus(offer: Step1Offer): OfferFocus {
  if (!offer.offerId?.trim()) return 0
  if (!offer.audienceId?.trim()) return 1
  if (!offer.deliveryId?.trim()) {
    if (readDeliverySkipStored()) return null
    return 2
  }
  return null
}

// --- Transformation (4 slots) ---

type XformFocus = 0 | 1 | 2 | 3 | null

interface ProgressiveTransformationSentenceProps {
  form: IdentityKitForm
  errors: StepErrors
  onOfferChange: (field: keyof Step1Offer, value: string) => void
  onTransformationChange: (field: keyof Step1Transformation, value: string) => void
  industrySyncKey: string
  uxVariant: Step1UxVariant
  audienceWheelOptions: Step1ControlledOption[]
  beforeWheelOptions: Step1ControlledOption[]
  afterWheelOptions: Step1ControlledOption[]
  mechanismWheelOptions: Step1ControlledOption[]
}

export function ProgressiveTransformationSentence({
  form,
  errors,
  onOfferChange,
  onTransformationChange,
  industrySyncKey,
  uxVariant,
  audienceWheelOptions,
  beforeWheelOptions,
  afterWheelOptions,
  mechanismWheelOptions,
}: ProgressiveTransformationSentenceProps) {
  const controlled = useMemo(() => getStep1ControlledOptions(form.step1.industry), [form.step1.industry])

  const [focusSlot, setFocusSlot] = useState<XformFocus>(() => inferXformFocus(form.step1.offer, form.step1.transformation))
  const [draftAudienceId, setDraftAudienceId] = useState(() => form.step1.offer.audienceId || '')
  const [draftAudienceOther, setDraftAudienceOther] = useState(() => form.step1.offer.audienceOther ?? '')
  const [draftBeforeId, setDraftBeforeId] = useState(() => form.step1.transformation.beforeId || '')
  const [draftBeforeOther, setDraftBeforeOther] = useState(() => form.step1.transformation.beforeOther ?? '')
  const [draftAfterId, setDraftAfterId] = useState(() => form.step1.transformation.afterId || '')
  const [draftAfterOther, setDraftAfterOther] = useState(() => form.step1.transformation.afterOther ?? '')
  const [draftMechanismId, setDraftMechanismId] = useState(() => form.step1.transformation.mechanismId || '')
  const [draftMechanismOther, setDraftMechanismOther] = useState(() => form.step1.transformation.mechanismOther ?? '')

  const [wheelHint, setWheelHint] = useState<{ source: string; text: string } | null>(null)
  const onWheelDescription = useCallback((payload: CenteredDescriptionPayload) => {
    setWheelHint((prev) => mergeWheelHint(prev, payload.wheelId, payload.description))
  }, [])

  useEffect(() => {
    setWheelHint(null)
  }, [focusSlot])

  useEffect(() => {
    const o = form.step1.offer
    const t = form.step1.transformation
    if (focusSlot === 0) {
      setDraftAudienceId(o.audienceId || '')
      setDraftAudienceOther(o.audienceOther ?? '')
    } else if (focusSlot === 1) {
      setDraftBeforeId(t.beforeId || '')
      setDraftBeforeOther(t.beforeOther ?? '')
    } else if (focusSlot === 2) {
      setDraftAfterId(t.afterId || '')
      setDraftAfterOther(t.afterOther ?? '')
    } else if (focusSlot === 3) {
      setDraftMechanismId(t.mechanismId || '')
      setDraftMechanismOther(t.mechanismOther ?? '')
    }
  }, [focusSlot, form.step1.offer, form.step1.transformation])

  const audVal = draftAudienceId || STEP1_WHEEL_PLACEHOLDER_ID
  const beforeVal = draftBeforeId || STEP1_WHEEL_PLACEHOLDER_ID
  const afterVal = draftAfterId || STEP1_WHEEL_PLACEHOLDER_ID
  const mechVal = draftMechanismId || STEP1_WHEEL_PLACEHOLDER_ID

  const canAud =
    draftAudienceId &&
    draftAudienceId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftAudienceId !== STEP1_OTHER_OPTION_ID || Boolean(draftAudienceOther.trim()))
  const canBefore =
    draftBeforeId &&
    draftBeforeId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftBeforeId !== STEP1_OTHER_OPTION_ID || Boolean(draftBeforeOther.trim()))
  const canAfter =
    draftAfterId &&
    draftAfterId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftAfterId !== STEP1_OTHER_OPTION_ID || Boolean(draftAfterOther.trim()))
  const canMech =
    draftMechanismId &&
    draftMechanismId !== STEP1_WHEEL_PLACEHOLDER_ID &&
    (draftMechanismId !== STEP1_OTHER_OPTION_ID || Boolean(draftMechanismOther.trim()))

  const confirmDisabled =
    focusSlot === 0
      ? !canAud
      : focusSlot === 1
        ? !canBefore
        : focusSlot === 2
          ? !canAfter
          : focusSlot === 3
            ? !canMech
            : true

  const confirmCurrent = () => {
    if (focusSlot === 0) {
      onOfferChange('audienceId', draftAudienceId)
      onOfferChange('audienceOther', draftAudienceOther)
      setFocusSlot(1)
    } else if (focusSlot === 1) {
      onTransformationChange('beforeId', draftBeforeId)
      onTransformationChange('beforeOther', draftBeforeOther)
      setFocusSlot(2)
    } else if (focusSlot === 2) {
      onTransformationChange('afterId', draftAfterId)
      onTransformationChange('afterOther', draftAfterOther)
      setFocusSlot(3)
    } else if (focusSlot === 3) {
      onTransformationChange('mechanismId', draftMechanismId)
      onTransformationChange('mechanismOther', draftMechanismOther)
      setFocusSlot(null)
    }
  }

  const openSlot = (slot: 0 | 1 | 2 | 3) => setFocusSlot(slot)

  const livingPreview = useMemo(() => {
    const o = form.step1.offer
    const t = form.step1.transformation
    const parts: { slot: 0 | 1 | 2 | 3; label: string }[] = []

    const l0 =
      focusSlot === 0
        ? resolveControlledOptionLabel(controlled.audience, draftAudienceId, draftAudienceOther)
        : resolveControlledOptionLabel(controlled.audience, o.audienceId, o.audienceOther)
    if (l0.trim()) parts.push({ slot: 0, label: l0 })

    const l1 =
      focusSlot === 1
        ? resolveControlledOptionLabel(controlled.before, draftBeforeId, draftBeforeOther)
        : resolveControlledOptionLabel(controlled.before, t.beforeId, t.beforeOther)
    if (l1.trim()) parts.push({ slot: 1, label: l1 })

    const l2 =
      focusSlot === 2
        ? resolveControlledOptionLabel(controlled.after, draftAfterId, draftAfterOther)
        : resolveControlledOptionLabel(controlled.after, t.afterId, t.afterOther)
    if (l2.trim()) parts.push({ slot: 2, label: l2 })

    const l3 =
      focusSlot === 3
        ? resolveControlledOptionLabel(controlled.mechanism, draftMechanismId, draftMechanismOther)
        : resolveControlledOptionLabel(controlled.mechanism, t.mechanismId, t.mechanismOther)
    if (l3.trim()) parts.push({ slot: 3, label: l3 })

    return parts
  }, [
    controlled,
    draftAfterId,
    draftAfterOther,
    draftAudienceId,
    draftAudienceOther,
    draftBeforeId,
    draftBeforeOther,
    draftMechanismId,
    draftMechanismOther,
    focusSlot,
    form.step1.offer,
    form.step1.transformation,
  ])

  const sentenceStripClass =
    uxVariant.helperMode === 'sticky'
      ? progressiveLayout.sentenceStripSticky
      : progressiveLayout.sentenceStripInline

  const slotLead = ['We help', 'go from', 'to', 'through'] as const

  const showOtherField =
    (focusSlot === 0 && draftAudienceId === STEP1_OTHER_OPTION_ID) ||
    (focusSlot === 1 && draftBeforeId === STEP1_OTHER_OPTION_ID) ||
    (focusSlot === 2 && draftAfterId === STEP1_OTHER_OPTION_ID) ||
    (focusSlot === 3 && draftMechanismId === STEP1_OTHER_OPTION_ID)

  return (
    <div className="space-y-4">
      <div className={sentenceStripClass}>
        <p className={progressiveLayout.sentenceEyebrow}>Your sentence</p>
        <p className={progressiveLayout.sentenceBody}>
          {livingPreview.length === 0 ? (
            <span className="text-gray-400">Start below — confirm each part to build the line.</span>
          ) : (
            <>
              <span className="font-sans font-medium text-gray-700">We help </span>
              {livingPreview[0] ? (
                <button
                  type="button"
                  className="font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                  onClick={() => openSlot(0)}
                >
                  {livingPreview[0].label}
                </button>
              ) : (
                <span className="text-gray-400">…</span>
              )}
              {livingPreview[1] ? (
                <>
                  <span className="font-sans font-medium text-gray-700"> go from </span>
                  <button
                    type="button"
                    className="font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                    onClick={() => openSlot(1)}
                  >
                    {livingPreview[1].label}
                  </button>
                </>
              ) : null}
              {livingPreview[2] ? (
                <>
                  <span className="font-sans font-medium text-gray-700"> to </span>
                  <button
                    type="button"
                    className="font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                    onClick={() => openSlot(2)}
                  >
                    {livingPreview[2].label}
                  </button>
                </>
              ) : null}
              {livingPreview[3] ? (
                <>
                  <span className="font-sans font-medium text-gray-700"> through </span>
                  <button
                    type="button"
                    className="font-semibold text-gray-900 underline decoration-gray-300 decoration-2 underline-offset-2"
                    onClick={() => openSlot(3)}
                  >
                    {livingPreview[3].label}
                  </button>
                </>
              ) : null}
              .
            </>
          )}
        </p>
      </div>

      {focusSlot !== null ? (
        <div className="space-y-3">
          <div className="flex flex-col items-center gap-3">
            <div className={progressiveLayout.pickerRow}>
              <span className="shrink-0 font-sans text-base font-medium text-gray-900 sm:text-lg">
                {slotLead[focusSlot]}
              </span>
              <SlotScrollWheel
                instanceId={
                  focusSlot === 0
                    ? 't-audience'
                    : focusSlot === 1
                      ? 'before'
                      : focusSlot === 2
                        ? 'after'
                        : 'mechanism'
                }
                syncKey={`${industrySyncKey}-xp${focusSlot}`}
                options={
                  focusSlot === 0
                    ? audienceWheelOptions
                    : focusSlot === 1
                      ? beforeWheelOptions
                      : focusSlot === 2
                        ? afterWheelOptions
                        : mechanismWheelOptions
                }
                value={focusSlot === 0 ? audVal : focusSlot === 1 ? beforeVal : focusSlot === 2 ? afterVal : mechVal}
                onChange={(id) => {
                  const clean = id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id
                  if (focusSlot === 0) setDraftAudienceId(clean)
                  else if (focusSlot === 1) setDraftBeforeId(clean)
                  else if (focusSlot === 2) setDraftAfterId(clean)
                  else setDraftMechanismId(clean)
                }}
                ariaLabel={
                  focusSlot === 0
                    ? 'Who you help'
                    : focusSlot === 1
                      ? 'Starting point'
                      : focusSlot === 2
                        ? 'End result'
                        : 'Mechanism'
                }
                error={
                  focusSlot === 0
                    ? errors['step1.offer.audienceId']
                    : focusSlot === 1
                      ? errors['step1.transformation.beforeId']
                      : focusSlot === 2
                        ? errors['step1.transformation.afterId']
                        : errors['step1.transformation.mechanismId']
                }
                onCenteredDescriptionChange={onWheelDescription}
                density={uxVariant.wheelDensity}
                typeface={uxVariant.wheelTypeface}
              />
            </div>

            <CollapsibleOtherFieldSlot open={showOtherField}>
              {focusSlot === 0 && draftAudienceId === STEP1_OTHER_OPTION_ID ? (
                <InputField
                  id="audienceOtherXf"
                  label="Who you help (custom)"
                  value={draftAudienceOther}
                  onChange={setDraftAudienceOther}
                  maxLength={80}
                  error={errors['step1.offer.audienceOther']}
                />
              ) : focusSlot === 1 && draftBeforeId === STEP1_OTHER_OPTION_ID ? (
                <InputField
                  id="beforeOtherXf"
                  label="Starting point"
                  value={draftBeforeOther}
                  onChange={setDraftBeforeOther}
                  maxLength={80}
                  error={errors['step1.transformation.beforeOther']}
                />
              ) : focusSlot === 2 && draftAfterId === STEP1_OTHER_OPTION_ID ? (
                <InputField
                  id="afterOtherXf"
                  label="End result"
                  value={draftAfterOther}
                  onChange={setDraftAfterOther}
                  maxLength={80}
                  error={errors['step1.transformation.afterOther']}
                />
              ) : focusSlot === 3 && draftMechanismId === STEP1_OTHER_OPTION_ID ? (
                <InputField
                  id="mechanismOtherXf"
                  label="How change happens"
                  value={draftMechanismOther}
                  onChange={setDraftMechanismOther}
                  maxLength={80}
                  error={errors['step1.transformation.mechanismOther']}
                />
              ) : null}
            </CollapsibleOtherFieldSlot>

            <div className={progressiveLayout.helperRow} aria-live="polite" aria-relevant="text">
              {wheelHint?.text ? (
                <p className={progressiveLayout.helperText}>{wheelHint.text}</p>
              ) : (
                <p className={progressiveLayout.helperTextStatic}>
                  Same audience as your offer line — tap a phrase to adjust.
                </p>
              )}
            </div>

            <Button type="button" variant="primary" fullWidth className="max-w-sm" disabled={confirmDisabled} onClick={confirmCurrent}>
              Confirm →
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Tap any phrase above to edit, or continue.</p>
      )}
    </div>
  )
}

function inferXformFocus(offer: Step1Offer, t: Step1Transformation): XformFocus {
  if (!offer.audienceId?.trim()) return 0
  if (!t.beforeId?.trim()) return 1
  if (!t.afterId?.trim()) return 2
  if (!t.mechanismId?.trim()) return 3
  return null
}
