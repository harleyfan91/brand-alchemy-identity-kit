import type { BrandNarrator } from '../types'

export interface StoryOption {
  id: string
  title: string
  description: string
  icon: string
}

/** Stable ids — never change these; they are stored in form state and mapped in ReviewScreen and generation. */
const STORY_IDS = {
  SIDE_HUSTLE: 'side_hustle_leap',
  INDUSTRY_INSIDER: 'industry_insider',
  PROBLEM_SOLVER: 'problem_solver',
  CREATIVE_CALLING: 'creative_calling',
  FRESH_START: 'fresh_start',
} as const

/** Display labels used in ReviewScreen and generation label maps. */
export const originLabels: Record<string, string> = {
  [STORY_IDS.SIDE_HUSTLE]: 'Built from a side project',
  [STORY_IDS.INDUSTRY_INSIDER]: 'Deep industry experience',
  [STORY_IDS.PROBLEM_SOLVER]: 'Built to solve a real gap',
  [STORY_IDS.CREATIVE_CALLING]: 'A creative calling',
  [STORY_IDS.FRESH_START]: 'A bold fresh start',
}

const defaultOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'Built from a side project',
    description: 'What started as a passion or experiment became the real thing.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'Deep industry experience',
    description: 'Years of working in the field led to going independent.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'Built to solve a real gap',
    description: 'Saw something missing in the market and built the fix.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'A creative calling',
    description: 'This kind of work has always been the path.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'A bold fresh start',
    description: 'Pivoted or reinvented to build something more meaningful.',
    icon: '◎',
  },
]

const soloExpertOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'The Side-Hustle Leap',
    description: 'Started offering services on the side — then went all in.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'The Industry Insider',
    description: 'Worked in the field for years, then launched independently.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'The Problem Solver',
    description: 'Saw clients getting underserved and built a better way.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'The Creative Calling',
    description: 'This work has always been the path — finally made it official.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'The Fresh Start',
    description: 'Pivoted careers to do work that actually fits.',
    icon: '◎',
  },
]

const soloMakerOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'Started as a hobby',
    description: 'Making things on the side became the main thing.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'Trained in the craft',
    description: 'Formal training or years of practice led to selling independently.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'Made what was missing',
    description: 'Couldn\'t find what you needed, so you made it yourself.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'Always made things',
    description: 'Creating and making has always been part of your identity.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'New chapter, new craft',
    description: 'A life pivot brought you to doing the work you actually love.',
    icon: '◎',
  },
]

const localTeamOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'Started small, grew from there',
    description: 'What began as a small operation grew into a real local presence.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'Built by people who know the trade',
    description: 'Deep experience in the field is what makes this shop different.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'Filled a gap in the neighborhood',
    description: 'Saw what the community was missing and opened to serve it.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'Built around a shared passion',
    description: 'The team came together around something they all care about.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'A fresh start for the community',
    description: 'Something new and different opened its doors here.',
    icon: '◎',
  },
]

const productLedOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'Built on a side project',
    description: 'The product started as a small experiment — and it worked.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'Made by people who know the category',
    description: 'Deep knowledge of the space is baked into every product decision.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'Made to fix a real problem',
    description: 'The existing options weren\'t good enough, so this brand was built to do better.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'Built around a vision',
    description: 'The product exists because someone believed it should.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'A new take on an old category',
    description: 'Reimagined what the product could be for a new generation.',
    icon: '◎',
  },
]

const missionOptions: StoryOption[] = [
  {
    id: STORY_IDS.SIDE_HUSTLE,
    title: 'Grew from grassroots beginnings',
    description: 'What started informally became a real organization with purpose.',
    icon: '↗',
  },
  {
    id: STORY_IDS.INDUSTRY_INSIDER,
    title: 'Founded by those closest to the work',
    description: 'People already doing this work decided to formalize and expand it.',
    icon: '◍',
  },
  {
    id: STORY_IDS.PROBLEM_SOLVER,
    title: 'Created to fill a real need',
    description: 'Built in response to a gap that no one else was addressing.',
    icon: '◇',
  },
  {
    id: STORY_IDS.CREATIVE_CALLING,
    title: 'Driven by belief',
    description: 'The mission exists because the founders believed it had to.',
    icon: '✶',
  },
  {
    id: STORY_IDS.FRESH_START,
    title: 'A new model for an old problem',
    description: 'Rethinking how this kind of work can be done for the community.',
    icon: '◎',
  },
]

export function getStoryOptions(narrator: BrandNarrator): StoryOption[] {
  switch (narrator) {
    case 'solo_expert':
      return soloExpertOptions
    case 'solo_maker':
      return soloMakerOptions
    case 'local_team':
      return localTeamOptions
    case 'product_led':
      return productLedOptions
    case 'mission_community':
      return missionOptions
    default:
      return defaultOptions
  }
}
