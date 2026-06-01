import type { KitContentBlock } from './depthDocCommon.js'
import type { AuditObservation, ExistingBrandEntryModel } from './existingBrandEntryScaffolds.js'

/** Single Brief module heading — rendered by `StartingAssetsBriefBlock` in CoreKitDocuments. */
export const STARTING_ASSETS_BRIEF_HEADING = 'Your starting assets'

/** Legacy list for overlap tests (only the module heading is a depth block). */
export const BRIEF_STARTING_ASSETS_HEADINGS = [STARTING_ASSETS_BRIEF_HEADING] as const

export function existingBrandEntryToBriefBlocks(_model: ExistingBrandEntryModel): KitContentBlock[] {
  return [{ heading: STARTING_ASSETS_BRIEF_HEADING, body: '' }]
}

export function formatStartingAssetsObservations(observations: AuditObservation[]): Array<{ label: string; body: string }> {
  return observations.map((obs) => ({ label: obs.label, body: obs.body }))
}

export function formatStartingAssetsTension(model: ExistingBrandEntryModel): {
  tension: string
  resolution: string
} | null {
  if (!model.tension) return null
  return { tension: model.tension.tension, resolution: model.tension.resolution }
}
