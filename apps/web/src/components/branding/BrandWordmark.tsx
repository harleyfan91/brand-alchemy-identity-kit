interface BrandWordmarkProps {
  className?: string
  /** Smaller type for the slim strip above step cards. */
  compact?: boolean
}

export function BrandWordmark({ className = '', compact = false }: BrandWordmarkProps) {
  const sizeClasses = compact
    ? 'text-center text-[11px] font-bold uppercase tracking-wide text-zinc-600 sm:text-xs'
    : 'text-center text-base font-bold uppercase tracking-tight text-zinc-900'

  return (
    <p className={`${sizeClasses} ${className}`}>Brand Alchemy</p>
  )
}
