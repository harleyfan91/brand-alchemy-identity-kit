import type { IdentityKitForm, StepErrors } from '../../types'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'

interface Step1SnapshotProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (field: keyof IdentityKitForm['step1'], value: string) => void
}

export function Step1Snapshot({ form, errors, onChange }: Step1SnapshotProps) {
  return (
    <>
      <InputField
        id="businessName"
        label="Business name"
        value={form.step1.businessName}
        onChange={(value) => onChange('businessName', value)}
        placeholder="Brand Alchemy"
        error={errors['step1.businessName']}
      />
      <InputField
        id="offer"
        label="What do you offer?"
        value={form.step1.offer}
        onChange={(value) => onChange('offer', value)}
        placeholder="Brand strategy and identity design"
        error={errors['step1.offer']}
      />
      <InputField
        id="targetCustomer"
        label="Who is your target customer?"
        value={form.step1.targetCustomer}
        onChange={(value) => onChange('targetCustomer', value)}
        placeholder="Early-stage founders in creative industries"
        error={errors['step1.targetCustomer']}
      />
      <SelectField
        id="stage"
        label="Business stage"
        value={form.step1.stage}
        onChange={(value) => onChange('stage', value)}
        options={[
          { value: 'idea', label: 'Idea stage' },
          { value: 'new', label: 'New business' },
          { value: 'growing', label: 'Growing' },
          { value: 'established', label: 'Established' },
        ]}
        error={errors['step1.stage']}
      />
    </>
  )
}
