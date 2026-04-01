import type { VoiceSliders } from '../types'
import { snapVoiceSliders } from './voiceSliders'

export type VoiceMood = 'calm' | 'warm' | 'bold' | 'neutral'

type SliderKey = keyof VoiceSliders

function band(v: number): 'low' | 'mid' | 'high' {
  if (v <= 25) return 'low'
  if (v >= 75) return 'high'
  return 'mid'
}

function inferMood(s: VoiceSliders): VoiceMood {
  if (band(s.directness) === 'high' && band(s.energy) === 'high') return 'bold'
  if (band(s.warmth) === 'high' || band(s.playfulness) === 'high') return 'warm'
  if (band(s.formality) === 'low' && band(s.energy) === 'low') return 'calm'
  return 'neutral'
}

function singleNonMidAxis(
  bands: Record<SliderKey, 'low' | 'mid' | 'high'>,
): { key: SliderKey; band: 'low' | 'high' } | null {
  const nonMid: SliderKey[] = []
  for (const key of Object.keys(bands) as SliderKey[]) {
    if (bands[key] !== 'mid') nonMid.push(key)
  }
  if (nonMid.length !== 1) return null
  const k = nonMid[0]
  const b = bands[k]
  if (b === 'mid') return null
  return { key: k, band: b }
}

function dominantKey(s: VoiceSliders): SliderKey {
  const scores: Record<SliderKey, number> = {
    formality: Math.abs(s.formality - 50),
    energy: Math.abs(s.energy - 50),
    directness: Math.abs(s.directness - 50),
    warmth: Math.abs(s.warmth - 50),
    playfulness: Math.abs(s.playfulness - 50),
  }
  return (Object.keys(scores) as SliderKey[]).reduce((a, b) => (scores[a] >= scores[b] ? a : b))
}

export function buildVoicePreview(sliders: VoiceSliders): { sentence: string; mood: VoiceMood } {
  const s = snapVoiceSliders(sliders)
  const b: Record<SliderKey, 'low' | 'mid' | 'high'> = {
    formality: band(s.formality),
    energy: band(s.energy),
    directness: band(s.directness),
    warmth: band(s.warmth),
    playfulness: band(s.playfulness),
  }

  const f = b.formality
  const e = b.energy
  const d = b.directness
  const w = b.warmth
  const p = b.playfulness

  const allMid = f === 'mid' && e === 'mid' && d === 'mid' && w === 'mid' && p === 'mid'
  if (allMid) {
    return { sentence: 'Balanced and adaptable — exactly what you need.', mood: 'neutral' }
  }

  // Two-axis pairs (order: first match wins)
  const pairs: Array<{ ok: boolean; sentence: string }> = [
    { ok: f === 'high' && w === 'high', sentence: 'Real talk from people who actually care.' },
    { ok: f === 'high' && p === 'high', sentence: 'Big ideas, zero boring stuff.' },
    { ok: f === 'high' && e === 'high', sentence: 'We move fast and bring you with us.' },
    { ok: f === 'low' && e === 'low', sentence: 'Expertise that speaks for itself.' },
    { ok: f === 'low' && d === 'high', sentence: 'Clear. Credible. Consistent.' },
    { ok: f === 'low' && w === 'high', sentence: 'Professional care, made personal.' },
    { ok: f === 'low' && p === 'low', sentence: 'Trusted. Refined. Dependable.' },
    { ok: d === 'high' && e === 'high', sentence: 'No fluff. Bold moves only.' },
    { ok: d === 'high' && w === 'high', sentence: 'Straight talk from people who genuinely care.' },
    { ok: d === 'high' && p === 'low', sentence: 'No distractions. Just results.' },
    { ok: d === 'high' && e === 'low', sentence: 'Precise. Proven. No noise.' },
    { ok: w === 'high' && p === 'high', sentence: "We're in your corner, and we make it fun." },
    { ok: w === 'high' && e === 'low', sentence: "Slow down. We've got you." },
    { ok: e === 'low' && d === 'low', sentence: 'Thoughtful work. Steady and reliable.' },
    { ok: d === 'low' && w === 'high', sentence: 'Caring, patient, and always present.' },
    { ok: f === 'low' && w === 'low', sentence: 'Disciplined expertise. Nothing more, nothing less.' },
    { ok: p === 'high' && e === 'high', sentence: 'Come as you are. Leave energized.' },
    { ok: p === 'low' && w === 'low', sentence: "You'll see the results. No need for noise." },
  ]

  for (const { ok, sentence } of pairs) {
    if (ok) {
      return { sentence, mood: inferMood(s) }
    }
  }

  const only = singleNonMidAxis(b)
  if (only) {
    const { key, band: side } = only
    if (key === 'formality' && side === 'high') {
      return { sentence: 'Easy to talk to. Real people, real conversations.', mood: 'warm' }
    }
    if (key === 'formality' && side === 'low') {
      return { sentence: 'We bring expertise you can rely on.', mood: 'calm' }
    }
    if (key === 'energy' && side === 'high') {
      return { sentence: "We're all in. Every time.", mood: 'bold' }
    }
    if (key === 'energy' && side === 'low') {
      return { sentence: 'Steady. Thoughtful. There when you need us.', mood: 'calm' }
    }
    if (key === 'directness' && side === 'high') {
      return { sentence: 'We say what we mean.', mood: 'bold' }
    }
    if (key === 'directness' && side === 'low') {
      return { sentence: 'At your pace, on your terms.', mood: 'neutral' }
    }
    if (key === 'warmth' && side === 'high') {
      return { sentence: 'People-first. Always.', mood: 'warm' }
    }
    if (key === 'warmth' && side === 'low') {
      return { sentence: 'Focused on results, not small talk.', mood: 'neutral' }
    }
    if (key === 'playfulness' && side === 'high') {
      return { sentence: "Life's too short for boring brands.", mood: 'warm' }
    }
    if (key === 'playfulness' && side === 'low') {
      return { sentence: 'Serious work. Serious results.', mood: 'calm' }
    }
  }

  const dom = dominantKey(s)
  const fallback: Record<SliderKey, string> = {
    formality:
      f === 'high'
        ? 'Easy to talk to. Easy to trust.'
        : f === 'low'
          ? 'Measured words. Meaningful results.'
          : 'A voice that fits your brand — clear and confident.',
    energy:
      e === 'high'
        ? 'Always moving. Always delivering.'
        : e === 'low'
          ? 'Calm expertise, every step of the way.'
          : 'A voice that fits your brand — clear and confident.',
    directness:
      d === 'high'
        ? 'We say what we mean.'
        : d === 'low'
          ? 'Guided at your pace, never rushed.'
          : 'A voice that fits your brand — clear and confident.',
    warmth:
      w === 'high'
        ? 'People-first, always.'
        : w === 'low'
          ? 'Focused on outcomes, not small talk.'
          : 'A voice that fits your brand — clear and confident.',
    playfulness:
      p === 'high'
        ? 'Serious about results. Fun along the way.'
        : p === 'low'
          ? 'Precise. Proven. Dependable.'
          : 'A voice that fits your brand — clear and confident.',
  }

  return {
    sentence: fallback[dom],
    mood: inferMood(s),
  }
}
