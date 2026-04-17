# Identity Kit Deliverable Production Spec

This document is the detailed production spec for every customer-facing deliverable in the Identity Kit. It defines:

- exact asset list by tier
- file format and target page count
- visual treatment
- section-by-section table of contents
- suggested word-count targets
- which intake steps feed each section
- where Core and Pro should differ

Use this alongside `PRODUCT.md` for product scope and `SCREEN_COPY_MAP.md` for copy and flow alignment.

**Core path maintenance:** when intake routing or section-level branching changes, update [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) **§3.3** (Path Class Catalog) and **§3.3.1** (Path recipes) and extend `packages/generation/src/core-pdfs.test.ts` so behavior stays documented and pinned.

## Asset Summary

| Asset | Tier | Format | Target length | Style |
|---|---|---|---|---|
| Brand Brief | Core + Pro | Branded PDF | 1 page | Editorial strategy snapshot |
| Brand Style Guide | Core + Pro | Branded PDF | 2 pages | Visual-first guide |
| Voice & Content Playbook | Core + Pro | Branded PDF | 2-3 pages | Text-forward playbook |
| 30-Day Quick Start Checklist | Core + Pro | Branded PDF | 1 page | Checklist / rollout plan |
| Content Starter Pack | Pro only | Branded PDF | 2 pages | Practical copy starter asset |

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

## 1. Brand Brief

### Purpose

Provide the customer with a concise strategic snapshot of who they are, who they serve, and how they should position the brand.

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

### Purpose

Give the customer a practical, visually legible guide to the brand’s visual direction so they can make consistent design choices.

### Format

- File type: branded PDF
- Target length: 2 pages
- Style: visual-first with short supporting text

### Table of Contents

1. Palette overview
2. Visual direction summary
3. Typography (recommended pairings or customer-stated primary)
4. Style principles
5. Do / avoid guidance
6. Practical usage notes

### Page Plan

#### Page 1
- Palette overview
- Visual direction summary
- Typography recommendations

#### Page 2
- Style principles
- Do / avoid guidance
- Practical usage notes

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

### Core vs Pro

- **Core**
  - based mainly on selected palette and style system
  - broad visual guidance; narrator-conditioned "where to apply first" suggestions
- **Pro**
  - more tailored interpretation of notes/references
  - stronger aesthetic framing and more nuanced style principles
  - narrator-conditioned channel priority (e.g. Etsy shop + Instagram for makers; GMB + storefront for local teams)

## 3. Voice & Content Playbook

### Purpose

Define how the brand should sound and give usable writing direction for future content and customer-facing copy.

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

### Purpose

Turn the brand kit into immediate action so the customer knows what to implement first.

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

### Why it is Pro-only

- It depends on synthesizing multiple signals, not just formatting answers into a document.
- It is most valuable when audience, story, tone, and differentiation are all strong enough to produce distinct content.
- It creates directly reusable content assets, which is a clear premium value unlock.

## Input-to-Asset Mapping

| Step / field | Main assets informed |
|---|---|
| Step 1: Business Snapshot (`businessName`, `offer`, `transformation`, `industry`, `stage`) | Brand Brief, Quick Start, Content Starter Pack |
| Step 1: `brandNarrator` | Brand Brief (emphasis + anchor sentence), Voice Playbook (messaging themes + email templates), Style Guide (practical usage notes), Quick Start (channel priority), Content Starter Pack (all sections) |
| Step 2: Your Buyer | Brand Brief, Voice Playbook, Content Starter Pack |
| Step 3: Brand Personality | Voice Playbook, Content Starter Pack |
| Step 4: Core Values | Brand Brief, Voice Playbook |
| Step 5: Brand Story | Brand Brief, Content Starter Pack |
| Step 6: Visual Direction (`existingTypeface` Pro-only) | Style Guide (palette, visual direction, typography) |
| Step 7: Stand Out | Brand Brief, Quick Start, Content Starter Pack |

## Open Production Decisions

- Final PDF page templates / layouts per asset
- Exact font system and visual component library for PDFs
- ~~Whether Pro gets 1 or multiple one-liner options~~ **Resolved: 3 options** — gives customers real choice for different contexts without overwhelming. All three drawn from same inputs; vary in emphasis (transformation-led, audience-led, differentiator-led).
- ~~Whether Content Starter Pack should include platform-specific variants later~~ **Resolved: 2 pages fixed + Pro Page 3 for email templates** — Page 3 is Pro-only; Core receives a 2-page CSP that stops before email templates. Platform-specific variants deferred to a potential future add-on.
- ~~Whether the Voice Playbook should include before/after rewrites in Pro~~ **Resolved: yes** — 2–3 paired examples on Page 3 alongside email templates. Mode: ai_only (Pro). Best plain-language teaching tool for a non-marketer: concrete, fast to read, immediately applicable.
