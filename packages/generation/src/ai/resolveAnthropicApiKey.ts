/** Env var names we accept for the Anthropic API key (first non-empty wins). */
export const ANTHROPIC_API_KEY_ENV_NAMES = [
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_API_KEY_2',
] as const

/**
 * Resolve Anthropic API key from environment.
 *
 * The label in the Anthropic Console dashboard is cosmetic — the `.env` variable
 * name must match one of {@link ANTHROPIC_API_KEY_ENV_NAMES}.
 */
export function resolveAnthropicApiKey(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  for (const name of ANTHROPIC_API_KEY_ENV_NAMES) {
    const value = env[name]?.trim()
    if (value) return value
  }
  return undefined
}

export function hasAnthropicApiKey(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(resolveAnthropicApiKey(env))
}
