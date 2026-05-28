# Quick Start Checklist — refactor program

Single program doc for making the **30-Day Quick Start Checklist** (`04-quick-start.pdf`) genuinely useful. This work is **intentionally separate** from Brand Identity Guide folio polish (including the Voice page bottom band).

**Status:** **Phase B in progress (2026-05-27)** — `inferQuickStartExpandRecommendations` + Execute/Expand split in `quickStartRecommendations.ts` / `coreAssembly.ts`. Matrix v1.2 signed off for implementation. Remaining: broader plain-language pass, full `guideFocus` week shaping, pass-2 industries.

---

## Why this doc exists

Quick Start was built early in the deterministic kit pipeline and has **regression tests for specific personas and buckets**, but it was **never holistically reviewed** against:

- What customers said they want (`guideFocus`, touchpoints, goals)
- Whether week-by-week tasks match a believable 30-day rollout
- Whether copy reads like actionable marketing guidance vs. internal assembly language

A parallel thread explored pointing the **Brand Identity Guide Voice page (folio 04)** at Quick Start (“Don’t know where to start? See Week X”). That idea is **deferred** until Quick Start itself is trustworthy. See [Deferred: Voice page pointer](#deferred-voice-page-pointer).

---

## Deliverable

| Item | Detail |
|------|--------|
| **PDF** | `04-quick-start.pdf` (Core kit) |
| **Title in PDF** | “Quick Start Checklist” |
| **Companion** | `05-brand-identity-guide.pdf` — kit intro tells readers to start with the guide, then follow this checklist |
| **Depth docs** | Brand Brief, Style Guide, Voice Playbook — referenced in week pointers, not duplicated |

Packaging context: [DELIVERABLE_REDUNDANCY_MATRIX.md](../product/DELIVERABLE_REDUNDANCY_MATRIX.md).

---

## Code map

| Concern | Location |
|---------|----------|
| Week 1–4 task assembly | [`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) — `week1Items`, `week2Items`, `week3Items`, `week4Items`, `quickStartBlocks` |
| Kit intro + per-week guide folio pointers | [`packages/generation/src/deterministic/quickStartContent.ts`](../../packages/generation/src/deterministic/quickStartContent.ts) |
| Touchpoint cluster (Week 3 checklist *shape*) | [`packages/generation/src/deterministic/brandProfile.ts`](../../packages/generation/src/deterministic/brandProfile.ts) — `touchpointClusterFromForm`, `stageContextFromStage` |
| Narrator defaults (fallback channels, task templates) | [`packages/generation/src/deterministic/narratorProfiles.ts`](../../packages/generation/src/deterministic/narratorProfiles.ts) |
| Channel plan (primary / secondary / buckets) | `resolveChannelPlan` in `coreAssembly.ts` |
| PDF render | [`packages/generation/src/pdf/CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx) — `QuickStartDocument` |
| **Technical regression audit** | [`packages/generation/src/deterministic/quickStartAudit.test.ts`](../../packages/generation/src/deterministic/quickStartAudit.test.ts) |

Normative spec sections: [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) (Quick Start rows, path classes PC-03/04/08, touchpoint rules).

Pipeline overview: [`GENERATION_PIPELINE.md`](../../GENERATION_PIPELINE.md).

---

## How output is built today

Each week block = **guide pointer** + **lead paragraph** + **☐ checklist** (from `quickStartWeekGuidePointer` + `weekBody` in `quickStartBlocks`).

### Inputs that **do** change Quick Start

| Input | Effect |
|-------|--------|
| **`touchpoints`** (ordered, max 4) | Primary channel = first selection; drives labels in tasks, Week 1 lead, Week 3 first bullet when cluster is `social_service` |
| **`brandNarrator`** | Week 1–2 bullet templates (solo expert vs maker vs local team, etc.) |
| **`primaryGoal`** | Week 1/2/4 goal kickoff lines (lead gen, sales, growth, retention) |
| **`stage`** | Week 1 preamble only (`starting_fresh` … `protecting_recognition`) |
| **`businessOperatingModel`** + **`industry`** + narrator | `touchpointCluster` → Week 3 checklist family (`physical_first`, `social_product`, `social_service`, `local_community`, `digital_brand`) |
| **Marketplace-first override** | If first touchpoint is marketplace and base cluster is `social_service`, cluster promotes to `social_product` (commerce-shaped Week 1/3) |

### Inputs that **do not** change Quick Start today

| Input | Notes |
|-------|--------|
| **`guideFocus`** | Used in Brand Identity Guide only. **Changing `guideFocus` does not change Quick Start copy** (verified in `quickStartAudit.test.ts`). |
| **`tonePreset` / voice sliders** | Indirect via other kit docs; not week task selection |
| **Most Step 2–7 fields** | No week-level personalization yet |

### Per-week guide pointers (fixed)

| Week | Pointer text (summary) |
|------|-------------------------|
| 1 | **Summary** + **Examples** (profile / bio paste) — **not Voice** |
| 2 | **Voice** + **Examples** (rules, lines, CTAs) |
| 3 | **Look** (colors, type, wordmark) |
| 4 | Skim all sections |

---

## Technical audit summary (2026-05)

Automated sweep: all **5 narrators** × **9 touchpoint patterns** × **4 guideFocus** target weeks + persona fixtures. Run:

```bash
cd packages/generation && npm test -- src/deterministic/quickStartAudit.test.ts
```

### What holds up

- **Week 2** always includes **(Voice)** and concrete copy actions (update, rewrite, apply, draft, etc.).
- **Week 1** lead names the **first selected touchpoint** (“Set up your brand on LinkedIn first”, etc.).
- **Touchpoint order** affects primary channel and Week 3’s first checklist line (`social_service`).
- **Bucket-specific** kickoffs (directory, marketplace, owned site) fire for the right first touchpoint.
- **Persona fixtures** under `packages/generation/src/fixtures/personas/` produce actionable Week 1–2 with channel names present.

### Known technical / product gaps

1. **`guideFocus` disconnected** — User’s stated intent for the kit does not shape Quick Start. `primaryGoal` shapes kickoffs instead; migration infers `guideFocus` from goal but the two can diverge if the user picks explicitly.
2. **Week 1 vs Voice page** — For `look_more_professional`, Week 1 tasks cite **Summary**, not **Voice**, while Week 1 pointer also omits Voice. Unsafe to send Voice-page readers to Week 1 without copy changes.
3. **Execute vs Expand** — Weeks 1–2 must not treat narrator fallbacks as selected; Weeks 3–4 should **recommend** omitted high-value channels (e.g. Google for walk-in retail on social-only intake) with advisory copy — see [`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md).
4. **Empty touchpoints** — Falls back to narrator `primary_channels`; workable for migration, misleading if touchpoints are ever optional in live intake.
5. **`give_clear_direction`** — Week 4 emphasizes **audit + share PDF**, not “hand off Voice + Examples to whoever owns {primary channel}”.
6. **Week 3 is visual-only** — Must never be the target of a voice/copy pointer.
7. **Marketing quality unaudited** — Tasks can be structurally correct but still wrong tone, wrong priority, or wrong week for a segment.

---

## Deferred: Voice page pointer

**Idea:** Replace the folio 04 “How to use this page” band with one line: *Not sure where to start? Open your Quick Start Checklist — Week {n}…*

**Proposed week mapping** (only valid after Quick Start refactor):

| `guideFocus` | Week | Rationale |
|--------------|------|-----------|
| `look_more_professional` | 1 | Profile / credibility on primary channel |
| `sound_more_consistent` | 2 | Apply voice across channels |
| `know_what_to_fix_first` | 2 | Fix loudest copy, then Examples |
| `give_clear_direction` | 4 | Share guide (needs stronger handoff copy) |

**Blocked until:** Week 1 references Voice where appropriate; `guideFocus` wired into Quick Start or pointer logic; marketing sign-off on week flow.

Track guide-side status in [`BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) (Folio 04 bottom band).

---

## Phased program

### Phase A — Marketing & UX audit ✅ (2026-05-27)

**Deliverable:** [`QUICK_START_MARKETING_AUDIT.md`](./QUICK_START_MARKETING_AUDIT.md)

**Headline findings:**

- Four-week arc matches industry “front door → voice/system → visuals → QA” — **keep the structure**.
- Fails non-marketer test on **plain language**, **channel honesty**, and **surface-fit tasks** (e.g. “2–3 posts” on Google).
- **`guideFocus` must be wired** in Phase B; Week 1 should reference **Voice** when the customer chose “look more professional.”
- Reduce cognitive load: **4 required tasks/week**, simpler kit intro, plain guide page names.
- **Channel model:** Weeks **1–2** = user-selected touchpoints only; Weeks **3–4** = optional **recommended** surfaces (Maps, website, etc.) with plain *why* — not “selected only everywhere.”

**Review artifacts used:**

- Outside research (30/60/90 rollout, SMB checklists, post-delivery onboarding)
- Persona dump: `npm test -- src/deterministic/quickStartDump.test.ts`
- [`DELIVERABLE_REDUNDANCY_MATRIX.md`](../product/DELIVERABLE_REDUNDANCY_MATRIX.md)

### Phase A.5 — Channel recommendation matrix ✅ draft for review

**Deliverable:** [`QUICK_START_CHANNEL_MATRIX.md`](./QUICK_START_CHANNEL_MATRIX.md) — six segments (S1–S6), operating-model + goal overlays, blocklist, copy templates, resolution algorithm sketch.

| ID | Segment | Industries (summary) |
|----|---------|----------------------|
| S1 | Food & retail (walk-in) | `food_beverage`, physical `retail` |
| S2 | Professional services | legal, consulting, finance, education, technology |
| S3 | Creative & portfolio | `creative_services`, `photography_media` |
| S4 | Trades & home services | `home_services`, `construction_trades`, `automotive` |
| S5 | Nonprofit & community | `nonprofit_community` |
| S6 | Ecommerce & maker | online `retail`, marketplace-first |

**Your review:** Sign off segment rules, then Phase B implements `inferRecommendedTouchpoints`. Pass 2: health/beauty/fitness/pet/real_estate/`other`.

**Spec:** [`OUTPUT_TRANSLATION_SPEC.md`](../OUTPUT_TRANSLATION_SPEC.md) §2.4 + phased Quick Start note.

### Phase B — Copy & logic refinement (in progress)

Implemented in `quickStartRecommendations.ts` + `coreAssembly.ts` / `quickStartContent.ts`:

- [x] `resolvePriorityChannelPlan` + `inferQuickStartExpandRecommendations` per matrix v1.2
- [x] Matrix-shaped routing scaffold in code (`SEGMENT_MATRIX`) for industry/operating-model/narrator routing
- [x] Subtype priority layer in code (`SUBTYPE_PRIORITY`) for local-vs-portfolio nuances in pass-2 categories
- [x] Expand subsection (≤2 advisory ☐) on Weeks 3–4; Weeks 1–2 selected channels only (no narrator fallback when touchpoints set)
- [x] `look_more_professional` → Week 1 guide pointer + Voice task line
- [x] `give_clear_direction` → Week 4 handoff line
- [ ] Full plain-language rewrite (all weeks)
- [ ] `guideFocus` drives week emphasis beyond pointer + single lines
- Rewrite week leads and bullets in plain language
- Wire **`guideFocus`** into week selection, kickoffs, and/or guide pointers
- Align Week 1 `look_more_professional` with **Voice** where profile copy is the task
- Week 3–4 **Expand** subsection (≤2 recommended ☐); Week 4 split audit lists
- Strengthen **Week 4** for `give_clear_direction` (handoff, not only “share PDF”)
- Resolve **`primaryGoal` vs `guideFocus`** single source of truth (document in `OUTPUT_TRANSLATION_SPEC.md`)
- Step 1 wizard microcopy: touchpoints = focus first, not exclusive forever

Extend `quickStartAudit.test.ts`: no unselected **imperative** in Weeks 1–2; Expand weeks test advisory framing when recommendations exist.

### Phase C — Guide integration (optional, after B)

- Voice page one-line pointer to Quick Start + week number
- Optional kit intro cross-link (“On Voice? Start Week 2”)
- Update `BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md` Folio 04 item

---

## Persona fixtures (regression set)

Use these for before/after PDF and copy review:

| Persona | Stress |
|---------|--------|
| `pc05-regulated-legal` | Solo expert, LinkedIn only, lead gen, professional tone |
| `pc04-local-team-with-directory` | Google + Instagram, local team |
| `pc03-local-team-no-directory` | Advisory directory copy, no invented social |
| `pc08-social-product-promotion` | Marketplace-first → `social_product` |
| `pc06-mixed-commerce-service` | Mixed commerce + service |
| `pc07b-trades-travel` | Physical / travel operating model |
| `coffee-founder` | General growing business |
| `community-org` | Mission / community narrator |
| `lean-core` | Minimal intake surface |

---

## Open decisions

| # | Decision | Options |
|---|----------|---------|
| 1 | Drive week emphasis from `guideFocus`, `primaryGoal`, or both | Unify vs split (survey vs generator) |
| 2 | Week count | Keep 4 weeks vs compress/expand |
| 3 | AI enhancement | Spec mentions `ai_enhanced` prioritization — stay deterministic for Core? |
| 4 | Voice footer | Ship pointer in Phase C vs omit entirely |
| 5 | Existing brand track | `hasExistingBrand` week-1 beat (spec checkbox) — shipped? verify in code |

---

## Related docs

| Doc | Relationship |
|-----|----------------|
| [`BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) | Guide PDF; Folio 04 bottom band deferred here |
| [`BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) | Broader guide refactor |
| [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md) | Signal wiring; Quick Start called out as under-audited |
| [`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md) | Execute (W1–2) vs Expand (W3–4); recommendation philosophy |
| [`QUICK_START_CHANNEL_MATRIX.md`](./QUICK_START_CHANNEL_MATRIX.md) | v1 R1/R2 matrix by segment (review before code) |
| [`QUICK_START_MARKETING_AUDIT.md`](./QUICK_START_MARKETING_AUDIT.md) | Phase A marketing read-through + issue register |
| [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) | Contract + path classes for touchpoints |
| [`GENERATION_PIPELINE.md`](../../GENERATION_PIPELINE.md) | Assembly order |

---

## Changelog

| Date | Note |
|------|------|
| 2026-05-27 | Initial program doc; technical audit + `quickStartAudit.test.ts`; Voice pointer deferred |
| 2026-05-27 | Phase A marketing audit → `QUICK_START_MARKETING_AUDIT.md`; `quickStartDump.test.ts` for persona dumps |
| 2026-05-27 | Channel strategy doc: priority vs recommended surfaces; Phase A.5 matrix before implementation |
| 2026-05-27 | v1 channel matrix (S1–S6) → `QUICK_START_CHANNEL_MATRIX.md` |
