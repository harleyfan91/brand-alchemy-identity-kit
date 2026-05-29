import { describe, expect, it, vi, beforeEach } from 'vitest'
import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import {
  formatBriefIdealCustomerForPdf,
  idealCustomerSnapshotFromIntake,
} from '../deterministic/idealCustomerSnapshot.js'
import { buildPromptContext } from './prompts/buildPromptContext.js'
import { rewriteBriefIdealCustomer } from './sections/briefIdealCustomer.js'
import * as client from './client.js'

describe('buildPromptContext', () => {
  it('includes Pro depth fields for pro-smoke text fixture', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const ctx = buildPromptContext(form)
    expect(ctx.audienceContext).toContain('painPoints')
    expect(ctx.audienceContext).toContain('desiredOutcomes')
    expect(ctx.businessContext).toContain('businessDescription')
    expect(ctx.valuesContext).toContain('missionStatement')
  })
})

describe('rewriteBriefIdealCustomer (mocked)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns structured snapshot and pdfBody when callClaude succeeds', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const fallback = idealCustomerSnapshotFromIntake(form)

    vi.spyOn(client, 'callClaude').mockResolvedValue({
      data: {
        summaryLine: 'Independent retailers with 1–2 locations and no in-house designer.',
        traits: [
          'Owner signs off on chalkboards and packaging',
          'Small staff rotates through weekend shifts',
        ],
        caresAbout: [
          'One template system staff can update',
          'Shelf and window presence that matches the products',
        ],
        fieldsCited: ['customerArchetype', 'painPoints', 'desiredOutcomes'],
      },
      meta: {
        model: 'claude-sonnet-4-5',
        inputTokens: 100,
        cachedInputTokens: 50,
        outputTokens: 40,
        stopReason: 'end_turn',
        elapsedMs: 10,
      },
    })

    const result = await rewriteBriefIdealCustomer(form, 'test-order')
    expect(result.source).toBe('ai')
    expect(result.data.traits).toHaveLength(2)
    expect(result.pdfBody).toContain('What defines them')
    expect(result.pdfBody).not.toBe(formatBriefIdealCustomerForPdf(fallback))
    expect(result.data.fieldsCited.length).toBeGreaterThan(0)
  })

  it('falls back to intake snapshot on safety refusal', async () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const expected = idealCustomerSnapshotFromIntake(form)

    const { SafetyRefusalError } = await import('./errors.js')
    vi.spyOn(client, 'callClaude').mockRejectedValue(new SafetyRefusalError('brief.idealCustomer'))

    const result = await rewriteBriefIdealCustomer(form, 'test-order')
    expect(result.source).toBe('scaffold')
    expect(result.data.summaryLine).toBe(expected.summaryLine)
    expect(result.pdfBody).toBe(formatBriefIdealCustomerForPdf(expected))
  })
})
