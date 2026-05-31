#!/usr/bin/env tsx
/**
 * Preflight remote image URLs before visual QA / ingest.
 *
 * Checks download, minimum size, processed dimensions, orientation, and 250 KB cap
 * — without writing to the bank.
 *
 *   npm run preflight-image-bank-candidates -- --url="https://images.unsplash.com/..."
 *   npm run preflight-image-bank-candidates -- --file=dev/image-bank/candidates.example.json
 *   npm run preflight-image-bank-candidates -- --file=candidates.json --save-dir=dev/image-bank/_preflight
 *   npm run preflight-image-bank-candidates -- --file=candidates.json --json
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { z } from 'zod'

import { downloadImageToBuffer } from '../src/image-bank/download.js'
import {
  preflightImageBankCandidate,
  preflightImageBankCandidates,
  summarizePreflightResults,
  type ImageBankPreflightResult,
} from '../src/image-bank/preflightCandidate.js'

const CandidatesFileSchema = z
  .object({
    candidates: z
      .array(
        z.object({
          id: z.string().min(1).optional(),
          url: z.string().url(),
          note: z.string().optional(),
        }),
      )
      .min(1),
  })
  .strict()

function usage(): never {
  console.error(`Usage:
  npm run preflight-image-bank-candidates -- --url=<download-url> [--id=label] [--save-dir=path]

  npm run preflight-image-bank-candidates -- --file=<candidates.json> [--save-dir=path] [--json]

  --save-dir   Write processed preview JPEGs for PASS rows only (for visual QA)
  --json       Machine-readable output (agent-friendly)
`)
  process.exit(1)
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function printHumanResults(results: ImageBankPreflightResult[]): void {
  const { passed, failed } = summarizePreflightResults(results)
  console.log(`\nPreflight ${results.length} candidates — ${passed} passed, ${failed} failed\n`)

  for (const row of results) {
    if (row.ok) {
      const dims = `${row.widthPx}×${row.heightPx} ${row.orientation}`
      const size = formatKb(row.processedBytes ?? 0)
      const saved = row.savedPath ? ` → ${row.savedPath}` : ''
      const note = row.note ? ` (${row.note})` : ''
      console.log(`PASS  ${row.id}  ${dims}  ${size} q${row.jpegQuality}${note}${saved}`)
      continue
    }
    const note = row.note ? ` (${row.note})` : ''
    console.log(`FAIL  ${row.id}  ${row.reason}${note}`)
  }

  if (passed > 0) {
    console.log('\nNext: visual QA on PASS rows only — confirm pixels match tags before queue ingest.')
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  if (argv.includes('--help') || argv.includes('-h')) usage()

  const get = (key: string) => argv.find((arg) => arg.startsWith(`${key}=`))?.slice(key.length + 1)
  const asJson = argv.includes('--json')
  const saveDirArg = get('--save-dir')
  const saveDir = saveDirArg ? resolve(process.cwd(), saveDirArg) : undefined

  const fileArg = get('--file')
  const urlArg = get('--url')

  let results: ImageBankPreflightResult[]

  if (fileArg) {
    const absolute = resolve(process.cwd(), fileArg)
    const parsed = CandidatesFileSchema.parse(JSON.parse(await readFile(absolute, 'utf8')))
    results = await preflightImageBankCandidates(parsed.candidates, downloadImageToBuffer, { saveDir })
  } else if (urlArg) {
    results = [
      await preflightImageBankCandidate(urlArg, downloadImageToBuffer, {
        id: get('--id') ?? 'candidate',
        saveDir,
      }),
    ]
  } else {
    usage()
  }

  if (asJson) {
    console.log(JSON.stringify({ ...summarizePreflightResults(results), results }, null, 2))
  } else {
    printHumanResults(results)
  }

  const { passed, failed } = summarizePreflightResults(results)
  if (passed === 0) process.exit(1)
}

main().catch((err) => {
  console.error('❌', err instanceof Error ? err.message : err)
  process.exit(1)
})
