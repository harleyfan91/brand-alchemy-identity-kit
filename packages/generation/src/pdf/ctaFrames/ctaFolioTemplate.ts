import type { CtaSlotClass } from './slotClass.js'

/**
 * Folio 05 Calls-to-action layout template ids.
 * See docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md § Folio layout templates (v1 selection).
 */
export type CtaFolioTemplateId =
  | 'stack_vertical'
  | 'single_mobile'
  | 'single_desktop'
  | 'two_mobile_row'
  | 'mobile_desktop_row'
  | 'desktop_compact_row'

const orderAgnosticPair = (a: CtaSlotClass, b: CtaSlotClass, x: CtaSlotClass, y: CtaSlotClass) =>
  (a === x && b === y) || (a === y && b === x)

/**
 * Pure deterministic template selection for nested CTA surfaces on folio 05.
 * Rule: two-surface pairs stay side-by-side unless both are `desktop_wide`.
 * `contentDensityBias` is accepted for future tuning; current logic does not branch on it.
 */
export function pickExamplesCtaTemplate(
  slotClasses: CtaSlotClass[],
  _contentDensityBias: -1 | 0 | 1,
): CtaFolioTemplateId {
  const n = slotClasses.length
  if (n === 0) return 'stack_vertical'
  if (n === 1) {
    return slotClasses[0] === 'mobile_tall' ? 'single_mobile' : 'single_desktop'
  }
  if (n === 2) {
    const [a, b] = slotClasses
    // Only wide+wide stacks.
    if (a === 'desktop_wide' && b === 'desktop_wide') return 'stack_vertical'
    if (a === 'mobile_tall' && b === 'mobile_tall') return 'two_mobile_row'
    if (orderAgnosticPair(a, b, 'mobile_tall', 'desktop_wide')) return 'mobile_desktop_row'
    if (orderAgnosticPair(a, b, 'desktop_wide', 'compact_chip')) return 'desktop_compact_row'
    // compact+compact or mobile+compact: use the dual-mobile row shell.
    return 'two_mobile_row'
  }
  return 'stack_vertical'
}
