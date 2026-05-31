# Moodboard bank — review batch 001 (Northwind seed)

**Status:** Visually verified → ingested via `queue.batch-001-northwind-seed.json`  
**Date:** 2026-05-31 (re-sourced after slug/URL QA failure)  
**Goal:** First 6 assets aimed at **unlocking the Pro Visual Reference spread** for the **Northwind Roasters** smoke fixture (`pro-smoke/vision.json`) while seeding **`refined`** register coverage.

---

## Why this batch exists

| Need | How these images help |
|------|------------------------|
| **PDF gate (≥6 bank picks)** | Bank currently has 1 dev asset; spread is omitted until ≥6 tagged photos exist |
| **Northwind kit signals** | `luxe_refined` → **`refined`** register (+ `austere`, `warm` broadening); `midnight_luxe` → **`deep-moody`** photo color; moods **refined, warm, premium**; industry **food_beverage** |
| **vr_6 layout slots** | Mix of **landscape + portrait** and **scene types** (environment, object, texture, lighting, people/hands) so deterministic ranker can fill lead + grid slots |
| **Phase 1 seed** | One asset each toward several **`refined × sceneType`** cells (coverage report will still show 35 thin cells — this is a start, not the floor) |

**Review workflow:** For each row, confirm the photo read matches tags *before* ingest. Reject or retag if the image feels off-brand for Northwind (too bright, too casual, readable logos, identifiable faces).

**Batch 001 QA (2026-05-31):** First ingest used URL slugs and HTTP checks without opening JPEGs — several Unsplash page titles did not match CDN bytes (e.g. `1748137518698` served a hummus-bar storefront, not a café window). Batch re-sourced with pixel verification; dev seed `unsplash_1558618666…` removed from bank.

---

## Kit signals this batch is optimized for

From `packages/generation/src/fixtures/pro-smoke/vision.json`:

| Signal | Value | Matcher role |
|--------|-------|--------------|
| `selectedStyle` | `luxe_refined` | Primary register **`refined`** |
| `selectedPalette` | `midnight_luxe` | Soft photo color **`deep-moody`** |
| `moodAdjectives` | refined, warm, premium | Secondary mood overlap (28% weight) |
| `industry` | food_beverage | → `hospitality_food` when tagged |
| `brandNarrator` | local_team | → `local_team` narrator when tagged |

---

## Candidate images (6)

### 1. `batch001_window_light`

| | |
|---|---|
| **Source** | [Unsplash — café interior, city view through windows](https://unsplash.com/photos/modern-cafe-interior-with-city-view-through-windows-wig5ABekXgc) |
| **Orientation** | Landscape (expected after ingest) |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `refined` | Controlled composition, cinematic window frame, editorial stillness — reads **luxe_refined** not playful or raw |
| `sceneType` | `lighting` | Story is **glass, reflection, and interior glow** — not a wide environment hero |
| `paletteFamily` | `deep-moody` | Dominant dark interior + cool window tones; photo grading is low-key, not bright-fresh |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | refined, calm, premium | Quiet, gallery-like mood; matches Northwind “confident and calm” |
| `imagerySubjects` | interiors-spaces | Café interior as subject |
| `industrySuitability` | hospitality_food | Clearly food-service setting |

**Northwind / layout fit:** Strong **lead or grid landscape**; supports “neutral-backdrops / natural-full-color” photo–palette tension (dark photo world vs brass/navy brand).

---

### 2. `batch001_cafe_night`

| | |
|---|---|
| **Source** | [Unsplash — coffee shop at night](https://unsplash.com/photos/people-sitting-inside-a-coffee-shop-at-night-hSeSLSfPrl0) |
| **Orientation** | Portrait |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `refined` | Composed interior, warm practical light — specialty café, not neon pop-up |
| `sceneType` | `environment` | Full **space/setting** read; people are ambient, not portrait subject |
| `paletteFamily` | `deep-moody` | Night interior, deep shadows, warm pockets of light |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | warm, refined, calm | Evening café calm — on-brand for Northwind |
| `imagerySubjects` | interiors-spaces, people-community | Community café without face-forward portrait |
| `industrySuitability` | hospitality_food | |
| `narratorAlignment` | local_team | Neighborhood shop energy |

**QA note:** Confirm no identifiable faces in crop at 1600px long edge. If faces read too clearly → reject or reframe crop at ingest time (future enhancement).

**Layout fit:** **Portrait environment** slot (e.g. vr_6 `lead_2` or `grid_d`).

---

### 3. `batch001_espresso_still`

| | |
|---|---|
| **Source** | [Unsplash — three portafilters still life (portrait crop)](https://unsplash.com/photos/three-coffee-portafilters-on-stainless-steel-f8396924c348) |
| **Orientation** | Portrait |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `refined` | Clean top-down still; beans → grounds → latte progression |
| `sceneType` | `object` | Product/process still on bar surface; no readable branding |
| `paletteFamily` | `warm-earth` | Bright steel + roast browns/crema in the **photo itself** — even light, not low-key |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | premium, refined, warm | Specialty coffee register |
| `imagerySubjects` | food-dining, product-still-life | |
| `industrySuitability` | hospitality_food | |

**Layout fit:** **Portrait object** — grid or lead depending on ranker/tier.

---

### 4. `batch001_pour_brew`

| | |
|---|---|
| **Source** | [Unsplash — Chemex pour-over brew](https://unsplash.com/photos/chemex-pour-over-coffee-brew-e89e73853f31) |
| **Orientation** | Landscape |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `refined` | Side-angle brew scene; craft/process without clutter |
| `sceneType` | `object` | Chemex pour action is the hero; hands at edge of frame |
| `paletteFamily` | `deep-moody` | Low-key interior, deep shadows, warm coffee highlights in the **photo itself** |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | warm, organic, refined | Roasting/brew craft |
| `imagerySubjects` | hands-process, food-dining | Hands visible; no face |
| `industrySuitability` | hospitality_food, makers_artisans | Wholesale/roasting craft subtext |

**Layout fit:** **Landscape object** grid slot.

---

### 5. `batch001_beans_texture`

| | |
|---|---|
| **Source** | [Unsplash — coffee beans macro](https://unsplash.com/photos/coffee-beans-0c6688de566e) |
| **License** | `unsplash` |
| **Orientation** | Landscape |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `warm` | Tactile, organic macro — secondary register for `luxe_refined` kits when broadening |
| `sceneType` | `texture` | Pure material surface; highest-volume scene type in bank target mix |
| `paletteFamily` | `warm-earth` | Dominant brown/roast tones in the **photo itself** |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | organic, warm, premium | Specialty bean quality |
| `imagerySubjects` | materials-texture, food-dining | |
| `industrySuitability` | hospitality_food, makers_artisans | |

**Coverage cell:** Seeds **`warm × texture`** (also helps broadened matching for Northwind).

**Layout fit:** **Landscape texture** (vr_6 `grid_a`).

---

### 6. `batch001_hands_cup`

| | |
|---|---|
| **Source** | [Unsplash — hand holding latte (portrait crop)](https://unsplash.com/photos/hand-holding-a-latte-next-to-a-laptop-Oem-rm4vFkw) |
| **License** | `unsplash` |
| **Orientation** | Portrait |

**Primary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `styleRegister` | `refined` | Clean crop, soft light, intentional hands — not gritty raw |
| `sceneType` | `people` | **Hands-at-work** idiom; no face |
| `paletteFamily` | `deep-moody` | Dark wardrobe/background, cup highlight |

**Secondary tags**

| Tag | Value | Why |
|-----|-------|-----|
| `moodAdjectives` | warm, premium, calm | Daily ritual / slowing down — Northwind copy tone |
| `imagerySubjects` | hands-process, food-dining | |
| `industrySuitability` | hospitality_food | |
| `narratorAlignment` | local_team | Regular-at-the-bar feeling |

**Layout fit:** **Portrait people** slot (vr_6 `lead_2`).

---

## After ingest — verify

```bash
cd packages/generation
npm run image-bank-coverage
npm run generate:pro-pdfs -- vision --no-ai
```

Open `output/pro-smoke-vision/02-style-guide.pdf` — folios **06–07** should appear if ≥6 picks match layout orientations.

---

## Curator decisions (fill in)

| ID | Approve? | Notes |
|----|----------|-------|
| batch001_window_light | ☑ | Pixel-verified 2026-05-31 |
| batch001_cafe_night | ☑ | Unchanged from first ingest |
| batch001_espresso_still | ☑ | warm-earth retag (bright steel still) |
| batch001_pour_brew | ☑ | Renamed from pour_topdown — side-angle Chemex |
| batch001_beans_texture | ☑ | Pixel-verified 2026-05-31 |
| batch001_hands_cup | ☑ | Pixel-verified 2026-05-31 |

**Reject criteria reminder:** watermarks, readable logos, stock clichés, uncredited faces, wrong register (playful/neon for Northwind).
