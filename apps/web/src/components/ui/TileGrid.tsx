import { MoodTile } from './MoodTile'

interface TileOption {
  value: string
  label: string
  subtitle?: string
  backgroundClassName: string
}

interface TileGridProps {
  label: string
  options: TileOption[]
  selected: string[]
  minSelect?: number
  maxSelect?: number
  error?: string
  onChange: (values: string[]) => void
}

export function TileGrid({
  label,
  options,
  selected,
  minSelect = 1,
  maxSelect = 1,
  error,
  onChange,
}: TileGridProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
      return
    }
    if (selected.length >= maxSelect) return
    onChange([...selected, value])
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-900">
        {label}
        <span className="ml-2 text-xs text-gray-500">
          Select {minSelect === maxSelect ? minSelect : `${minSelect}-${maxSelect}`}
        </span>
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <MoodTile
            key={option.value}
            label={option.label}
            subtitle={option.subtitle}
            selected={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
            backgroundClassName={option.backgroundClassName}
          />
        ))}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
