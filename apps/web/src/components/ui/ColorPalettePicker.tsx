interface PaletteOption {
  id: string
  name: string
  swatches: string[]
}

interface ColorPalettePickerProps {
  palettes: PaletteOption[]
  selectedId: string
  onSelect: (id: string) => void
  error?: string
}

export function ColorPalettePicker({
  palettes,
  selectedId,
  onSelect,
  error,
}: ColorPalettePickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-zinc-900">Choose a starting color palette</legend>
      <div className="space-y-2">
        {palettes.map((palette) => {
          const selected = selectedId === palette.id
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onSelect(palette.id)}
              className={`w-full rounded-xl border p-3 text-left ${
                selected ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white'
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
              <p className="text-sm font-medium text-zinc-800">{palette.name}</p>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
