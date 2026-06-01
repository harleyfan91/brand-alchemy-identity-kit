import type { ReactNode } from 'react'
import { Image, Text, View } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'

import type {
  StyleGuideVisualReferenceModel,
  VisualReferenceImageSlot,
  VisualReferencePhotoCount,
} from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import {
  VISUAL_REFERENCE_SPREAD_COUNT,
  buildStyleGuideVisualReferenceModel,
  getVisualReferenceLayout,
} from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import type { VisualReferenceLayoutId } from '../deterministic/visualReferenceLayouts.js'
import {
  getLandscapeDeckStyles,
  wholeWordHyphenation,
  type CoreKitPdfStyles,
  type KitPdfTier,
} from './CoreKitDocuments.js'
import { DeckOpenModule, DeckPage } from './LandscapeDeckLayout.js'
import { KitMediaPlaceholderTile } from './kitMediaPlaceholderTile.js'

export { VISUAL_REFERENCE_SPREAD_COUNT }

/** Usable body width inside landscape deck padding (792 − 2×44). */
const MOODBOARD_WIDTH_PT = 704
const TILE_GAP_PT = 8

/** Moodboard tiles: sharp corners, no outline — photos read as clean mats. */
const MOODBOARD_TILE = {
  overflow: 'hidden' as const,
  backgroundColor: '#EEF1F5',
}

/** Gutter between logo column and photo brick on folio 07. */
const LOGO_PHOTO_SEPARATION_PT = 14
const LOGO_PHOTO_COLUMN_GAP_MIN_PT = 28
const LEAD_CONTEXT_BOX_TOP_MARGIN_PT = 10
/** Minimum logo square — never shrink below original vr_8 / vr_9 baseline (136pt). */
const LOGO_SIZE_MIN_PT = 136
/**
 * Target height for the lead-photo row on folio 07 (below spread header, single page).
 * Tiles scale to this height while preserving 4:3 / 3:4 aspect ratios.
 */
const LEAD_PHOTO_ROW_HEIGHT_PT = 340
/** Folio 08 grid height budget for vr_6 (above callout band). */
const VR6_GRID_HEIGHT_BUDGET_PT = 360
/** vr_8 / vr_9 — photo brick beside caption rail (full folio height). */
const CAPTION_COLUMN_WIDTH_VR8_PT = 196
const CAPTION_COLUMN_WIDTH_VR9_PT = 148
const CAPTION_COLUMN_GAP_VR8_PT = 10
const CAPTION_COLUMN_GAP_VR9_PT = 8

type TileSize = { width: number; height: number }

function logoSizeForLayout(_layoutId: VisualReferenceLayoutId): number {
  return LOGO_SIZE_MIN_PT
}

function leadPhotoAreaWidth(logoSize: number): number {
  return MOODBOARD_WIDTH_PT - logoSize - LOGO_PHOTO_SEPARATION_PT
}

/**
 * vr_6 — landscape + portrait in one row, both scaled to the same row height.
 * Row height is the lesser of page budget and width constraint at 4:3 + 3:4.
 */
function computeCompact2LeadGeometry(logoSize: number): {
  logoSize: number
  landscape: TileSize
  portrait: TileSize
} {
  const areaW = leadPhotoAreaWidth(logoSize)
  const maxHFromWidth = Math.floor(((areaW - TILE_GAP_PT) * 12) / 25)
  const rowH = Math.min(LEAD_PHOTO_ROW_HEIGHT_PT, maxHFromWidth)
  return {
    logoSize,
    landscape: { width: Math.round((rowH * 4) / 3), height: rowH },
    portrait: { width: Math.round((rowH * 3) / 4), height: rowH },
  }
}

/**
 * vr_8 — two stacked 4:3 landscapes + one 3:4 portrait spanning the stack height.
 * Portrait column height equals the landscape stack (not the logo square).
 */
function computeBrick3LeadGeometryFilled(logoSize: number): {
  logoSize: number
  landscape: TileSize
  portrait: TileSize
} {
  const stackH = LEAD_PHOTO_ROW_HEIGHT_PT
  const landscapeH = Math.floor((stackH - TILE_GAP_PT) / 2)
  const landscapeW = Math.round((landscapeH * 4) / 3)
  const portraitH = stackH
  const portraitW = Math.round((portraitH * 3) / 4)

  return {
    logoSize,
    landscape: { width: landscapeW, height: landscapeH },
    portrait: { width: portraitW, height: portraitH },
  }
}

/**
 * vr_6 folio 08 — stacked landscapes (left) + two portraits side-by-side (right).
 *
 * ┌──────────┬──────────┬──────────┐
 * │ grid_a   │ grid_b   │ grid_d   │
 * │ (4:3 L)  │ (3:4 P)  │ (3:4 P)  │
 * ├──────────┤          │          │
 * │ grid_c   │          │          │
 * └──────────┴──────────┴──────────┘
 *
 * Stack height H solves full 704pt width: wl + 2·wp + 2·gap = 704.
 */
function computeVr6GridBrickGeometry(): {
  stackHeight: number
  landscape: TileSize
  portrait: TileSize
} {
  const stackH = Math.min(
    VR6_GRID_HEIGHT_BUDGET_PT,
    Math.floor((6 * MOODBOARD_WIDTH_PT - 8 * TILE_GAP_PT) / 13),
  )
  const landscapeH = Math.floor((stackH - TILE_GAP_PT) / 2)
  const landscapeW = Math.round((landscapeH * 4) / 3)
  const portraitH = stackH
  const portraitW = Math.round((portraitH * 3) / 4)

  return {
    stackHeight: stackH,
    landscape: { width: landscapeW, height: landscapeH },
    portrait: { width: portraitW, height: portraitH },
  }
}

function Vr6GridSpread({ slots }: { slots: VisualReferenceImageSlot[] }) {
  const geo = computeVr6GridBrickGeometry()
  const gridA = slotById(slots, 'grid_a')
  const gridB = slotById(slots, 'grid_b')
  const gridC = slotById(slots, 'grid_c')
  const gridD = slotById(slots, 'grid_d')

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} wrap={false}>
      <View style={{ width: geo.landscape.width }}>
        {gridA ? (
          <MoodboardTile slot={gridA} width={geo.landscape.width} height={geo.landscape.height} />
        ) : null}
        {gridC ? (
          <View style={{ marginTop: TILE_GAP_PT }}>
            <MoodboardTile slot={gridC} width={geo.landscape.width} height={geo.landscape.height} />
          </View>
        ) : null}
      </View>

      <BrickGap />

      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {gridB ? (
          <MoodboardTile slot={gridB} width={geo.portrait.width} height={geo.portrait.height} />
        ) : null}
        {gridB && gridD ? <BrickGap /> : null}
        {gridD ? (
          <MoodboardTile slot={gridD} width={geo.portrait.width} height={geo.portrait.height} />
        ) : null}
      </View>
    </View>
  )
}

/**
 * Three-column packed row (L | P | L) — fixed gutters, no space-between dead zones.
 * Row height derived from photo-area width so landscape + portrait share one band height.
 */
function computePackedThreeColumnRowGeometry(photoAreaWidth: number): {
  rowHeight: number
  landscape: TileSize
  portrait: TileSize
} {
  const rowH = Math.floor(((photoAreaWidth - 2 * TILE_GAP_PT) * 12) / 41)
  return {
    rowHeight: rowH,
    landscape: { width: Math.round((rowH * 4) / 3), height: rowH },
    portrait: { width: Math.round((rowH * 3) / 4), height: rowH },
  }
}

/**
 * vr_9 row 2 uses P|L|P, which can run taller than row 1 at the same width.
 * We intentionally keep this row larger for an editorial hierarchy.
 */
function computePackedPortraitLandscapePortraitRowGeometry(photoAreaWidth: number): {
  rowHeight: number
  landscape: TileSize
  portrait: TileSize
} {
  const rowH = Math.floor(((photoAreaWidth - 2 * TILE_GAP_PT) * 6) / 17)
  return {
    rowHeight: rowH,
    landscape: { width: Math.round((rowH * 4) / 3), height: rowH },
    portrait: { width: Math.round((rowH * 3) / 4), height: rowH },
  }
}

/**
 * vr_8 editorial grid:
 * row 1 uses two landscapes (L|L), row 2 uses three portraits (P|P|P).
 * This balances row heights and closes dead space beside the caption rail.
 */
function computeVr8EditorialGridGeometry(photoAreaWidth: number): {
  topLandscape: TileSize
  bottomPortrait: TileSize
} {
  const topRowHeight = Math.floor(((photoAreaWidth - TILE_GAP_PT) * 3) / 8)
  const bottomRowHeight = Math.floor(((photoAreaWidth - 2 * TILE_GAP_PT) * 4) / 9)

  return {
    topLandscape: {
      width: Math.round((topRowHeight * 4) / 3),
      height: topRowHeight,
    },
    bottomPortrait: {
      width: Math.round((bottomRowHeight * 3) / 4),
      height: bottomRowHeight,
    },
  }
}

function PackedGridTile({
  slot,
  size,
}: {
  slot: VisualReferenceImageSlot | undefined
  size: TileSize
}) {
  if (!slot) return null
  return <MoodboardTile slot={slot} width={size.width} height={size.height} />
}

function PackedThreeColumnRow({
  slots,
  leftId,
  centerId,
  rightId,
  geo,
}: {
  slots: VisualReferenceImageSlot[]
  leftId: string
  centerId: string
  rightId: string
  geo: ReturnType<typeof computePackedThreeColumnRowGeometry>
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <PackedGridTile slot={slotById(slots, leftId)} size={geo.landscape} />
      <BrickGap />
      <PackedGridTile slot={slotById(slots, centerId)} size={geo.portrait} />
      <BrickGap />
      <PackedGridTile slot={slotById(slots, rightId)} size={geo.landscape} />
    </View>
  )
}

/** vr_9 folio 08 — 3×2 packed grid beside caption rail. */
function Vr9GridSpread({ slots, photoAreaWidth }: { slots: VisualReferenceImageSlot[]; photoAreaWidth: number }) {
  const topRowGeo = computePackedThreeColumnRowGeometry(photoAreaWidth)
  const bottomRowGeo = computePackedPortraitLandscapePortraitRowGeometry(photoAreaWidth)

  return (
    <View wrap={false}>
      <PackedThreeColumnRow
        slots={slots}
        leftId="grid_a"
        centerId="grid_b"
        rightId="grid_c"
        geo={topRowGeo}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: TILE_GAP_PT }}>
        <PackedGridTile slot={slotById(slots, 'grid_d')} size={bottomRowGeo.portrait} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_e')} size={bottomRowGeo.landscape} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_f')} size={bottomRowGeo.portrait} />
      </View>
    </View>
  )
}

/** vr_8 folio 08 — row 1 L|L; row 2 P|P|P for balanced editorial fill. */
function Vr8GridSpread({ slots, photoAreaWidth }: { slots: VisualReferenceImageSlot[]; photoAreaWidth: number }) {
  const geo = computeVr8EditorialGridGeometry(photoAreaWidth)

  return (
    <View wrap={false}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <PackedGridTile slot={slotById(slots, 'grid_a')} size={geo.topLandscape} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_c')} size={geo.topLandscape} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: TILE_GAP_PT }}>
        <PackedGridTile slot={slotById(slots, 'grid_b')} size={geo.bottomPortrait} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_d')} size={geo.bottomPortrait} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_e')} size={geo.bottomPortrait} />
      </View>
    </View>
  )
}

function GridPhotoSpread({ model, photoAreaWidth }: { model: StyleGuideVisualReferenceModel; photoAreaWidth: number }) {
  if (model.layoutId === 'vr_6') {
    return <Vr6GridSpread slots={model.gridPhotoSlots} />
  }
  if (model.layoutId === 'vr_8') {
    return <Vr8GridSpread slots={model.gridPhotoSlots} photoAreaWidth={photoAreaWidth} />
  }
  return <Vr9GridSpread slots={model.gridPhotoSlots} photoAreaWidth={photoAreaWidth} />
}

function slotById(slots: VisualReferenceImageSlot[], slotId: string): VisualReferenceImageSlot | undefined {
  return slots.find((slot) => slot.slotId === slotId)
}

function MoodboardTile({
  slot,
  width,
  height,
  imageFit = 'cover',
}: {
  slot: VisualReferenceImageSlot
  width: number
  height: number
  /** Photos fill fixed 4:3 / 3:4 slots (cover). Logo keeps full mark (contain). */
  imageFit?: 'cover' | 'contain'
}) {
  if (slot.kind === 'logo') {
    return (
      <KitMediaPlaceholderTile
        width={width}
        height={height}
        imageSrc={slot.imageSrc ?? null}
        placeholderLabel="LOGO"
        imageFit={imageFit}
      />
    )
  }

  return (
    <View style={[MOODBOARD_TILE, { width, height }]}>
      {slot.imageSrc ? (
        <Image
          src={slot.imageSrc}
          style={{
            width,
            height,
            objectFit: imageFit,
            objectPosition: 'center',
          }}
        />
      ) : null}
    </View>
  )
}

function BrickGap({ size = TILE_GAP_PT }: { size?: number }) {
  return <View style={{ width: size, height: size }} />
}

/** Vertical hairline between logo square and lead-photo brick on folio 07. */
function LeadLogoContextBox({
  styles: S,
  model,
  width,
}: {
  styles: CoreKitPdfStyles
  model: StyleGuideVisualReferenceModel
  width: number
}) {
  const styleSignal = model.selectionSignals.find((s) => s.startsWith('Style · '))
  const styleHint = styleSignal ? styleSignal.replace('Style · ', '') : 'your selected style'
  return (
    <View
      style={{
        marginTop: LEAD_CONTEXT_BOX_TOP_MARGIN_PT,
        width,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        backgroundColor: '#F8FAFC',
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <DeckOpenModule styles={S} label="How to apply">
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
          {`• Logo on imagery: keep strong contrast and clear space around the mark.`}
        </Text>
        <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { marginTop: 4 }]}>
          {`• Placement: anchor to corners or edges; avoid centered logo placement on busy photos.`}
        </Text>
        <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { marginTop: 4 }]}>
          {`• Use this look in hero banners, social covers, and web section backgrounds tuned to ${styleHint}.`}
        </Text>
        {model.selectionSignals.length > 0 ? (
          <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCaptionText, { marginTop: 8 }]}>
            {`Avoid: placing the logo over high-detail texture or bright hotspots.`}
          </Text>
        ) : null}
      </DeckOpenModule>
    </View>
  )
}

function LogoPhotoSeparator({ gap, minHeight }: { gap: number; minHeight: number }) {
  return (
    <View
      style={{
        width: gap,
        alignSelf: 'stretch',
        alignItems: 'center',
        minHeight,
      }}
      wrap={false}
    >
      <View
        style={{
          width: 0.5,
          flex: 1,
          minHeight,
          backgroundColor: '#E4E4E7',
        }}
      />
    </View>
  )
}

function LogoPhotoLeadRow({
  styles: S,
  model,
  logoSize,
  photoBrickWidth,
  photoBrickHeight,
  logoSlot,
  children,
}: {
  styles: CoreKitPdfStyles
  model: StyleGuideVisualReferenceModel
  logoSize: number
  photoBrickWidth: number
  photoBrickHeight: number
  logoSlot: VisualReferenceImageSlot
  children: ReactNode
}) {
  const maxContextWidth = MOODBOARD_WIDTH_PT - photoBrickWidth - LOGO_PHOTO_COLUMN_GAP_MIN_PT
  const contextWidth = Math.max(logoSize, Math.min(maxContextWidth, logoSize + 72))
  const gap = Math.max(LOGO_PHOTO_COLUMN_GAP_MIN_PT, MOODBOARD_WIDTH_PT - contextWidth - photoBrickWidth)
  const separatorHeight = photoBrickHeight
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} wrap={false}>
      <View style={{ width: contextWidth }}>
        <MoodboardTile slot={logoSlot} width={logoSize} height={logoSize} imageFit="contain" />
        <LeadLogoContextBox styles={S} model={model} width={contextWidth} />
      </View>
      <LogoPhotoSeparator gap={gap} minHeight={separatorHeight} />
      {children}
    </View>
  )
}

/** Folio 07 — vr_6: logo + landscape + portrait side by side (height-filled row). */
function LeadSpreadCompact2({ model }: { model: StyleGuideVisualReferenceModel }) {
  const geo = computeCompact2LeadGeometry(logoSizeForLayout(model.layoutId))

  const lead1 = slotById(model.leadPhotoSlots, 'lead_1')
  const lead2 = slotById(model.leadPhotoSlots, 'lead_2')

  return (
    <LogoPhotoLeadRow
      styles={getLandscapeDeckStyles()}
      model={model}
      logoSize={geo.logoSize}
      photoBrickWidth={geo.landscape.width + TILE_GAP_PT + geo.portrait.width}
      photoBrickHeight={geo.landscape.height}
      logoSlot={model.logoSlot}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {lead1 ? (
          <MoodboardTile slot={lead1} width={geo.landscape.width} height={geo.landscape.height} />
        ) : null}
        {lead1 && lead2 ? <BrickGap /> : null}
        {lead2 ? (
          <MoodboardTile slot={lead2} width={geo.portrait.width} height={geo.portrait.height} />
        ) : null}
      </View>
    </LogoPhotoLeadRow>
  )
}

/** Folio 07 — vr_8 / vr_9: height-filled brick (2× landscape stack + portrait). */
function LeadSpreadBrick3Filled({ model }: { model: StyleGuideVisualReferenceModel }) {
  const geo = computeBrick3LeadGeometryFilled(logoSizeForLayout(model.layoutId))

  const lead1 = slotById(model.leadPhotoSlots, 'lead_1')
  const lead2 = slotById(model.leadPhotoSlots, 'lead_2')
  const lead3 = slotById(model.leadPhotoSlots, 'lead_3')

  return (
    <LogoPhotoLeadRow
      styles={getLandscapeDeckStyles()}
      model={model}
      logoSize={geo.logoSize}
      photoBrickWidth={geo.landscape.width + TILE_GAP_PT + geo.portrait.width}
      photoBrickHeight={geo.portrait.height}
      logoSlot={model.logoSlot}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ width: geo.landscape.width }}>
          {lead1 ? (
            <MoodboardTile slot={lead1} width={geo.landscape.width} height={geo.landscape.height} />
          ) : null}
          {lead3 ? (
            <View style={{ marginTop: TILE_GAP_PT }}>
              <MoodboardTile slot={lead3} width={geo.landscape.width} height={geo.landscape.height} />
            </View>
          ) : null}
        </View>

        {lead2 ? (
          <>
            <BrickGap />
            <MoodboardTile slot={lead2} width={geo.portrait.width} height={geo.portrait.height} />
          </>
        ) : null}
      </View>
    </LogoPhotoLeadRow>
  )
}

function VisualReferenceLeadSpread({ model }: { model: StyleGuideVisualReferenceModel }) {
  const layout = getVisualReferenceLayout(model.layoutId)
  if (layout.leadPattern === 'compact_2') {
    return <LeadSpreadCompact2 model={model} />
  }
  return <LeadSpreadBrick3Filled model={model} />
}

function MoodboardSelectionCallout({
  styles: S,
  label = 'Why these references',
  caption,
  signals,
  layout = 'footer',
  railWidth,
}: {
  styles: CoreKitPdfStyles
  label?: string
  caption: string
  signals: string[]
  layout?: 'footer' | 'rail'
  railWidth?: number
}) {
  const isRail = layout === 'rail'

  return (
    <View
      style={{
        marginTop: isRail ? 0 : 10,
        width: isRail ? railWidth : undefined,
        flex: isRail ? 1 : undefined,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        backgroundColor: '#F8FAFC',
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <DeckOpenModule styles={S} label={label}>
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
          {caption}
        </Text>
        {signals.length > 0 ? (
          <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCaptionText, { marginTop: 8 }]}>
            {signals.join(' · ')}
          </Text>
        ) : null}
      </DeckOpenModule>
    </View>
  )
}

function Vr9SignalStrip({ styles: S, signals }: { styles: CoreKitPdfStyles; signals: string[] }) {
  if (signals.length === 0) return null
  return (
    <View
      style={{
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        backgroundColor: '#F8FAFC',
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
        {signals.join(' · ')}
      </Text>
    </View>
  )
}

function getCaptionRailMetrics(layoutId: StyleGuideVisualReferenceModel['layoutId']): {
  columnWidth: number
  columnGap: number
} {
  if (layoutId === 'vr_9') {
    return {
      columnWidth: CAPTION_COLUMN_WIDTH_VR9_PT,
      columnGap: CAPTION_COLUMN_GAP_VR9_PT,
    }
  }
  return {
    columnWidth: CAPTION_COLUMN_WIDTH_VR8_PT,
    columnGap: CAPTION_COLUMN_GAP_VR8_PT,
  }
}

function GridSpreadWithCaption({
  styles: S,
  model,
}: {
  styles: CoreKitPdfStyles
  model: StyleGuideVisualReferenceModel
}) {
  const useCaptionRail = model.layoutId === 'vr_8' || model.layoutId === 'vr_9'

  if (!useCaptionRail) {
    return (
      <>
        <GridPhotoSpread model={model} photoAreaWidth={MOODBOARD_WIDTH_PT} />
        <MoodboardSelectionCallout
          styles={S}
          caption={model.selectionCaption}
          signals={model.selectionSignals}
        />
      </>
    )
  }

  const rail = getCaptionRailMetrics(model.layoutId)
  const photoAreaWidth = MOODBOARD_WIDTH_PT - rail.columnWidth - rail.columnGap
  const vr9PrimarySignals = model.selectionSignals.slice(0, 3)

  if (model.layoutId === 'vr_9') {
    return (
      <View wrap={false}>
        <View style={{ flexDirection: 'row', alignItems: 'stretch' }} wrap={false}>
          <View style={{ width: photoAreaWidth, marginRight: rail.columnGap }}>
            <GridPhotoSpread model={model} photoAreaWidth={photoAreaWidth} />
          </View>
          <MoodboardSelectionCallout
            styles={S}
            label="Why these references"
            caption={model.selectionCaption}
            signals={[]}
            layout="rail"
            railWidth={rail.columnWidth}
          />
        </View>
        <Vr9SignalStrip styles={S} signals={vr9PrimarySignals} />
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch' }} wrap={false}>
      <View style={{ width: photoAreaWidth, marginRight: rail.columnGap }}>
        <GridPhotoSpread model={model} photoAreaWidth={photoAreaWidth} />
      </View>
      <MoodboardSelectionCallout
        styles={S}
        caption={model.selectionCaption}
        signals={model.selectionSignals}
        layout="rail"
        railWidth={rail.columnWidth}
      />
    </View>
  )
}

function padFolio(n: number): string {
  return String(n).padStart(2, '0')
}

/** Style Guide Pro Visual Reference — folio 06 (logo + lead brick) and 07 (grid + callout). */
export function StyleGuideVisualReferencePages({
  form,
  tier,
  model: modelOverride,
  folioOffset = 6,
  visualReferencePhotoCount = 9,
}: {
  form: IdentityKitForm
  tier: KitPdfTier
  model?: StyleGuideVisualReferenceModel | null
  folioOffset?: number
  /** Legacy QA fallback when model is undefined. */
  visualReferencePhotoCount?: VisualReferencePhotoCount
}) {
  if (tier !== 'pro') return null
  if (modelOverride === null) return null

  const S = getLandscapeDeckStyles()
  const model =
    modelOverride ?? buildStyleGuideVisualReferenceModel(form, { photoCount: visualReferencePhotoCount })
  const businessName = form.step1.businessName

  return (
    <>
      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(folioOffset + 1)}
        spreadTitle={model.leadSpreadTitle}
      >
        <VisualReferenceLeadSpread model={model} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(folioOffset + 2)}
        spreadTitle={model.gridSpreadTitle}
      >
        <GridSpreadWithCaption styles={S} model={model} />
      </DeckPage>
    </>
  )
}
