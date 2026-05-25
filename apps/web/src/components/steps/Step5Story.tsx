import type { BrandNarrator, IdentityKitForm, StepErrors } from '../../types'
import { getStoryOptions } from '../../data/storyOptions'
import { TextArea } from '../ui/TextArea'
import { OriginStoryDeck } from './OriginStoryDeck'

interface Step5StoryProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onArchetypeChange: (value: string) => void
  onProFieldChange: (field: 'originSummary' | 'motivation', value: string) => void
  visibleSections?: Array<'originArchetype' | 'originSummary' | 'motivation'>
}

function getOriginSummaryLabel(narrator: BrandNarrator): string {
  switch (narrator) {
    case 'solo_expert':
    case 'solo_maker':
      return 'Tell the story you want on your About page'
    case 'local_team':
      return 'Tell the story of how your shop or team came to be'
    case 'product_led':
      return 'Describe how the brand came to be'
    case 'mission_community':
      return 'Describe the mission behind this brand'
    default:
      return 'Tell your brand origin story'
  }
}

function getOriginSummaryPlaceholder(narrator: BrandNarrator): string {
  switch (narrator) {
    case 'solo_expert':
      return 'Share the background that helps clients trust you.'
    case 'solo_maker':
      return 'Share the story of how your craft became your business.'
    case 'local_team':
      return 'Share details you want customers to know about how you started.'
    case 'product_led':
      return 'Share the insight or moment that led to building this brand.'
    case 'mission_community':
      return 'Share what this brand was created to change or support.'
    default:
      return 'Share details you want AI to include.'
  }
}

export function Step5Story({
  form,
  isPro,
  errors,
  onArchetypeChange,
  onProFieldChange,
  visibleSections,
}: Step5StoryProps) {
  const storyOptions = getStoryOptions(form.step1.brandNarrator)
  const narrator = form.step1.brandNarrator
  const isVisible = (section: NonNullable<Step5StoryProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  return (
    <>
      {isVisible('originArchetype') ? (
        <>
          <OriginStoryDeck
            options={storyOptions}
            selectedId={form.step5.originArchetype}
            onSelect={onArchetypeChange}
          />
          {errors['step5.originArchetype'] ? (
            <p className="text-xs text-red-600">{errors['step5.originArchetype']}</p>
          ) : null}
        </>
      ) : null}
      {isPro && isVisible('originSummary') ? (
        <TextArea
          id="originSummary"
          label={getOriginSummaryLabel(narrator)}
          value={form.step5.originSummary ?? ''}
          onChange={(value) => onProFieldChange('originSummary', value)}
          placeholder={getOriginSummaryPlaceholder(narrator)}
        />
      ) : null}
      {isPro && isVisible('motivation') ? (
        <TextArea
          id="motivation"
          label="The bigger goal"
          value={form.step5.motivation ?? ''}
          onChange={(value) => onProFieldChange('motivation', value)}
          placeholder="e.g. the pain you fix, what success looks like, the long-term dream."
        />
      ) : null}
    </>
  )
}
