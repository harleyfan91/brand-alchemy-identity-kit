import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { buildBrandAuditPdfModel } from './brandAuditScaffolds.js'
import { parseTensionResolutionBody } from './landscapeDeckTypes.js'
import { buildStrategyMemoPdfModel } from './strategyMemoScaffolds.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'

describe('landscape deck scaffold models', () => {
  it('parses tension → resolution pairs', () => {
    const pair = parseTensionResolutionBody(
      'Tension: Brand promises speed while operating as a solo expert.\nResolution: Keep speed visible in channel copy.',
    )
    expect(pair).toEqual({
      tension: 'Brand promises speed while operating as a solo expert.',
      resolution: 'Keep speed visible in channel copy.',
    })
  })

  it('builds structured Strategy Memo model with JTBD columns', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const model = buildStrategyMemoPdfModel(form)

    expect(model.readerFraming).toContain('analyzes your brand direction')
    expect(model.jtbd).toHaveLength(3)
    expect(model.jtbd.map((d) => d.label)).toEqual(['Functional', 'Emotional', 'Social'])
    expect(model.messagingHierarchy.pillars.length).toBeGreaterThanOrEqual(2)
    expect(model.roadmap).toHaveLength(3)
  })

  it('builds structured Brand Audit model with observation slots', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildBrandAuditPdfModel(form)

    expect(model.readerFraming).toContain('observes the brand assets')
    expect(model.observations.length).toBeGreaterThan(0)
    expect(model.tension).not.toBeNull()
    expect(model.recommendations).toHaveLength(3)
  })
})
