import type { IdentityKitForm } from '@identity-kit/shared'

import type { BrandIdentityGuideModel } from './brandIdentityGuideModel.js'

/**
 * Stable, diff-friendly summary of Brand Identity Guide *content* for manual review.
 * Written beside PDFs by `writeCorePdfs`; use `diff` against a saved copy to see
 * shortened / removed / replaced material without eyeballing the full PDF.
 */
export interface GuideReviewSnapshot {
  schemaVersion: 1
  personaId: string
  businessName: string
  intake: {
    industry: string
    stage: string
    guideFocus: string
    touchpointCount: number
  }
  signals: BrandIdentityGuideModel['signals']
  /** List lengths and caps — first place to look when content was trimmed. */
  counts: {
    guidingTraits: number
    voiceRules: number
    voiceAngles: number
    voiceCtaPatterns: number
    samplePhrases: number
    beforeAfterPairs: number
    doLines: number
    avoidLines: number
    applicationBullets: number
  }
  /** Omission / compression flags */
  flags: {
    hasStoryNote: boolean
    hasDifferentiator: boolean
    positioningDekFull: boolean
  }
  /** One row per guide spread — matches PDF order. */
  pages: Array<{
    folio: string
    navLabel: string
    title: string
    dekMode: string
    exampleDensity: string
    visualOccupancy: string
  }>
  /** Character lengths for long prose fields (spot shrink / expansion). */
  textLengths: {
    anchor: number
    transformation: number
    positioningFocusLead: number
    positioningStoryNote: number
    visualSummary: number
    imageryDirection: number
  }
}

export function buildGuideReviewSnapshot(
  personaId: string,
  form: IdentityKitForm,
  model: BrandIdentityGuideModel,
): GuideReviewSnapshot {
  return {
    schemaVersion: 1,
    personaId,
    businessName: form.step1.businessName,
    intake: {
      industry: form.step1.industry,
      stage: form.step1.stage,
      guideFocus: form.step1.guideFocus ?? '',
      touchpointCount: model.signals.touchpointCount,
    },
    signals: model.signals,
    counts: {
      guidingTraits: model.summary.guidingTraits.length,
      voiceRules: model.voice.rules.length,
      voiceAngles: model.voice.messagingAngles.length,
      voiceCtaPatterns: model.voice.ctaPatterns.length,
      samplePhrases: model.examples.samplePhrases.length,
      beforeAfterPairs: model.examples.beforeAfter.length,
      doLines: model.examples.doLines.length,
      avoidLines: model.examples.avoidLines.length,
      applicationBullets: model.visual.applicationBullets.length,
    },
    flags: {
      hasStoryNote: Boolean(model.positioning.storyNote?.trim()),
      hasDifferentiator: Boolean(model.summary.differentiator?.trim()),
      positioningDekFull: model.positioning.editorial.dekMode === 'full',
    },
    pages: [
      {
        folio: model.summary.editorial.folio,
        navLabel: model.summary.editorial.navLabel,
        title: model.summary.editorial.title,
        dekMode: model.summary.editorial.dekMode,
        exampleDensity: model.summary.editorial.exampleDensity,
        visualOccupancy: model.summary.editorial.visualOccupancy,
      },
      {
        folio: model.positioning.editorial.folio,
        navLabel: model.positioning.editorial.navLabel,
        title: model.positioning.editorial.title,
        dekMode: model.positioning.editorial.dekMode,
        exampleDensity: model.positioning.editorial.exampleDensity,
        visualOccupancy: model.positioning.editorial.visualOccupancy,
      },
      {
        folio: model.voice.editorial.folio,
        navLabel: model.voice.editorial.navLabel,
        title: model.voice.editorial.title,
        dekMode: model.voice.editorial.dekMode,
        exampleDensity: model.voice.editorial.exampleDensity,
        visualOccupancy: model.voice.editorial.visualOccupancy,
      },
      {
        folio: model.examples.editorial.folio,
        navLabel: model.examples.editorial.navLabel,
        title: model.examples.editorial.title,
        dekMode: model.examples.editorial.dekMode,
        exampleDensity: model.examples.editorial.exampleDensity,
        visualOccupancy: model.examples.editorial.visualOccupancy,
      },
      {
        folio: model.visual.editorial.folio,
        navLabel: model.visual.editorial.navLabel,
        title: model.visual.editorial.title,
        dekMode: model.visual.editorial.dekMode,
        exampleDensity: model.visual.editorial.exampleDensity,
        visualOccupancy: model.visual.editorial.visualOccupancy,
      },
    ],
    textLengths: {
      anchor: model.summary.anchor.length,
      transformation: model.summary.transformation.length,
      positioningFocusLead: model.positioning.focusLead.length,
      positioningStoryNote: (model.positioning.storyNote ?? '').length,
      visualSummary: model.visual.visualSummary.length,
      imageryDirection: model.visual.imageryDirection.length,
    },
  }
}
