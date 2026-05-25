import { type ChangeEvent, useEffect } from 'react'

import { canonicalPaletteId, MOOD_ADJECTIVE_OPTIONS, type MoodAdjective } from '@identity-kit/shared'

import type { IdentityKitForm, StepErrors } from '../../types'
import { PALETTE_OPTIONS, STYLE_DIRECTION_OPTIONS } from '../../data/visualDirection'
import { ColorPalettePicker } from '../ui/ColorPalettePicker'
import { StyleDirectionGrid } from '../ui/StyleDirectionGrid'
import { TextArea } from '../ui/TextArea'

interface Step6AestheticProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onPaletteChange: (value: string) => void
  onStyleChange: (value: string[]) => void
  onTextChange: (field: 'visualNotes' | 'existingTypeface', value: string) => void
  onUploadNameChange: (value: string) => void
  onMoodAdjectivesChange?: (next: MoodAdjective[]) => void
  visibleSections?: Array<
    | 'palette'
    | 'style'
    | 'existingTypeface'
    | 'referenceUpload'
    | 'moodAdjectives'
    | 'visualNotes'
  >
}

export function Step6Aesthetic({
  form,
  isPro,
  errors,
  onPaletteChange,
  onStyleChange,
  onTextChange,
  onUploadNameChange,
  onMoodAdjectivesChange,
  visibleSections,
}: Step6AestheticProps) {
  const onReferenceFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    onUploadNameChange(file?.name ?? '')
  }
  const isVisible = (section: NonNullable<Step6AestheticProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

  const paletteSectionVisible = isVisible('palette')
  useEffect(() => {
    if (!paletteSectionVisible) return
    const p = form.step6.selectedPalette
    const c = canonicalPaletteId(p)
    if (c !== p) onPaletteChange(c)
  }, [paletteSectionVisible, form.step6.selectedPalette, onPaletteChange])

  const selectedMoods = new Set<MoodAdjective>(form.step6.moodAdjectives ?? [])
  const toggleMood = (id: MoodAdjective) => {
    if (!onMoodAdjectivesChange) return
    const next = new Set(selectedMoods)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onMoodAdjectivesChange(Array.from(next))
  }

  return (
    <>
      {isPro && isVisible('referenceUpload') ? (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-900" htmlFor="referenceUpload">Reference image</label>
          <input
            id="referenceUpload"
            type="file"
            accept="image/*"
            onChange={onReferenceFileChange}
            className="box-border block min-h-11 w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-base text-gray-700 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-gray-800 hover:file:bg-gray-200 sm:text-sm"
          />
          {form.step6.referenceUploadName ? (
            <p className="text-xs text-gray-500">Selected reference: {form.step6.referenceUploadName}</p>
          ) : (
            <p className="text-xs text-gray-500">A moodboard, product photo, or other visual cue is enough.</p>
          )}
        </div>
      ) : null}
      {isVisible('palette') ? (
        <ColorPalettePicker
          palettes={PALETTE_OPTIONS}
          selectedId={canonicalPaletteId(form.step6.selectedPalette)}
          onSelect={onPaletteChange}
          error={errors['step6.selectedPalette']}
        />
      ) : null}
      {isVisible('existingTypeface') ? (
        <TextArea
          id="existingTypeface"
          label="Fonts you already use"
          value={form.step6.existingTypeface ?? ''}
          onChange={(value) => onTextChange('existingTypeface', value)}
          placeholder="e.g. Montserrat for headings, system font for Instagram — leave blank if you’re starting fresh"
        />
      ) : null}
      {isVisible('style') ? (
        <StyleDirectionGrid
          options={STYLE_DIRECTION_OPTIONS}
          selectedId={form.step6.selectedStyle}
          onSelect={(id) => onStyleChange([id])}
          error={errors['step6.selectedStyle']}
        />
      ) : null}
      {isPro && isVisible('moodAdjectives') ? (
        <fieldset className="space-y-3">
          <legend className="block text-sm font-medium text-gray-900">
            Pick the feeling you're going for
          </legend>
          <p className="text-xs leading-snug text-gray-600">
            Choose anything that matches the vibe you're after. These shape the imagery in your kit.
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_ADJECTIVE_OPTIONS.map((option) => {
              const isSelected = selectedMoods.has(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleMood(option.id)}
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-sm transition ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      ) : null}
      {isPro && isVisible('visualNotes') ? (
        <TextArea
          id="visualNotes"
          label="Visual notes"
          value={form.step6.visualNotes ?? ''}
          onChange={(value) => onTextChange('visualNotes', value)}
          placeholder="Anything specific the AI should consider — color feelings, style references, things to avoid?"
        />
      ) : null}
    </>
  )
}
