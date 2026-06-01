# Moodboard bank — batch 008 review (hospitality landscape environment)

**Status:** Ingested · Northwind `lead_1` fixed  
**Date:** 2026-05-31  
**Assets:** 1 new (45 total bank)

---

## Gap

Northwind `lead_1` required **landscape + environment**. The bank had no `hospitality_food` landscape environment — only portrait `batch001_cafe_night` and landscape `batch001_window_light` tagged as **lighting**. The ranker fell through to `batch006_well_environment` (wellness spa still life).

---

## Ingested

| imageId | Scene | Notes |
|---------|-------|-------|
| `batch008_hospitality_environment` | environment · landscape | Cozy cafe interior — refined, warm, deep-moody |

Queue: `queue.batch-008-hospitality-environment.json`

Rejected: `hosp_env_d` (readable sidewalk menu signage).

---

## Northwind picks (after batch 008)

| Slot | Asset |
|------|-------|
| lead_1 | **`batch008_hospitality_environment`** ✓ |
| lead_2 | `batch001_hands_cup` |
| lead_3 | `batch001_pour_brew` |
| grid_a | `batch001_beans_texture` |
| grid_c | `batch007_warm_pattern` |

```bash
npm run generate:pro-pdfs -- vision --no-ai
```
