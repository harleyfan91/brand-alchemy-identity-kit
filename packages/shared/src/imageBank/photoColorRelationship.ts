/**
 * Pro Step 6 — how brand swatches relate to photographic color.
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.4
 */
export const PHOTO_COLOR_RELATIONSHIPS = [
  'echo-brand-colors',
  'neutral-backdrops',
  'natural-full-color',
] as const

export type PhotoColorRelationship = (typeof PHOTO_COLOR_RELATIONSHIPS)[number]

/** Default when buyer omits the field — derived from `selectedStyle`. */
export function defaultPhotoColorRelationship(selectedStyle: string): PhotoColorRelationship {
  switch (selectedStyle?.trim()) {
    case 'clean_minimal':
    case 'luxe_refined':
      return 'neutral-backdrops'
    case 'organic_natural':
      return 'natural-full-color'
    default:
      return 'echo-brand-colors'
  }
}
