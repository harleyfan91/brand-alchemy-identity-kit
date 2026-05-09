import { describe, expect, it } from 'vitest'
import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { composePersonalityStoryQuote } from './personalityStoryQuote.js'

describe('composePersonalityStoryQuote', () => {
  it('anchors core-sample with brand name and lands a causal commitment', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    expect(composePersonalityStoryQuote(form)).toBe(
      'Northline Studio started as side projects that became the main thing after seeing peers struggle to describe what they do; I help independents sound as good as they are.',
    )
  })

  it('returns undefined for lean-core without origin prose', () => {
    const form = loadPersonaFixture('lean-core')
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('returns undefined when combined intake is below the substance floor', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step5.originSummary = 'One two three four.'
    form.step5.motivation = 'Five six seven eight.'
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('keeps first-person motivation after ", and "', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step5.originSummary = 'Started as side projects that became the main thing.'
    form.step5.motivation =
      'I wanted to help peers say what they do with clarity and confidence in every room.'
    expect(composePersonalityStoryQuote(form)).toMatch(
      /^Northline Studio started as side projects.*, and I wanted/,
    )
  })

  it('omits single-clause originSummary that has no commitment signal', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step5.motivation = ''
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('dedupes identical summary and motivation to one sentence', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const line = 'Started as side projects that became the main thing.'
    form.step5.originSummary = line
    form.step5.motivation = line
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('suppresses casual causal frame for legal industry (falls back to oneLine downstream)', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.industry = 'legal_professional_services'
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('suppresses casual causal frame for professional tone + high formality', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step3.tonePreset = 'professional'
    form.step3.voiceSliders = { ...form.step3.voiceSliders, formality: 80 }
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })

  it('uses we for mission clause when narrator is local_team', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step1.brandNarrator = 'local_team'
    expect(composePersonalityStoryQuote(form)).toMatch(/; We help independents sound as good as they are\.$/)
  })

  it('returns undefined for observation-only motivation without mission support', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step5.originSummary = ''
    form.step5.motivation = 'Saw peers struggle to describe what they do.'
    form.step4.missionStatement = ''
    expect(composePersonalityStoryQuote(form)).toBeUndefined()
  })
})
