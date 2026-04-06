import type { ChangeEvent } from 'react'

import type { IdentityKitForm, StepErrors } from '../../types'
import { ColorPalettePicker } from '../ui/ColorPalettePicker'
import { SwipeableOptionDeck } from '../ui/SwipeableOptionDeck'
import { TextArea } from '../ui/TextArea'

interface Step6AestheticProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onPaletteChange: (value: string) => void
  onStyleChange: (value: string[]) => void
  onTextChange: (field: 'colorMoodNotes' | 'styleNotes' | 'existingTypeface', value: string) => void
  onUploadNameChange: (value: string) => void
}

const palettes = [
  { id: 'midnight_luxe', name: 'Midnight Luxe', swatches: ['#0B0B0F', '#222333', '#7A6A4F', '#D4C4A8'] },
  { id: 'earthy_warmth', name: 'Earthy Warmth', swatches: ['#5A3E36', '#A77C5D', '#E5C7A2', '#F8EEDF'] },
  { id: 'ocean_calm', name: 'Ocean Calm', swatches: ['#0D3B66', '#2F6690', '#3A7CA5', '#D9EDFF'] },
  { id: 'sunset_bold', name: 'Sunset Bold', swatches: ['#2D1E2F', '#C8553D', '#F28F3B', '#F7D488'] },
  { id: 'forest_deep', name: 'Forest Deep', swatches: ['#1B4332', '#2D6A4F', '#40916C', '#D8F3DC'] },
  { id: 'minimal_light', name: 'Minimal Light', swatches: ['#111111', '#666666', '#CFCFCF', '#F7F7F7'] },
]

const styleOptions = [
  {
    value: 'clean_minimal',
    label: 'Clean and Minimal',
    subtitle: 'Lots of breathing room, nothing extra.',
  },
  {
    value: 'bold_graphic',
    label: 'Bold and Graphic',
    subtitle: 'Eye-catching, high-contrast, and made to stand out.',
  },
  {
    value: 'organic_natural',
    label: 'Organic and Natural',
    subtitle: 'Soft, earthy, and more handcrafted in feel.',
  },
  {
    value: 'luxe_refined',
    label: 'Luxe and Refined',
    subtitle: 'Elegant, understated, and premium.',
  },
]

const styleDeckOptions = styleOptions.map((o) => ({
  id: o.value,
  title: o.label,
  description: o.subtitle,
}))

export function Step6Aesthetic({
  form,
  isPro,
  errors,
  onPaletteChange,
  onStyleChange,
  onTextChange,
  onUploadNameChange,
}: Step6AestheticProps) {
  const onReferenceFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    onUploadNameChange(file?.name ?? '')
  }

  return (
    <>
      {isPro ? (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-900" htmlFor="referenceUpload">
            Upload a reference image or choose a color palette that represents your brand
          </label>
          <input
            id="referenceUpload"
            type="file"
            accept="image/*"
            onChange={onReferenceFileChange}
            className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-gray-800 hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-500">
            Your image can be aspirational or from your real business. Including your logo colors is encouraged.
          </p>
        </div>
      ) : null}
      <ColorPalettePicker
        palettes={palettes}
        selectedId={form.step6.selectedPalette}
        onSelect={onPaletteChange}
        error={errors['step6.selectedPalette']}
      />
      <TextArea
        id="existingTypeface"
        label="Fonts you already use (optional)"
        value={form.step6.existingTypeface ?? ''}
        onChange={(value) => onTextChange('existingTypeface', value)}
        placeholder="e.g. Montserrat for headings, system font for Instagram — leave blank if you’re starting fresh"
      />
      <p className="text-xs text-gray-500">
        If you name a typeface here, your Style Guide will treat it as your primary font and suggest pairings only
        where a second style helps.
      </p>
      <div className="w-full min-w-0 space-y-3" role="group" aria-labelledby="step6-style-heading">
        <p id="step6-style-heading" className="text-sm font-medium text-gray-900">
          Choose your visual style direction
        </p>
        <SwipeableOptionDeck
          options={styleDeckOptions}
          selectedId={form.step6.selectedStyle}
          onSelect={(id) => onStyleChange([id])}
          ariaLabel="Visual style direction options"
          prevAriaLabel="Previous style direction"
          nextAriaLabel="Next style direction"
          dotGroupAriaLabel="Style direction slides"
        />
        {errors['step6.selectedStyle'] ? (
          <p className="text-xs text-red-600">{errors['step6.selectedStyle']}</p>
        ) : null}
      </div>
      {isPro ? (
        <>
      <TextArea
        id="colorMoodNotes"
        label="Optional: color and mood notes"
        value={form.step6.colorMoodNotes ?? ''}
        onChange={(value) => onTextChange('colorMoodNotes', value)}
        placeholder="Anything specific the AI should consider?"
      />
      <TextArea
        id="styleNotes"
        label="Optional: style notes"
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
