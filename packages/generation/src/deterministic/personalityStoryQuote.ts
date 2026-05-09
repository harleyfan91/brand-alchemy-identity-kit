import type { IdentityKitForm } from '@identity-kit/shared'

/** Align with `INDUSTRIES_DENSITY_TRIM` in brandIdentityGuideModel — restrained story tone. */
const STORY_QUOTE_FORMAL_INDUSTRIES = new Set([
  'legal_professional_services',
  'finance',
  'health_wellness',
])

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

function stripTrailingPunctuation(text: string): string {
  return text.trim().replace(/[.!?]\s*$/, '')
}

function lowerSentenceStart(text: string): string {
  const t = text.trim()
  if (!t) return t
  if (/^I\b/.test(t)) return t
  if (/^[A-Z][a-z]/.test(t)) return t.charAt(0).toLowerCase() + t.slice(1)
  return t
}

function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

function containsName(text: string, businessName: string): boolean {
  const normText = normalizeWhitespace(text).toLowerCase()
  const normName = normalizeWhitespace(businessName).toLowerCase()
  return normName.length > 0 && normText.includes(normName)
}

function withBrandAnchor(summary: string, businessName: string): string {
  const s = stripTrailingPunctuation(summary)
  if (!s) return ''
  if (containsName(s, businessName)) return s
  if (/^(started|left|launched|built|began|grew|turned|pivoted|shifted)\b/i.test(s)) {
    return `${businessName} ${lowerSentenceStart(s)}`
  }
  return `At ${businessName}, ${lowerSentenceStart(s)}`
}

function isObservationOnly(text: string): boolean {
  const t = text.toLowerCase()
  if (!t) return false
  const observationMarkers = /\b(saw|noticed|watched|kept seeing|realized|found that|observed)\b/
  const consequenceMarkers =
    /\b(so|therefore|which led|that led|to help|to make|to build|to create|to give|to bring|we (built|created|decided|committed)|i (built|created|decided|committed))\b/
  return observationMarkers.test(t) && !consequenceMarkers.test(t)
}

function hasConsequence(text: string): boolean {
  const t = text.toLowerCase()
  if (!t) return false
  return /\b(so|therefore|which led|that led|to help|to make|to build|to create|to give|to bring|to keep|to focus|to support|built|created|committed|exists to)\b/.test(
    t,
  )
}

function defaultCommitmentSubject(form: IdentityKitForm): 'I' | 'we' {
  const n = form.step1.brandNarrator || 'solo_expert'
  if (n === 'local_team' || n === 'product_led' || n === 'mission_community') return 'we'
  return 'I'
}

function missionCommitmentClause(mission: string, subject: 'I' | 'we'): string | undefined {
  const m = stripTrailingPunctuation(mission)
  if (!m) return undefined
  const normalized = lowerSentenceStart(m)
  if (/^(we|i)\b/i.test(normalized)) return normalized
  return `${subject} ${normalized}`
}

/**
 * Casual causal framing (“after seeing… so …”) fits friendly/bold brands.
 * Professional + high formality, or compliance-heavy industries: skip that template
 * (return undefined on observation→mission glue so folio falls back to oneLine).
 */
function prefersCasualCausalStory(form: IdentityKitForm): boolean {
  if (STORY_QUOTE_FORMAL_INDUSTRIES.has(form.step1.industry)) return false
  if (form.step3.tonePreset === 'professional' && form.step3.voiceSliders.formality >= 72) return false
  return true
}

/** Ensure first character is uppercase after `; ` (e.g. `we help` → `We help`). */
function capitalizeSentenceLead(text: string): string {
  const t = text.trim()
  if (!t) return t
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function observationToAfterClause(text: string): string | undefined {
  const t = stripTrailingPunctuation(text)
  if (!t) return undefined
  const rewrites: Array<[RegExp, string]> = [
    [/^saw\s+/i, 'seeing '],
    [/^noticed\s+/i, 'noticing '],
    [/^watched\s+/i, 'watching '],
    [/^kept seeing\s+/i, 'seeing '],
    [/^realized\s+/i, 'realizing '],
    [/^found that\s+/i, 'seeing that '],
    [/^observed\s+/i, 'observing '],
  ]
  for (const [pattern, prefix] of rewrites) {
    if (pattern.test(t)) return t.replace(pattern, prefix)
  }
  return undefined
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
  const businessName = form.step1.businessName.trim()
  if (!businessName) return undefined
  const summary = form.step5.originSummary?.trim() ?? ''
  const motivation = form.step5.motivation?.trim() ?? ''
  const mission = form.step4.missionStatement?.trim() ?? ''
  const commitmentSubject = defaultCommitmentSubject(form)
  const missionCommitment = missionCommitmentClause(mission, commitmentSubject)
  const allowCasualCausal = prefersCasualCausalStory(form)

  if (!summary && !motivation) return undefined

  if (summary && motivation) {
    if (normalizeForDedupe(summary) === normalizeForDedupe(motivation)) {
      const ws = wordCount(summary)
      if (ws < MIN_SINGLE_FIELD_WORDS) return undefined
      const anchored = withBrandAnchor(summary, businessName)
      if (!hasConsequence(anchored)) return undefined
      return ensureSentencePunctuation(anchored)
    }
    if (wordCount(summary) + wordCount(motivation) < MIN_COMBINED_WORDS) return undefined
    const anchoredSummary = withBrandAnchor(summary, businessName)
    if (isObservationOnly(motivation)) {
      if (!allowCasualCausal) return undefined
      const afterClause = observationToAfterClause(motivation)
      if (!afterClause || !missionCommitment) return undefined
      return ensureSentencePunctuation(
        `${stripTrailingPunctuation(anchoredSummary)} after ${afterClause}; ${capitalizeSentenceLead(missionCommitment)}`,
      )
    }
    const joined = ensureSentencePunctuation(
      `${stripTrailingPunctuation(anchoredSummary)}, and ${continueClause(stripTrailingPunctuation(motivation))}`,
    )
    return hasConsequence(joined) ? joined : undefined
  }

  const single = summary || motivation
  if (wordCount(single) < MIN_SINGLE_FIELD_WORDS) return undefined
  const anchoredSingle = withBrandAnchor(single, businessName)
  if (isObservationOnly(single)) {
    if (!allowCasualCausal) return undefined
    const afterClause = observationToAfterClause(single)
    if (!afterClause || !missionCommitment) return undefined
    return ensureSentencePunctuation(
      `At ${businessName}, ${afterClause}; ${capitalizeSentenceLead(missionCommitment)}`,
    )
  }
  if (!hasConsequence(anchoredSingle)) return undefined
  return ensureSentencePunctuation(anchoredSingle)
}
