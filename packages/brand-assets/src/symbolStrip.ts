/**
 * Single source of truth for the alchemy symbol strip order and center label.
 * Used by the web UI, SVG export, and (optionally) PDF generation.
 */
export type SymbolId = 'sun' | 'mercury' | 'fire' | 'circle' | 'air' | 'salt' | 'earth'

export const leftSequence: SymbolId[] = [
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

export const rightSequence: SymbolId[] = [
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

/** Matches the center mark in `AlchemySymbolStrip`. */
export const STRIP_CENTER_LABEL = 'β△'

export function getStripLayout(): { leftSide: SymbolId[]; rightSide: SymbolId[] } {
  const leftSide = [...leftSequence, ...leftSequence].reverse()
  const rightSide = [...rightSequence, ...rightSequence]
  return { leftSide, rightSide }
}
