import {
  PHOTO_COLOR_RELATIONSHIPS,
  type PhotoColorRelationship,
} from './imageBank/photoColorRelationship.js'

export { PHOTO_COLOR_RELATIONSHIPS, type PhotoColorRelationship }

export interface PhotoColorRelationshipOption {
  id: PhotoColorRelationship
  label: string
  description: string
}

export const PHOTO_COLOR_RELATIONSHIP_OPTIONS: readonly PhotoColorRelationshipOption[] = [
  {
    id: 'echo-brand-colors',
    label: 'Match my brand colors',
    description: 'Photos should feel in the same color family as your palette.',
  },
  {
    id: 'neutral-backdrops',
    label: 'Neutral photos, colorful brand',
    description: 'Brand color lives in logo and UI; photos stay mostly neutral or B&W.',
  },
  {
    id: 'natural-full-color',
    label: 'Real-world color',
    description: 'Full natural color in photos even when it differs from your swatches.',
  },
] as const
