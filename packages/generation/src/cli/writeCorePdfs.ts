import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PERSONA_IDS, loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { renderCoreKitPdfs } from '../pdf/renderCoreKitPdfs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoOutputRoot = join(__dirname, '../../output')

function printHelp(): void {
  console.log(`Write four Core kit PDFs for manual review.

Usage:
  npm run generate:pdfs -- [persona]

Personas (very different sample brands):
  default          Northline Studio — creative solo expert, friendly, growing (legacy core-sample)
  coffee-founder   Harbor Row Coffee — new solo maker, food/bev, organic + earthy palette
  established-pro  Sterling Compliance — established expert, professional, luxe minimal
  community-org    Riverbank Food Share — mission nonprofit, calm friendly, ocean palette

Examples:
  npm run generate:pdfs
  npm run generate:pdfs -- coffee-founder
  npm run generate:pdfs -- established-pro

Output directory:
  packages/generation/output/<persona-id>/
`)
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    return
  }

  const personaId = args[0] ?? 'default'
  if (args.length > 1) {
    console.error('Too many arguments. Pass one persona id or omit for default.\n')
    printHelp()
    process.exit(1)
  }

  let form
  try {
    form = loadPersonaFixture(personaId)
  } catch (e) {
    console.error((e as Error).message)
    console.error(`\nValid personas: ${PERSONA_IDS.join(', ')}\n`)
    printHelp()
    process.exit(1)
  }

  const safeDir = personaId.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'default'
  const outDir = join(repoOutputRoot, safeDir)
  mkdirSync(outDir, { recursive: true })

  const pdfs = await renderCoreKitPdfs(form)

  writeFileSync(join(outDir, '01-brand-brief.pdf'), pdfs.brandBrief)
  writeFileSync(join(outDir, '02-style-guide.pdf'), pdfs.styleGuide)
  writeFileSync(join(outDir, '03-voice-playbook.pdf'), pdfs.voicePlaybook)
  writeFileSync(join(outDir, '04-quick-start.pdf'), pdfs.quickStart)

  console.log(`Persona: ${personaId} (${form.step1.businessName})`)
  console.log(`Wrote 4 PDFs to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
