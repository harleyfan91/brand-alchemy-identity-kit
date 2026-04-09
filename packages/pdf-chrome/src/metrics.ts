/**
 * Footer chrome: symbol strip + “BRAND ALCHEMY” wordmark row.
 * Strip is full letter width (612pt); wordmark sits bottom-right under the strip.
 */
export const FOOTER_WATERMARK_BOTTOM = 5
/** ~line box for small footer type */
export const FOOTER_WATERMARK_LINE = 9
export const FOOTER_STRIP_GAP = 4
export const FOOTER_STRIP_HEIGHT = 26
/** Strip sits above the wordmark */
export const FOOTER_STRIP_FROM_BOTTOM =
  FOOTER_WATERMARK_BOTTOM + FOOTER_WATERMARK_LINE + FOOTER_STRIP_GAP
/** Total reserved bottom margin so flowing body does not collide with fixed footer */
export const FOOTER_CHROME_HEIGHT = FOOTER_STRIP_FROM_BOTTOM + FOOTER_STRIP_HEIGHT + 8

/** Same as {@link FOOTER_CHROME_HEIGHT} — use as `Page` `paddingBottom` when the footer is fixed. */
export const pdfPageBottomPadding = FOOTER_CHROME_HEIGHT

/** Bundled metrics for consumers that prefer a single object */
export const brandPdfFooterMetrics = {
  footerWatermarkBottom: FOOTER_WATERMARK_BOTTOM,
  footerWatermarkLine: FOOTER_WATERMARK_LINE,
  footerStripGap: FOOTER_STRIP_GAP,
  footerStripHeight: FOOTER_STRIP_HEIGHT,
  footerStripFromBottom: FOOTER_STRIP_FROM_BOTTOM,
  footerChromeHeight: FOOTER_CHROME_HEIGHT,
  pdfPageBottomPadding,
} as const
