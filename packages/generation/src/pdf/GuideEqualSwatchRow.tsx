import { Text, View } from '@react-pdf/renderer'

import { contrastRatioOnWhite } from '../deterministic/colorContrast.js'
import { getKitPaletteSwatchFontFamilies } from './kitDocumentFonts.js'
import {
  kitPaletteGuideFolio02aRowHeightPt,
  landscapeLayoutV,
} from './kitPaletteSwatchGeometry.js'
import { wholeWordHyphenation } from './pdfHyphenation.js'
import type { CoreKitPdfStyles } from './CoreKitDocuments.js'

function onColor(hex: string): string {
  return contrastRatioOnWhite(hex) >= 4.5 ? '#FFFFFF' : '#1A1A2E'
}

const paletteSwatchFonts = getKitPaletteSwatchFontFamilies()

/**
 * Folio 02a swatch row — equal blocks with uppercase hex + friendly name.
 * See OUTPUT_TRANSLATION_SPEC §10A.12.
 */
export function GuideEqualSwatchRow({
  styles: S,
  swatches,
  minHeightPt = kitPaletteGuideFolio02aRowHeightPt(),
  nameFontSize = 24,
  fillHeight = true,
  tilePaddingTop = 18,
  tilePaddingBottom = 16,
  tilePaddingHorizontal = 12,
  hexMarginTop = 10,
  tileWidthPt,
}: {
  styles: CoreKitPdfStyles
  swatches: Array<{ hex: string; name: string }>
  minHeightPt?: number
  nameFontSize?: number
  /** When false, row uses a fixed tile height so stacked copy below cannot overlap (folio 01 deck). */
  fillHeight?: boolean
  tilePaddingTop?: number
  tilePaddingBottom?: number
  tilePaddingHorizontal?: number
  hexMarginTop?: number
  /** When set, each tile uses this width instead of equal flex — keeps few swatches tall and slim. */
  tileWidthPt?: number
}) {
  const tileHeightStyle = tileWidthPt
    ? { width: tileWidthPt, height: minHeightPt, flexShrink: 0 }
    : fillHeight
      ? { flex: 1, minHeight: minHeightPt }
      : { flex: 1, height: minHeightPt, flexShrink: 0 }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        alignSelf: tileWidthPt ? 'flex-start' : 'stretch',
        flexShrink: 0,
        ...(fillHeight && !tileWidthPt ? { flex: 1, minHeight: 0 } : {}),
      }}
      wrap={false}
    >
      {swatches.map((swatch, idx) => {
        const tc = onColor(swatch.hex)
        const nameSize =
          !fillHeight && swatch.name.length > 14
            ? Math.max(14, nameFontSize - 2)
            : nameFontSize
        return (
          <View
            key={`${swatch.hex}-${idx}`}
            style={{
              backgroundColor: swatch.hex,
              ...tileHeightStyle,
              paddingTop: tilePaddingTop,
              paddingBottom: tilePaddingBottom,
              paddingHorizontal: tilePaddingHorizontal,
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              overflow: 'hidden',
              marginLeft: idx === 0 ? 0 : -1,
            }}
            wrap={false}
          >
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Text
                hyphenationCallback={wholeWordHyphenation}
                style={[
                  S.guideEqualSwatchHex,
                  {
                    color: tc,
                    textAlign: 'center',
                    marginTop: hexMarginTop,
                    fontFamily: paletteSwatchFonts.bodyFamily,
                  },
                ]}
              >
                {swatch.hex.toUpperCase()}
              </Text>
              <Text
                hyphenationCallback={wholeWordHyphenation}
                style={[
                  S.guideEqualSwatchName,
                  {
                    color: tc,
                    textAlign: 'center',
                    fontSize: nameSize,
                    fontFamily: paletteSwatchFonts.displayFamily,
                  },
                ]}
              >
                {swatch.name}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

/** @deprecated use kitPaletteGuideFolio02aRowHeightPt — kept for tests referencing landscapeLayoutV(340). */
export const GUIDE_EQUAL_SWATCH_FOLIO_02A_HEIGHT_PT = landscapeLayoutV(340)
