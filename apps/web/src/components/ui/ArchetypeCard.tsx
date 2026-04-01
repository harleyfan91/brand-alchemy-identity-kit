interface ArchetypeCardProps {
  title: string
  description: string
  icon?: string
  selected?: boolean
  onClick: () => void
  /** Tighter layout; description shows only when selected to reduce vertical scroll. */
  compact?: boolean
}

export function ArchetypeCard({
  title,
  description,
  icon = '✦',
  selected = false,
  onClick,
  compact = false,
}: ArchetypeCardProps) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex min-h-[44px] w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
          selected ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
        }`}
      >
        <span className="mt-0.5 shrink-0 text-sm leading-none text-zinc-700">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-snug text-zinc-900">{title}</span>
          {selected ? (
            <span className="mt-1 block text-xs leading-snug text-zinc-600">{description}</span>
          ) : null}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected ? 'border-zinc-900 bg-zinc-100' : 'border-zinc-200 bg-white hover:border-zinc-400'
      }`}
    >
      <p className="text-sm">{icon}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 text-xs text-zinc-600">{description}</p>
    </button>
  )
}
