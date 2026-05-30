import {
  assembleOfferLine,
  assembleTransformationLine,
  type IdentityKitForm,
} from '@identity-kit/shared'

import { buildBrandIdentityGuideModel } from './brandIdentityGuideModel.js'
import { resolveCtaVariationScaffoldGroups } from './ctaVariationScaffolds.js'
import { depthDocRefBlock } from './depthDocCommon.js'

export type VoicePlaybookEmailTemplateScaffold = {
  name: string
  subject: string
  body: string
}

export type VoicePlaybookBeforeAfterScaffold = {
  before: string
  after: string
}

export type VoicePlaybookPage3Model = {
  kitRef: { heading: string; body: string }
  emailTemplates: VoicePlaybookEmailTemplateScaffold[]
  beforeAfter: VoicePlaybookBeforeAfterScaffold[]
  ctaGroups: ReturnType<typeof resolveCtaVariationScaffoldGroups>
}

function buildEmailScaffolds(form: IdentityKitForm): VoicePlaybookEmailTemplateScaffold[] {
  const name = form.step1.businessName.trim()
  const offerLine = assembleOfferLine(form.step1.offer, form.step1.industry)
  const transformationLine = assembleTransformationLine(form.step1.transformation, form.step1.industry)

  const welcomeBody = [
    offerLine ? `Thanks for connecting with ${name}. ${offerLine.charAt(0).toUpperCase()}${offerLine.slice(1)}.` : `Thanks for connecting with ${name}.`,
    transformationLine ? `${transformationLine}` : 'We will follow up with a clear next step.',
  ].join(' ')

  const followUpBody = [
    `Checking in from ${name}.`,
    offerLine ? `If you are still exploring ${offerLine.toLowerCase().replace(/\.$/, '')}, reply here and we will point you to the right starting place.` : 'Reply if you would like help taking the next step.',
  ].join(' ')

  return [
    {
      name: 'Welcome',
      subject: `Welcome — ${name}`,
      body: welcomeBody,
    },
    {
      name: 'Follow-up',
      subject: `Following up — ${name}`,
      body: followUpBody,
    },
  ]
}

export function buildVoicePlaybookPage3Model(form: IdentityKitForm): VoicePlaybookPage3Model {
  const guide = buildBrandIdentityGuideModel(form)
  const beforeAfter =
    guide.examples.beforeAfter.length > 0
      ? guide.examples.beforeAfter.map((pair) => ({ before: pair.before, after: pair.after }))
      : [
          {
            before: 'We help businesses with branding and marketing.',
            after: `${form.step1.businessName.trim()} helps ${assembleOfferLine(form.step1.offer, form.step1.industry) || 'clients'} show up with clarity.`,
          },
        ]

  return {
    kitRef: depthDocRefBlock('Examples', 'email voice, before/after rewrites, and CTA alternatives'),
    emailTemplates: buildEmailScaffolds(form),
    beforeAfter,
    ctaGroups: resolveCtaVariationScaffoldGroups(form),
  }
}
