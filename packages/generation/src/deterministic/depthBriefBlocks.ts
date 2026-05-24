import type { IdentityKitForm } from '@identity-kit/shared'

import { brandAnchorSentence, brandBriefBlocks } from './coreAssembly.js'
import { depthDocRefBlock, guideFolioRef, type KitContentBlock } from './depthDocCommon.js'

const industryLabels: Record<string, string> = {
  creative_services: 'Creative Services',
  health_wellness: 'Health and Wellness',
  beauty_personal_care: 'Beauty and Personal Care',
  fitness_sports: 'Fitness and Sports',
  technology: 'Technology',
  food_beverage: 'Food and Beverage',
  home_services: 'Home Services',
  real_estate: 'Real Estate',
  education: 'Education',
  finance: 'Finance',
  legal_professional_services: 'Legal and Professional Services',
  consulting_coaching: 'Consulting and Coaching',
  construction_trades: 'Construction and Trades',
  automotive: 'Automotive',
  photography_media: 'Photography and Media',
  pet_services: 'Pet Services',
  retail: 'Retail',
  nonprofit_community: 'Nonprofit and Community',
  other: 'Other',
}

const stageLabels: Record<string, string> = {
  idea: 'Idea stage',
  new: 'New business',
  growing: 'Growing',
  established: 'Established',
}

function depthBrandOverviewBody(form: IdentityKitForm): string {
  const { step1 } = form
  const industry = industryLabels[step1.industry] ?? step1.industry
  const stage = stageLabels[step1.stage] ?? step1.stage
  return (
    `For the customer-facing one-liner, see ${guideFolioRef('Summary')} (what you do).\n\n` +
    `${step1.businessName} operates in ${industry} at the ${stage} stage. ` +
    'Use this section when you need to explain category, maturity, and scope to collaborators or partners — the guide keeps the short paste-ready line.'
  )
}

function depthDifferentiationBody(form: IdentityKitForm): string {
  const { step7 } = form
  const diff = step7.differentiation?.trim()
  const competitors = step7.competitors
  const ref = `For the on-page trust cue, see ${guideFolioRef('Personality')} (Trust & story).`
  if (competitors.length > 0 && diff) {
    return `${ref}\n\nCompared with ${competitors.join(', ')}. ${diff}`
  }
  if (competitors.length > 0 && !diff) {
    return `${ref}\n\nNamed competitors: ${competitors.join(', ')}. Add a sentence on what you do differently for each when you have intake detail.`
  }
  if (diff) return `${ref}\n\n${diff}`
  return (
    `${ref}\n\n` +
    'Use this section for a longer competitive paragraph when the guide trust cue is not enough for proposals, fundraising, or partner conversations.'
  )
}

function depthIdealCustomerBody(form: IdentityKitForm): string {
  const { step2 } = form
  const gapParts: string[] = []
  if (step2.painPoints?.trim()) gapParts.push(`Pain points: ${step2.painPoints.trim()}`)
  if (step2.desiredOutcomes?.trim()) gapParts.push(`Desired outcomes: ${step2.desiredOutcomes.trim()}`)
  const ref = `For who you serve at a glance, see ${guideFolioRef('Summary')} (who it's for).`
  if (gapParts.length === 0) {
    return (
      `${ref}\n\n` +
      'Use intake pain points and desired outcomes here when you need sharper positioning notes for proposals, sales, and content — the guide keeps the short audience line.'
    )
  }
  return `${ref}\n\n${gapParts.join(' ')}`
}

export function depthBriefBlocks(form: IdentityKitForm): KitContentBlock[] {
  const legacy = brandBriefBlocks(form)
  const byHeading = new Map(legacy.map((b) => [b.heading, b]))

  const transformation = byHeading.get('Core transformation')
  const valuesRef: KitContentBlock = {
    heading: 'Values',
    body:
      `Your selected values are listed in the ${guideFolioRef('Summary')} section (Core values). ` +
      'Use the guide for the short list. The sections below expand positioning, audience, and story.',
  }

  const coreTransformation: KitContentBlock | null = transformation
    ? {
        heading: 'Core transformation',
        body:
          `For the one-line version, see ${guideFolioRef('Summary')}. ` +
          `For how you come across in conversation, see ${guideFolioRef('Personality')}.\n\n` +
          transformation.body,
      }
    : null

  const orderedHeadings = [
    'Brand overview',
    'Ideal customer',
    'Core transformation',
    'Brand story angle',
    'Differentiation',
    'Values',
  ] as const

  const bodyBlocks: KitContentBlock[] = []
  for (const heading of orderedHeadings) {
    if (heading === 'Values') {
      bodyBlocks.push(valuesRef)
      continue
    }
    if (heading === 'Core transformation' && coreTransformation) {
      bodyBlocks.push(coreTransformation)
      continue
    }
    if (heading === 'Brand overview') {
      bodyBlocks.push({ heading: 'Brand overview', body: depthBrandOverviewBody(form) })
      continue
    }
    if (heading === 'Ideal customer') {
      bodyBlocks.push({ heading: 'Ideal customer', body: depthIdealCustomerBody(form) })
      continue
    }
    if (heading === 'Differentiation') {
      bodyBlocks.push({ heading: 'Differentiation', body: depthDifferentiationBody(form) })
      continue
    }
    const block = byHeading.get(heading)
    if (block) bodyBlocks.push(block)
  }

  return [
    depthDocRefBlock('Summary and Personality', 'strategy and positioning'),
    { heading: 'Brand anchor', body: brandAnchorSentence(form) },
    ...bodyBlocks,
  ]
}
