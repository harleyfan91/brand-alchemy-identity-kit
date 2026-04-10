export type Step1SentenceLayout = 'inline' | 'stacked'
export type Step1WheelDensity = 'compact' | 'comfortable'
export type Step1HelperMode = 'sticky' | 'inline'
export type Step1WheelTypeface = 'serif' | 'sans'

/** `all` = every slot visible; `progressive` = one slot at a time + living sentence strip. */
export type Step1SentenceMode = 'all' | 'progressive'

export interface Step1UxVariant {
  sentenceLayout: Step1SentenceLayout
  wheelDensity: Step1WheelDensity
  helperMode: Step1HelperMode
  wheelTypeface: Step1WheelTypeface
  sentenceMode: Step1SentenceMode
}

export const DEFAULT_STEP1_UX_VARIANT: Step1UxVariant = {
  sentenceLayout: 'inline',
  wheelDensity: 'compact',
  helperMode: 'sticky',
  wheelTypeface: 'serif',
  sentenceMode: 'progressive',
}

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  if (!value) return fallback
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

/**
 * URL toggles for quick variant testing:
 * - s1Layout=inline|stacked
 * - s1Wheel=compact|comfortable
 * - s1Helper=sticky|inline
 * - s1Type=serif|sans
 * - s1Mode=all|progressive (sentence builder pacing)
 */
export function resolveStep1UxVariant(search?: string): Step1UxVariant {
  if (typeof window === 'undefined' && !search) return DEFAULT_STEP1_UX_VARIANT

  const params = new URLSearchParams(search ?? window.location.search)
  return {
    sentenceLayout: pick(params.get('s1Layout'), ['inline', 'stacked'] as const, DEFAULT_STEP1_UX_VARIANT.sentenceLayout),
    wheelDensity: pick(params.get('s1Wheel'), ['compact', 'comfortable'] as const, DEFAULT_STEP1_UX_VARIANT.wheelDensity),
    helperMode: pick(params.get('s1Helper'), ['sticky', 'inline'] as const, DEFAULT_STEP1_UX_VARIANT.helperMode),
    wheelTypeface: pick(params.get('s1Type'), ['serif', 'sans'] as const, DEFAULT_STEP1_UX_VARIANT.wheelTypeface),
    sentenceMode: pick(params.get('s1Mode'), ['all', 'progressive'] as const, DEFAULT_STEP1_UX_VARIANT.sentenceMode),
  }
}
