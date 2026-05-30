import type { IdentityKitForm } from '@identity-kit/shared'

import {
  buildContentStarterScaffolds,
  type ContentStarterOneLinerAngle,
} from './contentStarterScaffolds.js'
import { resolveCtaVariationScaffoldGroups } from './ctaVariationScaffolds.js'
import { depthDocRefBlock } from './depthDocCommon.js'

export const CSP_ONE_LINER_LABELS: Record<ContentStarterOneLinerAngle, string> = {
  transformation: 'Transformation-led',
  audience: 'Audience-led',
  differentiator: 'Differentiator-led',
}

export type CspCtaVariationIntent = 'more_direct' | 'quieter' | 'more_inviting' | 'more_confident'

export const CSP_CTA_INTENT_LABELS: Record<CspCtaVariationIntent, string> = {
  more_direct: 'More direct',
  quieter: 'Quieter',
  more_inviting: 'More inviting',
  more_confident: 'More confident',
}

export type CspOneLinerOption = {
  angle: ContentStarterOneLinerAngle
  label: string
  text: string
}

export type CspHomepageRoute = {
  headline: string
  subhead: string
}

export type CspContentPillar = {
  name: string
  oneLine: string
  prompts: string[]
}

export type CspCtaSurfaceGroup = {
  surfaceLabel: string
  anchorCta: string
  variations: { intent: CspCtaVariationIntent; text: string }[]
}

export type CspCtaSection =
  | { kind: 'pending' }
  | { kind: 'surfaces'; groups: CspCtaSurfaceGroup[] }

export type ContentStarterPdfModel = {
  kitRef: { heading: string; body: string }
  summaries: {
    oneLiners: CspOneLinerOption[]
    elevator: string
    paragraph: string
  }
  homepage: { routes: CspHomepageRoute[] }
  bioShort: string
  bioLong: string
  captions: string[]
  pillars: CspContentPillar[]
  cta: CspCtaSection
}

/**
 * Structured Content Starter Pack model for PDF assembly.
 * @see docs/specs/CONTENT_STARTER_PACK.md § PDF formatting brief
 */
export function buildContentStarterPdfModel(form: IdentityKitForm): ContentStarterPdfModel {
  const scaffolds = buildContentStarterScaffolds(form)
  const kitRef = depthDocRefBlock('Voice and Examples', 'paste-ready summaries and homepage directions')

  return {
    kitRef,
    summaries: {
      oneLiners: scaffolds.oneLiner.variants.map((v) => ({
        angle: v.angle,
        label: CSP_ONE_LINER_LABELS[v.angle],
        text: v.text,
      })),
      elevator: scaffolds.elevator.text,
      paragraph: scaffolds.paragraph.text,
    },
    homepage: {
      routes: scaffolds.homepageDirections.routes.map((r) => ({
        headline: r.headline,
        subhead: r.subhead,
      })),
    },
    bioShort: scaffolds.bioShort.text,
    bioLong: scaffolds.bioLong.text,
    captions: scaffolds.captionStarters.starters.map((s) => s.text),
    pillars: scaffolds.contentPillars.pillars.map((p) => ({
      name: p.name,
      oneLine: p.oneLine,
      prompts: p.prompts,
    })),
    cta:
      resolveCtaVariationScaffoldGroups(form).length > 0
        ? { kind: 'surfaces', groups: resolveCtaVariationScaffoldGroups(form) }
        : { kind: 'pending' },
  }
}
