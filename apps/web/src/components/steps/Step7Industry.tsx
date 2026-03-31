import type { IdentityKitForm, StepErrors } from '../../types'
import { SelectField } from '../ui/SelectField'
import { TextArea } from '../ui/TextArea'
import { Button } from '../ui/Button'

interface Step7IndustryProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onIndustryChange: (value: string) => void
  competitorDraft: string
  onCompetitorDraftChange: (value: string) => void
  onAddCompetitor: () => void
  onRemoveCompetitor: (value: string) => void
  onDifferentiationChange: (value: string) => void
}

export function Step7Industry({
  form,
  isPro,
  errors,
  onIndustryChange,
  competitorDraft,
  onCompetitorDraftChange,
  onAddCompetitor,
  onRemoveCompetitor,
  onDifferentiationChange,
}: Step7IndustryProps) {
  return (
    <>
      <SelectField
        id="industry"
        label="Choose your industry category"
        value={form.step7.industry}
        onChange={onIndustryChange}
        options={[
          { value: 'creative_services', label: 'Creative Services' },
          { value: 'health_wellness', label: 'Health and Wellness' },
          { value: 'technology', label: 'Technology' },
          { value: 'food_beverage', label: 'Food and Beverage' },
          { value: 'education', label: 'Education' },
          { value: 'finance', label: 'Finance' },
          { value: 'retail', label: 'Retail' },
          { value: 'other', label: 'Other' },
        ]}
        error={errors['step7.industry']}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-900">Add competitor names (optional)</label>
        <div className="flex gap-2">
          <input
            id="competitorDraft"
            value={competitorDraft}
            onChange={(e) => onCompetitorDraftChange(e.target.value)}
            placeholder="Type a competitor and tap Add"
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <Button onClick={onAddCompetitor}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.step7.competitors.map((competitor) => (
            <button
              key={competitor}
              type="button"
              onClick={() => onRemoveCompetitor(competitor)}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-700"
            >
              {competitor} ×
            </button>
          ))}
        </div>
      </div>
      {isPro ? (
        <TextArea
          id="differentiation"
          label="Optional: what makes you different?"
          value={form.step7.differentiation ?? ''}
          onChange={onDifferentiationChange}
          placeholder="Share what is uniquely true about your brand."
        />
      ) : null}
    </>
  )
}
