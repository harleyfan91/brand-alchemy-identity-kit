import {
  EmptyResponseError,
  SafetyRefusalError,
  SchemaParseError,
  TruncationError,
} from './errors.js'

export type ScaffoldSource = 'ai' | 'scaffold'

export type ScaffoldAndRefineResult<T> = {
  data: T
  source: ScaffoldSource
}

/**
 * Scaffold-and-refine dispatcher (Pro-A v1).
 * Retries truncation once; ships deterministic fallback on hard failures.
 * @see docs/research/AI_INTEGRATION_PLAYBOOK.md §7.4
 */
export async function scaffoldAndRefine<T>(opts: {
  sectionName: string
  scaffold: string
  run: () => Promise<T>
  toFallback: (scaffold: string) => T
  maxTokens?: number
  onTruncationRetry?: (nextMaxTokens: number) => Promise<T>
}): Promise<ScaffoldAndRefineResult<T>> {
  const attempt = async (): Promise<T> => opts.run()

  try {
    const data = await attempt()
    return { data, source: 'ai' }
  } catch (err) {
    if (err instanceof TruncationError && opts.maxTokens != null && opts.onTruncationRetry) {
      try {
        const data = await opts.onTruncationRetry(Math.ceil(opts.maxTokens * 1.5))
        return { data, source: 'ai' }
      } catch {
        return { data: opts.toFallback(opts.scaffold), source: 'scaffold' }
      }
    }

    if (err instanceof EmptyResponseError) {
      try {
        const data = await attempt()
        return { data, source: 'ai' }
      } catch {
        return { data: opts.toFallback(opts.scaffold), source: 'scaffold' }
      }
    }

    if (err instanceof SchemaParseError) {
      // Repair pass deferred to Pro-A follow-up; ship scaffold for v1 slice.
      return { data: opts.toFallback(opts.scaffold), source: 'scaffold' }
    }

    if (err instanceof SafetyRefusalError) {
      return { data: opts.toFallback(opts.scaffold), source: 'scaffold' }
    }

    throw err
  }
}
