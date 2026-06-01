/** @deprecated — content migrated to existingBrandEntryScaffolds.ts. Retained for reference only. */

import { canonicalPaletteId, formatPaletteGuideHeader, type IdentityKitForm } from '@identity-kit/shared'

import { parseTensionResolutionBody, type TensionPair } from './landscapeDeckTypes.js'

export const BRAND_AUDIT_READER_FRAMING =
  'This audit observes the brand assets you uploaded, names what is already serving you, and bridges them to the direction you selected in the rest of this kit. Every recommendation acts on your existing assets so they align with the palette, style, and tone you have chosen — your kit direction stays fixed.'

export type AuditObservation = {
  label: string
  body: string
}

export type BrandAuditPdfModel = {
  readerFraming: string
  observations: AuditObservation[]
  serving: { body: string }
  tension: TensionPair | null
  recommendations: string[]
}

/**
 * Deterministic Brand Audit scaffold (--no-ai / pre-vision path).
 * @see DELIVERABLE_PRODUCTION_SPEC.md §7
 */
export function buildBrandAuditPdfModel(form: IdentityKitForm): BrandAuditPdfModel {
  const name = form.step1.businessName.trim()
  const existing = form.step6.existingBrand
  const paletteLabel = formatPaletteGuideHeader(canonicalPaletteId(form.step6.selectedPalette))
  const style = form.step6.selectedStyle.replace(/_/g, ' ')
  const observations: AuditObservation[] = []

  if (existing?.logoRef?.trim()) {
    observations.push({
      label: 'Logo',
      body: `Logo on file (${existing.logoRef}). Note overall weight, contrast, and whether it matches the ${paletteLabel} direction.`,
    })
  }
  if (existing?.referenceImageRef?.trim()) {
    observations.push({
      label: 'Reference image',
      body: `Reference image on file (${existing.referenceImageRef}). Use it as a mood and composition reference for the ${style} register.`,
    })
  }
  if (existing?.hexColors?.length) {
    observations.push({
      label: 'Existing colors',
      body: `Existing hex inputs: ${existing.hexColors.join(', ')}. Compare against the kit palette for bridge opportunities.`,
    })
  }
  if (form.step1.businessWebsite?.trim()) {
    observations.push({
      label: 'Website',
      body: `Website URL provided (${form.step1.businessWebsite}). Review live surfaces for voice and visual consistency.`,
    })
  }

  const servingBody = `${name} already has assets worth keeping. The existing materials give you a starting point for ${paletteLabel} and ${style} — the kit direction sharpens them rather than replacing your equity.`

  const tensionRaw = form.step6.visualNotes?.trim()
    ? `Tension: Existing notes mention "${form.step6.visualNotes.trim()}".\nResolution: Evolve uploaded assets toward the locked kit palette and style while preserving recognizable equity.`
    : `Tension: Existing assets may not yet match the ${style} register everywhere.\nResolution: Apply the kit palette and typography rules to uploaded surfaces first — logo, web hero, and primary social profile.`

  const recommendations = [
    'Align logo clear space and minimum size with Style Guide practical usage.',
    'Map existing hex colors to the nearest kit swatches for web and print templates.',
    'Refresh primary social profile and website hero using Voice Playbook CTAs as anchors.',
  ]

  return {
    readerFraming: BRAND_AUDIT_READER_FRAMING,
    observations,
    serving: { body: servingBody },
    tension: parseTensionResolutionBody(tensionRaw),
    recommendations,
  }
}
