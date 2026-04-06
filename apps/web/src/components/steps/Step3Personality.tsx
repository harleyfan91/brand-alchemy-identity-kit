import { useEffect, useRef } from 'react'

import type { IdentityKitForm, StepErrors, VoiceSliders } from '../../types'
import { snapVoiceSliders, snapVoiceValue } from '../../utils/voiceSliders'
import { TextArea } from '../ui/TextArea'

interface Step3PersonalityProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onPresetChange: (value: 'friendly' | 'professional' | 'bold' | '') => void
  onSliderChange: (key: keyof VoiceSliders, value: number) => void
  onCustomVoiceChange: (value: string) => void
}

const presetValues: Record<'friendly' | 'professional' | 'bold', VoiceSliders> = {
  friendly: { formality: 75, energy: 50, directness: 25, warmth: 75, playfulness: 75 },
  professional: { formality: 25, energy: 25, directness: 75, warmth: 25, playfulness: 0 },
  bold: { formality: 75, energy: 100, directness: 100, warmth: 50, playfulness: 50 },
}

const sliderConfig: Array<{
  key: keyof VoiceSliders
  label: string
  leftLabel: string
  rightLabel: string
}> = [
  { key: 'formality', label: 'Formality', leftLabel: 'Formal', rightLabel: 'Conversational' },
  { key: 'energy', label: 'Energy', leftLabel: 'Calm', rightLabel: 'Energetic' },
  { key: 'directness', label: 'Directness', leftLabel: 'Gentle', rightLabel: 'Direct' },
  { key: 'warmth', label: 'Warmth', leftLabel: 'Reserved', rightLabel: 'Warm' },
  { key: 'playfulness', label: 'Playfulness', leftLabel: 'Serious', rightLabel: 'Playful' },
]

export function Step3Personality({
  form,
  isPro,
  errors,
  onPresetChange,
  onSliderChange,
  onCustomVoiceChange,
}: Step3PersonalityProps) {
  const didMigrateSnap = useRef(false)
  useEffect(() => {
    if (didMigrateSnap.current) return
    const vs = form.step3.voiceSliders
    const next = snapVoiceSliders(vs)
    if (JSON.stringify(vs) === JSON.stringify(next)) {
      didMigrateSnap.current = true
      return
    }
    didMigrateSnap.current = true
    for (const key of Object.keys(next) as Array<keyof VoiceSliders>) {
      if (vs[key] !== next[key]) onSliderChange(key, next[key])
    }
  }, [form.step3.voiceSliders, onSliderChange])

  const applyPreset = (value: 'friendly' | 'professional' | 'bold') => {
    onPresetChange(value)
    const sliders = presetValues[value]
    for (const key of Object.keys(sliders) as Array<keyof VoiceSliders>) {
      onSliderChange(key, sliders[key])
    }
  }

  return (
    <>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-900">
          Start with a tone preset, then refine with sliders
        </legend>
        <div className="grid gap-2">
          {[
            { value: 'friendly' as const, label: 'Friendly and conversational' },
            { value: 'professional' as const, label: 'Professional and polished' },
            { value: 'bold' as const, label: 'Bold and direct' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyPreset(option.value)}
              className={`rounded-xl border px-3 py-2 text-left text-sm ${
                form.step3.tonePreset === option.value
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors['step3.tonePreset'] ? (
          <p className="text-xs text-red-600">{errors['step3.tonePreset']}</p>
        ) : null}
      </fieldset>
      <div className="space-y-3">
        {sliderConfig.map((slider) => {
          const value = form.step3.voiceSliders[slider.key]
          return (
            <fieldset key={slider.key} className="space-y-1">
              <legend className="text-sm font-medium text-gray-900">{slider.label}</legend>
              <div className="relative flex items-center py-0.5">
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-3 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300/80"
                  aria-hidden
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={25}
                  value={value}
                  onChange={(event) =>
                    onSliderChange(slider.key, snapVoiceValue(Number(event.target.value)))
                  }
                  className="relative z-10 w-full accent-gray-900"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{slider.leftLabel}</span>
                <span>{slider.rightLabel}</span>
              </div>
            </fieldset>
          )
        })}
      </div>
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
