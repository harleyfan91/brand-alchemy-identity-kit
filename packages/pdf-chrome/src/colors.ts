/**
 * Fixed Brand Alchemy neutrals for PDF body copy and chrome (not customer palette swatches).
 */
export const BRAND_PDF_COLORS = {
  black: '#111111',
  bodyText: '#3F3F46',
  subText: '#A1A1AA',
  /** Matches `BrandWordmark` compact strip: `text-zinc-600` */
  wordmarkGray: '#52525B',
} as const

export type BrandPdfColorKey = keyof typeof BRAND_PDF_COLORS
