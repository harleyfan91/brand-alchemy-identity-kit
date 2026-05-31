# Moodboard image bank — tag taxonomy

**Status:** Vocabulary aligned with R5 signal model (§9.1) — **bulk sourcing blocked until bank re-axis to style×scene**  
**Date:** 2026-05-30  
**Read first:** [`MOODBOARD_SIGNAL_MODEL.md`](./MOODBOARD_SIGNAL_MODEL.md) — photography vs color-system layers, weighting, intake gaps  
**Implementation:** `packages/shared/src/imageBank/`  
**Related:** [`MOODBOARD_BANK_CURATION.md`](./MOODBOARD_BANK_CURATION.md), [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8, [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §7.3.4

> **Note:** Tag *vocabulary* is locked for R5. Coverage sourcing axis is **`styleRegister × sceneType`** (36 cells), not palette×scene — see [`MOODBOARD_SIGNAL_MODEL.md`](./MOODBOARD_SIGNAL_MODEL.md) §9.1 D2. Bank field `paletteFamily` is **photo color character** (dominant grading in the photograph), not “matches buyer swatches.”

---

## Purpose

This document is the **tagging source of truth** for the Pro moodboard image bank. Complete this taxonomy review and sign off on the mapping tables **before** bulk sourcing begins.

Every bank image carries tags from controlled vocabularies. Tags drive:

1. **Deterministic shortlist** (20–30 candidates per kit)
2. **AI ranker** input (Haiku picks 6–9 with scene variety)
3. **Coverage reporting** (36-cell matrix: 6 style registers × 6 scene types; track portrait/landscape counts per cell)

---

## Tag layers

| Layer | Required? | Count | On every image? |
|-------|-----------|-------|-----------------|
| **Primary** | Yes | 3 enums + orientation + license | Yes |
| **Secondary** | No | mood, industry, narrator, imagery subjects, prop category, prominent hue families | Optional refinements |

### Primary tags (required at ingest)

| Field | Enum count | Source at kit time |
|-------|------------|-------------------|
| `paletteFamily` | 8 | Soft (~5%) photo color character; `paletteFamilyFromPaletteId()` when no reference profile |
| `styleRegister` | 6 | `primaryStyleRegisterFromSelectedStyle(step6.selectedStyle)` |
| `sceneType` | 6 | Ranker + scene-variety walker |
| `orientation` | 2 | Derived from processed JPEG dimensions |
| `license` | 3 | Ingest metadata (compliance only) |

### Secondary tags (optional)

| Field | Enum count | Source at kit time |
|-------|------------|-------------------|
| `moodAdjectives` | 16 (same as Step 6 chips) | `step6.moodAdjectives[]` |
| `imagerySubjects` | 10 | Bank + reference vision — **fulfillment-inferred**, not Step 6 intake |
| `propCategory` | 8 | Curator at ingest — **dominant prop** when sector-specific |
| `industrySuitability` | 8 | `industrySuitabilityFromIndustryId(step1.industry)` |
| `narratorAlignment` | 5 | `narratorAlignmentFromBrandNarrator(step1.brandNarrator)` |
| `prominentHueFamilies` | 9 | Curator at ingest — **salient hues** mapped to closed definitions (§ Hue definitions) |

**Rule:** Secondary tags improve ranking; absence is valid (industry-agnostic images are preferred unless the shot is clearly sector-specific).

**Read first for hue tagging:** [`MOODBOARD_BANK_HUE_DEFINITIONS.md`](./MOODBOARD_BANK_HUE_DEFINITIONS.md) — canonical buckets, angle boundaries, max-two rule.

---

## Palette family (8) — photo color character

Maps from **named wizard palettes** for kit-side soft matching — not a mandate that photos echo buyer hexes.

**Curator assignment rule:** Tag the **color grading and dominant temperature of the photograph itself**. Ask: *"What is the photo's color character?"* — not *"Does this match the buyer's palette?"*

**Kit assignment rule:** `paletteFamilyFromPaletteId(selectedPalette)` supplies a soft default; **`referenceVisionProfile.photoColorCharacter` overrides** when reference upload present (OUTPUT_TRANSLATION_SPEC §5.8.6).

| Family | Visual read | Example wizard palettes |
|--------|-------------|-------------------------|
| `warm-earth` | Terracotta, honey, walnut, sand, spice | `earthy_warmth`, `terracotta_clay`, `amber_glow`, `walnut_cream` |
| `cool-minimal` | Cool blues, paper neutrals, restrained chroma | `arctic_blue`, `ocean_calm`, `minimal_light`, `paper_stone` |
| `bold-saturated` | High contrast, neon accents, pop multi | `signal_orange`, `cyber_lime`, `cobalt_punch`, `studio_confetti` |
| `soft-organic` | Muted naturals, sage, seafoam, dusty rose | `moss_meadow`, `forest_deep`, `sea_glass`, `carnation_soft` |
| `deep-moody` | Dark anchors, wine/plum/navy depth | `midnight_luxe`, `ink_navy`, `rose_dusk`, `plum_violet` |
| `bright-fresh` | Airy blues, citrus, mint, open light | `mint_fresh`, `coastal_teal`, `powder_navy`, `citrus_pop` |
| `muted-sophisticated` | Editorial mid-tones, periwinkle, violet haze | `indigo_bloom`, `midnight_cerulean`, `violet_haze` |
| `clean-monochrome` | Achromatic only — true gray/black/white | `carbon_paper`, `graphite_fog` |

**Code:** `PALETTE_ID_TO_IMAGE_BANK_FAMILY` in `packages/shared/src/imageBank/paletteFamilyMap.ts` — every `PALETTE_CATALOG` id must map (enforced by test).

**Do not conflate with `prominentHueFamilies`:** `paletteFamily` is overall grading (warm vs cool, moody vs airy). A photo can be `cool-minimal` overall while still carrying a **salient teal or yellow** that matters for brand-color alignment — tag both layers when applicable (§ Prominent hue families).

---

## Prominent hue families (9) — optional, closed vocabulary

Salient hues map to a **fixed list of nine buckets** — not an open-ended color array. Curators assign the **nearest canonical bucket** to what appears in the photograph; cyan→`teal`, magenta/pink→`violet`. Full angle boundaries, exemplar hex, and assignment rules: [`MOODBOARD_BANK_HUE_DEFINITIONS.md`](./MOODBOARD_BANK_HUE_DEFINITIONS.md).

| Value | One-line read |
|-------|----------------|
| `red` | Red hero (350–15°) |
| `orange` | Orange / rust / amber hero |
| `yellow` | Yellow / gold hero |
| `green` | Green / foliage hero |
| `teal` | Teal / cyan / aqua hero |
| `blue` | Blue / navy hero |
| `violet` | Violet / magenta / pink hero |
| `multicolor` | No single bucket owns the frame |
| `achromatic` | Neutral-only / B&W |

**Assignment rule:** **0–2** tags. **Prefer one** chromatic bucket. Two only when two buckets each ≥ ~25%. `multicolor` and `achromatic` must appear alone. Omit for earthy/neutral shots.

**Kit-side:** `inferKitHueSignals()` maps hex + visualNotes into the same buckets. Matcher **+5 / −5** on overlap; avoid penalty persists through broadening.

**Code:** `IMAGE_BANK_PROMINENT_HUE_FAMILIES`, `hexToProminentHueFamily`, `validateProminentHueFamilies` in `packages/shared/src/imageBank/prominentHueFamilies.ts`.

---

## Style register (6)

Maps from **4 wizard styles** → primary + secondary registers for matching.

| Register | Visual read | Typical photo cues |
|----------|-------------|-------------------|
| `refined` | Controlled, editorial, quiet precision | Clean lines, negative space, styled still life |
| `raw` | Honest, unpolished, tactile imperfection | Grain, handmade surfaces, unstyled environments |
| `warm` | Inviting, human, soft light | Golden hour, wood, fabric, café warmth |
| `sharp` | High contrast, decisive, graphic | Hard light, geometric shadow, bold color blocks |
| `playful` | Expressive, pop, unexpected color | Saturated props, whimsical composition |
| `austere` | Stripped back, severe, minimal ornament | Sparse frames, muted palette, architectural severity |

| Wizard `selectedStyle` | Primary | Secondary (broadening) |
|------------------------|---------|------------------------|
| `clean_minimal` | `refined` | `austere`, `sharp` |
| `bold_graphic` | `sharp` | `playful`, `refined` |
| `organic_natural` | `warm` | `raw`, `refined` |
| `luxe_refined` | `refined` | `austere`, `warm` |

**Assignment rule:** Tag one register per image at ingest; kits match primary first, then secondary when broadening per OUTPUT_TRANSLATION_SPEC §5.8.9.

**Code:** `SELECTED_STYLE_TO_STYLE_REGISTER` in `styleRegisterMap.ts`.

---

## Scene type (6)

Drives moodboard **variety** — ranker enforces ≤3 of any single type per board.

| Type | Definition | Sourcing notes |
|------|------------|----------------|
| `texture` | Materials, surfaces, abstract tactility | Highest volume (30% of bank). Linen, stone, paper, wood grain. |
| `object` | Still life, single subject, product-adjacent | Simple backdrops; no readable branding. |
| `environment` | Places, spaces, settings without portrait focus | Interiors, storefronts, landscapes, workspaces. |
| `people` | Hands at work, candid moments — **no identifiable faces** unless model-released | Hardest to source ethically; 10% target. |
| `lighting` | Mood-driven light/dark studies | Shadow play, golden hour abstracts, window light. |
| `pattern` | Abstract/geometric repetition | Tiles, shadows, macro patterns. |

**Reject at QA:** stock clichés (handshake, laptop-on-desk generic), watermarks, readable logos, uncredited faces.

---

## Imagery subjects (10)

Same controlled vocabulary for **bank tags** and **reference vision output** (OUTPUT_TRANSLATION_SPEC §5.8.5) — not a buyer-facing chip list:

`nature-outdoors`, `interiors-spaces`, `studio-neutral`, `urban-context`, `architecture-built`, `food-dining`, `hands-process`, `product-still-life`, `people-community`, `materials-texture`

**Assignment rule:** Pick **1–3** per image when the subject is clear. Optional — many texture/environment shots may omit subjects and rely on scene type alone.

---

## Prop category (8) — optional

Tags the **dominant prop or product** in frame when it carries sector meaning beyond `sceneType` + `imagerySubjects`. A watch and a Chemex are both `object` + `product-still-life`, but imply different businesses.

| Category | When to use | Examples |
|----------|-------------|----------|
| `neutral-generic` | No sector-specific prop, or abstract/environment-only | Marble texture, empty corridor, latte-free interior |
| `food-beverage` | Coffee, food, kitchen, dining props | Chemex, portafilters, latte, beans |
| `wearables-tech` | Worn or handheld consumer tech as hero | Smartwatch, headphones |
| `craft-tools` | Manual trade / making process | Pottery hands, angle grinder, welding, leather bench |
| `camera-media` | Photo/film gear as hero | Polaroid camera, lenses |
| `office-tech` | Engineering / desk tech | PCB repair, laptop clichés (avoid generic stock) |
| `beauty-personal` | Skincare, cosmetics | Serum bottles, spa product |
| `fashion-accessories` | Apparel-adjacent product stills | Leather bag, jewelry flat-lay |

**Assignment rule:** **0 or 1** per image. Required when `sceneType` is `object` or `people` and a recognizable prop drives sector read. Textures/patterns/environments usually omit (implicit `neutral-generic`).

**Industry alignment rule:** When `propCategory` is sector-specific, **`industrySuitability` must agree** — e.g. `office-tech` → `b2b_tech`, not `makers_artisans`; `craft-tools` + hands → `makers_artisans`.

**Matcher:** Kit-side `propCategoryHints` inferred from Step 1 industry (`propCategoryInference.ts`); deterministic scorer adds +8 when asset category ∈ hints (Model B weight). **`prominentHueFamilies`** scored via `prominentHueHarmony` (+5 / −5) — see OUTPUT_TRANSLATION_SPEC §5.8.10.

**Ranker:** Still reads pixels holistically — `propCategory` is a deterministic guardrail, not a substitute for QA.

---

## Mood adjectives (16)

Same controlled vocabulary as Step 6 `moodAdjectives[]`:

`warm, cool, refined, raw, calm, energetic, playful, austere, organic, geometric, vintage, futuristic, premium, accessible, soft, sharp`

**Assignment rule:** Pick **2–4** that a buyer selecting those chips would agree with. Symmetric with intake — tag-match scores overlap between image tags and kit chips.

---

## Industry suitability (8)

Optional. Tag only when the image **clearly** suits a sector; otherwise leave empty.

| Tag | When to use |
|-----|-------------|
| `professional_services` | Law, finance, consulting, B2B office cues |
| `hospitality_food` | Café, kitchen, table, beverage, dining |
| `makers_artisans` | Workshop, craft process, handmade objects |
| `wellness_healthcare` | Spa, clinic calm, fitness, self-care (non-clinical stock) |
| `retail_commerce` | Shop floor, product display, packaging |
| `creative_agency` | Studio, design process, expressive setups |
| `b2b_tech` | Product UI-adjacent (no readable UI), modern office tech |
| `lifestyle_consumer` | Broad DTC / home / automotive / community |

**Code:** `INDUSTRY_ID_TO_IMAGE_BANK_SUITABILITY` maps Step 1 industry ids → these tags for kit-side matching.

---

## Narrator alignment (5)

Optional. Tag when an image **strongly** reads as a specific business posture.

| Tag | Visual cue |
|-----|------------|
| `solo_maker` | Hands crafting, small-batch process |
| `solo_expert` | Professional portrait-adjacent environment, 1:1 service |
| `local_team` | Small team in community setting, storefront |
| `growing_co` | Scale-up energy, product + team hints |
| `established_org` | Institutional space, mission-driven gathering |

Intake `brandNarrator` maps via `BRAND_NARRATOR_TO_IMAGE_BANK_ALIGNMENT` (`product_led` → `growing_co`, `mission_community` → `established_org`).

---

## Orientation

Derived automatically at ingest from processed JPEG dimensions:

- **Portrait:** height > width → 3:4 PDF frame
- **Landscape:** width ≥ height → 4:3 PDF frame

Ranker must assign picks to layout slots matching orientation (`visualReferenceLayouts.ts`).

---

## Tag assignment checklist (pre-ingest QA)

Before adding a row to `queue.json`:

1. **Primary palette family** — color grading matches one family definition above
2. **Style register** — photo behavior matches one register (not the buyer style name)
3. **Scene type** — exactly one; clearest subject category wins
4. **Mood** — 2–4 chips max; omit if ambiguous
5. **Imagery subjects** — 0–3 chips when subject matter is clear
6. **Prop category** — 0–1 when a recognizable object implies a sector (see § Prop category)
7. **Industry** — 0–2 tags; must align with `propCategory` when both set
8. **Prominent hues** — 0–2 canonical buckets when a named hue is a hero ([`MOODBOARD_BANK_HUE_DEFINITIONS.md`](./MOODBOARD_BANK_HUE_DEFINITIONS.md)); prefer one; omit for earth neutrals
9. **Narrator** — 0–1 tag; default none
10. **Orientation** — will be auto-set; prefer native landscape/portrait sources (no extreme panoramas)
11. **Cohesion** — would this sit beside other images in the same style register without clashing?

---

## AI-assisted tagging (planned)

When sourcing begins, vision tagging should output **this vocabulary only** — no freeform tags. Human curator approves or overrides before ingest.

Suggested model output schema mirrors `ImageBankIngestTagsSchema` minus `sourceUrl` / `license`.

---

## Sign-off before sourcing

- [x] Signal model D1–D9 (MOODBOARD_SIGNAL_MODEL §9.1)
- [x] OUTPUT_TRANSLATION_SPEC §5.8 R5 revision
- [ ] Style register definitions reviewed (§ Style register)
- [ ] Scene type definitions + reject list reviewed (§ Scene type)
- [ ] Imagery subjects + photo color character rules reviewed
- [ ] Industry + narrator optional tag rules accepted
- [ ] Coverage matrix understood (36 style×scene cells × 5 minimum = 180 floor + orientation QA)

When all boxes are checked, proceed to [`MOODBOARD_BANK_CURATION.md`](./MOODBOARD_BANK_CURATION.md) § Sourcing workflow.
