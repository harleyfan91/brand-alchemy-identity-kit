import type { IdentityKitForm, StepErrors } from '../../types'
import { TextArea } from '../ui/TextArea'

interface Step2CustomerProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (field: keyof IdentityKitForm['step2'], value: string) => void
}

export function Step2Customer({ form, errors, onChange }: Step2CustomerProps) {
  return (
    <>
      <TextArea
        id="audienceDescription"
        label="Describe your audience"
        value={form.step2.audienceDescription}
        onChange={(value) => onChange('audienceDescription', value)}
        placeholder="Who they are, where they are, and what they care about."
        error={errors['step2.audienceDescription']}
      />
      <TextArea
        id="painPoints"
        label="Top pain points"
        value={form.step2.painPoints}
        onChange={(value) => onChange('painPoints', value)}
        placeholder="What is frustrating or blocking them right now?"
        error={errors['step2.painPoints']}
      />
      <TextArea
        id="desiredOutcomes"
        label="Desired outcomes"
        value={form.step2.desiredOutcomes}
        onChange={(value) => onChange('desiredOutcomes', value)}
        placeholder="What transformation are they trying to achieve?"
        error={errors['step2.desiredOutcomes']}
      />
    </>
  )
}
