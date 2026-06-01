import { SchemaParseError } from '../errors.js'
import {
  MoodboardRankerSchema,
  ReferenceVisionProfileSchema,
  resolveImageBankKitSignals,
  type IdentityKitForm,
  type MoodboardRankerOutput,
  type ReferenceVisionProfile,
} from '@identity-kit/shared'

import { readImageBankMetadata } from '../../image-bank/ingest.js'
import {
  assignDeterministicRankerPicks,
  buildVisualReferenceShortlist,
} from '../../image-bank/visualReferencePipeline.js'
import { callClaude, type UserBlock } from '../client.js'
import { scaffoldAndRefine, type ScaffoldAndRefineResult } from '../dispatcher.js'
import {
  buildMoodboardRankerTaskPrompt,
  buildReferenceTagExtractorUserPrompt,
} from '../prompts/moodboardPrompts.js'
import { buildSystemPrompt } from '../prompts/buildSystemPrompt.js'
import { assertMoodboardSceneVariety } from '../walkers/sceneVariety.js'
import {
  getVisualReferenceLayout,
  type VisualReferenceLayoutId,
} from '../../deterministic/visualReferenceLayouts.js'

const EXTRACTOR_SECTION = 'moodboard.referenceTagExtractor'
const RANKER_SECTION = 'moodboard.ranker'

export type ReferenceVisionExtractResult =
  | { ok: true; profile: ReferenceVisionProfile }
  | { ok: false; reason: string }

/**
 * Step 0 — reference vision extraction. Silent failure contract per OUTPUT_TRANSLATION_SPEC §5.8.1.
 */
export async function extractReferenceVisionProfile(
  form: IdentityKitForm,
  kitOrderId: string,
  referenceImageBlock: UserBlock,
): Promise<ReferenceVisionExtractResult> {
  try {
    const { data } = await callClaude({
      callClass: 'moodboard_reference_vision',
      system: { text: buildSystemPrompt(form), cacheKey: 'pro-system-v1' },
      userBlocks: [referenceImageBlock, { type: 'text', text: buildReferenceTagExtractorUserPrompt() }],
      schema: ReferenceVisionProfileSchema,
      kitOrderId,
      sectionName: EXTRACTOR_SECTION,
    })
    return { ok: true, profile: data }
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    }
  }
}

export type MoodboardRankerRunResult = ScaffoldAndRefineResult<MoodboardRankerOutput>

export async function runMoodboardRanker(options: {
  form: IdentityKitForm
  kitOrderId: string
  layoutId: VisualReferenceLayoutId
  referenceVisionProfile?: ReferenceVisionProfile
  referenceImageBlock?: UserBlock
}): Promise<MoodboardRankerRunResult> {
  const metadata = await readImageBankMetadata()
  const shortlist = buildVisualReferenceShortlist(metadata.assets, options.form, {
    referenceVisionProfile: options.referenceVisionProfile,
  })

  const signals = resolveImageBankKitSignals(options.form, {
    referenceVisionProfile: options.referenceVisionProfile,
  })

  const taskPrompt = buildMoodboardRankerTaskPrompt({
    layoutId: options.layoutId,
    shortlist,
    hasReferenceImage: Boolean(options.referenceImageBlock),
    inferredImagerySubjects: signals.imagerySubjects,
    photoColorRelationship: signals.photoColorRelationship,
  })

  const userBlocks: UserBlock[] = [
    ...(options.referenceImageBlock ? [options.referenceImageBlock] : []),
    { type: 'text', text: taskPrompt },
  ]

  const system = { text: buildSystemPrompt(options.form), cacheKey: 'pro-system-v1' }
  const assetById = new Map(metadata.assets.map((asset) => [asset.imageId, asset]))

  const toFallback = (): MoodboardRankerOutput => ({
    picks: assignDeterministicRankerPicks(shortlist, options.layoutId, {
      signals,
      bankAssets: metadata.assets,
    }),
  })

  const validate = (output: MoodboardRankerOutput): void => {
    const layout = getVisualReferenceLayout(options.layoutId)
    const slotIds = new Set(layout.slots.map((slot) => slot.slotId))
    const enriched = output.picks.map((pick) => {
      const asset = assetById.get(pick.imageId)
      if (!asset) throw new Error(`Unknown imageId: ${pick.imageId}`)
      const slot = layout.slots.find((s) => s.slotId === pick.slotId)
      if (!slot) throw new Error(`Unknown slotId: ${pick.slotId}`)
      if (asset.orientation !== slot.orientation) {
        throw new Error(`Orientation mismatch: ${pick.imageId} for ${pick.slotId}`)
      }
      return { ...pick, sceneType: asset.sceneType }
    })
    assertMoodboardSceneVariety(enriched)
    if (enriched.length !== layout.photoCount) {
      throw new Error(`Expected ${layout.photoCount} picks, got ${enriched.length}`)
    }
    for (const pick of enriched) {
      if (!slotIds.has(pick.slotId)) throw new Error(`slotId not in manifest: ${pick.slotId}`)
    }
  }

  return scaffoldAndRefine({
    sectionName: RANKER_SECTION,
    scaffold: '',
    maxTokens: 500,
    toFallback,
    run: async () => {
      const { data } = await callClaude({
        callClass: 'moodboard_ranker',
        system,
        userBlocks,
        schema: MoodboardRankerSchema,
        kitOrderId: options.kitOrderId,
        sectionName: RANKER_SECTION,
      })
      try {
        validate(data)
      } catch (err) {
        throw new SchemaParseError(RANKER_SECTION, JSON.stringify(data), err)
      }
      return data
    },
    onTruncationRetry: async (nextMaxTokens) => {
      const { data } = await callClaude({
        callClass: 'moodboard_ranker',
        system,
        userBlocks,
        schema: MoodboardRankerSchema,
        kitOrderId: options.kitOrderId,
        sectionName: RANKER_SECTION,
        maxTokens: nextMaxTokens,
      })
      try {
        validate(data)
      } catch (err) {
        throw new SchemaParseError(RANKER_SECTION, JSON.stringify(data), err)
      }
      return data
    },
  })
}

export { layoutIdFromShortlistLength } from '../../image-bank/visualReferencePipeline.js'
