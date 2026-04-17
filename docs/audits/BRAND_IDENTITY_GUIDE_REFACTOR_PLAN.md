# Brand Identity Guide Refactor Plan

## Purpose

This document defines the customer-facing packaging refactor for the kit.

The goal is not just to merge existing PDFs into fewer files. The goal is to make the output feel like a useful **brand identity guide** for a solo founder or small business owner who is not a marketer.

This plan now assumes the product should move away from a **field-to-section** mindset and toward a **signal-first editorial model**:

- not every intake deserves visible output
- many inputs should stay hidden as routing, density, and styling signals
- weak or low-value sections should be omitted instead of filled

For the broader rationale and field classification model, see `docs/audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md`.

---

## Core shift

### Previous framing

Take the current foundational PDFs and combine them into one cleaner guide.

### New framing

Design a new main guide around:

1. the few things the customer will actually reuse
2. the few examples that make the guidance feel real
3. the key places where the brand should be applied first

This is a more selective, editorial, customer-centered product shape.

### Practical implication

The refactor is not only:

- fewer documents
- shorter copy

It is also:

- fewer visible concepts
- more hidden routing logic
- more willingness to omit weak material
- stronger page-level prioritization

---

## Proposed output snapshot

### Recommended launch packaging

| Tier | Customer-facing documents | Total target pages | Notes |
|---|---|---:|---|
| Core | `Brand Identity Guide` + `30-Day Quick Start` | 6 | One main reference doc plus one action sheet |
| Pro | `Brand Identity Guide` + `30-Day Quick Start` + `Content Starter Pack` | 8-9 | Same foundation plus applied copy support |

### Document summary

| Document | Tier | Target pages | Job |
|---|---|---:|---|
| `Brand Identity Guide` | Core + Pro | 5 pages | Main reference object: summary, feel, voice, visuals, application |
| `30-Day Quick Start` | Core + Pro | 1 page | Action plan with strict prioritization and almost no teaching copy |
| `Content Starter Pack` | Pro only | 2-3 pages | Ready-to-adapt writing assets, separate from foundational guidance |

### Why this package shape

- Gives the customer **one calm, coherent guide** instead of three foundational PDFs.
- Keeps **action** separate from **reference**.
- Keeps **applied copy** separate from **brand basics**.
- Leaves room for a selective guide without forcing every input family into visible page space.
- Preserves modular generation and testability under the hood.

---

## Editorial model

The main guide should be built from three input roles:

### `surface`

Things the customer should actually see because they create reusable clarity.

Examples:

- business summary
- audience snapshot
- transformation line
- voice traits
- visual keywords
- palette
- typography

### `signal`

Things the customer usually should not see directly.  
They should shape:

- page emphasis
- example choice
- channel emphasis
- layout density
- story inclusion
- differentiation inclusion
- CTA direction

### `drop_or_defer`

Things that should not drive visible guide real estate by default.

Examples:

- raw taxonomy labels
- detailed competitor comparison in Core
- weak founder-story material
- low-confidence differentiator copy
- file metadata

### Consequence for this plan

This refactor should not assume:

- one input family = one visible section
- one survey field = one visible block

Instead, it should assume:

- only the most useful outputs are surfaced
- everything else improves quality invisibly

---

## What the main guide should actually contain

The guide should show only five content families:

1. **Brand Summary**
2. **Positioning and Trust**
3. **Voice**
4. **Voice in Practice**
5. **Visual Direction and Application**

That is enough for a useful customer-facing guide.

It is intentionally narrower than the sum of the current Brand Brief + Voice Playbook + Style Guide.

---

## `Brand Identity Guide` page plan

### Core structure: 5 pages

#### Page 1: Brand Summary

Purpose: orient the customer quickly and give them reusable baseline language.

Include:

- one-sentence brand summary
- what the business does
- who it is for
- core transformation
- 3 values or guiding traits
- one concise differentiator when confidence is high

Rules:

- this is the most important page in the guide
- no strategy-deck prose
- short blocks only
- should be readable in under one minute
- if the differentiator is weak, omit it

#### Page 2: Positioning and Trust

Purpose: add just enough context to make the brand feel grounded and handoff-ready.

Include:

- one short story or trust note only if it is concrete
- positioning contrast or credibility cue if useful
- a short "this brand should feel..." block
- optional collaborator / contractor handoff note

Rules:

- do not force a founder story section
- do not expose archetype labels
- use this page only for the highest-value context
- if story is weak, use this page for clearer application framing instead

#### Page 3: Voice

Purpose: define how the brand should sound in a way a non-writer can use.

Include:

- 3 voice traits
- 3 writing rules
- 3 messaging angles or themes
- CTA direction aligned to the main goal and primary touchpoint

Rules:

- no five-axis tone dashboard in customer-facing output
- no long explanation of voice taxonomy
- translate system nuance into plain-language rules

#### Page 4: Voice in Practice

Purpose: make the voice actionable through examples rather than theory.

Include:

- 4-6 sample phrases
- short do / avoid comparisons
- 1-2 before / after examples when they are strong

Rules:

- examples do more work than explanation
- if before / after is weak, remove it and give more sample lines instead
- keep every example channel-relevant

#### Page 5: Visual Direction and Application

Purpose: give the customer a practical visual system and show where it should be applied first.

Include:

- palette
- typography
- 3 visual keywords or a short style summary
- imagery feel
- simple do / avoid
- where to apply this first

Rules:

- visual-first layout
- no full logo standards chapter unless the product truly has logo assets
- use touchpoints and operating model as hidden signals for application cues
- combine visual guidance and first-use guidance so this page feels practical

### Pro handling

Default assumption:

- keep the main guide at **5 pages for both Core and Pro**
- use Pro inputs to improve specificity inside those same pages
- keep deeper applied content in the separate `Content Starter Pack`

This is preferable to making Pro feel premium only because the main guide gets longer.

If later testing shows one extra Pro page is genuinely useful, add it only for:

- stronger differentiation
- one extra application example
- one extra high-confidence voice module

Not for bulk.

---

## Supporting documents

### `30-Day Quick Start`

Target length: **1 page**

Purpose: tell the customer what to do next in the right order.

Structure:

- Week 1: fix the most visible touchpoint
- Week 2: apply voice
- Week 3: apply visuals
- Week 4: check consistency

Rules:

- 3 priority actions per week max
- minimal preamble
- no repeated theory from the main guide
- reads like a checklist, not a workbook
- driven heavily by hidden signals such as touchpoints, operating model, and current goal

### `Content Starter Pack`

Target length: **2-3 pages**

Purpose: give Pro customers ready-to-adapt copy so they do not start from a blank page.

#### Page 1: Core copy starters

- one-liner options
- short brand summary options
- homepage / bio starter copy
- key message angles

#### Page 2: Channel-ready copy

- caption or post hooks
- CTA examples
- short about / bio variations
- headline / subhead patterns

#### Page 3: Relationship copy

- welcome or intro email
- follow-up email
- extra before / after examples if useful

Rules:

- must feel applied and reusable
- should not restate foundational guidance already covered in the main guide
- should use deeper signals without turning them into more theory

---

## Current package vs proposed package

| Current packaging | Proposed packaging |
|---|---|
| `Brand Brief` | No longer a standalone customer-facing PDF |
| `Brand Style Guide` | No longer a standalone customer-facing PDF |
| `Voice & Content Playbook` | No longer a standalone customer-facing PDF |
| `30-Day Quick Start Checklist` | Keep separate, tighten to 1 page |
| `Content Starter Pack` | Keep separate for Pro |

### What changes

- Move from **three foundational PDFs** to **one foundational guide**.
- Stop assuming all existing foundational section families deserve direct page space.
- Shift from section aggregation to selective editorial composition.
- Reduce perceived complexity without losing quality.

### What does not change

- modular internal generation model
- deterministic vs AI section modes
- path-class testing philosophy
- structured editable content under the hood

---

## Proposed visible content mapping

This is now a **content-family** mapping, not a one-section-to-one-page mapping.

| Current material | New treatment |
|---|---|
| Brand anchor sentence | Surface on Page 1 |
| Brand overview | Surface on Page 1 |
| Ideal customer | Compress into audience snapshot on Page 1 |
| Core transformation / promise | Surface on Page 1 |
| Values / positioning cues | Compress into 3 traits on Page 1 or 2 |
| Brand story angle | Signal first; surface only if strong on Page 2 |
| Differentiation snapshot | Signal first; surface only if concise and credible |
| Tone profile | Translate into plain-language voice traits on Page 3 |
| Voice guardrails | Compress into 3 writing rules on Page 3 |
| Messaging themes | Compress into 3 angles on Page 3 |
| Sample phrases | Surface on Page 4 |
| CTAs | Surface in compressed form on Page 3 or 4 |
| Writing do / avoid | Surface on Page 4 |
| Before / after examples | Optional on Page 4 when strong |
| Palette overview | Surface on Page 5 |
| Typography | Surface on Page 5 |
| Visual direction summary | Translate into 3 visual keywords or short summary on Page 5 |
| Style principles | Compress into simple visual rules on Page 5 |
| Do / avoid guidance | Surface on Page 5 in short form |
| Practical usage notes | Fold into application cues on Page 5 |
| Quick Start weeks 1-4 | Separate `30-Day Quick Start` |
| Applied Pro copy outputs | Separate `Content Starter Pack` |

---

## Refactor requirements

### 1. Packaging and IA refactor

Need to redefine the customer-facing deliverable structure in specs:

- replace the Core baseline package definition
- reframe the main artifact as `Brand Identity Guide`
- set fixed page budgets by document
- define visible content families rather than old document sections

### 2. Intake-to-output contract refactor

Need to classify inputs as:

- `surface`
- `signal`
- `drop_or_defer`

And then use that model consistently across specs and generation.

### 3. Content model refactor

Need to move away from "all foundational sections still appear" logic.

New content rules should:

- allow omission
- compress weak section families into traits or examples
- favor examples over explanation
- favor reusable guidance over exposed strategy logic

### 4. PDF layout refactor

Need a new layout system for the combined guide:

- one document shell instead of three separate foundational shells
- stronger page hierarchy
- more whitespace and lower density
- page templates optimized for 5 pages total
- visual rhythm that feels calm, not encyclopedic

### 5. Section assembly refactor

Need to keep generation modular while changing final packaging:

- maintain structured content internally
- introduce a combined guide assembler
- assemble by content family, not by old PDF boundary
- allow signal-driven omission and substitution
- keep Pro enrichment additive, not duplicative

### 6. Length and density enforcement

Need explicit output budgets that are actually tested:

- hard page target per document
- cap visible bullets, examples, and callouts
- trim explanatory paragraphs before trimming useful examples
- use stage / touchpoint / use-case signals to modulate density

### 7. QA and test updates

Need to update tests and review criteria:

- verify that the combined guide covers the intended content families
- verify that omitted sections fail gracefully rather than leaving holes
- add regression checks for page count targets
- confirm Quick Start remains one page
- confirm Pro adds specificity, not generic length
- review outputs through the lens of a non-marketer reader

---

## Signal-first design implications

The guide should use several current fields primarily as hidden signals:

- `industry`
- `stage`
- `brandNarrator`
- `businessOperatingModel`
- `touchpoints`
- `primaryGoal`
- `voiceSliders`
- `painPoints`
- `desiredOutcomes`
- `originArchetype`
- `originSummary`
- `motivation`
- `competitors`

These should influence:

- whether story appears
- whether differentiation appears
- whether the guide leans visual or verbal
- how tactical the guide feels
- which channels are named
- how many examples are shown
- which content gets cut first

This is one of the biggest differences from the earlier version of this plan.

---

## Guardrails for the refactor

- Do not make the new guide read like an agency brand manual.
- Do not make the Pro tier feel premium only because it is longer.
- Do not duplicate guidance across the guide, Quick Start, and Content Starter Pack.
- Do not force every intake family into visible PDF space.
- Do not over-explain brand terminology to customers who mostly need examples and defaults.
- Do preserve plain language, skimmability, and handoff value.
- Do treat omission as a valid editorial decision.

---

## Open decisions

- Should the main guide stay fixed at **5 pages for both Core and Pro**, with Pro depth handled mostly through better specificity and the separate `Content Starter Pack`?
- Should Page 2 include a small collaborator handoff block by default, or should that stay only in the Quick Start?
- Should visual keywords be derived from existing inputs or explicitly captured in the survey?
- Should the product add a "what do you want this guide to help with first?" question so page emphasis and examples can be shaped more deliberately?
- Should a combined "master PDF" export exist later for convenience, even if the primary package stays multi-document?

---

## Recommendation

Proceed with the refactor as:

1. One foundational `Brand Identity Guide`
2. One separate `30-Day Quick Start`
3. One separate Pro-only `Content Starter Pack`

But treat that packaging change as the visible outcome of a deeper product change:

- narrow what the customer sees
- use more inputs as hidden signals
- allow omission
- optimize the guide for use, not exhaustiveness

That is the version of the refactor most aligned with:

- the non-marketer audience
- the concise PDF example that prompted this review
- the broader brand-guide patterns seen in small-business references
- the product goal of making execution easier, not documenting everything we know
