interface ExistingBrandGateProps {
  value: boolean | undefined
  onChange: (next: boolean) => void
  error?: string
}

const OPTIONS = [
  {
    id: 'yes',
    title: 'Yes, I have visuals to share',
    description:
      "A logo or colors you already use, or just an inspirational image that captures the vibe you're after. Even rebrands count — your kit can reference, extend, or intentionally evolve from what you share.",
  },
  {
    id: 'no',
    title: 'No, starting from scratch',
    description:
      "I'm working with a blank page. Use only the visual direction I pick on the next steps.",
  },
] as const

export function ExistingBrandGate({ value, onChange, error }: ExistingBrandGateProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Do you have brand assets or visual references to share?</legend>
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
                  ? 'border-gray-900 bg-gray-100 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <span className="text-sm font-semibold text-gray-900">{option.title}</span>
              <span className="text-xs leading-snug text-gray-600">{option.description}</span>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
