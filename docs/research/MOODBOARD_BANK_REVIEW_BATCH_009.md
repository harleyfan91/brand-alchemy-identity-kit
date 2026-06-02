# Moodboard bank — batch 009 review (Phase 2 depth)

**Status:** Ingested · beans duplicate swapped · plants tagged vintage  
**Date:** 2026-06-01  
**Target cells:** `warm × texture`, `warm × people`, `refined × environment`

---

## Why these cells

Persona smoke passes today, but every style×scene cell is still at **1–4 / 5**. Batch 009 adds depth where the 8 fixtures pull hardest:

| Fixture cluster | Industry tags | Cells served |
|-----------------|---------------|--------------|
| Northwind / coffee-founder / vision | `hospitality_food` | warm texture, warm people, refined environment |
| Harbor Lane / PC-08 / retail | `makers_artisans`, `creative_agency` | warm texture (bread, beans), warm people |
| All hospitality spreads | layout portrait gap (7 portrait / 37 landscape bank-wide) | 4 of 8 approved assets are portrait |

**Hue backfill:** first bank **`red`** tag (`batch009_refined_environment_cafe` — terracotta chairs); second **`green`** texture (`batch009_warm_texture_beans_green`).

---

## Sourcing funnel

| Stage | Count |
|-------|------:|
| URLs gathered | 23 |
| Preflight pass | 15 |
| Visual QA approve | **8** |
| Queue rows | **8** |

Common rejects: visible faces, readable café branding, outdoor scenes filed as interior, Pexels slug/ID mismatches, redundant coffee-bean macros.

**Post-ingest fix (2026-06-01):** Removed `batch009_warm_texture_beans` (near-duplicate of `batch001_beans_texture`) → `batch009_warm_texture_linen`. Tagged `batch009_refined_environment_plants` with `vintage` for intentional film grain.

Preflight previews: `packages/generation/dev/image-bank/_preflight/batch-009/`

---

## Approved queue (8)

| imageId | Cell | Orientation | Hue | Notes |
|---------|------|-------------|-----|-------|
| `batch009_warm_texture_linen` | warm × texture | portrait | omit | Sweatshirt + jute flat lay (replaces redundant bean macro) |
| `batch009_warm_texture_bread` | warm × texture | landscape | omit | Split-tone bread + oats flat lay |
| `batch009_warm_texture_beans_green` | warm × texture | portrait | `green` | Beans on sage surface |
| `batch009_warm_object_scoop` | warm × object | landscape | omit | Hand scooping from foil bag |
| `batch009_warm_people_latte` | warm × people | portrait | omit | Latte-art pour, hands only |
| `batch009_warm_people_toast` | warm × people | landscape | omit | Three hands, coffee toast |
| `batch009_refined_environment_cafe` | refined × environment | portrait | `red` | Industrial café, red chairs |
| `batch009_refined_environment_plants` | refined × environment | portrait | `green` | Wood + plants interior · **mood: vintage** (film grain) |

Files:

- Candidates (with reject notes): `candidates.batch-009-phase2-depth.json`
- Ingest queue: `queue.batch-009-phase2-depth.json`

---

## Composition overlap guard (new)

Preflight + ingest now warn when a candidate shares **style register × scene type × prop category** and **≥1 imagery subject** with an existing asset. Pass tags on candidate rows:

```json
{
  "id": "candidate_a",
  "url": "...",
  "styleRegister": "warm",
  "sceneType": "texture",
  "propCategory": "food-beverage",
  "imagerySubjects": ["materials-texture", "food-dining"]
}
```

Code: `packages/generation/src/image-bank/compositionOverlap.ts`

---

```bash
cd packages/generation
npm run ingest-image-bank -- --queue=dev/image-bank/queue.batch-009-phase2-depth.json
npm run image-bank-coverage
npm run image-bank-persona-smoke
```

**Expected after ingest:** 52 assets · `warm × texture` 4/5 · `warm × people` 4/5 · `refined × environment` 6/5 (one over floor).

---

## Next batch hints

Still thin everywhere else at 1/5. Prioritize:

1. **`refined × texture`** and **`refined × lighting`** (1/5 each) — professional/makers adjacency
2. **Portrait supply** — keep ≥1 portrait per batch until bank ratio improves
3. **`red` depth** — one tag is not enough for palette-echo matching; add a red-led object or pattern row
