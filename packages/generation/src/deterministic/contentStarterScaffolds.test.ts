import { describe, expect, it } from 'vitest'

import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { getNarratorProfile } from './narratorProfiles.js'
import { buildContentStarterScaffolds } from './contentStarterScaffolds.js'

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

describe('buildContentStarterScaffolds', () => {
  it('pro-smoke text fixture produces all CSP scaffold sections', () => {
    const form = loadProSmokeFixture('text')
    const scaffolds = buildContentStarterScaffolds(form)

    expect(scaffolds.oneLiner.variants.length).toBeGreaterThanOrEqual(2)
    expect(scaffolds.elevator.text.length).toBeGreaterThan(20)
    expect(scaffolds.paragraph.text.length).toBeGreaterThan(30)
    expect(scaffolds.homepageDirections.routes.length).toBeGreaterThanOrEqual(2)
    expect(scaffolds.bioShort.text.length).toBeGreaterThan(10)
    expect(scaffolds.bioLong.text.length).toBeGreaterThan(10)
    expect(scaffolds.captionStarters.starters.length).toBe(2)
    expect(scaffolds.contentPillars.pillars.length).toBeGreaterThanOrEqual(4)
  })

  it('one-liner variants include transformation and differentiator for Harbor Lane', () => {
    const form = loadProSmokeFixture('text')
    const { variants } = buildContentStarterScaffolds(form).oneLiner
    const angles = variants.map((v) => v.angle)

    expect(angles).toContain('transformation')
    expect(angles).toContain('differentiator')
    expect(variants.some((v) => v.text.includes('Harbor Lane Studio'))).toBe(true)
    for (const variant of variants) {
      expect(wordCount(variant.text)).toBeLessThanOrEqual(16)
    }
  })

  it('content pillar names match narrator profile (deterministic lock)', () => {
    const form = loadProSmokeFixture('text')
    const profile = getNarratorProfile(form.step1.brandNarrator || 'solo_expert')
    const { pillars } = buildContentStarterScaffolds(form).contentPillars

    expect(pillars.map((p) => p.name)).toEqual(profile.content_pillars.slice(0, 5))
    for (const pillar of pillars) {
      expect(pillar.prompts.length).toBe(2)
    }
  })

  it('local_team narrator uses We in short bio scaffold', () => {
    const form = loadProSmokeFixture('text')
    expect(form.step1.brandNarrator).toBe('local_team')
    const { text } = buildContentStarterScaffolds(form).bioShort
    expect(text.startsWith('We ')).toBe(true)
  })

  it('solo narrator uses I in short bio scaffold', () => {
    const form = loadPersonaFixture('lean-core')
    const { text } = buildContentStarterScaffolds(form).bioShort
    expect(text.startsWith('I ')).toBe(true)
  })

  it('homepage routes cap at three', () => {
    const form = loadProSmokeFixture('text')
    const { routes } = buildContentStarterScaffolds(form).homepageDirections
    expect(routes.length).toBeLessThanOrEqual(3)
    for (const route of routes) {
      expect(route.headline.length).toBeGreaterThan(0)
      expect(route.subhead.length).toBeGreaterThan(0)
    }
  })
})
