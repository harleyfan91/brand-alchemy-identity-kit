/**
 * Pro Visual Reference photo inventory — locked layout tiers.
 *
 * @see DELIVERABLE_PRODUCTION_SPEC.md §2 Pro spreads (Visual Reference)
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8 Moodboard bank selection contract
 *
 * The ranker selects exactly one tier (6, 8, or 9 bank photos). Each tier has a
 * fixed landscape/portrait slot manifest; bank assets must match the slot orientation.
 * Logo is separate (buyer upload / wordmark) and is not counted in photo totals.
 */

/** Controlled vocabulary — matches image bank tag axis per OUTPUT_TRANSLATION_SPEC §5.8. */
export type MoodboardSceneType =
  | 'texture'
  | 'object'
  | 'environment'
  | 'people'
  | 'lighting'
  | 'pattern'

export type VisualReferencePhotoOrientation = 'portrait' | 'landscape'

export type VisualReferenceLayoutId = 'vr_6' | 'vr_8' | 'vr_9'

export const VISUAL_REFERENCE_PHOTO_COUNTS = [6, 8, 9] as const
export type VisualReferencePhotoCount = (typeof VISUAL_REFERENCE_PHOTO_COUNTS)[number]

export type VisualReferenceLeadPattern = 'compact_2' | 'brick_3'

export type VisualReferenceGridTileSpec = {
  slotId: string
  /** Base width (pt) before 4:3 / 3:4 height is applied. */
  width: number
}

export type VisualReferenceSlotBlueprint = {
  slotId: string
  orientation: VisualReferencePhotoOrientation
  sceneType: MoodboardSceneType
  folio: 'lead' | 'grid'
}

export type VisualReferenceLayoutManifest = {
  layoutId: VisualReferenceLayoutId
  /** Bank photos only — excludes logo. */
  photoCount: VisualReferencePhotoCount
  landscapeCount: number
  portraitCount: number
  leadPattern: VisualReferenceLeadPattern
  slots: VisualReferenceSlotBlueprint[]
  gridRows: VisualReferenceGridTileSpec[][]
}

export const VISUAL_REFERENCE_LAYOUTS: Record<VisualReferenceLayoutId, VisualReferenceLayoutManifest> = {
  /**
   * Fallback floor — deterministic top-6 path.
   * Folio 07: logo + 2 leads (1L, 1P). Folio 08: 2L stacked + 2P side-by-side + caption.
   */
  vr_6: {
    layoutId: 'vr_6',
    photoCount: 6,
    landscapeCount: 3,
    portraitCount: 3,
    leadPattern: 'compact_2',
    slots: [
      { slotId: 'lead_1', orientation: 'landscape', sceneType: 'environment', folio: 'lead' },
      { slotId: 'lead_2', orientation: 'portrait', sceneType: 'people', folio: 'lead' },
      { slotId: 'grid_a', orientation: 'landscape', sceneType: 'texture', folio: 'grid' },
      { slotId: 'grid_b', orientation: 'portrait', sceneType: 'lighting', folio: 'grid' },
      { slotId: 'grid_c', orientation: 'landscape', sceneType: 'pattern', folio: 'grid' },
      { slotId: 'grid_d', orientation: 'portrait', sceneType: 'environment', folio: 'grid' },
    ],
    /** Folio 08 uses stacked-L + portrait-pair brick in VisualReferenceSpread (not row manifest). */
    gridRows: [],
  },

  /**
   * Standard tier — ranker target when shortlist supports eight strong picks.
   * Folio 07: logo + 3 leads (2L, 1P). Folio 08: 5 grid (3L, 2P) + caption.
   */
  vr_8: {
    layoutId: 'vr_8',
    photoCount: 8,
    landscapeCount: 5,
    portraitCount: 3,
    leadPattern: 'brick_3',
    slots: [
      { slotId: 'lead_1', orientation: 'landscape', sceneType: 'environment', folio: 'lead' },
      { slotId: 'lead_2', orientation: 'portrait', sceneType: 'people', folio: 'lead' },
      { slotId: 'lead_3', orientation: 'landscape', sceneType: 'object', folio: 'lead' },
      { slotId: 'grid_a', orientation: 'landscape', sceneType: 'texture', folio: 'grid' },
      { slotId: 'grid_b', orientation: 'portrait', sceneType: 'lighting', folio: 'grid' },
      { slotId: 'grid_c', orientation: 'landscape', sceneType: 'pattern', folio: 'grid' },
      { slotId: 'grid_d', orientation: 'landscape', sceneType: 'object', folio: 'grid' },
      { slotId: 'grid_e', orientation: 'portrait', sceneType: 'people', folio: 'grid' },
    ],
    /** Folio 08: packed 3-col grid + caption rail (VisualReferenceSpread). */
    gridRows: [],
  },

  /**
   * Full tier — maximum moodboard selection.
   * Folio 07: logo + 3 leads (2L, 1P). Folio 08: 6 grid (3L, 3P) + caption.
   */
  vr_9: {
    layoutId: 'vr_9',
    photoCount: 9,
    landscapeCount: 5,
    portraitCount: 4,
    leadPattern: 'brick_3',
    slots: [
      { slotId: 'lead_1', orientation: 'landscape', sceneType: 'environment', folio: 'lead' },
      { slotId: 'lead_2', orientation: 'portrait', sceneType: 'people', folio: 'lead' },
      { slotId: 'lead_3', orientation: 'landscape', sceneType: 'object', folio: 'lead' },
      { slotId: 'grid_a', orientation: 'landscape', sceneType: 'texture', folio: 'grid' },
      { slotId: 'grid_b', orientation: 'portrait', sceneType: 'lighting', folio: 'grid' },
      { slotId: 'grid_c', orientation: 'landscape', sceneType: 'pattern', folio: 'grid' },
      { slotId: 'grid_d', orientation: 'portrait', sceneType: 'environment', folio: 'grid' },
      { slotId: 'grid_e', orientation: 'landscape', sceneType: 'object', folio: 'grid' },
      { slotId: 'grid_f', orientation: 'portrait', sceneType: 'people', folio: 'grid' },
    ],
    /** Folio 08: packed 3×2 grid + caption rail (VisualReferenceSpread). */
    gridRows: [],
  },
}

export function layoutIdForPhotoCount(count: VisualReferencePhotoCount): VisualReferenceLayoutId {
  if (count === 6) return 'vr_6'
  if (count === 8) return 'vr_8'
  return 'vr_9'
}

/** Maps ranker output length to the nearest locked layout tier (6 / 8 / 9). */
export function normalizeVisualReferencePhotoCount(rankerCount: number): VisualReferencePhotoCount {
  if (rankerCount <= 6) return 6
  if (rankerCount <= 8) return 8
  return 9
}

export function getVisualReferenceLayout(id: VisualReferenceLayoutId): VisualReferenceLayoutManifest {
  return VISUAL_REFERENCE_LAYOUTS[id]
}

export function getVisualReferenceLayoutForCount(count: number): VisualReferenceLayoutManifest {
  return getVisualReferenceLayout(layoutIdForPhotoCount(normalizeVisualReferencePhotoCount(count)))
}

/**
 * **Pro-G blocker — image bank metadata requirements**
 *
 * Every asset in the bank metadata file MUST carry these fields before
 * `moodboard.ranker` ships. The ranker assigns picks into fixed layout slots;
 * orientation mismatch is a walker rejection.
 *
 * @see DELIVERABLE_PRODUCTION_SPEC.md §2 “Image bank metadata (Pro-G)”
 * @see OUTPUT_TRANSLATION_SPEC.md §5.8.5
 */
export const VISUAL_REFERENCE_BANK_METADATA_REQUIREMENTS = {
  /** Required on every bank asset row. */
  requiredFields: [
    {
      field: 'imageId',
      type: 'string',
      notes: 'Stable ID referenced by ranker output and PDF slot merge.',
    },
    {
      field: 'orientation',
      type: 'enum',
      values: ['portrait', 'landscape'] as const,
      notes:
        'Native aspect of the source asset. portrait → 3:4 PDF frame; landscape → 4:3. Ranker must match slot orientation from layout manifest.',
    },
    {
      field: 'paletteFamily',
      type: 'enum',
      values: [
        'warm-earth',
        'cool-minimal',
        'bold-saturated',
        'soft-organic',
        'deep-moody',
        'bright-fresh',
        'muted-sophisticated',
        'clean-monochrome',
      ] as const,
      notes: 'Primary tag — deterministic tag matcher input.',
    },
    {
      field: 'styleRegister',
      type: 'enum',
      values: ['refined', 'raw', 'warm', 'sharp', 'playful', 'austere'] as const,
      notes: 'Primary tag — maps from step6.selectedStyle.',
    },
    {
      field: 'sceneType',
      type: 'enum',
      values: ['texture', 'object', 'environment', 'people', 'lighting', 'pattern'] as const,
      notes: 'Primary tag — scene-variety walker (≤3 per type per board).',
    },
    {
      field: 'license',
      type: 'enum',
      values: ['unsplash', 'pexels', 'licensed_stock'] as const,
      notes: 'Attribution / compliance tracking only.',
    },
    {
      field: 'src',
      type: 'string',
      notes: 'Resolved path or URL for PDF render at fulfillment.',
    },
  ],
  /** Optional refinements — improve tag-match score. */
  optionalFields: [
    {
      field: 'moodAdjectives',
      type: 'string[]',
      notes: 'Subset of the 16 controlled mood chips (OUTPUT_TRANSLATION_SPEC §5.8.2).',
    },
    {
      field: 'industrySuitability',
      type: 'string[]',
      notes: 'Industry group tags from PRO_KIT_STRATEGY §7.3.4.',
    },
    {
      field: 'narratorAlignment',
      type: 'string[]',
      notes: 'When image strongly aligns with a narrator profile.',
    },
  ],
  /** Ranker prompt must receive the active tier manifest (slotId + orientation + sceneType). */
  rankerInputs: [
    'layoutId (vr_6 | vr_8 | vr_9)',
    'slotManifest[] from VISUAL_REFERENCE_LAYOUTS[layoutId].slots',
    'shortlist[] with imageId, orientation, sceneType, and primary tags',
  ],
} as const
