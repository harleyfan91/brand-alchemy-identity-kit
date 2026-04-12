# Phase 2 research: narrator × go-to-market edge cases

**Status:** Research-only follow-up to [NARRATOR_PLATFORM_RESEARCH.md](NARRATOR_PLATFORM_RESEARCH.md) and the narrator-decoupling implementation (marketplace-primary cluster override, `solo_expert` commerce Week 1 / phrases, dropped UI hints).

**Goal:** Identify remaining deterministic mismatches, document current behavior with code pointers, and recommend whether each needs a new rule, a new intake signal, or documentation only.

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

---

## 3) `local_team` + online-only

**Persona:** Crew or studio with no walk-in storefront; discovery is **Instagram + website** only. Touchpoints omit `google_business`.

**Risk:** Week 1–3 or Style copy may still emphasize **GMB, storefront, neighborhood physical** (`local_community` cluster, `firstDirectoryLabel` fallbacks).

**Code to trace:**

- [brandProfile.ts](packages/generation/src/deterministic/brandProfile.ts) `touchpointClusterFromForm` for `local_team`.
- [coreAssembly.ts](packages/generation/src/deterministic/coreAssembly.ts) `buildWeek3Checklist` `local_community` branch, `firstDirectoryLabel`, `week1Items.local_team`.

**Open questions:**

- Should **absence of directory touchpoints** change cluster or checklist **family**, or only swap **labels** (already partly touchpoint-driven)?

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

---

## Suggested research output (per case)

For each row above, add when investigated:

1. **Fixture** (minimal `IdentityKitForm` mutations).
2. **Actual snippets** (Week 1 / Week 3 / Style / Voice headings as relevant).
3. **Verdict:** ship rule / defer / doc-only.

No implementation in this document’s PR unless product approves a follow-up build.
