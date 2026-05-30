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
const CAPTION_COLUMN_WIDTH_PT = 196
const CAPTION_COLUMN_GAP_PT = 10
const GRID_PHOTO_AREA_WIDTH_PT = MOODBOARD_WIDTH_PT - CAPTION_COLUMN_WIDTH_PT - CAPTION_COLUMN_GAP_PT

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
function Vr9GridSpread({ slots }: { slots: VisualReferenceImageSlot[] }) {
  const geo = computePackedThreeColumnRowGeometry(GRID_PHOTO_AREA_WIDTH_PT)

  return (
    <View wrap={false}>
      <PackedThreeColumnRow
        slots={slots}
        leftId="grid_a"
        centerId="grid_b"
        rightId="grid_c"
        geo={geo}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: TILE_GAP_PT }}>
        <PackedGridTile slot={slotById(slots, 'grid_d')} size={geo.portrait} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_e')} size={geo.landscape} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_f')} size={geo.portrait} />
      </View>
    </View>
  )
}

/** vr_8 folio 08 — row 1 packed L|P|L; row 2 L|P (left-aligned, same column widths). */
function Vr8GridSpread({ slots }: { slots: VisualReferenceImageSlot[] }) {
  const geo = computePackedThreeColumnRowGeometry(GRID_PHOTO_AREA_WIDTH_PT)

  return (
    <View wrap={false}>
      <PackedThreeColumnRow
        slots={slots}
        leftId="grid_a"
        centerId="grid_b"
        rightId="grid_c"
        geo={geo}
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: TILE_GAP_PT }}>
        <PackedGridTile slot={slotById(slots, 'grid_d')} size={geo.landscape} />
        <BrickGap />
        <PackedGridTile slot={slotById(slots, 'grid_e')} size={geo.portrait} />
      </View>
    </View>
  )
}

function GridPhotoSpread({ model }: { model: StyleGuideVisualReferenceModel }) {
  if (model.layoutId === 'vr_6') {
    return <Vr6GridSpread slots={model.gridPhotoSlots} />
  }
  if (model.layoutId === 'vr_8') {
    return <Vr8GridSpread slots={model.gridPhotoSlots} />
  }
  return <Vr9GridSpread slots={model.gridPhotoSlots} />
}

function slotById(slots: VisualReferenceImageSlot[], slotId: string): VisualReferenceImageSlot | undefined {
  return slots.find((slot) => slot.slotId === slotId)
}

function MoodboardTile({
  slot,
  width,
  height,
}: {
  slot: VisualReferenceImageSlot
  width: number
  height: number
}) {
  return (
    <View style={[MOODBOARD_TILE, { width, height }]}>
      {slot.imageSrc ? (
        <Image
          src={slot.imageSrc}
          style={{
            width,
            height,
            objectFit: 'contain',
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
function LogoPhotoSeparator({ minHeight }: { minHeight: number }) {
  return (
    <View
      style={{
        width: LOGO_PHOTO_SEPARATION_PT,
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
  logoSize,
  logoSlot,
  children,
}: {
  logoSize: number
  logoSlot: VisualReferenceImageSlot
  children: ReactNode
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }} wrap={false}>
      <View style={{ width: logoSize }}>
        <MoodboardTile slot={logoSlot} width={logoSize} height={logoSize} />
      </View>
      <LogoPhotoSeparator minHeight={logoSize} />
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
    <LogoPhotoLeadRow logoSize={geo.logoSize} logoSlot={model.logoSlot}>
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
    <LogoPhotoLeadRow logoSize={geo.logoSize} logoSlot={model.logoSlot}>
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
  caption,
  signals,
  layout = 'footer',
}: {
  styles: CoreKitPdfStyles
  caption: string
  signals: string[]
  layout?: 'footer' | 'rail'
}) {
  const isRail = layout === 'rail'

  return (
    <View
      style={{
        marginTop: isRail ? 0 : 10,
        width: isRail ? CAPTION_COLUMN_WIDTH_PT : undefined,
        flex: isRail ? 1 : undefined,
        borderWidth: 1,
        borderColor: '#E4E4E7',
        backgroundColor: '#F8FAFC',
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <DeckOpenModule styles={S} label="Why these references">
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
        <GridPhotoSpread model={model} />
        <MoodboardSelectionCallout
          styles={S}
          caption={model.selectionCaption}
          signals={model.selectionSignals}
        />
      </>
    )
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch' }} wrap={false}>
      <View style={{ width: GRID_PHOTO_AREA_WIDTH_PT, marginRight: CAPTION_COLUMN_GAP_PT }}>
        <GridPhotoSpread model={model} />
      </View>
      <MoodboardSelectionCallout
        styles={S}
        caption={model.selectionCaption}
        signals={model.selectionSignals}
        layout="rail"
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
  model?: StyleGuideVisualReferenceModel
  folioOffset?: number
  visualReferencePhotoCount?: VisualReferencePhotoCount
}) {
  if (tier !== 'pro') return null

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
