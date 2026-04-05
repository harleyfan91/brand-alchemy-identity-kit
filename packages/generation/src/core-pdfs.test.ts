import { describe, expect, it } from 'vitest'

import {
  brandBriefBlocks,
  quickStartBlocks,
  styleGuideBlocks,
  typographySectionLead,
  typographySpecimenFamilies,
  typographySpecimenSlots,
  voicePlaybookBlocks,
} from './deterministic/coreAssembly.js'
import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'
import { fifthKitHomeColor, paletteAccentHex } from './pdf/CoreKitDocuments.js'
import { renderCoreKitPdfs } from './pdf/renderCoreKitPdfs.js'

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

  it('Quick Start Week 1 body mentions "LinkedIn" for solo_expert fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = quickStartBlocks(form)
    expect(blocks[0].heading).toBe('Week 1')
    expect(blocks[0].body).toContain('LinkedIn')
  })

  it('Voice Playbook includes a "Messaging themes" block', () => {
    const form = loadCoreSampleFixture()
    const blocks = voicePlaybookBlocks(form)
    const themes = blocks.find((b) => b.heading === 'Messaging themes')
    expect(themes).toBeDefined()
    expect(themes?.body.length).toBeGreaterThan(10)
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

  it('Style Guide includes a "Typography" block with Inter + Source Serif 4 for clean_minimal fixture', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const typo = blocks.find((b) => b.heading === 'Typography')
    expect(typo).toBeDefined()
    expect(typo?.body).toMatch(/Licensing|embedding/i)
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
    expect(typo?.body).toMatch(/Licensing|embedding/i)
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

  it('Style Guide has a "Style principles" block with bullet points', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const principles = blocks.find((b) => b.heading === 'Style principles')
    expect(principles).toBeDefined()
    expect(principles?.body).toContain('•')
  })

  it('Style Guide has a "Do / avoid" block with ✓ and ✗ markers', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const doAvoid = blocks.find((b) => b.heading === 'Do / avoid')
    expect(doAvoid).toBeDefined()
    expect(doAvoid?.body).toContain('✓')
    expect(doAvoid?.body).toContain('✗')
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
})
