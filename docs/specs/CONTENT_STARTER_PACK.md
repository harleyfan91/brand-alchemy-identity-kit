# Content Starter Pack — hybrid generation contract (Pro-B v1)

**Status:** Pro-B planning — **supersedes generation mode** for CSP sections in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1 (Section IDs unchanged).  
**Scope:** `06-content-starter-pack.pdf` only. Voice Playbook page 3 is a sibling deliverable in Pro-B; CTA variations are shared (see below).

**Platform contract (canonical — do not duplicate in this repo):**  
Umbrella repo [`docs/product-platform/`](../brand-alchemy-llc-landing-page-main/docs/product-platform/README.md) — [CUSTOMER_VOICE_AND_PRODUCT_LINE.md](../brand-alchemy-llc-landing-page-main/docs/product-platform/CUSTOMER_VOICE_AND_PRODUCT_LINE.md), [SECTION_ID_REGISTRY.md](../brand-alchemy-llc-landing-page-main/docs/product-platform/SECTION_ID_REGISTRY.md), [brand-context.v1.schema.json](../brand-alchemy-llc-landing-page-main/docs/product-platform/schemas/brand-context.v1.schema.json).  
Typical sibling checkout: `../brand-alchemy-llc-landing-page-main/`.

**Related (identity-kit):** [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) §5 · [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §7.3 · [`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12.9.2 · [`DELIVERABLE_REDUNDANCY_MATRIX.md`](../product/DELIVERABLE_REDUNDANCY_MATRIX.md)

**Implementation detail:** Section ID modes, scaffolds, and PDF assembly — `OUTPUT_TRANSLATION_SPEC.md` §1.

---

## Purpose

Give Pro buyers **paste-ready applied copy** (bios, summaries, hooks, pillars, CTA alternatives) without reprinting Brand Identity Guide rules, swatches, or trait lists.

**Design principle:** Same as Core + Brief Ideal customer — **deterministic compiler owns strategy and structure; AI owns voice, specificity, and polish.** CSP is not seven blank-slate prompts.

---

## PDF layout (2 pages — locked)

| Page | Sections | PDF heading labels |
|------|----------|-------------------|
| **1** | Kit relationship pointer · Brand summaries (3 one-liners + elevator + paragraph) · Homepage messaging (2–3 routes) | `How this document relates to your kit` · `Brand summaries` · `Elevator pitch` · `Brand paragraph` · `Homepage messaging` |
| **2** | Short social bio · Long bio / About · Caption starters · Content pillars · CTA variations | `Short social bio` · `Long bio / About` · `Caption starters` · `Content pillars` · `Calls to action` |

**Locked v1 decisions:**
- **About intro** maps to `csp.bioLong` on page 2 — no separate `csp.aboutIntro` Section ID.
- **Email templates** ship on Voice Playbook page 3 only.
- **2 pages fixed** — layout targets AI fulfillment counts; `--no-ai` may show thinner lists (2 caption stubs, CTA placeholder until `voice.ctaVariations` ships).

Email templates ship on **Voice Playbook page 3**, not inside this PDF ([`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) §5).

---

## PDF formatting brief (locked for Pro-B)

Layout target: **copy deck**, not strategy memo. Paste-ready strings are primary; labels and angle names are secondary hierarchy.

| PDF block | Section ID(s) | Count | Word / length budget | Typography role | PDF component (target) | AI mode |
|-----------|---------------|-------|----------------------|-----------------|------------------------|---------|
| Kit pointer | — | 1 | ~2 sentences | Quiet intro | `SectionBlock` (standard depth-doc opener) | deterministic |
| **One-liners** | `csp.oneLiner` | 3 variants | 8–16 words each | **Angle label** (small caps / quiet) + **copy line** (body, selectable) | `CspOneLinerOptionsBlock` — stacked option rows | `ai_enhanced` |
| **Elevator pitch** | `csp.elevator` | 1 | ~60 words | Section band + prose block | `SectionBlock` or grouped under summaries module | `ai_enhanced` |
| **Brand paragraph** | `csp.paragraph` | 1 | ~120 words | Section band + prose block | Same module as elevator | `ai_enhanced` |
| **Homepage routes** | `csp.homepageDirections` | 2–3 routes | Headline ~10w; subhead ~18w | **Route label** (`Route 1`) + headline (display weight) + subhead (body) | `CspHomepageRoutesBlock` — card or stacked pairs | `ai_enhanced` |
| **Short social bio** | `csp.bioShort` | 1 | 15–30 words | Section band + single prose block (paste-ready) | `SectionBlock` | `ai_enhanced` |
| **Long bio / About** | `csp.bioLong` | 1 | 40–60 words | Section band + prose block | `SectionBlock` | `ai_only` |
| **Caption starters** | `csp.captionStarters` | 6–8 (4 gated; 2 stub) | ≤ 25 words each | Bulleted list; each line paste-ready | `CspCaptionListBlock` | `ai_only` |
| **Content pillars** | `csp.contentPillars` | 4–5 pillars | 1 one-liner + 2 prompts per pillar | **Pillar name** (band or bold) + one-liner + indented prompt bullets | `CspPillarCardBlock` (repeatable) | hybrid |
| **CTA variations** | `voice.ctaVariations` (alias `csp.ctas`) | 2–4 surfaces × 3–4 variations | ≤ 8 words per variation | **Surface name** → anchor line → variation rows with **intent label** | `CspCtaSurfaceGroupsBlock` | render alias |

### Visual grouping rules

1. **Page 1 density:** Brand summaries (one-liners + elevator + paragraph) may share one visual **module** with internal subheads, or remain separate bands — implementer's choice, but one-liners must read as **pick-one options**, not a single paragraph.
2. **Copy vs chrome:** Paste-ready copy uses body text color (`BRAND.bodyText`); angle labels, route numbers, and CTA intent tags use quieter label styling — never the section band color as body text.
3. **Lists:** Captions and pillar prompts use bullets; one-liners and homepage routes use **labeled blocks**, not inline comma-separated lists.
4. **CTAs:** Group by surface; show deterministic **anchor** first, then variations with intent tags (`More direct`, `Quieter`, etc.). Do not flatten into a single numbered list across surfaces.
5. **Overflow:** Prefer tightening vertical rhythm before adding a third page. If page 1 overflows in fixtures, collapse elevator + paragraph into one summaries module before splitting pages.
6. **`--no-ai` path:** Same layout; empty or stub sections still render their band (buyer sees structure). CTA block may show anchor pointer text until `voice.ctaVariations` is wired.

### Distinction callouts (do not reprint in body)

| Artifact | CSP block | Do not confuse with |
|----------|-----------|---------------------|
| Content pillars | `csp.contentPillars` | Strategy Memo §6 messaging pillars; Voice Playbook messaging themes |
| CTA variations | `voice.ctaVariations` | Generic CTA list; folio 05 sample phrases (reference only) |
| Brand summaries | `csp.oneLiner` / elevator / paragraph | Guide “What we do” row (short version lives in guide) |

---

## Hybrid generation matrix

Section IDs stay stable for prompt registry and telemetry. **Generation mode** is what changes from the earlier all-`ai_only` table.

| Section ID | PDF block | Mode | Deterministic scaffold (ship on AI failure) | AI task | Model |
|------------|-----------|------|---------------------------------------------|---------|-------|
| `csp.oneLiner` | Brand summary — one-liners | **`ai_enhanced`** | Three seed lines from intake angles: **transformation-led** (`assembleTransformationLine`), **audience-led** (`resolveBuyerArchetypeTitle` + offer), **differentiator-led** (`step7.differentiation` or offer fallback). Each 8–16 words, narrator-aware pronouns. | Rewrite each seed in `voice_context`; tighten to paste-ready; no new claims. | Sonnet |
| `csp.elevator` | Brand summary — elevator | **`ai_enhanced`** | 2–3 sentences stitched from `assembleOfferLine` + transformation + one outcome hint. | Expand to ~60 words in brand voice; stay within cited intake. | Sonnet |
| `csp.paragraph` | Brand summary — paragraph | **`ai_enhanced`** | Single paragraph scaffold from Brief-style facts: offer, audience card, transformation, optional differentiation (same ingredients as `depthBriefBlocks` overview, no guide pointers). | Expand to ~120 words; who / for whom / what changes. | Sonnet |
| `csp.homepageDirections` | Homepage messaging | **`ai_enhanced`** | 2–3 **routes** as `{ headline, subhead }` pairs from templates keyed by `primaryGoal` + narrator (headline = transformation or offer hook; subhead = audience or outcome). | Refine wording only; do not change route strategy or add new promises. | Sonnet |
| `csp.bioShort` | Social bio — short | **`ai_enhanced`** | 1–3 lines from narrator template: pronoun set (`I/we` / brand name), offer line, optional CTA fragment from `narratorProfile.cta_patterns[0]`. | Fit 15–30 words; platform paste-ready; emoji only if `tonePreset === 'friendly'`. | Sonnet |
| `csp.bioLong` | Social bio — long / About | **`ai_only`** | Minimal stub: offer line + origin one-liner when `originSummary` present, else offer + transformation. | Write 40–60 words (About opener); ground in story + values when present. | Sonnet |
| `csp.captionStarters` | Caption starters | **`ai_only`** | Generic industry-safe hooks from `industryProfile` (2 stubs) if AI fails. | 6–8 openers, ≤25 words each; varied openings; no duplicate first words. | Sonnet |
| `csp.contentPillars` | Content pillars | **Hybrid** | **Pillar names** = first 4–5 entries from `narratorProfile.content_pillars` (deterministic). | Per pillar: one-line value statement + 2 starter questions; industry flavor via `industryProfile.preferred_terms`. | Sonnet |
| `csp.ctas` | CTA suggestions (page 2) | **Render alias** | Deterministic folio 05 anchor CTA per surface. | *No CSP call* — see `voice.ctaVariations`. | — |
| `voice.ctaVariations` | CTA alternatives (shared) | **`ai_only`** (anchored) | Anchor = folio 05 CTA for each primary touchpoint. | 3–4 variations per surface with locked intents (`more_direct`, `quieter`, `more_inviting`, `more_confident`). | Sonnet |

### Call budget (revised)

| Bucket | Calls | Notes |
|--------|-------|-------|
| Brand summaries | 3 | `oneLiner`, `elevator`, `paragraph` — can share one cached system prefix |
| Homepage | 1 | New Section ID `csp.homepageDirections` |
| Bios | 2 | `bioShort`, `bioLong` |
| Captions + pillars | 2 | `captionStarters`; `contentPillars` (names fixed in code) |
| CTA variations | 1 per primary touchpoint (typically 2–4) | Owned by Voice; rendered on CSP page 2 |
| **CSP-only Sonnet** | **~8** | Still within ~$0.80–1.00/kit envelope with prompt caching |

---

## Prompt context (every CSP call)

Same blocks as [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §8.3. Minimum for acceptance:

- `business_context`, `audience_context`, `voice_context`, `visual_context` (`selectedPalette`, `selectedStyle`, `moodAdjectives[]`)
- `narrator_profile`, `industry_profile`
- `constraints` (length, banned vocab, prohibited claims)
- **`scaffold` block** for every `ai_enhanced` row (verbatim deterministic text + instruction: rewrite in voice, do not add uncited facts)

`voiceSamples[]` is **strongly recommended** — see confidence gating.

---

## Structured output schemas

All sections return `fieldsCited: string[]` (except render-only aliases). Shapes live under `packages/shared/src/ai/schemas/` (to be added in Pro-B).

| Section ID | Schema shape (summary) |
|------------|------------------------|
| `csp.oneLiner` | `{ variants: { angle: 'transformation' \| 'audience' \| 'differentiator', text, fieldsCited }[], fieldsCited }` |
| `csp.elevator` | `{ text, fieldsCited }` |
| `csp.paragraph` | `{ text, fieldsCited }` |
| `csp.homepageDirections` | `{ routes: { headline, subhead, fieldsCited }[] }` (2–3 routes) |
| `csp.bioShort` | `{ text, fieldsCited }` |
| `csp.bioLong` | `{ text, fieldsCited }` |
| `csp.captionStarters` | `{ starters: { text, fieldsCited }[] }` |
| `csp.contentPillars` | `{ pillars: { name, oneLine, prompts: string[], fieldsCited }[] }` — **`name` must match deterministic scaffold names** |
| `voice.ctaVariations` | `{ surface, anchorCta, variations: { intent, text, fieldsCited }[] }` per call |

---

## Safety and tone alignment

### Walkers (required before live CSP)

Apply to **all** AI output before PDF assembly ([`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12.10):

1. **Inherited banned vocab** (Core copy walker list)
2. **Claim-safety** — no fabricated metrics, awards, client counts, or offers not in intake (strictest on bios + CTAs)
3. **CTA rules** — inherit `CTA_COPY_RULES.md`; variations must match narrator `cta_type`
4. **Em-dash budget** — ≤1 per visible paragraph block on CSP
5. **Pillar name lock** — reject AI output that renames deterministic pillar categories

Walker failure → **`scaffoldAndRefine` ships deterministic scaffold** (`packages/generation/src/ai/dispatcher.ts`).

### Confidence gating (intake substance)

Before calling Anthropic, compute a lightweight **substance score** per section (no ML — field presence + min length):

| Signal | Effect |
|--------|--------|
| `businessDescription` &lt; 40 chars | Skip `csp.paragraph` AI; ship scaffold only |
| `voiceSamples.length === 0` | Lower temperature; cap caption starters at 4; bio calls use stricter “stay close to scaffold” instruction |
| `differentiation` empty | `differentiator-led` one-liner seed uses offer-only angle; omit third variant if still thin |
| `originSummary` empty | `csp.bioLong` ships short-form expanded stub only (~40 words) |
| Any `ai_enhanced` call with empty scaffold | Do not call API; ship scaffold builder output as final |

Kit **never blocks** — degraded CSP beats missing PDF.

---

## Redundancy rules

From [`DELIVERABLE_REDUNDANCY_MATRIX.md`](../product/DELIVERABLE_REDUNDANCY_MATRIX.md):

- Do **not** reprint guide traits, swatches, tone essays, or folio 05 sample lines verbatim.
- CSP may **echo** transformation and offer language — that is the product.
- CTA variations must **not** contradict deterministic folio 05 anchor for the same surface.

---

## Implementation order

1. **Deterministic scaffolds** — `packages/generation/src/deterministic/contentStarterScaffolds.ts` ✓
2. **PDF shell** — `ContentStarterDocument`, `renderProKitPdfs`, `06-content-starter-pack.pdf` in `writeProPdfs.ts` (scaffold body, `--no-ai` path) ✓
3. **Schemas** — `packages/shared/src/ai/schemas/contentStarter*.ts`.
4. **AI sections** — one file per group under `packages/generation/src/ai/sections/csp/`; use `scaffoldAndRefine`.
5. **`voice.ctaVariations`** — after folio 05 anchor is readable from guide model; wire CSP page 2 + Voice p3 from same result object.
6. **PDF formatting components** — implement locked blocks in § PDF formatting brief (`CspOneLinerOptionsBlock`, etc.).
7. **Tests** — mocked unit tests for scaffolds + formatters; optional live smoke behind `ANTHROPIC_API_KEY` (not default CI).

---

## Code map (target)

| Piece | Path |
|-------|------|
| Scaffold builders | `packages/generation/src/deterministic/contentStarterScaffolds.ts` ✓ |
| PDF model | `packages/generation/src/deterministic/contentStarterPdfModel.ts` ✓ |
| PDF components | `packages/generation/src/pdf/CspPdfBlocks.tsx` ✓ |
| Flat blocks (tests) | `packages/generation/src/deterministic/contentStarterBlocks.ts` ✓ |
| PDF document | `packages/generation/src/pdf/CoreKitDocuments.tsx` — `ContentStarterDocument` ✓ |
| Render entry | `packages/generation/src/pdf/renderCoreKitPdfs.tsx` ✓ |
| Pro orchestration | `packages/generation/src/pro/buildProEnhancements.ts` (extend) or `buildCspSections.ts` |
| AI sections | `packages/generation/src/ai/sections/csp/*.ts` |
| CTA variations | `packages/generation/src/ai/sections/voice/ctaVariations.ts` |
| Schemas | `packages/shared/src/ai/schemas/contentStarter*.ts` |

---

## Open items (remaining)

1. **Narrator routing acceptance** — validate `product_led` / founder pronoun rules on bios and homepage in fixture matrix ([`NARRATOR_ROUTING_PHASE2_RESEARCH.md`](../research/NARRATOR_ROUTING_PHASE2_RESEARCH.md)).
2. **One Sonnet call vs three for brand summaries** — v1 keeps **three calls** for simpler schemas and independent retry; merge later if caching makes cost negligible.
3. **`brand-context` export** — wire CSP section outputs into umbrella schema (Pro-I / persistence track).

## Resolved (doc reconciliation — 2026-05-29)

- **About intro vs long bio** → `csp.bioLong` on page 2; PDF label “Long bio / About”.
- **Playbook §12.9.2, PRO_KIT_STRATEGY §7.3, persistence memo, orchestration ship gate** → aligned to hybrid ~8-call CSP; kit never blocks on CSP.
- **DELIVERABLE_PRODUCTION_SPEC §5** → 2-page layout; email on Voice p3; CTA variations model; removed obsolete 20–40w summary and generic CTA list.
- **OUTPUT_TRANSLATION_SPEC §1** — already aligned (no change required this pass).

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-29 | Doc reconciliation + locked PDF formatting brief; resolved about/bio and page layout |
| 2026-05-28 | Initial hybrid contract — scaffold-first CSP; add `csp.homepageDirections`; pillar names deterministic |
