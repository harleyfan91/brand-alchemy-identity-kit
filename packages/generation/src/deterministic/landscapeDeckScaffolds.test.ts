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

  it('builds structured Strategy Memo model with JTBD columns and roadmap timeline', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('text'))
    const model = buildStrategyMemoPdfModel(form)

    expect(model.readerFraming).toContain('analyzes your brand direction')
    expect(model.jtbd).toHaveLength(3)
    expect(model.jtbd.map((d) => d.label)).toEqual(['Functional', 'Emotional', 'Social'])
    expect(model.messagingHierarchy.pillars.length).toBeGreaterThanOrEqual(2)
    expect(model.roadmap.nodes).toHaveLength(4)
    expect(model.roadmap.nodes[0]).toMatchObject({ kind: 'quick_start_bridge', horizonLabel: 'Days 1–30' })
    expect(model.roadmap.nodes.filter((n) => n.kind === 'priority')).toHaveLength(3)
    expect(model.roadmap.framing).toMatch(/Quick Start covers the first 30 days/i)
  })

  it('roadmap priorities do not duplicate Quick Start week-task phrasing', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildStrategyMemoPdfModel(form)
    const priorityBodies = model.roadmap.nodes
      .filter((n) => n.kind === 'priority')
      .map((n) => `${n.title} ${n.body}`.toLowerCase())

    for (const body of priorityBodies) {
      expect(body).not.toMatch(/update your google business profile/i)
      expect(body).not.toMatch(/week 1/i)
      expect(body).not.toMatch(/☐/i)
    }
    expect(priorityBodies.join(' ')).toMatch(/activates|proof|primary message/i)
  })

  it('ships problem story narrative when differentiation and competitors are substantive', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildStrategyMemoPdfModel(form)
    expect(model.narrative?.kind).toBe('problem_story')
    expect(model.narrative?.body.length).toBeGreaterThan(60)
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
