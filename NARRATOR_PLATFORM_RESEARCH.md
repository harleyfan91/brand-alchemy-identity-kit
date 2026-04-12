# Research: Brand narrator semantics vs platforms

**Date:** 2026-04-11  
**Scope:** Read-only audit per plan — how `step1.brandNarrator` interacts with `touchpoints`, `primaryGoal`, and industry in **code** vs **specs**; UI guardrails; recommendations (no implementation in this pass).

**Update:** Narrator-decoupling work later shipped (see §5). Sections 1–4 are the original audit snapshot; some rows are **superseded** for marketplace-primary `solo_expert` and removed UI hints. Remaining edge cases: [NARRATOR_ROUTING_PHASE2_RESEARCH.md](NARRATOR_ROUTING_PHASE2_RESEARCH.md).

---

## 1) Intent vs implementation (spec gaps)

| Spec / doc claim | Code reality |
|------------------|--------------|
| [OUTPUT_TRANSLATION_SPEC.md](OUTPUT_TRANSLATION_SPEC.md) §2.3: channel plan = touchpoints first, narrator `primary_channels` as fill | **Implemented** in `resolveChannelPlan` ([packages/generation/src/deterministic/coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts)). |
| OUTPUT_TRANSLATION_SPEC §3.0 / §6A.3: `cta_type` drives CTA action category; Pro CSP CTA suggestions from narrator | **Core** Voice Playbook “Calls to action (CTAs)” uses `voicePlaybookCtaBody`: driven by `primaryGoal` + `resolveChannelPlan().primary`, **not** `narratorProfile.cta_type` or `cta_patterns`. `cta_type` / `cta_patterns` exist on profiles but are **unused** in deterministic Core assembly grep’d today. |
| [DELIVERABLE_PRODUCTION_SPEC.md](DELIVERABLE_PRODUCTION_SPEC.md) Quick Start Week 1: “surface the top channel from `narratorProfile.primary_channels`” | **Partially stale:** Week 1 body uses `resolveChannelPlan` for the named primary channel; narrator still selects **checklist sentence templates** (`week1Items` `byNarrator`). |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](CORE_PATH_CUSTOMIZATION_AUDIT.md) §2.2: “Week 1… solo_expert → LinkedIn + website + email” | **Partially stale** for **channel names** (touchpoints win); still accurate for **solo_expert template lines** (booking/contact, “presentations”, etc.). |
| OUTPUT_TRANSLATION_SPEC §3.1 matrix: Voice CTAs secondary “S1 brandNarrator (tone of channel guidance)” | Narrator does **not** appear inside `voicePlaybookCtaBody`; narrator affects other Voice blocks (themes, sample phrases, do/avoid). |

**Takeaway:** Channel **labels** for many surfaces are touchpoint-aligned; **narrator** still controls story structure, pillars, anchor verb, Week 1/2 **task shape**, typography **cluster** (via `touchpointClusterFromForm`), and several **fixed channel names in prose** (e.g. “LinkedIn” in Style principles for `solo_expert`).

---

## 2) Consumer inventory (`brandNarrator` / `getNarratorProfile` / cluster)

Classification: **(A)** story / language / positioning (good narrator territory) · **(B)** channel naming / surface priority (prefer touchpoints) · **(C)** hybrid / needs explicit precedence.

### 2.1 `packages/generation`

| Location | Inputs | Class | Notes |
|----------|--------|-------|-------|
| [narratorProfiles.ts](packages/generation/src/deterministic/narratorProfiles.ts) | `brandNarrator` → profile | **A** (+ **B** fallback) | `content_pillars`, `tone_of_voice_themes`, `anchor_verb`, `brand_brief_emphasis`, `email_tone_pattern` are semantic. `primary_channels` is **B** when used as fallback in `resolveChannelPlan`. |
| [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `touchpointClusterFromForm` | `brandNarrator` + `industry` + **#1 touchpoint bucket** | **C** / **B**-like effect | Base from narrator+industry; **`social_service` → `social_product`** when first touchpoint is **marketplace** (post-audit ship). Still ignores `primaryGoal`. Drives Week 3 **family**, typography, imagery tail ([phase8Content.ts](packages/generation/src/deterministic/phase8Content.ts)). |
| [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `computeBrandProfile` | cluster + `getNarratorProfile` | **C** | `primaryChannelSet` is **only** `profile.primary_channels` (narrator defaults), **not** the resolved plan — audit table in CORE_PATH that references channel sets should treat this as narrator echo, not user order. |
| [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `resolveChannelPlan` | touchpoints + narrator fallback | **B** (correct precedence) | User order preserved; narrator fills gaps. |
| `brandAnchorSentence` | `anchor_verb` from profile | **A** | “helps / makes / serves …” |
| `brandBriefBlocks` / `reorderBriefBlocks` | `brand_brief_emphasis` | **A** | Section ordering. |
| `idealCustomerBriefBody` | `IDEAL_CUSTOMER_NARRATOR_CUE` | **A** | Credibility vs craft vs local, etc. |
| `differentiationBriefBody` | `DIFFERENTIATION_NARRATOR_FALLBACK` | **A** | Positioning hints when empty. |
| `stylePrinciplesBody` / `stylePrinciplesNarratorAdditions` | narrator id | **C** | `solo_expert` second line **hardcodes** “LinkedIn” (no `substituteProfessionalDigitalLinkedIn` here — that helper is used for **typography** copy only, ~line 877). |
| `styleDoAvoidBody` | narrator + `stageContext` | **A** (+ stage) | Narrator-specific do/don’t lines. |
| `narratorMessagingThemes` | `tone_of_voice_themes` + industry | **A** | |
| `samplePhrasesBody` | per-narrator phrase lists | **A** (with consulting bias for `solo_expert`, e.g. “Book a call”) | |
| `writingDoAvoidBody` | narrator branches | **A** | |
| `voicePlaybookCtaBody` | goal + channel plan | **B** | Not narrator-keyed. |
| `week1Items` / `week2Items` | `byNarrator[profile.narrator_id]` + `channelPlan` + buckets | **C** | Channel **names** from plan; **sentences** still expert vs maker vs team. |
| `buildWeek3Checklist` | `touchpointCluster` + `channelPlan` | **C** | Cluster = narrator+industry; labels from plan. |
| `quickStartBlocks` / week preambles | cluster, stage, channel plan, goal | **C** | |
| Typography path | `computeBrandProfile` → recipes | **C** | Cluster from narrator+industry; some “LinkedIn” substitution in professional_and_digital templates. |
| [typographyRecipes.ts](packages/generation/src/deterministic/typographyRecipes.ts) | `touchpointCluster` from `computeBrandProfile` | **C** | |
| [phase8Content.ts](packages/generation/src/deterministic/phase8Content.ts) `styleGuideImageryDirectionBody` | cluster tail | **C** | e.g. `social_service` “professional presence, headshots…” |

### 2.2 `packages/shared`

| Location | Class | Notes |
|----------|-------|-------|
| [form.ts](packages/shared/src/form.ts) `BrandNarrator` type, `step1.brandNarrator` | — | Source of truth for allowed ids. |

### 2.3 `apps/web`

| Location | Class | Notes |
|----------|-------|-------|
| [narratorOptions.ts](apps/web/src/data/narratorOptions.ts) | **A** | Card **titles** (“Just me — I am the brand”, “Me and my craft”) — user-visible semantics. |
| [Step1Snapshot.tsx](apps/web/src/components/steps/Step1Snapshot.tsx) `view === 'brandNarrator'` | **C** | Archetype cards + **industry guardrail hint** (`SOLO_EXPERT_MAKER_RETAIL_INDUSTRY`). |
| [ReviewScreen.tsx](apps/web/src/components/review/ReviewScreen.tsx) `soloExpertChannelMismatchHint` | **C** | Same industry set; nudges toward Solo maker. |
| [Step5Story.tsx](apps/web/src/components/steps/Step5Story.tsx), [storyOptions.ts](apps/web/src/data/storyOptions.ts) | **A** | Origin archetype options differ by narrator. |
| [Step7Industry.tsx](apps/web/src/components/steps/Step7Industry.tsx) differentiation placeholder | **A** | |
| [microStepValidation.ts](apps/web/src/validation/microStepValidation.ts), [microStepSchema.ts](apps/web/src/data/microStepSchema.ts), [useFlowState.ts](apps/web/src/hooks/useFlowState.ts), [App.tsx](apps/web/src/App.tsx) | — | Required field + wiring. |

### 2.4 `apps/api`

No direct references to `brandNarrator` / `touchpointCluster` in API package (generation runs after shared form payload; logic lives in `@identity-kit/generation`).

### 2.5 Tests & fixtures

| Location | Role |
|----------|------|
| [core-pdfs.test.ts](packages/generation/src/core-pdfs.test.ts) | Documents `touchpointClusterFromForm` matrix, LinkedIn mentions in Quick Start / typography for default fixture, narrator branches. |
| [typographyRecipes.test.ts](packages/generation/src/deterministic/typographyRecipes.test.ts) | Cluster + narrator + industry for recipe selection. |
| [fixtures/*.json](packages/generation/src/fixtures/) | Sample `brandNarrator` values for personas. |

---

## 3) Scenario matrix (predicted behavior from code)

Touchpoints use canonical ids from [touchpoints.ts](packages/shared/src/touchpoints.ts). Below, **“Week 1 template”** means the `byNarrator` lines in `week1Items` after bucket kickoff + goal kickoff.

| Persona | Narrator | Industry | Touchpoints (ordered) | `touchpointCluster` | Primary channel in plan | Notable mismatches |
|---------|----------|----------|------------------------|---------------------|-------------------------|-------------------|
| Consultant | `solo_expert` | `consulting_coaching` | `linkedin`, `website` | `social_service` | LinkedIn | Coherent service framing; Week 3 `social_service` + “presentations or proposals”. |
| Maker / Etsy | `solo_maker` | `retail` | `marketplace_storefront`, `instagram` | `social_product` | Etsy | Coherent product/packaging Week 3. |
| Influencer + merch (“I am the brand”, not craft-led) | `solo_expert` | `retail` | `tiktok`, `instagram`, `shopify_marketplace` | **`social_service`** | TikTok | **Cluster** ignores retail+commerce touchpoints → Week 3 uses **service-oriented** checklist family while channel **names** say TikTok/Instagram/Shop. **Week 1** still includes solo_expert lines: booking/contact link, email signature emphasis. **Style principles** solo_expert line still says “**LinkedIn**” literally. **Sample phrases** include “Book a call”. **Ideal customer** cue: “credibility… before a commitment” — OK for high-ticket, weak for pure merch. |
| Founder-led product | `product_led` | `technology` | `website`, `email_newsletter` | `digital_brand` | Website | Generally aligned. |
| Physical solo expert | `solo_expert` | `construction_trades` | (any) | `physical_first` | First touchpoint or fallback | Cluster override for physical industries — good. |

**Critical finding:** `touchpointClusterFromForm` for `solo_expert` only branches on **construction_trades, automotive, home_services** → `physical_first`. **`retail` does not change** `solo_expert` away from `social_service`. So “I am the brand + retail + social/commerce touchpoints” keeps **consulting-shaped** Week 3 and imagery tail unless the user changes narrator.

---

## 4) UI hints (`SOLO_EXPERT_MAKER_RETAIL_INDUSTRY`)

**Where:** [Step1Snapshot.tsx](apps/web/src/components/steps/Step1Snapshot.tsx) (lines ~56–63, ~327–332), [ReviewScreen.tsx](apps/web/src/components/review/ReviewScreen.tsx) (lines ~27–38).

**Industries in set:** `retail`, `food_beverage`, `beauty_personal_care`, `pet_services`, `creative_services`.

**Copy issues:**

1. Uses **“Solo maker”** / **“Solo expert”** — internal-ish labels; user-visible titles are **“Me and my craft”** and **“Just me — I am the brand”** ([narratorOptions.ts](apps/web/src/data/narratorOptions.ts)).
2. **Product intent:** The hint assumes `solo_expert` + these industries ⇒ probably wrong narrator, and steers users to **Me and my craft**. That conflicts with valid cases: **founder-led personal brand** selling apparel or merch (still “Just me — I am the brand”), **influencer commerce**, or **expert with a shop** where they want credibility + product CTAs but not “craft process” pillars.
3. **Touchpoints already required** in Core flow — telling users to “rank your real touchpoints” may be redundant once Step 1 touchpoint step is complete; the hint does not gate on empty touchpoints.

**When the hint still helps:** User chose `solo_expert` **and** left defaults or weak touchpoints **and** truly operates as maker-first (then **Me and my craft** + commerce touchpoints better matches pillars and Week 1 templates). That is narrower than “industry in list”.

---

## 5) Recommendations (prioritized)

### P0 — Product / copy (low risk)

- **Done:** Step 1 + Review **industry × solo_expert** hints **removed** (`Step1Snapshot.tsx`, `ReviewScreen.tsx`). Channel fit is not inferred from industry alone.

### P1 — Deterministic generation (medium scope, high impact)

- **Done:** `touchpointClusterFromForm` in [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) — base narrator+industry, then **`social_service` → `social_product`** when the first touchpoint is a **marketplace** (skips `physical_first` / `local_community`).
- **Done:** `week1Items` + `soloExpertCommerceLean` in [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) — marketplace-primary **`solo_expert`** uses shop/listing checklist lines; email signature line only when `email_newsletter` is selected.
- **Done:** `stylePrinciplesNarratorAdditions` for `solo_expert` — neutral second line (no hardcoded “LinkedIn”).
- **Done:** `samplePhrasesBody` — commerce phrase set for `solo_expert` when `soloExpertCommerceLean`.

### P2 — Spec / audit hygiene

- **Done:** [CORE_PATH_CUSTOMIZATION_AUDIT.md](CORE_PATH_CUSTOMIZATION_AUDIT.md), [DELIVERABLE_PRODUCTION_SPEC.md](DELIVERABLE_PRODUCTION_SPEC.md), [OUTPUT_TRANSLATION_SPEC.md](OUTPUT_TRANSLATION_SPEC.md) updated for touchpoint-first Week 1, cluster refinement, Voice CTAs vs `cta_type`, and audit backlog.

### Non-goals (this research pass)

- New narrator enum values or schema migrations.
- Rewriting full PDF copy without agreeing on P1 rules above.

---

## 6) Appendix — key code references

- Cluster logic: [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `touchpointClusterFromForm`
- Channel plan: [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `resolveChannelPlan`
- Week 1 templates: same file `week1Items`
- Week 3 checklist: `buildWeek3Checklist`
- Solo expert Style principles second line: neutral copy in `stylePrinciplesNarratorAdditions` (`coreAssembly.ts`)
- Narrator dictionary: [narratorProfiles.ts](packages/generation/src/deterministic/narratorProfiles.ts)
