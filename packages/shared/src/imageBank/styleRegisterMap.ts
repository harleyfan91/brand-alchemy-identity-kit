import { STYLE_IDS } from '../styleCatalog.js'
import type { ImageBankStyleRegister } from './tags.js'

export type StyleRegisterProfile = {
  /** Primary register for tag matching and ranker bias. */
  primary: ImageBankStyleRegister
  /** Secondary registers — used when broadening the deterministic shortlist. */
  secondary: readonly ImageBankStyleRegister[]
}

/**
 * Maps Step 6 `selectedStyle` (4 wizard presets) → bank style registers (6 values).
 * Images carry a single `styleRegister` tag; kits resolve to primary + secondary for matching.
 *
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Style register
 */
export const SELECTED_STYLE_TO_STYLE_REGISTER: Record<string, StyleRegisterProfile> = {
  clean_minimal: { primary: 'refined', secondary: ['austere', 'sharp'] },
  bold_graphic: { primary: 'sharp', secondary: ['playful', 'refined'] },
  organic_natural: { primary: 'warm', secondary: ['raw', 'refined'] },
  luxe_refined: { primary: 'refined', secondary: ['austere', 'warm'] },
}

export function styleRegisterProfileFromSelectedStyle(selectedStyle: string): StyleRegisterProfile | undefined {
  const id = selectedStyle?.trim()
  if (!id) return undefined
  return SELECTED_STYLE_TO_STYLE_REGISTER[id]
}

export function primaryStyleRegisterFromSelectedStyle(selectedStyle: string): ImageBankStyleRegister | undefined {
  return styleRegisterProfileFromSelectedStyle(selectedStyle)?.primary
}

export function styleRegistersForKitMatching(selectedStyle: string): ImageBankStyleRegister[] {
  const profile = styleRegisterProfileFromSelectedStyle(selectedStyle)
  if (!profile) return []
  return [profile.primary, ...profile.secondary]
}

export function assertCompleteStyleRegisterCoverage(): void {
  const missing = STYLE_IDS.filter((id) => !SELECTED_STYLE_TO_STYLE_REGISTER[id])
  if (missing.length > 0) {
    throw new Error(`Missing style register mapping for: ${missing.join(', ')}`)
  }
}
