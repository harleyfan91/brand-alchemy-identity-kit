import type { IdentityKitForm, StepErrors } from '../../types'
import { CheckboxGroup } from '../ui/CheckboxGroup'
import { TextArea } from '../ui/TextArea'

interface Step4ValuesProps {
  form: IdentityKitForm
  errors: StepErrors
  onValuesChange: (values: string[]) => void
  onMissionChange: (value: string) => void
}

const valueOptions = [
  { value: 'integrity', label: 'Integrity' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'clarity', label: 'Clarity' },
  { value: 'craftsmanship', label: 'Craftsmanship' },
  { value: 'inclusion', label: 'Inclusion' },
  { value: 'growth', label: 'Growth' },
]

export function Step4Values({ form, errors, onValuesChange, onMissionChange }: Step4ValuesProps) {
  return (
    <>
      <CheckboxGroup
        label="Select your core values"
        selected={form.step4.values}
        options={valueOptions}
        onChange={onValuesChange}
        error={errors['step4.values']}
      />
      <TextArea
        id="missionStatement"
        label="Mission statement"
        value={form.step4.missionStatement}
        onChange={onMissionChange}
        placeholder="What are you here to change for your customers?"
        error={errors['step4.missionStatement']}
      />
    </>
  )
}
