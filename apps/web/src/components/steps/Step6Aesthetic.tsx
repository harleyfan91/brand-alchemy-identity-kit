import type { IdentityKitForm, StepErrors } from '../../types'
import { ColorPalettePicker } from '../ui/ColorPalettePicker'
import { InputField } from '../ui/InputField'
import { SwipeableOptionDeck } from '../ui/SwipeableOptionDeck'
import { TextArea } from '../ui/TextArea'

interface Step6AestheticProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onPaletteChange: (value: string) => void
  onStyleChange: (value: string[]) => void
  onTextChange: (field: 'colorMoodNotes' | 'styleNotes', value: string) => void
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
  return (
    <>
      <ColorPalettePicker
        palettes={palettes}
        selectedId={form.step6.selectedPalette}
        onSelect={onPaletteChange}
        error={errors['step6.selectedPalette']}
      />
      <div className="w-full min-w-0 space-y-3" role="group" aria-labelledby="step6-style-heading">
        <p id="step6-style-heading" className="text-sm font-medium text-zinc-900">
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
      <InputField
        id="referenceUploadName"
        label="Optional upload filename (placeholder)"
        value={form.step6.referenceUploadName ?? ''}
        onChange={onUploadNameChange}
        placeholder="brand-reference.png"
      />
        </>
      ) : null}
    </>
  )
}
