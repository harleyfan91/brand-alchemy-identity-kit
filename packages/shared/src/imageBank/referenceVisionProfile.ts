import { z } from 'zod'

import { MOOD_ADJECTIVE_IDS } from '../step6MoodAdjectives.js'
import { IMAGE_BANK_IMAGERY_SUBJECTS } from './imagerySubjects.js'
import { PHOTO_COLOR_RELATIONSHIPS } from './photoColorRelationship.js'
import {
  IMAGE_BANK_PALETTE_FAMILIES,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
} from './tags.js'

/**
 * Fulfillment context from `moodboard.referenceTagExtractor` (step 0).
 * Replaces flat `referenceImageTags: string[]`.
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.6
 */
export const ReferenceVisionProfileSchema = z
  .object({
    photoColorCharacter: z.enum(IMAGE_BANK_PALETTE_FAMILIES),
    photoColorRelationship: z.enum(PHOTO_COLOR_RELATIONSHIPS),
    styleRegisters: z.array(z.enum(IMAGE_BANK_STYLE_REGISTERS)).min(1).max(3),
    imagerySubjects: z.array(z.enum(IMAGE_BANK_IMAGERY_SUBJECTS)).max(6),
    sceneTypes: z.array(z.enum(IMAGE_BANK_SCENE_TYPES)).min(1).max(4),
    moodAdjectives: z.array(z.enum(MOOD_ADJECTIVE_IDS)).max(6),
    compositionNotes: z.string().max(120),
  })
  .strict()

export type ReferenceVisionProfile = z.infer<typeof ReferenceVisionProfileSchema>

/** Flat bank-vocabulary tags for legacy scoring paths and telemetry. */
export function referenceVisionProfileToFlatTags(profile: ReferenceVisionProfile): string[] {
  const tags = new Set<string>([
    profile.photoColorCharacter,
    ...profile.styleRegisters,
    ...profile.sceneTypes,
    ...profile.moodAdjectives,
    ...profile.imagerySubjects,
  ])
  return [...tags]
}
