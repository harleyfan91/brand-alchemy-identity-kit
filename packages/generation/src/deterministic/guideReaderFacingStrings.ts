import type { BrandIdentityGuideModel } from './brandIdentityGuideModel.js'

/** Flatten reader-visible strings from a guide model (for redundancy tests). */
export function collectGuideReaderFacingStrings(model: BrandIdentityGuideModel): string[] {
  const extras: string[] = []
  const collectStrings = (value: unknown) => {
    if (typeof value === 'string') {
      extras.push(value)
      return
    }
    if (Array.isArray(value)) {
      for (const v of value) collectStrings(v)
      return
    }
    if (value && typeof value === 'object') {
      for (const v of Object.values(value)) collectStrings(v)
    }
  }

  const readerFacing = [
    model.summary.editorial.navLabel,
    model.summary.editorial.title,
    model.summary.editorial.deck,
    model.summary.editorial.figureLabel,
    model.summary.focusLead,
    model.summary.differentiator,
    model.summary.transformation,
    model.summary.whoItsFor,
    model.summary.whatWeDo,
    model.summary.oneLine,
    ...model.summary.guidingTraits,
    model.positioning.editorial.navLabel,
    model.positioning.editorial.title,
    model.positioning.editorial.deck,
    model.positioning.editorial.figureLabel,
    model.positioning.focusLead,
    model.positioning.feelLine,
    ...model.positioning.feelAdjectives,
    model.positioning.standsForLine,
    model.positioning.editorialTriplet?.vision,
    model.positioning.editorialTriplet?.mission,
    model.positioning.editorialTriplet?.promise,
    model.positioning.storyNote,
    model.positioning.oneLine,
    model.positioning.behavior.showsUpAs,
    model.positioning.behavior.avoids,
    model.positioning.behavior.earnsTrustBy,
    model.positioning.trustCue.label,
    model.positioning.trustCue.body,
    model.voice.editorial.navLabel,
    model.voice.editorial.title,
    model.voice.editorial.deck,
    model.voice.editorial.figureLabel,
    ...model.voice.traits,
    ...model.voice.rules,
    ...model.voice.messagingAngles,
    model.voice.bottomBand.title,
    model.voice.bottomBand.body,
    model.examples.editorial.navLabel,
    model.examples.editorial.title,
    model.examples.editorial.figureLabel,
    ...model.examples.samplePhrases,
    ...model.examples.doLines,
    ...model.examples.avoidLines,
    ...model.examples.ctaTemplates,
    ...model.examples.ctaSurfaces.flatMap((surface) => [
      surface.label,
      ...surface.lines,
      ...(surface.presentation
        ? (Object.values(surface.presentation).filter(
            (v): v is string => typeof v === 'string' && v.length > 0,
          ) as string[])
        : []),
    ]),
    model.visual.editorial.navLabel,
    model.visual.editorial.title,
    model.visual.editorial.deck,
    model.visual.editorial.figureLabel,
    model.visual.visualCaption,
    ...model.visual.visualKeywords,
    model.visual.imageryDirection,
    model.visual.summary.systemCharacter,
    model.visual.summary.usageDiscipline,
    ...model.visual.swatches.map((swatch) => swatch.hex),
    ...model.visual.swatches.map((swatch) => swatch.name),
    model.visual.typography.editorial.navLabel,
    model.visual.typography.editorial.title,
    model.visual.typography.editorial.deck,
    model.visual.typography.wordmarkBandRail.fontIntro,
    model.visual.typography.wordmarkBandRail.wordmarkIntro,
    model.visual.typography.wordmarkBandRail.licensing,
    ...model.visual.typography.applications.flatMap((app) => [app.face, app.use]),
    ...model.visual.typography.typefaceSpecimens.flatMap((specimen) => [
      specimen.faceLabel,
      specimen.roleEyebrow,
    ]),
  ].filter((s): s is string => typeof s === 'string' && s.length > 0)

  collectStrings(model.examples.beforeAfter)
  return [...readerFacing, ...extras]
}
