import type { TierConfig } from '../types'

export const tierOptions: TierConfig[] = [
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$149',
    description: 'Foundation plus ready-to-use messaging assets.',
    bullets: [
      'Custom brand summary for your marketing materials',
      'Content Starter Pack',
      'Homepage messaging directions',
      'Social bio options',
      'Caption and content prompts',
      'CTA language suggestions',
    ],
  },
  {
    id: 'core',
    name: 'Core',
    priceLabel: '$79',
    description: 'Foundational brand tools for a clear, consistent identity.',
    bullets: [
      'Brand Brief',
      'Style Guide',
      'Voice & Content Playbook',
      '30-Day Quick Start Checklist',
    ],
  },
]
