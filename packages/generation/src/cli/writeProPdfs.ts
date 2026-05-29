import { config as loadEnv } from 'dotenv'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { buildProEnhancements } from '../pro/buildProEnhancements.js'
import {
  loadProSmokeFixture,
  PRO_SMOKE_FIXTURE_IDS,
  type ProSmokeFixtureId,
} from '../fixtures/loadProSmokeFixture.js'
import { renderBrandIdentityGuidePdf, renderProKitPdfs } from '../pdf/renderCoreKitPdfs.js'

loadEnv({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../../.env') })

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoOutputRoot = join(__dirname, '../../output')

function printHelp(): void {
  console.log(`Write five Pro Kit PDFs from pro-smoke fixtures (Brief Ideal customer may use live AI).

Usage:
  npm run generate:pro-pdfs -- [text|vision] [--no-ai]

Fixtures:
  text     Harbor Lane Studio — Pro, no existing brand (default)
  vision   Northwind Roasters — Pro + hasExistingBrand (images in fixture only; not used in v1 PDF path)

Flags:
  --no-ai     Skip Anthropic; Brief uses deterministic depth copy only
              (use --no-ai from repo root — npm consumes --dry-run as its own flag)

Examples:
  npm run generate:pro-pdfs
  npm run generate:pro-pdfs -- text
  npm run generate:pro-pdfs -- vision --no-ai

Output directory:
  packages/generation/output/pro-smoke-<text|vision>/
`)
}

function parseArgs(argv: string[]): { fixtureId: ProSmokeFixtureId; dryRun: boolean } {
  const args = argv.filter((a) => a !== '--')
  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  const dryRun = args.includes('--no-ai') || args.includes('--dry-run')
  const nonFlagArgs = args.filter((a) => !a.startsWith('--'))

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

  return { fixtureId, dryRun }
}

async function main() {
  const { fixtureId, dryRun } = parseArgs(process.argv.slice(2))
  const form = migrateIdentityKitForm(loadProSmokeFixture(fixtureId))
  const kitOrderId = `pro-smoke-${fixtureId}`

  const { overrides, meta } = await buildProEnhancements(form, { kitOrderId, dryRun })
  if (meta.idealCustomer === 'ai') {
    console.log('[pro] Brief Ideal customer: AI rewrite applied')
  } else if (meta.idealCustomer === 'scaffold') {
    console.log('[pro] Brief Ideal customer: scaffold fallback (check ai logs)')
  } else if (dryRun) {
    console.log('[pro] --no-ai: Brief Ideal customer stays deterministic')
  }

  const outDir = join(repoOutputRoot, `pro-smoke-${fixtureId}`)
  mkdirSync(outDir, { recursive: true })

  const [pdfs, brandIdentityGuide] = await Promise.all([
    renderProKitPdfs(form, overrides),
    renderBrandIdentityGuidePdf(form),
  ])

  writeFileSync(join(outDir, '01-brand-brief.pdf'), pdfs.brandBrief)
  writeFileSync(join(outDir, '02-style-guide.pdf'), pdfs.styleGuide)
  writeFileSync(join(outDir, '03-voice-playbook.pdf'), pdfs.voicePlaybook)
  writeFileSync(join(outDir, '04-quick-start.pdf'), pdfs.quickStart)
  writeFileSync(join(outDir, '05-brand-identity-guide.pdf'), brandIdentityGuide)

  console.log(`Fixture: ${fixtureId} (${form.step1.businessName})`)
  console.log(`Wrote 5 PDFs to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
