export type NarratorId =
  | 'solo_expert'
  | 'solo_maker'
  | 'local_team'
  | 'product_led'
  | 'mission_community'

export type CtaType = 'book_or_consult' | 'browse_or_buy' | 'visit_or_call' | 'support_or_join'

export type BriefEmphasis =
  | 'story_then_transformation'
  | 'story_then_values'
  | 'transformation_then_customer'
  | 'transformation_then_differentiation'
  | 'values_then_transformation'

export interface NarratorProfile {
  narrator_id: NarratorId
  /** Repeatable content categories; source for CSP content pillar prompts */
  content_pillars: string[]
  /** Action category for CTA generation */
  cta_type: CtaType
  /** Seed CTA phrases; wording is then shaped by tonePreset */
  cta_patterns: string[]
  /** Ordered primary channels — first entry anchors Week 1 Quick Start */
  primary_channels: string[]
  /** Which Brand Brief sections get leading weight */
  brand_brief_emphasis: BriefEmphasis
  /** Theme categories for Voice Playbook messaging themes */
  tone_of_voice_themes: string[]
  /** Modifier for Pro email template generation */
  email_tone_pattern: string
  /** Lead verb in the brand anchor sentence */
  anchor_verb: string
}

const soloExpert: NarratorProfile = {
  narrator_id: 'solo_expert',
  content_pillars: [
    'Client results and transformations',
    'My expertise and background',
    'Tips and education',
    'Behind the process',
    'FAQs and common questions',
  ],
  cta_type: 'book_or_consult',
  cta_patterns: [
    'Book a free consultation',
    "Let's talk",
    'Schedule a session',
    'See my work',
  ],
  primary_channels: ['LinkedIn', 'personal website', 'email'],
  brand_brief_emphasis: 'story_then_transformation',
  tone_of_voice_themes: ['credibility', 'care', 'personal expertise'],
  email_tone_pattern: 'professional and personal',
  anchor_verb: 'helps',
}

const soloMaker: NarratorProfile = {
  narrator_id: 'solo_maker',
  content_pillars: [
    'Process and making',
    'Materials and ingredients',
    'Finished reveals',
    'Behind the scenes',
    'Customer stories',
  ],
  cta_type: 'browse_or_buy',
  cta_patterns: [
    'Shop the collection',
    "See how it's made",
    'Limited batch — get yours',
    'Made to order — shop now',
  ],
  primary_channels: ['Instagram', 'Pinterest', 'Etsy shop'],
  brand_brief_emphasis: 'story_then_values',
  tone_of_voice_themes: ['craft', 'process', 'maker pride'],
  email_tone_pattern: 'warm and personal',
  anchor_verb: 'makes',
}

const localTeam: NarratorProfile = {
  narrator_id: 'local_team',
  content_pillars: [
    'Team and faces',
    'Community connection',
    'Day-in-the-life',
    'Customer shout-outs',
    'Local events and updates',
  ],
  cta_type: 'visit_or_call',
  cta_patterns: [
    'Visit us at [location]',
    'Call us today',
    'Book online',
    'Stop by and say hi',
  ],
  primary_channels: ['Google Business', 'Instagram', 'Facebook'],
  brand_brief_emphasis: 'transformation_then_customer',
  tone_of_voice_themes: ['community', 'reliability', 'neighborhood warmth'],
  email_tone_pattern: 'friendly and local',
  anchor_verb: 'is here for',
}

const productLed: NarratorProfile = {
  narrator_id: 'product_led',
  content_pillars: [
    'Ingredients, materials, or features',
    'Before and after',
    'How and why it works',
    'Ritual or everyday use',
    'Customer proof and reviews',
  ],
  cta_type: 'browse_or_buy',
  cta_patterns: ['Shop now', 'Try it today', 'See the difference', 'Find your fit'],
  primary_channels: ['Instagram', 'brand website', 'product packaging'],
  brand_brief_emphasis: 'transformation_then_differentiation',
  tone_of_voice_themes: ['brand sensibility', 'product proof', 'clarity'],
  email_tone_pattern: 'brand-forward and clean',
  anchor_verb: 'makes',
}

const missionCommunity: NarratorProfile = {
  narrator_id: 'mission_community',
  content_pillars: [
    'Impact stories',
    'How we help',
    'Community voices',
    'Calls to action and events',
    'Behind the work',
  ],
  cta_type: 'support_or_join',
  cta_patterns: ['Get involved', 'Support the mission', 'Join us', 'See the impact'],
  primary_channels: ['Facebook', 'email newsletter', 'local press'],
  brand_brief_emphasis: 'values_then_transformation',
  tone_of_voice_themes: ['mission', 'community', 'shared purpose'],
  email_tone_pattern: 'warm and cause-driven',
  anchor_verb: 'serves',
}

export const narratorProfiles: Record<string, NarratorProfile> = {
  solo_expert: soloExpert,
  solo_maker: soloMaker,
  local_team: localTeam,
  product_led: productLed,
  mission_community: missionCommunity,
}

/** Returns the narrator profile, falling back to solo_expert when unknown or empty. */
export function getNarratorProfile(narrator: string): NarratorProfile {
  return narratorProfiles[narrator] ?? soloExpert
}
