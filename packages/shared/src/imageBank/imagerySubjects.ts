/**
 * Pro Step 6 + bank secondary tag — what appears in the photographic world.
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.5
 * @see docs/research/MOODBOARD_SIGNAL_MODEL.md §9.1.1
 */
export const IMAGE_BANK_IMAGERY_SUBJECTS = [
  'nature-outdoors',
  'interiors-spaces',
  'studio-neutral',
  'urban-context',
  'architecture-built',
  'food-dining',
  'hands-process',
  'product-still-life',
  'people-community',
  'materials-texture',
] as const

export type ImageBankImagerySubject = (typeof IMAGE_BANK_IMAGERY_SUBJECTS)[number]

const imagerySubjectSet = new Set<string>(IMAGE_BANK_IMAGERY_SUBJECTS)

export function isImageBankImagerySubject(value: string): value is ImageBankImagerySubject {
  return imagerySubjectSet.has(value)
}
