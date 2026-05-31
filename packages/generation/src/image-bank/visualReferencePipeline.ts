import {
  resolveImageBankKitSignals,
  type IdentityKitForm,
  type ImageBankKitSignals,
  type ReferenceVisionProfile,
} from '@identity-kit/shared'

import {
  getVisualReferenceLayout,
  layoutIdForPhotoCount,
  type VisualReferenceLayoutId,
} from '../deterministic/visualReferenceLayouts.js'
import type { ImageBankAsset } from './types.js'
import { rankImageBankAssets, type RankedImageBankAsset } from './tagMatcher.js'

const SHORTLIST_TARGET = 30
const SHORTLIST_MIN = 6

export type BuildShortlistOptions = {
  referenceVisionProfile?: ReferenceVisionProfile
  limit?: number
}

function broadenSignals(signals: ImageBankKitSignals, pass: number): ImageBankKitSignals {
  switch (pass) {
    case 0:
      return signals
    case 1:
      return { ...signals, photoColorCharacter: undefined, paletteFamily: undefined }
    case 2:
      return {
        ...signals,
        photoColorCharacter: undefined,
        paletteFamily: undefined,
        industrySuitability: [],
        propCategoryHints: [],
      }
    case 3:
      return {
        ...signals,
        photoColorCharacter: undefined,
        paletteFamily: undefined,
        industrySuitability: [],
        propCategoryHints: [],
        imagerySubjects: [],
      }
    case 4:
      return {
        ...signals,
        photoColorCharacter: undefined,
        paletteFamily: undefined,
        industrySuitability: [],
        propCategoryHints: [],
        imagerySubjects: [],
        moodAdjectives: [],
      }
    default:
      return {
        ...signals,
        photoColorCharacter: undefined,
        paletteFamily: undefined,
        industrySuitability: [],
        propCategoryHints: [],
        imagerySubjects: [],
        moodAdjectives: [],
        styleRegisterPrimary: signals.styleRegisterSecondary[0] ?? signals.styleRegisterPrimary,
        styleRegisterSecondary: [],
      }
  }
}

export function buildVisualReferenceShortlist(
  assets: ImageBankAsset[],
  form: IdentityKitForm,
  options: BuildShortlistOptions = {},
): RankedImageBankAsset[] {
  const limit = options.limit ?? SHORTLIST_TARGET

  for (let pass = 0; pass < 6; pass += 1) {
    const base = resolveImageBankKitSignals(form, {
      referenceVisionProfile: options.referenceVisionProfile,
    })
    const signals = broadenSignals(base, pass)
    const ranked = rankImageBankAssets(assets, signals, limit)
    if (ranked.length >= SHORTLIST_MIN) return ranked
  }

  return rankImageBankAssets(assets, resolveImageBankKitSignals(form, options), limit)
}

export function assignDeterministicRankerPicks(
  shortlist: RankedImageBankAsset[],
  layoutId: VisualReferenceLayoutId,
): Array<{ slotId: string; imageId: string; reasoning: string }> {
  const layout = getVisualReferenceLayout(layoutId)
  const used = new Set<string>()
  const picks: Array<{ slotId: string; imageId: string; reasoning: string }> = []

  for (const slot of layout.slots) {
    const candidate =
      shortlist.find(
        ({ asset }) =>
          !used.has(asset.imageId) &&
          asset.orientation === slot.orientation &&
          asset.sceneType === slot.sceneType,
      ) ??
      shortlist.find(
        ({ asset }) => !used.has(asset.imageId) && asset.orientation === slot.orientation,
      ) ??
      shortlist.find(({ asset }) => !used.has(asset.imageId))

    if (!candidate) break
    used.add(candidate.asset.imageId)
    picks.push({
      slotId: slot.slotId,
      imageId: candidate.asset.imageId,
      reasoning: 'Deterministic fallback by tag-match score.',
    })
  }

  return picks
}

/** Pick the locked layout tier from shortlist depth (6 / 8 / 9 photo slots). */
export function layoutIdFromShortlistLength(shortlistLength: number): VisualReferenceLayoutId {
  const n = Math.max(shortlistLength, 6)
  const photoCount = n >= 9 ? 9 : n >= 8 ? 8 : 6
  return layoutIdForPhotoCount(photoCount)
}
