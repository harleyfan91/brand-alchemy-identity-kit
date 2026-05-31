#!/usr/bin/env tsx
/**
 * Persona smoke gate — industry tag coverage + deterministic visual-reference dry-run.
 * No AI calls.
 *
 *   npm run image-bank-persona-smoke
 *   npm run image-bank-persona-smoke -- --json
 */

import { readImageBankMetadata } from '../src/image-bank/ingest.js'
import {
  buildPersonaSmokeReport,
  INDUSTRY_SMOKE_TARGET,
  kitSignalsSummary,
  MOODBOARD_PERSONA_SMOKE_FIXTURES,
  type PersonaSmokeReport,
} from '../src/image-bank/personaSmoke.js'

function printHumanReport(report: PersonaSmokeReport): void {
  console.log(`Persona smoke — ${report.assetCount} bank assets\n`)

  console.log(`Industry suitability (target ≥ ${INDUSTRY_SMOKE_TARGET} tagged assets each):`)
  for (const row of report.industryCoverage) {
    const mark = row.meetsTarget ? '✓' : '✗'
    console.log(`  ${mark} ${row.tag.padEnd(22)} ${row.count}`)
  }
  console.log(`\nIndustry gate: ${report.industryGatePass ? 'PASS' : 'FAIL'}\n`)

  console.log('Deterministic visual reference dry-run (tag match → shortlist → layout picks):')
  for (const row of report.personas) {
    const mark = row.spreadReady ? 'PASS' : 'FAIL'
    console.log(`\n  [${mark}] ${row.fixtureId} — ${row.label}`)
    console.log(`       industry: ${row.industry} → [${row.industryTags.join(', ') || 'agnostic'}]`)
    console.log(`       pool: ${row.industryPool} assets · shortlist: ${row.shortlistLength}`)
    console.log(`       layout: ${row.layoutId ?? '—'} · photo picks: ${row.photoPicks}`)
    console.log(`       top: ${row.topPicks.join(', ')}`)
  }

  console.log(`\nPersona spread gate: ${report.personaGatePass ? 'PASS' : 'FAIL'}`)
  console.log(
    `\nOverall: ${report.industryGatePass && report.personaGatePass ? 'READY for persona smoke' : 'NOT READY — see gaps above'}`,
  )
}

async function main(): Promise<void> {
  const json = process.argv.includes('--json')
  const metadata = await readImageBankMetadata()
  const report = await buildPersonaSmokeReport(metadata.assets)

  if (json) {
    console.log(
      JSON.stringify(
        {
          ...report,
          fixtures: MOODBOARD_PERSONA_SMOKE_FIXTURES.map((f) => {
            const form = f.load()
            return { id: f.id, label: f.label, signals: kitSignalsSummary(form) }
          }),
        },
        null,
        2,
      ),
    )
  } else {
    printHumanReport(report)
  }

  if (!report.industryGatePass || !report.personaGatePass) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})
