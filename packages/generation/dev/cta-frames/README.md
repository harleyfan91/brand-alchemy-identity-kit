# CTA frames dev explorer

Local-only preview of folio 05 **in-context CTA frames** (React-PDF in the browser). Does **not** change shipped PDFs or the Brand Identity Guide build.

## Run

From repo root:

```bash
npm run dev:cta-frames
```

Or from `packages/generation`:

```bash
npm run dev:cta-frames
```

## What this is for

- Pixel-check **post shells** (layout, spacing, caption behavior) without running the full guide PDF.
- Try **sample props** next to each frame (see `App.tsx`). Dev now shows dedicated social families (`social_feed_v1`, `social_story_v1`, `social_reel_cover_v1`, `social_grid_photo_v1`, `social_pin_standard_v1`, `social_carousel_v1`, `social_link_preview_v1`, `social_text_only_v1`) with geometry notes so feed/story/reel/grid/pin/carousel/link/text shells are not conflated.

## Normative doc (do not drift)

All product intent, guardrails, workflow, and QA live in:

[`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](../../../../docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md)

If you change frame layout or copy wiring, update that doc and §10A.6A in `OUTPUT_TRANSLATION_SPEC.md` when behavior changes.

## Implementation notes

- **`explorerStyles.ts`** mirrors a subset of `CoreKitDocuments` guide styles so Vite does not import the full PDF document (font registration paths differ in Node vs browser).
- **`registerExplorerFonts.ts`** registers Inter for the preview.
- When a frame needs a **new `S.*` key**, add it to `explorerStyles.ts` and to `createCoreKitStyles` in `CoreKitDocuments.tsx` for parity.
