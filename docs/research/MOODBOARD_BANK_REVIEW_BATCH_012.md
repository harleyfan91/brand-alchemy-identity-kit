# Moodboard bank — batch 012 supplement

**Status:** Ingested · 72 bank assets  
**Date:** 2026-06-02  
**Goal:** Add architecture+curves and playful colorful gradient (without removing marble swaps from batch 011)

---

## Added (2)

| imageId | Cell | Notes |
|---------|------|-------|
| `batch012_refined_texture_architecture_curves` | refined × texture | Curved metallic facade (Dongdaemun-style), real built form · `architecture-built` + `materials-texture` |
| `batch012_playful_texture_ink_gradient` | playful × texture | Rainbow ink plumes in water — organic gradient flow, not a flat fill · `multicolor` |

**Rejected from shortlist:** Plain 2-stop gradients; abstract CGI curves without readable architecture; architect-drawing retread (`arch_curve_d`).

Preflight: `dev/image-bank/_preflight/batch-012/`

```bash
cd packages/generation
npm run ingest-image-bank -- --queue=dev/image-bank/queue.batch-012-supplement.json
```
