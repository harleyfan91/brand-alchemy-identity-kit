import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 transition disabled:cursor-not-allowed disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest'
      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 text-sm font-semibold'

  return (
    <button className={`${base} ${styles} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  )
}
