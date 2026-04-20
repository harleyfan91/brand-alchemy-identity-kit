import { canonicalPaletteId } from '@identity-kit/shared'

/** How to apply each palette — keyed to Step 6 palette ids. */

const PALETTE_COLOR_ROLES: Record<string, string> = {
  midnight_luxe:
    'Near-black anchors headers and anything that needs to feel premium — it carries the layout. Warm gold-tan is your accent: one deliberate detail per composition. Mid-dark navy fills supporting sections and frames the space between.',
  earthy_warmth:
    'Creamy off-white is your primary background — it gives the warmer tones room to land. Use terracotta as the accent for moments that need to pop; lean on caramel for warmth without loudness. Keep the neutral dominant: earthy palettes lose their feeling the moment everything is saturated.',
  ocean_calm:
    'Deep navy grounds the palette and signals calm confidence. Mid-blue fills secondary sections and backgrounds that need presence without weight. Pale sky is your breathing room — keep contrast clear between tonal layers.',
  sunset_bold:
    'Deep plum is your primary — it keeps the energy from tipping into noise. Use burnt orange or amber as the accent, one per layout. Restraint is what makes the contrast work; let one warm tone lead each piece.',
  forest_deep:
    'Near-black forest green carries the depth that grounds everything. Fresh sage is your accent — a deliberate brightness against the deeper tones. Use the darkest tones as dominant and let sage appear with intention, not as scatter.',
  minimal_light:
    'Near-black is your primary for text, headers, and anything that needs to be clearly read. Cool mid-gray fills section dividers and secondary UI. Off-white is your canvas; let it breathe. One unexpected color applied consistently extends this system; three is noise.',
  arctic_blue:
    'Deep slate-blue anchors the system; mid-blue carries structure and navigation. Keep the icy sky tint for backgrounds and negative space so the palette stays crisp rather than heavy.',
  ink_navy:
    'Near-black navy is the dominant voice — use it for type and primary backgrounds. Steel mid-tones bridge to a cool pale wash; reserve the brightest blue-gray for highlights only.',
  paper_stone:
    'Warm stone-gray is your primary for type and framing; mid taupe handles secondary blocks. Cream paper is the dominant background — let texture and typography do the talking.',
  terracotta_clay:
    'Cream is still the primary background so the clay tones read intentional, not loud. Deep terracotta is the accent for CTAs and key moments; mid clay warms dividers and cards.',
  moss_meadow:
    'Deep moss carries weight and readability; mid green supports sections. Soft sage is the accent — one bright note per layout against plenty of pale green canvas.',
  mint_fresh:
    'Dark teal-green grounds everything; jewel teal supports structure. Electric mint is the accent — small, sharp moments on a very light aqua canvas so it never feels neon-drenched.',
  citrus_pop:
    'Deep umber anchors the heat; burnt orange is your main accent. Golden yellow supports energy — pair with plenty of warm white so citrus reads confident, not chaotic.',
  coastal_teal:
    'Midnight teal is primary; cyan is the accent for links, chips, and highlights. Pale aqua canvas keeps the system feeling open and coastal rather than flat corporate blue.',
  sea_glass:
    'Deep emerald anchors; forest mid-tones carry UI chrome. Mint green is the accent on a soft seafoam canvas — organic, fresh, and readable when you keep saturation disciplined.',
  amber_glow:
    'Deep brown-amber is primary for type and headers; mid amber supports panels. Bright gold is the accent — one focal warm per composition on a warm white base.',
  rose_dusk:
    'Near-black wine is primary so the story reads moody and editorial. Deep magenta supports structure; coral-pink is the accent on blush-white — keep brights sparse so it stays luxe, not candy.',
  bubblegum_pulse:
    'Hot rose and lipstick pink are the star: use them for headlines, CTAs, and the one “wow” moment per screen. Deep wine-rose anchors type, and pale bubblegum is breathing room on blush-white — loud pink energy without sliding into violet.',
  carnation_soft:
    'Dusty mauve and cocoa-rose are the workhorses — romantic but muted. Powder pink is the accent for highlights; warm white canvas keeps everything bridal and soft, not neon.',
  violet_haze:
    'Deep violet anchors; royal purple supports structure. Lavender accent on a barely-there lilac canvas — premium and creative when you keep purples tiered, not competing.',
  electric_orchid:
    'Royal purple carries UI weight; vivid magenta-purple is the accent for energy and youth. Pale orchid canvas — playful and digital when you cap neon accents to one per view.',
  plum_violet:
    'Near-black plum is primary; royal purple and red-violet fuchsia support structure. Pale fuchsia-white canvas keeps the family clearly purple — warm violet and magenta bias, not slate blue.',
  copper_spark:
    'Charcoal umber anchors; rust-copper is the accent for heat and urgency. Bright peach canvas keeps orange from reading muddy — one fiery accent per composition.',
  honey_comb:
    'Dark cocoa anchors; antique gold supports warmth. Bright honey yellow is the accent on cream — sunny and farm-table when you let yellow lead only where you need attention.',
  sand_dune:
    'Driftwood taupe is primary for type; warm sand supports cards and dividers. Pale oat is the dominant surface — quieter than terracotta, more open than clay red.',
  sorbet_sunset:
    'Hot magenta is the accent against a dark wine anchor; coral-orange bridges to a warm cream canvas — sunset energy with a punch of pink, not only orange.',
  lagoon_deep:
    'Abyss teal is primary; jewel teal supports structure. Bright aqua is the accent on mint-white — deeper and more jewel-toned than cyan-forward coastal teal.',
}

const FALLBACK_ROLES =
  'Assign one swatch as your primary (dominant presence), another as supporting (secondary sections and framing), and another as accent (the single focal point per layout). Use the swatch widths as a guide for application ratio.'

export function paletteColorRolesParagraph(paletteId: string): string {
  return PALETTE_COLOR_ROLES[canonicalPaletteId(paletteId)] ?? FALLBACK_ROLES
}

/**
 * Short one-line "how to use each role" guidance, palette-agnostic.
 * Reader sees the swatch color directly in the rendered chip; the role line
 * explains *where that color belongs* rather than restating its hex or mood.
 * Paired with the palette rows on the Look spread to produce a scannable
 * role-by-role reference instead of a prose paragraph.
 */
const PALETTE_ROLE_GUIDANCE: Record<string, string> = {
  Primary: 'Carries headlines, body type, and the main graphic weight.',
  Supporting: 'Fills secondary sections, cards, and dividers.',
  Accent: 'One focal moment per layout — CTAs, highlights, pull-quotes.',
  Canvas: 'Let it breathe — give it the largest share of the page.',
}

/**
 * Return the short role guidance for a palette role (Primary / Supporting /
 * Accent / Canvas). Unknown roles fall back to a neutral line.
 */
export function paletteRoleLine(role: string): string {
  return (
    PALETTE_ROLE_GUIDANCE[role] ??
    'Use where the palette proportions call for it.'
  )
}
