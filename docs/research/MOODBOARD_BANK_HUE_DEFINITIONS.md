# Moodboard bank — prominent hue definitions (closed vocabulary)

**Status:** Canonical — curators and fulfillment map real color **into** these buckets only  
**Code:** `packages/shared/src/imageBank/prominentHueFamilies.ts`  
**Related:** [`MOODBOARD_BANK_TAG_TAXONOMY.md`](./MOODBOARD_BANK_TAG_TAXONOMY.md) § Prominent hue families

---

## Why a closed list

The bank must not drift into dozens of ad-hoc color names. Every salient hue in a photograph is tagged with **one of nine values** below (seven chromatic + `multicolor` + `achromatic`). Real-world colors that fall between buckets — cyan vs teal, magenta vs violet — map to the **nearest canonical bucket**, not a new label.

Kit-side hex inference uses the **same angle boundaries** so logo colors and bank tags speak one language.

---

## Canonical buckets (9)

| Bucket | Hue angle (HSL, °) | Absorbs (do not tag separately) | Exemplar hex | Tag when |
|--------|-------------------|----------------------------------|--------------|----------|
| `red` | 350–360, 0–15 | crimson, wine | `#D32F2F` | Red wall, garment, or grade owns ≥25% |
| `orange` | 15–45 | amber, rust, terracotta | `#F57C00` | Orange sparks, rust, warm clay hero |
| `yellow` | 45–70 | gold, mustard | `#FBC02D` | Yellow ground, garment, or light owns frame |
| `green` | 70–150 | lime, sage, forest | `#43A047` | Foliage or green cast is the hero |
| `teal` | 150–200 | **cyan**, aqua, turquoise | `#00897B` | Teal/cyan wall, metal, or grade dominates |
| `blue` | 200–260 | navy, indigo | `#1E88E5` | Sky, blue glass, or blue product hero |
| `violet` | 260–350 | **magenta**, pink, purple, lilac | `#8E24AA` | Purple/magenta cast or subject hero |
| `multicolor` | — | rainbow pours, prismatic chaos | — | No single bucket owns ≥25%; ≥3 competing hues |
| `achromatic` | s < 12% | B&W, grey marble, neutral product | `#9E9E9E` | No salient chroma; neutral-only frame |

**Removed from v1 (merged):** `cyan` → `teal`; `magenta` → `violet`.

---

## Assignment rules (curators)

1. **Default: one tag** — the single bucket a buyer would name first (“that yellow ground”, “that teal wall”).
2. **Max two tags** — only when **two chromatic buckets each ≥ ~25%** (e.g. orange spark shower + teal shadow cast). Never three.
3. **`multicolor` alone** — fluid rainbow, confetti, prismatic light; do not also list component hues.
4. **`achromatic` alone** — true neutral/B&W; do not pair with chromatic tags.
5. **Omit the field** — earthy browns, cream, wood, coffee, skin tones without a chromatic hero. `paletteFamily` carries grading.
6. **Map, don’t invent** — if unsure between teal and blue, use exemplar hex + angle table; pick nearest bucket.

---

## Visual-notes aliases

Buyer free text may say `cyan`, `pink`, `purple`, etc. Fulfillment maps via `PROMINENT_HUE_ALIASES` in code (`cyan` → `teal`, `magenta`/`pink`/`purple` → `violet`).

---

## Bank coverage target (Phase 1)

Aim for **breadth across buckets**, not maximum tags per image:

| Bucket | Phase 1 floor (27 assets) | Notes |
|--------|---------------------------|-------|
| Each chromatic | ≥1 tagged asset where honest | Do not force-tag muted earth shots |
| `achromatic` | ≥3 | Neutral-safe references |
| `multicolor` | ≥1 | Distinct from bold-saturated grading |

Re-audit when bank exceeds ~72 assets.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-31 | Initial closed vocabulary — 9 buckets; cyan/magenta merged; angle boundaries locked |
