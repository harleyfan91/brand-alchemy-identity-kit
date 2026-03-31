interface AlchemySymbolStripProps {
  className?: string
}

type SymbolId = 'sun' | 'mercury' | 'fire' | 'circle' | 'air' | 'salt' | 'earth'

const leftSequence: SymbolId[] = [
  'sun',
  'mercury',
  'fire',
  'circle',
  'air',
  'salt',
  'earth',
  'sun',
  'mercury',
  'fire',
  'circle',
]

const rightSequence: SymbolId[] = [
  'earth',
  'salt',
  'air',
  'circle',
  'fire',
  'mercury',
  'sun',
  'earth',
  'salt',
  'air',
  'circle',
]

function SymbolGlyph({ id }: { id: SymbolId }) {
  if (id === 'sun') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }

  if (id === 'mercury') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <path d="M34 20 C34 40, 66 40, 66 20" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <circle cx="50" cy="49" r="14" stroke="currentColor" strokeWidth="7" />
        <line x1="50" y1="63" x2="50" y2="83" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <line x1="36" y1="73" x2="64" y2="73" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'fire') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon points="50,24 80,76 20,76" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      </svg>
    )
  }

  if (id === 'air') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon points="50,24 80,76 20,76" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
        <line x1="28" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'salt') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="7" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'earth') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon points="20,24 80,24 50,76" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
        <line x1="28" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="7" />
    </svg>
  )
}

export function AlchemySymbolStrip({ className = '' }: AlchemySymbolStripProps) {
  const leftSide = [...leftSequence, ...leftSequence].reverse()
  const rightSide = [...rightSequence, ...rightSequence]

  return (
    <div className={`relative h-7 ${className}`} aria-hidden="true">
      <div className="pointer-events-none absolute left-1/2 top-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-t from-black/12 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 bottom-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-b from-black/12 to-transparent" />
      <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t border-zinc-200" />
      <div className="absolute left-1/2 bottom-0 w-screen -translate-x-1/2 border-b border-zinc-200" />

      <div className="absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <div className="flex items-center justify-center whitespace-nowrap text-zinc-700">
          {leftSide.map((symbol, index) => (
            <span
              key={`left-${symbol}-${index}`}
              className="mr-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center align-middle"
            >
              <SymbolGlyph id={symbol} />
            </span>
          ))}
          <span className="mx-1 inline-flex h-3.5 shrink-0 items-center justify-center align-middle text-[10.5px] font-semibold tracking-tight">
            β△
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
