import type { IdentityKitForm } from '../form.js'
import type { MoodAdjective } from '../step6MoodAdjectives.js'
import { inferImagerySubjects } from './imagerySubjectInference.js'
import { inferPropCategoryHints } from './propCategoryInference.js'
import { industrySuitabilityFromIndustryId } from './industrySuitabilityMap.js'
import { narratorAlignmentFromBrandNarrator } from './narratorAlignmentMap.js'
import { paletteFamilyFromPaletteId } from './paletteFamilyMap.js'
import {
  defaultPhotoColorRelationship,
  type PhotoColorRelationship,
} from './photoColorRelationship.js'
import type { ImageBankImagerySubject } from './imagerySubjects.js'
import type { ImageBankPropCategory } from './propCategories.js'
import {
  referenceVisionProfileToFlatTags,
  type ReferenceVisionProfile,
} from './referenceVisionProfile.js'
import { styleRegisterProfileFromSelectedStyle } from './styleRegisterMap.js'
import type {
  ImageBankIndustrySuitability,
  ImageBankNarratorAlignment,
  ImageBankPaletteFamily,
  ImageBankStyleRegister,
} from './tags.js'

/**
 * Normalized tag signals derived from a kit intake form — inputs to the deterministic tag matcher.
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.1–§5.8.2
 */
export type ImageBankKitSignals = {
  /** Kit named palette → bank family (soft matcher weight). */
  paletteFamily?: ImageBankPaletteFamily
  /** Effective photo color character for matching — profile overrides kit when present. */
  photoColorCharacter?: ImageBankPaletteFamily
  photoColorRelationship: PhotoColorRelationship
  styleRegisterPrimary?: ImageBankStyleRegister
  styleRegisterSecondary: ImageBankStyleRegister[]
  moodAdjectives: MoodAdjective[]
  /** Fulfillment-derived — reference vision + industry/style inference; not intake. */
  imagerySubjects: ImageBankImagerySubject[]
  /** Fulfillment-derived — industry → expected prop types in frame. */
  propCategoryHints: ImageBankPropCategory[]
  industrySuitability: ImageBankIndustrySuitability[]
  narratorAlignment?: ImageBankNarratorAlignment
  referenceVisionProfile?: ReferenceVisionProfile
  /** Flat tags derived from `referenceVisionProfile` for scoring helpers. */
  referenceImageTags: string[]
}

export type ResolveImageBankKitSignalsOptions = {
  referenceVisionProfile?: ReferenceVisionProfile
  /** @deprecated Prefer `referenceVisionProfile`. */
  referenceImageTags?: string[]
}

function effectiveStyleRegisters(
  selectedStyle: string,
  profile?: ReferenceVisionProfile,
): { primary?: ImageBankStyleRegister; secondary: ImageBankStyleRegister[] } {
  if (profile?.styleRegisters.length) {
    const [primary, ...rest] = profile.styleRegisters
    return { primary, secondary: rest }
  }
  const styleProfile = styleRegisterProfileFromSelectedStyle(selectedStyle)
  return {
    primary: styleProfile?.primary,
    secondary: styleProfile ? [...styleProfile.secondary] : [],
  }
}

function effectiveMoodAdjectives(
  kitMoods: MoodAdjective[],
  profile?: ReferenceVisionProfile,
): MoodAdjective[] {
  if (kitMoods.length > 0) return kitMoods
  return [...(profile?.moodAdjectives ?? [])]
}

export function resolveImageBankKitSignals(
  form: IdentityKitForm,
  options: ResolveImageBankKitSignalsOptions = {},
): ImageBankKitSignals {
  const profile = options.referenceVisionProfile
  const kitPaletteFamily = paletteFamilyFromPaletteId(form.step6.selectedPalette)
  const styleRegisters = effectiveStyleRegisters(form.step6.selectedStyle, profile)
  const kitMoods = [...(form.step6.moodAdjectives ?? [])]

  const referenceImageTags = profile
    ? referenceVisionProfileToFlatTags(profile)
    : (options.referenceImageTags ?? [])

  const photoColorRelationship =
    form.step6.photoColorRelationship ??
    profile?.photoColorRelationship ??
    defaultPhotoColorRelationship(form.step6.selectedStyle)

  return {
    paletteFamily: kitPaletteFamily,
    photoColorCharacter: profile?.photoColorCharacter ?? kitPaletteFamily,
    photoColorRelationship,
    styleRegisterPrimary: styleRegisters.primary,
    styleRegisterSecondary: styleRegisters.secondary,
    moodAdjectives: effectiveMoodAdjectives(kitMoods, profile),
    imagerySubjects: inferImagerySubjects(form, profile),
    propCategoryHints: inferPropCategoryHints(form),
    industrySuitability: industrySuitabilityFromIndustryId(form.step1.industry),
    narratorAlignment: narratorAlignmentFromBrandNarrator(form.step1.brandNarrator),
    referenceVisionProfile: profile,
    referenceImageTags,
  }
}
