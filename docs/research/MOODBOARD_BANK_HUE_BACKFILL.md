# Moodboard bank — prominent hue backfill (27 assets)

**Status:** Pixel-verified · mapped to **closed 9-bucket vocabulary**  
**Date:** 2026-05-31  
**Definitions:** [`MOODBOARD_BANK_HUE_DEFINITIONS.md`](./MOODBOARD_BANK_HUE_DEFINITIONS.md)

---

## Summary

| | Count |
|---|------:|
| **Tagged** | 14 |
| **Omit** | 13 |
| **Distinct chromatic buckets in bank** | 6 (`yellow`, `orange`, `blue`, `teal`, `green`, + `multicolor`, `achromatic`) |

**Rule applied:** One primary bucket per image unless two chromatic heroes each ≥ ~25%. Dual orange+teal welding pairs tagged **`orange` only** (spark shower is the signal; teal cast maps to grading). `window_light` tagged **`blue` only** (sky hero; teal tower → nearest `blue` bucket policy for single-primary default).

---

## Backfill table

| imageId | prominentHueFamilies | Notes |
|---------|----------------------|-------|
| batch001_beans_texture | — | Earth brown; omit |
| batch001_cafe_night | — | Deep neutrals |
| batch001_espresso_still | — | Brown/cream/metal neutral |
| batch001_hands_cup | — | Warm browns |
| batch001_pour_brew | `teal` | Teal/navy environment |
| batch001_window_light | `blue` | Sky/city glass hero |
| batch002_playful_object | — | White/black product |
| batch002_raw_environment | `orange` | Spark shower primary |
| batch002_refined_pattern | `achromatic` | Grey geometric |
| batch002_refined_texture | `achromatic` | Charcoal concrete |
| batch002_sharp_lighting | `teal` | Teal wall ~70% |
| batch002_warm_object | — | Wood/coffee neutral |
| batch003_austere_environment | — | White/grey architecture |
| batch003_austere_object | `achromatic` | White/black product |
| batch003_austere_texture | `achromatic` | White/grey marble |
| batch003_raw_people | `orange` | Grinder sparks primary |
| batch003_sharp_environment | `teal` | Slate-teal walls |
| batch003_warm_environment | `green` | Foliage hero |
| batch004_raw_lighting | — | Neutral industrial |
| batch004_raw_object | — | Moody neutral still |
| batch004_raw_texture | — | Weathered wood |
| batch004_raw_pattern | `multicolor` | Rainbow fluid pour |
| batch004_warm_lighting | — | White/cream interior |
| batch004_warm_pattern | — | Neutral textiles |
| batch004_warm_people | — | Dough/skin neutral |
| batch004_sharp_texture | `teal` | Teal CGI surface |
| batch004_sharp_object | `yellow` | Yellow ground hero |

---

## Curator policy (ongoing)

1. Map real color → **nearest bucket** in hue definitions doc — never add labels outside the enum.
2. **Default one tag**; two only with documented dual-hero QA.
3. Cyan/magenta language in notes or hex → `teal` / `violet` automatically.
