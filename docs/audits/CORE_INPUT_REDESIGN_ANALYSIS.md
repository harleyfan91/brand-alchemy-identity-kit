# Core Input Redesign Analysis

**Status:** **Reference** — deterministic Core input philosophy and field inventory; not a live checklist (use [CORE_PATH_CUSTOMIZATION_AUDIT.md](./CORE_PATH_CUSTOMIZATION_AUDIT.md) for backlog).

Purpose: define how Core should collect only deterministic-safe inputs by separating irreducible facts from high-risk strategic prose, and by proposing structured replacements for current freeform fields before any UI or schema changes.

**See also:** [CORE_PATH_CUSTOMIZATION_AUDIT.md](./CORE_PATH_CUSTOMIZATION_AUDIT.md) — end-to-end generic vs customized mapping, channel-goal gaps, and prioritization for keeping recommendations aligned with how users actually show up (e.g. marketplace-first vs LinkedIn-first).

**To-do when Core path contracts change:** keep [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) **§3.3** (Path Class Catalog) and **§3.3.1** (Path recipes) aligned with new signals or routing; add regression tests in `packages/generation/src/core-pdfs.test.ts`.

## Working Refactor Note: Platform Similarity Cleanup (defer)

The touchpoint list was intentionally expanded for coverage. In the next refactor pass, we should decide whether to keep all of these as separate options or merge some into parent groupings to reduce overlap:

- Directory cluster overlap: `google_business`, `apple_maps`, `bing_places` (all map/listing discovery channels)
- Marketplace adjacency: `marketplace_storefront` (Etsy), `shopify_marketplace` (Shop), `amazon_storefront`, `ebay_storefront`, `walmart_marketplace`
- Social adjacency by content mode: `instagram`, `facebook`, `threads` (Meta ecosystem), plus `tiktok` and `youtube` video-first
- Vertical resale overlap: `depop_store`, `poshmark_store` (fashion resale) — keep distinct only if downstream guidance meaningfully differs

Decision target for later:
- Keep distinct IDs only when they produce distinct deterministic recommendations in generation; otherwise consolidate to cleaner parent channels with optional subchannel metadata.

## Framing

Core is a deterministic tier. That means the intake is not just collecting information; it is supplying raw material that is inserted directly into templates in `packages/generation/src/deterministic/coreAssembly.ts` and `packages/generation/src/pdf/CoreKitDocuments.tsx`.

For Core, the design question is not "can the user answer this?" It is:

1. Does this field capture a fact we truly cannot infer another way?
2. If yes, can we collect it with more structure than a blank text box?
3. If no, should the output be derived from stronger upstream signals instead?

## Current Core Input Inventory

### Core-visible freeform fields today

| Field | Current UI | Current role in generation | Risk level |
|---|---|---|---|
| `step1.businessName` | Required text input | Identity anchor across headers, specimens, and examples | Low to medium |
| `step1.offer` | Required text input | Brand overview, "WHAT WE DO", before/after examples | High |
| `step1.transformation` | Required text input | Brand anchor, transformation section, messaging themes, checklist references | High |
| `step6.existingTypeface` | Optional textarea | Typography guidance override | Medium |
| `step7.competitors` | Optional chips of free strings | Competitor-informed positioning and comparison pills | Medium |

### Core-visible structured fields today

These are already deterministic-safe enough to keep as inputs:

- `step1.industry`
- `step1.stage`
- `step1.brandNarrator`
- `step2.customerArchetype`
- `step3.tonePreset`
- `step3.voiceSliders`
- `step4.values`
- `step5.originArchetype`
- `step6.selectedPalette`
- `step6.selectedStyle`

## Decision Framework

Every Core input should live in one of three buckets:

### 1. Irreducible fact

The user must supply it directly, but the product should still constrain the response pattern.

Examples:
- business name
- what they sell
- an existing font name
- competitor names

### 2. Structured selection

The user should choose from bounded options, sentence fragments, chips, sliders, or fill-in-the-blank clauses rather than authoring strategy prose from scratch.

Examples:
- customer type
- values
- tone preset
- style direction
- a constrained transformation builder

### 3. Derived output

The product should not ask the user to phrase this directly on Core. It should be generated from upstream structured choices and only lightly enriched by factual text inputs.

Examples:
- differentiation framing
- tone description
- style principles
- messaging themes

## Field-By-Field Recommendation

### `step1.businessName`

Bucket: **Irreducible fact**

Keep as raw input, but normalize:
- trim whitespace
- collapse repeated spaces
- consider optional formatting cleanup for all-caps or legal suffix clutter

Reason:
- this is a true fact, not strategy
- it is used everywhere, so normalization has high value and low ambiguity

Recommendation:
- keep as free text
- add lightweight normalization rules, not a redesign

### `step1.offer`

Bucket: **Irreducible fact**, but too open in current form

Current value:
- it gives the product/service language the system cannot safely infer from industry alone
- it feeds both Brand Brief and Voice Playbook examples directly

Current risk:
- vague answers like "marketing help" or "services for businesses" make multiple outputs generic
- there is no deterministic repair layer

Best direction:
- keep the fact, but change the input style from blank text to a guided builder

Recommended replacement patterns to test:

1. **Split factual prompt**
   - `What do you sell or provide?`
   - `Who is it mainly for?`
   - optional `How is it delivered?`
   - generation reassembles a single offer line

2. **Sentence completion**
   - `We provide [service/product] for [customer type]`
   - or `I offer [service] to [customer type]`
   - narrator can alter the stem

3. **Industry-aware fill-in-the-blank**
   - use the existing industry placeholders as a starting constraint
   - prompt for 2-5 words, not a full sentence

Recommendation:
- do not leave this as unconstrained free text long-term
- redesign toward a split or sentence-builder input

### `step1.transformation`

Bucket: **Structured selection** disguised as freeform

Current value:
- this is the strongest strategic signal in Core
- it drives the brand anchor, transformation section, messaging themes, and Quick Start references

Current risk:
- users are being asked to write a strategy sentence
- low-signal answers are repeated in multiple prominent places
- current industry placeholder helps, but still leaves the user with a blank sentence problem

Best direction:
- do not ask for a finished transformation sentence on Core
- instead, collect the ingredients of transformation in a more structured way

Recommended replacement patterns to test:

1. **Before/after builder**
   - `From [current state] to [better state]`
   - each side can be:
     - short text with tight word guidance
     - chips plus an optional custom word

2. **Outcome selector + object**
   - `Helps customers feel/become/get [outcome type]`
   - plus a short fill for context

3. **Multi-clause sentence builder**
   - `From [pain] to [result]`
   - `with [type of help]`
   - generated into final output sentence

Recommendation:
- move this field out of pure freeform
- treat it as a structured transformation builder

## Concrete Variant Sketches For Review

These are not implementation specs yet. They are review-ready examples to compare how much structure we want Core to impose while still sounding relevant across industries.

### Offer capture variants

#### Variant O1: Split factual prompt

Prompt flow:
- `What do you sell or provide?`
- `Who is it mainly for?`
- `How do customers usually get it?` (optional)

Example assembled outputs:

| Industry | User inputs | Deterministic assembled offer |
|---|---|---|
| Creative services | `brand identity packages`; `small creative businesses`; `through a strategy + design sprint` | `Brand identity packages for small creative businesses through a strategy + design sprint` |
| Home services | `plumbing repairs`; `homeowners`; `through on-site service calls` | `Plumbing repairs for homeowners through on-site service calls` |
| Photography | `family portrait sessions`; `families`; `through seasonal photo sessions` | `Family portrait sessions for families through seasonal photo sessions` |
| Finance | `bookkeeping support`; `small business owners`; `through monthly bookkeeping and reporting` | `Bookkeeping support for small business owners through monthly bookkeeping and reporting` |

Why it works:
- strongest factual capture
- easiest to validate
- deterministic assembly can standardize the final sentence

Risk:
- can feel a bit operational or dry if the final output is not polished well

#### Variant O2: Narrator-aware sentence completion

Prompt flow:
- show one stem based on narrator
- user fills only the key nouns

Examples:

| Narrator | Stem |
|---|---|
| `solo_expert` | `I help [who] with [service]` |
| `solo_maker` | `I make [product] for [who]` |
| `local_team` | `We provide [service] for [who]` |
| `product_led` | `We offer [product] for [who]` |
| `mission_community` | `We serve [who] through [program / offering]` |

Example outputs:
- `I help founders with brand strategy`
- `We provide roof repair for homeowners`
- `We serve local families through after-school programs`

Why it works:
- feels conversational
- narrows the answer format without asking for strategy prose

Risk:
- some businesses will not fit the stem cleanly unless we handle edge cases well

#### Variant O3: Industry-aware fill-in-the-blank

Prompt flow:
- industry determines the microcopy
- user fills one short service noun phrase only

Examples:

| Industry | Prompt | Example answer |
|---|---|---|
| Creative services | `The main thing we help clients with is...` | `brand identity and website copy` |
| Food & beverage | `The main thing customers come to us for is...` | `specialty coffee and house-made pastries` |
| Home services | `The main service people hire us for is...` | `plumbing repair and fixture installation` |
| Consulting/coaching | `The main service clients book us for is...` | `leadership coaching for small teams` |

Why it works:
- lowest friction
- strong fit for one-question-per-screen UX

Risk:
- may be too narrow if the product needs audience language as well

### Transformation capture variants

#### Variant T1: Outcome selector + object

Prompt flow:
- `What kind of result do customers get?`
- choose a stem:
  - `feel`
  - `become`
  - `get`
  - `avoid`
  - `move from`
- then fill a short object/context

Deterministic sentence pattern examples:
- `Helps customers feel [resultObject] [context].`
- `Helps customers get [resultObject] [context].`
- `Helps customers avoid [resultObject] [context].`

Multi-industry examples:

| Industry | Selector | Object / context | Output |
|---|---|---|---|
| Creative services | `feel` | `clear and professional online` | `Helps customers feel clear and professional online.` |
| Health & wellness | `feel` | `more rested in daily life` | `Helps customers feel more rested in daily life.` |
| Home services | `get` | `a fixed home without the runaround` | `Helps customers get a fixed home without the runaround.` |
| Finance | `get` | `a clear plan for their money` | `Helps customers get a clear plan for their money.` |
| Education | `become` | `more confident in the subject` | `Helps customers become more confident in the subject.` |
| Legal / professional services | `avoid` | `confusion when making legal decisions` | `Helps customers avoid confusion when making legal decisions.` |

Why it works:
- easier than writing a whole transformation sentence
- still flexible across many industries
- selector can be validated and normalized

Risk:
- can sound generic if the object/context entry is too short

#### Variant T2: Before / after builder

Prompt flow:
- `Before working with you, customers often feel...`
- `After working with you, they feel...`

Deterministic sentence pattern:
- `From [beforeState] to [afterState].`

Examples:

| Industry | Before | After | Output |
|---|---|---|---|
| Fitness | `inconsistent` | `steady and strong` | `From inconsistent to steady and strong.` |
| Real estate | `overwhelmed by the process` | `clear on the next step` | `From overwhelmed by the process to clear on the next step.` |
| Photography | `stuck with phone snapshots` | `proud to share their photos` | `From stuck with phone snapshots to proud to share their photos.` |

Why it works:
- emotionally legible
- matches the transformation concept well

Risk:
- may be too abstract if we do not also collect how the change happens

#### Variant T3: Multi-clause sentence builder

Prompt flow:
- `Before: customers are...`
- `After: they are...`
- `This happens through...`

Deterministic sentence patterns:
- `Moves customers from [beforeState] to [afterState] through [mechanism].`
- or `From [beforeState] to [afterState] with [mechanism].`

Multi-industry examples:

| Industry | Before | After | Mechanism | Output |
|---|---|---|---|---|
| Consulting / coaching | `stuck` | `moving with a plan they trust` | `clear coaching and accountability` | `Moves customers from stuck to moving with a plan they trust through clear coaching and accountability.` |
| Beauty | `unsure` | `confident` | `appointments tailored to their features and routine` | `Moves customers from unsure to confident through appointments tailored to their features and routine.` |
| Home services | `worried about the repair` | `relieved and taken care of` | `fast, straightforward service calls` | `Moves customers from worried about the repair to relieved and taken care of through fast, straightforward service calls.` |
| Photography | `relying on phone snapshots` | `sharing images they love` | `thoughtful portrait sessions` | `Moves customers from relying on phone snapshots to sharing images they love through thoughtful portrait sessions.` |
| Finance | `stressed about money` | `clear on what to do next` | `simple bookkeeping and reporting` | `Moves customers from stressed about money to clear on what to do next through simple bookkeeping and reporting.` |
| Nonprofit / community | `feeling isolated` | `connected to real support` | `local programs and community events` | `Moves customers from feeling isolated to connected to real support through local programs and community events.` |

Why it works:
- highest deterministic quality
- separates the strategic job into three easier pieces
- gives generation richer material without raw prose

Risk:
- most complex of the variants
- may need more screen space or progressive disclosure

### Recommendation on which variants to prototype first

If we want the safest Core redesign path:

1. Prototype **O1 Split factual prompt** for `offer`
2. Prototype **T3 Multi-clause sentence builder** for `transformation`

Why:
- `offer` is best treated as a fact with light structure
- `transformation` is best treated as a strategic output assembled from ingredients

If we want a lighter-lift alternative:

1. Prototype **O2 Narrator-aware sentence completion**
2. Prototype **T1 Outcome selector + object**

Why:
- easier UX change
- lower implementation cost
- still much safer than blank text

### `step6.existingTypeface`

Bucket: **Irreducible fact**, optional override

Current value:
- lets the typography guidance respect what the customer already uses
- this is an operational constraint more than a strategy input

Current risk:
- noisy or unclear font strings get quoted back as truth
- many Core users may not know the font names at all

Best direction:
- keep only if framed as an optional override, not a required creative prompt

Recommended replacement patterns to test:

1. **Yes / no gate**
   - `Do you already use a font you want to keep?`
   - if yes, reveal a short field for the font name

2. **Short answer with examples**
   - one-line field instead of a full textarea

Recommendation:
- keep on Core only if it stays optional and lightweight
- change from open textarea to gated short factual input

### `step7.competitors`

Bucket: **Irreducible fact**, but low-signal and noisy

Current value:
- gives the system market context
- useful for comparison framing when present

Current risk:
- users may enter the wrong kind of comparison target
- comma-based parsing can create rendering problems
- competitors alone do not produce a strong differentiator

Best direction:
- keep as optional context, but make the expected response more explicit

Recommended replacement patterns to test:

1. **Choice + short label**
   - `Who might customers compare you to?`
   - choose category first:
     - local competitor
     - big national brand
     - DIY / template option
     - "something else"
   - then add the name

2. **Constrained chip input**
   - max 1-3 entries
   - helper examples by narrator / industry

Recommendation:
- keep as chips, but constrain the count and guide the category
- do not rely on this field alone for strong Core differentiation output

## Recommended Bucket Assignment

| Field | Recommended bucket | Why |
|---|---|---|
| `businessName` | Irreducible fact | Must be supplied directly |
| `offer` | Irreducible fact with structured capture | Real fact, but too open today |
| `transformation` | Structured selection | Strategic sentence should be assembled, not authored raw |
| `existingTypeface` | Irreducible fact | Optional factual override only |
| `competitors` | Irreducible fact with constrained chips | Useful context, but should be bounded |

## What Should Be Derived Instead Of Asked

These should continue to be outputs, not Core inputs:

- differentiation framing
- style principles
- do / avoid guidance
- practical usage notes
- tone profile prose
- messaging themes

These are higher-order strategic outputs that the deterministic system should derive from:
- narrator
- industry
- values
- tone preset / sliders
- style / palette
- structured transformation ingredients
- competitor context when available

## Strategic Product Direction

### Direction A: Facts-only Core

Core collects only irreducible facts plus tightly bounded selections.

Pros:
- strongest fit for deterministic generation
- easiest to test
- clearest Core vs Pro value ladder

Cons:
- requires more output derivation work
- some users may want more room to explain nuance

### Direction B: Guided composition Core

Core still collects a small amount of authored text, but only through structured prompts, stems, and builders.

Pros:
- preserves user voice and specificity
- lower risk than open prose
- strong fit with current UX direction

Cons:
- more design work in the intake UI
- still needs careful validation rules

### Direction C: Open text with better helper copy

Keep current fields but improve examples and previews.

Pros:
- lowest implementation effort

Cons:
- does not solve the real deterministic quality problem
- still relies on users to write strategy language well

Recommendation:
- pursue **Direction B** with a bias toward **facts-only** wherever possible
- avoid Direction C as the long-term Core solution

## Market Pattern Review

Patterns worth borrowing from modern intake and onboarding flows:

- **One-question-per-screen pacing**
  - reduces blank-page pressure
  - already consistent with the current micro-step model

- **Sentence completion**
  - user fills 1-3 blanks instead of writing a whole positioning line

- **Clause builders**
  - users select a phrase stem, then fill one noun or result

- **Conditional reveal**
  - only show follow-up factual fields when the prior answer makes them relevant

- **Bounded chips with categories**
  - useful for competitor capture and other market context

The best external patterns do not remove expressiveness; they reduce the number of places where the user has to invent strategic language from scratch.

## Core Differentiation Decision Branch

This remains the biggest unresolved contract decision.

### Option 1: Keep Core competitors-only

What happens:
- Core does not collect direct differentiation text
- output stays broader and competitor-informed

Pros:
- cleanest Core vs Pro separation
- lower intake burden

Cons:
- weakest Brand Brief differentiation section

### Option 2: Add constrained Core differentiator capture

What happens:
- Core adds a short structured prompt such as:
  - `Unlike [type of alternative], we are known for [specific edge]`
  - or a choice-led sentence builder

Pros:
- stronger Core output quality
- still deterministic-safe if tightly constrained

Cons:
- narrows the Core / Pro gap
- adds another strategic question to Core

### Option 3: Replace direct differentiation with structured evidence

What happens:
- do not ask "what makes you different?"
- ask for one lower-cognitive-load ingredient instead, such as:
  - what customers appreciate most
  - what they do differently in practice
  - what kind of alternative they are not

Pros:
- may be easier for non-marketing-savvy users
- can still support deterministic differentiation framing

Cons:
- requires new generation rules and testing

Recommendation:
- do not decide this inside copy cleanup
- carry this as a separate product decision before intake refactor execution

## Risks And Tradeoffs

### If we keep current Core freeform as-is

- deterministic outputs remain highly sensitive to weak phrasing
- the same weak answer gets repeated in multiple PDFs
- fixtures and polished examples will continue to overstate real-world quality

### If we over-structure Core

- users may feel boxed in
- brand language can sound generic if builders are too rigid

### Best balance

- collect raw facts directly
- structure strategic language capture
- derive brand framing from structured signals
- reserve rich nuance for Pro

## Suggested Canonical Doc Updates

`OUTPUT_TRANSLATION_SPEC.md` should stay the canonical owner. After product decisions are made, update it with:

1. A new subsection under Core rules defining the input bucket system:
   - irreducible fact
   - structured selection
   - derived output

2. A field strategy table for current Core freeform fields:
   - current field
   - future input style
   - deterministic rationale

3. A resolved decision note for Core differentiation:
   - competitors-only
   - constrained Core differentiator
   - or structured substitute

4. Validation guidance for structured builders:
   - word limits
   - allowed empty states
   - when to fall back to deterministic defaults

Other docs should only summarize the decision:
- `SCREEN_COPY_MAP.md` for UX behavior
- `DELIVERABLE_PRODUCTION_SPEC.md` for output implications
- `SCREEN_COPY_MAP.md` (section A — current UI and micro-step behavior); `apps/web/src/data/microStepSchema.ts` for the active chapter/micro-step map

## Recommended Next Execution Sequence

1. Decide product strategy for `offer`, `transformation`, `competitors`, and `existingTypeface`.
2. Resolve the Core differentiation branch.
3. Update `OUTPUT_TRANSLATION_SPEC.md` as the canonical contract.
4. Refactor Core intake UI and validation.
5. Update deterministic assembly to consume structured inputs instead of raw strategy prose.
6. Re-test Core PDF quality using intentionally weak real-world answers, not idealized fixtures.
