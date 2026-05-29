import {
  BrandAuditWhatWeSawSchema,
  type BrandAuditWhatWeSaw,
  type IdentityKitForm,
} from '@identity-kit/shared'

import {
  loadProSmokeImagePayload,
  type ProSmokeImagePayload,
} from '../../fixtures/loadProSmokeFixture.js'
import { callClaude } from '../client.js'
import type { UserBlock } from '../client.js'
import { scaffoldAndRefine, type ScaffoldAndRefineResult } from '../dispatcher.js'
import { buildSystemPrompt } from '../prompts/buildSystemPrompt.js'

const SECTION_ID = 'brandAudit.whatWeSaw'

function buildTaskPrompt(): string {
  return `Per the brand context and voice contracts in your system prompt, write Brand Audit section §1 ("what we saw") for this business.

This kit's selected style is locked in your system prompt — describe what you observe in the uploaded logo and reference image in plain language. Note how those assets relate to the buyer's chosen direction without telling them to change selectedPalette or selectedStyle.

Observations only — no recommendations yet. Keep each observation under 280 characters. Return logoObservation and referenceImageObservation when the images support a claim; omit fields you cannot ground. Include fieldsCited with at least one intake field name.`
}

function emptyFallback(): BrandAuditWhatWeSaw {
  return { fieldsCited: [] }
}

export type BrandAuditWhatWeSawSmokeResult = ScaffoldAndRefineResult<BrandAuditWhatWeSaw>

function proSmokeImageUserBlocks(payload: ProSmokeImagePayload): UserBlock[] {
  return [
    {
      type: 'image',
      source: {
        type: 'base64',
        media_type: payload.logo.mediaType,
        data: payload.logo.dataBase64,
      },
    },
    {
      type: 'image',
      source: {
        type: 'base64',
        media_type: payload.reference.mediaType,
        data: payload.reference.dataBase64,
      },
    },
  ]
}

function buildUserBlocks(imageBlocks: UserBlock[]): UserBlock[] {
  return [...imageBlocks, { type: 'text', text: buildTaskPrompt() }]
}

/**
 * Pro vision smoke call — Brand Audit §1 shape, one Sonnet multimodal request.
 * Uses committed local images (base64) unless `imageBlocks` is passed explicitly.
 */
export async function runBrandAuditWhatWeSawSmoke(
  form: IdentityKitForm,
  kitOrderId: string,
  imageBlocks?: UserBlock[],
): Promise<BrandAuditWhatWeSawSmokeResult> {
  const system = { text: buildSystemPrompt(form), cacheKey: 'pro-system-v1' }
  const maxTokens = 700
  const blocks =
    imageBlocks ?? buildUserBlocks(proSmokeImageUserBlocks(loadProSmokeImagePayload()))

  return scaffoldAndRefine({
    sectionName: SECTION_ID,
    scaffold: '',
    maxTokens,
    toFallback: emptyFallback,
    run: async () => {
      const { data } = await callClaude({
        callClass: 'brand_audit',
        system,
        userBlocks: blocks,
        schema: BrandAuditWhatWeSawSchema,
        kitOrderId,
        sectionName: SECTION_ID,
        maxTokens,
      })
      return data
    },
    onTruncationRetry: async (nextMaxTokens) => {
      const { data } = await callClaude({
        callClass: 'brand_audit',
        system,
        userBlocks: blocks,
        schema: BrandAuditWhatWeSawSchema,
        kitOrderId,
        sectionName: SECTION_ID,
        maxTokens: nextMaxTokens,
      })
      return data
    },
  })
}
