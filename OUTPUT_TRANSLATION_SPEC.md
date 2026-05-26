# Identity Kit Output Translation Spec (Hybrid Model)

This spec defines how intake inputs are translated into final deliverable sections for Core and Pro tiers.

The generation approach is intentionally **hybrid**:

- deterministic baseline sections for consistency
- AI-enhanced sections where personalization adds measurable value
- Pro-only AI sections for premium, applied content outputs

It is the implementation companion to:

- `DELIVERABLE_PRODUCTION_SPEC.md` (asset structure and page plans)
- `PRODUCT.md` (product scope, DoD, metrics, open research)
- `SCREEN_COPY_MAP.md` (UI copy and input intent)
- [`docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md`](docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md) (deterministic narrator × GTM edge cases, **platform inference**, and staged next steps)
- [`docs/research/BUSINESS_OPERATING_MODEL_RESEARCH.md`](docs/research/BUSINESS_OPERATING_MODEL_RESEARCH.md) (Step 1 **how we operate** — enum + Path C migration; research background)

---

## 1) Translation Pipeline Overview

1. **Collect + validate input payload**
   - Source: canonical `IdentityKitForm`
   - Enforce required fields and Pro-only quality gates
2. **Normalize inputs**
   - trim whitespace
   - collapse repeated spaces
   - map enum IDs to display labels
   - snap voice slider values to canonical grid (0/25/50/75/100)
3. **Build section context objects**
   - one context object per deliverable section
4. **Generate section drafts**
   - Core: deterministic templates and rule-based phrasing
   - Pro: prompt-based generation with constraints
5. **Run output QA checks**
   - length bounds
   - style/tone constraints
   - prohibited language checks
6. **Assemble final editable outputs**
   - store by section/document
   - render into branded PDFs

---

## 1.0.1) Writing rules (project-wide, reader-facing copy)

The following constraints apply to **every reader-facing string** the deterministic and AI paths emit, and are enforced by the `'reader-visible guide strings contain no banned vocabulary'` walker in `core-pdfs.test.ts`. They are intentionally narrower than a full style guide; they encode the lessons we have already learned about copy that reads as machine-generated.

1. **At most one em-dash per paragraph.** A "paragraph" here is the smallest reading unit: a blank-line block, a single line in a bullet list, or a single sentence inside a multi-sentence string. The walker splits on `/\n+|(?<=[.!?])\s+(?=[A-Z"'])/` and counts `—` per segment. Stacking two or more em-dashes in the same unit reads as AI-generated copy. Prefer two sentences, a semicolon, or a colon over a dashed clause when the temptation is to reach for a second `—`.
2. **No retired role taxonomy in 02a copy.** The capitalized role nouns *Primary / Supporting / Accent / Canvas* are banned on every reader-visible 02a string. The lowercase "accent" leftover was also retired in the v3 sweep (it was the last surviving piece of role-jargon on that page).
3. **No banned channel-instruction vocabulary** (e.g. *touchpoint*, *first surface*, *rollout*, *handoff*, *deliverable*, *rubric*). See the `bannedPatterns` list in `core-pdfs.test.ts`.
4. **Folio 02b rail micro-style rules (additive).** The 02b left rail must read as plain editorial guidance: paragraph 1 starts in reader language (e.g. *\"This set of fonts...\"*) and explains **why** the chosen faces/roles fit; paragraph 2 frames wordmark examples as **approved options** with a preferred default (highest contrast) and context-dependent alternates. Avoid clinical/mechanical phrasing in rail copy (*type system* as opener, *logo lockup*, *tiles*, *slots*, *variant*). Download rows use CTA text **\"Download on Google Fonts\"** and no helper mini-header label.

When you add new deterministic copy or wire a new AI prompt, add the new field to the walker's `readerFacing` array so the rules apply to it automatically.

## 1.1) Generation Modes

Each section must declare one mode:

- `deterministic`
  - template/rule generated
  - no model call required
- `ai_enhanced`
  - deterministic scaffold first
  - model refines specificity and voice under strict constraints
- `ai_only`
  - model-generated section with no deterministic equivalent
  - used for Pro-only assets (for now: Content Starter Pack)

## 1.2) Section Mode Matrix

The `Section ID` column is the canonical key the AI prompt registry ([`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.11), per-PDF assemblers ([`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md)), and walker telemetry ([`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §9) reference. Locking it now prevents drift later.

| Document | Section | Section ID | Core mode | Pro mode |
|---|---|---|---|---|
| Brand Brief | Brand overview | `brief.overview` | deterministic | deterministic |
| Brand Brief | Ideal customer | `brief.idealCustomer` | deterministic | ai_enhanced |
| Brand Brief | Core transformation/promise | `brief.transformation` | deterministic | ai_enhanced |
| Brand Brief | Values/positioning cues | `brief.values` | deterministic | ai_enhanced |
| Brand Brief | Brand story angle | `brief.story` | deterministic | ai_enhanced |
| Brand Brief | Differentiation snapshot | `brief.differentiation` | deterministic | ai_enhanced |
| Brand Style Guide | Palette overview | `styleGuide.paletteOverview` | deterministic | deterministic |
| Brand Style Guide | Visual direction summary | `styleGuide.visualDirection` | deterministic | ai_enhanced |
| Brand Style Guide | Style principles | `styleGuide.stylePrinciples` | deterministic | ai_enhanced |
| Brand Style Guide | Do/avoid guidance | `styleGuide.doAvoid` | deterministic | deterministic |
| Voice & Content Playbook | Tone profile | `voice.toneProfile` | deterministic | deterministic |
| Voice & Content Playbook | Voice guardrails | `voice.guardrails` | deterministic | ai_enhanced |
| Voice & Content Playbook | Messaging themes | `voice.messagingThemes` | deterministic | ai_enhanced |
| Voice & Content Playbook | Sample phrases/language cues | `voice.samplePhrases` | deterministic | ai_enhanced |
| Voice & Content Playbook | Calls to action (CTAs) | `voice.ctas` | deterministic | ai_enhanced |
| Voice & Content Playbook | Writing do/avoid guidance | `voice.writingDoAvoid` | deterministic | ai_enhanced |
| Voice & Content Playbook | Before/after examples | `voice.beforeAfter` | deterministic | ai_enhanced |
| 30-Day Quick Start Checklist | Week-by-week checklist | `quickStart.weekByWeek` | deterministic | ai_enhanced (prioritization/order) |
| Content Starter Pack (Pro) | One-liner | `csp.oneLiner` | n/a | ai_only |
| Content Starter Pack (Pro) | Elevator pitch | `csp.elevator` | n/a | ai_only |
| Content Starter Pack (Pro) | Paragraph blurb | `csp.paragraph` | n/a | ai_only |
| Content Starter Pack (Pro) | Bio (short) | `csp.bioShort` | n/a | ai_only |
| Content Starter Pack (Pro) | Bio (long) | `csp.bioLong` | n/a | ai_only |
| Content Starter Pack (Pro) | Caption starters | `csp.captionStarters` | n/a | ai_only |
| Content Starter Pack (Pro) | Content pillars | `csp.contentPillars` | n/a | ai_only |
| Content Starter Pack (Pro) | CTAs (per surface) | `csp.ctas` | n/a | ai_only |
| Brand Identity Guide | Folio 01 — Brand overview | `guide.brand` | deterministic | ai_enhanced |
| Brand Identity Guide | Folio 02a — Palette | `guide.palette` | deterministic | deterministic |
| Brand Identity Guide | Folio 02b — Typography / visual | `guide.visual` | deterministic | ai_enhanced |
| Brand Identity Guide | Folio 03 — Personality | `guide.personality` | deterministic | ai_enhanced |
| Brand Identity Guide | Folio 04 — Voice | `guide.voice` | deterministic | ai_enhanced |
| Brand Identity Guide | Folio 05 — CTAs | `guide.ctas` | deterministic | deterministic |
| Brand Identity Guide | Folio 06 — Quick Start references | `guide.quickStartRefs` | deterministic | deterministic |
| Voice & Content Playbook (Pro page 3) | Email template — welcome | `voice.email.welcome` | n/a | ai_only |
| Voice & Content Playbook (Pro page 3) | Email template — follow-up | `voice.email.followUp` | n/a | ai_only |
| Voice & Content Playbook (Pro page 3) | Before/after rewrites | `voice.beforeAfter.pro` | n/a | ai_only |
| Voice & Content Playbook (Pro page 3) | CTA variations (per surface) | `voice.ctaVariations` | n/a | ai_only |
| Brand Strategy Memo | §1 Archetype | `strategyMemo.archetype` | n/a | ai_only |
| Brand Strategy Memo | §2 Jobs-to-be-Done | `strategyMemo.jtbd` | n/a | ai_only |
| Brand Strategy Memo | §3 Behavioral audience | `strategyMemo.behavioralAudience` | n/a | ai_only |
| Brand Strategy Memo | §4 Tensions | `strategyMemo.tensions` | n/a | ai_only |
| Brand Strategy Memo | §5 Contrarian angle | `strategyMemo.contrarianAngle` | n/a | ai_only |
| Brand Strategy Memo | §6 Messaging hierarchy | `strategyMemo.messagingHierarchy` | n/a | ai_only |
| Brand Strategy Memo | §7 90-day roadmap | `strategyMemo.roadmap` | n/a | ai_only |
| Brand Strategy Memo | §8 Conditional brand narrative | `strategyMemo.narrative` | n/a | ai_only (conditional skip) |
| Brand Audit | §1 What we saw (multimodal) | `brandAudit.whatWeSaw` | n/a | ai_only (vision) |
| Brand Audit | §2 Where it's serving you | `brandAudit.whereServing` | n/a | ai_only |
| Brand Audit | §3 Where there's tension | `brandAudit.whereTension` | n/a | ai_only |
| Brand Audit | §4 Recommendations | `brandAudit.recommendations` | n/a | ai_only |
| Brand Style Guide (Pro pages 3–4 — Visual Reference Spread) | Image grid (selection) | `moodboard.ranker` | n/a | ai_only (Pro-only, selection, not prose) |
| Brand Style Guide (Pro pages 3–4 — Visual Reference Spread) | Caption | `moodboard.caption` | n/a | ai_only (Pro-only) |
| Brand Style Guide (Pro pages 3–4 — Visual Reference Spread) | Palette call-outs | `moodboard.paletteCallouts` | n/a | deterministic (Pro-only render gate) |

Section IDs are stable keys for the prompt registry ([`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.11), per-PDF assemblers ([`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md)), and walker telemetry ([`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §9). Do not rename Section IDs once shipped — add a `v2` suffix instead.

---

## 2) Canonical Input Contract (Current)

From `IdentityKitForm` (full data model, all tiers):

- **Schema:** `intakeSchemaVersion` (integer; omitted or `1` = legacy implicit baseline; **`2`** = operating-model ship; **`3`** = current — includes explicit `guideFocus` after one-time migration). Consumers run `migrateIdentityKitForm` from `@identity-kit/shared` once on read so older JSON gains `step1.businessOperatingModel` and `step1.guideFocus` without perpetual dual inference paths (Path C). Idempotent when `>= 3`.
- Step 1: `businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`, **`businessOperatingModel`** (`customer_visits_us` \| `we_travel_to_customers` \| `online_only` \| `hybrid` \| `mostly_events_or_markets`), `touchpoints`, `primaryGoal`, **`guideFocus`** (`look_more_professional` \| `sound_more_consistent` \| `give_clear_direction` \| `know_what_to_fix_first`)
- Step 2: `customerArchetype`, `painPoints`, `desiredOutcomes`
- Step 3: `tonePreset`, `voiceSliders`, `customVoiceNotes`
- Step 4: `values`, `missionStatement`
- Step 5: `originArchetype`, `originSummary`, `motivation`
- Step 6: `selectedPalette`, `selectedStyle`, `existingTypeface`, `colorMoodNotes`, `styleNotes`, `referenceUploadName`
- Step 7: `competitors`, `differentiation`

Validation assumptions (already in flow):

- Step 1 required fields include transformation selections plus touchpoint alignment (`touchpoints`, max 4, ordered)
- Step 2 Pro requires at least one: `painPoints` or `desiredOutcomes`
- Step 3 requires `tonePreset`
- Step 7 Pro requires `differentiation`

### 2.1 Live Core survey-visible contract (source of truth)

Current Core-visible fields in the live survey UI:

- Step 1: `businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`, `businessOperatingModel` (required on `c1_s2`), `touchpoints` (ordered multi-select, max 4), `primaryGoal`, `guideFocus` (required on `c1_s4`)
- Step 2: `customerArchetype`
- Step 3: `tonePreset`, `voiceSliders`
- Step 4: `values`
- Step 5: `originArchetype`
- Step 6: `selectedPalette`, `selectedStyle`
- Step 7: `competitors` (optional)

### 2.2 Pro-only additions in survey UI

The full Pro intake superset, locked for Pro-A implementation. The first batch overlaps with current §2.2 entries; the second batch is new for Pro; the deprecation list calls out fields the Pro-C audit pass removes or renames so downstream code does not keep reading them.

- **Step 1:** `businessDescription` (free text, soft-required for Pro, 300–800 chars recommended) — deep narrative input the AI uses as primary ground for Strategy Memo + Brief rewrites.
- **Step 2:** `painPoints`, `desiredOutcomes`.
- **Step 3:** `customVoiceNotes`; `voiceSamples[]` (array of free-text snippets, 1–5 entries, ~50–200 chars each) — actual phrasing samples the AI uses to match register.
- **Step 4:** `missionStatement`.
- **Step 5:** `originSummary`.
- **Step 6:** `existingTypeface` (optional); `moodAdjectives[]` (multi-select from controlled vocabulary — see §5.8); `visualNotes` (merged from prior `colorMoodNotes` + `styleNotes`).
- **Step 6 existing-brand track (gated by `hasExistingBrand: boolean`):** `existingBrand.logoRef`, `existingBrand.referenceImageRef`, `existingBrand.hexColors[]` (1–6 hex strings, optional manual entry), `existingBrand.url` (text context v1, scrape v1.5), `existingBrand.logoExtractedColors[]` (color-thief from logo upload; treated as authoritative — auto-fills `hexColors` when no manual entry), `existingBrand.referenceExtractedColors[]` (color-thief from reference image; surfaced as additive suggestions only, never auto-fills).
- **Step 7:** `differentiation`.
- **Deprecated (drop in Pro-C audit pass):** `motivation` (redundant with `originSummary`); `colorMoodNotes` + `styleNotes` (merged into `visualNotes`); `referenceUploadName` (superseded by `existingBrand.referenceImageRef`).

The Core baseline policy in §2.2a still holds: no Core section may require any of these fields to render meaningful copy. Pro additions are enrichments that improve specificity, never structural dependencies for Core. The existing-brand track is the one exception — sections that depend on it (Brand Audit PDF, palette acknowledgement copy) ship conditionally and the kit assembles without them when `hasExistingBrand` is false.

### 2.2a Core baseline policy (normative)

The Brand Identity Kit is implemented as a **Core-first deterministic base**. Pro is an optional enhancement layer added later.

- **Core deterministic outputs must be complete and usable using only §2.1 fields.**
- **No Core section may require §2.2 (Pro-only) fields to render meaningful copy.**
- Pro-only fields may improve specificity when present, but must be treated as optional enrichments.
- When Pro-only fields are missing, deterministic composers must use Core-safe defaults or route to a Core-safe fallback (for example, `storyNote` omission with `oneLine` fallback on folio 03).
- Any section contract that references Pro-only fields must explicitly label them as optional and include a Core-safe fallback path.

### 2.3 First-class channel alignment (v1 contract)

To reduce narrator-only channel assumptions, Step 1 uses one structured field backed by the shared registry in `packages/shared/src/touchpoints.ts`:

- `step1.touchpoints: TouchpointId[]`

#### v1 enum (stable IDs, shared canonical)

- Social: `instagram`, `tiktok`, `linkedin`, `facebook`, `youtube`, `pinterest`, `threads`
- Online directory: `google_business`, `apple_maps`, `bing_places`, `yelp`, `nextdoor`, `tripadvisor`
- Marketplace: `marketplace_storefront`, `amazon_storefront`, `ebay_storefront`, `walmart_marketplace`, `faire_wholesale`, `depop_store`, `poshmark_store`, `shopify_marketplace`
- Owned channel: `website`, `email_newsletter`, `blog`

#### Normalization rule (before generation)

All touchpoint inputs are normalized through shared helpers:

1. Resolve legacy aliases to canonical IDs (`resolveTouchpointId`).
2. Drop unknown IDs.
3. De-duplicate while preserving click/order priority.
4. Truncate to top 4 entries.

#### Resolution rule (deterministic precedence)

When generation needs channel-specific guidance, resolve a channel plan in this order:

1. Use `step1.touchpoints[0]` as the Week 1 anchor and "apply first" touchpoint.
2. Use remaining ordered entries in `step1.touchpoints[]` as user-owned secondary channels.
3. Fill any missing secondary channels from `narratorProfile.primary_channels`.

If no valid touchpoints remain after normalization, fall back fully to narrator defaults.

#### Touchpoint cluster refinement (Week 3 / typography)

The **base** `touchpointCluster` in `packages/generation/src/deterministic/brandProfile.ts` prefers **`step1.businessOperatingModel`** when set (v2+ completed intake). If it is empty (e.g. unmigrated partial object in a test), generation falls back to legacy **`brandNarrator` + `industry`** routing for the same base cluster.

After the base cluster:

- If the base cluster is `social_service` and the user’s **first normalized touchpoint** belongs to the **`marketplace`** bucket, set the cluster to **`social_product`** so Week 3 and typography framing match shop-first selling.
- Do **not** apply this promotion when the base cluster is `physical_first` or `local_community`.

#### Scope for v1 wiring

Apply resolved channel plan to:

- Quick Start Week 1 anchor sentence
- Quick Start Week 2–4 channel references (Week 2 branches email vs profile surfaces on `email_newsletter`; Week 3 keeps `touchpointCluster` for checklist *shape* but names channels from the resolved plan; Week 4 lists `channelPlan.all`; week intros name `primaryChannel` where helpful)
- Style Guide "where to apply this first" and channel-named usage notes; **Typography** section leads and `professional_and_digital` specimen blurbs substitute the user’s primary channel label for template “LinkedIn” wording
- Voice Playbook **Calls to action (CTAs)** (primary channel + goal-aligned CTA patterns; body defines CTA in plain terms)

Do not change section generation modes for this; this is an input-contract and deterministic-routing improvement.

### 2.4 Platform inference (recommended vs user-selected surfaces)

**Principle:** `step1.touchpoints` is the user’s **stated priority list** (max four, ordered). It is **not** a hard ceiling on every line of GTM guidance. When **narrator + primary goal + industry** imply surfaces the user omitted, Core copy may still **recommend** those surfaces using explicit **advisory** language (claim, set up, add, verify) so the reader does not mistake the kit for asserting they already operate there.

**Local / directory:** For `brandNarrator: local_team` (and any future “local business” routing), treat **major online directories** (especially **Google Business Profile** and peers in the `online_directory` bucket in `touchpoints.ts`) as **should-have** discovery surfaces. It is acceptable—and often desirable—for Week 2–4 checklist lines to **name** a directory the user did not select, **provided** the sentence reads as **recommendation** (“Claim or complete your Google Business profile…”) rather than **assumed active use** (“Update your Google Business cover photo…”) when that ID is absent from normalized touchpoints. See fixture notes in [NARRATOR_ROUTING_PHASE2_RESEARCH.md](docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md) §3.

**Goal vs thin channels (non-local analogy):** The same inference pattern applies elsewhere: e.g. **`direct_sales`** with **only** `email_newsletter` in touchpoints does not prove list scale; copy and prioritization should not behave as if email alone is a complete revenue engine without other signals. (Long-term relief: structured **primary revenue / checkout** field—see that doc §4.)

**Facebook / secondary social (Quick Start Week 3, `local_community`):** Cover-image and feed-audit bullets name **only** surfaces the user selected in Step 1 among **`social`** and **`owned_channel`** buckets (labels in click order). Narrator default channels (e.g. Facebook from `narratorProfile.primary_channels`) are **not** injected into those lines when the user did not select them. If the user selected fewer than two such surfaces, copy collapses to **one named profile** or **generic “channels you use”** wording instead of inventing a second platform.

**Wizard / Step 1 (optional microcopy):** Short helper text can clarify that touchpoints = “where you focus first,” not “the only places we will ever mention,” to reduce surprise when directories appear in the Quick Start.

**Implementation:** Week 3 `local_community` and Week 1 `local_team` lines in [`packages/generation/src/deterministic/coreAssembly.ts`](packages/generation/src/deterministic/coreAssembly.ts) follow this subsection; further narrator edge cases stay tracked in [NARRATOR_ROUTING_PHASE2_RESEARCH.md](docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md).

---

## 3) Section Mapping Matrix

| Document | Section | Primary inputs | Secondary inputs |
|---|---|---|---|
| Brand Brief | Brand anchor sentence | S1 businessName + transformation selection builder (`beforeId`, `afterId`, `mechanismId` + optional `Other`), S2 `customerArchetype` (controlled id → display title via `resolveBuyerArchetypeTitle` in `packages/shared/src/buyerArchetypes.ts`), S3 tonePreset | S1 brandNarrator |
| Brand Brief | Brand overview | S1 businessName, offer selection builder (`offerId`, `audienceId`, optional `deliveryId` + optional `Other`), industry, stage | S4 values |
| Brand Brief | Ideal customer | S2 `customerArchetype` (same id → title resolution as Brand anchor); + S2 painPoints/desiredOutcomes (**Pro-only**) | S1 industry |
| Brand Brief | Core transformation/promise | S1 transformation builder, S1 offer builder | S2 desiredOutcomes (**Pro-only**) |
| Brand Brief | Values/positioning cues | S4 values | S4 missionStatement (**Pro-only**), S3 tonePreset |
| Brand Brief | Brand story angle | S5 originArchetype | S5 originSummary/motivation (**Pro-only**), S1 stage, S1 brandNarrator |
| Brand Brief | Differentiation snapshot | S7 competitors (**Core**) | S7 differentiation (**Pro-only**), S2 painPoints (**Pro-only**) |
| Style Guide | Palette overview | S6 selectedPalette | S6 colorMoodNotes (**Pro-only**) |
| Style Guide | Visual direction summary | S6 selectedStyle | S6 styleNotes (**Pro-only**), S4 values; S6 `existingTypeface` (**Pro-only** when set) |
| Style Guide | Practical usage notes | S6 selectedStyle + selectedPalette | S6 notes (**Pro-only**), S1 brandNarrator, S1 industry |
| Style Guide | Do/avoid guidance | S6 selectedStyle + selectedPalette | S6 notes (**Pro-only**), S3 tone |
| Voice Playbook | Tone profile | S3 tonePreset, voiceSliders | S3 customVoiceNotes (**Pro-only**) |
| Voice Playbook | Voice guardrails | S3 + S4 values | S2 audience |
| Voice Playbook | Messaging themes | S1 transformation builder, S1 industry, S2 audience | S7 differentiation (**Pro-only**), S1 brandNarrator |
| Voice Playbook | Sample phrases/language cues | S1 brandNarrator, S1 industry, S3 tone | S1 transformation builder, S2 audience |
| Voice Playbook | Calls to action (CTAs) | S1 `primaryGoal`, S1 `touchpoints` (normalized; primary channel from first entry) | Core deterministic body does **not** branch on `brandNarrator`; narrator shapes other Voice blocks (themes, sample phrases) |
| Voice Playbook | Writing do/avoid guidance | S3 + S4 values | S2 audience, S1 brandNarrator |
| Voice Playbook | Before/after examples | S1 transformation builder, S3 tone, S1 touchpoint context (`touchpoints`, `businessOperatingModel`), S1 `primaryGoal` | S1 brandNarrator, S1 industry, S1 offer builder / audience label, S4 values (light deterministic shaping), deterministic `touchpointCluster` routing |
| Voice Playbook | Email voice application (Pro) | S3 voice, S1 brandNarrator | S2 audience |
| Quick Start | Week-by-week checklist | S1 `touchpoints` (ordered) + `primaryGoal` + `brandNarrator` + industry/stage; `touchpointCluster` for Week 3 checklist *family*; `resolveChannelPlan` for channel names in weeks 2–4 | Tier, S1 brandNarrator |
| Content Starter Pack (Pro) | One-liner + summary | S1 transformation builder, S2 outcomes, S7 differentiation | S3 tone |
| Content Starter Pack (Pro) | Homepage directions | S1 offer builder + transformation builder, S2 audience | S4 values |
| Content Starter Pack (Pro) | Social/caption/CTA set | S2, S3, S7 | S5 story, S1 brandNarrator |
| Content Starter Pack (Pro) | Content pillar prompts | S1 brandNarrator, S1 industry | S1 transformation builder |
| Content Starter Pack (Pro) | CTA suggestions | S1 brandNarrator, S3 tonePreset | S1 industry |

### 3.0 Themes vs CTAs (Voice Playbook)

- **Messaging themes** are recurring **topics and angles** (content pillars). They are assembled deterministically from narrator profile (`tone_of_voice_themes`), transformation story, and industry preferred/avoid vocabulary. They are **not** a substitute for the Tone profile or Voice guardrails (those define *how* you sound).
- **Calls to action (CTAs)** are the **goal-aligned ask**: what one thing you want the reader to do next, driven by `step1.primaryGoal` and the **primary channel** resolved from normalized `step1.touchpoints` (first entry; see §2.3). Core output spells out “call to action” in plain language before using the acronym. CTAs are **not** a duplicate of messaging themes — themes answer “what we keep saying”; CTAs answer “what we ask for at the end of a short piece or high-intent surface.”
- **Sample phrases** are **voice illustrations** (openers, proof, rhythm, sometimes a close). They support both themes and tone but **must not** be read as “every line is your last line.” Pair **last-line / button-style** copy with the **Calls to action (CTAs)** section (Core); Pro’s Content Starter Pack adds richer per-channel CTA libraries without redefining themes.
- **Deterministic precedence:** When Core PDF assembly runs, themes → sample phrases → CTAs follow in that order; each section has a distinct job so content does not repeat Tone profile bullets as “themes.”

### 3.1 Core implementation reality check (current code)

Status labels:
- **Strong** = directly shapes deterministic section output or structured PDF rendering.
- **Light** = included but mostly as appended context.
- **Unused** = captured in intake but not translated into Core PDF output yet.

| Field | Current Core use status | Notes |
|---|---|---|
| `step1.businessName` | Strong | Used across all documents (headings, anchors, specimen text). |
| `step1.offer.offerId` | Strong | Required controlled offer selection; resolves to normalized offer copy in deterministic assembly. |
| `step1.offer.offerOther` | Light / conditional | Used only when `offerId = other`; constrained fallback for uncovered industries or niche offers. |
| `step1.offer.audienceId` | Strong | Required audience selection that sharpens the offer line and Step 1 preview sentence. |
| `step1.offer.audienceOther` | Light / conditional | Used only when `audienceId = other`. |
| `step1.offer.deliveryId` | Strong | Optional delivery selection; appended when present and omitted cleanly when blank. |
| `step1.offer.deliveryOther` | Light / conditional | Used only when `deliveryId = other`. |
| `step1.transformation.beforeId` | Strong | Required controlled starting-state selection for anchor, transformation, and messaging themes. |
| `step1.transformation.beforeOther` | Light / conditional | Used only when `beforeId = other`. |
| `step1.transformation.afterId` | Strong | Required controlled result selection for anchor, transformation, and messaging themes. |
| `step1.transformation.afterOther` | Light / conditional | Used only when `afterId = other`. |
| `step1.transformation.mechanismId` | Strong | Required controlled mechanism selection that completes the deterministic transformation sentence. |
| `step1.transformation.mechanismOther` | Light / conditional | Used only when `mechanismId = other`. |
| `step1.industry` | Strong | Industry profiles/labels and guardrail vocabulary. |
| `step1.stage` | Strong | Stage context and rollout/do-avoid framing. |
| `step1.brandNarrator` | Strong | Narrator profiles drive emphasis/order and channel guidance. |
| `step2.customerArchetype` | Strong | Core audience definition in Brand Brief and voice context. |
| `step2.painPoints` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step2.desiredOutcomes` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step3.tonePreset` | Strong | Tone profile and style/voice bridge logic. |
| `step3.voiceSliders` | Strong | Deterministic tone wording via slider buckets. |
| `step3.customVoiceNotes` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step4.values` | Strong | Values sections and voice guardrail ordering. |
| `step4.missionStatement` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step5.originArchetype` | Strong | Story framing and trust-signal selection. |
| `step5.originSummary` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step5.motivation` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step6.selectedPalette` | Strong | Palette block + PDF accent/chrome color usage. |
| `step6.selectedStyle` | Strong (multi-surface) | Drives a wide set of Core deterministic surfaces and is required ground for every Pro AI prompt. **Concretely consumed by:** (1) typography recipe selection in `typographyRecipes.getRecipeForProfile()` together with `tonePreset` + `stage` + `brandNarrator`; (2) wordmark-rail template choice in `typographyWordmarkRail.railTemplatesForStyle()`; (3) the brand-identity-guide color-summary `systemCharacter` adjective in `colorSummary.composeColorSummary()` (`COLOR_SUMMARY_STYLE_ADJECTIVES`); (4) the same composer's `usageDiscipline` cell in the 3-tone × 4-style `COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE` matrix; (5) Style Guide style-principles bullets in `coreAssembly.stylePrinciplesBody()`; (6) Style Guide do/avoid lists in `coreAssembly.styleDoAvoidBody()`; (7) Style Guide imagery direction body in `phase8Content.styleGuideImageryDirectionBody()`; (8) Style Guide visual-direction voice bridge sentence in `voiceVisualBridge.styleGuideVisualVoiceBridge()`; (9) Voice Playbook tone-profile closing sentence in `voiceVisualBridge.voicePlaybookToneVisualClosing()`; (10) typography section lead in `coreAssembly.typographySectionLead()` and `composeTypographyMatrixIntro()`; (11) narrator usage notes in `coreAssembly.narratorUsageNotes()`. **Pro additions when implemented:** moodboard tag matcher input (`style register` axis, [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §7.3.4) — drives selection inside the Pro Visual Reference Spread on Style Guide pages 3–4 (see [`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md) §2); required field in the Pro AI `visual_context` block (§5.9 Style influence boundary; every Pro task prompt receives it). **Boundary:** does *not* drive PDF template layout (page chrome, grid structure, type scale system); v1 templates are style-agnostic at the layout level — see §5.9. |
| `step6.existingTypeface` | Pro-only (intake) | When set on **Pro** kits only: alternate typography lead/footer, specimen “existing font” note, and suppressed wordmark note; ignored for Core tier PDFs even if legacy JSON contains a value (Core uses the same matrix lead + specimens as when the field is empty). |
| `step6.colorMoodNotes` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step6.styleNotes` | Pro-only | Not Core-visible in current survey; consumed when present in Pro data. |
| `step6.referenceUploadName` | Pro-only / currently unused in deterministic copy | Captured in Pro survey; not consumed by deterministic section assembly yet. |
| `step7.competitors` | Strong | Differentiation context; rendered as structured "COMPARED WITH" pills. |
| `step7.differentiation` | Pro-only | Not Core-visible in current survey; primary differentiator statement when present. |

### 3.2 Style Guide visual representation component (scoped roadmap)

Scope decision: do **not** restyle entire PDFs by palette/style preset.  
Instead, add one reusable visual component section inside the **Brand Style Guide** that renders the selected palette + style direction as a deterministic block.

Implementation intent:
- Keep component config-driven by Step 6 preset IDs (`selectedPalette`, `selectedStyle`).
- Extend by adding new config variants as palette/style options grow.
- Treat as additive to existing Style Guide structure; do not rewrite all templates.

### 3.3 Path Class Catalog (Core deterministic review set)

**Maintenance contract:** `PRODUCT.md`, `PHASE_ROADMAP.md`, `PDF_GENERATION.md`, `DELIVERABLE_PRODUCTION_SPEC.md`, `docs/README.md`, `docs/DETERMINISTIC_CUSTOMIZATION_MODEL.md`, `docs/audits/CORE_PATH_CUSTOMIZATION_AUDIT.md`, and `docs/audits/CORE_INPUT_REDESIGN_ANALYSIS.md` point here as the **to-do** when Core path behavior changes. Update **§3.3** (table + matrix) and **§3.3.1** (prescriptive recipes), then extend `packages/generation/src/core-pdfs.test.ts`.

Use this catalog as the canonical review set for deterministic customization.  
Each class names a stable intake path shape that should produce predictable section behavior across Brand Brief, Style Guide, Voice Playbook, and Quick Start.

| Path class ID | Intake shape (primary signals) | Expected routing emphasis | Current guardrail tests (`packages/generation/src/core-pdfs.test.ts`) |
|---|---|---|---|
| `PC-01-service-baseline` | `solo_expert` + service-leaning industry + non-storefront default touchpoints | Service-first language; Before/after labels favor service intro + profile/bio contexts | `baseline B2B consultant path still reads like a service brand after storefront-oriented fixes`; `core-sample Before / after keeps two distinct scenario starts` |
| `PC-02-storefront-coffee` | `solo_maker` + `food_beverage` + local/discovery surfaces | Storefront/B2C phrasing; Before/after labels favor social/discovery + visit/listing conversion | `coffee-founder Brand anchor reads like a storefront brand, not a strategy deck`; `coffee-founder Before / after avoids consultative movement phrasing and forced closers`; `Voice Playbook Before / after uses industry vocabulary for coffee founder` |
| `PC-03-local-directory-missing` | `local_team` + local intent without selected directory touchpoint | Advisory (not assumptive) directory copy; no invented secondary social channels | `Quick Start Week 3 local_team without directory uses advisory directory copy and only user-selected profile surfaces`; `Quick Start Week 1 local_team softens hours line when no directory touchpoint` |
| `PC-04-local-directory-present` | `local_team` + selected directory touchpoint | Imperative optimization copy allowed for directory profile lines | `Quick Start Week 3 local_team with directory touchpoint keeps imperative directory cover line`; `Quick Start Week 1 local_team keeps hours line when directory touchpoint selected` |
| `PC-05-regulated-legal` | `legal_professional_services` + compliance-sensitive voice | Compliance guardrail line appears early; before/after remains safe and avoids risky claims | `Voice guardrails prioritize industry compliance line for legal_professional_services`; `Voice Playbook Before / after stays compliance-safe for legal services` |
| `PC-06-mixed-commerce-service-edge` | `solo_expert` + marketplace/social touchpoints + `direct_sales` (documented contradiction path) | Deterministic mixed-mode behavior; known edge-case language retained and tracked, not silently “fixed” | `instagram-first shop-second solo expert still shows the documented mixed commerce/service edge case` |
| `PC-07-physical-first-ops` | Physical operating model (`customer_visits_us` or travel-to-customer) + narrator/industry combo mapping to `physical_first` | Week 3 checklist family and typography guidance reflect physical+digital context | `touchpointClusterFromForm maps food_beverage + solo_maker to physical_first`; `touchpointClusterFromForm maps construction_trades + solo_expert to physical_first`; `Typography uses physical+digital lead for food_beverage + solo_maker (physical_first cluster)` |
| `PC-08-social-product-promotion` | Base `social_service` profile with marketplace-first touchpoint that promotes to `social_product` | Voice/Quick Start scenario selection reflects commerce-skewed social path | `touchpointClusterFromForm promotes social_service to social_product when primary touchpoint is marketplace (solo_expert)`; `touchpointClusterFromForm keeps physical_first when base is physical even with marketplace primary` |
| `PC-09-tone-style-matrix` | Any path varying `tonePreset` + `selectedStyle` | Tone-to-visual bridge and closing lines remain deterministic for all combinations | `voiceVisualBridge matrices cover all tone × style pairs`; `Tone profile avoids em-dash-heavy template phrasing`; `Tone profile appends industry tone modifier after visual bridge` |
| `PC-10-existing-typeface-tier-gate` | `existingTypeface` present with Core vs Pro tier split | Pro honors existing typeface continuity copy; Core ignores field for deterministic continuity | `Style Guide Typography honors existingTypeface when provided (Pro tier only)`; `Core tier ignores existingTypeface for continuity copy and keeps specimen wordmark note when applicable` |

#### 3.3.1 Path recipes (prescriptive wizard picks)

Use this as a copy-paste checklist. **Canonical values are stable IDs** (what the engine and fixtures use). The live survey may show friendlier labels; pick the option that stores the same ID in exported intake JSON.

**Global rules**

- **Touchpoint order matters:** `step1.touchpoints[0]` is the primary channel for Week 1, CTAs, and some routing. List channels in true priority order.
- **Operating model:** `step1.businessOperatingModel` must be set when the survey asks how customers reach you; it refines `touchpointCluster` (see §2.3).
- **Fastest repro:** use bundled fixtures under `packages/generation/src/fixtures/` or generate PDFs via `npm run generate:pdfs -- <persona>` from `packages/generation` (see `src/cli/writeCorePdfs.ts` help).

---

**`PC-01` — Service baseline (B2B-style solo expert)**

- **Fixture / CLI:** `core-sample.json` · `npm run generate:pdfs` or `npm run generate:pdfs -- default`
- **Step 1:** `businessName` *Northline Studio* · `industry` `creative_services` · `stage` `growing` · `brandNarrator` `solo_expert` · `businessOperatingModel` `online_only` · `touchpoints` (in order) `linkedin` · `primaryGoal` `lead_gen`
- **Offer builder:** `offerId` `positioning_strategy` · `audienceId` `brands_outgrowing_diy` · leave delivery blank
- **Transformation builder:** `beforeId` `scattered_messaging` · `afterId` `confident_story` · `mechanismId` `positioning_and_copy`
- **Step 2–7:** match `core-sample.json` (friendly tone, `clean_minimal` + `midnight_luxe`, values, origin, competitors, etc.)

---

**`PC-02` — Storefront / food & bev coffee**

- **Fixture / CLI:** `personas/coffee-founder.json` · `npm run generate:pdfs -- coffee-founder`
- **Step 1:** `businessName` *Harbor Row Coffee* · `industry` `food_beverage` · `stage` `new` · `brandNarrator` `solo_maker` · `businessOperatingModel` `customer_visits_us` · `touchpoints` `instagram` · `primaryGoal` `direct_sales`
- **Offer builder:** `offerId` `specialty_coffee` · `audienceId` `neighborhood_regulars` · `deliveryId` `walk_in_service`
- **Transformation builder:** `beforeId` `boring_routine` · `afterId` `worth_recommending` · `mechanismId` `thoughtful_hospitality`
- **Step 6:** `selectedPalette` `earthy_warmth` · `selectedStyle` `organic_natural`
- **Step 2–5, 7:** match `coffee-founder.json`

---

**`PC-03` — Local team, no directory touchpoint (advisory Google copy)**

- **Base:** start from **`PC-01`** / `core-sample`, then override only Step 1 as follows.
- **Step 1:** `brandNarrator` `local_team` · `industry` `creative_services` · `touchpoints` (in order) `instagram`, `website` · `primaryGoal` `lead_gen` · keep `businessOperatingModel` `online_only` (or any non-directory-heavy combo consistent with tests)
- **Expect:** Quick Start Week 1 softens “hours/address” line; Week 3 uses “Claim or complete your Google Business profile” (not “update cover photo”).

---

**`PC-04` — Local team + directory selected (imperative directory lines)**

- **Base:** same as **`PC-03`**, but change **touchpoints** to (in order) `google_business`, `instagram`
- **Expect:** Week 3 “Update your Google cover photo…”; Week 1 includes confirm name/hours/address.

---

**`PC-05` — Regulated legal (compliance guardrails + safe before/after)**

- **Base:** start from **`PC-01`** / `core-sample`, then override:
- **Step 1:** `industry` `legal_professional_services` (keep `solo_expert`, `linkedin`, `lead_gen`, etc.)
- **Step 3 (for before/after safety test parity):** `tonePreset` `professional`
- **Steps 2, 4–7:** can stay as `core-sample` unless you need legal-specific story/competitors.

---

**`PC-06` — Mixed commerce / service edge (documented contradiction path)**

- **Base:** start from **`PC-01`** / `core-sample`, then override **Step 1** only:
- **`industry`:** `retail`
- **`brandNarrator`:** `solo_expert`
- **`touchpoints` (in order):** `instagram`, `marketplace_storefront`
- **`primaryGoal`:** `direct_sales`
- **Expect:** Sample phrases still allow “Book a call”-style service language while commerce surfaces are primary; before/after stays grammatically clean (see `instagram-first shop-second solo expert…` test).

---

**`PC-07` — Physical-first operations (signage / travel / in-person)**

Pick **one** concrete recipe (both hit `physical_first`-style routing; tests use them for cluster + typography).

- **A — Retail visit (overlaps `PC-02` visually):** use **`PC-02` / coffee-founder** (`food_beverage` + `solo_maker` + `customer_visits_us`).

- **B — Trades / travel to customer:** start from **`PC-01`**, then **Step 1:** `industry` `construction_trades` · `brandNarrator` `solo_expert` · `businessOperatingModel` `we_travel_to_customers` · `touchpoints` e.g. `linkedin` or `website` · `primaryGoal` `lead_gen`

---

**`PC-08` — Social → product promotion (marketplace-first skew)**

- **A — `social_product` promotion (creative services expert):** start from **`PC-01`**, then **Step 1:** `touchpoints` (in order) `marketplace_storefront`, `instagram` · keep `creative_services` + `solo_expert` + `online_only`

- **B — Marketplace primary but physical base stays physical:** start from recipe **PC-07 B**, then set **`touchpoints`** to `marketplace_storefront` only (tests assert cluster stays `physical_first`)

---

**`PC-09` — Tone × style matrix (voice ↔ visual bridge)**

- **Manual spot check:** any single intake path is fine; vary **Step 3** `tonePreset` (`friendly` | `professional` | `bold`) and **Step 6** `selectedStyle` (`clean_minimal` | `bold_graphic` | `organic_natural` | `luxe_refined`).
- **Full exhaustiveness:** covered in code by `voiceVisualBridge matrices cover all tone × style pairs` (no need to click every pair in the UI).

---

**`PC-10` — Existing typeface + tier gate (Pro vs Core)**

- **Pro honors typeface:** export or build form with **`tier` `pro`**, **`step6.existingTypeface`** set to a concrete string (e.g. *Montserrat for all headings*), **`step6.selectedStyle`** `clean_minimal` — rest can match **`PC-01`**.

- **Core ignores typeface for continuity:** **`tier` `core`**, same `existingTypeface` string, plus **Step 1** `industry` `food_beverage` · `brandNarrator` `solo_maker` · `businessOperatingModel` `customer_visits_us` (see `Core tier ignores existingTypeface…` test).

---

**Add-on: `local_team` Voice Playbook before/after labels (not a separate PC row)**

- **Base:** **`PC-01`** / `core-sample`, then **Step 1** only: `brandNarrator` `local_team`
- **Expect:** Before/after labels **Social hook rewrite** + **Visit or listing line rewrite** (see `Voice Playbook Before / after routes local_team…` test).

Review protocol:
- Treat each path class as a deterministic contract, not a persona story.
- Any behavior change must cite impacted `PC-*` IDs and updated expected section effects.
- Add or adjust tests before template tuning when a `PC-*` contract changes.

### 3.4 Path-to-section influence matrix (operational lens)

Legend:
- **Strong**: path class should visibly change section wording or route.
- **Light**: path class may influence examples/phrasing but not section purpose.
- **None**: no expected deterministic effect in current Core behavior.

| Path class | Brand Brief | Style Guide | Voice Playbook | Quick Start |
|---|---|---|---|---|
| `PC-01-service-baseline` | Strong | Light | Strong | Light |
| `PC-02-storefront-coffee` | Strong | Light | Strong | Strong |
| `PC-03-local-directory-missing` | Light | None | Light | Strong |
| `PC-04-local-directory-present` | Light | None | Light | Strong |
| `PC-05-regulated-legal` | Light | None | Strong | Light |
| `PC-06-mixed-commerce-service-edge` | Light | None | Strong | Light |
| `PC-07-physical-first-ops` | Light | Strong | Light | Strong |
| `PC-08-social-product-promotion` | Light | Light | Strong | Strong |
| `PC-09-tone-style-matrix` | Light | Strong | Strong | None |
| `PC-10-existing-typeface-tier-gate` | None | Strong | None | None |

Coverage policy:
- If a section cell is **Strong**, at least one regression assertion should exist for that `PC-*` + section pair.
- If a section cell is **Light**, at least one regression assertion should exist somewhere in the document family for that path class.
- Contradiction paths (currently `PC-06`) must be labeled as accepted tradeoff or promoted to gap/bug; avoid implicit behavior drift.

---

## 4) Core Tier Translation Rules (Deterministic)

Core output should be template-driven, with controlled variation by industry, tone, and selected options.

### 4.1 Rule Format

Each section uses:

- `template_id`
- `required_inputs`
- `fallback_inputs`
- `max_words`
- `style_flags`

Example:

```text
brand_brief.core_promise
template_id: bb_core_promise_v1
required_inputs: step1.transformation.beforeId, step1.transformation.afterId, step1.transformation.mechanismId
fallback_inputs: step1.transformation.beforeOther/afterOther/mechanismOther (when `other`), step1.offer.offerId, step1.offer.audienceId, step2.desiredOutcomes (Pro-only when available)
max_words: 35
style_flags: [plain_language, no_hype, benefit_forward]
```

### 4.2 Core Fallback Strategy

If a section’s preferred input is missing/weak:

1. use fallback field(s)
2. reduce specificity but keep structure
3. avoid invented claims

If still weak, use neutral scaffold:

- “This brand helps [audience] achieve [outcome] through [offer].”

### 4.3 Core Language Constraints

- No unverifiable superlatives
- No fabricated metrics
- Keep sentences short and literal
- Prefer plain verbs over abstract jargon

### 4.4 Deterministic Scaffold Rules for Pro

For sections marked `ai_enhanced`, generate a deterministic scaffold first:

- required anchor facts (must mention)
- section intent sentence
- length bounds
- style flags

Model output must preserve scaffold anchors and only improve specificity/voice.

### 4.5 Core deterministic risk note: freeform input quality

This product should assume many Core customers are **not marketing-savvy**.  
Because Core has no AI rewrite/repair layer, wide-open freeform fields can reduce output quality or produce vague sections when answers are short, generic, or off-brief.

Current highest-sensitivity Step 1 fields:

Core-visible required controlled selections:
- `step1.offer.offerId`
- `step1.offer.audienceId`
- `step1.transformation.beforeId`
- `step1.transformation.afterId`
- `step1.transformation.mechanismId`

Core-visible constrained fallback text fields (only active when `other` is chosen):
- `step1.offer.offerOther`
- `step1.offer.audienceOther`
- `step1.transformation.beforeOther`
- `step1.transformation.afterOther`
- `step1.transformation.mechanismOther`

Core-visible optional controlled / fallback fields:
- `step1.offer.deliveryId`
- `step1.offer.deliveryOther`
- `step7.competitors`

Pro-only optional/conditional fields (still relevant to deterministic fallback behavior where reused):
- `step2.painPoints`, `step2.desiredOutcomes`
- `step3.customVoiceNotes`
- `step4.missionStatement`
- `step5.originSummary`, `step5.motivation`
- `step6.existingTypeface`, `step6.colorMoodNotes`, `step6.styleNotes`, `step6.referenceUploadName`
- `step7.differentiation`

Current decision boundary (do not solve in this spec yet):
- Core Step 1 now uses slot-based controlled builders instead of open `offer` / `transformation` phrase entry.
- Continue favoring curated selections first and short `Other` fallbacks only when needed; do not add AI cleanup to Core.
- Pro freeform capture remains unchanged in this pass.

Known contract gaps to decide before further cleanup:
- **Core differentiation signal gap:** live Core survey does not collect `step7.differentiation`, but Brand Brief differentiation quality improves materially when differentiation text exists. Decide whether to (a) keep Core as competitors-only, (b) add a constrained Core differentiator capture, or (c) keep Pro-only and accept broader Core differentiation language.
- **Core fallback quality dependency:** some deterministic fallback examples still reference Pro-only depth fields (for example `step2.desiredOutcomes`). Keep these as conditional enrichers only; Core-safe defaults must stand without Pro-only fields.

---

## 5) Pro Tier Translation Rules (Prompted Enhancements + Pro-only AI)

Pro uses AI generation per section with strict constraints.

### 5.1 Prompt Package Structure

For each section, pass:

- `business_context` (S1)
- `audience_context` (S2)
- `voice_context` (S3)
- `values_context` (S4)
- `story_context` (S5)
- `visual_context` (S6, when relevant)
- `positioning_context` (S7)
- `industry_profile` (from industry layer)
- `constraints` (length, style, prohibited language)

### 5.2 Prompt Contract Example (ai_enhanced)

```text
Task: Generate one concise brand summary paragraph.
Length: 30-45 words.
Tone: match tonePreset + sliders.
Requirements:
- mention transformation outcome
- reflect ideal customer context
- include differentiation cue if available
Avoid:
- hype claims
- generic filler phrases
```

### 5.3 Pro Quality Uplift Targets

Compared to Core, Pro output should show:

- stronger specificity
- clearer voice consistency
- better synthesis across steps
- practical copy that can be used with minimal edits

### 5.4 ai_enhanced Constraints

For `ai_enhanced` sections:

- preserve deterministic scaffold anchors
- improve clarity/specificity/tone fit
- do not add unsupported claims
- stay within section length bounds

### 5.5 ai_only Rules (Pro-only Assets)

For `ai_only` sections:

- require stronger context confidence (audience + transformation + tone + differentiation)
- if confidence is low:
  - reduce number of options
  - avoid speculative specificity
  - fall back to safer phrasing patterns

### 5.6 Existing brand integration (Pro, conditional)

Pro buyers may opt into the existing-brand track during Step 6 by toggling `hasExistingBrand: true` and providing one or more reference assets. This subsection defines how those assets land, how color signal is extracted, how the rest of the kit acknowledges them, and how the kit degrades when the inputs cannot be honored.

#### 5.6.0 Upload lifecycle (Option D — server-minted signed URLs)

Pro intake uploads use **server-minted signed upload URLs scoped to the buyer's anonymous `sessionId`**. Files travel direct browser → Supabase Storage; the API never proxies bytes. This subsection locks the endpoint contract, the storage path convention, and the database row lifecycle so fulfillment can find the assets later.

**Endpoints (`apps/api`):**

- `POST /uploads/sign` — request: `{ sessionId, assetType: 'logo' | 'referenceImage', mimeType, byteSize }`. Server validates MIME against §5.6.1 allowlist, byte size ≤ 4MB, then calls `supabase.storage.from('pro-uploads').createSignedUploadUrl(path)` and inserts an `intake_uploads` row with `status = 'pending'`. Response: `{ uploadUrl, path, expiresAt }`. Signed URL TTL: 5 minutes.
- `POST /uploads/confirm` — request: `{ sessionId, path }`. Server marks the matching `intake_uploads` row `status = 'uploaded'`. Web app then writes `path` into `existingBrand.logoRef` or `existingBrand.referenceImageRef`.

**Path convention:** `pro-uploads/{sessionId}/{assetType}.{ext}`. One asset per `(sessionId, assetType)` — re-uploads overwrite. The `sessionId` scoping is the only access boundary pre-payment; signed URLs at fulfillment time enforce read access.

**`intake_uploads` row schema:**

```sql
CREATE TABLE intake_uploads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   text NOT NULL,
  asset_type   text NOT NULL CHECK (asset_type IN ('logo', 'referenceImage')),
  path         text NOT NULL,
  status       text NOT NULL CHECK (status IN ('pending', 'uploaded', 'abandoned')) DEFAULT 'pending',
  mime_type    text NOT NULL,
  byte_size    integer NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX intake_uploads_session_idx ON intake_uploads(session_id);
```

**Abandoned cleanup:** a nightly job (or pg_cron) marks `pending` rows older than 24 h as `abandoned` and deletes the corresponding storage object. `uploaded` rows are retained until the `sessionId` either pays (rows survive to fulfillment) or expires unpaid after 30 days (rows + objects deleted).

**Form storage convention:** `IdentityKitForm` stores the **path string only** (e.g. `existingBrand.logoRef = "pro-uploads/sess_abc/logo.png"`). Signed read URLs are minted at fulfillment time per [`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §6.4 and never persisted on the form.

**Scope note (this ship):** the `/uploads/sign` and `/uploads/confirm` routes plus the Supabase client wiring are deferred to phase **Pro-E** per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §11. The current intake-UI ship (Pro-D) implements the **client-side surface only**: holds `File` objects in component state, runs `color-thief` locally for the extraction preview, and writes a placeholder path string (`pending:{sessionId}/{assetType}`) into the form so the rest of the schema and review flow look correct. The placeholder is replaced with the real `pro-uploads/...` path once Pro-E lands; no fulfillment-time consumer treats the placeholder as resolvable.

#### 5.6.1 Asset intake

- Logo and reference images upload to Supabase Storage bucket `pro-uploads`. Access is signed-URL only via the §5.6.0 endpoint contract.
- **Bucket name resolved:** `pro-uploads` is canonical. The earlier `identity-kit-uploads/<orderId>/logo.*` reference in [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §6.3.1 is superseded by this section.
- Per-file cap: **4MB**. MIME allowlist: `image/png | image/jpeg | image/svg+xml` for `existingBrand.logoRef`; `image/png | image/jpeg` for `existingBrand.referenceImageRef`.
- Virus scanning is deferred to post-launch hardening per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §10 risks; v1 ships with the cap and allowlist as the only validation gates.
- `existingBrand.url` is stored as text context in v1 and surfaced into AI prompts as a string. URL fetch / scrape is deferred to Pro-I and is explicitly out of scope for the v1 ship.

#### 5.6.2 Color extraction (seed, not truth)

- `color-thief` runs client-side at upload and writes up to 6 dominant hex values to two source-specific fields:
  - `existingBrand.logoExtractedColors[]` when the buyer uploads a logo. Treated as **authoritative**: the buyer's actual brand colors. Auto-fills `existingBrand.hexColors[]` when no manual entry exists.
  - `existingBrand.referenceExtractedColors[]` when the buyer uploads a reference image. Treated as **additive suggestions**: an inspirational palette, not a brand identity. Surfaced in the hex chips picker as an extra "also found in your reference image" row, but never auto-fills.
- The intake UI surfaces both sets distinctly in the hex chips picker. The buyer confirms, overrides, or picks from the named-palette catalog before generation.
- **Auto-snap to the nearest named palette.** Whenever `existingBrand.hexColors` changes (manual entry or logo extraction auto-fill), the web app runs `nearestNamedPalette(hexColors, PALETTE_OPTIONS)` ([`apps/web/src/utils/nearestNamedPalette.ts`](apps/web/src/utils/nearestNamedPalette.ts)) and writes the result to `step6.selectedPalette`. The palette picker on `c6_s1` therefore mounts with the matched palette already selected, plus a "Matched to your colors" badge on that card so the buyer understands why. The buyer can override; if they later edit their hex codes the snap re-fires and overrides their previous pick — the contract is that hex codes are the source of truth for buyers in the existing-brand track. **Algorithm:** for each palette, sum the closest user-hex distance per swatch (RGB Euclidean); pick the lowest. This rewards palettes whose entire swatch set sits near the user's colors, not just palettes that share a single dominant shade.
- Generation **always** renders the named palette object in `selectedPalette` — copy quality on Style Guide / Brand Identity Guide depends on palette names ("Ember Glow," "Sage Court") rather than raw hex values per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §10. The extracted colors inform Brand Audit observations and palette-mood acknowledgement copy only; they do not become the kit's working palette.
- **Future work — full custom palette via hex codes (deferred).** Some buyers may want to skip the named-palette snap entirely and ship the kit on their literal hex set. v1 does not support this because the deterministic copy systems (`paletteColorRoles.ts`, `friendlyColorName`, palette-keyed CTA copy variants) all depend on named palette IDs. Adding a "use my exact hex codes" toggle requires either (a) generating named-palette metadata for arbitrary input or (b) refactoring downstream copy to be palette-name-agnostic. Track in v1.5 backlog.

#### 5.6.3 Acknowledgement copy injection

- Style Guide visual direction (Pro `ai_enhanced`) acknowledges the existing logo / palette / typography as "building on," not "replacing."
- 30-Day Quick Start week 1 adds a "verify existing assets" beat when `hasExistingBrand` is true.
- Brand Identity Guide folio 02b typography page notes the existing typeface when `existingTypeface` is provided.
- Brand Audit ships as a separate deliverable (see [`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md) §7), not as a section inside the shared 5 PDFs.

#### 5.6.4 Confidence gating

- When uploads fail validation (oversized, wrong MIME, corrupt), fall back per §5.5 (reduce options, safer phrasing).
- The kit must **never** block fulfillment on existing-brand failures — it ships without existing-brand acknowledgements rather than with broken ones. The Brand Audit PDF is the only deliverable that requires a successful existing-brand input; it is conditional and may be omitted (per [`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md) §7) without taking the rest of the kit down.

#### 5.6.5 Conditional micro-step routing pattern

The existing-brand track introduces the first set of intake micro-steps whose visibility depends on a **form value**, not just on tier. This subsection locks the routing pattern so future conditional fields share one mechanism.

**Schema-level contract.** The `MicroStep` descriptor in [`apps/web/src/data/microStepSchema.ts`](apps/web/src/data/microStepSchema.ts) gains an optional predicate:

```typescript
conditional?: (form: IdentityKitForm) => boolean
```

When present, the step is included in the active flow only if the predicate returns `true`. When absent, the step is always included (subject to tier filtering).

**Runtime contract.** [`apps/web/src/hooks/useFlowState.ts`](apps/web/src/hooks/useFlowState.ts) re-derives the active micro-step list on **every form change**, not only on tier change. The pipeline is:

1. Filter by tier (`isMicroStepVisibleForTier`).
2. Filter by `conditional(form)` predicate when present.
3. Renumber `microStepIndex` and recompute `microStepTotal` per chapter from the filtered list, so progress counters ("step 4 of 7") stay accurate as the buyer toggles a gate.

**Identity continuity.** Step `id` (e.g. `c6_eb1`) is stable; `microStepIndex` and `microStepTotal` are derived. Saved form state can resume to the correct active step by id without depending on the index numbering.

**Existing-brand application.** All `c6_eb*` steps in §5.6 use `conditional: form => !!form.step6.hasExistingBrand`. The `c6_s3` (`existingTypeface`) step also gains the same predicate — it moves behind the gate per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §6.3.5.

**Order: gate first, then existing-brand block, then palette/style.** The Pro chapter 6 sequence is `gate → (conditional) logo → ref image + URL (combined) → hex → typeface → palette → style → mood → notes`. The gate runs before the palette picker so color extraction from the logo/reference image can pre-fill `existingBrand.hexColors` and inform the buyer's named-palette selection per §5.6.2. The reference image and brand URL share a single micro-step because both are "supporting brand context" (atmosphere/world, not authoritative identity) and asking for them on separate pages overstates their independence. Core users see only `palette → style` because every step before them is `tier: 'pro'` and filtered out before any conditional predicate runs — Core's experience is unchanged.

**No retroactive collapse.** When a buyer flips `hasExistingBrand: false` after answering downstream existing-brand fields, the field values are retained on the form (so re-toggling does not lose data) but their micro-steps disappear from the flow until the gate flips back. The review screen renders existing-brand summary rows only when `hasExistingBrand === true`.

### 5.7 Strategy Memo composition rules (Pro)

The Brand Strategy Memo is the highest-stakes Pro deliverable. It is the analytical output that justifies the $149 price relative to Core's $79. This subsection locks the per-section composition rules the assembler enforces; per-call prompt content is owned by [`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.9.4.

#### 5.7.0 Buyer-selection lock (no kit-contradiction rule, all Pro PDFs)

Although this subsection lives under §5.7 Strategy Memo composition, the rule **applies to every Pro AI-driven section across all Pro PDFs** — Core `ai_enhanced` rewrites, the Content Starter Pack, Voice Playbook page 3, the Strategy Memo, the Brand Audit, and the Visual Reference Spread caption. It is documented here once and referenced from the other contracts.

**The rule.** A reader holding the Core deterministic sections (palette swatches, style principles, tone profile, narrator voice) and the AI-driven Pro sections at the same time must not see one undermine the other. Specifically, **no Pro AI output may recommend (or imply the buyer should reconsider) any of:**

- `step6.selectedPalette`
- `step6.selectedStyle`
- `step3.tonePreset`
- `step1.brandNarrator`

These four fields are the kit's locked direction. Pro AI sharpens execution within them; it never proposes alternatives to them.

**What Pro AI is allowed to recommend.** Evolution of the buyer's *existing brand assets* (logo, existing typeface, uploaded hex colors, URL-level surfaces) toward the locked direction — the Brand Audit's whole purpose. Application-level recommendations (touchpoint priority, copy hierarchy, channel mix). Productive tensions framed as opportunities to sharpen within the locked direction.

**Prompt-level enforcement.** The shared base system prompt ([`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.8) renders a `# BUYER SELECTION LOCK` block naming all four locked fields by their resolved IDs. Per-section task prompts in §12.9.1 / §12.9.4 / §12.9.5 reinforce the rule with section-specific instructions and (for §4 Tensions) explicit invalid-framing examples that the walker rejects.

**Walker-level enforcement.** A new `kit_contradiction_walker` rejects any AI output whose prose surfaces phrases that read as recommending the buyer change a locked selection. Concrete rejection patterns (case-insensitive, plain-English substring or near-match): *"consider a different palette"*, *"a softer/bolder/warmer/cooler tone would"*, *"the {style} style doesn't suit"*, *"pick a different narrator"*, *"reconsider your {palette|style|tone|narrator}"*. The walker is registered in the chain for every call class except `moodboard.ranker` (returns image IDs, not prose). On rejection: one retry with `temperature - 0.1`; second failure → deterministic fallback per the call class's §12.9 entry.

**Fixture-test acceptance criterion.** For each of the eight canonical fixtures in `core-pdfs.test.ts` extended to Pro mode, the following assertions must pass:

1. The Strategy Memo's §4 tensions output contains no phrase from the walker rejection list.
2. The Strategy Memo's §5 contrarian-angle output does not name a `selectedStyle` / `selectedPalette` value other than the one selected.
3. The Brand Audit's §3 and §4 outputs (when conditional inputs present) recommend actions on *existing brand assets only* — every recommendation cites at least one `existingBrand.*` field rather than a `step3.*` or `step6.*` selection field.
4. The Style Guide `ai_enhanced` rewrite for `bold_graphic` fixtures contains visually bold language (regex on a short approved vocabulary) and contains no language from the soft / muted register (regex on a short banned vocabulary). Equivalent assertions per style preset.

Failing assertions block the Pro acceptance suite. This is the single concrete test that prevents the contradiction risk from regressing.

#### 5.7.1 Per-section word budgets

Authored against playbook §12.9.4 and duplicated here so the assembler has a single source for pagination decisions.

- `strategyMemo.archetype` — ≤ 80 words.
- `strategyMemo.jtbd` — ≤ 150 words (3 paragraphs × ~50 words: Functional / Emotional / Social).
- `strategyMemo.behavioralAudience` — ≤ 120 words.
- `strategyMemo.tensions` — ≤ 75 words (2–3 bullets × ~25 words).
- `strategyMemo.contrarianAngle` — ≤ 80 words.
- `strategyMemo.messagingHierarchy` — ≤ 180 words (value prop + 3–4 pillars + primary message + per-pillar proof).
- `strategyMemo.roadmap` — ≤ 120 words (3 items × ~40 words).
- `strategyMemo.narrative` — ≤ 150 words **or** skip (see §5.7.3).

#### 5.7.2 Citation discipline (messaging hierarchy)

Every pillar's `proofPoints[]` entry includes a `fieldCited: string` that names the intake field grounding the claim. Pillars without citable proof get demoted (3 solid pillars beat 4 aspirational ones). The walker rejects outputs where any pillar lacks citation, and the assembler removes those pillars rather than padding with generic copy.

#### 5.7.3 Brand narrative substance-threshold selector

Section §8 of the Memo is conditional. The selector picks between Problem Story, Brand Manifesto, or skip based on intake substance:

- **Problem Story** when `differentiation` is substantive (≥ 60 chars non-whitespace) AND `competitors[].length >= 1`. Anchored on differentiation + competitors + painPoints + transformation. ~150 words diagnostic.
- **Brand Manifesto** when `values[].length >= 2` AND at least one of `missionStatement | originSummary` is substantive (≥ 60 chars non-whitespace). Anchored on values + missionStatement + originSummary. ~150 words aspirational.
- **Skipped** when neither threshold clears. The selector returns `{ narrativeType: "skipped", fieldsChecked: [...] }` and the assembler omits §8 cleanly without leaving a gap or stub.

If both thresholds clear, ship Problem Story (more universally useful per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §7.3 §8 rationale). Never ship both.

#### 5.7.4 Demotion-not-invention rule

When the AI cannot find citable evidence for an item, demote rather than invent. Concrete cardinality minimums:

- Tensions: 1 instead of 2 if only 1 is citable; empty if none.
- Hierarchy: 3 pillars instead of 4 if only 3 carry citation.
- Roadmap: 2 items instead of 3 if only 2 are grounded.

The walker enforces non-emptiness only on `strategyMemo.archetype` and `strategyMemo.messagingHierarchy.valueProposition`. All other sections may legitimately ship at minimum cardinality without triggering walker rejection.

#### 5.7.5 PDF assembly failure threshold

The Strategy Memo PDF assembles successfully when **≥ 6 of 8 sections are valid** (any of `ok`, `fallback_shipped`, or `skipped` for the conditional narrative). Outcomes:

- 8 valid → full Memo.
- 6–7 valid → shorter Memo; pagination collapses; no buyer notification.
- ≤ 5 valid → catastrophic Memo failure. Assembler swaps in the deterministic Brand Identity Guide as a Memo replacement and ops are paged per [`PRODUCT.md`](PRODUCT.md) Pro fulfillment policy (matrix entry: "Strategy Memo ≥3 sections fail").

This threshold mirrors the per-call playbook §12.9.4 failure-mode rule ("≥3 of 8 fail → Memo fails as a unit") and is duplicated here so the assembler has a local source.

### 5.8 Moodboard bank selection contract (Pro)

The Pro Visual Reference Spread (Style Guide pages 3–4, see [`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md) §2) is curated from an owned/licensed image bank. AI selects from the bank — it does not generate images. This subsection locks the selection pipeline, controlled vocabulary, and failure paths.

> **Historical note.** This contract previously targeted a standalone `09-brand-moodboard.pdf`. As of the 7-PDF Pro bundle decision, the same pipeline (tag matcher → ranker → caption) and the same `moodboard.*` Section IDs now feed Pro pages 3–4 of the Style Guide. Section IDs intentionally retain their `moodboard.*` namespace to keep the prompt registry and walker telemetry stable per §1.2.

#### 5.8.1 Selection pipeline

0. **Reference image tag extraction (`moodboard.referenceTagExtractor`, Haiku 4.5, vision; conditional on `existingBrand.referenceImageRef`).** Receives the reference image as multimodal input. Returns a flat list of matching bank tag values drawn from the controlled vocabularies (`palette family`, `style register`, `scene type`, `mood adjective`). Result is held as `referenceImageTags: string[]` in the fulfillment context — it is **not** written back to the intake form. Failure (refusal, walker rejection, API error): drop the step silently and continue without the augmentation; never block the moodboard.
1. **Tag matcher (deterministic).** Queries bank metadata for the kit's palette family, style register, mood adjectives, narrator alignment, and industry suitability. When step 0 produced `referenceImageTags`, those values are added to the matcher inputs as **additive, lower-weight signal** than the explicit `moodAdjectives[]` chips — the buyer's deliberate selections always outrank the AI's reading of the reference image. Returns a shortlist of 20–30 image IDs ranked by tag-match score.
2. **AI ranker (`moodboard.ranker`, Haiku 4.5).** Receives the shortlist plus kit context. Selects 6–9 IDs subject to the scene-variety constraint (§5.8.3). Returns selection only — no prose.
3. **AI caption (`moodboard.caption`, Haiku 4.5).** Writes ~80 words tying the selected images to the kit's voice, palette, and direction.
4. **Deterministic PDF layout.** Consumes ranked IDs + caption + deterministic palette call-outs.

#### 5.8.2 `moodAdjectives` controlled vocabulary

Locked enum for the Step 6 Pro multi-select (zero or more values):

```
warm, cool, refined, raw, calm, energetic, playful, austere,
organic, geometric, vintage, futuristic, premium, accessible, soft, sharp
```

The same 16 values appear as image-bank secondary tag values so tag-match scoring is symmetric.

#### 5.8.3 Scene-variety constraint

A valid moodboard selection contains **at most 3 images of any single scene type** from the six bank values: `texture`, `object`, `environment`, `people`, `lighting`, `pattern`. The walker rejects selections that violate the cap, triggers one retry with `temperature - 0.1`, and falls back to the deterministic top-6 by tag-match score if the retry also fails.

#### 5.8.4 Reference-image bias (existing-brand track only)

When `existingBrand.referenceImageRef` is present, the reference image plays **two complementary roles** in the moodboard pipeline:

1. **Pre-shortlist tag enrichment** (§5.8.1 step 0) — the `moodboard.referenceTagExtractor` call reads the reference and emits bank-vocabulary tags that augment the deterministic tag matcher's inputs. This shapes *which* candidates make the shortlist.
2. **Ranker tie-breaking** — the ranker also receives the reference as multimodal input and biases selection toward visually similar candidates from the shortlist. Locked instruction (paste verbatim into the prompt):

> *"You are still selecting from a fixed bank — you cannot pick images outside the provided shortlist. Use the reference only to break ties among similarly-scored candidates."*

The reference does not expand or replace the shortlist at the ranker step; it only re-ranks within it. The tag-extraction step (§5.8.1 step 0) is the only mechanism by which the reference affects shortlist composition.

#### 5.8.5 Failure paths

- **Tag matcher returns < 6 candidates.** Broaden per [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §7.3.4: drop style register, then mood adjectives, then scene weighting until the shortlist clears 6.
- **AI ranker fails (refused, walker rejection after retry, or API error).** Ship the deterministic top-6 by tag-match score.
- **AI caption fails.** Ship a deterministic caption variant from a pre-written bank keyed on palette family × style register.
- **Bank depletion (still < 6 after broadening).** Ship 6 broadly-on-palette images from `texture` + `pattern` (kit-agnostic scene types) and a deterministic fallback caption.
- **Catastrophic failure (ranker fails AND deterministic fallback returns < 6 AND caption fails).** Omit the Visual Reference Spread entirely; the Style Guide ships at its 2-page Core length. Surface the omission in fulfillment events for ops visibility but do not block the rest of the kit.

### 5.9 Style influence boundary (v1 scope)

`step6.selectedStyle` is one of the highest-leverage intake fields and reaches a wide set of surfaces (full inventory in §2.4). To prevent confusion about how far that influence extends, this subsection locks the v1 scope.

#### 5.9.1 What `selectedStyle` does drive

- **Copy** across Style Guide style-principles, do/avoid, imagery direction, voice-bridge sentences, narrator usage notes, color summary `systemCharacter` adjective, and the 3 × 4 `usageDiscipline` matrix (Brand Identity Guide folio 02a + Style Guide).
- **Typography selection** — both the recipe (`typographyRecipes.ts`, ~16 named recipes) and the wordmark-rail template (`typographyWordmarkRail.ts`).
- **Pro AI grounding (when Pro-A lands)** — every Pro `ai_enhanced` and `ai_only` task prompt receives the kit's named style preset in the visual context block per §5.9.3.
- **Pro Visual Reference Spread candidate selection (when Pro-G lands)** — `selectedStyle` maps to the `style register` tag axis on the image bank ([`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §7.3.4) and is required input to both the deterministic tag matcher and the AI ranker that populate Style Guide pages 3–4; see [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12 ranker prompt.

#### 5.9.2 What `selectedStyle` does NOT drive in v1

- **PDF page templates / layout grids.** The page chrome, column structure, type-scale ladder, and folio composition are style-agnostic. A `bold_graphic` kit and a `clean_minimal` kit ship on the same react-pdf templates; the visible differences are copy, typography pairing, and the per-style adjective in the color summary — not the page layout.
- **PDF accent colors / chrome.** Those track `selectedPalette`, not `selectedStyle`.

**Rationale.** Each additional style-driven layout variant multiplies the designer-grade fixture-review surface (4 styles × N PDFs × M personas) and our priority is reading specific to the business, not visually different per style. This boundary is consistent with [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §10 ("Pro PDFs visually indistinguishable from Core") and §12 question 6 ("no Pro accent / Pro badge").

#### 5.9.3 Pro AI visual-context block contract (locked)

When Pro-A lands, the `visual_context` block in every Pro AI prompt (the `{{visualPositioningContext}}` placeholder in [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §10) **must** include at minimum:

- `selectedPalette` (named ID + swatches)
- `selectedStyle` (named ID)
- `moodAdjectives[]` (when present)
- `existingTypeface` (when present, Pro)
- `visualNotes` (when present, Pro)
- `existingBrand.*` summary (when `hasExistingBrand`, Pro)

The Pro-A acceptance criterion in [`PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §11 is gated on a fixture test that fails if any of `selectedPalette`, `selectedStyle`, or `moodAdjectives` is missing from the visual context payload. Per-prompt task templates in playbook §12 should additionally **name `selectedStyle` explicitly in the prompt body** (e.g. *"this kit's selected style is `luxe_refined`"*) rather than relying on the context block alone — the explicit reference produces measurably more on-style copy.

#### 5.9.4 Future-work flag

Style-driven PDF template variation (different layouts per `selectedStyle`) is deferred. Track in [`DELIVERABLE_PRODUCTION_SPEC.md`](DELIVERABLE_PRODUCTION_SPEC.md) Open Production Decisions; revisit when designer-grade fixture coverage is complete and we have telemetry on which styles cluster.

---

## 6) Industry Verbiage Layer

Define an `industry_profile` object keyed by `step1.industry`.

## 6.1 Industry Profile Schema

```json
{
  "industry_id": "health_wellness",
  "preferred_terms": ["client outcomes", "well-being", "support plan"],
  "avoid_terms": ["hack", "instant cure", "guaranteed results"],
  "tone_modifiers": ["reassuring", "credible", "clear"],
  "cta_patterns": ["Book a consultation", "Start your plan"],
  "compliance_flags": ["no medical claims"]
}
```

### 6.2 Industry Adaptation Rules

- Inject preferred terms in messaging sections where natural.
- Block avoid terms and compliance-unsafe claims.
- Adjust CTA suggestions per industry pattern.
- If no profile exists (`other`), use neutral baseline lexicon.

### 6.3 Photography / visual capture guidance — scope boundary

Kit outputs (Style Guide "Practical usage notes" and any narrator-conditioned visual guidance) should give **style direction** — mood, backdrop feel, lighting adjective, palette application — but **must not include photography how-to instructions or technique**. Customers receive a free Camentra trial via a post-purchase email; hands-on photography guidance is handled there. Keep all visual application bullets at the level of aesthetic direction, not camera operation.

### 6.4 Initial Industry Pack Priority

Start with highest-impact categories:

- creative_services
- consulting_coaching
- health_wellness
- legal_professional_services
- technology
- retail

---

## 6A) Narrator Profile Layer

Define a `narratorProfile` object keyed by `step1.brandNarrator`. Works in parallel with `industryProfile` — industry seasons the vocabulary, narrator shapes the structure and channel emphasis.

### 6A.1 Narrator Profile Schema

```json
{
  "narrator_id": "solo_maker",
  "content_pillars": [
    "Process and making",
    "Materials and ingredients",
    "Finished reveals",
    "Behind the scenes",
    "Customer stories"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop the collection",
    "See how it's made",
    "Limited batch — get yours",
    "Made to order — shop now"
  ],
  "primary_channels": ["Instagram", "Pinterest", "Etsy shop"],
  "brand_brief_emphasis": "story_then_values",
  "tone_of_voice_themes": ["craft", "process", "maker pride"],
  "email_tone_pattern": "warm and personal"
}
```

### 6A.2 Full Narrator Profile Dictionary

**`solo_expert`** — the owner is the credential

```json
{
  "narrator_id": "solo_expert",
  "content_pillars": [
    "Client results and transformations",
    "My expertise and background",
    "Tips and education",
    "Behind the process",
    "FAQs and common questions"
  ],
  "cta_type": "book_or_consult",
  "cta_patterns": [
    "Book a free consultation",
    "Let's talk",
    "Schedule a session",
    "See my work"
  ],
  "primary_channels": ["LinkedIn", "personal website", "email"],
  "brand_brief_emphasis": "story_then_transformation",
  "tone_of_voice_themes": ["credibility", "care", "personal expertise"],
  "email_tone_pattern": "professional and personal"
}
```

**`solo_maker`** — the craft and maker are the brand

```json
{
  "narrator_id": "solo_maker",
  "content_pillars": [
    "Process and making",
    "Materials and ingredients",
    "Finished reveals",
    "Behind the scenes",
    "Customer stories"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop the collection",
    "See how it's made",
    "Limited batch — get yours",
    "Made to order — shop now"
  ],
  "primary_channels": ["Instagram", "Pinterest", "Etsy shop"],
  "brand_brief_emphasis": "story_then_values",
  "tone_of_voice_themes": ["craft", "process", "maker pride"],
  "email_tone_pattern": "warm and personal"
}
```

**`local_team`** — shop or crew; community trust leads

```json
{
  "narrator_id": "local_team",
  "content_pillars": [
    "Team and faces",
    "Community connection",
    "Day-in-the-life",
    "Customer shout-outs",
    "Local events and updates"
  ],
  "cta_type": "visit_or_call",
  "cta_patterns": [
    "Visit us at [location]",
    "Call us today",
    "Book online",
    "Stop by and say hi"
  ],
  "primary_channels": ["Google Business", "Instagram", "Facebook"],
  "brand_brief_emphasis": "transformation_then_customer",
  "tone_of_voice_themes": ["community", "reliability", "neighborhood warmth"],
  "email_tone_pattern": "friendly and local"
}
```

**`product_led`** — brand and product speak before the person

```json
{
  "narrator_id": "product_led",
  "content_pillars": [
    "Ingredients, materials, or features",
    "Before and after",
    "How and why it works",
    "Ritual or everyday use",
    "Customer proof and reviews"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop now",
    "Try it today",
    "See the difference",
    "Find your fit"
  ],
  "primary_channels": ["Instagram", "brand website", "product packaging"],
  "brand_brief_emphasis": "transformation_then_differentiation",
  "tone_of_voice_themes": ["brand sensibility", "product proof", "clarity"],
  "email_tone_pattern": "brand-forward and clean"
}
```

**`mission_community`** — cause or collective comes first

```json
{
  "narrator_id": "mission_community",
  "content_pillars": [
    "Impact stories",
    "How we help",
    "Community voices",
    "Calls to action and events",
    "Behind the work"
  ],
  "cta_type": "support_or_join",
  "cta_patterns": [
    "Get involved",
    "Support the mission",
    "Join us",
    "See the impact"
  ],
  "primary_channels": ["Facebook", "email newsletter", "local press"],
  "brand_brief_emphasis": "values_then_transformation",
  "tone_of_voice_themes": ["mission", "community", "shared purpose"],
  "email_tone_pattern": "warm and cause-driven"
}
```

### 6A.3 Narrator Adaptation Rules

- Use `content_pillars` as the source set for CSP content pillar prompts; flavor with `industry` vocabulary and `transformation` language.
- Use `cta_type` / `cta_patterns` for **Pro Content Starter Pack** CTA suggestion *categories* and model constraints. **Core** Voice Playbook “Calls to action (CTAs)” is deterministic from `primaryGoal` + `resolveChannelPlan` (see `voicePlaybookCtaBody` in `coreAssembly.ts`), not from `cta_type`.
- Use `primary_channels` as **fallback** channel ordering when `touchpoints` are empty or incomplete; Week 1 anchor text prefers `resolveChannelPlan` (touchpoints first).
- Use `brand_brief_emphasis` to weight section order/focus in Brand Brief generation.
- Use `email_tone_pattern` as a modifier when generating email voice application templates (Pro Voice Playbook).
- When `brandNarrator` is empty/unknown, default to `solo_expert` behavior as the safest neutral fallback.

### 6A.4 Combined Narrator × Industry Signal

Neither signal alone is sufficient. Apply them in order:

1. `narratorProfile` sets structure (what sections emphasize, pillar categories, brief emphasis); **surface names** for Week 1+ defer to `resolveChannelPlan` when touchpoints exist; **`cta_type`** applies to Pro CSP CTA generation, not Core deterministic CTA body (§6A.3)
2. `industryProfile` sets vocabulary (preferred terms, avoid terms, compliance flags)
3. `transformation` and `offer` (S1) provide the specific business language that makes it feel personal

---

## 7) Tone Translation Rules

Tone signals come from:

- `tonePreset`
- 5 snapped sliders
- optional `customVoiceNotes`

Map slider bands to style directives:

- Formality high -> concise, direct, low colloquialism
- Warmth high -> empathetic framing and relational cues
- Directness high -> shorter sentences, action-forward phrasing
- Playfulness high -> lighter wording (without gimmick tone)

When conflicting directives occur, order precedence:

1. Explicit `customVoiceNotes`
2. `tonePreset`
3. slider-derived modifiers

---

## 8) Section Length + Format Constraints

| Section type | Min words | Max words | Output form |
|---|---:|---:|---|
| One-liner | 8 | 16 | single sentence |
| Short summary paragraph | 20 | 45 | paragraph |
| Strategy block | 30 | 70 | paragraph |
| Bullet item | 4 | 18 | bullet |
| CTA suggestion | 2 | 8 | short phrase |
| Caption hook | 5 | 18 | one-liner |

Hard rule: if generation exceeds max words, trim by priority (retain core meaning over style flourishes).

---

## 9) QA Gates (Pre-PDF)

Run per section:

1. **Completeness**
   - section has non-empty output
2. **Length**
   - within section bounds
3. **Style compliance**
   - tone constraints followed
4. **Industry compliance**
   - no banned terms for selected industry
5. **Claim safety**
   - no fabricated guarantees/metrics
6. **Readability**
   - clear sentence structure; avoid jargon clusters
7. **Duplication**
   - avoid repeating same sentence across documents
8. **Mode compliance**
   - deterministic sections include required scaffold anchors
   - ai_enhanced sections preserve anchors
   - ai_only sections pass stricter confidence checks

If any gate fails:

- Core: deterministic fallback rewrite
- Pro:
  - ai_enhanced: one repair pass, else deterministic scaffold fallback
  - ai_only: one repair pass, else safe minimal fallback variant

---

## 10) Editable Output Assembly

The editable layer should store each document as sectioned content, not a single blob.

Suggested shape:

```json
{
  "brandBrief": {
    "brandOverview": "...",
    "idealCustomer": "...",
    "corePromise": "...",
    "valuesPositioning": "...",
    "storyAngle": "...",
    "differentiation": "..."
  }
}
```

Why:

- better edit experience
- easier regeneration per section in future Pro flow
- cleaner PDF rendering and QA targeting

---

## 10A) Editorial Guide Layout Rules

For the combined `Brand Identity Guide`, treat page layout as a second deterministic layer on top of content assembly.

The system should preserve the existing five-page guide IA, but render those pages through reusable editorial blocks rather than one bespoke shell per page.

### 10A.1 Editorial blocks

Allowed reusable blocks include:

- folio + title row
- optional dek (**`editorial.deck` is retained on the model but not rendered under the title on the Brand Identity Guide PDF** — folio + spread title only; see refactor status doc)
- prose column + side rail
- quote rail
- compact fact block
- sample copy row
- before / after panel
- palette / type system board
- figure or image mat
- optional **Voice page foot band** below the three-column grid (“how to use this page” rollout framing; deterministic from `guideFocus` + primary touchpoint)
- **Do / avoid** on **folio 04 (Voice)** — same `GuideDoAvoidPanel` as before, fed by `model.examples.doLines` / `model.examples.avoidLines` (moved off folio 05 Examples so the CTA band can use full width without a +1 page)

These blocks are layout containers, not content promises.

Important:

- a reference PDF may contain a logo-like page region
- this does **not** mean the production guide should gain a dedicated logo standards page
- when logo assets do not exist, that region must be reusable for visual system, imagery, application, or other high-value guidance

### 10A.2 Signal-driven layout choice

Signals may influence not only wording, but also:

- whether a dek appears
- which editorial block is selected
- how much of a page is given to examples vs explanation
- whether a figure / image mat is used to create intentional occupancy
- whether a page leans prose-first, sample-first, or system-first

Examples:

- stronger trust/story material -> prose + quote rail
- weaker story material -> application or collaborator block instead
- stronger visual confidence -> richer visual occupancy on the visual page
- weak before/after material -> more sample lines, fewer theory blocks

### 10A.3 Production guide constraint

The `Brand Identity Guide` should remain organized around the existing customer-facing **five nav sections** (Summary, Look, Personality, Voice, Examples), rendered as **six physical Letter landscape pages** because Look splits into **02a** (Color) and **02b** (Typography). Page-count tests in `core-pdfs.test.ts` assert `countPdfPages === 6`.

Do not remap the production guide to literal section names from a prototype reference document such as:

- logo
- color
- typography

Those may inform pacing and visual composition, but they should only appear as internal block references or subregions when they serve the actual five-page guide contract.

### 10A.4 QA implications

Guide QA should check:

- page count remains on target
- no blank continuation pages caused by layout overflow
- optional deks are not rendered uniformly on every page
- sparse pages still have at least two intentional regions of value
- no page implies unavailable assets (especially logo-dependent structures)

### 10A.4a Transmutation arc (folio 04 Voice)

On **folio 04**, below the **sample lines** row, the PDF may render a **transmutation arc**: a compact before → after visual (`raw` … `refined` `pure`) tied to the brand’s tone/palette signals. Implemented in `packages/generation/src/pdf/components/TransmutationArc.tsx` from `CoreKitDocuments.tsx`. It is decorative/editorial chrome for the voice spread, not a separate intake field. Omit when layout or density does not allow without breaking the six-page contract.

### 10A.5 Brand Identity Guide — intake roles (vertical slice)

This table applies **only** to deterministic assembly in `buildBrandIdentityGuideModel` and the `05-brand-identity-guide.pdf` render path. It does not yet classify every intake field for every deliverable.

**Page order (reader IA, folios 01–05):** Summary · Look (renders as 02a Color + 02b Typography) · Personality · Voice · Examples. The five-section nav contract is unchanged; "Look" is highlighted across both physical pages 02a and 02b, which share the internal section id `look`. Rationale in §10A.10; deterministic split contract in §10A.12.

| Intake (primary) | Role | How the guide uses it |
|------------------|------|------------------------|
| `step1.guideFocus` | **signal** | Maps to `signals.emphasis` (voice / visual / handoff / action) → editorial density, visual occupancy on Voice / Examples / Look pages; also selects the deterministic **Voice page bottom band** copy on folio 04. |
| `step1.stage` | **signal** | With touchpoint count, contributes to `signals.contentDensityBias` (−1 / 0 / +1): trims or enriches sample-phrase caps and max before/after pairs. |
| `step1.touchpoints` | **signal** (+ one **surface** string) | Normalized ids → `touchpointCount` and stage/touch bias; first label → `primaryTouchpoint` for copy in application lead and related strings. Also clusters selected channels into up to three **plain-English CTA surfaces** on folio 05 (`examples.ctaSurfaces`: Website / Email / social touchpoint labels joined for the nested module title / Marketplace / Directory listing) while keeping internal ids as `signal`. |
| `step1.industry` | **signal** | Compliance-heavy industries (`legal_professional_services`, `finance`, `health_wellness`) nudge density **down** one step (merged with stage/touch bias, then clamped to −1 / 0 / +1). |
| `step3.voiceSliders` | **signal** | High average of warmth + energy + playfulness nudges density **up**; very high formality **and** directness together nudge **down** (same merged bias). |
| `step1.primaryGoal` | **signal** + shape selector | Stored on `signals`; this is the **first-order CTA router** for folio 05 and selects both generic `examples.ctaTemplates` and per-surface `examples.ctaSurfaces` lines. Goal family (`direct_sales` / `lead_gen` / `audience_growth` / `retention`) chooses baseline action intent first; downstream signals can modulate wording but do not override goal family. |
| `step1.businessName`, offer / industry / narrator (via blocks) | **surface** (assembled) | Feeds Brand Brief–derived blocks that populate summary and trust-&-story prose; seeds `summary.oneLine` (paste-able one-liner). |
| `step2` customer copy | **surface** (assembled) | Ideal customer, pain/outcomes feed overview and trust-&-story via `brandBriefBlocks`. |
| `step3` tone + sliders | **surface** + **signal** | Traits list (surface); sliders influence trait keywords (signal for voice density). |
| `step4.values` | **surface** | Up to three guiding traits on folio 01 (Summary). |
| `step6` palette + style | **surface** | On folio 02a (Look — Color): the `model.visual.summary` paragraphs (`systemCharacter` + `usageDiscipline`) and the `visualKeywords` line (comma-separated, same `guideInlineTraits` + `GuideOpenModule` label pattern as folio 01 *Core values* and folio 04 *Traits*) render in a narrow left column; a tall row of flush, square-cornered swatches (`visual.swatches` + `GuideEqualSwatchRow`) renders in the wide right column (no standalone `PALETTE` label, no page deck). The model still carries `visualCaption` and `imageryDirection` for non-guide consumers but they are **not surfaced** on 02a. On folio 02b (Look — Typography): typeface cards (`visual.typography.typefaceSpecimens`) plus a bottom band with a **narrow rail** (`visual.typography.wordmarkBandRail`: fonts intro, wordmark explainer, compact font links) and a **2×2** brand-name grid from `wordmarkColorBlocks` — weight ladder + `Aa` only in the PDF; the brand name is not used as the type sample. |
| `step1.businessName` (re-used on folio 02b) | **surface** | The brand name is rendered inside each `visual.typography.wordmarkColorBlocks` slot so the reader sees their own name in up to four different palette color combinations — see §10A.12. |
| `step7.differentiation` (optional) | **surface** when present | Differentiator line when credible; otherwise omitted at model layer. |
| Generated blocks: brand story angle | **surface** only when strong | Short or generic story arcs are **dropped** (no story-style arc on folio 03); substantive threshold is word-count based in the model. When dropped, folio 03 keeps the **one-line brand statement** (`summary.oneLine`) as the pull quote fallback and still renders one trust cue inline. Personality enrichment is carried by deterministic narrow-column blocks (`feelAdjectives` + optional editorial triplet / `standsForLine`), the `positioning.behavior` three-line block (rule-separated in the PDF), and one signal-shaped trust cue — see §10A.7 and §10A.13. |
| Generated blocks: before / after examples | **surface** when strong | Pairs below minimum length are **filtered out**; max pairs also depend on emphasis + `contentDensityBias`. |
| Derived: `summary.oneLine` | **surface** (composed) | Short paste-able brand statement (lead + transformation from the anchor, minus the trailing tone clause). Rendered as the Summary hero quote (folio 01) and surfaced on folio 03 (Personality) when no `storyNote` qualifies. |
| Derived: `visual.swatches` | **surface** (composed) | Equally-sized swatches with the hex and a deterministic friendly name (`friendlyColorName`, e.g. *Deep Navy*, *Pale Sky*) — surfaced on folio 02a in place of the retired `paletteRoleLines` / `paletteRolesProse` / `paletteMood` fields. The Brand Identity Guide intentionally drops role prescription (*Primary / Supporting / Accent / Canvas*); the legacy Style Guide PDF still consumes `paletteColorRolesParagraph` from `coreAssembly.ts` for backwards compatibility. |
| Derived: `visual.typography.wordmarkColorBlocks` | **surface** (composed) | Up to four deterministic palette pairs `(background, foreground)` from `paletteContrastBlocks`: descending WCAG contrast walk with deterministic tiebreaks, skipping exact duplicates and **chromatic reverses** of pairs already chosen (so the stack is not two inversions of the same two colors). Pairs below `1.5:1` are omitted. Rendered as a 2x2 brand-name color grid on folio 02b (top-left = highest contrast, reading order left-to-right, top-to-bottom). |
| Derived: `visual.typography.wordmarkBandRail` | **surface** (composed) | Folio 02b bottom-band left rail: `composeTypographyWordmarkRail` in `typographyWordmarkRail.ts` — `fontIntro`, `wordmarkIntro`, `downloadLinks` (`typographyDownloadLinks`), `licensing` (`typographyFooterParts`). See §10A.12 contract item **2a**. |
| Derived: `visual.typography.typefaceSpecimens` | **surface** (composed) | One card per registered face (`faceLabel`, `pdfFamily`, `roleEyebrow`). The PDF renders a standard weight ladder (*Light* / *Regular* / *SemiBold* / *Bold* / *Italic* — each word in that weight) plus a single `Aa` pair; the brand name is not used here. |
| Derived: `visual.typography.applications` | **surface** (composed) | Face + use-case row per registered specimen, available to downstream consumers on folio 02. The specimen module’s role eyebrow already renders this information directly above each face. |
| Derived: `examples.ctaTemplates` | **surface** (composed) | 2-3 copy-ready CTA lines shaped by `primaryGoal`. Rendered on folio 05 **only when** `examples.ctaSurfaces` is empty (no touchpoints selected); otherwise the PDF prefers the surface stack so the page stays scannable. Replaces the previous abstract “Calls to action” column on the Voice page. |
| Derived: `examples.ctaSurfaces` | **surface** (composed) | When `step1.touchpoints` resolves to at least one id, folio 05 renders a parent **Calls to action** module, then **stacked nested modules** (plain-English per-surface labels) with **at most three surfaces** and **up to two lines each**, biased by `signals.contentDensityBias` (sparse layouts cap at two surfaces). CTA copy now follows deterministic **signal precedence**: `primaryGoal` -> selected surface/touchpoint family -> operating/offer context -> industry and stage risk trim -> voice modulation. Social copy still uses stable tone/platform family routing (e.g. LinkedIn/YouTube -> more formal framing; Instagram/TikTok -> shorter caption-native asks). Lines are de-duplicated against `examples.samplePhrases`, `examples.doLines`, and `examples.ctaTemplates` using the same normalization discipline as other Examples de-dupe. Surface CTA strings avoid em-dash stacking in favor of periods, commas, or semicolons (see project writing rules in this doc). External writing constraints: NN/g guidance to avoid vague “get started”-style commands in favor of specific, outcome-led verbs ([“Get Started” Stops Users](https://www.nngroup.com/articles/get-started/)) and WCAG-adjacent hygiene for strings that could become link/button labels (clear verb-led phrasing; avoid “click here” patterns) ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Understanding 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)). |

**`drop_or_defer` (guide-only examples):** boilerplate differentiation, generic story sentences, and thin before/after lines are dropped in the model so they do not consume page space.

### 10A.6 Deterministic trim order (guide model)

When content is sparse (`contentDensityBias === -1`), the model trims in this **order** (later items are cut first so the guide keeps the strongest material):

1. **Voice:** fewer writing rules and messaging angles (caps drop from 3 to 2 lines each).
2. **Examples:** lower sample-phrase cap and at most one before/after pair (already tied to bias + emphasis).
3. **Story:** thin brand-story notes are omitted entirely (no story paragraph on page 02; application framing dek + snapshot may still appear).
4. **Before / after:** insubstantive pairs are removed before pair-count limits apply.

`guideFocus` / `emphasis` still sets the baseline caps; merged **stage + touchpoints + industry + sliders** bias shifts those baselines without changing the five-page IA.

The Examples spread keeps the **split rail** (before/after or figure mat in the main column, Do/avoid in the side column) for all density levels; **`contentDensityBias`** and omission rules only reduce **how much** copy appears, not the column structure.

### 10A.6A Examples — surface-aware CTAs (folio 05)

**Authoritative playbook:** [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md) defines the **north star** (what each frame is imitating), **hard guardrails**, **anti-patterns**, engineering workflow, and QA so in-context shells do not drift into tutorial cards or multi-caption layouts.

**Placement:** folio 05 renders *Calls to action* in a **full-width band** below the *Sample lines* / editorial two-column row (not inside the narrow sample column).

**Rendering rule:** when `examples.ctaSurfaces` is non-empty, the PDF renders an outer **`Calls to action`** `GuideOpenModule`, then **one nested `GuideOpenModule` per surface** (label = plain English; body = numbered `GuideListBlock` **or** an in-context vector frame when `presentation.frameId` is set). When touchpoints are empty, the legacy single *Calls to action* module (`examples.ctaTemplates`) still renders so the spread never ships without paste-ready CTAs.

**In-context frames (v0):** when `examples.ctaSurfaces[].presentation.frameId` is set, folio 05 renders a **vector surface shell** (neutral chrome, media/link/text region, **one caption block** that joins up to two composed strings with a single space so it reads as one paste field) instead of a bare numbered list for that surface. Social ships eight frame ids: `social_feed_v1`, `social_story_v1`, `social_reel_cover_v1`, `social_grid_photo_v1`, `social_pin_standard_v1`, `social_carousel_v1`, `social_link_preview_v1`, `social_text_only_v1`. Email ships `email_text_only_v1` and `email_image_v1`. Marketplace ships `marketplace_listing_v1` (generic listing card with square product image, title/meta placeholders, price and rating row, short CTA line). Directory ships `directory_post_offer_v1` (local business post card: name and time, headline placeholders, wide photo strip, merged body, action links) and `directory_sponsored_listing_v1` (sponsored listing card: disclosure, title, rating row, thumb + snippet placeholders, merged body, Call chip + Website text; live directory ads vary by goal). Website ships `website_hero_cta_v1` (homepage or landing hero: title row, hero image band, headline placeholders, merged body, neutral primary chip). The directory `frameId` follows the **first** selected directory touchpoint in intake order: `google_business`, `apple_maps`, and `nextdoor` map to the post card; `yelp`, `tripadvisor`, and `bing_places` map to the sponsored listing card. For social, `presentation.platformSummary` matches the nested module label (which channels you picked), `presentation.socialSurfaceFamily` captures feed/story/reel/grid/pin_standard/carousel/link_preview/text_only mapping, and `presentation.socialFeedVariant` applies only to `social_feed_v1` geometry. For email, `presentation.emailSurfaceFamily` captures `text_only` / `image`. For marketplace, `presentation.marketplaceSurfaceFamily` is `listing`. For directory, `presentation.directorySurfaceFamily` is `post_offer` or `sponsored_listing` to match the chosen frame. For website, `presentation.websiteSurfaceFamily` is `hero`. Fixed geometry constants are defined in `socialFeedLayout.ts` per the playbook. Process, naming, and the expansion matrix live in [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md). Research memo for platform marketing post/ad surfaces: [`docs/research/CTA_PLATFORM_MARKETING_SURFACES.md`](docs/research/CTA_PLATFORM_MARKETING_SURFACES.md). Scaffold: `npm run new-cta-frame -- --id=my_frame_v1` from `packages/generation`.

**Selection order (deterministic, capped):** Website (`website` / `blog`) → Email (`email_newsletter`) → Directory listing (any touchpoint in the `online_directory` bucket) → Marketplace (any touchpoint in the `marketplace` bucket) → Social (any touchpoint in the `social` bucket; nested module title lists selected channel labels). The list is truncated to **two or three** surfaces depending on `signals.contentDensityBias`.

**CTA composition policy (deterministic):**

1. **Action-first clarity:** each line should make the next action explicit for that surface (`shop`, `book`, `reply`, `message`, `save`, `call`, etc.).
2. **Outcome specificity:** prefer concrete value/outcome wording over generic prompts.
3. **Expectation setting:** where plausible, include what happens next (response window, process step, or fulfillment cue).
4. **Friction reduction:** allow concise reassurance language (time, effort, simplicity) when truthful.
5. **Persuasion controls:** urgency/scarcity language is allowed only when framed as a realistic operating cue; never invent hard deadlines, stock levels, or unsupported exclusivity.
6. **Human reader voice:** avoid internal strategy jargon in reader-visible CTA strings (no analyst phrasing such as "friction," "route," or optimization meta-language). CTA copy should read like real brand messaging for the channel.

**Prohibited CTA tactics (reader trust guard):**

- fake scarcity or fabricated countdown language
- unsupported guarantees or fabricated social proof
- manipulative pressure language ("act now or miss out forever" patterns)
- ambiguous generic commands without a concrete next step (standalone "Get started"/"Learn more"-style filler in conversion slots)

These policy rules are grounded in `docs/research/CTA_COMPOSITION_MARKETING_RESEARCH_2026-04.md` and should remain deterministic/testable in model code.

**Deterministic variant-selection contract (v2):**

- CTA composition is layered in this strict order: signal routing -> slot composition -> variant selection -> dedupe/caps.
- Variant selection is stable for the same invariant input bundle (`primaryGoal`, surface family, touchpoints, operating model, offer/delivery, stage, industry risk profile, tone family, pain/outcome hints). No randomness is allowed in CTA string selection.
- Variant spread is allowed only by deterministic hashing of the invariant bundle plus slot scope; this improves cross-fixture lexical diversity while preserving same-input reproducibility.
- Variant sets must remain policy-compliant before selection (no fabricated scarcity/proof, no manipulative pressure, no internal/meta strategy vocabulary).
- Anti-homogeneity expectation: fixture cohorts with the same goal but different signal bundles should produce materially distinct CTA lines for at least one shared surface family without breaking six-page layout contracts.

**Industry-aware paste-ready routing (v3):**

- Canonical `step1.industry` ids map to a small **industry group** enum in [`packages/generation/src/deterministic/ctaIndustryGroups.ts`](packages/generation/src/deterministic/ctaIndustryGroups.ts) (e.g. trades/home, food/hospitality, regulated services). Groups tune verb choices (estimate vs order vs consultation) without exposing taxonomy labels to readers.
- **`tonePreset`** (`friendly` / `professional` / `bold`) routes **voice temperature** for CTA wording alongside **`CtaSurfaceActionMode`** (still derived from `primaryGoal`, surface, and offer/service signals).
- **`socialTone`** (casual vs professional platform family from selected social ids) remains separate from `tonePreset`; both influence social paste lines.
- Lines aim to read as **paste-ready channel copy**: line 1 is a concrete ask; line 2 is a second ask or a tight support line—avoid long instructional narration in reader-visible slots.

**Prescriptive phrase banks (v4):**

- Surface CTAs and fallback **`ctaTemplates`** resolve from generated **`packages/generation/src/deterministic/ctaPhraseBankPrescriptive.gen.ts`** (built by `scripts/gen-cta-phrase-banks.mjs` from the authoring markdown). Strings are **verbatim** in-repo; edits follow product policy (e.g. dash-density passes), not paraphrase.
- **Directory** phrase routing follows **`directoryListingFamilyFromPrimaryId`** (same mapping as directory `frameId`): Google-style **`post_offer`** vs Yelp-class **`sponsored_listing`**.
- **`tonePreset` empty:** `normalizeCtaVoiceTone` uses LinkedIn/YouTube (`socialTone === 'professional'`) → **professional** voice bucket; otherwise → **friendly** (casual social or no social in mix).
- **Sensitive density trim:** extra-soft **`phraseLowPressure`** applies only when `riskProfile === 'sensitive_industry'` **and** the industry group is **not** already authored softly (**`regulated_services`**, **`health_wellness`**).
- **Single-line CTAs:** variant pairs may use an empty second string; renderers skip blank lines after dedupe.

**Layout budget (folio 05):** The Examples spread uses a **two-column top row** (~55% body inner width left for *Sample lines* plus a flex spacer for an L-shaped band beside tall *Before / after*; *Before / after* only on the right — **Do / avoid** renders on **folio 04 Voice**), then a **below-the-fold** band that is still **one horizontal row** in the PDF: a **fixed-width CTA column** (~**80.5%** of **704 pt** inner body, floor **~563 pt** so `desktop_compact_row` fits) + **12 pt** vertical rule + **`flex: 1` editorial rail**. In-context shells render inside the CTA column only (not “full body width” for each card — wide shells use **`DESKTOP_WIDE_CARD_OUTER_WIDTH_PT`** or column **`alignItems: 'stretch'`** where appropriate). Templates for **two** surfaces use **`ctaFolioTemplate.ts`** (`two_mobile_row`, `mobile_desktop_row`, `desktop_compact_row`, or **`stack_vertical`** when both surfaces are **`desktop_wide`**). The legacy Brand Identity Guide fixture stays **6** physical pages (`core-pdfs`). Authoritative geometry + mapping: [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md#normative-slot-geometry-v1).

**Slot model (v1 shipped):** `mobile_tall` / `desktop_wide` / `compact_chip` classification lives in [`slotClass.ts`](packages/generation/src/pdf/ctaFrames/slotClass.ts); template selection in [`ctaFolioTemplate.ts`](packages/generation/src/pdf/ctaFrames/ctaFolioTemplate.ts). **`social_link_preview_v1` is `desktop_wide`** for layout (matches website hero width in the PDF; avoids squeezing LinkedIn into the **`desktop_compact_row`** narrow column). **Outstanding plan item:** keep improving **CTA line composition** in `composeCtaSurfaceBlocks` / `linesForSurface` *before* adding new `frameId` routes — see refactor plan Page 4 sequencing — but **layout + slot fixes** shipped without waiting on that copy pass.

#### 10A.6A.1 Pro CTA variations (Pro-only AI extension)

For Pro kits, the deterministic folio 05 CTA per surface acts as the **anchor**. Section ID `voice.ctaVariations` (one call per surface from `step1.touchpoints[0..3]`) generates 3–4 alternative phrasings with explicit variation goals so the buyer can A/B test or rotate copy across campaigns.

**Variation intents (starter set):** `more_direct`, `quieter`, `more_inviting`, `more_confident`. Locked for the v1 schema enum so structured outputs validate; expand the enum during fixture review per [`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.11 prompt-change protocol — same pattern as the strategist-jargon banlist (starter list, not exhaustive).

**Constraints:**

- Each variation ≤ 8 words.
- Inherits [`CTA_COPY_RULES.md`](packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) em-dash-as-period rule and full avoid list.
- Anchor CTA stays in deterministic folio 05; variations ship in CSP page 2 (`csp.ctas`) and Voice Playbook page 3 (`voice.ctaVariations`).
- No fabricated offers or overstated outcomes.
- Banned-vocab walker per [`AI_INTEGRATION_PLAYBOOK.md`](docs/research/AI_INTEGRATION_PLAYBOOK.md) §12.10.

**Failure path:** if the variations call fails for a surface, the CSP CTA section for that surface ships anchor only (no variations) and the CSP PDF still assembles. The kit never blocks on variation failure.

### 10A.7 Personality page (folio 03) editorial contract

**Navigation label:** *Personality*. Appears as **folio 03** under the reader IA (§10A.10 ordering rationale). The earlier labels *"Trust & story"* and *"Position & trust"*, plus in-body phrases like *"rollout frame"*, *"first surface"*, *"core shift"*, *"handoff"*, and *"application snapshot"* are retired — see §10A.9 Reader vocabulary. The broadening from a narrow *trust & story* angle to *personality* was a deliberate decision to raise content density and align the page with small-business brand-kit practice (where this slot commonly carries feel, promise, and one credibility cue); see `docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md` dated entry.

**Job of this spread:** show *how the brand should come across* — what it feels like, what it stands for, and one reason to trust it. It is not a founder story, not a positioning statement in the marketing sense, and not a rollout plan.

**Layout:** two-column shell (`guideTwoColumnSpreadRow`), shared with folio 02a. Narrow left column (`flex 0.34`) is an **open editorial rail**: a small-caps **Brand heart** eyebrow, then **Feel** + triplet/fallback as `GuideOpenModule` blocks separated by hairline rules (no tinted `GuideCard` wrapper). Wide right column (`flex 1`) with a hairline left border holds the focus lead, a **display quote** rail (`guidePersonalityQuotePanel`: left accent rule, no gray fill), **Brand behavior** as three rule-separated rows, then one trust cue closed with a top hairline (`guidePersonalityTrustClose`).

**Fixed content contract (non-marketer readable):**

Narrow column (left):

1. **Feel** (`positioning.feelAdjectives`, always present when the composer can derive them) — 3 adjectives derived from `step3.tonePreset` + `step3.voiceSliders`, rendered as a comma-joined inline list under a small-caps *Feel* label (same visual pattern as folio 02a *Visual keywords* and folio 01 *Core values*). Never rendered as prose on folio 03; the prose form `feelLine` is signal-only (kept for non-PDF consumers and for the generic trust-cue body fallback).
2. **Personality narrative block** (exactly one branch):
   - **Editorial triplet** (`positioning.editorialTriplet`) with three labeled lines: **Vision**, **Mission**, **Promise**, composed by `composePersonalityEditorialTriplet(form, signals, context)`.
   - **Fallback**: **What it stands for** (`positioning.standsForLine`, single concise sentence) composed by `composePersonalityStandsFor` in priority order: qualifying `step4.missionStatement` → qualifying `step5.motivation` → narrator-keyed fallback from `STANDS_FOR_BY_NARRATOR` (five entries, one per `NarratorId`).
   Sparse rule: when `signals.contentDensityBias === -1`, the richer triplet is omitted. A short intake-derived `standsForLine` may still render so the page does not collapse to Feel + generic trust; narrator fallback lines stay omitted in sparse mode.

Wide column (right):

3. **Focus lead** (`positioning.focusLead`, always present) — plain-language statement from `guideFocus` describing what this brand should do better now.
4. **Framing body** (always present), exactly one of:
   - **Story paragraph** (`storyNote`) — the gradient pull quote; only when it satisfies **§10A.7.1** (not merely length). When present, it is the framing body.
   - **One-line brand statement** (`positioning.oneLine`, mirror of `summary.oneLine`) rendered as a pull quote. When `storyNote` is present, `oneLine` is omitted to avoid overload.
5. **Brand behavior** (`positioning.behavior`) — three practical lines rendered as **Shows up as**, **Avoids**, and **Earns trust by**. These translate tone, industry, Step 2 pain/outcome, and Step 7 competitor signals into behavior guidance without surfacing raw lists or taxonomy labels.
6. **One trust cue** (`positioning.trustCue`, exactly one of the following kinds per render, selected in this priority order by `selectPositioningTrustCue`):
   - `differentiator` — when `step7.differentiation` is present and passes the generic-phrase filter.
   - `collaborator` — when `emphasis === 'handoff'` (label: *For someone helping you*).
   - `generic` — plain trust fallback (no brand-jargon phrasing such as *"trustworthy before impressive"* meta-copy).

   The trust cue body may be sharpened by `step2.desiredOutcomes`, `step2.painPoints`, `step7.competitors`, and compliance-sensitive `industry` routing. It renders inline at the bottom of the wide column and is not duplicated elsewhere on the page.

#### 10A.7.1 Framing body / gradient pull quote (`storyNote`)

**Job:** Give **one short, quotable arc** that connects lived context to **why this brand’s way of showing up makes sense** on a spread titled *How your brand should come across*. It is **not** a founder bio, not a second Summary line, and not an observation that stops at pain (“saw X struggle”) without a **stance or consequence** beat.

**Why we compose this separately (product reasoning):**

- Early implementations reused **Brand Brief** “Brand story angle” body or sliced sentences from it. That pulled in Brief-only glue (`ORIGIN_TRUST_SIGNAL` tails), dropped the connecting first sentence, or stitched **observation + observation** — which read as notes, not as *personality*.
- The gradient slot has **high visual weight**; weak copy is worse than falling back to **`summary.oneLine`**. Per **§2.2a**, **Core** kits must not depend on Pro-only story fields; when those fields are absent or thin, **`storyNote` is omitted** and the quote rail shows **`oneLine`**.
- The composer’s job is a **small causal arc** (context → why it matters for how you show up), not a full origin essay.

**Quality bar (all must hold for `storyNote` to render):**

1. **Named anchor.** Include **`step1.businessName`** in the composed paragraph whenever `storyNote` is the story-style framing body (the **`oneLine`** mirror does not require this; it already carries the anchor elsewhere on folio 01).

2. **Closing beat is stance or consequence.** The final sentence must **not** be observation-only (e.g. peer struggle, market gap) **unless** the same paragraph already lands commitment (second sentence or merged consequence). **Trailing** observation-only lines are rejected.

3. **Allowed sources.** In the **Core deterministic path**, **`storyNote` is optional** — do not require Pro-only freeform fields for base output. When present (Pro exports, fixtures, legacy JSON): primary prose inputs are **`step5.originSummary`** and **`step5.motivation`**. To complete the stance beat **without inventing product claims**, the composer may use qualifying **`step4.missionStatement`** as a **commitment clause** when the motivation is observation-shaped. Do not paste Brand Brief template boilerplate (e.g. archetype label sentences, `ORIGIN_TRUST_SIGNAL` clauses) into the quote.

4. **Perspective (default subject for bare mission text).** When the mission line is attached without a leading **I** / **we**, default to **`I`** for **`solo_expert`**, **`solo_maker`**, and empty narrator; default to **`we`** for **`local_team`**, **`product_led`**, and **`mission_community`**. If the user already wrote **I** or **we** at the start of the mission line, keep their wording.

**Composer mechanics (normative, `composePersonalityStoryQuote` in [`personalityStoryQuote.ts`](packages/generation/src/deterministic/personalityStoryQuote.ts)):**

- **Brand anchor:** If `originSummary` does not already contain the business name, prepend **`{businessName}`** or **`At {businessName}, …`** so the quote is anchored to *this* brand.
- **Observation-shaped motivation** (`saw` / `noticed` / … without its own consequence verbs): rewrite the observation into a short **gerund clause** (`seeing …`, `noticing …`) and join **`origin arc` + `after {clause}` + `; {commitment}`**, where **commitment** comes from **`step4.missionStatement`** when needed. Use a **semicolon** between context and commitment — **not** `, so …`, which read too conversational in proof PDFs during review.
- **Non-observation motivation:** Join with **`, and …`** when the combined passage passes an internal **consequence** check (`hasConsequence`).
- **Tone / industry restraint (avoid over-casualizing):** The **`after … ; commitment`** template is **disabled** when **`industry`** is **`legal_professional_services`**, **`finance`**, or **`health_wellness`** (same posture as density-trim / compliance-aware copy elsewhere), **or** when **`tonePreset === 'professional'`** and **`voiceSliders.formality >= 72`**. **Reasoning:** those kits should not read chatty; for observation-only paths this yields **`storyNote` omitted** (gradient falls back to **`oneLine`**). User-authored motivation that already contains clear consequence still qualifies via the non-observation branch when gates pass.
- **Surface gate:** `buildBrandIdentityGuideModel` runs **`refineStoryNoteForGuide`** (minimum word count on the final string) before exposing **`storyNote`** on the model.

**Anti-duplication (same spread):**

- Do not repeat the same sentence as **Vision / Mission / Promise** or **What it stands for**.
- Do not repeat **Brand behavior** rows verbatim.
- If the only way to satisfy (2) is to duplicate **standsForLine** / triplet **verbatim**, **omit `storyNote`** and use **`positioning.oneLine`** instead.

**Fallback ladder:**

1. Compose a paragraph that meets the quality bar, composer mechanics, and anti-duplication rules.
2. If intake cannot support that bar (including typical **Core** payloads with no Pro-only origin/motivation/mission text, or restraint gates that suppress the casual template) → **`storyNote` omitted**; gradient shows **`positioning.oneLine`** (mirror of `summary.oneLine`) only.

**Implementation:** [`personalityStoryQuote.ts`](packages/generation/src/deterministic/personalityStoryQuote.ts) (composition + gates), [`buildBrandIdentityGuideModel`](packages/generation/src/deterministic/brandIdentityGuideModel.ts) (`refineStoryNoteForGuide`), [`personalityStoryQuote.test.ts`](packages/generation/src/deterministic/personalityStoryQuote.test.ts) (unit contract). **`core-pdfs.test.ts`** holds integration regression for the Brand Identity Guide PDF.

**Hard rules:**

- **Never** render `storyNote` unless it satisfies **§10A.7.1** (named anchor when story-style; closing stance/consequence beat; no Brief-template boilerplate in the quote).
- **Never** render more than one trust cue — second-rank cues are dropped, not stacked.
- **Never** render the `feelLine` prose sentence on folio 03 — the adjectives ship as a structured list in the narrow column; the prose sentence is kept as a signal-only fallback for non-PDF consumers.
- **Never** render an application snapshot table, rollout rows, or any *"first touchpoint / first surface / core shift"* row on this page. Those structures are retired.
- **Never** exceed **one em-dash total** across the rendered Vision/Mission/Promise triplet block; the composer normalizes overflow punctuation.
- **Never** expose raw taxonomy labels (`brandNarrator`, `originArchetype`, `audienceId`, `guideFocus`) to the reader. They remain `signal`.
- **Never** repeat the fact-list content from page 01 (name, audience, traits). The framing body rephrases or re-angles, never echoes. Values/traits stay on folio 01 (*Core values*); folio 03 does not restate them.
- **Never** use *"founder,"* *"origin,"* or *"about us"* framing unless a qualifying `storyNote` exists.
- **Never** surface the words *touchpoint*, *surface* (as a noun for a channel), *rollout*, *handoff*, *core shift*, *active surfaces*, *guardrails*, or *off-brand* in reader-visible prose (see §10A.9).

**Signal hooks (shape selection, never surface):**

- `step1.guideFocus` — selects the positioning dek and the focus lead variant.
- `step1.brandNarrator` — selects both `STANDS_FOR_BY_NARRATOR` fallback and the narrator family for `TEMPLATE_BY_NARRATOR_AND_TONE` triplet branches.
- `step3.tonePreset` + `step3.voiceSliders` — drive `feelAdjectives` and the derived `feelLine`.
- `step4.missionStatement`, `step5.motivation`, `step5.originSummary` — intake sources for triplet slots when concrete; see `composePersonalityEditorialTriplet` and `composePersonalityStandsFor`.
- `signals.contentDensityBias` — when `-1`, richer triplet enrichment is omitted; short intake-derived `standsForLine` can remain, while narrator fallback is still dropped.
- `step1.industry` — trims or softens trust-cue language in compliance-sensitive sets (see §10A.5).
- `step7.differentiation` — when substantive, promotes the trust cue to `differentiator`.
- `step7.competitors`, `step2.painPoints`, `step2.desiredOutcomes` — sharpen the trust cue and Brand behavior copy, but do not earn their own lists or comparison blocks here.

**What is explicitly *not* on this page:**

- A competitor comparison block or pills.
- Pain / outcome lists.
- Archetype or narrator descriptions.
- A second trust cue "just in case."
- Any table, grid, or row layout labeled with intake signal names.
- A values / traits block (kept on folio 01 to avoid duplication).
- A *Who it's for* audience anchor (kept in the folio 01 fact list to avoid duplication).

### 10A.8 Before / after example quality rubric (folio 05)

A before / after pair only earns page space when it teaches one **copy pattern** the reader can reuse. Length alone (see §10A.6) is necessary but not sufficient. The model enforces this via `isQualifyingBeforeAfterPair`.

**A qualifying pair meets all of:**

1. **Channel-relevant labeling** — the label reflects **where** this copy would live (e.g. *Homepage subhead*, *LinkedIn hook*, *Booking CTA*, *Listing intro*). Generic labels (*Example 1*, *Sample*, *Before / After*) are rejected by `GENERIC_BEFORE_AFTER_LABEL_RE`.
2. **Different pattern** — After differs from Before by more than a synonym swap. The model computes a normalized Levenshtein distance (`normalizeBeforeAfter` + `levenshteinDistance`) and drops pairs below the minimum edit-distance floor.
3. **Copy-ready voice** — After reads on-brand for the current `tonePreset` / sliders and does not include brand terminology (*“position ourselves as…”*) or meta-commentary (*“in a friendlier tone,” “more on-brand,” “add more personality”*). Meta-commentary is rejected by `META_COMMENTARY_PATTERNS`.
4. **Substantive length** — both Before and After clear the minimum character threshold in §10A.6.

**Disqualifiers (drop the pair):**

- Label matches the generic-label regex.
- After is a synonym-only rephrase of Before (edit distance below floor).
- Either side contains meta-commentary about tone, voice, or branding work.
- Either side references archetypes, internal taxonomy, or the “system.”

**Trim order within the Examples spread:**

1. Drop pairs that fail any rule above (rubric filter).
2. Apply emphasis + `contentDensityBias` caps to remaining pairs.
3. When the resulting pair count is **0**, the model raises `effectiveMaxSamplePhrases` to the upper cap (6) so Sample Phrases + Do / Avoid carry the page. The empty before/after figure mat placeholder is **not** rendered.

**Signal hooks (shape selection, never surface):**

- `step1.touchpoints[0]` + touchpoint cluster — selects **label vocabulary** (storefront vs digital vs marketplace vs service).
- `step1.primaryGoal` — biases the **After** toward the matching CTA shape (lead gen vs direct sales vs discovery vs retention).
- `step1.industry` — removes risky claim patterns in compliance-sensitive sets.

### 10A.9 Reader vocabulary (plain-language guard)

Reader-visible guide prose must read as a plain document a non-marketer can scan. The following terms are **banned** anywhere in rendered model strings; tests assert this via a banned-terms guard in `core-pdfs.test.ts`.

**Banned in reader-visible output:**

- *touchpoint*, *touchpoints*, *primary touchpoint*, *active touchpoints*, *active surfaces*
- *surface* used as a noun for a channel (“first surface”, “the surface”) — the word *background* is used for color-role copy instead
- *rollout*, *handoff*, *core shift*, *application snapshot*
- *palette mood* (model field name retired; duplicates `visualKeywords` + caption — the retired `paletteMood`, `paletteRolesProse`, and (on the guide path) `paletteRoleLines` fields are replaced by `swatches` + `visualCaption` — see §10A.12)
- *guardrails*, *off-brand*, *quick-start*, *angles* (as a standalone label)
- *contract* (as reader copy; acceptable inside this spec)
- *spread* when used to mean “this page”

**Banned in the page-title slot only** (`editorial.title`; allowed in body / dek where the phrasing sometimes earns its place):

- *Use this page when…* and any title that opens by instructing the reader how to use the page — the title slot is for a label, not a tooltip.
- *land* in the positioning sense (“how this brand should land”) — marketer jargon.
- *in practice* — jargon-adjacent and vague when used as a title qualifier.
- Imperative title openers (*Build…*, *Show…*, *Use…*, *Pick…*) — titles label the artifact on the page in the reader’s possessive voice (*Your X*, *How your brand X*); instructions belong in the dek slot or body.

**Approved replacements (examples):**

| Banned | Use instead |
|--------|------|
| *Primary touchpoint* | *your main channel*, or the concrete channel name |
| *First surface* | *where to start*, or the concrete channel name |
| *Core shift* | *what changes for them* |
| *Rollout* | *update*, *apply* |
| *Handoff* | *for someone helping you* |
| *Angles* (label) | *What to talk about* |
| *Active surfaces* | *the rest* |
| *Guardrails* | *limits*, *rules* |
| *Background* (color role) | *background* (do not use “surface”) |

**Enforcement points:**

- `focusMeta`, `voicePageBottomBandBody`, `positioningDek`, `friendlyColorName`, and the feel-line + trust-cue helpers are authored in reader vocabulary directly.
- The previous "application reference" surface (`applicationLead` / `applicationBullets` / the `normalizeApplicationBullet` rewriter) was removed when folio 02 split into 02a Color and 02b Typography — both pages now *show* application instead of describing it (see §10A.12).
- `core-pdfs.test.ts > reader-visible guide strings contain no banned vocabulary` recursively walks the rendered `BrandIdentityGuideModel` and fails the build if any banned term appears.

**Navigation label audit (reader-visible):**

| Folio | Nav label | Internal section id | Reader purpose |
|-------|-----------|---------------------|----------------|
| 01 | *Summary* | `summary` | What the brand is, in one scan. |
| 02a | *Look* | `look` (visual) | The colors that make up your brand (rendered without a page deck — title only). |
| 02b | *Look* | `look` (visual) | How your brand name looks in color, plus the typefaces it sits in. |
| 03 | *Personality* | `positioning` | How the brand feels, what it stands for, and one reason to trust it. |
| 04 | *Voice* | `voice` | How it sounds — traits, rules, and what to talk about. |
| 05 | *Examples* | `examples` | How it reads in practice — sample lines, CTAs, before/after. |

Folios `02a` and `02b` are two physical pages that **share** the *Look* nav label and the `look` section id. The reader sees five nav entries; the Look entry stays highlighted across both pages.

Internal section ids (`summary`, `look`, `positioning`, `voice`, `examples`) are non-reader-facing and intentionally stable; the reader-visible **navigation labels** and **folio numbers** are the contract surfaced to users.

### 10A.10 Guide ordering rationale

The reader IA is **Summary → Look → Personality → Voice → Examples**. It is not the producer's content-assembly order (Brief → Playbook → Style Guide). It is the order a non-marketer actually flips through a brand kit.

**Evidence supporting this order:**

- `docs/audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md` (“What the guide should actually show”) lists: *Brand summary → Brand feel → Visual system → Writing system → Apply*. Visual comes **second**, right after the summary. The memo cites small-business brand-guide patterns that prioritize “visual keywords, color, type, and imagery direction” as the top reusable artifacts after the one-line summary.
- Reader mental model for a founder skimming a kit: **summarize** my brand → **visualize** my brand → snapshot of **how it should come across** → reference for when I need to **sound like the brand** → **examples** to crib from.
- Earlier revisions of this spec placed Personality (then labeled *Trust & story*) at folio 02 to match the *Brief → Playbook → Style* producer order. That placement conflicted with the reader-first principle and left the visual-forward readers a full three pages of copy before any palette or type appeared.

**What this ordering protects:**

1. Non-marketer readers get a concrete, reusable artifact on every page in sequence: one-line statement (01) → palette + type (02) → personality + trust cue (03) → voice rules + talking points (04) → paste-ready samples and CTAs (05).
2. Personality (03) shares the 02a two-column shell so the middle of the book reads as a consistent editorial rhythm (palette narrative on 02a, personality narrative on 03) rather than a dense visual page followed by a sparse text page.
3. Examples sits last, so it can reference vocabulary introduced by Voice (folio 04) without forward references.

**What this ordering does not change:**

- Internal section ids (`summary`, `positioning`, `voice`, `examples`, `look`) stay stable — reshuffling those would churn tests and fixture references with no reader-visible benefit.
- §10A.5 role assignments (signal vs surface) remain unchanged.
- The five-section nav contract is fixed; this section only reorders.

**Why Look spans two physical pages (02a Color and 02b Typography):**

Color and typography are both visually-led artifacts that read better with their own page than packed into one busy spread. When they shared a single page, the palette panel, type specimens, and a labeled "Application reference" placeholder competed for room and forced the page to *describe* color application in copy instead of *showing* it. Splitting Look into 02a Color (copy-first, then a tall row of equally-sized swatches with friendly hex names) and 02b Typography (the brand name in up to four contrast-ranked palette color combos plus a standard weight-ladder typeface specimen and `Aa`) preserves the five-section reader nav while giving each visual artifact a scannable, "show don't tell" page. The shared `look` section id keeps the nav highlight unified across both pages. Deterministic contract for the split is in §10A.12.

### 10A.11 Page-copy slot rule (title vs dek vs body)

Every guide page renders three reader-visible copy slots. Each slot has a single, non-overlapping editorial job. Mismatches (instructional copy in the title slot, labels in the body slot) read as awkward to a non-marketer and are blocked by the title-slot guard in §10A.9 + the matching test in `core-pdfs.test.ts > guide page titles read as reader-owned labels, not instructions`.

| Slot | Field on `editorial` | Job | Voice | Length | Examples (current) |
|---|---|---|---|---|---|
| **Title** | `title` | Name the artifact on the page in the reader’s possessive voice. | *Your X* / *How your brand X* / business name. Never an instruction. | ≤ ~6 words | *Your visual system*, *How your brand sounds*, *Your brand voice in use* |
| **Dek** | `deck` (only when `dekMode !== 'none'`) | One-line purpose statement that orients the reader on when to pick this page up. | Description, not instruction. May reference *the brand* / *your X*; must not open with *Use this page…*. | One sentence | *Lines you can copy into your site, posts, and emails.* |
| **Body** | All other model fields surfaced on the page | The brand’s actual content — palette, type, traits, samples, etc. | Plain language per §10A.9; instructional “how to use” bands (e.g. `voicePageBottomBandBody`) are allowed here when explicitly labeled as such. | Per content block | Sample lines, palette role lines, trust cues, etc. |

**Brand Identity Guide PDF (spread header):** as of 2026-04-21, `GuideSpreadHeader` renders **folio + title only** — the `deck` string is **not** painted under the title on any spread, even when `editorial.dekMode === 'full'` and `editorial.deck` is populated on the model. The field remains on `BrandIdentityGuideModel` for non-PDF consumers, contract tests, and a future decision on whether to surface that copy inside body regions (cards, side rails, or a different page). Inventory of what each `deck` exposed is recorded in [`docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md`](docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) under **Retired spread subtitle (`deck`)**.

**Slot rules that follow from this:**

1. The title slot never carries a verb directed at the reader (*Build…*, *Show…*, *Pick…*, *Use…*).
2. The dek slot is where *“use this page when…”* framing belongs, restated as a description (e.g. *“Pick this up when you need the brand to sound like itself in a hurry.”*). On the Brand Identity Guide PDF path that copy is **not** currently rendered under the title; helpers (`positioningDek`, etc.) still produce `deck` on the model for other surfaces and QA.
3. Helpers that produce dek copy (`positioningDek`, etc.) must return descriptions, not commands. They are authored alongside the other reader-vocabulary helpers in `brandIdentityGuideModel.ts` and are subject to the §10A.9 guard.
4. Body-slot bands that are explicitly *“how to use this page”* artifacts (e.g. `VOICE_PAGE_BOTTOM_BAND_TITLE = 'How to use this page'`) are the only place imperative how-to copy is correct, because the band itself is labeled as such.

### 10A.12 Visual section page split (Color and Typography)

The Look section renders as **two physical pages** that share a single nav entry and the internal section id `look`:

| Folio | Title (`editorial.title`) | Content owner | What renders |
|-------|---------------------------|---------------|--------------|
| `02a` | *Your colors* | `model.visual.editorial` | **Two-column spread** mirroring the redo-dummy color reference (`flex 0.34` narrow column on the left, `flex 1` wide column on the right separated by a hairline left border). The page renders **without a deck** (`editorial.dekMode === 'none'`); the title alone owns the header. **Narrow column:** two short paragraphs from `model.visual.summary` — `systemCharacter` (what the system feels like) followed by `usageDiscipline` (how to apply it) — then a `GuideOpenModule` with label *Visual keywords* and body `visualKeywords.join(', ')` in `guideInlineTraits` (3 keywords from `styleKeywordMap[selectedStyle]`). Both summary paragraphs are written without the lowercase "accent" leftover from the retired role taxonomy and hold at most one em-dash across the combined block. **Wide column:** one row of equally-sized, edge-touching swatches with square corners (`GuideEqualSwatchRow`, fed by `model.visual.swatches`) — each swatch shows a deterministic friendly name (`friendlyColorName`) and the uppercase hex; no `PALETTE` label, no role labels, no flex-weighted widths. Adjacent tiles overlap by 1pt (`marginLeft: -1`) so react-pdf's sub-pixel rounding can't expose a hairline page-background seam between cells. The standalone `visualCaption` and `imageryDirection` lines are **not surfaced** on 02a; they remain on the model for non-guide consumers. |
| `02b` | *Your typography* | `model.visual.typography.editorial` | **No** caption band under the title row (the retired matrix-derived `typography.lead` one-liner was removed). **Two stacked bands** separated by a `0.5pt #EEEEF2` top border on the bottom band. **Top band:** full-width duo `GuideTypefaceSpecimen` `stack` variant — one column per `typefaceSpecimens` entry (role eyebrow + face name, then *Light* / *Regular* / *SemiBold* / *Bold* / *Italic* each set in that weight or style, then `Aa`). The brand name is not used as the typeface sample. **Bottom band:** a **30/70** row — **left rail (~30%)** renders `model.visual.typography.wordmarkBandRail` from `composeTypographyWordmarkRail` in this order: **`fontIntro`** (why these typefaces and roles were chosen), **`wordmarkIntro`** (what the color-name studies represent and how to apply them), then compact download rows + licensing via **`GuideWordmarkRailDownloads`**. Link CTA text is literal: **`Download on Google Fonts`** (no helper mini-header label). **Right column (~70%)** + vertical hairline: `GuideWordmarkColorBlocks` `grid` inside `GuideOpenModule` `fillHeight` — 2×2 tile matrix from up to four `wordmarkColorBlocks`; slot mapping `blocks[0]`→top-left through `blocks[3]`→bottom-right; `marginLeft: -1` / `marginTop: -1` seam overlap as before. Fewer than four blocks when the palette yields fewer strong pairs. |

**Deterministic content contract:**

1. `model.visual.swatches` is one entry per palette row, in source order. Each entry has exactly two keys (`hex`, `name`); no `role` or `flex` is surfaced on the guide path. `name` comes from `friendlyColorName(hex)` (`packages/generation/src/deterministic/colorContrast.ts`) which deterministically buckets `(lightness, hue)` into editorial labels (e.g. *Deep Navy*, *Pale Sky*, *Off White*). Folio 02a renders the swatch row inside the **wide column** of a two-column spread (mirroring the redo-dummy color reference) — no `PALETTE` label, no page deck — with the **narrow column** hosting `model.visual.summary` paragraphs followed by the `visualKeywords` inline trait line (under *Visual keywords* `GuideOpenModule` label). The previous "caption + chips + imagery above the palette" stack is retired.
1a. `model.visual.summary` is composed deterministically by `composeColorSummary` in `packages/generation/src/deterministic/colorSummary.ts` from four inputs: `paletteId`, `tonePreset`, `selectedStyle`, and the same `swatches` array the page renders. It returns exactly two fields:
    - **`systemCharacter`** — `paletteDescriptions[canonicalPaletteId(paletteId)]` (palette feel sentence) followed by a templated tonal-arc closer of the form `"{deepName} carries weight, {midName} keeps the system {styleAdjective}, and {lightName} opens the page up."`. The closer no longer mentions "the accent" — that lowercase leftover from the retired role taxonomy was retired alongside the dictionary rewrite. The deep / mid / light swatch names are picked by ranking `model.visual.swatches` by relative luminance (deepest L\* → `deep`, lightest → `light`, middle index → `mid`); the style adjective comes from `COLOR_SUMMARY_STYLE_ADJECTIVES[selectedStyle]` (`clear`, `graphic`, `warm`, `restrained`).
    - **`usageDiscipline`** — verbatim from the hand-authored `COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE[tonePreset][selectedStyle]` dictionary (3 tones × 4 styles = 12 entries). Concrete descriptive language only (`the deepest tones`, `the boldest tone`, `the brightest swatch`, `the punctuation color`, `the loudest hue`); the lowercase "accent" leftover was retired with the v3 sweep, alongside the capitalized role nouns banned by the 02a guard.
    The composer takes no audience text: the legacy `summary.voiceBridge` and `summary.imagery` fields are retired (audience-driven mid-sentence stitching produced run-on grammar; that signal is now structural via `tonePreset`/`selectedStyle`, not textual). The legacy `visualCaption` and `imageryDirection` fields remain on the model object for non-guide consumers but are **not surfaced** on folio 02a.
2. `model.visual.typography.wordmarkColorBlocks` is up to **four** blocks from `paletteContrastBlocks` in `brandIdentityGuideModel.ts`. Valid pairs are sorted by descending WCAG contrast (shared `contrastRatio` in `colorContrast.ts`); the walker then skips exact duplicates and skips the **chromatic reverse** of an already-chosen pair (same two hexes with background and foreground swapped) so the stack does not read as two inversions of the same pairing. The first kept row is therefore the global maximum-contrast pair. Pairs below `1.5:1` are filtered out. On very small palettes the reverse filter can return **fewer than four** rows. Tiebreaks among equal ratios are deterministic (`background.localeCompare`, then `foreground.localeCompare`).
2a. `model.visual.typography.wordmarkBandRail` is composed in `packages/generation/src/deterministic/typographyWordmarkRail.ts` by `composeTypographyWordmarkRail(form, wordmarkColorBlocks.length)`. It does **not** use `typographySectionLeads` (channel-first matrix copy). Copy uses deterministic style templates keyed by `selectedStyle` (`clean_minimal`, `bold_graphic`, `organic_natural`, `luxe_refined`) so the rail reads like editorial guidance rather than component narration. **`fontIntro`:** first paragraph is rationale-first (why the chosen faces/roles fit), with dedicated branches for Pro `existingTypeface`, two-family systems, and same-family systems. **`wordmarkIntro`:** second paragraph explains that consistent type + palette can carry recognition without a custom logo in every placement, then frames examples as approved options: strongest pair as default, alternates only when format/background needs them. Optional second sentence when `wordmarkColorBlocks.length < 4`. **`downloadLinks`:** `typographyDownloadLinks(form)` (Google Fonts specimen URLs), rendered with CTA text `Download on Google Fonts`. **`licensing`:** `typographyFooterParts(form).licensing` (same source as the Style Guide typography disclaimer).
3. `model.visual.typography.typefaceSpecimens` is one entry per registered face, derived from `model.visual.typography.specimens`, with exactly three keys (`faceLabel`, `pdfFamily`, `roleEyebrow`). The PDF applies a fixed weight ladder (*Light* 300, *Regular* 400, *SemiBold* 600, *Bold* 700, *Italic* 400 italic) plus one `Aa` line in regular weight. The brand name is **not** used as the typeface sample on this page.
4. The Brand Identity Guide path no longer surfaces `paletteRoleLines`, `paletteRolesProse`, `paletteMood`, `wordmarkBrandName`, or `weightLadder`. The legacy Style Guide PDF still consumes `paletteColorRolesParagraph` from `coreAssembly.ts` for backwards compatibility — only the guide drops role prescription.
5. The color page **does not** render a labeled "Application reference" placeholder figure. The previous `applicationLead` / `applicationBullets` model fields and the `normalizeApplicationBullet` rewriter were removed; folio 02a *shows* the swatches directly instead of describing application.
6. Both pages set `activeSection: 'look'` so the nav highlight is shared. Folio strings (`'02a'` / `'02b'`) are surfaced verbatim from each page's `editorial.folio`.
6a. **Spread title row (project-wide):** every guide page renders its title via `GuideSpreadHeader`. On the Brand Identity Guide PDF path, the folio number (`guideFolioNumber`) and page title (`guideSpreadTitle`) both resolve through the guide `displayFamily`, now **Inter 32pt / lineHeight 1.04** — folio at weight 700, title at weight 400. Weight contrast preserves the folio as a marker while keeping one-family alignment in the title row. No subtitle (`editorial.deck`) is rendered under this row on the Brand Identity Guide PDF path — see §10A.11 note above.
7. **Deferred:** an industry-driven `visual_signal` line for `model.visual.summary` is intentionally not yet implemented. The plan is to add a short `visual_signal: string` field per row in `industryProfiles.ts` (priority industries first) and append one optional sentence inside the summary stack when content density allows. Tracked in `docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md` under Folio 02a "Gaps to ideal".
8. **Deferred:** a third axis on the `usageDiscipline` dictionary keyed by `narratorId` (or `whoItsFor` archetype) is also intentionally not yet implemented — the 12 `(tonePreset × selectedStyle)` cells already give the page a meaningful customization floor without any audience-text stitching. Adding the audience axis would expand the dictionary to ~48–72 cells and is deferred until we see whether the v2 reads well without it. Also tracked in `BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md`.

**Tests that hold the contract:**

- `core-pdfs.test.ts > assigns folios to the reader-ordered guide IA (…)` asserts both folios, both `navLabel === 'Look'`, both layouts, both titles, and that the swatch row + 4-block wordmark color stack are present.
- `core-pdfs.test.ts > visual.swatches surfaces equally-sized swatches with friendly names and no role / flex prescription` pins the swatch contract.
- `core-pdfs.test.ts > visual.summary composes system character + usage discipline` pins the new 02a narrow-column summary contract (palette description + tonal-arc closer for `systemCharacter`; verbatim `(tone × style)` dictionary entry for `usageDiscipline`; both fields free of capitalized role nouns).
- `core-pdfs.test.ts > visual.editorial drops the page deck on folio 02a` pins `dekMode === 'none'` and the absence of `editorial.deck` on the colors page.
- `core-pdfs.test.ts > visual.typography.wordmarkColorBlocks renders four contrast-ranked palette pairs in descending contrast order` asserts the 4-block contract above.
- `core-pdfs.test.ts > visual.typography.wordmarkBandRail orders fonts intro, wordmark explainer, and download metadata` and **`…wordmarkBandRail uses existing-typeface intro on Pro…`** assert `wordmarkBandRail` shape, specimen URLs, licensing, and the Pro existing-typeface branch.
- `core-pdfs.test.ts > visual.typography.typefaceSpecimens carries face metadata only (no brand name in model strings)` pins the typeface specimen model contract.
- `core-pdfs.test.ts > color page (02a) drops Primary / Supporting / Accent / Canvas role nouns from every reader-visible string` enforces the role-noun guard on the color page.
- `core-pdfs.test.ts > guide page titles read as reader-owned labels, not instructions` walks both `model.visual.editorial.title` and `model.visual.typography.editorial.title` against the §10A.9 title-slot rules.
- `core-pdfs.test.ts > renders a prototype Brand Identity Guide from legacy fixtures` asserts the rendered PDF has **6 pages** (Examples folio 05: full-width *Calls to action* band + L-shaped top row; *Do / avoid* moved to folio 04 Voice to preserve the page budget).

### 10A.13 Personality page (folio 03) deterministic content contract

The Personality page reuses the 02a two-column shell so folios 02a and 03 share a consistent editorial column rhythm in the middle of the book. The styles `guideTwoColumnSpreadRow`, `guideTwoColumnNarrowCol`, and `guideTwoColumnWideCol` are shared by both pages (renamed from the original 02a-only `guideColorSpread*` triad). Folio 03 adds page-specific composition styles (`guidePersonalityBrandHeartRoot`, `guidePersonalityHeartSectionRule`, `guidePersonalityQuotePanel`, `guidePersonalityWideStack`, `guidePersonalityBehaviorFirstRow` / `guidePersonalityBehaviorRuleRow`, `guidePersonalityTrustClose`) so the page reads as a fuller brand-heart spread with whitespace and hairlines instead of stacked gray cards.

**Deterministic content contract:**

1. **`model.positioning.feelAdjectives`** is composed by `positioningFeelAdjectives(tonePreset, sliders)` in [packages/generation/src/deterministic/brandIdentityGuideModel.ts](packages/generation/src/deterministic/brandIdentityGuideModel.ts). Returns up to 3 deterministic single-word adjectives. Rules:
   - Seeds from `tonePreset`: *friendly* → `warm, approachable`; *professional* → `calm, composed`; *bold* → `direct, confident`.
   - Slider add-ins (in order): `warmth >= 70` → `human`, `directness >= 70` → `clear`, `playfulness >= 70` → `light`, `formality >= 75` → `measured`, `energy >= 75` → `vivid`.
   - De-duplicated, first 3 retained. Can return fewer than 3 only in degenerate cases (missing `tonePreset` and flat sliders); PDF renders the *Feel* block only when `feelAdjectives.length > 0`.
   - Rendered on folio 03 as `feelAdjectives.join(', ')` under a `GuideOpenModule` *Feel* label in `guideInlineTraits` (same pattern as 02a *Visual keywords* and 01 *Core values*).

1a. **`model.positioning.feelLine`** is the prose sentence form of `feelAdjectives` ("It should feel warm, clear, and human."). Retained on the model for non-PDF consumers and for the **generic trust-cue body fallback** in `selectPositioningTrustCue`. **Not rendered** on folio 03 — the adjectives ship as a structured list in the narrow column; rendering both would be redundant.

2. **`model.positioning.editorialTriplet`** is composed by `composePersonalityEditorialTriplet(form, signals, context)` in [packages/generation/src/deterministic/personalityEditorialTriplet.ts](packages/generation/src/deterministic/personalityEditorialTriplet.ts). Contract:
   - Shape: `{ vision, mission, promise }` (all single sentences).
   - Slot-intent checks: `vision` must read as future/outcome, `mission` as action/process, `promise` as reliability/experience.
   - Source priority per slot: concrete intake (`step4.missionStatement`, `step5.motivation`, optional concrete `step5.originSummary`) first, then narrator × tone deterministic template fallback (`TEMPLATE_BY_NARRATOR_AND_TONE`).
   - Anti-dup guard: candidate lines are rejected when overlap score is too high against `summary.oneLine`, `summary.whatWeDo`, `summary.whoItsFor`, `trustCue.body`, and visual summary lines.
   - Global punctuation budget: **max one em-dash across all 3 lines combined** (`enforceGlobalEmDashBudget`).
   - Omitted when `signals.contentDensityBias === -1` or slot validation fails.

2a. **`model.positioning.standsForLine`** remains the concise fallback, composed by `composePersonalityStandsFor(form)` in [packages/generation/src/deterministic/personalityStandsFor.ts](packages/generation/src/deterministic/personalityStandsFor.ts). Priority:
   1. `step4.missionStatement` if concrete (min 6 words, max 32 words, filtered against `UNCONCRETE_PATTERNS` — rejects *"Our mission is to"* preambles, *"change the world"*, *"industry-leading"*, etc.).
   2. `step5.motivation` if concrete (same filter).
   3. Narrator-keyed fallback from the exported `STANDS_FOR_BY_NARRATOR: Record<NarratorId, string>` dictionary (five entries: `solo_expert`, `solo_maker`, `local_team`, `product_led`, `mission_community`). Missing / unknown narrator defaults to `solo_expert`.
   Output always ends with sentence punctuation. Obeys the project-wide **em-dash ≤ 1 per paragraph** rule in §1.0.1. Sparse behavior: when `contentDensityBias === -1`, only short intake-derived mission / motivation lines may remain. Narrator fallback is omitted in sparse mode.

2b. **`model.positioning.storyNote`** is the optional gradient pull quote (`GuidePersonalityQuotePanelWithRadial`). Editorial contract: **§10A.7.1**. Implemented by **`composePersonalityStoryQuote`** — **not** by slicing the Brief “Brand story angle” block. Uses `step5.originSummary` / `step5.motivation` when present; may attach **`step4.missionStatement`** as a commitment clause for observation-shaped motivation (Core-safe: omit quote when those fields are missing). Applies **brand-name anchoring**, **semicolon** join between context and commitment on the observation path, **narrator-based `I`/`we`** defaults for bare mission text, and **industry + professional-formality gates** that suppress the casual causal template so restrained kits do not read chatty. When the contract cannot be met, **`storyNote` is omitted** and **`model.positioning.oneLine`** mirrors `summary.oneLine` for the gradient. Wired in [`buildBrandIdentityGuideModel`](packages/generation/src/deterministic/brandIdentityGuideModel.ts) with **`refineStoryNoteForGuide`** (word-count surface gate).

3. **Render branch in the narrow column:** the narrow column is an **open stack** (mini-header **Brand heart**, then modules). When `editorialTriplet` is present, folio 03 renders three labeled blocks (**Vision**, **Mission**, **Promise**) with hairline dividers between sections (and after **Feel** when both are present). Otherwise it renders the single **What it stands for** block from `standsForLine`.

4. **`model.positioning.behavior`** is a compact three-line value object rendered in the wide column as rule-separated editorial rows (**Shows up as**, **Avoids**, **Earns trust by**):
   - `showsUpAs` from `tonePreset` + `feelAdjectives`.
   - `avoids` from tone and compliance-sensitive industry routing.
   - `earnsTrustBy` from `desiredOutcomes`, then `painPoints`, then `competitors`, with a generic fallback.

5. **`model.positioning.trustCue`** keeps the prior one-cue priority selector: `differentiator` > `collaborator` (when `emphasis === 'handoff'`) > `generic`. The body is now signal-shaped by `desiredOutcomes`, `painPoints`, `competitors`, and compliance-sensitive industry routing. It is rendered inline at the bottom of the wide column, not as a separate side rail.

6. **`model.positioning.editorial.navLabel`** is `'Personality'`. **`title`** is `'How your brand should come across'` (reads as the long form of *Personality* and satisfies the §10A.11 title-slot rule). **`figureLabel`** is no longer populated on the folio 03 editorial meta (the field remains on the `GuideEditorialMeta` type for other surfaces); the prior use was a side-rail label on the retired `HeroRailSpread` layout.

7. **Internal section id** stays `'positioning'` — stable, non-reader-facing, unchanged so tests and fixtures don't churn.

**Tests that hold the contract (see [packages/generation/src/core-pdfs.test.ts](packages/generation/src/core-pdfs.test.ts)):**

- `positioning.feelAdjectives composes 3 deterministic adjectives from tonePreset + sliders` asserts the seed + slider rules and the 3-item cap.
- `positioning.standsForLine prefers concrete missionStatement over narrator fallback` asserts the priority-1 branch.
- `positioning.standsForLine falls back to narrator dictionary when mission and motivation are absent` asserts the priority-3 branch.
- `positioning.standsForLine keeps a short intake-derived line when contentDensityBias === -1` and the narrator-fallback sparse test assert the sparse-bias rules.
- `positioning.behavior adds compact brand behavior lines from voice and trust signals` asserts the behavior value object on the model.
- `positioning trust cue uses Step 2 outcomes and competitor context without adding raw lists` and `positioning trust cue softens claims for compliance-sensitive industries` assert the trust-cue enrichment.
- `folio 03 uses the Personality nav label` asserts `navLabel === 'Personality'` and no stale `figureLabel` on the folio 03 editorial meta.
- [`personalityStoryQuote.test.ts`](packages/generation/src/deterministic/personalityStoryQuote.test.ts) pins **`composePersonalityStoryQuote`** (causal arc, semicolon join, narrator pronoun, formal/industry suppression).
- `reader-visible guide strings contain no banned vocabulary` walks `feelAdjectives`, `standsForLine`, `behavior`, and `trustCue` alongside the existing model strings.

---

## 11) Implementation Checklist

**Order:** Implement **Core deterministic PDFs + tests** first, then **Anthropic (Claude) for Pro sections**, then payment and email (`PHASE_ROADMAP.md` — Recommended implementation order).

- [ ] Define section templates for Core (`core_templates/*.ts`)
- [ ] Define section mode matrix in code (`sectionModes.ts`)
- [ ] Define deterministic scaffold builders for `ai_enhanced` sections
- [ ] Define Pro prompt builders by section (`pro_prompts/*.ts`)
- [ ] Add industry profile dictionary (`industry_profiles.ts`)
- [ ] Add narrator profile dictionary (`narrator_profiles.ts`) — five entries matching §6A.2
- [ ] Wire `narratorProfile` into messaging themes generation (content pillar category set)
- [ ] Wire `narratorProfile` into CSP content pillar prompts (draw from `content_pillars` field)
- [ ] Wire `narratorProfile` into CSP CTA suggestions (`cta_type` drives action category, `tonePreset` drives wording)
- [ ] Wire `narratorProfile.primary_channels` into Quick Start Week 1 actions
- [ ] Wire `narratorProfile.brand_brief_emphasis` into Brand Brief section weight/ordering
- [ ] Wire `narratorProfile.email_tone_pattern` into Voice Playbook email template generation (Pro)
- [ ] Add output QA validator (`validateOutput.ts`)
- [ ] Add repair/fallback path per section
- [ ] Persist sectioned editable outputs
- [ ] Wire section renderer to PDF service (one export job per deliverable PDF; see `DELIVERABLE_PRODUCTION_SPEC.md` — **Delivery bundle format**)

---

## 12) Open Questions

- Should Pro one-liner return 1 or 3 options?
- Should Content Starter Pack be 2 pages fixed or 2-3 pages flexible?
- Should any Core sections receive “lite AI rewrite” in Phase 2?
- Which industries require stricter compliance term filters at launch?
