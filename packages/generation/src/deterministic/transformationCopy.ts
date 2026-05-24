import {
  resolveTransformationSelections,
  type IdentityKitForm,
} from '@identity-kit/shared'

import type { NarratorId } from './narratorProfiles.js'

export type TransformationParts = {
  before: string
  after: string
  mechanism: string
}

function capitalize(s: string): string {
  const t = s.trim()
  if (!t) return s
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function inlinePhrase(value: string): string {
  const t = value.trim()
  if (!t) return ''
  if (/^[A-Z][a-z]/.test(t)) return t.charAt(0).toLowerCase() + t.slice(1)
  return t
}

function softenBeforeState(value: string): string {
  return value.replace(/^stuck in /i, '').replace(/^settling for /i, '')
}

/**
 * Inserts "that" before subject-led relative clauses (e.g. "a hub neighbors know…").
 */
export function ensureRelativeClause(after: string): string {
  const t = after.trim()
  if (!t || /\b(that|which|who)\b/i.test(t)) return t
  return t.replace(
    /^((?:a|an|the)\s+.+?)\s+(neighbors|people|customers|clients|families|donors|volunteers|partners|members|communities|teams|audiences|buyers|shoppers)\s+/i,
    '$1 that $2 ',
  )
}

/** Org/work outcomes vs customer journey language in before/after phrases. */
export function isOrgTransformationLanguage(before: string, after: string): boolean {
  const hay = `${before} ${after}`.toLowerCase()
  if (
    /\b(stuck in|settling for|overwhelmed|confused by|wasting money|can't afford|cannot afford|don't know how)\b/.test(
      hay,
    )
  ) {
    return false
  }
  return /\b(volunteers?|scattered volunteer|scattered effort|hub|nonprofit|municipal|distributions?|reporting|initiative|operations|program|organization|organizational|partners?|mission|community|recognition)\b/.test(
    hay,
  )
}

export type TransformationFrame = 'product' | 'org' | 'person'

export function resolveTransformationFrame(narratorId: NarratorId, parts: TransformationParts): TransformationFrame {
  if (narratorId === 'solo_maker' || narratorId === 'local_team' || narratorId === 'product_led') return 'product'
  if (narratorId === 'mission_community') return 'org'
  if (isOrgTransformationLanguage(parts.before, parts.after)) return 'org'
  return 'person'
}

export function parseTransformationParts(form: IdentityKitForm): TransformationParts {
  const { beforeLabel, afterLabel, mechanismLabel } = resolveTransformationSelections(
    form.step1.transformation,
    form.step1.industry,
  )
  return {
    before: softenBeforeState(inlinePhrase(beforeLabel)),
    after: ensureRelativeClause(inlinePhrase(afterLabel)),
    mechanism: inlinePhrase(mechanismLabel),
  }
}

/** Avoid "…support through reporting" garden paths when mechanism is a separate operational idea. */
export function shouldSplitMechanism(after: string, mechanism: string): boolean {
  if (!mechanism.trim()) return false
  if (mechanism.trim().length > 45) return true
  if (/\bthat\b/i.test(after) && after.trim().length > 24) return true
  if (/\b(support|know how to|trust|see the impact|reach)\b/i.test(after)) return true
  return false
}

function mechanismFollowSentence(mechanism: string): string {
  const m = mechanism.trim()
  if (!m) return ''
  if (/^(by |through |with |via )/i.test(m)) return `${capitalize(m)}.`
  return `${capitalize(m)} makes that possible.`
}

function joinSentences(parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join(' ')
}

function productTransformationLine(parts: TransformationParts): string {
  const { before, after, mechanism } = parts
  if (mechanism && before && after) return `${capitalize(mechanism)} turns ${before} into ${after}.`
  if (mechanism && after) return `${capitalize(mechanism)} helps people get to ${after}.`
  if (before && after) return `It turns ${before} into ${after}.`
  if (after && mechanism) return `It helps people get to ${after} through ${mechanism}.`
  if (after) return `It helps people get to ${after}.`
  if (mechanism) return `${capitalize(mechanism)} is how the experience stands out.`
  if (before && mechanism) return `It moves past ${before} through ${mechanism}.`
  if (before) return `It starts from ${before}.`
  return ''
}

function orgTransformationLine(parts: TransformationParts): string {
  const { before, after, mechanism } = parts
  const split = Boolean(mechanism && after && shouldSplitMechanism(after, mechanism))

  if (before && after && mechanism) {
    if (split) {
      return joinSentences([`The work moves from ${before} to ${after}.`, mechanismFollowSentence(mechanism)])
    }
    return `The work moves from ${before} to ${after} through ${mechanism}.`
  }
  if (before && after) return `The work moves from ${before} to ${after}.`
  if (after && mechanism) {
    if (split) {
      return joinSentences([`It builds toward ${after}.`, mechanismFollowSentence(mechanism)])
    }
    return `It builds toward ${after} through ${mechanism}.`
  }
  if (after) return `It works toward ${after}.`
  if (mechanism) return `${capitalize(mechanism)} is how the work gets there.`
  if (before && mechanism) return `It moves past ${before} through ${mechanism}.`
  if (before) return `The work starts from ${before}.`
  return ''
}

function personTransformationLine(parts: TransformationParts): string {
  const { before, after, mechanism } = parts
  const split = Boolean(mechanism && after && shouldSplitMechanism(after, mechanism))

  if (before && after && mechanism) {
    if (split) {
      return joinSentences([`It helps people move from ${before} to ${after}.`, mechanismFollowSentence(mechanism)])
    }
    return `It helps people move from ${before} to ${after} through ${mechanism}.`
  }
  if (before && after) return `It helps people move from ${before} to ${after}.`
  if (after && mechanism) {
    if (split) {
      return joinSentences([`It helps people reach ${after}.`, mechanismFollowSentence(mechanism)])
    }
    return `It helps people reach ${after} through ${mechanism}.`
  }
  if (after) return `It helps people reach ${after}.`
  if (mechanism) return `${capitalize(mechanism)} shapes how the experience feels.`
  if (before && mechanism) return `It helps people move past ${before} through ${mechanism}.`
  if (before) return `It meets people where they are: ${before}.`
  return ''
}

/** Customer-facing transformation line for anchors, briefs, and guide one-liners. */
export function customerFacingTransformationLine(form: IdentityKitForm): string {
  const parts = parseTransformationParts(form)
  const narratorId: NarratorId = form.step1.brandNarrator || 'solo_expert'
  const frame = resolveTransformationFrame(narratorId, parts)
  if (frame === 'product') return productTransformationLine(parts)
  if (frame === 'org') return orgTransformationLine(parts)
  return personTransformationLine(parts)
}
