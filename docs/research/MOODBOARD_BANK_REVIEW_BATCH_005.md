# Moodboard bank — review batch 005 (phase B)

**Status:** Pixel-verified → ingested via `queue.batch-005-phase-b.json`  
**Date:** 2026-05-31  
**Goal:** Close Phase 1 — fill final **10** empty style×scene cells (playful + austere + sharp gaps).

---

## Coverage targets

| ID | Cell filled | Orientation |
|----|-------------|-------------|
| batch005_sharp_people | sharp × people | landscape |
| batch005_sharp_pattern | sharp × pattern | portrait |
| batch005_playful_texture | playful × texture | landscape |
| batch005_playful_environment | playful × environment | landscape |
| batch005_playful_people | playful × people | landscape |
| batch005_playful_lighting | playful × lighting | landscape |
| batch005_playful_pattern | playful × pattern | landscape |
| batch005_austere_people | austere × people | landscape |
| batch005_austere_lighting | austere × lighting | landscape |
| batch005_austere_pattern | austere × pattern | landscape |

Bank: 27 → **37 assets** after ingest. **All 36 style×scene cells ≥1** — Phase 1 floor complete.

---

## Curator sign-off

| ID | Approve? | `paletteFamily` | `prominentHueFamilies` | Notes |
|----|----------|-----------------|--------------------------|-------|
| batch005_sharp_people | ☑ | `deep-moody` | — | Carpenter hands on table saw — hard side light, no face |
| batch005_sharp_pattern | ☑ | `clean-monochrome` | `achromatic` | B&W brutalist zigzag fire-escape shadows |
| batch005_playful_texture | ☑ | `soft-organic` | — | **Replaced** — hands knitting muted variegated yarn (was neon 3D abstract) |
| batch005_playful_environment | ☑ | `bright-fresh` | `yellow` | Yellow armchair + grey interior — pop-color read |
| batch005_playful_people | ☑ | `bold-saturated` | `multicolor` | Paint-covered hands on black, no face — kept |
| batch005_playful_lighting | ☑ | `warm-earth` | — | **Replaced** — Edison pendant bulbs, warm amber glow (was neon vault) |
| batch005_playful_pattern | ☑ | `soft-organic` | — | **Replaced** — earthy square tile grid (was glitter macro) |
| batch005_austere_people | ☑ | `cool-minimal` | — | Single grey clay-stained hand on wood bench |
| batch005_austere_lighting | ☑ | `soft-organic` | `green` | Matte black lamp on sage wall — light study |
| batch005_austere_pattern | ☑ | `bright-fresh` | `blue` | Cream stucco planes + hard shadows + sky blue wedge |

---

## Rejected during QA

| Candidate | Reason |
|-----------|--------|
| sharp_ppl_a | Visible face/beard — people QA fail |
| sharp_pat_b | Pure cyan→purple gradient, not a pattern |
| play_env_c / play_env_d | Pexels slug mismatch — Grand Central clock B&W |
| play_env_e | Cozy suburban living room — not playful register |
| play_ppl_c | Toddler with identifiable body/face |
| play_pat_c | Metallic triangular facade — reads sharp/austere not playful |
| aust_light_e | Suburban house exterior — not a lighting study |
| play_tex_b URL | Slug mismatch — coffee roaster not powder |

---

## Sourcing notes

- Retest file: `candidates.batch-005-phase-b-retest.json`
- `photo-1750727548934` (honeycomb) passed preflight but **failed at ingest** — use ingest-time retry or alternate CDN row when preflight PASS ≠ ingest PASS.
- Pexels `5824907` slug still unreliable — verify pixels, not page title.

---

## Playful row replace pass (2026-05-31)

Initial batch 005 playful cells over-indexed on neon/CGI stock. Swapped **3 assets** under same `imageId`s after MVP guardrail review — see [`MOODBOARD_BANK_CURATION.md`](./MOODBOARD_BANK_CURATION.md) § MVP bank character.

Queue: `queue.batch-005-playful-replace.json` · Candidates: `candidates.batch-005-playful-replace.json`

**Bank after replace:** `bold-saturated` 6→3 · `multicolor` hue tags 5→2 (people + raw pour only).

---

## Phase 1 complete

Next: **persona smoke gate (~60–72 assets)** — 2–3 images per `industrySuitability` tag across 8 Pro fixtures.
