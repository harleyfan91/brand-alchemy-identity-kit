import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'

import { BRAND_PDF_COLORS } from './colors.js'
import {
  FOOTER_STRIP_FROM_BOTTOM,
  FOOTER_STRIP_HEIGHT,
  FOOTER_WATERMARK_BOTTOM,
} from './metrics.js'
import { resolveBrandSymbolStripPngPath } from './resolveSymbolStripPngPath.js'

const symbolStripPngPath = resolveBrandSymbolStripPngPath()

const footerStyles = StyleSheet.create({
  footerBrandRow: {
    position: 'absolute',
    bottom: FOOTER_WATERMARK_BOTTOM,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  /**
   * Slightly smaller than compact web strip; zinc-600; tight tracking (≈0.025em at ~7.5pt).
   */
  footerBrandText: {
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    fontWeight: 700,
    letterSpacing: 0.2,
    color: BRAND_PDF_COLORS.wordmarkGray,
  },
  footerStripWrap: {
    position: 'absolute',
    bottom: FOOTER_STRIP_FROM_BOTTOM,
    left: 0,
    right: 0,
    height: FOOTER_STRIP_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  footerStripImage: {
    width: 612,
    height: FOOTER_STRIP_HEIGHT,
    objectFit: 'contain',
  },
})

/**
 * Fixed footer: full-width symbol strip PNG + “BRAND ALCHEMY” wordmark. Place inside each `<Page>` (sibling to body).
 */
export function PageFooterChrome() {
  return (
    <>
      {symbolStripPngPath ? (
        <View style={footerStyles.footerStripWrap} fixed>
          <Image src={symbolStripPngPath} style={footerStyles.footerStripImage} />
        </View>
      ) : null}
      <View style={footerStyles.footerBrandRow} fixed>
        <Text style={footerStyles.footerBrandText}>BRAND ALCHEMY</Text>
      </View>
    </>
  )
}

/** Alias for {@link PageFooterChrome} */
export const BrandPdfFooter = PageFooterChrome
