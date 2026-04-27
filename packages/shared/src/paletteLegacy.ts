/** Deprecated Step 6 `selectedPalette` values still found on older sessions or exports. */
export const LEGACY_PALETTE_ID_ALIASES: Record<string, string> = {
  indigo_ink: 'plum_violet',
  /** Removed from library; map old sessions to nearest blue ramp. */
  harbor_steel: 'ocean_calm',
  /** Removed from library; map old sessions to remaining soft gray ramp. */
  charcoal_slate: 'graphite_fog',
}

export function canonicalPaletteId(paletteId: string): string {
  if (!paletteId) return paletteId
  return LEGACY_PALETTE_ID_ALIASES[paletteId] ?? paletteId
}
