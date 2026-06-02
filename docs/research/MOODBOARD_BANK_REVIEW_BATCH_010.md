# Moodboard bank — batch 010 review (industry rebalance)

**Status:** Ingested 2026-06-02 · 61 bank assets  
**Date:** 2026-06-02  
**Goal:** Reduce coffee/hospitality skew; deepen professional, wellness, b2b, retail

---

## Sourcing funnel

| Stage | Count |
|-------|------:|
| URLs gathered | 21 |
| Preflight pass | 17 |
| Visual QA approve | **9** |
| Queue rows | **9** |

**Rejected highlights:** Pexels slug mismatches (waterfall as “keyboard”, woman reading as “typing”), readable brand text (`The Ordinary`, `REAL ARTISTS SHIP`), visible faces in meeting overhead, grocery `SAVE` signage hero.

Preflight previews: `packages/generation/dev/image-bank/_preflight/batch-010/`

---

## Approved queue (9) — zero `food-beverage` props

| imageId | Cell | Industry tags | Notes |
|---------|------|---------------|-------|
| `batch010_refined_environment_office` | refined × environment | professional_services, b2b_tech | Open-plan desks, glass partitions |
| `batch010_refined_lighting_corridor` | refined × lighting | professional_services, b2b_tech | Glass hallway, warm pendants |
| `batch010_refined_people_meeting` | refined × people | professional_services, b2b_tech | Hands + charts (minor coffee cup at edge) |
| `batch010_refined_people_laptop` | refined × people | professional_services, b2b_tech, creative_agency | Hands pointing at laptop |
| `batch010_refined_texture_spa` | refined × texture | wellness_healthcare | Rose petals + dropper bottle, no brand |
| `batch010_sharp_object_circuit` | sharp × object | b2b_tech, makers_artisans | PCB components macro |
| `batch010_sharp_texture_chip` | sharp × texture | b2b_tech | Cool-toned chip macro (`teal`) |
| `batch010_austere_object_apparel` | austere × object | retail_commerce | B&W clothing rack |
| `batch010_retail_object_bag` | warm × object | retail_commerce, lifestyle | Bag + mini cart still life |

**Expected after ingest:** 61 assets · `professional_services` 7+ · `b2b_tech` 5+ · `wellness_healthcare` 3 · `retail_commerce` 5+

---

## Cells touched

| Cell | Before | After (expected) |
|------|--------|------------------|
| refined × environment | 6 | **7** |
| refined × people | 3 | **5** |
| refined × texture | 1 | **2** |
| refined × lighting | 1 | **2** |
| sharp × object | 1 | **2** |
| sharp × texture | 1 | **2** |
| austere × object | 1 | **2** |
| warm × object | 2 | **3** |

---

## Ingest

```bash
cd packages/generation
npm run ingest-image-bank -- --queue=dev/image-bank/queue.batch-010-industry-rebalance.json
npm run image-bank-persona-smoke
npm run image-bank-coverage
```

Re-run established-pro / pc05 smoke picks — top-6 should no longer be café-led.

---

## Batch 011 hints

- Wellness **people** (hands-only massage/facial) — still only 2 wellness assets after 010
- Retail **environment** without readable promo signage (boutique, not grocery SAVE banners)
- `refined × object` for professional (desk object, not coffee)
- Continue style×scene depth; avoid `food-beverage` unless filling a non-coffee hospitality gap
