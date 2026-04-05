import { createRequire } from 'node:module'

import './registerKitPdfFonts.js'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'

import {
  brandBriefBlocks,
  quickStartBlocks,
  styleGuideBlocks,
  typographySpecimenFamilies,
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

  /** Palette section: prose left, swatches right */
  paletteTwoColumnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  paletteTextColumn: {
    flex: 1,
    paddingRight: 16,
    maxWidth: 310,
  },
  paletteSwatchesColumn: {
    width: 226,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  /** Portrait tiles — taller than wide */
  paletteSwatchTile: {
    width: 48,
    height: 88,
    borderRadius: 4,
    marginLeft: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 6,
    paddingHorizontal: 2,
  },
  paletteSwatchHexLabel: {
    fontSize: 5.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: 0.2,
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

  /** Typography specimens — kit card (common in brand PDFs: family label + weights + name sample). */
  typographySpecimenCard: {
    marginBottom: 8,
    padding: 9,
    backgroundColor: '#F4F4F5',
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E4E4E7',
  },
  typographySpecimenIntro: {
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.5,
    color: BRAND.subText,
    marginBottom: 8,
  },
  specimenFamilyLabel: {
    fontSize: 6.5,
    fontFamily: 'Inter',
    fontWeight: 700,
    letterSpacing: 1.1,
    color: '#71717A',
    marginBottom: 5,
  },
  specimenBrandInter: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: 300,
    color: BRAND.black,
    lineHeight: 1.25,
    marginBottom: 4,
  },
  specimenGlyphLine: {
    fontSize: 9,
    fontFamily: 'Inter',
    fontWeight: 400,
    color: BRAND.bodyText,
    marginBottom: 3,
  },
  specimenWeightRow: {
    fontSize: 7.5,
    fontFamily: 'Inter',
    fontWeight: 400,
    color: BRAND.bodyText,
    lineHeight: 1.4,
  },
  specimenBrandSerif: {
    fontSize: 16,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    color: BRAND.black,
    lineHeight: 1.2,
    marginBottom: 3,
  },
  specimenSerifItalic: {
    fontSize: 9,
    fontFamily: 'Source Serif 4',
    fontWeight: 400,
    fontStyle: 'italic',
    color: BRAND.bodyText,
    lineHeight: 1.45,
    marginBottom: 2,
  },
  specimenSerifAccent: {
    fontSize: 8,
    fontFamily: 'Source Serif 4',
    fontWeight: 600,
    color: BRAND.bodyText,
  },
  specimenSpacer: {
    height: 10,
  },
  specimenExistingNote: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#D4D4D8',
    borderTopStyle: 'solid',
    fontSize: 8,
    fontFamily: 'Inter',
    fontWeight: 400,
    lineHeight: 1.45,
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

function InterTypeSpecimen({ businessName }: { businessName: string }) {
  return (
    <View>
      <Text style={S.specimenFamilyLabel}>INTER — WORKHORSE SANS</Text>
      <Text style={S.specimenBrandInter}>{businessName}</Text>
      <Text style={S.specimenGlyphLine}>Aa Bb Cc  ·  0123456789</Text>
      <Text style={S.specimenWeightRow}>
        <Text style={{ fontFamily: 'Inter', fontWeight: 300 }}>Light </Text>
        <Text style={{ fontFamily: 'Inter', fontWeight: 400 }}>· Regular </Text>
        <Text style={{ fontFamily: 'Inter', fontWeight: 600 }}>· Semibold </Text>
        <Text style={{ fontFamily: 'Inter', fontWeight: 700 }}>· Bold</Text>
      </Text>
    </View>
  )
}

function SerifTypeSpecimen({ businessName }: { businessName: string }) {
  return (
    <View>
      <Text style={S.specimenFamilyLabel}>SOURCE SERIF 4 — DISPLAY SERIF</Text>
      <Text style={S.specimenBrandSerif}>{businessName}</Text>
      <Text style={S.specimenSerifItalic}>Editorial headlines, section titles, and pull quotes.</Text>
      <Text style={S.specimenSerifAccent}>Semibold for small accents only</Text>
    </View>
  )
}

function TypographySpecimens({ form }: { form: IdentityKitForm }) {
  const businessName = form.step1.businessName.trim() || 'Your business name'
  const order = typographySpecimenFamilies(form)
  const existing = form.step6.existingTypeface?.trim()
  return (
    <View style={S.typographySpecimenCard}>
      {order.map((kind, i) => (
        <View key={`${kind}-${i}`}>
          {i > 0 ? <View style={S.specimenSpacer} /> : null}
          {kind === 'inter' ? (
            <InterTypeSpecimen businessName={businessName} />
          ) : (
            <SerifTypeSpecimen businessName={businessName} />
          )}
        </View>
      ))}
      {existing ? (
        <Text style={S.specimenExistingNote}>
          You noted an existing typeface: {existing}. Samples above use the kit embed fonts; apply your licensed files
          in production.
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
  return (
    <View>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <Text style={S.typographySpecimenIntro}>
          Family names are set in Inter. Sample lines render each recommended face with your business name (typical for
          brand-standard PDFs).
        </Text>
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
  return (
    <View wrap={false}>
      <View style={[S.sectionBand, { backgroundColor: color }]}>
        <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
      </View>
      <View style={S.sectionBody}>
        <View style={S.paletteTwoColumnRow}>
          <View style={S.paletteTextColumn}>
            <Text style={S.sectionBodyText}>{body}</Text>
          </View>
          {swatches.length > 0 ? (
            <View style={S.paletteSwatchesColumn}>
              {swatches.map((hex, i) => (
                <View
                  key={hex}
                  style={[
                    S.paletteSwatchTile,
                    { backgroundColor: hex },
                    i === 0 ? { marginLeft: 0 } : {},
                  ]}
                >
                  <Text style={[S.paletteSwatchHexLabel, { color: onColor(hex) }]}>
                    {hex.toUpperCase()}
                  </Text>
                </View>
              ))}
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
        {bodyBlocks.map((b) => (
          <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
        ))}
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
        {voicePlaybookBlocks(form).map((b) => (
          <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
        ))}
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
          <SectionBlock key={b.heading} heading={b.heading} body={b.body} color={color} />
        ))}
        <PageFooterChrome />
      </Page>
    </Document>
  )
}
