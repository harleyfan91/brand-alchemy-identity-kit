interface CheckboxOption {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label: string
  selected: string[]
  options: CheckboxOption[]
  onChange: (values: string[]) => void
  error?: string
}

export function CheckboxGroup({ label, selected, options, onChange, error }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
      return
    }
    onChange([...selected, value])
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-900">{label}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value)
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isChecked ? 'border-gray-900 bg-gray-100' : 'border-gray-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(option.value)}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
