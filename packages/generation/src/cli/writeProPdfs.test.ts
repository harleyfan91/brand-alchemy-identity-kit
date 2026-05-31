import { describe, expect, it } from 'vitest'

import { parseWriteProPdfsArgs } from './writeProPdfs.js'

describe('writeProPdfs CLI', () => {
  it('defaults to bank fulfillment (no QA tier override)', () => {
    const opts = parseWriteProPdfsArgs(['vision', '--no-ai'])
    expect(opts.visualReferencePhotoCount).toBeUndefined()
    expect(opts.visualReferenceAll).toBe(false)
  })

  it('parses --visual-ref and --visual-ref-all', () => {
    const opts = parseWriteProPdfsArgs(['vision', '--no-ai', '--visual-ref=6', '--visual-ref-all'])
    expect(opts.visualReferencePhotoCount).toBe(6)
    expect(opts.visualReferenceAll).toBe(true)
  })
})
