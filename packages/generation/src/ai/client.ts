import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod.js'
import type { z } from 'zod'

import {
  EmptyResponseError,
  AnthropicConfigError,
  SafetyRefusalError,
  SchemaParseError,
  TruncationError,
} from './errors.js'
import { logAiCall } from './log.js'
import { mapAnthropicError } from './mapAnthropicError.js'
import { resolveModelId, type SectionModel } from './models.js'
import { resolveAnthropicApiKey } from './resolveAnthropicApiKey.js'

export type CallClass =
  | 'section_rewrite'
  | 'strategy_memo_analytical'
  | 'strategy_memo_creative'
  | 'csp_creative'
  | 'voice_page3'
  | 'brand_audit'
  | 'moodboard_caption'
  | 'moodboard_ranker'
  | 'moodboard_reference_vision'

export type CacheableSystemBlock = {
  text: string
  cacheKey?: string
}

export type UserBlock =
  | { type: 'text'; text: string }
  | {
      type: 'image'
      source:
        | { type: 'url'; url: string }
        | {
            type: 'base64'
            media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
            data: string
          }
    }

type CallClassDefaults = {
  model: SectionModel
  maxTokens: number
  temperature: number
}

export const CALL_CLASS_DEFAULTS: Record<CallClass, CallClassDefaults> = {
  section_rewrite: { model: 'claude-sonnet-4-5', maxTokens: 600, temperature: 0.3 },
  strategy_memo_analytical: { model: 'claude-opus-4-5', maxTokens: 500, temperature: 0.3 },
  strategy_memo_creative: { model: 'claude-opus-4-5', maxTokens: 400, temperature: 0.5 },
  csp_creative: { model: 'claude-sonnet-4-5', maxTokens: 700, temperature: 0.7 },
  voice_page3: { model: 'claude-sonnet-4-5', maxTokens: 800, temperature: 0.5 },
  brand_audit: { model: 'claude-sonnet-4-5', maxTokens: 700, temperature: 0.3 },
  moodboard_caption: { model: 'claude-haiku-4-5', maxTokens: 250, temperature: 0.6 },
  moodboard_ranker: { model: 'claude-haiku-4-5', maxTokens: 400, temperature: 0.2 },
  moodboard_reference_vision: { model: 'claude-haiku-4-5', maxTokens: 350, temperature: 0.2 },
}

export interface CallClaudeOpts<T> {
  callClass: CallClass
  system: CacheableSystemBlock
  userBlocks: UserBlock[]
  schema: z.ZodType<T>
  model?: SectionModel
  maxTokens?: number
  temperature?: number
  kitOrderId: string
  sectionName: string
}

export interface CallClaudeResult<T> {
  data: T
  meta: {
    model: string
    inputTokens: number
    cachedInputTokens: number
    outputTokens: number
    stopReason: string
    elapsedMs: number
  }
}

let clientSingleton: Anthropic | null = null

function getClient(): Anthropic {
  const apiKey = resolveAnthropicApiKey()
  if (!apiKey) {
    throw new AnthropicConfigError(
      'Anthropic API key not set. Add ANTHROPIC_API_KEY (or ANTHROPIC_API_KEY_2) to repo-root .env.',
    )
  }
  if (!clientSingleton) {
    clientSingleton = new Anthropic({
      apiKey,
      maxRetries: 3,
      timeout: 60_000,
    })
  }
  return clientSingleton
}

function toAnthropicUserBlock(block: UserBlock): Anthropic.Messages.ContentBlockParam {
  if (block.type === 'text') {
    return { type: 'text', text: block.text }
  }
  if (block.source.type === 'url') {
    return { type: 'image', source: { type: 'url', url: block.source.url } }
  }
  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: block.source.media_type,
      data: block.source.data,
    },
  }
}

export async function callClaude<T>(opts: CallClaudeOpts<T>): Promise<CallClaudeResult<T>> {
  const config = CALL_CLASS_DEFAULTS[opts.callClass]
  const logicalModel = opts.model ?? config.model
  const model = resolveModelId(logicalModel)
  const maxTokens = opts.maxTokens ?? config.maxTokens
  const temperature = opts.temperature ?? config.temperature

  const start = Date.now()
  logAiCall({
    kitOrderId: opts.kitOrderId,
    sectionName: opts.sectionName,
    event: 'start',
    model,
    temperature,
  })

  let response: Anthropic.Messages.Message
  try {
    response = await getClient().messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: [
        {
          type: 'text',
          text: opts.system.text,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: opts.userBlocks.map(toAnthropicUserBlock),
        },
      ],
      output_config: {
        format: zodOutputFormat(opts.schema),
      },
    })
  } catch (err) {
    logAiCall({
      kitOrderId: opts.kitOrderId,
      sectionName: opts.sectionName,
      event: 'error',
      model,
      error: err instanceof Error ? err.message : String(err),
    })
    throw mapAnthropicError(err)
  }

  if (response.stop_reason === 'refusal') {
    throw new SafetyRefusalError(opts.sectionName)
  }
  if (response.stop_reason === 'max_tokens') {
    throw new TruncationError(opts.sectionName, maxTokens)
  }

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new EmptyResponseError(opts.sectionName)
  }

  let parsed: T
  try {
    const json = JSON.parse(textBlock.text) as unknown
    parsed = opts.schema.parse(json)
  } catch (err) {
    throw new SchemaParseError(opts.sectionName, textBlock.text, err)
  }

  const meta = {
    model,
    inputTokens: response.usage.input_tokens,
    cachedInputTokens: response.usage.cache_read_input_tokens ?? 0,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason ?? 'unknown',
    elapsedMs: Date.now() - start,
  }

  logAiCall({
    kitOrderId: opts.kitOrderId,
    sectionName: opts.sectionName,
    event: 'success',
    model,
    inputTokens: meta.inputTokens,
    cachedInputTokens: meta.cachedInputTokens,
    outputTokens: meta.outputTokens,
    elapsedMs: meta.elapsedMs,
  })

  return { data: parsed, meta }
}

/** Test-only: reset SDK client after env changes. */
export function resetAnthropicClientForTests(): void {
  clientSingleton = null
}
