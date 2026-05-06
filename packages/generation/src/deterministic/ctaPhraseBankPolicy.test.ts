import { describe, expect, it } from 'vitest'

import { PRESCRIPTIVE_CTA_CHUNKS } from './ctaPhraseBankPrescriptive.gen.js'

describe('prescriptive CTA phrase bank (generated)', () => {
  it('disallows em dashes in paste-ready lines (CTA_COPY_RULES)', () => {
    const em = '\u2014'
    for (const ch of PRESCRIPTIVE_CTA_CHUNKS) {
      for (const tuple of ch.tuples) {
        for (const line of tuple) {
          const count = line.split(em).length - 1
          expect(count, line).toBe(0)
        }
      }
      if (ch.triple) {
        for (const line of ch.triple) {
          const count = line.split(em).length - 1
          expect(count, line).toBe(0)
        }
      }
    }
  })
})
