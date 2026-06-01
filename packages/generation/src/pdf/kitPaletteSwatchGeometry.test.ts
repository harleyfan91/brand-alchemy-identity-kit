import { describe, expect, it } from 'vitest'

import {
  KIT_PALETTE_SLOT_COUNT,
  kitPaletteBriefCompactRowHeightPt,
  kitPaletteRowHeightPt,
  kitPaletteRowWidthPt,
  kitPaletteStripInnerWidthPt,
  kitPaletteTileWidthPt,
  landscapeLayoutV,
} from './kitPaletteSwatchGeometry.js'

describe('kitPaletteSwatchGeometry', () => {
  it('matches Style Guide folio 01 deck measurements', () => {
    expect(KIT_PALETTE_SLOT_COUNT).toBe(4)
    expect(kitPaletteStripInnerWidthPt()).toBe(513)
    expect(kitPaletteTileWidthPt()).toBe(128)
    expect(kitPaletteRowHeightPt()).toBe(235)
    expect(landscapeLayoutV(260)).toBe(235)
  })

  it('computes row width from filled slot count', () => {
    expect(kitPaletteRowWidthPt(2)).toBe(255)
    expect(kitPaletteRowWidthPt(4)).toBe(509)
  })

  it('brief compact height scales from deck row height', () => {
    expect(kitPaletteBriefCompactRowHeightPt()).toBe(Math.round(235 * 0.55))
  })
})
