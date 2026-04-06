/** How to apply each palette — keyed to Step 6 palette ids. */

const PALETTE_COLOR_ROLES: Record<string, string> = {
  midnight_luxe:
    'Near-black anchors headers and anything that needs to feel premium — it carries the layout. Warm gold-tan is your accent: one deliberate detail per composition. Mid-dark navy fills supporting sections and frames the space between.',
  earthy_warmth:
    'Creamy off-white is your primary surface — it gives the warmer tones room to land. Use terracotta as the accent for moments that need to pop; lean on caramel for warmth without loudness. Keep the neutral dominant: earthy palettes lose their feeling the moment everything is saturated.',
  ocean_calm:
    'Deep navy grounds the palette and signals calm confidence. Mid-blue fills secondary sections and backgrounds that need presence without weight. Pale sky is your breathing room — keep contrast clear between tonal layers.',
  sunset_bold:
    'Deep plum is your primary — it keeps the energy from tipping into noise. Use burnt orange or amber as the accent, one per layout. Restraint is what makes the contrast work; let one warm tone lead each piece.',
  forest_deep:
    'Near-black forest green carries the depth that grounds everything. Fresh sage is your accent — a deliberate brightness against the deeper tones. Use the darkest tones as dominant and let sage appear with intention, not as scatter.',
  minimal_light:
    'Near-black is your primary for text, headers, and anything that needs to be clearly read. Cool mid-gray fills section dividers and secondary UI. Off-white is your canvas — let it breathe. One unexpected color applied consistently extends this system; three is noise.',
}

const FALLBACK_ROLES =
  'Assign one swatch as your primary (dominant presence), another as supporting (secondary sections and framing), and another as accent (the single focal point per layout). Use the swatch widths as a guide for application ratio.'

export function paletteColorRolesParagraph(paletteId: string): string {
  return PALETTE_COLOR_ROLES[paletteId] ?? FALLBACK_ROLES
}
