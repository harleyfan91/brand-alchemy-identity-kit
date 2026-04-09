export interface PaletteOption {
  id: string
  name: string
  swatches: string[]
}

export interface StyleDirectionOption {
  id: string
  title: string
  description: string
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: 'midnight_luxe', name: 'Midnight Luxe', swatches: ['#0B0B0F', '#222333', '#7A6A4F', '#D4C4A8'] },
  { id: 'earthy_warmth', name: 'Earthy Warmth', swatches: ['#5A3E36', '#A77C5D', '#E5C7A2', '#F8EEDF'] },
  { id: 'ocean_calm', name: 'Ocean Calm', swatches: ['#0D3B66', '#2F6690', '#3A7CA5', '#D9EDFF'] },
  { id: 'sunset_bold', name: 'Sunset Bold', swatches: ['#2D1E2F', '#C8553D', '#F28F3B', '#F7D488'] },
  { id: 'forest_deep', name: 'Forest Deep', swatches: ['#1B4332', '#2D6A4F', '#40916C', '#D8F3DC'] },
  { id: 'minimal_light', name: 'Minimal Light', swatches: ['#111111', '#666666', '#CFCFCF', '#F7F7F7'] },
]

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

export const PALETTE_LABELS = Object.fromEntries(
  PALETTE_OPTIONS.map((option) => [option.id, option.name]),
) as Record<string, string>
