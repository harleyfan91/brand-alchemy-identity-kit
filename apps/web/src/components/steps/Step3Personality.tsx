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
  onVoiceSamplesChange?: (next: string[]) => void
  visibleSections?: Array<
    'preset' | 'sliderClusterA' | 'sliderClusterB' | 'customVoiceNotes' | 'voiceSamples'
  >
}

const VOICE_SAMPLES_MAX = 5
const VOICE_SAMPLE_SOFT_MIN = 50
const VOICE_SAMPLE_SOFT_MAX = 200

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
  onVoiceSamplesChange,
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

  const presetCards: Array<{
    value: 'friendly' | 'professional' | 'bold'
    label: string
    detail: string
  }> = [
    { value: 'friendly', label: 'Friendly', detail: 'Conversational' },
    { value: 'professional', label: 'Professional', detail: 'Polished' },
    { value: 'bold', label: 'Bold', detail: 'Direct' },
  ]

  return (
    <>
      {isVisible('preset') ? (
        <fieldset>
          <legend className="sr-only">Starting tone</legend>
          <div className="grid grid-cols-3 gap-2">
            {presetCards.map((option) => {
              const isSelected = form.step3.tonePreset === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => applyPreset(option.value)}
                  className={`flex aspect-square min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center leading-tight ${
                    isSelected
                      ? 'border-2 border-gray-900 bg-gray-50 text-gray-900'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                    {option.detail}
                  </span>
                </button>
              )
            })}
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
          label="The feeling you're after"
          value={form.step3.customVoiceNotes ?? ''}
          onChange={onCustomVoiceChange}
          placeholder="e.g. confident, understood, excited, 'not like a big company.'"
        />
      ) : null}
      {isPro && isVisible('voiceSamples') ? (
        <VoiceSamplesSection
          samples={form.step3.voiceSamples ?? []}
          onChange={onVoiceSamplesChange}
        />
      ) : null}
    </>
  )
}

function VoiceSamplesSection({
  samples,
  onChange,
}: {
  samples: string[]
  onChange?: (next: string[]) => void
}) {
  const updateSample = (index: number, value: string) => {
    if (!onChange) return
    const next = samples.slice()
    next[index] = value
    onChange(next)
  }
  const removeSample = (index: number) => {
    if (!onChange) return
    onChange(samples.filter((_, i) => i !== index))
  }
  const addSample = () => {
    if (!onChange) return
    if (samples.length >= VOICE_SAMPLES_MAX) return
    onChange([...samples, ''])
  }
  const visibleSamples = samples.length === 0 ? [''] : samples

  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium text-gray-900">
        Paste something you've already written
      </legend>
      <p className="text-xs leading-snug text-gray-600">
        A caption, email, or product description works great. The AI picks up on how you naturally
        write and keeps that going.
      </p>
      <ul className="space-y-3">
        {visibleSamples.map((sample, index) => {
          const charCount = sample.length
          const belowMin = charCount > 0 && charCount < VOICE_SAMPLE_SOFT_MIN
          const counterColor =
            charCount > VOICE_SAMPLE_SOFT_MAX
              ? 'text-amber-600'
              : charCount >= VOICE_SAMPLE_SOFT_MIN
                ? 'text-gray-500'
                : 'text-gray-400'
          return (
            <li key={index} className="space-y-1">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <TextArea
                    id={`voiceSample_${index}`}
                    label={`Sample ${index + 1}`}
                    value={sample}
                    onChange={(value) => {
                      if (samples.length === 0 && value.trim().length > 0 && onChange) {
                        onChange([value])
                      } else {
                        updateSample(index, value)
                      }
                    }}
                    placeholder="e.g. We don’t do hard sells. We make things people quietly recommend."
                    rows={3}
                  />
                </div>
                {samples.length > 0 && samples.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeSample(index)}
                    className="mt-7 shrink-0 rounded-lg border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400"
                    aria-label={`Remove sample ${index + 1}`}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={belowMin ? 'text-gray-500' : 'text-transparent'} aria-live="polite">
                  A sentence or two works best.
                </span>
                <span className={counterColor}>
                  {charCount} / {VOICE_SAMPLE_SOFT_MAX}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      {samples.length < VOICE_SAMPLES_MAX ? (
        <button
          type="button"
          onClick={addSample}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400"
        >
          Add another sample
        </button>
      ) : (
        <p className="text-xs text-gray-500">You can add up to {VOICE_SAMPLES_MAX} samples.</p>
      )}
    </fieldset>
  )
}
