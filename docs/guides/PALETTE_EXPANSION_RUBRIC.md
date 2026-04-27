# Palette Expansion Rubric

## Purpose

This rubric defines how new palettes are accepted into family lanes so expansion to 5-6 per family remains high-signal and non-redundant.

## Standards Mapping

- WCAG contrast baseline: [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- Semantic role/token guidance: [Primer Color Usage](https://primer.style/product/getting-started/foundations/color-usage)
- Theme/layering guidance: [IBM Carbon Color](https://carbondesignsystem.com/elements/color/overview/)
- Dark/light conversion patterns: [Atlassian Color Foundations](https://atlassian.design/foundations/color-new/)
- Readability sanity check: [APCA easy intro](https://git.apcacontrast.com/documentation/APCAeasyIntro.html)

## Acceptance Gates (Pass/Fail)

Every candidate must pass all gates before scoring. **Gate 0 is mandatory** (see [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md)); skipping it is what allowed batch‑1 blues to cluster before the cyan / indigo / denim revision.

0. **Slot + distinctness (pre-hex lock-in)**
   - Each new stable id has a written **slot intent** vs siblings (hue/chroma/temperature), not only a display name.
   - **In-family**, **new-vs-new**, and **audit cross-family** distance checks pass before merge; near-duplicates are rejected, not re-scored upward.

1. **Family intent fit**
   - Candidate reads as the declared family (e.g. Blue lane, Noir lane) in first-glance review.
2. **Role structure present**
   - Swatch order supports: anchor/primary, supporting, accent, light/canvas.
3. **Contrast floor**
   - At least one reliable text-usable pair at WCAG AA thresholds for intended text use.
4. **Novelty floor**
   - Not a near-duplicate of an existing in-family palette.
5. **Cross-family collision check**
   - Not functionally interchangeable with a palette already promoted in another family.

## Weighted Score (100 points)

Use after pass/fail gates.

| Criterion | Weight | Scoring guidance |
|---|---:|---|
| Family intent clarity | 20 | 0-20 based on immediate recognizability in lane |
| Role balance | 20 | 0-20 based on anchor/support/accent/canvas usability |
| Accessibility/readability | 25 | 0-25 using WCAG checks + APCA sanity review |
| Novelty | 20 | 0-20 based on distance from nearest in-family and cross-family neighbors |
| Brand usability | 15 | 0-15 based on broad SMB applicability vs niche/stunt feel |

**Acceptance threshold:** 80/100 for core library.

## Family-Specific Notes

- **Blue/Neutral/Earth/Green/Teal:** prioritize commercial versatility over novelty gimmicks.
- **Sunset/Amber/Rose/Violet:** allow stronger personality, but keep one restrained option per lane.
- **Noir:** keep high-contrast dark-base behavior; avoid adding near-identical neon variants.
- **Pop:** keep expressive range, but avoid over-clustering around one hue (e.g. pink-only drift).

## Duplicate Detection Policy

- Run the **slot + distance workflow** in [`PALETTE_PREMERGE_DISTINCTNESS.md`](./PALETTE_PREMERGE_DISTINCTNESS.md) before relying on this section for merge decisions.
- Compute nearest in-family and cross-family neighbors using perceptual distance.
- Flag as `borderline` when distance is in the lowest overlap band for that lane.
- Reject if candidate duplicates either:
  - top 1 nearest in-family palette, or
  - top 1 nearest cross-family palette with same role balance.

## Final review checklist

- Candidate passes all gates.
- Candidate score >= 80.
- Family count remains within 5-6.
- Candidate has a clear one-sentence rationale distinct from siblings.

