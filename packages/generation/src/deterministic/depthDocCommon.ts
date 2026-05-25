import type { IdentityKitForm } from '@identity-kit/shared'

export type KitContentBlock = { heading: string; body: string }

/** Standard depth-doc opener: points readers to the Brand Identity Guide. */
export function depthDocRefBlock(guideSections: string, depthTopic: string): KitContentBlock {
  return {
    heading: 'How this document relates to your kit',
    body:
      `Your at-a-glance brand lives in the Brand Identity Guide → ${guideSections}. ` +
      `This document goes deeper on ${depthTopic}. Use the guide when you need the short version; use this page when you need more context.`,
  }
}

/** One-line pointer used inside section bodies. */
export function guideFolioRef(navLabels: string): string {
  return `Brand Identity Guide → ${navLabels}`
}

export function collectKitContentBlockBodies(blocks: KitContentBlock[]): string[] {
  return blocks.map((b) => b.body).filter((s) => s.trim().length > 0)
}

/** Normalize for overlap checks. */
export function normalizeForOverlap(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

/**
 * True when `candidate` is a substantial duplicate of guide copy.
 * Flags exact matches and cases where the depth block is contained in guide text.
 * Does not flag expanded depth sections that merely include a shorter guide snippet.
 */
export function overlapsGuideString(candidate: string, guideStrings: string[], minLen = 48): boolean {
  const norm = normalizeForOverlap(candidate)
  if (norm.length < minLen) return false
  for (const guide of guideStrings) {
    const g = normalizeForOverlap(guide)
    if (!g || g.length < minLen) continue
    if (norm === g) return true
    if (g.includes(norm)) return true
  }
  return false
}

export function proStyleNotesSuffix(form: IdentityKitForm): string {
  const visualNotes = form.step6.visualNotes?.trim()
  const legacy = [form.step6.colorMoodNotes?.trim(), form.step6.styleNotes?.trim()]
    .filter(Boolean)
    .join(' ')
  const notes = visualNotes || legacy
  if (!notes) return ''
  return `\n\nAdditional notes from your intake: ${notes}`
}
