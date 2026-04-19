import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { ReactNode } from 'react'
import { canonicalPaletteId, type IdentityKitForm } from '@identity-kit/shared'
import { BRAND_PDF_COLORS, FOOTER_CHROME_HEIGHT, PageFooterChrome } from '@identity-kit/pdf-chrome'

import { getBrandIdentityGuidePdfFontFamilies, getKitPdfFontFamilies } from './kitDocumentFonts.js'
import { typefaceSpecimenLadderForPdfFamily } from './pdfTypefaceSpecimenLadder.js'

import {
  brandBriefBlocks,
  paletteColorRolesParagraph,
  quickStartBlocks,
  styleGuideBlocks,
  typographyDownloadLinks,
  typographyFooterParts,
  typographyHonorsExistingTypeface,
  typographySectionLead,
  typographySpecimenSlots,
  voicePlaybookBlocks,
  VOICE_PLAYBOOK_CTA_BODY_SPLIT,
} from '../deterministic/coreAssembly.js'
import { buildBrandIdentityGuideModel } from '../deterministic/brandIdentityGuideModel.js'
import { contrastRatioOnWhite } from '../deterministic/colorContrast.js'
import {
  buildRedoStyleDummyGuideModel,
  redoNavAnchorIdFromTitle,
  redoSpreadAnchorId,
  type RedoGuideArtDirectionTheme,
  type RedoGuideColorSwatch,
  type RedoGuideCopySpecimen,
  type RedoGuideGradientSwatch,
  type RedoGuideLogoLockup,
  type RedoGuideSpread,
  type RedoGuideTripletItem,
  type RedoGuideTypeScale,
  type RedoStyleDummyGuideModel,
} from '../deterministic/redoStyleDummyGuideModel.js'
import {
  computeWordmarkExplorationTiles,
  type WordmarkExplorationTile,
} from '../deterministic/visualWordmarkExploration.js'

// ---------------------------------------------------------------------------
// Palette data — mirrors apps/web/src/data/visualDirection.ts (PALETTE_OPTIONS)
// ---------------------------------------------------------------------------

const paletteSwatchColors: Record<string, string[]> = {
  midnight_luxe: ['#0B0B0F', '#222333', '#7A6A4F', '#D4C4A8'],
  earthy_warmth: ['#5A3E36', '#A77C5D', '#E5C7A2', '#F8EEDF'],
  ocean_calm:    ['#0D3B66', '#2F6690', '#3A7CA5', '#D9EDFF'],
  sunset_bold:   ['#2D1E2F', '#C8553D', '#F28F3B', '#F7D488'],
  forest_deep:   ['#1B4332', '#2D6A4F', '#40916C', '#D8F3DC'],
  minimal_light: ['#111111', '#666666', '#CFCFCF', '#F7F7F7'],
  arctic_blue:   ['#1A2F4D', '#3B6FB8', '#89B4E8', '#F0F7FF'],
  ink_navy:      ['#050A12', '#142233', '#2A4A6E', '#D4DEE8'],
  paper_stone:   ['#3A3634', '#6F6965', '#C9C2BA', '#F6F3EE'],
  terracotta_clay: ['#5C2E24', '#9C5130', '#D4996C', '#FDF5ED'],
  moss_meadow:   ['#1E3328', '#3D6B4F', '#6FA67A', '#E8F5E9'],
  mint_fresh:    ['#0F3430', '#115E59', '#2DD4BF', '#ECFEFF'],
  citrus_pop:    ['#3F1610', '#C2410C', '#FBBF24', '#FFFBEB'],
  coastal_teal:  ['#083344', '#0E7490', '#22D3EE', '#ECFEFF'],
  sea_glass:     ['#064E3B', '#047857', '#34D399', '#D1FAE5'],
  amber_glow:    ['#713F12', '#B45309', '#FBBF24', '#FFFBEB'],
  copper_spark:  ['#431407', '#9A3412', '#EA580C', '#FFEDD5'],
  honey_comb:    ['#422006', '#A16207', '#EAB308', '#FEFCE8'],
  rose_dusk:     ['#2D0410', '#831843', '#FB7185', '#FFF1F2'],
  bubblegum_pulse: ['#881337', '#E11D48', '#FDA4AF', '#FFF1F2'],
  carnation_soft: ['#3F2D32', '#7C3A5F', '#E8B4C2', '#FFF5F7'],
  violet_haze:   ['#2E1065', '#6D28D9', '#A78BFA', '#EDE9FE'],
  electric_orchid: ['#4C1D95', '#9333EA', '#E879F9', '#FAF5FF'],
  plum_violet:   ['#2F0F28', '#701A75', '#A21CAF', '#FDF4FF'],
  sand_dune:     ['#4F4639', '#8F8170', '#D8CAB8', '#FFFBF5'],
  sorbet_sunset: ['#3F0A1F', '#DB2777', '#FB923C', '#FFF7ED'],
  lagoon_deep:   ['#06343B', '#0F766E', '#14B8A6', '#F0FDFA'],
}

type SwatchMeta = { role: string; flex: number }

/**
 * Per-swatch role label + flex weight, ordered to match paletteSwatchColors indices.
 * Flex values encode usage-ratio hierarchy: higher = wider tile = more dominant.
 */
const PALETTE_SWATCH_META: Record<string, SwatchMeta[]> = {
  midnight_luxe: [
    { role: 'Primary', flex: 4 },      // #0B0B0F near-black
    { role: 'Supporting', flex: 2.5 }, // #222333 dark navy
    { role: 'Accent', flex: 2 },       // #7A6A4F warm gold-tan
    { role: 'Canvas', flex: 1.5 },     // #D4C4A8 cream
  ],
  earthy_warmth: [
    { role: 'Accent', flex: 1.5 },     // #5A3E36 terracotta (used sparingly)
    { role: 'Supporting', flex: 2 },   // #A77C5D caramel
    { role: 'Canvas', flex: 2.5 },     // #E5C7A2 warm neutral
    { role: 'Primary', flex: 4 },      // #F8EEDF off-white (dominant surface)
  ],
  ocean_calm: [
    { role: 'Primary', flex: 4 },      // #0D3B66 deep navy
    { role: 'Supporting', flex: 2.5 }, // #2F6690 mid-blue
    { role: 'Accent', flex: 2 },       // #3A7CA5 lighter blue
    { role: 'Canvas', flex: 1.5 },     // #D9EDFF pale sky
  ],
  sunset_bold: [
    { role: 'Primary', flex: 4 },      // #2D1E2F deep plum
    { role: 'Accent', flex: 2.5 },     // #C8553D burnt orange
    { role: 'Supporting', flex: 2 },   // #F28F3B amber
    { role: 'Canvas', flex: 1.5 },     // #F7D488 pale yellow
  ],
  forest_deep: [
    { role: 'Primary', flex: 4 },      // #1B4332 near-black green
    { role: 'Supporting', flex: 2.5 }, // #2D6A4F mid-forest
    { role: 'Accent', flex: 2 },       // #40916C fresh sage
    { role: 'Canvas', flex: 1.5 },     // #D8F3DC light sage
  ],
  minimal_light: [
    { role: 'Primary', flex: 4 },      // #111111 near-black
    { role: 'Supporting', flex: 2.5 }, // #666666 mid-gray
    { role: 'Neutral', flex: 2 },      // #CFCFCF light gray
    { role: 'Canvas', flex: 1.5 },     // #F7F7F7 off-white
  ],
  arctic_blue: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  ink_navy: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  paper_stone: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Neutral', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  terracotta_clay: [
    { role: 'Accent', flex: 1.5 },
    { role: 'Supporting', flex: 2 },
    { role: 'Canvas', flex: 2.5 },
    { role: 'Primary', flex: 4 },
  ],
  moss_meadow: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  mint_fresh: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  citrus_pop: [
    { role: 'Primary', flex: 4 },
    { role: 'Accent', flex: 2.5 },
    { role: 'Supporting', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  coastal_teal: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  sea_glass: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  amber_glow: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  rose_dusk: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  bubblegum_pulse: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  carnation_soft: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  violet_haze: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  electric_orchid: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  plum_violet: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  copper_spark: [
    { role: 'Primary', flex: 4 },
    { role: 'Accent', flex: 2.5 },
    { role: 'Supporting', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  honey_comb: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  sand_dune: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Neutral', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  sorbet_sunset: [
    { role: 'Primary', flex: 4 },
    { role: 'Accent', flex: 2.5 },
    { role: 'Supporting', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
  lagoon_deep: [
    { role: 'Primary', flex: 4 },
    { role: 'Supporting', flex: 2.5 },
    { role: 'Accent', flex: 2 },
    { role: 'Canvas', flex: 1.5 },
  ],
}

const DEFAULT_SWATCH_META: SwatchMeta[] = [
  { role: 'Primary', flex: 4 },
  { role: 'Supporting', flex: 2.5 },
  { role: 'Accent', flex: 2 },
  { role: 'Canvas', flex: 1.5 },
]

/** All four swatches for a palette, with a grayscale fallback. */
export function getSwatches(palette: string): string[] {
  const id = canonicalPaletteId(palette)
  return paletteSwatchColors[id] ?? ['#111111', '#555555', '#999999', '#EEEEEE']
}

/**
 * Pro-only fifth kit piece: palettes only define four swatches, so we derive a fifth
 * "home" color by averaging swatches at index 1 and 2. It stays on-hue with the system
 * and reads as distinct from all four named slots (Brief / Style / Voice / Quick Start).
 */
export function fifthKitHomeColor(palette: string): string {
  const s = getSwatches(palette)
  if (s.length >= 3) return blendHex(s[1]!, s[2]!)
  return s[0] ?? '#111111'
}

function blendHex(a: string, b: string): string {
  const p = (h: string) => ({
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  })
  const A = p(a)
  const B = p(b)
  const c = (x: number, y: number) => Math.round((x + y) / 2)
  const hex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
  return `#${hex(c(A.r, B.r))}${hex(c(A.g, B.g))}${hex(c(A.b, B.b))}`
}

/**
 * Each Core document maps to swatch index 0–3.
 * Pro Content Starter Pack uses `fifthKitHomeColor` (no fifth swatch in UI).
 *
 * Header bands use these swatch colors — they come from the **customer's chosen palette**
 * (`minimal_light` is intentionally neutral grays + off-white; not Brand Alchemy corporate gray).
 * Body/label grays elsewhere use fixed `BRAND.*` neutrals for readability.
 */
const DOC_SLOT: Record<string, number> = {
  brandBrief: 0,
  styleGuide: 1,
  voicePlaybook: 2,
  quickStart: 3,
}

export function homeColor(palette: string, docId: string): string {
  if (docId === 'contentStarter') return fifthKitHomeColor(palette)
  const swatches = getSwatches(palette)
  const slot = DOC_SLOT[docId] ?? 0
  return swatches[slot] ?? '#111111'
}

/** Third swatch — exposed for tests and any callers that need a single accent. */
export function paletteAccentHex(selectedPalette: string): string {
  const swatches = getSwatches(selectedPalette)
  return swatches[2] ?? swatches[0] ?? '#111111'
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55
}

function onColor(hex: string): string {
  return isDark(hex) ? '#FFFFFF' : '#111111'
}

/** Light tint for specimen mini-headers (section accent at ~12% opacity on white). */
function accentTintRgba(accentHex: string, alpha = 0.12): string {
  const rgb = hexToRgb(accentHex)
  if (!rgb) return `rgba(17, 17, 17, ${alpha})`
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

// ---------------------------------------------------------------------------
// Brand constants (shared neutrals from @identity-kit/pdf-chrome)
// ---------------------------------------------------------------------------

const BRAND = BRAND_PDF_COLORS

/** Wash for tinted cards on `05-brand-identity-guide` only — parent kit slate, not customer palette. */
const GUIDE_EDITORIAL_CARD_TINT_HEX = '#1E2530'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

// `contrastRatio` and `contrastRatioOnWhite` are imported from the shared
// `colorContrast` module so the renderer and the deterministic guide model
// both rely on the same WCAG implementation.

/**
 * Text on white page background: use the kit swatch as-is when it meets WCAG AA for normal text (4.5:1 on white).
 * If it does not, fall back to `BRAND.bodyText`. Brand Alchemy palette colors that pass the check are unchanged.
 */
function readableOnWhite(hex: string): string {
  const minRatio = 4.5
  if (contrastRatioOnWhite(hex) >= minRatio) return hex
  return BRAND.bodyText
}

// ---------------------------------------------------------------------------
// Kit navigator — Core = 4 segments; Pro = 5 (adds Content Pack)
// ---------------------------------------------------------------------------

const KIT_DOCS_CORE = [
  { id: 'brandBrief',    label: 'Brand Brief' },
  { id: 'styleGuide',    label: 'Style Guide' },
  { id: 'voicePlaybook', label: 'Voice Playbook' },
  { id: 'quickStart',    label: 'Quick Start' },
] as const

const KIT_DOCS_PRO = [
  ...KIT_DOCS_CORE,
  { id: 'contentStarter', label: 'Content Pack' },
] as const

export type KitPdfTier = 'core' | 'pro'

export type DocId = (typeof KIT_DOCS_PRO)[number]['id']

function kitDocsForTier(tier: KitPdfTier): readonly { id: DocId; label: string }[] {
  return tier === 'pro' ? KIT_DOCS_PRO : KIT_DOCS_CORE
}

function segmentColor(palette: string, segmentIndex: number, tier: KitPdfTier): string {
  if (tier === 'pro' && segmentIndex === 4) return fifthKitHomeColor(palette)
  const s = getSwatches(palette)
  return s[segmentIndex] ?? BRAND.black
}

// ---------------------------------------------------------------------------
// Layout metrics (header chrome + footer chrome)
// ---------------------------------------------------------------------------

/** Max height of kit nav row — each segment fills this height (active tab shows label toward bottom). */
const KIT_NAV_MAX_HEIGHT = 22
/** Title band below nav — tall enough for recipe display face at section-h3 scale (≈ web text-4xl / md:text-5xl). */
const HEADER_BAND_MIN_HEIGHT = 58
/** Pixels each tab strip overlaps the next — hides PDF/Yoga hairlines between flex segments (not a border). */
const KIT_NAV_TAB_OVERLAP = 1
/** Pulls the nav row up 1pt and makes it 1pt taller so color bleeds past y=0 (fixes top page seam; needs headerChrome overflow visible). */
const KIT_NAV_TOP_BLEED = 1
/** Title band overlaps nav by 1pt so the seam is not a white anti-alias line. */
const KIT_NAV_TITLE_OVERLAP = 1
/** Nav row total height including top bleed (visual strip is still KIT_NAV_MAX_HEIGHT from the title band seam). */
const KIT_NAV_ROW_HEIGHT = KIT_NAV_MAX_HEIGHT + KIT_NAV_TOP_BLEED
/** Active tab label was 5.5pt at 22pt row; scale so type weight matches the slightly taller strip. */
const KIT_NAV_ACTIVE_LABEL_SIZE = 5.5 * (KIT_NAV_ROW_HEIGHT / KIT_NAV_MAX_HEIGHT)
/** Total fixed header stack height (nav + title band, with vertical overlap counted once). */
const HEADER_CHROME_HEIGHT =
  KIT_NAV_MAX_HEIGHT + HEADER_BAND_MIN_HEIGHT - KIT_NAV_TITLE_OVERLAP
/**
 * Top `Page` padding on every subpage: nav strip only (title band is not repeated on continuation pages).
 * Must stay in sync with `KIT_NAV_MAX_HEIGHT` (nav row layout height before title band).
 */
const NAV_ONLY_CHROME_HEIGHT = KIT_NAV_MAX_HEIGHT
/**
 * One-time flow spacer after the fixed header so page-1 body clears the title band (`Page` padding is nav-only).
 * Not `View`+`render` — dynamic wrappers break multi-page wrapping in @react-pdf/renderer.
 */
const FIRST_SUBPAGE_TITLE_BAND_SPACER_HEIGHT = HEADER_CHROME_HEIGHT - NAV_ONLY_CHROME_HEIGHT

/**
 * Brand Identity Guide + other landscape kit PDFs: custom media box (not `LETTER` + orientation).
 * Width stays Letter (792pt). Height sits **between 16:10** (495pt) **and Letter landscape** (612pt)
 * so laptop Preview is closer to full-screen than 16:10 without losing as much vertical rhythm as 16:9.
 */
const LETTER_LANDSCAPE_HEIGHT_PT = 612
const GUIDE_LANDSCAPE_WIDTH = 792
/** Midpoint(495, 612) = 553.5 → 554pt */
const GUIDE_LANDSCAPE_HEIGHT = 554
/** React-PDF `[width, height]` — omit `orientation` when using explicit size. */
const LANDSCAPE_PDF_SIZE: [number, number] = [GUIDE_LANDSCAPE_WIDTH, GUIDE_LANDSCAPE_HEIGHT]

/**
 * Scale vertical layout constants designed for 612pt-tall landscape down to `GUIDE_LANDSCAPE_HEIGHT`.
 */
function landscapeLayoutV(baselinePt: number): number {
  return Math.round((baselinePt * GUIDE_LANDSCAPE_HEIGHT) / LETTER_LANDSCAPE_HEIGHT_PT)
}

/**
 * PDF text: no automatic hyphenation inside tokens — line breaks prefer spaces (whole words).
 * Use on names, wordmarks, color labels, and other reader-facing strings in narrow layouts.
 * @see https://react-pdf.org/advanced#hyphenation
 */
function wholeWordHyphenation(word: string): string[] {
  return [word]
}

/**
 * Brand Identity Guide: fixed top chrome (doc label + text section nav) and minimal footer.
 * Keep `paddingTop` / `paddingBottom` on guide `<Page>` in sync with these values.
 */
const GUIDE_TOP_CHROME_HEIGHT = 58
const GUIDE_FOOTER_RESERVED = 20

type GuideSectionId = 'summary' | 'positioning' | 'voice' | 'examples' | 'look'

/** First fragment of a wrapped `<Page>` — full title band + hide nav labels; later subpages show nav labels only. */
function isFirstSubPage(props: { pageNumber: number; subPageNumber?: number }): boolean {
  const { pageNumber, subPageNumber } = props
  if (subPageNumber !== undefined) return subPageNumber === 1
  return pageNumber === 1
}
// ---------------------------------------------------------------------------
// Styles (recipe-driven body + display families; must match `registerCoreKitPdfFonts`)
// ---------------------------------------------------------------------------

function createCoreKitStyles(bodyFamily: string, displayFamily: string) {
  return StyleSheet.create({
  page: {
    paddingTop: NAV_ONLY_CHROME_HEIGHT,
    paddingBottom: FOOTER_CHROME_HEIGHT,
    paddingHorizontal: 0,
    fontFamily: bodyFamily,
    fontWeight: 400,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  /** Pushes flowing content below the title band on page 1 only (static — do not use `render` here). */
  firstSubpageTitleBandSpacer: {
    height: FIRST_SUBPAGE_TITLE_BAND_SPACER_HEIGHT,
  },

  // Fixed header stack (kit TOC + title band)
  headerChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 612,
    flexDirection: 'column',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  /** Full-height colored strips; active tab label is centered vertically. */
  kitNavRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: -KIT_NAV_TOP_BLEED,
    height: KIT_NAV_ROW_HEIGHT,
    width: 612,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  kitNavSegment: {
    flex: 1,
    height: KIT_NAV_ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  /** Active tab label centered vertically in the strip (same cross-axis as inactive segments). */
  kitNavSegmentActive: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitNavActiveLabel: {
    fontSize: KIT_NAV_ACTIVE_LABEL_SIZE,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.6,
    textAlign: 'center',
  },

  headerBand: {
    marginTop: -KIT_NAV_TITLE_OVERLAP,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: HEADER_BAND_MIN_HEIGHT,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  /** Flex child so long doc titles wrap; ~524pt row minus customer column. */
  headerTitleWrap: {
    flex: 1,
    paddingRight: 14,
    minWidth: 0,
  },
  /**
   * Doc title: recipe display face, font-normal (400), sentence case,
   * ~text-4xl→text-5xl scale. Heavier weights are for small accents only on the site.
   */
  headerTitle: {
    fontSize: 30,
    lineHeight: 1.12,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
  },
  /** Customer business name — quiet caption; doc title stays the hero */
  headerCustomerName: {
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 400,
    letterSpacing: 0.15,
    paddingBottom: 2,
    textAlign: 'right',
    maxWidth: 200,
    opacity: 0.92,
  },

  anchorWrap: {
    paddingHorizontal: 44,
    paddingTop: 16,
    paddingBottom: 14,
  },
  /** Editorial pull quote — recipe display face italic 400. */
  anchorText: {
    fontSize: 11,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.bodyText,
    lineHeight: 1.65,
  },

  sectionBand: {
    paddingVertical: 6,
    paddingHorizontal: 44,
  },
  /** Section eyebrow: body face bold caps + wide tracking. */
  sectionBandLabel: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 2.25,
  },

  sectionBody: {
    paddingHorizontal: 44,
    paddingTop: 10,
    paddingBottom: 14,
  },
  /** Body: recipe secondary (300); 400 still available for dense UI if needed. */
  sectionBodyText: {
    fontSize: 10,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.65,
    color: BRAND.bodyText,
  },

  /** Visual direction — logo note row: collage (L) + prose (R). */
  visualDirLogoRow: {
    flexDirection: 'row',
    /** `stretch` matches the prose column height; Yoga then mis-measures the mosaic and the hero tile can paint over the pair row. */
    alignItems: 'flex-start',
    marginTop: 8,
  },
  visualDirCollageWrap: {
    width: 200,
    flexShrink: 0,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    /** Outside gutter to the italic paragraph column (padding would shrink the 200pt mosaic). */
    marginRight: 22,
  },
  /** Sits below the mosaic — caption for the exploration, not a section title. */
  visualDirCollageEyebrow: {
    fontSize: 5.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: BRAND.subText,
    marginTop: 8,
    marginBottom: 0,
  },
  /** Mosaic: two compact cells + one full-width hero (see `WordmarkExplorationStrip`). */
  visualDirCollageMosaic: {
    flexDirection: 'column',
    width: 200,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  /** Extra column shell so pair row + hero stack with measured heights (avoids overlap under `wrap={false}` parents). */
  visualDirCollageMosaicColumn: {
    flexDirection: 'column',
    width: 200,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  /** Yoga sometimes ignores margin-between siblings in PDF; a real row reserves vertical space. */
  visualDirCollageRowSpacer: {
    width: 200,
    height: 8,
    flexShrink: 0,
  },
  visualDirCollagePairRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'flex-start',
    width: 200,
    flexShrink: 0,
    minHeight: 52,
  },
  visualDirCollageTile: {
    flexDirection: 'column',
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  visualDirCollageTileCompact: {
    flex: 1,
    minWidth: 0,
    flexShrink: 0,
    minHeight: 52,
  },
  visualDirCollageTileWide: {
    alignSelf: 'flex-start',
    width: 200,
    flexShrink: 0,
    minHeight: 60,
  },
  /** Centers the glyph(s) in the space above the tile caption so compact + wide tiles align optically. */
  visualDirCollageTileInner: {
    flexGrow: 1,
    flexShrink: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
  },
  visualDirCollageTileCaption: {
    fontSize: 4.75,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.35,
    marginTop: 6,
    color: BRAND.subText,
  },
  visualDirLogoTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-start',
  },

  /** Two-column: text left, swatches right. */
  paletteTwoCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 110,
  },
  paletteTextCol: {
    flex: 1,
    paddingRight: 18,
  },
  /** Fixed-width container that holds all swatch tiles side-by-side. */
  paletteSwatchCol: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  /** Individual swatch tile — flex set inline to encode usage-ratio hierarchy. */
  paletteSwatchTile: {
    alignSelf: 'stretch',
    borderRadius: 3,
    marginLeft: 3,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  paletteSwatchRoleLabel: {
    fontSize: 5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  paletteSwatchHexLabel: {
    fontSize: 5,
    fontFamily: bodyFamily,
    fontWeight: 400,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  typographySectionLead: {
    fontSize: 10,
    fontFamily: bodyFamily,
    fontWeight: 400,
    lineHeight: 1.55,
    color: BRAND.bodyText,
    marginBottom: 10,
  },
  /** Bordered box: DOWNLOADS label + row (links | short disclaimer). */
  typographyDownloadsBox: {
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 3,
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  typographyDownloadsBoxTitle: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.15,
    color: BRAND.subText,
    marginBottom: 8,
  },
  /** Two font columns on one row — no vertical rule between them. */
  typographyDownloadsLinksRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  typographyDownloadCol: {
    flex: 1,
    minWidth: 0,
  },
  typographyDownloadColFirst: {
    paddingRight: 8,
  },
  typographyDownloadColSecond: {
    paddingLeft: 8,
  },
  typographyDownloadColLabel: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    color: BRAND.black,
    marginBottom: 3,
  },
  typographyDownloadColLink: {
    fontSize: 8,
    fontFamily: bodyFamily,
    fontWeight: 400,
    lineHeight: 1.45,
    color: BRAND.bodyText,
    textDecoration: 'underline',
  },
  typographyDisclaimerRow: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  typographyDisclaimerTextItalic: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.45,
    color: BRAND.subText,
    textAlign: 'right',
  },
  /** Typography specimens — two columns when two faces; meta in Inter, names in specimen faces. */
  typographySpecimenStack: {
    marginBottom: 8,
  },
  typographySpecimenRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  typographySpecimenColumn: {
    flex: 1,
    minWidth: 0,
  },
  typographySpecimenColumnFirst: {
    paddingRight: 10,
  },
  typographySpecimenColumnSecond: {
    borderLeftWidth: 1,
    borderLeftColor: '#E4E4E7',
    paddingLeft: 12,
  },
  specimenHeaderBand: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 2,
  },
  specimenRoleEyebrow: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.15,
    color: BRAND.subText,
    marginBottom: 3,
  },
  specimenRoleEyebrowInBand: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.85,
    lineHeight: 1.35,
    color: BRAND.subText,
    marginBottom: 0,
  },
  /** Hairline under the family name — separates label from the business-name ladder without a large gap. */
  specimenFaceLabelBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
    paddingBottom: 8,
    marginBottom: 8,
  },
  specimenWeightStack: {
    marginTop: 0,
  },
  specimenWeightSampleBlock: {
    marginBottom: 5,
  },
  specimenWeightCaption: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.35,
    color: BRAND.subText,
    marginTop: 2,
  },
  /** Two-column layout: slightly larger display lines with caption under each weight. */
  specimenInterDisplayRegular: {
    fontSize: 17,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: BRAND.black,
  },
  specimenInterDisplayBold: {
    fontSize: 17,
    fontFamily: bodyFamily,
    fontWeight: 700,
    color: BRAND.black,
  },
  specimenInterDisplayItalic: {
    fontSize: 17,
    fontFamily: bodyFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.black,
  },
  specimenSerifDisplayRegular: {
    fontSize: 19,
    fontFamily: displayFamily,
    fontWeight: 400,
    color: BRAND.black,
  },
  specimenSerifDisplayBold: {
    fontSize: 19,
    fontFamily: displayFamily,
    fontWeight: 700,
    color: BRAND.black,
  },
  specimenSerifDisplayItalic: {
    fontSize: 19,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.black,
  },
  specimenExistingNote: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 10,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.65,
    color: BRAND.bodyText,
  },
  specimenWordmarkNote: {
    marginTop: 5,
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 400,
    lineHeight: 1.45,
    color: BRAND.subText,
  },

  // ---------------------------------------------------------------------------
  // Do / Avoid — large Source Serif anchor + items (stacked DO row, then AVOID row)
  // ---------------------------------------------------------------------------
  doAvoidStack: {
    flexDirection: 'column',
  },
  doAvoidRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  /** Wide enough for "Avoid" at wordFontSize on one line — prevents overlap into list column. */
  doAvoidWordCol: {
    width: 108,
    paddingRight: 12,
    flexShrink: 0,
    justifyContent: 'flex-start',
  },
  doAvoidWordDisplay: {
    fontSize: 28,
    lineHeight: 1.02,
    fontFamily: displayFamily,
    fontWeight: 400,
  },
  /**
   * List column — text wraps within this flex area only (react-pdf has no CSS float /
   * shape-outside, so true wrap-around a graphic is not supported; this two-column
   * rail keeps copy beside the display word without overlap).
   */
  doAvoidItemsCol: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingTop: 1,
  },
  doAvoidItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  doAvoidSymbol: {
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 700,
    width: 14,
    marginTop: 0.5,
    flexShrink: 0,
  },
  doAvoidItemText: {
    flex: 1,
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.6,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Week Checklist (Quick Start)
  // ---------------------------------------------------------------------------
  /** Spacing under the week intro line (inline runs below). */
  weekHeader: {
    marginBottom: 10,
  },
  /** Source Serif week index — nested with the Inter run in one parent `Text` so PDF layout uses a single inline line (avoids flex/line-box mismatch in viewers). */
  weekNumText: {
    fontSize: 14,
    fontFamily: displayFamily,
    fontWeight: 400,
  },
  weekBadgeLabel: {
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 600,
    color: BRAND.bodyText,
  },
  weekIntro: {
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 400,
    lineHeight: 1.55,
    color: BRAND.bodyText,
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checklistBox: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
    flexShrink: 0,
  },
  checklistText: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Styled Bullets
  // ---------------------------------------------------------------------------
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  bulletNumWrap: {
    width: 22,
    paddingTop: 2,
    flexShrink: 0,
  },
  bulletNum: {
    fontSize: 8,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: BRAND.subText,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },
  bulletGroupSpacer: {
    height: 10,
  },
  bulletGroupLabel: {
    fontSize: 6,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: BRAND.subText,
    marginBottom: 7,
  },

  // ---------------------------------------------------------------------------
  // Phrase Callouts
  // ---------------------------------------------------------------------------
  phraseCalloutRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 6,
  },
  phraseCalloutBorder: {
    width: 2,
    borderRadius: 1,
    marginRight: 10,
    flexShrink: 0,
  },
  phraseCalloutText: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    lineHeight: 1.6,
    color: BRAND.bodyText,
    paddingVertical: 1,
  },
  /** Voice Playbook CTA definition block (display face; nested runs set weight). */
  voicePlaybookCtaDefinitionWrap: {
    fontSize: 11,
    fontFamily: displayFamily,
    lineHeight: 1.65,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Before / After
  // ---------------------------------------------------------------------------
  beforeAfterGroup: {
    marginBottom: 14,
  },
  beforeAfterGroupLabel: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: BRAND.subText,
    marginBottom: 8,
  },
  beforeAfterTwoCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  beforeAfterColLabel: {
    fontSize: 5.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 4,
  },
  beforeAfterColHeaderBand: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 2,
  },
  beforeAfterColHeaderText: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.1,
  },
  beforeAfterColBefore: {
    flex: 1,
    paddingRight: 12,
  },
  beforeAfterColAfter: {
    flex: 1,
    paddingLeft: 12,
    borderLeftWidth: 0.5,
    borderLeftColor: '#E4E4E7',
  },
  beforeAfterBeforeText: {
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.subText,
    fontStyle: 'italic',
  },
  beforeAfterAfterText: {
    fontSize: 9.5,
    fontFamily: displayFamily,
    fontWeight: 400,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },

  /** Brand Brief — Core transformation (editorial pull-quote) */
  coreTransformationText: {
    fontSize: 12,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Tone Descriptor Chips
  // ---------------------------------------------------------------------------
  toneChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  toneChip: {
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toneChipLabel: {
    fontSize: 6,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: BRAND.subText,
    marginRight: 3,
  },
  toneChipValue: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Value Pills (Brand Brief)
  // ---------------------------------------------------------------------------
  valuePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  valuePill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 5,
  },
  valuePillText: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.2,
  },

  // ---------------------------------------------------------------------------
  // Key-Value rows (Brand Brief structured sections)
  // ---------------------------------------------------------------------------
  kvRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  kvLabel: {
    width: 88,
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: BRAND.subText,
    paddingTop: 1.5,
    flexShrink: 0,
  },
  kvValue: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },
  kvValueBold: {
    flex: 1,
    fontSize: 11,
    fontFamily: bodyFamily,
    fontWeight: 600,
    lineHeight: 1.3,
    color: BRAND.black,
  },
  /** Same flex wrap as `valuePillRow`, but sits beside `kvLabel` — no extra bottom margin, grows to fill row. */
  kvPillsInline: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    paddingTop: 1,
  },

  // ---------------------------------------------------------------------------
  // Brand Identity Guide — landscape spread system
  // ---------------------------------------------------------------------------
  guideTopChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GUIDE_LANDSCAPE_WIDTH,
    paddingTop: 8,
    paddingBottom: 7,
    paddingHorizontal: 44,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  guideTopTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  guideTopDocLabel: {
    fontSize: 7,
    fontFamily: bodyFamily,
    fontWeight: 500,
    letterSpacing: 0.1,
    color: BRAND.subText,
  },
  guideTopBusinessName: {
    fontSize: 7.25,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: BRAND.subText,
    maxWidth: 280,
    textAlign: 'right',
  },
  guideTopNavRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  guideNavSeparator: {
    fontSize: 7.25,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: '#A1A1AA',
    marginHorizontal: 4,
  },
  guideNavItem: {
    fontSize: 8,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: BRAND.subText,
  },
  guideNavItemActive: {
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 600,
    color: BRAND.black,
  },
  guideLandscapePage: {
    flexDirection: 'column',
    height: '100%',
    paddingTop: GUIDE_TOP_CHROME_HEIGHT,
    paddingBottom: GUIDE_FOOTER_RESERVED,
    paddingHorizontal: 44,
    fontFamily: bodyFamily,
    fontWeight: 400,
    backgroundColor: '#FFFFFF',
  },
  guideSpread: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 0,
    paddingTop: 10,
  },
  guideSpreadHeader: {
    marginBottom: 15,
  },
  guideFolioRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  guideFolioNumber: {
    fontSize: 22,
    lineHeight: 1,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.1,
    color: BRAND.black,
    marginRight: 8,
  },
  guideFolioTitleWrap: {
    flex: 1,
  },
  guideSpreadEyebrow: {
    fontSize: 6.25,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.9,
    color: BRAND.subText,
    marginBottom: 2,
  },
  guideSpreadTitle: {
    fontSize: 22,
    lineHeight: 1.06,
    fontFamily: displayFamily,
    fontWeight: 400,
    color: BRAND.black,
  },
  guideSpreadDeck: {
    maxWidth: 490,
    fontSize: 8.75,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.42,
    color: BRAND.bodyText,
    marginTop: 10,
  },
  guideEditorialThreeCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideEditorialCol: {
    flex: 1,
  },
  guideEditorialRule: {
    width: 12,
  },
  guideEditorialRuleLine: {
    width: 0.5,
    height: '100%',
    backgroundColor: '#E4E4E7',
    marginLeft: 6,
  },
  guideSampleRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
  },
  guideSampleCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  guideSampleHeadline: {
    fontSize: 10.25,
    lineHeight: 1.2,
    fontFamily: displayFamily,
    fontWeight: 400,
    color: BRAND.black,
    marginBottom: 4,
  },
  guideSampleBody: {
    fontSize: 8.9,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.45,
    color: BRAND.bodyText,
  },
  guideFigureMat: {
    minHeight: landscapeLayoutV(88),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
  },
  guideFigureMatLabel: {
    fontSize: 6.25,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1,
    color: BRAND.subText,
    marginBottom: 5,
  },
  guideFigureMatText: {
    fontSize: 8.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.4,
    color: BRAND.subText,
  },
  guideFigureMatTall: {
    minHeight: landscapeLayoutV(128),
  },
  guideTopDeckBlock: {
    marginBottom: 12,
  },
  guideVoiceBottomBand: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E4E4E7',
  },
  guideTwoColTopHeavy: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideTwoColMain: {
    flex: 1.28,
  },
  guideTwoColRail: {
    width: 232,
  },
  guideHeroRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  guideHeroQuotePanel: {
    flexGrow: 1,
    alignSelf: 'stretch',
    minHeight: landscapeLayoutV(168),
    borderWidth: 0.5,
    borderColor: '#F1F1F3',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  guideHeroQuote: {
    fontSize: 16,
    lineHeight: 1.3,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.bodyText,
  },
  guideHeroSupportPanel: {
    flex: 0.9,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  guidePanelStack: {
    flexDirection: 'column',
  },
  guidePanelStackGap: {
    height: 12,
  },
  guideColumns: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideColumnGap: {
    width: 12,
  },
  guideCard: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  guideTintCard: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  guideCardLabel: {
    fontSize: 6.1,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.7,
    color: BRAND.subText,
    marginBottom: 4,
  },
  guideCardBody: {
    fontSize: 9.25,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.48,
    color: BRAND.bodyText,
  },
  guideOpenLabel: {
    fontSize: 6.1,
    fontFamily: bodyFamily,
    fontWeight: 600,
    letterSpacing: 0.7,
    color: BRAND.subText,
    marginBottom: 4,
  },
  /** Fills remaining spread height so hero + rail are not collapsed to one strip */
  guideHeroRailRoot: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
  },
  guideTemplateHeroRail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: landscapeLayoutV(140),
  },
  guideTemplateHeroMain: {
    flex: 1.35,
    flexDirection: 'column',
    minHeight: 0,
  },
  /** Page 01 summary — column so quote + caption stack inside hero main */
  guideSummaryHeroColumn: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    minHeight: 0,
  },
  guideTemplateHeroRailCol: {
    width: 226,
  },
  guideTemplateBottomRow: {
    marginTop: 11,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideTemplateBottomMain: {
    flex: 1,
  },
  guideReferenceGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideReferenceLead: {
    width: 146,
  },
  guideReferenceMain: {
    flex: 1,
  },
  guideReferenceSide: {
    width: 216,
  },
  guideSummaryGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideSummaryMainCol: {
    flex: 1.25,
  },
  guideSummarySideCol: {
    width: 198,
  },
  guideKvBlock: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  guideKvRow: {
    marginBottom: 8,
  },
  guideKvKey: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1,
    color: BRAND.subText,
    marginBottom: 2,
  },
  guideKvValue: {
    fontSize: 9.5,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.45,
    color: BRAND.bodyText,
  },
  guideTraitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  guideTraitPill: {
    borderWidth: 0.5,
    borderColor: '#EEEEF2',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#F4F4F5',
  },
  guideTraitPillText: {
    fontSize: 7.5,
    fontFamily: bodyFamily,
    fontWeight: 600,
    color: BRAND.bodyText,
  },
  guideListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  guideListIndex: {
    width: 18,
    fontSize: 7,
    fontFamily: bodyFamily,
    fontWeight: 700,
    color: BRAND.subText,
    paddingTop: 1,
  },
  guideListText: {
    flex: 1,
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.42,
    color: BRAND.bodyText,
  },
  guideInlineTraits: {
    fontSize: 11.5,
    fontFamily: displayFamily,
    fontWeight: 400,
    color: BRAND.bodyText,
    lineHeight: 1.4,
  },
  guideExamplesLayout: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideExamplesHeroCol: {
    flex: 1.45,
  },
  guideExamplesSideCol: {
    width: 224,
  },
  guidePhraseLine: {
    fontSize: 9.25,
    fontFamily: displayFamily,
    fontWeight: 400,
    lineHeight: 1.4,
    color: BRAND.bodyText,
    marginBottom: 6,
  },
  guideDoAvoidRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  guideDoAvoidWord: {
    width: 46,
    fontSize: 14,
    fontFamily: displayFamily,
    fontWeight: 400,
    color: BRAND.black,
    lineHeight: 1.05,
  },
  guideDoAvoidItems: {
    flex: 1,
  },
  guideDoAvoidItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  guideDoAvoidSymbol: {
    width: 12,
    fontSize: 8,
    fontFamily: bodyFamily,
    fontWeight: 700,
    color: BRAND.subText,
    paddingTop: 1,
  },
  guideDoAvoidText: {
    flex: 1,
    fontSize: 9.25,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.45,
    color: BRAND.bodyText,
  },
  guideBeforeAfterGroup: {
    marginBottom: 10,
  },
  guideBeforeAfterLabel: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.05,
    color: BRAND.subText,
    marginBottom: 5,
  },
  guideBeforeAfterCols: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideBeforeCol: {
    flex: 1,
    paddingRight: 8,
  },
  guideAfterCol: {
    flex: 1,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E4E4E7',
  },
  guideMiniHeader: {
    fontSize: 6.25,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1,
    color: BRAND.subText,
    marginBottom: 5,
  },
  guideBeforeText: {
    fontSize: 9,
    fontFamily: bodyFamily,
    fontWeight: 300,
    lineHeight: 1.5,
    color: BRAND.subText,
    fontStyle: 'italic',
  },
  guideAfterText: {
    fontSize: 9.5,
    fontFamily: displayFamily,
    fontWeight: 400,
    lineHeight: 1.5,
    color: BRAND.bodyText,
  },
  guidePaletteLayout: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  guidePaletteSwatches: {
    alignSelf: 'stretch',
    width: '100%',
  },
  guidePaletteSwatchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 148,
  },
  guidePaletteSwatchTile: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginRight: 6,
  },
  guidePaletteRole: {
    fontSize: 6,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.95,
  },
  guidePaletteHex: {
    fontSize: 7,
    fontFamily: bodyFamily,
    fontWeight: 500,
    letterSpacing: 0.2,
  },
  guidePaletteCopy: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  guideCaptionText: {
    fontSize: 7.25,
    fontFamily: bodyFamily,
    fontWeight: 400,
    lineHeight: 1.35,
    color: BRAND.subText,
  },
  /** Folio 02a equal swatches — friendly name is the editorial headline. */
  guideEqualSwatchName: {
    fontSize: 24,
    lineHeight: 1.06,
    fontFamily: displayFamily,
    fontWeight: 400,
    letterSpacing: -0.15,
  },
  guideEqualSwatchHex: {
    fontSize: 9.5,
    lineHeight: 1.25,
    fontFamily: bodyFamily,
    fontWeight: 500,
    letterSpacing: 1.35,
    marginTop: 8,
  },
  guideVisualBoardTop: {
    marginBottom: 10,
  },
  /** Folio 02b — typeface specimen row only (wordmark color blocks stay full width). */
  guideLookTypographyColumn: {
    alignSelf: 'center',
    width: 500,
  },
  /** Fills space under folio 02b lead so split columns can vertically center. */
  guideTypographySplitBand: {
    flex: 1,
    minHeight: 0,
    marginBottom: 10,
  },
  /** Folio 02b split: stretches to band height; columns align to max height then center contents. */
  guideTypographySplitRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    flex: 1,
    minHeight: 0,
  },
  /** Wider band so duo typeface columns aren’t squeezed (wordmark column unchanged). */
  guideTypographySplitLeft: {
    width: 432,
    flexShrink: 0,
    paddingRight: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  /** Grows so typefaces and wordmarks aren’t bunched on the left — real space between columns. */
  guideTypographySplitGutter: {
    flex: 1,
    minWidth: 28,
  },
  /** Narrower column so wordmark swatches read taller, not wide strips. */
  guideTypographySplitRight: {
    width: 208,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  /** Full-width stacked color blocks; square corners (no borderRadius). */
  guideWordmarkColumnBlockFull: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  /** Folio 02b split left — two typefaces side by side, each column left-aligned. */
  guideTypeSpecimenDuoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    justifyContent: 'flex-start',
  },
  guideTypeSpecimenTileDuo: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  /** Folio 02b stack — larger editorial eyebrow; alignment set per-tile (left / right). */
  guideTypeSpecimenStackEyebrow: {
    fontSize: 8,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: BRAND.subText,
    marginBottom: 6,
  },
  guideTypeSpecimenStackFace: {
    fontSize: 26,
    lineHeight: 1.04,
    fontWeight: 500,
    color: BRAND.black,
    marginBottom: 6,
  },
  guideTypeSpecimenStackLadderLabel: {
    fontSize: 15,
    lineHeight: 1.3,
    fontWeight: 400,
    fontStyle: 'normal',
    color: BRAND.black,
    width: '100%',
    marginBottom: 1,
  },
  guideVisualBoardBottom: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideVisualBoardMain: {
    flex: 1.15,
  },
  guideVisualBoardSide: {
    width: 260,
  },
  guideTypeSpecimenRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  guideTypeSpecimenTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  /** Folio 02b: fixed-width columns, centered as a group with space on both sides. */
  guideTypeSpecimenRowNarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  guideTypeSpecimenTileNarrow: {
    width: 238,
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 24,
    backgroundColor: '#FFFFFF',
  },
  guideTypeSpecimenFace: {
    fontSize: 10,
    lineHeight: 1.25,
    fontWeight: 400,
    color: BRAND.black,
    marginBottom: 10,
  },
  /** Folio 02b typeface card — face name is the visual anchor (larger than legacy specimen labels). */
  guideTypeSpecimenFaceLead: {
    fontSize: 22,
    lineHeight: 1.12,
    fontWeight: 500,
    color: BRAND.black,
    marginBottom: 6,
  },
  guideTypeSpecimenWeightLadder: {
    marginTop: 6,
    width: '100%',
    alignSelf: 'stretch',
  },
  guideTypeSpecimenWeightLadderLabel: {
    fontSize: 15,
    lineHeight: 1.38,
    fontWeight: 400,
    fontStyle: 'normal',
    color: BRAND.black,
    textAlign: 'right',
    width: '100%',
    marginBottom: 3,
  },
  guideTypeSpecimenSample: {
    fontSize: 18,
    lineHeight: 1.1,
    fontWeight: 400,
    color: BRAND.black,
    marginBottom: 8,
  },
  guideTypeSpecimenCaption: {
    fontSize: 8.5,
    lineHeight: 1.2,
    fontWeight: 400,
    color: BRAND.subText,
  },
  guideLookLowerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
  },
  guideAnchorWrap: {
    marginBottom: 10,
  },
  guideAnchorText: {
    fontSize: 16,
    lineHeight: 1.28,
    fontFamily: displayFamily,
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.bodyText,
  },
  guideQuietTitleRow: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F1F3',
  },
  guideQuietTitle: {
    fontSize: 6.75,
    fontFamily: bodyFamily,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: BRAND.subText,
  },
  guideQuietBody: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  guideFooterRow: {
    position: 'absolute',
    bottom: 8,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideFooterText: {
    fontSize: 6.5,
    fontFamily: bodyFamily,
    fontWeight: 400,
    color: BRAND.subText,
  },
  guideSectionGap: {
    height: 8,
  },
  })
}

export type CoreKitPdfStyles = ReturnType<typeof createCoreKitStyles>

function kitPdfStyles(form: IdentityKitForm): CoreKitPdfStyles {
  const { bodyFamily, displayFamily } = getKitPdfFontFamilies(form)
  return createCoreKitStyles(bodyFamily, displayFamily)
}

function brandIdentityGuidePdfStyles(): CoreKitPdfStyles {
  const { bodyFamily, displayFamily } = getBrandIdentityGuidePdfFontFamilies()
  return createCoreKitStyles(bodyFamily, displayFamily)
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function KitNavHeader({
  styles: S,
  activeDocId,
  palette,
  tier,
  hideActiveLabel,
}: {
  styles: CoreKitPdfStyles
  activeDocId: DocId
  palette: string
  tier: KitPdfTier
  /** When true (first subpage while title band is shown), omit tab text — doc title is in the band below. */
  hideActiveLabel?: boolean
}) {
  const docs = kitDocsForTier(tier)
  return (
    <View style={S.kitNavRow}>
      {docs.map((doc, i) => {
        const segColor = segmentColor(palette, i, tier)
        const isActive = doc.id === activeDocId
        const labelColor = onColor(segColor)
        const showLabel = isActive && !hideActiveLabel
        return (
          <View
            key={doc.id}
            style={[
              S.kitNavSegment,
              isActive ? S.kitNavSegmentActive : {},
              i > 0 ? { marginLeft: -KIT_NAV_TAB_OVERLAP } : {},
              { backgroundColor: segColor },
            ]}
          >
            {showLabel ? (
              <Text style={[S.kitNavActiveLabel, { color: labelColor }]}>{doc.label.toUpperCase()}</Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

function PageHeaderBand({
  styles: S,
  docTitle,
  businessName,
  color,
}: {
  styles: CoreKitPdfStyles
  docTitle: string
  businessName: string
  color: string
}) {
  const textColor = onColor(color)
  return (
    <View style={[S.headerBand, { backgroundColor: color }]}>
      <View style={S.headerTitleWrap}>
        <Text style={[S.headerTitle, { color: textColor }]}>{docTitle}</Text>
      </View>
      <Text hyphenationCallback={wholeWordHyphenation} style={[S.headerCustomerName, { color: textColor }]}>
        {businessName}
      </Text>
    </View>
  )
}

/**
 * Fixed kit chrome: nav row on every subpage; first-page title band is rendered in normal flow.
 */
function PageHeaderChrome({
  styles: S,
  activeDocId,
  palette,
  tier,
}: {
  styles: CoreKitPdfStyles
  activeDocId: DocId
  palette: string
  tier: KitPdfTier
}) {
  return (
    <View
      style={S.headerChrome}
      fixed
      render={({ pageNumber, subPageNumber }) => {
        const first = isFirstSubPage({ pageNumber, subPageNumber })
        return (
          <View style={{ flexDirection: 'column' }}>
            <KitNavHeader
              styles={S}
              activeDocId={activeDocId}
              palette={palette}
              tier={tier}
              hideActiveLabel={first}
            />
          </View>
        )
      }}
    />
  )
}

function GuideTopChrome({
  styles: S,
  businessName,
  activeSection,
  navItems,
}: {
  styles: CoreKitPdfStyles
  businessName: string
  activeSection: GuideSectionId
  navItems: Array<{ id: GuideSectionId; label: string }>
}) {
  return (
    <View style={S.guideTopChrome} fixed>
      <View style={S.guideTopTitleRow}>
        <Text style={S.guideTopDocLabel}>Brand Identity Guide</Text>
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideTopBusinessName}>
          {businessName}
        </Text>
      </View>
      <View style={S.guideTopNavRow}>
        {navItems.map((s, i) => (
          <View key={s.id} style={{ flexDirection: 'row', alignItems: 'baseline' }} wrap={false}>
            {i > 0 ? <Text style={S.guideNavSeparator}>/</Text> : null}
            <Text
              hyphenationCallback={wholeWordHyphenation}
              style={activeSection === s.id ? S.guideNavItemActive : S.guideNavItem}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function GuideMinimalFooter({ styles: S, businessName }: { styles: CoreKitPdfStyles; businessName: string }) {
  return (
    <View
      style={S.guideFooterRow}
      fixed
      render={({ pageNumber }) => (
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideFooterText}>
            {businessName}
          </Text>
          <Text style={S.guideFooterText}>Brand Alchemy · {pageNumber}</Text>
        </View>
      )}
    />
  )
}

function GuideSpreadHeader({
  styles: S,
  folio,
  title,
  deck,
}: {
  styles: CoreKitPdfStyles
  folio: string
  title: string
  deck?: string
}) {
  return (
    <View style={S.guideSpreadHeader}>
      <View style={S.guideFolioRow}>
        <Text style={S.guideFolioNumber}>{folio}</Text>
        <View style={S.guideFolioTitleWrap}>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSpreadTitle}>
            {title}
          </Text>
        </View>
      </View>
      {deck ? (
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSpreadDeck}>
          {deck}
        </Text>
      ) : null}
    </View>
  )
}

function GuideFigureMat({
  styles: S,
  label,
  body,
  tall = false,
}: {
  styles: CoreKitPdfStyles
  label: string
  body: string
  tall?: boolean
}) {
  return (
    <View style={[S.guideFigureMat, tall ? S.guideFigureMatTall : null]}>
      <Text style={S.guideFigureMatLabel}>{label.toUpperCase()}</Text>
      <Text hyphenationCallback={wholeWordHyphenation} style={S.guideFigureMatText}>
        {body}
      </Text>
    </View>
  )
}

function GuideSampleRow({
  styles: S,
  items,
}: {
  styles: CoreKitPdfStyles
  items: Array<{ headline: string; body?: string }>
}) {
  return (
    <View style={S.guideSampleRow}>
      {items.map((item, index) => (
        <View key={`${item.headline}-${index}`} style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch' }}>
          {index > 0 ? (
            <View style={S.guideEditorialRule}>
              <View style={S.guideEditorialRuleLine} />
            </View>
          ) : null}
          <View style={S.guideSampleCol}>
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSampleHeadline}>
              {item.headline}
            </Text>
            {item.body ? (
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSampleBody}>
                {item.body}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  )
}

function GuideCard({
  styles: S,
  label,
  children,
  tintColor,
  flex,
}: {
  styles: CoreKitPdfStyles
  label?: string
  children: ReactNode
  tintColor?: string
  flex?: number
}) {
  return (
    <View
      style={[
        tintColor ? S.guideTintCard : S.guideCard,
        tintColor ? { backgroundColor: accentTintRgba(tintColor, 0.12) } : {},
        flex ? { flex } : {},
      ]}
      wrap={false}
    >
      {label ? <Text style={S.guideCardLabel}>{label.toUpperCase()}</Text> : null}
      {children}
    </View>
  )
}

function GuideListBlock({ styles: S, items }: { styles: CoreKitPdfStyles; items: string[] }) {
  return (
    <>
      {items.map((item, index) => (
        <View key={`${index}-${item}`} style={S.guideListItem}>
          <Text style={S.guideListIndex}>{String(index + 1).padStart(2, '0')}</Text>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideListText}>
            {item}
          </Text>
        </View>
      ))}
    </>
  )
}

function GuideDoAvoidPanel({
  styles: S,
  dos,
  avoids,
}: {
  styles: CoreKitPdfStyles
  dos: string[]
  avoids: string[]
}) {
  const renderRow = (word: string, symbol: string, items: string[]) => (
    <View style={S.guideDoAvoidRow}>
      <Text style={S.guideDoAvoidWord}>{word}</Text>
      <View style={S.guideDoAvoidItems}>
        {items.map((item, index) => (
          <View key={`${word}-${index}`} style={S.guideDoAvoidItem}>
            <Text style={S.guideDoAvoidSymbol}>{symbol}</Text>
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideDoAvoidText}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <>
      {renderRow('Do', '✓', dos)}
      {renderRow('Avoid', '✗', avoids)}
    </>
  )
}

function GuideBeforeAfterPanel({
  styles: S,
  pairs,
}: {
  styles: CoreKitPdfStyles
  pairs: Array<{ label: string; before: string; after: string }>
}) {
  return (
    <>
      {pairs.map((pair) => (
        <View key={pair.label} style={S.guideBeforeAfterGroup}>
          <Text style={S.guideBeforeAfterLabel}>{pair.label.toUpperCase()}</Text>
          <View style={S.guideBeforeAfterCols}>
            <View style={S.guideBeforeCol}>
              <Text style={S.guideMiniHeader}>BEFORE</Text>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideBeforeText}>
                {pair.before}
              </Text>
            </View>
            <View style={S.guideAfterCol}>
              <Text style={S.guideMiniHeader}>AFTER</Text>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideAfterText}>
                {pair.after}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  )
}

function GuidePalettePanel({
  styles: S,
  rows,
  roleLines,
}: {
  styles: CoreKitPdfStyles
  rows: Array<{ hex: string; role: string; flex?: number }>
  roleLines: Array<{ role: string; hex: string; flex: number; line: string }>
}) {
  return (
    <View style={S.guidePaletteLayout}>
      <View style={S.guidePaletteSwatches}>
        <View style={S.guidePaletteSwatchRow}>
          {rows.map((row, index) => {
            const tc = onColor(row.hex)
            return (
              <View
                key={`${row.role}-${row.hex}-${index}`}
                style={[
                  S.guidePaletteSwatchTile,
                  { flex: row.flex ?? 2, backgroundColor: row.hex },
                  index === rows.length - 1 ? { marginRight: 0 } : {},
                ]}
              >
                <Text style={[S.guidePaletteRole, { color: tc }]}>{row.role.toUpperCase()}</Text>
                <Text style={[S.guidePaletteHex, { color: tc }]}>{row.hex.toUpperCase()}</Text>
              </View>
            )
          })}
        </View>
      </View>
      <View style={S.guidePaletteCopy}>
        {roleLines.map((entry) => (
          <View
            key={`${entry.role}-${entry.hex}`}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}
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
              <Text style={S.guideKvKey}>{entry.role.toUpperCase()} </Text>
              {entry.line}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function GuideOpenModule({
  styles: S,
  label,
  children,
}: {
  styles: CoreKitPdfStyles
  label?: string
  children: ReactNode
}) {
  return (
    <View wrap={false}>
      {label ? <Text style={S.guideOpenLabel}>{label.toUpperCase()}</Text> : null}
      {children}
    </View>
  )
}

function GuideFactListModule({
  styles: S,
  rows,
}: {
  styles: CoreKitPdfStyles
  rows: Array<{ label: string; value: string }>
}) {
  return (
    <>
      {rows.map((row) => (
        <View key={row.label} style={S.guideKvRow}>
          <Text style={S.guideKvKey}>{row.label.toUpperCase()}</Text>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideKvValue}>
            {row.value}
          </Text>
        </View>
      ))}
    </>
  )
}

function GuideTypeSpecimenModule({
  styles: S,
  businessName,
  specimens,
}: {
  styles: CoreKitPdfStyles
  businessName: string
  specimens: Array<{ pdfFamily: string; roleEyebrow: string; faceLabel: string }>
}) {
  return (
    <View wrap={false}>
      <View style={S.guideTypeSpecimenRow}>
        {specimens.map((specimen, index) => (
          <View
            key={`${specimen.faceLabel}-${index}`}
            style={[S.guideTypeSpecimenTile, index === specimens.length - 1 ? { marginRight: 0 } : {}]}
          >
            <Text style={S.guideMiniHeader}>{specimen.roleEyebrow.toUpperCase()}</Text>
            <Text
              hyphenationCallback={wholeWordHyphenation}
              style={[S.guideTypeSpecimenFace, { fontFamily: specimen.pdfFamily }]}
            >
              {specimen.faceLabel}
            </Text>
            <Text
              hyphenationCallback={wholeWordHyphenation}
              style={[S.guideTypeSpecimenSample, { fontFamily: specimen.pdfFamily }]}
            >
              {businessName}
            </Text>
            <Text style={[S.guideTypeSpecimenCaption, { fontFamily: specimen.pdfFamily }]}>Aa Bb Cc 123</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/**
 * Folio 02a swatch row — a single row of equally-sized blocks, each
 * showing the friendly color name (display, top, primary) and uppercase hex
 * (secondary) stacked at the top. See OUTPUT_TRANSLATION_SPEC §10A.12.
 */
function GuideEqualSwatchRow({
  styles: S,
  swatches,
}: {
  styles: CoreKitPdfStyles
  swatches: Array<{ hex: string; name: string }>
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch' }} wrap={false}>
      {swatches.map((swatch, idx) => {
        const tc = onColor(swatch.hex)
        return (
          <View
            key={`${swatch.hex}-${idx}`}
            style={{
              backgroundColor: swatch.hex,
              flex: 1,
              minHeight: landscapeLayoutV(264),
              paddingTop: 16,
              paddingBottom: 14,
              paddingHorizontal: 14,
              marginRight: idx === swatches.length - 1 ? 0 : 6,
              borderRadius: 6,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideEqualSwatchName, { color: tc }]}>
              {swatch.name}
            </Text>
            <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideEqualSwatchHex, { color: tc }]}>
              {swatch.hex.toUpperCase()}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/**
 * Folio 02b wordmark color blocks — the brand name rendered in three
 * palette color combinations chosen by WCAG contrast ratio. The middle
 * slot carries the highest-contrast pair so the reader's eye lands on
 * the strongest legibility example first. Brand-name sample text is the
 * only copy in each block; hex captions sit underneath.
 */
function GuideWordmarkColorBlocks({
  styles: S,
  pdfFamily,
  businessName,
  blocks,
  variant = 'row',
}: {
  styles: CoreKitPdfStyles
  pdfFamily: string
  businessName: string
  blocks: Array<{ background: string; foreground: string; contrastRatio: number }>
  /** `column`: three blocks stacked for split typography layout (02b). */
  variant?: 'row' | 'column'
}) {
  const blockMinH = landscapeLayoutV(132)
  const wordmarkTextStyle = {
    fontFamily: pdfFamily,
    fontSize: 22,
    lineHeight: 1.1,
    textAlign: 'center' as const,
  }

  if (variant === 'column') {
    const rowMinH = landscapeLayoutV(122)
    return (
      <View style={{ flexDirection: 'column', width: '100%' }} wrap={false}>
        {blocks.map((block, idx) => (
          <View
            key={`${block.background}-${block.foreground}-${idx}`}
            style={[S.guideWordmarkColumnBlockFull, { backgroundColor: block.background, minHeight: rowMinH }]}
            wrap={false}
          >
            <Text
              hyphenationCallback={wholeWordHyphenation}
              style={[wordmarkTextStyle, { fontSize: 18, color: block.foreground }]}
            >
              {businessName}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  return (
    <View style={{ flexDirection: 'column' }} wrap={false}>
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
        {blocks.map((block, idx) => (
          <View
            key={`${block.background}-${block.foreground}-${idx}`}
            style={{
              backgroundColor: block.background,
              flex: 1,
              minHeight: blockMinH,
              paddingVertical: 18,
              paddingHorizontal: 12,
              marginRight: idx === blocks.length - 1 ? 0 : 6,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text hyphenationCallback={wholeWordHyphenation} style={[wordmarkTextStyle, { color: block.foreground }]}>
              {businessName}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 6 }}>
        {blocks.map((block, idx) => (
          <View
            key={`caption-${block.background}-${block.foreground}-${idx}`}
            style={{ flex: 1, marginRight: idx === blocks.length - 1 ? 0 : 6 }}
          >
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
              {block.foreground.toUpperCase()} on {block.background.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/**
 * Folio 02b typeface specimen — `row`: narrow centered pair for legacy layouts.
 * `stack`: split-page duo — two **columns** (one face each), both **left-aligned**,
 * editorial sizes. Does not use the brand name; see OUTPUT_TRANSLATION_SPEC §10A.12.
 */
function GuideTypefaceSpecimen({
  styles: S,
  faces,
  variant = 'row',
}: {
  styles: CoreKitPdfStyles
  faces: Array<{
    faceLabel: string
    pdfFamily: string
    roleEyebrow: string
  }>
  /** `stack`: two columns on folio 02b split (side-by-side typefaces, both left-aligned). */
  variant?: 'row' | 'stack'
}) {
  const isStack = variant === 'stack'
  return (
    <View style={isStack ? S.guideTypeSpecimenDuoRow : S.guideTypeSpecimenRowNarrow}>
      {faces.map((face, idx) => (
        <View
          key={`${face.faceLabel}-${idx}`}
          style={[
            isStack ? S.guideTypeSpecimenTileDuo : S.guideTypeSpecimenTileNarrow,
            isStack
              ? idx === faces.length - 1
                ? { marginRight: 0 }
                : {}
              : idx === faces.length - 1
                ? { marginRight: 0 }
                : {},
          ]}
          wrap={false}
        >
          <Text
            style={[
              isStack ? S.guideTypeSpecimenStackEyebrow : S.guideMiniHeader,
              isStack ? { textAlign: 'left', width: '100%' } : {},
            ]}
          >
            {face.roleEyebrow.toUpperCase()}
          </Text>
          <Text
            hyphenationCallback={wholeWordHyphenation}
            style={[
              isStack ? S.guideTypeSpecimenStackFace : S.guideTypeSpecimenFaceLead,
              { fontFamily: face.pdfFamily },
              isStack ? { textAlign: 'left', width: '100%' } : {},
            ]}
          >
            {face.faceLabel}
          </Text>
          <View style={[S.guideTypeSpecimenWeightLadder, isStack && { marginTop: 4 }]}>
            {typefaceSpecimenLadderForPdfFamily(face.pdfFamily).map((row) => (
              <Text
                key={`${face.faceLabel}-${row.label}`}
                style={[
                  isStack ? S.guideTypeSpecimenStackLadderLabel : S.guideTypeSpecimenWeightLadderLabel,
                  isStack ? { textAlign: 'left' } : {},
                  {
                    fontFamily: face.pdfFamily,
                    fontWeight: row.fontWeight,
                    fontStyle: row.fontStyle,
                  },
                ]}
              >
                {row.label}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function GuideSpreadPage({
  styles: S,
  businessName,
  activeSection,
  folio,
  title,
  deck,
  navItems,
  children,
}: {
  styles: CoreKitPdfStyles
  businessName: string
  activeSection: GuideSectionId
  folio: string
  title: string
  deck?: string
  navItems: Array<{ id: GuideSectionId; label: string }>
  children: ReactNode
}) {
  return (
    <Page size={LANDSCAPE_PDF_SIZE} style={S.guideLandscapePage}>
      <GuideTopChrome styles={S} businessName={businessName} activeSection={activeSection} navItems={navItems} />
      <View style={S.guideSpread}>
        <GuideSpreadHeader styles={S} folio={folio} title={title} deck={deck} />
        {children}
      </View>
      <GuideMinimalFooter styles={S} businessName={businessName} />
    </Page>
  )
}

function HeroRailSpread({
  styles: S,
  hero,
  rail,
  footer,
}: {
  styles: CoreKitPdfStyles
  hero: ReactNode
  rail: ReactNode
  footer?: ReactNode
}) {
  return (
    <View style={S.guideHeroRailRoot}>
      <View style={S.guideTemplateHeroRail}>
        <View style={S.guideTemplateHeroMain}>{hero}</View>
        <View style={S.guideColumnGap} />
        <View style={S.guideTemplateHeroRailCol}>{rail}</View>
      </View>
      {footer ? (
        <View style={S.guideTemplateBottomRow}>
          <View style={S.guideTemplateBottomMain}>{footer}</View>
        </View>
      ) : null}
    </View>
  )
}

function ReferenceGridSpread({
  styles: S,
  lead,
  primary,
  secondary,
  tertiary,
}: {
  styles: CoreKitPdfStyles
  lead: ReactNode
  primary: ReactNode
  secondary: ReactNode
  tertiary: ReactNode
}) {
  return (
    <View style={S.guideReferenceGrid}>
      <View style={S.guideReferenceLead}>{lead}</View>
      <View style={S.guideColumnGap} />
      <View style={S.guideReferenceMain}>{primary}</View>
      <View style={S.guideColumnGap} />
      <View style={S.guideReferenceSide}>
        {secondary}
        <View style={S.guidePanelStackGap} />
        {tertiary}
      </View>
    </View>
  )
}

function ShowcaseSpread({
  styles: S,
  showcase,
  sideTop,
  sideBottom,
}: {
  styles: CoreKitPdfStyles
  showcase: ReactNode
  sideTop: ReactNode
  sideBottom: ReactNode
}) {
  return (
    <View style={S.guideExamplesLayout}>
      <View style={S.guideExamplesHeroCol}>{showcase}</View>
      <View style={S.guideColumnGap} />
      <View style={[S.guidePanelStack, S.guideExamplesSideCol]}>
        {sideTop}
        <View style={S.guidePanelStackGap} />
        {sideBottom}
      </View>
    </View>
  )
}

function VisualBoardSpread({
  styles: S,
  anchor,
  supportA,
  supportB,
  supportC,
}: {
  styles: CoreKitPdfStyles
  anchor: ReactNode
  supportA: ReactNode
  supportB: ReactNode
  supportC: ReactNode
}) {
  return (
    <>
      <View style={S.guideVisualBoardTop}>{anchor}</View>
      <View style={S.guideVisualBoardBottom}>
        <View style={S.guideVisualBoardMain}>{supportA}</View>
        <View style={S.guideColumnGap} />
        <View style={S.guideVisualBoardSide}>
          {supportB}
          <View style={S.guidePanelStackGap} />
          {supportC}
        </View>
      </View>
    </>
  )
}

function SectionTitleRow({
  styles: S,
  heading,
  color,
  titleVariant,
}: {
  styles: CoreKitPdfStyles
  heading: string
  color: string
  titleVariant: 'band' | 'quiet'
}) {
  if (titleVariant === 'quiet') {
    return (
      <View style={S.guideQuietTitleRow}>
        <Text style={S.guideQuietTitle}>{heading.toUpperCase()}</Text>
      </View>
    )
  }
  const textColor = onColor(color)
  return (
    <View style={[S.sectionBand, { backgroundColor: color }]}>
      <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
    </View>
  )
}

function SectionBodyShell({
  styles: S,
  titleVariant,
  children,
}: {
  styles: CoreKitPdfStyles
  titleVariant: 'band' | 'quiet'
  children: ReactNode
}) {
  return <View style={titleVariant === 'quiet' ? S.guideQuietBody : S.sectionBody}>{children}</View>
}

function SectionBlock({
  styles: S,
  heading,
  body,
  color,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  titleVariant?: 'band' | 'quiet'
}) {
  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        <Text style={S.sectionBodyText}>{body}</Text>
      </SectionBodyShell>
    </View>
  )
}

function wordmarkExplorationHeroIndex(tiles: WordmarkExplorationTile[]): number {
  const stackedIdx = tiles.findIndex((t) => t.kind === 'stacked')
  if (stackedIdx >= 0) return stackedIdx
  const weight = (t: WordmarkExplorationTile) =>
    t.kind === 'stacked' ? t.top.length + t.bottom.length + 4 : t.text.length
  return tiles.reduce((best, t, i) => (weight(t) > weight(tiles[best]) ? i : best), 0)
}

function WordmarkExplorationStrip({
  styles: S,
  pdfFamily,
  palette,
  tiles,
}: {
  styles: CoreKitPdfStyles
  pdfFamily: string
  palette: string
  tiles: WordmarkExplorationTile[]
}) {
  const swatches = getSwatches(palette)
  const s0 = swatches[0] ?? BRAND.black
  const s1 = swatches[1] ?? s0
  const darkBg = [s0, s1, swatches[2] ?? s0].find((h) => isDark(h)) ?? '#111111'
  const softSurface = accentTintRgba(swatches[3] ?? '#F4F4F5', 0.28)
  const fgSoft = readableOnWhite(s0)
  const fgAlt = readableOnWhite(s1)
  const fgInvert = onColor(darkBg)
  const captionInvert = 'rgba(255,255,255,0.72)'

  const skin = (v: 0 | 1 | 2) => {
    const inverted = v === 2
    return {
      tileBg: inverted ? darkBg : v === 0 ? softSurface : '#FFFFFF',
      fg: inverted ? fgInvert : v === 0 ? fgSoft : fgAlt,
      capColor: inverted ? captionInvert : undefined,
      borderColor: inverted ? darkBg : '#E4E4E7',
      borderW: inverted ? 0 : 1,
    }
  }

  const renderTile = (tile: WordmarkExplorationTile, v: 0 | 1 | 2, layout: 'compact' | 'wide') => {
    const sk = skin(v)
    const compact = layout === 'compact'
    const layoutClass = compact ? S.visualDirCollageTileCompact : S.visualDirCollageTileWide

    return (
      <View
        key={`mosaic-${v}-${tile.caption}-${layout}`}
        style={[
          S.visualDirCollageTile,
          layoutClass,
          {
            backgroundColor: sk.tileBg,
            borderTopWidth: sk.borderW,
            borderRightWidth: sk.borderW,
            borderBottomWidth: sk.borderW,
            borderLeftWidth: sk.borderW,
            borderColor: sk.borderColor,
          },
        ]}
      >
        <View style={S.visualDirCollageTileInner}>
          {tile.kind === 'single' ? (
            <Text
              hyphenationCallback={wholeWordHyphenation}
              style={{
                fontFamily: pdfFamily,
                fontSize:
                  compact && tile.text.length <= 2 ? Math.min(tile.fontSize, 23) : tile.fontSize,
                fontWeight: tile.fontWeight ?? 400,
                letterSpacing: tile.letterSpacing ?? 0,
                color: sk.fg,
                textAlign: 'center',
              }}
            >
              {tile.text}
            </Text>
          ) : (
            <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text
                  hyphenationCallback={wholeWordHyphenation}
                  style={{
                    fontFamily: pdfFamily,
                    fontSize: tile.topSize,
                    fontWeight: 400,
                    color: sk.fg,
                    lineHeight: 1.08,
                    textAlign: 'center',
                  }}
                >
                  {tile.top}
                </Text>
                <Text
                  hyphenationCallback={wholeWordHyphenation}
                  style={{
                    fontFamily: pdfFamily,
                    fontSize: tile.bottomDisplaySize,
                    fontWeight: 700,
                    letterSpacing: tile.bottomLetterSpacing ?? 0,
                    color: sk.fg,
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  {tile.bottom}
                </Text>
              </View>
            </View>
          )}
        </View>
        <Text
          hyphenationCallback={wholeWordHyphenation}
          style={[S.visualDirCollageTileCaption, sk.capColor ? { color: sk.capColor } : {}]}
        >
          {tile.caption.toUpperCase()}
        </Text>
      </View>
    )
  }

  const heroIdx = wordmarkExplorationHeroIndex(tiles)
  const heroFirst = heroIdx === 0
  const pairOrder = ([0, 1, 2].filter((i) => i !== heroIdx) as (0 | 1 | 2)[]).sort((a, b) => a - b)

  const pairRow = () => (
    <View style={S.visualDirCollagePairRow}>
      {pairOrder.map((idx, j) => (
        <View
          key={`pair-${idx}`}
          style={j === 0 ? { flex: 1, minWidth: 0, marginRight: 5 } : { flex: 1, minWidth: 0 }}
        >
          {renderTile(tiles[idx], idx, 'compact')}
        </View>
      ))}
    </View>
  )

  const mosaicBody = heroFirst ? (
    <View style={S.visualDirCollageMosaicColumn}>
      {renderTile(tiles[heroIdx], heroIdx as 0 | 1 | 2, 'wide')}
      <View style={S.visualDirCollageRowSpacer} />
      {pairRow()}
    </View>
  ) : (
    <View style={S.visualDirCollageMosaicColumn}>
      {pairRow()}
      <View style={S.visualDirCollageRowSpacer} />
      {renderTile(tiles[heroIdx], heroIdx as 0 | 1 | 2, 'wide')}
    </View>
  )

  return (
    <View style={S.visualDirCollageWrap}>
      <View style={S.visualDirCollageMosaic}>{mosaicBody}</View>
      <Text style={S.visualDirCollageEyebrow}>TYPE EXAMPLES — NOT A FINAL LOGO</Text>
    </View>
  )
}

/**
 * Visual direction uses three distinct paragraphs (style summary, voice-visual bridge, logo note).
 * Splitting them and giving each a distinct visual weight makes the section skimmable — a reader
 * can absorb the style cue in one pass rather than reading through a prose wall.
 */
function VisualDirectionBlock({
  styles: S,
  heading,
  body,
  color,
  form,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  form: IdentityKitForm
}) {
  const textColor = onColor(color)
  const [stylePara, bridgePara, logoPara] = body.split('\n\n')
  const slots = typographySpecimenSlots(form)
  const pdfFamily = slots[0]?.pdfFamily ?? getKitPdfFontFamilies(form).displayFamily
  const businessName = form.step1.businessName.trim() || 'Your business name'
  const wordmarkTiles = computeWordmarkExplorationTiles(businessName)

  return (
    <View>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {stylePara ? (
          <Text style={[S.sectionBodyText, { fontWeight: 400 }]}>{stylePara}</Text>
        ) : null}
        {bridgePara ? (
          <Text style={[S.sectionBodyText, { marginTop: 8 }]}>{bridgePara}</Text>
        ) : null}
        {logoPara ? (
          <View style={S.visualDirLogoRow}>
            <WordmarkExplorationStrip
              styles={S}
              pdfFamily={pdfFamily}
              palette={form.step6.selectedPalette}
              tiles={wordmarkTiles}
            />
            <View style={S.visualDirLogoTextCol}>
              <Text style={[S.sectionBodyText, { fontStyle: 'italic', opacity: 0.75 }]}>{logoPara}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  )
}

function specimenWeightStyles(pdfFamily: string): { regular: Style; bold: Style; italic: Style } {
  const color = BRAND.black
  /** Stepped sizes: business name reads as a kit ladder (regular largest → bold → italic). */
  return {
    regular: { fontFamily: pdfFamily, fontWeight: 400, fontSize: 21, lineHeight: 1.08, color },
    bold: { fontFamily: pdfFamily, fontWeight: 700, fontSize: 17, lineHeight: 1.08, color },
    italic: { fontFamily: pdfFamily, fontWeight: 400, fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.08, color },
  }
}

/** Weight ladder: sample line with caption below (reads as a type specimen, not a table). */
function SpecimenWeightStack({
  styles: S,
  businessName,
  regularStyle,
  boldStyle,
  italicStyle,
}: {
  styles: CoreKitPdfStyles
  businessName: string
  regularStyle: Style
  boldStyle: Style
  italicStyle: Style
}) {
  const rows: { label: string; style: Style }[] = [
    { label: 'Regular', style: regularStyle },
    { label: 'Bold', style: boldStyle },
    { label: 'Italic', style: italicStyle },
  ]
  return (
    <View style={S.specimenWeightStack}>
      {rows.map((row) => (
        <View key={row.label} style={S.specimenWeightSampleBlock} wrap={false}>
          <Text hyphenationCallback={wholeWordHyphenation} style={row.style}>
            {businessName}
          </Text>
          <Text style={S.specimenWeightCaption}>{row.label.toUpperCase()}</Text>
        </View>
      ))}
    </View>
  )
}

function RecipeTypeSpecimen({
  styles: S,
  pdfFamily,
  roleEyebrow,
  faceLabel,
  businessName,
  wordmarkNoteAfterWeights,
  accentColor,
}: {
  styles: CoreKitPdfStyles
  pdfFamily: string
  roleEyebrow: string
  faceLabel: string
  businessName: string
  wordmarkNoteAfterWeights?: string
  accentColor: string
}) {
  const weights = specimenWeightStyles(pdfFamily)
  const faceLabelStyle = {
    fontSize: 15,
    fontFamily: pdfFamily,
    fontWeight: 700,
    color: BRAND.black,
    letterSpacing: 0.2,
  }
  return (
    <View>
      <View style={[S.specimenHeaderBand, { backgroundColor: accentTintRgba(accentColor) }]}>
        <Text style={S.specimenRoleEyebrowInBand}>{roleEyebrow}</Text>
      </View>
      <View style={S.specimenFaceLabelBlock}>
        <Text hyphenationCallback={wholeWordHyphenation} style={faceLabelStyle}>
          {faceLabel}
        </Text>
      </View>
      <SpecimenWeightStack
        styles={S}
        businessName={businessName}
        regularStyle={weights.regular}
        boldStyle={weights.bold}
        italicStyle={weights.italic}
      />
      {wordmarkNoteAfterWeights ? (
        <Text hyphenationCallback={wholeWordHyphenation} style={S.specimenWordmarkNote}>
          {wordmarkNoteAfterWeights}
        </Text>
      ) : null}
    </View>
  )
}

function TypographySpecimens({
  styles: S,
  form,
  accentColor,
}: {
  styles: CoreKitPdfStyles
  form: IdentityKitForm
  accentColor: string
}) {
  const businessName = form.step1.businessName.trim() || 'Your business name'
  const slots = typographySpecimenSlots(form)
  const showExistingNote = typographyHonorsExistingTypeface(form)
  const existing = form.step6.existingTypeface?.trim()
  return (
    <View style={S.typographySpecimenStack}>
      <View style={S.typographySpecimenRow}>
        {slots.map((slot, i) => (
          <View
            key={`${slot.pdfFamily}-${i}`}
            style={[
              S.typographySpecimenColumn,
              i === 0 ? S.typographySpecimenColumnFirst : S.typographySpecimenColumnSecond,
            ]}
          >
            <RecipeTypeSpecimen
              styles={S}
              pdfFamily={slot.pdfFamily}
              roleEyebrow={slot.roleEyebrow}
              faceLabel={slot.faceLabel}
              businessName={businessName}
              wordmarkNoteAfterWeights={slot.wordmarkNoteAfterWeights}
              accentColor={accentColor}
            />
          </View>
        ))}
      </View>
      {showExistingNote && existing ? (
        <Text style={S.specimenExistingNote}>
          You noted an existing typeface: {existing}. Samples use kit embed fonts; apply your licensed files in
          production.
        </Text>
      ) : null}
    </View>
  )
}

function TypographyDownloadsBox({
  styles: S,
  items,
  disclaimer,
}: {
  styles: CoreKitPdfStyles
  items: { label: string; href: string }[]
  disclaimer: string
}) {
  return (
    <View wrap={false} style={S.typographyDownloadsBox}>
      <Text style={S.typographyDownloadsBoxTitle}>DOWNLOADS</Text>
      <View style={S.typographyDownloadsLinksRow}>
        {items.map((item, i) => (
          <View
            key={item.label}
            style={[S.typographyDownloadCol, i === 0 ? S.typographyDownloadColFirst : S.typographyDownloadColSecond]}
          >
            <Text style={S.typographyDownloadColLabel}>{item.label}</Text>
            <Link src={item.href} style={S.typographyDownloadColLink}>
              {item.href.replace('https://', '')}
            </Link>
          </View>
        ))}
      </View>
      <View style={S.typographyDisclaimerRow}>
        <Text style={S.typographyDisclaimerTextItalic}>{disclaimer}</Text>
      </View>
    </View>
  )
}

function TypographySectionBlock({
  styles: S,
  heading,
  body: _body,
  color,
  form,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  form: IdentityKitForm
}) {
  const textColor = onColor(color)
  const lead = typographySectionLead(form)
  const { licensing, leadParagraphs, trailParagraphs } = typographyFooterParts(form)
  const leadBodyText = leadParagraphs.join('\n\n').trim()
  const trailBodyText = trailParagraphs.join('\n\n').trim()
  const downloadItems = typographyDownloadLinks(form)
  return (
    <View>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.typographySectionLead}>{lead}</Text>
        <TypographySpecimens styles={S} form={form} accentColor={color} />
        {leadBodyText ? <Text style={[S.sectionBodyText, { marginBottom: 10 }]}>{leadBodyText}</Text> : null}
        <TypographyDownloadsBox styles={S} items={downloadItems} disclaimer={licensing} />
        {trailBodyText ? <Text style={S.sectionBodyText}>{trailBodyText}</Text> : null}
      </View>
    </View>
  )
}

function PaletteSectionBlock({
  styles: S,
  heading,
  body,
  color,
  palette,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  palette: string
  titleVariant?: 'band' | 'quiet'
}) {
  const swatches = paletteSwatchColors[palette] ?? []
  const meta = PALETTE_SWATCH_META[palette] ?? DEFAULT_SWATCH_META
  const colorRoles = paletteColorRolesParagraph(palette)
  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        <View style={S.paletteTwoCol}>
          {/* Left: role guidance + mood description */}
          <View style={S.paletteTextCol}>
            <Text style={S.sectionBodyText}>{colorRoles}</Text>
            {body ? (
              <Text style={[S.sectionBodyText, { marginTop: 10 }]}>{body}</Text>
            ) : null}
          </View>
          {/* Right: variable-width swatches that fill the row height */}
          {swatches.length > 0 ? (
            <View style={S.paletteSwatchCol}>
              {swatches.map((hex, i) => {
                const m = meta[i] ?? DEFAULT_SWATCH_META[i] ?? { role: 'Color', flex: 2 }
                const tc = onColor(hex)
                return (
                  <View
                    key={`${palette}-${i}-${hex}`}
                    style={[
                      S.paletteSwatchTile,
                      { flex: m.flex, backgroundColor: hex },
                      i === 0 ? { marginLeft: 0 } : {},
                    ]}
                  >
                    <Text style={[S.paletteSwatchRoleLabel, { color: tc }]}>
                      {m.role.toUpperCase()}
                    </Text>
                    <Text style={[S.paletteSwatchHexLabel, { color: tc }]}>
                      {hex.toUpperCase()}
                    </Text>
                  </View>
                )
              })}
            </View>
          ) : null}
        </View>
      </SectionBodyShell>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/** Splits a do/avoid body string (✓ … / ✗ …, separated by blank line) into two arrays. */
function parseDoAvoid(body: string): { dos: string[]; donts: string[] } {
  const dos: string[] = []
  const donts: string[] = []
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (t.startsWith('✓ ')) dos.push(t.slice(2))
    else if (t.startsWith('✗ ')) donts.push(t.slice(2))
  }
  return { dos, donts }
}

/** Splits a bullet body (• …) into groups; blank lines delimit groups. */
function parseBulletGroups(body: string): string[][] {
  const groups: string[][] = []
  let current: string[] = []
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (t === '') {
      if (current.length > 0) { groups.push(current); current = [] }
    } else if (t.startsWith('• ')) {
      current.push(t.slice(2))
    } else {
      current.push(t)
    }
  }
  if (current.length > 0) groups.push(current)
  return groups
}

/**
 * Parses the Before/After body produced by voicePlaybookBeforeAfterBody.
 * Returns an array of {label, before, after} groups.
 */
function parseBeforeAfter(body: string): { label: string; before: string; after: string }[] {
  const paragraphs = body.split('\n\n')
  const result: { label: string; before: string; after: string }[] = []
  let i = 0
  while (i < paragraphs.length) {
    const block = paragraphs[i]!
    const lines = block.split('\n')
    if (lines.length >= 3) {
      const label = lines[0] ?? ''
      const beforeLine = lines[1] ?? ''
      const afterLine = lines[2] ?? ''
      const before = beforeLine.replace(/^Before:\s*"?/, '').replace(/"$/, '')
      const after = afterLine.replace(/^After:\s*"?/, '').replace(/"$/, '')
      result.push({ label, before, after })
    } else if (lines.length === 1 && lines[0]) {
      // Single label line — next paragraph has the before/after
      const label = lines[0]
      const nextBlock = paragraphs[i + 1] ?? ''
      const nextLines = nextBlock.split('\n')
      const beforeLine = nextLines[0] ?? ''
      const afterLine = nextLines[1] ?? ''
      const before = beforeLine.replace(/^Before:\s*"?/, '').replace(/"$/, '')
      const after = afterLine.replace(/^After:\s*"?/, '').replace(/"$/, '')
      result.push({ label, before, after })
      i++
    }
    i++
  }
  return result
}

/** Converts a 0–100 slider value to a short descriptor for tone chips. */
function sliderChipLabel(value: number, low: string, mid: string, high: string): string {
  if (value <= 33) return low
  if (value <= 66) return mid
  return high
}

// ---------------------------------------------------------------------------
// New visual components
// ---------------------------------------------------------------------------

/**
 * Do / Avoid: stacked rows — large Source Serif anchor word in kit home color,
 * items flow beside (Brand Alchemy editorial + utility split).
 */
function TwoColDoAvoidBlock({
  styles: S,
  heading,
  body,
  color,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  titleVariant?: 'band' | 'quiet'
}) {
  const { dos, donts } = parseDoAvoid(body)
  const doColor = '#166534'
  const dontColor = '#991B1B'

  const renderRow = (word: string, items: string[], symbol: string, symColor: string) => (
    <View style={S.doAvoidRow} wrap={false}>
      <View style={S.doAvoidWordCol}>
        <Text style={[S.doAvoidWordDisplay, { color }]}>{word}</Text>
      </View>
      <View style={S.doAvoidItemsCol}>
        {items.map((item, i) => (
          <View key={i} style={S.doAvoidItem}>
            <Text style={[S.doAvoidSymbol, { color: symColor }]}>{symbol}</Text>
            <Text style={S.doAvoidItemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        <View style={S.doAvoidStack}>
          {renderRow('Do', dos, '✓', doColor)}
          {renderRow('Avoid', donts, '✗', dontColor)}
        </View>
      </SectionBodyShell>
    </View>
  )
}

/**
 * Quick Start week block: week number + first intro line as nested inline Text (then remaining intro + ☐ items).
 * Body format: "intro text\n\noptional second intro\n\n☐ item1\n☐ item2…"
 */
function WeekChecklistBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  const textColor = onColor(color)
  const weekMatch = heading.match(/\d+/)
  const weekNum = weekMatch ? String(parseInt(weekMatch[0])).padStart(2, '0') : '01'

  // Split into segments by double newline
  const segments = body.split('\n\n')
  const checklistSegIdx = segments.findIndex((s) => s.trim().startsWith('☐'))
  const introSegments = checklistSegIdx > 0 ? segments.slice(0, checklistSegIdx) : segments.slice(0, -1)
  const checklistSeg = checklistSegIdx >= 0 ? segments[checklistSegIdx] : segments[segments.length - 1] ?? ''

  const introText = introSegments.join('\n\n').trim()
  const items = checklistSeg
    .split('\n')
    .map((l) => l.trim().replace(/^☐\s*/, ''))
    .filter(Boolean)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.weekHeader}>
          <Text style={[S.weekNumText, { color: readableOnWhite(color) }]}>{weekNum}</Text>
          {introText ? (
            <Text style={S.weekBadgeLabel}>{`  ${introText.split('\n')[0]}`}</Text>
          ) : null}
        </Text>
        {introText.split('\n').slice(1).join('\n').trim() ? (
          <Text style={[S.weekIntro, { marginBottom: 8 }]}>
            {introText.split('\n').slice(1).join('\n').trim()}
          </Text>
        ) : null}
        {items.map((item, i) => (
          <View key={i} style={S.checklistItem}>
            <View style={S.checklistBox} />
            <Text style={S.checklistText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/**
 * Styled bullet list body (no section band). Parses "• item" lines; blank lines create group breaks.
 * Groups after the first get a small separator. If a group starts with a non-bullet line,
 * it's treated as a group label (used in Messaging themes for "Industry vocabulary").
 */
function StyledBulletGroupsBody({ styles: S, body }: { styles: CoreKitPdfStyles; body: string }) {
  const groups = parseBulletGroups(body)

  return (
    <>
      {groups.map((group, gi) => {
        const rawLines = body.split('\n\n')[gi]?.split('\n') ?? []
        const firstIsLabel = rawLines[0] && !rawLines[0].trim().startsWith('• ')
        const labelText = firstIsLabel ? group[0] : null
        const items = firstIsLabel ? group.slice(1) : group

        return (
          <View key={gi}>
            {gi > 0 ? <View style={S.bulletGroupSpacer} /> : null}
            {labelText ? (
              <Text style={S.bulletGroupLabel}>{labelText.toUpperCase()}</Text>
            ) : null}
            {items.map((item, ii) => (
              <View key={ii} style={S.bulletRow}>
                <View style={S.bulletNumWrap}>
                  <Text style={S.bulletNum}>{String(ii + 1).padStart(2, '0')}</Text>
                </View>
                <Text style={S.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        )
      })}
    </>
  )
}

function StyledBulletBlock({
  styles: S,
  heading,
  body,
  color,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  titleVariant?: 'band' | 'quiet'
}) {
  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        <StyledBulletGroupsBody styles={S} body={body} />
      </SectionBodyShell>
    </View>
  )
}

/** Messaging themes: prose framing (not uppercased as a pseudo-label), then numbered theme lines. */
function MessagingThemesBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  const textColor = onColor(color)
  const splitIdx = body.indexOf('\n\n')
  const framing = splitIdx === -1 ? body : body.slice(0, splitIdx)
  const listBody = splitIdx === -1 ? '' : body.slice(splitIdx + 2)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={[S.sectionBodyText, { marginBottom: listBody ? 10 : 0 }]}>{framing}</Text>
        {listBody ? <StyledBulletGroupsBody styles={S} body={listBody} /> : null}
      </View>
    </View>
  )
}

function PhraseCalloutPhraseList({
  styles: S,
  phrases,
  color,
}: {
  styles: CoreKitPdfStyles
  phrases: string[]
  color: string
}) {
  return (
    <>
      {phrases.map((phrase, i) => (
        <View key={i} style={S.phraseCalloutRow}>
          <View style={[S.phraseCalloutBorder, { backgroundColor: color }]} />
          <Text style={S.phraseCalloutText}>{phrase}</Text>
        </View>
      ))}
    </>
  )
}

/**
 * Voice Playbook CTAs: bold “call to action (CTA):” + italic definition (display face),
 * then relevance copy, then numbered pattern examples (StyledBulletGroupsBody).
 */
function VoicePlaybookCtaBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  const textColor = onColor(color)
  const parts = body.split(VOICE_PLAYBOOK_CTA_BODY_SPLIT)
  if (parts.length !== 3) {
    return <SectionBlock styles={S} heading={heading} body={body} color={color} />
  }
  const [definition, relevance, examplesBody] = parts as [string, string, string]
  const defLead = 'call to action (CTA):'
  const defRest = definition.trim()

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.anchorWrap}>
        <Text style={S.voicePlaybookCtaDefinitionWrap}>
          <Text style={{ fontWeight: 700, fontStyle: 'italic' }}>{defLead} </Text>
          <Text style={{ fontWeight: 400, fontStyle: 'italic' }}>{defRest}</Text>
        </Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={[S.sectionBodyText, { fontWeight: 400 }]}>{relevance.trim()}</Text>
        <Text style={[S.bulletGroupLabel, { marginTop: 12 }]}>PATTERN EXAMPLES</Text>
        <StyledBulletGroupsBody styles={S} body={examplesBody.trim()} />
      </View>
    </View>
  )
}

/** Sample phrases: short usage note as body text, then phrase callouts. */
function SamplePhrasesBlock({
  styles: S,
  heading,
  body,
  color,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  titleVariant?: 'band' | 'quiet'
}) {
  const splitIdx = body.indexOf('\n\n')
  const intro = splitIdx === -1 ? body : body.slice(0, splitIdx)
  const bulletBody = splitIdx === -1 ? '' : body.slice(splitIdx + 2)
  const phrases = parseBulletGroups(bulletBody).flat()

  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        <Text style={[S.sectionBodyText, { marginBottom: phrases.length > 0 ? 10 : 0 }]}>{intro}</Text>
        <PhraseCalloutPhraseList styles={S} phrases={phrases} color={color} />
      </SectionBodyShell>
    </View>
  )
}

/** Before / After two-column block for Voice Playbook. */
function BeforeAfterTwoColBlock({
  styles: S,
  heading,
  body,
  color,
  titleVariant = 'band',
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  titleVariant?: 'band' | 'quiet'
}) {
  const groups = parseBeforeAfter(body)
  const afterHeaderBg = titleVariant === 'quiet' ? '#F4F4F5' : accentTintRgba(color)
  const afterHeaderTextColor = titleVariant === 'quiet' ? BRAND.subText : readableOnWhite(color)

  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant={titleVariant} />
      <SectionBodyShell styles={S} titleVariant={titleVariant}>
        {groups.map((g, i) => (
          <View key={i} style={S.beforeAfterGroup} wrap={false}>
            <Text style={S.beforeAfterGroupLabel}>{g.label.toUpperCase()}</Text>
            <View style={S.beforeAfterTwoCol}>
              <View style={S.beforeAfterColBefore}>
                <View style={[S.beforeAfterColHeaderBand, { backgroundColor: '#F4F4F5' }]}>
                  <Text style={[S.beforeAfterColHeaderText, { color: BRAND.subText }]}>BEFORE</Text>
                </View>
                <Text style={S.beforeAfterBeforeText}>{g.before}</Text>
              </View>
              <View style={S.beforeAfterColAfter}>
                <View style={[S.beforeAfterColHeaderBand, { backgroundColor: afterHeaderBg }]}>
                  <Text style={[S.beforeAfterColHeaderText, { color: afterHeaderTextColor }]}>AFTER</Text>
                </View>
                <Text style={S.beforeAfterAfterText}>{g.after}</Text>
              </View>
            </View>
          </View>
        ))}
      </SectionBodyShell>
    </View>
  )
}

/**
 * Tone profile: renders a row of descriptor chips (Energy, Warmth, etc.) derived
 * from voice sliders, then the full body paragraph below for detail.
 */
function ToneDescriptorBlock({
  styles: S,
  heading,
  body,
  color,
  form,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  form: IdentityKitForm
}) {
  const textColor = onColor(color)
  const { voiceSliders } = form.step3

  const chips: { label: string; value: string }[] = [
    {
      label: 'Energy',
      value: sliderChipLabel(voiceSliders.energy, 'Calm', 'Engaged', 'Energetic'),
    },
    {
      label: 'Warmth',
      value: sliderChipLabel(voiceSliders.warmth, 'Efficient', 'Personable', 'Warm'),
    },
    {
      label: 'Playfulness',
      value: sliderChipLabel(voiceSliders.playfulness, 'Grounded', 'Light touch', 'Playful'),
    },
    {
      label: 'Directness',
      value: sliderChipLabel(voiceSliders.directness, 'Inviting', 'Purposeful', 'Direct'),
    },
    {
      label: 'Formality',
      value: sliderChipLabel(voiceSliders.formality, 'Casual', 'Balanced', 'Polished'),
    },
  ]

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <View style={S.toneChipRow}>
          {chips.map((chip) => (
            <View key={chip.label} style={S.toneChip}>
              <Text style={S.toneChipLabel}>{chip.label.toUpperCase()}</Text>
              <Text style={S.toneChipValue}>{chip.value}</Text>
            </View>
          ))}
        </View>
        <Text style={S.sectionBodyText}>{body}</Text>
      </View>
    </View>
  )
}

/** Brand Brief — Core transformation: single editorial line in display face italic. */
function CoreTransformationBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  const textColor = onColor(color)
  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.coreTransformationText}>{body}</Text>
      </View>
    </View>
  )
}

/**
 * Brand Brief — Values: renders form.step4.values as pill tags, then mission statement.
 * Receives form for direct access; body string is kept as fallback if values empty.
 */
function BriefValuesPillsBlock({
  styles: S,
  heading,
  body,
  color,
  form,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
  form: IdentityKitForm
}) {
  const textColor = onColor(color)
  const values = form.step4.values ?? []
  const mission = form.step4.missionStatement?.trim()

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {values.length > 0 ? (
          <View style={S.valuePillRow}>
            {values.map((v) => (
              <View key={v} style={[S.valuePill, { backgroundColor: '#F4F4F5' }]}>
                <Text style={[S.valuePillText, { color: color }]}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        {mission ? (
          <Text style={[S.sectionBodyText, { marginTop: values.length > 0 ? 4 : 0 }]}>
            {mission}
          </Text>
        ) : !values.length ? (
          <Text style={S.sectionBodyText}>{body}</Text>
        ) : null}
      </View>
    </View>
  )
}

/**
 * Brand Brief structured blocks — "Brand overview", "Ideal customer",
 * "Brand story angle", "Differentiation". Parses the assembled body strings
 * into labeled key-value rows for at-a-glance readability.
 */
function BriefStructuredBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  const textColor = onColor(color)
  const rows = parseBriefRows(heading, body)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {rows.map((row, i) =>
          row.kind === 'bold' ? (
            <View key={i} style={[S.kvRow, { marginBottom: 10 }]}>
              <Text style={S.kvValueBold}>{row.value}</Text>
            </View>
          ) : row.kind === 'pills' ? (
            <View key={i} style={S.kvRow}>
              <Text style={S.kvLabel}>{row.label}</Text>
              <View style={[S.valuePillRow, S.kvPillsInline]}>
                {row.pills.map((p) => (
                  <View key={p} style={[S.valuePill, { backgroundColor: '#F4F4F5' }]}>
                    <Text style={[S.valuePillText, { color }]}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View key={i} style={S.kvRow}>
              <Text style={S.kvLabel}>{row.label}</Text>
              <Text style={S.kvValue}>{row.value}</Text>
            </View>
          ),
        )}
      </View>
    </View>
  )
}

type KvRow =
  | { kind: 'text'; label: string; value: string }
  | { kind: 'bold'; label?: string; value: string }
  | { kind: 'pills'; label: string; pills: string[] }

function parseBriefRows(heading: string, body: string): KvRow[] {
  if (heading === 'Brand overview') {
    // Format: "BusinessName — offer (Industry, Stage)."
    const dashIdx = body.indexOf(' — ')
    if (dashIdx === -1) return [{ kind: 'bold', value: body }]
    const name = body.slice(0, dashIdx).trim()
    const rest = body.slice(dashIdx + 3).trim()
    // Extract meta from parentheses
    const parenIdx = rest.lastIndexOf(' (')
    const offer = parenIdx >= 0 ? rest.slice(0, parenIdx).trim() : rest.replace(/\.$/, '').trim()
    const meta = parenIdx >= 0 ? rest.slice(parenIdx + 2).replace(/\)\.?$/, '') : ''
    const [industry, stage] = meta.split(', ')
    const rows: KvRow[] = [{ kind: 'bold', value: name }]
    if (offer) rows.push({ kind: 'text', label: 'WHAT WE DO', value: offer })
    if (industry?.trim()) rows.push({ kind: 'text', label: 'INDUSTRY', value: industry.trim() })
    if (stage?.trim()) rows.push({ kind: 'text', label: 'STAGE', value: stage.trim() })
    return rows
  }

  if (heading === 'Ideal customer') {
    // Format: "archetype. Pain points: X. Desired outcomes: Y."
    const painIdx = body.indexOf('Pain points: ')
    const outcomeIdx = body.indexOf('Desired outcomes: ')
    const archetype = painIdx > 0 ? body.slice(0, painIdx).replace(/\.\s*$/, '').trim()
      : outcomeIdx > 0 ? body.slice(0, outcomeIdx).replace(/\.\s*$/, '').trim()
      : body.replace(/\.$/, '').trim()
    const rows: KvRow[] = [{ kind: 'text', label: 'WHO THEY ARE', value: archetype }]
    if (painIdx >= 0) {
      const painEnd = outcomeIdx > painIdx ? outcomeIdx : body.length
      const pain = body.slice(painIdx + 'Pain points: '.length, painEnd).replace(/\.\s*$/, '').trim()
      if (pain) rows.push({ kind: 'text', label: 'PAIN POINTS', value: pain })
    }
    if (outcomeIdx >= 0) {
      const outcomes = body.slice(outcomeIdx + 'Desired outcomes: '.length).replace(/\.\s*$/, '').trim()
      if (outcomes) rows.push({ kind: 'text', label: 'OUTCOMES', value: outcomes })
    }
    return rows
  }

  if (heading === 'Brand story angle') {
    // Format: "OriginLabel. originSummary. motivation."
    const parts = body.split('. ').map((p) => p.trim()).filter(Boolean)
    const rows: KvRow[] = []
    if (parts[0]) rows.push({ kind: 'text', label: 'ORIGIN', value: parts[0].replace(/\.$/, '') })
    const rest = parts.slice(1).join('. ').replace(/\.$/, '').trim()
    if (rest) rows.push({ kind: 'text', label: 'THE STORY', value: rest })
    return rows
  }

  if (heading === 'Differentiation') {
    const rows: KvRow[] = []
    if (body.startsWith('Compared with ')) {
      const afterCompared = body.slice('Compared with '.length)
      const dotIdx = afterCompared.indexOf('.')
      const competitorStr = dotIdx >= 0 ? afterCompared.slice(0, dotIdx) : afterCompared
      const statement = dotIdx >= 0 ? afterCompared.slice(dotIdx + 1).trim() : ''
      const competitors = competitorStr.split(', ').map((c) => c.trim()).filter(Boolean)
      rows.push({ kind: 'pills', label: 'COMPARED WITH', pills: competitors })
      if (statement) rows.push({ kind: 'text', label: 'DIFFERENTIATOR', value: statement })
    } else {
      rows.push({ kind: 'text', label: 'DIFFERENTIATOR', value: body.replace(/\.$/, '') })
    }
    return rows
  }

  // Fallback: plain text
  return [{ kind: 'text', label: heading, value: body }]
}

function bulletBody(items: string[]): string {
  return items.map((item) => `• ${item}`).join('\n')
}

function doAvoidBody(dos: string[], avoids: string[]): string {
  const lines = [...dos.map((item) => `Do ${item}`), ...avoids.map((item) => `Avoid ${item}`)]
  return lines.join('\n')
}

function beforeAfterBody(
  pairs: Array<{ label: string; before: string; after: string }>,
): string {
  return pairs
    .map((pair) => `${pair.label}\nBefore: ${pair.before}\nAfter: ${pair.after}`)
    .join('\n\n')
}

function GuideSummaryBlock({
  styles: S,
  color,
  focusLead,
  whatWeDo,
  whoItsFor,
  transformation,
  differentiator,
}: {
  styles: CoreKitPdfStyles
  color: string
  focusLead: string
  whatWeDo: string
  whoItsFor: string
  transformation: string
  differentiator?: string
}) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'WHAT WE DO', value: whatWeDo },
    { label: "WHO IT'S FOR", value: whoItsFor },
    { label: 'CORE SHIFT', value: transformation },
  ]
  if (differentiator) rows.push({ label: 'WHAT STANDS OUT', value: differentiator })

  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading="Brand summary" color={color} titleVariant="quiet" />
      <SectionBodyShell styles={S} titleVariant="quiet">
        <Text style={[S.sectionBodyText, { marginBottom: 10 }]}>{focusLead}</Text>
        {rows.map((row) => (
          <View key={row.label} style={S.kvRow}>
            <Text style={S.kvLabel}>{row.label}</Text>
            <Text style={S.kvValue}>{row.value}</Text>
          </View>
        ))}
      </SectionBodyShell>
    </View>
  )
}

function GuideTraitPillsBlock({
  styles: S,
  color,
  heading,
  traits,
}: {
  styles: CoreKitPdfStyles
  color: string
  heading: string
  traits: string[]
}) {
  return (
    <View wrap={false}>
      <SectionTitleRow styles={S} heading={heading} color={color} titleVariant="quiet" />
      <SectionBodyShell styles={S} titleVariant="quiet">
        <View style={S.valuePillRow}>
          {traits.map((trait) => (
            <View
              key={trait}
              style={[
                S.valuePill,
                {
                  borderWidth: 1,
                  borderColor: '#E4E4E7',
                  backgroundColor: '#FFFFFF',
                },
              ]}
            >
              <Text style={[S.valuePillText, { color: BRAND.bodyText }]}>{trait}</Text>
            </View>
          ))}
        </View>
      </SectionBodyShell>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Document exports (tier defaults to Core; Pro PDFs pass tier="pro" when added)
// ---------------------------------------------------------------------------

export function BrandBriefDocument({ form }: { form: IdentityKitForm }) {
  const S = kitPdfStyles(form)
  const color = homeColor(form.step6.selectedPalette, 'brandBrief')
  const blocks = brandBriefBlocks(form)
  const anchorBlock = blocks.find((b) => b.heading === 'Brand anchor')
  const bodyBlocks = blocks.filter((b) => b.heading !== 'Brand anchor')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          styles={S}
          activeDocId="brandBrief"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        <PageHeaderBand styles={S} docTitle="Brand Brief" businessName={form.step1.businessName} color={color} />
        {anchorBlock ? (
          <View style={S.anchorWrap}>
            <Text style={S.anchorText}>"{anchorBlock.body}"</Text>
          </View>
        ) : null}
        {bodyBlocks.map((b) =>
          b.heading === 'Values' ? (
            <BriefValuesPillsBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Core transformation' ? (
            <CoreTransformationBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Brand overview' || b.heading === 'Ideal customer' || b.heading === 'Brand story angle' || b.heading === 'Differentiation' ? (
            <BriefStructuredBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : (
            <SectionBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function StyleGuideDocument({ form }: { form: IdentityKitForm }) {
  const S = kitPdfStyles(form)
  const color = homeColor(form.step6.selectedPalette, 'styleGuide')
  const blocks = styleGuideBlocks(form)
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          styles={S}
          activeDocId="styleGuide"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        <PageHeaderBand styles={S} docTitle="Brand Style Guide" businessName={form.step1.businessName} color={color} />
        {blocks.map((b) =>
          b.heading === 'Palette' ? (
            <PaletteSectionBlock
              key={b.heading}
              styles={S}
              heading={b.heading}
              body={b.body}
              color={color}
              palette={form.step6.selectedPalette}
            />
          ) : b.heading === 'Typography' ? (
            <TypographySectionBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Do / avoid' ? (
            <TwoColDoAvoidBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Style principles' || b.heading === 'Where to apply this first' ? (
            <StyledBulletBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Visual direction' ? (
            <VisualDirectionBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} form={form} />
          ) : (
            <SectionBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function VoicePlaybookDocument({ form }: { form: IdentityKitForm }) {
  const S = kitPdfStyles(form)
  const color = homeColor(form.step6.selectedPalette, 'voicePlaybook')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          styles={S}
          activeDocId="voicePlaybook"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        <PageHeaderBand styles={S} docTitle="Voice & Content Playbook" businessName={form.step1.businessName} color={color} />
        {voicePlaybookBlocks(form).map((b) =>
          b.heading === 'Tone profile' ? (
            <ToneDescriptorBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Voice guardrails' || b.heading === 'Writing do / avoid' ? (
            <TwoColDoAvoidBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Messaging themes' ? (
            <MessagingThemesBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Sample phrases' ? (
            <SamplePhrasesBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Calls to action (CTAs)' ? (
            <VoicePlaybookCtaBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Before / after examples' ? (
            <BeforeAfterTwoColBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ) : (
            <SectionBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function QuickStartDocument({ form }: { form: IdentityKitForm }) {
  const S = kitPdfStyles(form)
  const color = homeColor(form.step6.selectedPalette, 'quickStart')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        {/* Short PDF title so header stays one line; product copy elsewhere still uses full name. */}
        <PageHeaderChrome
          styles={S}
          activeDocId="quickStart"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        <PageHeaderBand styles={S} docTitle="Quick Start Checklist" businessName={form.step1.businessName} color={color} />
        {quickStartBlocks(form).map((b) => (
          <WeekChecklistBlock key={b.heading} styles={S} heading={b.heading} body={b.body} color={color} />
        ))}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function BrandIdentityGuideDocument({ form }: { form: IdentityKitForm }) {
  const S = brandIdentityGuidePdfStyles()
  const model = buildBrandIdentityGuideModel(form)
  const businessName = form.step1.businessName
  const deckFromMeta = (editorial: { dekMode: 'full' | 'none'; deck?: string }) =>
    editorial.dekMode === 'full' ? editorial.deck : undefined
  const sampleCountFromDensity = (density: 'low' | 'medium' | 'high') =>
    density === 'high' ? 4 : density === 'medium' ? 3 : 2
  const figureTallFromOccupancy = (occupancy: 'light' | 'medium' | 'strong') => occupancy === 'strong'
  const navItems: Array<{ id: GuideSectionId; label: string }> = [
    { id: 'summary', label: model.summary.editorial.navLabel },
    { id: 'look', label: model.visual.editorial.navLabel },
    { id: 'positioning', label: model.positioning.editorial.navLabel },
    { id: 'voice', label: model.voice.editorial.navLabel },
    { id: 'examples', label: model.examples.editorial.navLabel },
  ]
  const summaryRows = [
    { label: 'What we do', value: model.summary.whatWeDo },
    { label: "Who it's for", value: model.summary.whoItsFor },
    { label: 'What changes for them', value: model.summary.transformation },
  ]

  return (
    <Document>
      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="summary"
        folio={model.summary.editorial.folio}
        title={model.summary.editorial.title}
        deck={deckFromMeta(model.summary.editorial)}
        navItems={navItems}
      >
        <HeroRailSpread
          styles={S}
          hero={
            <View style={S.guideSummaryHeroColumn}>
              <View style={S.guideHeroQuotePanel}>
                <Text hyphenationCallback={wholeWordHyphenation} style={S.guideHeroQuote}>
                  "{model.summary.oneLine || model.summary.anchor || model.summary.transformation}"
                </Text>
              </View>
            </View>
          }
          rail={
            <>
              <GuideOpenModule styles={S}>
                <View style={S.guideTraitsWrap}>
                  {model.summary.guidingTraits.map((trait) => (
                    <View key={trait} style={S.guideTraitPill}>
                      <Text hyphenationCallback={wholeWordHyphenation} style={S.guideTraitPillText}>
                        {trait}
                      </Text>
                    </View>
                  ))}
                </View>
                {model.summary.differentiator ? (
                  <>
                    <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCaptionText, { marginTop: 8 }]}>
                      {model.summary.differentiator}
                    </Text>
                  </>
                ) : null}
              </GuideOpenModule>
            </>
          }
          footer={<GuideOpenModule styles={S}><GuideFactListModule styles={S} rows={summaryRows} /></GuideOpenModule>}
        />
      </GuideSpreadPage>

      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="look"
        folio={model.visual.editorial.folio}
        title={model.visual.editorial.title}
        deck={deckFromMeta(model.visual.editorial)}
        navItems={navItems}
      >
        <GuideOpenModule styles={S}>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
            {model.visual.visualCaption}
          </Text>
          <View style={S.guideSectionGap} />
          <View style={S.guideTraitsWrap}>
            {model.visual.visualKeywords.map((trait) => (
              <View key={trait} style={S.guideTraitPill}>
                <Text hyphenationCallback={wholeWordHyphenation} style={S.guideTraitPillText}>
                  {trait}
                </Text>
              </View>
            ))}
          </View>
          {model.visual.imageryDirection ? (
            <>
              <View style={S.guideSectionGap} />
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
                {model.visual.imageryDirection}
              </Text>
            </>
          ) : null}
        </GuideOpenModule>
        <View style={S.guideVisualBoardTop}>
          <GuideOpenModule styles={S} label="Palette">
            <GuideEqualSwatchRow styles={S} swatches={model.visual.swatches} />
          </GuideOpenModule>
        </View>
      </GuideSpreadPage>

      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="look"
        folio={model.visual.typography.editorial.folio}
        title={model.visual.typography.editorial.title}
        deck={deckFromMeta(model.visual.typography.editorial)}
        navItems={navItems}
      >
        {(() => {
          const pdfFamily =
            model.visual.typography.specimens[0]?.pdfFamily ??
            getKitPdfFontFamilies(form).displayFamily
          return (
            <>
              {model.visual.typography.lead ? (
                <View style={S.guideTopDeckBlock}>
                  <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
                    {model.visual.typography.lead}
                  </Text>
                </View>
              ) : null}
              <View style={S.guideTypographySplitBand}>
                <View style={S.guideTypographySplitRow} wrap={false}>
                  <View style={S.guideTypographySplitLeft} wrap={false}>
                    <GuideOpenModule styles={S}>
                      <GuideTypefaceSpecimen
                        styles={S}
                        faces={model.visual.typography.typefaceSpecimens}
                        variant="stack"
                      />
                    </GuideOpenModule>
                  </View>
                  <View style={S.guideTypographySplitGutter} wrap={false} />
                  <View style={S.guideTypographySplitRight} wrap={false}>
                    <GuideOpenModule styles={S}>
                      <GuideWordmarkColorBlocks
                        styles={S}
                        pdfFamily={pdfFamily}
                        businessName={businessName}
                        blocks={model.visual.typography.wordmarkColorBlocks}
                        variant="column"
                      />
                    </GuideOpenModule>
                  </View>
                </View>
              </View>
            </>
          )
        })()}
      </GuideSpreadPage>

      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="positioning"
        folio={model.positioning.editorial.folio}
        title={model.positioning.editorial.title}
        deck={deckFromMeta(model.positioning.editorial)}
        navItems={navItems}
      >
        <HeroRailSpread
          styles={S}
          hero={
            <GuideOpenModule styles={S}>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                {model.positioning.focusLead}
              </Text>
              {model.positioning.storyNote ? (
                <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { marginTop: 12 }]}>
                  {model.positioning.storyNote}
                </Text>
              ) : (
                <>
                  {model.positioning.feelLine ? (
                    <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { marginTop: 12 }]}>
                      {model.positioning.feelLine}
                    </Text>
                  ) : null}
                  {model.positioning.oneLine ? (
                    <View style={[S.guideHeroQuotePanel, { marginTop: 16 }]}>
                      <Text hyphenationCallback={wholeWordHyphenation} style={S.guideHeroQuote}>"{model.positioning.oneLine}"</Text>
                    </View>
                  ) : null}
                </>
              )}
            </GuideOpenModule>
          }
          rail={
            <GuideOpenModule styles={S} label={model.positioning.trustCue.label}>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCaptionText}>
                {model.positioning.trustCue.body}
              </Text>
            </GuideOpenModule>
          }
        />
      </GuideSpreadPage>

      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="voice"
        folio={model.voice.editorial.folio}
        title={model.voice.editorial.title}
        deck={deckFromMeta(model.voice.editorial)}
        navItems={navItems}
      >
        <>
          <View style={S.guideTopDeckBlock}>
            <GuideOpenModule styles={S} label="Traits">
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideInlineTraits}>
                {model.voice.traits.join(', ')}
              </Text>
            </GuideOpenModule>
          </View>
          <View style={S.guideEditorialThreeCol}>
            <View style={S.guideEditorialCol}>
              <GuideCard styles={S} label="Rules" tintColor={GUIDE_EDITORIAL_CARD_TINT_HEX}>
                <GuideListBlock styles={S} items={model.voice.rules} />
              </GuideCard>
            </View>
            {model.voice.messagingAngles.length > 0 ? (
              <>
                <View style={S.guideEditorialRule}>
                  <View style={S.guideEditorialRuleLine} />
                </View>
                <View style={S.guideEditorialCol}>
                  <GuideOpenModule styles={S} label="What to talk about">
                    <GuideListBlock styles={S} items={model.voice.messagingAngles} />
                  </GuideOpenModule>
                </View>
              </>
            ) : null}
          </View>
          <View style={S.guideVoiceBottomBand} wrap={false}>
            <GuideOpenModule styles={S} label={model.voice.bottomBand.title}>
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                {model.voice.bottomBand.body}
              </Text>
            </GuideOpenModule>
          </View>
        </>
      </GuideSpreadPage>

      <GuideSpreadPage
        styles={S}
        businessName={businessName}
        activeSection="examples"
        folio={model.examples.editorial.folio}
        title={model.examples.editorial.title}
        deck={deckFromMeta(model.examples.editorial)}
        navItems={navItems}
      >
        <>
          <GuideOpenModule styles={S} label="Sample lines">
            <GuideSampleRow
              styles={S}
              items={model.examples.samplePhrases
                .slice(0, sampleCountFromDensity(model.examples.editorial.exampleDensity))
                .map((phrase) => ({ headline: phrase }))}
            />
          </GuideOpenModule>
          {model.examples.ctaTemplates.length > 0 ? (
            <View style={{ marginTop: 16 }}>
              <GuideOpenModule styles={S} label="Calls to action">
                <GuideListBlock styles={S} items={model.examples.ctaTemplates} />
              </GuideOpenModule>
            </View>
          ) : null}
          <View style={[S.guideTwoColTopHeavy, { marginTop: 16 }]}>
            <View style={S.guideTwoColMain}>
              {model.examples.beforeAfter.length > 0 ? (
                <GuideCard styles={S} tintColor={GUIDE_EDITORIAL_CARD_TINT_HEX}>
                  <GuideBeforeAfterPanel styles={S} pairs={model.examples.beforeAfter} />
                </GuideCard>
              ) : null}
            </View>
            <View style={S.guideColumnGap} />
            <View style={S.guideTwoColRail}>
              <GuideOpenModule styles={S} label="Do / avoid">
                <GuideDoAvoidPanel styles={S} dos={model.examples.doLines} avoids={model.examples.avoidLines} />
              </GuideOpenModule>
            </View>
          </View>
        </>
      </GuideSpreadPage>

    </Document>
  )
}

/** Parent brand surfaces + type (sync with apps/web/src/brand-tokens.css) */
const redoDummyBrand = {
  page: '#FFFFFF',
  ink: '#1E2530',
  body: '#3D4654',
  muted: '#6D7A8A',
  subtle: '#8E99A8',
  border: '#D2DAE4',
  borderHair: '#E8ECF1',
  surface: '#F4F6F9',
  accent: '#111111',
} as const

const redoDummyStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: redoDummyBrand.page,
    color: redoDummyBrand.ink,
    fontFamily: 'Helvetica',
    /* Leave enough room for fixed header/footer so body text does not sit underneath chrome */
    paddingTop: landscapeLayoutV(62),
    paddingBottom: landscapeLayoutV(44),
    paddingHorizontal: 32,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 32,
    backgroundColor: redoDummyBrand.page,
    borderBottomWidth: 0.5,
    borderBottomColor: redoDummyBrand.border,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 12,
  },
  topNavItem: {
    fontSize: 8.25,
    color: redoDummyBrand.muted,
    marginRight: 10,
    marginBottom: 3,
  },
  /** Keeps in-doc links visually identical to plain nav text (no underline / default link color). */
  topNavLink: {
    textDecoration: 'none',
    color: redoDummyBrand.muted,
  },
  topNavNumber: {
    fontFamily: 'Helvetica-Bold',
    marginRight: 2,
  },
  headerUtility: {
    fontSize: 8,
    color: redoDummyBrand.muted,
    maxWidth: 240,
    textAlign: 'right',
  },
  /** No flexGrow — avoids stretching the page body and triggering blank continuation pages in react-pdf. */
  body: {},
  /** Named destination target for in-document nav links (minimal box; @react-pdf/render). */
  sectionAnchor: {
    position: 'absolute',
    width: 2,
    height: 2,
    opacity: 0,
  },
  coverRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  coverLeft: {
    flex: 1.05,
    paddingRight: 18,
  },
  coverRight: {
    flex: 0.72,
    paddingLeft: 16,
    borderLeftWidth: 0.5,
    borderLeftColor: redoDummyBrand.border,
  },
  coverBrand: {
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 8,
    color: redoDummyBrand.muted,
  },
  coverTitle: {
    fontSize: 28,
    lineHeight: 1.12,
    fontFamily: 'Times-Bold',
    marginBottom: 8,
    color: redoDummyBrand.ink,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 10,
    color: redoDummyBrand.body,
  },
  introParagraph: {
    fontSize: 10.5,
    lineHeight: 1.55,
    marginBottom: 7,
    color: redoDummyBrand.body,
  },
  contentsHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    color: redoDummyBrand.ink,
  },
  contentsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  contentsNumber: {
    width: 24,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: redoDummyBrand.muted,
  },
  contentsTitle: {
    fontSize: 10,
    color: redoDummyBrand.ink,
  },
  chapterHeader: {
    marginBottom: 22,
  },
  chapterHeaderTitleOnly: {
    marginBottom: 14,
  },
  /** One line: large folio + display title, baseline-aligned. */
  chapterTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  /** No fixed width — avoids a dead band between folio digits and title. */
  chapterNumber: {
    fontSize: 32,
    lineHeight: 1.06,
    fontFamily: 'Helvetica-Bold',
    color: redoDummyBrand.accent,
    letterSpacing: -0.35,
    marginRight: 8,
  },
  chapterTitleTextWrap: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 32,
    lineHeight: 1.08,
    fontFamily: 'Times-Bold',
    color: redoDummyBrand.ink,
  },
  /** Chapter dek: full width under folio + title (same as body flow on Logo spread). */
  chapterIntroBlock: {
    marginTop: 14,
  },
  chapterIntro: {
    fontSize: 10.5,
    lineHeight: 1.5,
    marginBottom: 8,
    color: redoDummyBrand.body,
  },
  proseParagraph: {
    fontSize: 10.5,
    lineHeight: 1.55,
    marginBottom: 10,
    color: redoDummyBrand.body,
  },
  /** Wraps spread body — avoid minHeight/flex:1 here: react-pdf will paginate with huge empty trailing pages. */
  spreadBodyFill: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4,
  },
  twoCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  colMain: {
    flex: 1.2,
    paddingRight: 16,
  },
  colAside: {
    flex: 0.78,
    paddingLeft: 14,
    borderLeftWidth: 0.5,
    borderLeftColor: redoDummyBrand.border,
  },
  /** Decorative mat for editorial spreads (placeholder for photography). */
  editorialFigureMat: {
    borderWidth: 0.5,
    borderColor: redoDummyBrand.borderHair,
    backgroundColor: redoDummyBrand.surface,
    padding: 14,
    justifyContent: 'center',
  },
  editorialFigureMatCaption: {
    fontSize: 8,
    color: redoDummyBrand.muted,
    textAlign: 'center',
  },
  /** Strategy right rail: quote + mat (no minHeight — prevents phantom second page). */
  colAsideStack: {
    flex: 0.78,
    paddingLeft: 14,
    borderLeftWidth: 0.5,
    borderLeftColor: redoDummyBrand.border,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  colAsideArt: {
    flex: 0.78,
    paddingLeft: 14,
    borderLeftWidth: 0.5,
    borderLeftColor: redoDummyBrand.border,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  strategyQuoteBlock: {
    paddingVertical: 6,
  },
  editorialFigureMatSpaced: {
    marginTop: 14,
  },
  asideQuote: {
    fontSize: 12.5,
    lineHeight: 1.45,
    fontFamily: 'Times-Italic',
    color: redoDummyBrand.ink,
  },
  moduleHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 7,
    color: redoDummyBrand.ink,
  },
  tripletItem: {
    marginBottom: 7,
  },
  tripletLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: redoDummyBrand.muted,
    marginBottom: 2,
  },
  tripletValue: {
    fontSize: 10,
    lineHeight: 1.48,
    color: redoDummyBrand.body,
  },
  personalityTripletBlock: {
    marginBottom: 0,
  },
  personalitySampleStack: {
    marginTop: 20,
  },
  sampleCopySection: {
    borderTopWidth: 1,
    borderTopColor: redoDummyBrand.border,
    paddingTop: 14,
    marginTop: 0,
  },
  sampleCopySectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: redoDummyBrand.muted,
    marginBottom: 2,
  },
  sampleFourColumnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginHorizontal: -6,
  },
  sampleCardQuarter: {
    width: '25%',
    paddingHorizontal: 6,
  },
  sampleColumnDivider: {
    borderLeftWidth: 0.5,
    borderLeftColor: redoDummyBrand.borderHair,
  },
  sampleHeadlineQuarter: {
    fontSize: 9.75,
    lineHeight: 1.22,
    fontFamily: 'Times-Bold',
    marginBottom: 5,
    color: redoDummyBrand.ink,
  },
  sampleBodyQuarter: {
    fontSize: 8.25,
    lineHeight: 1.48,
    color: redoDummyBrand.body,
  },
  sampleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  sampleCard: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  sampleHeadline: {
    fontSize: 12,
    lineHeight: 1.2,
    fontFamily: 'Times-Bold',
    marginBottom: 4,
  },
  sampleBody: {
    fontSize: 9.5,
    lineHeight: 1.48,
  },
  logoTopRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 18,
  },
  logoNarrativeCol: {
    flex: 1.15,
    paddingRight: 12,
  },
  logoMarkCol: {
    flex: 0.85,
  },
  logoPrimaryBox: {
    minHeight: landscapeLayoutV(88),
    padding: 10,
    backgroundColor: redoDummyBrand.surface,
    borderWidth: 0.5,
    borderColor: redoDummyBrand.border,
  },
  logoPlaceholderWord: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 6,
    color: redoDummyBrand.ink,
  },
  logoPlaceholderCaption: {
    fontSize: 9.25,
    lineHeight: 1.45,
    color: redoDummyBrand.body,
  },
  secondaryLockupRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
    marginBottom: 6,
  },
  secondaryLockupCard: {
    flex: 1,
    marginHorizontal: 3,
    padding: 8,
    minHeight: landscapeLayoutV(56),
    borderWidth: 0.5,
    borderColor: redoDummyBrand.border,
    backgroundColor: redoDummyBrand.page,
  },
  lockupLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
    color: redoDummyBrand.ink,
  },
  lockupCaption: {
    fontSize: 8.75,
    lineHeight: 1.42,
    color: redoDummyBrand.body,
  },
  usageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  usageCol: {
    width: '33.33%',
    paddingHorizontal: 3,
    marginBottom: 5,
  },
  usageText: {
    fontSize: 8.75,
    lineHeight: 1.42,
    color: redoDummyBrand.body,
  },
  paletteGroupTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 6,
    marginBottom: 5,
    color: redoDummyBrand.ink,
  },
  swatchRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
    marginBottom: 4,
  },
  swatchCell: {
    flex: 1,
    paddingHorizontal: 3,
  },
  swatchTile: {
    height: 40,
    borderWidth: 0.5,
    borderColor: redoDummyBrand.border,
    marginBottom: 3,
  },
  swatchName: {
    fontSize: 8.75,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
    color: redoDummyBrand.ink,
  },
  swatchHex: {
    fontSize: 8.25,
    color: redoDummyBrand.muted,
  },
  gradientRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
    marginTop: 2,
  },
  gradientCell: {
    flex: 1,
    paddingHorizontal: 3,
  },
  gradientTile: {
    height: 32,
    borderWidth: 0.5,
    borderColor: redoDummyBrand.border,
    marginBottom: 3,
  },
  typeLeftCol: {
    flex: 1,
    paddingRight: 16,
  },
  typeRightGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -3,
  },
  typeScaleCard: {
    width: '50%',
    paddingHorizontal: 3,
    marginBottom: 8,
  },
  specimenPara: {
    fontSize: 9.5,
    lineHeight: 1.48,
    marginBottom: 7,
    fontFamily: 'Times-Roman',
    color: redoDummyBrand.body,
  },
  specimenHeadline: {
    fontSize: 15,
    lineHeight: 1.15,
    fontFamily: 'Times-Bold',
    marginBottom: 7,
    color: redoDummyBrand.ink,
  },
  typefaceRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  typefaceCol: {
    flex: 1,
    paddingRight: 8,
  },
  typefaceLabel: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: redoDummyBrand.muted,
    marginBottom: 2,
  },
  typefaceName: {
    fontSize: 11.5,
    fontFamily: 'Times-Bold',
    color: redoDummyBrand.ink,
  },
  typeScaleHeadline: {
    fontSize: 11,
    lineHeight: 1.2,
    fontFamily: 'Times-Bold',
    marginBottom: 3,
    color: redoDummyBrand.ink,
  },
  typeScaleBody: {
    fontSize: 8.5,
    lineHeight: 1.45,
    marginBottom: 4,
    color: redoDummyBrand.body,
  },
  typeScaleMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeScaleMeta: {
    fontSize: 8,
    marginRight: 8,
    color: redoDummyBrand.muted,
  },
  artGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 0,
  },
  artCell: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  artThemeTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
    color: redoDummyBrand.ink,
  },
  artThemeBody: {
    fontSize: 9.5,
    lineHeight: 1.48,
    color: redoDummyBrand.body,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 32,
    backgroundColor: redoDummyBrand.page,
    borderTopWidth: 0.5,
    borderTopColor: redoDummyBrand.border,
  },
  footerText: {
    fontSize: 8,
    color: redoDummyBrand.muted,
  },
})

function RedoDummyLandscapeShell({
  nav,
  activeTitle,
  headerUtilityLine,
  footerMeta,
  sectionAnchorId,
  children,
}: {
  nav: Array<{ number: string; title: string }>
  activeTitle?: string
  headerUtilityLine: string
  footerMeta: string
  /** PDF named destination; nav uses `Link src={"#" + id}`. */
  sectionAnchorId: string
  children: ReactNode
}) {
  return (
    <Page size={LANDSCAPE_PDF_SIZE} style={redoDummyStyles.page}>
      <View style={redoDummyStyles.headerBar} fixed>
        <View style={redoDummyStyles.headerTopRow}>
          <View style={redoDummyStyles.navRow}>
            {nav.map((item) => {
              const anchor = redoNavAnchorIdFromTitle(item.title)
              const isActive = activeTitle === item.title
              return (
                <Link
                  key={`${item.number}-${item.title}`}
                  src={`#${anchor}`}
                  style={[
                    redoDummyStyles.topNavLink,
                    redoDummyStyles.topNavItem,
                    isActive
                      ? { color: redoDummyBrand.ink, fontFamily: 'Helvetica-Bold', textDecoration: 'none' }
                      : { textDecoration: 'none' },
                  ]}
                >
                  <Text style={isActive ? { color: redoDummyBrand.ink } : { color: redoDummyBrand.muted }}>
                    {item.number ? <Text style={redoDummyStyles.topNavNumber}>{item.number}</Text> : null}
                    {item.title}
                  </Text>
                </Link>
              )
            })}
          </View>
          <Text style={redoDummyStyles.headerUtility}>{headerUtilityLine}</Text>
        </View>
      </View>
      <View style={redoDummyStyles.body}>
        <View id={sectionAnchorId} style={redoDummyStyles.sectionAnchor} />
        {children}
      </View>
      <View style={redoDummyStyles.footerBar} fixed>
        <Text
          style={redoDummyStyles.footerText}
          render={({ pageNumber, totalPages }) => `${footerMeta} · ${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  )
}

function RedoChapterHeader({ number, title, intro }: { number: string; title: string; intro: string[] }) {
  const hasIntro = intro.length > 0
  return (
    <View
      style={[redoDummyStyles.chapterHeader, !hasIntro ? redoDummyStyles.chapterHeaderTitleOnly : null]}
    >
      <View style={redoDummyStyles.chapterTitleRow}>
        <Text style={redoDummyStyles.chapterNumber}>{number}</Text>
        <View style={redoDummyStyles.chapterTitleTextWrap}>
          <Text style={redoDummyStyles.chapterTitle}>{title}</Text>
        </View>
      </View>
      {hasIntro ? (
        <View style={redoDummyStyles.chapterIntroBlock}>
          {intro.map((paragraph) => (
            <Text key={paragraph} style={redoDummyStyles.chapterIntro}>
              {paragraph}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  )
}

function RedoDummyTriplet({ heading, items }: { heading: string; items: RedoGuideTripletItem[] }) {
  return (
    <>
      <Text style={redoDummyStyles.moduleHeading}>{heading}</Text>
      {items.map((item) => (
        <View key={item.label} style={redoDummyStyles.tripletItem}>
          <Text style={redoDummyStyles.tripletLabel}>{item.label}</Text>
          <Text style={redoDummyStyles.tripletValue}>{item.value}</Text>
        </View>
      ))}
    </>
  )
}

function RedoDummyLogoLockupBox({ lockup, large = false }: { lockup: RedoGuideLogoLockup; large?: boolean }) {
  return (
    <View style={large ? redoDummyStyles.logoPrimaryBox : redoDummyStyles.secondaryLockupCard}>
      <Text style={redoDummyStyles.lockupLabel}>{lockup.label}</Text>
      <Text style={[redoDummyStyles.logoPlaceholderWord, large ? {} : { fontSize: 17, marginBottom: 4 }]}>NSL</Text>
      <Text style={large ? redoDummyStyles.logoPlaceholderCaption : redoDummyStyles.lockupCaption}>{lockup.caption}</Text>
    </View>
  )
}

function RedoDummySwatchRow({ swatches }: { swatches: RedoGuideColorSwatch[] }) {
  return (
    <View style={redoDummyStyles.swatchRow}>
      {swatches.map((swatch) => (
        <View key={`${swatch.name}-${swatch.hex}`} style={redoDummyStyles.swatchCell}>
          <View style={[redoDummyStyles.swatchTile, { backgroundColor: swatch.hex }]} />
          <Text style={redoDummyStyles.swatchName}>{swatch.name}</Text>
          <Text style={redoDummyStyles.swatchHex}>Hex: {swatch.hex}</Text>
        </View>
      ))}
    </View>
  )
}

function RedoDummyGradientRow({ gradients }: { gradients: RedoGuideGradientSwatch[] }) {
  return (
    <View style={redoDummyStyles.gradientRow}>
      {gradients.map((gradient) => (
        <View key={gradient.name} style={redoDummyStyles.gradientCell}>
          <View style={[redoDummyStyles.gradientTile, { backgroundColor: gradient.from }]} />
          <Text style={redoDummyStyles.swatchName}>{gradient.name}</Text>
          <Text style={redoDummyStyles.swatchHex}>
            {gradient.from} {'->'} {gradient.to}
          </Text>
        </View>
      ))}
    </View>
  )
}

function RedoDummyTypeScaleCard({ scale }: { scale: RedoGuideTypeScale }) {
  return (
    <View style={redoDummyStyles.typeScaleCard}>
      <Text style={redoDummyStyles.typeScaleHeadline}>{scale.headline}</Text>
      <Text style={redoDummyStyles.typeScaleBody}>{scale.body}</Text>
      <View style={redoDummyStyles.typeScaleMetaRow}>
        <Text style={redoDummyStyles.typeScaleMeta}>Type Sizes {scale.sizeRange}</Text>
        <Text style={redoDummyStyles.typeScaleMeta}>{scale.leading} Leading</Text>
        <Text style={redoDummyStyles.typeScaleMeta}>{scale.tracking} Tracking</Text>
      </View>
    </View>
  )
}

function RedoSpreadBody({ spread, model }: { spread: RedoGuideSpread; model: RedoStyleDummyGuideModel }) {
  if (spread.kind === 'cover') {
    return (
      <View style={redoDummyStyles.coverRow}>
        <View style={redoDummyStyles.coverLeft}>
          <Text style={redoDummyStyles.coverBrand}>{model.brandName}</Text>
          <Text style={redoDummyStyles.coverTitle}>{model.bookTitle}</Text>
          <Text style={redoDummyStyles.subtitle}>{spread.subtitle}</Text>
          {spread.introParagraphs.map((paragraph) => (
            <Text key={paragraph} style={redoDummyStyles.introParagraph}>
              {paragraph}
            </Text>
          ))}
        </View>
        <View style={redoDummyStyles.coverRight}>
          <Text style={redoDummyStyles.contentsHeading}>Contents</Text>
          {model.nav.map((item) => (
            <View key={`${item.number}-${item.title}`} style={redoDummyStyles.contentsRow}>
              <Text style={redoDummyStyles.contentsNumber}>{item.number || '—'}</Text>
              <Text style={redoDummyStyles.contentsTitle}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  if (spread.kind === 'strategy') {
    return (
      <>
        <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
        <View style={redoDummyStyles.spreadBodyFill}>
          <View style={redoDummyStyles.twoCol}>
            <View style={redoDummyStyles.colMain}>
              {spread.mainColumn.map((paragraph) => (
                <Text key={paragraph} style={redoDummyStyles.proseParagraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
            <View style={redoDummyStyles.colAsideStack}>
              <View style={redoDummyStyles.strategyQuoteBlock}>
                <Text style={redoDummyStyles.asideQuote}>{spread.asideQuote}</Text>
              </View>
              <View style={[redoDummyStyles.editorialFigureMat, redoDummyStyles.editorialFigureMatSpaced]}>
                <Text style={redoDummyStyles.editorialFigureMatCaption}>
                  Application frame — photography or UI example
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }

  if (spread.kind === 'personality') {
    return (
      <>
        <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
        <View style={redoDummyStyles.spreadBodyFill}>
          <View style={redoDummyStyles.personalityTripletBlock}>
            <RedoDummyTriplet heading={spread.tripletHeading} items={spread.tripletItems} />
          </View>
          <View style={redoDummyStyles.personalitySampleStack}>
            <View style={redoDummyStyles.sampleCopySection}>
              <Text style={redoDummyStyles.sampleCopySectionTitle}>{spread.sampleHeading}</Text>
            </View>
            <View style={redoDummyStyles.sampleFourColumnRow}>
              {spread.samples.map((item, i) => (
                <View
                  key={item.headline}
                  style={[redoDummyStyles.sampleCardQuarter, i > 0 ? redoDummyStyles.sampleColumnDivider : {}]}
                >
                  <Text style={redoDummyStyles.sampleHeadlineQuarter}>{item.headline}</Text>
                  <Text style={redoDummyStyles.sampleBodyQuarter}>{item.body}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </>
    )
  }

  if (spread.kind === 'logo') {
    return (
      <>
        <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
        <View style={redoDummyStyles.spreadBodyFill}>
          <View style={redoDummyStyles.logoTopRow}>
            <View style={redoDummyStyles.logoNarrativeCol}>
              {spread.narrative.map((paragraph) => (
                <Text key={paragraph} style={redoDummyStyles.proseParagraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
            <View style={redoDummyStyles.logoMarkCol}>
              <RedoDummyLogoLockupBox lockup={spread.primaryLockup} large />
            </View>
          </View>
          <View>
            <Text style={redoDummyStyles.tripletLabel}>Clearspace</Text>
            <Text style={[redoDummyStyles.proseParagraph, { marginBottom: 10 }]}>{spread.clearspace}</Text>
            <Text style={[redoDummyStyles.moduleHeading, { marginTop: 4 }]}>Secondary Lockups</Text>
            <View style={redoDummyStyles.secondaryLockupRow}>
              {spread.secondaryLockups.map((lockup) => (
                <RedoDummyLogoLockupBox key={lockup.label} lockup={lockup} />
              ))}
            </View>
            <Text style={[redoDummyStyles.moduleHeading, { marginTop: 12 }]}>Incorrect Usage</Text>
            <View style={redoDummyStyles.usageRow}>
              {spread.incorrectUsage.map((rule) => (
                <View key={rule} style={redoDummyStyles.usageCol}>
                  <Text style={redoDummyStyles.usageText}>{rule}</Text>
                </View>
              ))}
            </View>
            <Text style={[redoDummyStyles.tripletLabel, { marginTop: 10 }]}>Partnerships</Text>
            <Text style={redoDummyStyles.proseParagraph}>{spread.partnerships}</Text>
          </View>
        </View>
      </>
    )
  }

  if (spread.kind === 'color') {
    return (
      <>
        <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
        <View style={redoDummyStyles.spreadBodyFill}>
          <View style={redoDummyStyles.twoCol}>
            <View style={{ flex: 0.34, paddingRight: 14 }}>
              {spread.narrative.map((paragraph) => (
                <Text key={paragraph} style={redoDummyStyles.proseParagraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 14,
                borderLeftWidth: 0.5,
                borderLeftColor: redoDummyBrand.border,
              }}
            >
              <Text style={[redoDummyStyles.paletteGroupTitle, { marginTop: 0 }]}>Primary Palette</Text>
              <RedoDummySwatchRow swatches={spread.primary} />
              <Text style={redoDummyStyles.paletteGroupTitle}>Secondary Palette</Text>
              <RedoDummySwatchRow swatches={spread.secondary} />
              <Text style={redoDummyStyles.paletteGroupTitle}>Gradient Palette</Text>
              <RedoDummyGradientRow gradients={spread.gradients} />
            </View>
          </View>
        </View>
      </>
    )
  }

  if (spread.kind === 'typography') {
    return (
      <>
        <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
        <View style={redoDummyStyles.spreadBodyFill}>
          <View style={redoDummyStyles.twoCol}>
            <View style={redoDummyStyles.typeLeftCol}>
              {spread.narrative.map((paragraph) => (
                <Text key={paragraph} style={redoDummyStyles.proseParagraph}>
                  {paragraph}
                </Text>
              ))}
              <View style={[redoDummyStyles.typefaceRow, { marginTop: 6 }]}>
                <View style={redoDummyStyles.typefaceCol}>
                  <Text style={redoDummyStyles.typefaceLabel}>Primary Typeface</Text>
                  <Text style={redoDummyStyles.typefaceName}>{spread.primaryTypeface}</Text>
                </View>
                <View style={redoDummyStyles.typefaceCol}>
                  <Text style={redoDummyStyles.typefaceLabel}>Secondary Typeface</Text>
                  <Text style={redoDummyStyles.typefaceName}>{spread.secondaryTypeface}</Text>
                </View>
              </View>
              <Text style={[redoDummyStyles.specimenPara, { marginTop: 8 }]}>{spread.specimenParagraph}</Text>
              <Text style={redoDummyStyles.specimenHeadline}>{spread.specimenHeadline}</Text>
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 14,
                borderLeftWidth: 0.5,
                borderLeftColor: redoDummyBrand.border,
              }}
            >
              <Text style={[redoDummyStyles.moduleHeading, { marginTop: 0 }]}>Sizing</Text>
              <View style={redoDummyStyles.typeRightGrid}>
                {spread.scales.map((scale) => (
                  <RedoDummyTypeScaleCard key={`${scale.sizeRange}-${scale.headline}`} scale={scale} />
                ))}
              </View>
            </View>
          </View>
        </View>
      </>
    )
  }

  return (
    <>
      <RedoChapterHeader number={spread.number} title={spread.title} intro={spread.intro} />
      <View style={redoDummyStyles.spreadBodyFill}>
        <View style={redoDummyStyles.twoCol}>
          <View style={redoDummyStyles.colMain}>
            {spread.narrative.map((paragraph) => (
              <Text key={paragraph} style={redoDummyStyles.proseParagraph}>
                {paragraph}
              </Text>
            ))}
          </View>
          <View style={redoDummyStyles.colAsideArt}>
            <View style={redoDummyStyles.artGrid}>
              {spread.themes.map((theme) => (
                <View key={theme.title} style={redoDummyStyles.artCell}>
                  <Text style={redoDummyStyles.artThemeTitle}>{theme.title}</Text>
                  <Text style={redoDummyStyles.artThemeBody}>{theme.description}</Text>
                </View>
              ))}
            </View>
            <View style={[redoDummyStyles.editorialFigureMat, redoDummyStyles.editorialFigureMatSpaced]}>
              <Text style={redoDummyStyles.editorialFigureMatCaption}>
                Mood board — reference stills or composite
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

export function RedoStyleDummyGuideDocument() {
  const model = buildRedoStyleDummyGuideModel()

  return (
    <Document>
      {model.spreads.map((spread) => (
        <RedoDummyLandscapeShell
          key={spread.kind === 'cover' ? 'cover' : `${spread.number}-${spread.title}`}
          nav={model.nav}
          activeTitle={spread.kind === 'cover' ? undefined : spread.title}
          headerUtilityLine={model.headerUtilityLine}
          footerMeta={model.footerMeta}
          sectionAnchorId={redoSpreadAnchorId(spread)}
        >
          <RedoSpreadBody spread={spread} model={model} />
        </RedoDummyLandscapeShell>
      ))}
    </Document>
  )
}
