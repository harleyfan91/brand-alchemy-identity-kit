import type { Step1ControlledOption } from '../../data/step1ControlledOptions'

interface OptionSelectGridProps {
  options: Step1ControlledOption[]
  value: string
  onChange: (value: string) => void
  error?: string
}

export function OptionSelectGrid({ options, value, onChange, error }: OptionSelectGridProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                selected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-semibold">{option.label}</div>
              {option.description ? (
                <div className={`mt-1 text-sm ${selected ? 'text-gray-100' : 'text-gray-600'}`}>
                  {option.description}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
