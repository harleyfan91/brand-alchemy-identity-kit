import type { IdentityKitForm } from '@identity-kit/shared'

import type { NarratorId } from './narratorProfiles.js'

const MIN_WORDS_FOR_CONCRETE_LINE = 6

/**
 * Reject mission / motivation text that is too short or that is a
 * marketer-speak cliche rather than a concrete stands-for line.
 */
const UNCONCRETE_PATTERNS: RegExp[] = [
  /^our mission is to\s/i,
  /^to be the (best|leading|premier)/i,
  /change the world/i,
  /world[- ]?class/i,
  /industry[- ]?leading/i,
]

function isConcreteCandidate(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim()
  if (!trimmed) return undefined
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length < MIN_WORDS_FOR_CONCRETE_LINE) return undefined
  if (words.length > 32) return undefined
  for (const re of UNCONCRETE_PATTERNS) {
    if (re.test(trimmed)) return undefined
  }
  const withTrailingPeriod = /[.!?]\s*$/.test(trimmed) ? trimmed : `${trimmed}.`
  return withTrailingPeriod
}

/**
 * Narrator-keyed fallback for the folio 03 "What it stands for" slot when
 * no qualifying mission or motivation text is present on intake. One sentence
 * per narrator; concrete descriptive language; zero em-dashes per sentence to
 * respect the project-wide writing rules (§1.0.1).
 */
export const STANDS_FOR_BY_NARRATOR: Record<NarratorId, string> = {
  solo_expert:
    'This is a one-person expertise brand. It stands for clear thinking, specific help, and work you can recognize by name.',
  solo_maker:
    'This is a maker brand. It stands for care in the work, honest materials, and finished pieces you feel good handing over.',
  local_team:
    'This is a local brand. It stands for being present in the community and keeping the promise you made the last time someone walked in.',
  product_led:
    'This is a product brand. It stands for building something that earns its keep on its own terms, not on marketing claims.',
  mission_community:
    'This is a mission-led brand. It stands for the outcome it exists to create and the community it exists to serve, named and accountable.',
}

/**
 * Compose the folio 03 "What it stands for" line.
 *
 * Priority (v1):
 *   1. `step4.missionStatement` when concrete.
 *   2. `step5.motivation` when concrete.
 *   3. `STANDS_FOR_BY_NARRATOR[narrator]` (five entries, one per narrator id).
 *
 * Returns a single sentence (always ends with sentence punctuation) or
 * `undefined` when the narrator id is missing.
 */
export function composePersonalityStandsFor(form: IdentityKitForm): string | undefined {
  const mission = isConcreteCandidate(form.step4.missionStatement)
  if (mission) return mission
  const motivation = isConcreteCandidate(form.step5.motivation)
  if (motivation) return motivation
  const narrator = form.step1.brandNarrator
  if (!narrator) return STANDS_FOR_BY_NARRATOR.solo_expert
  return STANDS_FOR_BY_NARRATOR[narrator as NarratorId] ?? STANDS_FOR_BY_NARRATOR.solo_expert
}
