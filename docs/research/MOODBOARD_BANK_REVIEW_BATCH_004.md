# Moodboard bank — review batch 004 (phase A)

**Status:** Pixel-verified → ingest via `queue.batch-004-phase-a.json`  
**Date:** 2026-05-31  
**Goal:** Phase 1 seeding — complete **raw** register gaps + warm/sharp holes (9 cells).

---

## Coverage targets

| ID | Cell filled | Orientation |
|----|-------------|-------------|
| batch004_raw_texture | raw × texture | landscape |
| batch004_raw_object | raw × object | landscape |
| batch004_raw_lighting | raw × lighting | landscape |
| batch004_raw_pattern | raw × pattern | portrait |
| batch004_warm_people | warm × people | landscape |
| batch004_warm_lighting | warm × lighting | portrait |
| batch004_warm_pattern | warm × pattern | landscape |
| batch004_sharp_texture | sharp × texture | landscape |
| batch004_sharp_object | sharp × object | landscape |

Bank: 18 → **27 assets** after ingest. Raw register **complete (6/6)**.

---

## Curator sign-off

| ID | Approve? | `paletteFamily` | `prominentHueFamilies` | Notes |
|----|----------|-----------------|--------------------------|-------|
| batch004_raw_texture | ☑ | `warm-earth` | — | Weathered vertical wood planks — earthy, no single hero hue |
| batch004_raw_object | ☑ | `deep-moody` | — | Speckled ceramic bottles + dried poppy heads — low-key neutral still life |
| batch004_raw_lighting | ☑ | `warm-earth` | — | Abandoned industrial interior, light shaft on worn floor — no people |
| batch004_raw_pattern | ☑ | `bold-saturated` | `multicolor` | Dark fluid/marbled macro — rainbow/metallic pour; **was** `deep-moody` (grading mis-tag) |
| batch004_warm_people | ☑ | `warm-earth` | — | Baker hands shaping dough balls — no face; skin/dough warm-neutral |
| batch004_warm_lighting | ☑ | `bright-fresh` | — | Bright minimalist interior with arc lamp — portrait |
| batch004_warm_pattern | ☑ | `soft-organic` | — | Clothing rack, embroidered sleeve — neutral retail tones |
| batch004_sharp_texture | ☑ | `cool-minimal` | `teal` | Teal/black angular 3D surface — **teal is the signal hue** |
| batch004_sharp_object | ☑ | `bold-saturated` | `yellow` | Black headphones on **saturated yellow** ground — yellow is hero backdrop |

### Hue-signal QA (batch 004)

Three assets carry **named salient hues** that `paletteFamily` alone cannot express. Tag both layers: overall grading + hero hue(s). See [`MOODBOARD_BANK_TAG_TAXONOMY.md`](./MOODBOARD_BANK_TAG_TAXONOMY.md) § Prominent hue families.

---

## Rejected during QA (retest rounds)

| Candidate | Reason |
|-----------|--------|
| raw_light_d | Architect with visible face — people not lighting |
| warm_ppl_a | Three identifiable faces in kitchen |
| warm_ppl_d (pexels 3789885) | Food cheese-pull — no hands/people |
| sharp_tex_c (pexels 962312) | Tree silhouettes — slug mismatch |
| sharp_tex_d | Coffee roaster — duplicate register with existing bank |
| raw_light_f (pexels 259588) | Suburban house exterior — slug mismatch |
| warm_ppl_e (pexels 234515) | Child portrait with face — slug mismatch |
| sharp_tex_h | Milky Way landscape — not texture |
| sharp_tex_j | Glitch/corrupt digital artifact |

---

## Sourcing notes

- **Pexels CDN slugs are unreliable** — always open `_preflight/*.jpg` pixels; do not trust search notes alone.
- **Unsplash photo IDs** from page HTML (`photo-{timestamp}-{hash}`) preflight reliably; guessed hashes 404.
- Retest files: `candidates.batch-004-phase-a-retest.json`, `-retest2.json`, `-retest3.json`, `-retest4.json`, `candidates.batch-004-sharp-tex.json`.
