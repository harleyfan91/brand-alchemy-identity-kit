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
  type VisualReferenceSlotBlueprint,
} from '../deterministic/visualReferenceLayouts.js'
import type { ImageBankAsset } from './types.js'
import { effectivePickScore, isPatternFullSceneMisfile } from './spreadCoherence.js'
import { rankImageBankAssets, scoreImageBankAsset, type RankedImageBankAsset } from './tagMatcher.js'

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
      return {
        ...signals,
        photoColorCharacter: undefined,
        paletteFamily: undefined,
        preferredHueFamilies: [],
      }
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

export type AssignDeterministicRankerPicksOptions = {
  signals?: ImageBankKitSignals
  /** Full bank — slot filler searches beyond shortlist top-N for orientation+sceneType matches. */
  bankAssets?: ImageBankAsset[]
}

function mergeRankedCandidates(items: RankedImageBankAsset[]): RankedImageBankAsset[] {
  const byId = new Map<string, RankedImageBankAsset>()
  for (const item of items) byId.set(item.asset.imageId, item)
  return [...byId.values()]
}

function preferMaterialPatternCandidates(
  slot: VisualReferenceSlotBlueprint,
  candidates: RankedImageBankAsset[],
): RankedImageBankAsset[] {
  if (slot.sceneType !== 'pattern' || candidates.length <= 1) return candidates
  const materialForward = candidates.filter(({ asset }) => !isPatternFullSceneMisfile(asset))
  return materialForward.length > 0 ? materialForward : candidates
}

function slotCandidates(
  shortlist: RankedImageBankAsset[],
  slot: VisualReferenceSlotBlueprint,
  used: Set<string>,
  options?: AssignDeterministicRankerPicksOptions,
): RankedImageBankAsset[] {
  const available = shortlist.filter(({ asset }) => !used.has(asset.imageId))

  const exactShortlist = available.filter(
    ({ asset }) => asset.orientation === slot.orientation && asset.sceneType === slot.sceneType,
  )

  if (options?.bankAssets && options.signals) {
    const bankExact = options.bankAssets
      .filter(
        (asset) =>
          !used.has(asset.imageId) &&
          asset.orientation === slot.orientation &&
          asset.sceneType === slot.sceneType,
      )
      .map((asset) => ({
        asset,
        score: scoreImageBankAsset(asset, options.signals!),
      }))
    const merged = preferMaterialPatternCandidates(slot, mergeRankedCandidates([...exactShortlist, ...bankExact]))
    if (merged.length > 0) return merged

    const bankOrient = options.bankAssets
      .filter((asset) => !used.has(asset.imageId) && asset.orientation === slot.orientation)
      .map((asset) => ({
        asset,
        score: scoreImageBankAsset(asset, options.signals!),
      }))
    const orientMerged = preferMaterialPatternCandidates(
      slot,
      mergeRankedCandidates([
        ...available.filter(({ asset }) => asset.orientation === slot.orientation),
        ...bankOrient,
      ]),
    )
    if (orientMerged.length > 0) return orientMerged
  }

  const exact = preferMaterialPatternCandidates(
    slot,
    available.filter(
      ({ asset }) => asset.orientation === slot.orientation && asset.sceneType === slot.sceneType,
    ),
  )
  if (exact.length > 0) return exact

  const orientOnly = available.filter(({ asset }) => asset.orientation === slot.orientation)
  if (orientOnly.length > 0) return orientOnly

  return available
}

function pickBestForSlot(
  candidates: RankedImageBankAsset[],
  pickedAssets: ImageBankAsset[],
  signals: ImageBankKitSignals,
  slot: VisualReferenceSlotBlueprint,
): RankedImageBankAsset | undefined {
  if (candidates.length === 0) return undefined

  return [...candidates]
    .map((ranked) => ({
      ranked,
      effectiveScore: effectivePickScore(ranked.score.total, ranked.asset, pickedAssets, signals, slot),
    }))
    .sort(
      (a, b) =>
        b.effectiveScore - a.effectiveScore ||
        b.ranked.score.total - a.ranked.score.total ||
        a.ranked.asset.imageId.localeCompare(b.ranked.asset.imageId),
    )[0]?.ranked
}

export function assignDeterministicRankerPicks(
  shortlist: RankedImageBankAsset[],
  layoutId: VisualReferenceLayoutId,
  options: AssignDeterministicRankerPicksOptions = {},
): Array<{ slotId: string; imageId: string; reasoning: string }> {
  const layout = getVisualReferenceLayout(layoutId)
  const used = new Set<string>()
  const pickedAssets: ImageBankAsset[] = []
  const picks: Array<{ slotId: string; imageId: string; reasoning: string }> = []

  for (const slot of layout.slots) {
    const candidates = slotCandidates(shortlist, slot, used, options)
    const candidate = options.signals
      ? pickBestForSlot(candidates, pickedAssets, options.signals, slot)
      : candidates[0]

    if (!candidate) break
    used.add(candidate.asset.imageId)
    pickedAssets.push(candidate.asset)
    picks.push({
      slotId: slot.slotId,
      imageId: candidate.asset.imageId,
      reasoning: options.signals
        ? 'Deterministic pick by tag-match score + spread coherence.'
        : 'Deterministic fallback by tag-match score.',
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
