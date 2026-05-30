import type { IdentityKitForm } from '@identity-kit/shared'

import { buildContentStarterPdfModel } from './contentStarterPdfModel.js'
import type { KitContentBlock } from './depthDocCommon.js'

export type ContentStarterPageBlocks = {
  page1: KitContentBlock[]
  page2: KitContentBlock[]
}

/**
 * Flat KitContentBlock view (legacy / tests). PDF rendering uses `buildContentStarterPdfModel`.
 * @see docs/specs/CONTENT_STARTER_PACK.md
 */
export function contentStarterBlocks(form: IdentityKitForm): ContentStarterPageBlocks {
  const model = buildContentStarterPdfModel(form)

  const page1: KitContentBlock[] = [
    model.kitRef,
    {
      heading: 'Brand summaries',
      body: [
        ...model.summaries.oneLiners.map((o) => `${o.label}\n${o.text}`),
        `Elevator pitch\n${model.summaries.elevator}`,
        `Brand paragraph\n${model.summaries.paragraph}`,
      ].join('\n\n'),
    },
    {
      heading: 'Homepage messaging',
      body: model.homepage.routes
        .map((route, i) => `Route ${i + 1}\n${route.headline}\n${route.subhead}`)
        .join('\n\n'),
    },
  ]

  const page2: KitContentBlock[] = [
    { heading: 'Short social bio', body: model.bioShort },
    { heading: 'Long bio / About', body: model.bioLong },
    { heading: 'Caption starters', body: model.captions.map((c) => `• ${c}`).join('\n') },
    {
      heading: 'Content pillars',
      body: model.pillars
        .map((pillar) => {
          const prompts = pillar.prompts.map((p) => `  • ${p}`).join('\n')
          return `${pillar.name}\n${pillar.oneLine}\n${prompts}`
        })
        .join('\n\n'),
    },
    {
      heading: 'Calls to action',
      body:
        model.cta.kind === 'pending'
          ? 'Your anchor CTAs are in the Brand Identity Guide → Examples. Pro fulfillment adds alternative phrasings per channel (shared with Voice Playbook page 3).'
          : model.cta.groups
              .flatMap((g) => [g.surfaceLabel, g.anchorCta, ...g.variations.map((v) => v.text)])
              .join('\n'),
    },
  ]

  return { page1, page2 }
}
