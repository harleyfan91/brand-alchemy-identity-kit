export { BRAND_PDF_COLORS } from './colors.js'
export type { BrandPdfColorKey } from './colors.js'
export {
  FOOTER_CHROME_HEIGHT,
  FOOTER_STRIP_FROM_BOTTOM,
  FOOTER_STRIP_GAP,
  FOOTER_STRIP_HEIGHT,
  FOOTER_WATERMARK_BOTTOM,
  FOOTER_WATERMARK_LINE,
  brandPdfFooterMetrics,
  pdfPageBottomPadding,
} from './metrics.js'
export { PageFooterChrome, BrandPdfFooter } from './PageFooterChrome.js'
export { registerBrandPdfFonts } from './registerBrandPdfFonts.js'
export { resolveBrandSymbolStripPngPath } from './resolveSymbolStripPngPath.js'

// Optional single-import surface for consumers:
// import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@identity-kit/pdf-chrome'
export {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer'
