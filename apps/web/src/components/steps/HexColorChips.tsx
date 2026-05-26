import { useMemo, type SVGProps } from 'react'

import {
  SuggestionSwiper,
  type SuggestionPage,
} from '../ui/SuggestionSwiper'

const MAX_HEX_SLOTS = 6
const HEX_PATTERN = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

interface HexColorChipsProps {
  values: string[]
  /**
   * Suggestions extracted from the uploaded logo. Rendered as the first page
   * of the suggestion swiper whenever present. Its "Use these colors" action
   * replaces the editable chip slots with this set; when the chip slots
   * already match exactly, the action button flips to an applied visual
   * state (filled dark + check icon) so the buyer can tell at a glance which
   * source their current palette came from.
   */
  logoSuggestions?: string[]
  /**
   * Suggestions extracted from the uploaded reference image. Rendered as the
   * second page of the suggestion swiper whenever present. Behavior mirrors
   * `logoSuggestions` — the button replaces the chip slots and flips to an
   * applied visual state when the slots already match exactly — so the
   * buyer can A/B between logo and reference palettes with a single tap.
   * Manual edits below the swiper are the buyer's escape hatch for hybrid
   * palettes.
   */
  referenceSuggestions?: string[]
  onChange: (next: string[]) => void
  error?: string
}

function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value.trim())
}

/**
 * Expands user-typed hex strings into the 7-character lowercase form required
 * by the HTML `<input type="color">` spec. The picker rejects 3-char shortcuts
 * (`#FFF`) and uppercase variants, so we coerce here and fall back to opaque
 * black when the text is partial/invalid (matches the picker's spec default).
 */
function toPickerHex(value: string): string {
  const trimmed = value.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      '#' +
      trimmed
        .split('')
        .map((c) => c + c)
        .join('')
        .toLowerCase()
    )
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return '#' + trimmed.toLowerCase()
  }
  return '#000000'
}

export function HexColorChips({
  values,
  logoSuggestions,
  referenceSuggestions,
  onChange,
  error,
}: HexColorChipsProps) {
  const trimmedValues = useMemo(() => values.filter((v) => v.trim().length > 0), [values])
  const slots = useMemo(() => {
    const next = [...values]
    while (next.length < Math.min(values.length + 1, MAX_HEX_SLOTS)) {
      next.push('')
    }
    if (next.length === 0) next.push('')
    return next.slice(0, MAX_HEX_SLOTS)
  }, [values])

  const updateSlot = (index: number, raw: string) => {
    const next = [...slots]
    next[index] = raw
    const trimmed = next.map((v) => v.trim()).filter((v) => v.length > 0)
    onChange(trimmed)
  }

  const removeSlot = (index: number) => {
    const next = slots.filter((_, idx) => idx !== index)
    const trimmed = next.map((v) => v.trim()).filter((v) => v.length > 0)
    onChange(trimmed)
  }

  /**
   * Swaps the editable chip slots to mirror the suggestion set the buyer
   * picked. Intentionally **replaces** (not merges) so the per-page button
   * always produces a visible change and the buyer can A/B between logo and
   * reference palettes with a single tap. Manual edits below the swiper are
   * the buyer's escape hatch for hybrid palettes.
   */
  const replaceWithSuggestions = (incoming: string[]) => {
    onChange(incoming.slice(0, MAX_HEX_SLOTS))
  }

  const logoHexes = logoSuggestions ?? []
  const referenceHexes = referenceSuggestions ?? []

  const logoAlreadyApplied =
    logoHexes.length > 0 &&
    logoHexes.length === trimmedValues.length &&
    logoHexes.every((hex) => trimmedValues.includes(hex))
  const referenceAlreadyApplied =
    referenceHexes.length > 0 &&
    referenceHexes.length === trimmedValues.length &&
    referenceHexes.every((hex) => trimmedValues.includes(hex))

  const suggestionPages: SuggestionPage[] = []

  if (logoHexes.length > 0) {
    suggestionPages.push({
      id: 'logo',
      title: 'From your logo',
      hexes: logoHexes,
      actionLabel: 'Use these colors',
      onAccept: () => replaceWithSuggestions(logoHexes),
      actionApplied: logoAlreadyApplied,
    })
  }

  if (referenceHexes.length > 0) {
    suggestionPages.push({
      id: 'reference',
      title: 'From your reference image',
      hexes: referenceHexes,
      actionLabel: 'Use these colors',
      onAccept: () => replaceWithSuggestions(referenceHexes),
      actionApplied: referenceAlreadyApplied,
    })
  }

  return (
    <div className="space-y-3">
      {suggestionPages.length > 0 ? (
        <SuggestionSwiper
          pages={suggestionPages}
          ariaLabel="Suggested colors from your uploads"
        />
      ) : null}

      <div className="space-y-2">
        {slots.map((value, index) => {
          const inputId = `hex-${index}`
          const isInvalid = value.trim().length > 0 && !isValidHex(value)
          const hasColor = isValidHex(value)
          const swatch = hasColor ? normalizeHex(value) : undefined
          const pickerValue = toPickerHex(value)
          const removable = trimmedValues.length > 0 && index < trimmedValues.length
          return (
            <div key={inputId} className="flex items-center gap-2">
              {/*
                Native color picker mounted as an invisible <input> overlaid on
                its label. The label is the visible swatch — we fully control
                its styling for empty/invalid states (light-gray fill + "+"
                affordance) while the OS-native picker still pops up exactly
                where the buyer clicked because the input shares the same
                bounding box. Label-input association handles click delegation
                on iOS Safari, Android Chrome, and desktop without JS.
              */}
              <label
                className={`relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:border-gray-500 ${
                  hasColor ? 'border-gray-300' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
                style={hasColor ? { backgroundColor: swatch } : undefined}
              >
                <input
                  type="color"
                  value={pickerValue}
                  onChange={(event) =>
                    updateSlot(index, event.target.value.toUpperCase())
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label={`Open color picker for slot ${index + 1}`}
                />
                {!hasColor ? (
                  <PlusIcon className="h-4 w-4 text-gray-400" aria-hidden />
                ) : null}
              </label>
              <input
                id={inputId}
                type="text"
                value={value}
                onChange={(event) => updateSlot(index, event.target.value)}
                placeholder="#A37BFF"
                inputMode="text"
                autoComplete="off"
                className={`box-border min-h-10 flex-1 rounded-xl border px-3 py-2 text-base text-gray-900 outline-none transition sm:text-sm ${
                  isInvalid ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
                }`}
                aria-label={`Brand hex color ${index + 1}`}
              />
              {removable ? (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  aria-label={`Remove color ${index + 1}`}
                >
                  <XIcon className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>
          )
        })}
        <p className="text-xs text-gray-500">
          Up to {MAX_HEX_SLOTS} colors. We'll suggest a matching named palette next.
        </p>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

function PlusIcon({
  className,
  ...rest
}: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function XIcon({
  className,
  ...rest
}: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}
