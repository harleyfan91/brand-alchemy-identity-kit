import type { IdentityKitForm } from '@identity-kit/shared'
import { assembleOfferLine } from '@identity-kit/shared'

import type { ExistingBrandEntryModel } from './existingBrandEntryScaffolds.js'
import { existingBrandEntryToBriefBlocks } from './existingBrandEntryBriefBlocks.js'
import type { ProSectionOverrides } from '../pro/proSectionOverrides.js'
import { brandAnchorSentence, brandBriefBlocks } from './coreAssembly.js'
import { depthDocRefBlock, type KitContentBlock } from './depthDocCommon.js'
import {
  formatBriefIdealCustomerForPdf,
  idealCustomerSnapshotFromIntake,
} from './idealCustomerSnapshot.js'

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
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const headline = `${step1.businessName} — ${offerLine} (${industry}, ${stage}).`
  const description = step1.businessDescription?.trim()
  if (description) return `${headline}\n\n${description}`
  return headline
}

function depthDifferentiationBody(form: IdentityKitForm): string {
  const { step7 } = form
  const diff = step7.differentiation?.trim()
  const competitors = step7.competitors
  if (competitors.length > 0 && diff) {
    return `Compared with ${competitors.join(', ')}. ${diff}`
  }
  if (competitors.length > 0 && !diff) {
    return `Named competitors: ${competitors.join(', ')}. Add a sentence on what you do differently for each when you have intake detail.`
  }
  if (diff) return diff
  return 'Use this section for a longer competitive paragraph when the guide trust cue is not enough for proposals, fundraising, or partner conversations.'
}

function depthIdealCustomerBody(form: IdentityKitForm): string {
  return formatBriefIdealCustomerForPdf(idealCustomerSnapshotFromIntake(form))
}

export function depthBriefBlocks(
  form: IdentityKitForm,
  proOverrides?: ProSectionOverrides,
  existingBrandEntry?: ExistingBrandEntryModel | null,
): KitContentBlock[] {
  const entry = existingBrandEntry ?? proOverrides?.existingBrandEntry ?? null
  const legacy = brandBriefBlocks(form)
  const byHeading = new Map(legacy.map((b) => [b.heading, b]))

  const transformation = byHeading.get('Core transformation')
  const valuesRef: KitContentBlock = {
    heading: 'Values',
    body:
      'Your selected values are listed in the Brand Identity Guide → Summary section (Core values). ' +
      'The sections below expand positioning, audience, and story.',
  }

  const coreTransformation: KitContentBlock | null = transformation
    ? {
        heading: 'Core transformation',
        body: transformation.body,
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
      const body =
        proOverrides?.briefIdealCustomerBody?.trim() || depthIdealCustomerBody(form)
      bodyBlocks.push({ heading: 'Ideal customer', body })
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
    ...(entry ? existingBrandEntryToBriefBlocks(entry) : []),
    { heading: 'Brand anchor', body: brandAnchorSentence(form) },
    ...bodyBlocks,
  ]
}
