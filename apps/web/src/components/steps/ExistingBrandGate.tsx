interface ExistingBrandGateProps {
  value: boolean | undefined
  onChange: (next: boolean) => void
  error?: string
}

const OPTIONS = [
  {
    id: 'yes',
    title: 'Yes, build on what I have',
    description:
      'Share your logo, colors, or website. Your kit will reference and extend them instead of starting from scratch.',
  },
  {
    id: 'no',
    title: 'No, start fresh',
    description:
      "I'm building from a blank page. Skip the existing-brand details and use the visual direction I picked.",
  },
] as const

export function ExistingBrandGate({ value, onChange, error }: ExistingBrandGateProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Do you have an existing brand?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const optionValue = option.id === 'yes'
          const isSelected = value === optionValue
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(optionValue)}
              className={`flex h-full flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
              }`}
            >
              <span className="text-sm font-semibold">{option.title}</span>
              <span
                className={`text-xs leading-snug ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}
              >
                {option.description}
              </span>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
