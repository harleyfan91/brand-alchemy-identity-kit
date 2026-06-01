import { describe, expect, it } from 'vitest'

import { readImageBankMetadata } from './ingest.js'
import {
  buildPersonaSmokeReport,
  countIndustryCoverage,
  INDUSTRY_SMOKE_TARGET,
} from './personaSmoke.js'

describe('personaSmoke (committed bank)', () => {
  it('reports industry coverage counts', async () => {
    const metadata = await readImageBankMetadata()
    const rows = countIndustryCoverage(metadata.assets)
    expect(rows).toHaveLength(8)
    expect(rows.find((r) => r.tag === 'hospitality_food')!.count).toBeGreaterThan(0)
  })

  it('runs deterministic spread fulfillment for all smoke personas', async () => {
    const metadata = await readImageBankMetadata()
    const report = await buildPersonaSmokeReport(metadata.assets)

    expect(report.assetCount).toBeGreaterThanOrEqual(36)
    expect(report.personas.length).toBe(8)

    for (const row of report.personas) {
      expect(row.shortlistLength).toBeGreaterThanOrEqual(6)
      expect(row.spreadReady).toBe(true)
    }
  })

  it('tracks industry gaps below smoke target', async () => {
    const metadata = await readImageBankMetadata()
    const report = await buildPersonaSmokeReport(metadata.assets)
    const thin = report.industryCoverage.filter((r) => r.count < INDUSTRY_SMOKE_TARGET)
    expect(thin.map((r) => r.tag).sort()).toEqual([])
  })
})
