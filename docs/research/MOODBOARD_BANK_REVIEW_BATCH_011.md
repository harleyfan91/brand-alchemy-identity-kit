# Moodboard bank — batch 011 review (Phase 2 depth)

**Status:** Ingested 2026-06-02 · 70 bank assets  
**Date:** 2026-06-02  
**Target:** Thin style×scene cells, raw/playful depth, sharp environment, second refined pattern/texture

---

## Sourcing funnel

| Stage | Count |
|-------|------:|
| URLs gathered (primary + retests) | 45+ |
| Preflight pass (unique) | 25 |
| Visual QA approve | **9** |
| Queue rows | **9** |

**Lesson:** Many legacy Unsplash photo IDs now return **404**; Pexels CDN IDs frequently **mismatch** slugs (meeting room served as “desk flat lay”). Batch 011 retested with **pixel QA on every survivor** and favors **2025–2026 Unsplash IDs** where possible.

Preflight previews: `packages/generation/dev/image-bank/_preflight/batch-011/`

---

## Approved queue (9)

| imageId | Cell | Notes |
|---------|------|-------|
| `batch011_sharp_environment_towers` | sharp × environment | Teal glass residential tower, low angle |
| `batch011_sharp_people_engraving` | sharp × people | Copper engraving hands (partial face blur OK) |
| `batch011_warm_lighting_neon` | warm × lighting | Neon panels in stone vault · `red` (was `multicolor` — cyan accents, red/orange owns frame) |
| `batch011_playful_texture_honeycomb` | playful × texture | 3D hexagon render · portrait |
| `batch011_playful_texture_waves` | playful × texture | Glitch neon gradient waves |
| `batch011_playful_pattern_facade` | playful × pattern | Triangular metal facade · B&W |
| `batch011_refined_pattern_gradient` | refined × pattern | **Swapped** — white marble hex floor tile (was plain gradient) |
| `batch011_refined_texture_curves` | refined × texture | **Swapped** — white marble veining close-up (was abstract curves wallpaper) |
| `batch011_austere_people_pottery` | austere × people | Pottery wheel hands, no face |

**Deferred (batch 012):** Wellness people (spa/massage hands-only), refined×object desk still life, retail environment without faces/signage — blocked by Pexels mismatches + face policy on retest URLs.

---

## Expected impact (61 → 70 assets)

| Cell | Before | After |
|------|--------|-------|
| sharp × environment | 1 | **2** |
| sharp × people | 1 | **2** |
| warm × lighting | 1 | **2** |
| playful × texture | 1 | **3** |
| playful × pattern | 1 | **2** |
| refined × pattern | 1 | **2** |
| refined × texture | 2 | **3** |
| austere × people | 1 | **2** |

---

## Ingest

```bash
cd packages/generation
npm run ingest-image-bank -- --queue=dev/image-bank/queue.batch-011-phase2-depth.json
npm run image-bank-coverage
npm run image-bank-persona-smoke
```

---

## Batch 012 hints

- Unsplash-only shortlist for **wellness hands** and **refined object** (verify pixels before queue)
- Retail **environment** — empty boutique, shot from doorway, no legible signage
- `raw × lighting` — workshop window (candidate `raw_lit_b` passed preflight; reject readable machine labels)
- Continue filling cells still at 1–2/5 across raw, playful, austere registers
