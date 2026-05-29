import { canonicalPaletteId } from '@identity-kit/shared'

export interface PaletteOption {
  id: string
  name: string
  swatches: string[]
  tags: Array<'dark-base' | 'light-base' | 'high-contrast' | 'muted' | 'vivid' | 'mono' | 'bold-editorial'>
}

export interface StyleDirectionOption {
  id: string
  title: string
  description: string
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: 'midnight_luxe', name: 'Midnight Luxe', swatches: ['#0B0B0F', '#222333', '#7A6A4F', '#D4C4A8'], tags: ['dark-base', 'muted', 'bold-editorial'] },
  { id: 'earthy_warmth', name: 'Earthy Warmth', swatches: ['#5A3E36', '#A77C5D', '#E5C7A2', '#F8EEDF'], tags: ['light-base', 'muted'] },
  { id: 'stealth_ember', name: 'Stealth Ember', swatches: ['#121212', '#FF6A00', '#FFD166', '#E9ECEF'], tags: ['dark-base', 'high-contrast', 'vivid', 'bold-editorial'] },
  { id: 'signal_orange', name: 'Signal Orange', swatches: ['#0F1115', '#FF5A1F', '#2DD4FF', '#F5F7FA'], tags: ['dark-base', 'high-contrast', 'vivid', 'bold-editorial'] },
  { id: 'neo_utility', name: 'Neo Utility', swatches: ['#171717', '#A3E635', '#38BDF8', '#F8FAFC'], tags: ['dark-base', 'high-contrast', 'vivid', 'bold-editorial'] },
  { id: 'cyber_lime', name: 'Cyber Lime', swatches: ['#10121A', '#8B5CF6', '#A3E635', '#EAF7FF'], tags: ['dark-base', 'high-contrast', 'vivid', 'bold-editorial'] },
  { id: 'noir_cyan', name: 'Noir Cyan', swatches: ['#0B1020', '#00E5FF', '#7C3AED', '#ECF2FF'], tags: ['dark-base', 'high-contrast', 'vivid'] },
  { id: 'ocean_calm', name: 'Ocean Calm', swatches: ['#0D3B66', '#2F6690', '#3A7CA5', '#D9EDFF'], tags: ['light-base', 'muted'] },
  { id: 'sunset_bold', name: 'Sunset Bold', swatches: ['#2D1E2F', '#C8553D', '#F28F3B', '#F7D488'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'sorbet_sunset', name: 'Sorbet Sunset', swatches: ['#3F0A1F', '#DB2777', '#FB923C', '#FFF7ED'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'forest_deep', name: 'Forest Deep', swatches: ['#1B4332', '#2D6A4F', '#40916C', '#D8F3DC'], tags: ['light-base', 'muted'] },
  { id: 'minimal_light', name: 'Minimal Light', swatches: ['#111111', '#666666', '#CFCFCF', '#F7F7F7'], tags: ['light-base', 'mono'] },
  { id: 'arctic_blue', name: 'Arctic Blue', swatches: ['#1A2F4D', '#3B6FB8', '#89B4E8', '#F0F7FF'], tags: ['light-base', 'muted'] },
  { id: 'ink_navy', name: 'Ink Navy', swatches: ['#050A12', '#142233', '#2A4A6E', '#D4DEE8'], tags: ['dark-base', 'muted'] },
  { id: 'paper_stone', name: 'Paper Stone', swatches: ['#3A3634', '#6F6965', '#C9C2BA', '#F6F3EE'], tags: ['light-base', 'mono', 'muted'] },
  { id: 'terracotta_clay', name: 'Terracotta Clay', swatches: ['#5C2E24', '#9C5130', '#D4996C', '#FDF5ED'], tags: ['light-base', 'muted'] },
  { id: 'sand_dune', name: 'Sand Dune', swatches: ['#4F4639', '#8F8170', '#D8CAB8', '#FFFBF5'], tags: ['light-base', 'muted'] },
  { id: 'moss_meadow', name: 'Moss Meadow', swatches: ['#1E3328', '#3D6B4F', '#6FA67A', '#E8F5E9'], tags: ['light-base', 'muted'] },
  { id: 'mint_fresh', name: 'Mint Fresh', swatches: ['#0F3430', '#115E59', '#2DD4BF', '#ECFEFF'], tags: ['light-base', 'vivid'] },
  { id: 'citrus_pop', name: 'Citrus Pop', swatches: ['#3F1610', '#C2410C', '#FBBF24', '#FFFBEB'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'coastal_teal', name: 'Coastal Teal', swatches: ['#083344', '#0E7490', '#22D3EE', '#ECFEFF'], tags: ['light-base', 'vivid'] },
  { id: 'sea_glass', name: 'Sea Glass', swatches: ['#064E3B', '#047857', '#34D399', '#D1FAE5'], tags: ['light-base', 'vivid'] },
  { id: 'lagoon_deep', name: 'Lagoon Deep', swatches: ['#06343B', '#0F766E', '#14B8A6', '#F0FDFA'], tags: ['light-base', 'vivid'] },
  { id: 'amber_glow', name: 'Amber Glow', swatches: ['#713F12', '#B45309', '#FBBF24', '#FFFBEB'], tags: ['light-base', 'vivid'] },
  { id: 'copper_spark', name: 'Copper Spark', swatches: ['#431407', '#9A3412', '#EA580C', '#FFEDD5'], tags: ['light-base', 'vivid'] },
  { id: 'honey_comb', name: 'Honey Comb', swatches: ['#422006', '#A16207', '#EAB308', '#FEFCE8'], tags: ['light-base', 'vivid'] },
  { id: 'rose_dusk', name: 'Rose Dusk', swatches: ['#1F0A14', '#831843', '#FB7185', '#F1F5F9'], tags: ['light-base', 'muted'] },
  { id: 'bubblegum_pulse', name: 'Bubblegum Pulse', swatches: ['#881337', '#E11D48', '#FDA4AF', '#FFFFFF'], tags: ['light-base', 'vivid'] },
  { id: 'carnation_soft', name: 'Carnation Soft', swatches: ['#3F2D32', '#7C3A5F', '#E8B4C2', '#EDD4DE'], tags: ['light-base', 'muted'] },
  { id: 'violet_haze', name: 'Violet Haze', swatches: ['#2E1065', '#6D28D9', '#A78BFA', '#EDE9FE'], tags: ['light-base', 'vivid'] },
  { id: 'electric_orchid', name: 'Electric Orchid', swatches: ['#4C1D95', '#9333EA', '#E879F9', '#FAF5FF'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'plum_violet', name: 'Plum Violet', swatches: ['#2F0F28', '#701A75', '#A21CAF', '#FDF4FF'], tags: ['light-base', 'muted'] },
  { id: 'mews_pop', name: 'Mews Pop', swatches: ['#131313', '#FF2EA6', '#FFFFFF', '#C7CBD6'], tags: ['dark-base', 'high-contrast', 'bold-editorial'] },
  { id: 'cobalt_punch', name: 'Cobalt Punch', swatches: ['#131722', '#2563EB', '#F43F5E', '#E2E8F0'], tags: ['dark-base', 'high-contrast', 'vivid', 'bold-editorial'] },
  { id: 'candy_burst', name: 'Candy Burst', swatches: ['#FF4FA3', '#7C5CFF', '#22C55E', '#FFF4F8'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'citrus_splash', name: 'Citrus Splash', swatches: ['#0EA5E9', '#F97316', '#FACC15', '#F8FAFC'], tags: ['light-base', 'high-contrast', 'vivid'] },
  { id: 'studio_confetti', name: 'Studio Confetti', swatches: ['#EC4899', '#06B6D4', '#84CC16', '#F5F3FF'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'raspberry_indigo', name: 'Raspberry Indigo', swatches: ['#DB2777', '#4F46E5', '#06B6D4', '#F5F3FF'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'emerald_amber_blue', name: 'Emerald Amber Blue', swatches: ['#10B981', '#2563EB', '#F59E0B', '#FFFBF5'], tags: ['light-base', 'vivid'] },
  { id: 'magenta_orange_cyan', name: 'Magenta Orange Cyan', swatches: ['#EC4899', '#FB923C', '#22D3EE', '#F8FAFC'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'midnight_cerulean', name: 'Indigo Mist', swatches: ['#1E1B4B', '#4338CA', '#818CF8', '#EEF2FF'], tags: ['light-base', 'muted'] },
  { id: 'powder_navy', name: 'Denim Air', swatches: ['#172554', '#1E40AF', '#60A5FA', '#EFF6FF'], tags: ['light-base', 'muted'] },
  { id: 'graphite_fog', name: 'Graphite Fog', swatches: ['#131313', '#404040', '#8C8C8C', '#EBEBEB'], tags: ['light-base', 'mono', 'muted'] },
  { id: 'carbon_paper', name: 'Carbon Paper', swatches: ['#0A0A0A', '#3D3D3D', '#CFCFCF', '#FFFFFF'], tags: ['light-base', 'mono', 'muted'] },
  { id: 'walnut_cream', name: 'Walnut Cream', swatches: ['#271C15', '#7A4A2F', '#D4A574', '#FFF9ED'], tags: ['light-base', 'muted'] },
  { id: 'toffee_sand', name: 'Toffee Sand', swatches: ['#4A3520', '#9A7316', '#E8C468', '#FFFBEB'], tags: ['light-base', 'muted'] },
  { id: 'espresso_oat', name: 'Espresso Oat', swatches: ['#3E2A22', '#6B4B3E', '#A9856C', '#F7EEE5'], tags: ['light-base', 'muted'] },
  { id: 'cedar_grove', name: 'Cedar Grove', swatches: ['#2F3320', '#5C6D2A', '#9CAF50', '#F7FBEA'], tags: ['light-base', 'muted'] },
  { id: 'pine_mint', name: 'Pine Mint', swatches: ['#263B0F', '#4D7C0F', '#C4E85A', '#F7FEE7'], tags: ['light-base', 'vivid'] },
  { id: 'deep_aqua', name: 'Deep Aqua', swatches: ['#0F2428', '#2A4F56', '#5E9AA3', '#E5F4F7'], tags: ['light-base', 'muted'] },
  { id: 'teal_breeze', name: 'Teal Breeze', swatches: ['#001524', '#005F8C', '#00A8E8', '#E1F6FF'], tags: ['light-base', 'vivid'] },
  { id: 'apricot_twilight', name: 'Apricot Twilight', swatches: ['#352428', '#995C6B', '#F4A574', '#FFF5EF'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'ember_sorbet', name: 'Ember Sorbet', swatches: ['#3E0F12', '#B83226', '#FF7B54', '#FFF0EA'], tags: ['light-base', 'vivid', 'bold-editorial'] },
  { id: 'bronze_daylight', name: 'Bronze Daylight', swatches: ['#4D2C10', '#8E4A12', '#D97706', '#FFF6E8'], tags: ['light-base', 'vivid'] },
  { id: 'saffron_spice', name: 'Saffron Spice', swatches: ['#5C1A1A', '#9A3412', '#D97706', '#FFF7ED'], tags: ['light-base', 'vivid'] },
  { id: 'dust_rose_ink', name: 'Dust Rose Ink', swatches: ['#241018', '#6D3A52', '#C48BA3', '#FAF5F0'], tags: ['light-base', 'muted'] },
  { id: 'berry_blush', name: 'Berry Blush', swatches: ['#1C0A18', '#9D174D', '#F472B6', '#F5F3FF'], tags: ['light-base', 'vivid'] },
  { id: 'indigo_bloom', name: 'Indigo Bloom', swatches: ['#1A1035', '#43309A', '#6366F1', '#E8EAFC'], tags: ['light-base', 'vivid'] },
  { id: 'royal_lilac', name: 'Royal Lilac', swatches: ['#3B0764', '#7C3AED', '#C4B5FD', '#FAF5FF'], tags: ['light-base', 'vivid'] },
]

/** Hue / mood groupings for the palette step: tap a chip to filter the list below (same screen). */
export interface PaletteFamily {
  id: string
  label: string
  /** Solid chip color; `null` = multi-hue “All” chip (styled in UI). */
  chipColor: string | null
  /** Optional mini-swatch chip for mixed families. */
  chipSwatches?: readonly string[]
  paletteIds: readonly string[]
}

/**
 * Chip order: common brand directions first, then secondary hues. Every chip filters real palettes.
 */
export const PALETTE_FAMILIES: PaletteFamily[] = [
  {
    id: 'all',
    label: 'All palettes',
    chipColor: null,
    chipSwatches: ['#2F6690', '#0E7490', '#9C5130', '#B45309'],
    paletteIds: PALETTE_OPTIONS.map((p) => p.id),
  },
  {
    id: 'blue',
    label: 'Blue',
    chipColor: '#2F6690',
    paletteIds: ['ocean_calm', 'arctic_blue', 'ink_navy', 'midnight_cerulean', 'powder_navy'],
  },
  {
    id: 'neutral',
    label: 'Black & gray',
    chipColor: '#3F3F3F',
    paletteIds: ['midnight_luxe', 'minimal_light', 'paper_stone', 'graphite_fog', 'carbon_paper'],
  },
  {
    id: 'earth',
    label: 'Brown & tan',
    chipColor: '#8B5A3C',
    paletteIds: ['earthy_warmth', 'terracotta_clay', 'sand_dune', 'walnut_cream', 'toffee_sand', 'espresso_oat'],
  },
  {
    id: 'green',
    label: 'Green',
    chipColor: '#2D6A4F',
    paletteIds: ['forest_deep', 'moss_meadow', 'mint_fresh', 'cedar_grove', 'pine_mint'],
  },
  {
    id: 'teal',
    label: 'Teal',
    chipColor: '#0E7490',
    paletteIds: ['coastal_teal', 'sea_glass', 'lagoon_deep', 'deep_aqua', 'teal_breeze'],
  },
  {
    id: 'sunset',
    label: 'Coral & sunset',
    chipColor: '#E07A4F',
    paletteIds: ['sunset_bold', 'citrus_pop', 'sorbet_sunset', 'apricot_twilight', 'ember_sorbet'],
  },
  {
    id: 'amber',
    label: 'Amber',
    chipColor: '#B45309',
    paletteIds: ['amber_glow', 'copper_spark', 'honey_comb', 'bronze_daylight', 'saffron_spice'],
  },
  {
    id: 'rose',
    label: 'Rose',
    chipColor: '#BE5264',
    paletteIds: ['rose_dusk', 'bubblegum_pulse', 'carnation_soft', 'dust_rose_ink', 'berry_blush'],
  },
  {
    id: 'violet',
    label: 'Violet',
    chipColor: '#5B4B8A',
    paletteIds: ['violet_haze', 'electric_orchid', 'plum_violet', 'indigo_bloom', 'royal_lilac'],
  },
  {
    id: 'dark-accent',
    label: 'Noir',
    chipColor: null,
    chipSwatches: ['#0F1115', '#FF6A00', '#00E5FF', '#FF2EA6'],
    paletteIds: ['stealth_ember', 'signal_orange', 'noir_cyan', 'mews_pop', 'cobalt_punch'],
  },
  {
    id: 'pop',
    label: 'Pop multi-color',
    chipColor: null,
    chipSwatches: ['#F97316', '#FACC15', '#06B6D4', '#22C55E'],
    paletteIds: [
      'citrus_splash',
      'studio_confetti',
      'candy_burst',
      'raspberry_indigo',
      'emerald_amber_blue',
      'magenta_orange_cyan',
    ],
  },
]

export function paletteFamilyContaining(paletteId: string): PaletteFamily | undefined {
  const id = canonicalPaletteId(paletteId)
  return PALETTE_FAMILIES.find((f) => f.id !== 'all' && f.paletteIds.includes(id))
}

export const STYLE_DIRECTION_OPTIONS: StyleDirectionOption[] = [
  {
    id: 'clean_minimal',
    title: 'Clean and Minimal',
    description: 'Lots of breathing room, nothing extra.',
  },
  {
    id: 'bold_graphic',
    title: 'Bold and Graphic',
    description: 'Eye-catching, high-contrast, and made to stand out.',
  },
  {
    id: 'organic_natural',
    title: 'Organic and Natural',
    description: 'Soft, earthy, and more handcrafted in feel.',
  },
  {
    id: 'luxe_refined',
    title: 'Luxe and Refined',
    description: 'Elegant, understated, and premium.',
  },
]

export const STYLE_DIRECTION_LABELS = Object.fromEntries(
  STYLE_DIRECTION_OPTIONS.map((option) => [option.id, option.title]),
) as Record<string, string>

export { PALETTE_LABELS } from '@identity-kit/shared'
