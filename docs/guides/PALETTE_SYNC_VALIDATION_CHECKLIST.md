# Palette Sync Validation Checklist

## Why this exists

Palette data currently appears in both web and generation/PDF paths. This checklist prevents drift when adding/removing/reordering palettes.

## Pre-merge (before you touch code)

Follow [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md): slot intents, separation vs incumbents and batch-mates, cross-family spot-check for known overlap corridors (see [`../audits/PALETTE_LIBRARY_AUDIT.md`](../audits/PALETTE_LIBRARY_AUDIT.md)).

## Required update points

When palette IDs or swatches change, update all of:

- `apps/web/src/data/visualDirection.ts`
- `packages/generation/src/pdf/CoreKitDocuments.tsx`
- `packages/generation/src/deterministic/brandIdentityGuideModel.ts`
- `packages/generation/src/deterministic/coreAssembly.ts`
- `packages/generation/src/deterministic/paletteColorRoles.ts`

## Automated guardrails

- `packages/generation/src/paletteParity.test.ts`
  - verifies all web palette IDs exist in generation maps
  - verifies web swatch order/hex values match generation swatch map
  - verifies all web IDs have guide rows and palette descriptions

## Manual QA checklist

1. Step 6 family chips render expected members.
2. `All` ordering remains aligned with family rail order.
3. Pop/Noir families still read as distinct lanes.
4. Generated PDF color rows render expected swatches without fallback.
5. No legacy palette IDs break existing sessions (via `canonicalPaletteId` and `LEGACY_PALETTE_ID_ALIASES` in `@identity-kit/shared`, e.g. removed `harbor_steel` / `charcoal_slate`).

## Release checklist

1. Run generation tests (`@identity-kit/generation`).
2. Run web smoke flow for Step 6 selection.
3. Spot-check one generated kit per major family lane.
4. Confirm no fallback description copy appears for newly added palette IDs.

