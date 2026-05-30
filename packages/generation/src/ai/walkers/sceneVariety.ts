import type { ImageBankSceneType } from '@identity-kit/shared'
import type { MoodboardRankerOutput } from '@identity-kit/shared'

const MAX_PER_SCENE_TYPE = 3

export function validateMoodboardSceneVariety(picks: MoodboardRankerOutput['picks']): boolean {
  const counts = new Map<ImageBankSceneType, number>()
  for (const pick of picks) {
    // Scene type is validated at assignment time against bank metadata in the pipeline.
    // This walker receives picks only — pipeline attaches sceneType before validation.
    const sceneType = (pick as { sceneType?: ImageBankSceneType }).sceneType
    if (!sceneType) continue
    counts.set(sceneType, (counts.get(sceneType) ?? 0) + 1)
    if ((counts.get(sceneType) ?? 0) > MAX_PER_SCENE_TYPE) return false
  }
  return true
}

export function sceneTypeCountsFromPicks(
  picks: Array<{ sceneType: ImageBankSceneType }>,
): Map<ImageBankSceneType, number> {
  const counts = new Map<ImageBankSceneType, number>()
  for (const pick of picks) {
    counts.set(pick.sceneType, (counts.get(pick.sceneType) ?? 0) + 1)
  }
  return counts
}

export function assertMoodboardSceneVariety(
  picks: Array<{ sceneType: ImageBankSceneType }>,
): void {
  for (const [, count] of sceneTypeCountsFromPicks(picks)) {
    if (count > MAX_PER_SCENE_TYPE) {
      throw new Error(`Scene variety violated: ${count} picks share one scene type (max ${MAX_PER_SCENE_TYPE})`)
    }
  }
}
