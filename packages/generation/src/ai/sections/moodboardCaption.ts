import {
  MoodboardCaptionSchema,
  defaultPhotoColorRelationship,
  type IdentityKitForm,
  type MoodboardCaptionOutput,
} from '@identity-kit/shared'

import { callClaude } from '../client.js'
import { scaffoldAndRefine, type ScaffoldAndRefineResult } from '../dispatcher.js'
import { buildMoodboardCaptionTaskPromptForForm } from '../prompts/moodboardPrompts.js'
import { buildSystemPrompt } from '../prompts/buildSystemPrompt.js'

const SECTION_ID = 'moodboard.caption'

export type MoodboardCaptionRunResult = ScaffoldAndRefineResult<MoodboardCaptionOutput>

function emptyFallback(): MoodboardCaptionOutput {
  return { caption: '', fieldsCited: ['step6.selectedStyle'] }
}

export async function runMoodboardCaption(options: {
  form: IdentityKitForm
  kitOrderId: string
  selectedImageIds: string[]
}): Promise<MoodboardCaptionRunResult> {
  const photoColorRelationship =
    options.form.step6.photoColorRelationship ??
    defaultPhotoColorRelationship(options.form.step6.selectedStyle)

  const taskPrompt = buildMoodboardCaptionTaskPromptForForm(options.form, {
    selectedImageIds: options.selectedImageIds,
    photoColorRelationship,
  })

  const system = { text: buildSystemPrompt(options.form), cacheKey: 'pro-system-v1' }

  return scaffoldAndRefine({
    sectionName: SECTION_ID,
    scaffold: '',
    maxTokens: 280,
    toFallback: emptyFallback,
    run: async () => {
      const { data } = await callClaude({
        callClass: 'moodboard_caption',
        system,
        userBlocks: [{ type: 'text', text: taskPrompt }],
        schema: MoodboardCaptionSchema,
        kitOrderId: options.kitOrderId,
        sectionName: SECTION_ID,
      })
      return data
    },
    onTruncationRetry: async (nextMaxTokens) => {
      const { data } = await callClaude({
        callClass: 'moodboard_caption',
        system,
        userBlocks: [{ type: 'text', text: taskPrompt }],
        schema: MoodboardCaptionSchema,
        kitOrderId: options.kitOrderId,
        sectionName: SECTION_ID,
        maxTokens: nextMaxTokens,
      })
      return data
    },
  })
}
