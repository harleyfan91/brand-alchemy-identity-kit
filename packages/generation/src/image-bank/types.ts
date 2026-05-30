import { z } from 'zod'

import {
  IMAGE_BANK_INDUSTRY_SUITABILITY,
  IMAGE_BANK_LICENSES,
  IMAGE_BANK_NARRATOR_ALIGNMENT,
  IMAGE_BANK_ORIENTATIONS,
  IMAGE_BANK_PALETTE_FAMILIES,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
  IMAGE_BANK_IMAGERY_SUBJECTS,
  ImageBankIngestTagsSchema,
  MOOD_ADJECTIVE_IDS,
  type ImageBankIndustrySuitability,
  type ImageBankLicense,
  type ImageBankNarratorAlignment,
  type ImageBankOrientation,
  type ImageBankPaletteFamily,
  type ImageBankSceneType,
  type ImageBankStyleRegister,
} from '@identity-kit/shared'

export {
  IMAGE_BANK_INDUSTRY_SUITABILITY,
  IMAGE_BANK_LICENSES,
  IMAGE_BANK_NARRATOR_ALIGNMENT,
  IMAGE_BANK_ORIENTATIONS,
  IMAGE_BANK_PALETTE_FAMILIES,
  IMAGE_BANK_SCENE_TYPES,
  IMAGE_BANK_STYLE_REGISTERS,
  type ImageBankIndustrySuitability,
  type ImageBankLicense,
  type ImageBankNarratorAlignment,
  type ImageBankOrientation,
  type ImageBankPaletteFamily,
  type ImageBankSceneType,
  type ImageBankStyleRegister,
}

export const ImageBankAssetSchema = z
  .object({
    imageId: z.string().min(1),
    /** Canonical download URL — remote original is never stored locally. */
    sourceUrl: z.string().url(),
    sourcePageUrl: z.string().url().optional(),
    orientation: z.enum(IMAGE_BANK_ORIENTATIONS),
    paletteFamily: z.enum(IMAGE_BANK_PALETTE_FAMILIES),
    styleRegister: z.enum(IMAGE_BANK_STYLE_REGISTERS),
    sceneType: z.enum(IMAGE_BANK_SCENE_TYPES),
    license: z.enum(IMAGE_BANK_LICENSES),
    src: z.string().min(1),
    moodAdjectives: z.array(z.enum(MOOD_ADJECTIVE_IDS)).optional(),
    imagerySubjects: z.array(z.enum(IMAGE_BANK_IMAGERY_SUBJECTS)).optional(),
    industrySuitability: z.array(z.enum(IMAGE_BANK_INDUSTRY_SUITABILITY)).optional(),
    narratorAlignment: z.array(z.enum(IMAGE_BANK_NARRATOR_ALIGNMENT)).optional(),
    widthPx: z.number().int().positive(),
    heightPx: z.number().int().positive(),
    bytes: z.number().int().positive(),
    jpegQuality: z.number().int().min(1).max(100),
    ingestedAt: z.string().datetime(),
  })
  .strict()

export type ImageBankAsset = z.infer<typeof ImageBankAssetSchema>

export const ImageBankMetadataFileSchema = z
  .object({
    version: z.literal(1),
    assets: z.array(ImageBankAssetSchema),
  })
  .strict()

export type ImageBankMetadataFile = z.infer<typeof ImageBankMetadataFileSchema>

/** Ingest queue row — tag fields validated via shared schema. */
export const ImageBankIngestInputSchema = ImageBankIngestTagsSchema

export type ImageBankIngestInput = z.infer<typeof ImageBankIngestInputSchema>

export const ImageBankQueueFileSchema = z
  .object({
    assets: z.array(ImageBankIngestInputSchema),
  })
  .strict()

export type ImageBankQueueFile = z.infer<typeof ImageBankQueueFileSchema>
