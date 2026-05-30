import type { IdentityKitForm } from '@identity-kit/shared'

import { buildBrandIdentityGuideModel } from './brandIdentityGuideModel.js'
import type { CspCtaSurfaceGroup } from './contentStarterPdfModel.js'

/** Folio 05 anchor CTA — last non-empty line in the composed surface block. */
export function anchorCtaFromSurfaceLines(lines: string[]): string {
  const trimmed = lines.map((l) => l.trim()).filter(Boolean)
  return trimmed[trimmed.length - 1] ?? 'Learn more'
}

/**
 * Deterministic CTA surface groups for CSP page 2 and Voice Playbook page 3.
 * Variations empty until `voice.ctaVariations` AI ships.
 */
export function resolveCtaVariationScaffoldGroups(form: IdentityKitForm): CspCtaSurfaceGroup[] {
  const model = buildBrandIdentityGuideModel(form)
  return model.examples.ctaSurfaces.map((surface) => ({
    surfaceLabel: surface.label,
    anchorCta: anchorCtaFromSurfaceLines(surface.lines),
    variations: [],
  }))
}
