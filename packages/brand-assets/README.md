# Brand assets (`@identity-kit/brand-assets`)

Shared **Identity Kit** visuals that must stay aligned across the web app, PDFs, and anything you make by hand (Google Slides, Keynote, Canva, etc.).

## The symbol strip

- **Logic (order of symbols, center label):** `src/symbolStrip.ts` — imported by the web `AlchemySymbolStrip` so the UI cannot drift from this package.
- **Flat vector file for import elsewhere:** `alchemy-symbol-strip.svg` — **generated**; do not hand-edit. It matches the site layout in **CSS terms**: strip height `h-7` (28px) → SVG `viewBox` height `100`; glyphs `h-3.5` (14px) → **scale 0.5** on the 100×100 glyph paths (14px is half of 28px); `mr-1` / `mx-1` spacing and center label `text-[10.5px]` font-semibold are converted with the same 100/28 scale. Regenerate after changing sequences or glyph paths:

```bash
npm run generate -w @identity-kit/brand-assets
```

## Keeping everything consistent

| Where | What to use |
|--------|-------------|
| **This repo / web** | `import { getStripLayout, STRIP_CENTER_LABEL } from '@identity-kit/brand-assets'` and the existing `SymbolGlyph` UI, or reference the SVG if you switch to `<img>`. |
| **Google Slides / Docs** | **Insert → Image → Upload from computer** and choose `alchemy-symbol-strip.svg`. If Slides rejects SVG, export a **PNG** from the SVG (Preview, Figma, or any design tool) at **2× or 3×** width for sharpness. |
| **Figma / design files** | **Place** the SVG (or paste SVG code). One file = one source of truth for decks and print. |
| **PDF generation** | Import `alchemy-symbol-strip.svg` from this package (e.g. embed as image / data URI in `@react-pdf/renderer`) so kits match Slides. |

**Rule:** Change symbol order or glyphs in **`src/symbolStrip.ts`** (and the web `SymbolGlyph` paths if shapes change), run **`npm run generate -w @identity-kit/brand-assets`**, commit the updated SVG, and replace uploaded assets in Slides if you use a copy there.

## Note on the live web strip

The site adds **CSS** (gradients, full-bleed lines) around the symbols. The generated SVG includes **simple top/bottom rules** and white background so it imports cleanly into slides; visual parity is close, not pixel-identical to the hero strip.
