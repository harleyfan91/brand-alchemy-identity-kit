# Palette Expansion Candidates (5-6 Per Family)

## Purpose

This file proposes expansion candidates for each family using the rubric in `PALETTE_EXPANSION_RUBRIC.md`.

**Batch 1 (shipped):** Blue, Black & gray, and Brown & tan gained expansion palettes (`midnight_cerulean`, `powder_navy`, `graphite_fog`, `carbon_paper`, `walnut_cream`, `toffee_sand`, `espresso_oat`) with generation mirrors. **Later trims:** `harbor_steel` (Cyan Fjord) removed from the active list; `charcoal_slate` removed as redundant with `graphite_fog` — both remap via `LEGACY_PALETTE_ID_ALIASES` in `@identity-kit/shared`. **Neutral + earth + rose (revision):** Black & gray additions stay **achromatic**; `walnut_cream` was re-tuned to **red-gold walnut / maple wheat** vs `espresso_oat` **taupe + oat cream**; rose canvases diversified (cool white, pure white, tinted blush, parchment, lilac mist).

**Batch 2 (shipped):** Green, Teal, Coral & sunset, Amber, Rose, and Violet each gained two palettes (`cedar_grove`, `pine_mint`, `deep_aqua`, `teal_breeze`, `apricot_twilight`, `ember_sorbet`, `bronze_daylight`, `saffron_spice`, `dust_rose_ink`, `berry_blush`, `indigo_bloom`, `royal_lilac`). Swatches were tuned vs the original proposal rows using the slot + distinctness workflow in [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md).

## Family targets

- Target every family at 5-6.
- Noir currently at 5.
- Pop currently at 6.
- Blue and Black & gray are at **5** after trims; earth, green, teal, sunset, amber, rose, and violet remain at **5 or 6** after batches 1–2.

## Family lane notes (batch 2 — slot intent before hexes)

- **Green:** `cedar_grove` = **olive / yellow-green** (warmer than `forest_deep`’s blue-green); `pine_mint` = **chartreuse / lime** (yellow-green accent, not another blue-green forest ramp).
- **Teal:** `deep_aqua` = **muted slate-teal** (low chroma vs `coastal_teal` / `lagoon_deep`); `teal_breeze` = **cyan-forward pool blue** (distinct from green-teal anchors).
- **Sunset:** `apricot_twilight` = **dusty plum → terracotta coral** on warm white; `ember_sorbet` = **wine → ember coral** (hotter accent than apricot).
- **Amber:** `bronze_daylight` = **bronze umber → daylight orange**; `saffron_spice` = **paprika / rust → orange-amber** (red-spice lane vs `honey_comb`’s cocoa-gold).
- **Rose:** Vary **canvas temperature** (cool white, pure white, tinted blush, parchment, lilac) so the lane is not “dark wine + same pale pink” on every row. `dust_rose_ink` = **parchment + rosewood**; `berry_blush` = **hot pink on lilac-mist white**.
- **Violet:** `indigo_bloom` = **cool indigo / blue-violet** (separated from `violet_haze`’s royal purple); `royal_lilac` = **electric royal → soft lilac canvas** (pastel lift vs `electric_orchid`).

## Candidate pool by family

Each row uses the current swatch order convention:

`[anchor, support, accent, light/canvas]`

### Blue (+2 expansion blues active; `harbor_steel` removed)

See [`PALETTE_BLUE_LANE_TARGETS.md`](./PALETTE_BLUE_LANE_TARGETS.md). Active expansion blues:

- `midnight_cerulean` (display **Indigo Mist**): `['#1E1B4B', '#4338CA', '#818CF8', '#EEF2FF']`
- `powder_navy` (display **Denim Air**): `['#172554', '#1E40AF', '#60A5FA', '#EFF6FF']`

### Black & gray (+2 expansion neutrals active; `charcoal_slate` removed)

- `graphite_fog`: `['#131313', '#404040', '#8C8C8C', '#EBEBEB']`
- `carbon_paper`: `['#0A0A0A', '#3D3D3D', '#CFCFCF', '#FFFFFF']`

### Brown & tan (+3) — shipped

- `walnut_cream`: `['#271C15', '#7A4A2F', '#D4A574', '#FFF9ED']`
- `toffee_sand`: `['#4A3520', '#9A7316', '#E8C468', '#FFFBEB']`
- `espresso_oat`: `['#3E2A22', '#6B4B3E', '#A9856C', '#F7EEE5']`

### Green (+2) — shipped (supersedes earlier proposal hexes)

- `cedar_grove`: `['#2F3320', '#5C6D2A', '#9CAF50', '#F7FBEA']`
- `pine_mint`: `['#263B0F', '#4D7C0F', '#C4E85A', '#F7FEE7']`

### Teal (+2) — shipped

- `deep_aqua`: `['#0F2428', '#2A4F56', '#5E9AA3', '#E5F4F7']`
- `teal_breeze`: `['#001524', '#005F8C', '#00A8E8', '#E1F6FF']`

### Coral & sunset (+2) — shipped

- `apricot_twilight`: `['#352428', '#995C6B', '#F4A574', '#FFF5EF']`
- `ember_sorbet`: `['#3E0F12', '#B83226', '#FF7B54', '#FFF0EA']`

### Amber (+2) — shipped

- `bronze_daylight`: `['#4D2C10', '#8E4A12', '#D97706', '#FFF6E8']`
- `saffron_spice`: `['#5C1A1A', '#9A3412', '#D97706', '#FFF7ED']`

### Rose (+2) — shipped

- `dust_rose_ink`: `['#241018', '#6D3A52', '#C48BA3', '#FAF5F0']`
- `berry_blush`: `['#1C0A18', '#9D174D', '#F472B6', '#F5F3FF']`

### Violet (+2) — shipped

- `indigo_bloom`: `['#1A1035', '#43309A', '#6366F1', '#E8EAFC']`
- `royal_lilac`: `['#3B0764', '#7C3AED', '#C4B5FD', '#FAF5FF']`

### Noir (+0 to +1 optional)

If a sixth option is desired:

- `obsidian_laser`: `['#0C0F14', '#1B2535', '#00D1FF', '#F3F7FB']`

### Pop (+0)

Current six should remain and be re-scored periodically:

- `citrus_splash`
- `studio_confetti`
- `candy_burst`
- `raspberry_indigo`
- `emerald_amber_blue`
- `magenta_orange_cyan`

## Selection workflow

0. **Slots + distinctness** — [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md): write lane intents; reject or revise before coding.
1. Score each remaining candidate against `PALETTE_EXPANSION_RUBRIC.md`.
2. Keep top 2-3 per underfilled family.
3. Re-run duplicate check against full library after each accepted candidate.
4. Reject candidates that collide with existing neighboring families.
5. Merge web + generation in one change; run `paletteParity.test.ts` and generation tests.

