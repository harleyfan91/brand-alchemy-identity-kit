# Research: explicit “how we operate” signal (business presence / customer interface)

**Status:** **Shipped** in product (Step 1 `businessOperatingModel`, Path C migration in `@identity-kit/shared`). This document remains **taxonomy, rationale, and history**; the live contract is [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §2.

**Date:** 2026-04-13  
**Original goal (pre-ship):** Inventory where the Step 1 control would live, what it should represent (orthogonal to `industry`), what the repo inferred without it, and what would change if product shipped it.

**Related:** [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §2.3–2.4 (channel alignment, platform inference), **§3.3–3.3.1** (Path Class Catalog + recipes — to-do when cluster routing changes), [NARRATOR_ROUTING_PHASE2_RESEARCH.md](./NARRATOR_ROUTING_PHASE2_RESEARCH.md) §3–§4 (local framing shipped; **§4** checkout/revenue field still planned).

---

## 1. Executive summary

Today, “does this brand have a shop people walk into?” vs “online-only studio” vs “mobile service area” is **not** captured directly. The generator **proxies** that story through **`brandNarrator` + `industry` + ordered `touchpoints` + `primaryGoal`**, which yields useful defaults but creates **avoidable mismatches** (e.g. local-positioned brand, online-only operations).

A **single required enum** on **Business Basics micro-step 2** (`c1_s2`), alongside **`industry`** and **`stage`**, would give a **direct** signal for physical vs online vs hybrid / service-area patterns **without** duplicating industry labels like “Retail.” The heaviest downstream consumer is **`touchpointClusterBaseFromForm`** in [`packages/generation/src/deterministic/brandProfile.ts`](../../packages/generation/src/deterministic/brandProfile.ts); refactoring that path is the main engineering payoff.

---

## 2. Non-goals (for v1 of this research)

- Adding a **seventh** Business Basics micro-step row (product preference: **one more control on existing `c1_s2`** only).
- Replacing **`industry`** or **`brandNarrator`** (they answer different questions: sector, story/voice).
- Implementing the field in this research pass (no `form.ts` / UI commits required by this doc).

---

## 3. UI placement (confirmed in repo)

| Artifact | Role |
|----------|------|
| [`apps/web/src/data/microStepSchema.ts`](../../apps/web/src/data/microStepSchema.ts) | **`c1_s2`** — chapter 1 (Business Basics), `microStepIndex: 2` of 6, fields: `step1.industry`, `step1.stage`. A new field would add a third `MicroStepFieldDescriptor` here (same `validationRuleRef` `validateC1S2` extended, or a new rule ref). |
| [`apps/web/src/components/steps/Step1Snapshot.tsx`](../../apps/web/src/components/steps/Step1Snapshot.tsx) | View **`industryStage`** — renders industry + stage selects; new **select** belongs here. |
| [`apps/web/src/hooks/useFlowState.ts`](../../apps/web/src/hooks/useFlowState.ts) | `createInitialForm()` — new key must get a default (`''` or explicit sentinel) for new sessions. |
| [`apps/web/src/validation/microStepValidation.ts`](../../apps/web/src/validation/microStepValidation.ts) | `validateC1S2` — must require the new field when product marks it required. |

**Step numbering note:** “Chapter 1” in the micro-step schema corresponds to the app’s first intake chapter (Business Basics), not `StepIndex` 1 vs 2 naming in `IdentityKitForm` (all of these fields still live under **`form.step1`** / `Step1Snapshot`).

---

## 4. Schema and persistence inventory

### 4.1 Canonical shared type

[`packages/shared/src/form.ts`](../../packages/shared/src/form.ts) — `Step1Snapshot` currently includes:

`businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`, `touchpoints`, `primaryGoal`.

**Research recommendation:** add one optional-or-required string enum field on `Step1Snapshot`, e.g. (names are **TBD by product**):

- `businessOperatingModel` / `customerMeetingModel` / `howCustomersMeetYou` — value type: union of 4–6 string literals + `''` for legacy.

Downstream packages (`@identity-kit/generation`, `apps/web`) import `IdentityKitForm` from shared; any change propagates to **all** consumers.

### 4.2 API

[`apps/api/src/index.ts`](../../apps/api/src/index.ts) — `POST /generate/core` uses `parseCoreForm`, which only checks `tier === 'core'`, `sessionId`, and casts `payload` to `IdentityKitForm`. There is **no Zod** validation in-repo today; missing keys become `undefined` at runtime unless the client always sends them.

**Implication:** generation code must **tolerate missing** field for older payloads and apply a documented **legacy default** (see §7).

### 4.3 Fixtures and personas

| Path | Notes |
|------|--------|
| [`packages/generation/src/fixtures/core-sample.json`](../../packages/generation/src/fixtures/core-sample.json) | Default PDF test fixture; today **omits** `touchpoints` / `primaryGoal` in JSON (relying on test mutations or defaults). New field should be added once product picks default for this persona. |
| [`packages/generation/src/fixtures/personas/*.json`](../../packages/generation/src/fixtures/personas) | `coffee-founder`, `established-pro`, `community-org`, `lean-core` — each needs an explicit value after implementation. |
| [`packages/generation/src/fixtures/loadPersonaFixture.ts`](../../packages/generation/src/fixtures/loadPersonaFixture.ts) | Registry only; no change until JSON updated. |

### 4.4 Web `types` re-exports

[`apps/web/src/types`](../../apps/web/src/types) (if present) typically mirrors `@identity-kit/shared` — verify re-export when implementing (grep `IdentityKitForm` in `apps/web`).

---

## 5. Inference map: what uses proxies today

### 5.1 `TouchpointCluster` (primary hub)

**File:** [`packages/generation/src/deterministic/brandProfile.ts`](../../packages/generation/src/deterministic/brandProfile.ts)

**Exports:** `touchpointClusterFromForm`, `computeBrandProfile`, `typographyContextFromCluster`, `stageContextFromStage`.

**Base cluster** (`touchpointClusterBaseFromForm`) uses:

- `form.step1.brandNarrator` (required for meaningful routing; empty → `social_service`)
- `form.step1.industry` compared to sets:
  - `PHYSICAL_OVERRIDE_INDUSTRY` → `food_beverage`, `retail`, `home_services`, `automotive`, `fitness_sports`
  - `SOLO_EXPERT_PHYSICAL` → `construction_trades`, `automotive`, `home_services`
  - `LOCAL_TEAM_SOCIAL_PRODUCT` → `beauty_personal_care`, `pet_services`
  - `PRODUCT_LED_SOCIAL_PRODUCT` → `beauty_personal_care`, `health_wellness`
  - Food-specific branches for `solo_maker` / `product_led`

**Override:** `applyMarketplacePrimaryClusterOverride` — if base is `social_service` and **first normalized touchpoint** bucket is `marketplace` → `social_product`. **Does not** override `physical_first` or `local_community`.

**If explicit operating model existed:** many **industry-based** branches could become **secondary** or **tie-breakers** when the new field is `online_only` or `fixed_location`, instead of being the primary lever. That is the main **de-inference** opportunity.

### 5.2 Downstream consumers of `computeBrandProfile` / cluster

| Consumer | File | Uses |
|----------|------|------|
| Typography matrix + specimens | [`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) | `typographyContext` from `computeBrandProfile` (multiple call sites for leads, footers, style blocks). |
| Quick Start Week 3 checklist | `coreAssembly.ts` | `touchpointCluster` → `buildWeek3Checklist` switch (`physical_first`, `social_product`, `social_service`, `local_community`, `digital_brand`). |
| Stage / do-avoid | `coreAssembly.ts` | `stageContext` (from `step1.stage`, not cluster). |
| Style Guide imagery | [`packages/generation/src/deterministic/phase8Content.ts`](../../packages/generation/src/deterministic/phase8Content.ts) | `CLUSTER_IMAGERY_TAIL[touchpointCluster]` appended after style core copy. |
| Typography recipe scoring | [`packages/generation/src/deterministic/typographyRecipes.ts`](../../packages/generation/src/deterministic/typographyRecipes.ts) | `touchpointCluster` for eligibility / `isScreenHeavyCluster`. |

**Web app:** no `touchpointCluster` usage found under `apps/web` (cluster is generation-time only today). Review UI lists **industry** and **narrator** but does not surface cluster ([`apps/web/src/components/review/ReviewScreen.tsx`](../../apps/web/src/components/review/ReviewScreen.tsx)).

### 5.3 Channel plan (separate from cluster, still Step 1)

[`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) — `resolveChannelPlan` merges **ordered touchpoints** with **`narratorProfile.primary_channels`** fallback from [`narratorProfiles.ts`](../../packages/generation/src/deterministic/narratorProfiles.ts).

Operating model would **not** replace touchpoints; it would inform **which checklist families** and **which “physical” phrases** fire, and could eventually reduce **narrator fallback** surprises when combined with OUTPUT §2.4 platform inference.

### 5.4 “If we had explicit X, what could change?” (summary table)

| Signal today | Could defer to operating model | Keep as primary |
|--------------|-------------------------------|------------------|
| `local_team` + `PHYSICAL_OVERRIDE_INDUSTRY` → `physical_first` | Yes — e.g. online-only + retail industry should not assume storefront checklist. | Industry still useful when field **unknown** (legacy). |
| `solo_expert` + `SOLO_EXPERT_PHYSICAL` → `physical_first` | Partially — “we go to the job site” vs “we are online consultants” is not the same as industry alone. | Narrator still shapes **voice** blocks. |
| `solo_maker` default `social_product` | Maybe — maker without physical retail still product-led on social. | Marketplace override stays touchpoint-driven. |
| Week 1 / Week 3 **local** copy (directory advisory, hours line) | Yes — **online-only** could further soften print / storefront bullets without new heuristics on `touchpoints`. | Touchpoint-selected channels remain source for **names** (already shipped in §3 work). |
| §4 **checkout / revenue** field ([NARRATOR_ROUTING_PHASE2_RESEARCH.md](./NARRATOR_ROUTING_PHASE2_RESEARCH.md) §4) | **Complementary** — operating model ≠ where money changes hands. | Still need checkout signal for `soloExpertCommerceLean`-class issues. |

---

## 6. Proposed taxonomy (research draft — not shipped)

**Design constraints from product discussion:**

- **Plain language**, **4–6 options max**, easy in a drop-down.
- **Do not duplicate `industry`** (no “Retail” option; `industry: retail` already exists).
- Describe **how customers meet the business / where work happens**, not “what you sell.”

### 6.1 Candidate enum (example IDs + user-facing labels)

| Suggested ID | Example user-facing label | Intent |
|--------------|---------------------------|--------|
| `customer_visits_us` | Customers visit us at a fixed location (shop, studio, office, gym floor) | Walk-in or on-premise experience; storefront / signage / in-person checklist weight. |
| `we_travel_to_customers` | We travel to customers (service area, on-site, mobile) | Physical work, not a public retail floor; maps / vehicles / job-site imagery. |
| `online_only` | We operate online only (no regular in-person customer visits) | De-emphasize walk-in / print-first defaults; keep directory **recommendation** where policy says so. |
| `hybrid` | Both in-person and online matter regularly | Split or blended checklist language; avoid forcing a single cluster guess from industry alone. |
| `mostly_events_or_markets` | Pop-ups, markets, events, or seasonal in-person (no single permanent address) | Distinct from fixed retail; may still need local discovery copy but not “storefront audit” framing. |

**Note:** Exact count (4 vs 5 vs 6) and labels need **copy review** and optional **card-sort** with users. IDs should stay **stable** once PDFs ship.

### 6.2 Orthogonality to `industry`

- Same **industry** (e.g. `creative_services`) can be any operating model (agency office vs remote collective).
- **`retail`** industry does not imply `customer_visits_us` (DTC online-only retail exists).

### 6.3 Narrator conflicts

| Combination | Risk | Mitigation (product) |
|-------------|------|------------------------|
| `local_team` + `online_only` | **Likely unclear intake, not a niche to celebrate.** If both are selected, the wizard probably failed to separate “community reputation / local SEO voice” from “customers meet us in person.” **Do not** paper over with clever copy alone—treat as a signal to **re-evaluate narrator profiles** (`local_team` may be too abstract or over-branded), clarify labels, and consider **segmentation changes** so users are not confused by fancy branding that does not match how they work. |
| `product_led` + `we_travel_to_customers` | Packaged goods rarely “travel” the same way services do | Copy: operating model describes **customer interface**, not product literal (e.g. pop-up retail). |
| Empty narrator (legacy) | Cluster defaults to `social_service` | Operating model still helps physical vs digital imagery once narrator filled. |

---

## 7. Relationship to §4 “primary revenue / checkout” field

From [NARRATOR_ROUTING_PHASE2_RESEARCH.md](./NARRATOR_ROUTING_PHASE2_RESEARCH.md) **§4**, a separate field has been proposed to resolve **commerce vs service** intent when touchpoint **order** is misleading (e.g. Instagram first, Etsy second).

| Dimension | Operating model (this doc) | Checkout / revenue field (§4) |
|-----------|------------------------------|--------------------------------|
| Question answered | Where bodies meet the work / brand surface | Where purchase or commitment happens |
| Example mismatch fixed | Online-only studio vs retail industry | Content-led IG + marketplace second → lean commerce copy |
| Overlap | Some “online_only” brands also only sell on one channel — partial overlap | **Both** may be warranted long-term; neither subsumes the other entirely. |

**Research conclusion:** plan for **both** fields in the long spec, but **ship order** can be: (1) operating model first (unblocks physical vs digital copy more broadly), then (2) checkout field for marketplace/cluster economics.

---

## 8. Legacy and default behavior — shipped Path C

**Shipped:** **Path C** — `intakeSchemaVersion` on `IdentityKitForm` plus **`migrateIdentityKitForm`** in `@identity-kit/shared`. Pre-v2 payloads are backfilled once on read (API, PDF pipeline, wizard hydrate) so `businessOperatingModel` is explicit before generation; v2+ forms are not re-inferred (including in-progress empty selections). See [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §2 for the contract and cluster routing note.

---

## 9. File / module checklist for v1 implementation (post-research)

When product approves enum + copy:

1. [`packages/shared/src/form.ts`](../../packages/shared/src/form.ts) — type + `Step1Snapshot` field.
2. [`apps/web/src/hooks/useFlowState.ts`](../../apps/web/src/hooks/useFlowState.ts) — default in `createInitialForm`.
3. [`apps/web/src/data/microStepSchema.ts`](../../apps/web/src/data/microStepSchema.ts) — `c1_s2.fields` + optional `validationRuleRef`.
4. [`apps/web/src/validation/microStepValidation.ts`](../../apps/web/src/validation/microStepValidation.ts) — `validateC1S2`.
5. [`apps/web/src/components/steps/Step1Snapshot.tsx`](../../apps/web/src/components/steps/Step1Snapshot.tsx) — select + `onChange` wiring (extend props / `App.tsx` handlers).
6. [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx) — pass through `onChange` for new field if not using generic patch.
7. [`apps/web/src/components/review/ReviewScreen.tsx`](../../apps/web/src/components/review/ReviewScreen.tsx) — optional summary row.
8. [`packages/generation/src/deterministic/brandProfile.ts`](../../packages/generation/src/deterministic/brandProfile.ts) — refactor `touchpointClusterBaseFromForm` (primary research payoff).
9. [`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) — any Week 1–4 lines that should branch on operating model **after** cluster is stable.
10. [`packages/generation/src/core-pdfs.test.ts`](../../packages/generation/src/core-pdfs.test.ts) + persona JSON fixtures — matrix tests for cluster + Quick Start snippets.
11. [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) — §2 row for new field + mapping to cluster / copy.
12. [SCREEN_COPY_MAP.md](../../SCREEN_COPY_MAP.md) — if used as copy source of truth for wizard strings.

---

## 10. Open questions and product decisions (updated)

**Decided (do not re-litigate unless new data appears)**

- **Required field:** The operating-model control should be **required** for new intake (validation on `c1_s2`; no “skip”).
- **Internationalization:** **Out of scope for now** — English labels only until product prioritizes i18n.
- **`online_only` + `local_team`:** Treated as a **warning sign** that intake is **unclear**, not a valid long-term combo to optimize for in copy. **`local_team` may be too abstract** or over-segmented relative to how founders describe themselves; this should trigger a **broader re-evaluation of narrator profiles**—why each exists, whether current segmentation matches mental models, and whether “fancy” card branding confuses more than it helps. Directory tone alone (OUTPUT §2.4) is insufficient; **segmentation / narrator UX work** is in scope.

**Still open**

1. **Exact enum count and labels** — e.g. whether “events/markets” is its own option vs folded into `hybrid` or travel; finalize copy with one short user pass.
2. **Pro — service radius / service area** — **Roadmapped** (see [PHASE_ROADMAP.md](../../PHASE_ROADMAP.md)): Pro can add an optional **service radius** (or structured service area) when operating model implies **travel to customers**, for richer local/directory and map-adjacent copy. Core may stay enum-only for v1. Spec detail belongs in OUTPUT_TRANSLATION_SPEC when implemented.
3. **OUTPUT §2.4 interaction** — once narrators and operating model are clearer, revisit whether directory **recommendation** strength should vary by model (secondary to narrator review).

---

## 11. Appendix: suggested implementation order (post sign-off)

1. Lock **enum IDs + labels** + **`migrateIdentityKitForm`** for pre-v2 payloads (Path C — see §8).  
2. Shared schema + **`c1_s2`** UI + **required** validation (`validateC1S2`); initial form default may stay `''` until user selects (blocked from continuing).  
3. Refactor **`touchpointClusterBaseFromForm`** to prefer explicit operating model; keep legacy narrator+industry routing when the field is empty (tests / partial objects).  
4. **Narrator / segmentation review** in parallel or before heavy cluster refactors if `online_only` × `local_team` remains confusing—see §10.  
5. Re-run PDF fixtures + expand `core-pdfs.test.ts` matrix.  
6. Update OUTPUT_TRANSLATION_SPEC + SCREEN_COPY_MAP; cross-link this doc + NARRATOR §4; add Pro service-radius note when Pro intake work starts [PHASE_ROADMAP.md](../../PHASE_ROADMAP.md).

---

## Document history

| Version | Date | Notes |
|---------|------|--------|
| 1.0 | 2026-04-13 | Initial deep research from repo inventory; no product code changes. |
| 1.1 | 2026-04-13 | §8 rewritten (legacy vs required UI); §10 decisions (required, no i18n yet, narrator rethink, Pro service radius roadmap); §6.3 `local_team` + `online_only` clarified. |
