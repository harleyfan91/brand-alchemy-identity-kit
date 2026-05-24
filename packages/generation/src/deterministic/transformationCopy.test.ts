import { describe, expect, it } from 'vitest'

import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'
import { brandAnchorSentence } from './coreAssembly.js'
import { composeBrandOneLine } from './brandIdentityGuideModel.js'
import { brandBriefBlocks } from './coreAssembly.js'
import {
  customerFacingTransformationLine,
  ensureRelativeClause,
  isOrgTransformationLanguage,
  parseTransformationParts,
  shouldSplitMechanism,
} from './transformationCopy.js'

describe('transformationCopy', () => {
  it('ensureRelativeClause inserts that before subject-led relatives', () => {
    expect(ensureRelativeClause('a recognized hub neighbors know how to support')).toBe(
      'a recognized hub that neighbors know how to support',
    )
  })

  it('community-org uses org framing and splits mechanism from a relative after-state', () => {
    const form = loadPersonaFixture('community-org')
    const line = customerFacingTransformationLine(form)
    expect(line).toMatch(/The work moves from scattered volunteer effort/)
    expect(line).toContain('recognized hub that neighbors know how to support')
    expect(line).toMatch(/makes that possible/)
    expect(line).not.toMatch(/helps people go from/i)

    const anchor = brandBriefBlocks(form).find((b) => b.heading === 'Brand anchor')?.body ?? ''
    const oneLine = composeBrandOneLine(anchor)
    expect(oneLine).toContain('exists for')
    expect(oneLine).toMatch(/The work moves from/)
    expect(oneLine).not.toMatch(/helps people go from/i)
  })

  it('solo_expert creative_services uses person framing for customer journey states', () => {
    const form = loadCoreSampleFixture()
    const line = customerFacingTransformationLine(form)
    const parts = parseTransformationParts(form)
    expect(line).toMatch(/helps people move from/)
    expect(line).toContain(parts.before)
    expect(line).toContain(parts.after)
    expect(isOrgTransformationLanguage(parts.before, parts.after)).toBe(false)
  })

  it('mission_community classifies org language even with customer-like after labels', () => {
    expect(isOrgTransformationLanguage('scattered volunteer effort', 'a recognized hub')).toBe(true)
    expect(shouldSplitMechanism('a recognized hub that neighbors know how to support', 'consistent distributions')).toBe(
      true,
    )
  })

  it('covers partial intake combinations without empty or broken sentences', () => {
    const form = loadCoreSampleFixture()
    const base = form.step1.transformation

    const cases: Array<{ beforeId?: string; afterId?: string; mechanismId?: string; other?: Partial<typeof base> }> = [
      { beforeId: '', afterId: '', mechanismId: '' },
      { beforeId: 'scattered_messaging', afterId: '', mechanismId: '' },
      { beforeId: '', afterId: 'confident_story', mechanismId: '' },
      { beforeId: '', afterId: '', mechanismId: 'positioning_and_copy' },
      { beforeId: 'scattered_messaging', afterId: 'confident_story', mechanismId: '' },
      { beforeId: '', afterId: 'confident_story', mechanismId: 'positioning_and_copy' },
      { beforeId: 'scattered_messaging', afterId: '', mechanismId: 'positioning_and_copy' },
    ]

    for (const patch of cases) {
      form.step1.transformation = {
        ...base,
        beforeId: patch.beforeId ?? '',
        afterId: patch.afterId ?? '',
        mechanismId: patch.mechanismId ?? '',
        beforeOther: '',
        afterOther: '',
        mechanismOther: '',
        ...patch.other,
      }
      const line = customerFacingTransformationLine(form)
      if (!patch.beforeId && !patch.afterId && !patch.mechanismId) {
        expect(line).toBe('')
        continue
      }
      expect(line.trim().length, JSON.stringify(patch)).toBeGreaterThan(0)
      expect(line, JSON.stringify(patch)).toMatch(/\.$/)
      expect(line, JSON.stringify(patch)).not.toMatch(/go from .* through .* through/i)
    }
  })

  it('brand anchor stays a coherent multi-sentence line for community-org', () => {
    const form = loadPersonaFixture('community-org')
    const anchor = brandAnchorSentence(form)
    expect(anchor.split('.').filter((s) => s.trim().length > 0).length).toBeGreaterThanOrEqual(2)
    expect(anchor).not.toMatch(/\bthrough\b.*\bthrough\b/i)
  })
})
