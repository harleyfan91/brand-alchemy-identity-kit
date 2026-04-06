import { createRequire } from 'node:module'

import './registerKitPdfFonts.js'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'

import {
  brandBriefBlocks,
  paletteColorRolesParagraph,
  quickStartBlocks,
  styleGuideBlocks,
  typographySectionLead,
  typographySpecimenSlots,
  voicePlaybookBlocks,
} from '../deterministic/coreAssembly.js'

// ---------------------------------------------------------------------------
// Brand strip asset (PNG — reliable in @react-pdf/renderer vs SVG)
// ---------------------------------------------------------------------------

const require = createRequire(import.meta.url)

let symbolStripPngPath: string | null = null
try {
  symbolStripPngPath = require.resolve('@identity-kit/brand-assets/alchemy-symbol-strip.png')
} catch {
  symbolStripPngPath = null
}

// ---------------------------------------------------------------------------
// Palette data — mirrors apps/web/src/components/steps/Step6Aesthetic.tsx
// ---------------------------------------------------------------------------

const paletteSwatchColors: Record<string, string[]> = {
  midnight_luxe: ['#0B0B0F', '#222333', '#7A6A4F', '#D4C4A8'],
  earthy_warmth: ['#5A3E36', '#A77C5D', '#E5C7A2', '#F8EEDF'],
  ocean_calm:    ['#0D3B66', '#2F6690', '#3A7CA5', '#D9EDFF'],
  sunset_bold:   ['#2D1E2F', '#C8553D', '#F28F3B', '#F7D488'],
  forest_deep:   ['#1B4332', '#2D6A4F', '#40916C', '#D8F3DC'],
  minimal_light: ['#111111', '#666666', '#CFCFCF', '#F7F7F7'],
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
}

const DEFAULT_SWATCH_META: SwatchMeta[] = [
  { role: 'Primary', flex: 4 },
  { role: 'Supporting', flex: 2.5 },
  { role: 'Accent', flex: 2 },
  { role: 'Canvas', flex: 1.5 },
]

/** All four swatches for a palette, with a grayscale fallback. */
export function getSwatches(palette: string): string[] {
  return paletteSwatchColors[palette] ?? ['#111111', '#555555', '#999999', '#EEEEEE']
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

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

const BRAND = {
  black:    '#111111',
  bodyText: '#3F3F46',
  subText:  '#A1A1AA',
  /** Matches `BrandWordmark` compact strip: `text-zinc-600` */
  wordmarkGray: '#52525B',
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

/** Max height of kit nav row — inactive segments sit shorter; active fills this. */
const KIT_NAV_MAX_HEIGHT = 22
/** Title band below nav — tall enough for Source Serif 4 at section-h3 scale (≈ web text-4xl / md:text-5xl). */
const HEADER_BAND_MIN_HEIGHT = 58
/** Total fixed header stack height (nav + title band). */
const HEADER_CHROME_HEIGHT = KIT_NAV_MAX_HEIGHT + HEADER_BAND_MIN_HEIGHT
/** Footer: symbol strip, then wordmark tucked bottom-right (watermark). */
const FOOTER_WATERMARK_BOTTOM = 5
/** ~line box for small footer type */
const FOOTER_WATERMARK_LINE = 9
const FOOTER_STRIP_GAP = 4
const FOOTER_STRIP_HEIGHT = 26
/** Strip sits above the wordmark */
const FOOTER_STRIP_FROM_BOTTOM = FOOTER_WATERMARK_BOTTOM + FOOTER_WATERMARK_LINE + FOOTER_STRIP_GAP
const FOOTER_CHROME_HEIGHT = FOOTER_STRIP_FROM_BOTTOM + FOOTER_STRIP_HEIGHT + 8

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const S = StyleSheet.create({
  page: {
    paddingTop: HEADER_CHROME_HEIGHT,
    paddingBottom: FOOTER_CHROME_HEIGHT,
    paddingHorizontal: 0,
    fontFamily: 'Inter',
    fontWeight: 400,
    backgroundColor: '#FFFFFF',
  },

  // Fixed header stack (kit TOC + title band)
  headerChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  kitNavRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: KIT_NAV_MAX_HEIGHT,
  },
  kitNavSegment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitNavSegmentInactive: {
    height: 11,
  },
  kitNavSegmentActive: {
    height: KIT_NAV_MAX_HEIGHT,
  },
  kitNavActiveLabel: {
    fontSize: 5.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 0.6,
    textAlign: 'center',
  },

  headerBand: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: HEADER_BAND_MIN_HEIGHT,
  },
  /** Flex child so long doc titles wrap; ~524pt row minus customer column. */
  headerTitleWrap: {
    flex: 1,
    paddingRight: 14,
    minWidth: 0,
  },
  /**
   * Matches landing section title (BRAND_GUIDELINES): Source Serif 4, font-normal (400), sentence case,
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
    fontFamily: 'Inter',
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
  /** Editorial pull quote — matches landing definition line (Source Serif 4 italic 400). */
  anchorText: {
    fontSize: 11,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.bodyText,
    lineHeight: 1.65,
  },

  sectionBand: {
    paddingVertical: 6,
    paddingHorizontal: 44,
  },
  /** Section eyebrow: Inter bold caps + wide tracking (see BRAND_GUIDELINES). */
  sectionBandLabel: {
    fontSize: 7.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 2.25,
  },

  sectionBody: {
    paddingHorizontal: 44,
    paddingTop: 10,
    paddingBottom: 14,
  },
  /** Body: Inter light per guidelines (300); 400 still available for dense UI if needed. */
  sectionBodyText: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.65,
    color: BRAND.bodyText,
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
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  paletteSwatchHexLabel: {
    fontSize: 5,
    fontFamily: 'Inter',
    fontWeight: 400,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  /** Wordmark: bottom edge of page, tight to right — under the symbol strip */
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
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 0.2,
    color: BRAND.wordmarkGray,
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

  typographySectionLead: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.55,
    color: BRAND.bodyText,
    marginBottom: 10,
  },
  /** Typography specimens — same white section as other blocks; meta labels in Inter, samples in each face. */
  typographySpecimenStack: {
    marginBottom: 8,
  },
  specimenRoleEyebrow: {
    fontSize: 6.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.15,
    color: BRAND.subText,
    marginBottom: 3,
  },
  specimenFaceLabel: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 600,
    color: BRAND.black,
    marginBottom: 2,
  },
  specimenBlurb: {
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.45,
    color: BRAND.bodyText,
    marginBottom: 6,
  },
  specimenWeightRows: {
    marginTop: 2,
  },
  specimenWeightRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  specimenWeightLabel: {
    width: 44,
    fontSize: 6.5,
    fontFamily: 'Inter',
    fontWeight: 600,
    letterSpacing: 0.4,
    color: BRAND.subText,
  },
  specimenInterSampleRegular: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 400,
    color: BRAND.black,
  },
  specimenInterSampleBold: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 700,
    color: BRAND.black,
  },
  specimenInterSampleItalic: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.black,
  },
  specimenSerifSampleRegular: {
    fontSize: 16,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    color: BRAND.black,
  },
  specimenSerifSampleBold: {
    fontSize: 16,
    fontFamily: 'Source Serif 4',
    fontWeight: 700,
    color: BRAND.black,
  },
  specimenSerifSampleItalic: {
    fontSize: 16,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.black,
  },
  specimenSpacer: {
    height: 4,
  },
  specimenExistingNote: {
    marginTop: 4,
    marginBottom: 8,
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.65,
    color: BRAND.bodyText,
  },
  specimenWordmarkNote: {
    marginTop: 5,
    fontSize: 7.5,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.45,
    color: BRAND.subText,
  },

  // ---------------------------------------------------------------------------
  // Do / Avoid — two-column split
  // ---------------------------------------------------------------------------
  doAvoidTwoCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  doAvoidCol: {
    flex: 1,
  },
  doAvoidColLeft: {
    paddingRight: 12,
  },
  doAvoidColRight: {
    paddingLeft: 12,
    borderLeftWidth: 0.5,
    borderLeftColor: '#E4E4E7',
  },
  doAvoidColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  doAvoidColHeaderText: {
    fontSize: 6.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.5,
  },
  doAvoidItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  doAvoidSymbol: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 700,
    width: 14,
    marginTop: 0.5,
    flexShrink: 0,
  },
  doAvoidItemText: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.6,
    color: BRAND.bodyText,
  },

  // ---------------------------------------------------------------------------
  // Week Checklist (Quick Start)
  // ---------------------------------------------------------------------------
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  weekBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 700,
  },
  weekBadgeLabel: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 600,
    color: BRAND.bodyText,
  },
  weekIntro: {
    fontSize: 9.5,
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
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
  bulletDotWrap: {
    width: 14,
    paddingTop: 5,
    flexShrink: 0,
    alignItems: 'center',
  },
  bulletDotCircle: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },
  bulletGroupSpacer: {
    height: 10,
  },
  bulletGroupLabel: {
    fontSize: 6,
    fontFamily: 'Inter',
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
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    fontStyle: 'italic',
    lineHeight: 1.6,
    color: BRAND.bodyText,
    paddingVertical: 1,
  },

  // ---------------------------------------------------------------------------
  // Before / After
  // ---------------------------------------------------------------------------
  beforeAfterGroup: {
    marginBottom: 14,
  },
  beforeAfterGroupLabel: {
    fontSize: 6.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.1,
    color: BRAND.subText,
    marginBottom: 8,
  },
  beforeAfterTwoCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  beforeAfterColLabel: {
    fontSize: 5.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 4,
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
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.subText,
    fontStyle: 'italic',
  },
  beforeAfterAfterText: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 400,
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
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 0.8,
    color: BRAND.subText,
    marginRight: 3,
  },
  toneChipValue: {
    fontSize: 7.5,
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 0.9,
    color: BRAND.subText,
    paddingTop: 1.5,
    flexShrink: 0,
  },
  kvValue: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: 'Inter',
    fontWeight: 300,
    lineHeight: 1.55,
    color: BRAND.bodyText,
  },
  kvValueBold: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: 600,
    lineHeight: 1.3,
    color: BRAND.black,
  },
  kvPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 1,
  },
  kvPill: {
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 3,
    backgroundColor: '#F4F4F5',
  },
  kvPillText: {
    fontSize: 7.5,
    fontFamily: 'Inter',
    fontWeight: 400,
    color: BRAND.bodyText,
  },
})

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function KitNavHeader({
  activeDocId,
  palette,
  tier,
}: {
  activeDocId: DocId
  palette: string
  tier: KitPdfTier
}) {
  const docs = kitDocsForTier(tier)
  return (
    <View style={S.kitNavRow}>
      {docs.map((doc, i) => {
        const segColor = segmentColor(palette, i, tier)
        const isActive = doc.id === activeDocId
        const labelColor = onColor(segColor)
        return (
          <View
            key={doc.id}
            style={[
              S.kitNavSegment,
              isActive ? S.kitNavSegmentActive : S.kitNavSegmentInactive,
              { backgroundColor: segColor },
            ]}
          >
            {isActive ? (
              <Text style={[S.kitNavActiveLabel, { color: labelColor }]}>{doc.label.toUpperCase()}</Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

function PageHeaderBand({
  docTitle,
  businessName,
  color,
}: {
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
      <Text style={[S.headerCustomerName, { color: textColor }]}>{businessName}</Text>
    </View>
  )
}

/** Repeats on every page: kit TOC (taller active tab) + colored title band. */
function PageHeaderChrome({
  docTitle,
  businessName,
  homeColorHex,
  activeDocId,
  palette,
  tier,
}: {
  docTitle: string
  businessName: string
  homeColorHex: string
  activeDocId: DocId
  palette: string
  tier: KitPdfTier
}) {
  return (
    <View style={S.headerChrome} fixed>
      <KitNavHeader activeDocId={activeDocId} palette={palette} tier={tier} />
      <PageHeaderBand docTitle={docTitle} businessName={businessName} color={homeColorHex} />
    </View>
  )
}

function SectionBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
  const textColor = onColor(color)
  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.sectionBodyText}>{body}</Text>
      </View>
    </View>
  )
}

function SpecimenThreeNameRows({
  businessName,
  regularStyle,
  boldStyle,
  italicStyle,
}: {
  businessName: string
  regularStyle: typeof S.specimenInterSampleRegular
  boldStyle: typeof S.specimenInterSampleBold
  italicStyle: typeof S.specimenInterSampleItalic
}) {
  const rows: { label: string; style: typeof regularStyle }[] = [
    { label: 'Regular', style: regularStyle },
    { label: 'Bold', style: boldStyle },
    { label: 'Italic', style: italicStyle },
  ]
  return (
    <View style={S.specimenWeightRows}>
      {rows.map((row) => (
        <View key={row.label} style={S.specimenWeightRow} wrap={false}>
          <Text style={S.specimenWeightLabel}>{row.label}</Text>
          <Text style={row.style}>{businessName}</Text>
        </View>
      ))}
    </View>
  )
}

function InterTypeSpecimen({
  roleEyebrow,
  faceLabel,
  blurb,
  businessName,
  wordmarkNoteAfterWeights,
}: {
  roleEyebrow: string
  faceLabel: string
  blurb: string
  businessName: string
  wordmarkNoteAfterWeights?: string
}) {
  return (
    <View>
      <Text style={S.specimenRoleEyebrow}>{roleEyebrow.toUpperCase()}</Text>
      <Text style={S.specimenFaceLabel}>{faceLabel}</Text>
      <Text style={S.specimenBlurb}>{blurb}</Text>
      <SpecimenThreeNameRows
        businessName={businessName}
        regularStyle={S.specimenInterSampleRegular}
        boldStyle={S.specimenInterSampleBold}
        italicStyle={S.specimenInterSampleItalic}
      />
      {wordmarkNoteAfterWeights ? (
        <Text style={S.specimenWordmarkNote}>{wordmarkNoteAfterWeights}</Text>
      ) : null}
    </View>
  )
}

function SerifTypeSpecimen({
  roleEyebrow,
  faceLabel,
  blurb,
  businessName,
  wordmarkNoteAfterWeights,
}: {
  roleEyebrow: string
  faceLabel: string
  blurb: string
  businessName: string
  wordmarkNoteAfterWeights?: string
}) {
  return (
    <View>
      <Text style={S.specimenRoleEyebrow}>{roleEyebrow.toUpperCase()}</Text>
      <Text style={S.specimenFaceLabel}>{faceLabel}</Text>
      <Text style={S.specimenBlurb}>{blurb}</Text>
      <SpecimenThreeNameRows
        businessName={businessName}
        regularStyle={S.specimenSerifSampleRegular}
        boldStyle={S.specimenSerifSampleBold}
        italicStyle={S.specimenSerifSampleItalic}
      />
      {wordmarkNoteAfterWeights ? (
        <Text style={S.specimenWordmarkNote}>{wordmarkNoteAfterWeights}</Text>
      ) : null}
    </View>
  )
}

function TypographySpecimens({ form }: { form: IdentityKitForm }) {
  const businessName = form.step1.businessName.trim() || 'Your business name'
  const slots = typographySpecimenSlots(form)
  const existing = form.step6.existingTypeface?.trim()
  return (
    <View style={S.typographySpecimenStack}>
      {slots.map((slot, i) => (
        <View key={`${slot.face}-${i}`}>
          {i > 0 ? <View style={S.specimenSpacer} /> : null}
          {slot.face === 'inter' ? (
            <InterTypeSpecimen
              roleEyebrow={slot.roleEyebrow}
              faceLabel={slot.faceLabel}
              blurb={slot.blurb}
              businessName={businessName}
              wordmarkNoteAfterWeights={slot.wordmarkNoteAfterWeights}
            />
          ) : (
            <SerifTypeSpecimen
              roleEyebrow={slot.roleEyebrow}
              faceLabel={slot.faceLabel}
              blurb={slot.blurb}
              businessName={businessName}
              wordmarkNoteAfterWeights={slot.wordmarkNoteAfterWeights}
            />
          )}
        </View>
      ))}
      {existing ? (
        <Text style={S.specimenExistingNote}>
          You noted an existing typeface: {existing}. Samples use kit embed fonts; apply your licensed files in
          production.
        </Text>
      ) : null}
    </View>
  )
}

function TypographySectionBlock({
  heading,
  body,
  color,
  form,
}: {
  heading: string
  body: string
  color: string
  form: IdentityKitForm
}) {
  const textColor = onColor(color)
  const lead = typographySectionLead(form)
  return (
    <View>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.typographySectionLead}>{lead}</Text>
        <TypographySpecimens form={form} />
        <Text style={S.sectionBodyText}>{body}</Text>
      </View>
    </View>
  )
}

function PaletteSectionBlock({
  heading,
  body,
  color,
  palette,
}: {
  heading: string
  body: string
  color: string
  palette: string
}) {
  const textColor = onColor(color)
  const swatches = paletteSwatchColors[palette] ?? []
  const meta = PALETTE_SWATCH_META[palette] ?? DEFAULT_SWATCH_META
  const colorRoles = paletteColorRolesParagraph(palette)
  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
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
      </View>
    </View>
  )
}

function PageFooterChrome() {
  return (
    <>
      {symbolStripPngPath ? (
        <View style={S.footerStripWrap} fixed>
          <Image src={symbolStripPngPath} style={S.footerStripImage} />
        </View>
      ) : null}
      <View style={S.footerBrandRow} fixed>
        <Text style={S.footerBrandText}>BRAND ALCHEMY</Text>
      </View>
    </>
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

/** Two-column Do / Avoid block. Parses ✓ and ✗ lines from body string. */
function TwoColDoAvoidBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
  const textColor = onColor(color)
  const { dos, donts } = parseDoAvoid(body)
  const doColor = '#166534'   // green-800
  const dontColor = '#991B1B' // red-800
  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <View style={S.doAvoidTwoCol}>
          {/* DO column */}
          <View style={[S.doAvoidCol, S.doAvoidColLeft]}>
            <View style={S.doAvoidColHeader}>
              <Text style={[S.doAvoidColHeaderText, { color: doColor }]}>DO</Text>
            </View>
            {dos.map((item, i) => (
              <View key={i} style={S.doAvoidItem}>
                <Text style={[S.doAvoidSymbol, { color: doColor }]}>✓</Text>
                <Text style={S.doAvoidItemText}>{item}</Text>
              </View>
            ))}
          </View>
          {/* AVOID column */}
          <View style={[S.doAvoidCol, S.doAvoidColRight]}>
            <View style={S.doAvoidColHeader}>
              <Text style={[S.doAvoidColHeaderText, { color: dontColor }]}>AVOID</Text>
            </View>
            {donts.map((item, i) => (
              <View key={i} style={S.doAvoidItem}>
                <Text style={[S.doAvoidSymbol, { color: dontColor }]}>✗</Text>
                <Text style={S.doAvoidItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

/**
 * Quick Start week block: numbered badge, intro text, then spaced ☐ checklist items.
 * Body format: "intro text\n\noptional second intro\n\n☐ item1\n☐ item2…"
 */
function WeekChecklistBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
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

  const badgeTextColor = onColor(color)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <View style={S.weekHeader}>
          <View style={[S.weekBadge, { backgroundColor: color }]}>
            <Text style={[S.weekBadgeText, { color: badgeTextColor }]}>{weekNum}</Text>
          </View>
          {introText ? (
            <Text style={[S.weekBadgeLabel, { flex: 1 }]}>{introText.split('\n')[0]}</Text>
          ) : null}
        </View>
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
 * Styled bullet list. Parses "• item" lines; blank lines create group breaks.
 * Groups after the first get a small separator. If a group starts with a non-bullet line,
 * it's treated as a group label (used in Messaging themes for "Industry vocabulary").
 */
function StyledBulletBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
  const textColor = onColor(color)
  const groups = parseBulletGroups(body)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {groups.map((group, gi) => {
          // Detect if first item in group is a label (no bullet prefix in source)
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
                  <View style={S.bulletDotWrap}>
                    <View style={[S.bulletDotCircle, { backgroundColor: color }]} />
                  </View>
                  <Text style={S.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )
        })}
      </View>
    </View>
  )
}

/** Phrase callouts: each "• phrase" gets a left accent border and italic serif text. */
function PhraseCalloutBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
  const textColor = onColor(color)
  const groups = parseBulletGroups(body)
  const allItems = groups.flat()

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {allItems.map((phrase, i) => (
          <View key={i} style={S.phraseCalloutRow}>
            <View style={[S.phraseCalloutBorder, { backgroundColor: color }]} />
            <Text style={S.phraseCalloutText}>{phrase}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

/** Before / After two-column block for Voice Playbook. */
function BeforeAfterTwoColBlock({ heading, body, color }: { heading: string; body: string; color: string }) {
  const textColor = onColor(color)
  const groups = parseBeforeAfter(body)

  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        {groups.map((g, i) => (
          <View key={i} style={S.beforeAfterGroup} wrap={false}>
            <Text style={S.beforeAfterGroupLabel}>{g.label.toUpperCase()}</Text>
            <View style={S.beforeAfterTwoCol}>
              <View style={S.beforeAfterColBefore}>
                <Text style={[S.beforeAfterColLabel, { color: BRAND.subText }]}>BEFORE</Text>
                <Text style={S.beforeAfterBeforeText}>{g.before}</Text>
              </View>
              <View style={S.beforeAfterColAfter}>
                <Text style={[S.beforeAfterColLabel, { color: color }]}>AFTER</Text>
                <Text style={S.beforeAfterAfterText}>{g.after}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

/**
 * Tone profile: renders a row of descriptor chips (Energy, Warmth, etc.) derived
 * from voice sliders, then the full body paragraph below for detail.
 */
function ToneDescriptorBlock({
  heading,
  body,
  color,
  form,
}: {
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

/**
 * Brand Brief — Values: renders form.step4.values as pill tags, then mission statement.
 * Receives form for direct access; body string is kept as fallback if values empty.
 */
function BriefValuesPillsBlock({
  heading,
  body,
  color,
  form,
}: {
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
  heading,
  body,
  color,
}: {
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
              <View style={S.kvPillRow}>
                {row.pills.map((p) => (
                  <View key={p} style={S.kvPill}>
                    <Text style={S.kvPillText}>{p}</Text>
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

// ---------------------------------------------------------------------------
// Document exports (tier defaults to Core; Pro PDFs pass tier="pro" when added)
// ---------------------------------------------------------------------------

export function BrandBriefDocument({ form }: { form: IdentityKitForm }) {
  const color = homeColor(form.step6.selectedPalette, 'brandBrief')
  const blocks = brandBriefBlocks(form)
  const anchorBlock = blocks.find((b) => b.heading === 'Brand anchor')
  const bodyBlocks = blocks.filter((b) => b.heading !== 'Brand anchor')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          docTitle="Brand Brief"
          businessName={form.step1.businessName}
          homeColorHex={color}
          activeDocId="brandBrief"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        {anchorBlock ? (
          <View style={S.anchorWrap}>
            <Text style={S.anchorText}>"{anchorBlock.body}"</Text>
          </View>
        ) : null}
        {bodyBlocks.map((b) =>
          b.heading === 'Values' ? (
            <BriefValuesPillsBlock key={b.heading} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Brand overview' || b.heading === 'Ideal customer' || b.heading === 'Brand story angle' || b.heading === 'Differentiation' ? (
            <BriefStructuredBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : (
            <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function StyleGuideDocument({ form }: { form: IdentityKitForm }) {
  const color = homeColor(form.step6.selectedPalette, 'styleGuide')
  const blocks = styleGuideBlocks(form)
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          docTitle="Brand Style Guide"
          businessName={form.step1.businessName}
          homeColorHex={color}
          activeDocId="styleGuide"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        {blocks.map((b) =>
          b.heading === 'Palette' ? (
            <PaletteSectionBlock
              key={b.heading}
              heading={b.heading}
              body={b.body}
              color={color}
              palette={form.step6.selectedPalette}
            />
          ) : b.heading === 'Typography' ? (
            <TypographySectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Do / avoid' ? (
            <TwoColDoAvoidBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Style principles' || b.heading === 'Where to apply this first' ? (
            <StyledBulletBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : (
            <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function VoicePlaybookDocument({ form }: { form: IdentityKitForm }) {
  const color = homeColor(form.step6.selectedPalette, 'voicePlaybook')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          docTitle="Voice & Content Playbook"
          businessName={form.step1.businessName}
          homeColorHex={color}
          activeDocId="voicePlaybook"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        {voicePlaybookBlocks(form).map((b) =>
          b.heading === 'Tone profile' ? (
            <ToneDescriptorBlock key={b.heading} heading={b.heading} body={b.body} color={color} form={form} />
          ) : b.heading === 'Voice guardrails' || b.heading === 'Writing do / avoid' ? (
            <TwoColDoAvoidBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Messaging themes' ? (
            <StyledBulletBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Sample phrases' ? (
            <PhraseCalloutBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : b.heading === 'Before / after examples' ? (
            <BeforeAfterTwoColBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ) : (
            <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
          ),
        )}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}

export function QuickStartDocument({ form }: { form: IdentityKitForm }) {
  const color = homeColor(form.step6.selectedPalette, 'quickStart')
  const tier: KitPdfTier = form.tier === 'pro' ? 'pro' : 'core'

  return (
    <Document>
      <Page size="LETTER" style={S.page}>
        <PageHeaderChrome
          docTitle="30-Day Quick Start Checklist"
          businessName={form.step1.businessName}
          homeColorHex={color}
          activeDocId="quickStart"
          palette={form.step6.selectedPalette}
          tier={tier}
        />
        {quickStartBlocks(form).map((b) => (
          <WeekChecklistBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
        ))}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}
