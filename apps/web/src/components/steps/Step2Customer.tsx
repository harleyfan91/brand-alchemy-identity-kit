import type { IdentityKitForm, StepErrors } from '../../types'
import { ArchetypeCard } from '../ui/ArchetypeCard'
import { TextArea } from '../ui/TextArea'

interface Step2CustomerProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onArchetypeChange: (value: string) => void
  onProFieldChange: (field: 'painPoints' | 'desiredOutcomes', value: string) => void
}

const options = [
  {
    id: 'overwhelmed_starter',
    title: 'The Overwhelmed Starter',
    description: 'New to business and needs clarity.',
    icon: '◎',
  },
  {
    id: 'growth_ready_scaler',
    title: 'The Growth-Ready Scaler',
    description: 'Has traction and needs polish.',
    icon: '◉',
  },
  {
    id: 'creative_visionary',
    title: 'The Creative Visionary',
    description: 'Knows their taste and needs structure.',
    icon: '✦',
  },
  {
    id: 'budget_builder',
    title: 'The Budget-Conscious Builder',
    description: 'Values efficiency and ROI.',
    icon: '◌',
  },
  {
    id: 'purpose_founder',
    title: 'The Purpose-Driven Founder',
    description: 'Mission-first and impact-focused.',
    icon: '◇',
  },
  {
    id: 'rebrand_seeker',
    title: 'The Rebrand Seeker',
    description: 'Needs a refreshed brand identity.',
    icon: '◈',
  },
]

export function Step2Customer({
  form,
  isPro,
  errors,
  onArchetypeChange,
  onProFieldChange,
}: Step2CustomerProps) {
  return (
    <>
      <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
        Pick the archetype that best matches your buyer. This refers to who buys from your business,
        not your business type. These are starter placeholders we can tailor to your niche next.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <ArchetypeCard
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={form.step2.customerArchetype === option.id}
            onClick={() => onArchetypeChange(option.id)}
          />
        ))}
      </div>
      {errors['step2.customerArchetype'] ? (
        <p className="text-xs text-red-600">{errors['step2.customerArchetype']}</p>
      ) : null}
      {isPro ? (
        <>
          <TextArea
            id="painPoints"
            label="Optional: biggest customer pain points"
            value={form.step2.painPoints ?? ''}
            onChange={(value) => onProFieldChange('painPoints', value)}
            placeholder="What do they struggle with most?"
          />
          <TextArea
            id="desiredOutcomes"
            label="Optional: desired customer outcomes"
            value={form.step2.desiredOutcomes ?? ''}
            onChange={(value) => onProFieldChange('desiredOutcomes', value)}
            placeholder="What result are they hoping for?"
          />
        </>
      ) : null}
    </>
  )
}
