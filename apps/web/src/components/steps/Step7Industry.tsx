import type { IdentityKitForm, StepErrors } from '../../types'
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
        <>
          <TextArea
            id="differentiation"
            label="What makes you different?"
            value={form.step7.differentiation ?? ''}
            onChange={onDifferentiationChange}
            placeholder="Unlike generalist agencies, we pair strategy with implementation in one sprint."
            error={errors['step7.differentiation']}
          />
          <p className="text-xs text-zinc-500">
            This helps shape your positioning and Content Starter Pack language.
          </p>
        </>
      ) : null}
    </>
  )
}
