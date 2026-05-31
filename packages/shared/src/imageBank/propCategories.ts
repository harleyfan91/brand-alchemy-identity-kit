/**
 * Optional bank tag — dominant prop/product in frame when sector-specific.
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Prop category
 */
export const IMAGE_BANK_PROP_CATEGORIES = [
  'neutral-generic',
  'food-beverage',
  'wearables-tech',
  'craft-tools',
  'camera-media',
  'office-tech',
  'beauty-personal',
  'fashion-accessories',
] as const

export type ImageBankPropCategory = (typeof IMAGE_BANK_PROP_CATEGORIES)[number]

const propCategorySet = new Set<string>(IMAGE_BANK_PROP_CATEGORIES)

export function isImageBankPropCategory(value: string): value is ImageBankPropCategory {
  return propCategorySet.has(value)
}
