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
4. **Visual QA each candidate** — see [Pre-ingest QA gate](#pre-ingest-qa-gate) below
5. **Vision-tag candidates** against controlled vocabulary (or human tag from checklist)
6. **Human sign-off** using tag checklist in taxonomy doc
7. **Add approved rows** to `queue.json` (confirm orientation vs target layout slot)
8. **Ingest** → optimized JPEG + metadata
9. **Re-run coverage** until ≥180 floor met, 240+ target, and no thin cells

### Pre-ingest QA gate

Ingest is **faithful but blind**: it downloads the CDN bytes, applies queue tags, and writes metadata. It does **not** verify that pixels match intent. Batch 001 mistakes came from skipping this step.

| Gate | Do | Do not |
|------|-----|--------|
| **Pixels** | Download preview → open thumbnail → confirm subject, angle, mood | Trust HTTP 200, dimensions-only checks, or search snippets |
| **URL slugs** | Treat `sourcePageUrl` path segments as hints only | Assume Pexels/Unsplash slug text describes the file at that photo ID |
| **`imageId`** | Name for composition truth (`pour_brew`, not `pour_topdown`) | Encode hoped-for content in the ID before verifying |
| **`paletteFamily`** | Tag **dominant tones in the photograph** (steel + crema → `warm-earth`) | Tag to match the kit palette (`midnight_luxe` → `deep-moody`) when the photo is bright |
| **`sceneType`** | Tag what the frame is (texture, object, environment…) | Copy scene type from a layout slot before picking the photo |
| **Orientation** | Check native aspect **before** queueing; see [Orientation](#orientation-portrait--landscape) | Assume landscape because the layout slot is landscape |

**Reject** if: watermarks, readable logos, off-register mood, identifiable faces (when policy says avoid), or any mismatch between preview and tags.

### Orientation (portrait / landscape)

Orientation is **derived at ingest** from processed pixel dimensions — not set in the queue JSON.

```21:23:packages/generation/src/image-bank/processAsset.ts
export function orientationFromDimensions(width: number, height: number): ImageBankOrientation {
  return height > width ? 'portrait' : 'landscape'
}
```

| Source aspect | Stored `orientation` | PDF layout |
|---------------|------------------------|------------|
| Taller than wide | `portrait` | 3:4 frame |
| Wider than tall | `landscape` | 4:3 frame |
| **Square (1:1)** | **`landscape`** (tie-break: height ≯ width) | 4:3 frame |

There is **no `square` enum** — only `portrait` | `landscape` (`IMAGE_BANK_ORIENTATIONS`). Near-square textures may *look* square in a viewer but still classify from exact width/height after resize (`fit: inside`, long edge 1600px).

**Example:** `batch001_beans_texture` ingests as **1600×1220 → `landscape`**, which matches vr_6 `grid_a` (texture, landscape). If you need a portrait texture slot later, source a genuinely taller crop — do not rely on square assets filling portrait slots.

The ranker assigns assets to layout slots where **both** `orientation` and `sceneType` match (`visualReferencePipeline.ts`).

### When to source more images

| Goal | Bank size | Action |
|------|-----------|--------|
| **Northwind smoke PDF** (folios 06–07) | **6** (batch 001) | Done — spread fills when ≥6 picks match slot orientations |
| **Phase 1 seed** (validate rubric + layouts) | **~36** | Yes — ~1 asset per style×scene cell; use coverage report |
| **Pro-G ship gate** | **≥180** (240–300 target) | Yes — bulk sourcing; prioritize thin cells from `npm run image-bank-coverage` |

After batch 001: **do not pause on Northwind**, but **do** continue Phase 1 in small reviewed batches (5–10 assets). Run coverage after each batch; let thin cells drive the next queue — not ad-hoc search.


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
