import { canonicalPaletteId } from '../paletteLegacy.js'
import { PALETTE_IDS } from '../paletteCatalog.js'
import type { ImageBankPaletteFamily } from './tags.js'

/**
 * Deterministic map: every wizard palette id → one moodboard palette family.
 * Used by the tag matcher when resolving `step6.selectedPalette`.
 *
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Palette family
 */
export const PALETTE_ID_TO_IMAGE_BANK_FAMILY: Record<string, ImageBankPaletteFamily> = {
  amber_glow: 'warm-earth',
  apricot_twilight: 'soft-organic',
  arctic_blue: 'cool-minimal',
  berry_blush: 'deep-moody',
  bronze_daylight: 'warm-earth',
  bubblegum_pulse: 'bold-saturated',
  candy_burst: 'bold-saturated',
  carbon_paper: 'clean-monochrome',
  carnation_soft: 'soft-organic',
  cedar_grove: 'warm-earth',
  citrus_pop: 'bright-fresh',
  citrus_splash: 'bold-saturated',
  coastal_teal: 'bright-fresh',
  cobalt_punch: 'bold-saturated',
  copper_spark: 'warm-earth',
  cyber_lime: 'bold-saturated',
  deep_aqua: 'cool-minimal',
  dust_rose_ink: 'deep-moody',
  earthy_warmth: 'warm-earth',
  electric_orchid: 'bold-saturated',
  ember_sorbet: 'deep-moody',
  emerald_amber_blue: 'bold-saturated',
  espresso_oat: 'warm-earth',
  forest_deep: 'soft-organic',
  graphite_fog: 'clean-monochrome',
  honey_comb: 'warm-earth',
  indigo_bloom: 'muted-sophisticated',
  ink_navy: 'deep-moody',
  lagoon_deep: 'soft-organic',
  magenta_orange_cyan: 'bold-saturated',
  mews_pop: 'bold-saturated',
  midnight_cerulean: 'muted-sophisticated',
  midnight_luxe: 'deep-moody',
  minimal_light: 'cool-minimal',
  mint_fresh: 'bright-fresh',
  moss_meadow: 'soft-organic',
  neo_utility: 'bold-saturated',
  noir_cyan: 'bold-saturated',
  ocean_calm: 'cool-minimal',
  paper_stone: 'cool-minimal',
  pine_mint: 'soft-organic',
  plum_violet: 'deep-moody',
  powder_navy: 'bright-fresh',
  raspberry_indigo: 'bold-saturated',
  rose_dusk: 'deep-moody',
  royal_lilac: 'bright-fresh',
  saffron_spice: 'warm-earth',
  sand_dune: 'warm-earth',
  sea_glass: 'soft-organic',
  signal_orange: 'bold-saturated',
  sorbet_sunset: 'deep-moody',
  stealth_ember: 'bold-saturated',
  studio_confetti: 'bold-saturated',
  sunset_bold: 'bright-fresh',
  teal_breeze: 'bright-fresh',
  terracotta_clay: 'warm-earth',
  toffee_sand: 'warm-earth',
  violet_haze: 'muted-sophisticated',
  walnut_cream: 'warm-earth',
}

export function paletteFamilyFromPaletteId(paletteId: string): ImageBankPaletteFamily | undefined {
  const id = canonicalPaletteId(paletteId?.trim() ?? '')
  if (!id) return undefined
  return PALETTE_ID_TO_IMAGE_BANK_FAMILY[id]
}

/** Throws in tests / CI when a catalog palette lacks a family mapping. */
export function assertCompletePaletteFamilyCoverage(): void {
  const missing = PALETTE_IDS.filter((id) => !PALETTE_ID_TO_IMAGE_BANK_FAMILY[id])
  if (missing.length > 0) {
    throw new Error(`Missing palette family mapping for: ${missing.join(', ')}`)
  }
}
