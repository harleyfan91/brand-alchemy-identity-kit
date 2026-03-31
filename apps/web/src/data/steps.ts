export interface StepMeta {
  id: number
  key: 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'step7'
  title: string
  prompt: string
}

export const stepMeta: StepMeta[] = [
  { id: 1, key: 'step1', title: 'Business Snapshot', prompt: 'Tell us the basics about your business.' },
  {
    id: 2,
    key: 'step2',
    title: 'Your Buyer',
    prompt: 'Who usually buys from your business?',
  },
  {
    id: 3,
    key: 'step3',
    title: 'Brand Personality',
    prompt: 'Tap the mood and tone that fit your brand voice.',
  },
  {
    id: 4,
    key: 'step4',
    title: 'Core Values',
    prompt: 'Pick the values you want your brand to lead with.',
  },
  { id: 5, key: 'step5', title: 'Brand Story', prompt: 'Choose the origin story that fits you best.' },
  {
    id: 6,
    key: 'step6',
    title: 'Visual Direction',
    prompt: 'Choose your palette and visual style direction.',
  },
  {
    id: 7,
    key: 'step7',
    title: 'Industry Context',
    prompt: 'Add your category context to shape your final kit.',
  },
]
