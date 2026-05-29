import { renderToBuffer } from '@react-pdf/renderer'
import { migrateIdentityKitForm, type IdentityKitForm } from '@identity-kit/shared'

import { assertCoreTier } from '../deterministic/coreAssembly.js'
import { assertProTier } from '../pro/assertProTier.js'
import type { ProSectionOverrides } from '../pro/proSectionOverrides.js'
import {
  BrandIdentityGuideDocument,
  BrandBriefDocument,
  QuickStartDocument,
  RedoStyleDummyGuideDocument,
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

export type ProKitPdfBuffers = CoreKitPdfBuffers

/** Renders five shared Kit PDFs for Pro tier; Brief may include AI section overrides. */
export async function renderProKitPdfs(
  form: IdentityKitForm,
  proOverrides?: ProSectionOverrides,
): Promise<ProKitPdfBuffers> {
  assertProTier(form)
  const migrated = migrateIdentityKitForm(form)
  registerCoreKitPdfFonts()

  const [brandBrief, styleGuide, voicePlaybook, quickStart] = await Promise.all([
    renderToBuffer(<BrandBriefDocument form={migrated} proOverrides={proOverrides} />),
    renderToBuffer(<StyleGuideDocument form={migrated} />),
    renderToBuffer(<VoicePlaybookDocument form={migrated} />),
    renderToBuffer(<QuickStartDocument form={migrated} />),
  ])

  return { brandBrief, styleGuide, voicePlaybook, quickStart }
}

export async function renderBrandIdentityGuidePdf(form: IdentityKitForm): Promise<Buffer> {
  const migrated = migrateIdentityKitForm(form)
  registerCoreKitPdfFonts()
  return renderToBuffer(<BrandIdentityGuideDocument form={migrated} />)
}

export async function renderRedoStyleDummyGuidePdf(): Promise<Buffer> {
  registerCoreKitPdfFonts()
  return renderToBuffer(<RedoStyleDummyGuideDocument />)
}
