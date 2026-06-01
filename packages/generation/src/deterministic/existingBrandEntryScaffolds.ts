import {
  canonicalPaletteId,
  formatPaletteGuideHeader,
  type BrandAuditWhatWeSaw,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { friendlyColorName } from './colorContrast.js'
import { resolveExistingBrandImageSrc } from '../pdf/resolveExistingBrandImageSrc.js'
import { parseTensionResolutionBody, type TensionPair } from './landscapeDeckTypes.js'

export type ExistingBrandColorSwatch = {
  hex: string
  name: string
}

export const EXISTING_BRAND_ENTRY_READER_FRAMING =
  'What you shared about your existing brand is the starting point for the direction you selected in this kit. The notes below name what we observed, what is already serving you, and how to align your assets with your locked palette, style, and tone — your kit direction stays fixed.'

export type AuditObservation = {
  label: string
  body: string
}

export type ExistingBrandAssetsPanel = {
  businessName: string
  website: string | null
  logoOnFile: boolean
  referenceOnFile: boolean
  logoImageSrc: string | null
  referenceImageSrc: string | null
  hexColors: string[]
  colorSwatches: ExistingBrandColorSwatch[]
}

export type ExistingBrandEntryModel = {
  readerFraming: string
  /** Visual intake row — logo, site, reference thumb, existing color bars. */
  assets: ExistingBrandAssetsPanel
  /** Vision / narrative notes only (not file-path scaffolding). */
  observations: AuditObservation[]
  serving: { body: string }
  tension: TensionPair | null
}

function normalizeHexColors(raw: string[] | undefined): string[] {
  if (!raw?.length) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const entry of raw) {
    const hex = entry.trim()
    if (!hex || seen.has(hex.toLowerCase())) continue
    seen.add(hex.toLowerCase())
    out.push(hex.startsWith('#') ? hex : `#${hex}`)
  }
  return out
}

function labelExistingBrandColorSwatches(hexColors: string[]): ExistingBrandColorSwatch[] {
  const used = new Map<string, number>()
  return hexColors.map((hex) => {
    let name = friendlyColorName(hex)
    const count = used.get(name) ?? 0
    if (count > 0) {
      name = `${name} ${count + 1}`
    }
    used.set(friendlyColorName(hex), count + 1)
    return { hex, name }
  })
}

function buildAssetsPanel(form: IdentityKitForm): ExistingBrandAssetsPanel {
  const existing = form.step6.existingBrand
  const hexColors = normalizeHexColors(existing?.hexColors)
  return {
    businessName: form.step1.businessName.trim(),
    website: form.step1.businessWebsite?.trim() || null,
    logoOnFile: Boolean(existing?.logoRef?.trim()),
    referenceOnFile: Boolean(existing?.referenceImageRef?.trim()),
    logoImageSrc: resolveExistingBrandImageSrc(existing?.logoRef) ?? null,
    referenceImageSrc: resolveExistingBrandImageSrc(existing?.referenceImageRef) ?? null,
    hexColors,
    colorSwatches: labelExistingBrandColorSwatches(hexColors),
  }
}

function upsertObservation(observations: AuditObservation[], label: string, body: string): void {
  const trimmed = body.trim()
  if (!trimmed) return
  const index = observations.findIndex((o) => o.label === label)
  const entry = { label, body: trimmed }
  if (index >= 0) {
    observations[index] = entry
  } else {
    observations.push(entry)
  }
}

function applyWhatWeSawOverlay(
  observations: AuditObservation[],
  whatWeSaw: BrandAuditWhatWeSaw,
): void {
  if (whatWeSaw.logoObservation?.trim()) {
    upsertObservation(observations, 'Logo', whatWeSaw.logoObservation)
  }
  if (whatWeSaw.referenceImageObservation?.trim()) {
    upsertObservation(observations, 'Reference image', whatWeSaw.referenceImageObservation)
  }
  if (whatWeSaw.voiceSamplesObservation?.trim()) {
    upsertObservation(observations, 'Voice samples', whatWeSaw.voiceSamplesObservation)
  }
  if (whatWeSaw.websiteObservation?.trim()) {
    upsertObservation(observations, 'Website', whatWeSaw.websiteObservation)
  }
}

/**
 * Deterministic + optional vision overlay for Brand Brief starting-assets sections.
 */
export function buildExistingBrandEntryModel(
  form: IdentityKitForm,
  whatWeSaw?: BrandAuditWhatWeSaw | null,
): ExistingBrandEntryModel {
  const name = form.step1.businessName.trim()
  const existing = form.step6.existingBrand
  const paletteLabel = formatPaletteGuideHeader(canonicalPaletteId(form.step6.selectedPalette))
  const style = form.step6.selectedStyle.replace(/_/g, ' ')
  const observations: AuditObservation[] = []

  if (whatWeSaw) {
    applyWhatWeSawOverlay(observations, whatWeSaw)
  }

  const servingBody = `${name} already has assets worth keeping. The existing materials give you a starting point for ${paletteLabel} and ${style} — the kit direction sharpens them rather than replacing your equity.`

  const tensionRaw = form.step6.visualNotes?.trim()
    ? `Tension: Existing notes mention "${form.step6.visualNotes.trim()}".\nResolution: Evolve uploaded assets toward the locked kit palette and style while preserving recognizable equity.`
    : `Tension: Existing assets may not yet match the ${style} register everywhere.\nResolution: Apply the kit palette and typography rules to uploaded surfaces first — logo, web hero, and primary social profile.`

  return {
    readerFraming: EXISTING_BRAND_ENTRY_READER_FRAMING,
    assets: buildAssetsPanel(form),
    observations,
    serving: { body: servingBody },
    tension: parseTensionResolutionBody(tensionRaw),
  }
}
