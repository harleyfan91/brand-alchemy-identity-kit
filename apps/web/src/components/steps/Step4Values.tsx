import type { IdentityKitForm, StepErrors } from '../../types'
import { ArchetypeCard } from '../ui/ArchetypeCard'
import { TextArea } from '../ui/TextArea'

interface Step4ValuesProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onValuesChange: (values: string[]) => void
  onMissionChange: (value: string) => void
  visibleSections?: Array<'values' | 'missionStatement'>
}

const valueOptions = [
  {
    value: 'integrity',
    label: 'Integrity',
    subtitle: 'Trust and honesty first',
    icon: '◌',
  },
  {
    value: 'creativity',
    label: 'Creativity',
    subtitle: 'Fresh and expressive ideas',
    icon: '✦',
  },
  {
    value: 'clarity',
    label: 'Clarity',
    subtitle: 'Simple, direct communication',
    icon: '◎',
  },
  {
    value: 'craftsmanship',
    label: 'Craftsmanship',
    subtitle: 'Detail and quality in delivery',
    icon: '◇',
  },
  {
    value: 'inclusion',
    label: 'Inclusion',
    subtitle: 'Welcoming and accessible',
    icon: '◍',
  },
  {
    value: 'growth',
    label: 'Growth',
    subtitle: 'Always improving and evolving',
    icon: '↗',
  },
  {
    value: 'innovation',
    label: 'Innovation',
    subtitle: 'Forward-thinking mindset',
    icon: '△',
  },
  {
    value: 'authenticity',
    label: 'Authenticity',
    subtitle: 'Human and real voice',
    icon: '☉',
  },
]

export function Step4Values({
  form,
  isPro,
  errors,
  onValuesChange,
  onMissionChange,
  visibleSections,
}: Step4ValuesProps) {
  const isVisible = (section: NonNullable<Step4ValuesProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  return (
    <>
      {isVisible('values') ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-gray-900">
            Select 2-4 core values
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {valueOptions.map((option) => {
              const selected = form.step4.values.includes(option.value)
              return (
                <ArchetypeCard
                  key={option.value}
                  title={option.label}
                  description={option.subtitle}
                  icon={option.icon}
                  compact
                  selected={selected}
                  onClick={() => {
                    if (selected) {
                      onValuesChange(form.step4.values.filter((value) => value !== option.value))
                      return
                    }
                    if (form.step4.values.length >= 4) return
                    onValuesChange([...form.step4.values, option.value])
                  }}
                />
              )
            })}
          </div>
          {errors['step4.values'] ? <p className="text-xs text-red-600">{errors['step4.values']}</p> : null}
        </fieldset>
      ) : null}
      {isPro && isVisible('missionStatement') ? (
        <TextArea
          id="missionStatement"
          label="Mission statement"
          value={form.step4.missionStatement ?? ''}
          onChange={onMissionChange}
          placeholder="What are you here to change for your customers?"
        />
      ) : null}
    </>
  )
}
