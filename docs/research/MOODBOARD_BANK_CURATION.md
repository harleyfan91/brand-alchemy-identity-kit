# Moodboard image bank — curation guide

**Status:** Groundwork — R5 spec locked; **bulk sourcing unblocked** after taxonomy curator sign-off    
**Date:** 2026-05-30  
**Tag taxonomy (vocabulary):** [`MOODBOARD_BANK_TAG_TAXONOMY.md`](./MOODBOARD_BANK_TAG_TAXONOMY.md)

---

## Overview

The Pro Visual Reference Spread (Style Guide folios 06–07) uses a **curated image bank** — not AI-generated images. AI selects and captions; humans curate and tag.

**v1 target:** 240–300 optimized JPEGs  
**Coverage floor:** 5 images per (**style register × scene type**) = **36 cells × 5 = 180 minimum**; track portrait/landscape per cell for layout slots

---

## What we store locally

| Retained | Not retained |
|----------|--------------|
| Optimized JPEG (`assets/{imageId}.jpg`) | Raw Unsplash/Pexels downloads |
| `sourceUrl` + optional `sourcePageUrl` in metadata | Staging folders, originals, EXIF from source |
| Tags (controlled vocabulary) | Duplicate copies at multiple resolutions (v1) |

Ingest streams URL → memory → Sharp → single JPEG. See `packages/generation/dev/image-bank/README.md`.

---

## Project phases

### Phase 0 — Groundwork (current)

- [x] Tag taxonomy doc + shared mapping tables
- [x] Ingest pipeline (memory-only download)
- [x] Coverage report CLI
- [x] Deterministic tag-match scorer (stub)
- [x] **Signal model + R5 spec** — [`MOODBOARD_SIGNAL_MODEL.md`](./MOODBOARD_SIGNAL_MODEL.md) §9.1, OUTPUT_TRANSLATION_SPEC §5.8
- [ ] Tag taxonomy curator sign-off (MOODBOARD_BANK_TAG_TAXONOMY.md)
- [ ] AI vision tagging prompt (outputs `ReferenceVisionProfileSchema` + ingest tags)

### Phase 1 — Seed bank (~36 images)

One image per style×scene coverage cell to validate rubric + PDF render. Run `npm run image-bank-coverage` after each batch.

### Phase 2 — Full bank (240–300)

Scale sourcing using coverage report to prioritize thin cells.

### Phase 3 — Pro-G integration

Wire tag matcher → ranker → caption → Style Guide PDF (depends on Pro-A AI plumbing).

---

## Tooling

From `packages/generation`:

```bash
# Ingest one URL (tags required)
npm run ingest-image-bank -- \
  --url="https://images.unsplash.com/photo-..." \
  --license=unsplash \
  --palette-family=warm-earth \
  --style-register=warm \
  --scene-type=texture \
  --source-page="https://unsplash.com/photos/..." \
  --mood=warm,organic

# Batch queue
npm run ingest-image-bank -- --queue=dev/image-bank/queue.json

# Coverage vs 36-cell style×scene matrix
npm run image-bank-coverage
```

**Validate queue before ingest:** every row must pass `ImageBankIngestTagsSchema` (enums only, no freeform).

---

## Sourcing workflow (after tag sign-off)

1. **Pick a thin cell** from `image-bank-coverage` output (style register × scene)
2. **Generate search queries** (AI or manual) grounded in taxonomy definitions
3. **Fetch candidates** from Unsplash / Pexels (URLs only — do not save originals)
4. **Vision-tag candidates** against controlled vocabulary
5. **Human QA** using tag checklist in taxonomy doc
6. **Add approved rows** to `queue.json`
7. **Ingest** → optimized JPEG + metadata
8. **Re-run coverage** until ≥180 floor met, 240+ target, and no thin cells

### Source mix (v1)

- ~80% Unsplash + Pexels (commercial use)
- ~15–20% mid-tier stock for premium gaps (`cool-minimal`, `muted-sophisticated`, `deep-moody`)

---

## Processing spec

| Setting | Value |
|---------|-------|
| Long edge | 1600px |
| Resize | `fit: inside`, no crop |
| Format | Progressive JPEG, mozjpeg |
| Quality | 82 → 65 (step 4) |
| Cap | 250 KB / asset |
| EXIF | Stripped |

Pattern adapted from Camentra `process-template-example-images.ts` — different dimensions, no `cover` crop, no WebP (PDF path).

---

## Code map

| Concern | Location |
|---------|----------|
| Tag enums + validation | `packages/shared/src/imageBank/` |
| Palette → family map | `paletteFamilyMap.ts` |
| Style → register map | `styleRegisterMap.ts` |
| Kit signal resolver | `kitSignals.ts` |
| Coverage matrix | `coverageMatrix.ts` |
| Ingest + metadata | `packages/generation/src/image-bank/` |
| Tag-match scorer | `tagMatcher.ts` |
| Layout slot contract | `visualReferenceLayouts.ts` |

---

## Pro-G ship gate

From `PRO_KIT_STRATEGY.md` §11:

- All 8 Pro fixtures produce coherent Visual Reference spreads
- No uncovered (style register × scene type) combinations
- Style register influences selection in fixture tests

Run `npm run image-bank-coverage` — output `Pro-G v1 bank gate: READY` when ≥180 assets and zero thin style×scene cells.

---

## Open items (post-groundwork)

- AI vision tagging script (Haiku + taxonomy schema)
- Queue generator from coverage gaps
- Supabase Storage migration for production binaries (optional before v1 if git size acceptable)
- Deterministic fallback captions keyed on palette family × style register
