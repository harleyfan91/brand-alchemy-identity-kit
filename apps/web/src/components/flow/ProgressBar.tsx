interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-zinc-600">
        <span>Progress</span>
        <span>
          Step {current} of {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-200">
        <div className="h-full rounded-full bg-zinc-900 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
