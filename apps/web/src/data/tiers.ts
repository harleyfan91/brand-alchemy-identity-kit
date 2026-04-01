import type { TierConfig } from '../types'

export const tierOptions: TierConfig[] = [
  {
    id: 'pro',
    name: 'Pro Kit',
    priceLabel: '$99',
    description: 'A fully personalized brand kit built around your business',
    bullets: [
      'Fully personalized brand copy in your voice',
      'Custom color palette shaped by your direction',
      'Tweak and regenerate sections until it feels right',
      '4 polished PDF brand documents',
    ],
  },
  {
    id: 'core',
    name: 'Core Kit',
    priceLabel: '$49',
    description: 'Your complete brand kit in minutes',
    bullets: [
      '4 polished PDF brand documents',
      'Guided visual brand quiz',
      'Simple, fast setup with no guesswork',
      'Editable results before delivery',
    ],
  },
]
