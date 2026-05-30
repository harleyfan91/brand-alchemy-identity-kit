import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

import { assembleOfferLine, assembleTransformationLine, canonicalPaletteId, formatPaletteGuideHeader, migrateIdentityKitForm, paletteDescriptions, resolvePaletteDisplayName, type TouchpointId } from '@identity-kit/shared'

import {
  brandAnchorSentence,
  brandBriefBlocks,
  paletteColorRolesParagraph,
  quickStartBlocks,
  styleGuideBlocks,
  styleGuideVisualVoiceBridge,
  touchpointClusterFromForm,
  typographyFooterParts,
  typographySectionLead,
  typographySpecimenFamilies,
  typographySpecimenSlots,
  voicePlaybookBlocks,
  voicePlaybookCtaBodyForDepth,
  voicePlaybookToneVisualClosing,
} from './deterministic/coreAssembly.js'
import { depthBriefBlocks } from './deterministic/depthBriefBlocks.js'
import { depthStyleGuideBlocks } from './deterministic/depthStyleGuideBlocks.js'
import { depthVoicePlaybookBlocks } from './deterministic/depthVoicePlaybookBlocks.js'
import { collectKitContentBlockBodies, overlapsGuideString } from './deterministic/depthDocCommon.js'
import { collectGuideReaderFacingStrings } from './deterministic/guideReaderFacingStrings.js'
import {
  buildBrandIdentityGuideModel,
  composeColorSummary,
  extractColonLeadLines,
  extractPlainSentenceLines,
  isQualifyingBeforeAfterPair,
  paletteContrastBlocks,
  selectPositioningTrustCue,
  visualPaletteSwatches,
  visualPaletteSwatchesWithRoles,
  type PositioningTrustCueContext,
} from './deterministic/brandIdentityGuideModel.js'
import {
  COLOR_SUMMARY_STYLE_ADJECTIVES,
  COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE,
} from './deterministic/colorSummary.js'
import { friendlyColorName, hexToRgb, relativeLuminance } from './deterministic/colorContrast.js'
import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from './fixtures/loadPersonaFixture.js'
import { getBrandIdentityGuidePdfFontFamilies } from './pdf/kitDocumentFonts.js'
import { fifthKitHomeColor, paletteAccentHex } from './pdf/CoreKitDocuments.js'
import { renderBrandIdentityGuidePdf, renderCoreKitPdfs, renderRedoStyleDummyGuidePdf } from './pdf/renderCoreKitPdfs.js'

/**
 * Core PDF regression tests. When adding or changing deterministic path behavior, update
 * OUTPUT_TRANSLATION_SPEC.md §3.3 (Path Class Catalog) and §3.3.1 (Path recipes) and add
 * tests here that pin the affected PC-* contract.
 */

function parseBeforeAfter(body: string): { label: string; before: string; after: string }[] {
  return body
    .split('\n\n')
    .map((block) => block.split('\n'))
    .filter((lines) => lines.length >= 3)
    .map((lines) => ({
      label: lines[0] ?? '',
      before: (lines[1] ?? '').replace(/^Before:\s*"?/, '').replace(/"$/, ''),
      after: (lines[2] ?? '').replace(/^After:\s*"?/, '').replace(/"$/, ''),
    }))
}

function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString('latin1')
  return (text.match(/\/Type\s*\/Page\b/g) ?? []).length
}

function makeTrustContext(
  overrides: Partial<PositioningTrustCueContext> = {},
): PositioningTrustCueContext {
  return {
    businessName: 'Acme',
    differentiator: undefined,
    emphasis: 'visual',
    collaboratorBody: undefined,
    feelLine: 'It should feel calm and clear.',
    industry: 'creative_services',
    customerArchetype: 'Busy Homeowners',
    painPoints: undefined,
    desiredOutcomes: undefined,
    competitors: [],
    contentDensityBias: 0,
    ...overrides,
  }
}

describe('loadPersonaFixture', () => {
  it('loads coffee-founder with expected business and narrator', () => {
    const form = loadPersonaFixture('coffee-founder')
    expect(form.step1.businessName).toBe('Harbor Row Coffee')
    expect(form.step1.brandNarrator).toBe('solo_maker')
    expect(form.step1.industry).toBe('food_beverage')
  })

  it('loads established-pro with professional tone and established stage', () => {
    const form = loadPersonaFixture('established-pro')
    expect(form.step3.tonePreset).toBe('professional')
    expect(form.step1.stage).toBe('established')
  })
})

describe('fifthKitHomeColor (Pro Content Starter Pack)', () => {
  it('averages palette swatches at index 1 and 2 when there is no fifth swatch', () => {
    // midnight_luxe: #222333 + #7A6A4F → #4E4741
    expect(fifthKitHomeColor('midnight_luxe')).toBe('#4E4741')
  })
})

describe('paletteAccentHex', () => {
  it('uses the third swatch for midnight_luxe (matches Step6 palette order)', () => {
    expect(paletteAccentHex('midnight_luxe')).toBe('#7A6A4F')
  })

  it('uses the third swatch for expanded palettes (mirrors visualDirection)', () => {
    expect(paletteAccentHex('arctic_blue')).toBe('#89B4E8')
    expect(paletteAccentHex('coastal_teal')).toBe('#22D3EE')
    expect(paletteAccentHex('bubblegum_pulse')).toBe('#FDA4AF')
    expect(paletteAccentHex('rose_dusk')).toBe('#FB7185')
  })

  it('falls back to the third swatch of the grayscale fallback for unknown palette ids', () => {
    // Fallback palette is ['#111111', '#555555', '#999999', '#EEEEEE']; third swatch = '#999999'
    expect(paletteAccentHex('unknown_palette')).toBe('#999999')
  })
})

describe('Core deterministic PDFs', () => {
  it('produces four non-empty PDF buffers with PDF magic bytes', async () => {
    const form = loadCoreSampleFixture()
    const pdfs = await renderCoreKitPdfs(form)

    const keys = ['brandBrief', 'styleGuide', 'voicePlaybook', 'quickStart'] as const
    for (const name of keys) {
      const buf = pdfs[name]
      expect(buf, `${name} missing`).toBeDefined()
      expect(buf.length).toBeGreaterThan(500)
      expect(buf.subarray(0, 4).toString('utf8')).toBe('%PDF')
    }
  })

  it('is deterministic for the same fixture (byte length stable)', async () => {
    const form = loadCoreSampleFixture()
    const a = await renderCoreKitPdfs(form)
    const b = await renderCoreKitPdfs(form)
    expect(a.brandBrief.length).toBe(b.brandBrief.length)
    expect(a.styleGuide.length).toBe(b.styleGuide.length)
  })

  it('renders a prototype Brand Identity Guide from legacy fixtures', async () => {
    const form = loadCoreSampleFixture()
    const pdf = await renderBrandIdentityGuidePdf(form)
    expect(pdf.length).toBeGreaterThan(500)
    expect(pdf.subarray(0, 4).toString('utf8')).toBe('%PDF')
    expect(countPdfPages(pdf)).toBe(6)
  })

  /**
   * Regression guard for Folio 04 layout: the new transmutation-arc band must not
   * push the brand identity guide past 6 pages for any of the canonical personas.
   */
  it.each(['default', 'coffee-founder', 'established-pro', 'community-org', 'cta-mixed', 'lean-core'] as const)(
    'brand identity guide stays at 6 pages for persona %s',
    async (personaId) => {
      const form = loadPersonaFixture(personaId)
      const pdf = await renderBrandIdentityGuidePdf(form)
      expect(countPdfPages(pdf)).toBe(6)
    },
  )

  it('renders the Redo-style dummy guide prototype', async () => {
    const pdf = await renderRedoStyleDummyGuidePdf()
    expect(pdf.length).toBeGreaterThan(500)
    expect(pdf.subarray(0, 4).toString('utf8')).toBe('%PDF')
  })

  it('uses "Download on Google Fonts" CTA in the 02b rail renderer', () => {
    const source = readFileSync(new URL('./pdf/CoreKitDocuments.tsx', import.meta.url), 'utf8')
    expect(source).toMatch(/Download on Google Fonts/)
    expect(source).not.toMatch(/guideWordmarkRailDownloadsLabel/)
  })

  it('folio 03 reuses the two-column shell and supports triplet labels on the narrow column', () => {
    const source = readFileSync(new URL('./pdf/CoreKitDocuments.tsx', import.meta.url), 'utf8')
    expect(source).toMatch(/guideTwoColumnSpreadRow/)
    expect(source).toMatch(/guideTwoColumnNarrowCol/)
    expect(source).toMatch(/guideTwoColumnWideCol/)
    expect(source).toMatch(/label="Feel"/)
    expect(source).toMatch(/label="Vision"/)
    expect(source).toMatch(/label="Mission"/)
    expect(source).toMatch(/label="Promise"/)
    expect(source).toMatch(/label="What it stands for"/)
    expect(source).toMatch(/BRAND HEART/)
    expect(source).toMatch(/BRAND BEHAVIOR/)
    expect(source).toMatch(/guidePersonalityBrandHeartRoot/)
    expect(source).toMatch(/guidePersonalityHeartSectionRule/)
    expect(source).toMatch(/guidePersonalityQuotePanel/)
    expect(source).toMatch(/guidePersonalityTrustClose/)
    expect(source).toMatch(/guidePersonalityBehaviorRuleRow/)
    expect(source).not.toMatch(/guideColorSpreadRow\b/)
    expect(source).not.toMatch(/guideColorNarrativeCol\b/)
    expect(source).not.toMatch(/guideColorPaletteCol\b/)
  })

  it('Brand Identity Guide header display family resolves to Inter', () => {
    const families = getBrandIdentityGuidePdfFontFamilies()
    expect(families.displayFamily).toBe('Inter')
  })

  it('Phase 1 micro-glyph placements: folios 01/03/04 use the documented glyph map', () => {
    const source = readFileSync(new URL('./pdf/CoreKitDocuments.tsx', import.meta.url), 'utf8')

    expect(source).toMatch(/from '\.\/components\/MicroGlyph\.js'/)
    expect(source).toMatch(/from '\.\/tokens\/glyphTokens\.js'/)
    expect(source).toMatch(/const kitAccentColor = paletteAccentHex\(form\.step6\.selectedPalette\)/)

    /** Folio 01 — Core values is Tier A with kit accent */
    expect(source).toMatch(
      /label="Core values"[\s\S]{0,160}labelGlyph="spark_clarity"[\s\S]{0,160}labelAccentColor=\{kitAccentColor\}/,
    )

    /** Folio 03 — BRAND HEART glyph is heart_trust at the kit accent */
    expect(source).toMatch(/glyph="heart_trust"[\s\S]{0,200}accentColor=\{kitAccentColor\}/)

    /** Folio 03 — behavior rows use Tier B (neutral) with the three documented glyph ids */
    expect(source).toMatch(/'check_confidence'/)
    expect(source).toMatch(/'shield_reliability'/)
    expect(source).toMatch(/'target_focus'/)
    expect(source).toMatch(/color=\{GLYPH_STROKE_DEFAULT\}/)

    /** Folio 04 — Voice section labels use Tier A glyphs */
    expect(source).toMatch(
      /label="Traits"[\s\S]{0,200}labelGlyph="spark_clarity"[\s\S]{0,200}labelAccentColor=\{kitAccentColor\}/,
    )
    expect(source).toMatch(
      /label="What to talk about"[\s\S]{0,200}labelGlyph="chat_voice"[\s\S]{0,200}labelAccentColor=\{kitAccentColor\}/,
    )
    expect(source).toMatch(
      /label="Do \/ avoid"[\s\S]{0,200}labelGlyph="check_confidence"[\s\S]{0,200}labelAccentColor=\{kitAccentColor\}/,
    )
    expect(source).toMatch(
      /label="Calls to action"[\s\S]{0,220}labelGlyph="chat_voice"[\s\S]{0,220}labelAccentColor=\{kitAccentColor\}/,
    )

    /** Hero quote container does not host a MicroGlyph (Phase 1 hard constraint). */
    const heroBlock = source.match(/GuideSummaryQuotePanelWithRadial[\s\S]{0,400}/)
    expect(heroBlock?.[0]).toBeDefined()
    expect(heroBlock?.[0]).not.toMatch(/MicroGlyph/)

    /** Folio 03 wide-column quote panel (now gradient variant) does not host a MicroGlyph. */
    const personalityQuoteBlock = source.match(/GuidePersonalityQuotePanelWithRadial[\s\S]{0,500}/)
    expect(personalityQuoteBlock?.[0]).toBeDefined()
    expect(personalityQuoteBlock?.[0]).not.toMatch(/MicroGlyph/)
  })


  it('Folio 04 transmutation arc: imported once, rendered in a dedicated arc band above the bottom band, and uses the kit accent', () => {
    const source = readFileSync(new URL('./pdf/CoreKitDocuments.tsx', import.meta.url), 'utf8')

    /** Single canonical import path; no duplicates. */
    expect(source).toMatch(/from '\.\/components\/TransmutationArc\.js'/)
    const importMatches = source.match(/from '\.\/components\/TransmutationArc\.js'/g) ?? []
    expect(importMatches).toHaveLength(1)

    /** The arc band style is defined and used. */
    expect(source).toMatch(/guideVoiceArcBand:\s*\{/)

    /** Arc renders inside guideVoiceArcBand with the kit accent. */
    expect(source).toMatch(
      /<View style=\{S\.guideVoiceArcBand\}[\s\S]{0,160}<TransmutationArc[\s\S]{0,200}accentColor=\{kitAccentColor\}/,
    )

    /** The arc band sits BEFORE the bottom band in source order (i.e. above it on the page). */
    const bottomBandIdx = source.indexOf('S.guideVoiceBottomBand')
    const arcBandIdx = source.indexOf('S.guideVoiceArcBand')
    expect(bottomBandIdx).toBeGreaterThan(0)
    expect(arcBandIdx).toBeGreaterThan(0)
    expect(arcBandIdx).toBeLessThan(bottomBandIdx)

    /** Phase-2 abstract-accent infrastructure stays rolled back. */
    expect(source).not.toMatch(/from '\.\/accents\//)
    expect(source).not.toMatch(/AlchemyWatermark/)
    expect(source).not.toMatch(/TransmutationField/)
    expect(source).not.toMatch(/ConstellationField/)
  })

  it('Phase 1 micro-glyph system: existing alchemy strip files are untouched', () => {
    const stripCycleSrc = readFileSync(
      new URL('../../brand-assets/src/symbolStrip.ts', import.meta.url),
      'utf8',
    )
    expect(stripCycleSrc).toMatch(/STRIP_CENTER_LABEL = 'β△'/)
    expect(stripCycleSrc).toMatch(/STRIP_GLYPHS_PER_SIDE = 22/)

    const stripUiSrc = readFileSync(
      new URL('../../../apps/web/src/components/branding/AlchemySymbolStrip.tsx', import.meta.url),
      'utf8',
    )
    expect(stripUiSrc).toMatch(/export function AlchemySymbolStrip/)
    expect(stripUiSrc).not.toMatch(/MicroGlyph/)
  })
})

describe('Brand Identity Guide model', () => {
  it('migrates legacy fixtures with a default guide focus signal', () => {
    const migrated = migrateIdentityKitForm(loadCoreSampleFixture())
    expect(migrated.intakeSchemaVersion).toBeGreaterThanOrEqual(3)
    expect(migrated.step1.guideFocus).toBeTruthy()
  })

  it('routes emphasis toward voice when the guide focus is writing consistency', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.guideFocus = 'sound_more_consistent'
    form.step1.touchpoints = ['linkedin'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)

    expect(model.signals.emphasis).toBe('voice')
    expect(model.voice.rules.length).toBeGreaterThan(0)
  })

  it('assigns folios to the reader-ordered guide IA (Summary, Look [02a Color + 02b Typography], Personality, Voice, Examples)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)

    expect(model.summary.editorial.folio).toBe('01')
    expect(model.visual.editorial.folio).toBe('02a')
    expect(model.visual.typography.editorial.folio).toBe('02b')
    expect(model.positioning.editorial.folio).toBe('03')
    expect(model.voice.editorial.folio).toBe('04')
    expect(model.examples.editorial.folio).toBe('05')

    expect(model.positioning.editorial.layout).toBe('proseQuoteRail')
    expect(model.voice.editorial.layout).toBe('traitsSamples')
    expect(model.examples.editorial.layout).toBe('sampleShowcase')
    expect(model.visual.editorial.layout).toBe('visualSystemBoard')
    expect(model.visual.typography.editorial.layout).toBe('visualSystemBoard')
    expect(model.visual.editorial.navLabel).toBe('Look')
    expect(model.visual.typography.editorial.navLabel).toBe('Look')
    expect(model.positioning.editorial.dekMode).toBe('full')
    expect(model.positioning.editorial.navLabel).toBe('Personality')
    expect(model.positioning.editorial.figureLabel).toBeUndefined()
    if (model.positioning.storyNote) {
      expect(model.positioning.editorial.deck).toMatch(/feel|credibl|trust|reason/i)
    } else {
      expect(model.positioning.editorial.deck).toMatch(/feel|credibility|ground|come across|true about/i)
      expect(model.positioning.editorial.deck).not.toMatch(/handoff|rollout|contract|ship|first surface|touchpoint/i)
    }
    expect(model.positioning.editorial.deck).not.toMatch(/^use this page\b/i)
    expect(model.positioning.trustCue).toBeDefined()
    expect(['differentiator', 'collaborator', 'generic']).toContain(model.positioning.trustCue.kind)
    expect(model.visual.editorial.title).toBe('Your colors')
    expect(model.visual.typography.editorial.title).toBe('Your typography')
    expect(model.visual.editorial.figureLabel).toBeUndefined()
    expect(model.visual.swatches.length).toBeGreaterThan(0)
    expect(model.visual.typography.wordmarkColorBlocks.length).toBe(4)
  })

  it('maps guide emphasis to examples and look editorial density', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    base.step1.guideFocus = 'sound_more_consistent'
    const voiceEmphasis = buildBrandIdentityGuideModel(base)
    expect(voiceEmphasis.signals.emphasis).toBe('voice')
    expect(voiceEmphasis.examples.editorial.exampleDensity).toBe('high')
    expect(voiceEmphasis.examples.editorial.visualOccupancy).toBe('strong')
    expect(voiceEmphasis.voice.editorial.visualOccupancy).toBe('strong')

    base.step1.guideFocus = 'look_more_professional'
    const visualEmphasis = buildBrandIdentityGuideModel(base)
    expect(visualEmphasis.signals.emphasis).toBe('visual')
    expect(visualEmphasis.examples.editorial.exampleDensity).toBe('low')
    expect(visualEmphasis.visual.editorial.visualOccupancy).toBe('strong')
    expect(visualEmphasis.voice.editorial.visualOccupancy).toBe('light')
  })

  it('exposes contentDensityBias from stage and touchpoint breadth', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    const sparse = buildBrandIdentityGuideModel(base)
    expect(sparse.signals.touchpointCount).toBe(1)
    expect(sparse.signals.contentDensityBias).toBe(-1)
    expect(sparse.voice.rules.length).toBeLessThanOrEqual(2)
    expect(sparse.voice.messagingAngles.length).toBeLessThanOrEqual(2)

    base.step1.stage = 'established'
    base.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    const rich = buildBrandIdentityGuideModel(base)
    expect(rich.signals.touchpointCount).toBe(4)
    expect(rich.signals.contentDensityBias).toBe(1)
  })

  it('trims guide density for compliance-heavy industries', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    base.step1.industry = 'legal_professional_services'
    base.step1.touchpoints = ['linkedin', 'instagram'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(base)
    expect(model.signals.touchpointCount).toBe(2)
    expect(model.signals.contentDensityBias).toBe(-1)
  })

  it('enriches guide density when voice sliders read highly expressive', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    base.step1.touchpoints = ['linkedin', 'instagram', 'website'] as TouchpointId[]
    base.step3.voiceSliders = {
      ...base.step3.voiceSliders,
      warmth: 85,
      energy: 85,
      playfulness: 85,
      formality: 40,
      directness: 40,
    }
    const model = buildBrandIdentityGuideModel(base)
    expect(model.signals.contentDensityBias).toBe(1)
  })

  it('includes a concise Quick Start pointer on the voice page bottom band', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.voice.bottomBand.title).toBe('')
    expect(model.voice.bottomBand.body).toMatch(
      /Not sure where to start\? See Week 1 in Quick Start\. Use this page as your voice reference\./i,
    )
    expect(model.voice.bottomBand.body.length).toBeLessThanOrEqual(100)
    expect(model.voice.bottomBand.body).not.toMatch(/guardrails?|off-brand|\bangles\b/i)
    expect(model.voice.bottomBand.body).not.toMatch(/\bspread\b/i)
  })

  it('maps Voice page Quick Start pointer week from guideFocus', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.guideFocus = 'look_more_professional'
    expect(buildBrandIdentityGuideModel(form).voice.bottomBand.body).toMatch(/Week 1/i)

    form.step1.guideFocus = 'sound_more_consistent'
    expect(buildBrandIdentityGuideModel(form).voice.bottomBand.body).toMatch(/Week 2/i)

    form.step1.guideFocus = 'know_what_to_fix_first'
    expect(buildBrandIdentityGuideModel(form).voice.bottomBand.body).toMatch(/Week 2/i)

    form.step1.guideFocus = 'give_clear_direction'
    expect(buildBrandIdentityGuideModel(form).voice.bottomBand.body).toMatch(/Week 4/i)
  })

  it('selects a positioning trust cue by priority: differentiator > collaborator > generic', () => {
    const feel = 'It should feel calm and clear.'
    const diff = selectPositioningTrustCue(makeTrustContext({
      differentiator: 'Pairs strategy with craft',
      emphasis: 'handoff',
      collaboratorBody: 'For a helper: read this page first.',
      feelLine: feel,
    }))
    expect(diff.kind).toBe('differentiator')
    expect(diff.label).toMatch(/edge/i)
    expect(diff.body).toContain('Pairs strategy')

    const collab = selectPositioningTrustCue(makeTrustContext({
      emphasis: 'handoff',
      collaboratorBody: 'For a helper: read this page first.',
      feelLine: feel,
    }))
    expect(collab.kind).toBe('collaborator')
    expect(collab.label).toMatch(/helping you/i)
    expect(collab.body).not.toMatch(/handoff/i)

    const generic = selectPositioningTrustCue(makeTrustContext({ feelLine: feel }))
    expect(generic.kind).toBe('generic')
    expect(generic.label).toMatch(/trust/i)
    expect(generic.body).toContain('Acme')
    expect(generic.body).toContain(feel)

    const genericNoFeel = selectPositioningTrustCue(makeTrustContext({ feelLine: undefined }))
    expect(genericNoFeel.kind).toBe('generic')
    expect(genericNoFeel.body).toContain('Acme')
  })

  it('positioning trust cue uses Step 2 outcomes and competitor context without adding raw lists', () => {
    const outcomeCue = selectPositioningTrustCue(makeTrustContext({
      desiredOutcomes: 'Book confidently without chasing three different providers.',
      customerArchetype: 'The Routine Upgrader',
    }))
    expect(outcomeCue.body).toMatch(/clearer path to book confidently/i)

    const competitorCue = selectPositioningTrustCue(makeTrustContext({
      feelLine: undefined,
      competitors: ['Large national chain', 'Budget marketplace'],
    }))
    expect(competitorCue.body).toMatch(/crowded category/i)
    expect(competitorCue.body).not.toMatch(/Large national chain|Budget marketplace/i)
  })

  it('positioning trust cue softens claims for compliance-sensitive industries', () => {
    const cue = selectPositioningTrustCue(makeTrustContext({
      feelLine: undefined,
      industry: 'legal_professional_services',
      competitors: ['Regional firm'],
    }))
    expect(cue.body).toMatch(/clear, careful, and easy to verify/i)
    expect(cue.body).toMatch(/careful claims/i)
    expect(cue.body).not.toMatch(/recognizable point of view/i)
  })

  it('story + differentiator: story wins as the framing body; oneLine backfill is suppressed', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    if (!form.step7.differentiation) form.step7.differentiation = 'Pairs strategy with craft'
    const model = buildBrandIdentityGuideModel(form)
    if (model.positioning.storyNote) {
      expect(model.positioning.oneLine).toBeUndefined()
    }
  })

  it('positioning keeps a signal-only feelLine on the model even when storyNote is present', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.guideFocus = 'look_more_professional'
    form.step3.tonePreset = 'professional'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.positioning.feelLine).toBeDefined()
    expect(model.positioning.feelLine).toMatch(/should feel/i)
  })

  it('positioning.feelAdjectives composes up to 3 deterministic adjectives from tonePreset + sliders', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step3.tonePreset = 'friendly'
    form.step3.voiceSliders = {
      formality: 40,
      energy: 60,
      directness: 75,
      warmth: 80,
      playfulness: 50,
    }
    const model = buildBrandIdentityGuideModel(form)
    expect(Array.isArray(model.positioning.feelAdjectives)).toBe(true)
    expect(model.positioning.feelAdjectives.length).toBeGreaterThan(0)
    expect(model.positioning.feelAdjectives.length).toBeLessThanOrEqual(3)
    expect(model.positioning.feelAdjectives).toEqual([...new Set(model.positioning.feelAdjectives)])
    for (const word of model.positioning.feelAdjectives) {
      expect(word).toMatch(/^[a-z]+$/)
    }
    expect(model.positioning.feelAdjectives[0]).toBe('warm')
  })

  it('positioning.behavior adds compact brand behavior lines from voice and trust signals', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step3.tonePreset = 'bold'
    form.step2.desiredOutcomes = 'Feel confident booking the first appointment.'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.positioning.behavior.showsUpAs).toMatch(/shows up as/i)
    expect(model.positioning.behavior.avoids).toMatch(/avoids/i)
    expect(model.positioning.behavior.earnsTrustBy).toMatch(/earns trust by making the path to feel confident booking/i)
  })

  it('positioning.standsForLine prefers a concrete missionStatement over narrator fallback', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    form.step4.missionStatement =
      'Help local families build routines that stick with coaching they can afford.'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).not.toBe(-1)
    expect(model.positioning.standsForLine).toBe(
      'Help local families build routines that stick with coaching they can afford.',
    )
  })

  it('positioning.standsForLine falls back to step5.motivation when mission is missing', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    form.step4.missionStatement = ''
    form.step5.motivation =
      'Families were burning out juggling schedules and deserved a calm weekly rhythm.'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).not.toBe(-1)
    expect(model.positioning.standsForLine).toBe(
      'Families were burning out juggling schedules and deserved a calm weekly rhythm.',
    )
  })

  it('positioning.standsForLine falls back to narrator dictionary when mission and motivation are both absent', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    form.step4.missionStatement = ''
    form.step5.motivation = ''
    form.step1.brandNarrator = 'solo_expert'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).not.toBe(-1)
    expect(model.positioning.standsForLine).toBeDefined()
    expect(model.positioning.standsForLine).toMatch(/one-person expertise brand/i)
  })

  it('positioning.standsForLine keeps a short intake-derived line when contentDensityBias === -1', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.stage = 'idea'
    form.step1.industry = 'legal_professional_services'
    form.step1.touchpoints = ['website']
    form.step4.missionStatement = 'Help local families make calm decisions before the problem gets bigger.'
    form.step5.motivation = ''
    form.step3.voiceSliders = {
      formality: 90,
      energy: 30,
      directness: 90,
      warmth: 30,
      playfulness: 10,
    }
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).toBe(-1)
    expect(model.positioning.standsForLine).toBe(
      'Help local families make calm decisions before the problem gets bigger.',
    )
  })

  it('positioning.standsForLine still omits narrator fallback when contentDensityBias === -1', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.stage = 'idea'
    form.step1.industry = 'legal_professional_services'
    form.step1.touchpoints = ['website']
    form.step4.missionStatement = ''
    form.step5.motivation = ''
    form.step3.voiceSliders = {
      formality: 90,
      energy: 30,
      directness: 90,
      warmth: 30,
      playfulness: 10,
    }
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).toBe(-1)
    expect(model.positioning.standsForLine).toBeUndefined()
  })

  it('positioning.editorialTriplet composes Vision/Mission/Promise on non-sparse fixtures', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    form.step4.missionStatement =
      'Build reliable neighborhood support so families can access food without extra friction.'
    form.step5.motivation =
      'We saw volunteers and households working hard with too little coordination week to week.'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).not.toBe(-1)
    expect(model.positioning.editorialTriplet).toBeDefined()
    expect(model.positioning.editorialTriplet?.vision).toBeTruthy()
    expect(model.positioning.editorialTriplet?.mission).toBeTruthy()
    expect(model.positioning.editorialTriplet?.promise).toBeTruthy()
  })

  it('positioning.editorialTriplet enforces one em-dash max across all three lines', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const triplet = model.positioning.editorialTriplet
    expect(triplet).toBeDefined()
    const merged = `${triplet?.vision ?? ''} ${triplet?.mission ?? ''} ${triplet?.promise ?? ''}`
    const emDashCount = (merged.match(/—/g) ?? []).length
    expect(emDashCount).toBeLessThanOrEqual(1)
  })

  it('positioning.editorialTriplet is omitted when contentDensityBias === -1', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.stage = 'idea'
    form.step1.industry = 'legal_professional_services'
    form.step1.touchpoints = ['website']
    form.step3.voiceSliders = {
      formality: 90,
      energy: 30,
      directness: 90,
      warmth: 30,
      playfulness: 10,
    }
    const model = buildBrandIdentityGuideModel(form)
    expect(model.signals.contentDensityBias).toBe(-1)
    expect(model.positioning.editorialTriplet).toBeUndefined()
  })
})

describe('Brand Identity Guide extractors', () => {
  it('extractColonLeadLines takes colon-lead lines after the first blank paragraph', () => {
    const body = [
      'Messaging themes describe recurring topics and angles for the brand.',
      '',
      'Expertise: in creative services, lead with portfolio clarity and process transparency.',
      'Context: name the trade-offs most clients hit first.',
      'Proof: tie every claim to one live example.',
      '',
      'Industry vocabulary: portfolio, process, creative direction.',
      'Steer around: guru, ninja, disrupt.',
    ].join('\n')
    const lines = extractColonLeadLines(body, 3)
    expect(lines).toHaveLength(3)
    expect(lines[0]).toMatch(/creative services/i)
    expect(lines.every((line) => !/^industry vocabulary|^steer around/i.test(line))).toBe(true)
  })

  it('extractColonLeadLines returns [] when there are no matching lines', () => {
    const body = 'Plain paragraph without any colon lines at all.\n\nAnother paragraph.'
    expect(extractColonLeadLines(body, 3)).toEqual([])
  })

  it('extractPlainSentenceLines returns the first N non-empty lines', () => {
    const body = 'First sentence here.\n\nSecond sentence here.\nThird sentence here.\n'
    expect(extractPlainSentenceLines(body, 2)).toEqual(['First sentence here.', 'Second sentence here.'])
  })

  it('extractPlainSentenceLines on empty body returns an empty array', () => {
    expect(extractPlainSentenceLines('', 3)).toEqual([])
  })
})

describe('Brand Identity Guide before/after rubric', () => {
  it('rejects generic labels (Example / Pair / too short)', () => {
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Example 1',
        before: 'We help small businesses grow revenue.',
        after: 'Northline Studio helps small businesses grow revenue with one roadmap.',
      }),
    ).toBe(false)
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Pair',
        before: 'We help small businesses grow revenue.',
        after: 'Northline Studio helps small businesses grow revenue with one roadmap.',
      }),
    ).toBe(false)
    expect(
      isQualifyingBeforeAfterPair({
        label: 'AB',
        before: 'We help small businesses grow revenue.',
        after: 'Northline Studio helps small businesses grow revenue with one roadmap.',
      }),
    ).toBe(false)
  })

  it('rejects meta-commentary after lines', () => {
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Homepage subhead',
        before: 'We help small businesses grow revenue.',
        after: 'We position ourselves as the go-to partner for growth.',
      }),
    ).toBe(false)
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Homepage subhead',
        before: 'We help small businesses grow revenue.',
        after: 'The archetype for this brand is the guide who hands over the map.',
      }),
    ).toBe(false)
  })

  it('rejects synonym-only swaps (same first token, tiny edit distance)', () => {
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Service intro',
        before: 'We help small businesses grow revenue.',
        after: 'We help small businesses grow earnings.',
      }),
    ).toBe(false)
  })

  it('accepts a qualifying pair (different structure, concrete label)', () => {
    expect(
      isQualifyingBeforeAfterPair({
        label: 'Service intro rewrite',
        before: 'We help small businesses grow revenue.',
        after:
          'Northline Studio builds a one-page positioning plan for founders who need direct next steps.',
      }),
    ).toBe(true)
  })
})

describe('Brand Identity Guide model — cross-cutting contracts', () => {
  it('folio 03 voice.rules and folio 04 examples.doLines share no literal string', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const overlap = model.voice.rules.filter((rule) => model.examples.doLines.includes(rule))
    expect(overlap).toEqual([])
  })

  it('raises sample-phrase cap to the upper bound when no before/after pairs qualify', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.guideFocus = 'look_more_professional'
    form.step1.stage = 'idea'
    form.step1.touchpoints = ['instagram'] as TouchpointId[]
    form.step1.industry = 'creative_services'
    const narrow = buildBrandIdentityGuideModel(form)
    if (narrow.examples.beforeAfter.length === 0) {
      expect(narrow.examples.samplePhrases.length).toBeGreaterThan(3)
    }
  })

  it('folio 03 "What to talk about" extractor produces entries for the default fixture', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.voice.messagingAngles.length).toBeGreaterThan(0)
    for (const angle of model.voice.messagingAngles) {
      expect(angle).not.toMatch(/^industry vocabulary|^steer around/i)
    }
  })

  it('visual.typography.wordmarkColorBlocks renders four contrast-ranked palette pairs in descending contrast order', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const blocks = model.visual.typography.wordmarkColorBlocks
    expect(blocks.length).toBe(4)
    const swatchHexes = new Set(model.visual.swatches.map((s) => s.hex.toUpperCase()))
    for (const block of blocks) {
      expect(block.background).toMatch(/^#[0-9A-F]{6}$/i)
      expect(block.foreground).toMatch(/^#[0-9A-F]{6}$/i)
      expect(block.background.toUpperCase()).not.toBe(block.foreground.toUpperCase())
      expect(swatchHexes.has(block.background.toUpperCase())).toBe(true)
      expect(swatchHexes.has(block.foreground.toUpperCase())).toBe(true)
      expect(block.contrastRatio).toBeGreaterThanOrEqual(1.5)
    }
    const topContrast = blocks[0]!.contrastRatio
    const maxContrast = Math.max(...blocks.map((b) => b.contrastRatio))
    expect(topContrast).toBe(maxContrast)
    const u = (s: string) => s.toUpperCase()
    for (let i = 0; i < blocks.length; i += 1) {
      for (let j = i + 1; j < blocks.length; j += 1) {
        const a = blocks[i]!
        const b = blocks[j]!
        const isRev = u(a.background) === u(b.foreground) && u(a.foreground) === u(b.background)
        expect(isRev, `wordmark blocks ${i} and ${j} are chromatic reverses`).toBe(false)
      }
    }
  })

  it('visual.swatches keeps names unique within a palette even for very similar tones', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step6.selectedPalette = 'sand_dune'
    const model = buildBrandIdentityGuideModel(form)
    const names = model.visual.swatches.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
    expect(names.some((name) => /\s[12]$/.test(name))).toBe(false)
  })

  it('visual.typography.wordmarkColorBlocks avoids overusing one background when variance is available', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step6.selectedPalette = 'sand_dune'
    const model = buildBrandIdentityGuideModel(form)
    const blocks = model.visual.typography.wordmarkColorBlocks
    expect(blocks.length).toBeGreaterThanOrEqual(3)
    const counts = new Map<string, number>()
    for (const block of blocks) {
      const key = block.background.toUpperCase()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const maxUse = Math.max(...Array.from(counts.values()))
    expect(maxUse).toBeLessThanOrEqual(2)
    expect(counts.size).toBeGreaterThanOrEqual(2)
    if (blocks.length >= 4) {
      expect(blocks[0]!.background.toUpperCase()).not.toBe(blocks[2]!.background.toUpperCase())
      expect(blocks[1]!.background.toUpperCase()).not.toBe(blocks[3]!.background.toUpperCase())
    }
  })

  it('visual.typography.wordmarkColorBlocks includes a lightest-swatch background when a valid pair exists', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step6.selectedPalette = 'midnight_luxe'
    const model = buildBrandIdentityGuideModel(form)
    const blocks = model.visual.typography.wordmarkColorBlocks
    const withLum = model.visual.swatches.map((s) => ({
      hex: s.hex.toUpperCase(),
      lum: (() => {
        const rgb = hexToRgb(s.hex)
        return rgb ? relativeLuminance(rgb) : -1
      })(),
    }))
    const lightest = withLum.sort((a, b) => b.lum - a.lum)[0]?.hex
    expect(lightest).toBeDefined()
    expect(blocks.some((b) => b.background.toUpperCase() === lightest)).toBe(true)
  })

  it('visual.typography.typefaceSpecimens carries face metadata only (no brand name in model strings)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const specimens = model.visual.typography.typefaceSpecimens
    expect(specimens.length).toBe(model.visual.typography.specimens.length)
    expect(specimens.length).toBeGreaterThan(0)
    for (const specimen of specimens) {
      expect(specimen.faceLabel.length).toBeGreaterThan(0)
      expect(specimen.pdfFamily.length).toBeGreaterThan(0)
      expect(specimen.roleEyebrow.length).toBeGreaterThan(0)
      expect(Object.keys(specimen).sort()).toEqual(['faceLabel', 'pdfFamily', 'roleEyebrow'])
      expect(specimen.faceLabel).not.toContain(form.step1.businessName)
      expect(specimen.roleEyebrow).not.toContain(form.step1.businessName)
    }
  })

  it('visual.typography drops wordmarkBrandName + weightLadder so the brand name is no longer the type sample', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect((model.visual.typography as unknown as Record<string, unknown>).weightLadder).toBeUndefined()
    expect((model.visual.typography as unknown as Record<string, unknown>).wordmarkBrandName).toBeUndefined()
  })

  it('visual model drops applicationLead, applicationBullets, and the application-reference figure label', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect((model.visual as unknown as Record<string, unknown>).applicationLead).toBeUndefined()
    expect((model.visual as unknown as Record<string, unknown>).applicationBullets).toBeUndefined()
    expect(model.visual.editorial.figureLabel).toBeUndefined()
  })

  it('summary.oneLine is a short paste-able sentence derived from the anchor', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.summary.oneLine.length).toBeGreaterThan(0)
    expect(model.summary.oneLine).not.toMatch(/The voice stays/i)
    expect(model.summary.oneLine).toContain(form.step1.businessName)
    expect(model.summary.oneLine.split('.').filter((s) => s.trim().length > 0).length).toBeLessThanOrEqual(2)
    expect(model.summary.oneLine.length).toBeLessThanOrEqual(model.summary.anchor.length)
  })

  it('positioning.oneLine surfaces on Trust & story only when no storyNote is present', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    if (model.positioning.storyNote) {
      expect(model.positioning.oneLine).toBeUndefined()
    } else {
      expect(model.positioning.oneLine).toBe(model.summary.oneLine)
    }
  })

  it('visual.swatches surfaces equally-sized swatches with friendly names and no role / flex prescription', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.visual.swatches.length).toBeGreaterThan(0)
    const seenHex = new Set<string>()
    for (const swatch of model.visual.swatches) {
      expect(swatch.hex).toMatch(/^#[0-9A-F]{6}$/i)
      expect(swatch.name.length).toBeGreaterThan(0)
      const keys = Object.keys(swatch)
      expect(keys.sort()).toEqual(['hex', 'name'])
      seenHex.add(swatch.hex.toUpperCase())
    }
    expect(seenHex.size).toBe(model.visual.swatches.length)
  })

  it('visual.summary composes system character + usage discipline', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)

    expect(model.visual.summary.paletteName.length).toBeGreaterThan(0)
    expect(model.visual.summary.systemCharacter.length).toBeGreaterThan(0)
    expect(model.visual.summary.usageDiscipline.length).toBeGreaterThan(0)

    expect(model.visual.summary.paletteName).toBe(resolvePaletteDisplayName(model.visual.paletteId))
    expect(model.visual.summary.paletteName).not.toMatch(/\.$/)
    expect(formatPaletteGuideHeader(model.visual.paletteId).toUpperCase()).toBe(
      `PALETTE: ${model.visual.summary.paletteName.toUpperCase()}`,
    )

    const descriptor = paletteDescriptions[canonicalPaletteId(model.visual.paletteId)]
    if (descriptor) {
      expect(model.visual.summary.systemCharacter.startsWith(descriptor)).toBe(true)
    }

    // Para 1 closes with the templated tonal-arc sentence (no "accent" leftover)
    expect(model.visual.summary.systemCharacter).toMatch(/ opens the page up\.$/)

    // Para 2 is the (tone, style) discipline dictionary entry verbatim
    const expectedDiscipline =
      COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE[form.step3.tonePreset]?.[form.step6.selectedStyle]
    expect(expectedDiscipline).toBeDefined()
    expect(model.visual.summary.usageDiscipline).toBe(expectedDiscipline)

    // Capitalized role nouns are banned on 02a strings
    const roleNouns = /\b(Primary|Supporting|Accent|Canvas)\b/
    expect(model.visual.summary.systemCharacter).not.toMatch(roleNouns)
    expect(model.visual.summary.usageDiscipline).not.toMatch(roleNouns)

    // Lowercase "accent" is also retired from 02a copy (leftover from role taxonomy)
    expect(model.visual.summary.systemCharacter).not.toMatch(/\baccent\b/i)
    expect(model.visual.summary.usageDiscipline).not.toMatch(/\baccent\b/i)
    for (const tone of Object.keys(COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE)) {
      const row = COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE[tone]!
      for (const style of Object.keys(row)) {
        expect(row[style], `[${tone} × ${style}] dictionary entry must not say "accent"`).not.toMatch(/\baccent\b/i)
      }
    }

    // Em-dashes are capped at one across the combined 02a summary block (Para 1 + Para 2 read as one
    // visible chunk in the narrow column). Catches the regression that motivated the cleanup: two
    // em-dashes stacked across the two paragraphs read as AI-generated copy.
    const combined02a = `${model.visual.summary.systemCharacter} ${model.visual.summary.usageDiscipline}`
    const combinedEmDashCount = (combined02a.match(/—/g) || []).length
    expect(combinedEmDashCount, `02a summary block has too many em-dashes: ${combined02a}`).toBeLessThanOrEqual(1)

    // Word-count sanity (redo Para 1 ~30-50 words; Para 2 ~30-45 words)
    const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
    expect(wordCount(model.visual.summary.systemCharacter)).toBeLessThanOrEqual(60)
    expect(wordCount(model.visual.summary.usageDiscipline)).toBeLessThanOrEqual(50)

    // Composer is pure with respect to its inputs
    const direct = composeColorSummary({
      paletteId: model.visual.paletteId,
      tonePreset: form.step3.tonePreset,
      selectedStyle: form.step6.selectedStyle,
      swatches: model.visual.swatches,
    })
    expect(direct.paletteName).toBe(model.visual.summary.paletteName)
    expect(direct.systemCharacter).toBe(model.visual.summary.systemCharacter)
    expect(direct.usageDiscipline).toBe(model.visual.summary.usageDiscipline)

    // The style-driven adjective appears in the tonal-arc closer
    const styleAdj = COLOR_SUMMARY_STYLE_ADJECTIVES[form.step6.selectedStyle]
    if (styleAdj) {
      expect(direct.systemCharacter).toMatch(new RegExp(`keeps the system ${styleAdj}`))
    }
  })

  it('visual.editorial drops the page deck on folio 02a', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.visual.editorial.folio).toBe('02a')
    expect(model.visual.editorial.dekMode).toBe('none')
    expect(model.visual.editorial.deck).toBeUndefined()
  })

  it('visual model retires paletteMood, paletteRolesProse, and paletteRoleLines on the guide path', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect((model.visual as unknown as Record<string, unknown>).paletteMood).toBeUndefined()
    expect((model.visual as unknown as Record<string, unknown>).paletteRolesProse).toBeUndefined()
    expect((model.visual as unknown as Record<string, unknown>).paletteRoleLines).toBeUndefined()
    expect(model.visual.visualCaption.length).toBeGreaterThan(0)
  })

  it('visual.typography.applications has one face+use row per registered specimen', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.visual.typography.applications.length).toBe(model.visual.typography.specimens.length)
    for (const app of model.visual.typography.applications) {
      expect(app.face.length).toBeGreaterThan(0)
      expect(app.use.length).toBeGreaterThan(0)
      expect(app.use).not.toBe(app.use.toUpperCase())
    }
  })

  it('visual.typography.wordmarkBandRail uses options framing with preferred default guidance', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const rail = model.visual.typography.wordmarkBandRail
    expect(rail.fontIntro.length).toBeGreaterThan(20)
    expect(rail.fontIntro).toMatch(/Outfit/i)
    expect(rail.fontIntro).toMatch(/^This set of fonts/i)
    expect(rail.fontIntro).not.toMatch(/^This type system/i)
    expect(rail.wordmarkIntro).toMatch(/approved/i)
    expect(rail.wordmarkIntro).toMatch(/default/i)
    expect(rail.wordmarkIntro).toMatch(/only when|when .*needs it|calls for/i)
    expect(rail.wordmarkIntro).toMatch(/without a custom logo/i)
    expect(rail.wordmarkIntro).not.toMatch(/logo lockup|tiles?|slots?|variant/i)
    expect(rail.downloadLinks.length).toBeGreaterThanOrEqual(1)
    for (const link of rail.downloadLinks) {
      expect(link.href).toMatch(/^https:\/\/fonts\.google\.com\/specimen\//)
      expect(link.label.length).toBeGreaterThan(0)
    }
    expect(rail.licensing).toMatch(/distributor|licensing|terms/i)
  })

  it('visual.typography.wordmarkBandRail uses existing-typeface intro on Pro when existingTypeface is set', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.tier = 'pro'
    form.step6.existingTypeface = 'Montserrat for all headings'
    const model = buildBrandIdentityGuideModel(form)
    const rail = model.visual.typography.wordmarkBandRail
    expect(rail.fontIntro).toMatch(/Montserrat/i)
    expect(rail.fontIntro).toMatch(/^This set of fonts/i)
    expect(rail.fontIntro).toMatch(/stand-ins|licensed/i)
  })

  it('examples.ctaTemplates has 2-3 plain-language copy-ready lines and no voice.ctaPatterns leftover', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaTemplates.length).toBeGreaterThanOrEqual(2)
    expect(model.examples.ctaTemplates.length).toBeLessThanOrEqual(3)
    expect((model.voice as unknown as Record<string, unknown>).ctaPatterns).toBeUndefined()
    for (const line of model.examples.ctaTemplates) {
      expect(line.length).toBeGreaterThan(0)
      expect(line).not.toMatch(/\btouchpoint\b|\brollout\b|\bfirst surface\b/i)
    }
  })

  it('examples.ctaTemplates shape follows primaryGoal', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.primaryGoal = 'lead_gen'
    const leadGen = buildBrandIdentityGuideModel(form)
    expect(leadGen.examples.ctaTemplates.some((line) => /project|intro call|details/i.test(line))).toBe(true)

    form.step1.primaryGoal = 'direct_sales'
    const sales = buildBrandIdentityGuideModel(form)
    expect(sales.examples.ctaTemplates.some((line) => /shop|order|grab|cart|book|estimate|reserve|browse/i.test(line))).toBe(true)

    form.step1.primaryGoal = 'audience_growth'
    const growth = buildBrandIdentityGuideModel(form)
    expect(growth.examples.ctaTemplates.some((line) => /subscribe|join|follow/i.test(line))).toBe(true)

    form.step1.primaryGoal = 'retention'
    const retain = buildBrandIdentityGuideModel(form)
    expect(retain.examples.ctaTemplates.some((line) => /pick up|left off|visit|continue|spot|members|month/i.test(line))).toBe(true)
  })

  it('examples.ctaSurfaces differentiates Instagram vs LinkedIn and uses touchpoint labels as the social module title', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    base.step1.touchpoints = ['instagram'] as TouchpointId[]
    base.step1.primaryGoal = 'lead_gen'
    const ig = buildBrandIdentityGuideModel(base)

    base.step1.touchpoints = ['linkedin'] as TouchpointId[]
    const li = buildBrandIdentityGuideModel(base)

    const igSocial = ig.examples.ctaSurfaces.find((s) => s.id === 'social')
    const liSocial = li.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(igSocial?.label).toBe('Instagram')
    expect(liSocial?.label).toBe('LinkedIn')
    expect(igSocial?.lines.join(' | ')).not.toBe(liSocial?.lines.join(' | '))
  })

  it('established-pro persona (LinkedIn only) yields one folio 05 CTA surface', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('established-pro'))
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaSurfaces).toHaveLength(1)
    expect(model.examples.ctaSurfaces[0]?.id).toBe('social')
    expect(model.examples.ctaSurfaces[0]?.label).toBe('LinkedIn')
  })

  it('folio 05 skips professional social surface for direct_sales (intentional bank gap)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['linkedin'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'social')).toBeUndefined()
  })

  it('folio 05 skips Google directory for audience_growth (intentional bank gap)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['google_business', 'instagram'] as TouchpointId[]
    form.step1.primaryGoal = 'audience_growth'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'directory')).toBeUndefined()
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'social')).toBeDefined()
  })

  it('folio 05 skips Yelp-class directory for lead_gen (intentional bank gap)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['yelp', 'instagram'] as TouchpointId[]
    form.step1.primaryGoal = 'lead_gen'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'directory')).toBeUndefined()
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'social')).toBeDefined()
  })

  it('folio 05 keeps Yelp-class directory for direct_sales (not a gap)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['yelp', 'instagram'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'
    const model = buildBrandIdentityGuideModel(form)
    expect(model.examples.ctaSurfaces.find((s) => s.id === 'directory')).toBeDefined()
  })

  it('coffee-founder dual social surfaces use distinct CTA copy (feed vs story)', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    const model = buildBrandIdentityGuideModel(form)
    const social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    const story = model.examples.ctaSurfaces.find((s) => s.id === 'social_secondary')
    expect(social).toBeDefined()
    expect(story).toBeDefined()
    expect(social?.presentation?.frameId).toBe('social_grid_photo_v1')
    expect(story?.presentation?.frameId).toBe('social_story_v1')
    const feedCopy = social?.lines.join(' | ') ?? ''
    const storyCopy = story?.lines.join(' | ') ?? ''
    expect(feedCopy.length).toBeGreaterThan(0)
    expect(storyCopy.length).toBeGreaterThan(0)
    expect(feedCopy).not.toBe(storyCopy)
  })

  it('examples.ctaSurfaces.social includes in-context presentation frame id', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.frameId).toBe('social_link_preview_v1')
    expect(social?.presentation?.platformSummary).toMatch(/linkedin/i)
    expect(social?.presentation?.socialFeedVariant).toBe('professional_network_feed')
    expect(social?.presentation?.socialSurfaceFamily).toBe('link_preview')
  })

  it('examples.ctaSurfaces.social presentation lists platforms in intake order', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['instagram', 'linkedin', 'website'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.platformSummary).toBe('Instagram · LinkedIn')
    expect(social?.presentation?.frameId).toBe('social_grid_photo_v1')
    expect(social?.presentation?.socialSurfaceFamily).toBe('grid_photo')
  })

  it('examples.ctaSurfaces.social maps primary social id into story and reel frame families', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())

    form.step1.touchpoints = ['facebook'] as TouchpointId[]
    let model = buildBrandIdentityGuideModel(form)
    let social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.frameId).toBe('social_story_v1')
    expect(social?.presentation?.socialSurfaceFamily).toBe('story')

    form.step1.touchpoints = ['tiktok'] as TouchpointId[]
    model = buildBrandIdentityGuideModel(form)
    social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.frameId).toBe('social_reel_cover_v1')
    expect(social?.presentation?.socialSurfaceFamily).toBe('reel_cover')

    form.step1.touchpoints = ['pinterest'] as TouchpointId[]
    model = buildBrandIdentityGuideModel(form)
    social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.frameId).toBe('social_pin_standard_v1')
    expect(social?.presentation?.socialSurfaceFamily).toBe('pin_standard')

    form.step1.touchpoints = ['threads'] as TouchpointId[]
    model = buildBrandIdentityGuideModel(form)
    social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
    expect(social?.presentation?.frameId).toBe('social_text_only_v1')
    expect(social?.presentation?.socialSurfaceFamily).toBe('text_only')
  })

  it('examples.ctaSurfaces.marketplace includes in-context presentation frame id', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['marketplace_storefront', 'instagram'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const marketplace = model.examples.ctaSurfaces.find((s) => s.id === 'marketplace')
    expect(marketplace?.presentation?.frameId).toBe('marketplace_listing_v1')
    expect(marketplace?.presentation?.marketplaceSurfaceFamily).toBe('listing')
  })

  it('examples.ctaSurfaces.directory includes in-context presentation frame id', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['google_business'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const directory = model.examples.ctaSurfaces.find((s) => s.id === 'directory')
    expect(directory?.presentation?.frameId).toBe('directory_post_offer_v1')
    expect(directory?.presentation?.directorySurfaceFamily).toBe('post_offer')
  })

  it('examples.ctaSurfaces.directory uses sponsored listing shell for Yelp-class touchpoints', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['yelp'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'
    const model = buildBrandIdentityGuideModel(form)
    const directory = model.examples.ctaSurfaces.find((s) => s.id === 'directory')
    expect(directory?.presentation?.frameId).toBe('directory_sponsored_listing_v1')
    expect(directory?.presentation?.directorySurfaceFamily).toBe('sponsored_listing')
  })

  it('examples.ctaSurfaces.directory uses first directory touchpoint in intake order for frame selection', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.primaryGoal = 'direct_sales'
    form.step1.touchpoints = ['google_business', 'yelp'] as TouchpointId[]
    let model = buildBrandIdentityGuideModel(form)
    let directory = model.examples.ctaSurfaces.find((s) => s.id === 'directory')
    expect(directory?.presentation?.frameId).toBe('directory_post_offer_v1')

    form.step1.touchpoints = ['yelp', 'google_business'] as TouchpointId[]
    model = buildBrandIdentityGuideModel(form)
    directory = model.examples.ctaSurfaces.find((s) => s.id === 'directory')
    expect(directory?.presentation?.frameId).toBe('directory_sponsored_listing_v1')
  })

  it('examples.ctaSurfaces.email includes in-context presentation frame id', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['email_newsletter', 'website'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const email = model.examples.ctaSurfaces.find((s) => s.id === 'email')
    expect(email?.presentation?.frameId).toBe('email_text_only_v1')
    expect(email?.presentation?.emailSurfaceFamily).toBe('text_only')
  })

  it('examples.ctaSurfaces.website includes in-context presentation frame id', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['website'] as TouchpointId[]
    const model = buildBrandIdentityGuideModel(form)
    const website = model.examples.ctaSurfaces.find((s) => s.id === 'website')
    expect(website?.presentation?.frameId).toBe('website_hero_cta_v1')
    expect(website?.presentation?.websiteSurfaceFamily).toBe('hero')
  })

  it('examples.ctaSurfaces.email copy swaps by primary goal', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['email_newsletter'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'
    let model = buildBrandIdentityGuideModel(form)
    const directLines = model.examples.ctaSurfaces.find((s) => s.id === 'email')?.lines.join(' | ') ?? ''

    form.step1.primaryGoal = 'audience_growth'
    model = buildBrandIdentityGuideModel(form)
    const growthLines = model.examples.ctaSurfaces.find((s) => s.id === 'email')?.lines.join(' | ') ?? ''

    expect(directLines).not.toBe(growthLines)
    expect(directLines).toMatch(/reply|order|invoice|menu|link/i)
    expect(growthLines).toMatch(/reply|subscribe|yes|list|issue|newsletter/i)
  })

  it('examples.ctaSurfaces.email lead_gen includes explicit next-step expectation', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['email_newsletter'] as TouchpointId[]
    form.step1.primaryGoal = 'lead_gen'
    const model = buildBrandIdentityGuideModel(form)
    const lines = model.examples.ctaSurfaces.find((s) => s.id === 'email')?.lines.join(' | ') ?? ''
    expect(lines).toMatch(
      /focused next step|follow up within one business day|next step|proposal|business day|discovery|engagement|within|today|honest take|get back|same.day|good fit|personally|early.stage/i,
    )
  })

  it('examples.ctaSurfaces direct_sales uses softer pressure language for sensitive industries', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.touchpoints = ['email_newsletter'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'
    form.step1.industry = 'legal_professional_services'
    const model = buildBrandIdentityGuideModel(form)
    const lines = model.examples.ctaSurfaces.find((s) => s.id === 'email')?.lines.join(' | ') ?? ''
    expect(lines).not.toMatch(/limited|countdown|last chance|hurry/i)
    expect(lines).toMatch(/complimentary|confidential|obligation|honest read|next steps|consultation|no commitment|answer.*first|answers first/i)
  })

  it('examples.ctaSurfaces website lead_gen differs materially when industry group changes', () => {
    const base = migrateIdentityKitForm(loadCoreSampleFixture())
    base.step1.touchpoints = ['website'] as TouchpointId[]
    base.step1.primaryGoal = 'lead_gen'
    base.step1.industry = 'construction_trades'
    const trades = buildBrandIdentityGuideModel(base).examples.ctaSurfaces.find((s) => s.id === 'website')?.lines.join(' | ') ?? ''
    base.step1.industry = 'food_beverage'
    const food = buildBrandIdentityGuideModel(base).examples.ctaSurfaces.find((s) => s.id === 'website')?.lines.join(' | ') ?? ''
    expect(trades.length).toBeGreaterThan(0)
    expect(food.length).toBeGreaterThan(0)
    expect(trades).not.toBe(food)
  })

  it('examples.ctaSurfaces stays capped and disjoint from sample phrases / do lines', () => {
    const normalizeLineKey = (line: string) =>
      line
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[’']/g, "'")
        .replace(/[^\p{L}\p{N}\s'-]/gu, '')

    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'lean-core'] as const
    for (const persona of personas) {
      const form =
        persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      const model = buildBrandIdentityGuideModel(form)

      expect(model.examples.ctaSurfaces.length).toBeLessThanOrEqual(3)
      for (const surface of model.examples.ctaSurfaces) {
        expect(surface.lines.length).toBeGreaterThan(0)
        expect(surface.lines.length).toBeLessThanOrEqual(2)
      }

      const phraseKeys = new Set(model.examples.samplePhrases.map(normalizeLineKey))
      const doKeys = new Set(model.examples.doLines.map(normalizeLineKey))
      for (const surface of model.examples.ctaSurfaces) {
        for (const line of surface.lines) {
          const key = normalizeLineKey(line)
          expect(key.length, `[${persona}] empty CTA surface line`).toBeGreaterThan(0)
          expect(phraseKeys.has(key), `[${persona}] CTA surface line duplicated samplePhrases: ${line}`).toBe(
            false,
          )
          expect(doKeys.has(key), `[${persona}] CTA surface line duplicated doLines: ${line}`).toBe(false)
        }
      }
    }
  })

  it('examples.ctaSurfaces.email direct_sales diversifies wording across fixtures', () => {
    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'community-org', 'cta-mixed', 'lean-core'] as const
    const outputs = new Set<string>()

    for (const persona of personas) {
      const form = persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      form.step1.touchpoints = ['email_newsletter'] as TouchpointId[]
      form.step1.primaryGoal = 'direct_sales'
      const model = buildBrandIdentityGuideModel(form)
      const email = model.examples.ctaSurfaces.find((s) => s.id === 'email')
      outputs.add((email?.lines ?? []).join(' | '))
    }

    expect(outputs.size).toBeGreaterThanOrEqual(2)
  })

  it('examples.ctaSurfaces.social lead_gen diversifies wording across fixtures', () => {
    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'community-org', 'cta-mixed', 'lean-core'] as const
    const outputs = new Set<string>()

    for (const persona of personas) {
      const form = persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      form.step1.touchpoints = ['instagram', 'linkedin'] as TouchpointId[]
      form.step1.primaryGoal = 'lead_gen'
      const model = buildBrandIdentityGuideModel(form)
      const social = model.examples.ctaSurfaces.find((s) => s.id === 'social')
      outputs.add((social?.lines ?? []).join(' | '))
    }

    expect(outputs.size).toBeGreaterThanOrEqual(3)
  })

  it('reader-visible guide strings contain no banned vocabulary', () => {
    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'lean-core'] as const
    const bannedPatterns: RegExp[] = [
      /\bprimary touchpoint\b/i,
      /\bfirst surface\b/i,
      /\bstart with (?:linkedin|instagram|twitter|x\.com|facebook|youtube|tiktok|email|website|google|etsy|marketplace|email newsletter|your main channel)\b/i,
      /\bwhere to post first\b/i,
      /\bmain channel\b/i,
      /\bmain surface\b/i,
      /\bcore shift\b/i,
      /\bhandoff\b/i,
      /\brollout\b/i,
      /\btouchpoints?\b/i,
      /\bactive surfaces?\b/i,
      /\boff-brand\b/i,
      /\blogo lockup\b/i,
      /\btiles?\b/i,
      /\bslots?\b/i,
      /\bvariants?\b/i,
      /\bquick-start\b/i,
      /\bdeliverable\b/i,
      /\brubric\b/i,
      /\bmain friction\b/i,
      /\bbest[-\s]fit\b/i,
      /\bbest route\b/i,
      /\bnext move\b/i,
      /\bprioritize correctly\b/i,
    ]

    const collectStrings = (value: unknown, out: string[]) => {
      if (typeof value === 'string') {
        out.push(value)
        return
      }
      if (Array.isArray(value)) {
        for (const v of value) collectStrings(v, out)
        return
      }
      if (value && typeof value === 'object') {
        for (const v of Object.values(value)) collectStrings(v, out)
      }
    }

    for (const persona of personas) {
      const form =
        persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      const model = buildBrandIdentityGuideModel(form)
      const readerFacing = [
        model.summary.editorial.navLabel,
        model.summary.editorial.title,
        model.summary.editorial.deck,
        model.summary.editorial.figureLabel,
        model.summary.focusLead,
        model.summary.differentiator,
        model.summary.transformation,
        model.summary.whoItsFor,
        model.summary.whatWeDo,
        ...model.summary.guidingTraits,
        model.positioning.editorial.navLabel,
        model.positioning.editorial.title,
        model.positioning.editorial.deck,
        model.positioning.editorial.figureLabel,
        model.positioning.focusLead,
        model.positioning.feelLine,
        ...model.positioning.feelAdjectives,
        model.positioning.standsForLine,
        model.positioning.editorialTriplet?.vision,
        model.positioning.editorialTriplet?.mission,
        model.positioning.editorialTriplet?.promise,
        model.positioning.storyNote,
        model.positioning.behavior.showsUpAs,
        model.positioning.behavior.avoids,
        model.positioning.behavior.earnsTrustBy,
        model.positioning.trustCue.label,
        model.positioning.trustCue.body,
        model.voice.editorial.navLabel,
        model.voice.editorial.title,
        model.voice.editorial.deck,
        model.voice.editorial.figureLabel,
        ...model.voice.traits,
        ...model.voice.rules,
        ...model.voice.messagingAngles,
        model.voice.bottomBand.title,
        model.voice.bottomBand.body,
        model.examples.editorial.navLabel,
        model.examples.editorial.title,
        model.examples.editorial.figureLabel,
        ...model.examples.samplePhrases,
        ...model.examples.doLines,
        ...model.examples.avoidLines,
        ...model.examples.ctaTemplates,
        ...model.examples.ctaSurfaces.flatMap((surface) => [
          surface.label,
          ...surface.lines,
          ...(surface.presentation
            ? (Object.values(surface.presentation).filter(
                (v): v is string => typeof v === 'string' && v.length > 0,
              ) as string[])
            : []),
        ]),
        model.visual.editorial.navLabel,
        model.visual.editorial.title,
        model.visual.editorial.deck,
        model.visual.editorial.figureLabel,
        model.visual.visualCaption,
        ...model.visual.visualKeywords,
        model.visual.imageryDirection,
        model.visual.summary.systemCharacter,
        model.visual.summary.usageDiscipline,
        ...model.visual.swatches.map((swatch) => swatch.name),
        model.visual.typography.editorial.navLabel,
        model.visual.typography.editorial.title,
        model.visual.typography.editorial.deck,
        model.visual.typography.wordmarkBandRail.fontIntro,
        model.visual.typography.wordmarkBandRail.wordmarkIntro,
        model.visual.typography.wordmarkBandRail.licensing,
        ...model.visual.typography.applications.flatMap((app) => [app.face, app.use]),
        ...model.visual.typography.typefaceSpecimens.flatMap((specimen) => [
          specimen.faceLabel,
          specimen.roleEyebrow,
        ]),
      ].filter((s): s is string => typeof s === 'string' && s.length > 0)

      const extras: string[] = []
      collectStrings(model.examples.beforeAfter, extras)

      const haystack = [...readerFacing, ...extras]
      for (const str of haystack) {
        for (const pattern of bannedPatterns) {
          expect(str, `[${persona}] banned pattern ${pattern} matched in: ${str}`).not.toMatch(pattern)
        }
      }

      // Project-wide writing rule: at most one em-dash per "paragraph". A paragraph here is the
      // smallest reading unit — a blank-line block, a single line in a bullet list, or a single
      // sentence inside a multi-sentence string. Stacking two or more em-dashes in the same unit
      // reads as AI-generated copy. See OUTPUT_TRANSLATION_SPEC writing rules.
      for (const str of haystack) {
        for (const paragraph of str.split(/\n+|(?<=[.!?])\s+(?=[A-Z"'])/)) {
          const count = (paragraph.match(/—/g) || []).length
          expect(count, `[${persona}] >1 em-dash in paragraph: ${paragraph}`).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  it('guide page titles read as reader-owned labels, not instructions', () => {
    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'lean-core'] as const
    const titleSlotBanned: RegExp[] = [
      /^use this page\b/i,
      /\bin practice\b/i,
      /\bshould land\b/i,
      /^(build|show|use|pick)\b/i,
    ]
    for (const persona of personas) {
      const form =
        persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      const model = buildBrandIdentityGuideModel(form)
      const titles = [
        model.summary.editorial.title,
        model.visual.editorial.title,
        model.visual.typography.editorial.title,
        model.positioning.editorial.title,
        model.voice.editorial.title,
        model.examples.editorial.title,
      ]
      for (const title of titles) {
        for (const pattern of titleSlotBanned) {
          expect(
            title,
            `[${persona}] title-slot pattern ${pattern} matched in: ${title}`,
          ).not.toMatch(pattern)
        }
      }
    }
  })

  it('color page (02a) drops Primary / Supporting / Accent / Canvas role nouns from every reader-visible string', () => {
    const personas = ['core-sample', 'coffee-founder', 'established-pro', 'lean-core'] as const
    const roleNouns = /\b(Primary|Supporting|Accent|Canvas)\b/
    for (const persona of personas) {
      const form =
        persona === 'core-sample' ? loadCoreSampleFixture() : loadPersonaFixture(persona)
      const model = buildBrandIdentityGuideModel(form)
      const colorPageStrings = [
        model.visual.editorial.navLabel,
        model.visual.editorial.title,
        model.visual.editorial.deck,
        model.visual.editorial.figureLabel,
        model.visual.visualCaption,
        ...model.visual.visualKeywords,
        model.visual.imageryDirection,
        model.visual.summary.systemCharacter,
        model.visual.summary.usageDiscipline,
        ...model.visual.swatches.map((swatch) => swatch.name),
      ].filter((s): s is string => typeof s === 'string' && s.length > 0)
      for (const str of colorPageStrings) {
        expect(
          str,
          `[${persona}] role noun matched on 02a string: ${str}`,
        ).not.toMatch(roleNouns)
      }
    }
  })
})

describe('color helpers', () => {
  it('friendlyColorName labels deep blues as Navy/Indigo and pale blue-cyans as Sky', () => {
    expect(friendlyColorName('#0B1F3A')).toMatch(/Navy|Indigo|Blue/)
    expect(friendlyColorName('#D8ECF8')).toMatch(/Sky|Blue/)
  })

  it('friendlyColorName labels low-saturation colors as neutrals (Off White, Cream, Charcoal)', () => {
    expect(friendlyColorName('#F8F7F2')).toMatch(/Off White|Cream|Pale|Near|White/i)
    expect(friendlyColorName('#1A1A1C')).toMatch(/Near Black|Charcoal/)
    expect(friendlyColorName('#7C7C7C')).toMatch(/Stone|Gray/)
  })

  it('friendlyColorName produces an editorial label for saturated mid-range hues', () => {
    expect(friendlyColorName('#C0392B')).toMatch(/Red|Wine|Rust/)
    expect(friendlyColorName('#2E8B57')).toMatch(/Green|Moss|Forest/)
  })

  it('friendlyColorName maps muted warm hues to earth-tone names (not plain orange)', () => {
    expect(friendlyColorName('#A77C5D')).toMatch(/Caramel|Tan|Brown|Sand|Espresso/)
    expect(friendlyColorName('#A77C5D')).not.toMatch(/Orange/i)
    expect(friendlyColorName('#8F8170')).toMatch(/Caramel|Tan|Sand|Brown|Warm Gray|Stone/)
  })

  it('friendlyColorName maps muted mauves and olives to editorial families', () => {
    expect(friendlyColorName('#8A6F80')).toMatch(/Mauve|Mulberry|Plum|Dusty Rose/)
    expect(friendlyColorName('#A98C9B')).toMatch(/Mauve|Dusty Rose|Blush|Petal/)
    expect(friendlyColorName('#6E7757')).toMatch(/Olive|Moss|Sage|Pine/)
    expect(friendlyColorName('#8B9770')).toMatch(/Sage|Moss|Olive/)
  })

  it('friendlyColorName handles boundary hues for steel blue, teal/green, beige, and deep red-brown', () => {
    expect(friendlyColorName('#6F7F8F')).toMatch(/Blue|Indigo|Sky|Stone|Warm Gray/)
    expect(friendlyColorName('#4F6B6B')).toMatch(/Teal|Sage|Moss|Olive/)
    expect(friendlyColorName('#D9CFBF')).toMatch(/Cream|Sand|Off White|Warm Gray/)
    expect(friendlyColorName('#5A3E36')).toMatch(/Brown|Rust|Wine|Espresso|Caramel/)
  })

  it('paletteContrastBlocks returns up to four pairs in descending contrast order', () => {
    const blocks = paletteContrastBlocks([
      { hex: '#000000' },
      { hex: '#FFFFFF' },
      { hex: '#777777' },
      { hex: '#222244' },
    ])
    expect(blocks.length).toBeLessThanOrEqual(4)
    expect(blocks.length).toBeGreaterThan(0)
    const topContrast = blocks[0]!.contrastRatio
    const maxContrast = Math.max(...blocks.map((b) => b.contrastRatio))
    expect(topContrast).toBe(maxContrast)
    const top = blocks[0]!
    const topPair = [top.background.toUpperCase(), top.foreground.toUpperCase()].sort()
    expect(topPair).toEqual(['#000000', '#FFFFFF'])
    const u = (s: string) => s.toUpperCase()
    for (let i = 0; i < blocks.length; i += 1) {
      for (let j = i + 1; j < blocks.length; j += 1) {
        const a = blocks[i]!
        const b = blocks[j]!
        const isRev = u(a.background) === u(b.foreground) && u(a.foreground) === u(b.background)
        expect(isRev).toBe(false)
      }
    }
  })

  it('paletteContrastBlocks filters out near-identical pairs below 1.5:1', () => {
    const blocks = paletteContrastBlocks([{ hex: '#FFFFFF' }, { hex: '#FAFAFA' }])
    expect(blocks.length).toBe(0)
  })
})

describe('narrator-conditioned output', () => {
  it('Brand Brief first block heading is "Brand anchor" for the fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    expect(blocks[0].heading).toBe('Brand anchor')
  })

  it('Brand Brief anchor body includes businessName and anchor verb "helps" for solo_expert', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    expect(blocks[0].body).toContain('Northline Studio')
    expect(blocks[0].body).toContain('helps')
  })

  it('Brand Brief anchor resolves buyer archetype id to catalog title', () => {
    const form = loadCoreSampleFixture()
    form.step1.businessName = 'Test Studio'
    form.step1.industry = 'beauty_personal_care'
    form.step1.brandNarrator = 'solo_maker'
    form.step2.customerArchetype = 'routine_upgrader'
    const blocks = brandBriefBlocks(form)
    expect(blocks[0].body).toMatch(/Routine Upgrader/)
    expect(blocks[0].body).not.toContain('routine_upgrader')
  })

  it('Brand Brief uses normalized Step 1 builder copy and omits empty delivery phrasing', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const overview = blocks.find((b) => b.heading === 'Brand overview')
    const transformation = blocks.find((b) => b.heading === 'Core transformation')
    expect(overview?.body).toContain(assembleOfferLine(form.step1.offer, form.step1.industry))
    expect(overview?.body).not.toMatch(/\bthrough\b/i)
    expect(transformation?.body).toMatch(/move from|go from|turns|helps people get|helps people reach|The work moves/i)
  })

  it('Step 1 builders honor constrained Other values for uncovered industries', () => {
    const form = loadPersonaFixture('established-pro')
    expect(assembleOfferLine(form.step1.offer, form.step1.industry)).toContain(
      'regulatory readiness and documentation systems',
    )
    expect(assembleTransformationLine(form.step1.transformation, form.step1.industry)).toContain(
      'scrambling before every audit',
    )
  })

  it('Quick Start Week 1 body mentions "LinkedIn" for solo_expert fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    const w1 = blocks.find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('LinkedIn')
  })

  it('Quick Start Week 3 uses social_service checklist for default solo_expert fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')
    expect(w3?.body).toMatch(/LinkedIn cover|cover or header image/i)
    expect(w3?.body).toMatch(/slide template|presentations or proposals/i)
  })

  it('Quick Start Week 3 uses physical_first for food_beverage + solo_maker', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')
    expect(w3?.body).toMatch(/printed materials|storefront/i)
  })

  it('Quick Start Week 3 uses local_community for mission_community', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'mission_community'
    form.step1.industry = 'nonprofit_community'
    form.step1.businessOperatingModel = 'hybrid'
    form.step1.touchpoints = ['facebook', 'website'] as TouchpointId[]
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')?.body ?? ''
    expect(w3).toMatch(/Claim or complete your Google/i)
  })

  it('Quick Start Week 3 local_team without directory uses advisory directory copy and only user-selected profile surfaces', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    form.step1.industry = 'creative_services'
    form.step1.touchpoints = ['instagram', 'website'] as TouchpointId[]
    form.step1.businessOperatingModel = 'customer_visits_us'
    form.step1.primaryGoal = 'lead_gen'
    const w3 = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    expect(w3).toMatch(/Claim or complete your Google/i)
    expect(w3).not.toMatch(/Update your Google Business cover photo/i)
    expect(w3).toMatch(/Instagram/i)
    expect(w3).not.toMatch(/Facebook/i)
    expect(w3).toMatch(/printed materials|storefront|profile photo or avatar/i)
  })

  it('Quick Start Week 3 local_team with directory touchpoint keeps imperative directory cover line', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    form.step1.industry = 'creative_services'
    form.step1.touchpoints = ['google_business', 'instagram'] as TouchpointId[]
    const w3 = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    expect(w3).toMatch(/Update your Google cover photo/i)
    expect(w3).not.toMatch(/Claim or complete your Google Business profile/i)
  })

  it('Quick Start Week 1 local_team softens hours line when no directory touchpoint', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    form.step1.industry = 'creative_services'
    form.step1.touchpoints = ['instagram', 'website'] as TouchpointId[]
    form.step1.primaryGoal = 'lead_gen'
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')?.body ?? ''
    expect(w1).not.toMatch(/Confirm your business name, hours, and address/i)
    expect(w1).toMatch(/If you list hours, a location, or service area on any public profile/i)
  })

  it('Quick Start Week 1 local_team keeps hours line when directory touchpoint selected', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    form.step1.industry = 'creative_services'
    form.step1.touchpoints = ['google_business', 'instagram'] as TouchpointId[]
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')?.body ?? ''
    expect(w1).toMatch(/Confirm your business name, hours, and address/i)
  })

  it('Quick Start Week 3 uses digital_brand for product_led + creative_services', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'product_led'
    form.step1.industry = 'creative_services'
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')
    expect(w3?.body).toMatch(/hero or top-of-profile|Add a simple Website/i)
  })

  it('Quick Start Week 3 uses social_product for solo_maker + creative_services', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_maker'
    form.step1.industry = 'creative_services'
    form.step1.businessOperatingModel = 'online_only'
    form.step1.touchpoints = ['instagram', 'website'] as typeof form.step1.touchpoints
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')
    expect(w3?.body).toMatch(/Instagram profile image|highlight icons/i)
    expect(w3?.body).toMatch(/shop banner|listing images/i)
  })

  it('Voice Playbook includes a "Messaging themes" block', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const themes = blocks.find((b) => b.heading === 'Messaging themes')
    expect(themes).toBeDefined()
    expect(themes?.body.length).toBeGreaterThan(10)
  })

  it('Voice Playbook includes goal-aware CTA guidance with plain-language definition', () => {
    const form = loadCoreSampleFixture()
    form.step1.primaryGoal = 'lead_gen'
    const blocks = voicePlaybookBlocks(form)
    const cta = blocks.find((b) => b.heading === 'Calls to action (CTAs)')
    expect(cta).toBeDefined()
    expect(cta?.body).toMatch(/The line or button that asks the reader to do one specific thing next/i)
    expect(cta?.body).toMatch(/Get a quote|Book a consult|Request details/i)
    expect(cta?.body).not.toMatch(/Primary CTA style/i)
  })

  it('Voice Playbook Messaging themes opens with themes-vs-close framing', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const mt = blocks.find((b) => b.heading === 'Messaging themes')
    expect(mt?.body).toMatch(/recurring topics and angles/i)
    expect(mt?.body).toMatch(/Calls to action \(CTAs\) below/i)
  })

  it('Voice Playbook Sample phrases include usage note before quoted lines', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const sp = blocks.find((b) => b.heading === 'Sample phrases')
    expect(sp?.body).toMatch(/voice and rhythm/i)
    expect(sp?.body).toMatch(/Calls to action \(CTAs\) below/i)
  })

  it('Brand Brief Ideal customer includes pain and outcomes from fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const ic = blocks.find((b) => b.heading === 'Ideal customer')
    expect(ic?.body).toContain('Pain points:')
    expect(ic?.body).toContain('Desired outcomes:')
  })

  it('Brand Brief Values uses bullets and mission from fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const v = blocks.find((b) => b.heading === 'Values')
    expect(v?.body).toContain('•')
    expect(v?.body).toContain('Mission:')
  })

  it('Brand Brief generated summary blocks avoid unnecessary em dashes', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const overview = blocks.find((b) => b.heading === 'Brand overview')?.body ?? ''
    const story = blocks.find((b) => b.heading === 'Brand story angle')?.body ?? ''
    expect(overview).not.toContain('—')
    expect(story).not.toContain('—')
  })

  it('Brand Brief Differentiation includes differentiation copy and competitors', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const d = blocks.find((b) => b.heading === 'Differentiation')
    expect(d?.body).toContain('Generic template shops')
    expect(d?.body).toContain('Pairs strategy')
  })

  it('Brand Brief Brand story includes motivation from fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const s = blocks.find((b) => b.heading === 'Brand story angle')
    expect(s?.body).toContain('Saw peers struggle')
  })

  it('coffee-founder Brand anchor reads like a storefront brand, not a strategy deck', () => {
    const form = loadPersonaFixture('coffee-founder')
    const anchor = brandBriefBlocks(form).find((b) => b.heading === 'Brand anchor')?.body ?? ''
    expect(anchor).toMatch(/^Harbor Row Coffee is for neighbors/i)
    expect(anchor).toContain('Thoughtful hospitality')
    expect(anchor).not.toMatch(/The brand helps them|Harbor Row Coffee makes/i)
  })

  it('coffee-founder Ideal customer avoids internal strategist framing', () => {
    const form = loadPersonaFixture('coffee-founder')
    const ideal = brandBriefBlocks(form).find((b) => b.heading === 'Ideal customer')?.body ?? ''
    expect(ideal).not.toMatch(/For this buyer, the brand must/i)
    expect(ideal).toMatch(/They want to feel the care and craft/i)
  })

  it('coffee-founder Core transformation uses customer-facing phrasing', () => {
    const form = loadPersonaFixture('coffee-founder')
    const transformation = brandBriefBlocks(form).find((b) => b.heading === 'Core transformation')?.body ?? ''
    expect(transformation).toContain('Thoughtful hospitality')
    expect(transformation).not.toContain('stuck in a boring routine')
    expect(transformation).not.toMatch(/Moves customers from|Helps customers get/i)
  })

  it('Style Guide includes a "Where to apply this first" block mentioning the primary channel', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const usage = blocks.find((b) => b.heading === 'Where to apply this first')
    expect(usage).toBeDefined()
    expect(usage?.body).toContain('LinkedIn')
  })

  it('Style Guide "Palette" block contains prose description (not raw id)', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const palette = blocks.find((b) => b.heading === 'Palette')
    expect(palette).toBeDefined()
    // midnight_luxe should produce a prose description containing "near-blacks" or "Rich"
    expect(palette?.body).toMatch(/near-blacks|Rich|depth/)
  })

  it('paletteColorRolesParagraph is keyed per palette', () => {
    const mid = paletteColorRolesParagraph('midnight_luxe')
    expect(mid).toMatch(/near-black|primary/i)
    const unknown = paletteColorRolesParagraph('unknown_palette_xyz')
    expect(unknown).toMatch(/primary|Assign one swatch/i)
  })

  it('Style Guide Visual direction includes logo strategy note (default stage)', () => {
    const form = loadCoreSampleFixture()
    form.step1.stage = 'new'
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    expect(vd?.body).toMatch(/A note on your logo/i)
    expect(vd?.body).toMatch(/don't need a custom mark|do not need a custom mark/i)
  })

  it('Style Guide Visual direction softens logo note for established stage', () => {
    const form = loadCoreSampleFixture()
    form.step1.stage = 'established'
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    expect(vd?.body).toMatch(/finalized mark/i)
    expect(vd?.body).not.toMatch(/don't need a custom mark/i)
  })

  it('Style Guide Visual direction treats uploaded logo as primary mark with type fallbacks', () => {
    const form = loadCoreSampleFixture()
    form.step6.hasExistingBrand = true
    form.step6.existingBrand = { logoRef: 'pro-uploads/session/logo.png' }
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    expect(vd?.body).toMatch(/uploaded a logo|provided a logo/i)
    expect(vd?.body).toMatch(/primary mark|lead with that mark/i)
    expect(vd?.body).toMatch(/fallback/i)
    expect(vd?.body).not.toMatch(/don't need a custom mark|do not need a custom mark/i)
    expect(vd?.body).not.toMatch(/\blockup\b/i)
  })

  it('Style Guide Visual direction frames type examples as interim options when existing brand has no logo', () => {
    const form = loadCoreSampleFixture()
    form.step6.hasExistingBrand = true
    form.step6.existingBrand = { referenceImageRef: 'pro-uploads/session/ref.jpg' }
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    expect(vd?.body).toMatch(/finalized logo|finalized mark/i)
    expect(vd?.body).not.toMatch(/uploaded a logo|provided a logo/i)
    expect(vd?.body).not.toMatch(/don't need a custom mark|do not need a custom mark/i)
  })

  it('visual.typography.wordmarkBandRail uses uploaded-logo framing when logoRef is set', () => {
    const form = loadCoreSampleFixture()
    form.tier = 'pro'
    form.step6.hasExistingBrand = true
    form.step6.existingBrand = { logoRef: 'pro-uploads/session/logo.png' }
    const model = buildBrandIdentityGuideModel(form)
    const rail = model.visual.typography.wordmarkBandRail
    expect(rail.wordmarkIntro).toMatch(/uploaded logo is the primary mark/i)
    expect(rail.wordmarkIntro).toMatch(/when the full logo will not fit/i)
    expect(rail.wordmarkIntro).not.toMatch(/without a custom logo in every placement/i)
  })

  it('visualPaletteSwatchesWithRoles includes per-swatch role labels for Style Guide deck legend', () => {
    const rows = visualPaletteSwatchesWithRoles('midnight_luxe')
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.some((row) => row.role === 'Primary')).toBe(true)
    expect(rows.every((row) => row.name.length > 0)).toBe(true)
  })

  it('visualPaletteSwatches matches Brand Identity Guide folio 02a swatch names', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedPalette = 'midnight_luxe'
    const model = buildBrandIdentityGuideModel(form)
    const shared = visualPaletteSwatches('midnight_luxe')
    expect(shared).toEqual(model.visual.swatches)
    expect(shared.every((s) => s.name.length > 0)).toBe(true)
  })

  it('Style Guide Visual direction style register names the style once (no duplicated label in body)', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'luxe_refined'
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    const stylePara = vd?.body.split('\n\n')[0] ?? ''
    expect(stylePara).toMatch(/^Luxe and Refined\./)
    expect(stylePara).not.toMatch(/Luxe and Refined\.\s*Luxe and refined/i)
  })

  it('Style Guide Visual direction includes voice ↔ visual bridge (friendly × clean_minimal)', () => {
    const form = loadCoreSampleFixture()
    form.step3.tonePreset = 'friendly'
    form.step6.selectedStyle = 'clean_minimal'
    const blocks = styleGuideBlocks(form)
    const vd = blocks.find((b) => b.heading === 'Visual direction')
    expect(vd?.body).toMatch(/reinforce each other|warm, conversational voice/i)
  })

  it('Voice Playbook Tone profile closes with visual bridge sentence', () => {
    const form = loadCoreSampleFixture()
    form.step3.tonePreset = 'friendly'
    form.step6.selectedStyle = 'clean_minimal'
    const blocks = voicePlaybookBlocks(form)
    const tone = blocks.find((b) => b.heading === 'Tone profile')
    expect(tone?.body).toMatch(/clean visual system and warm voice|human connection/i)
  })

  it('Messaging themes includes industry vocabulary (creative_services fixture)', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const mt = blocks.find((b) => b.heading === 'Messaging themes')
    expect(mt?.body).toMatch(/Industry vocabulary/i)
    expect(mt?.body).toMatch(/portfolio|process|creative direction/i)
  })

  it('Tone profile appends industry tone modifier after visual bridge', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const tp = blocks.find((b) => b.heading === 'Tone profile')
    expect(tp?.body).toMatch(/Creative services brands sound|specificity beats agency swagger/i)
  })

  it('Tone profile avoids em-dash-heavy template phrasing', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const tp = blocks.find((b) => b.heading === 'Tone profile')?.body ?? ''
    expect(tp).not.toContain('—')
  })

  it('Voice guardrails prioritize industry compliance line for legal_professional_services', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'legal_professional_services'
    const blocks = voicePlaybookBlocks(form)
    const g = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(g?.body).toMatch(/Never promise outcomes|Steer clear of loaded phrasing/i)
  })

  it('Sample phrases include industry-flavored lines from preferred terms', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const sp = blocks.find((b) => b.heading === 'Sample phrases')
    expect(sp?.body).toMatch(/When we talk about portfolio|process/i)
  })

  it('Voice Playbook includes Before / after examples with businessName and offer', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    expect(ba?.body).toContain('Northline Studio')
    expect(ba?.body).toContain('positioning strategy')
    expect(ba?.body).toMatch(/Before:|After:/)
  })

  it('Voice Playbook Before / after uses two labeled rewrite groups', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    const groups = parseBeforeAfter(ba?.body ?? '')
    expect(groups).toHaveLength(2)
    expect(groups[0]?.label).toBe('Service intro rewrite')
    expect(groups[1]?.label).toBe('Profile or bio rewrite')
  })

  it('Voice Playbook Before / after keeps scenario-specific concrete after lines', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    const groups = parseBeforeAfter(ba?.body ?? '')
    expect(groups[0]?.after).toMatch(/clear next steps|direct next steps/i)
  })

  it('Voice Playbook Before / after routes local_team to social + visit scenarios', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    const groups = parseBeforeAfter(ba?.body ?? '')
    expect(groups[0]?.label).toBe('Social hook rewrite')
    expect(groups[1]?.label).toBe('Visit or listing line rewrite')
    expect(groups[1]?.after).toMatch(/serves|people can trust/i)
  })

  it('Voice Playbook Before / after uses industry vocabulary for coffee founder', () => {
    const form = loadPersonaFixture('coffee-founder')
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    expect(ba?.body).toMatch(/ingredients|sourcing/i)
    expect(ba?.body).toMatch(/thoughtful hospitality/i)
  })

  it('coffee-founder Before / after avoids consultative movement phrasing and forced closers', () => {
    const form = loadPersonaFixture('coffee-founder')
    const groups = parseBeforeAfter(
      voicePlaybookBlocks(form).find((b) => b.heading === 'Before / after examples')?.body ?? '',
    )
    expect(groups[0]?.label).toBe('Social hook rewrite')
    expect(groups[1]?.label).toBe('Visit or listing line rewrite')
    expect(groups[0]?.before).not.toBe(groups[1]?.before)
    expect(groups[0]?.after).toContain('Harbor Row Coffee')
    expect(groups[0]?.after).toContain('specialty coffee')
    expect(groups[0]?.after).not.toMatch(/Thoughtful hospitality turns|turns a boring routine into/i)
    expect(groups[1]?.after).toMatch(/neighborhood regulars|people can trust|ingredients|sourcing/i)
  })

  it('Voice Playbook Before / after stays compliance-safe for legal services', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'legal_professional_services'
    form.step3.tonePreset = 'professional'
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    const afters = parseBeforeAfter(ba?.body ?? '')
      .map((g) => g.after)
      .join(' ')
    expect(afters).not.toMatch(/\bguarantee\b|\bwin\b|\bsure thing\b|\bno risk\b/i)
  })

  it('Voice Playbook Before / after shifts language by tone and directness', () => {
    const friendly = loadCoreSampleFixture()
    friendly.step3.tonePreset = 'friendly'
    friendly.step3.voiceSliders.directness = 20

    const bold = loadCoreSampleFixture()
    bold.step3.tonePreset = 'bold'
    bold.step3.voiceSliders.directness = 90

    const friendlyAfter = parseBeforeAfter(
      voicePlaybookBlocks(friendly).find((b) => b.heading === 'Before / after examples')?.body ?? '',
    )[0]?.after
    const boldAfter = parseBeforeAfter(
      voicePlaybookBlocks(bold).find((b) => b.heading === 'Before / after examples')?.body ?? '',
    )[0]?.after

    expect(friendlyAfter).toContain('Northline Studio')
    expect(boldAfter).toContain('Northline Studio')
    expect(friendlyAfter).not.toBe(boldAfter)
  })

  it('Voice Playbook Before / after after-lines avoid generic announcement phrasing', () => {
    const form = loadCoreSampleFixture()
    const afters = parseBeforeAfter(
      voicePlaybookBlocks(form).find((b) => b.heading === 'Before / after examples')?.body ?? '',
    )
      .map((g) => g.after)
      .join(' ')

    expect(afters).not.toMatch(/excited to share|provide solutions|personalized support|amazing results/i)
  })

  it('baseline B2B consultant path still reads like a service brand after storefront-oriented fixes', () => {
    const form = loadCoreSampleFixture()
    const anchor = brandBriefBlocks(form).find((b) => b.heading === 'Brand anchor')?.body ?? ''
    const beforeAfter = voicePlaybookBlocks(form).find((b) => b.heading === 'Before / after examples')?.body ?? ''
    expect(anchor).toMatch(/^Northline Studio helps/i)
    expect(beforeAfter).toMatch(/Service intro rewrite|Profile or bio rewrite/i)
    expect(beforeAfter).toMatch(/Book a consult|Follow along|Start with an order|Come back/i)
  })

  it('instagram-first shop-second solo expert still shows the documented mixed commerce/service edge case', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_expert'
    form.step1.industry = 'retail'
    form.step1.touchpoints = ['instagram', 'marketplace_storefront'] as TouchpointId[]
    form.step1.primaryGoal = 'direct_sales'

    const phrases = voicePlaybookBlocks(form).find((b) => b.heading === 'Sample phrases')?.body ?? ''
    const beforeAfterBody = voicePlaybookBlocks(form).find((b) => b.heading === 'Before / after examples')?.body ?? ''
    const beforeAfter = parseBeforeAfter(beforeAfterBody)
    expect(phrases).toMatch(/Book a call/i)
    expect(beforeAfterBody).not.toMatch(/find  with/i)
    expect(beforeAfter[0]?.before).not.toBe(beforeAfter[1]?.before)
  })

  it('core-sample Before / after keeps two distinct scenario starts', () => {
    const form = loadCoreSampleFixture()
    const groups = parseBeforeAfter(
      voicePlaybookBlocks(form).find((b) => b.heading === 'Before / after examples')?.body ?? '',
    )
    expect(groups[0]?.before).not.toBe(groups[1]?.before)
    expect(groups[0]?.label).toMatch(/Service intro|Social hook|Product/i)
    expect(groups[1]?.label).toMatch(/Profile or bio|Visit or listing|proof|Mission/i)
  })

  it('voiceVisualBridge matrices cover all tone × style pairs', () => {
    const tones = ['friendly', 'professional', 'bold'] as const
    const styles = ['clean_minimal', 'bold_graphic', 'organic_natural', 'luxe_refined'] as const
    for (const t of tones) {
      for (const s of styles) {
        expect(styleGuideVisualVoiceBridge(t, s).length).toBeGreaterThan(40)
        expect(voicePlaybookToneVisualClosing(t, s).length).toBeGreaterThan(40)
      }
    }
  })

  it('Style Guide Typography block uses recipe-resolved font names for clean_minimal fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo).toBeDefined()
    expect(typo?.body).toMatch(/distributor.*terms|licensing/i)
    expect(typo?.body).not.toMatch(/•\s*Primary/i)
    expect(typographySectionLead(form)).toMatch(/Outfit/i)
    const slots = typographySpecimenSlots(form)
    expect(slots.every((s) => s.pdfFamily === 'Outfit')).toBe(true)
    expect(slots.every((s) => s.faceLabel === 'Outfit')).toBe(true)
    expect(slots[0].roleEyebrow).toMatch(/PRIMARY|HEADLINES/i)
    expect(slots[1].roleEyebrow).toMatch(/SECONDARY|UI/i)
  })

  it('Style Guide Typography honors existingTypeface when provided (Pro tier only)', () => {
    const form = loadCoreSampleFixture()
    form.tier = 'pro'
    form.step6.existingTypeface = 'Montserrat for all headings'
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typographySectionLead(form)).toContain('Montserrat')
    expect(typographySectionLead(form)).toMatch(/already using/i)
    expect(typo?.body).toMatch(/distributor.*terms|licensing/i)
  })

  it('Core tier ignores existingTypeface for continuity copy and keeps specimen wordmark note when applicable', () => {
    const form = loadCoreSampleFixture()
    form.tier = 'core'
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step6.existingTypeface = 'Montserrat for all headings'
    expect(typographySectionLead(form)).not.toMatch(/already using/i)
    expect(typographySectionLead(form)).not.toContain('Montserrat')
    const slots = typographySpecimenSlots(form)
    expect(slots[0].wordmarkNoteAfterWeights).toMatch(/legibility|spacing|signage|business name|bold/i)
  })

  it('typographySpecimenFamilies orders primary then secondary for luxe_refined (early editorial)', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'luxe_refined'
    expect(typographySpecimenFamilies(form)).toEqual(['DM Serif Display', 'Manrope'])
  })

  it('typographySpecimenFamilies orders primary then secondary for clean_minimal (system pair)', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'clean_minimal'
    expect(typographySpecimenFamilies(form)).toEqual(['Outfit', 'Outfit'])
  })

  it('typographySpecimenSlots lists primary (display) then secondary (body) for contrast pairs', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'luxe_refined'
    const slots = typographySpecimenSlots(form)
    expect(slots.map((s) => s.pdfFamily)).toEqual(['DM Serif Display', 'Manrope'])
    expect(slots[0].roleEyebrow).toMatch(/headlines|display|primary/i)
    expect(slots[1].roleEyebrow).toMatch(/body|supporting|secondary/i)
  })

  it('touchpointClusterFromForm maps food_beverage + solo_maker to physical_first', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    expect(touchpointClusterFromForm(form)).toBe('physical_first')
  })

  it('touchpointClusterFromForm maps construction_trades + solo_expert to physical_first', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'construction_trades'
    form.step1.brandNarrator = 'solo_expert'
    form.step1.businessOperatingModel = 'we_travel_to_customers'
    expect(touchpointClusterFromForm(form)).toBe('physical_first')
  })

  it('touchpointClusterFromForm maps creative_services + solo_expert to social_service', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_expert'
    expect(touchpointClusterFromForm(form)).toBe('social_service')
  })

  it('touchpointClusterFromForm promotes social_service to social_product when primary touchpoint is marketplace (solo_expert)', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_expert'
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    expect(touchpointClusterFromForm(form)).toBe('social_product')
  })

  it('touchpointClusterFromForm keeps physical_first when base is physical even with marketplace primary', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'construction_trades'
    form.step1.brandNarrator = 'solo_expert'
    form.step1.businessOperatingModel = 'we_travel_to_customers'
    form.step1.touchpoints = ['marketplace_storefront']
    expect(touchpointClusterFromForm(form)).toBe('physical_first')
  })

  it('touchpointClusterFromForm falls back to social_service when brandNarrator is empty', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = ''
    expect(touchpointClusterFromForm(form)).toBe('social_service')
  })

  it('Typography lead and body reflect professional_and_digital for default fixture', () => {
    const form = loadCoreSampleFixture()
    expect(typographySectionLead(form)).toMatch(/proposal|LinkedIn|email/i)
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo?.body).toMatch(/distributor.*terms|licensing/i)
    expect(typo?.body).not.toMatch(/across your team/i)
  })

  it('Typography uses physical+digital lead for food_beverage + solo_maker (physical_first cluster)', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    expect(typographySectionLead(form)).toMatch(/signage|business cards|website/i)
  })

  it('Primary (left) specimen includes legibility note after weights for physical_and_digital context', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    const slots = typographySpecimenSlots(form)
    expect(slots[0].pdfFamily).toBe('DM Serif Display')
    expect(slots[0].wordmarkNoteAfterWeights).toMatch(/legibility|spacing|signage|business name|bold/i)
  })

  it('Primary (left) specimen includes headline-weight note for social_and_packaging context', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'online_only'
    const slots = typographySpecimenSlots(form)
    expect(slots[0].pdfFamily).toBe('DM Serif Display')
    expect(slots[0].wordmarkNoteAfterWeights).toMatch(/bold row|headline|business name/i)
  })

  it('Style Guide Typography omits duplicate logo strategy prose for physical_and_digital cluster', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    form.step1.stage = 'new'
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo?.body).not.toMatch(/You do not need a custom logo mark/i)
    expect(typo?.body).not.toMatch(/functions as a wordmark/i)
    expect(typographyFooterParts(form).trailParagraphs).toEqual([])
  })

  it('Style Guide Typography omits duplicate logo strategy prose for social_and_packaging cluster', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'online_only'
    form.step1.stage = 'established'
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo?.body).not.toMatch(/If you do not have a finalized mark yet/i)
    expect(typo?.body).not.toMatch(/standardize touchpoints/i)
    expect(typographyFooterParts(form).trailParagraphs).toEqual([])
  })

  it('Style Guide has a "Style principles" block with bullet points', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const principles = blocks.find((b) => b.heading === 'Style principles')
    expect(principles).toBeDefined()
    expect(principles?.body).toContain('•')
  })

  it('Style principles adds two narrator lines including touchpoint-oriented second (solo_expert)', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const principles = blocks.find((b) => b.heading === 'Style principles')
    expect(principles?.body).toContain('Every visual choice should reinforce the credibility')
    expect(principles?.body).toMatch(/Consistency across the places people discover you/)
  })

  it('Style principles includes packaging/grid second line for solo_maker', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_maker'
    const blocks = styleGuideBlocks(form)
    const principles = blocks.find((b) => b.heading === 'Style principles')
    expect(principles?.body).toMatch(/grid post|packaging/i)
  })

  it('Do / avoid appends narrator-specific do and don\'t (solo_expert)', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const da = blocks.find((b) => b.heading === 'Do / avoid')
    expect(da?.body).toContain('✓')
    expect(da?.body).toContain('✗')
    expect(da?.body).toMatch(/proposals and follow-up emails/i)
    expect(da?.body).toMatch(/most recognizable thing|not the layout/i)
  })

  it('Do / avoid appends narrator-specific lines for solo_maker', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_maker'
    const blocks = styleGuideBlocks(form)
    const da = blocks.find((b) => b.heading === 'Do / avoid')
    expect(da?.body).toMatch(/Photograph your work with intention/i)
    expect(da?.body).toMatch(/handmade signal/i)
  })

  it('Style Guide has a "Do / avoid" block with ✓ and ✗ markers', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const doAvoid = blocks.find((b) => b.heading === 'Do / avoid')
    expect(doAvoid).toBeDefined()
    expect(doAvoid?.body).toContain('✓')
    expect(doAvoid?.body).toContain('✗')
  })

  it('Style Guide includes Imagery direction between Do / avoid and Where to apply', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const headings = blocks.map((b) => b.heading)
    expect(headings.indexOf('Imagery direction')).toBeGreaterThan(headings.indexOf('Do / avoid'))
    expect(headings.indexOf('Where to apply this first')).toBeGreaterThan(headings.indexOf('Imagery direction'))
    const img = blocks.find((b) => b.heading === 'Imagery direction')
    expect(img?.body).toMatch(/Imagery should feel calm|generous space/i)
    expect(img?.body).toMatch(/professional presence|headshots/i)
  })

  it('Style Guide Imagery direction tail follows touchpoint cluster (physical_first)', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    form.step1.businessOperatingModel = 'customer_visits_us'
    const blocks = styleGuideBlocks(form)
    const img = blocks.find((b) => b.heading === 'Imagery direction')
    expect(img?.body).toMatch(/signs|packaging|space/i)
  })

  it('Voice Playbook has a "Tone profile" block with prose (length > 80 chars)', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const toneProfile = blocks.find((b) => b.heading === 'Tone profile')
    expect(toneProfile).toBeDefined()
    expect((toneProfile?.body.length ?? 0)).toBeGreaterThan(80)
  })

  it('Voice Playbook has a "Voice guardrails" block with ✓ and ✗ markers', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const guardrails = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(guardrails).toBeDefined()
    expect(guardrails?.body).toContain('✓')
    expect(guardrails?.body).toContain('✗')
  })

  it('Voice Playbook has a "Sample phrases" block with quoted phrase examples', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const phrases = blocks.find((b) => b.heading === 'Sample phrases')
    expect(phrases).toBeDefined()
    expect(phrases?.body).toContain('"')
  })

  it('Voice Playbook has a "Writing do / avoid" block with ✓ markers', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const writing = blocks.find((b) => b.heading === 'Writing do / avoid')
    expect(writing).toBeDefined()
    expect(writing?.body).toContain('✓')
  })

  it('Quick Start Week 1 body contains ☐ checklist prefix', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    expect(blocks[0].heading).toBe('Your kit')
    const w1 = blocks.find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('☐')
  })

  it('Quick Start Week 1 body contains "LinkedIn" for solo_expert fixture', () => {
    const form = loadCoreSampleFixture()
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('LinkedIn')
  })

  it('Quick Start Week 1 does not include stage note copy', () => {
    const form = loadCoreSampleFixture()
    expect(form.step1.stage).toBe('growing')
    const blocks = quickStartBlocks(form)
    expect(blocks.some((b) => b.heading === 'Your starting point')).toBe(false)
    expect(blocks.find((b) => b.heading === 'Week 1')?.body).not.toMatch(/presence across channels|equity in what/i)
  })

  it('Quick Start follows marketplace-first touchpoint ordering', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('Set up your brand on Etsy first')
    expect(w1?.body).toMatch(/top Etsy listings/i)
  })

  it('Quick Start Week 1 uses commerce checklist for solo_expert with marketplace primary (no booking line)', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_expert'
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const body = quickStartBlocks(form).find((b) => b.heading === 'Week 1')?.body ?? ''
    expect(body).toMatch(/shop headline|listing or pinned post/i)
    expect(body).not.toMatch(/booking or contact link is visible everywhere/i)
  })

  it('Quick Start Week 3 uses social_product for solo_expert with marketplace-first touchpoints', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_expert'
    form.step1.industry = 'retail'
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const w3 = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    expect(w3).toMatch(/shop banner|listing images|profile image/i)
  })

  it('Voice Playbook sample phrases use commerce lines for solo_expert with marketplace primary', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_expert'
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const phrases = voicePlaybookBlocks(form).find((b) => b.heading === 'Sample phrases')?.body ?? ''
    expect(phrases).toMatch(/New drop|Tap through|comparing options/i)
    expect(phrases).not.toMatch(/Book a call/i)
  })

  it('Quick Start Week 3 social_service first bullet follows touchpoint order (LinkedIn vs Instagram)', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_expert'
    form.step1.touchpoints = ['linkedin', 'website']
    const bodyLinkedin = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    const firstBulletLinkedin = bodyLinkedin.split('\n').find((line) => line.startsWith('☐'))
    expect(firstBulletLinkedin).toContain('LinkedIn')

    form.step1.touchpoints = ['instagram', 'linkedin']
    const bodyInstagram = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    const firstBulletInstagram = bodyInstagram.split('\n').find((line) => line.startsWith('☐'))
    expect(firstBulletInstagram).toContain('Instagram')
    expect(firstBulletInstagram).not.toContain('LinkedIn')
  })

  it('Quick Start follows directory-first touchpoint ordering', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = ['google_business', 'website']
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('Set up your brand on Google first')
    expect(w1?.body).toMatch(/hours, services, contact details/i)
  })

  it('Quick Start follows owned-channel-first touchpoint ordering', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = ['website', 'email_newsletter']
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')
    expect(w1?.body).toContain('Set up your brand on Website first')
    expect(w1?.body).toMatch(/first-touch experience/i)
  })

  it('Quick Start keeps only top-4 unique normalized touchpoints', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = [
      'etsy',
      'marketplace_storefront',
      'google_business_profile',
      'instagram',
      'website',
      'email',
    ] as typeof form.step1.touchpoints
    const blocks = quickStartBlocks(form)
    const week4 = blocks.find((b) => b.heading === 'Week 4')
    expect(week4?.body).toMatch(/selected channels \(Etsy, Google, Instagram, Website\)/i)
    expect(week4?.body).not.toMatch(/selected channels.*Email newsletter/i)
  })

  it('Quick Start includes goal-aligned week tasks for audience growth', () => {
    const form = loadCoreSampleFixture()
    form.step1.primaryGoal = 'audience_growth'
    form.step1.touchpoints = ['instagram', 'website']
    const blocks = quickStartBlocks(form)
    const w1 = blocks.find((b) => b.heading === 'Week 1')
    const w2 = blocks.find((b) => b.heading === 'Week 2')
    expect(w1?.body).toMatch(/repeatable content format|know what to expect/i)
    expect(w2?.body).toMatch(/designed for saves\/shares|include a follow prompt/i)
  })

  it('Style Guide Do / avoid includes stage bullet (standardizing)', () => {
    const form = loadCoreSampleFixture()
    expect(form.step1.stage).toBe('growing')
    const blocks = styleGuideBlocks(form)
    const da = blocks.find((b) => b.heading === 'Do / avoid')
    expect(da?.body).toMatch(/Audit before you expand/i)
  })

  it('Style Guide Do / avoid stage bullet is a don\'t for established (protecting_recognition)', () => {
    const form = loadCoreSampleFixture()
    form.step1.stage = 'established'
    const blocks = styleGuideBlocks(form)
    const da = blocks.find((b) => b.heading === 'Do / avoid')
    expect(da?.body).toContain('✗ Avoid changes that read as a restart rather than an evolution')
  })
})

describe('value ID alignment — craftsmanship and growth fire correctly', () => {
  it('Voice guardrails include craftsmanship line when value is set', () => {
    const form = loadCoreSampleFixture()
    form.step4.values = ['craftsmanship']
    const blocks = voicePlaybookBlocks(form)
    const g = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(g?.body).toMatch(/Word choice reflects quality/i)
  })

  it('Voice guardrails include growth line when value is set', () => {
    const form = loadCoreSampleFixture()
    form.step4.values = ['growth']
    const blocks = voicePlaybookBlocks(form)
    const g = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(g?.body).toMatch(/End on action/i)
  })

  it('Voice guardrails do NOT include craftsmanship line when value is absent', () => {
    const form = loadCoreSampleFixture()
    form.step4.values = ['clarity']
    const blocks = voicePlaybookBlocks(form)
    const g = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(g?.body).not.toMatch(/Word choice reflects quality/i)
  })
})

describe('lean-core fixture — Core floor with Pro-only fields absent', () => {
  it('loads lean-core fixture with expected business and Core tier', () => {
    const form = loadPersonaFixture('lean-core')
    expect(form.step1.businessName).toBe('Maple & Pine Photography')
    expect(form.tier).toBe('core')
  })

  it('lean-core Brand Brief does not degrade to "not specified" placeholders', () => {
    const form = loadPersonaFixture('lean-core')
    const blocks = brandBriefBlocks(form)
    for (const b of blocks) {
      expect(b.body).not.toMatch(/not specified on intake/i)
    }
  })

  it('lean-core Ideal customer renders archetype without pain/outcome labels', () => {
    const form = loadPersonaFixture('lean-core')
    const blocks = brandBriefBlocks(form)
    const ic = blocks.find((b) => b.heading === 'Ideal customer')
    expect(ic?.body).toContain('Families and small business owners')
    expect(ic?.body).not.toContain('Pain points:')
    expect(ic?.body).not.toContain('Desired outcomes:')
  })

  it('lean-core Brand story angle renders without origin summary or motivation labels', () => {
    const form = loadPersonaFixture('lean-core')
    const blocks = brandBriefBlocks(form)
    const s = blocks.find((b) => b.heading === 'Brand story angle')
    expect(s?.body).not.toContain('undefined')
    expect(s?.body).not.toMatch(/not specified on intake/i)
  })

  it('lean-core Differentiation renders meaningful content without explicit differentiation text', () => {
    const form = loadPersonaFixture('lean-core')
    const blocks = brandBriefBlocks(form)
    const d = blocks.find((b) => b.heading === 'Differentiation')
    expect(d?.body).not.toMatch(/not specified on intake/i)
  })

  it('lean-core Voice guardrails fire craftsmanship line (craftsmanship in values)', () => {
    const form = loadPersonaFixture('lean-core')
    const blocks = voicePlaybookBlocks(form)
    const g = blocks.find((b) => b.heading === 'Voice guardrails')
    expect(g?.body).toMatch(/Word choice reflects quality/i)
  })
})

describe('Deliverable packaging (depth + Quick Start)', () => {
  const packagingPersonas = ['established-pro', 'lean-core', 'coffee-founder'] as const

  it('Quick Start kit intro leads with the Brand Identity Guide and avoids em dashes', () => {
    const intro = quickStartBlocks(loadCoreSampleFixture()).find((b) => b.heading === 'Your kit')?.body ?? ''
    expect(intro.startsWith('Start with your Brand Identity Guide')).toBe(true)
    expect(intro).toMatch(/points you to the right section of the guide/)
    expect(intro).toMatch(/gives you what you need to start/)
    expect(intro).not.toMatch(/\blinks straight\b/i)
    expect(intro).not.toMatch(/not homework/i)
    expect(intro).not.toMatch(/—/)
    expect(intro).not.toMatch(/\btouchpoints?\b/i)
    expect(intro).not.toMatch(/\brollout\b/i)
    expect(intro).not.toMatch(/\bdeliverable\b/i)
  })

  it('Quick Start includes kit intro and section pointers each week', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    expect(blocks.find((b) => b.heading === 'Your kit')?.body).toMatch(/Brand Identity Guide/)
    expect(blocks.find((b) => b.heading === 'Week 1')?.body).toMatch(/Summary:/)
    expect(blocks.find((b) => b.heading === 'Week 2')?.body).toMatch(/Voice:/)
    expect(blocks.find((b) => b.heading === 'Week 3')?.body).toMatch(/Look:/)
    expect(blocks.find((b) => b.heading === 'Week 4')?.body).toMatch(/All sections:/)
    for (const week of ['Week 1', 'Week 2', 'Week 3', 'Week 4']) {
      const body = blocks.find((b) => b.heading === week)?.body ?? ''
      expect(body, week).not.toMatch(/Brand Identity Guide →/)
    }
  })

  it('Quick Start does not paste the guide one-line or full anchor sentence verbatim', () => {
    const form = loadPersonaFixture('established-pro')
    const model = buildBrandIdentityGuideModel(form)
    const haystack = quickStartBlocks(form).map((b) => b.body).join('\n')
    expect(haystack).not.toContain(model.summary.oneLine)
    expect(haystack).not.toContain(brandAnchorSentence(form))
  })

  it('depth Brief values section REFs the guide instead of repeating value bullets', () => {
    const form = loadCoreSampleFixture()
    const depth = depthBriefBlocks(form)
    const legacy = brandBriefBlocks(form)
    const values = depth.find((b) => b.heading === 'Values')
    const legacyValues = legacy.find((b) => b.heading === 'Values')
    expect(values?.body).toMatch(/Brand Identity Guide/)
    expect(values?.body).not.toBe(legacyValues?.body)
  })

  it('depth Style drops Where to apply and adds Visual application', () => {
    const form = loadCoreSampleFixture()
    const depth = depthStyleGuideBlocks(form)
    expect(depth.some((b) => b.heading === 'Where to apply this first')).toBe(false)
    expect(depth.some((b) => b.heading === 'Visual application')).toBe(true)
    const palette = depth.find((b) => b.heading === 'Palette')
    expect(palette?.body).not.toMatch(/Brand Identity Guide/)
    expect(palette?.body).not.toMatch(/Swatches and hex/)
  })

  it('depth Voice CTA section is principles + REF without example bullet list', () => {
    const form = loadCoreSampleFixture()
    const body = voicePlaybookCtaBodyForDepth(form)
    expect(body).toMatch(/Brand Identity Guide → Examples/)
    expect(body).not.toMatch(/Shop now/)
  })

  it.each(packagingPersonas)('depth doc bodies avoid long duplicate of guide reader strings (%s)', (personaId) => {
    const form = loadPersonaFixture(personaId)
    const model = buildBrandIdentityGuideModel(form)
    const guideStrings = collectGuideReaderFacingStrings(model)
    const depthBlocks = [
      ...depthBriefBlocks(form),
      ...depthStyleGuideBlocks(form),
      ...depthVoicePlaybookBlocks(form),
    ]
    for (const block of depthBlocks) {
      if (block.heading === 'How this document relates to your kit') continue
      if (block.heading === 'Brand anchor') continue
      if (block.heading === 'Values' && block.body.includes('Brand Identity Guide')) continue
      if (block.heading === 'Calls to action (CTAs)' && block.body.includes('Brand Identity Guide')) continue
      // Brief owns expanded transformation copy; guide carries the compressed slice (matrix: REF + expand).
      if (block.heading === 'Core transformation') continue
      expect(overlapsGuideString(block.body, guideStrings), `overlap in [${block.heading}]: ${block.body.slice(0, 80)}`).toBe(
        false,
      )
    }
  })

  it.each(packagingPersonas)('depth supplements include REF intro (%s)', (personaId) => {
    const form = loadPersonaFixture(personaId)
    for (const blocks of [depthBriefBlocks(form), depthStyleGuideBlocks(form), depthVoicePlaybookBlocks(form)]) {
      expect(blocks[0]?.heading).toBe('How this document relates to your kit')
      expect(blocks[0]?.body).toMatch(/Brand Identity Guide/)
    }
  })
})
