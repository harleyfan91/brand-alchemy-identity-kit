# Personality / trust section — external benchmark & deterministic direction

**Status:** research memo (no layout contract change).  
**Audience:** product + generation engineers extending folio 03 (*Personality*) and trust composition without bloating the Core PDF.

**Normative implementation references:** [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.5 (intake roles), §10A.7 (Personality contract), **§10A.7.1** (folio 03 gradient `storyNote` — causal arc, Core fallback, tone/industry gates), [`docs/audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md`](../audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md) (Step 3 classification), [`docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md`](../audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) (folio 03 audit).

---

## 1. What external brand kits put in this zone

Short guides rarely dump strategy tables. The “who we are / why believe us” slice (adjacent to voice and values) usually combines a **small heart stack**, **human personality**, and **one credibility hinge**.

| Pattern | What readers see | Why it maps to Identity Kit |
|--------|------------------|------------------------------|
| **Agency tiering** — “basic” vs “moderate” PDF guides | Moderate guides add verbal strategy: mission/vision, personality, language keywords, sometimes sample collateral; minimal guides stay logo/color/type. | Explains why folio 03 is *Personality* (feel + stance + one trust cue), not a second Summary. Source: [Trillion Creative — what’s in a brand guide](https://trillioncreative.com/whats-included-basic-brand-guide/). |
| **Six elements** — proposition first | “Brand proposition” bundles values, personality, vision, purpose at the center; then logo, type, color, imagery, verbal identity. | Aligns with our split: values on folio 01, feel on 03, voice rules on 04. Source: [Studio Noel — elements of brand guidelines](https://studionoel.co.uk/elements-of-brand-guidelines). |
| **Brand heart ladder** | Purpose → vision → mission → values as **short** declarative slots (often one or two sentences each). | Maps to our **Vision / Mission / Promise** triplet and *What it stands for* fallback — not to five labeled slider axes on the page. Discussion framing: [Column Five — how to find your brand heart](https://www.columnfivemedia.com/how-to-find-brand-heart/). |
| **Mission-led / nonprofit playbooks** | Mission, vision, values, personality, tone as the repeatable core before tactics. | Reinforces “sliders shape output, not labels” per our intake memo. Example framing: [WildApricot — nonprofit branding](https://www.wildapricot.com/blog/nonprofit-branding). |

**Important:** “Brand heart” (strategy) is **not** the Google **HEART** UX metrics framework. Keep naming distinct in internal docs.

---

## 2. Takeaway for Core PDF product

1. **One credibility unit** — External kits often imply “why us” in one place. Our contract already uses **exactly one** `positioning.trustCue` (differentiator → collaborator → generic). Enrichment should mean **richer, more specific body text** inside that cue (or a tightly bounded second sentence in the same band), not new rails or tables.

2. **Feel without instrument panels** — Kits show **traits or keywords**, not five axis labels. We already render **Feel** as three adjectives from `tonePreset` + `voiceSliders`; raw slider labels stay internal (`signal` / `drop_or_defer` for reader copy).

3. **Proof without testimonials** — Many full kits add case studies or quotes; Core should stay **deterministic** and avoid fabricated social proof. Credible patterns: **outcome-shaped** lines, **audience fit**, **category-level contrast** (when competitors exist), **compliance-softened** phrasing — all gated on real intake and rubrics.

4. **Sparse mode** — When `contentDensityBias === -1`, §10A.7 allows dropping the editorial triplet for concision; the page should still avoid “Feel-only + thin trust.” That tension is tracked in refactor status / spec (optional `standsForLine` in sparse mode is a follow-up design choice).

---

## 3. Deterministic enrichment backlog (trust body)

These are **candidate template families** for `selectPositioningTrustCue` (and shared de-duplication against folio 01 and triplet context), not layout work.

| External idea | Deterministic Core sketch | Intake signals |
|---------------|---------------------------|----------------|
| Reason to believe | One clause when differentiator is weak: trim from `desiredOutcomes` or pain-adjacent phrasing, de-duped vs summary. | `step2`, `step7` |
| Audience fit | Single “built for …” clause from archetype + one sharpened pain (plain language). | `step2.customerArchetype`, `step2.painPoints` |
| Competitive clarity | Contrast sentence using **category** words when `competitors` present and differentiator absent. | `step7.competitors` |
| Compliance tone | Softer claim templates when `industry` ∈ trim set. | `step1.industry` (existing patterns in model) |

All additions must respect §10A.9 reader vocabulary and em-dash limits.

---

## Appendix A — Step 3 (“how you sound” + sliders) → Brand Identity Guide

**Where users set it:** [`apps/web/src/components/steps/Step3Personality.tsx`](../../apps/web/src/components/steps/Step3Personality.tsx) — `step3.tonePreset` (`friendly` | `professional` | `bold`), five `step3.voiceSliders` (0–100, step 25: formality, energy, directness, warmth, playfulness), optional Pro `customVoiceNotes`.

**Primary assembler:** [`packages/generation/src/deterministic/brandIdentityGuideModel.ts`](../../packages/generation/src/deterministic/brandIdentityGuideModel.ts) — `buildBrandIdentityGuideModel`.

### A.1 Direct PDF model fields (guide path)

| Output / signal | Role of Step 3 |
|-----------------|----------------|
| `signals.contentDensityBias` (−1 / 0 / +1) | **Merged** from stage + touchpoint count **plus** `contentDensityOffsetFromIndustryAndSliders(step1.industry, step3.voiceSliders)`: high average of warmth + energy + playfulness nudges **up**; very high formality **and** directness together nudge **down**; compliance industries also nudge down. Caps sample phrases, before/after pairs, voice list lengths, triplet vs fallback, CTA surface count — see §10A.5–10A.6. |
| `positioning.feelAdjectives` | `positioningFeelAdjectives(tonePreset, voiceSliders)` — up to **three** words for folio 03 *Feel* list. |
| `positioning.storyNote` | Optional gradient quote from **`composePersonalityStoryQuote`** (`personalityStoryQuote.ts`): Pro/legacy origin+motivation (+ mission clause when needed); semicolon join on observation paths; narrator **`I`/`we`**; suppress casual template for formal/professional + high formality or compliance industries — see §10A.7.1. Core-only payloads omit and use **`oneLine`**. |
| `positioning.feelLine` | `positioningFeelLine(...)` — prose sentence; **not** rendered on folio 03; used for non-PDF consumers and **generic** trust-cue body append in `selectPositioningTrustCue`. |
| `positioning.trustCue` | If no differentiator and not collaborator branch: **generic** body is a fixed trust sentence **plus** `feelLine` when present. |
| `positioning.editorialTriplet` | Template matrix is keyed by **`tonePreset`** (friendly / professional / bold) × `brandNarrator` — **sliders do not switch triplet templates** (they still affect density and Feel). `composePersonalityEditorialTriplet` in [`personalityEditorialTriplet.ts`](../../packages/generation/src/deterministic/personalityEditorialTriplet.ts). |
| `voice.traits` | `resolveVoiceTraits(form)` — up to three traits from **preset + slider thresholds** (e.g. warmth ≥ 75 → `human`), rendered on folio 04 *Voice*. |
| `visual` color summary | `composeColorSummary` receives `tonePreset` + `selectedStyle` for tonal arc / usage discipline copy on folio 02a — **sliders not passed** into that composer today. |

### A.2 Upstream narrative blocks (same intake, broader doc)

Step 3 also shapes the **Brand Brief / Voice Playbook / Style** text produced in [`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) (e.g. tone profile paragraphs with slider-derived words). Those blocks are parsed inside `buildBrandIdentityGuideModel` into **rules**, **messaging angles**, **sample phrases**, **do/avoid**, and **before/after** — i.e. folio 04–05 content — not as raw slider labels on the PDF.

### A.3 One-line mental model

**Presets + sliders** control **how much** the guide can say (`contentDensityBias`), **how it feels** in three adjectives (folio 03), **how the generic trust line sounds** (via `feelLine`), **which triplet family** (tone × narrator), **voice trait chips** (folio 04), and the **full-sentence voice playbook** material that feeds Examples and Voice lists — while **reader-visible** copy stays plain English per §10A.9.
