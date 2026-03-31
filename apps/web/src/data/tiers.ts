import type { TierConfig } from '../types'

export const tierOptions: TierConfig[] = [
  {
    id: 'pro',
    name: 'Pro Kit',
    priceLabel: '$99',
    description: 'Everything in Core, plus AI-powered personalization',
    bullets: [
      'AI-written brand copy tailored to your voice',
      'AI-generated palette ideas from your direction',
      'Regenerate sections until it feels right',
      'Priority processing',
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
      'Editable results before delivery',
      'Delivered straight to your inbox',
    ],
  },
]
