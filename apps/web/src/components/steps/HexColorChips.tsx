import { useMemo } from 'react'

const MAX_HEX_SLOTS = 6
const HEX_PATTERN = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

interface HexColorChipsProps {
  values: string[]
  /**
   * Authoritative suggestions extracted from the uploaded logo. Shown as a
   * "pulled from your logo" row above the inputs, only when the buyer has not
   * entered any manual hex codes yet (the parent already auto-fills `values`
   * from these on upload, so showing them again would be redundant).
   */
  logoSuggestions?: string[]
  /**
   * Inspirational suggestions extracted from the uploaded reference image.
   * Shown as a separate "also found in your reference image" row that is
   * **always visible** when present — they are additive ideas the buyer can
   * choose to include alongside their existing palette, not a replacement for
   * it.
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

  const acceptSuggestions = (incoming: string[]) => {
    const merged = [...trimmedValues]
    for (const hex of incoming) {
      if (merged.length >= MAX_HEX_SLOTS) break
      if (!merged.includes(hex)) merged.push(hex)
    }
    onChange(merged)
  }

  const showLogoSuggestions =
    (logoSuggestions?.length ?? 0) > 0 && trimmedValues.length === 0
  const showReferenceSuggestions = (referenceSuggestions?.length ?? 0) > 0
  const referenceHasRoom = trimmedValues.length < MAX_HEX_SLOTS

  return (
    <div className="space-y-3">
      {showLogoSuggestions ? (
        <SuggestionRow
          title="We pulled these from your logo — keep all, edit, or skip."
          hexes={logoSuggestions!}
          actionLabel="Use these colors"
          onAccept={() => acceptSuggestions(logoSuggestions!)}
        />
      ) : null}

      {showReferenceSuggestions && referenceHasRoom ? (
        <SuggestionRow
          title="We also found these in your reference image — add any you want."
          hexes={referenceSuggestions!}
          actionLabel="Add these colors"
          onAccept={() => acceptSuggestions(referenceSuggestions!)}
        />
      ) : null}

      <div className="space-y-2">
        {slots.map((value, index) => {
          const inputId = `hex-${index}`
          const isInvalid = value.trim().length > 0 && !isValidHex(value)
          const swatch = isValidHex(value) ? normalizeHex(value) : 'transparent'
          const removable = trimmedValues.length > 0 && index < trimmedValues.length
          return (
            <div key={inputId} className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-9 w-9 shrink-0 rounded-lg border border-gray-300"
                style={{ backgroundColor: swatch }}
              />
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
                  className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
                  aria-label={`Remove color ${index + 1}`}
                >
                  Remove
                </button>
              ) : null}
            </div>
          )
        })}
        <p className="text-xs text-gray-500">
          Up to {MAX_HEX_SLOTS} colors. We'll suggest the closest named palette on the next step — you can keep our pick or choose a different one.
        </p>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

interface SuggestionRowProps {
  title: string
  hexes: string[]
  actionLabel: string
  onAccept: () => void
}

function SuggestionRow({ title, hexes, actionLabel, onAccept }: SuggestionRowProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-700">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {hexes.map((hex) => (
          <span
            key={hex}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
          >
            <span
              className="inline-block h-3 w-3 rounded-full border border-gray-300"
              style={{ backgroundColor: hex }}
            />
            {hex.toUpperCase()}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onAccept}
        className="mt-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100"
      >
        {actionLabel}
      </button>
    </div>
  )
}
