import type { ChangeEvent } from 'react'

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
  onTextChange: (field: 'colorMoodNotes' | 'styleNotes' | 'existingTypeface', value: string) => void
  onUploadNameChange: (value: string) => void
  visibleSections?: Array<
    'palette' | 'style' | 'existingTypeface' | 'referenceUpload' | 'colorMoodNotes' | 'styleNotes'
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
  visibleSections,
}: Step6AestheticProps) {
  const onReferenceFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    onUploadNameChange(file?.name ?? '')
  }
  const isVisible = (section: NonNullable<Step6AestheticProps['visibleSections']>[number]) =>
    visibleSections == null || visibleSections.includes(section)

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
            className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-gray-800 hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-500">A moodboard, product photo, or other visual cue is enough.</p>
        </div>
      ) : null}
      {isVisible('palette') ? (
        <ColorPalettePicker
          palettes={PALETTE_OPTIONS}
          selectedId={form.step6.selectedPalette}
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
      {isPro && isVisible('colorMoodNotes') ? (
        <TextArea
          id="colorMoodNotes"
          label="Color and mood notes"
          value={form.step6.colorMoodNotes ?? ''}
          onChange={(value) => onTextChange('colorMoodNotes', value)}
          placeholder="Anything specific the AI should consider?"
        />
      ) : null}
      {isPro && isVisible('styleNotes') ? (
        <>
          <TextArea
            id="styleNotes"
            label="Style notes"
            value={form.step6.styleNotes ?? ''}
            onChange={(value) => onTextChange('styleNotes', value)}
            placeholder="Share details you want reflected in the final kit."
          />
          {form.step6.referenceUploadName ? (
            <p className="text-xs text-gray-500">Selected reference: {form.step6.referenceUploadName}</p>
          ) : null}
        </>
      ) : null}
    </>
  )
}
