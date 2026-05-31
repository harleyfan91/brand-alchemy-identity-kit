import type { ImageBankAsset } from './types.js'
import type { ImageBankKitSignals } from '@identity-kit/shared'

export type TagMatchScoreBreakdown = {
  photoColorCharacter: number
  prominentHueHarmony: number
  styleRegister: number
  moodAdjectives: number
  imagerySubjects: number
  propCategory: number
  industrySuitability: number
  narratorAlignment: number
  referenceSceneTypes: number
  total: number
}

export type RankedImageBankAsset = {
  asset: ImageBankAsset
  score: TagMatchScoreBreakdown
}

/** Model B baseline — @see OUTPUT_TRANSLATION_SPEC.md §5.8.2 */
const WEIGHTS = {
  photoColorCharacter: 5,
  prominentHueBoost: 5,
  prominentHuePenalty: 5,
  styleRegister: 32,
  moodAdjectives: 28,
  imagerySubjects: 20,
  propCategory: 8,
  industrySuitability: 8,
  narratorAlignment: 7,
  referenceSceneTypes: 10,
} as const

function overlapRatio(assetValues: string[] | undefined, kitValues: string[]): number {
  if (kitValues.length === 0) return 0
  if (!assetValues?.length) return 0
  const kitSet = new Set(kitValues)
  const hits = assetValues.filter((value) => kitSet.has(value)).length
  return hits / kitValues.length
}

function prominentHueHarmonyScore(
  assetHues: string[] | undefined,
  preferred: string[],
  avoid: string[],
): number {
  if (!assetHues?.length) return 0

  const assetSet = new Set(assetHues)
  if (avoid.some((hue) => assetSet.has(hue))) {
    return -WEIGHTS.prominentHuePenalty
  }

  if (preferred.length === 0) return 0
  const preferredHits = preferred.filter((hue) => assetSet.has(hue)).length
  if (preferredHits === 0) return 0

  return Math.round(WEIGHTS.prominentHueBoost * (preferredHits / preferred.length))
}

/**
 * Deterministic tag-match scorer — Pro-G shortlist (target 20–30 candidates).
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.1 step 1, §5.8.2
 */
export function scoreImageBankAsset(asset: ImageBankAsset, signals: ImageBankKitSignals): TagMatchScoreBreakdown {
  const photoColorCharacter =
    signals.photoColorCharacter && asset.paletteFamily === signals.photoColorCharacter
      ? WEIGHTS.photoColorCharacter
      : 0

  const prominentHueHarmony = prominentHueHarmonyScore(
    asset.prominentHueFamilies,
    signals.preferredHueFamilies,
    signals.avoidHueFamilies,
  )

  const styleCandidates = [
    signals.styleRegisterPrimary,
    ...signals.styleRegisterSecondary,
  ].filter(Boolean) as string[]
  const styleRegister =
    styleCandidates.length > 0 && styleCandidates.includes(asset.styleRegister)
      ? asset.styleRegister === signals.styleRegisterPrimary
        ? WEIGHTS.styleRegister
        : Math.round(WEIGHTS.styleRegister * 0.6)
      : 0

  const moodAdjectives = Math.round(
    WEIGHTS.moodAdjectives * overlapRatio(asset.moodAdjectives, signals.moodAdjectives),
  )

  const imagerySubjects = Math.round(
    WEIGHTS.imagerySubjects * overlapRatio(asset.imagerySubjects, signals.imagerySubjects),
  )

  const propCategory =
    signals.propCategoryHints.length === 0 ||
    !asset.propCategory ||
    asset.propCategory === 'neutral-generic'
      ? 0
      : signals.propCategoryHints.includes(asset.propCategory)
        ? WEIGHTS.propCategory
        : 0

  const industrySuitability =
    signals.industrySuitability.length === 0 || !asset.industrySuitability?.length
      ? 0
      : signals.industrySuitability.some((tag) => asset.industrySuitability!.includes(tag))
        ? WEIGHTS.industrySuitability
        : 0

  const narratorAlignment =
    signals.narratorAlignment && asset.narratorAlignment?.includes(signals.narratorAlignment)
      ? WEIGHTS.narratorAlignment
      : 0

  const referenceSceneTypes =
    signals.referenceVisionProfile?.sceneTypes.includes(asset.sceneType) === true
      ? WEIGHTS.referenceSceneTypes
      : 0

  const total =
    photoColorCharacter +
    prominentHueHarmony +
    styleRegister +
    moodAdjectives +
    imagerySubjects +
    propCategory +
    industrySuitability +
    narratorAlignment +
    referenceSceneTypes

  return {
    photoColorCharacter,
    prominentHueHarmony,
    styleRegister,
    moodAdjectives,
    imagerySubjects,
    propCategory,
    industrySuitability,
    narratorAlignment,
    referenceSceneTypes,
    total,
  }
}

export function rankImageBankAssets(
  assets: ImageBankAsset[],
  signals: ImageBankKitSignals,
  limit = 30,
): RankedImageBankAsset[] {
  return assets
    .map((asset) => ({ asset, score: scoreImageBankAsset(asset, signals) }))
    .sort((a, b) => b.score.total - a.score.total || a.asset.imageId.localeCompare(b.asset.imageId))
    .slice(0, limit)
}
