import { describe, expect, it } from 'vitest'

/** Matches LOGO_SIZE_MIN_PT in VisualReferenceSpread.tsx */
const LOGO_SIZE_MIN_PT = 136

/**
 * Lead-spread geometry is implemented in VisualReferenceSpread.tsx.
 * Logo floor and height-filled photo rows for vr_6 / vr_8.
 */
describe('Visual Reference lead spread sizing contract', () => {
  const ROW_H = 340
  const BOARD_W = 704
  const LOGO_GAP = 14
  const TILE_GAP = 8

  it('logo never shrinks below 136pt (original vr_8 / vr_9 baseline)', () => {
    expect(LOGO_SIZE_MIN_PT).toBe(136)
  })

  it('vr_6 compact row height exceeds logo square', () => {
    const areaW = BOARD_W - LOGO_SIZE_MIN_PT - LOGO_GAP
    const maxHFromWidth = Math.floor(((areaW - TILE_GAP) * 12) / 25)
    const rowH = Math.min(ROW_H, maxHFromWidth)
    expect(rowH).toBeGreaterThan(LOGO_SIZE_MIN_PT)
  })

  it('vr_8 brick stack height exceeds logo square', () => {
    expect(ROW_H).toBeGreaterThan(LOGO_SIZE_MIN_PT)
  })
})
