# Identity Kit Deliverable Production Spec

This document is the detailed production spec for every customer-facing deliverable in the Identity Kit. It defines:

- exact asset list by tier
- file format and target page count
- visual treatment
- section-by-section table of contents
- suggested word-count targets
- which intake steps feed each section
- where Core and Pro should differ

Use this alongside [PRODUCT.md](./PRODUCT.md) for product scope, [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for shipped vs target packaging, and [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) for copy and flow alignment.

**Core path maintenance:** when intake routing or section-level branching changes, update [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) **§3.3** (Path Class Catalog) and **§3.3.1** (Path recipes) and extend `packages/generation/src/core-pdfs.test.ts` so behavior stays documented and pinned.

## Asset Summary

| # | File | Core | Pro | Notes |
|---|---|---|---|---|
| 1 | `01-brand-brief.pdf` | yes | yes (`ai_enhanced` prose) | Shared structure; AI rewrites prose. |
| 2 | `02-style-guide.pdf` | yes (pages 1–2) | yes (+ pages 3–4 Visual Reference Spread) | Pages 3–4 are Pro-only: 6–9 curated images from the bank, AI caption, palette call-outs. Same gated pattern as Voice Playbook page 3. |
| 3 | `03-voice-playbook.pdf` | yes (pages 1–2) | yes (+ page 3) | Page 3 adds email templates, before/after, CTA variations. |
| 4 | `04-quick-start.pdf` | yes | yes (`ai_enhanced` prioritization) | Shared structure. |
| 5 | `05-brand-identity-guide.pdf` | yes | yes (`ai_enhanced` section prose) | 6-folio guide. |
| 6 | `06-content-starter-pack.pdf` | no | yes | Pro-only applied-copy PDF. |
| 7 | `07-brand-strategy-memo.pdf` | no | yes | Pro-only analytical PDF (Opus 4.5). |
| 8 | `08-brand-audit.pdf` | no | yes (conditional) | Ships when `hasExistingBrand`. |

**Counts:** Core = 5 PDFs. Pro = 7 PDFs (8 with existing-brand inputs).

**Visual reference history note.** The moodboard was previously specified as a standalone `09-brand-moodboard.pdf`. It now ships as the Pro-only Visual Reference Spread inside the Style Guide (§2) — same AI pipeline (tag matcher → ranker → caption), same bank, same failure paths; just one less file in the buyer's bundle and a single coherent visual handoff for designers. See §2 "Pro Visual Reference Spread" and §8 redirect for the merged contract.

**Shipped today (engineering):** Core generate path emits **five** PDFs (`01`–`05`). Customer-facing order: Quick Start → Brand Identity Guide → deep dives. Redundancy matrix: [docs/product/DELIVERABLE_REDUNDANCY_MATRIX.md](./docs/product/DELIVERABLE_REDUNDANCY_MATRIX.md).

## Delivery bundle format (planning decision)

**Ship multiple PDF files (one per deliverable), not one long combined PDF.**

| Approach | Why we chose separate PDFs |
|----------|----------------------------|
| **Multiple PDFs (chosen)** | Matches what we sell and show in the UI (named kit pieces). Customers can share only the Style Guide with a designer or only the Voice Playbook with a writer. Smaller files are easier on email and mobile. Phase 2 **per-document regenerate** maps cleanly to one file per job. |
| **Single long PDF** | Simpler pipeline (one render, one attachment) and one download, but blurs the product story, makes partial sharing awkward, and forces users to scroll a 7–10 page doc to find one section. |

**Implementation note:** You can still use **one shared layout system** (templates, tokens, section components) and run the PDF exporter once per logical document. A combined “master” export could be a **later optional** add-on; it is not required for launch.

## Shared Production Rules

- All deliverables should be exported as **branded PDFs**.
- PDFs should feel premium but concise: easy to skim on-screen and printable without losing clarity.
- Avoid dense paragraph walls. Prefer:
  - short paragraphs
  - highlighted key phrases
  - callout blocks
  - checklists
  - small comparison or example modules
- Core should feel polished and complete.
- Pro should not just be longer. It should feel **more specific**, **more usable**, and **more tailored**.

### Core-first deterministic baseline (normative)

- The Identity Kit ships as a **Core deterministic base** first; Pro is an optional enhancement layer.
- Every Core deliverable must remain coherent and production-ready using only Core survey-visible inputs.
- Pro-only fields are enrichments, not prerequisites. If absent, render Core-safe deterministic fallback copy rather than thin placeholders.
- Section specs may mention Pro-only fields for enrichment, but must always preserve a Core-only path.

**Brand Identity Guide — folio 03 (Personality) gradient quote:** The optional **`storyNote`** pull quote is composed for stance and causal clarity when Pro/legacy story fields exist; otherwise the quote rail shows **`oneLine`** only. Full rules, punctuation (`;` between context and commitment), narrator **`I`/`we`** defaults, and industry/tone gates are documented in **`OUTPUT_TRANSLATION_SPEC.md` §10A.7.1** — see that section for reasoning (why Brief slicing was retired, Core fallback ladder, restrained kits).

## Brand Identity Guide

**File:** `05-brand-identity-guide.pdf`  
**Status:** Primary customer reference (shipped). Re-slices the same intake as legacy Brief / Style / Voice into one landscape guide.

### Purpose

Give the customer **one calm, skimmable reference** for who they are, how they look, how they sound, and copy they can paste into real channels — without separate strategy PDFs for each pillar.

### Format

- File type: branded PDF, US Letter **landscape**
- Target length: **6 physical pages** = **5 reader nav sections** (Look uses two pages: 02a Color + 02b Typography)
- Chrome: Inter + Source Serif 4; parent-kit neutrals on cards/chrome; **customer palette** on swatches and wordmark grids only
- Optional micro-glyphs on select folios (kit accent color)

### Reader information architecture

| Physical page | Folio | Nav label | Spread title | Primary content |
|---------------|-------|-----------|--------------|-----------------|
| 1 | 01 | Summary | Business name (hero) | `oneLine` quote, Core values, What we do / Who it's for / What changes |
| 2 | 02a | Look | Your colors | Color summary, Visual keywords, equal swatch row |
| 3 | 02b | Look | Your typography | Typeface specimens, wordmark rail + font links, 2×2 brand-name color grid |
| 4 | 03 | Personality | How your brand should come across | Brand heart, gradient quote, Brand behavior, one trust cue |
| 5 | 04 | Voice | How your brand sounds | Traits, Rules, What to talk about, Do/avoid, samples + transmutation arc, bottom band |
| 6 | 05 | Examples | Your brand voice in use | Sample lines, Calls to action (in-context shells when touchpoints set), before/after |

Spread subtitles (`editorial.deck`) are **not rendered** on the guide PDF (folio + title only); decks remain on the model for tests and future surfaces.

### Inputs (summary)

Same `IdentityKitForm` as legacy PDFs. Guide-specific routing: `guideFocus`, `touchpoints`, `primaryGoal`, `contentDensityBias` (from stage, touchpoint count, industry, sliders). Full intake-role table: [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) §10A.5.

### Implementation references

- Model: `packages/generation/src/deterministic/brandIdentityGuideModel.ts`
- PDF: `BrandIdentityGuideDocument` in `packages/generation/src/pdf/CoreKitDocuments.tsx`
- Folio 05 CTA shells: [docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md](./docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md)
- Shipped vs gaps: [docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md)

---

## 1. Brand Brief

> **Deep dive supplement.** Opens with a REF to the [Brand Identity Guide](#brand-identity-guide). Does **not** repeat Summary values or Personality content in full.

### Purpose

Expand strategy for the owner or a collaborator: audience, story, differentiation, and the full brand anchor sentence. Use the guide for the short version.

### Must not include

- A duplicate values list (REF Summary instead).
- The same one-line hero quote as the only content (guide Summary owns the skimmable version).

### REF pattern

*Your at-a-glance brand lives in the Brand Identity Guide → Summary and Personality. This document goes deeper on strategy and positioning.*

### Format

- File type: branded PDF
- Target length: 1 page
- Style: editorial/text-forward with strong hierarchy and clear section breaks

### Table of Contents

0. Brand anchor sentence
1. Brand overview
2. Ideal customer
3. Core transformation / promise
4. Values and positioning cues
5. Brand story angle
6. Differentiation snapshot

### Section Specs

Tier qualifier note for this document:
- Input lists below reflect the full `IdentityKitForm` schema used by generation.
- Some fields are Pro-only in the live survey UI; where behavior differs by tier, treat Core as the minimum guaranteed input set.

#### 0. Brand anchor sentence
- Goal: produce one ownable positioning sentence the customer can hand to a designer, collaborator, or use as an internal north star. Appears at the top of every document in the kit as a shared reference line.
- Target length: 18-28 words.
- Format: "[Business name] helps/makes/serves [audience] [transformation], and sounds [tone descriptor] while doing it." — the verb shifts by narrator (`solo_expert` → "helps", `solo_maker` → "makes", `local_team` → "is here for", `product_led` → "makes", `mission_community` → "serves").
- Inputs:
  - Step 1 `businessName`
  - Step 1 `transformation`
  - Step 2 `customerArchetype`
  - Step 3 `tonePreset`
  - Step 1 `brandNarrator` (determines lead verb and pronoun voice)
- Core mode: deterministic
- Pro mode: ai_enhanced (tighter synthesis, stronger specificity)

#### 1. Brand overview
- Goal: summarize what the business is and what it offers.
- Target length: 30-50 words.
- Inputs:
  - Step 1 `businessName`
  - Step 1 `offer`
  - Step 1 `industry`
  - Step 1 `stage`

#### 2. Ideal customer
- Goal: define the primary buyer in simple, non-jargony language.
- Target length: 30-50 words.
- Inputs:
  - Step 2 `customerArchetype`
  - Step 2 `painPoints`
  - Step 2 `desiredOutcomes`
- Tier note: in the live Core survey, only `customerArchetype` is guaranteed. `painPoints`/`desiredOutcomes` are Pro-only depth signals.

#### 3. Core transformation / promise
- Goal: articulate the change the business helps create.
- Target length: 20-35 words.
- Inputs:
  - Step 1 `transformation`
  - Step 1 `offer`
  - Step 2 `desiredOutcomes`

#### 4. Values and positioning cues
- Goal: translate selected values into brand posture and strategic cues.
- Target length: 3-4 bullets, 6-12 words each.
- Inputs:
  - Step 4 `values`
  - Step 4 `missionStatement`

#### 5. Brand story angle
- Goal: frame the brand story or reason behind the business in a concise way. Framing may be founder-led, maker-led, team-led, product-led, or mission-led based on brand narrator.
- Target length: 25-45 words.
- Inputs:
  - Step 5 `originArchetype`
  - Step 5 `originSummary`
  - Step 5 `motivation`
  - Step 1 `brandNarrator` (secondary: shapes framing and pronoun voice)

#### 6. Differentiation snapshot
- Goal: explain what makes the brand distinct.
- Target length: 20-40 words.
- Inputs:
  - Step 7 `competitors`
  - Step 7 `differentiation`
- Tier note: in the live Core survey, `differentiation` is Pro-only. Core output should still produce a usable differentiation section from available signals.

### Core vs Pro

- **Core**
  - concise strategic summary
  - more templated structure
  - competitor-informed positioning cues may remain broad if inputs are light
- **Pro**
  - stronger synthesis across transformation, audience, voice, and differentiation
  - sharper positioning language
  - more brand-specific summary line and differentiation framing

### Narrator emphasis

Section ordering and word-weight shift based on `brandNarrator`. Generation should front-load the highest-emphasis section and give it the most space:

| Narrator | Leading emphasis (most → least) |
|---|---|
| `solo_expert` | Brand story angle → Core transformation → Values |
| `solo_maker` | Brand story angle → Values → Differentiation |
| `local_team` | Core transformation → Ideal customer → Values |
| `product_led` | Core transformation → Differentiation → Ideal customer |
| `mission_community` | Values → Core transformation → Brand story angle |

Note: all six sections still appear in every Brief — this table governs which gets the most specific language and the most prominent visual treatment in the PDF layout, not which gets omitted.

## 2. Brand Style Guide

> **Deep dive supplement.** REF **Look** for swatches, hex, type specimens, and wordmark options.

### Purpose

Visual principles, imagery mood, and do/don’t rules. Channel rollout lives in Quick Start Week 3, not here.

### Must not include

- A full palette re-list that duplicates guide folio 02a.
- Channel-by-channel rollout checklists (Quick Start owns sequencing).

### REF pattern

*Your colors and type live in the Brand Identity Guide → Look. This document goes deeper on visual principles and imagery.*

### Format

- File type: branded PDF
- Target length: **2 pages Core, 3–4 pages Pro** (Pro adds the Visual Reference Spread as pages 3–4 — see "Pro Visual Reference Spread" below)
- Style: visual-first with short supporting text

### Table of Contents

1. Palette overview
2. Visual direction summary
3. Typography (recommended pairings or customer-stated primary)
4. Style principles
5. Do / avoid guidance
6. Practical usage notes
7. **Visual Reference Spread** *(Pro only)* — image grid, AI caption, palette call-outs

### Page Plan

#### Page 1 (Core + Pro)
- Palette overview
- Visual direction summary
- Typography recommendations

#### Page 2 (Core + Pro)
- Style principles
- Do / avoid guidance
- Practical usage notes

#### Pages 3–4 (Pro only — Visual Reference Spread)
- Image grid: 6–9 curated photographs/textures selected from the kit's owned image bank
- AI caption: ~80-word paragraph tying the grid to the kit's voice, palette, style, and mood
- Palette call-outs: 3–5 named-palette swatches re-presented so the buyer sees how the reference imagery connects back to the kit's color system
- Layout: template author decides one-page vs. two-page based on selected image count and aspect ratios — uniform aspect ratios may collapse to one page; nine mixed images may need two

### Section Specs

#### Palette overview
- Goal: present the selected palette clearly and attractively.
- Inputs:
  - Step 6 `selectedPalette`

#### Visual direction summary
- Goal: describe the aesthetic direction in plain language.
- Target length: 25-45 words.
- Inputs:
  - Step 6 `selectedStyle`
  - Step 6 `existingTypeface` (optional **Pro** intake only; feeds Typography continuity copy and specimen notes when `tier === 'pro'`)
  - Step 6 `colorMoodNotes`
  - Step 6 `styleNotes`
- Tier note: `colorMoodNotes` and `styleNotes` are Pro-only in the live survey; Core relies on style/palette presets plus deterministic defaults.

#### Typography
- Goal: name concrete font directions so the brand’s type system is not an afterthought.
- Target length: short paragraphs plus a licensing reminder.
- Inputs:
  - Step 6 `selectedStyle` (maps to a default primary + supporting recommendation)
  - Step 6 `existingTypeface` (optional **Pro** — when set, continuity-first typography lead/footer; Core kits use recipe-based pairings plus a short framing note that licensed incumbent fonts can map to the same roles)

#### Style principles
- Goal: give 3-5 principles that guide how the brand should look.
- Target length: 3-5 bullets.
- Inputs:
  - Step 6 selections + notes
  - Step 4 values (secondary influence)

#### Do / avoid guidance
- Goal: prevent visually inconsistent decisions.
- Target length: 2-3 do bullets, 2-3 avoid bullets.

#### Practical usage notes
- Goal: help customers apply the style in real contexts — where the palette and style direction should show up first (social profiles, storefront, packaging, etc.).
- Target length: 3-5 short bullets.
- Scope: give light directional guidance on visual application (e.g. "use your primary color for header backgrounds; keep product photos on a neutral backdrop"). **Do not include photography how-to instructions** — customers receive a free Camentra trial via post-purchase email, which handles hands-on photography guidance natively. Keep any photo-related bullets to style direction only (mood, lighting feel, backdrop direction) not technique.

#### Pro Visual Reference Spread (Pro-only, pages 3–4)

> Previously specified as a standalone `09-brand-moodboard.pdf`. Now ships as additional Style Guide pages gated on `tier === 'pro'`, mirroring the Voice Playbook page 3 pattern. Same AI pipeline, same image bank, same failure paths — one less file for the buyer to manage and a single coherent handoff to designers.

- **`moodboard.ranker`** — image grid renders 6–9 selections; template author chooses grid shape per count (3×2 / 3×3 / 2×3 are typical). Failure: deterministic top-6 by tag-match score per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.8.5.
- **`moodboard.caption`** — paragraph supporting the grid, body type. ~80 words. Failure: deterministic caption variant from a pre-written bank keyed on palette family × style register.
- **`moodboard.paletteCallouts`** — 3–5 swatches from `selectedPalette` per the existing folio 02a renderer. Cannot fail (fully deterministic).

**Inputs:** `selectedPalette`, `selectedStyle`, `moodAdjectives[]`, `brandNarrator`, `industry`; `existingBrand.referenceImageRef` when present (drives both pre-shortlist tag extraction per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.8.1 step 0 and ranker tie-breaking per §5.8.4); `referenceImageTags[]` (fulfillment-derived); image-bank metadata file (240–300 images target at v1 launch).

**Gating:** rendered only when `tier === 'pro'`. If the entire moodboard pipeline catastrophically fails (ranker fails AND deterministic fallback returns < 6 candidates AND caption fails), the spread is omitted cleanly and the Style Guide ships at 2 pages — the rest of the kit assembles around the omission with no visible scar.

**Must not include:**
- AI-generated images, illustrations, or icons. The bank is the only image source.
- Images outside the curated bank (no web scraping, no "in the spirit of" substitutions).
- Captions describing images that are not in the final selection.

### Core vs Pro

- **Core (2 pages)**
  - based mainly on selected palette and style system
  - broad visual guidance; narrator-conditioned "where to apply first" suggestions
- **Pro (3–4 pages)**
  - all Core sections, with AI-rewritten prose: more tailored interpretation of notes/references, stronger aesthetic framing, more nuanced style principles
  - narrator-conditioned channel priority (e.g. Etsy shop + Instagram for makers; GMB + storefront for local teams)
  - **Visual Reference Spread (pages 3–4):** curated image grid + AI caption + palette call-outs — the visual handoff designers and photographers actually need, in the same document as the visual rules

## 3. Voice & Content Playbook

> **Deep dive supplement.** REF **Voice** and **Examples** for traits, rules, and paste-ready lines.

### Purpose

Longer tone calibration, guardrails, themes, and extra samples. Paste-ready CTAs and in-context shells stay on guide Examples.

### Must not include

- The same paste-ready CTA lines as guide folio 05 (CTA section = principles + REF only).

### REF pattern

*How you sound at a glance lives in the Brand Identity Guide → Voice and Examples. This document goes deeper on voice calibration and examples.*

### Format

- File type: branded PDF
- Target length: 2-3 pages
- Style: text-forward with examples, comparisons, and short callout modules

### Table of Contents

1. Tone profile
2. Voice guardrails
3. Messaging themes
4. Sample phrases / language cues
5. Calls to action (CTAs) (Core: deterministic; defines CTAs in plain terms; aligns with primary business goal and primary channel)
6. Writing do / avoid guidance
7. Before / after examples (Core: deterministic templates)

**Pro additions (same Voice Playbook PDF or adjacent Pro deliverable per product packaging):**

- Email voice application (2 short templates) — `ai_only` (Pro)
- Additional before/after voice rewrites — `ai_only` (Pro)

### Page Plan

Layout is flow-based in the renderer (sections stack in TOC order). Typical spread:

#### Page 1
- Tone profile
- Voice guardrails

#### Page 2
- Messaging themes (with short reader-facing framing)
- Sample phrases / language cues (with usage note: voice illustrations, not all are closing lines)
- Calls to action (CTAs)

#### Page 3
- Writing do / avoid guidance
- Before / after examples (Core)

#### Page 3+ (Pro only, when shipped in this document)
- Email voice application (2 short templates)
- Optional: extra before/after pairs beyond Core

### Section Specs

#### Tone profile
- Goal: summarize the brand’s overall voice in plain language.
- Target length: 20-40 words plus labeled tone attributes.
- Inputs:
  - Step 3 `tonePreset`
  - Step 3 `voiceSliders`
  - Step 3 `customVoiceNotes`

#### Voice guardrails
- Goal: define what the brand should sound like and avoid sounding like.
- Target length: 4-6 bullets.
- Inputs:
  - Step 3 inputs
  - Step 4 values

#### Messaging themes
- **What it is:** Recurring **topics and angles** (content pillars) the brand can return to — the “what we keep talking about” layer — across bios, longer posts, emails, listings, about copy, and ongoing conversations.
- **What it is not:** A substitute for **tone** (that is Tone profile and Voice guardrails) or for the **closing ask** (that is **Calls to action (CTAs)**).
- **Where it applies best:** Ubiquitous surfaces where you build recognition over time (about sections, email bodies, multi-sentence captions, product or service storytelling). Short, high-intent surfaces (last line of a post, button text, pinned line) are better served by **CTAs**.
- Goal: surface 3–4 concrete theme lines plus industry vocabulary hints; optional short **framing paragraph** in output so readers know how to use themes vs closes.
- Target length: framing paragraph (Core) + 3–4 theme lines, 1 sentence each, plus industry preferred/avoid lines where generated.
- Inputs:
  - Step 1 `brandNarrator` (primary: defines the theme *category set* — see `narratorProfile.tone_of_voice_themes` in `OUTPUT_TRANSLATION_SPEC.md §6A`)
  - Step 1 `transformation`
  - Step 1 `industry` (industry voice profile: preferred and avoid terms)
  - Step 2 audience signals (context)
  - Step 4 values
  - Step 7 differentiation
- Generation rule: `brandNarrator` selects the pool of theme categories (e.g. `solo_maker` → craft / process / maker pride / community); industry and transformation supply the specific language within those categories. Do not generate generic "excellence" or "quality" themes — themes must be rooted in the narrator's natural content territory and **industry vocabulary**, not empty filler.

#### Sample phrases / language cues
- **What it is:** Voice and rhythm **illustrations** — quoted lines that show how the brand sounds in the wild.
- **What it is not:** A mandatory set of “last lines” or button labels. The mix includes openers, proof lines, and sometimes a close; **not every sample is appropriate as a closing ask** for every channel or post type.
- Goal: give 6–10 examples; Core may prepend a one- or two-sentence **usage note** directing readers to pair body copy with **Calls to action (CTAs)** for closes.
- Target length: 6-10 examples.

#### Calls to action (CTAs)
- **Customer-facing name:** **Calls to action (CTAs)** — spell out “call to action” once in body copy so the acronym is plain, not insider-only.
- **What it is:** The **one thing** you ask the reader to do next after they read (book, buy, follow, DM, get a quote, etc.), aligned with business goal and primary channel.
- Inputs:
  - Step 1 `primaryGoal` (`direct_sales` | `lead_gen` | `audience_growth` | `retention`)
  - Step 1 `touchpoints` (normalized; primary channel from first selected touchpoint; see `packages/shared/src/touchpoints.ts` and channel resolution in `coreAssembly.ts`)
- Mode: deterministic (Core).
- **Core vs Pro:** Core delivers **principles and pattern examples** for CTAs on the primary channel. The Pro **Content Starter Pack** adds **channel-specific** copy blocks, hooks, and richer CTA suggestion sets per surface — it **extends** this layer without redefining messaging themes.

#### Writing do / avoid guidance
- Goal: make the voice actionable for future writing.
- Target length: 3-5 do bullets, 3-5 avoid bullets.
- **Alignment:** Bullets that mention ending with a clear ask should **reinforce** the **Calls to action (CTAs)** section and stay in plain language (define CTA when the term appears).

#### Before / after examples (Core)
- Goal: deterministic template pairs showing generic vs on-brand phrasing; anchors the voice in concrete rewrites.
- Structure: 2 pairs is enough for Core when they do distinct jobs well: one discovery/feed-style rewrite and one conversion/profile/listing-style rewrite, routed from narrator + touchpoint context + primary goal.
- Copy standard: each pair must be a true weak→strong rewrite within the same scenario. Avoid two pairs that start from the same offer phrase with minor wording changes. Keep lines plain-language, specific, and trust-building.
- Mode: deterministic (Core) — see `OUTPUT_TRANSLATION_SPEC.md` and generation implementation.

#### Email voice application (Pro only)
- Goal: give 2 short, ready-to-adapt email templates showing the brand voice applied to real outreach scenarios.
- Target length: 60-100 words per template.
- Templates:
  - (1) Intro or welcome message — first contact or post-booking/purchase follow-through
  - (2) Follow-up or check-in — re-engagement or relationship maintenance
- Inputs:
  - Step 3 `tonePreset` + `voiceSliders` (voice)
  - Step 1 `brandNarrator` (shapes the scenario: booking follow-up for `solo_expert`, order/shipping update for `solo_maker`, visit invite or local update for `local_team`, product restock or launch for `product_led`, campaign or event call-to-action for `mission_community`)
  - Step 2 `customerArchetype` (shapes who is being addressed)
- Mode: ai_only (Pro) — no Core equivalent.
- Scope: templates must model the brand voice, not pitch a product. They are voice examples, not sales emails.

#### Before / after voice rewrites (Pro only)
- Goal: show 2–3 paired examples of generic writing versus this brand's voice, giving non-marketers an immediately usable calibration reference.
- Target length: 2–3 pairs; each pair is 1–3 sentences per side.
- Structure: "Without brand voice → [generic line]" / "With [Business Name]'s voice → [on-brand rewrite]"
- Inputs:
  - Step 3 `tonePreset` + `voiceSliders` (voice calibration)
  - Step 1 `brandNarrator` + `industry` (shapes scenario and vocabulary)
  - Step 1 `transformation` (anchors at least one rewrite to the core promise)
- Mode: ai_only (Pro) — no Core equivalent.
- Appears on: Page 3 alongside email templates.

### Core vs Pro

- **Core**
  - solid tone direction and guardrails
  - messaging themes (topics/angles) with framing; sample phrases as voice illustrations; **Calls to action (CTAs)** tied to primary goal and primary channel (deterministic)
  - fewer nuanced examples than Pro
  - deterministic before/after examples
  - no email templates
- **Pro**
  - more specific voice calibration
  - stronger mapping from audience + story + values into usable messaging guidance
  - clearer sample phrasing tied to the business context
  - narrator-conditioned messaging themes (same mental model as Core; richer depth)
  - **Content Starter Pack:** channel-specific templates, hooks, bios, homepage blocks, and richer CTA suggestion sets per surface — **extends** Core without redefining themes or duplicating the Core CTA section
  - 2 email voice templates (Page 3, ai_only)

## 4. 30-Day Quick Start Checklist

> **Primary action deliverable.** Customer should open this first, then the Brand Identity Guide.

### Purpose

Turn the brand kit into immediate action: what to do each week, with pointers to guide folios (not repeated hex codes, tone essays, or full anchor sentences).

### Must not include

- Verbatim `oneLine` / guide hero quote.
- Full palette or voice trait lists (point to guide folios instead).

### Format

- File type: branded PDF
- Target length: 1 page
- Style: checklist / action plan, very skimmable

### Table of Contents

1. Week 1 foundational actions
2. Week 2 messaging updates
3. Week 3 visual rollout
4. Week 4 consistency checks

### Section Specs

#### Week 1 — Highest-priority channel first
- Goal: anchor the first week's actions to the single most impactful touchpoint for this narrator type.
- Target length: 3-5 checklist items.
- Generation rule: resolve the **primary surface label** from ordered `step1.touchpoints` first, then `narratorProfile.primary_channels` as fallback (`resolveChannelPlan` in `packages/generation/src/deterministic/coreAssembly.ts`). Week 1 **preamble** names that primary channel. Checklist **lines** use narrator templates in `week1Items`, with a **commerce-oriented** branch for `solo_expert` when the resolved primary touchpoint **bucket** is `marketplace` (shop/listing tasks instead of booking-first defaults). Examples (when touchpoints match):
  - `solo_expert` + LinkedIn/website-first → profile headline, bio, email signature (when email is selected), cross-surface consistency
  - `solo_expert` + marketplace-first → shop headline, listing or pinned post, cover/banner, avatar
  - `solo_maker` → Refresh shop bio + cover photo + first listing description
  - `local_team` → Update Google Business profile name, description, and photos
  - `product_led` → Update website hero copy + product description lead
  - `mission_community` → Update Facebook page About section + email newsletter header

#### Week 2 — Voice and messaging application
- Goal: apply the brand voice and messaging direction to that same primary touchpoint and extend to a second channel.
- Target length: 3-5 checklist items.
- Generation rule: use tone profile + messaging themes; items should be concrete and channel-specific (e.g. "rewrite your 3 pinned Instagram posts using your messaging themes").

#### Week 3 — Visual rollout
- Goal: apply palette and style direction consistently across the primary touchpoint set.
- Target length: 3-5 checklist items.
- Generation rule: use `narratorProfile.primary_channels` to specify where to apply visuals (e.g. "update your Etsy banner and thumbnail backgrounds to use your primary palette colors" vs. "update your GMB cover photo and storefront signage direction").
- Scope: directional guidance only — no photography technique. See Camentra free trial (delivered via post-purchase email) for hands-on visual capture support.

#### Week 4 — Consistency check
- Goal: help them audit and tighten the brand across all active channels.
- Target length: 3-5 checklist items.
- Generation rule: reference all channels named in weeks 1-3; prompt a cross-channel audit for voice, visual, and CTA consistency.

### Inputs

- Step 1 `businessName`, `transformation`, `brandNarrator`
- Step 3 voice direction
- Step 4 values
- Step 6 visual direction
- Step 7 competitors / differentiation

### Core vs Pro

- **Core**
  - narrator-conditioned channel priority; practical but broad action items
- **Pro**
  - narrator-conditioned and more tailored sequencing
  - more messaging-driven actions informed by Content Starter Pack content

## 5. Content Starter Pack (Pro Only)

### Purpose

Give Pro customers immediately usable content outputs they can adapt into real marketing materials without starting from a blank page.

### Format

- File type: branded PDF
- Target length: 2 pages (Core); 3 pages (Pro — Page 3 adds email voice templates)
- Style: practical, copy-forward, designed for reuse

### Table of Contents

1. One-liner / brand summary
2. Homepage messaging directions
3. Brand bio / about intro
4. Social bio options
5. Caption starters
6. Content pillar prompts
7. CTA suggestions

### Page Plan

#### Page 1
- One-liner / brand summary (3 options)
- Homepage messaging directions
- Brand bio / about intro

#### Page 2
- Social bio options (short-form + long-form variants)
- Caption starters
- Content pillar prompts
- CTA suggestions

#### Page 3 (Pro only)
- Email voice application (2 templates)

### Section Specs

#### One-liner / brand summary
- Goal: provide concise marketing-ready brand lines the customer can use across profiles and pitches.
- Target length:
  - one-liner: 3 options, each 8-16 words (transformation-led / audience-led / differentiator-led)
  - short brand summary: 1 option, 20-40 words
- Inputs:
  - Step 1 `transformation`
  - Step 2 `desiredOutcomes`
  - Step 3 voice
  - Step 1 `brandNarrator` (shapes whether bio is founder-led, team-led, product-led, or mission-led)
  - Step 7 differentiation

#### Homepage messaging directions
- Goal: provide high-level messaging direction, not a full homepage wireframe.
- Target length: 2-3 headline/subheadline routes.
- Inputs:
  - Steps 1, 2, 3, 7 primarily

#### Brand bio / about intro
- Goal: provide a short intro paragraph that can be adapted for About pages, profiles, or decks.
- Target length: 40-80 words.
- Inputs:
  - Step 5 story
  - Step 4 values
  - Step 3 voice
  - Step 1 `brandNarrator` (shapes whether bio is founder-led, team-led, product-led, or mission-led)

#### Social bio options
- Goal: give 2 ready-to-use profile bio options, each suited to a different platform context.
- Target length: 2 named variants:
  - **Short-form** (Instagram / Etsy / Google Business): 1-3 punchy lines, 15-30 words total, optimized for small bio fields. Emoji optional and tone-dependent.
  - **Long-form** (LinkedIn / website About page): 2-4 sentences, 40-60 words, more context and credential language.
- Inputs:
  - Step 1 `brandNarrator` (determines which variant is featured first and shapes pronoun voice — `I/me` for solo narrators, `we/our` for local team, brand name for product-led and mission)
  - Step 5 `originArchetype` + `originSummary` (context for long-form)
  - Step 3 `tonePreset` (wording style)
- Generation rule: short-form bio must work as a literal copy-paste into the platform's bio field. Long-form must feel like an About page opener, not a resume summary.

#### Caption starters
- Goal: give usable starting lines for posts or captions.
- Target length: 6-10 short hooks.

#### Content pillar prompts
- Goal: give the customer 5 repeatable content categories they can return to every week, each with starter questions to make posting easier.
- Target length: 5 pillars, each with 2 starter prompt questions.
- Inputs:
  - Step 1 `brandNarrator` (primary: defines the pillar category set from `narratorProfile.content_pillars`)
  - Step 1 `industry` (flavors the specific language within each pillar)
  - Step 1 `transformation` (anchors at least one pillar to the core promise)
- Generation rule: draw pillar names from `narratorProfile.content_pillars` — do not generate generic pillars like "Inspiration" or "Tips and Tricks." Each pillar should feel specific to the narrator type. Industry vocabulary from `industryProfile.preferred_terms` should flavor the starter prompts.

#### CTA suggestions
- Goal: give reusable call-to-action language that matches both what this brand invites people to do and how it sounds.
- Target length: 6-10 short CTA options.
- Inputs:
  - Step 1 `brandNarrator` (determines CTA *type* — browse/buy, book/consult, visit/call, support/join — from `narratorProfile.cta_type`)
  - Step 3 `tonePreset` + `voiceSliders` (determines *wording* style — friendly, direct, warm, etc.)
  - Step 1 `industry` (flavors context and phrasing)
- Generation rule: all CTAs must be of the correct action type for the narrator. A `solo_expert` should never produce "Shop the collection." A `local_team` should not produce "Book a consultation." Wording variation within the correct type is handled by tone. Use `narratorProfile.cta_patterns` as seed phrases; generate variations from there.

Pro CSP additionally includes the **CTA-variations** section per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §10A.6A.1: per-surface 3–4 alternative phrasings with locked variation intents (`more_direct`, `quieter`, `more_inviting`, `more_confident`) layered on top of the deterministic anchor CTAs already covered above. The Voice Playbook page 3 ships the same variations from Section ID `voice.ctaVariations`; CSP page 2 ships the CSP-scoped variants from `csp.ctas`.

### Why it is Pro-only

- It depends on synthesizing multiple signals, not just formatting answers into a document.
- It is most valuable when audience, story, tone, and differentiation are all strong enough to produce distinct content.
- It creates directly reusable content assets, which is a clear premium value unlock.

## 6. Brand Strategy Memo (Pro Only)

> **Pro analytical deliverable.** This is the PDF buyers cite when telling someone what they got — every other PDF gives outputs; the Memo gives analysis. Analytical, not aspirational.

### Purpose

The analytical deliverable that justifies $149 vs Core's $79. Articulates archetype, frames Jobs-to-be-Done, describes a behavioral audience, surfaces tensions, names a contrarian angle, lays out a paste-ready messaging hierarchy, sketches a 90-day roadmap, and (when intake substance allows) closes with a brand narrative. Composed by Claude Opus 4.5+ with citation discipline against intake fields per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.

### Reader framing (rendered on page 1)

The Memo opens with a short framing line — rendered above §1 Archetype in the template — that orients the reader before they encounter tensions or analytical observations:

> *This memo analyzes your brand direction and surfaces productive tensions and strategic angles. It works alongside your Brand Identity Guide, Style Guide, Voice Playbook, and Quick Start — where tensions appear, they're opportunities to sharpen emphasis within the direction you've already chosen, not signals to change course.*

This framing is template-rendered, not AI-generated. It exists because the Memo's §4 tensions and §5 contrarian angle are analytical in register and a buyer reading both the Memo and the rest of the kit needs an explicit signal that the two don't contradict — per the buyer-selection-lock rule in [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.0.

### Must not include

- Logo proposals or color recommendations outside the existing palette.
- **Recommendations to change `selectedPalette`, `selectedStyle`, `tonePreset`, or `brandNarrator`** — these are the kit's locked selections and the Memo sharpens execution within them, never proposes alternatives. Enforced by the prompt-level `BUYER SELECTION LOCK` block in [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.8 and the `kit_contradiction_walker` per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.0.
- Strategy-consultant fluff (banlist enforced by walker per [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.9).
- Generated graphics, illustrations, or icons.
- "Next steps to discuss" or upsell language. The Memo is the deliverable, not a teaser.

### Format

- File type: branded PDF
- Target length: 4–5 landscape pages (longer when §6 hierarchy carries 4 pillars or §8 narrative ships)
- Style: editorial-analytical with visible structure; reads like a strategist's memo, not a marketing brochure
- Model: Claude Opus 4.5+ (per [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §7.2 call-class defaults)

### Table of Contents

1. Brand archetype (Mark + Pearson)
2. Jobs-to-be-Done
3. Behavioral audience
4. Tensions
5. Contrarian angle
6. Messaging hierarchy
7. 90-day roadmap
8. Brand narrative (conditional)

### Page Plan

- **Page 1:** §1 Archetype + §2 JTBD
- **Page 2:** §3 Behavioral audience + §4 Tensions
- **Page 3:** §5 Contrarian angle + §6 Messaging hierarchy
- **Page 4:** §7 90-day roadmap + §8 Brand narrative (when shipped)
- **Page 5 (optional):** Used when §6 hierarchy carries 4 pillars or §8 narrative ships at full word budget

### Section Specs

Word budgets per [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.9.4 and duplicated in [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.1. Layout intent below names what each section needs to convey; the React-PDF template author owns the concrete layout.

- **`strategyMemo.archetype`** — archetype label leads, supporting paragraph follows. Required. Fallback: deterministic scaffold via [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §7.4 dispatcher; specific scaffold content authored during Pro-E template work.
- **`strategyMemo.jtbd`** — three dimensions (Functional / Emotional / Social) presented in parallel; template author chooses columns vs stacked based on grid. Required. Fallback: deterministic scaffold via §7.4 dispatcher.
- **`strategyMemo.behavioralAudience`** — paragraph with subhead. Required. Fallback: deterministic scaffold via §7.4 dispatcher.
- **`strategyMemo.tensions`** — "Tension → Resolution" pairs. Optional cardinality (2 instead of 3 when only 2 carry citation; renders empty when none). Renders an "[No surfaced tensions]" placeholder only when the array is empty after demotion. **Template label:** each tension renders with a small **"Strategic Tension"** eyebrow label above the pair, signaling that this is analytical observation grounded in the buyer's locked direction — not a correction to the kit. Resolution lines are always framed as opportunities within the locked direction per the buyer-selection-lock rule ([`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.0).
- **`strategyMemo.contrarianAngle`** — paragraph; first sentence treated as the load-bearing claim and visually emphasized at template author's discretion. Required. Fallback: deterministic scaffold via §7.4 dispatcher.
- **`strategyMemo.messagingHierarchy`** — value prop leads, pillars support, primary message anchors; template author chooses concrete layout. Required. Demotion rule applies (3 cited pillars beat 4 aspirational). Catastrophic fallback: deterministic scaffold via §7.4 dispatcher.
- **`strategyMemo.roadmap`** — ordered items, each tagged with the pillar it activates. Optional cardinality. Catastrophic fallback: deterministic scaffold via §7.4 dispatcher.
- **`strategyMemo.narrative`** — paragraph with subhead indicating type (Problem Story / Brand Manifesto / skipped). When skipped, omitted entirely; pagination collapses. No deterministic fallback — the section either ships honestly or does not appear.

### Inputs

- All Pro intake fields per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §2.2 (`businessDescription`, `voiceSamples`, `moodAdjectives`, plus the full Core baseline).
- Derived: `industryVoiceProfile`, `narratorVoiceProfile`.
- **Does not depend on the existing-brand track.** Memo ships for every Pro buyer regardless of `hasExistingBrand`.

### Core vs Pro

- **Core:** not included.
- **Pro:** required. Acceptance threshold = ≥ 6 of 8 sections valid (per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.5). Below threshold, the assembler swaps in the deterministic Brand Identity Guide as a Memo replacement and ops are paged.

### Why it is Pro-only

Every other PDF in the kit gives the buyer outputs. The Memo gives the buyer analysis — the document they cite when telling a designer, a copywriter, or an investor what they paid for. It cannot be approximated deterministically because it requires synthesizing across all intake fields with proper-noun specificity, citation discipline, and editorial coherence.

## 7. Brand Audit (Pro, conditional)

> **Pro conditional deliverable.** When the buyer uploads existing brand assets, the Audit is the most differentiated artifact in the kit — it is the section a strategist would charge separately for. Conditional shipping is honest; we never fabricate observations to fill a page.

### Purpose

When the buyer toggles `hasExistingBrand: true` and provides a logo, reference image, hex inputs, or URL, the Audit observes what's there, names what's working, surfaces tension with the recommended direction, and prioritizes recommendations. Composed by Claude Sonnet 4.5 with vision (multimodal §1) per [`AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.9.5.

### Reader framing (rendered on page 1)

The Audit opens with a short framing line — rendered above §1 What we saw in the template — that locks the document's bridging role for the reader:

> *This audit observes the brand assets you uploaded, names what's already serving you, and bridges them to the direction you've selected in the rest of this kit. Every recommendation acts on your existing assets so they align with the palette, style, and tone you've chosen — your kit's direction stays fixed.*

This framing makes §1–§2 ("your current brand") and §3–§4 ("your evolution path toward the kit's locked direction") read as two halves of one bridge, not as a verdict on the buyer's existing brand. The framing is template-rendered, not AI-generated.

### Must not include

- Cruelty. Tensions are framed as "worth resolving," never "wrong."
- Image generation, logo redesign proposals, or palette substitutions.
- **Recommendations to change the kit's locked selections** (`selectedPalette`, `selectedStyle`, `tonePreset`, `brandNarrator`). The Audit's job is to bridge existing assets toward the locked direction — never the other way around. Enforced by [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.7.0 buyer-selection lock and the `kit_contradiction_walker`.
- Specifics not visible in the inputs. The Audit observes what is there; it does not extrapolate.

### Format

- File type: branded PDF
- Target length: 2 landscape pages
- Conditional: ships **only when `hasExistingBrand === true`** AND at least one of `existingBrand.logoRef | existingBrand.referenceImageRef | existingBrand.hexColors | existingBrand.url` is present
- Model: Claude Sonnet 4.5 with vision (multimodal §1)

### Table of Contents

1. What we saw (multimodal observation)
2. Where it's serving you
3. Where there's tension
4. Recommendations

### Page Plan

- **Page 1:** §1 What we saw + §2 Where it's serving you
- **Page 2:** §3 Where there's tension + §4 Recommendations

### Section Specs

- **`brandAudit.whatWeSaw`** — paragraph per input present (~40 words each); template author decides whether to include inline thumbnails based on layout. **§1 is the gating section** — if the vision call refuses or fails twice, the entire Audit PDF is omitted (ops alert per [`PRODUCT.md`](./PRODUCT.md) Pro fulfillment policy). §2–§4 depend on §1.
- **`brandAudit.whereServing`** — paragraph with positive-framing subhead. Optional; Audit ships without it (pagination collapses) when AI cannot identify a specific working element.
- **`brandAudit.whereTension`** — "Tension → Resolution" pairs (mirrors Strategy Memo §4 pattern). Optional.
- **`brandAudit.recommendations`** — ordered recommendations with priority indicated. Optional cardinality (2 instead of 3 OK).

### Inputs

- **Gating:** `hasExistingBrand === true`.
- **Required:** at least one of `existingBrand.logoRef | existingBrand.referenceImageRef | existingBrand.hexColors | existingBrand.url`.
- **Strategic context:** full Pro intake.
- **Palette / style:** references the same `selectedPalette` and `selectedStyle` the rest of the kit assumes — does **not** propose new colors or styles.

### Core vs Pro

- **Core:** not included.
- **Pro:** conditional. Ships only when gating + required-input conditions clear. Otherwise omitted cleanly; the rest of the kit assembles without it (7 PDFs vs 8).

### Why it is Pro-only and conditional

The Audit requires existing-brand inputs (which only the Pro intake track collects) and a vision-capable AI call (which is the kit's most expensive per-call cost driver). Without the inputs there is nothing to audit; without the inputs we never claim there is. Conditional shipping is honest — we will not fabricate observations to fill a page.

## 8. Brand Moodboard — merged into Style Guide

> **Merged.** Previously specified as standalone `09-brand-moodboard.pdf`. As of the 7-PDF Pro bundle decision, the moodboard ships as the **Pro Visual Reference Spread** inside the Brand Style Guide (§2). Same AI pipeline (tag matcher → ranker → caption), same image bank, same failure paths. The merge eliminates a separate file while keeping the visual handoff coherent: rules and reference live in the same document a designer needs.

**Where the surviving contracts live:**

- **Section composition + page plan:** §2 Brand Style Guide → "Pro Visual Reference Spread (Pro-only, pages 3–4)"
- **Section IDs (`moodboard.ranker`, `moodboard.caption`, `moodboard.paletteCallouts`)** remain unchanged for prompt-registry and walker-telemetry stability per [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §1.2.
- **Selection pipeline + controlled vocabulary + failure paths:** [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.8 (Moodboard bank selection contract).
- **Image bank curation, sourcing strategy, refresh policy, tag matrix:** [`PRO_KIT_STRATEGY.md`](./docs/audits/PRO_KIT_STRATEGY.md) §7.3.4.
- **AI prompts (ranker + caption + reference-image tag extractor):** [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](./docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.9.6.

**Why this is Pro-only (preserved rationale).** Bank curation, AI ranking subject to scene-variety constraints, and per-kit caption synthesis are the value-adds. Core's deterministic palette × style would produce the same grid for every kit with the same combo — no add over the Style Guide visual direction. The moodboard is only worth shipping when each kit gets a distinct selection; that requires the AI ranker — which is why it lives inside the Pro tier even though it now ships inside a Core-shared file.

## Input-to-Asset Mapping

| Step / field | Main assets informed |
|---|---|
| Step 1: Business Snapshot (`businessName`, `offer`, `transformation`, `industry`, `stage`) | Brand Brief, Quick Start, Content Starter Pack |
| Step 1: `brandNarrator` | Brand Brief (emphasis + anchor sentence), Voice Playbook (messaging themes + email templates), Style Guide (practical usage notes), Quick Start (channel priority), Content Starter Pack (all sections) |
| Step 1: `businessDescription` (Pro) | Brand Strategy Memo (all sections), Brand Brief, Content Starter Pack |
| Step 2: Your Buyer | Brand Brief, Voice Playbook, Content Starter Pack |
| Step 3: Brand Personality | Voice Playbook, Content Starter Pack |
| Step 3: `voiceSamples` (Pro) | Voice Playbook page 3, Strategy Memo §3 behavioral audience, all Core section rewrites |
| Step 4: Core Values | Brand Brief, Voice Playbook |
| Step 5: Brand Story | Brand Brief, Content Starter Pack |
| Step 6: Visual Direction (`existingTypeface` Pro-only) | Style Guide (palette, visual direction, typography) |
| Step 6: `moodAdjectives` (Pro) | Style Guide (visual direction copy + Pro Visual Reference Spread ranker/caption per §2) |
| Step 6: `existingBrand.*` (Pro, conditional) | Brand Audit, Style Guide acknowledgement copy, Quick Start week 1 |
| Step 7: Stand Out | Brand Brief, Quick Start, Content Starter Pack |

## Open Production Decisions

- Final PDF page templates / layouts per asset (now includes Pro-only PDFs §6 Brand Strategy Memo and §7 Brand Audit, plus the Pro Visual Reference Spread inside §2 Style Guide — concrete React-PDF templates land in Pro-E / Pro-F / Pro-G respectively)
- Exact font system and visual component library for PDFs (shared across Core and Pro PDFs; Pro-only PDFs inherit the same chrome)
- ~~Whether Pro gets 1 or multiple one-liner options~~ **Resolved: 3 options** — gives customers real choice for different contexts without overwhelming. All three drawn from same inputs; vary in emphasis (transformation-led, audience-led, differentiator-led).
- ~~Whether Content Starter Pack should include platform-specific variants later~~ **Resolved: 2 pages fixed + Pro Page 3 for email templates** — Page 3 is Pro-only; Core receives a 2-page CSP that stops before email templates. Platform-specific variants deferred to a potential future add-on.
- ~~Whether the Voice Playbook should include before/after rewrites in Pro~~ **Resolved: yes** — 2–3 paired examples on Page 3 alongside email templates. Mode: ai_only (Pro). Best plain-language teaching tool for a non-marketer: concrete, fast to read, immediately applicable.
- ~~Pro deliverable count / Pro-only PDF list~~ **Resolved: 7 PDFs (8 with existing brand)** per [`PRO_KIT_STRATEGY.md`](./docs/audits/PRO_KIT_STRATEGY.md) §0 and Asset Summary above. *Updated from prior 8/9 count after merging the standalone Brand Moodboard into the Style Guide as the Pro Visual Reference Spread.*
- ~~Strategy Memo, Brand Audit, Moodboard scope~~ **Resolved:** see §6 (Strategy Memo) / §7 (Brand Audit) / §2 (Style Guide → Pro Visual Reference Spread, formerly §8 Moodboard) above for per-deliverable specs. §8 now redirects to the merged Style Guide spread.
- ~~Whether the moodboard ships as a standalone PDF or merges into the Style Guide~~ **Resolved (this revision): merged into the Style Guide as Pro pages 3–4.** Rationale: Style Guide and moodboard live in the same conceptual territory (visual rules + visual reference). Splitting them created an artificial partition in what designers and creative collaborators need as one document. The merge drops Pro file count from 8/9 to 7/8 without losing any of the AI-driven selection or caption work — those still ship, just inside a different PDF. Pipeline, image bank, and prompt registry are unchanged; only the output destination moves.
- **Style-driven PDF template variation (deferred to v1.5 / v2).** v1 PDF templates are style-agnostic at the layout level — `step6.selectedStyle` drives copy, typography pairing, and the per-style adjective in the color summary, but not page chrome, grid structure, or type-scale system. See [`OUTPUT_TRANSLATION_SPEC.md`](./OUTPUT_TRANSLATION_SPEC.md) §5.9 (Style influence boundary) for the locked v1 scope and rationale. Revisit when designer-grade fixture coverage across 4 styles × N PDFs × M personas is justified by buyer-feedback signal.
