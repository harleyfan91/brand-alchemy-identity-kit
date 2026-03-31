import type { IdentityKitForm, StepErrors } from '../../types'
import { InputField } from '../ui/InputField'
import { TextArea } from '../ui/TextArea'

interface Step7IndustryProps {
  form: IdentityKitForm
  errors: StepErrors
  onIndustryChange: (value: string) => void
  onCompetitorsChange: (value: string) => void
  onDifferentiationChange: (value: string) => void
}

export function Step7Industry({
  form,
  errors,
  onIndustryChange,
  onCompetitorsChange,
  onDifferentiationChange,
}: Step7IndustryProps) {
  return (
    <>
      <InputField
        id="industry"
        label="Industry"
        value={form.step7.industry}
        onChange={onIndustryChange}
        placeholder="Brand strategy consultancy"
        error={errors['step7.industry']}
      />
      <TextArea
        id="competitors"
        label="Competitors or alternatives"
        value={form.step7.competitors}
        onChange={onCompetitorsChange}
        placeholder="List key competitors or alternatives your audience considers."
        error={errors['step7.competitors']}
      />
      <TextArea
        id="differentiation"
        label="What makes you different?"
        value={form.step7.differentiation}
        onChange={onDifferentiationChange}
        placeholder="What is uniquely true about your approach or offer?"
        error={errors['step7.differentiation']}
      />
    </>
  )
}
