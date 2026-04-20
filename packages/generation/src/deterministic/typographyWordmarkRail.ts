import type { IdentityKitForm } from '@identity-kit/shared'

import {
  typographyDownloadLinks,
  typographyFooterParts,
  typographyHonorsExistingTypeface,
  typographySpecimenSlots,
} from './coreAssembly.js'
import { getRecipeForProfile, resolveTypographyPair } from './typographyRecipes.js'

/** Same treatment as `toSentenceCaseLabel` in brandIdentityGuideModel (kept local to avoid circular imports). */
function roleLabelInProse(roleEyebrow: string): string {
  const trimmed = roleEyebrow.trim()
  if (!trimmed) return 'this role'
  const lower = trimmed.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

type StyleKey = 'clean_minimal' | 'bold_graphic' | 'organic_natural' | 'luxe_refined'

type RailTemplateSet = {
  pair: (primaryName: string, primaryRole: string, secondaryName: string, secondaryRole: string) => string
  single: (name: string, role: string) => string
  existing: (existing: string) => string
  wordmark: string
}

const RAIL_TEMPLATES: Record<StyleKey, RailTemplateSet> = {
  clean_minimal: {
    pair: (primaryName, primaryRole, secondaryName, secondaryRole) =>
      `This set of fonts keeps your branding clear and steady. ${primaryName} leads ${primaryRole}, while ${secondaryName} supports ${secondaryRole} so everyday reading stays easy.`,
    single: (name, role) =>
      `This set of fonts keeps your branding clear and steady. ${name} covers ${role}, with weight and spacing doing the hierarchy work.`,
    existing: (existing) =>
      `This set of fonts is anchored in ${existing}. The specimen above gives you a hierarchy reference, then you map those roles to your licensed files in production.`,
    wordmark:
      'Consistent color and typography can keep your branding recognizable without a custom logo in every placement. These examples show approved ways your name can appear in color. Use the strongest option as the default, and use the alternates only when background or format calls for a different approved choice.',
  },
  bold_graphic: {
    pair: (primaryName, primaryRole, secondaryName, secondaryRole) =>
      `This set of fonts is built for impact with control. ${primaryName} drives ${primaryRole}, and ${secondaryName} keeps ${secondaryRole} readable when layouts get louder.`,
    single: (name, role) =>
      `This set of fonts is built for impact with control. ${name} carries ${role}, with weight contrast keeping the voice bold but legible.`,
    existing: (existing) =>
      `This set of fonts stays rooted in ${existing}. The specimen above maps contrast and hierarchy first, then you apply the same structure with your licensed files.`,
    wordmark:
      'Consistent color and typography can keep your branding recognizable without a custom logo in every placement. These examples show approved ways your name can appear in color. Keep the strongest option as the default, then choose another approved option only when background or format needs it.',
  },
  organic_natural: {
    pair: (primaryName, primaryRole, secondaryName, secondaryRole) =>
      `This set of fonts is designed to feel human and approachable. ${primaryName} leads ${primaryRole}, and ${secondaryName} supports ${secondaryRole} so longer copy stays calm.`,
    single: (name, role) =>
      `This set of fonts is designed to feel human and approachable. ${name} carries ${role}, with gentle hierarchy built through weight and spacing.`,
    existing: (existing) =>
      `This set of fonts builds on ${existing}. The specimen above shows a practical hierarchy, then you apply that same rhythm with your licensed files.`,
    wordmark:
      'Consistent color and typography can keep your branding recognizable without a custom logo in every placement. These examples show approved ways your name can appear in color. Use the strongest option as your default, and move to another approved option only when the background or format needs it.',
  },
  luxe_refined: {
    pair: (primaryName, primaryRole, secondaryName, secondaryRole) =>
      `This set of fonts is tuned for polish and restraint. ${primaryName} carries ${primaryRole}, while ${secondaryName} supports ${secondaryRole} with cleaner everyday readability.`,
    single: (name, role) =>
      `This set of fonts is tuned for polish and restraint. ${name} carries ${role}, and measured weight shifts keep hierarchy elegant.`,
    existing: (existing) =>
      `This set of fonts keeps ${existing} as the anchor. The specimen above defines a refined hierarchy, then you map it to your licensed files for final production.`,
    wordmark:
      'Consistent color and typography can keep your branding recognizable without a custom logo in every placement. These examples show approved ways your name can appear in color. Keep the strongest option as your default, and use the alternates only when space, background, or format calls for it.',
  },
}

function railTemplatesForStyle(form: IdentityKitForm): RailTemplateSet {
  const selected = form.step6.selectedStyle ?? 'clean_minimal'
  const key: StyleKey =
    selected === 'bold_graphic' ||
    selected === 'organic_natural' ||
    selected === 'luxe_refined' ||
    selected === 'clean_minimal'
      ? selected
      : 'clean_minimal'
  return RAIL_TEMPLATES[key]
}

function fontIntroFromSlots(form: IdentityKitForm, templates: RailTemplateSet): string {
  const slots = typographySpecimenSlots(form)
  const { primaryFont, secondaryFont } = resolveTypographyPair(getRecipeForProfile(form))
  const sameFamily =
    primaryFont.family.trim().toLowerCase() === secondaryFont.family.trim().toLowerCase()

  const firstSlot = slots[0]
  const secondSlot = slots[1]

  if (sameFamily) {
    const name = firstSlot?.faceLabel ?? primaryFont.family
    const role = roleLabelInProse(firstSlot?.roleEyebrow ?? 'headlines and body')
    return templates.single(name, role)
  }

  if (firstSlot && secondSlot) {
    const primaryRole = roleLabelInProse(firstSlot.roleEyebrow)
    const secondaryRole = roleLabelInProse(secondSlot.roleEyebrow)
    return templates.pair(firstSlot.faceLabel, primaryRole, secondSlot.faceLabel, secondaryRole)
  }

  return templates.pair(
    primaryFont.family,
    'headlines and display moments',
    secondaryFont.family,
    'body and supporting text',
  )
}

function fontIntroExisting(form: IdentityKitForm, templates: RailTemplateSet): string {
  const existing = form.step6.existingTypeface?.trim() ?? ''
  if (!existing) {
    return fontIntroFromSlots(form, templates)
  }
  return templates.existing(existing)
}

/**
 * Deterministic copy + links for folio 02b left rail (fonts → wordmark → downloads).
 * Does not use `typographySectionLeads` so channel-first matrix lines never fight a fonts-first rail.
 */
export function composeTypographyWordmarkRail(
  form: IdentityKitForm,
  wordmarkBlockCount: number,
): {
  fontIntro: string
  wordmarkIntro: string
  downloadLinks: Array<{ label: string; href: string }>
  licensing: string
} {
  const templates = railTemplatesForStyle(form)
  const fontIntro = typographyHonorsExistingTypeface(form)
    ? fontIntroExisting(form, templates)
    : fontIntroFromSlots(form, templates)

  let wordmarkIntro = templates.wordmark
  if (wordmarkBlockCount < 4) {
    wordmarkIntro += ' When fewer strong color pairings are available, the system shows fewer examples.'
  }

  const { licensing } = typographyFooterParts(form)
  const downloadLinks = typographyDownloadLinks(form)

  return { fontIntro, wordmarkIntro, downloadLinks, licensing }
}
