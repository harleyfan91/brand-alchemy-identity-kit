import {
  IMAGE_BANK_IMAGERY_SUBJECTS,
  type ImageBankImagerySubject,
} from './imageBank/imagerySubjects.js'

export { IMAGE_BANK_IMAGERY_SUBJECTS, type ImageBankImagerySubject }

export interface ImagerySubjectOption {
  id: ImageBankImagerySubject
  label: string
  group: 'places' | 'people-craft' | 'things-texture'
}

export const IMAGERY_SUBJECT_OPTIONS: readonly ImagerySubjectOption[] = [
  { id: 'nature-outdoors', label: 'Nature & outdoors', group: 'places' },
  { id: 'interiors-spaces', label: 'Interiors & spaces', group: 'places' },
  { id: 'studio-neutral', label: 'Studio & neutral setups', group: 'places' },
  { id: 'urban-context', label: 'Urban & street life', group: 'places' },
  { id: 'architecture-built', label: 'Architecture & structure', group: 'places' },
  { id: 'food-dining', label: 'Food & dining', group: 'people-craft' },
  { id: 'hands-process', label: 'Hands & craft process', group: 'people-craft' },
  { id: 'people-community', label: 'People & community', group: 'people-craft' },
  { id: 'product-still-life', label: 'Product & still life', group: 'things-texture' },
  { id: 'materials-texture', label: 'Materials & texture', group: 'things-texture' },
] as const

export const IMAGERY_SUBJECT_GROUP_LABELS: Record<ImagerySubjectOption['group'], string> = {
  places: 'Places',
  'people-craft': 'People & craft',
  'things-texture': 'Things & texture',
}

const SUBJECT_SET: ReadonlySet<string> = new Set(IMAGE_BANK_IMAGERY_SUBJECTS)

export function isImagerySubject(value: string): value is ImageBankImagerySubject {
  return SUBJECT_SET.has(value)
}
