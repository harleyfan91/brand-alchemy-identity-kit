import type { IdentityKitForm } from '../form.js'
import type { ImageBankImagerySubject } from './imagerySubjects.js'
import type { ReferenceVisionProfile } from './referenceVisionProfile.js'

/**
 * Soft subject hints for matcher — **not** intake. Sources:
 * 1. Reference vision profile (strongest)
 * 2. Industry + style heuristics
 * 3. Ranker reads visualNotes + STYLE_IMAGERY_CORE for holistic judgment
 *
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.5
 */
const INDUSTRY_SUBJECT_HINTS: Record<string, ImageBankImagerySubject[]> = {
  food_beverage: ['food-dining', 'hands-process', 'interiors-spaces'],
  hospitality: ['food-dining', 'interiors-spaces', 'people-community'],
  health_wellness: ['interiors-spaces', 'nature-outdoors', 'materials-texture'],
  professional_services: ['interiors-spaces', 'architecture-built'],
  creative_agency: ['studio-neutral', 'urban-context', 'hands-process'],
  retail_commerce: ['product-still-life', 'interiors-spaces'],
  b2b_technology: ['interiors-spaces', 'studio-neutral'],
  home_services: ['hands-process', 'interiors-spaces'],
  automotive: ['product-still-life', 'urban-context'],
  education: ['people-community', 'interiors-spaces'],
}

const STYLE_SUBJECT_HINTS: Record<string, ImageBankImagerySubject[]> = {
  organic_natural: ['nature-outdoors', 'materials-texture', 'hands-process'],
  clean_minimal: ['studio-neutral', 'architecture-built', 'materials-texture'],
  bold_graphic: ['urban-context', 'product-still-life', 'studio-neutral'],
  luxe_refined: ['interiors-spaces', 'materials-texture', 'product-still-life'],
}

export function inferImagerySubjects(
  form: IdentityKitForm,
  profile?: ReferenceVisionProfile,
): ImageBankImagerySubject[] {
  const merged = new Set<ImageBankImagerySubject>()

  for (const subject of profile?.imagerySubjects ?? []) {
    merged.add(subject)
  }

  for (const subject of INDUSTRY_SUBJECT_HINTS[form.step1.industry] ?? []) {
    merged.add(subject)
  }

  for (const subject of STYLE_SUBJECT_HINTS[form.step6.selectedStyle] ?? []) {
    merged.add(subject)
  }

  return [...merged]
}
