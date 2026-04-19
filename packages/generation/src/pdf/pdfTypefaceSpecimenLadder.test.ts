import { describe, expect, it } from 'vitest'

import { typefaceSpecimenLadderForPdfFamily } from './pdfTypefaceSpecimenLadder.js'

describe('typefaceSpecimenLadderForPdfFamily', () => {
  it('uses only registered weights for DM Serif Display (single optical master)', () => {
    const rows = typefaceSpecimenLadderForPdfFamily('DM Serif Display')
    expect(rows.map((r) => r.label)).toEqual(['Regular', 'Italic'])
    expect(rows.map((r) => r.fontWeight)).toEqual([400, 400])
  })

  it('uses the full default ladder for families with multi-weight bundles (e.g. Manrope)', () => {
    const rows = typefaceSpecimenLadderForPdfFamily('Manrope')
    expect(rows.map((r) => r.label)).toEqual(['Light', 'Regular', 'SemiBold', 'Bold', 'Italic'])
    expect(rows.find((r) => r.label === 'SemiBold')?.fontWeight).toBe(600)
  })
})
