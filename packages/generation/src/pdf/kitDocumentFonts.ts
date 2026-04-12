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
