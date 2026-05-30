# Pro moodboard image bank (dev)

Curated photographs for the Pro Visual Reference Spread (Style Guide folios 06–07).

**Read before sourcing:**

1. [`docs/research/MOODBOARD_SIGNAL_MODEL.md`](../../../docs/research/MOODBOARD_SIGNAL_MODEL.md) — **start here** — photography vs palette weighting, case studies, intake gaps
2. [`docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md`](../../../docs/research/MOODBOARD_BANK_TAG_TAXONOMY.md) — tag vocabulary (R5 aligned)
3. [`docs/research/MOODBOARD_BANK_CURATION.md`](../../../docs/research/MOODBOARD_BANK_CURATION.md) — phases, tooling, ship gate

## Local storage policy

**Only two artifacts are retained on disk:**

| Artifact | Location |
|----------|----------|
| Optimized JPEG | `assets/{imageId}.jpg` |
| Metadata row | `metadata.v1.json` (`sourceUrl`, tags, dimensions) |

Remote originals are **never** saved — ingest is URL → memory → Sharp → JPEG.

## Commands

```bash
# From packages/generation
npm run ingest-image-bank -- --url=... --license=unsplash --palette-family=... --style-register=... --scene-type=...
npm run ingest-image-bank -- --queue=dev/image-bank/queue.json
npm run image-bank-coverage
```

See `queue.example.json` for batch row shape. Tag enums are validated against `packages/shared/src/imageBank/`.
