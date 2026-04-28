import type { SymbolId } from '@identity-kit/brand-assets'

type IntakeGlyphProps = {
  icon: string
  className?: string
}

const LEGACY_ICON_TO_STRIP: Partial<Record<string, SymbolId>> = {
  '◎': 'sun',
  '◍': 'salt',
  '◉': 'salt',
  '↗': 'fire',
  '△': 'sulfur',
  '◇': 'earth',
  '✦': 'air',
  '◈': 'mercury',
  '☉': 'mercury',
}

function LegacyCustomGlyph({ icon }: { icon: string }) {
  const stroke = 1.15
  if (icon === '◌') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={stroke} />
      </svg>
    )
  }
  if (icon === '✶') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="16.5" y1="7.5" x2="7.5" y2="16.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    )
  }
  return null
}

function StripGlyph({ id }: { id: SymbolId }) {
  const stroke = 1.15
  if (id === 'sun') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={stroke} />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'mercury') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <path d="M8 4.5 C8 8, 16 8, 16 4.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <circle cx="12" cy="11.8" r="3.2" stroke="currentColor" strokeWidth={stroke} />
        <line x1="12" y1="15" x2="12" y2="20" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="8.8" y1="17.5" x2="15.2" y2="17.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'fire') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <polygon points="12,5 18,17 6,17" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
      </svg>
    )
  }
  if (id === 'sulfur') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <polygon points="12,6 17,13 7,13" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
        <line x1="12" y1="13" x2="12" y2="20" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        <line x1="7" y1="16.2" x2="17" y2="16.2" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'air') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <polygon points="12,5 18,17 6,17" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
        <line x1="7" y1="11.2" x2="17" y2="11.2" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'salt') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={stroke} />
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full" aria-hidden="true">
      <polygon points="6,7 18,7 12,18" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
      <line x1="7" y1="11.2" x2="17" y2="11.2" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  )
}

export function IntakeGlyph({ icon, className = '' }: IntakeGlyphProps) {
  const mapped = LEGACY_ICON_TO_STRIP[icon]
  if (mapped) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
        <StripGlyph id={mapped} />
      </span>
    )
  }

  const custom = LegacyCustomGlyph({ icon })
  if (custom) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
        {custom}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden="true">
      <StripGlyph id="earth" />
    </span>
  )
}

