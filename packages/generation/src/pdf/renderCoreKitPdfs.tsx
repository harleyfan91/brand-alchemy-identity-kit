import { renderToBuffer } from '@react-pdf/renderer'
import { migrateIdentityKitForm, type IdentityKitForm } from '@identity-kit/shared'

import { assertCoreTier } from '../deterministic/coreAssembly.js'
import { assertProTier } from '../pro/assertProTier.js'
import type { ProSectionOverrides } from '../pro/proSectionOverrides.js'
import {
  BrandIdentityGuideDocument,
  BrandBriefDocument,
  ContentStarterDocument,
  QuickStartDocument,
  RedoStyleDummyGuideDocument,
  StyleGuideDocument,
  VoicePlaybookDocument,
} from './CoreKitDocuments.js'
import { BrandAuditDocument, BrandStrategyMemoDocument } from './ProKitDocuments.js'
import { shouldIncludeBrandAudit } from '../pro/shouldIncludeBrandAudit.js'
import { registerCoreKitPdfFonts } from './registerCoreKitPdfFonts.js'
import {
  resolveStyleGuideVisualReferenceForRender,
  type StyleGuideRenderOptions,
} from './resolveStyleGuideVisualReferenceForRender.js'

export type { StyleGuideRenderOptions } from './resolveStyleGuideVisualReferenceForRender.js'

export type ProKitRenderOptions = {
  styleGuide?: StyleGuideRenderOptions
}

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

export type ProKitPdfBuffers = CoreKitPdfBuffers & {
  contentStarter: Buffer
  strategyMemo: Buffer
  brandAudit: Buffer | null
}

export async function renderStyleGuidePdf(
  form: IdentityKitForm,
  options?: StyleGuideRenderOptions,
): Promise<Buffer> {
  const migrated = migrateIdentityKitForm(form)
  registerCoreKitPdfFonts()
  const visualReferenceModel = await resolveStyleGuideVisualReferenceForRender(migrated, options)
  return renderToBuffer(
    <StyleGuideDocument form={migrated} visualReferenceModel={visualReferenceModel} />,
  )
}

/** Renders full Pro Kit PDF set for QA (--no-ai scaffolds on Pro-only sections). */
export async function renderProKitPdfs(
  form: IdentityKitForm,
  proOverrides?: ProSectionOverrides,
  renderOptions?: ProKitRenderOptions,
): Promise<ProKitPdfBuffers> {
  assertProTier(form)
  const migrated = migrateIdentityKitForm(form)
  registerCoreKitPdfFonts()

  const styleGuideOptions = renderOptions?.styleGuide

  const visualReferenceModel = await resolveStyleGuideVisualReferenceForRender(migrated, styleGuideOptions)

  const [
    brandBrief,
    styleGuide,
    voicePlaybook,
    quickStart,
    contentStarter,
    strategyMemo,
    brandAudit,
  ] = await Promise.all([
    renderToBuffer(<BrandBriefDocument form={migrated} proOverrides={proOverrides} />),
    renderToBuffer(
      <StyleGuideDocument form={migrated} visualReferenceModel={visualReferenceModel} />,
    ),
    renderToBuffer(<VoicePlaybookDocument form={migrated} />),
    renderToBuffer(<QuickStartDocument form={migrated} />),
    renderToBuffer(<ContentStarterDocument form={migrated} />),
    renderToBuffer(<BrandStrategyMemoDocument form={migrated} />),
    shouldIncludeBrandAudit(migrated)
      ? renderToBuffer(<BrandAuditDocument form={migrated} />)
      : Promise.resolve(null),
  ])

  return { brandBrief, styleGuide, voicePlaybook, quickStart, contentStarter, strategyMemo, brandAudit }
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
