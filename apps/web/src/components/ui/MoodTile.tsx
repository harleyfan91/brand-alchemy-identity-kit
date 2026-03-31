interface MoodTileProps {
  label: string
  subtitle?: string
  selected?: boolean
  onClick: () => void
  backgroundClassName: string
}

export function MoodTile({
  label,
  subtitle,
  selected = false,
  onClick,
  backgroundClassName,
}: MoodTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border text-left transition ${
        selected ? 'border-zinc-900 ring-2 ring-zinc-900/25' : 'border-zinc-200'
      }`}
    >
      <div className={`h-24 w-full ${backgroundClassName}`} />
      <div className="space-y-1 bg-white p-3">
        <p className="text-sm font-semibold text-zinc-900">{label}</p>
        {subtitle ? <p className="text-xs text-zinc-600">{subtitle}</p> : null}
      </div>
    </button>
  )
}
