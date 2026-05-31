import { config as loadEnv } from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import {
  VISUAL_REFERENCE_PHOTO_COUNTS,
  type VisualReferencePhotoCount,
} from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { buildProEnhancements } from '../pro/buildProEnhancements.js'
import { shouldIncludeBrandAudit } from '../pro/shouldIncludeBrandAudit.js'
import {
  loadProSmokeFixture,
  PRO_SMOKE_FIXTURE_IDS,
  type ProSmokeFixtureId,
} from '../fixtures/loadProSmokeFixture.js'
import {
  renderBrandIdentityGuidePdf,
  renderProKitPdfs,
  renderStyleGuidePdf,
} from '../pdf/renderCoreKitPdfs.js'

loadEnv({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../../.env') })

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoOutputRoot = join(__dirname, '../../output')

export type WriteProPdfsCliOptions = {
  fixtureId: ProSmokeFixtureId
  dryRun: boolean
  visualReferencePhotoCount?: VisualReferencePhotoCount
  visualReferenceAll: boolean
}

function parseVisualReferencePhotoCount(raw: string): VisualReferencePhotoCount | null {
  const n = Number(raw)
  if (n === 6 || n === 8 || n === 9) return n
  return null
}

export function parseWriteProPdfsArgs(argv: string[]): WriteProPdfsCliOptions {
  const args = argv.filter((a) => a !== '--')
  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  const dryRun = args.includes('--no-ai') || args.includes('--dry-run')
  const visualReferenceAll = args.includes('--visual-ref-all')

  let visualReferencePhotoCount: VisualReferencePhotoCount | undefined
  for (const arg of args) {
    if (arg.startsWith('--visual-ref=')) {
      const parsed = parseVisualReferencePhotoCount(arg.slice('--visual-ref='.length))
      if (!parsed) {
        console.error(`Invalid --visual-ref value. Use 6, 8, or 9.\n`)
        printHelp()
        process.exit(1)
      }
      visualReferencePhotoCount = parsed
    }
  }

  const nonFlagArgs = args.filter(
    (a) => !a.startsWith('--') && !a.startsWith('-h') && a !== '--help',
  )

  if (nonFlagArgs.length > 1) {
    console.error('Too many arguments. Pass one fixture id (text or vision).\n')
    printHelp()
    process.exit(1)
  }

  const fixtureId = (nonFlagArgs[0] ?? 'text') as ProSmokeFixtureId
  if (!PRO_SMOKE_FIXTURE_IDS.includes(fixtureId)) {
    console.error(`Unknown fixture "${fixtureId}". Valid: ${PRO_SMOKE_FIXTURE_IDS.join(', ')}\n`)
    printHelp()
    process.exit(1)
  }

  return { fixtureId, dryRun, visualReferencePhotoCount, visualReferenceAll }
}

function printHelp(): void {
  console.log(`Write the full Pro Kit PDF inventory from pro-smoke fixtures.

Usage:
  npm run generate:pro-pdfs -- [text|vision] [--no-ai] [--visual-ref=6|8|9] [--visual-ref-all]

Fixtures:
  text     Harbor Lane Studio — Pro, no existing brand (7 PDFs + guide)
  vision   Northwind Roasters — Pro + existing brand (8 PDFs + guide)

Output files (packages/generation/output/pro-smoke-<fixture>/):
  01-brand-brief.pdf
  02-style-guide.pdf          (Core: 5 landscape spreads; Pro: +2 visual reference spreads)
  03-voice-playbook.pdf       (3 pages Pro: core + page 3 extensions)
  04-quick-start.pdf
  05-brand-identity-guide.pdf
  06-content-starter-pack.pdf
  07-brand-strategy-memo.pdf
  08-brand-audit.pdf          (vision fixture only — conditional on existing brand)

Visual reference layout QA:
  --visual-ref=6|8|9          QA: force placeholder scaffold tier for 02-style-guide.pdf
  --visual-ref-all            Write visual-reference-layouts/02-style-guide-vr{6,8,9}.pdf (scaffold QA)

Flags:
  --no-ai     Skip Anthropic; all sections use deterministic scaffolds

Examples:
  npm run generate:pro-pdfs -- vision --no-ai
  npm run generate:pro-pdfs -- vision --no-ai --visual-ref-all
  npm run generate:pro-pdfs -- vision --no-ai --visual-ref=6
`)
}

async function writeVisualReferenceLayoutComparisonPdfs(
  form: ReturnType<typeof migrateIdentityKitForm>,
  outDir: string,
): Promise<void> {
  const layoutDir = join(outDir, 'visual-reference-layouts')
  mkdirSync(layoutDir, { recursive: true })

  for (const count of VISUAL_REFERENCE_PHOTO_COUNTS) {
    const pdf = await renderStyleGuidePdf(form, { visualReferencePhotoCount: count })
    const filename = `02-style-guide-vr${count}.pdf`
    writeFileSync(join(layoutDir, filename), pdf)
    console.log(`[pro] Wrote ${filename} (vr_${count}: ${count} bank photos)`)
  }
}

async function main() {
  const { fixtureId, dryRun, visualReferencePhotoCount, visualReferenceAll } = parseWriteProPdfsArgs(
    process.argv.slice(2),
  )
  const form = migrateIdentityKitForm(loadProSmokeFixture(fixtureId))
  const kitOrderId = `pro-smoke-${fixtureId}`
  const includeAudit = shouldIncludeBrandAudit(form)

  const { overrides, meta } = await buildProEnhancements(form, { kitOrderId, dryRun })
  if (meta.idealCustomer === 'ai') {
    console.log('[pro] Brief Ideal customer: AI rewrite applied')
  } else if (meta.idealCustomer === 'scaffold') {
    console.log('[pro] Brief Ideal customer: scaffold fallback (check ai logs)')
  } else if (dryRun) {
    console.log('[pro] --no-ai: Brief Ideal customer stays deterministic')
    console.log('[pro] --no-ai: Pro-only sections use scaffolds only')
  }

  const outDir = join(repoOutputRoot, `pro-smoke-${fixtureId}`)
  mkdirSync(outDir, { recursive: true })

  const [pdfs, brandIdentityGuide] = await Promise.all([
    renderProKitPdfs(form, overrides, {
      styleGuide: visualReferencePhotoCount
        ? { visualReferencePhotoCount }
        : undefined,
    }),
    renderBrandIdentityGuidePdf(form),
  ])

  writeFileSync(join(outDir, '01-brand-brief.pdf'), pdfs.brandBrief)
  writeFileSync(join(outDir, '02-style-guide.pdf'), pdfs.styleGuide)
  writeFileSync(join(outDir, '03-voice-playbook.pdf'), pdfs.voicePlaybook)
  writeFileSync(join(outDir, '04-quick-start.pdf'), pdfs.quickStart)
  writeFileSync(join(outDir, '05-brand-identity-guide.pdf'), brandIdentityGuide)
  writeFileSync(join(outDir, '06-content-starter-pack.pdf'), pdfs.contentStarter)
  writeFileSync(join(outDir, '07-brand-strategy-memo.pdf'), pdfs.strategyMemo)
  if (pdfs.brandAudit) {
    writeFileSync(join(outDir, '08-brand-audit.pdf'), pdfs.brandAudit)
  }

  if (visualReferenceAll) {
    await writeVisualReferenceLayoutComparisonPdfs(form, outDir)
  }

  const fileCount = includeAudit ? 8 : 7
  console.log(`Fixture: ${fixtureId} (${form.step1.businessName})`)
  console.log(`Wrote ${fileCount} kit PDFs + Brand Identity Guide to ${outDir}`)
  if (visualReferencePhotoCount) {
    console.log(
      `[pro] Style Guide visual reference QA tier: vr_${visualReferencePhotoCount} (${visualReferencePhotoCount} bank photos, scaffold)`,
    )
  } else {
    console.log('[pro] Style Guide visual reference: deterministic bank fulfillment (or omitted if bank < 6)')
  }
  if (!includeAudit) {
    console.log('[pro] 08-brand-audit.pdf omitted (no existing-brand inputs on this fixture)')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
