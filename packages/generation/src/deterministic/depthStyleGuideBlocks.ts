import { formatPaletteLeadSentence, type IdentityKitForm } from '@identity-kit/shared'

import { styleGuideBlocks } from './coreAssembly.js'
import { depthDocRefBlock, guideFolioRef, proStyleNotesSuffix, type KitContentBlock } from './depthDocCommon.js'

function paletteRefBody(form: IdentityKitForm): string {
  const lead = formatPaletteLeadSentence(form.step6.selectedPalette)
  return (
    `Swatches and hex codes are in the ${guideFolioRef('Look')} section (Your colors). ` +
    `${lead}${proStyleNotesSuffix(form)}`
  )
}

const VISUAL_APPLICATION_BODY =
  `Use the ${guideFolioRef('Look')} section for colors, type, and wordmark options. ` +
  'Channel-by-channel rollout steps are in your Quick Start Checklist (Week 3). ' +
  'This page focuses on principles, imagery mood, and visual do/don’t rules—not a channel checklist.'

const TYPOGRAPHY_LICENSING_LINE = /Read the distributor's full terms and conditions for licensing\.?/i

function depthTypographyBody(legacyBody: string): string {
  const ref =
    `Specimens, pairing, and licensing reminders are in the ${guideFolioRef('Look')} section (Typography / 02b).`
  const expanded = legacyBody
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !TYPOGRAPHY_LICENSING_LINE.test(p))
    .join('\n\n')
  if (!expanded) {
    return (
      `${ref}\n\n` +
      'Use the guide for paste-ready type stacks; this page expands usage context when your intake included style or continuity notes.'
    )
  }
  return `${ref}\n\n${expanded}`
}

export function depthStyleGuideBlocks(form: IdentityKitForm): KitContentBlock[] {
  const legacy = styleGuideBlocks(form)
  const out: KitContentBlock[] = [depthDocRefBlock('Look', 'visual principles and imagery')]

  for (const block of legacy) {
    if (block.heading === 'Palette') {
      out.push({ heading: 'Palette', body: paletteRefBody(form) })
      continue
    }
    if (block.heading === 'Where to apply this first') {
      continue
    }
    if (block.heading === 'Typography') {
      out.push({ heading: 'Typography', body: depthTypographyBody(block.body) })
      continue
    }
    out.push(block)
  }

  out.push({ heading: 'Visual application', body: VISUAL_APPLICATION_BODY })
  return out
}
