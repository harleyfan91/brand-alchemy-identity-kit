import { Link, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import { BRAND_PDF_COLORS } from '@identity-kit/pdf-chrome'

import { contrastRatioOnWhite } from '../deterministic/colorContrast.js'
import type { ExistingBrandEntryModel } from '../deterministic/existingBrandEntryScaffolds.js'
import {
  formatStartingAssetsObservations,
  formatStartingAssetsTension,
} from '../deterministic/existingBrandEntryBriefBlocks.js'
import type { CoreKitPdfStyles } from './CoreKitDocuments.js'
import { KitMediaPlaceholderTile } from './kitMediaPlaceholderTile.js'
import { kitPaletteBriefCompactRowHeightPt } from './kitPaletteSwatchGeometry.js'
import { KitPaletteSwatchStrip } from './KitPaletteSwatchStrip.js'
import { wholeWordHyphenation } from './pdfHyphenation.js'

const BRAND = BRAND_PDF_COLORS

const LOGO_TILE_PT = 80
const REF_HEIGHT_PT = kitPaletteBriefCompactRowHeightPt()
const REF_WIDTH_PT = Math.round((REF_HEIGHT_PT * 4) / 3)

function onColor(hex: string): string {
  return contrastRatioOnWhite(hex) >= 4.5 ? '#FFFFFF' : '#1A1A2E'
}

function displayWebsite(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, '')
  } catch {
    return url.replace(/^https?:\/\//i, '').split('/')[0] ?? url
  }
}

const localStyles = StyleSheet.create({
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFB',
    borderWidth: 0.5,
    borderColor: '#E8E8EC',
    borderRadius: 3,
  },
  identityCopy: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 14,
    minWidth: 0,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 28,
    fontWeight: 400,
    color: BRAND.black,
    lineHeight: 1.15,
    marginBottom: 6,
  },
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteIconWrap: {
    marginRight: 5,
    paddingTop: 1,
  },
  websiteLink: {
    fontSize: 8.25,
    fontWeight: 400,
    color: '#3F3F46',
    letterSpacing: 0.05,
  },
  websiteMuted: {
    fontSize: 8.25,
    fontWeight: 300,
    color: BRAND.subText,
  },
  assetGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  referenceColumn: {
    flexShrink: 0,
    marginRight: 12,
  },
  colorsColumn: {
    flexShrink: 1,
    minWidth: 0,
  },
  colorsOnlyBlock: {
    marginBottom: 12,
  },
  rolloutNote: {
    fontSize: 8.5,
    fontWeight: 300,
    lineHeight: 1.5,
    color: BRAND.subText,
    marginTop: 8,
  },
  insightRow: {
    marginBottom: 5,
  },
  insightLabel: {
    fontSize: 6.75,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: BRAND.subText,
    marginBottom: 2,
  },
})

function WebsiteLinkIcon({ color = '#71717A' }: { color?: string }) {
  return (
    <Svg width={9} height={9} viewBox="0 0 24 24" style={localStyles.websiteIconWrap}>
      <Path
        d="M10 14a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 5"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 10a5 5 0 0 0-7.07 0L4.1 12.83a5 5 0 0 0 7.07 7.07L13 19"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function StartingAssetsBriefBlock({
  styles: S,
  model,
  color,
}: {
  styles: CoreKitPdfStyles
  model: ExistingBrandEntryModel
  color: string
}) {
  const textColor = onColor(color)
  const { assets } = model
  const observations = formatStartingAssetsObservations(model.observations)
  const tension = formatStartingAssetsTension(model)

  return (
    <View>
      <View wrap={false}>
        <View style={[S.sectionBand, { backgroundColor: color }]}>
          <Text style={[S.sectionBandLabel, { color: textColor }]}>YOUR STARTING ASSETS</Text>
        </View>
      </View>
      <View style={S.sectionBody}>
        <View style={S.briefStartingAssetsShell}>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.briefStartingAssetsFraming}>
            {model.readerFraming}
          </Text>

          <View style={localStyles.identityCard}>
            <KitMediaPlaceholderTile
              width={LOGO_TILE_PT}
              height={LOGO_TILE_PT}
              imageSrc={assets.logoImageSrc}
              placeholderLabel="LOGO"
              imageFit="contain"
            />
            <View style={localStyles.identityCopy}>
              <Text style={[S.anchorText, localStyles.businessName, { fontStyle: 'normal' }]}>
                {assets.businessName}
              </Text>
              {assets.website ? (
                <View style={localStyles.websiteRow}>
                  <WebsiteLinkIcon />
                  <Link src={assets.website} style={localStyles.websiteLink}>
                    {displayWebsite(assets.website)}
                  </Link>
                </View>
              ) : (
                <Text style={localStyles.websiteMuted}>No website on file</Text>
              )}
            </View>
          </View>

          <View style={localStyles.colorsOnlyBlock}>
            <Text style={S.briefStartingAssetsSubhead}>
              {assets.colorSwatches.length > 0 ? 'REFERENCE PHOTO · EXISTING COLORS' : 'REFERENCE PHOTO'}
            </Text>
            <View style={localStyles.assetGridRow}>
              <View style={localStyles.referenceColumn}>
                <KitMediaPlaceholderTile
                  width={REF_WIDTH_PT}
                  height={REF_HEIGHT_PT}
                  imageSrc={assets.referenceImageSrc}
                  placeholderLabel="REFERENCE PHOTO"
                  imageFit="cover"
                />
              </View>
              {assets.colorSwatches.length > 0 ? (
                <View style={localStyles.colorsColumn}>
                  <KitPaletteSwatchStrip
                    styles={S}
                    swatches={assets.colorSwatches}
                    label="EXISTING COLORS"
                    labelVariant="briefSubhead"
                    showLabel={false}
                    showLegend={false}
                    size="briefCompact"
                  />
                </View>
              ) : null}
            </View>
          </View>

          {observations.length > 0 ? (
            <>
              <Text style={S.briefStartingAssetsSubhead}>WHAT WE OBSERVED</Text>
              {observations.map((obs) => (
                <View key={obs.label} style={localStyles.insightRow}>
                  <Text style={localStyles.insightLabel}>{obs.label.toUpperCase()}</Text>
                  <Text hyphenationCallback={wholeWordHyphenation} style={S.sectionBodyText}>
                    {obs.body}
                  </Text>
                </View>
              ))}
            </>
          ) : null}

          <Text style={S.briefStartingAssetsSubhead}>WHAT&apos;S ALREADY WORKING</Text>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.sectionBodyText}>
            {model.serving.body}
          </Text>

          <Text style={S.briefStartingAssetsSubhead}>TENSION AND DIRECTION</Text>
          {tension ? (
            <>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.briefStartingAssetsEmphasis}>
                {tension.tension}
              </Text>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.briefStartingAssetsResolution}>
                {tension.resolution}
              </Text>
            </>
          ) : (
            <Text hyphenationCallback={wholeWordHyphenation} style={S.sectionBodyText}>
              No asset-level tension surfaced from your inputs — use the Style Guide and Quick Start for rollout
              priorities.
            </Text>
          )}

          <Text hyphenationCallback={wholeWordHyphenation} style={localStyles.rolloutNote}>
            Week-by-week rollout lives in your Quick Start checklist; your Style Guide and Brand Strategy Memo carry
            usage rules and what to emphasize after the first 30 days.
          </Text>
        </View>
      </View>
    </View>
  )
}
