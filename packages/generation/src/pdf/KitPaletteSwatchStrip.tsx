import { Text, View } from '@react-pdf/renderer'

import { paletteRoleLine } from '../deterministic/paletteColorRoles.js'
import { GuideEqualSwatchRow } from './GuideEqualSwatchRow.js'
import {
  KIT_PALETTE_BRIEF_COMPACT_NAME_FONT_SIZE,
  KIT_PALETTE_DECK_NAME_FONT_SIZE,
  kitPaletteBriefCompactRowHeightPt,
  kitPaletteRowHeightPt,
  kitPaletteTileWidthPt,
} from './kitPaletteSwatchGeometry.js'
import { wholeWordHyphenation } from './pdfHyphenation.js'
import type { CoreKitPdfStyles } from './CoreKitDocuments.js'

export type KitPaletteSwatch = {
  hex: string
  name: string
  role?: string
  legendLine?: string
}

export type KitPaletteSwatchStripProps = {
  styles: CoreKitPdfStyles
  swatches: KitPaletteSwatch[]
  label: string
  labelVariant?: 'guideOpen' | 'briefSubhead'
  legendMode?: 'kitRoles' | 'namesOnly'
  showLegend?: boolean
  showLabel?: boolean
  size?: 'deck' | 'briefCompact'
}

function PaletteStripLegend({
  styles: S,
  swatches,
  legendMode,
}: {
  styles: CoreKitPdfStyles
  swatches: KitPaletteSwatch[]
  legendMode: 'kitRoles' | 'namesOnly'
}) {
  return (
    <View style={S.guidePaletteCopy} wrap={false}>
      {swatches.map((entry) => (
        <View
          key={`${entry.hex}-${entry.name}`}
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}
          wrap={false}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: entry.hex,
              marginRight: 6,
            }}
          />
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
            {legendMode === 'kitRoles' && entry.role ? (
              <>
                <Text style={S.guideKvKey}>
                  {entry.name
                    ? `${entry.role.toUpperCase()} · ${entry.name} `
                    : `${entry.role.toUpperCase()} `}
                </Text>
                {entry.legendLine ?? paletteRoleLine(entry.role)}
              </>
            ) : (
              <>
                <Text style={S.guideKvKey}>{entry.name} </Text>
                {entry.legendLine ?? 'From your existing brand inputs.'}
              </>
            )}
          </Text>
        </View>
      ))}
    </View>
  )
}

/**
 * Style Guide folio 01 palette stack — label, canonical equal swatch row, optional legend.
 * Tile width/height always use folio 01 slot geometry regardless of swatch count.
 */
export function KitPaletteSwatchStrip({
  styles: S,
  swatches,
  label,
  labelVariant = 'guideOpen',
  legendMode = 'kitRoles',
  showLegend = true,
  showLabel = true,
  size = 'deck',
}: KitPaletteSwatchStripProps) {
  if (swatches.length === 0) return null

  const tileWidthPt = kitPaletteTileWidthPt()
  const rowHeightPt = size === 'briefCompact' ? kitPaletteBriefCompactRowHeightPt() : kitPaletteRowHeightPt()
  const nameFontSize =
    size === 'briefCompact' ? KIT_PALETTE_BRIEF_COMPACT_NAME_FONT_SIZE : KIT_PALETTE_DECK_NAME_FONT_SIZE
  const compact = size === 'briefCompact'
  const tilePaddingTop = compact ? 10 : 18
  const tilePaddingBottom = compact ? 10 : 16
  const tilePaddingHorizontal = compact ? 8 : 12
  const hexMarginTop = compact ? 4 : 10

  const labelNode =
    labelVariant === 'briefSubhead' ? (
      <Text style={S.briefStartingAssetsSubhead}>{label.toUpperCase()}</Text>
    ) : (
      <Text style={S.guideOpenLabel}>{label.toUpperCase()}</Text>
    )

  return (
    <View style={S.guideDeckPaletteStack} wrap={false}>
      {showLabel ? labelNode : null}
      <GuideEqualSwatchRow
        styles={S}
        swatches={swatches}
        minHeightPt={rowHeightPt}
        tileWidthPt={tileWidthPt}
        nameFontSize={nameFontSize}
        fillHeight={false}
        tilePaddingTop={tilePaddingTop}
        tilePaddingBottom={tilePaddingBottom}
        tilePaddingHorizontal={tilePaddingHorizontal}
        hexMarginTop={hexMarginTop}
      />
      {showLegend ? (
        <>
          <View style={S.guideDeckPaletteLegendSpacer} />
          <PaletteStripLegend styles={S} swatches={swatches} legendMode={legendMode} />
        </>
      ) : null}
    </View>
  )
}
