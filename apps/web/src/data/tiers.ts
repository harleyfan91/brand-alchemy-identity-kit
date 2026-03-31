import type { TierConfig } from '../types'

export const tierOptions: TierConfig[] = [
  {
    id: 'standard',
    name: 'Standard Kit',
    priceLabel: '$49',
    description: 'Guided templates and smart curation',
    bullets: ['Template-based structure', 'Deterministic color adjustments', 'Editable outputs'],
  },
  {
    id: 'pro',
    name: 'Pro Kit',
    priceLabel: '$99',
    description: 'AI-personalized outputs with regenerate controls',
    bullets: ['AI color and copy generation', 'Editable + regenerate controls', 'Full Pro workflow'],
  },
]
