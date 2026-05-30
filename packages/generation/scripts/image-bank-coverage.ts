#!/usr/bin/env tsx
/**
 * Report image-bank coverage vs the 36-cell style×scene matrix and scene-type weights.
 *
 *   npm run image-bank-coverage
 */

import { readImageBankMetadata } from '../src/image-bank/ingest.js'
import {
  emptyStyleCoverageCounts,
  imageBankCoverageCells,
  incrementStyleCoverageCounts,
  IMAGE_BANK_STYLE_SCENE_FLOOR,
  IMAGE_BANK_V1_TARGET_TOTAL,
  targetCountForSceneType,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_ORIENTATIONS,
} from '@identity-kit/shared'

async function main(): Promise<void> {
  const metadata = await readImageBankMetadata()
  const counts = emptyStyleCoverageCounts()
  const sceneTotals = Object.fromEntries(IMAGE_BANK_SCENE_TYPES.map((s) => [s, 0])) as Record<
    (typeof IMAGE_BANK_SCENE_TYPES)[number],
    number
  >
  const orientationTotals = Object.fromEntries(IMAGE_BANK_ORIENTATIONS.map((o) => [o, 0])) as Record<
    (typeof IMAGE_BANK_ORIENTATIONS)[number],
    number
  >

  for (const asset of metadata.assets) {
    incrementStyleCoverageCounts(counts, asset.styleRegister, asset.sceneType)
    sceneTotals[asset.sceneType] += 1
    orientationTotals[asset.orientation] += 1
  }

  const cells = imageBankCoverageCells()
  const thin = cells.filter((cell) => counts[cell.styleRegister][cell.sceneType] < cell.minimum)

  console.log(`Image bank coverage — ${metadata.assets.length} assets ingested\n`)

  console.log('Orientation totals:')
  for (const orientation of IMAGE_BANK_ORIENTATIONS) {
    console.log(`  ${orientation.padEnd(10)} ${orientationTotals[orientation]}`)
  }

  console.log('\nScene-type totals vs v1 weight targets (300-image bank):')
  for (const sceneType of IMAGE_BANK_SCENE_TYPES) {
    const target = targetCountForSceneType(sceneType, IMAGE_BANK_V1_TARGET_TOTAL)
    console.log(`  ${sceneType.padEnd(12)} ${String(sceneTotals[sceneType]).padStart(3)} / ~${target}`)
  }

  console.log('\nThin cells (< minimum per style × scene):')
  if (thin.length === 0) {
    console.log('  (none — all 36 cells meet minimum)')
  } else {
    for (const cell of thin) {
      const have = counts[cell.styleRegister][cell.sceneType]
      console.log(`  ${cell.styleRegister} × ${cell.sceneType}: ${have} / ${cell.minimum}`)
    }
  }

  const v1Ready = metadata.assets.length >= IMAGE_BANK_STYLE_SCENE_FLOOR && thin.length === 0
  console.log(`\nPro-G v1 bank gate (≥${IMAGE_BANK_STYLE_SCENE_FLOOR} assets, full style×scene grid): ${v1Ready ? 'READY' : 'NOT READY'}`)
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})
