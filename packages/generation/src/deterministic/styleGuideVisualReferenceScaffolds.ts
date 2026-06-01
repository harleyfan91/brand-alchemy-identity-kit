import {
  canonicalPaletteId,
  formatPaletteGuideHeader,
  inferImagerySubjects,
  type IdentityKitForm,
} from '@identity-kit/shared'

import {
  type VisualReferenceLayoutId,
  type VisualReferencePhotoCount,
  type MoodboardSceneType,
  type VisualReferencePhotoOrientation,
  getVisualReferenceLayout,
  getVisualReferenceLayoutForCount,
  layoutIdForPhotoCount,
  normalizeVisualReferencePhotoCount,
} from './visualReferenceLayouts.js'

export type { MoodboardSceneType, VisualReferencePhotoOrientation } from './visualReferenceLayouts.js'

export type VisualReferenceSlotKind = 'logo' | 'photo'

export type VisualReferenceImageSlot = {
  /** Stable slot key for layout + ranker wiring. */
  slotId: string
  kind: VisualReferenceSlotKind
  /** Photos only — frame keeps true aspect ratio (no crop-to-abstract). */
  orientation?: VisualReferencePhotoOrientation
  sceneType?: MoodboardSceneType
  /** Bank asset ID once `moodboard.ranker` selects (scaffold omits). */
  imageId?: string
  /** Resolved asset URL/path once the bank ships (scaffold omits). */
  imageSrc?: string
  label: string
  placeholderNote: string
}

export type StyleGuideVisualReferenceModel = {
  /** Locked layout tier — see `visualReferenceLayouts.ts`. */
  layoutId: VisualReferenceLayoutId
  /** Bank photo count for this kit (6, 8, or 9 — logo excluded). */
  photoCount: VisualReferencePhotoCount
  deckLine: string
  leadSpreadTitle: string
  gridSpreadTitle: string
  logoSlot: VisualReferenceImageSlot
  /** Folio 07 — lead bank picks (count varies by layout tier). */
  leadPhotoSlots: VisualReferenceImageSlot[]
  /** Folio 08 — remaining ranked bank images. */
  gridPhotoSlots: VisualReferenceImageSlot[]
  /** Short reader-facing note (`moodboard.caption`) — rendered on folio 08. */
  selectionCaption: string
  /** Compact ranker-input signals (not a repeat of folio 01 palette rules). */
  selectionSignals: string[]
}

export const VISUAL_REFERENCE_SPREAD_COUNT = 2

export function allVisualReferenceSlots(model: StyleGuideVisualReferenceModel): VisualReferenceImageSlot[] {
  return [model.logoSlot, ...model.leadPhotoSlots, ...model.gridPhotoSlots]
}

function buildLogoSlot(form: IdentityKitForm): VisualReferenceImageSlot {
  const logoRef = form.step6.existingBrand?.logoRef?.trim()
  return {
    slotId: 'logo',
    kind: 'logo',
    label: 'Your logo',
    placeholderNote: logoRef
      ? `Logo on file (${logoRef}) — placed square; not cropped with moodboard photos.`
      : 'Logo slot · wordmark or uploaded logo at fulfillment.',
  }
}

function buildSelectionSignals(form: IdentityKitForm): string[] {
  const paletteName = formatPaletteGuideHeader(canonicalPaletteId(form.step6.selectedPalette))
  const style = form.step6.selectedStyle.replace(/_/g, ' ')
  const moods = form.step6.moodAdjectives?.filter(Boolean) ?? []
  const inferredSubjects = inferImagerySubjects(form)
  const signals: string[] = [
    `Style · ${style}`,
    moods.length > 0 ? `Mood · ${moods.join(', ')}` : 'Mood · from intake',
    inferredSubjects.length > 0
      ? `Subjects · ${inferredSubjects.join(', ')} (inferred)`
      : 'Subjects · inferred at fulfillment',
    `Palette signal · ${paletteName.replace(/^Palette: /, '')}`,
  ]

  const existing = form.step6.existingBrand
  if (existing?.referenceImageRef?.trim()) {
    signals.push('Reference upload · on file')
  }
  if (existing?.logoRef?.trim()) {
    signals.push('Logo · on file')
  }

  return signals
}

function photoSlotFromBlueprint(
  blueprint: {
    slotId: string
    orientation: VisualReferencePhotoOrientation
    sceneType: MoodboardSceneType
    folio: 'lead' | 'grid'
  },
  style: string,
): VisualReferenceImageSlot {
  const orientLabel = blueprint.orientation === 'portrait' ? 'portrait' : 'landscape'
  return {
    slotId: blueprint.slotId,
    kind: 'photo',
    orientation: blueprint.orientation,
    sceneType: blueprint.sceneType,
    label:
      blueprint.folio === 'lead'
        ? `Lead reference — ${orientLabel}`
        : `Reference ${blueprint.slotId.replace('grid_', '').toUpperCase()}`,
    placeholderNote: `${orientLabel} · ${style} register · bank image pending`,
  }
}

export type BuildStyleGuideVisualReferenceOptions = {
  /** Defaults to 9 (full tier) for QA scaffolds. */
  photoCount?: VisualReferencePhotoCount | number
}

/**
 * Pro Visual Reference Spread model (Style Guide folios 06–07).
 * Slot geometry comes from `visualReferenceLayouts.ts` — one of three locked tiers.
 */
export function buildStyleGuideVisualReferenceModel(
  form: IdentityKitForm,
  options: BuildStyleGuideVisualReferenceOptions = {},
): StyleGuideVisualReferenceModel {
  const style = form.step6.selectedStyle.replace(/_/g, ' ')
  const photoCount = normalizeVisualReferencePhotoCount(options.photoCount ?? 9)
  const layout = getVisualReferenceLayout(layoutIdForPhotoCount(photoCount))

  const leadBlueprints = layout.slots.filter((slot) => slot.folio === 'lead')
  const gridBlueprints = layout.slots.filter((slot) => slot.folio === 'grid')

  return {
    layoutId: layout.layoutId,
    photoCount: layout.photoCount,
    deckLine:
      'Curated photographs from the kit image bank — chosen to match how your brand should look and feel. Each photo fills its landscape or portrait mat (center crop when aspect differs; no letterboxing). Logo stays square and uncropped.',
    leadSpreadTitle: 'Logo & lead references',
    gridSpreadTitle: 'Reference grid',
    logoSlot: buildLogoSlot(form),
    leadPhotoSlots: leadBlueprints.map((blueprint) => photoSlotFromBlueprint(blueprint, style)),
    gridPhotoSlots: gridBlueprints.map((blueprint) => photoSlotFromBlueprint(blueprint, style)),
    selectionCaption: `[Scaffold] At fulfillment, a short note here explains why these images were chosen — grounded in your mood and style register, reference upload or logo when provided, and your kit palette as a selection signal (color rules stay on folio 01).`,
    selectionSignals: buildSelectionSignals(form),
  }
}

/** Rebuild slot manifest when ranker returns a different locked tier than the scaffold default. */
export function applyVisualReferencePhotoCount(
  model: StyleGuideVisualReferenceModel,
  rankerCount: number,
): StyleGuideVisualReferenceModel {
  const targetCount = normalizeVisualReferencePhotoCount(rankerCount)
  if (targetCount === model.photoCount) return model

  const layout = getVisualReferenceLayoutForCount(targetCount)
  const styleMatch = model.leadPhotoSlots[0]?.placeholderNote.match(/· (.+) register ·/)
  const style = styleMatch?.[1] ?? 'style'

  const leadBlueprints = layout.slots.filter((slot) => slot.folio === 'lead')
  const gridBlueprints = layout.slots.filter((slot) => slot.folio === 'grid')

  const existingBySlot = new Map(allVisualReferenceSlots(model).map((slot) => [slot.slotId, slot]))

  const remapSlots = (blueprints: typeof layout.slots) =>
    blueprints.map((blueprint) => {
      const base = photoSlotFromBlueprint(blueprint, style)
      const prior = existingBySlot.get(blueprint.slotId)
      if (!prior?.imageId) return base
      return { ...base, imageId: prior.imageId, imageSrc: prior.imageSrc }
    })

  return {
    ...model,
    layoutId: layout.layoutId,
    photoCount: layout.photoCount,
    leadPhotoSlots: remapSlots(leadBlueprints),
    gridPhotoSlots: remapSlots(gridBlueprints),
  }
}

function applySlotSelection(slot: VisualReferenceImageSlot, pick?: { imageId: string; imageSrc?: string }): VisualReferenceImageSlot {
  if (!pick) return slot
  return { ...slot, imageId: pick.imageId, imageSrc: pick.imageSrc }
}

/** Ranker output merges into the scaffold model without changing layout geometry. */
export function mergeVisualReferenceRankerSelections(
  model: StyleGuideVisualReferenceModel,
  selections: Array<{ slotId: string; imageId: string; imageSrc?: string }>,
): StyleGuideVisualReferenceModel {
  const photoPicks = selections.filter((s) => s.slotId !== 'logo')
  const withTier = applyVisualReferencePhotoCount(model, photoPicks.length)

  const bySlot = new Map(selections.map((s) => [s.slotId, s]))
  return {
    ...withTier,
    logoSlot: applySlotSelection(withTier.logoSlot, bySlot.get(withTier.logoSlot.slotId)),
    leadPhotoSlots: withTier.leadPhotoSlots.map((slot) => applySlotSelection(slot, bySlot.get(slot.slotId))),
    gridPhotoSlots: withTier.gridPhotoSlots.map((slot) => applySlotSelection(slot, bySlot.get(slot.slotId))),
  }
}

export {
  getVisualReferenceLayout,
  getVisualReferenceLayoutForCount,
  layoutIdForPhotoCount,
  normalizeVisualReferencePhotoCount,
  VISUAL_REFERENCE_BANK_METADATA_REQUIREMENTS,
  VISUAL_REFERENCE_LAYOUTS,
  VISUAL_REFERENCE_PHOTO_COUNTS,
} from './visualReferenceLayouts.js'
export type { VisualReferenceLayoutId, VisualReferencePhotoCount } from './visualReferenceLayouts.js'
