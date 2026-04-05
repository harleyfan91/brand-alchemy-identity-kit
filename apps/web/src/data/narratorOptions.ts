import type { BrandNarrator } from '../types'

export interface NarratorOption {
  id: BrandNarrator
  title: string
  description: string
  icon: string
}

export const narratorOptions: NarratorOption[] = [
  {
    id: 'solo_expert',
    title: 'Just me — I am the brand',
    description: 'Clients hire you for your skill, experience, or point of view.',
    icon: '◎',
  },
  {
    id: 'solo_maker',
    title: 'Me and my craft',
    description: 'You make, grow, or create what you sell — the work is the brand.',
    icon: '◇',
  },
  {
    id: 'local_team',
    title: 'Our shop or small team',
    description: 'A crew, studio, or storefront where people come to you.',
    icon: '◈',
  },
  {
    id: 'product_led',
    title: 'The brand and what we make',
    description: 'The product or line speaks first — you may stay behind the scenes.',
    icon: '◉',
  },
  {
    id: 'mission_community',
    title: 'A cause or community we serve',
    description: 'The mission or the people you serve is the center of the brand.',
    icon: '✦',
  },
]

export const narratorLabels: Record<string, string> = Object.fromEntries(
  narratorOptions.map((o) => [o.id, o.title]),
)
