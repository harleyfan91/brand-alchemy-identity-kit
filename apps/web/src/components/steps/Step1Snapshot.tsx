import type { BrandNarrator, IdentityKitForm, StepErrors } from '../../types'
import { narratorOptions } from '../../data/narratorOptions'
import { getStep1OfferPlaceholder, getStep1TransformationPlaceholder } from '../../data/step1Placeholders'
import { ArchetypeCard } from '../ui/ArchetypeCard'
import { InputField } from '../ui/InputField'
import { SelectField } from '../ui/SelectField'

interface Step1SnapshotProps {
  form: IdentityKitForm
  errors: StepErrors
  onChange: (field: keyof IdentityKitForm['step1'], value: string) => void
  onNarratorChange: (value: BrandNarrator) => void
}

const industryOptions = [
  { value: 'creative_services', label: 'Creative Services' },
  { value: 'health_wellness', label: 'Health and Wellness' },
  { value: 'beauty_personal_care', label: 'Beauty and Personal Care' },
  { value: 'fitness_sports', label: 'Fitness and Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'food_beverage', label: 'Food and Beverage' },
  { value: 'home_services', label: 'Home Services' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal_professional_services', label: 'Legal and Professional Services' },
  { value: 'consulting_coaching', label: 'Consulting and Coaching' },
  { value: 'construction_trades', label: 'Construction and Trades' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'photography_media', label: 'Photography and Media' },
  { value: 'pet_services', label: 'Pet Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'nonprofit_community', label: 'Nonprofit and Community' },
  { value: 'other', label: 'Other' },
]

export function Step1Snapshot({ form, errors, onChange, onNarratorChange }: Step1SnapshotProps) {
  const offerPlaceholder = getStep1OfferPlaceholder(form.step1.industry)
  const transformationPlaceholder = getStep1TransformationPlaceholder(form.step1.industry)

  return (
    <>
      <InputField
        id="businessName"
        label="Business name"
        value={form.step1.businessName}
        onChange={(value) => onChange('businessName', value)}
        placeholder="e.g. Sunrise Bakery, Northside Plumbing"
        error={errors['step1.businessName']}
      />
      <SelectField
        id="industry"
        label="What industry are you in?"
        value={form.step1.industry}
        onChange={(value) => onChange('industry', value)}
        options={industryOptions}
        error={errors['step1.industry']}
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
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-900">
          When customers find you, what leads?
        </legend>
        <p className="text-xs leading-snug text-zinc-600">
          Choose the description that fits your business best.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {narratorOptions.map((option) => (
            <ArchetypeCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              compact
              selected={form.step1.brandNarrator === option.id}
              onClick={() => onNarratorChange(option.id)}
            />
          ))}
        </div>
        {errors['step1.brandNarrator'] ? (
          <p className="text-xs text-red-600">{errors['step1.brandNarrator']}</p>
        ) : null}
      </fieldset>
      <InputField
        id="offer"
        label="What do you offer?"
        value={form.step1.offer}
        onChange={(value) => onChange('offer', value)}
        placeholder={offerPlaceholder}
        error={errors['step1.offer']}
      />
      <InputField
        id="transformation"
        label="What change do you help customers achieve?"
        value={form.step1.transformation}
        onChange={(value) => onChange('transformation', value)}
        placeholder={transformationPlaceholder}
        error={errors['step1.transformation']}
      />
    </>
  )
}
