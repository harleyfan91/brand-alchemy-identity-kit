import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { migrateIdentityKitForm, type IdentityKitForm } from '@identity-kit/shared'

import { buildBrandIdentityGuideModel } from '../deterministic/brandIdentityGuideModel.js'
import { PERSONA_IDS, loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { pickExamplesCtaTemplate } from '../pdf/ctaFrames/ctaFolioTemplate.js'
import { ctaFrameSlotClass } from '../pdf/ctaFrames/slotClass.js'
import { renderBrandIdentityGuidePdf, renderCoreKitPdfs, renderRedoStyleDummyGuidePdf } from '../pdf/renderCoreKitPdfs.js'

/** One-line QA hint: which folio 05 CTA template the guide will use (matches PDF renderer inputs). */
function folio05CtaLayoutSummary(form: IdentityKitForm): string | null {
  const model = buildBrandIdentityGuideModel(migrateIdentityKitForm(form))
  const surfaces = model.examples.ctaSurfaces
  if (surfaces.length === 0) return null
  const slotClasses = surfaces.map((surface) => {
    const p = surface.presentation
    if (!p?.frameId) return 'desktop_wide' as const
    return ctaFrameSlotClass(p.frameId, p.socialFeedVariant)
  })
  const template = pickExamplesCtaTemplate(slotClasses, model.signals.contentDensityBias)
  return `Folio 05 Examples CTA layout: ${template} (${slotClasses.join(' + ')}, contentDensityBias=${model.signals.contentDensityBias})`
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoOutputRoot = join(__dirname, '../../output')

function printHelp(): void {
  console.log(`Write the current Core PDFs plus the prototype Brand Identity Guide for manual review.

Usage:
  npm run generate:pdfs -- [persona]
  npm run generate:pdfs -- redo-dummy

Personas (very different sample brands):
  default          Northline Studio — creative solo expert, friendly, growing (legacy core-sample)
  coffee-founder   Harbor Row Coffee — new solo maker, food/bev, organic + earthy palette
  established-pro  Sterling Compliance — established expert, professional, luxe minimal
  community-org    Riverbank Food Share — mission nonprofit, calm friendly, ocean palette
  cta-mixed        Pinebridge Studio — website + Facebook to QA folio 05 mobile_desktop_row (one mobile-tall + one desktop-wide shell)

Examples:
  npm run generate:pdfs
  npm run generate:pdfs -- coffee-founder
  npm run generate:pdfs -- established-pro
  npm run generate:pdfs -- redo-dummy

Output directory:
  packages/generation/output/<persona-id>/
`)
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--')
  const redoDummyOnly = args.includes('--redo-dummy')
  const nonFlagArgs = args.filter((a) => !a.startsWith('--'))
  if (args.includes('-h') || args.includes('--help')) {
    printHelp()
    return
  }

  if (redoDummyOnly || nonFlagArgs[0] === 'redo-dummy') {
    if (nonFlagArgs.length > 0) {
      if (nonFlagArgs.length === 1 && nonFlagArgs[0] === 'redo-dummy') {
        // Allowed shorthand path for nested npm scripts that do not forward flags cleanly.
      } else {
        console.error('Do not pass a persona when using redo-dummy.\n')
        printHelp()
        process.exit(1)
      }
    }
    const outDir = join(repoOutputRoot, 'redo-dummy')
    mkdirSync(outDir, { recursive: true })
    const pdf = await renderRedoStyleDummyGuidePdf()
    writeFileSync(join(outDir, '01-redo-style-dummy-guide.pdf'), pdf)
    console.log(`Wrote 1 PDF to ${outDir}`)
    return
  }

  const personaId = nonFlagArgs[0] ?? 'default'
  if (nonFlagArgs.length > 1) {
    console.error('Too many arguments. Pass one persona id or omit for default.\n')
    printHelp()
    process.exit(1)
  }

  let form
  try {
    form = loadPersonaFixture(personaId)
  } catch (e) {
    console.error((e as Error).message)
    console.error(`\nValid personas: ${PERSONA_IDS.join(', ')}, redo-dummy\n`)
    printHelp()
    process.exit(1)
  }

  const safeDir = personaId.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'default'
  const outDir = join(repoOutputRoot, safeDir)
  mkdirSync(outDir, { recursive: true })

  const [pdfs, brandIdentityGuide] = await Promise.all([renderCoreKitPdfs(form), renderBrandIdentityGuidePdf(form)])

  const folio05Note = folio05CtaLayoutSummary(form)
  if (folio05Note) console.log(folio05Note)

  writeFileSync(join(outDir, '01-brand-brief.pdf'), pdfs.brandBrief)
  writeFileSync(join(outDir, '02-style-guide.pdf'), pdfs.styleGuide)
  writeFileSync(join(outDir, '03-voice-playbook.pdf'), pdfs.voicePlaybook)
  writeFileSync(join(outDir, '04-quick-start.pdf'), pdfs.quickStart)
  writeFileSync(join(outDir, '05-brand-identity-guide.pdf'), brandIdentityGuide)

  console.log(`Persona: ${personaId} (${form.step1.businessName})`)
  console.log(`Wrote 5 PDFs to ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
