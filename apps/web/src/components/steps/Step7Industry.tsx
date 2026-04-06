import type { BrandNarrator, IdentityKitForm, StepErrors } from '../../types'
import { TextArea } from '../ui/TextArea'
import { Button } from '../ui/Button'

interface Step7IndustryProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  competitorDraft: string
  onCompetitorDraftChange: (value: string) => void
  onAddCompetitor: () => void
  onRemoveCompetitor: (value: string) => void
  onDifferentiationChange: (value: string) => void
}

function getDifferentiationPlaceholder(narrator: BrandNarrator): string {
  switch (narrator) {
    case 'solo_expert':
      return 'Unlike online courses, I work hands-on with each client from start to finish.'
    case 'solo_maker':
      return 'Unlike mass-produced goods, every piece is made to order in small batches.'
    case 'local_team':
      return 'Unlike national chains, we know our neighbors by name and show up when it counts.'
    case 'product_led':
      return 'Unlike generic options, our formula is designed specifically for sensitive skin.'
    case 'mission_community':
      return 'Unlike traditional nonprofits, we keep 100% of proceeds local and in the community.'
    default:
      return 'Unlike generalist agencies, we pair strategy with implementation in one sprint.'
  }
}

export function Step7Industry({
  form,
  isPro,
  errors,
  competitorDraft,
  onCompetitorDraftChange,
  onAddCompetitor,
  onRemoveCompetitor,
  onDifferentiationChange,
}: Step7IndustryProps) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">Add competitor names (optional)</label>
        <div className="flex gap-2">
          <input
            id="competitorDraft"
            value={competitorDraft}
            onChange={(e) => onCompetitorDraftChange(e.target.value)}
            placeholder="Type a competitor and tap Add"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          <Button onClick={onAddCompetitor}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.step7.competitors.map((competitor) => (
            <button
              key={competitor}
              type="button"
              onClick={() => onRemoveCompetitor(competitor)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {competitor} ×
            </button>
          ))}
        </div>
      </div>
      {isPro ? (
        <>
          <TextArea
            id="differentiation"
            label="What makes you different?"
            value={form.step7.differentiation ?? ''}
            onChange={onDifferentiationChange}
            placeholder={getDifferentiationPlaceholder(form.step1.brandNarrator)}
            error={errors['step7.differentiation']}
          />
          <p className="text-xs text-gray-500">
            This helps shape your positioning and Content Starter Pack language.
          </p>
        </>
      ) : null}
    </>
  )
}
