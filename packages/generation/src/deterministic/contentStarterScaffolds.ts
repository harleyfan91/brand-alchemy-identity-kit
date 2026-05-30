import {
  assembleOfferLine,
  assembleTransformationLine,
  resolveBuyerArchetypeTitle,
  resolveOfferSelections,
  resolveTransformationSelections,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { getIndustryVoiceProfile } from './industryProfiles.js'
import { getNarratorProfile } from './narratorProfiles.js'

export type ContentStarterOneLinerAngle = 'transformation' | 'audience' | 'differentiator'

export type ContentStarterOneLinerScaffold = {
  angle: ContentStarterOneLinerAngle
  text: string
  fieldsCited: string[]
}

export type ContentStarterHomepageRoute = {
  headline: string
  subhead: string
  fieldsCited: string[]
}

export type ContentStarterPillarScaffold = {
  name: string
  oneLine: string
  prompts: string[]
  fieldsCited: string[]
}

export type ContentStarterScaffolds = {
  oneLiner: { variants: ContentStarterOneLinerScaffold[]; fieldsCited: string[] }
  elevator: { text: string; fieldsCited: string[] }
  paragraph: { text: string; fieldsCited: string[] }
  homepageDirections: { routes: ContentStarterHomepageRoute[]; fieldsCited: string[] }
  bioShort: { text: string; fieldsCited: string[] }
  bioLong: { text: string; fieldsCited: string[] }
  captionStarters: { starters: { text: string; fieldsCited: string[] }[]; fieldsCited: string[] }
  contentPillars: { pillars: ContentStarterPillarScaffold[]; fieldsCited: string[] }
}

function uniqueFields(fields: string[]): string[] {
  return [...new Set(fields.filter(Boolean))]
}

function trimWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text.trim().replace(/\s*[.!?]+\s*$/, '')
  const trimmed = words.slice(0, maxWords).join(' ')
  return `${trimmed.replace(/[,;—–-]\s*$/, '')}.`
}

function firstSentence(value: string | undefined): string {
  const t = value?.trim()
  if (!t) return ''
  return t.split(/(?<=[.!?])\s+/)[0]?.trim() ?? t
}

function narratorVoice(form: IdentityKitForm): { subject: string; fieldsCited: string[] } {
  const id = form.step1.brandNarrator || 'solo_expert'
  const fieldsCited = ['brandNarrator']
  if (id === 'solo_expert' || id === 'solo_maker') return { subject: 'I', fieldsCited }
  if (id === 'product_led') return { subject: form.step1.businessName.trim(), fieldsCited }
  return { subject: 'We', fieldsCited }
}

function buildOneLinerScaffolds(form: IdentityKitForm): ContentStarterOneLinerScaffold[] {
  const { step1, step2, step7 } = form
  const name = step1.businessName.trim()
  const audienceTitle = resolveBuyerArchetypeTitle(step2.customerArchetype, step1.industry)
  const { audienceLabel } = resolveOfferSelections(step1.offer, step1.industry)
  const { afterLabel } = resolveTransformationSelections(step1.transformation, step1.industry)
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const variants: ContentStarterOneLinerScaffold[] = []

  const afterShort = afterLabel?.trim()
  if (afterShort) {
    const audienceBit = audienceTitle ? ` ${audienceTitle.toLowerCase()}` : ''
    variants.push({
      angle: 'transformation',
      text: trimWords(`${name} helps${audienceBit} get to ${afterShort}.`, 16),
      fieldsCited: uniqueFields([
        'businessName',
        'transformation.afterId',
        step2.customerArchetype ? 'customerArchetype' : '',
      ]),
    })
  } else {
    const transformationLine = assembleTransformationLine(step1.transformation, step1.industry)
    if (transformationLine) {
      variants.push({
        angle: 'transformation',
        text: trimWords(`${name} ${transformationLine.charAt(0).toLowerCase()}${transformationLine.slice(1)}`, 16),
        fieldsCited: ['businessName', 'transformation'],
      })
    }
  }

  const audienceLead = audienceTitle || audienceLabel
  if (audienceLead && offerLine) {
    variants.push({
      angle: 'audience',
      text: trimWords(`${name}: ${offerLine}.`, 16),
      fieldsCited: uniqueFields(['businessName', 'offer', step2.customerArchetype ? 'customerArchetype' : 'offer.audienceId']),
    })
  }

  const diff = step7.differentiation?.trim()
  if (diff) {
    variants.push({
      angle: 'differentiator',
      text: trimWords(`${name} — ${firstSentence(diff).replace(/\.$/, '')}.`, 16),
      fieldsCited: ['businessName', 'differentiation'],
    })
  } else if (offerLine) {
    variants.push({
      angle: 'differentiator',
      text: trimWords(`${name} focuses on ${offerLine}.`, 16),
      fieldsCited: ['businessName', 'offer'],
    })
  }

  return variants
}

function buildElevatorScaffold(form: IdentityKitForm): { text: string; fieldsCited: string[] } {
  const { step1, step2 } = form
  const name = step1.businessName.trim()
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const transformationLine = assembleTransformationLine(step1.transformation, step1.industry)
  const audienceTitle = resolveBuyerArchetypeTitle(step2.customerArchetype, step1.industry)
  const { afterLabel } = resolveTransformationSelections(step1.transformation, step1.industry)

  const parts: string[] = []
  const fieldsCited: string[] = ['businessName']

  if (offerLine) {
    parts.push(`${name} ${offerLine.charAt(0).toLowerCase()}${offerLine.slice(1)}.`)
    fieldsCited.push('offer')
  }
  if (transformationLine) {
    parts.push(transformationLine)
    fieldsCited.push('transformation')
  } else if (afterLabel?.trim()) {
    parts.push(`Clients move toward ${afterLabel.trim()}.`)
    fieldsCited.push('transformation.afterId')
  }
  if (audienceTitle) {
    parts.push(`Built for ${audienceTitle.toLowerCase()}.`)
    fieldsCited.push('customerArchetype')
  }

  const text = parts.join(' ').trim() || `${name} offers clear, consistent brand direction.`
  return { text: trimWords(text, 60), fieldsCited: uniqueFields(fieldsCited) }
}

function buildParagraphScaffold(form: IdentityKitForm): { text: string; fieldsCited: string[] } {
  const { step1, step2, step7 } = form
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const audienceTitle = resolveBuyerArchetypeTitle(step2.customerArchetype, step1.industry)
  const transformationLine = assembleTransformationLine(step1.transformation, step1.industry)
  const fieldsCited: string[] = ['businessName']

  const sentences: string[] = []
  if (offerLine) {
    sentences.push(`${step1.businessName.trim()} ${offerLine.charAt(0).toLowerCase()}${offerLine.slice(1)}.`)
    fieldsCited.push('offer')
  }
  if (audienceTitle) {
    sentences.push(`The work is for ${audienceTitle.toLowerCase()}.`)
    fieldsCited.push('customerArchetype')
  }
  if (transformationLine) {
    sentences.push(transformationLine)
    fieldsCited.push('transformation')
  }
  const diff = step7.differentiation?.trim()
  if (diff) {
    sentences.push(firstSentence(diff))
    fieldsCited.push('differentiation')
  }
  const description = step1.businessDescription?.trim()
  if (description) {
    sentences.push(firstSentence(description))
    fieldsCited.push('businessDescription')
  }

  const text = sentences.join(' ').trim() || `${step1.businessName.trim()} delivers focused brand clarity.`
  return { text: trimWords(text, 120), fieldsCited: uniqueFields(fieldsCited) }
}

function buildHomepageDirectionsScaffold(form: IdentityKitForm): {
  routes: ContentStarterHomepageRoute[]
  fieldsCited: string[]
} {
  const { step1, step2, step7 } = form
  const name = step1.businessName.trim()
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const { afterLabel, mechanismLabel } = resolveTransformationSelections(step1.transformation, step1.industry)
  const audienceTitle = resolveBuyerArchetypeTitle(step2.customerArchetype, step1.industry)
  const diff = step7.differentiation?.trim()
  const routes: ContentStarterHomepageRoute[] = []

  const headlineFromGoal =
    step1.primaryGoal === 'direct_sales'
      ? offerLine || `Shop ${name}`
      : step1.primaryGoal === 'audience_growth'
        ? afterLabel
          ? `Grow with ${name}`
          : `Follow ${name}`
        : step1.primaryGoal === 'retention'
          ? `Stay with ${name}`
          : afterLabel
            ? `Look ${afterLabel.toLowerCase()}`
            : offerLine || name

  routes.push({
    headline: trimWords(String(headlineFromGoal), 10),
    subhead: trimWords(
      audienceTitle ? `For ${audienceTitle.toLowerCase()} who want a clear next step.` : offerLine || 'Clear next steps.',
      18,
    ),
    fieldsCited: uniqueFields([
      'primaryGoal',
      step2.customerArchetype ? 'customerArchetype' : 'offer',
      afterLabel ? 'transformation.afterId' : 'offer',
    ]),
  })

  if (mechanismLabel?.trim() || afterLabel?.trim()) {
    routes.push({
      headline: trimWords(afterLabel ? `Get to ${afterLabel}` : offerLine || name, 10),
      subhead: trimWords(
        mechanismLabel ? `Through ${mechanismLabel.toLowerCase()}.` : 'With a system you can maintain.',
        18,
      ),
      fieldsCited: uniqueFields(['transformation.afterId', 'transformation.mechanismId']),
    })
  }

  if (diff) {
    routes.push({
      headline: trimWords(firstSentence(diff).replace(/\.$/, ''), 10),
      subhead: trimWords(
        transformationLineOrOffer(form),
        18,
      ),
      fieldsCited: ['differentiation', 'transformation'],
    })
  }

  return {
    routes: routes.slice(0, 3),
    fieldsCited: uniqueFields(routes.flatMap((r) => r.fieldsCited)),
  }
}

function transformationLineOrOffer(form: IdentityKitForm): string {
  return (
    assembleTransformationLine(form.step1.transformation, form.step1.industry) ||
    assembleOfferLine(form.step1.offer, form.step1.industry) ||
    'Built for owners who need consistency, not complexity.'
  )
}

function buildBioShortScaffold(form: IdentityKitForm): { text: string; fieldsCited: string[] } {
  const { step1 } = form
  const { subject, fieldsCited: narratorFields } = narratorVoice(form)
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const profile = getNarratorProfile(step1.brandNarrator || 'solo_expert')
  const ctaSeed = profile.cta_patterns[0] ?? 'Learn more'

  const fieldsCited = [...narratorFields, 'offer']
  let text: string
  if (subject === 'I') {
    text = offerLine ? `${subject} ${offerLine.charAt(0).toLowerCase()}${offerLine.slice(1)}.` : `${step1.businessName.trim()}.`
    text = `${text} ${ctaSeed}.`
  } else if (subject === 'We') {
    text = offerLine
      ? `${subject} ${offerLine.charAt(0).toLowerCase()}${offerLine.slice(1)}. ${ctaSeed}.`
      : `${step1.businessName.trim()}. ${ctaSeed}.`
  } else {
    text = offerLine ? `${subject} — ${offerLine}. ${ctaSeed}.` : `${subject}. ${ctaSeed}.`
    fieldsCited.push('businessName')
  }

  return { text: trimWords(text, 30), fieldsCited: uniqueFields(fieldsCited) }
}

function buildBioLongScaffold(form: IdentityKitForm): { text: string; fieldsCited: string[] } {
  const { step1, step5 } = form
  const offerLine = assembleOfferLine(step1.offer, step1.industry)
  const transformationLine = assembleTransformationLine(step1.transformation, step1.industry)
  const origin = step5.originSummary?.trim()
  const fieldsCited: string[] = ['businessName']

  const parts: string[] = []
  if (origin) {
    parts.push(firstSentence(origin))
    fieldsCited.push('originSummary')
  }
  if (offerLine) {
    parts.push(`${step1.businessName.trim()} ${offerLine.charAt(0).toLowerCase()}${offerLine.slice(1)}.`)
    fieldsCited.push('offer')
  } else if (transformationLine) {
    parts.push(transformationLine)
    fieldsCited.push('transformation')
  }

  const text = parts.join(' ').trim() || `${step1.businessName.trim()} helps clients show up with clarity and consistency.`
  return { text: trimWords(text, 60), fieldsCited: uniqueFields(fieldsCited) }
}

function buildCaptionStarterStubs(form: IdentityKitForm): {
  starters: { text: string; fieldsCited: string[] }[]
  fieldsCited: string[]
} {
  const industry = getIndustryVoiceProfile(form.step1.industry)
  const terms = industry.preferredTerms.slice(0, 2)
  const name = form.step1.businessName.trim()

  const starters =
    terms.length >= 2
      ? [
          {
            text: trimWords(`What ${terms[0]} looks like at ${name} this week.`, 25),
            fieldsCited: ['businessName', 'industry'],
          },
          {
            text: trimWords(`One focus for us right now: ${terms[1]}.`, 25),
            fieldsCited: ['businessName', 'industry'],
          },
        ]
      : [
          {
            text: trimWords(`Something we're working on at ${name} this week.`, 25),
            fieldsCited: ['businessName'],
          },
          {
            text: trimWords(`A quick note on how we help clients move forward.`, 25),
            fieldsCited: ['businessName'],
          },
        ]

  return { starters, fieldsCited: uniqueFields(starters.flatMap((s) => s.fieldsCited)) }
}

function buildContentPillarScaffolds(form: IdentityKitForm): {
  pillars: ContentStarterPillarScaffold[]
  fieldsCited: string[]
} {
  const profile = getNarratorProfile(form.step1.brandNarrator || 'solo_expert')
  const industry = getIndustryVoiceProfile(form.step1.industry)
  const term = industry.preferredTerms[0] ?? 'clear outcomes'
  const { afterLabel } = resolveTransformationSelections(form.step1.transformation, form.step1.industry)

  const pillars = profile.content_pillars.slice(0, 5).map((name, index) => {
    const oneLine =
      index === 0 && afterLabel?.trim()
        ? `Connect ${name.toLowerCase()} to ${afterLabel.trim().toLowerCase()}.`
        : `Share ${name.toLowerCase()} with a focus on ${term}.`
    const prompts = [
      `What is one example of ${name.toLowerCase()} from this month?`,
      `What question do clients ask about ${name.toLowerCase()}?`,
    ]
    return {
      name,
      oneLine: trimWords(oneLine, 30),
      prompts: prompts.map((p) => trimWords(p, 25)),
      fieldsCited: uniqueFields([
        'brandNarrator',
        'industry',
        index === 0 && afterLabel ? 'transformation.afterId' : '',
      ]),
    }
  })

  return {
    pillars,
    fieldsCited: uniqueFields(['brandNarrator', 'industry', ...(afterLabel ? ['transformation.afterId'] : [])]),
  }
}

/**
 * Deterministic CSP scaffolds — ship on --no-ai and as ai_enhanced rewrite anchors.
 * @see docs/specs/CONTENT_STARTER_PACK.md
 */
export function buildContentStarterScaffolds(form: IdentityKitForm): ContentStarterScaffolds {
  const oneLinerVariants = buildOneLinerScaffolds(form)
  const elevator = buildElevatorScaffold(form)
  const paragraph = buildParagraphScaffold(form)
  const homepageDirections = buildHomepageDirectionsScaffold(form)
  const bioShort = buildBioShortScaffold(form)
  const bioLong = buildBioLongScaffold(form)
  const captionStarters = buildCaptionStarterStubs(form)
  const contentPillars = buildContentPillarScaffolds(form)

  return {
    oneLiner: {
      variants: oneLinerVariants,
      fieldsCited: uniqueFields(oneLinerVariants.flatMap((v) => v.fieldsCited)),
    },
    elevator,
    paragraph,
    homepageDirections,
    bioShort,
    bioLong,
    captionStarters,
    contentPillars,
  }
}
