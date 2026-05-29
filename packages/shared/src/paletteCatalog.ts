import { canonicalPaletteId } from './paletteLegacy.js'

export type PaletteCatalogEntry = {
  displayName: string
  description: string
}

/** Wizard palette ids with buyer-facing name + color-system descriptor. Single source of truth. */
export const PALETTE_CATALOG: Record<string, PaletteCatalogEntry> = {
  amber_glow: { displayName: 'Amber Glow', description: 'Brown-amber through gold on warm white. Warm, optimistic, and approachable.' },
  apricot_twilight: { displayName: 'Apricot Twilight', description: 'Dusty plum through mauve-rose clay to soft apricot on warm shell. Editorial warmth, pinker than ember sorbet.' },
  arctic_blue: { displayName: 'Arctic Blue', description: 'Cool blues from deep slate to icy sky. Crisp, modern, and quietly confident.' },
  berry_blush: { displayName: 'Berry Blush', description: 'Near-black wine through magenta-berry to hot pink on lilac-mist white. Violet-tinted canvas vs rose-blush family.' },
  bronze_daylight: { displayName: 'Bronze Daylight', description: 'Bronze umber through burnt orange to daylight gold on soft cream. Rich metal warmth.' },
  bubblegum_pulse: { displayName: 'Bubblegum Pulse', description: 'Wine anchor, lipstick pink, and hot tint on pure white. High-contrast pop vs blush canvases.' },
  candy_burst: { displayName: 'Candy Burst', description: 'Hot pink, violet, and fresh green on pale blush. Playful pop with readable lift.' },
  carbon_paper: { displayName: 'Carbon Paper', description: 'True black through solid mid-gray to bright silver and pure white — high-contrast print mono.' },
  carnation_soft: { displayName: 'Carnation Soft', description: 'Dusty mauve and cocoa-rose on tinted blush shell — deeper “light” than paper pink.' },
  cedar_grove: { displayName: 'Cedar Grove', description: 'Olive and hay greens from deep khaki to chartreuse on pale lime canvas. Warmer and yellower than blue-green forest ramps.' },
  citrus_pop: { displayName: 'Citrus Pop', description: 'Umber, ember orange, and golden yellow on warm white. Energetic and appetizing.' },
  citrus_splash: { displayName: 'Citrus Splash', description: 'Sky blue, tangerine, and lemon on cool white. Bright, upbeat, and approachable.' },
  coastal_teal: { displayName: 'Coastal Teal', description: 'Deep teal, cyan, and pale aqua. Open water, clear skies, modern trust.' },
  cobalt_punch: { displayName: 'Cobalt Punch', description: 'Deep charcoal with cobalt blue and hot coral on light fog. Bold and high-contrast.' },
  copper_spark: { displayName: 'Copper Spark', description: 'Umber, rust copper, and ember orange on peach. Warm, spicy, and assertive.' },
  cyber_lime: { displayName: 'Cyber Lime', description: 'Deep night base with violet and acid-lime on icy white. Futuristic and high-voltage.' },
  deep_aqua: { displayName: 'Deep Aqua', description: 'Slate-teal depth through dusty aqua on ice mist. Restrained chroma — distinct from cyan-forward coastal teal.' },
  dust_rose_ink: { displayName: 'Dust Rose Ink', description: 'Cool plum-black through dusty rosewood to mauve-rose on warm parchment. Editorial, not bubblegum pink.' },
  earthy_warmth: { displayName: 'Earthy Warmth', description: 'Warm terracotta and caramel tones on a creamy neutral base. Natural, handcrafted, and grounded.' },
  electric_orchid: { displayName: 'Electric Orchid', description: 'Royal purple to hot orchid on pale violet. Vibrant, playful, and bold.' },
  ember_sorbet: { displayName: 'Ember Sorbet', description: 'Wine-red anchor, hot ember mid, and coral-orange pop on pale shell. Red-hot sunset vs apricot’s dusty rose clay.' },
  emerald_amber_blue: { displayName: 'Emerald Amber Blue', description: 'Emerald and cobalt with warm amber on soft cream. Energetic, grounded, and commercial.' },
  espresso_oat: { displayName: 'Espresso Oat', description: 'Espresso brown and warm taupe on pale oat cream. Clearly in the brown family, not charcoal gray.' },
  forest_deep: { displayName: 'Forest Deep', description: 'Deep forest greens from near-black to fresh sage. Organic, grounded, and quietly confident.' },
  graphite_fog: { displayName: 'Graphite Fog', description: 'Near-black through mid graphite to pale gray — achromatic only, no slate blue cast.' },
  honey_comb: { displayName: 'Honey Comb', description: 'Cocoa, antique gold, and bright honey on cream. Sunny, rustic optimism.' },
  indigo_bloom: { displayName: 'Indigo Bloom', description: 'Cool indigo anchor through blue-violet to periwinkle canvas. Separated from royal purple haze ramps.' },
  ink_navy: { displayName: 'Ink Navy', description: 'Ink-dark navy through steel blue to pale cool gray. Editorial and precise.' },
  lagoon_deep: { displayName: 'Lagoon Deep', description: 'Abyss teal to bright aqua on mint white. Deep jewel water.' },
  magenta_orange_cyan: { displayName: 'Magenta Orange Cyan', description: 'Magenta, orange, and cyan on cool white. Punchy and modern with clear contrast lanes.' },
  mews_pop: { displayName: 'Mews Pop', description: 'Near-black and electric pink with white and cool gray. Fashion editorial with punch.' },
  midnight_cerulean: { displayName: 'Indigo Mist', description: 'Indigo anchor through royal violet-blue to pale periwinkle. Creative and premium without reading as teal.' },
  midnight_luxe: { displayName: 'Midnight Luxe', description: 'Rich near-blacks and dark navy grounded in depth, with a warm gold-tan highlight. Premium and high-contrast.' },
  minimal_light: { displayName: 'Minimal Light', description: 'Near-black, cool mid-gray, and clean off-white. A versatile neutral system that lets content lead.' },
  mint_fresh: { displayName: 'Mint Fresh', description: 'Deep teal, jewel teal, and electric mint on aqua white. Fresh and digital-native.' },
  moss_meadow: { displayName: 'Moss Meadow', description: 'Deep moss to soft sage on a pale green base. Natural and composed.' },
  neo_utility: { displayName: 'Neo Utility', description: 'Graphite base with lime and sky accents on soft white. Utility-forward, modern energy.' },
  noir_cyan: { displayName: 'Noir Cyan', description: 'Ink-dark navy with vivid cyan and violet on pale mist. Tech-forward and sharp.' },
  ocean_calm: { displayName: 'Ocean Calm', description: 'Cool layered blues from deep navy to pale sky. Confident, calm, and trustworthy without feeling corporate.' },
  paper_stone: { displayName: 'Paper Stone', description: 'Warm stone neutrals on cream paper. Tactile, calm, and editorial.' },
  pine_mint: { displayName: 'Pine Mint', description: 'Olive anchor through forest green to warm chartreuse on pale lime. Yellow-green lane, not blue-green forest.' },
  plum_violet: { displayName: 'Plum Violet', description: 'Plum-black through royal purple to red-violet on pale fuchsia. Rich violet, not slate blue.' },
  powder_navy: { displayName: 'Denim Air', description: 'Ink-navy anchor, royal blue mid-tone, and airy sky. Energetic SMB blue — not a fourth navy ramp.' },
  raspberry_indigo: { displayName: 'Raspberry Indigo', description: 'Raspberry and indigo with cyan lift on a pale violet base. Expressive yet structured.' },
  rose_dusk: { displayName: 'Rose Dusk', description: 'Wine-black through magenta-rose to coral on cool cloud white. Moody romance without pink-white sameness.' },
  royal_lilac: { displayName: 'Royal Lilac', description: 'Electric royal violet through soft lilac on pale orchid. Pastel lift without hot magenta orchid.' },
  saffron_spice: { displayName: 'Saffron Spice', description: 'Paprika-wine anchor through rust to vivid orange-amber on warm shell. Red-spice heat, distinct from cocoa-honey gold.' },
  sand_dune: { displayName: 'Sand Dune', description: 'Driftwood taupe and pale oat. Neutral earth without red clay.' },
  sea_glass: { displayName: 'Sea Glass', description: 'Emerald depth to mint highlight on seafoam. Restorative and organic.' },
  signal_orange: { displayName: 'Signal Orange', description: 'Charcoal base with electric orange and cyan on cloud white. Assertive and digital.' },
  sorbet_sunset: { displayName: 'Sorbet Sunset', description: 'Wine, hot pink, and coral sorbet on warm cream. Juicy sunset contrast.' },
  stealth_ember: { displayName: 'Stealth Ember', description: 'Near-black base with signal orange and warm gold on cool mist. High contrast and kinetic.' },
  studio_confetti: { displayName: 'Studio Confetti', description: 'Magenta, cyan, and lime on pale lavender. Creative, expressive, and modern.' },
  sunset_bold: { displayName: 'Sunset Bold', description: 'Deep plum, burnt orange, and amber. Expressive, warm, and designed to stand out.' },
  teal_breeze: { displayName: 'Teal Breeze', description: 'Ink-navy pool through cobalt cyan to icy sky. Deeper and bluer than coastal green-teal, still cyan-forward.' },
  terracotta_clay: { displayName: 'Terracotta Clay', description: 'Burnt clay and caramel on warm cream. Artisanal, grounded, and inviting.' },
  toffee_sand: { displayName: 'Toffee Sand', description: 'Deep sand anchor, antique brass mid, and bright butter gold on lemon-white. Golden earth, not red clay.' },
  violet_haze: { displayName: 'Violet Haze', description: 'Deep violet through soft lavender. Creative, premium, and distinctive.' },
  walnut_cream: { displayName: 'Walnut Cream', description: 'Deep walnut through chestnut to maple wheat on warm ivory — red-gold wood lane, not espresso taupe.' },
}

export const PALETTE_IDS = Object.keys(PALETTE_CATALOG) as (keyof typeof PALETTE_CATALOG)[]

export function resolvePaletteCatalogEntry(paletteId: string): PaletteCatalogEntry | undefined {
  const id = canonicalPaletteId(paletteId?.trim() ?? "")
  if (!id) return undefined
  return PALETTE_CATALOG[id];
}

/** Buyer-facing palette name for headers and labels (no trailing period). */
export function resolvePaletteDisplayName(paletteId: string): string {
  const entry = resolvePaletteCatalogEntry(paletteId);
  if (entry) return entry.displayName;
  const id = canonicalPaletteId(paletteId?.trim() ?? "");
  return id ? `Unknown palette (${id})` : "Palette not selected";
}

/** Folio 02a section header — "Palette: {name}" (uppercase at render time). */
export function formatPaletteGuideHeader(paletteId: string): string {
  return `Palette: ${resolvePaletteDisplayName(paletteId)}`;
}

/** Descriptor-only sentence for Style Guide prose (name + period + description). */
export function formatPaletteLeadSentence(paletteId: string): string {
  const entry = resolvePaletteCatalogEntry(paletteId);
  if (entry) return `${entry.displayName}. ${entry.description}`;
  const id = canonicalPaletteId(paletteId?.trim() ?? "");
  return id ? `Unknown palette (${id}). Verify selectedPalette matches a wizard option.` : "Palette not selected.";
}

export function isValidPaletteId(paletteId: string): boolean {
  return Boolean(resolvePaletteCatalogEntry(paletteId));
}

/** @deprecated Use PALETTE_CATALOG[id].description — kept for gradual migration. */
export const paletteDescriptions: Record<string, string> = Object.fromEntries(
  Object.entries(PALETTE_CATALOG).map(([id, e]) => [id, e.description]),
);

export const PALETTE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(PALETTE_CATALOG).map(([id, e]) => [id, e.displayName]),
);
