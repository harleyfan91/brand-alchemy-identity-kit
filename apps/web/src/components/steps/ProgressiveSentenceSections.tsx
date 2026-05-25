import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'

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

import { InputField } from '../ui/InputField'
import { SlotScrollWheel, type CenteredDescriptionPayload } from '../ui/SlotScrollWheel'

const STORAGE_OFFER_DELIVERY_SKIP = 'identityKit:step1:offerDeliverySkipDone'

/** Progressive step: sentence reads as page copy; picker row carries the single “tile”. */
const progressiveLayout = {
  sentenceStripSticky: 'sticky top-0 z-20 mx-auto w-full max-w-lg bg-white/95 pb-1 backdrop-blur-sm',
  sentenceStripInline: 'mx-auto w-full max-w-lg',
  /**
   * One row per slot: stable height while the wheel updates copy. Tight gaps so it does not read
   * as tall “blocks”; slots still use underline + italic (see LivingSentenceSlot).
   */
  sentenceRowsWrap: 'mx-auto flex w-full max-w-lg flex-col items-center gap-0 text-center',
  sentenceRow:
    'flex min-h-[2.25rem] w-full max-w-lg flex-wrap items-center justify-center gap-x-2 gap-y-0',
  sentenceGlue: 'shrink-0 font-sans text-[0.95em] font-medium leading-snug text-gray-700 sm:text-base',
  /**
   * Full-bleed white band to the viewport edges (breaks out of `max-w-xl` + `StepShell` `main` padding). Content
   * stays in `pickerInner` at `max-w-lg` so controls align with the sentence column.
   */
  pickerBleed:
    'relative left-1/2 z-10 flex w-screen max-w-[100vw] -translate-x-1/2 flex-col bg-white py-1 shadow-[0_-10px_18px_-14px_rgba(0,0,0,0.12),0_10px_18px_-14px_rgba(0,0,0,0.12)]',
  pickerInner: 'mx-auto flex w-full max-w-lg flex-col gap-1',
  /**
   * Same width as the business-name step: `max-w-xl` inside `StepShell`’s padded `main` →
   * `min(36rem, 100vw − horizontal padding)` without double-padding on large viewports.
   */
  otherFieldShell:
    'mx-auto box-border w-full max-w-[min(36rem,calc(100vw-2rem))] sm:max-w-[min(36rem,calc(100vw-3rem))]',
  pickerRowMain: 'flex w-full min-w-0 flex-row items-center justify-center gap-2 sm:gap-3',
  helperRow: 'mx-auto flex w-full max-w-lg flex-col items-center justify-center py-0.5',
} as const

/** Registered on progressive sentence steps so the shell footer can act as “Next” / “Continue”. */
export type ProgressiveFooterNavApi = {
  /** If a slot is open, commits and advances; returns true (caller must not run `continueStep`). */
  tryAdvanceFromFooter: () => boolean
  /** When editing a slot, primary action is “Next”; otherwise use shell default (“Continue”). */
  getFooterPrimaryLabel: () => string | undefined
  /** When editing a slot, disable matches slot validity; otherwise parent uses step validation. */
  getFooterPrimaryDisabled: () => boolean | undefined
}

function LivingSentenceSlot({
  text,
  placeholder,
  isActive,
  onOpen,
}: {
  text: string
  placeholder: string
  /** True while this slot’s wheel is open — should read like a draft, not a finished choice. */
  isActive: boolean
  onOpen: () => void
}) {
  const empty = !text.trim()
  /** Editing: near placeholder weight; dashed underline differentiates from empty (dotted) and chosen (dotted + dark). */
  const tone = isActive
    ? 'font-normal italic text-gray-500 underline decoration-dashed decoration-gray-400 decoration-2 underline-offset-[0.22em]'
    : empty
      ? 'font-normal italic text-gray-400 underline decoration-dotted decoration-gray-300 decoration-2 underline-offset-[0.22em]'
      : 'font-medium italic text-gray-900 underline decoration-dotted decoration-gray-500 decoration-2 underline-offset-[0.2em]'
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`mx-0.5 inline-flex max-w-[min(92vw,17rem)] min-h-[2.25rem] cursor-pointer flex-col justify-center border-0 bg-transparent p-0 text-center font-serif text-base leading-snug transition-colors motion-reduce:transition-none sm:max-w-[19rem] sm:text-lg ${tone} rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
    >
      <span className="line-clamp-2">{empty ? placeholder : text}</span>
    </button>
  )
}

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
      className="grid w-full min-w-0 transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
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

/** Optional wheel copy; collapsed by default so it does not consume vertical space. */
function WheelHintDisclosure({ text }: { text: string }) {
  return (
    <div className={progressiveLayout.helperRow}>
      <details className="group w-full max-w-lg text-center">
        <summary className="cursor-pointer list-none text-sm text-gray-600 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="underline decoration-gray-300 decoration-1 underline-offset-[0.2em] group-open:decoration-gray-500">
            About this option
          </span>
        </summary>
        <p className="mt-2 max-h-40 overflow-y-auto text-pretty text-left text-sm leading-relaxed text-gray-600 sm:text-center">
          {text}
        </p>
      </details>
    </div>
  )
}

type OfferFocus = 0 | 1 | 2 | null

interface ProgressiveOfferSentenceProps {
  form: IdentityKitForm
  errors: StepErrors
  onCommitStep1Draft: (patch: { offer?: Partial<Step1Offer>; transformation?: Partial<Step1Transformation> }) => void
  progressiveMicroDraftFlushRef: MutableRefObject<(() => void) | null>
  progressiveFooterNavRef: MutableRefObject<ProgressiveFooterNavApi | null>
  onProgressiveFooterChange?: () => void
  industrySyncKey: string
  uxVariant: Step1UxVariant
  offerWheelOptions: Step1ControlledOption[]
  audienceWheelOptions: Step1ControlledOption[]
  deliveryWheelOptions: Step1ControlledOption[]
}

export function ProgressiveOfferSentence({
  form,
  errors,
  onCommitStep1Draft,
  progressiveMicroDraftFlushRef,
  progressiveFooterNavRef,
  onProgressiveFooterChange,
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

  /** Writes the active slot to the form only (no focus change). Used before switching slots or advancing. */
  const flushOfferSlotToForm = useCallback((): boolean => {
    if (focusSlot === null) return true
    const ok =
      focusSlot === 0
        ? canConfirmOffer
        : focusSlot === 1
          ? canConfirmAudience
          : focusSlot === 2
            ? canConfirmDelivery
            : false
    if (!ok) return false
    if (focusSlot === 0) {
      onCommitStep1Draft({ offer: { offerId: draftOfferId, offerOther: draftOfferOther } })
    } else if (focusSlot === 1) {
      onCommitStep1Draft({ offer: { audienceId: draftAudienceId, audienceOther: draftAudienceOther } })
    } else if (draftDeliveryId === STEP1_DELIVERY_WHEEL_SKIP_ID) {
      onCommitStep1Draft({ offer: { deliveryId: '', deliveryOther: '' } })
      writeDeliverySkipStored(true)
    } else {
      onCommitStep1Draft({ offer: { deliveryId: draftDeliveryId, deliveryOther: draftDeliveryOther } })
      writeDeliverySkipStored(false)
    }
    return true
  }, [
    focusSlot,
    canConfirmOffer,
    canConfirmAudience,
    canConfirmDelivery,
    draftOfferId,
    draftOfferOther,
    draftAudienceId,
    draftAudienceOther,
    draftDeliveryId,
    draftDeliveryOther,
    onCommitStep1Draft,
  ])

  useEffect(() => {
    progressiveMicroDraftFlushRef.current = () => {
      flushOfferSlotToForm()
    }
    return () => {
      progressiveMicroDraftFlushRef.current = null
    }
  }, [flushOfferSlotToForm, progressiveMicroDraftFlushRef])

  const confirmCurrent = useCallback(() => {
    if (!flushOfferSlotToForm()) return
    if (focusSlot === 0) setFocusSlot(1)
    else if (focusSlot === 1) setFocusSlot(2)
    else if (focusSlot === 2) setFocusSlot(null)
  }, [flushOfferSlotToForm, focusSlot])

  /** Keep latest values for footer API without re-creating it in layout (avoids parent setState during commit). */
  const focusSlotRef = useRef(focusSlot)
  focusSlotRef.current = focusSlot
  const confirmDisabledRef = useRef(confirmDisabled)
  confirmDisabledRef.current = confirmDisabled
  const confirmCurrentRef = useRef(confirmCurrent)
  confirmCurrentRef.current = confirmCurrent

  useLayoutEffect(() => {
    progressiveFooterNavRef.current = {
      tryAdvanceFromFooter: () => {
        if (focusSlotRef.current === null) return false
        confirmCurrentRef.current()
        return true
      },
      getFooterPrimaryLabel: () => (focusSlotRef.current !== null ? 'Next' : undefined),
      getFooterPrimaryDisabled: () =>
        focusSlotRef.current !== null ? confirmDisabledRef.current : undefined,
    }
    return () => {
      progressiveFooterNavRef.current = null
    }
  }, [progressiveFooterNavRef])

  useEffect(() => {
    onProgressiveFooterChange?.()
    return () => {
      onProgressiveFooterChange?.()
    }
  }, [focusSlot, confirmDisabled, onProgressiveFooterChange])

  const openSlot = (slot: 0 | 1 | 2) => {
    if (focusSlot !== null && focusSlot !== slot && !flushOfferSlotToForm()) return
    setFocusSlot(slot)
  }

  /** One row per slot so line length in the wheel never re-wraps the whole sentence strip. */
  const offerSlots = useMemo(() => {
    const o = form.step1.offer
    const offerText =
      focusSlot === 0
        ? resolveControlledOptionLabel(controlled.offer, draftOfferId, draftOfferOther)
        : resolveControlledOptionLabel(controlled.offer, o.offerId, o.offerOther)
    const audText =
      focusSlot === 1
        ? resolveControlledOptionLabel(controlled.audience, draftAudienceId, draftAudienceOther)
        : resolveControlledOptionLabel(controlled.audience, o.audienceId, o.audienceOther)
    const delText =
      focusSlot === 2
        ? draftDeliveryId === STEP1_DELIVERY_WHEEL_SKIP_ID
          ? ''
          : resolveControlledOptionLabel(controlled.delivery, draftDeliveryId, draftDeliveryOther)
        : resolveControlledOptionLabel(controlled.delivery, o.deliveryId ?? '', o.deliveryOther)
    return [
      { text: offerText, placeholder: 'your main offer', isFocused: focusSlot === 0 },
      { text: audText, placeholder: 'who it is for', isFocused: focusSlot === 1 },
      { text: delText, placeholder: 'how it is delivered', isFocused: focusSlot === 2 },
    ] as const
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
    <div className="space-y-2">
      <div className={sentenceStripClass}>
        <div className={progressiveLayout.sentenceRowsWrap}>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>We provide</span>
            <LivingSentenceSlot
              text={offerSlots[0].text}
              placeholder={offerSlots[0].placeholder}
              isActive={offerSlots[0].isFocused}
              onOpen={() => openSlot(0)}
            />
          </div>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>for</span>
            <LivingSentenceSlot
              text={offerSlots[1].text}
              placeholder={offerSlots[1].placeholder}
              isActive={offerSlots[1].isFocused}
              onOpen={() => openSlot(1)}
            />
          </div>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>through</span>
            <LivingSentenceSlot
              text={offerSlots[2].text}
              placeholder={offerSlots[2].placeholder}
              isActive={offerSlots[2].isFocused}
              onOpen={() => openSlot(2)}
            />
            <span className="font-serif text-base leading-snug text-gray-900 sm:text-lg">.</span>
          </div>
        </div>
      </div>

      {focusSlot !== null ? (
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-full shrink-0">
              <div className={progressiveLayout.pickerBleed}>
                <div className="flex w-full flex-col gap-1">
                  <div className={progressiveLayout.pickerInner}>
                    <div className={progressiveLayout.pickerRowMain}>
                      <span className="block w-[5.5rem] shrink-0 text-right font-sans text-base font-medium text-gray-900 sm:text-lg">
                        {slotLabels[focusSlot]}
                      </span>
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
                  </div>

                  <div className={progressiveLayout.otherFieldShell}>
                    <CollapsibleOtherFieldSlot open={showOtherField}>
                    {focusSlot === 0 && showOtherOffer ? (
                      <InputField
                        id="offerOtherProg"
                        label="Custom offer"
                        hideLabel
                        value={draftOfferOther}
                        onChange={setDraftOfferOther}
                        placeholder="e.g. fractional CMO support"
                        maxLength={80}
                        error={errors['step1.offer.offerOther']}
                      />
                    ) : focusSlot === 1 && showOtherAudience ? (
                      <InputField
                        id="audienceOtherProg"
                        label="Custom audience"
                        hideLabel
                        value={draftAudienceOther}
                        onChange={setDraftAudienceOther}
                        placeholder="e.g. postpartum moms returning to training"
                        maxLength={80}
                        error={errors['step1.offer.audienceOther']}
                      />
                    ) : focusSlot === 2 && showOtherDelivery ? (
                      <InputField
                        id="deliveryOtherProg"
                        label="Custom delivery"
                        hideLabel
                        value={draftDeliveryOther}
                        onChange={setDraftDeliveryOther}
                        placeholder="e.g. weekly voice-note check-ins"
                        maxLength={80}
                        error={errors['step1.offer.deliveryOther']}
                      />
                    ) : null}
                    </CollapsibleOtherFieldSlot>
                  </div>
                </div>
              </div>
            </div>

            {wheelHint?.text?.trim() ? (
              <WheelHintDisclosure
                key={`${focusSlot}-${wheelHint.source ?? ''}`}
                text={wheelHint.text.trim()}
              />
            ) : null}

          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Tap a phrase to edit, or continue when this section is complete.</p>
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
  onCommitStep1Draft: (patch: { offer?: Partial<Step1Offer>; transformation?: Partial<Step1Transformation> }) => void
  progressiveMicroDraftFlushRef: MutableRefObject<(() => void) | null>
  progressiveFooterNavRef: MutableRefObject<ProgressiveFooterNavApi | null>
  onProgressiveFooterChange?: () => void
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
  onCommitStep1Draft,
  progressiveMicroDraftFlushRef,
  progressiveFooterNavRef,
  onProgressiveFooterChange,
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

  const flushXformSlotToForm = useCallback((): boolean => {
    if (focusSlot === null) return true
    const ok =
      focusSlot === 0
        ? canAud
        : focusSlot === 1
          ? canBefore
          : focusSlot === 2
            ? canAfter
            : focusSlot === 3
              ? canMech
              : false
    if (!ok) return false
    if (focusSlot === 0) {
      onCommitStep1Draft({ offer: { audienceId: draftAudienceId, audienceOther: draftAudienceOther } })
    } else if (focusSlot === 1) {
      onCommitStep1Draft({ transformation: { beforeId: draftBeforeId, beforeOther: draftBeforeOther } })
    } else if (focusSlot === 2) {
      onCommitStep1Draft({ transformation: { afterId: draftAfterId, afterOther: draftAfterOther } })
    } else {
      onCommitStep1Draft({ transformation: { mechanismId: draftMechanismId, mechanismOther: draftMechanismOther } })
    }
    return true
  }, [
    focusSlot,
    canAud,
    canBefore,
    canAfter,
    canMech,
    draftAudienceId,
    draftAudienceOther,
    draftBeforeId,
    draftBeforeOther,
    draftAfterId,
    draftAfterOther,
    draftMechanismId,
    draftMechanismOther,
    onCommitStep1Draft,
  ])

  useEffect(() => {
    progressiveMicroDraftFlushRef.current = () => {
      flushXformSlotToForm()
    }
    return () => {
      progressiveMicroDraftFlushRef.current = null
    }
  }, [flushXformSlotToForm, progressiveMicroDraftFlushRef])

  const confirmCurrent = useCallback(() => {
    if (!flushXformSlotToForm()) return
    if (focusSlot === 0) setFocusSlot(1)
    else if (focusSlot === 1) setFocusSlot(2)
    else if (focusSlot === 2) setFocusSlot(3)
    else if (focusSlot === 3) setFocusSlot(null)
  }, [flushXformSlotToForm, focusSlot])

  const focusSlotRef = useRef(focusSlot)
  focusSlotRef.current = focusSlot
  const confirmDisabledRef = useRef(confirmDisabled)
  confirmDisabledRef.current = confirmDisabled
  const confirmCurrentRef = useRef(confirmCurrent)
  confirmCurrentRef.current = confirmCurrent

  useLayoutEffect(() => {
    progressiveFooterNavRef.current = {
      tryAdvanceFromFooter: () => {
        if (focusSlotRef.current === null) return false
        confirmCurrentRef.current()
        return true
      },
      getFooterPrimaryLabel: () => (focusSlotRef.current !== null ? 'Next' : undefined),
      getFooterPrimaryDisabled: () =>
        focusSlotRef.current !== null ? confirmDisabledRef.current : undefined,
    }
    return () => {
      progressiveFooterNavRef.current = null
    }
  }, [progressiveFooterNavRef])

  useEffect(() => {
    onProgressiveFooterChange?.()
    return () => {
      onProgressiveFooterChange?.()
    }
  }, [focusSlot, confirmDisabled, onProgressiveFooterChange])

  const openSlot = (slot: 0 | 1 | 2 | 3) => {
    if (focusSlot !== null && focusSlot !== slot && !flushXformSlotToForm()) return
    setFocusSlot(slot)
  }

  const xformSlots = useMemo(() => {
    const o = form.step1.offer
    const t = form.step1.transformation
    const l0 =
      focusSlot === 0
        ? resolveControlledOptionLabel(controlled.audience, draftAudienceId, draftAudienceOther)
        : resolveControlledOptionLabel(controlled.audience, o.audienceId, o.audienceOther)
    const l1 =
      focusSlot === 1
        ? resolveControlledOptionLabel(controlled.before, draftBeforeId, draftBeforeOther)
        : resolveControlledOptionLabel(controlled.before, t.beforeId, t.beforeOther)
    const l2 =
      focusSlot === 2
        ? resolveControlledOptionLabel(controlled.after, draftAfterId, draftAfterOther)
        : resolveControlledOptionLabel(controlled.after, t.afterId, t.afterOther)
    const l3 =
      focusSlot === 3
        ? resolveControlledOptionLabel(controlled.mechanism, draftMechanismId, draftMechanismOther)
        : resolveControlledOptionLabel(controlled.mechanism, t.mechanismId, t.mechanismOther)
    return [
      { text: l0, placeholder: 'who you help', isFocused: focusSlot === 0 },
      { text: l1, placeholder: 'where they start', isFocused: focusSlot === 1 },
      { text: l2, placeholder: 'where they land', isFocused: focusSlot === 2 },
      { text: l3, placeholder: 'how change happens', isFocused: focusSlot === 3 },
    ] as const
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
    <div className="space-y-2">
      <div className={sentenceStripClass}>
        <div className={progressiveLayout.sentenceRowsWrap}>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>We help</span>
            <LivingSentenceSlot
              text={xformSlots[0].text}
              placeholder={xformSlots[0].placeholder}
              isActive={xformSlots[0].isFocused}
              onOpen={() => openSlot(0)}
            />
          </div>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>go from</span>
            <LivingSentenceSlot
              text={xformSlots[1].text}
              placeholder={xformSlots[1].placeholder}
              isActive={xformSlots[1].isFocused}
              onOpen={() => openSlot(1)}
            />
            <span className={progressiveLayout.sentenceGlue}>to</span>
            <LivingSentenceSlot
              text={xformSlots[2].text}
              placeholder={xformSlots[2].placeholder}
              isActive={xformSlots[2].isFocused}
              onOpen={() => openSlot(2)}
            />
          </div>
          <div className={progressiveLayout.sentenceRow}>
            <span className={progressiveLayout.sentenceGlue}>through</span>
            <LivingSentenceSlot
              text={xformSlots[3].text}
              placeholder={xformSlots[3].placeholder}
              isActive={xformSlots[3].isFocused}
              onOpen={() => openSlot(3)}
            />
            <span className="font-serif text-base leading-snug text-gray-900 sm:text-lg">.</span>
          </div>
        </div>
      </div>

      {focusSlot !== null ? (
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-full shrink-0">
              <div className={progressiveLayout.pickerBleed}>
                <div className="flex w-full flex-col gap-1">
                  <div className={progressiveLayout.pickerInner}>
                    <div className={progressiveLayout.pickerRowMain}>
                      <span className="block w-[5.5rem] shrink-0 text-right font-sans text-base font-medium text-gray-900 sm:text-lg">
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
                  </div>

                  <div className={progressiveLayout.otherFieldShell}>
                    <CollapsibleOtherFieldSlot open={showOtherField}>
                      {focusSlot === 0 && draftAudienceId === STEP1_OTHER_OPTION_ID ? (
                        <InputField
                          id="audienceOtherXf"
                          label="Custom audience"
                          hideLabel
                          value={draftAudienceOther}
                          onChange={setDraftAudienceOther}
                          placeholder="e.g. first-time marathoners in their 40s"
                          maxLength={80}
                          error={errors['step1.offer.audienceOther']}
                        />
                      ) : focusSlot === 1 && draftBeforeId === STEP1_OTHER_OPTION_ID ? (
                        <InputField
                          id="beforeOtherXf"
                          label="Custom starting point"
                          hideLabel
                          value={draftBeforeOther}
                          onChange={setDraftBeforeOther}
                          placeholder="e.g. inconsistent sleep and low energy"
                          maxLength={80}
                          error={errors['step1.transformation.beforeOther']}
                        />
                      ) : focusSlot === 2 && draftAfterId === STEP1_OTHER_OPTION_ID ? (
                        <InputField
                          id="afterOtherXf"
                          label="Custom end result"
                          hideLabel
                          value={draftAfterOther}
                          onChange={setDraftAfterOther}
                          placeholder="e.g. steady energy through the workday"
                          maxLength={80}
                          error={errors['step1.transformation.afterOther']}
                        />
                      ) : focusSlot === 3 && draftMechanismId === STEP1_OTHER_OPTION_ID ? (
                        <InputField
                          id="mechanismOtherXf"
                          label="Custom how change happens"
                          hideLabel
                          value={draftMechanismOther}
                          onChange={setDraftMechanismOther}
                          placeholder="e.g. weekly habit check-ins and meal templates"
                          maxLength={80}
                          error={errors['step1.transformation.mechanismOther']}
                        />
                      ) : null}
                    </CollapsibleOtherFieldSlot>
                  </div>
                </div>
              </div>
            </div>

            {wheelHint?.text?.trim() ? (
              <WheelHintDisclosure
                key={`${focusSlot}-${wheelHint.source ?? ''}`}
                text={wheelHint.text.trim()}
              />
            ) : focusSlot === 0 ? (
              <p className="mx-auto max-w-lg px-1 text-center text-xs leading-snug text-gray-500">
                Same audience as your offer line — tap a phrase to adjust.
              </p>
            ) : null}

          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Tap a phrase to edit, or continue when this section is complete.</p>
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
