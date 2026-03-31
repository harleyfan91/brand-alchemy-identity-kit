interface ArchetypeCardProps {
  title: string
  description: string
  icon?: string
  selected?: boolean
  onClick: () => void
}

export function ArchetypeCard({
  title,
  description,
  icon = '✦',
  selected = false,
  onClick,
}: ArchetypeCardProps) {
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
