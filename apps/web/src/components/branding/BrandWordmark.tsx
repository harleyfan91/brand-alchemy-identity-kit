interface BrandWordmarkProps {
  className?: string
  /** Smaller type for the slim strip above step cards. */
  compact?: boolean
}

export function BrandWordmark({ className = '', compact = false }: BrandWordmarkProps) {
  const sizeClasses = compact
    ? 'text-center text-[11px] font-medium uppercase tracking-widest text-gray-400 sm:text-xs'
    : 'text-center text-xl font-bold uppercase tracking-tight text-gray-900'

  return (
    <p className={`${sizeClasses} ${className}`}>Brand Alchemy</p>
  )
}
