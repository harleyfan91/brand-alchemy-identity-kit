import { describe, expect, it } from 'vitest'

import { hasAnthropicApiKey, resolveAnthropicApiKey } from './resolveAnthropicApiKey.js'

describe('resolveAnthropicApiKey', () => {
  it('prefers ANTHROPIC_API_KEY over ANTHROPIC_API_KEY_2', () => {
    const key = resolveAnthropicApiKey({
      ANTHROPIC_API_KEY: ' primary ',
      ANTHROPIC_API_KEY_2: 'secondary',
    })
    expect(key).toBe('primary')
  })

  it('falls back to ANTHROPIC_API_KEY_2', () => {
    const key = resolveAnthropicApiKey({
      ANTHROPIC_API_KEY: '',
      ANTHROPIC_API_KEY_2: ' sk-ant-fallback ',
    })
    expect(key).toBe('sk-ant-fallback')
  })

  it('returns undefined when neither is set', () => {
    expect(resolveAnthropicApiKey({})).toBeUndefined()
    expect(hasAnthropicApiKey({})).toBe(false)
  })
})
