import type { IdentityKitForm } from '@identity-kit/shared'

import { resolveTypographyPair, getRecipeForProfile } from '../deterministic/typographyRecipes.js'

/** PDF chrome + narrative: display for editorial titles, body for UI and long text. */
export type KitPdfFontFamilies = {
  displayFamily: string
  bodyFamily: string
}

/**
 * Maps the active typography recipe to React-PDF `fontFamily` strings (must match Font.register).
 */
export function getKitPdfFontFamilies(form: IdentityKitForm): KitPdfFontFamilies {
  const recipe = getRecipeForProfile(form)
  const { primaryFont, secondaryFont } = resolveTypographyPair(recipe)
  return {
    displayFamily: primaryFont.family,
    bodyFamily: secondaryFont.family,
  }
}

/**
 * Stable Inter + Source Serif 4 for Brand Identity Guide chrome and narrative only.
 * Type specimen tiles still use the customer's registered `pdfFamily` from the recipe.
 * Families must stay in sync with `registerCoreKitPdfFonts`.
 */
export function getBrandIdentityGuidePdfFontFamilies(): KitPdfFontFamilies {
  return {
    displayFamily: 'Inter',
    bodyFamily: 'Inter',
  }
}

/** Palette swatch hex + friendly name — always kit chrome fonts, never the customer's recipe pair. */
export function getKitPaletteSwatchFontFamilies(): KitPdfFontFamilies {
  return getBrandIdentityGuidePdfFontFamilies()
}
