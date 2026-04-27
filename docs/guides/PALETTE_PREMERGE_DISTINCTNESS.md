# Pre-merge distinctness workflow

## Why this exists

Batch‑1 blues originally shipped as **three hand-picked ramps that clustered** in the same marine-navy centroid as `ocean_calm`. Hex parity tests passed, but **perceptual siblings** slipped through because novelty was treated as a scoring weight rather than a **hard gate before merge**.

This doc is the **required process** for any new palette id or **material swatch change** in a family that already has multiple members.

## Steps (in order)

### 1. Name the slots before you pick hexes

For each family you are expanding, write **one sentence per new stable id** describing the *hue / chroma / temperature* lane it must occupy vs existing members.

- For a full template, see [`PALETTE_BLUE_LANE_TARGETS.md`](./PALETTE_BLUE_LANE_TARGETS.md) (blue family).
- For other families, add a short subsection to [`PALETTE_EXPANSION_CANDIDATES.md`](./PALETTE_EXPANSION_CANDIDATES.md) **Family lane notes** when you add candidates, or link a dedicated `PALETTE_<FAMILY>_LANE_TARGETS.md` if the lane is contentious.

If two new ids would occupy the same slot, **stop** and redefine slots — do not “tune later” under duplicate ids.

For **Black & gray**, separation must stay on the **achromatic axis** — do not use slate-blues or stone-browns to force novelty; differentiate with luminance steps and contrast intent instead.

For **chromatic families** (rose, amber, earth, etc.), treat **canvas / light swatch** as part of the slot: avoid shipping several palettes whose light ends are the same near-white tint unless the mids are radically different — mix **cool white, warm parchment, pure white, tinted shell, or a slightly darker “light”** so the chip rail does not read as one repeated ending.

### 2. Run separation checks (same family + risky cross-family)

Before merging to `visualDirection.ts`:

1. **In-family:** For each new palette, compute distance to **every existing palette in that family** (use the same method as [`../audits/PALETTE_LIBRARY_AUDIT.md`](../audits/PALETTE_LIBRARY_AUDIT.md): palette-level proxy such as mean RGB in 0–255 space, plus a LAB / ΔE spot-check on anchors if the score is borderline).
2. **New vs new:** All palettes introduced in the same batch must be **mutually** separated — not only vs incumbents.
3. **Cross-family:** Re-check pairs called out in the audit (e.g. Green/Teal, Sunset/Amber). If a new palette lands in a known overlap corridor, either **shift hexes into a different slot** or reject.

**Reject** (revise swatches or slot definition) if:

- Nearest in-family neighbor is tighter than the **lowest healthy band** for that lane (use audit’s within-family pairs as calibration — aim **not** to introduce a new minimum below ~22–25 on the audit’s proxy unless you document why).
- A new palette is the **top-1 nearest** to a palette in another family **and** role structure is interchangeable (same rubric rule as [`PALETTE_EXPANSION_RUBRIC.md`](./PALETTE_EXPANSION_RUBRIC.md)).

### 3. Merge and mirror in one change

Follow [`PALETTE_SYNC_VALIDATION_CHECKLIST.md`](./PALETTE_SYNC_VALIDATION_CHECKLIST.md): web swatches, PDF map, guide rows, `paletteDescriptions`, **`paletteColorRoles`**, then `npm run test --workspace=@identity-kit/generation -- paletteParity.test.ts`.

### 4. Record the decision

In [`PALETTE_EXPANSION_CANDIDATES.md`](./PALETTE_EXPANSION_CANDIDATES.md), mark shipped rows with final hexes so the doc stays the source of truth for **what** shipped, not only what was proposed.

## Relationship to other docs

| Doc | Role |
|-----|------|
| [`PALETTE_EXPANSION_RUBRIC.md`](./PALETTE_EXPANSION_RUBRIC.md) | Pass/fail gates + scoring |
| This file | **Order of operations** and **hard** distinctness before merge |
| [`PALETTE_BLUE_LANE_TARGETS.md`](./PALETTE_BLUE_LANE_TARGETS.md) | Example slot spec for one family |
| [`../audits/PALETTE_LIBRARY_AUDIT.md`](../audits/PALETTE_LIBRARY_AUDIT.md) | Baseline distances and overlap corridors |
