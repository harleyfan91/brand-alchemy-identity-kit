import { describe, expect, it } from 'vitest'

import { lookupPrescriptiveTuples } from './ctaPrescriptiveLookup.js'

describe('lookupPrescriptiveTuples narrator axis', () => {
  it('uses narrator-tuned leaf when brand narrator matches §4C pair', () => {
    const tuned = lookupPrescriptiveTuples({
      surface: 'website',
      socialTone: 'casual',
      primaryGoal: 'direct_sales',
      industryGroup: 'trades_home',
      voiceTone: 'bold',
      brandNarrator: 'local_team',
    })
    expect(tuned?.[0]?.[0]).toContain('Our team')
  })

  it('uses default industry leaf when narrator does not match tuned pair', () => {
    const tuned = lookupPrescriptiveTuples({
      surface: 'website',
      socialTone: 'casual',
      primaryGoal: 'direct_sales',
      industryGroup: 'trades_home',
      voiceTone: 'bold',
      brandNarrator: 'solo_expert',
    })
    expect(tuned?.[0]?.[0]).toMatch(/Book your free estimate/i)
  })
})
