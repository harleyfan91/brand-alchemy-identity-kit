import type { KeyboardEvent } from 'react'

import {
  PHOTO_COLOR_RELATIONSHIP_OPTIONS,
  type PhotoColorRelationship,
} from '@identity-kit/shared'

import { CompactBrandContextPreview } from './VisualDirectionPreview'

/** Exemplar photo count per option; bank images will be portrait-only. */
const OPTION_PHOTO_SLOT_COUNT: Record<PhotoColorRelationship, number> = {
  'echo-brand-colors': 3,
  'neutral-backdrops': 3,
  'natural-full-color': 3,
}

interface PhotoColorRelationshipPickerProps {
  selectedId?: PhotoColorRelationship
  onSelect: (id: PhotoColorRelationship) => void
  paletteId: string
  styleId: string
  brandLabel?: string
  error?: string
}

function PhotoExemplarSlot({ src }: { src?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="aspect-[3/4] w-full rounded-md border border-gray-200 object-cover"
      />
    )
  }

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100"
      aria-hidden
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
      <svg
        className="absolute inset-0 m-auto h-5 w-5 text-gray-400/80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <path d="M3 16l4.5-4.5 3 3L14 11l7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function PhotoRelationshipPreview({
  optionId,
  paletteId,
  styleId,
  brandLabel,
}: {
  optionId: PhotoColorRelationship
  paletteId: string
  styleId: string
  brandLabel?: string
}) {
  const photoCount = OPTION_PHOTO_SLOT_COUNT[optionId]

  return (
    <div
      className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-[minmax(0,34%)_1fr] sm:gap-3"
      aria-hidden
    >
      <CompactBrandContextPreview
        variant="site"
        paletteId={paletteId}
        styleId={styleId}
        brandLabel={brandLabel}
        className="h-full min-h-[7.5rem]"
      />
      <div
        className={`grid min-w-0 gap-1.5 ${
          photoCount === 1 ? 'grid-cols-1' : photoCount === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {Array.from({ length: photoCount }, (_, index) => (
          <PhotoExemplarSlot key={`${optionId}-photo-${index}`} />
        ))}
      </div>
    </div>
  )
}

export function PhotoColorRelationshipPicker({
  selectedId,
  onSelect,
  paletteId,
  styleId,
  brandLabel,
  error,
}: PhotoColorRelationshipPickerProps) {
  const options = PHOTO_COLOR_RELATIONSHIP_OPTIONS

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex =
      event.key === 'ArrowDown'
        ? Math.min(options.length - 1, index + 1)
        : event.key === 'ArrowUp'
          ? Math.max(0, index - 1)
          : -1
    if (nextIndex === -1) return
    event.preventDefault()
    const next = options[nextIndex]
    if (next) onSelect(next.id)
  }

  return (
    <fieldset className="min-w-0 w-full space-y-3 border-0 p-0">
      <legend className="sr-only">How photos should relate to your brand palette</legend>
      <div role="radiogroup" aria-label="Photo and brand color relationship" className="grid gap-3">
        {options.map((option, index) => {
          const selected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (!selectedId && index === 0) ? 0 : -1}
              onClick={() => onSelect(option.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex w-full flex-col gap-3 rounded-2xl border px-3 py-3 text-left transition sm:rounded-3xl sm:px-4 sm:py-4 ${
                selected
                  ? 'border-gray-900 bg-gray-100 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <PhotoRelationshipPreview
                optionId={option.id}
                paletteId={paletteId}
                styleId={styleId}
                brandLabel={brandLabel}
              />
              <div>
                <p className="text-sm font-semibold leading-snug text-gray-900">{option.label}</p>
                <p className="mt-1 text-xs leading-snug text-gray-600">{option.description}</p>
              </div>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
