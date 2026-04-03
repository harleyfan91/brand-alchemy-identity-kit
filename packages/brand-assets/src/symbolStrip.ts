/**
 * Single source of truth for the alchemy symbol strip order and center label.
 * Used by the web UI, SVG export, and (optionally) PDF generation.
 *
 * Layout: one continuous repeating cycle, split as
 *   [ left 22 glyphs ] · β△ · [ right 22 glyphs ]
 * so reading left→right across the strip (ignoring the center label) is 44 glyphs that tile
 * `stripCycle` without a seam. The center mark is always the same.
 *
 * Phase: the cycle is rotated so the first glyph *after* β△ is **salt** (circle + bar—not a
 * triangle—so it doesn’t read as repeating the center mark).
 *
 * Order constraints (7 symbols in a ring): fire, sulfur, and air are all upward triangles and
 * must not sit next to each other. Earth is a downward triangle; in a strict ring you cannot
 * separate earth from all three upward symbols *and* keep the three apart—this cycle keeps
 * fire/sulfur/air pairwise separated and accepts a single sulfur↔earth adjacency (not air↔earth).
 */
export type SymbolId = 'sun' | 'mercury' | 'fire' | 'sulfur' | 'air' | 'salt' | 'earth'

/** One full lap through the seven symbols; repeats to fill the strip. */
export const stripCycle: SymbolId[] = [
  'earth',
  'salt',
  'air',
  'sun',
  'fire',
  'mercury',
  'sulfur',
]

/** Glyphs on each side of the center label (22 + 1 center + 22 = 45 visual slots). */
export const STRIP_GLYPHS_PER_SIDE = 22

const STRIP_TOTAL_GLYPHS = STRIP_GLYPHS_PER_SIDE * 2

/** Matches the center mark in `AlchemySymbolStrip`. */
export const STRIP_CENTER_LABEL = 'β△'

export function getStripLayout(): { leftSide: SymbolId[]; rightSide: SymbolId[] } {
  const stream: SymbolId[] = []
  const n = stripCycle.length
  for (let i = 0; i < STRIP_TOTAL_GLYPHS; i++) {
    stream.push(stripCycle[i % n]!)
  }
  return {
    leftSide: stream.slice(0, STRIP_GLYPHS_PER_SIDE),
    rightSide: stream.slice(STRIP_GLYPHS_PER_SIDE),
  }
}
