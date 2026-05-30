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

const VISUAL_APPLICATION_BODY =
  'Your colors, visual direction, and typography spreads in this guide cover palette roles, type pairing, and wordmark guidance. ' +
  'Channel-by-channel rollout steps are in your Quick Start Checklist (Week 3). ' +
  'This page focuses on principles, imagery mood, and visual do/don’t rules—not a channel checklist.'

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

  out.push({ heading: 'Visual application', body: VISUAL_APPLICATION_BODY })
  return out
}
