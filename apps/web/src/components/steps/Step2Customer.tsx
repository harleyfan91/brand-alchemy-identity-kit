import type { IdentityKitForm, StepErrors } from '../../types'
import { fallbackArchetypes, industryArchetypes } from '../../data/archetypes'
import { ArchetypeCard } from '../ui/ArchetypeCard'
import { TextArea } from '../ui/TextArea'

interface Step2CustomerProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onArchetypeChange: (value: string) => void
  onProFieldChange: (field: 'painPoints' | 'desiredOutcomes', value: string) => void
}

export function Step2Customer({
  form,
  isPro,
  errors,
  onArchetypeChange,
  onProFieldChange,
}: Step2CustomerProps) {
  const options = industryArchetypes[form.step1.industry] ?? fallbackArchetypes

  return (
    <>
      <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
        Pick the archetype that best matches your buyer. Think about who walks through your door (or
        lands on your site) most often.
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
