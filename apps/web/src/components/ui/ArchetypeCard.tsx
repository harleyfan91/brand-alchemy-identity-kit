interface ArchetypeCardProps {
  title: string
  description: string
  icon?: string
  selected?: boolean
  onClick: () => void
  /** Tighter layout; description shows only when selected to reduce vertical scroll. */
  compact?: boolean
  /**
   * Dense buyer-style card: icon sits beside the title (not on its own row); description always visible.
   * Use for Step 2 and similar. If both `compact` and `summary` are set, `summary` wins.
   */
  summary?: boolean
}

export function ArchetypeCard({
  title,
  description,
  icon = '✦',
  selected = false,
  onClick,
  compact = false,
  summary = false,
}: ArchetypeCardProps) {
  if (summary) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`grid w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2.5 gap-y-1 rounded-xl border p-3.5 text-left transition sm:p-4 ${
          selected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-400'
        }`}
      >
        <span
          className="row-span-2 flex w-8 shrink-0 items-center justify-center text-lg leading-none text-gray-700"
          aria-hidden
        >
          {icon}
        </span>
        <span className="min-w-0 text-sm font-semibold leading-snug text-gray-900">{title}</span>
        <span className="min-w-0 text-xs leading-relaxed text-gray-600">{description}</span>
      </button>
    )
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex min-h-[44px] w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
          selected ? 'border-gray-900 bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-400'
        }`}
      >
        <span className="mt-0.5 shrink-0 text-sm leading-none text-gray-700">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-snug text-gray-900">{title}</span>
          {selected ? (
            <span className="mt-1 block text-xs leading-snug text-gray-600">{description}</span>
          ) : null}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-full min-h-[120px] w-full rounded-3xl border p-5 text-left transition ${
        selected ? 'border-gray-900 bg-gray-100' : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <p className="text-base leading-none text-gray-700">{icon}</p>
      <p className="mt-3 text-base font-semibold leading-snug text-gray-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
    </button>
  )
}
