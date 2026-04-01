import type { VoiceSliders } from '../types'

/** Allowed slider positions (25-step grid). */
export const VOICE_SNAP_POINTS = [0, 25, 50, 75, 100] as const

export function snapVoiceValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value / 25) * 25))
}

export function snapVoiceSliders(sliders: VoiceSliders): VoiceSliders {
  return {
    formality: snapVoiceValue(sliders.formality),
    energy: snapVoiceValue(sliders.energy),
    directness: snapVoiceValue(sliders.directness),
    warmth: snapVoiceValue(sliders.warmth),
    playfulness: snapVoiceValue(sliders.playfulness),
  }
}

/** Human-readable label for the snap point (same for every axis). */
export function voiceSnapLabel(value: number): string {
  const s = snapVoiceValue(value)
  const labels: Record<number, string> = {
    0: 'Low',
    25: 'Medium-low',
    50: 'Balanced',
    75: 'Medium-high',
    100: 'High',
  }
  return labels[s] ?? `${s}`
}
