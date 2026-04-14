import type React from 'react'

interface InputFieldProps {
  id: string
  /** Shown above the field unless `hideLabel` (then screen-reader only). */
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** When true, label is `sr-only` — use a strong `placeholder` for sighted users. */
  hideLabel?: boolean
  /** Tighter control for inline / toolbar rows. */
  dense?: boolean
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
  hideLabel = false,
  dense = false,
  error,
  type = 'text',
  inputMode,
  autoComplete,
  enterKeyHint,
  maxLength,
}: InputFieldProps) {
  return (
    <div className={hideLabel ? (error ? 'space-y-1' : '') : 'space-y-1.5'}>
      <label className={hideLabel ? 'sr-only' : 'block text-sm font-medium text-gray-900'} htmlFor={id}>
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
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`box-border w-full rounded-xl border outline-none transition ${
          dense
            ? 'min-h-10 px-2.5 py-2 text-[16px] sm:text-sm'
            : 'min-h-14 px-3 py-3 text-base leading-normal sm:text-sm'
        } ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
