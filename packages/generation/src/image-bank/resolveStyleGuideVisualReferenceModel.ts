import { basename, join } from 'node:path'

import type { IdentityKitForm, ReferenceVisionProfile } from '@identity-kit/shared'

import { composeDeterministicVisualReferenceCaption } from '../deterministic/visualReferenceCaptions.js'
import {
  buildStyleGuideVisualReferenceModel,
  mergeVisualReferenceRankerSelections,
  type StyleGuideVisualReferenceModel,
} from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { getVisualReferenceLayout } from '../deterministic/visualReferenceLayouts.js'
import { IMAGE_BANK_ASSETS_DIR } from './constants.js'
import { readImageBankMetadata } from './ingest.js'
import type { ImageBankAsset } from './types.js'
import {
  assignDeterministicRankerPicks,
  buildVisualReferenceShortlist,
  layoutIdFromShortlistLength,
} from './visualReferencePipeline.js'

/** Minimum bank photo picks required to ship the Pro Visual Reference Spread. */
export const VISUAL_REFERENCE_MIN_PHOTO_PICKS = 6

export type ResolveStyleGuideVisualReferenceOptions = {
  referenceVisionProfile?: ReferenceVisionProfile
  /** Test injection — skips reading committed metadata from disk. */
  assets?: ImageBankAsset[]
}

function assetAbsolutePath(asset: ImageBankAsset): string {
  return join(IMAGE_BANK_ASSETS_DIR, basename(asset.src))
}

function picksToSelections(
  picks: Array<{ slotId: string; imageId: string }>,
  assetById: Map<string, ImageBankAsset>,
): Array<{ slotId: string; imageId: string; imageSrc: string }> {
  return picks.flatMap((pick) => {
    const asset = assetById.get(pick.imageId)
    if (!asset) return []
    return [{ slotId: pick.slotId, imageId: pick.imageId, imageSrc: assetAbsolutePath(asset) }]
  })
}

/**
 * Deterministic Pro Visual Reference fulfillment (tag matcher → ranker fallback → caption).
 * No AI calls. Returns null when the spread should be omitted (OUTPUT_TRANSLATION_SPEC §5.8.9).
 */
export async function resolveStyleGuideVisualReferenceModel(
  form: IdentityKitForm,
  options: ResolveStyleGuideVisualReferenceOptions = {},
): Promise<StyleGuideVisualReferenceModel | null> {
  if (form.tier !== 'pro') return null
  if (!form.step6.selectedStyle?.trim()) return null

  const assets = options.assets ?? (await readImageBankMetadata()).assets
  if (assets.length === 0) return null

  const shortlist = buildVisualReferenceShortlist(assets, form, {
    referenceVisionProfile: options.referenceVisionProfile,
  })
  if (shortlist.length < VISUAL_REFERENCE_MIN_PHOTO_PICKS) return null

  const layoutId = layoutIdFromShortlistLength(shortlist.length)
  const layout = getVisualReferenceLayout(layoutId)
  const picks = assignDeterministicRankerPicks(shortlist, layoutId)
  const photoPicks = picks.filter((pick) => pick.slotId !== 'logo')

  if (photoPicks.length < VISUAL_REFERENCE_MIN_PHOTO_PICKS) return null
  if (photoPicks.length !== layout.photoCount) return null

  const assetById = new Map(assets.map((asset) => [asset.imageId, asset]))
  const selections = picksToSelections(picks, assetById)

  const scaffold = buildStyleGuideVisualReferenceModel(form, { photoCount: layout.photoCount })
  const merged = mergeVisualReferenceRankerSelections(scaffold, selections)

  return {
    ...merged,
    selectionCaption: composeDeterministicVisualReferenceCaption(form),
  }
}
