import { Dropdown, type DropdownOption } from './Dropdown'

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
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
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <Dropdown
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        invalid={Boolean(error)}
        describedby={errorId}
      />
      {error ? (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
