import type { IdentityKitForm, StepErrors } from '../../types'
import { TextArea } from '../ui/TextArea'

interface Step5StoryProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (field: keyof IdentityKitForm['step5'], value: string) => void
}

export function Step5Story({ form, errors, onChange }: Step5StoryProps) {
  return (
    <>
      <TextArea
        id="originSummary"
        label="How did your business start?"
        value={form.step5.originSummary}
        onChange={(value) => onChange('originSummary', value)}
        placeholder="Share your origin story in a few sentences."
        error={errors['step5.originSummary']}
      />
      <TextArea
        id="motivation"
        label="What motivates this brand?"
        value={form.step5.motivation}
        onChange={(value) => onChange('motivation', value)}
        placeholder="What keeps you committed to this work?"
        error={errors['step5.motivation']}
      />
    </>
  )
}
