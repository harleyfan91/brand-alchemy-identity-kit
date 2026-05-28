# Waves B–G bank integration report

**Date:** 2026-05-27  
**Scope:** Transcription-only merge of [`WAVE_B.md`](./WAVE_B.md) through [`WAVE_G.md`](./WAVE_G.md) into [`CTA_PHRASE_BANKS.md`](./CTA_PHRASE_BANKS.md).  
**Tooling:** [`scripts/integrate-cta-wave.mjs`](../../../../scripts/integrate-cta-wave.mjs), [`scripts/finish-wave-g-d.mjs`](../../../../scripts/finish-wave-g-d.mjs)

## Executive summary

| Wave | Footer target | Applied (script) | Status |
|------|--------------:|-----------------:|--------|
| A (prior) | 27 replacements | 27 | Complete; **A17** deferred |
| B | 168 | 152 | Merged (16 duplicate skips) |
| C | 438 | 365 | Merged |
| D | 181 | 123 (+ finish) | Merged; 7 retention rows needed path fix |
| E | 480 (96 leaves) | 480 | Merged + **A5** narrator axis |
| F | 164 | 148 (+ split leaf) | Merged |
| G | 138 + 7 triplets | 105 (+ finish script) | Merged; Part 5/7 via finish script |

**Generator:** `ctaPhraseBankPrescriptive.gen.ts` regenerated — **373** chunks (was 241 pre-expansion).  
**Tests:** `ctaPrescriptiveLookup` narrator routing **pass**. `ctaPhraseBankPolicy` **fail** — known em-dash rows (see outstanding).

## A5 (Wave E plumbing)

- Bank format: `**narrator: {id}**` subsections under `### industry` (Wave E copy transcribed).
- [`scripts/gen-cta-phrase-banks.mjs`](../../../../scripts/gen-cta-phrase-banks.mjs): emits `narrator` on `PrescriptiveChunk`.
- [`ctaPrescriptiveLookup.ts`](../../../src/deterministic/ctaPrescriptiveLookup.ts): routes tuned narrator per §4C table when `brandNarrator` matches.
- [`brandIdentityGuideModel.ts`](../../../src/deterministic/brandIdentityGuideModel.ts): passes `form.step1.brandNarrator` into phrase lookup.

## Outstanding items

See [`WAVES_B_G_OUTSTANDING.md`](./WAVES_B_G_OUTSTANDING.md).

| ID | Label | Summary |
|----|-------|---------|
| A17 | DEFERRED | EMAIL food_hospitality friendly v1 — em dash (Wave A) |
| B-EM | NEEDS_REVIEW | ≥1 Wave B tuple contains em dash in paste-ready line (e.g. trades_home WEBSITE direct_sales bold) |
| C-COMMUNITY | DEFERRED_COPY | Wave C note: community WEBSITE `lead_gen` pair 1 off-register — no fenced replacement in wave |
| POLICY | NEEDS_REVIEW | `ctaPhraseBankPolicy` fails until em-dash rows revised in wave sources |

**Pro-0:** Not closed — W7 editorial sign-off and outstanding copy fixes remain.

## Spot-checks (generated chunks)

- **V1 fix (Wave A):** `email` × `lead_gen` × `trades_home` × `friendly` includes `"Hit reply with the job details..."`.
- **Wave E:** `website` × `direct_sales` × `trades_home` × `narrator: local_team` × `bold` — first tuple contains `"Our team"`.
- **Marketplace (Wave F):** `audience_growth` × `retail_maker` has 8 pairs (bold + friendly).

## Artifacts

| File | Purpose |
|------|---------|
| `WAVE_{B..G}_INTEGRATION_MANIFEST.json` | Per-wave apply log |
| `WAVES_B_G_OUTSTANDING.md` | Rollup flags |
| This report | Sprint closure |

## Explicitly out of scope

- A6 cross-persona folio snapshot harness  
- W7 full §7 acceptance sign-off  
- Pro-0 closure in `PRO_KIT_STRATEGY.md`  
- Copywriter rewrites (integrator did not author new phrasing)
