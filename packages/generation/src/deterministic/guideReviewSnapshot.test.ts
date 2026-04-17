import { migrateIdentityKitForm } from '@identity-kit/shared'
import { describe, expect, it } from 'vitest'

import { buildBrandIdentityGuideModel } from './brandIdentityGuideModel.js'
import { buildGuideReviewSnapshot } from './guideReviewSnapshot.js'
import { loadCoreSampleFixture } from '../fixtures/loadCoreFixture.js'

describe('buildGuideReviewSnapshot', () => {
  it('matches BrandIdentityGuideModel shape for the core fixture', () => {
    const form = migrateIdentityKitForm(loadCoreSampleFixture())
    const model = buildBrandIdentityGuideModel(form)
    const snap = buildGuideReviewSnapshot('default', form, model)

    expect(snap.schemaVersion).toBe(1)
    expect(snap.personaId).toBe('default')
    expect(snap.pages).toHaveLength(5)
    expect(snap.counts.samplePhrases).toBe(model.examples.samplePhrases.length)
    expect(snap.counts.beforeAfterPairs).toBe(model.examples.beforeAfter.length)
    expect(snap.flags.positioningDekFull).toBe(model.positioning.editorial.dekMode === 'full')
  })
})
