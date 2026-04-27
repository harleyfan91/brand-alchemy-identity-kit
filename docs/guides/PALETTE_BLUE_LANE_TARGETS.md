# Blue family — distinctness targets

## Intent

The Blue chip should cover **meaningfully different blue systems**, not variations of the same ramp.

## Current shipped blues (after library trim)

| Slot | Palette | Role |
|------|---------|------|
| Corporate layered blue | `ocean_calm` | Classic trust blue ramp |
| Cool slate → icy | `arctic_blue` | Crisp, editorial cool |
| Ink → steel (low chroma) | `ink_navy` | Near-neutral navy, typography-first |
| Indigo / periwinkle | `midnight_cerulean` | Violet-blue, separate from marine ramps |
| Denim / royal air | `powder_navy` | Saturated royal mid, airy light end |

**Removed:** `harbor_steel` (formerly “Cyan Fjord”) — dropped as redundant with other blues. Older sessions map `harbor_steel` → `ocean_calm` via `LEGACY_PALETTE_ID_ALIASES` in `@identity-kit/shared`.

## Pre-merge gate (manual until scripted)

Before adding or changing blues:

- Follow [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md).
- Compute **minimum palette distance** to existing Blue family members.
- **Reject** if nearest neighbor is below the band used for “borderline” in [`../audits/PALETTE_LIBRARY_AUDIT.md`](../audits/PALETTE_LIBRARY_AUDIT.md) / [`PALETTE_EXPANSION_RUBRIC.md`](./PALETTE_EXPANSION_RUBRIC.md).

## References

- Rubric: [`PALETTE_EXPANSION_RUBRIC.md`](./PALETTE_EXPANSION_RUBRIC.md)
- Audit: [`../audits/PALETTE_LIBRARY_AUDIT.md`](../audits/PALETTE_LIBRARY_AUDIT.md)
