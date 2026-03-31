export interface StepMeta {
  id: number
  key: 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'step7'
  title: string
  prompt: string
}

export const stepMeta: StepMeta[] = [
  { id: 1, key: 'step1', title: 'Business Snapshot', prompt: 'Tell us the basics about your brand.' },
  {
    id: 2,
    key: 'step2',
    title: 'Ideal Customer',
    prompt: 'Describe who you serve and what they need most.',
  },
  {
    id: 3,
    key: 'step3',
    title: 'Brand Personality',
    prompt: 'Choose the adjectives and tone that feel right for your voice.',
  },
  {
    id: 4,
    key: 'step4',
    title: 'Core Values',
    prompt: 'Share what your brand stands for and what promise you make.',
  },
  { id: 5, key: 'step5', title: 'Brand Story', prompt: 'Capture your origin and motivation.' },
  {
    id: 6,
    key: 'step6',
    title: 'Aesthetic Direction',
    prompt: 'Set your visual direction, style, and mood.',
  },
  {
    id: 7,
    key: 'step7',
    title: 'Industry Context',
    prompt: 'Add your market context and differentiation.',
  },
]
