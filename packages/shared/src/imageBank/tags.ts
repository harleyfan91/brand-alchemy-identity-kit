import { MOOD_ADJECTIVE_IDS, type MoodAdjective } from '../step6MoodAdjectives.js'

/** Primary bank tag — one per image. Maps from `step6.selectedPalette`. */
export const IMAGE_BANK_PALETTE_FAMILIES = [
  'warm-earth',
  'cool-minimal',
  'bold-saturated',
  'soft-organic',
  'deep-moody',
  'bright-fresh',
  'muted-sophisticated',
  'clean-monochrome',
] as const

/** Primary bank tag — one per image. Maps from `step6.selectedStyle`. */
export const IMAGE_BANK_STYLE_REGISTERS = [
  'refined',
  'raw',
  'warm',
  'sharp',
  'playful',
  'austere',
] as const

/** Primary bank tag — one per image. Drives moodboard scene variety. */
export const IMAGE_BANK_SCENE_TYPES = [
  'texture',
  'object',
  'environment',
  'people',
  'lighting',
  'pattern',
] as const

export const IMAGE_BANK_LICENSES = ['unsplash', 'pexels', 'licensed_stock'] as const

export const IMAGE_BANK_ORIENTATIONS = ['portrait', 'landscape'] as const

/**
 * Optional bank tags — zero or more per image.
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md
 */
export const IMAGE_BANK_INDUSTRY_SUITABILITY = [
  'professional_services',
  'hospitality_food',
  'makers_artisans',
  'wellness_healthcare',
  'retail_commerce',
  'creative_agency',
  'b2b_tech',
  'lifestyle_consumer',
] as const

/**
 * Optional bank tags — zero or more per image.
 * Narrator ids differ slightly from intake `brandNarrator`; use `narratorAlignmentFromBrandNarrator`.
 */
export const IMAGE_BANK_NARRATOR_ALIGNMENT = [
  'solo_maker',
  'solo_expert',
  'local_team',
  'growing_co',
  'established_org',
] as const

export type ImageBankPaletteFamily = (typeof IMAGE_BANK_PALETTE_FAMILIES)[number]
export type ImageBankStyleRegister = (typeof IMAGE_BANK_STYLE_REGISTERS)[number]
export type ImageBankSceneType = (typeof IMAGE_BANK_SCENE_TYPES)[number]
export type ImageBankLicense = (typeof IMAGE_BANK_LICENSES)[number]
export type ImageBankOrientation = (typeof IMAGE_BANK_ORIENTATIONS)[number]
export type ImageBankIndustrySuitability = (typeof IMAGE_BANK_INDUSTRY_SUITABILITY)[number]
export type ImageBankNarratorAlignment = (typeof IMAGE_BANK_NARRATOR_ALIGNMENT)[number]

export type ImageBankMoodAdjective = MoodAdjective

const paletteFamilySet = new Set<string>(IMAGE_BANK_PALETTE_FAMILIES)
const styleRegisterSet = new Set<string>(IMAGE_BANK_STYLE_REGISTERS)
const sceneTypeSet = new Set<string>(IMAGE_BANK_SCENE_TYPES)
const industrySet = new Set<string>(IMAGE_BANK_INDUSTRY_SUITABILITY)
const narratorSet = new Set<string>(IMAGE_BANK_NARRATOR_ALIGNMENT)
const moodSet = new Set<string>(MOOD_ADJECTIVE_IDS)

export function isImageBankPaletteFamily(value: string): value is ImageBankPaletteFamily {
  return paletteFamilySet.has(value)
}

export function isImageBankStyleRegister(value: string): value is ImageBankStyleRegister {
  return styleRegisterSet.has(value)
}

export function isImageBankSceneType(value: string): value is ImageBankSceneType {
  return sceneTypeSet.has(value)
}

export function isImageBankIndustrySuitability(value: string): value is ImageBankIndustrySuitability {
  return industrySet.has(value)
}

export function isImageBankNarratorAlignment(value: string): value is ImageBankNarratorAlignment {
  return narratorSet.has(value)
}

export function isImageBankMoodAdjective(value: string): value is ImageBankMoodAdjective {
  return moodSet.has(value)
}
