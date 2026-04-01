import { stepMeta } from '../../data/steps'
import { fallbackArchetypes, industryArchetypes } from '../../data/archetypes'
import type { IdentityKitForm, StepIndex } from '../../types'
import { snapVoiceValue } from '../../utils/voiceSliders'
import { Button } from '../ui/Button'

interface ReviewScreenProps {
  form: IdentityKitForm
  onEditStep: (step: StepIndex) => void
  onContinue: () => void
}

export function ReviewScreen({ form, onEditStep, onContinue }: ReviewScreenProps) {
  const tierReviewMessage =
    form.tier === 'pro'
      ? 'Pro checkout unlocks AI-personalized draft outputs with deeper voice and strategy tailoring.'
      : 'Core checkout unlocks guided, template-based draft outputs shaped by your selections.'

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

  const originLabels: Record<string, string> = {
    side_hustle_leap: 'The Side-Hustle Leap',
    industry_insider: 'The Industry Insider',
    problem_solver: 'The Problem Solver',
    creative_calling: 'The Creative Calling',
    fresh_start: 'The Fresh Start',
  }

  const paletteLabels: Record<string, string> = {
    midnight_luxe: 'Midnight Luxe',
    earthy_warmth: 'Earthy Warmth',
    ocean_calm: 'Ocean Calm',
    sunset_bold: 'Sunset Bold',
    forest_deep: 'Forest Deep',
    minimal_light: 'Minimal Light',
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

  const sections = [
    [
      ['Business name', form.step1.businessName],
      ['Offer', form.step1.offer],
      ['Industry', industryLabels[form.step1.industry] ?? form.step1.industry],
      ['Stage', form.step1.stage],
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
      ['Selected palette', paletteLabels[form.step6.selectedPalette] ?? form.step6.selectedPalette],
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
    ],
    [
      ['Competitors', form.step7.competitors.join(', ')],
      ...(form.tier === 'pro' && showOptional(form.step7.differentiation)
        ? ([['Differentiation', form.step7.differentiation ?? '']] as [string, string][])
        : []),
    ],
  ] as [string, string][][]

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-xl space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header>
          <p className="text-sm font-medium text-zinc-500">Review</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Review your responses before checkout
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            You can edit any section below before continuing to secure checkout.
          </p>
          <p className="mt-1 text-xs text-zinc-500">{tierReviewMessage}</p>
        </header>

        <div className="space-y-3">
          {stepMeta.map((step, index) => (
            <section key={step.id} className="rounded-2xl border border-zinc-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Step {step.id}: {step.title}
                </h2>
                <Button variant="secondary" onClick={() => onEditStep(step.id as StepIndex)}>
                  Edit
                </Button>
              </div>
              <dl className="space-y-2">
                {sections[index].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
                    <dd className="text-sm text-zinc-800">{value || 'Not provided'}</dd>
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
