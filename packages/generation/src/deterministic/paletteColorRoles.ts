/** How to apply each palette after the swatch row — keyed to Step 6 palette ids. */

const PALETTE_COLOR_ROLES: Record<string, string> = {
  midnight_luxe:
    "Your near-black is the primary — it carries the most weight and shows up in headers, dominant backgrounds, and anything that needs to feel premium and confident. The warm gold-tan is your accent — use it for the one element per layout that you want to feel like the point. The mid-dark navy sits between them as a supporting tone for layered sections and framing. As a rough guide: your darks carry most of every layout, the accent does the work of a highlighter.",
  earthy_warmth:
    "Your creamy off-white is your primary surface — the open space that lets the warmer tones breathe. Terracotta and caramel take turns as supporting and accent depending on how saturated you want a piece to feel: lean on the warmer terracotta as the accent for moments that need to pop, and use caramel for warmth without loudness. Keep the creamy neutral as the dominant space — earthy palettes lose their feeling the moment everything is saturated.",
  ocean_calm:
    "Your deep navy is the primary — it grounds the palette and signals confidence. The mid-blue is your supporting color for secondary sections, frames, and backgrounds that need presence without heaviness. The pale sky is your breathing room and light accent. These colors work best with clear contrast between layers — don't let two similarly toned blues sit next to each other without enough value difference to read distinctly.",
  sunset_bold:
    "Deep plum is your primary — it carries the palette's weight and keeps things from tipping into the bright-without-substance territory. Burnt orange and amber are your accent range: use one or the other per layout, not both, or the energy becomes noise. Your supporting role goes to whichever warm tone you are not using as the accent on that piece. This palette rewards restraint — the contrast does the work when you let one element lead.",
  forest_deep:
    "Your near-black forest green is the primary — it carries the depth that makes the rest of the palette feel grounded. Fresh sage is your accent: it works as a small pop of brightness against the deeper tones without going neon. The mid-forest green supports and connects. These colors feel most intentional when the darkest tones dominate and the sage is used deliberately, not scattered.",
  minimal_light:
    "Near-black is your primary for text, headers, and any element that needs to be clearly read. Cool mid-gray is your supporting tone — section dividers, secondary text, and framing. Off-white is your canvas. This palette works because it gets out of the way — keep it that way by resisting the urge to add a color that isn't in the system. One unexpected color, applied consistently, is an extension of a minimal palette. Three is visual noise.",
}

const COLOR_APPLICATION_RATIO_GUIDELINE =
  'As a broader anchor, think in terms of roughly 65–70% primary plus neutral space, 20–25% supporting, and 5–10% accent — not a rigid rule, but a useful check when a layout feels too busy or too flat.'

const FALLBACK_ROLES =
  'Assign one swatch as your primary (the dominant presence), another as supporting (secondary sections and framing), and another as accent (the single focal point per layout). Choose which swatch plays which role based on contrast and the feeling you want — not every palette is "darkest equals primary."'

export function paletteColorRolesParagraph(paletteId: string): string {
  const specific = PALETTE_COLOR_ROLES[paletteId]
  const base = specific ?? FALLBACK_ROLES
  return `${base}\n\n${COLOR_APPLICATION_RATIO_GUIDELINE}`
}
