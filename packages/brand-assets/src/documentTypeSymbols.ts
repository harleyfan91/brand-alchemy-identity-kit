/**
 * Document-type marks for kit PDFs / UI (Guide vs Action plan vs Template).
 * Visual language matches the alchemy strip: viewBox 100×100, stroke 7, geometric strokes (`SymbolGlyph` / `AlchemySymbolStrip`).
 *
 * Flat files: `document-type-symbols/*.svg` — import from `@identity-kit/brand-assets/document-type-symbols/*.svg`.
 */
export type DocumentTypeSymbolId = 'guide' | 'action_plan' | 'template'

/** Core kit mapping: Brand Brief, Style Guide, Voice Playbook → guide; Quick Start → action_plan. */
export const coreKitDocumentType: Record<
  'brand_brief' | 'style_guide' | 'voice_playbook' | 'quick_start',
  DocumentTypeSymbolId
> = {
  brand_brief: 'guide',
  style_guide: 'guide',
  voice_playbook: 'guide',
  quick_start: 'action_plan',
}

/** Pro-only fifth PDF (Content Starter Pack) — templates / fill-in assets. */
export const proContentStarterPackDocumentType: DocumentTypeSymbolId = 'template'

export const documentTypeLabels: Record<DocumentTypeSymbolId, string> = {
  guide: 'Guide',
  action_plan: 'Action plan',
  template: 'Template',
}
