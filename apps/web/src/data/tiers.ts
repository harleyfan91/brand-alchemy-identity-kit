import type { TierConfig } from '../types'

export const tierOptions: TierConfig[] = [
  {
    id: 'pro',
    name: 'Pro Kit',
    priceLabel: '$99',
    description: 'AI-personalized brand strategy and voice tailored to your business',
    bullets: [
      'AI drafts tuned to your audience, offer, and positioning',
      'Voice calibrated from slider profile and custom notes',
      'Visual direction refined with your style and mood input',
      '4 polished PDF brand documents',
    ],
  },
  {
    id: 'core',
    name: 'Core Kit',
    priceLabel: '$49',
    description: 'A guided starter brand kit built from proven templates',
    bullets: [
      'Template-based drafts shaped by your survey responses',
      'Guided palette and style selection workflow',
      'Four editable draft documents before delivery',
      'Fast setup for a polished brand foundation',
    ],
  },
]
