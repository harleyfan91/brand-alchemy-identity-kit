import type { IdentityKitForm, StepErrors } from '../../types'
import { CheckboxGroup } from '../ui/CheckboxGroup'
import { TextArea } from '../ui/TextArea'

interface Step3PersonalityProps {
  form: IdentityKitForm
  errors: StepErrors
  onAdjectivesChange: (values: string[]) => void
  onToneChange: (value: string) => void
}

const adjectiveOptions = [
  { value: 'confident', label: 'Confident' },
  { value: 'warm', label: 'Warm' },
  { value: 'playful', label: 'Playful' },
  { value: 'premium', label: 'Premium' },
  { value: 'bold', label: 'Bold' },
  { value: 'clear', label: 'Clear' },
]

export function Step3Personality({
  form,
  errors,
  onAdjectivesChange,
  onToneChange,
}: Step3PersonalityProps) {
  return (
    <>
      <CheckboxGroup
        label="Pick your brand adjectives"
        selected={form.step3.personalityAdjectives}
        options={adjectiveOptions}
        onChange={onAdjectivesChange}
        error={errors['step3.personalityAdjectives']}
      />
      <TextArea
        id="tone"
        label="How should your voice sound?"
        value={form.step3.tone}
        onChange={onToneChange}
        placeholder="Example: clear, empathetic, and practical."
        error={errors['step3.tone']}
      />
    </>
  )
}
