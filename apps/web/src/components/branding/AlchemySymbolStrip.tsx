import { type SymbolId, getStripLayout, STRIP_CENTER_LABEL } from '@identity-kit/brand-assets'

interface AlchemySymbolStripProps {
  className?: string
}

/**
 * All glyphs: viewBox 0 0 100×100 (sulfur alone uses 100×102 for extra vertical room), stroke 7.
 * Loose grid: fire/air/earth triangles y≈24–76; sun/salt circles r=30 → ~20–80; mercury stem to y=83.
 */
function SymbolGlyph({ id }: { id: SymbolId }) {
  if (id === 'sun') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }

  if (id === 'mercury') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <path
          d="M34 20 C34 40, 66 40, 66 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="50" cy="49" r="14" fill="none" stroke="currentColor" strokeWidth="7" />
        <line x1="50" y1="63" x2="50" y2="83" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <line x1="36" y1="73" x2="64" y2="73" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'fire') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,24 80,76 20,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  /** Sulfur: taller viewBox gives breathing room; △ a bit larger; stem to y=88; bar lower on stem. */
  if (id === 'sulfur') {
    return (
      <svg viewBox="0 0 100 102" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,28 74,64 26,64"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="50" y1="64" x2="50" y2="88" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <line x1="26" y1="77" x2="74" y2="77" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'air') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,24 80,76 20,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'salt') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="7" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'earth') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="20,24 80,24 50,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  return null
}

export function AlchemySymbolStrip({ className = '' }: AlchemySymbolStripProps) {
  const { leftSide, rightSide } = getStripLayout()

  return (
    <div className={`relative h-7 ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute left-1/2 top-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-t from-black/12 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 bottom-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-b from-black/12 to-transparent" />
      <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t border-gray-200" />
      <div className="absolute left-1/2 bottom-0 w-screen -translate-x-1/2 border-b border-gray-200" />

      <div className="absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <div className="flex items-center justify-center whitespace-nowrap text-gray-700">
          {leftSide.map((symbol, index) => (
            <span
              key={`left-${symbol}-${index}`}
              className="mr-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center align-middle"
            >
              <SymbolGlyph id={symbol} />
            </span>
          ))}
          <span className="mx-1 inline-flex h-3.5 shrink-0 items-center justify-center align-middle text-[10.5px] font-semibold tracking-tight">
            {STRIP_CENTER_LABEL}
          </span>
          {rightSide.map((symbol, index) => (
            <span
              key={`right-${symbol}-${index}`}
              className="mr-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center align-middle"
            >
              <SymbolGlyph id={symbol} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
