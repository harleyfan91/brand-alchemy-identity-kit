import { describe, expect, it } from 'vitest'

import { pickExamplesCtaTemplate } from './ctaFolioTemplate.js'
import type { CtaSlotClass } from './slotClass.js'

describe('pickExamplesCtaTemplate', () => {
  const bias = 0 as const

  it('returns stack_vertical for empty or three surfaces', () => {
    expect(pickExamplesCtaTemplate([], bias)).toBe('stack_vertical')
    expect(
      pickExamplesCtaTemplate(['desktop_wide', 'desktop_wide', 'compact_chip'] as CtaSlotClass[], bias),
    ).toBe('stack_vertical')
  })

  it('single surface', () => {
    expect(pickExamplesCtaTemplate(['mobile_tall'], bias)).toBe('single_mobile')
    expect(pickExamplesCtaTemplate(['desktop_wide'], bias)).toBe('single_desktop')
    expect(pickExamplesCtaTemplate(['compact_chip'], bias)).toBe('single_desktop')
  })

  it('two-surface row templates', () => {
    expect(pickExamplesCtaTemplate(['mobile_tall', 'mobile_tall'], bias)).toBe('two_mobile_row')
    expect(pickExamplesCtaTemplate(['mobile_tall', 'desktop_wide'], bias)).toBe('mobile_desktop_row')
    expect(pickExamplesCtaTemplate(['desktop_wide', 'mobile_tall'], bias)).toBe('mobile_desktop_row')
    expect(pickExamplesCtaTemplate(['mobile_tall', 'desktop_wide'], 1)).toBe('mobile_desktop_row')
    expect(pickExamplesCtaTemplate(['desktop_wide', 'mobile_tall'], 1)).toBe('mobile_desktop_row')
    expect(pickExamplesCtaTemplate(['desktop_wide', 'compact_chip'], bias)).toBe('desktop_compact_row')
    expect(pickExamplesCtaTemplate(['compact_chip', 'desktop_wide'], bias)).toBe('desktop_compact_row')
  })

  it('falls back to stack_vertical for ambiguous two-surface pairs', () => {
    expect(pickExamplesCtaTemplate(['compact_chip', 'compact_chip'], bias)).toBe('stack_vertical')
    expect(pickExamplesCtaTemplate(['mobile_tall', 'compact_chip'], bias)).toBe('stack_vertical')
  })

  it('stacks two desktop_wide surfaces (never side-by-side)', () => {
    expect(pickExamplesCtaTemplate(['desktop_wide', 'desktop_wide'], bias)).toBe('stack_vertical')
    expect(pickExamplesCtaTemplate(['desktop_wide', 'desktop_wide'], 1)).toBe('stack_vertical')
  })
})
