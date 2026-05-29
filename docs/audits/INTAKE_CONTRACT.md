# Intake contract — field inventory, consumers, and drift status

**Status:** Living audit (last reconciled with code: intake schema v7, Pro-C/D shipped).  
**Purpose:** Single place to answer “what does the wizard collect, who consumes it, and is the spec still true?” without re-running a full repo analysis.

**Companion docs (do not duplicate their full content here):**

| Topic | Document |
|-------|----------|
| Core vs Pro generation modes | [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1.2, §2.1–2.2 |
| Schema types + migrations | [`packages/shared/src/form.ts`](../../packages/shared/src/form.ts), [`packages/shared/src/intakeMigration.ts`](../../packages/shared/src/intakeMigration.ts) |
| Wizard micro-steps | [`apps/web/src/data/microStepSchema.ts`](../../apps/web/src/data/microStepSchema.ts) |
| Surface / signal / defer philosophy | [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md) |
| Why Pro fields exist | [`PRO_KIT_STRATEGY.md`](./PRO_KIT_STRATEGY.md) §5–6 |
| AI prompt context blocks | [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12 |
| Pro output persistence & memory | [`docs/research/PRO_OUTPUT_PERSISTENCE_AND_MEMORY.md`](../research/PRO_OUTPUT_PERSISTENCE_AND_MEMORY.md) |

---

## Canonical sources of truth

| Layer | Source | Notes |
|-------|--------|-------|
| **Data model** | `IdentityKitForm` in `form.ts` | `intakeSchemaVersion` **7** = current |
| **What buyers see** | `microStepSchema.ts` + `App.tsx` step views | Filter Pro steps with `getMicroStepsForTier` |
| **Normative contract** | `OUTPUT_TRANSLATION_SPEC.md` §2.1 (Core), §2.2 (Pro) | §2 header bullet list is **stale** — see [Drift register](#drift-register) |
| **Runtime migration** | `migrateIdentityKitForm()` on every read | Backfills `businessOperatingModel`, `guideFocus`, merges legacy visual notes, lifts `url` → `step1.businessWebsite` |

**Core baseline policy (normative):** Core PDFs must be complete using only §2.1 fields. Pro fields are enrichments, not structural dependencies, except the **existing-brand track** (Brand Audit and related copy ship conditionally when `hasExistingBrand` is false).

---

## Core intake (§2.1 — both tiers)

| Field | Micro-step(s) | Required in UI | Primary role | Consumed today |
|-------|---------------|----------------|--------------|----------------|
| `tier` | `c0_s1` | yes | Core vs Pro routing | Flow + generation |
| `step1.businessName` | `c1_s1` | yes | surface | All PDFs |
| `step1.businessWebsite` | `c1_s1` | no | signal → AI | Stored; AI Brand Audit (planned) |
| `step1.offer.*` | `c1_s3` | yes | surface + signal | Brief, transformation, CSP scaffolding |
| `step1.transformation.*` | `c1_s5–c1_s6` | yes | surface + signal | Promise, CTAs, Memo inputs |
| `step1.industry` | `c1_s4` | yes | signal | Profiles, compliance, CTA bank path |
| `step1.stage` | `c1_s4` | yes | signal | Density, Quick Start |
| `step1.brandNarrator` | `c1_s4` | yes | signal | Voice, CTA prescriptive lookup, story |
| `step1.businessOperatingModel` | `c1_s2` | yes | signal | Touchpoint cluster, typography |
| `step1.touchpoints[]` | `c1_s4` | yes (≤4) | signal + partial surface | CTA surfaces, Quick Start week 1 |
| `step1.primaryGoal` | `c1_s4` | yes | signal | CTA families, kickoff emphasis |
| `step1.guideFocus` | `c1_s4` | yes | signal | Quick Start pointers, folio emphasis |
| `step2.customerArchetype` | `c2_s1` | yes | surface | Brief audience |
| `step3.tonePreset` | `c3_s1` | yes | surface + signal | Voice profile (locked for AI) |
| `step3.voiceSliders` | `c3_s1` | no (defaults) | signal | Shading, guardrails |
| `step4.values[]` | `c4_s1` | yes | surface | Personality / positioning |
| `step5.originArchetype` | `c5_s1` | yes | signal | Story emphasis |
| `step6.selectedPalette` | `c6_s1` | yes | surface | Style Guide, swatches (locked for AI) |
| `step6.selectedStyle` | `c6_s2` | yes | surface + signal | Visual direction (locked for AI) |
| `step7.competitors[]` | `c7_s1` | no | signal | Differentiation shaping |

---

## Pro-only intake (§2.2)

| Field | Micro-step | Required in UI | Spec intent | Consumed today | Planned AI consumer |
|-------|------------|----------------|-------------|----------------|---------------------|
| `step1.businessDescription` | `c1_s7` | no (soft 300–800 in UI) | Primary strategist ground | **Not wired** | `businessContext` — all Pro calls + Memo |
| `step2.painPoints` | `c2_s2` | no | Audience depth | `coreAssembly` when set | `audienceContext` |
| `step2.desiredOutcomes` | `c2_s3` | no | Promise / examples | `coreAssembly` when set | `audienceContext` |
| `step3.customVoiceNotes` | `c3_s2` | no | Voice precedence | Deterministic | `voiceContext` (highest precedence) |
| `step3.voiceSamples[]` | `c3_s3` | no (1–5, soft length) | Register matching | **Not wired** | `voiceContext` — CSP, Voice p3, Audit |
| `step4.missionStatement` | `c4_s2` | no | Positioning | Deterministic fallbacks | `valuesContext` |
| `step5.originSummary` | `c5_s2` | no | Story / narrative | Deterministic | `valuesContext`, Memo §8 |
| `step5.motivation` | `c5_s3` | no | **Deprecated** §2.2 | Deterministic fallback chain | Read-compat only; **omit from new prompts** |
| `step6.hasExistingBrand` | `c6_s4` | yes (gate) | Routes conditional track | Flow only | Gates Audit + uploads |
| `step6.existingBrand.*` | `c6_eb1–eb3`, `c6_s3` | conditional | Audit, palette seed | UI extraction; placeholder upload paths | Vision + `visualPositioningContext` |
| `step6.existingTypeface` | `c6_s3` (gated) | no | Typography continuity | Style Guide Pro | `visual_context` |
| `step6.moodAdjectives[]` | `c6_s5` | no (strategy: ≥1 at fulfillment) | Moodboard + visual AI | **Not wired** | Ranker input + `visual_context` |
| `step6.visualNotes` | `c6_s6` | no | Merged color/style notes | `coreAssembly` | `visualPositioningContext` |
| `step7.differentiation` | `c7_s2` | no | Memo, Brief, CSP | Deterministic when set | Memo, CSP, hierarchy proof |

**Legacy read-compat only (do not collect in new UI):** `step6.colorMoodNotes`, `step6.styleNotes`, `step6.referenceUploadName`, `existingBrand.url` (migrated to `step1.businessWebsite`).

---

## Prompt context mapping (Pro-A target)

Playbook system prompt blocks → intake paths:

| Block | Fields |
|-------|--------|
| `businessContext` | `step1` (incl. `businessDescription`, `businessWebsite`, offer, transformation, operating model, touchpoints, goals, focus) |
| `audienceContext` | `step2` |
| `voiceContext` | `step3` — precedence: `customVoiceNotes` > `tonePreset` > sliders; plus `voiceSamples` |
| `valuesContext` | `step4` + `step5` (`originSummary`; not `motivation` for new prompts) |
| `visualPositioningContext` | `step6` + `step7` + `existingBrand.*` when present |
| Buyer selection lock | `selectedPalette`, `selectedStyle`, `tonePreset`, `brandNarrator` |

Implementation owner: **Pro-A** (`buildPromptContext(form)` in generation package).

---

## Validation vs strategy intent

| Field | PRO_KIT_STRATEGY | Code today |
|-------|------------------|------------|
| `businessDescription` | Soft-required | `validateC1S7` → `{}` (no enforcement) |
| `moodAdjectives` | ≥1 at fulfillment | `validateC6S5MoodAdjectives` → `{}` |
| `voiceSamples` | Optional, quality nudges in UI | `validateC3S3VoiceSamples` → `{}` |

**Recommendation:** Keep UI soft-required; add **fulfillment-time soft gates** in Pro-A (warn + weaker Memo) rather than blocking checkout, unless launch quality bar requires hard gates.

---

## Drift register

| Item | Expected | Actual | Action |
|------|----------|--------|--------|
| `OUTPUT_TRANSLATION_SPEC.md` §2 bullet list | v7 fields (`visualNotes`, `businessWebsite`, etc.) | Still lists `colorMoodNotes`, `styleNotes`, old schema note | Update §2 header when touching spec |
| `PRO_KIT_STRATEGY.md` §1.2 | Reflect Pro-C/D | Still says “8 legacy Pro fields, no AI” | Update §1.2 to point here + §11 |
| `INTAKE_TO_SIGNAL_MODEL_MEMO.md` Step 6 table | `visualNotes` | `colorMoodNotes` / `styleNotes` | Update memo table; add `businessDescription`, `voiceSamples`, `moodAdjectives`, `guideFocus` |
| `motivation` | Deprecated | Still `c5_s3` in wizard | Remove micro-step or hide for new Pro sessions |
| Upload API | Real `pro-uploads` paths | Placeholder until `/uploads/sign` | Ship with Pro-E per strategy §11 |
| AI consumption | Playbook wired | No `callClaude` yet | Pro-A milestone |

---

## Pro-A intake checklist

1. ~~Implement `buildPromptContext(form)` per [Prompt context mapping](#prompt-context-mapping-pro-a-target).~~ **Done** (`packages/generation/src/ai/prompts/buildPromptContext.ts`)
2. ~~Include `visual_context` minimum: palette, style, `moodAdjectives[]` (§5.9.3).~~ **Done** in `buildPromptContext` + buyer selection lock in `buildSystemPrompt`
3. Exclude deprecated fields from active prompts; keep migration read-compat. **Done** (`motivation` omitted)
4. Optional fulfillment gates for empty `businessDescription` / `moodAdjectives`. **Pending**
5. ~~First `ai_enhanced` vertical slice: `brief.idealCustomer` via `callClaude`.~~ **Done** — see `rewriteBriefIdealCustomer`
6. ~~Golden Pro fixture on `established-pro`.~~ **Moved** to `fixtures/pro-smoke/` (see [`PRO_API_SMOKE_TESTS.md`](../guides/PRO_API_SMOKE_TESTS.md))

**Remaining Pro-A:** full dispatcher (schema repair pass), walker registry, prompt registry per call class, `ai_call_logs` DB, wire rewrites into PDF assembly.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-28 | Pro-A slice 1: `callClaude`, `buildPromptContext`, `rewriteBriefIdealCustomer`, tests |
| 2026-05-28 | Initial contract doc from intake vs AI readiness analysis |
