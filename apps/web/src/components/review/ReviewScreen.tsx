import { canonicalPaletteId } from '@identity-kit/shared'

import { PALETTE_LABELS } from '../../data/visualDirection'
import { stepMeta } from '../../data/steps'
import { fallbackArchetypes, industryArchetypes } from '../../data/archetypes'
import { narratorLabels } from '../../data/narratorOptions'
import { originLabels } from '../../data/storyOptions'
import type { IdentityKitForm, StepIndex } from '../../types'
import { getTouchpointLabel } from '../../types'
import {
  assembleOfferLine,
  assembleTransformationLine,
  resolveOfferSelections,
  resolveTransformationSelections,
} from '../../utils/step1ControlledCopy'
import { snapVoiceValue } from '../../utils/voiceSliders'
import { Button } from '../ui/Button'

interface ReviewScreenProps {
  form: IdentityKitForm
  onEditStep: (step: StepIndex) => void
  onContinue: () => void
}

const teaserAssets = ['Brand Brief', 'Style Guide', 'Voice & Content Playbook', '30-Day Quick Start Checklist'] as const

export function ReviewScreen({ form, onEditStep, onContinue }: ReviewScreenProps) {
  const industryLabels: Record<string, string> = {
    creative_services: 'Creative Services',
    health_wellness: 'Health and Wellness',
    beauty_personal_care: 'Beauty and Personal Care',
    fitness_sports: 'Fitness and Sports',
    technology: 'Technology',
    food_beverage: 'Food and Beverage',
    home_services: 'Home Services',
    real_estate: 'Real Estate',
    education: 'Education',
    finance: 'Finance',
    legal_professional_services: 'Legal and Professional Services',
    consulting_coaching: 'Consulting and Coaching',
    construction_trades: 'Construction and Trades',
    automotive: 'Automotive',
    photography_media: 'Photography and Media',
    pet_services: 'Pet Services',
    retail: 'Retail',
    nonprofit_community: 'Nonprofit and Community',
    other: 'Other',
  }

  const styleLabels: Record<string, string> = {
    clean_minimal: 'Clean and Minimal',
    bold_graphic: 'Bold and Graphic',
    organic_natural: 'Organic and Natural',
    luxe_refined: 'Luxe and Refined',
  }
  const customerArchetypeLabels = Object.fromEntries(
    [...Object.values(industryArchetypes).flat(), ...fallbackArchetypes].map((option) => [option.id, option.title]),
  ) as Record<string, string>

  const toneLabel =
    form.step3.tonePreset === 'friendly'
      ? 'Friendly'
      : form.step3.tonePreset === 'professional'
        ? 'Professional'
        : form.step3.tonePreset === 'bold'
          ? 'Bold'
          : 'Custom'
  const primaryGoalLabels: Record<string, string> = {
    direct_sales: 'Direct sales',
    lead_gen: 'Lead generation',
    audience_growth: 'Audience growth',
    retention: 'Retention',
  }

  const describeSlider = (
    value: number,
    labels: { low: string; mid: string; high: string },
  ) => {
    const v = snapVoiceValue(value)
    if (v <= 25) return labels.low
    if (v >= 75) return labels.high
    return labels.mid
  }

  const showOptional = (value?: string) => Boolean(value && value.trim())
  const assembledOffer = assembleOfferLine(form)
  const assembledTransformation = assembleTransformationLine(form)
  const { offerLabel, audienceLabel, deliveryLabel } = resolveOfferSelections(form)
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(form)

  const sections = [
    [
      ['Business name', form.step1.businessName],
      ['Offer', assembledOffer],
      ['Main offer', offerLabel],
      ["Who it's for", audienceLabel],
      ...(showOptional(deliveryLabel)
        ? ([['How it is delivered', deliveryLabel]] as [string, string][])
        : []),
      ['Customer transformation', assembledTransformation],
      ['Before', beforeLabel],
      ['After', afterLabel],
      ['Through', mechanismLabel],
      ['Industry', industryLabels[form.step1.industry] ?? form.step1.industry],
      ['Stage', form.step1.stage],
      ['Brand narrator', narratorLabels[form.step1.brandNarrator] ?? form.step1.brandNarrator],
      ['Primary goal', primaryGoalLabels[form.step1.primaryGoal] ?? form.step1.primaryGoal],
      [
        'Relevant touchpoints',
        (form.step1.touchpoints ?? []).map((id, index) => `${index + 1}) ${getTouchpointLabel(id)}`).join(', '),
      ],
    ],
    [
      [
        'Customer archetype',
        customerArchetypeLabels[form.step2.customerArchetype] ?? form.step2.customerArchetype,
      ],
      ...(form.tier === 'pro' && showOptional(form.step2.painPoints)
        ? ([['Pain points', form.step2.painPoints ?? '']] as [string, string][])
        : []),
      ...(form.tier === 'pro' && showOptional(form.step2.desiredOutcomes)
        ? ([['Desired outcomes', form.step2.desiredOutcomes ?? '']] as [string, string][])
        : []),
    ],
    [
      ['Voice preset', toneLabel],
      [
        'Formality',
        describeSlider(form.step3.voiceSliders.formality, {
          low: 'Formal',
          mid: 'Balanced',
          high: 'Conversational',
        }),
      ],
      [
        'Energy',
        describeSlider(form.step3.voiceSliders.energy, {
          low: 'Calm',
          mid: 'Balanced',
          high: 'Energetic',
        }),
      ],
      [
        'Directness',
        describeSlider(form.step3.voiceSliders.directness, {
          low: 'Gentle',
          mid: 'Balanced',
          high: 'Direct',
        }),
      ],
      [
        'Warmth',
        describeSlider(form.step3.voiceSliders.warmth, {
          low: 'Reserved',
          mid: 'Balanced',
          high: 'Warm',
        }),
      ],
      [
        'Playfulness',
        describeSlider(form.step3.voiceSliders.playfulness, {
          low: 'Serious',
          mid: 'Balanced',
          high: 'Playful',
        }),
      ],
      ...(form.tier === 'pro' && showOptional(form.step3.customVoiceNotes)
        ? ([['Custom voice notes', form.step3.customVoiceNotes ?? '']] as [string, string][])
        : []),
    ],
    [
      ['Values', form.step4.values.join(', ')],
      ...(form.tier === 'pro' && showOptional(form.step4.missionStatement)
        ? ([['Mission statement', form.step4.missionStatement ?? '']] as [string, string][])
        : []),
    ],
    [
      ['Origin archetype', originLabels[form.step5.originArchetype] ?? form.step5.originArchetype],
      ...(form.tier === 'pro' && showOptional(form.step5.originSummary)
        ? ([['Origin summary', form.step5.originSummary ?? '']] as [string, string][])
        : []),
      ...(form.tier === 'pro' && showOptional(form.step5.motivation)
        ? ([['Motivation', form.step5.motivation ?? '']] as [string, string][])
        : []),
    ],
    [
      ['Selected palette', PALETTE_LABELS[canonicalPaletteId(form.step6.selectedPalette)] ?? form.step6.selectedPalette],
      ['Selected style', styleLabels[form.step6.selectedStyle] ?? form.step6.selectedStyle],
      ...(form.tier === 'pro' && showOptional(form.step6.colorMoodNotes)
        ? ([['Color notes', form.step6.colorMoodNotes ?? '']] as [string, string][])
        : []),
      ...(form.tier === 'pro' && showOptional(form.step6.styleNotes)
        ? ([['Style notes', form.step6.styleNotes ?? '']] as [string, string][])
        : []),
      ...(form.tier === 'pro' && showOptional(form.step6.referenceUploadName)
        ? ([['Reference filename', form.step6.referenceUploadName ?? '']] as [string, string][])
        : []),
      ...(form.tier === 'pro' && showOptional(form.step6.existingTypeface)
        ? ([['Fonts in use', form.step6.existingTypeface ?? '']] as [string, string][])
        : []),
    ],
    [
      ['Competitors', form.step7.competitors.join(', ')],
      ...(form.tier === 'pro' && showOptional(form.step7.differentiation)
        ? ([['Differentiation', form.step7.differentiation ?? '']] as [string, string][])
        : []),
    ],
  ] as [string, string][][]

  return (
    <main className="min-h-screen bg-[color:var(--ba-color-page-bg)] px-3 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-xl space-y-5 rounded-3xl border border-gray-200 bg-white px-4 py-6 sm:p-6 shadow-sm">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Review</p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Review your answers
          </h1>
        </header>

        <section>
          <div className="relative -mx-1">
            <div className="grid grid-cols-2 gap-3">
              {teaserAssets.map((asset) => (
                <div
                  key={asset}
                  className="flex min-h-[128px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60 p-3.5"
                  aria-hidden
                >
                  <p className="text-xs font-semibold leading-4 text-gray-800">{asset}</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="h-2.5 w-5/6 rounded bg-gray-200/90 blur-[1px]" />
                    <div className="h-2.5 w-2/3 rounded bg-gray-200/85 blur-[1px]" />
                    <div className="h-2.5 w-3/4 rounded bg-gray-200/85 blur-[1px]" />
                  </div>
                </div>
              ))}
            </div>

            {form.tier === 'pro' ? (
              <div
                className="absolute left-1/2 top-1/2 z-20 flex min-h-[128px] w-[47%] -translate-x-1/2 -translate-y-[58%] flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 shadow-md"
                aria-hidden
              >
                <p className="text-xs font-semibold leading-4 text-gray-900">Content Starter Pack</p>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2.5 w-5/6 rounded bg-gray-200/90 blur-[1px]" />
                  <div className="h-2.5 w-2/3 rounded bg-gray-200/85 blur-[1px]" />
                  <div className="h-2.5 w-3/4 rounded bg-gray-200/85 blur-[1px]" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Your kit includes</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Business</p>
              <p className="mt-1 text-sm text-gray-900">{form.step1.businessName || 'Your business'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Voice</p>
              <p className="mt-1 text-sm text-gray-900">{toneLabel}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Palette</p>
              <p className="mt-1 text-sm text-gray-900">
                {(PALETTE_LABELS[canonicalPaletteId(form.step6.selectedPalette)] ?? form.step6.selectedPalette) || 'Not chosen yet'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Style</p>
              <p className="mt-1 text-sm text-gray-900">
                {(styleLabels[form.step6.selectedStyle] ?? form.step6.selectedStyle) || 'Not chosen yet'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600">
            This is the profile that will shape your kit. You can still edit any section below.
          </p>
        </section>

        <div className="space-y-3">
          {stepMeta.map((step, index) => (
            <section key={step.id} className="rounded-2xl border border-gray-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  Step {step.id}: {step.title}
                </h2>
                <Button variant="secondary" onClick={() => onEditStep(step.id as StepIndex)}>
                  Edit
                </Button>
              </div>
              <dl className="space-y-2">
                {sections[index].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">{label}</dt>
                    <dd className="text-sm text-gray-800">{value || 'Not provided'}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <Button fullWidth onClick={onContinue}>
          Continue to Secure Checkout
        </Button>
      </section>
    </main>
  )
}
