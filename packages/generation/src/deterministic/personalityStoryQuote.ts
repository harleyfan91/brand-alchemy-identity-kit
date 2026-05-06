import type { IdentityKitForm } from '@identity-kit/shared'

/** Minimum total words when both originSummary and motivation are present. */
const MIN_COMBINED_WORDS = 10

/** Minimum words when only one of those fields is present. */
const MIN_SINGLE_FIELD_WORDS = 8

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function normalizeForDedupe(text: string): string {
  return text
    .trim()
    .replace(/\.\s*$/, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function ensureSentencePunctuation(text: string): string {
  const t = text.trim()
  if (!t) return t
  if (/[.!?]['"]?\s*$/.test(t)) return t
  return `${t}.`
}

/**
 * Lowercase the first character when gluing with ", and …" so two intake
 * sentences read as one clause. Skips `I…` / `I'm…` so first-person lines
 * stay grammatical.
 */
function continueClause(motivation: string): string {
  const m = motivation.trim()
  if (!m) return m
  if (/^I\b/i.test(m)) return m
  if (/^[A-Z][a-z]/.test(m)) return m.charAt(0).toLowerCase() + m.slice(1)
  return m
}

/**
 * One paragraph for the folio 03 gradient pull quote, built only from
 * `step5.originSummary` and `step5.motivation` when the intake is substantive.
 * Does not reuse Brand Brief template sentences (`ORIGIN_TRUST_SIGNAL`, etc.).
 */
export function composePersonalityStoryQuote(form: IdentityKitForm): string | undefined {
  const summary = form.step5.originSummary?.trim() ?? ''
  const motivation = form.step5.motivation?.trim() ?? ''

  if (!summary && !motivation) return undefined

  if (summary && motivation) {
    if (normalizeForDedupe(summary) === normalizeForDedupe(motivation)) {
      const ws = wordCount(summary)
      if (ws < MIN_SINGLE_FIELD_WORDS) return undefined
      return ensureSentencePunctuation(summary)
    }
    if (wordCount(summary) + wordCount(motivation) < MIN_COMBINED_WORDS) return undefined
    const a = summary.replace(/\.\s*$/, '')
    const b = continueClause(motivation.replace(/\.\s*$/, ''))
    return ensureSentencePunctuation(`${a}, and ${b}`)
  }

  const single = summary || motivation
  if (wordCount(single) < MIN_SINGLE_FIELD_WORDS) return undefined
  return ensureSentencePunctuation(single)
}
