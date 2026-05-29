import { describe, expect, it } from 'vitest'
import type { BriefIdealCustomerRewrite } from '@identity-kit/shared'

import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import {
  formatBriefIdealCustomerForPdf,
  idealCustomerSnapshotFromIntake,
} from './idealCustomerSnapshot.js'

describe('formatBriefIdealCustomerForPdf', () => {
  it('renders structured snapshot with section labels and bullets', () => {
    const snapshot: BriefIdealCustomerRewrite = {
      summaryLine: 'Independent shop owners running one or two locations without in-house design.',
      traits: ['Owner approves every sign change', 'Staff rotate weekly'],
      caresAbout: ['One system staff can update', 'Recognizable window presence'],
      fieldsCited: ['customerArchetype', 'painPoints'],
    }

    const body = formatBriefIdealCustomerForPdf(snapshot)
    expect(body).toContain('What defines them')
    expect(body).toContain('What they care about')
    expect(body).not.toContain('Pain points:')
  })
})

describe('idealCustomerSnapshotFromIntake', () => {
  it('Core lean persona uses narrator cue and transformation, not pain/outcome labels', () => {
    const form = loadPersonaFixture('lean-core')
    const snapshot = idealCustomerSnapshotFromIntake(form)
    const body = formatBriefIdealCustomerForPdf(snapshot)

    expect(snapshot.summaryLine).toContain('Families and small business owners')
    expect(snapshot.traits.some((t) => t.includes('credibility'))).toBe(true)
    expect(body).toContain('What defines them')
    expect(body).not.toContain('Pain points:')
    expect(body).not.toContain('Desired outcomes:')
  })

  it('Pro smoke fixture maps pain and outcomes into structured sections', () => {
    const form = loadProSmokeFixture('text')
    const snapshot = idealCustomerSnapshotFromIntake(form)
    const body = formatBriefIdealCustomerForPdf(snapshot)

    expect(snapshot.traits.some((t) => t.includes('chalkboards'))).toBe(true)
    expect(snapshot.caresAbout.some((c) => c.includes('visual system'))).toBe(true)
    expect(body).toContain('What they care about')
    expect(body).not.toMatch(/^Pain points:/m)
  })
})
