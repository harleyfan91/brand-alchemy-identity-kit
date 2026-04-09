import type React from 'react'

interface InputFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  type?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  maxLength?: number
}

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  inputMode,
  autoComplete,
  enterKeyHint,
  maxLength,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-900" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        enterKeyHint={enterKeyHint}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2 text-[16px] outline-none transition sm:text-sm ${
          error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
