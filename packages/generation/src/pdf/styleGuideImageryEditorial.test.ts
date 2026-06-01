import { describe, expect, it } from 'vitest'

import { migrateIdentityKitForm } from '@identity-kit/shared'

import { depthStyleGuideBlocks } from '../deterministic/depthStyleGuideBlocks.js'
import { styleGuideImageryDirectionBody } from '../deterministic/phase8Content.js'
import { loadProSmokeFixture } from '../fixtures/loadProSmokeFixture.js'
import { parseBulletLines, parseImageryEditorialBody } from './styleGuideImageryEditorial.js'

describe('styleGuideImageryEditorial', () => {
  it('splits imagery prose into a lead and bullet lines', () => {
    const body = styleGuideImageryDirectionBody(migrateIdentityKitForm(loadProSmokeFixture('vision')))
    const { lead, bullets } = parseImageryEditorialBody(body)

    expect(lead).toMatch(/^Imagery /)
    expect(lead).toMatch(/:$/)
    expect(bullets.length).toBeGreaterThanOrEqual(2)
  })

  it('parses visual application bullet blocks', () => {
    const form = migrateIdentityKitForm(loadProSmokeFixture('vision'))
    form.tier = 'pro'
    const body = depthStyleGuideBlocks(form).find((b) => b.heading === 'Visual application')?.body ?? ''
    const bullets = parseBulletLines(body)

    expect(bullets.length).toBe(4)
    expect(bullets[0]).toMatch(/spreads 01–03/i)
    expect(bullets.at(-1)).toMatch(/Visual Reference spread/i)
  })
})
