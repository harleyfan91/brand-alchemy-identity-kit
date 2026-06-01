import { describe, expect, it } from 'vitest'

import { resolveExistingBrandImageSrc } from './resolveExistingBrandImageSrc.js'

describe('resolveExistingBrandImageSrc', () => {
  it('resolves pro-smoke fixture logo and reference refs', () => {
    expect(resolveExistingBrandImageSrc('pro-smoke/fixtures/northwind-logo')).toMatch(/logo\.jpg$/)
    expect(resolveExistingBrandImageSrc('pro-smoke/fixtures/northwind-reference')).toMatch(/reference\.jpg$/)
  })

  it('returns undefined for pending placeholders and unknown refs', () => {
    expect(resolveExistingBrandImageSrc('pending:sess/logo')).toBeUndefined()
    expect(resolveExistingBrandImageSrc('')).toBeUndefined()
    expect(resolveExistingBrandImageSrc('pro-uploads/sess/logo.png')).toBeUndefined()
  })
})
