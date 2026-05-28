import type { IdentityKitForm } from '@identity-kit/shared'

import type { StageContext } from './brandProfile.js'

export const QUICK_START_BRAND_IDENTITY_GUIDE_TITLE = 'Brand Identity Guide'

export type QuickStartKitIntroContent = {
  leadParagraph: { before: string; highlight: string; after: string }
  followingParagraphs: string
}

/** Stage-based orientation — shown once before Week 1, not inside a week block. */
const QUICK_START_STAGE_NOTE: Record<StageContext, string> = {
  starting_fresh:
    "You are building from scratch — that's an advantage. Start with one channel, do it right, and the rest can follow what you establish here.",
  building_foundation:
    'Your business exists; now the brand needs to catch up. Start with the channel where the most customers find you first.',
  standardizing:
    "You've got presence across channels — the job now is to make them feel like the same brand. Start where the gap is most visible.",
  protecting_recognition:
    "There's equity in what you've already built. Week 1 is about auditing for consistency, not starting over.",
}

export function quickStartStageNote(stageContext: StageContext): string {
  return QUICK_START_STAGE_NOTE[stageContext]
}

export function composeQuickStartKitIntroContent(): QuickStartKitIntroContent {
  return {
    leadParagraph: {
      before: 'Start with your ',
      highlight: QUICK_START_BRAND_IDENTITY_GUIDE_TITLE,
      after:
        '. It is the complete snapshot of your brand: voice, visual system, personality, and examples.',
    },
    followingParagraphs:
      'Then follow this checklist. Each week points you to the right section of the guide. ' +
      'The Brand Brief, Style Guide, and Voice Playbook go further on strategy, visuals, and voice. ' +
      'The guide gives you what you need to start; these add depth when you want it.',
  }
}

/** Plain-text kit intro (tests, overlap checks). PDF uses {@link composeQuickStartKitIntroContent} for bold. */
export function composeQuickStartKitIntro(): string {
  const { leadParagraph, followingParagraphs } = composeQuickStartKitIntroContent()
  return `${leadParagraph.before}${leadParagraph.highlight}${leadParagraph.after} ${followingParagraphs}`
}

/** PDF-safe section labels (no Unicode arrows — those render as stray apostrophes in some viewers). */
function guideSectionsLine(parts: string[]): string {
  return parts.join('; ')
}

/**
 * Which Brand Identity Guide sections to open this week.
 * Format: "Section: what to use it for" so the label before the colon is the destination.
 */
export function quickStartWeekGuidePointer(week: 1 | 2 | 3 | 4, form?: IdentityKitForm): string {
  switch (week) {
    case 1:
      if (form?.step1.guideFocus === 'look_more_professional') {
        return guideSectionsLine([
          'Summary: your one-line summary',
          'Voice: bio and profile tone',
          'Examples: paste-ready profile copy',
        ])
      }
      return guideSectionsLine([
        'Summary: your one-line summary and values',
        'Examples: profile and bio copy',
      ])
    case 2:
      return guideSectionsLine([
        'Voice: rules and topics',
        'Examples: lines and calls to action',
      ])
    case 3:
      return 'Look: colors, type, and wordmark options'
    case 4:
      return 'All sections: skim and fix anything that still feels off-brand'
    default:
      return ''
  }
}
