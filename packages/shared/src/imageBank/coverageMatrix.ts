import {
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
  type ImageBankSceneType,
  type ImageBankStyleRegister,
} from './tags.js'

/** v1 launch minimum per (style register × scene type). */
export const IMAGE_BANK_MIN_PER_CELL = 5

/** v1 launch target total — see PRO_KIT_STRATEGY §7.3.4. */
export const IMAGE_BANK_V1_TARGET_TOTAL = 300

/** Minimum floor from style×scene grid (36 × 5). */
export const IMAGE_BANK_STYLE_SCENE_FLOOR = IMAGE_BANK_STYLE_REGISTERS.length * IMAGE_BANK_SCENE_TYPES.length * IMAGE_BANK_MIN_PER_CELL

/**
 * Recommended scene-type mix for the full bank (percentages → rounded counts at 300).
 * Used by coverage reports, not hard enforcement at ingest.
 */
export const IMAGE_BANK_SCENE_TYPE_WEIGHTS: Record<ImageBankSceneType, number> = {
  texture: 0.3,
  object: 0.2,
  environment: 0.2,
  lighting: 0.1,
  pattern: 0.1,
  people: 0.1,
}

export type ImageBankStyleCoverageCell = {
  styleRegister: ImageBankStyleRegister
  sceneType: ImageBankSceneType
  minimum: number
}

/** Primary 36-cell coverage matrix (6 style registers × 6 scene types). @see MOODBOARD_SIGNAL_MODEL §9.1 D2 */
export function imageBankCoverageCells(minimum = IMAGE_BANK_MIN_PER_CELL): ImageBankStyleCoverageCell[] {
  const cells: ImageBankStyleCoverageCell[] = []
  for (const styleRegister of IMAGE_BANK_STYLE_REGISTERS) {
    for (const sceneType of IMAGE_BANK_SCENE_TYPES) {
      cells.push({ styleRegister, sceneType, minimum })
    }
  }
  return cells
}

export function targetCountForSceneType(sceneType: ImageBankSceneType, total = IMAGE_BANK_V1_TARGET_TOTAL): number {
  return Math.round(total * IMAGE_BANK_SCENE_TYPE_WEIGHTS[sceneType])
}

export type ImageBankStyleCoverageCounts = Record<ImageBankStyleRegister, Record<ImageBankSceneType, number>>

export function emptyStyleCoverageCounts(): ImageBankStyleCoverageCounts {
  return Object.fromEntries(
    IMAGE_BANK_STYLE_REGISTERS.map((register) => [
      register,
      Object.fromEntries(IMAGE_BANK_SCENE_TYPES.map((scene) => [scene, 0])) as Record<ImageBankSceneType, number>,
    ]),
  ) as ImageBankStyleCoverageCounts
}

export function incrementStyleCoverageCounts(
  counts: ImageBankStyleCoverageCounts,
  styleRegister: ImageBankStyleRegister,
  sceneType: ImageBankSceneType,
): void {
  counts[styleRegister][sceneType] += 1
}
