import { describe, expect, it } from 'vitest'

import { assembleOfferLine, assembleTransformationLine } from '@identity-kit/shared'

import {
  brandBriefBlocks,
  paletteColorRolesParagraph,
  quickStartBlocks,
  styleGuideBlocks,
  styleGuideVisualVoiceBridge,
  touchpointClusterFromForm,
  typographySectionLead,
  typographySpecimenFamilies,
  typographySpecimenSlots,
  voicePlaybookBlocks,
  voicePlaybookToneVisualClosing,
} from './deterministic/coreAssembly.js'
import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from './fixtures/loadPersonaFixture.js'
import { fifthKitHomeColor, paletteAccentHex } from './pdf/CoreKitDocuments.js'
import { renderCoreKitPdfs } from './pdf/renderCoreKitPdfs.js'

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
    expect(blocks[0].body).toContain('The Routine Upgrader')
    expect(blocks[0].body).not.toContain('routine_upgrader')
  })

  it('Brand Brief uses normalized Step 1 builder copy and omits empty delivery phrasing', () => {
    const form = loadCoreSampleFixture()
    const blocks = brandBriefBlocks(form)
    const overview = blocks.find((b) => b.heading === 'Brand overview')
    const transformation = blocks.find((b) => b.heading === 'Core transformation')
    expect(overview?.body).toContain(assembleOfferLine(form.step1.offer, form.step1.industry))
    expect(overview?.body).not.toMatch(/\bthrough\b/i)
    expect(transformation?.body).toBe(assembleTransformationLine(form.step1.transformation, form.step1.industry))
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
    expect(ba?.body).toContain(assembleOfferLine(form.step1.offer, form.step1.industry))
    expect(ba?.body).toMatch(/Before:|After:/)
  })

  it('Voice Playbook Before / after uses bold tone templates when tonePreset is bold', () => {
    const form = loadCoreSampleFixture()
    form.step3.tonePreset = 'bold'
    const blocks = voicePlaybookBlocks(form)
    const ba = blocks.find((b) => b.heading === 'Before / after examples')
    expect(ba?.body).toMatch(/Here is what|say the word/i)
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

  it('Style Guide includes a "Typography" block with Inter + Source Serif 4 for clean_minimal fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo).toBeDefined()
    expect(typo?.body).toMatch(/distributor.*terms|licensing/i)
    expect(typo?.body).not.toMatch(/•\s*Primary/i)
    expect(typographySectionLead(form)).toMatch(/Inter/i)
    expect(typographySectionLead(form)).toMatch(/Source Serif 4/i)
    const slots = typographySpecimenSlots(form)
    expect(slots.some((s) => s.blurb.includes('Inter'))).toBe(true)
    expect(slots.some((s) => s.blurb.match(/Source Serif 4/i))).toBe(true)
  })

  it('Style Guide Typography honors existingTypeface when provided', () => {
    const form = loadCoreSampleFixture()
    form.step6.existingTypeface = 'Montserrat for all headings'
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typographySectionLead(form)).toContain('Montserrat')
    expect(typographySectionLead(form)).toMatch(/already using/i)
    expect(typo?.body).toMatch(/distributor.*terms|licensing/i)
  })

  it('typographySpecimenFamilies puts serif first for luxe_refined', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'luxe_refined'
    expect(typographySpecimenFamilies(form)).toEqual(['serif', 'inter'])
  })

  it('typographySpecimenFamilies puts sans first for clean_minimal', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'clean_minimal'
    expect(typographySpecimenFamilies(form)).toEqual(['inter', 'serif'])
  })

  it('typographySpecimenSlots carries primary/supporting roles and matches family order', () => {
    const form = loadCoreSampleFixture()
    form.step6.selectedStyle = 'luxe_refined'
    const slots = typographySpecimenSlots(form)
    expect(slots.map((s) => s.face)).toEqual(['serif', 'inter'])
    expect(slots[0].roleEyebrow).toMatch(/primary/i)
    expect(slots[1].roleEyebrow).toMatch(/supporting/i)
  })

  it('touchpointClusterFromForm maps food_beverage + solo_maker to physical_first', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    expect(touchpointClusterFromForm(form)).toBe('physical_first')
  })

  it('touchpointClusterFromForm maps construction_trades + solo_expert to physical_first', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'construction_trades'
    form.step1.brandNarrator = 'solo_expert'
    expect(touchpointClusterFromForm(form)).toBe('physical_first')
  })

  it('touchpointClusterFromForm maps creative_services + solo_expert to social_service', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_expert'
    expect(touchpointClusterFromForm(form)).toBe('social_service')
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
    expect(typographySectionLead(form)).toMatch(/signage|business cards|website/i)
  })

  it('Primary typography specimen includes physical wordmark note for physical_and_digital context', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'food_beverage'
    form.step1.brandNarrator = 'solo_maker'
    const slots = typographySpecimenSlots(form)
    expect(slots[0].wordmarkNoteAfterWeights).toMatch(/wordmark|readable/i)
  })

  it('Primary typography specimen includes packaging wordmark note for social_and_packaging context', () => {
    const form = loadCoreSampleFixture()
    form.step1.industry = 'creative_services'
    form.step1.brandNarrator = 'solo_maker'
    const slots = typographySpecimenSlots(form)
    expect(slots[0].wordmarkNoteAfterWeights).toMatch(/wordmark|clearest/i)
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
    expect(principles?.body).toMatch(/LinkedIn|documents you share with clients/)
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
