import { describe, expect, it } from 'vitest'

import { assembleOfferLine, assembleTransformationLine, migrateIdentityKitForm, type TouchpointId } from '@identity-kit/shared'

import {
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
  voicePlaybookToneVisualClosing,
} from './deterministic/coreAssembly.js'
import {
  buildBrandIdentityGuideModel,
  substantiveBeforeAfterForGuide,
} from './deterministic/brandIdentityGuideModel.js'
import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from './fixtures/loadPersonaFixture.js'
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
    expect(countPdfPages(pdf)).toBe(5)
  })

  it('renders the Redo-style dummy guide prototype', async () => {
    const pdf = await renderRedoStyleDummyGuidePdf()
    expect(pdf.length).toBeGreaterThan(500)
    expect(pdf.subarray(0, 4).toString('utf8')).toBe('%PDF')
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
    expect(model.visual.applicationLead).toMatch(/LinkedIn|website|bio/i)
    expect(model.voice.rules.length).toBeGreaterThan(0)
  })

  it('adds editorial layout metadata without changing the five-page guide IA', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)

    expect(model.summary.editorial.folio).toBe('01')
    expect(model.positioning.editorial.layout).toBe('proseQuoteRail')
    expect(model.voice.editorial.layout).toBe('traitsSamples')
    expect(model.examples.editorial.layout).toBe('sampleShowcase')
    expect(model.visual.editorial.layout).toBe('visualSystemBoard')
    expect(model.positioning.editorial.dekMode).toBe(model.positioning.storyNote ? 'full' : 'none')
    expect(model.visual.editorial.figureLabel).toMatch(/Application/i)
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

    base.step1.stage = 'established'
    base.step1.touchpoints = ['linkedin', 'instagram', 'website', 'email'] as TouchpointId[]
    const rich = buildBrandIdentityGuideModel(base)
    expect(rich.signals.touchpointCount).toBe(4)
    expect(rich.signals.contentDensityBias).toBe(1)
  })

  it('filters insubstantial before/after pairs for the guide', () => {
    const pairs = substantiveBeforeAfterForGuide(
      [
        { label: 'A', before: 'x', after: 'also too short' },
        { label: 'B', before: 'Long enough before.', after: 'Long enough after.' },
      ],
      2,
    )
    expect(pairs).toHaveLength(1)
    expect(pairs[0]?.label).toBe('B')
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
    expect(transformation?.body).toMatch(/go from|turns|helps people get/i)
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
    expect(blocks[0].heading).toBe('Week 1')
    expect(blocks[0].body).toContain('LinkedIn')
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
    const blocks = quickStartBlocks(form)
    const w3 = blocks.find((b) => b.heading === 'Week 3')
    expect(w3?.body).toMatch(/Google Business/i)
  })

  it('Quick Start Week 3 local_team without directory uses advisory directory copy and only user-selected profile surfaces', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'local_team'
    form.step1.industry = 'creative_services'
    form.step1.touchpoints = ['instagram', 'website'] as TouchpointId[]
    form.step1.primaryGoal = 'lead_gen'
    const w3 = quickStartBlocks(form).find((b) => b.heading === 'Week 3')?.body ?? ''
    expect(w3).toMatch(/Claim or complete your Google Business profile/i)
    expect(w3).not.toMatch(/Update your Google Business cover photo/i)
    expect(w3).toMatch(/Instagram/i)
    expect(w3).not.toMatch(/Facebook/i)
    expect(w3).toMatch(/Instagram or Website feed|consistent with each other/i)
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
    expect(w3?.body).toMatch(/website homepage|hero section/i)
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
    expect(blocks[0].heading).toBe('Week 1')
    expect(blocks[0].body).toContain('☐')
  })

  it('Quick Start Week 1 body contains "LinkedIn" for solo_expert fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toContain('LinkedIn')
  })

  it('Quick Start Week 1 includes stage preamble (fixture stage growing → standardizing)', () => {
    const form = loadCoreSampleFixture()
    expect(form.step1.stage).toBe('growing')
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toMatch(/presence across channels|gap is most visible/i)
  })

  it('Quick Start Week 1 preamble for idea stage (starting_fresh)', () => {
    const form = loadCoreSampleFixture()
    form.step1.stage = 'idea'
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toMatch(/building from scratch|Start with one channel/i)
  })

  it('Quick Start follows marketplace-first touchpoint ordering', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toContain('Set up your brand on Etsy first')
    expect(blocks[0].body).toMatch(/top Etsy listings/i)
  })

  it('Quick Start Week 1 uses commerce checklist for solo_expert with marketplace primary (no booking line)', () => {
    const form = loadCoreSampleFixture()
    form.step1.brandNarrator = 'solo_expert'
    form.step1.touchpoints = ['marketplace_storefront', 'instagram']
    const body = quickStartBlocks(form)[0].body
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
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toContain('Set up your brand on Google first')
    expect(blocks[0].body).toMatch(/hours, services, contact details/i)
  })

  it('Quick Start follows owned-channel-first touchpoint ordering', () => {
    const form = loadCoreSampleFixture()
    form.step1.touchpoints = ['website', 'email_newsletter']
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toContain('Set up your brand on Website first')
    expect(blocks[0].body).toMatch(/first-touch experience/i)
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
    expect(week4?.body).toMatch(/Etsy, Google, Instagram, Website/i)
    expect(week4?.body).not.toMatch(/Email newsletter/i)
  })

  it('Quick Start includes goal-aligned week tasks for audience growth', () => {
    const form = loadCoreSampleFixture()
    form.step1.primaryGoal = 'audience_growth'
    form.step1.touchpoints = ['instagram', 'website']
    const blocks = quickStartBlocks(form)
    expect(blocks[0].body).toMatch(/repeatable Instagram content cadence|recognizable format/i)
    expect(blocks[1].body).toMatch(/audience-growth update/i)
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
