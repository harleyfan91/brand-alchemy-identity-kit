interface InputFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}

export function InputField({ id, label, value, onChange, placeholder, error }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-900" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
          error ? 'border-red-400 focus:border-red-500' : 'border-zinc-300 focus:border-zinc-500'
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
