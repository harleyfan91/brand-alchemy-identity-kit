import type { IdentityKitForm, StepErrors } from '../../types'
import { TextArea } from '../ui/TextArea'
import { OriginStoryDeck } from './OriginStoryDeck'

interface Step5StoryProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onArchetypeChange: (value: string) => void
  onProFieldChange: (field: 'originSummary' | 'motivation', value: string) => void
}

const options = [
  {
    id: 'side_hustle_leap',
    title: 'The Side-Hustle Leap',
    description: 'Turned a passion project into a real business.',
    icon: '↗',
  },
  {
    id: 'industry_insider',
    title: 'The Industry Insider',
    description: 'Experienced pro who launched independently.',
    icon: '◍',
  },
  {
    id: 'problem_solver',
    title: 'The Problem Solver',
    description: 'Saw a gap and built the fix.',
    icon: '◇',
  },
  {
    id: 'creative_calling',
    title: 'The Creative Calling',
    description: 'Always knew this was the path.',
    icon: '✶',
  },
  {
    id: 'fresh_start',
    title: 'The Fresh Start',
    description: 'Pivoted careers to build something meaningful.',
    icon: '◎',
  },
]

export function Step5Story({
  form,
  isPro,
  errors,
  onArchetypeChange,
  onProFieldChange,
}: Step5StoryProps) {
  return (
    <>
      <OriginStoryDeck
        options={options}
        selectedId={form.step5.originArchetype}
        onSelect={onArchetypeChange}
      />
      {errors['step5.originArchetype'] ? (
        <p className="text-xs text-red-600">{errors['step5.originArchetype']}</p>
      ) : null}
      {isPro ? (
        <>
          <TextArea
            id="originSummary"
            label="Optional: tell your brand origin story"
            value={form.step5.originSummary ?? ''}
            onChange={(value) => onProFieldChange('originSummary', value)}
            placeholder="Share details you want AI to include."
          />
          <TextArea
            id="motivation"
            label="Optional: what drives this brand?"
            value={form.step5.motivation ?? ''}
            onChange={(value) => onProFieldChange('motivation', value)}
            placeholder="Describe the mission behind your work."
          />
        </>
      ) : null}
    </>
  )
}
