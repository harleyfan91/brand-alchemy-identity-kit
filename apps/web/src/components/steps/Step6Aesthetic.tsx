import { useEffect, useMemo } from 'react'

import {
  canonicalPaletteId,
  type ExistingBrand,
  MOOD_ADJECTIVE_MAX_SELECT,
  MOOD_ADJECTIVE_OPTIONS,
  type MoodAdjective,
  type PhotoColorRelationship,
} from '@identity-kit/shared'

import type { IdentityKitForm, StepErrors } from '../../types'
import { PALETTE_OPTIONS, STYLE_DIRECTION_OPTIONS } from '../../data/visualDirection'
import { nearestNamedPalette } from '../../utils/nearestNamedPalette'
import { ColorPalettePicker } from '../ui/ColorPalettePicker'
import { PhotoColorRelationshipPicker } from '../ui/PhotoColorRelationshipPicker'
import { StyleDirectionGrid } from '../ui/StyleDirectionGrid'
import { TextArea } from '../ui/TextArea'
import { ExistingBrandGate } from './ExistingBrandGate'
import { ExistingBrandUploadField } from './ExistingBrandUploadField'
import { HexColorChips } from './HexColorChips'

export type Step6ExistingBrandField = keyof ExistingBrand

interface Step6AestheticProps {
  form: IdentityKitForm
  isPro: boolean
  errors: StepErrors
  onPaletteChange: (value: string) => void
  onStyleChange: (value: string[]) => void
  onTextChange: (field: 'visualNotes' | 'existingTypeface', value: string) => void
  onMoodAdjectivesChange?: (next: MoodAdjective[]) => void
  onPhotoColorRelationshipChange?: (next: PhotoColorRelationship | undefined) => void
  onHasExistingBrandChange?: (next: boolean) => void
  /**
   * Generic setter for any `existingBrand.*` field. Pass `undefined` to clear a field.
   * Color extraction is wired in `App.tsx`: on logo/reference image select, the parent
   * runs `extractColorsFromFile` and writes the source-specific
   * `logoExtractedColors` or `referenceExtractedColors` field.
   */
  onExistingBrandChange?: <K extends Step6ExistingBrandField>(
    field: K,
    value: ExistingBrand[K] | undefined,
  ) => void
  /**
   * Called when an upload field selects a `File`. Parent runs color extraction
   * and writes both the placeholder path and the matching extracted-colors
   * field (`logoExtractedColors` for the logo upload, `referenceExtractedColors`
   * for the reference image).
   */
  onExistingBrandFileSelect?: (
    field: 'logoRef' | 'referenceImageRef',
    file: File,
    placeholderPath: string,
  ) => void
  visibleSections?: Array<
    | 'palette'
    | 'style'
    | 'existingTypeface'
    | 'moodAdjectives'
    | 'photoColorRelationship'
    | 'visualNotes'
    | 'hasExistingBrand'
    | 'logoRef'
    | 'referenceImageRef'
    | 'hexColors'
  >
}

export function Step6Aesthetic({
  form,
  isPro,
  errors,
  onPaletteChange,
  onStyleChange,
  onTextChange,
  onMoodAdjectivesChange,
  onPhotoColorRelationshipChange,
  onHasExistingBrandChange,
  onExistingBrandChange,
  onExistingBrandFileSelect,
  visibleSections,
}: Step6AestheticProps) {
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
    else {
      if (next.size >= MOOD_ADJECTIVE_MAX_SELECT) return
      next.add(id)
    }
    onMoodAdjectivesChange(Array.from(next))
  }

  const existingBrand = form.step6.existingBrand ?? {}
  const suggestedPaletteId = useMemo(() => {
    const hexes = existingBrand.hexColors ?? []
    if (hexes.length === 0) return undefined
    return nearestNamedPalette(hexes, PALETTE_OPTIONS)
  }, [existingBrand.hexColors])

  const photoRelationshipBrandLabel = useMemo(() => {
    const trimmed = form.step1.businessName.trim()
    if (trimmed.length === 0) return undefined
    return trimmed.split(/\s+/).filter(Boolean).slice(0, 2).join(' ')
  }, [form.step1.businessName])

  return (
    <>
      {isPro && isVisible('hasExistingBrand') ? (
        <ExistingBrandGate
          value={form.step6.hasExistingBrand}
          onChange={(next) => onHasExistingBrandChange?.(next)}
          error={errors['step6.hasExistingBrand']}
        />
      ) : null}
      {isPro && isVisible('logoRef') ? (
        <ExistingBrandUploadField
          id="existingBrandLogo"
          label="Upload your logo"
          description="The AI reads it in your Brand Audit — what it signals, what's working, where there's tension. We also pull the dominant colors from it and pre-fill them on the next hex-codes step so you can keep, edit, or replace them."
          assetType="logo"
          storedRef={existingBrand.logoRef ?? ''}
          onSelect={(file, placeholderPath) =>
            onExistingBrandFileSelect?.('logoRef', file, placeholderPath)
          }
          onClear={() => onExistingBrandChange?.('logoRef', undefined)}
          sessionId={form.sessionId}
          error={errors['step6.existingBrand.logoRef']}
        />
      ) : null}
      {isPro && isVisible('referenceImageRef') ? (
        <ExistingBrandUploadField
          id="existingBrandReference"
          label="A reference image (optional)"
          description="A moodboard, screenshot, or any visual you love. We analyze it as photographic direction for your reference spread — register, subjects, and light quality — not as a mandate to match your palette swatches."
          assetType="referenceImage"
          storedRef={existingBrand.referenceImageRef ?? ''}
          onSelect={(file, placeholderPath) =>
            onExistingBrandFileSelect?.('referenceImageRef', file, placeholderPath)
          }
          onClear={() => onExistingBrandChange?.('referenceImageRef', undefined)}
          sessionId={form.sessionId}
          error={errors['step6.existingBrand.referenceImageRef']}
        />
      ) : null}
      {isPro && isVisible('hexColors') ? (
        <div className="space-y-3">
          <p className="text-xs leading-snug text-gray-600">
            Logo, packaging, social templates — anywhere your brand shows up in color.
          </p>
          <HexColorChips
            values={existingBrand.hexColors ?? []}
            logoSuggestions={existingBrand.logoExtractedColors ?? []}
            referenceSuggestions={existingBrand.referenceExtractedColors ?? []}
            onChange={(next) => onExistingBrandChange?.('hexColors', next)}
            error={errors['step6.existingBrand.hexColors']}
          />
        </div>
      ) : null}
      {isVisible('palette') ? (
        <ColorPalettePicker
          palettes={PALETTE_OPTIONS}
          selectedId={canonicalPaletteId(form.step6.selectedPalette)}
          onSelect={onPaletteChange}
          suggestedId={suggestedPaletteId}
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
        <fieldset className="space-y-3 border-0 p-0">
          <legend className="sr-only">Mood adjectives for your visuals</legend>
          <p className="text-xs leading-snug text-gray-600">
            Choose up to {MOOD_ADJECTIVE_MAX_SELECT} that fit.
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_ADJECTIVE_OPTIONS.map((option) => {
              const isSelected = selectedMoods.has(option.id)
              const atMax = selectedMoods.size >= MOOD_ADJECTIVE_MAX_SELECT
              const isDisabled = !isSelected && atMax
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={isDisabled}
                  onClick={() => toggleMood(option.id)}
                  className={`min-h-9 rounded-full border px-3 py-1.5 text-sm transition ${
                    isSelected
                      ? 'border-gray-900 bg-gray-100 text-gray-900 shadow-sm'
                      : isDisabled
                        ? 'cursor-not-allowed border-gray-200 bg-white text-gray-400'
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
      {isPro && isVisible('photoColorRelationship') ? (
        <PhotoColorRelationshipPicker
          selectedId={form.step6.photoColorRelationship}
          onSelect={(id) => onPhotoColorRelationshipChange?.(id)}
          paletteId={form.step6.selectedPalette}
          styleId={form.step6.selectedStyle}
          brandLabel={photoRelationshipBrandLabel}
          error={errors['step6.photoColorRelationship']}
        />
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
