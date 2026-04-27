# Palette Library Audit

## Scope

This audit reviews the current palette system in:

- `apps/web/src/data/visualDirection.ts`
- `apps/web/src/components/ui/ColorPalettePicker.tsx`
- `packages/generation/src/deterministic/brandIdentityGuideModel.ts`
- `packages/generation/src/deterministic/coreAssembly.ts`
- `packages/generation/src/pdf/CoreKitDocuments.tsx`

Goals:

1. Identify near-duplicates within each family.
2. Identify overlap between families.
3. Establish current expansion gap vs the 5-6 palettes-per-family target.
4. Capture sync risks between web and generation.

## Current Family Coverage

| Family | Current count | Target count | Gap |
|---|---:|---:|---:|
| Blue | 5 | 5-6 | at target |
| Black & gray | 5 | 5-6 | at target |
| Brown & tan | 6 | 5-6 | at target |
| Green | 5 | 5-6 | at target (batch 2: `cedar_grove`, `pine_mint`) |
| Teal | 5 | 5-6 | at target (batch 2: `deep_aqua`, `teal_breeze`) |
| Coral & sunset | 5 | 5-6 | at target (batch 2: `apricot_twilight`, `ember_sorbet`) |
| Amber | 5 | 5-6 | at target (batch 2: `bronze_daylight`, `saffron_spice`) |
| Rose | 5 | 5-6 | at target (batch 2: `dust_rose_ink`, `berry_blush`) |
| Violet | 5 | 5-6 | at target (batch 2: `indigo_bloom`, `royal_lilac`) |
| Noir | 5 | 5-6 | at target |
| Pop | 6 | 5-6 | at target |

## Quantitative Duplication Signals

Distance values are perceptual-proxy palette distances (lower = more similar).

### Within-family nearest pairs

- Neutral: `minimal_light` ~ `paper_stone` (27.6)
- Earth: `earthy_warmth` ~ `sand_dune` (24.3)
- Green: `forest_deep` ~ `moss_meadow` (27.3)
- Teal: `coastal_teal` ~ `lagoon_deep` (32.0)
- Sunset: `sunset_bold` ~ `sorbet_sunset` (56.1)
- Amber: `amber_glow` ~ `honey_comb` (30.0)
- Rose: `rose_dusk` ~ `carnation_soft` (50.0)
- Violet: `violet_haze` ~ `electric_orchid` (46.6)
- Noir: `signal_orange` ~ `cobalt_punch` (56.4)
- Pop: `studio_confetti` ~ `magenta_orange_cyan` (48.5)

Interpretation:

- Main duplicate pressure remains in foundational families (Neutral, Earth, Green, Teal, Amber).
- Noir and Pop are currently distinct enough after pruning.

### Cross-family nearest pairs

- Neutral/Earth: `paper_stone` ~ `sand_dune` (24.9)
- Green/Teal: `mint_fresh` ~ `lagoon_deep` (24.4)
- Sunset/Amber: `citrus_pop` ~ `amber_glow` (21.9)

Interpretation:

- Expansion should avoid adding more palettes in these overlap corridors unless role balance is materially different.

## Structural Risks Found

1. Palette IDs and swatches are mirrored across multiple generation files.
2. Family membership is hard-coded in web `PALETTE_FAMILIES`.
3. `All` ordering is family-flattened; family edits change All ordering by design.
4. Description/role maps can silently fall back if IDs are missing.

5. **Process gap (addressed):** Lifting candidates from the expansion doc without a **slot-level distinctness gate** can ship perceptual duplicates while parity tests still pass. Use [`../guides/PALETTE_PREMERGE_DISTINCTNESS.md`](../guides/PALETTE_PREMERGE_DISTINCTNESS.md) for every batch.

## Audit Decision Outputs

### Keep

- Noir and Pop structural direction (post-pruning) is acceptable.
- Utility-first family order is aligned with product goals.

### Expand with caution

- Blue, Neutral, Earth, Green, Teal, Sunset, Amber, Rose, Violet.
- Add 2-3 each, but gate by novelty against closest sibling and closest cross-family neighbor.

### Do not add

- New variants that sit inside the existing cross-family overlap corridors without clear role differentiation (anchor/accent/canvas behavior).

## Next step pointer

Use `docs/guides/PALETTE_EXPANSION_RUBRIC.md` for acceptance criteria and `docs/guides/PALETTE_EXPANSION_CANDIDATES.md` for proposed additions.

