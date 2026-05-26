import { useCallback, useEffect, useMemo, useState, type MutableRefObject, type ReactNode } from 'react'

import type {
  BrandNarrator,
  GuideFocus,
  IdentityKitForm,
  PrimaryGoal,
  Step1Offer,
  Step1Transformation,
  StepErrors,
  TouchpointId,
} from '../../types'
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
import { HorizontalScrollRow } from '../ui/HorizontalScrollRow'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'
import { TextArea } from '../ui/TextArea'
import { resolveStep1UxVariant } from '../../config/step1UxVariants'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  ProgressiveOfferSentence,
  ProgressiveTransformationSentence,
  type ProgressiveFooterNavApi,
} from './ProgressiveSentenceSections'
import { SlotScrollWheel, type CenteredDescriptionPayload } from '../ui/SlotScrollWheel'
import { getTouchpointLabel, touchpointBuckets as getTouchpointBuckets } from '../../types'
import type { IconType } from 'react-icons'
import {
  FaAmazon,
  FaApple,
  FaBloggerB,
  FaEbay,
  FaEnvelope,
  FaFacebookF,
  FaGoogle,
  FaGlobe,
  FaHandshake,
  FaInstagram,
  FaLinkedinIn,
  FaMicrosoft,
  FaPinterestP,
  FaShirt,
  FaShopify,
  FaStore,
  FaTiktok,
  FaTags,
  FaYoutube,
} from 'react-icons/fa6'
import { SiEtsy, SiNextdoor, SiThreads, SiTripadvisor, SiYelp } from 'react-icons/si'

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

/**
 * Progressive reveal panel. Default: also expanded from `md` up (touchpoint step desktop UX).
 * Set `alwaysVisibleFromMd={false}` when only one native `<select>` should be on screen at a time.
 */
function MobileStepRevealPanel({
  open,
  children,
  className = '',
  alwaysVisibleFromMd = true,
}: {
  open: boolean
  children: ReactNode
  className?: string
  alwaysVisibleFromMd?: boolean
}) {
  const isMdUp = useMediaQuery('(min-width: 768px)')
  const effectivelyOpen = open || (alwaysVisibleFromMd && isMdUp)

  return (
    <div
      aria-hidden={effectivelyOpen ? undefined : true}
      className={[
        className,
        effectivelyOpen
          ? 'max-md:pointer-events-auto max-md:max-h-[80rem] max-md:opacity-100'
          : 'max-md:pointer-events-none max-md:max-h-0 max-md:overflow-hidden max-md:opacity-0',
        'max-md:transition-[max-height,opacity] max-md:duration-300 max-md:motion-reduce:transition-none',
        'md:pointer-events-auto md:max-h-none md:overflow-visible md:opacity-100',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

const touchpointGoalButtonBase =
  'min-h-11 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition'

export type Step1SnapshotView =
  | 'businessName'
  | 'industryStage'
  | 'brandNarrator'
  | 'primaryTouchpoint'
  | 'offerSentence'
  | 'transformationSentence'
  | 'businessDescription'

interface Step1SnapshotProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (
    field:
      | 'businessName'
      | 'businessWebsite'
      | 'industry'
      | 'stage'
      | 'businessOperatingModel'
      | 'businessDescription',
    value: string,
  ) => void
  onTouchpointToggle: (value: TouchpointId) => void
  onPrimaryGoalChange: (value: PrimaryGoal) => void
  onGuideFocusChange: (value: GuideFocus) => void
  onOfferChange: (field: keyof Step1Offer, value: string) => void
  onTransformationChange: (field: keyof Step1Transformation, value: string) => void
  /** Single batched write for progressive sentence flushes (Continue / tap another slot). */
  onCommitStep1Draft: (patch: { offer?: Partial<Step1Offer>; transformation?: Partial<Step1Transformation> }) => void
  progressiveMicroDraftFlushRef: MutableRefObject<(() => void) | null>
  progressiveFooterNavRef: MutableRefObject<ProgressiveFooterNavApi | null>
  onProgressiveFooterChange?: () => void
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

const stageOptions = [
  { value: 'idea', label: 'Idea stage' },
  { value: 'new', label: 'New business' },
  { value: 'growing', label: 'Growing' },
  { value: 'established', label: 'Established' },
]

const operatingModelOptions = [
  { value: 'customer_visits_us', label: 'Physical location' },
  { value: 'we_travel_to_customers', label: 'We go to customers' },
  { value: 'online_only', label: 'Online' },
  { value: 'hybrid', label: 'In person & online' },
  { value: 'mostly_events_or_markets', label: 'Pop-up / events' },
]

const guideFocusOptions: Array<{ id: GuideFocus; label: string; description: string }> = [
  {
    id: 'look_more_professional',
    label: 'Look more professional',
    description: 'Help me make the brand feel more polished and credible fast.',
  },
  {
    id: 'sound_more_consistent',
    label: 'Sound more consistent',
    description: 'Help me make the writing feel more like the same brand everywhere.',
  },
  {
    id: 'give_clear_direction',
    label: 'Give clearer direction',
    description: 'Help me hand better visual and voice direction to a designer or helper.',
  },
  {
    id: 'know_what_to_fix_first',
    label: 'Know what to fix first',
    description: 'Help me prioritize the first updates instead of second-guessing everything.',
  },
]

const touchpointIcons: Record<TouchpointId, IconType> = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  youtube: FaYoutube,
  pinterest: FaPinterestP,
  threads: SiThreads,
  google_business: FaGoogle,
  apple_maps: FaApple,
  bing_places: FaMicrosoft,
  yelp: SiYelp,
  nextdoor: SiNextdoor,
  tripadvisor: SiTripadvisor,
  marketplace_storefront: SiEtsy,
  amazon_storefront: FaAmazon,
  ebay_storefront: FaEbay,
  walmart_marketplace: FaStore,
  faire_wholesale: FaHandshake,
  depop_store: FaShirt,
  poshmark_store: FaTags,
  shopify_marketplace: FaShopify,
  website: FaGlobe,
  email_newsletter: FaEnvelope,
  blog: FaBloggerB,
}

const touchpointBucketRows = getTouchpointBuckets().map((bucket) => ({
  label: bucket.label,
  options: bucket.ids.map((id) => ({
    value: id,
    name: getTouchpointLabel(id),
    icon: touchpointIcons[id],
  })),
}))

function SentenceSlot({
  label,
  children,
  layout,
}: {
  label: string
  children: ReactNode
  layout: 'inline' | 'stacked'
}) {
  return (
    <span
      className={
        layout === 'stacked'
          ? 'flex w-full max-w-[min(100%,20rem)] flex-col items-center gap-3 sm:inline-flex sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2 sm:gap-y-1'
          : 'inline-flex w-full max-w-full flex-row items-center justify-center gap-2 sm:w-auto sm:max-w-none sm:gap-x-2'
      }
    >
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
  onTouchpointToggle,
  onPrimaryGoalChange,
  onGuideFocusChange,
  onOfferChange,
  onTransformationChange,
  onCommitStep1Draft,
  progressiveMicroDraftFlushRef,
  progressiveFooterNavRef,
  onProgressiveFooterChange,
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
  const uxVariant = resolveStep1UxVariant()

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
      <div className="space-y-5">
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
        <InputField
          id="businessWebsite"
          label="Business website (optional)"
          value={form.step1.businessWebsite ?? ''}
          onChange={(value) => onChange('businessWebsite', value)}
          placeholder="example.com"
          type="url"
          inputMode="url"
          autoComplete="url"
          enterKeyHint="done"
          error={errors['step1.businessWebsite']}
        />
      </div>
    )
  }

  if (view === 'industryStage') {
    return (
      <div className="space-y-6">
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
          options={stageOptions}
          error={errors['step1.stage']}
        />
        <SelectField
          id="businessOperatingModel"
          label="Where you meet customers"
          value={form.step1.businessOperatingModel}
          onChange={(value) => onChange('businessOperatingModel', value)}
          options={operatingModelOptions}
          error={errors['step1.businessOperatingModel']}
        />
      </div>
    )
  }

  if (view === 'brandNarrator') {
    return (
      <fieldset className="space-y-3">
        <legend className="sr-only">Choose one option</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {narratorOptions.map((option) => (
            <ArchetypeCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              summary
              selected={form.step1.brandNarrator === option.id}
              onClick={() => onNarratorChange(option.id)}
            />
          ))}
        </div>
        {errors['step1.brandNarrator'] ? <p className="text-xs text-red-600">{errors['step1.brandNarrator']}</p> : null}
      </fieldset>
    )
  }

  if (view === 'primaryTouchpoint') {
    const selected = new Set(form.step1.touchpoints ?? [])
    const ordered = form.step1.touchpoints ?? []
    const hasTouchpoint = ordered.length > 0
    const hasPrimaryGoal = form.step1.primaryGoal !== ''
    const hasGuideFocus = form.step1.guideFocus !== ''

    const showGoalSection =
      hasTouchpoint ||
      hasPrimaryGoal ||
      Boolean(errors['step1.primaryGoal']) ||
      Boolean(errors['step1.guideFocus'])

    const showGuideFocusSection =
      hasGuideFocus ||
      Boolean(errors['step1.guideFocus']) ||
      (hasTouchpoint && hasPrimaryGoal)

    return (
      <div className="space-y-5">
        {(ordered.length >= 4 && !errors['step1.touchpoints']) ? (
          <p className="text-xs text-amber-700">Maximum four platforms.</p>
        ) : null}

        <section className="space-y-3" aria-labelledby="step1-touchpoints-label">
          <p
            id="step1-touchpoints-label"
            className="text-xs font-semibold uppercase tracking-wide text-gray-600"
          >
            Where you show up
          </p>
          <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/40 p-3 sm:p-4">
            {touchpointBucketRows.map((bucket) => (
              <div key={bucket.label} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{bucket.label}</p>
                <HorizontalScrollRow
                  rowClassName="gap-2 pb-1"
                  surfaceColor="#fcfcfd"
                  aria-label={`${bucket.label} platforms (swipe to see more)`}
                >
                  {bucket.options.map((option) => {
                    const isSelected = selected.has(option.value)
                    const rank = ordered.indexOf(option.value) + 1
                    const PlatformIcon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onTouchpointToggle(option.value)}
                        className={
                          isSelected
                            ? 'relative flex h-20 min-w-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-gray-900 bg-white px-2 py-2 text-center shadow-sm'
                            : 'relative flex h-20 min-w-20 flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-2 text-center hover:border-gray-400'
                        }
                      >
                        {rank > 0 ? (
                          <span className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-semibold text-white">
                            {rank}
                          </span>
                        ) : null}
                        <PlatformIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                        <span className="text-[11px] font-medium leading-tight text-gray-700">
                          {option.name}
                        </span>
                      </button>
                    )
                  })}
                </HorizontalScrollRow>
              </div>
            ))}
            {errors['step1.touchpoints'] ? (
              <p className="text-xs text-red-600">{errors['step1.touchpoints']}</p>
            ) : null}
          </div>
        </section>

        {!showGoalSection ? (
          <p className="text-xs leading-relaxed text-gray-500 md:hidden">
            Pick at least one channel to set your goal.
          </p>
        ) : null}

        <MobileStepRevealPanel open={showGoalSection}>
          <section
            className="space-y-3 rounded-xl border border-gray-200/90 bg-white p-3 ring-1 ring-gray-200/40 sm:p-4"
            aria-labelledby="step1-primary-goal-label"
          >
            <p id="step1-primary-goal-label" className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Primary goal
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { id: 'direct_sales', label: 'Direct sales' },
                { id: 'lead_gen', label: 'Lead generation' },
                { id: 'audience_growth', label: 'Audience growth' },
                { id: 'retention', label: 'Retention' },
              ].map((goal) => {
                const selectedGoal = form.step1.primaryGoal === goal.id
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => onPrimaryGoalChange(goal.id as PrimaryGoal)}
                    className={
                      selectedGoal
                        ? `${touchpointGoalButtonBase} border-2 border-gray-900 bg-gray-50 text-gray-900`
                        : `${touchpointGoalButtonBase} border border-gray-300 bg-white text-gray-700 hover:border-gray-400`
                    }
                  >
                    {goal.label}
                  </button>
                )
              })}
            </div>
            {errors['step1.primaryGoal'] ? (
              <p className="text-xs text-red-600">{errors['step1.primaryGoal']}</p>
            ) : null}
          </section>
        </MobileStepRevealPanel>

        <MobileStepRevealPanel open={showGuideFocusSection}>
          <section
            className="space-y-3 rounded-xl border border-gray-200/90 bg-white p-3 ring-1 ring-gray-200/40 sm:p-4"
            aria-labelledby="step1-guide-focus-label"
          >
            <p id="step1-guide-focus-label" className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              What should this guide help with first?
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {guideFocusOptions.map((option) => {
                const isSelected = form.step1.guideFocus === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onGuideFocusChange(option.id)}
                    className={
                      isSelected
                        ? `${touchpointGoalButtonBase} border-2 border-gray-900 bg-gray-50`
                        : `${touchpointGoalButtonBase} border border-gray-300 bg-white hover:border-gray-400`
                    }
                  >
                    <span className="block text-gray-900">{option.label}</span>
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-gray-500">
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors['step1.guideFocus'] ? (
              <p className="text-xs text-red-600">{errors['step1.guideFocus']}</p>
            ) : null}
          </section>
        </MobileStepRevealPanel>
      </div>
    )
  }

  if (view === 'offerSentence') {
    if (uxVariant.sentenceMode === 'progressive') {
      return (
        <ProgressiveOfferSentence
          form={form}
          errors={errors}
          onCommitStep1Draft={onCommitStep1Draft}
          progressiveMicroDraftFlushRef={progressiveMicroDraftFlushRef}
          progressiveFooterNavRef={progressiveFooterNavRef}
          onProgressiveFooterChange={onProgressiveFooterChange}
          industrySyncKey={industrySyncKey}
          uxVariant={uxVariant}
          offerWheelOptions={offerWheelOptions}
          audienceWheelOptions={audienceWheelOptions}
          deliveryWheelOptions={deliveryWheelOptions}
        />
      )
    }

    const offerWheelValue = form.step1.offer.offerId || STEP1_WHEEL_PLACEHOLDER_ID
    const audienceWheelValue = form.step1.offer.audienceId || STEP1_WHEEL_PLACEHOLDER_ID
    const deliveryWheelValue = form.step1.offer.deliveryId?.trim()
      ? form.step1.offer.deliveryId
      : STEP1_DELIVERY_WHEEL_SKIP_ID

    return (
      <div className="space-y-3">
        <div
          className={
            uxVariant.helperMode === 'sticky'
              ? `sticky top-0 z-20 mx-auto -mx-2 max-w-lg bg-white/95 px-2 backdrop-blur ${
                  wheelHint?.text ? 'py-0.5' : ''
                }`
              : `mx-auto max-w-lg px-2 ${wheelHint?.text ? 'py-0.5' : ''}`
          }
          aria-live="polite"
          aria-relevant="text"
        >
          {wheelHint?.text ? (
            <p className="text-pretty text-center text-sm leading-snug text-gray-600">{wheelHint.text}</p>
          ) : null}
        </div>
        <div
          className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-4 px-1 sm:max-w-3xl sm:gap-x-3 sm:gap-y-6 sm:px-2"
          role="group"
          aria-label="Offer sentence"
        >
          <SentenceSlot label="We provide" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="offer"
              syncKey={industrySyncKey}
              options={offerWheelOptions}
              value={offerWheelValue}
              onChange={(id) => onOfferChange('offerId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Main offer"
              error={errors['step1.offer.offerId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
            />
          </SentenceSlot>
          <SentenceSlot label="for" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="audience"
              syncKey={industrySyncKey}
              options={audienceWheelOptions}
              value={audienceWheelValue}
              onChange={(id) => onOfferChange('audienceId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Who it is for"
              error={errors['step1.offer.audienceId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
            />
          </SentenceSlot>
          <SentenceSlot label="through" layout={uxVariant.sentenceLayout}>
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
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
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
    if (uxVariant.sentenceMode === 'progressive') {
      return (
        <ProgressiveTransformationSentence
          form={form}
          errors={errors}
          onCommitStep1Draft={onCommitStep1Draft}
          progressiveMicroDraftFlushRef={progressiveMicroDraftFlushRef}
          progressiveFooterNavRef={progressiveFooterNavRef}
          onProgressiveFooterChange={onProgressiveFooterChange}
          industrySyncKey={industrySyncKey}
          uxVariant={uxVariant}
          audienceWheelOptions={audienceWheelOptions}
          beforeWheelOptions={beforeWheelOptions}
          afterWheelOptions={afterWheelOptions}
          mechanismWheelOptions={mechanismWheelOptions}
        />
      )
    }

    const audienceWheelValue = form.step1.offer.audienceId || STEP1_WHEEL_PLACEHOLDER_ID
    const beforeWheelValue = form.step1.transformation.beforeId || STEP1_WHEEL_PLACEHOLDER_ID
    const afterWheelValue = form.step1.transformation.afterId || STEP1_WHEEL_PLACEHOLDER_ID
    const mechanismWheelValue = form.step1.transformation.mechanismId || STEP1_WHEEL_PLACEHOLDER_ID

    return (
      <div className="space-y-4">
        <div
          className={
            uxVariant.helperMode === 'sticky'
              ? 'sticky top-0 z-20 mx-auto -mx-2 max-w-lg bg-white/95 px-2 py-0.5 backdrop-blur'
              : 'mx-auto max-w-lg px-2 py-0.5'
          }
          aria-live="polite"
          aria-relevant="text"
        >
          {wheelHint?.text ? (
            <p className="text-pretty text-center text-sm leading-snug text-gray-600">{wheelHint.text}</p>
          ) : (
            <p className="text-pretty text-center text-[11px] font-medium uppercase leading-snug tracking-[0.1em] text-gray-500">
              Same audience as your offer line — adjust if you need to refine it
            </p>
          )}
        </div>
        <div
          className="mx-auto flex w-full max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-4 px-1 sm:max-w-3xl sm:gap-x-3 sm:gap-y-6 sm:px-2"
          role="group"
          aria-label="Transformation sentence"
        >
          <SentenceSlot label="We help" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="t-audience"
              syncKey={industrySyncKey}
              options={audienceWheelOptions}
              value={audienceWheelValue}
              onChange={(id) => onOfferChange('audienceId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Who you help"
              error={errors['step1.offer.audienceId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
            />
          </SentenceSlot>
          <SentenceSlot label="go from" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="before"
              syncKey={industrySyncKey}
              options={beforeWheelOptions}
              value={beforeWheelValue}
              onChange={(id) => onTransformationChange('beforeId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Where customers start"
              error={errors['step1.transformation.beforeId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
            />
          </SentenceSlot>
          <SentenceSlot label="to" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="after"
              syncKey={industrySyncKey}
              options={afterWheelOptions}
              value={afterWheelValue}
              onChange={(id) => onTransformationChange('afterId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="Where they end up"
              error={errors['step1.transformation.afterId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
            />
          </SentenceSlot>
          <SentenceSlot label="through" layout={uxVariant.sentenceLayout}>
            <SlotScrollWheel
              instanceId="mechanism"
              syncKey={industrySyncKey}
              options={mechanismWheelOptions}
              value={mechanismWheelValue}
              onChange={(id) => onTransformationChange('mechanismId', id === STEP1_WHEEL_PLACEHOLDER_ID ? '' : id)}
              ariaLabel="What makes the change happen"
              error={errors['step1.transformation.mechanismId']}
              onCenteredDescriptionChange={onWheelDescription}
              density={uxVariant.wheelDensity}
              typeface={uxVariant.wheelTypeface}
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

  if (view === 'businessDescription') {
    const businessDescription = form.step1.businessDescription ?? ''
    const charCount = businessDescription.length
    const SOFT_MIN = 300
    const SOFT_MAX = 800
    const belowSoftMin = charCount > 0 && charCount < SOFT_MIN
    return (
      <div className="space-y-2">
        <TextArea
          id="businessDescription"
          label="Describe your business in plain terms"
          value={businessDescription}
          onChange={(value) => onChange('businessDescription', value)}
          placeholder="What you do, who it’s for, and how it typically works. The more specific, the better — your kit will sound like your actual business instead of a generic version of it."
          rows={7}
          error={errors['step1.businessDescription']}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={belowSoftMin ? 'text-gray-500' : 'text-transparent'} aria-live="polite">
            A few extra sentences make the AI sharper.
          </span>
          <span
            className={
              charCount > SOFT_MAX
                ? 'text-amber-600'
                : charCount >= SOFT_MIN
                  ? 'text-gray-500'
                  : 'text-gray-400'
            }
          >
            {charCount} / {SOFT_MAX}
          </span>
        </div>
      </div>
    )
  }

  return null
}
