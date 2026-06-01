# Moodboard bank — batch 007 review (spread coherence + pattern fix)

**Status:** `batch007_warm_pattern` **removed** · logic guardrails added  
**Date:** 2026-05-31  
**Bank:** 44 assets (45 − 1 mis-curated)

---

## Problem

`batch007_warm_pattern` was a **full white kitchen** tagged `pattern` because of a hex backsplash. At 4:3 cover crop it read as a generic kitchen — out of place beside coffee/cafe imagery on Northwind folio 08 `grid_c`.

Root cause: tag scores favored `refined` + `hospitality_food`; no guard against full-room interiors in pattern slots.

---

## Fixes

### Logic (`spreadCoherence.ts` + `visualReferencePipeline.ts`)

| Guard | Weight | Purpose |
|-------|-------:|---------|
| Secondary register match | +8 | `warm` assets compete for `luxe_refined` kits at slot fill |
| Pattern full-scene penalty | −24 | `interiors-spaces` on `pattern` rows |
| Full-bank slot pool | — | Orientation+sceneType matches beyond top-30 shortlist |
| (existing) Industry match / clash | +10 / −14 | Sector alignment |
| (existing) Futuristic-min clash | −18 | Sleek geo vs warm spread; brutalist kits exempt |

### Curation

- **Removed** `batch007_warm_pattern` (kitchen misfile).
- Ingest warning when `pattern` + `interiors-spaces` (`validateIngestTags.ts`).
- Northwind `grid_c` now picks **`batch005_playful_pattern`** (earthy tile grid, `hospitality_food`) via secondary-register + industry coherence.

### Retag (unchanged from prior pass)

`batch002_refined_pattern` → moods `futuristic`, `sharp`, `geometric` (not brutalist).

---

## Verify

```bash
npm test -- --run src/image-bank/
npm run generate:pro-pdfs -- vision --no-ai
```

Northwind `grid_c` → `batch005_playful_pattern` (earthy tiles, not white kitchen).
