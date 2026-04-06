// AlchemyMark — the β△ brand symbol (matches umbrella components/AlchemyMark.tsx).
// β (beta) + △ (delta/trine) = the visual shorthand for Brand Alchemy.

interface AlchemyMarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'text-xs tracking-[0.12em]',
  sm: 'text-sm tracking-[0.15em]',
  md: 'text-base tracking-[0.18em]',
  lg: 'text-xl tracking-[0.18em]',
}

export function AlchemyMark({ size = 'sm', className = '' }: AlchemyMarkProps) {
  return (
    <span
      className={`inline-block select-none font-bold ${sizeMap[size]} ${className}`}
      aria-label="Brand Alchemy mark"
    >
      β△
    </span>
  )
}
