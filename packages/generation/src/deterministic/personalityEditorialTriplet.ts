import type { GuideFocus, IdentityKitForm, PrimaryGoal } from '@identity-kit/shared'

import type { NarratorId } from './narratorProfiles.js'

type ToneKey = 'friendly' | 'professional' | 'bold'
type TripletSlot = 'vision' | 'mission' | 'promise'

export interface PersonalityEditorialTriplet {
  vision: string
  mission: string
  promise: string
}

export interface PersonalityTripletContext {
  summaryOneLine?: string
  summaryWhatWeDo?: string
  summaryWhoItsFor?: string
  trustCueBody?: string
  visualSystemCharacter?: string
  visualUsageDiscipline?: string
}

export interface PersonalityTripletSignals {
  guideFocus: Exclude<GuideFocus, ''>
  primaryGoal: Exclude<PrimaryGoal, ''>
  contentDensityBias: -1 | 0 | 1
}

const SLOT_INTENT_PATTERNS: Record<TripletSlot, RegExp[]> = {
  vision: [/\bfuture|next|outcome|tomorrow|long[- ]term|grow|lasting\b/i],
  mission: [/\bbuild|deliver|help|make|create|run|serve|ship|support\b/i],
  promise: [/\balways|every|reliable|clear|consistent|dependable|expect\b/i],
}

const MIN_WORDS = 7
const MAX_WORDS = 22
const CONCRETE_DISALLOWED_PATTERNS: RegExp[] = [
  /^our (vision|mission|promise) is to\s/i,
  /^to be the (best|leading|premier)\b/i,
  /change the world/i,
  /industry[- ]?leading/i,
]

const TEMPLATE_BY_NARRATOR_AND_TONE: Record<NarratorId, Record<ToneKey, PersonalityEditorialTriplet[]>> = {
  solo_expert: {
    friendly: [
      {
        vision: 'The next chapter is a business people return to because the guidance feels human and useful.',
        mission: 'We turn expertise into clear next steps clients can use right away.',
        promise: 'You can expect direct answers, thoughtful follow-through, and progress you can see.',
      },
    ],
    professional: [
      {
        vision: 'The long-term outcome is a practice known for steady results and clear direction.',
        mission: 'We translate specialist judgment into decisions clients can act on with confidence.',
        promise: 'Every engagement stays structured, responsive, and grounded in practical outcomes.',
      },
    ],
    bold: [
      {
        vision: 'The next phase is a sharper brand presence that earns trust before the pitch starts.',
        mission: 'We cut through noise and deliver focused guidance that moves work forward quickly.',
        promise: 'You can expect clear calls, honest feedback, and action from the first conversation.',
      },
    ],
  },
  solo_maker: {
    friendly: [
      {
        vision: 'The future is a maker brand people choose for care, character, and repeatable quality.',
        mission: 'We make thoughtful work that balances craft, function, and everyday usability.',
        promise: 'Every piece arrives consistent, considered, and ready for real life.',
      },
    ],
    professional: [
      {
        vision: 'The long-term outcome is a product line recognized for quality that holds up over time.',
        mission: 'We combine careful production standards with design choices that stay practical.',
        promise: 'You can expect dependable quality, transparent decisions, and consistent delivery.',
      },
    ],
    bold: [
      {
        vision: 'The next chapter is a distinct maker brand that stands out without chasing trends.',
        mission: 'We build work with strong point of view and disciplined execution.',
        promise: 'Every release stays intentional, durable, and true to the standard we set.',
      },
    ],
  },
  local_team: {
    friendly: [
      {
        vision: 'The future is a neighborhood brand people recommend because it feels familiar and reliable.',
        mission: 'We serve our local community with work that is welcoming, useful, and easy to trust.',
        promise: 'Every interaction stays clear, respectful, and consistent with what we said we would do.',
      },
    ],
    professional: [
      {
        vision: 'The long-term outcome is a local business known for reliable service and steady standards.',
        mission: 'We run operations with clarity so customers and partners know what to expect.',
        promise: 'You can expect consistent service quality, timely follow-through, and clear communication.',
      },
    ],
    bold: [
      {
        vision: 'The next phase is a local brand presence that feels confident and impossible to overlook.',
        mission: 'We move quickly, stay accountable, and deliver visible results in the community.',
        promise: 'Every customer touchpoint remains direct, dependable, and aligned with our standards.',
      },
    ],
  },
  product_led: {
    friendly: [
      {
        vision: 'The future is a product brand people keep because it solves real problems with less friction.',
        mission: 'We build practical tools that are easy to learn and helpful from day one.',
        promise: 'Every release stays understandable, stable, and focused on customer value.',
      },
    ],
    professional: [
      {
        vision: 'The long-term outcome is a product trusted for clarity, reliability, and measurable utility.',
        mission: 'We ship focused features that solve core use cases without unnecessary complexity.',
        promise: 'You can expect predictable performance, clear communication, and iterative improvement.',
      },
    ],
    bold: [
      {
        vision: 'The next chapter is a product known for decisive execution and clear user benefit.',
        mission: 'We prioritize high-impact features and ship with discipline.',
        promise: 'Every update stays clear in purpose, stable in performance, and useful in practice.',
      },
    ],
  },
  mission_community: {
    friendly: [
      {
        vision: 'The future is a mission-led brand that makes tangible progress people can point to.',
        mission: 'We organize people, resources, and communication around outcomes the community values.',
        promise: 'Every effort stays transparent, respectful, and accountable to the people we serve.',
      },
    ],
    professional: [
      {
        vision: 'The long-term outcome is a trusted mission organization with clear evidence of impact.',
        mission: 'We direct programs and partnerships toward outcomes that can be measured and communicated.',
        promise: 'You can expect consistent stewardship, clear reporting, and dependable follow-through.',
      },
    ],
    bold: [
      {
        vision: 'The next phase is a mission brand recognized for visible outcomes and decisive action.',
        mission: 'We mobilize support quickly and focus it on the work that changes daily reality.',
        promise: 'Every initiative remains focused, transparent, and accountable for real results.',
      },
    ],
  },
}

function toToneKey(value: IdentityKitForm['step3']['tonePreset']): ToneKey {
  if (value === 'friendly' || value === 'professional' || value === 'bold') return value
  return 'professional'
}

function sentence(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''
  return /[.!?]\s*$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function normalizeForOverlap(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  )
}

function overlapScore(a: string, b: string): number {
  const left = normalizeForOverlap(a)
  const right = normalizeForOverlap(b)
  if (left.size === 0 || right.size === 0) return 0
  let intersection = 0
  for (const token of left) if (right.has(token)) intersection += 1
  return intersection / Math.min(left.size, right.size)
}

function hasIntent(slot: TripletSlot, line: string): boolean {
  return SLOT_INTENT_PATTERNS[slot].some((re) => re.test(line))
}

function isConcrete(raw: string | undefined): string | undefined {
  const cleaned = sentence(raw ?? '')
  if (!cleaned) return undefined
  const words = wordCount(cleaned)
  if (words < MIN_WORDS || words > MAX_WORDS) return undefined
  for (const re of CONCRETE_DISALLOWED_PATTERNS) {
    if (re.test(cleaned)) return undefined
  }
  return cleaned
}

function stableIndex(seed: string, count: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return count > 0 ? hash % count : 0
}

function enforceGlobalEmDashBudget(triplet: PersonalityEditorialTriplet): PersonalityEditorialTriplet {
  const slots: TripletSlot[] = ['vision', 'mission', 'promise']
  let remaining = 1
  const out: PersonalityEditorialTriplet = { ...triplet }
  for (const slot of slots) {
    const parts = out[slot].split('—')
    if (parts.length <= 1) continue
    if (remaining > 0) {
      out[slot] = `${parts[0].trim()} — ${parts.slice(1).join(' ').trim()}`
      remaining = 0
      continue
    }
    out[slot] = parts.map((p) => p.trim()).filter(Boolean).join(', ')
    out[slot] = sentence(out[slot])
  }
  return out
}

function violatesDuplication(line: string, protectedPool: string[]): boolean {
  for (const peer of protectedPool) {
    if (!peer?.trim()) continue
    if (overlapScore(line, peer) >= 0.82) return true
  }
  return false
}

function fromIntake(
  form: IdentityKitForm,
  slot: TripletSlot,
): string | undefined {
  const mission = isConcrete(form.step4.missionStatement)
  const motivation = isConcrete(form.step5.motivation)
  const origin = isConcrete(form.step5.originSummary)
  const ordered =
    slot === 'vision'
      ? [mission, motivation, origin]
      : slot === 'mission'
        ? [mission, origin, motivation]
        : [motivation, mission, origin]
  return ordered.find((line) => line && hasIntent(slot, line))
}

function fromTemplates(
  form: IdentityKitForm,
  signals: PersonalityTripletSignals,
  slot: TripletSlot,
): string {
  const narrator = (form.step1.brandNarrator || 'solo_expert') as NarratorId
  const tone = toToneKey(form.step3.tonePreset)
  const bundles = TEMPLATE_BY_NARRATOR_AND_TONE[narrator]?.[tone]
    ?? TEMPLATE_BY_NARRATOR_AND_TONE.solo_expert.professional
  const idx = stableIndex(
    `${narrator}|${tone}|${signals.guideFocus}|${signals.primaryGoal}|${slot}`,
    bundles.length,
  )
  return sentence(bundles[idx]?.[slot] ?? TEMPLATE_BY_NARRATOR_AND_TONE.solo_expert.professional[0][slot])
}

export function composePersonalityEditorialTriplet(
  form: IdentityKitForm,
  signals: PersonalityTripletSignals,
  context: PersonalityTripletContext,
): PersonalityEditorialTriplet | undefined {
  if (signals.contentDensityBias === -1) return undefined

  const templateOnlyTriplet = enforceGlobalEmDashBudget({
    vision: fromTemplates(form, signals, 'vision'),
    mission: fromTemplates(form, signals, 'mission'),
    promise: fromTemplates(form, signals, 'promise'),
  })

  const protectedPool = [
    context.summaryOneLine ?? '',
    context.summaryWhatWeDo ?? '',
    context.summaryWhoItsFor ?? '',
    context.trustCueBody ?? '',
    context.visualSystemCharacter ?? '',
    context.visualUsageDiscipline ?? '',
  ].filter(Boolean)

  const visionSeed = fromIntake(form, 'vision') ?? fromTemplates(form, signals, 'vision')
  const missionSeed = fromIntake(form, 'mission') ?? fromTemplates(form, signals, 'mission')
  const promiseSeed = fromIntake(form, 'promise') ?? fromTemplates(form, signals, 'promise')

  const seeds: PersonalityEditorialTriplet = {
    vision: sentence(visionSeed),
    mission: sentence(missionSeed),
    promise: sentence(promiseSeed),
  }

  const normalized = enforceGlobalEmDashBudget(seeds)
  for (const slot of ['vision', 'mission', 'promise'] as const) {
    const line = normalized[slot]
    if (!hasIntent(slot, line)) return templateOnlyTriplet
    if (wordCount(line) < MIN_WORDS || wordCount(line) > MAX_WORDS) return templateOnlyTriplet
  }

  if (violatesDuplication(normalized.vision, protectedPool)) return templateOnlyTriplet
  if (violatesDuplication(normalized.mission, [...protectedPool, normalized.vision])) return templateOnlyTriplet
  if (violatesDuplication(normalized.promise, [...protectedPool, normalized.vision, normalized.mission])) return templateOnlyTriplet

  return normalized
}
