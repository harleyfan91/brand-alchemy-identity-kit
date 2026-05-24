# Deliverable redundancy matrix

This matrix defines how Core kit PDFs relate to each other after the packaging refactor. The **Brand Identity Guide** is canonical; other documents must not repeat guide content in full.

**Related:** [DELIVERABLE_PRODUCTION_SPEC.md](../../DELIVERABLE_PRODUCTION_SPEC.md) · [PROJECT_OVERVIEW.md](../../PROJECT_OVERVIEW.md) · [GENERATION_PIPELINE.md](../../GENERATION_PIPELINE.md)

## Customer journey

1. **30-Day Quick Start** — what to do, in what order, with pointers to guide folios.
2. **Brand Identity Guide** — at-a-glance reference (many customers stop here).
3. **Deep dive PDFs** (optional) — strategy, visual ops, or voice lab content that **references** the guide and **fills gaps**.

## Legend

| Code | Meaning |
|------|---------|
| **FULL** | Guide already shows this; depth doc must not repeat verbatim |
| **PART** | Guide shows a compressed slice; depth may expand, not duplicate the slice |
| **GAP** | Guide omits or barely hints; depth doc owns richer content |
| **REF** | Depth doc points to guide nav section instead of reprinting |
| **QS** | Belongs in Quick Start, not guide or depth |

## Brand Identity Guide (canonical)

| Folio | Nav | Owns |
|-------|-----|------|
| 01 | Summary | `oneLine`, values, what we do / who / what changes |
| 02a–02b | Look | Colors, keywords, swatches, type, wordmark grid |
| 03 | Personality | Feel, triplet or stands-for, quote, behavior, trust cue |
| 04 | Voice | Traits, rules, topics, do/avoid, transmutation arc |
| 05 | Examples | Sample lines, paste-ready CTAs, qualifying before/after |

**Rule:** No new teaching bands on the guide without removing something else (six-page contract frozen).

## Quick Start vs guide

| Quick Start | Guide pointer | Redundancy rule |
|-------------|---------------|-----------------|
| Kit intro | — | QS: orientation only |
| Week 1 | Summary, Examples | QS: tasks; no full anchor or one-line paste |
| Week 2 | Voice, Examples | QS: tasks; no tone essay |
| Week 3 | Look (02a/02b) | QS: channel rollout; no hex lists |
| Week 4 | Whole guide | QS: audit checklist |

## Brand Brief (depth — strategy)

| Section | vs guide | Action |
|---------|----------|--------|
| REF intro | — | GAP |
| Brand anchor | 01 oneLine (PART) | GAP: full sentence with tone clause |
| Brand overview | 01 what we do (PART) | GAP: expanded |
| Ideal customer | 01 who (PART) | GAP |
| Core transformation | 01 what changes (PART) | REF + expand |
| Values | 01 values (FULL) | REF only |
| Brand story angle | 03 quote (PART) | GAP: expanded |
| Differentiation | 03 trust cue (PART) | GAP |

## Style Guide (depth — visual ops)

| Section | vs guide | Action |
|---------|----------|--------|
| REF intro | — | GAP |
| Palette | 02a swatches (FULL) | REF + Pro notes only |
| Visual direction | 02a summary (PART) | GAP: expanded |
| Typography | 02b specimens (PART) | GAP: expanded prose |
| Style principles | keywords only (PART) | GAP |
| Do / avoid | — | GAP |
| Imagery direction | not on guide | GAP |
| Where to apply first | — | QS Week 3; Style gets short visual-application note |

## Voice Playbook (depth — voice lab)

| Section | vs guide | Action |
|---------|----------|--------|
| REF intro | — | GAP |
| Tone profile | 04 traits (PART) | GAP: full paragraph |
| Voice guardrails | 04 rules (PART) | GAP: expanded |
| Messaging themes | 04 topics (PART) | GAP: framing + full set |
| Sample phrases | 05 samples (PART) | GAP: more examples |
| CTAs | 05 pasteables (FULL) | Principles + REF Examples |
| Writing do / avoid | 04 (PART) | GAP if longer |
| Before / after | 05 (PART) | GAP: extra pairs |
| Custom voice notes | — | GAP (Pro) |

## Content Starter Pack (Pro — future)

Applied copy only: bios, homepage routes, captions, email templates. Must not reprint guide rules, swatches, or trait lists. See DELIVERABLE_PRODUCTION_SPEC §5.

## Implementation

| PDF | Block composer |
|-----|----------------|
| Quick Start | `quickStartBlocks` in `coreAssembly.ts` + `quickStartContent.ts` |
| Brand Identity Guide | `buildBrandIdentityGuideModel` (unchanged contract) |
| Brand Brief | `depthBriefBlocks.ts` |
| Style Guide | `depthStyleGuideBlocks.ts` |
| Voice Playbook | `depthVoicePlaybookBlocks.ts` |

Legacy `brandBriefBlocks` / `styleGuideBlocks` / `voicePlaybookBlocks` remain exported for tests and guide assembly; customer PDFs use depth composers only.
