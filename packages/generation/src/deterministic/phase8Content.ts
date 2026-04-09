import { assembleOfferLine, type IdentityKitForm } from '@identity-kit/shared'

import type { TouchpointCluster } from './brandProfile.js'
import { computeBrandProfile } from './brandProfile.js'

type TonePreset = 'friendly' | 'professional' | 'bold'

const STYLE_IMAGERY_CORE: Record<string, string> = {
  clean_minimal:
    'Imagery should feel calm and intentional: soft light, generous space, and backgrounds that stay quiet so your subject or product reads first. Busy patterns and heavy filters fight this direction.',
  bold_graphic:
    'Visuals can carry strong contrast, clear shapes, and decisive cropping—poster energy is fine in the feed. Color blocks and type should feel as intentional as the photograph itself.',
  organic_natural:
    'Photographs should feel warm, tactile, and real—natural textures, soft or earthy light, and honest imperfection. Icy studio polish usually reads corporate instead of handmade.',
  luxe_refined:
    'Imagery stays restrained and elevated: controlled palettes, refined composition, and quality over quantity. Every frame should feel considered—nothing loud or cluttered.',
}

const CLUSTER_IMAGERY_TAIL: Record<TouchpointCluster, string> = {
  physical_first:
    'Carry that mood through what people see on signs, in your space, on packaging, and in hero shots of the real environment—not only in digital templates.',
  social_product:
    'For products, keep backdrops simple so the item and your palette stay the story; posts and listings should look like one brand, shot the same way.',
  social_service:
    'For a professional presence, headshots and cover images should match this direction—specific, not stock-generic, with setting and wardrobe echoing your palette.',
  local_community:
    'Community-facing photos work when they show real people, places, and moments—authentic beats overly glossy when you are asking people to show up.',
  digital_brand:
    'Website and social heroes should share the same rules: one clear focal point per frame, consistent backdrop language, color that echoes your palette.',
}

const VOICE_BEFORE_AFTER: Record<
  TonePreset,
  { sentence: { before: string; after: string }; caption: { before: string; after: string } }
> = {
  friendly: {
    sentence: {
      before: 'We are excited to announce our new service offering.',
      after:
        "Here's something worth your attention — {businessName} just added {offer}, and it's exactly what we've heard you asking for.",
    },
    caption: {
      before: 'New post! Link in bio.',
      after: 'Made this for you — {offer} at {businessName}. Tap through when you are ready.',
    },
  },
  professional: {
    sentence: {
      before: "We've been working hard behind the scenes and can't wait to share what's next.",
      after: '{businessName} now offers {offer} — clear scope, straightforward language, and an obvious next step when you are ready to talk.',
    },
    caption: {
      before: 'Check out our latest update!',
      after: '{businessName} — {offer}. Details at the link; no fluff, just what you need to decide.',
    },
  },
  bold: {
    sentence: {
      before: 'Just wanted to touch base and see if you had any questions about our services.',
      after: 'Here is what {businessName} does: {offer}. If that is what you need, say the word and we move.',
    },
    caption: {
      before: 'Some exciting things happening — stay tuned!',
      after: '{offer}. {businessName}. Link below — stop scrolling when you are ready to act.',
    },
  },
}

function fillTemplate(t: string, businessName: string, offer: string): string {
  return t.replace(/\{businessName\}/g, businessName).replace(/\{offer\}/g, offer)
}

function normalizeTone(t: string): TonePreset {
  return t === 'professional' || t === 'bold' ? t : 'friendly'
}

export function voicePlaybookBeforeAfterBody(form: IdentityKitForm): string {
  const tone = normalizeTone(form.step3.tonePreset)
  const { businessName } = form.step1
  const offer = assembleOfferLine(form.step1.offer, form.step1.industry)
  const pack = VOICE_BEFORE_AFTER[tone]
  const sBefore = pack.sentence.before
  const sAfter = fillTemplate(pack.sentence.after, businessName, offer)
  const cBefore = pack.caption.before
  const cAfter = fillTemplate(pack.caption.after, businessName, offer)

  return [
    'Sentence rewrite',
    `Before: "${sBefore}"`,
    `After: "${sAfter}"`,
    '',
    'Caption or post hook',
    `Before: "${cBefore}"`,
    `After: "${cAfter}"`,
  ].join('\n')
}

export function styleGuideImageryDirectionBody(form: IdentityKitForm): string {
  const styleKey = form.step6.selectedStyle ?? 'clean_minimal'
  const { touchpointCluster } = computeBrandProfile(form)
  const core = STYLE_IMAGERY_CORE[styleKey] ?? STYLE_IMAGERY_CORE.clean_minimal
  const tail = CLUSTER_IMAGERY_TAIL[touchpointCluster]
  return `${core} ${tail}`
}
