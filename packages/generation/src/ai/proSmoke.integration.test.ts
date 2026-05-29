/**
 * Live Anthropic smoke tests — NOT part of `npm run test:generation`.
 *
 * Run explicitly when you want to spend API credits:
 *   npm run test:pro-smoke
 *
 * Fixtures: fixtures/pro-smoke/text.json and vision.json + images/ (local JPEGs, base64 at call time).
 * @see docs/guides/PRO_API_SMOKE_TESTS.md
 */
import { describe, expect, it } from 'vitest'
import { migrateIdentityKitForm } from '@identity-kit/shared'

import {
  loadProSmokeFixture,
} from '../fixtures/loadProSmokeFixture.js'
import { hasAnthropicApiKey } from './resolveAnthropicApiKey.js'
import { runBrandAuditWhatWeSawSmoke } from './sections/brandAuditWhatWeSawSmoke.js'
import { rewriteBriefIdealCustomer } from './sections/briefIdealCustomer.js'

const hasApiKey = hasAnthropicApiKey()

describe.skipIf(!hasApiKey)('Pro API smoke — text-only (1 Sonnet call)', () => {
  it('pro-smoke/text: brief.idealCustomer differs from Core scaffold', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))

    const result = await rewriteBriefIdealCustomer(form, 'pro-smoke-text')

    expect(result.pdfBody.trim().length).toBeGreaterThan(20)
    expect(result.pdfBody).toContain('What defines them')
    expect(result.pdfBody).toContain('What they care about')
    if (result.source === 'ai') {
      expect(result.data.fieldsCited.length).toBeGreaterThan(0)
    }
  }, 90_000)
})

describe.skipIf(!hasApiKey)('Pro API smoke — vision (1 Sonnet multimodal call)', () => {
  it('pro-smoke/vision: brandAudit.whatWeSaw observes logo + reference images', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))

    const result = await runBrandAuditWhatWeSawSmoke(form, 'pro-smoke-vision')

    expect(result.source).toBe('ai')
    expect(result.data.fieldsCited.length).toBeGreaterThan(0)
    const hasVisualObservation =
      Boolean(result.data.logoObservation?.trim()) ||
      Boolean(result.data.referenceImageObservation?.trim())
    expect(hasVisualObservation).toBe(true)
  }, 120_000)
})
