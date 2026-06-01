# Moodboard bank — batch 006 review (industry gaps)

**Status:** Ingested · persona smoke **PASS**  
**Date:** 2026-05-31  
**Assets:** 6 (43 total bank)

---

## Goal

Close the three thin `industrySuitability` tags flagged by `npm run image-bank-persona-smoke`:

| Tag | Before | After |
|-----|-------:|------:|
| `wellness_healthcare` | 0 | 2 |
| `professional_services` | 1 | 3 |
| `retail_commerce` | 1 | 3 |

---

## Preflight

**Original candidates (12):** 8 pass, 4 fail (404s on `well_obj_a/b`, `pro_env_a`, `ret_obj_b`). Duplicates rejected: `well_env_a` (batch001 cafe), `pro_env_b` (batch003 sharp environment), `ret_obj_a` (austere watch).

**Replacements (5):** 3 pass — `well_obj_a2` (spa massage), `well_env_c` (yoga silhouette, q70 — not ingested), `pro_env_a2` (office lobby — not needed).

---

## Ingested assets

| imageId | Scene | Industry | Notes |
|---------|-------|----------|-------|
| `batch006_well_environment` | environment | wellness_healthcare | Spa still life — lotion, towel, tulips |
| `batch006_well_people` | people | wellness_healthcare | Massage oil pour — hands on back |
| `batch006_pro_people_a` | people | professional_services | Hands writing on paper |
| `batch006_pro_people_b` | people | professional_services | Tax forms + calculator overhead |
| `batch006_retail_environment_a` | environment | retail_commerce | Design store display (MOMA-style) |
| `batch006_retail_environment_b` | environment | retail_commerce | Men's apparel boutique |

Queue: `queue.batch-006-industry.json`

---

## Gate

```bash
npm run image-bank-persona-smoke   # exit 0 — industry + spread PASS
npm test -- --run src/image-bank/  # 41 tests pass
```

---

## Next

Scale toward ~60–72 persona-weighted assets; optional Pro PDF dry-run with `npm run generate:pro-pdfs -- text --no-ai`.
