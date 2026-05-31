import type { IdentityKitForm, ReferenceVisionProfile } from '@identity-kit/shared'

import { styleGuideImageryDirectionBody } from '../../deterministic/phase8Content.js'
import {
  getVisualReferenceLayout,
  type VisualReferenceLayoutId,
} from '../../deterministic/visualReferenceLayouts.js'
import type { RankedImageBankAsset } from '../../image-bank/tagMatcher.js'

export const REFERENCE_TAG_EXTRACTOR_TASK_PROMPT = `Analyze this reference image as **photographic direction only** — not logo or UI color rules. Return bank-vocabulary tags only. Infer how photos should behave for this brand: color character in the **photograph itself**, style register, dominant scene types, mood adjectives, imagery subjects, and photoColorRelationship. If the photo world would diverge from warm/cool brand swatches, say so in compositionNotes. Do not infer industry or business type from the image alone.`

export function buildReferenceTagExtractorUserPrompt(): string {
  return REFERENCE_TAG_EXTRACTOR_TASK_PROMPT
}

export function buildMoodboardRankerTaskPrompt(options: {
  layoutId: VisualReferenceLayoutId
  shortlist: RankedImageBankAsset[]
  hasReferenceImage: boolean
  inferredImagerySubjects?: string[]
  photoColorRelationship?: string
}): string {
  const layout = getVisualReferenceLayout(options.layoutId)
  const slotManifest = layout.slots
    .map((slot) => `${slot.slotId}: ${slot.orientation}, scene ${slot.sceneType}`)
    .join('\n')

  const shortlistBlock = options.shortlist
    .map(
      ({ asset }) =>
        `${asset.imageId} · ${asset.styleRegister} · ${asset.sceneType} · ${asset.orientation} · ${asset.paletteFamily}${asset.prominentHueFamilies?.length ? ` · hues ${asset.prominentHueFamilies.join(',')}` : ''}${asset.imagerySubjects?.length ? ` · subjects ${asset.imagerySubjects.join(',')}` : ''}`,
    )
    .join('\n')

  const referenceBlock = options.hasReferenceImage
    ? `\n\nThe buyer uploaded a **reference image** as their stated photographic intent. **Prioritize** shortlist images that match the reference's register, color character, subjects, and light quality. When the reference diverges from the kit palette swatches, **follow the reference for photography**; palette harmony is secondary. Explicit mood adjective chips outrank reference mood tags when they conflict.`
    : ''

  const subjectLine =
    options.inferredImagerySubjects?.length
      ? `\nInferred photographic subjects (fulfillment — not buyer intake): ${options.inferredImagerySubjects.join(', ')}`
      : ''

  return `Per the brand context and voice contracts in your system prompt, select bank images for this kit's Visual Reference Spread.

You are selecting from a fixed bank — you cannot pick images outside the provided shortlist.
${options.photoColorRelationship ? `\nphotoColorRelationship: ${options.photoColorRelationship}` : ''}${subjectLine}

Layout tier: ${options.layoutId}
Slot manifest (orientation must match):
${slotManifest}

Shortlist (${options.shortlist.length} candidates):
${shortlistBlock}

Enforce scene-type variety: no more than 3 images of any single scene type. Assign each pick to exactly one slotId from the manifest; orientation must match the slot. For each pick, return brief reasoning (≤ 20 words) citing tags that drove the pick.${referenceBlock}`
}

export function buildMoodboardCaptionTaskPromptForForm(
  form: IdentityKitForm,
  options: { selectedImageIds: string[]; photoColorRelationship: string },
): string {
  return `Per the brand context and voice contracts in your system prompt, write the Visual Reference Spread caption (~80 words) for the selected bank images.

Selected image IDs: ${options.selectedImageIds.join(', ')}
photoColorRelationship: ${options.photoColorRelationship}

Ground in aggregate tags from the selected images plus kit style, mood adjectives, imagery subjects, and narrator. When photoColorRelationship is neutral-backdrops or natural-full-color, explicitly bridge how brand swatches (folio 01) relate to the photographic world shown. Cite intake fields in fieldsCited.

Imagery direction prose for this kit:
${styleGuideImageryDirectionBody(form)}`
}

export type ReferenceVisionExtractorContext = {
  referenceVisionProfile?: ReferenceVisionProfile
}
