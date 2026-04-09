interface TextAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  error?: string
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-[16px] outline-none transition sm:text-sm ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
