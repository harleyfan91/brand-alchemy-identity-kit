interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  error?: string
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select one',
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
