import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import {
  existingBrandEntryToBriefBlocks,
  formatStartingAssetsObservations,
  formatStartingAssetsTension,
  STARTING_ASSETS_BRIEF_HEADING,
} from './existingBrandEntryBriefBlocks.js'
import { buildExistingBrandEntryModel } from './existingBrandEntryScaffolds.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'

describe('existingBrandEntryBriefBlocks', () => {
  it('emits a single module block for the Brief renderer', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const blocks = existingBrandEntryToBriefBlocks(buildExistingBrandEntryModel(form))
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.heading).toBe(STARTING_ASSETS_BRIEF_HEADING)
  })

  it('formats observations and tension for the module', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    const model = buildExistingBrandEntryModel(form, {
      fieldsCited: ['step6.existingBrand.logoRef'],
      logoObservation: 'AI logo note',
      referenceImageObservation: 'AI reference note',
      voiceSamplesObservation: 'AI voice samples note',
      websiteObservation: 'AI website note',
    })

    const observations = formatStartingAssetsObservations(model.observations)
    expect(observations.map((o) => o.label)).toEqual(
      expect.arrayContaining(['Logo', 'Reference image', 'Voice samples', 'Website']),
    )

    const tension = formatStartingAssetsTension(model)
    expect(tension).not.toBeNull()
    expect(tension?.tension).toMatch(/Dark navy/i)
    expect(tension?.resolution).toMatch(/locked kit palette/i)
  })
})
