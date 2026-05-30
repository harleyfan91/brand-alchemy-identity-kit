import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { shouldIncludeBrandAudit } from '../pro/shouldIncludeBrandAudit.js'
import { renderProKitPdfs } from './renderCoreKitPdfs.js'

describe('Pro PDF inventory', () => {
  it('text fixture renders 7 kit PDFs without audit', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    expect(shouldIncludeBrandAudit(form)).toBe(false)

    const pdfs = await renderProKitPdfs(form)
    expect(pdfs.brandBrief.length).toBeGreaterThan(1000)
    expect(pdfs.styleGuide.length).toBeGreaterThan(1000)
    expect(pdfs.voicePlaybook.length).toBeGreaterThan(1000)
    expect(pdfs.quickStart.length).toBeGreaterThan(1000)
    expect(pdfs.contentStarter.length).toBeGreaterThan(1000)
    expect(pdfs.strategyMemo.length).toBeGreaterThan(1000)
    expect(pdfs.brandAudit).toBeNull()
  })

  it('vision fixture renders audit PDF', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    expect(shouldIncludeBrandAudit(form)).toBe(true)

    const pdfs = await renderProKitPdfs(form)
    expect(pdfs.brandAudit).not.toBeNull()
    expect(pdfs.brandAudit!.length).toBeGreaterThan(1000)
  })
})
