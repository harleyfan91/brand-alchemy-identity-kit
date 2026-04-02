import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import { renderCoreKitPdfs } from '../pdf/renderCoreKitPdfs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../../output')

async function main() {
  mkdirSync(outDir, { recursive: true })
  const form = loadCoreSampleFixture()
  const pdfs = await renderCoreKitPdfs(form)

  writeFileSync(join(outDir, '01-brand-brief.pdf'), pdfs.brandBrief)
  writeFileSync(join(outDir, '02-style-guide.pdf'), pdfs.styleGuide)
  writeFileSync(join(outDir, '03-voice-playbook.pdf'), pdfs.voicePlaybook)
  writeFileSync(join(outDir, '04-quick-start.pdf'), pdfs.quickStart)

  console.log(`Wrote 4 PDFs to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
