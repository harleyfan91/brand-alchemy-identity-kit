/** Style Guide landscape page inner body (792 − 2×44). */
export const KIT_PALETTE_BODY_INNER_WIDTH_PT = 704

/** Wide column flex ratio in two-column deck spreads (narrow 0.34, wide 1). */
const KIT_PALETTE_WIDE_COL_FLEX = 1
const KIT_PALETTE_NARROW_COL_FLEX = 0.34
const KIT_PALETTE_WIDE_COL_PADDING_LEFT_PT = 12

/** Locked slot count — tile width always assumes a 4-up Style Guide folio 01 row. */
export const KIT_PALETTE_SLOT_COUNT = 4

const STYLE_GUIDE_DECK_SWATCH_BASELINE_PT = 260
const GUIDE_FOLIO_02A_SWATCH_BASELINE_PT = 340
const LETTER_LANDSCAPE_HEIGHT_PT = 612
const GUIDE_LANDSCAPE_HEIGHT_PT = 554

/** Scale vertical layout constants designed for 612pt-tall landscape down to guide page height. */
export function landscapeLayoutV(baselinePt: number): number {
  return Math.round((baselinePt * GUIDE_LANDSCAPE_HEIGHT_PT) / LETTER_LANDSCAPE_HEIGHT_PT)
}

/** Style Guide folio 01 wide-column content width. */
export function kitPaletteStripInnerWidthPt(bodyInnerWidthPt = KIT_PALETTE_BODY_INNER_WIDTH_PT): number {
  const rowWidth =
    bodyInnerWidthPt /
    (KIT_PALETTE_NARROW_COL_FLEX + KIT_PALETTE_WIDE_COL_FLEX) *
    KIT_PALETTE_WIDE_COL_FLEX
  return Math.floor(rowWidth - KIT_PALETTE_WIDE_COL_PADDING_LEFT_PT)
}

/** One tile width on Style Guide folio 01 (513 / 4 → 128pt). */
export function kitPaletteTileWidthPt(bodyInnerWidthPt = KIT_PALETTE_BODY_INNER_WIDTH_PT): number {
  return Math.floor(kitPaletteStripInnerWidthPt(bodyInnerWidthPt) / KIT_PALETTE_SLOT_COUNT)
}

/** Row height on Style Guide folio 01 deck. */
export function kitPaletteRowHeightPt(): number {
  return landscapeLayoutV(STYLE_GUIDE_DECK_SWATCH_BASELINE_PT)
}

/** Brand Identity Guide folio 02a full-height equal swatch row. */
export function kitPaletteGuideFolio02aRowHeightPt(): number {
  return landscapeLayoutV(GUIDE_FOLIO_02A_SWATCH_BASELINE_PT)
}

export const KIT_PALETTE_DECK_NAME_FONT_SIZE = 20

/** Portrait Brief: same tile width, ~55% height so the strip fits editorially on letter. */
export function kitPaletteBriefCompactRowHeightPt(): number {
  return Math.round(kitPaletteRowHeightPt() * 0.55)
}

export const KIT_PALETTE_BRIEF_COMPACT_NAME_FONT_SIZE = 14

/** Total row width for N filled slots (accounts for −1pt overlap between tiles). */
export function kitPaletteRowWidthPt(swatchCount: number, tileWidthPt = kitPaletteTileWidthPt()): number {
  if (swatchCount <= 0) return 0
  return swatchCount * tileWidthPt - (swatchCount - 1)
}
