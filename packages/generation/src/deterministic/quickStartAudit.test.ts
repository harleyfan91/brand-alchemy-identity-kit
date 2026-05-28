/**
 * Cross-input audit for Quick Start checklist generation.
 * Guards invariants needed if the Brand Identity Guide Voice page points readers to a specific week.
 */
import { describe, expect, it } from 'vitest'

import {
  type BrandNarrator,
  type BusinessOperatingModel,
  type GuideFocus,
  type PrimaryGoal,
  migrateIdentityKitForm,
  type TouchpointId,
} from '@identity-kit/shared'

import { quickStartBlocks } from './coreAssembly.js'
import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'

type WeekHeading = 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4'

function weekBody(form: ReturnType<typeof migrateIdentityKitForm>, heading: WeekHeading): string {
  return quickStartBlocks(form).find((b) => b.heading === heading)?.body ?? ''
}

function baseForm(): ReturnType<typeof migrateIdentityKitForm> {
  return migrateIdentityKitForm(loadCoreSampleFixture())
}

function withInputs(
  patch: Partial<{
    brandNarrator: BrandNarrator
    guideFocus: GuideFocus
    primaryGoal: PrimaryGoal
    stage: string
    businessOperatingModel: BusinessOperatingModel
    touchpoints: TouchpointId[]
    industry: string
  }>,
): ReturnType<typeof migrateIdentityKitForm> {
  const form = baseForm()
  if (patch.brandNarrator !== undefined) form.step1.brandNarrator = patch.brandNarrator
  if (patch.guideFocus !== undefined) form.step1.guideFocus = patch.guideFocus
  if (patch.primaryGoal !== undefined) form.step1.primaryGoal = patch.primaryGoal
  if (patch.stage !== undefined) form.step1.stage = patch.stage
  if (patch.businessOperatingModel !== undefined) {
    form.step1.businessOperatingModel = patch.businessOperatingModel
  }
  if (patch.touchpoints !== undefined) form.step1.touchpoints = patch.touchpoints
  if (patch.industry !== undefined) form.step1.industry = patch.industry
  return form
}

/** Intended mapping if Voice footer points readers to Quick Start by guideFocus. */
const GUIDE_FOCUS_TARGET_WEEK: Record<Exclude<GuideFocus, ''>, WeekHeading> = {
  look_more_professional: 'Week 1',
  sound_more_consistent: 'Week 2',
  know_what_to_fix_first: 'Week 2',
  give_clear_direction: 'Week 4',
}

const COPY_ACTION =
  /\b(update|rewrite|refresh|apply|draft|publish|fix|audit|check|confirm|respond|complete|strengthen|tighten|set up)\b/i

const PROFILE_SURFACE =
  /\b(headline|bio|about|profile|description|summary|hero|listing|shop)\b/i

const NARRATORS: BrandNarrator[] = [
  'solo_expert',
  'solo_maker',
  'local_team',
  'product_led',
  'mission_community',
]

const GUIDE_FOCUSES: Exclude<GuideFocus, ''>[] = [
  'look_more_professional',
  'sound_more_consistent',
  'know_what_to_fix_first',
  'give_clear_direction',
]

const TOUCHPOINT_SCENARIOS: { label: string; touchpoints: TouchpointId[] }[] = [
  { label: 'empty', touchpoints: [] },
  { label: 'linkedin-only', touchpoints: ['linkedin'] },
  { label: 'website-only', touchpoints: ['website'] },
  { label: 'google-only', touchpoints: ['google_business'] },
  { label: 'etsy-only', touchpoints: ['marketplace_storefront'] },
  { label: 'instagram+website', touchpoints: ['instagram', 'website'] },
  { label: 'google+instagram', touchpoints: ['google_business', 'instagram'] },
  { label: 'etsy+instagram', touchpoints: ['marketplace_storefront', 'instagram'] },
  { label: 'website+email', touchpoints: ['website', 'email_newsletter'] },
]

describe('Quick Start cross-input audit', () => {
  it('Week 2 always references Voice and includes copy actions', () => {
    for (const narrator of NARRATORS) {
      for (const { label, touchpoints } of TOUCHPOINT_SCENARIOS) {
        const form = withInputs({ brandNarrator: narrator, touchpoints })
        const w2 = weekBody(form, 'Week 2')
        expect(w2, `${narrator}/${label}`).toMatch(/Voice: rules and topics|Use your Voice rules/i)
        expect(w2, `${narrator}/${label}`).toMatch(COPY_ACTION)
      }
    }
  })

  it('Week 2 guide pointer names Voice and Examples', () => {
    const form = withInputs({ touchpoints: ['linkedin'] })
    expect(weekBody(form, 'Week 2')).toMatch(/Voice.*Examples|Examples.*Voice/i)
  })

  it('Week 1 guide pointer names Voice when guideFocus is look_more_professional', () => {
    const form = withInputs({ guideFocus: 'look_more_professional', touchpoints: ['linkedin'] })
    const w1 = weekBody(form, 'Week 1')
    expect(w1).toMatch(/Summary/i)
    expect(w1).toMatch(/Voice: bio/i)
    expect(w1).not.toMatch(/^Guide:/m)
  })

  it('target week for each guideFocus includes copy/profile actions on primary channel', () => {
    const failures: string[] = []
    for (const guideFocus of GUIDE_FOCUSES) {
      const week = GUIDE_FOCUS_TARGET_WEEK[guideFocus]
      for (const narrator of NARRATORS) {
        for (const { label, touchpoints } of TOUCHPOINT_SCENARIOS) {
          const form = withInputs({ brandNarrator: narrator, guideFocus, touchpoints })
          const body = weekBody(form, week)
          const hasCopyAction = COPY_ACTION.test(body)
          const hasProfileOrVoice =
            guideFocus === 'give_clear_direction'
              ? /share your brand identity guide/i.test(body)
              : guideFocus === 'look_more_professional'
                ? PROFILE_SURFACE.test(body)
                : /\(Voice\)/i.test(body) || COPY_ACTION.test(body)
          if (!hasCopyAction || !hasProfileOrVoice) {
            failures.push(`${guideFocus}/${week}/${narrator}/${label}: copy=${hasCopyAction} profile/voice=${hasProfileOrVoice}`)
          }
        }
      }
    }
    expect(failures, failures.join('\n')).toEqual([])
  })

  it('Week 1 lead names primary channel when touchpoints are selected', () => {
    const checks: { touchpoints: TouchpointId[]; expectInLead: RegExp }[] = [
      { touchpoints: ['linkedin'], expectInLead: /LinkedIn/i },
      { touchpoints: ['google_business'], expectInLead: /Google/i },
      { touchpoints: ['website'], expectInLead: /Website/i },
      { touchpoints: ['marketplace_storefront'], expectInLead: /Etsy/i },
    ]
    for (const { touchpoints, expectInLead } of checks) {
      const form = withInputs({ touchpoints })
      const w1 = weekBody(form, 'Week 1')
      expect(w1).toMatch(expectInLead)
      expect(w1).toMatch(new RegExp(`Set up your brand on ${expectInLead.source.replace(/\\b|\\^|\\$/g, '')} first`, 'i'))
    }
  })

  it('selected touchpoint order drives Week 3 first checklist bullet (social_service)', () => {
    const form = withInputs({
      brandNarrator: 'solo_expert',
      industry: 'creative_services',
      touchpoints: ['instagram', 'linkedin'],
    })
    const first = weekBody(form, 'Week 3').split('\n').find((l) => l.startsWith('☐')) ?? ''
    expect(first).toContain('Instagram')
    expect(first).not.toContain('LinkedIn')

    form.step1.touchpoints = ['linkedin', 'instagram']
    const firstLinkedin = weekBody(form, 'Week 3').split('\n').find((l) => l.startsWith('☐')) ?? ''
    expect(firstLinkedin).toContain('LinkedIn')
  })

  it('does not use narrator-fallback secondary channel when user selected a single touchpoint', () => {
    const form = withInputs({ brandNarrator: 'solo_expert', touchpoints: ['linkedin'] })
    const w1 = weekBody(form, 'Week 1')
    expect(w1).not.toMatch(/personal website/i)
    expect(w1).toMatch(/LinkedIn/i)
  })

  it('primaryGoal changes Week 1/2 kickoff without changing explicit guideFocus', () => {
    const linkedin = withInputs({ touchpoints: ['linkedin'], guideFocus: 'sound_more_consistent' })
    linkedin.step1.primaryGoal = 'audience_growth'
    expect(weekBody(linkedin, 'Week 1')).toMatch(/repeatable content format|know what to expect/i)

    linkedin.step1.primaryGoal = 'lead_gen'
    expect(weekBody(linkedin, 'Week 1')).toMatch(/lead capture|consult|inquiry/i)
  })

  it('guideFocus changes Week 1 pointer and Week 4 handoff', () => {
    const professional = withInputs({ guideFocus: 'look_more_professional', touchpoints: ['linkedin'] })
    const handoff = withInputs({ guideFocus: 'give_clear_direction', touchpoints: ['linkedin'] })
    expect(weekBody(professional, 'Week 1')).toMatch(/Voice: bio/i)
    expect(weekBody(handoff, 'Week 1')).not.toMatch(/Voice: bio/i)
    expect(weekBody(handoff, 'Week 4')).toMatch(/whoever owns/i)
  })

  it('Week 3–4 include at most two Expand advisory checkboxes when recommendations exist', () => {
    const form = withInputs({
      industry: 'food_beverage',
      businessOperatingModel: 'customer_visits_us',
      touchpoints: ['instagram', 'facebook'],
    })
    for (const week of ['Week 3', 'Week 4'] as const) {
      const body = weekBody(form, week)
      const expandLines = body
        .split('\n')
        .filter(
          (l) =>
            l.startsWith('☐') &&
            /Claim or complete|Set up |Add a simple|Open a |Start a simple/i.test(l),
        )
      expect(expandLines.length, week).toBeLessThanOrEqual(2)
    }
  })

  it('persona fixtures: each has actionable Week 1–2 on declared touchpoints', () => {
    const personaIds = [
      'pc05-regulated-legal',
      'pc04-local-team-with-directory',
      'pc03-local-team-no-directory',
      'pc08-social-product-promotion',
      'pc06-mixed-commerce-service',
      'coffee-founder',
      'community-org',
    ]
    for (const id of personaIds) {
      const form = migrateIdentityKitForm(loadPersonaFixture(id))
      const w1 = weekBody(form, 'Week 1')
      const w2 = weekBody(form, 'Week 2')
      expect(w1, id).toMatch(COPY_ACTION)
      expect(w2, id).toMatch(/Voice: rules and topics|Use your Voice rules/i)
      for (const tp of form.step1.touchpoints.slice(0, 1)) {
        const label =
          tp === 'google_business'
            ? 'Google'
            : tp === 'marketplace_storefront'
              ? 'Etsy'
              : tp.charAt(0).toUpperCase() + tp.slice(1).replace(/_/g, ' ')
        if (label.length > 3) {
          expect(w1 + w2, `${id}/${tp}`).toMatch(new RegExp(label.split(' ')[0]!, 'i'))
        }
      }
    }
  })

  it('does not include separate stage note block in quickStartBlocks', () => {
    const form = withInputs({ stage: 'established', touchpoints: ['linkedin'] })
    const blocks = quickStartBlocks(form)
    expect(blocks.some((b) => b.heading === 'Your starting point')).toBe(false)
    expect(weekBody(form, 'Week 1')).not.toMatch(/equity in what you've already built/i)
  })

  it('coffee-founder Expand recommends Google in Week 3', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    expect(weekBody(form, 'Week 3')).toMatch(/Also worth setting up/i)
    expect(weekBody(form, 'Week 3')).toMatch(/Google/i)
  })

  it('empty touchpoints fall back to narrator primary channel in Week 1–2', () => {
    const form = withInputs({ brandNarrator: 'solo_expert', touchpoints: [] })
    const combined = `${weekBody(form, 'Week 1')}\n${weekBody(form, 'Week 2')}`
    expect(combined).toMatch(/LinkedIn/i)
  })

  it('explicit guideFocus can diverge from primaryGoal-driven Quick Start kickoff', () => {
    const form = withInputs({
      guideFocus: 'sound_more_consistent',
      primaryGoal: 'lead_gen',
      touchpoints: ['linkedin'],
    })
    expect(weekBody(form, 'Week 1')).toMatch(/lead capture|consult|inquiry/i)
    expect(weekBody(form, 'Week 2')).toMatch(/Voice: rules and topics|Use your Voice rules/i)
  })

  it('operating model shifts Week 3 cluster for solo_expert (physical vs service)', () => {
    const physical = withInputs({
      brandNarrator: 'solo_expert',
      industry: 'home_services',
      businessOperatingModel: 'we_travel_to_customers',
      touchpoints: ['google_business', 'instagram'],
    })
    expect(weekBody(physical, 'Week 3')).toMatch(/printed materials|storefront|physical/i)

    const service = withInputs({
      brandNarrator: 'solo_expert',
      industry: 'consulting_coaching',
      businessOperatingModel: 'online_only',
      touchpoints: ['linkedin', 'website'],
    })
    expect(weekBody(service, 'Week 3')).toMatch(/cover or header|slide template/i)
  })
})
