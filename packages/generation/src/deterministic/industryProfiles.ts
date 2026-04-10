/**
 * Phase 7 — Industry voice seasoning (OUTPUT_TRANSLATION_SPEC §6).
 * Preferred / avoid vocabulary, tone modifier, compliance hints for Voice Playbook.
 */

export type IndustryVoiceProfile = {
  preferredTerms: string[]
  avoidTerms: string[]
  /** Appended after the tone paragraph + visual bridge in Tone profile. */
  toneModifier: string
  /** Prepended to the avoid-term guardrail line when set. */
  complianceNote?: string
}

const DEFAULT_INDUSTRY_VOICE: IndustryVoiceProfile = {
  preferredTerms: ['clear outcomes', 'specific details', 'honest framing', 'how you work', 'what clients get'],
  avoidTerms: ['guaranteed', 'miracle', 'everyone', 'secret formula', 'revolutionary'],
  toneModifier:
    'Credibility comes from being specific about what you do, who it is for, and what happens next — not from superlatives.',
}

/** Priority + tier-2 industries; all other `step1.industry` ids use `DEFAULT_INDUSTRY_VOICE`. */
const INDUSTRY_VOICE: Record<string, IndustryVoiceProfile> = {
  creative_services: {
    preferredTerms: ['portfolio', 'process', 'creative direction', 'collaboration', 'craft', 'iteration'],
    avoidTerms: ['synergy', 'world-class', 'cutting-edge', 'we innovate', 'best-in-class'],
    toneModifier:
      'Creative services brands sound most credible when they show the thinking behind the work — specificity beats agency swagger every time.',
  },
  consulting_coaching: {
    preferredTerms: ['outcomes', 'clarity', 'roadmap', 'partnership', 'accountability', 'next steps'],
    avoidTerms: ['guaranteed ROI', 'passive income', 'secret system', 'six figures fast', 'no effort'],
    toneModifier:
      'Consulting and coaching brands earn trust when they name real outcomes and honest scope — not when they promise shortcuts.',
    complianceNote: 'Avoid income or results guarantees.',
  },
  health_wellness: {
    preferredTerms: ['client outcomes', 'well-being', 'support', 'evidence-based', 'sustainable', 'habits'],
    avoidTerms: ['cure', 'instant results', 'guaranteed', 'fix', 'detox miracle', 'medical-grade'],
    toneModifier:
      'In health and wellness especially, credibility comes from specificity — what you help people achieve, not how fast.',
    complianceNote: 'Avoid medical claims; describe support and well-being, not cures.',
  },
  legal_professional_services: {
    preferredTerms: ['counsel', 'representation', 'guidance', 'experience', 'process', 'options'],
    avoidTerms: ['guarantee', 'promise', 'win', 'no risk', 'always', 'sure thing'],
    toneModifier:
      'Legal and professional brands build trust through precision — clear language, verifiable credentials, and the absence of hype.',
    complianceNote: 'Never promise outcomes; keep claims measured and accurate.',
  },
  technology: {
    preferredTerms: ['reliable', 'secure', 'implementation', 'integration', 'uptime', 'workflow'],
    avoidTerms: ['revolutionary', 'ninja', 'crushing it', 'disrupt everything', 'AI magic'],
    toneModifier:
      'Technology brands sound serious when they explain what the product does and for whom — jargon and hype read as uncertainty.',
  },
  retail: {
    preferredTerms: [
      'small batch',
      'handmade',
      'materials',
      'lead time',
      'provenance',
      'reorders',
      'stockists',
      'packaging',
    ],
    avoidTerms: ['fire sale', 'last chance forever', 'fake urgency', 'you need this now'],
    toneModifier:
      'Independent retail and maker brands sound trustworthy when listings, lead times, and policies match reality — specificity beats hype, especially for handmade, marketplace, and wholesale buyers.',
  },
  food_beverage: {
    preferredTerms: ['ingredients', 'made fresh', 'sourced', 'seasonal', 'batch', 'from scratch'],
    avoidTerms: ['processed', 'mass-produced', 'industrial', 'mystery ingredients', 'factory'],
    toneModifier:
      'Food brands earn trust through transparency — what is in it, where it came from, how it was made.',
  },
  fitness_sports: {
    preferredTerms: ['progress', 'commitment', 'training', 'community', 'strength', 'consistency'],
    avoidTerms: ['guaranteed results', 'effortless', 'lose X in Y days', 'shredded fast', 'no work'],
    toneModifier:
      'Fitness brands are most credible when they show real people doing real work — energy in the voice, honesty about effort.',
    complianceNote: 'Avoid guaranteed body or performance outcomes.',
  },
  beauty_personal_care: {
    preferredTerms: ['formulated', 'ritual', 'gentle', 'skin', 'ingredients', 'glow'],
    avoidTerms: ['miracle', 'instant fix', 'toxic', 'injectable results', 'permanent'],
    toneModifier:
      'Beauty and personal care readers want honesty about what a product does and what it contains — confidence without impossible promises.',
    complianceNote: 'Avoid miracle or instant-transformation claims.',
  },
}

export function getIndustryVoiceProfile(industryId: string): IndustryVoiceProfile {
  return INDUSTRY_VOICE[industryId] ?? DEFAULT_INDUSTRY_VOICE
}

export function industryVoiceGuardrailLine(industryId: string): string | null {
  const p = getIndustryVoiceProfile(industryId)
  const avoid = p.avoidTerms.slice(0, 6).join(', ')
  if (!avoid && !p.complianceNote) return null
  const lead = p.complianceNote ? `${p.complianceNote} ` : ''
  const tail = avoid ? `Steer clear of loaded phrasing such as: ${avoid}.` : ''
  return `${lead}${tail}`.trim() || null
}
