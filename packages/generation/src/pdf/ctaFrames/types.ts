/**
 * In-context CTA frame ids for folio 05 (see docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).
 * Add new ids here when registering components in registry.tsx.
 */
import type { CoreKitPdfStyles } from '../CoreKitDocuments.js'

export const CTA_FRAME_IDS = ['social_feed_v1'] as const

export type CtaFrameId = (typeof CTA_FRAME_IDS)[number]

export function isCtaFrameId(value: string): value is CtaFrameId {
  return (CTA_FRAME_IDS as readonly string[]).includes(value)
}

export interface GuideCtaPresentation {
  frameId: CtaFrameId
}

export type CtaFrameHyphenation = (word: string) => string[]

export interface CtaFrameBaseProps {
  styles: CoreKitPdfStyles
  businessName: string
  lines: string[]
  hyphenationCallback: CtaFrameHyphenation
}
