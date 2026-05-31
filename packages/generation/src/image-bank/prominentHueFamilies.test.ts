import { describe, expect, it } from 'vitest'

import {
  coerceChromaticHueAlias,
  hexToProminentHueFamily,
  mapHueAngleToChromaticFamily,
  validateProminentHueFamilies,
} from '@identity-kit/shared'

describe('prominentHueFamilies closed vocabulary', () => {
  it('maps hue angles to canonical buckets', () => {
    expect(mapHueAngleToChromaticFamily(10)).toBe('red')
    expect(mapHueAngleToChromaticFamily(30)).toBe('orange')
    expect(mapHueAngleToChromaticFamily(55)).toBe('yellow')
    expect(mapHueAngleToChromaticFamily(120)).toBe('green')
    expect(mapHueAngleToChromaticFamily(180)).toBe('teal')
    expect(mapHueAngleToChromaticFamily(220)).toBe('blue')
    expect(mapHueAngleToChromaticFamily(300)).toBe('violet')
  })

  it('maps cyan and magenta language to merged buckets', () => {
    expect(coerceChromaticHueAlias('cyan')).toBe('teal')
    expect(coerceChromaticHueAlias('magenta')).toBe('violet')
    expect(coerceChromaticHueAlias('pink')).toBe('violet')
  })

  it('maps brand hex into nearest bucket', () => {
    expect(hexToProminentHueFamily('#00BCD4')).toBe('teal')
    expect(hexToProminentHueFamily('#E91E63')).toBe('violet')
  })

  it('rejects invalid tag combinations', () => {
    expect(validateProminentHueFamilies(['multicolor', 'yellow']).length).toBeGreaterThan(0)
    expect(validateProminentHueFamilies(['achromatic', 'blue']).length).toBeGreaterThan(0)
    expect(validateProminentHueFamilies(['orange', 'teal']).length).toBe(0)
    expect(validateProminentHueFamilies(['yellow']).length).toBe(0)
  })
})
