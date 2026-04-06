interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end text-xs font-medium text-gray-600">
        <span>
          Step {current} of {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
