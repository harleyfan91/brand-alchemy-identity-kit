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
  visibleSections?: Array<'preset' | 'sliderClusterA' | 'sliderClusterB' | 'customVoiceNotes'>
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
  visibleSections,
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

  const isVisible = (section: NonNullable<Step3PersonalityProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  const visibleSliders = sliderConfig.filter((slider) => {
    if (isVisible('sliderClusterA') && ['formality', 'energy'].includes(slider.key)) return true
    if (isVisible('sliderClusterB') && ['directness', 'warmth', 'playfulness'].includes(slider.key)) return true
    return false
  })

  const presetCards: Array<{ value: 'friendly' | 'professional' | 'bold'; label: string }> = [
    { value: 'friendly', label: 'Friendly & conversational' },
    { value: 'professional', label: 'Professional & polished' },
    { value: 'bold', label: 'Bold & direct' },
  ]

  return (
    <>
      {isVisible('preset') ? (
        <fieldset>
          <legend className="sr-only">Starting tone</legend>
          <div className="grid grid-cols-3 gap-2">
            {presetCards.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => applyPreset(option.value)}
                className={`flex aspect-square min-h-0 w-full flex-col items-center justify-center rounded-xl px-1.5 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-balance ${
                  form.step3.tonePreset === option.value
                    ? 'border-2 border-gray-900 bg-gray-50 text-gray-900'
                    : 'border border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                }`}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
          {errors['step3.tonePreset'] ? (
            <p className="text-xs text-red-600">{errors['step3.tonePreset']}</p>
          ) : null}
        </fieldset>
      ) : null}
      {visibleSliders.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs leading-snug text-gray-600">
            Use the sliders to fine-tune how the voice should feel.
          </p>
          {visibleSliders.map((slider) => {
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
      ) : null}
      {isPro && isVisible('customVoiceNotes') ? (
        <TextArea
          id="customVoiceNotes"
          label="Describe your ideal voice"
          value={form.step3.customVoiceNotes ?? ''}
          onChange={onCustomVoiceChange}
          placeholder="Add nuance you want the AI to use in your final copy."
        />
      ) : null}
    </>
  )
}
