import type { IdentityKitForm, StepErrors } from '../../types'
import { TileGrid } from '../ui/TileGrid'
import { TextArea } from '../ui/TextArea'

interface Step3PersonalityProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onAdjectivesChange: (values: string[]) => void
  onToneChange: (value: 'friendly' | 'professional' | 'bold') => void
  onCustomVoiceChange: (value: string) => void
}

const adjectiveOptions = [
  {
    value: 'confident',
    label: 'Confident',
    subtitle: 'Dark and grounded',
    backgroundClassName: 'bg-gradient-to-br from-zinc-900 to-zinc-600',
  },
  {
    value: 'warm',
    label: 'Warm',
    subtitle: 'Soft and welcoming',
    backgroundClassName: 'bg-gradient-to-br from-amber-200 to-orange-300',
  },
  {
    value: 'playful',
    label: 'Playful',
    subtitle: 'Bright and energetic',
    backgroundClassName: 'bg-gradient-to-br from-pink-300 to-purple-300',
  },
  {
    value: 'premium',
    label: 'Premium',
    subtitle: 'Refined and elevated',
    backgroundClassName: 'bg-gradient-to-br from-zinc-950 to-yellow-500',
  },
  {
    value: 'bold',
    label: 'Bold',
    subtitle: 'High contrast impact',
    backgroundClassName: 'bg-gradient-to-br from-red-500 to-zinc-950',
  },
  {
    value: 'clear',
    label: 'Clear',
    subtitle: 'Clean and minimal',
    backgroundClassName: 'bg-gradient-to-br from-sky-100 to-white',
  },
]

export function Step3Personality({
  form,
  isPro,
  errors,
  onAdjectivesChange,
  onToneChange,
  onCustomVoiceChange,
}: Step3PersonalityProps) {
  return (
    <>
      <TileGrid
        label="Pick your brand adjectives"
        selected={form.step3.personalityAdjectives}
        options={adjectiveOptions}
        minSelect={1}
        maxSelect={3}
        onChange={onAdjectivesChange}
        error={errors['step3.personalityAdjectives']}
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-900">Pick your voice tone</legend>
        <div className="grid gap-2">
          {[
            { value: 'friendly' as const, label: 'Friendly and conversational' },
            { value: 'professional' as const, label: 'Professional and polished' },
            { value: 'bold' as const, label: 'Bold and direct' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onToneChange(option.value)}
              className={`rounded-xl border px-3 py-2 text-left text-sm ${
                form.step3.tone === option.value
                  ? 'border-zinc-900 bg-zinc-100'
                  : 'border-zinc-200 bg-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors['step3.tone'] ? <p className="text-xs text-red-600">{errors['step3.tone']}</p> : null}
      </fieldset>
      {isPro ? (
        <TextArea
          id="customVoiceNotes"
          label="Optional: describe your ideal voice"
          value={form.step3.customVoiceNotes ?? ''}
          onChange={onCustomVoiceChange}
          placeholder="Add nuance you want the AI to use in your final copy."
        />
      ) : null}
    </>
  )
}
