import Anthropic from '@anthropic-ai/sdk'

import {
  AnthropicAuthError,
  AnthropicOverloadedError,
  AnthropicRateLimitError,
} from './errors.js'

export function mapAnthropicError(err: unknown): Error {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 401 || err.status === 403) {
      return new AnthropicAuthError(err.message)
    }
    if (err.status === 429) {
      return new AnthropicRateLimitError(err.message)
    }
    if (err.status === 529) {
      return new AnthropicOverloadedError(err.message)
    }
    return err
  }
  return err instanceof Error ? err : new Error(String(err))
}
