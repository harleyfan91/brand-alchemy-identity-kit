interface BrandWordmarkProps {
  className?: string
}

export function BrandWordmark({ className = '' }: BrandWordmarkProps) {
  return (
    <p
      className={`text-center text-base font-bold uppercase tracking-tight text-zinc-900 ${className}`}
    >
      Brand Alchemy
    </p>
  )
}
