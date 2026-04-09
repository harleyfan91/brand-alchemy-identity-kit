import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { BrandNarrator, IdentityKitForm, Step1Offer, Step1Transformation, StepErrors } from '../../types'
import {
  STEP1_DELIVERY_WHEEL_SKIP_ID,
  STEP1_OTHER_OPTION_ID,
  STEP1_WHEEL_PLACEHOLDER_ID,
  getStep1ControlledOptions,
  withDeliveryWheelSkip,
  withWheelPlaceholder,
} from '../../data/step1ControlledOptions'
import { narratorOptions } from '../../data/narratorOptions'
import { ArchetypeCard } from '../ui/ArchetypeCard'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { SlotScrollWheel, type CenteredDescriptionPayload } from '../ui/SlotScrollWheel'

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

export type Step1SnapshotView =
  | 'businessName'
  | 'industryStage'
  | 'brandNarrator'
  | 'offerSentence'
  | 'transformationSentence'

interface Step1SnapshotProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (field: 'businessName' | 'industry' | 'stage', value: string) => void
  onOfferChange: (field: keyof Step1Offer, value: string) => void
  onTransformationChange: (field: keyof Step1Transformation, value: string) => void
  onNarratorChange: (value: BrandNarrator) => void
  view: Step1SnapshotView
}

const industryOptions = [
  { value: 'creative_services', label: 'Creative Services' },
  { value: 'health_wellness', label: 'Health and Wellness' },
  { value: 'beauty_personal_care', label: 'Beauty and Personal Care' },
  { value: 'fitness_sports', label: 'Fitness and Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'food_beverage', label: 'Food and Beverage' },
  { value: 'home_services', label: 'Home Services' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal_professional_services', label: 'Legal and Professional Services' },
  { value: 'consulting_coaching', label: 'Consulting and Coaching' },
  { value: 'construction_trades', label: 'Construction and Trades' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'photography_media', label: 'Photography and Media' },
  { value: 'pet_services', label: 'Pet Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'nonprofit_community', label: 'Nonprofit and Community' },
  { value: 'other', label: 'Other' },
]

/** Mobile: label above wheel; sm+: label and wheel in a row; outer flow wraps groups like a sentence. */
function SentenceSlot({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="inline-flex w-full max-w-full flex-row items-center justify-center gap-2 sm:w-auto sm:max-w-none sm:gap-x-2">
      <span className="shrink-0 text-balance text-center font-sans text-base font-medium leading-snug text-gray-900 sm:text-left sm:text-xl">
        {label}
      </span>
      {children}
    </span>
  )
}

export function Step1Snapshot({
  form,
  errors,
  onChange,
  onOfferChange,
  onTransformationChange,
  onNarratorChange,
  view,
}: Step1SnapshotProps) {
  const controlledOptions = useMemo(
    () => getStep1ControlledOptions(form.step1.industry),
    [form.step1.industry],
  )

  const offerWheelOptions = useMemo(
    () => withWheelPlaceholder(controlledOptions.offer),
    [controlledOptions.offer],
  )
  const audienceWheelOptions = useMemo(
    () => withWheelPlaceholder(controlledOptions.audience),
    [controlledOptions.audience],
  )
  const deliveryWheelOptions = useMemo(
    () => withDeliveryWheelSkip(controlledOptions.delivery),
    [controlledOptions.delivery],
  )
  const beforeWheelOptions = useMemo(
    () => withWheelPlaceholder(controlledOptions.before),
    [controlledOptions.before],
  )
  const afterWheelOptions = useMemo(
    () => withWheelPlaceholder(controlledOptions.after),
    [controlledOptions.after],
  )
  const mechanismWheelOptions = useMemo(
    () => withWheelPlaceholder(controlledOptions.mechanism),
    [controlledOptions.mechanism],
  )

  const industrySyncKey = form.step1.industry || 'none'

  const [wheelHint, setWheelHint] = useState<{ source: string; text: string } | null>(null)

  useEffect(() => {
    setWheelHint(null)
  }, [view])

  const onWheelDescription = useCallback((payload: CenteredDescriptionPayload) => {
    setWheelHint((prev) => mergeWheelHint(prev, payload.wheelId, payload.description))
  }, [])

  const showOtherInput = (selectedId: string) => selectedId === STEP1_OTHER_OPTION_ID

  const otherField = (
    id: string,
    label: string,
    value: string,
    onValueChange: (value: string) => void,
    error?: string,
    placeholder = 'Keep it short, like 2-6 words',
  ) => (
    <InputField
      id={id}
      label={label}
      value={value}
      onChange={onValueChange}
      placeholder={placeholder}
      inputMode="text"
      enterKeyHint="done"
      maxLength={80}
      error={error}
    />
  )

  if (view === 'businessName') {
    return (
      <InputField
        id="businessName"
        label="Business name"
        value={form.step1.businessName}
        onChange={(value) => onChange('businessName', value)}
        placeholder="e.g. Sunrise Bakery, Northside Plumbing"
        autoComplete="organization"
        enterKeyHint="next"
        error={errors['step1.businessName']}
      />
    )
  }

  if (view === 'industryStage') {
    return (
      <>
        <SelectField
          id="industry"
          label="Industry"
          value={form.step1.industry}
          onChange={(value) => onChange('industry', value)}
          options={industryOptions}
          error={errors['step1.industry']}
        />
        <SelectField
          id="stage"
          label="Stage"
          value={form.step1.stage}
          onChange={(value) => onChange('stage', value)}
          options={[
            { value: 'idea', label: 'Idea stage' },
            { value: 'new', label: 'New business' },
            { value: 'growing', label: 'Growing' },
            { value: 'established', label: 'Established' },
          ]}
          error={errors['step1.stage']}
        />
      </>
    )
  }

  if (view === 'brandNarrator') {
    return (
      <fieldset className="space-y-3">
        <legend className="sr-only">Choose one option</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
          {narratorOptions.map((option) => (
            <ArchetypeCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              selected={form.step1.brandNarrator === option.id}
              onClick={() => onNarratorChange(option.id)}
            />
          ))}
        </div>
        {errors['step1.brandNarrator'] ? <p className="text-xs text-red-600">{errors['step1.brandNarrator']}</p> : null}
      </fieldset>
    )
  }

  if (view === 'offerSentence') {
    const offerWheelValue = form.step1.offer.offerId || STEP1_WHEEL_PLACEHOLDER_ID
    const audienceWheelValue = form.step1.offer.audienceId || STEP1_WHEEL_PLACEHOLDER_ID
    const deliveryWheelValue = form.step1.offer.deliveryId?.trim()
      ? form.step1.offer.deliveryId
      : STEP1_DELIVERY_WHEEL_SKIP_ID

    return (
      <div className="space-y-3">
        <div
          className="mx-auto sticky top-0 z-20 -mx-2 min-h-[2.5rem] max-w-lg bg-white/95 px-2 py-1 backdrop-blur"
          aria-live="polite"
          aria-relevant="text"
        >
          {wheelHint?.text ? (
            <p className="text-pretty text-center text-sm leading-relaxed text-gray-600">{wheelHint.text}</p>
          ) : null}
        </div>
        <div
          className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-4 px-1 sm:max-w-3xl sm:gap-x-3 sm:gap-y-6 sm:px-2"
          role="group"
          aria-label="Offer sentence"
        >
          <SentenceSlot label="We provide">
            <SlotScrollWheel
              instanceId="offer"
              syncKey={industrySyncKey}
              options={offerWheelOptions}
              value={offerWheelValue}
              onChange={(id) => onOfferChange('offerId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Main offer"
              error={errors['step1.offer.offerId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
          <SentenceSlot label="for">
            <SlotScrollWheel
              instanceId="audience"
              syncKey={industrySyncKey}
              options={audienceWheelOptions}
              value={audienceWheelValue}
              onChange={(id) => onOfferChange('audienceId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Who it is for"
              error={errors['step1.offer.audienceId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
          <SentenceSlot label="through">
            <SlotScrollWheel
              instanceId="delivery"
              syncKey={industrySyncKey}
              options={deliveryWheelOptions}
              value={deliveryWheelValue}
              onChange={(id) => {
                if (id === STEP1_DELIVERY_WHEEL_SKIP_ID) {
                  onOfferChange('deliveryId', '')
                  onOfferChange('deliveryOther', '')
                } else {
                  onOfferChange('deliveryId', id)
                }
              }}
              ariaLabel="How it is delivered (optional)"
              error={errors['step1.offer.deliveryOther']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
        </div>
        <div className="space-y-3">
          {showOtherInput(form.step1.offer.offerId)
            ? otherField(
                'offerOther',
                'Your offer in a few words',
                form.step1.offer.offerOther ?? '',
                (value) => onOfferChange('offerOther', value),
                errors['step1.offer.offerOther'],
                'e.g. fractional CMO support',
              )
            : null}
          {showOtherInput(form.step1.offer.audienceId)
            ? otherField(
                'audienceOther',
                'Who this is mainly for',
                form.step1.offer.audienceOther ?? '',
                (value) => onOfferChange('audienceOther', value),
                errors['step1.offer.audienceOther'],
                'e.g. postpartum moms returning to training',
              )
            : null}
          {showOtherInput(form.step1.offer.deliveryId ?? '')
            ? otherField(
                'deliveryOther',
                'How this is delivered',
                form.step1.offer.deliveryOther ?? '',
                (value) => onOfferChange('deliveryOther', value),
                errors['step1.offer.deliveryOther'],
                'e.g. weekly voice-note check-ins',
              )
            : null}
        </div>
      </div>
    )
  }

  if (view === 'transformationSentence') {
    const audienceWheelValue = form.step1.offer.audienceId || STEP1_WHEEL_PLACEHOLDER_ID
    const beforeWheelValue = form.step1.transformation.beforeId || STEP1_WHEEL_PLACEHOLDER_ID
    const afterWheelValue = form.step1.transformation.afterId || STEP1_WHEEL_PLACEHOLDER_ID
    const mechanismWheelValue = form.step1.transformation.mechanismId || STEP1_WHEEL_PLACEHOLDER_ID

    return (
      <div className="space-y-4">
        <div
          className="mx-auto sticky top-0 z-20 -mx-2 min-h-[2.5rem] max-w-lg bg-white/95 px-2 py-1 backdrop-blur"
          aria-live="polite"
          aria-relevant="text"
        >
          {wheelHint?.text ? (
            <p className="text-pretty text-center text-sm leading-relaxed text-gray-600">{wheelHint.text}</p>
          ) : (
            <p className="text-pretty text-center text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
              Same audience as your offer line — adjust if you need to refine it
            </p>
          )}
        </div>
        <div
          className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-4 px-1 sm:max-w-3xl sm:gap-x-3 sm:gap-y-6 sm:px-2"
          role="group"
          aria-label="Transformation sentence"
        >
          <SentenceSlot label="We help">
            <SlotScrollWheel
              instanceId="t-audience"
              syncKey={industrySyncKey}
              options={audienceWheelOptions}
              value={audienceWheelValue}
              onChange={(id) => onOfferChange('audienceId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Who you help"
              error={errors['step1.offer.audienceId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
          <SentenceSlot label="go from">
            <SlotScrollWheel
              instanceId="before"
              syncKey={industrySyncKey}
              options={beforeWheelOptions}
              value={beforeWheelValue}
              onChange={(id) => onTransformationChange('beforeId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Where customers start"
              error={errors['step1.transformation.beforeId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
          <SentenceSlot label="to">
            <SlotScrollWheel
              instanceId="after"
              syncKey={industrySyncKey}
              options={afterWheelOptions}
              value={afterWheelValue}
              onChange={(id) => onTransformationChange('afterId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Where they end up"
              error={errors['step1.transformation.afterId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
          <SentenceSlot label="through">
            <SlotScrollWheel
              instanceId="mechanism"
              syncKey={industrySyncKey}
              options={mechanismWheelOptions}
              value={mechanismWheelValue}
              onChange={(id) => onTransformationChange('mechanismId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="What makes the change happen"
              error={errors['step1.transformation.mechanismId']}
              onCenteredDescriptionChange={onWheelDescription}
            />
          </SentenceSlot>
        </div>
        <div className="space-y-4">
          {showOtherInput(form.step1.offer.audienceId)
            ? otherField(
                'audienceOther',
                'Who you help (custom)',
                form.step1.offer.audienceOther ?? '',
                (value) => onOfferChange('audienceOther', value),
                errors['step1.offer.audienceOther'],
              )
            : null}
          {showOtherInput(form.step1.transformation.beforeId)
            ? otherField(
                'beforeOther',
                'Describe the starting point',
                form.step1.transformation.beforeOther ?? '',
                (value) => onTransformationChange('beforeOther', value),
                errors['step1.transformation.beforeOther'],
              )
            : null}
          {showOtherInput(form.step1.transformation.afterId)
            ? otherField(
                'afterOther',
                'Describe the result',
                form.step1.transformation.afterOther ?? '',
                (value) => onTransformationChange('afterOther', value),
                errors['step1.transformation.afterOther'],
              )
            : null}
          {showOtherInput(form.step1.transformation.mechanismId)
            ? otherField(
                'mechanismOther',
                'How that change happens',
                form.step1.transformation.mechanismOther ?? '',
                (value) => onTransformationChange('mechanismOther', value),
                errors['step1.transformation.mechanismOther'],
              )
            : null}
        </div>
      </div>
    )
  }

  return null
}
