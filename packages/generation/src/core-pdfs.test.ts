import { describe, expect, it } from 'vitest'

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
