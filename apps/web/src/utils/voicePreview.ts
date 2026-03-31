import type { VoiceSliders } from '../types'

export type VoiceMood = 'calm' | 'warm' | 'bold' | 'neutral'

type SliderKey = keyof VoiceSliders

function dominant(sliders: VoiceSliders): SliderKey {
  const scores: Record<SliderKey, number> = {
    formality: Math.abs(sliders.formality - 50),
    energy: Math.abs(sliders.energy - 50),
    directness: Math.abs(sliders.directness - 50),
    warmth: Math.abs(sliders.warmth - 50),
    playfulness: Math.abs(sliders.playfulness - 50),
  }
  return (Object.keys(scores) as SliderKey[]).reduce((a, b) => (scores[a] >= scores[b] ? a : b))
}

export function buildVoicePreview(sliders: VoiceSliders): { sentence: string; mood: VoiceMood } {
  const { formality, energy, directness, warmth, playfulness } = sliders

  const highEnergy = energy >= 65
  const highDirectness = directness >= 65
  const highWarmth = warmth >= 65
  const highPlayful = playfulness >= 65
  const highConversational = formality >= 65
  const highFormal = formality <= 35
  const lowEnergy = energy <= 35

  // Pick sentence from real brand-voice examples based on dominant combination
  let sentence: string
  let mood: VoiceMood

  if (highDirectness && highEnergy) {
    sentence = 'No fluff. Bold moves only.'
    mood = 'bold'
  } else if (highDirectness && highWarmth) {
    sentence = 'Straight talk from people who genuinely care.'
    mood = 'warm'
  } else if (highWarmth && highPlayful) {
    sentence = "We're in your corner, and we make it fun."
    mood = 'warm'
  } else if (highPlayful && highConversational) {
    sentence = 'Big ideas, zero boring stuff.'
    mood = 'warm'
  } else if (highEnergy && highConversational) {
    sentence = 'We move fast and bring you with us.'
    mood = 'bold'
  } else if (highFormal && lowEnergy) {
    sentence = 'Expertise that speaks for itself.'
    mood = 'calm'
  } else if (highFormal && highDirectness) {
    sentence = 'Clear. Credible. Consistent.'
    mood = 'calm'
  } else if (highWarmth && highFormal) {
    sentence = 'Professional care, made personal.'
    mood = 'neutral'
  } else if (highConversational && highWarmth) {
    sentence = 'Real talk from people who actually care.'
    mood = 'warm'
  } else if (lowEnergy && !highDirectness) {
    sentence = 'Thoughtful work. Steady and reliable.'
    mood = 'calm'
  } else if (highPlayful) {
    sentence = 'Come as you are. Leave with something great.'
    mood = 'warm'
  } else {
    // Balanced/neutral — pick by single dominant axis
    const dom = dominant(sliders)
    const neutralSentences: Record<SliderKey, string> = {
      formality: highConversational ? 'Easy to talk to. Easy to trust.' : 'Measured words. Meaningful results.',
      energy: highEnergy ? 'Always moving. Always delivering.' : 'Calm expertise, every step of the way.',
      directness: highDirectness ? 'We say what we mean.' : 'Guided at your pace, never rushed.',
      warmth: highWarmth ? 'People-first, always.' : 'Focused on outcomes, not small talk.',
      playfulness: highPlayful ? 'Serious about results. Fun along the way.' : 'Precise. Proven. Dependable.',
    }
    sentence = neutralSentences[dom]
    mood = 'neutral'
  }

  return { sentence, mood }
}
