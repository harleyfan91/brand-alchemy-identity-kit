# Moodboard bank — Phase 1 remaining cells

**Status:** **Phase 1 complete** — batch 005 phase B ingested 2026-05-31  
**Bank today:** **37 assets** · **36 of 36** style×scene cells have ≥1 image · **0 cells at 0**

Phase 1 goal: **≥36 assets** = one image per (style register × scene type) cell. **Done.**

The 37th asset is an extra in one already-filled cell (refined × object has 2) from batch 002 — harmless for the floor gate.

---

## Completed batches

| Batch | Assets | Milestone |
|-------|--------|-----------|
| 001 Northwind seed | 6 | Hospitality/coffee anchor |
| 002 Coverage seed | 6 | Refined + playful object |
| 003 Coverage seed | 6 | Austere + sharp environment |
| 004 Phase A | 9 | Raw register complete |
| 005 Phase B | 10 | Playful + austere gaps closed |

Review docs: `MOODBOARD_BANK_REVIEW_BATCH_001.md` … `MOODBOARD_BANK_REVIEW_BATCH_005.md`

---

## Next priority — persona smoke gate (~60–72 assets)

**CLI:** `npm run image-bank-persona-smoke` — deterministic spread dry-run + industry tag report (no AI).

**Today:** Persona spread gate **PASS** (8 fixtures). Industry gate **FAIL** — need batch 006 for `wellness_healthcare`, `professional_services`, `retail_commerce`. See [`MOODBOARD_BANK_PERSONA_SMOKE.md`](./MOODBOARD_BANK_PERSONA_SMOKE.md).

Add **2–3 images per `industrySuitability` tag** for the 8 Pro sectors:

`hospitality_food`, `professional_services`, `makers_artisans`, `creative_agency`, `retail_commerce`, `wellness_healthcare`, `b2b_tech`, `lifestyle_consumer`

Run `npm run image-bank-coverage` after each batch. Pro-G v1 gate remains **≥180 assets** for full 5×36 cell depth.

---

## Workflow (unchanged)

1. `candidates.batch-NNN.json` — 2–3 URLs per target cell
2. `npm run preflight-image-bank-candidates -- --file=... --save-dir=dev/image-bank/_preflight`
3. Visual QA on PASS rows
4. `queue.batch-NNN.json` → ingest
5. Hue tags per [`MOODBOARD_BANK_HUE_DEFINITIONS.md`](./MOODBOARD_BANK_HUE_DEFINITIONS.md)
