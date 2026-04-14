import { renderToBuffer } from '@react-pdf/renderer'
import { migrateIdentityKitForm, type IdentityKitForm } from '@identity-kit/shared'

import { assertCoreTier } from '../deterministic/coreAssembly.js'
import {
  BrandBriefDocument,
  QuickStartDocument,
  StyleGuideDocument,
  VoicePlaybookDocument,
} from './CoreKitDocuments.js'
import { registerCoreKitPdfFonts } from './registerCoreKitPdfFonts.js'

export type CoreKitPdfBuffers = {
  brandBrief: Buffer
  styleGuide: Buffer
  voicePlaybook: Buffer
  quickStart: Buffer
}

/** Renders four Core Kit PDFs from deterministic templates (no AI). Uses `renderToBuffer` (not `pdf().toBuffer()`, which returns a stream in v4). */
export async function renderCoreKitPdfs(form: IdentityKitForm): Promise<CoreKitPdfBuffers> {
  assertCoreTier(form)
  const migrated = migrateIdentityKitForm(form)
  registerCoreKitPdfFonts()

  const [brandBrief, styleGuide, voicePlaybook, quickStart] = await Promise.all([
    renderToBuffer(<BrandBriefDocument form={migrated} />),
    renderToBuffer(<StyleGuideDocument form={migrated} />),
    renderToBuffer(<VoicePlaybookDocument form={migrated} />),
    renderToBuffer(<QuickStartDocument form={migrated} />),
  ])

  return { brandBrief, styleGuide, voicePlaybook, quickStart }
}
