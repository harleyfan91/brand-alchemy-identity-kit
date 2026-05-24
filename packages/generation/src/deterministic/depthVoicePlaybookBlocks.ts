import type { IdentityKitForm } from '@identity-kit/shared'

import { voicePlaybookBlocks, voicePlaybookCtaBodyForDepth } from './coreAssembly.js'
import { depthDocRefBlock, type KitContentBlock } from './depthDocCommon.js'

export function depthVoicePlaybookBlocks(form: IdentityKitForm): KitContentBlock[] {
  const legacy = voicePlaybookBlocks(form)
  const out: KitContentBlock[] = [depthDocRefBlock('Voice and Examples', 'voice calibration and extra examples')]

  for (const block of legacy) {
    if (block.heading === 'Calls to action (CTAs)') {
      out.push({
        heading: 'Calls to action (CTAs)',
        body: voicePlaybookCtaBodyForDepth(form),
      })
      continue
    }
    out.push(block)
  }

  return out
}
