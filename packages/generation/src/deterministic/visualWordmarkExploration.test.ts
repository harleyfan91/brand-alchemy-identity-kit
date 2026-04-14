import { describe, expect, it } from 'vitest'

import { computeWordmarkExplorationTiles, type WordmarkExplorationStacked } from './visualWordmarkExploration.js'

describe('computeWordmarkExplorationTiles', () => {
  it('produces letterform, monogram, and stacked tiles for multi-word names', () => {
    const tiles = computeWordmarkExplorationTiles('Harbor Row Coffee')
    expect(tiles).toHaveLength(3)
    expect(tiles[0]).toMatchObject({ kind: 'single', caption: 'Letterform', text: 'H' })
    expect(tiles[1]).toMatchObject({ kind: 'single', caption: 'Monogram', text: 'HRC', fontSize: 14 })
    expect(tiles[2]).toMatchObject({
      kind: 'stacked',
      caption: 'Stacked',
      top: 'Harbor',
      bottom: 'Row Coffee',
      lockupWidthPt: expect.any(Number),
      bottomDisplaySize: expect.any(Number),
    })
    const stacked = tiles[2] as WordmarkExplorationStacked
    expect(stacked.lockupWidthPt).toBeGreaterThan(20)
    expect(stacked.lockupWidthPt).toBeLessThan(90)
    /** Second line is solved from anchor / linear coeff (multi-word tail, not single-token cap). */
    expect(stacked.bottomDisplaySize).toBeGreaterThan(6)
    expect(stacked.bottomDisplaySize).toBeLessThan(8.5)
  })

  it('uses tight caps for single-word names when monogram would repeat', () => {
    const tiles = computeWordmarkExplorationTiles('Acme')
    expect(tiles[0]).toMatchObject({ kind: 'single', text: 'A' })
    expect(tiles[1]).toMatchObject({ kind: 'single', caption: 'Tight caps', text: 'ACME' })
    expect(tiles[2]).toMatchObject({ kind: 'stacked', top: 'Acme', bottom: 'ACME' })
  })

  it('scales stacked second line up to headline size for two-word brands (Northline Studio)', () => {
    const tiles = computeWordmarkExplorationTiles('Northline Studio')
    const stacked = tiles[2] as WordmarkExplorationStacked
    expect(stacked.kind).toBe('stacked')
    expect(stacked.top).toBe('Northline')
    expect(stacked.bottom).toBe('Studio')
    /** Single short token may use full `topSize` when solving toward anchor width. */
    expect(stacked.bottomDisplaySize).toBe(12)
  })

  it('uses default display label when trimmed name is empty', () => {
    const tiles = computeWordmarkExplorationTiles('   ')
    expect(tiles[0]).toMatchObject({ kind: 'single', text: 'Y' })
    expect(tiles[1]).toMatchObject({ kind: 'single', caption: 'Monogram', text: 'YBN' })
    expect(tiles[2]).toMatchObject({ kind: 'stacked', top: 'Your', bottom: 'Business Name' })
  })
})
