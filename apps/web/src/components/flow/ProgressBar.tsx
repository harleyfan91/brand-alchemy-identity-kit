interface ProgressBarProps {
  label: string
  current: number
  total: number
  contextLabel?: string
}

export function ProgressBar({ label, current, total, contextLabel }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-600">
        <span>{label}</span>
        {contextLabel ? <span className="shrink-0 text-right">{contextLabel}</span> : null}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
