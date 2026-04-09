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
  visibleSections?: Array<'archetype' | 'painPoints' | 'desiredOutcomes'>
}

export function Step2Customer({
  form,
  isPro,
  errors,
  onArchetypeChange,
  onProFieldChange,
  visibleSections,
}: Step2CustomerProps) {
  const options = industryArchetypes[form.step1.industry] ?? fallbackArchetypes
  const isVisible = (section: NonNullable<Step2CustomerProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  return (
    <>
      {isVisible('archetype') ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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
        </>
      ) : null}
      {isPro && isVisible('painPoints') ? (
        <TextArea
          id="painPoints"
          label="Biggest customer pain points"
          value={form.step2.painPoints ?? ''}
          onChange={(value) => onProFieldChange('painPoints', value)}
          placeholder="Before: overwhelmed by inconsistent leads. After: clear pipeline and confidence."
          error={errors['step2.painPoints']}
        />
      ) : null}
      {isPro && isVisible('desiredOutcomes') ? (
        <TextArea
          id="desiredOutcomes"
          label="Desired customer outcomes"
          value={form.step2.desiredOutcomes ?? ''}
          onChange={(value) => onProFieldChange('desiredOutcomes', value)}
          placeholder="They want a premium brand that attracts better-fit clients."
          error={errors['step2.desiredOutcomes']}
        />
      ) : null}
    </>
  )
}
