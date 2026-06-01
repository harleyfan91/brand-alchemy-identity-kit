import type { ImageBankKitSignals } from '@identity-kit/shared'

import type { VisualReferenceSlotBlueprint } from '../deterministic/visualReferenceLayouts.js'
import type { ImageBankAsset } from './types.js'

/** Bonuses / penalties applied on top of tag-match score when filling layout slots. */
export const SPREAD_COHERENCE_WEIGHTS = {
  moodOverlap: 4,
  paletteMatch: 6,
  styleRegisterMatch: 5,
  /** Kit secondary register (e.g. warm for luxe_refined) — slot assignment only. */
  secondaryRegisterMatch: 8,
  industryMatch: 10,
  industryClash: -14,
  /** Warm/organic spread + warm kit — deprioritize sleek futuristic-min candidates. */
  futuristicWarmClash: -18,
  /** Full-room interior mis-tagged as pattern — material slots need surface crops. */
  patternFullScenePenalty: -30,
  /** Material-forward pattern (tile/texture crop) in a pattern layout slot. */
  patternMaterialBonus: 14,
} as const

const WARM_ORGANIC_MOODS = new Set(['warm', 'organic', 'premium', 'soft', 'calm'])

/**
 * Pattern slot expects material-forward crops. Full rooms tagged `pattern` +
 * `interiors-spaces` read as kitchens/bathrooms in 4:3 cover crops.
 */
export function isPatternFullSceneMisfile(asset: ImageBankAsset): boolean {
  return (asset.imagerySubjects ?? []).includes('interiors-spaces')
}

/**
 * Sleek geometric minimal — not brutalist. Brutalist reads austere/raw + geometric;
 * this asset class is sharp/futuristic + geometric without material heaviness.
 */
export function isFuturisticMinimalAsset(asset: ImageBankAsset): boolean {
  const moods = new Set(asset.moodAdjectives ?? [])
  if (moods.has('futuristic')) return true
  return (
    moods.has('sharp') &&
    moods.has('geometric') &&
    !moods.has('austere') &&
    !moods.has('raw')
  )
}

/** Kits that legitimately want brutalist / severe architecture in the spread. */
export function isBrutalistFriendlyKit(signals: ImageBankKitSignals): boolean {
  if (signals.styleRegisterPrimary === 'austere' || signals.styleRegisterPrimary === 'sharp') {
    return true
  }
  const moods = new Set(signals.moodAdjectives)
  if (moods.has('austere') || moods.has('raw')) return true
  if (moods.has('geometric') && (moods.has('sharp') || moods.has('austere'))) return true
  return false
}

export function spreadHasWarmOrganicTone(picked: ImageBankAsset[]): boolean {
  return picked.some((asset) => asset.moodAdjectives?.some((mood) => WARM_ORGANIC_MOODS.has(mood)))
}

/**
 * Spread-level harmony bonus for slot assignment (deterministic ranker fallback).
 * Tag-match score remains primary; this breaks ties and softens sector/register clashes.
 */
export function spreadCoherenceBonus(
  candidate: ImageBankAsset,
  picked: ImageBankAsset[],
  signals: ImageBankKitSignals,
): number {
  let bonus = 0

  if (signals.styleRegisterSecondary.includes(candidate.styleRegister)) {
    bonus += SPREAD_COHERENCE_WEIGHTS.secondaryRegisterMatch
  }

  if (signals.industrySuitability.length && candidate.industrySuitability?.length) {
    const kitSet = new Set(signals.industrySuitability)
    bonus += candidate.industrySuitability.some((tag) => kitSet.has(tag))
      ? SPREAD_COHERENCE_WEIGHTS.industryMatch
      : SPREAD_COHERENCE_WEIGHTS.industryClash
  }

  if (picked.length > 0) {
    const pickedMoods = new Set(picked.flatMap((asset) => asset.moodAdjectives ?? []))
    const moodHits = (candidate.moodAdjectives ?? []).filter((mood) => pickedMoods.has(mood)).length
    bonus += moodHits * SPREAD_COHERENCE_WEIGHTS.moodOverlap

    const pickedPalettes = new Set(picked.map((asset) => asset.paletteFamily).filter(Boolean))
    if (candidate.paletteFamily && pickedPalettes.has(candidate.paletteFamily)) {
      bonus += SPREAD_COHERENCE_WEIGHTS.paletteMatch
    }

    const registerCounts = new Map<string, number>()
    for (const asset of picked) {
      registerCounts.set(asset.styleRegister, (registerCounts.get(asset.styleRegister) ?? 0) + 1)
    }
    const dominantRegister = [...registerCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    if (dominantRegister && candidate.styleRegister === dominantRegister) {
      bonus += SPREAD_COHERENCE_WEIGHTS.styleRegisterMatch
    }
  }

  if (
    !isBrutalistFriendlyKit(signals) &&
    spreadHasWarmOrganicTone(picked) &&
    signals.moodAdjectives.some((mood) => WARM_ORGANIC_MOODS.has(mood)) &&
    isFuturisticMinimalAsset(candidate)
  ) {
    bonus += SPREAD_COHERENCE_WEIGHTS.futuristicWarmClash
  }

  return bonus
}

/** Slot-aware adjustment layered on spreadCoherenceBonus. */
export function slotAssignmentAdjustment(
  candidate: ImageBankAsset,
  picked: ImageBankAsset[],
  signals: ImageBankKitSignals,
  slot: VisualReferenceSlotBlueprint,
): number {
  let bonus = spreadCoherenceBonus(candidate, picked, signals)

  if (slot.sceneType === 'pattern' && isPatternFullSceneMisfile(candidate)) {
    bonus += SPREAD_COHERENCE_WEIGHTS.patternFullScenePenalty
  }

  if (
    slot.sceneType === 'pattern' &&
    !isPatternFullSceneMisfile(candidate) &&
    (candidate.imagerySubjects ?? []).includes('materials-texture')
  ) {
    bonus += SPREAD_COHERENCE_WEIGHTS.patternMaterialBonus
  }

  return bonus
}

export function effectivePickScore(
  tagScore: number,
  candidate: ImageBankAsset,
  picked: ImageBankAsset[],
  signals: ImageBankKitSignals,
  slot: VisualReferenceSlotBlueprint,
): number {
  return tagScore + slotAssignmentAdjustment(candidate, picked, signals, slot)
}
