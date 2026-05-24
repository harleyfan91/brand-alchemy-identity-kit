import type { BrandNarrator, IdentityKitForm, StepErrors } from '../../types'
import { Button } from '../ui/Button'
import { InputField } from '../ui/InputField'
import { TextArea } from '../ui/TextArea'

interface Step7IndustryProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  competitorDraft: string
  onCompetitorDraftChange: (value: string) => void
  onAddCompetitor: () => void
  onRemoveCompetitor: (value: string) => void
  onDifferentiationChange: (value: string) => void
  visibleSections?: Array<'competitors' | 'differentiation'>
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
  visibleSections,
}: Step7IndustryProps) {
  const isVisible = (section: NonNullable<Step7IndustryProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  return (
    <>
      {isVisible('competitors') ? (
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <InputField
                id="competitorDraft"
                label="Add competitor names"
                value={competitorDraft}
                onChange={onCompetitorDraftChange}
                placeholder="Type a competitor and tap Add"
                enterKeyHint="done"
              />
            </div>
            <Button type="button" className="mb-0.5 shrink-0" onClick={onAddCompetitor}>
              Add
            </Button>
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
      ) : null}
      {isPro && isVisible('differentiation') ? (
        <TextArea
          id="differentiation"
          label="What makes you different?"
          value={form.step7.differentiation ?? ''}
          onChange={onDifferentiationChange}
          placeholder={getDifferentiationPlaceholder(form.step1.brandNarrator)}
          error={errors['step7.differentiation']}
        />
      ) : null}
    </>
  )
}
