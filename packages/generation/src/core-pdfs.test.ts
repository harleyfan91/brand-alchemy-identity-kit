import { describe, expect, it } from 'vitest'

import { brandBriefBlocks, quickStartBlocks, styleGuideBlocks, voicePlaybookBlocks } from './deterministic/coreAssembly.js'
import { loadCoreSampleFixture } from './fixtures/loadCoreFixture.js'
import { renderCoreKitPdfs } from './pdf/renderCoreKitPdfs.js'

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

  it('Style Guide includes a "Where to apply this first" block mentioning the primary channel', () => {
    const form = loadCoreSampleFixture()
    const blocks = styleGuideBlocks(form)
    const usage = blocks.find((b) => b.heading === 'Where to apply this first')
    expect(usage).toBeDefined()
    expect(usage?.body).toContain('LinkedIn')
  })
})
