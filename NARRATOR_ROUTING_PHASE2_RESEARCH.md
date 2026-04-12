# Phase 2 research: narrator × go-to-market edge cases

**Status:** Research log (Core deterministic assembly). Baseline implementation committed separately (`solo_expert` marketplace cluster override, commerce Week 1/phrases, hints removed).

**Goal:** Identify remaining deterministic mismatches, document actual output with fixtures, and record a **Verdict** (`ship rule` / `defer` / `doc-only`) before any follow-up code.

**Method:** Mutations on [`loadCoreSampleFixture()`](packages/generation/src/fixtures/loadCoreFixture.ts); snippets from `touchpointClusterFromForm`, `quickStartBlocks`, `styleGuideBlocks`, `voicePlaybookBlocks`, `brandAnchorSentence`, `brandBriefBlocks` in [`packages/generation/src/deterministic/coreAssembly.ts`](packages/generation/src/deterministic/coreAssembly.ts) / [`brandProfile.ts`](packages/generation/src/deterministic/brandProfile.ts). Run date: **2026-04-11**.

---

## 1) `solo_maker` + service-heavy / no product surfaces

**Persona:** Consultant or service provider who identifies with “Me and my craft” but sells time, retainers, or sessions—not physical SKUs. Touchpoints might be `linkedin`, `website`, no marketplace.

**Risk:** Week 1 / Week 3 / Style copy may skew toward **listings, packaging, shop banners** (`social_product` cluster, `solo_maker` narrator templates).

**Code to trace:**

- [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `touchpointClusterFromForm` (base + marketplace override).
- [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `week1Items`, `buildWeek3Checklist`, `stylePrinciplesNarratorAdditions.solo_maker`.

**Open questions:**

- Should **owned + social** without marketplace downgrade `social_product` for `solo_maker`, or is that rare enough to ignore?
- Is **offer / transformation** vocabulary a better signal than narrator for “physical vs intangible”?

### Research findings (2026-04-11)

**Fixture:** `brandNarrator: solo_maker`, `industry: creative_services`, `touchpoints: [linkedin, website]`, `primaryGoal: lead_gen` (rest from core sample fixture).

**Observed:**

- `touchpointCluster`: **`social_product`** (default for `solo_maker` + non-food industry).
- **Week 1** (excerpt): Primary surface is LinkedIn (correct), but checklist still includes maker-commerce phrasing, e.g. “Refresh your first featured **LinkedIn listing or post** description…” — “listing” is a poor fit for a pure LinkedIn services profile.
- **Week 3** (`social_product` branch): Bullets reference **product photography**, **packaging/labels**, and “**featured listings, shop banner, or catalog imagery**” even though the resolved primary channel is **LinkedIn** — product/shop framing dominates the cluster template.
- **Style principles:** Second narrator line still pushes **packaging, labels, materials someone holds** — weak match for intangible services.

**Verdict:** **`defer` / leaning `ship rule` later** — If this persona is common, add either (a) a **`social_service`-shaped cluster** when `solo_maker` + primary bucket is social/owned and **no** marketplace touchpoint appears in the top four, or (b) a **secondary `week1Items` / Week 3 branch** for “service-forward maker” without changing cluster. Otherwise **`doc-only`** on the narrator card (“Me and my craft” includes expertise-led services) to set expectations. Offer/transformation-based routing remains an open product call.

---

## 2) `product_led` + founder-is-the-brand

**Persona:** Small line where the founder is the face of the brand but they chose “The brand and what we make” for positioning. They want **I/me** story energy without implying the product is anonymous.

**Risk:** Brand Brief / Voice / CSP (Pro) may use **brand-forward** framing while the user still thinks founder-first; pronoun and story tension vs `solo_expert` / `solo_maker`.

**Code to trace:**

- [narratorProfiles.ts](packages/generation/src/deterministic/narratorProfiles.ts) `product_led` fields.
- [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `brandAnchorSentence`, `idealCustomerBriefBody`, `samplePhrasesBody`.
- Pro: CSP bio / homepage specs in [DELIVERABLE_PRODUCTION_SPEC.md](DELIVERABLE_PRODUCTION_SPEC.md).

**Open questions:**

- Is this purely **copy education** on the narrator cards, or do we need a **structured “founder visibility”** toggle?
- When should the wizard **suggest** a different narrator vs leave generator-only nuance?

### Research findings (2026-04-11)

**Fixture:** `brandNarrator: product_led`, `industry: technology`, `touchpoints: [website, instagram]` (rest from core sample).

**Observed:**

- `touchpointCluster`: **`digital_brand`** (expected for `product_led` + this industry).
- **Brand anchor** (verbatim): uses narrator `anchor_verb` **“makes”** and third-person **“The brand helps them…”** — brand-forward, not founder **I/me** (by design for `product_led`).
- **Brand Brief block order** (headings): `Brand anchor` → `Core transformation` → `Differentiation` → `Ideal customer` → `Brand overview` → `Brand story angle` → `Values` (emphasis from `brand_brief_emphasis` for `product_led`).
- **Sample phrases:** Product-proof / risk-free patterns (`"See the results for yourself."`, etc.) — consistent with `product_led`, not solo-founder voice.

**Verdict:** **`doc-only` for Core** — Clarify on the **“The brand and what we make”** narrator card that the kit will **center the product/brand voice**, not the founder’s personal voice; users who want **I/me** positioning should pick **Just me — I am the brand** or **Me and my craft**. **Pro / CSP** (bio variants, homepage) should be re-checked separately when implementing CSP generators against [DELIVERABLE_PRODUCTION_SPEC.md](DELIVERABLE_PRODUCTION_SPEC.md). **No Core deterministic change** unless product adds a new structured signal.

---

## 3) `local_team` + online-only

**Persona:** Crew or studio with no walk-in storefront; discovery is **Instagram + website** only. Touchpoints omit `google_business`.

**Risk:** Week 1–3 or Style copy may still emphasize **GMB, storefront, neighborhood physical** (`local_community` cluster, `firstDirectoryLabel` fallbacks).

**Code to trace:**

- [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `touchpointClusterFromForm` for `local_team`.
- [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `buildWeek3Checklist` `local_community` branch, `firstDirectoryLabel`, `week1Items.local_team`.

**Open questions:**

- Should **absence of directory touchpoints** change cluster or checklist **family**, or only swap **labels** (already partly touchpoint-driven)?

### Research findings (2026-04-11)

**Fixture:** `brandNarrator: local_team`, `industry: creative_services`, `touchpoints: [instagram, website]` (no directory IDs).

**Observed:**

- `touchpointCluster`: **`local_community`** (default for `local_team` + this industry).
- **Week 1:** First checklist items follow **Instagram** primary (good); still includes **“Confirm your business name, hours, and address”** — can be redundant for online-only studios.
- **Week 3** (first bullets): **“Update your Google Business cover photo…”** then **Facebook** cover/profile language, and **“Audit your Facebook or Website feed”** — **Google Business appears even though it is not in the user’s touchpoints**; Facebook appears without being selected (fallback social pair from `localCommunitySocialPair` / defaults).

**Verdict:** **`ship rule` (recommended)** — When **no** `online_directory` touchpoint is selected, Week 3 `local_community` branch should **not** open with Google Business; prefer **resolved channel plan** (`Instagram` / `Website` / second social) only, and avoid injecting **Facebook** unless selected or present in `channelPlan.all`. May pair with a softer Week 1 “hours and address” line when no directory surface exists. Add **`core-pdfs.test.ts`** cases for this fixture.

---

## 4) Touchpoint order edge cases (primary vs secondary intent)

**Personas:**

- **A:** Primary = `instagram`, second = `marketplace_storefront` (content-led, shop secondary). Current v1 cluster override only looks at **#1**; base may stay `social_service` for `solo_expert`.
- **B:** Primary = marketplace, secondary = service site (already handled by marketplace-first cluster + commerce Week 1).

**Risk:** For **A**, Week 3 may still use **service-shaped** `social_service` bullets while Week 1 names Instagram correctly—softer mismatch than pre-v1 Etsy-first `solo_expert`, but worth validating with real strings.

**Code to trace:**

- [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `applyMarketplacePrimaryClusterOverride`.
- [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `soloExpertCommerceLean` (primary bucket **marketplace** only).

**Open questions:**

- Should **`primaryGoal`** or **“any marketplace in top 4”** promote cluster for `solo_expert`?
- Is **explicit secondary-role metadata** ever worth a schema field, or are heuristics enough?

### Research findings (2026-04-11)

**Fixture (persona A):** `brandNarrator: solo_expert`, `industry: retail`, `touchpoints: [instagram, marketplace_storefront]`, `primaryGoal: direct_sales`.

**Observed:**

- `touchpointCluster`: **`social_service`** (override does **not** fire because **#1 is not marketplace**).
- **Week 1 intro:** “Set up your brand on **Instagram** first.” (matches touchpoint order).
- **Week 3 first checklist line:** **Service-shaped** `social_service` copy (“…largest branded canvas **service** brands control”, slide template / presentations framing) — **aligned with cluster**, but **not** aligned with a strong **Etsy-second** selling intent.
- **Sample phrases (`solo_expert`):** Still includes **“Book a call”** line because **`soloExpertCommerceLean` is false** when primary bucket is **social**, not marketplace.

**Fixture (persona B — sanity):** `solo_expert`, `touchpoints: [marketplace_storefront, instagram]` — cluster **`social_product`**, commerce Week 1 and commerce sample phrases apply (already covered by shipped tests).

**Verdict:** **`defer` with documented heuristic gap** — v1 intentionally uses **#1 touchpoint only** for cluster promotion and `soloExpertCommerceLean`. A follow-up rule could promote when **`direct_sales` + any normalized marketplace id in top four** (risk: services with a dormant Etsy), or reserve for **Phase 3** if **secondary-role metadata** is rejected. **Doc-only** microcopy could nudge: “Put your main revenue channel first.”

---

## Suggested research output (per case)

For each row above, add when investigated:

1. **Fixture** (minimal `IdentityKitForm` mutations).
2. **Actual snippets** (Week 1 / Week 3 / Style / Voice headings as relevant).
3. **Verdict:** ship rule / defer / doc-only.

No implementation in this document’s PR unless product approves a follow-up build.
