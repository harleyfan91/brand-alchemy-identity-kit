import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import {
  inferQuickStartExpandRecommendations,
  recommendableTouchpointQueue,
  resolveQuickStartSegment,
} from './quickStartRecommendations.js'
import { quickStartBlocks } from './coreAssembly.js'

function weekBody(form: ReturnType<typeof migrateIdentityKitForm>, week: 'Week 3' | 'Week 4'): string {
  return quickStartBlocks(form).find((b) => b.heading === week)?.body ?? ''
}

describe('quickStartRecommendations', () => {
  it('coffee shop (IG+FB, walk-in food) recommends Google then website — not six PDF lines', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    expect(resolveQuickStartSegment(form)).toBe('S1')
    const rec = inferQuickStartExpandRecommendations(form)
    expect(rec.r1).toBe('google_business')
    expect(rec.r2).toBe('website')
    expect(rec.considerLater).toContain('email_newsletter')
    expect(recommendableTouchpointQueue(form).length).toBeLessThanOrEqual(6)

    const w3 = weekBody(form, 'Week 3')
    expect(w3).toMatch(/Also worth setting up when you're ready/i)
    expect(w3).toMatch(/Google/i)
    expect(w3).not.toMatch(/LinkedIn/i)
    const expandSection = w3.split(/Also worth setting up when you're ready/i)[1] ?? ''
    const expandCheckboxes = expandSection.split('\n').filter((l) => l.startsWith('☐'))
    expect(expandCheckboxes.length).toBeLessThanOrEqual(2)
  })

  it('subtype: food local review-driven promotes Yelp before website when both missing', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'food_beverage'
    form.step1.businessOperatingModel = 'customer_visits_us'
    form.step1.primaryGoal = 'direct_sales'
    form.step1.touchpoints = ['instagram', 'website']
    const queue = recommendableTouchpointQueue(form)
    expect(queue[0]).toBe('google_business')
    expect(queue[1]).toBe('yelp')
  })

  it('pc05 legal LinkedIn-only recommends website — not Google', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('pc05-regulated-legal'))
    expect(resolveQuickStartSegment(form)).toBe('S2')
    const rec = inferQuickStartExpandRecommendations(form)
    expect(rec.r1).toBe('website')
    expect(rec.r2).toBe('email_newsletter')
    expect(rec.queue).not.toContain('google_business')
  })

  it('subtype: professional B2B online promotes LinkedIn before Facebook', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('pc05-regulated-legal'))
    form.step1.businessOperatingModel = 'online_only'
    form.step1.primaryGoal = 'lead_gen'
    form.step1.touchpoints = ['website']
    const queue = recommendableTouchpointQueue(form)
    expect(queue.indexOf('linkedin')).toBeLessThan(queue.indexOf('facebook'))
  })

  it('local_team walk-in studio without Google selected recommends Google first in Expand', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('pc04-local-team-with-directory'))
    form.step1.industry = 'creative_services'
    form.step1.businessOperatingModel = 'customer_visits_us'
    form.step1.touchpoints = ['instagram', 'website']
    expect(inferQuickStartExpandRecommendations(form).r1).toBe('google_business')
  })

  it('solo_expert linkedin-only Week 1 does not mention narrator fallback website', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('pc05-regulated-legal'))
    const w1 = quickStartBlocks(form).find((b) => b.heading === 'Week 1')?.body ?? ''
    expect(w1).not.toMatch(/personal website/i)
    expect(w1).toMatch(/LinkedIn/i)
  })

  it('pass-2: beauty_personal_care routes to S3 and can recommend Pinterest', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'beauty_personal_care'
    form.step1.businessOperatingModel = 'online_only'
    form.step1.touchpoints = ['instagram']
    expect(resolveQuickStartSegment(form)).toBe('S3')
    const queue = recommendableTouchpointQueue(form)
    expect(queue).toContain('pinterest')
    expect(queue[0]).toBe('website')
  })

  it('pass-2 subtype: beauty local service promotes Google before Pinterest', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'beauty_personal_care'
    form.step1.businessOperatingModel = 'customer_visits_us'
    form.step1.touchpoints = ['instagram']
    const rec = inferQuickStartExpandRecommendations(form)
    expect(rec.r1).toBe('google_business')
    expect(rec.queue.indexOf('pinterest')).toBeGreaterThan(rec.queue.indexOf('website'))
  })

  it('pass-2: real_estate routes to S4 and leads with Google + Website', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'real_estate'
    form.step1.businessOperatingModel = 'hybrid'
    form.step1.touchpoints = ['instagram']
    expect(resolveQuickStartSegment(form)).toBe('S4')
    const rec = inferQuickStartExpandRecommendations(form)
    expect(rec.r1).toBe('google_business')
    expect(rec.r2).toBe('website')
    expect(rec.queue).not.toContain('yelp')
  })

  it('pass-2: industry other routes by narrator/operating model', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'other'
    form.step1.brandNarrator = 'mission_community'
    form.step1.businessOperatingModel = 'online_only'
    expect(resolveQuickStartSegment(form)).toBe('S5')

    form.step1.brandNarrator = 'product_led'
    form.step1.touchpoints = ['marketplace_storefront']
    expect(resolveQuickStartSegment(form)).toBe('S6')
  })

  it('pass-2 subtype: pet services local includes Nextdoor in queue', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('coffee-founder'))
    form.step1.industry = 'pet_services'
    form.step1.businessOperatingModel = 'hybrid'
    form.step1.touchpoints = ['instagram']
    const queue = recommendableTouchpointQueue(form)
    expect(queue[0]).toBe('google_business')
    expect(queue).toContain('nextdoor')
  })

  it('subtype: S6 marketplace-first promotes Instagram + Pinterest before website', () => {
    const form = migrateIdentityKitForm(loadPersonaFixture('pc08-social-product-promotion'))
    form.step1.industry = 'retail'
    form.step1.businessOperatingModel = 'online_only'
    form.step1.touchpoints = ['marketplace_storefront']
    const queue = recommendableTouchpointQueue(form)
    expect(queue[0]).toBe('instagram')
    expect(queue[1]).toBe('pinterest')
  })
})
