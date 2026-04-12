import { useCallback, useEffect, useMemo, useState } from 'react'

import type { PaletteOption } from '../../data/visualDirection'
import { PALETTE_FAMILIES, paletteFamilyContaining } from '../../data/visualDirection'

interface ColorPalettePickerProps {
  palettes: PaletteOption[]
  selectedId: string
  onSelect: (id: string) => void
  error?: string
}

/** 2×2 mosaic inside the “All” chip — one hue per major family lane (blue, teal, earth, warm accent). */
const ALL_CHIP_SWATCHES = ['#2F6690', '#0E7490', '#9C5130', '#B45309'] as const

export function ColorPalettePicker({
  palettes,
  selectedId,
  onSelect,
  error,
}: ColorPalettePickerProps) {
  /** Default family on mount only; stays put while picking from “All” until user taps another chip. */
  const [familyId, setFamilyId] = useState<string>(() => {
    if (!selectedId) return 'all'
    return paletteFamilyContaining(selectedId)?.id ?? 'all'
  })

  useEffect(() => {
    const f = PALETTE_FAMILIES.find((x) => x.id === familyId)
    if (!f || f.paletteIds.length === 0) setFamilyId('all')
  }, [familyId])

  const activeFamily = useMemo(() => {
    const f = PALETTE_FAMILIES.find((x) => x.id === familyId)
    if (f && f.paletteIds.length > 0) return f
    return PALETTE_FAMILIES[0]!
  }, [familyId])

  const filteredPalettes = useMemo(
    () => palettes.filter((p) => activeFamily.paletteIds.includes(p.id)),
    [palettes, activeFamily.paletteIds],
  )

  const selectFamily = useCallback(
    (nextFamilyId: string) => {
      const fam = PALETTE_FAMILIES.find((f) => f.id === nextFamilyId)
      if (!fam || fam.paletteIds.length === 0) return
      setFamilyId(nextFamilyId)
      const nextPalettes = palettes.filter((p) => fam.paletteIds.includes(p.id))
      if (!nextPalettes.some((p) => p.id === selectedId)) {
        onSelect(nextPalettes[0]!.id)
      }
    },
    [onSelect, palettes, selectedId],
  )

  return (
    <fieldset className="min-w-0 w-full space-y-3 border-0 p-0">
      <legend className="text-sm font-medium text-gray-900">Select a color family, then a palette</legend>

      <div className="-mx-1 overflow-x-auto pb-0.5 [scrollbar-width:none] md:mx-0 [&::-webkit-scrollbar]:hidden">
        <div
          className="flex snap-x snap-mandatory gap-2 px-1 md:flex-wrap md:px-0"
          aria-label="Filter palettes by color family"
        >
          {PALETTE_FAMILIES.map((family) => {
            const active = family.id === familyId
            const chipStyle =
              family.chipColor != null ? ({ backgroundColor: family.chipColor } as const) : undefined

            if (family.id === 'all') {
              return (
                <button
                  key={family.id}
                  type="button"
                  aria-pressed={active}
                  aria-label={family.label}
                  onClick={() => selectFamily(family.id)}
                  className={`h-11 w-11 shrink-0 snap-start rounded-lg border-2 bg-white p-1 transition sm:h-10 sm:w-10 ${
                    active ? 'border-gray-900 ring-1 ring-gray-900/10' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span
                    className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5"
                    aria-hidden
                  >
                    {ALL_CHIP_SWATCHES.map((hex) => (
                      <span key={hex} className="min-h-0 min-w-0 rounded-sm" style={{ backgroundColor: hex }} />
                    ))}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={family.id}
                type="button"
                aria-pressed={active}
                aria-label={family.label}
                onClick={() => selectFamily(family.id)}
                className={`h-11 w-11 shrink-0 snap-start rounded-lg border-2 transition sm:h-10 sm:w-10 ${
                  active ? 'border-gray-900 ring-1 ring-gray-900/10' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={chipStyle}
              />
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        {filteredPalettes.map((palette) => {
          const selected = selectedId === palette.id
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onSelect(palette.id)}
              className={`w-full rounded-xl border p-3 text-left ${
                selected ? 'border-gray-900 bg-gray-100' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-2 flex gap-1">
                {palette.swatches.map((color) => (
                  <span
                    key={color}
                    className="h-5 flex-1 rounded-md"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-800">{palette.name}</p>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
