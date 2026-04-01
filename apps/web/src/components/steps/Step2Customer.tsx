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
      <p className="text-xs leading-snug text-zinc-600">
        Pick the buyer who shows up most often. Tap one; details appear when selected.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <ArchetypeCard
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            compact
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
            label="Biggest customer pain points"
            value={form.step2.painPoints ?? ''}
            onChange={(value) => onProFieldChange('painPoints', value)}
            placeholder="Before: overwhelmed by inconsistent leads. After: clear pipeline and confidence."
            error={errors['step2.painPoints']}
          />
          <TextArea
            id="desiredOutcomes"
            label="Desired customer outcomes"
            value={form.step2.desiredOutcomes ?? ''}
            onChange={(value) => onProFieldChange('desiredOutcomes', value)}
            placeholder="They want a premium brand that attracts better-fit clients."
            error={errors['step2.desiredOutcomes']}
          />
          <p className="text-xs text-zinc-500">Add at least one field for stronger personalization.</p>
        </>
      ) : null}
    </>
  )
}
