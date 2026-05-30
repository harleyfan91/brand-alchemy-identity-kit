import type { BrandNarrator } from '../form.js'
import type { ImageBankNarratorAlignment } from './tags.js'

/**
 * Bank narrator tags use a slightly broader vocabulary than intake `brandNarrator`.
 * Optional on images; kit matching uses the mapped tag when the image is strongly aligned.
 *
 * @see docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md § Narrator alignment
 */
export const BRAND_NARRATOR_TO_IMAGE_BANK_ALIGNMENT: Record<
  Exclude<BrandNarrator, ''>,
  ImageBankNarratorAlignment
> = {
  solo_expert: 'solo_expert',
  solo_maker: 'solo_maker',
  local_team: 'local_team',
  product_led: 'growing_co',
  mission_community: 'established_org',
}

export function narratorAlignmentFromBrandNarrator(
  brandNarrator: BrandNarrator | string,
): ImageBankNarratorAlignment | undefined {
  const id = brandNarrator?.trim()
  if (!id) return undefined
  return BRAND_NARRATOR_TO_IMAGE_BANK_ALIGNMENT[id as Exclude<BrandNarrator, ''>]
}
