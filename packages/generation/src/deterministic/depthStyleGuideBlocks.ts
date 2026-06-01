import type { IdentityKitForm } from '@identity-kit/shared'

import { styleGuideBlocks } from './coreAssembly.js'
import { type KitContentBlock } from './depthDocCommon.js'

function styleGuideDocRefBlock(): KitContentBlock {
  return {
    heading: 'How this document relates to your kit',
    body:
      'This Style Guide is your working reference for colors, type, visual direction, and imagery. ' +
      'The Brand Identity Guide is your at-a-glance brand story (Summary, Voice, Examples). ' +
      'Use this document when applying the system; use the guide when you need the short version for yourself or collaborators.',
  }
}

const VISUAL_APPLICATION_CORE_BULLETS = [
  'Palette, type, and wordmark: spreads 01–03.',
  'Principles and do/avoid: spread 04.',
  'Rollout steps: Quick Start Checklist, Week 3.',
] as const

const VISUAL_APPLICATION_PRO_BULLET = 'Reference photos: Visual Reference spread (next).'

function visualApplicationBody(form: IdentityKitForm): string {
  const bullets =
    form.tier === 'pro'
      ? [...VISUAL_APPLICATION_CORE_BULLETS, VISUAL_APPLICATION_PRO_BULLET]
      : [...VISUAL_APPLICATION_CORE_BULLETS]
  return bullets.map((line) => `• ${line}`).join('\n')
}

export function depthStyleGuideBlocks(form: IdentityKitForm): KitContentBlock[] {
  const legacy = styleGuideBlocks(form)
  const out: KitContentBlock[] = [styleGuideDocRefBlock()]

  for (const block of legacy) {
    if (block.heading === 'Where to apply this first') {
      continue
    }
    if (block.heading === 'Typography') {
      continue
    }
    out.push(block)
  }

  out.push({ heading: 'Visual application', body: visualApplicationBody(form) })
  return out
}
