import { guideFolioRef } from './depthDocCommon.js'

export const QUICK_START_BRAND_IDENTITY_GUIDE_TITLE = 'Brand Identity Guide'

export type QuickStartKitIntroContent = {
  leadParagraph: { before: string; highlight: string; after: string }
  followingParagraphs: string
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

export function quickStartWeekGuidePointer(week: 1 | 2 | 3 | 4): string {
  switch (week) {
    case 1:
      return `Guide: ${guideFolioRef('Summary')} for your one-line summary and values; ${guideFolioRef('Examples')} when you paste profile or bio copy.`
    case 2:
      return `Guide: ${guideFolioRef('Voice')} for rules and topics; ${guideFolioRef('Examples')} for lines and calls to action.`
    case 3:
      return `Guide: ${guideFolioRef('Look')} for colors, type, and wordmark options.`
    case 4:
      return 'Guide: skim all sections and fix anything that still feels off-brand.'
    default:
      return ''
  }
}
