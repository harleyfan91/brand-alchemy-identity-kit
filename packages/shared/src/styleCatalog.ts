export type StyleCatalogEntry = {
  displayName: string
  description: string
}

/** Wizard style direction ids (Step 6). */
export const STYLE_CATALOG: Record<string, StyleCatalogEntry> = {
  clean_minimal: {
    displayName: 'Clean and Minimal',
    description:
      'Clean and minimal. White space is an active design element; typography and content carry the brand while decoration stays out of the way.',
  },
  bold_graphic: {
    displayName: 'Bold and Graphic',
    description:
      'Bold and graphic. High contrast, strong type, and decisive layout. Every element earns its place.',
  },
  organic_natural: {
    displayName: 'Organic and Natural',
    description:
      'Organic and natural. Soft edges, earthy textures, and a handcrafted sensibility. Feels made by a person.',
  },
  luxe_refined: {
    displayName: 'Luxe and Refined',
    description:
      'Luxe and refined. Elegant proportions, quiet restraint, and a premium feel. Says a lot by doing less.',
  },
}

export const STYLE_IDS = Object.keys(STYLE_CATALOG)

export function resolveStyleCatalogEntry(styleId: string): StyleCatalogEntry | undefined {
  const id = styleId?.trim()
  if (!id) return undefined
  return STYLE_CATALOG[id]
}

export function isValidStyleId(styleId: string): boolean {
  return Boolean(resolveStyleCatalogEntry(styleId))
}

/** Lead sentence for style direction copy — names the buyer's style first. */
export function formatStyleLeadSentence(styleId: string): string {
  const entry = resolveStyleCatalogEntry(styleId)
  if (entry) return `${entry.displayName}. ${entry.description}`
  const id = styleId?.trim()
  return id ? `Unknown style (${id}). Verify selectedStyle matches a wizard option.` : 'Style not selected.'
}
