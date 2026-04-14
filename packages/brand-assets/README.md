# Brand assets (`@identity-kit/brand-assets`)

Shared **Identity Kit** visuals that must stay aligned across the web app, PDFs, and anything you make by hand (Google Slides, Keynote, Canva, etc.).

## The symbol strip

- **Logic (order of symbols, center label):** `src/symbolStrip.ts` — imported by the web `AlchemySymbolStrip` so the UI cannot drift from this package.
- **Flat vector file for import elsewhere:** `alchemy-symbol-strip.svg` — **generated**; do not hand-edit. A matching **`alchemy-symbol-strip.png`** is written in the same `npm run generate` step (raster for Google Slides and other tools that do not accept SVG).
- PNG: **Resvg** rasterization; **`PNG_WIDTH_PX`** (~2400) balances sharpness vs. Slides recompressing huge uploads. The exported strip center is **β + vector fire triangle** (not Unicode `β△`) so the triangle matches row glyphs in PNG/SVG.
- It matches the site layout in **CSS terms**: strip height `h-7` (28px) → SVG `viewBox` height `100`; glyphs `h-3.5` (14px) → **scale 0.5** on the 100×100 glyph paths (14px is half of 28px); `mr-1` / `mx-1` spacing and center label `text-[10.5px]` font-semibold are converted with the same 100/28 scale. Regenerate after changing sequences or glyph paths:

```bash
npm run generate -w @identity-kit/brand-assets
```

## Keeping everything consistent

| Where | What to use |
|--------|-------------|
| **This repo / web** | `import { getStripLayout, STRIP_CENTER_LABEL } from '@identity-kit/brand-assets'` and the existing `SymbolGlyph` UI, or reference the SVG if you switch to `<img>`. |
| **Google Slides / Docs** | **Insert → Image → Upload from computer** and choose **`alchemy-symbol-strip.png`** (generated next to the SVG). Use the SVG when the app accepts it (Figma, etc.). |
| **Figma / design files** | **Place** the SVG (or paste SVG code). One file = one source of truth for decks and print. |
| **PDF generation** | Import `alchemy-symbol-strip.svg` from this package (e.g. embed as image / data URI in `@react-pdf/renderer`) so kits match Slides. |

**Rule:** Change symbol order or glyphs in **`src/symbolStrip.ts`** (and the web `SymbolGlyph` paths if shapes change), run **`npm run generate -w @identity-kit/brand-assets`**, commit the updated SVG, and replace uploaded assets in Slides if you use a copy there.

## Document-type marks (Guide / Action plan / Template)

Flat SVGs for signaling **what kind of PDF** a reader is holding (guides vs. a checklist-style action plan vs. fill-in templates). They use the same **100×100 viewBox** and **stroke 7** geometric language as the alchemy strip glyphs (`SymbolGlyph` / `AlchemySymbolStrip`).

**Implementation status:** Assets and TypeScript mapping **exist in this package** (`document-type-symbols/*.svg`, `src/documentTypeSymbols.ts`). They are **not** embedded in **`@react-pdf/renderer`** output yet (e.g. `packages/generation/src/pdf/CoreKitDocuments.tsx` **PageHeaderBand**), and the **web app** does not render them. When we add them, the likely home is the **first-page title band** beside the document title (see `PDF_GENERATION.md`).

| File | Meaning |
|------|---------|
| `document-type-symbols/guide.svg` | **Venn** (solid left + dotted right) — overlap / synthesis for narrative guides (Brand Brief, Style Guide, Voice Playbook). |
| `document-type-symbols/action-plan.svg` | **Stairstep** — ordered, executable work (Quick Start). |
| `document-type-symbols/template.svg` | **Brackets** — placeholder / fill-in (Pro fifth PDF / Content Starter Pack). |

**Code:** `DocumentTypeSymbolId`, `coreKitDocumentType`, and labels live in `src/documentTypeSymbols.ts` and are re-exported from the package entry.

```ts
import { coreKitDocumentType, documentTypeLabels } from '@identity-kit/brand-assets'
import guideUrl from '@identity-kit/brand-assets/document-type-symbols/guide.svg'
```

## Note on the live web strip

The site adds **CSS** (gradients, full-bleed lines) around the symbols. The generated SVG includes **simple top/bottom rules** and white background so it imports cleanly into slides; visual parity is close, not pixel-identical to the hero strip.
