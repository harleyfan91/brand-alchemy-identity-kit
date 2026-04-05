/**
 * Phase 4: link voice (tone preset) and visual direction (selected style) in both directions.
 * 3 tone presets × 4 styles = 12 lines each.
 */

const STYLE_FALLBACK = 'clean_minimal'
const TONE_FALLBACK = 'professional'

const VALID_TONES = new Set<string>(['friendly', 'professional', 'bold'])
const VALID_STYLES = new Set(['clean_minimal', 'bold_graphic', 'organic_natural', 'luxe_refined'])

/** Style Guide — Visual direction: bridge after style description, before logo note. */
const STYLE_GUIDE_VOICE_VISUAL_BRIDGE: Record<string, Record<string, string>> = {
  friendly: {
    clean_minimal:
      'A warm, conversational voice and a clean visual direction reinforce each other — the design earns trust through space and simplicity; the words earn it by feeling like a person.',
    bold_graphic:
      'A warm tone balanced against a bold visual direction creates a useful contrast — the design has energy, the words make it feel approachable rather than aggressive.',
    organic_natural:
      'Warmth in both voice and visual direction is a consistent signal — the approachable tone and the handcrafted sensibility say the same thing through two different channels.',
    luxe_refined:
      'A warm voice inside a refined visual system creates welcome tension — the design is restrained, the words are human, and together they feel more accessible than either would alone.',
  },
  professional: {
    clean_minimal:
      'A polished voice and a minimal visual direction are natural partners — neither overexplains, and both signal competence through restraint.',
    bold_graphic:
      "A direct, confident visual direction and a professional voice make a clear statement together — this is a brand that knows what it's doing and doesn't feel the need to prove it twice.",
    organic_natural:
      'A professional voice inside an organic visual system creates a grounded sophistication — the warmth is in the visuals, the precision is in the language.',
    luxe_refined:
      'Polished language and a refined visual system signal the same thing without repeating each other — precision in both the words and the design is the brand.',
  },
  bold: {
    clean_minimal:
      "A direct voice inside a minimal visual direction keeps the energy focused — there's nothing decorative to distract from the point.",
    bold_graphic:
      'A direct, confident voice and a bold visual direction amplify each other — this brand is not subtle, and that is intentional.',
    organic_natural:
      "A direct voice and an organic visual direction create productive tension — the words don't hedge, but the visuals feel grounded and human.",
    luxe_refined:
      'A confident voice inside a refined visual system is a strong combination — the restraint is in the design; the directness is in the words. Neither softens the other.',
  },
}

/** Voice Playbook — Tone profile: closing sentence tying voice to visual direction. */
const VOICE_PLAYBOOK_TONE_VISUAL_CLOSING: Record<string, Record<string, string>> = {
  friendly: {
    clean_minimal:
      'Your clean visual system and warm voice work the same way — the design gets out of the way so the human connection can come through.',
    bold_graphic:
      'Your bold visual direction provides the energy; your warm voice makes it approachable — applied together they are attention-getting without being alienating.',
    organic_natural:
      'Your handcrafted visual direction and approachable tone tell the same story — customers feel the care in both what they see and what they read.',
    luxe_refined:
      'Your refined visual system gains warmth from how you sound — premium design with a human voice feels inviting instead of distant.',
  },
  professional: {
    clean_minimal:
      'Your spare visual direction and polished voice both favor clarity — applied together they signal competence without noise.',
    bold_graphic:
      'Your confident layout and professional tone align on decisiveness — the visuals grab attention; the words earn trust.',
    organic_natural:
      'Your organic visual direction brings the warmth; your professional voice brings the precision — that combination signals credibility without coldness.',
    luxe_refined:
      'Your refined visual direction and polished voice are designed as a pair — when both are applied consistently, the brand signals quality without saying so.',
  },
  bold: {
    clean_minimal:
      'Your direct language and minimal visuals strip away distraction — the point lands faster when neither layer over-explains.',
    bold_graphic:
      'Your direct voice and bold visual direction make the same statement — consistent application of both is what turns intention into recognition.',
    organic_natural:
      'Your grounded visuals and straight-ahead voice feel honest — the brand reads as real, not rehearsed.',
    luxe_refined:
      'Your restrained visual system and confident voice share the same discipline — neither hedges, and together they read as intentional.',
  },
}

function normalizeTone(tone: string): string {
  return VALID_TONES.has(tone) ? tone : TONE_FALLBACK
}

function normalizeStyle(style: string): string {
  return VALID_STYLES.has(style) ? style : STYLE_FALLBACK
}

export function styleGuideVisualVoiceBridge(tonePreset: string, selectedStyle: string): string {
  const tone = normalizeTone(tonePreset)
  const style = normalizeStyle(selectedStyle)
  const byTone = STYLE_GUIDE_VOICE_VISUAL_BRIDGE[tone] ?? STYLE_GUIDE_VOICE_VISUAL_BRIDGE[TONE_FALLBACK]!
  return byTone[style] ?? byTone[STYLE_FALLBACK]!
}

export function voicePlaybookToneVisualClosing(tonePreset: string, selectedStyle: string): string {
  const tone = normalizeTone(tonePreset)
  const style = normalizeStyle(selectedStyle)
  const byTone = VOICE_PLAYBOOK_TONE_VISUAL_CLOSING[tone] ?? VOICE_PLAYBOOK_TONE_VISUAL_CLOSING[TONE_FALLBACK]!
  return byTone[style] ?? byTone[STYLE_FALLBACK]!
}
