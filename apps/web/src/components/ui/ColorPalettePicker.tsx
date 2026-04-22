import { useCallback, useEffect, useMemo, useState } from 'react'

import type { PaletteOption } from '../../data/visualDirection'
import { PALETTE_FAMILIES, paletteFamilyContaining } from '../../data/visualDirection'

interface ColorPalettePickerProps {
  palettes: PaletteOption[]
  selectedId: string
  onSelect: (id: string) => void
  error?: string
}

function paletteScore(palette: PaletteOption): number {
  const tags = palette.tags
  let score = 0
  if (tags.includes('high-contrast')) score += 3
  if (tags.includes('bold-editorial')) score += 2
  if (tags.includes('vivid')) score += 1
  if (palette.swatches.length >= 2) {
    const [first, , , last] = palette.swatches
    if (first && last && first !== last) score += 1
  }
  if (tags.includes('muted')) score -= 1
  return score
}

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

  const filteredPalettes = useMemo(() => {
    const familyFiltered = palettes.filter((p) => activeFamily.paletteIds.includes(p.id))
    const originalOrder = new Map(familyFiltered.map((p, idx) => [p.id, idx]))
    return [...familyFiltered].sort((a, b) => {
      const scoreDiff = paletteScore(b) - paletteScore(a)
      if (scoreDiff !== 0) return scoreDiff
      return (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0)
    })
  }, [palettes, activeFamily.paletteIds])

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

  useEffect(() => {
    if (filteredPalettes.length === 0) return
    if (!filteredPalettes.some((p) => p.id === selectedId)) {
      onSelect(filteredPalettes[0]!.id)
    }
  }, [filteredPalettes, onSelect, selectedId])

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
            const chipSwatches = family.chipSwatches
            const shortLabel = family.id === 'all' ? 'All' : family.label.split(' ')[0]
            const isAll = family.id === 'all'

            if (chipSwatches && chipSwatches.length > 0) {
              return (
                <button
                  key={family.id}
                  type="button"
                  aria-pressed={active}
                  aria-label={family.label}
                  onClick={() => selectFamily(family.id)}
                  className={`h-16 w-12 shrink-0 snap-start rounded-lg border-2 p-1 transition sm:h-16 sm:w-12 ${
                    active ? 'border-gray-900 ring-1 ring-gray-900/10' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span
                    className={`grid h-8 w-full grid-cols-2 grid-rows-2 gap-0.5 rounded-sm ${isAll ? 'bg-gray-100 p-1' : ''}`}
                    aria-hidden
                  >
                    {isAll ? (
                      <span className="col-span-2 row-span-2 flex items-center justify-center text-[9px] font-semibold uppercase tracking-wide text-gray-700">
                        All
                      </span>
                    ) : (
                      chipSwatches.slice(0, 4).map((hex) => (
                        <span key={hex} className="min-h-0 min-w-0 rounded-sm" style={{ backgroundColor: hex }} />
                      ))
                    )}
                  </span>
                  <span className="mt-1 block truncate text-center text-[9px] font-medium uppercase tracking-wide text-gray-700">
                    {shortLabel}
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
                className={`h-16 w-12 shrink-0 snap-start rounded-lg border-2 p-1 transition sm:h-16 sm:w-12 ${
                  active ? 'border-gray-900 ring-1 ring-gray-900/10' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="block h-8 w-full rounded-sm" style={chipStyle} aria-hidden />
                <span className="mt-1 block truncate text-center text-[9px] font-medium uppercase tracking-wide text-gray-700">
                  {shortLabel}
                </span>
              </button>
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
