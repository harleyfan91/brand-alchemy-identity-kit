/**
 * Controlled vocabulary for the Step 6 Pro `moodAdjectives` multi-select.
 *
 * Source of truth: `OUTPUT_TRANSLATION_SPEC.md` §5.8.3. The same 16 values
 * appear as image-bank secondary tag values so tag-match scoring is symmetric.
 */

export const MOOD_ADJECTIVE_IDS = [
  'warm',
  'cool',
  'refined',
  'raw',
  'calm',
  'energetic',
  'playful',
  'austere',
  'organic',
  'geometric',
  'vintage',
  'futuristic',
  'premium',
  'accessible',
  'soft',
  'sharp',
] as const

export type MoodAdjective = (typeof MOOD_ADJECTIVE_IDS)[number]

export interface MoodAdjectiveOption {
  id: MoodAdjective
  label: string
}

export const MOOD_ADJECTIVE_OPTIONS: readonly MoodAdjectiveOption[] = [
  { id: 'warm', label: 'Warm' },
  { id: 'cool', label: 'Cool' },
  { id: 'refined', label: 'Refined' },
  { id: 'raw', label: 'Raw' },
  { id: 'calm', label: 'Calm' },
  { id: 'energetic', label: 'Energetic' },
  { id: 'playful', label: 'Playful' },
  { id: 'austere', label: 'Austere' },
  { id: 'organic', label: 'Organic' },
  { id: 'geometric', label: 'Geometric' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'futuristic', label: 'Futuristic' },
  { id: 'premium', label: 'Premium' },
  { id: 'accessible', label: 'Accessible' },
  { id: 'soft', label: 'Soft' },
  { id: 'sharp', label: 'Sharp' },
] as const

/** Max mood chips a buyer may select on Step 6 Pro (`PRO_KIT_STRATEGY.md` §6.5). */
export const MOOD_ADJECTIVE_MAX_SELECT = 5

const MOOD_ADJECTIVE_SET: ReadonlySet<string> = new Set(MOOD_ADJECTIVE_IDS)

export function isMoodAdjective(value: string): value is MoodAdjective {
  return MOOD_ADJECTIVE_SET.has(value)
}
