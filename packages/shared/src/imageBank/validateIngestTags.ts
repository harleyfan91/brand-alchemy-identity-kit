import { z } from 'zod'

import { MOOD_ADJECTIVE_IDS } from '../step6MoodAdjectives.js'
import {
  IMAGE_BANK_INDUSTRY_SUITABILITY,
  IMAGE_BANK_LICENSES,
  IMAGE_BANK_NARRATOR_ALIGNMENT,
  IMAGE_BANK_PALETTE_FAMILIES,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
} from './tags.js'
import { IMAGE_BANK_IMAGERY_SUBJECTS } from './imagerySubjects.js'
import { IMAGE_BANK_PROP_CATEGORIES } from './propCategories.js'

export const ImageBankIngestTagsSchema = z
  .object({
    sourceUrl: z.string().url(),
    sourcePageUrl: z.string().url().optional(),
    license: z.enum(IMAGE_BANK_LICENSES),
    paletteFamily: z.enum(IMAGE_BANK_PALETTE_FAMILIES),
    styleRegister: z.enum(IMAGE_BANK_STYLE_REGISTERS),
    sceneType: z.enum(IMAGE_BANK_SCENE_TYPES),
    moodAdjectives: z.array(z.enum(MOOD_ADJECTIVE_IDS)).optional(),
    imagerySubjects: z.array(z.enum(IMAGE_BANK_IMAGERY_SUBJECTS)).optional(),
    propCategory: z.enum(IMAGE_BANK_PROP_CATEGORIES).optional(),
    industrySuitability: z.array(z.enum(IMAGE_BANK_INDUSTRY_SUITABILITY)).optional(),
    narratorAlignment: z.array(z.enum(IMAGE_BANK_NARRATOR_ALIGNMENT)).optional(),
    imageId: z.string().min(1).optional(),
  })
  .strict()

export type ImageBankIngestTags = z.infer<typeof ImageBankIngestTagsSchema>

export type ImageBankTagValidationIssue = {
  field: string
  message: string
}

/** Structural validation — enum membership and Zod parse. */
export function validateImageBankIngestTags(input: unknown): {
  success: boolean
  data?: ImageBankIngestTags
  issues: ImageBankTagValidationIssue[]
} {
  const parsed = ImageBankIngestTagsSchema.safeParse(input)
  if (parsed.success) {
    return { success: true, data: parsed.data, issues: [] }
  }
  return {
    success: false,
    issues: parsed.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'root',
      message: issue.message,
    })),
  }
}

/**
 * Heuristic warnings — non-blocking guidance for curators before ingest.
 * Does not inspect pixels; tag rubric lives in MOODBOARD_BANK_TAG_TAXONOMY.md.
 */
export function warnImageBankIngestTags(tags: ImageBankIngestTags): string[] {
  const warnings: string[] = []

  if (tags.sceneType === 'people' && !tags.narratorAlignment?.length) {
    warnings.push('people scene: consider narratorAlignment when the shot is strongly narrator-specific')
  }

  if (tags.moodAdjectives && tags.moodAdjectives.length > 4) {
    warnings.push('moodAdjectives: prefer 2–4 chips; more dilutes tag-match scoring')
  }

  if (tags.imagerySubjects && tags.imagerySubjects.length > 3) {
    warnings.push('imagerySubjects: prefer 1–3 tags per image')
  }

  if (tags.industrySuitability && tags.industrySuitability.length > 2) {
    warnings.push('industrySuitability: prefer 0–2; leave industry-agnostic when possible')
  }

  if (
    tags.propCategory &&
    tags.propCategory !== 'neutral-generic' &&
    tags.industrySuitability?.length &&
    tags.sceneType !== 'texture' &&
    tags.sceneType !== 'pattern'
  ) {
    warnings.push(
      'propCategory: confirm industrySuitability aligns with the visible prop (e.g. camera → b2b_tech/creative_agency, not makers_artisans)',
    )
  }

  if (
    (tags.sceneType === 'object' || tags.sceneType === 'people') &&
    !tags.propCategory &&
    tags.imagerySubjects?.includes('product-still-life')
  ) {
    warnings.push('object/people scene with product still life: consider propCategory when the prop is sector-specific')
  }

  return warnings
}
