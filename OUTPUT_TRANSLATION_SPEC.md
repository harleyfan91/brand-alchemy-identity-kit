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

| Document | Section | Core mode | Pro mode |
|---|---|---|---|
| Brand Brief | Brand overview | deterministic | deterministic |
| Brand Brief | Ideal customer | deterministic | ai_enhanced |
| Brand Brief | Core transformation/promise | deterministic | ai_enhanced |
| Brand Brief | Values/positioning cues | deterministic | ai_enhanced |
| Brand Brief | Brand story angle | deterministic | ai_enhanced |
| Brand Brief | Differentiation snapshot | deterministic | ai_enhanced |
| Brand Style Guide | Palette overview | deterministic | deterministic |
| Brand Style Guide | Visual direction summary | deterministic | ai_enhanced |
| Brand Style Guide | Style principles | deterministic | ai_enhanced |
| Brand Style Guide | Do/avoid guidance | deterministic | deterministic |
| Voice & Content Playbook | Tone profile | deterministic | deterministic |
| Voice & Content Playbook | Voice guardrails | deterministic | ai_enhanced |
| Voice & Content Playbook | Messaging themes | deterministic | ai_enhanced |
| Voice & Content Playbook | Sample phrases/language cues | deterministic | ai_enhanced |
| Voice & Content Playbook | Calls to action (CTAs) | deterministic | ai_enhanced |
| Voice & Content Playbook | Writing do/avoid guidance | deterministic | ai_enhanced |
| Voice & Content Playbook | Before/after examples | deterministic | ai_enhanced |
| 30-Day Quick Start Checklist | Week-by-week checklist | deterministic | ai_enhanced (prioritization/order) |
| Content Starter Pack (Pro) | All sections | n/a | ai_only |

---

## 2) Canonical Input Contract (Current)

From `IdentityKitForm` (full data model, all tiers):

- **Schema:** `intakeSchemaVersion` (integer; omitted or `1` = legacy implicit baseline; **`2`** = current intake after operating-model ship). Consumers run `migrateIdentityKitForm` from `@identity-kit/shared` once on read so v1 JSON gains `step1.businessOperatingModel` + version **`2`** without perpetual dual inference paths (Path C).
- Step 1: `businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`, **`businessOperatingModel`** (`customer_visits_us` \| `we_travel_to_customers` \| `online_only` \| `hybrid` \| `mostly_events_or_markets`), `touchpoints`, `primaryGoal`
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

- Step 1: `businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`, `businessOperatingModel` (required before continue on `c1_s2`), `touchpoints` (ordered multi-select), `primaryGoal`
- Step 2: `customerArchetype`
- Step 3: `tonePreset`, `voiceSliders`
- Step 4: `values`
- Step 5: `originArchetype`
- Step 6: `selectedPalette`, `selectedStyle`
- Step 7: `competitors` (optional)

### 2.2 Pro-only additions in survey UI

- Step 2: `painPoints`, `desiredOutcomes`
- Step 3: `customVoiceNotes`
- Step 4: `missionStatement`
- Step 5: `originSummary`, `motivation`
- Step 6: `existingTypeface` (optional), `referenceUploadName`, `colorMoodNotes`, `styleNotes`
- Step 7: `differentiation`

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
| `step6.selectedStyle` | Strong | Style/typography/do-avoid branches across Style Guide + voice bridge. |
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
- optional dek
- prose column + side rail
- quote rail
- compact fact block
- sample copy row
- before / after panel
- palette / type system board
- figure or image mat

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

The `Brand Identity Guide` should remain organized around the existing customer-facing five-page content model.

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

### 10A.5 Brand Identity Guide — intake roles (vertical slice)

This table applies **only** to deterministic assembly in `buildBrandIdentityGuideModel` and the `05-brand-identity-guide.pdf` render path. It does not yet classify every intake field for every deliverable.

| Intake (primary) | Role | How the guide uses it |
|------------------|------|------------------------|
| `step1.guideFocus` | **signal** | Maps to `signals.emphasis` (voice / visual / handoff / action) → editorial density, visual occupancy on voice / examples / look pages. |
| `step1.stage` | **signal** | With touchpoint count, sets `signals.contentDensityBias` (−1 / 0 / +1): trims or enriches sample-phrase caps and max before/after pairs. |
| `step1.touchpoints` | **signal** (+ one **surface** string) | Normalized ids → `touchpointCount` and bias; first label → `primaryTouchpoint` for copy in application lead and related strings. |
| `step1.primaryGoal` | **signal** | Stored on `signals`; available for future density or ordering (currently not heavily branching in the guide). |
| `step1.businessName`, offer / industry / narrator (via blocks) | **surface** (assembled) | Feeds Brand Brief–derived blocks that populate summary and positioning prose. |
| `step2` customer copy | **surface** (assembled) | Ideal customer, pain/outcomes feed overview and positioning via `brandBriefBlocks`. |
| `step3` tone + sliders | **surface** + **signal** | Traits list (surface); sliders influence trait keywords (signal for voice density). |
| `step4.values` | **surface** | Up to three guiding traits on page 1. |
| `step6` palette + style | **surface** | Palette rows, style keywords, typography specimens on the look page. |
| `step7.differentiation` (optional) | **surface** when present | Differentiator line when credible; otherwise omitted at model layer. |
| Generated blocks: brand story angle | **surface** only when strong | Short or generic story arcs are **dropped** (no positioning dek); substantive threshold is word-count based in the model. |
| Generated blocks: before / after examples | **surface** when strong | Pairs below minimum length are **filtered out**; max pairs also depend on emphasis + `contentDensityBias`. |

**`drop_or_defer` (guide-only examples):** boilerplate differentiation, generic story sentences, and thin before/after lines are dropped in the model so they do not consume page space.

### 10A.6 Deterministic trim order (guide model)

When content is sparse (`contentDensityBias === -1`), the model trims in this **order** (later items are cut first so the guide keeps the strongest material):

1. **Voice:** fewer writing rules and messaging angles (caps drop from 3 to 2 lines each).
2. **Examples:** lower sample-phrase cap and at most one before/after pair (already tied to bias + emphasis).
3. **Story:** thin brand-story notes are omitted entirely (no positioning dek).
4. **Before / after:** insubstantive pairs are removed before pair-count limits apply.

`guideFocus` / `emphasis` still sets the baseline caps; bias shifts those baselines without changing the five-page IA.

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
