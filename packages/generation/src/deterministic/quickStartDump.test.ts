/**
 * Manual dump for marketing audit — run:
 *   npm test -- src/deterministic/quickStartDump.test.ts
 */
import { describe, it } from 'vitest'
import { migrateIdentityKitForm } from '@identity-kit/shared'

import { quickStartBlocks } from './coreAssembly.js'
import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'

const PERSONAS = [
  'pc05-regulated-legal',
  'pc04-local-team-with-directory',
  'pc03-local-team-no-directory',
  'pc08-social-product-promotion',
  'pc06-mixed-commerce-service',
  'pc07b-trades-travel',
  'coffee-founder',
  'community-org',
  'lean-core',
] as const

describe('quick start dump (manual)', () => {
  it('prints all persona quick starts', () => {
    for (const id of PERSONAS) {
      const form = migrateIdentityKitForm(loadPersonaFixture(id))
      // eslint-disable-next-line no-console
      console.log(`\n${'='.repeat(72)}\n${id} | ${form.step1.businessName} | focus=${form.step1.guideFocus} | goal=${form.step1.primaryGoal}\n${'='.repeat(72)}`)
      for (const b of quickStartBlocks(form)) {
        // eslint-disable-next-line no-console
        console.log(`\n### ${b.heading}\n\n${b.body}\n`)
      }
    }
  })
})
