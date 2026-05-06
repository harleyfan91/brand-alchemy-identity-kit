import { describe, expect, it } from 'vitest'
import { migrateIdentityKitForm } from '@identity-kit/shared'

import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { composePersonalityStoryQuote } from './personalityStoryQuote.js'

describe('composePersonalityStoryQuote', () => {
  it('merges core-sample originSummary and motivation into one clause', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    expect(composePersonalityStoryQuote(form)).toBe(
      'Started as side projects that became the main thing, and saw peers struggle to describe what they do.',
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
    expect(composePersonalityStoryQuote(form)).toMatch(/^Started as side projects.*, and I wanted/)
  })

  it('uses a single substantive originSummary when motivation is absent', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    form.step5.motivation = ''
    expect(composePersonalityStoryQuote(form)).toBe(
      'Started as side projects that became the main thing.',
    )
  })

  it('dedupes identical summary and motivation to one sentence', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const line = 'Started as side projects that became the main thing.'
    form.step5.originSummary = line
    form.step5.motivation = line
    expect(composePersonalityStoryQuote(form)).toBe(line)
  })
})
