interface Option {
  value: string
  label: string
}

/** Chevron for `appearance-none` selects (gray-500 stroke). Open list height is still OS/browser-controlled. */
const SELECT_CHEVRON_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"

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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`box-border w-full min-h-14 cursor-pointer appearance-none rounded-xl border bg-white bg-no-repeat py-3 pl-3 pr-10 text-base leading-normal outline-none transition focus-visible:ring-2 focus-visible:ring-gray-400/35 sm:text-sm ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
        }`}
        style={{
          backgroundImage: SELECT_CHEVRON_BG,
          backgroundPosition: 'right 0.65rem center',
          backgroundSize: '1.25rem 1.25rem',
        }}
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
