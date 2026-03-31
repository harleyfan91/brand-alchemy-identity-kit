import type { IdentityKitForm, StepErrors } from '../../types'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'

interface Step1SnapshotProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onChange: (field: keyof IdentityKitForm['step1'], value: string) => void
}

export function Step1Snapshot({ form, isPro, errors, onChange }: Step1SnapshotProps) {
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
      <SelectField
        id="targetCustomer"
        label="Which audience sounds most like your customer?"
        value={form.step1.targetCustomer}
        onChange={(value) => onChange('targetCustomer', value)}
        options={[
          { value: 'creative_professionals', label: 'Creative professionals' },
          { value: 'small_business_owners', label: 'Small business owners' },
          { value: 'health_wellness_seekers', label: 'Health and wellness seekers' },
          { value: 'tech_savvy_consumers', label: 'Tech-savvy consumers' },
          { value: 'parents_families', label: 'Parents and families' },
          { value: 'other', label: 'Other' },
        ]}
        error={errors['step1.targetCustomer']}
      />
      {isPro ? (
        <InputField
          id="targetCustomerNotes"
          label="Optional: add extra audience detail"
          value={form.step1.targetCustomerNotes ?? ''}
          onChange={(value) => onChange('targetCustomerNotes', value)}
          placeholder="Who exactly are you trying to attract?"
        />
      ) : null}
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
