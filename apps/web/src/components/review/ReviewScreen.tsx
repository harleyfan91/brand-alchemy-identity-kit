import { stepMeta } from '../../data/steps'
import type { IdentityKitForm, StepIndex } from '../../types'
import { Button } from '../ui/Button'

interface ReviewScreenProps {
  form: IdentityKitForm
  onEditStep: (step: StepIndex) => void
  onContinue: () => void
}

export function ReviewScreen({ form, onEditStep, onContinue }: ReviewScreenProps) {
  const toneLabel =
    form.step3.tone === 'friendly'
      ? 'Friendly and conversational'
      : form.step3.tone === 'professional'
        ? 'Professional and polished'
        : form.step3.tone === 'bold'
          ? 'Bold and direct'
          : ''

  const sections = [
    [
      ['Business name', form.step1.businessName],
      ['Offer', form.step1.offer],
      ['Industry', form.step1.industry],
      ['Stage', form.step1.stage],
    ],
    [
      ['Customer archetype', form.step2.customerArchetype],
      ['Pain points', form.step2.painPoints],
      ['Desired outcomes', form.step2.desiredOutcomes],
    ],
    [
      ['Personality picks', form.step3.personalityAdjectives.join(', ')],
      ['Tone', toneLabel],
      ['Custom voice notes', form.step3.customVoiceNotes ?? ''],
    ],
    [
      ['Values', form.step4.values.join(', ')],
      ['Mission statement', form.step4.missionStatement],
    ],
    [
      ['Origin archetype', form.step5.originArchetype],
      ['Origin summary', form.step5.originSummary],
      ['Motivation', form.step5.motivation],
    ],
    [
      ['Selected palette', form.step6.selectedPalette],
      ['Selected style', form.step6.selectedStyle],
      ['Color notes', form.step6.colorMoodNotes],
      ['Style notes', form.step6.styleNotes],
      ['Reference filename', form.step6.referenceUploadName ?? 'None'],
    ],
    [
      ['Industry', form.step7.industry],
      ['Competitors', form.step7.competitors.join(', ')],
      ['Differentiation', form.step7.differentiation],
    ],
  ]

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
