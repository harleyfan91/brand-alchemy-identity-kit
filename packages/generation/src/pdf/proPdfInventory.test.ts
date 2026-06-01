import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { buildExistingBrandEntryModel } from '../deterministic/existingBrandEntryScaffolds.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { shouldShowExistingBrandEntry } from '../pro/shouldShowExistingBrandEntry.js'
import { renderBrandIdentityGuidePdf, renderProKitPdfs } from './renderCoreKitPdfs.js'

describe('Pro PDF inventory', () => {
  it('text fixture renders 6 kit PDFs without existing-brand entry gate', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    expect(shouldShowExistingBrandEntry(form)).toBe(false)

    const pdfs = await renderProKitPdfs(form)
    expect(pdfs.brandBrief.length).toBeGreaterThan(1000)
    expect(pdfs.styleGuide.length).toBeGreaterThan(1000)
    expect(pdfs.voicePlaybook.length).toBeGreaterThan(1000)
    expect(pdfs.quickStart.length).toBeGreaterThan(1000)
    expect(pdfs.contentStarter.length).toBeGreaterThan(1000)
    expect(pdfs.strategyMemo.length).toBeGreaterThan(1000)
  })

  it('vision fixture renders 6 kit PDFs and gates existing-brand entry on Brief', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    expect(shouldShowExistingBrandEntry(form)).toBe(true)

    const entry = buildExistingBrandEntryModel(form)
    const pdfs = await renderProKitPdfs(form, { existingBrandEntry: entry })
    expect(pdfs.brandBrief.length).toBeGreaterThan(1000)
    expect(pdfs.strategyMemo.length).toBeGreaterThan(1000)
  })

  it('vision fixture Guide has no extra folio beyond standard guide', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const guide = await renderBrandIdentityGuidePdf(form)
    expect(guide.length).toBeGreaterThan(1000)
  })
})
