import { renderToBuffer } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'

import { assertCoreTier } from '../deterministic/coreAssembly.js'
import {
  BrandBriefDocument,
  QuickStartDocument,
  StyleGuideDocument,
  VoicePlaybookDocument,
} from './CoreKitDocuments.js'

export type CoreKitPdfBuffers = {
  brandBrief: Buffer
  styleGuide: Buffer
  voicePlaybook: Buffer
  quickStart: Buffer
}

/** Renders four Core Kit PDFs from deterministic templates (no AI). Uses `renderToBuffer` (not `pdf().toBuffer()`, which returns a stream in v4). */
export async function renderCoreKitPdfs(form: IdentityKitForm): Promise<CoreKitPdfBuffers> {
  assertCoreTier(form)

  const [brandBrief, styleGuide, voicePlaybook, quickStart] = await Promise.all([
    renderToBuffer(<BrandBriefDocument form={form} />),
    renderToBuffer(<StyleGuideDocument form={form} />),
    renderToBuffer(<VoicePlaybookDocument form={form} />),
    renderToBuffer(<QuickStartDocument form={form} />),
  ])

  return { brandBrief, styleGuide, voicePlaybook, quickStart }
}
