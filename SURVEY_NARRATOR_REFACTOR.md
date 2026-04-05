# Survey & brand narrator refactor (planning doc)

This document captures **direction** for aligning intake and PDF/output plans with **micro-business, local, service, maker, and solo** customers (mostly B2C or consumer-facing pros). It is meant to prevent rework: when we implement, **update the listed companion specs in the same change** so UI, form schema, generation, and PDF copy stay in sync.

**Related specs (keep aligned):** `SCREEN_COPY_MAP.md`, `OUTPUT_TRANSLATION_SPEC.md`, `DELIVERABLE_PRODUCTION_SPEC.md`, `IDENTITY_KIT_PRD.md`, `packages/shared/src/form.ts`, `packages/generation` (assembly + fixtures).

---

## 1. ICP and design intent

**Target customers:** Micro-business owners, local businesses, service professionals, Etsy/maker sellers, solo entrepreneurs—brands where **trust, personality, and clarity** matter, but not every business is “founder-hero narrative first.”

**Core insight:** Step 5 (brand story) was **founder-journey coded** (static origin archetypes + “fits *you*” framing). That works for one archetype but under-serves **product-led**, **small team / local shop**, and **mission-first** brands.

**Direction:**

1. Introduce a **`brandNarrator`** (working name) dimension: *who speaks* and *what kind of story belongs in the kit*—not the same as industry.
2. Use **industry** to **season** examples and vocabulary (already used for Step 2 buyer archetypes).
3. Use **stage** (already collected) to tune emphasis (proof vs. momentum vs. heritage) in story and Brief copy.

---

## 2. Proposed `brandNarrator` axis (brainstorm → spec)

Single required choice (exact labels TBD in UI polish). Example set:

| Mode | Customer meets | Story job | Typical ICP |
|------|------------------|-----------|-------------|
| **Solo expert / service pro** | The owner is the brand | Credibility, care, “why I do this” | Trades, wellness, coaches, photographers |
| **Solo maker / seller** | Maker behind the work | Craft, materials, studio, batches | Etsy, markets, small-batch goods |
| **Local team / shop** | Shop + crew; owner may be visible | Neighborhood, reliability, “we’ve got you” | Café, salon, retail, crew-based services |
| **Product-led / brand-first** | Brand > single face | Problem → offer → proof; lighter personal journey | Skincare line, packaged goods, simple DTC |
| **Mission / community** | Cause or collective first | Why this exists for others | Nonprofit, community org, some collectives |

**Placement options (pick one when implementing):**

- **A)** End of Step 1 (after industry/stage)—keeps “business model” together; Step 5 only interprets story.
- **B)** Top of Step 5—keeps Step 1 shorter; user chooses story *mode* in context.

**Step 5 behavior once `brandNarrator` exists:**

- **Same or fewer mechanical choices** as today (e.g. keep five “angles” but **relabel descriptions** per narrator so “side hustle” does not read wrong for a fourth-generation shop).
- **Dynamic Pro helper copy** for `originSummary` / `motivation`: e.g. “About *you*” vs “About *the brand*” vs “About *the shop*.”
- **Review screen:** show narrator label; keep origin archetype human-readable.

**Generation / PDF:**

- Map `brandNarrator` in **`OUTPUT_TRANSLATION_SPEC.md`** as a **secondary input** for Brand Brief **Brand story angle** and Content Starter Pack **Brand bio / about intro** (and optionally social/caption bias).
- **Core deterministic path:** extend `coreAssembly.ts` (and fixtures) with display labels—not raw archetype ids in customer-facing text.
- **Pro prompts:** pass narrator so bios skew **I / we / the brand** consistently.

---

## 3. Survey cross-review (steps 1–7 + review)

| Step | Current signal | Fit for ICP | Refinement direction |
|------|----------------|-------------|----------------------|
| **1 — Business Snapshot** | Name, offer, transformation, industry, stage | Strong | Replace **founder-default** placeholder on transformation with **neutral or rotating** examples (service, maker, local shop). Consider **optional “selling mainly to: consumers / other businesses”** only if copy/tests need it; narrator mode may make this redundant. |
| **2 — Your Buyer** | Industry-based customer archetypes + Pro pain/outcomes | Strong for B2C | **Already industry-aware** (`industryArchetypes`). Watch **B2B-flavored buyer titles** in creative_services (e.g. “Visionary Founder”)—accurate for agency ICP, still often right for “I sell to small business owners”; document intent so future edits do not “B2Bify” the whole list. |
| **3 — Brand Personality** | Presets + snapped sliders + Pro notes | Strong | Optional: microcopy that fits **short-form channels** (IG, Google Business) without new fields. No structural change required for narrator work. |
| **4 — Core Values** | 2–4 values + optional Pro mission | Strong | Mission placeholder is already customer-impact oriented. Optional: one line tying mission to **local / trust / craft** when narrator = maker or local shop (helper text only). |
| **5 — Brand Story** | Static origin deck + Pro story fields | **Primary refactor target** | Add **`brandNarrator`**; **reframe prompts** (“fits *your brand* best”); **conditional deck copy**; align `SCREEN_COPY_MAP` § Step 5 with “brand story angle” not only “founder backstory.” |
| **6 — Visual Direction** | Palette, style, Pro reference + notes | Strong | Copy already works for local and product brands. Optional: Pro note hint for **signage / packaging / IG grid** (one sentence) to match ICP channels—docs only unless we add placeholder text. |
| **7 — Stand Out** | Competitors + Pro differentiation | Moderate | **Differentiation placeholder is agency-shaped**; add **rotating or narrator-aware examples** (maker, contractor, salon, Etsy shop). Ensures Pro gate does not intimidate non-agency users. |
| **Review** | Per-step summary | Good | After implementation, show **brand narrator** and ensure **origin archetype** labels match any new ids. |

---

## 4. PDF / deliverable cross-review

All lengths and structures: **`DELIVERABLE_PRODUCTION_SPEC.md`**. Mapping modes: **`OUTPUT_TRANSLATION_SPEC.md`**.

| Asset / section | Current intake (summary) | Refinement direction |
|-------------------|---------------------------|----------------------|
| **Brand Brief — Brand overview** | S1 | Add **`brandNarrator`** as secondary signal for **we vs. I vs. brand name** in opening sentence (especially Pro / ai_enhanced). |
| **Brand Brief — Ideal customer** | S2, S1 industry | Already aligned; no change required for narrator unless we add selling-context field. |
| **Brand Brief — Core transformation** | S1, S2 | Keep; ensure examples in UI are ICP-neutral. |
| **Brand Brief — Values** | S4 | Keep. |
| **Brand Brief — Brand story angle** | S5, S1 stage | **Extend inputs:** `brandNarrator` + reframed S5; update spec goal from “founding story” alone to **“reason the brand exists / trust story”** where appropriate. |
| **Brand Brief — Differentiation** | S7, S2 | Keep; tie to **narrator-appropriate** competitive framing in generation (e.g. local vs. national, craft vs. mass). |
| **Style Guide** | S6, S4 | Keep; optional practical notes for physical touchpoints (doc + Pro placeholder). |
| **Voice Playbook — Messaging themes / samples** | S1, S2, S4, S7 | **Pro:** pass `brandNarrator` so sample phrases match **solo vs. we vs. brand** voice (`OUTPUT_TRANSLATION_SPEC` §3 matrix). |
| **Quick Start** | Broad S1–S7 | Optional: week 2 items could reference **Google Business / IG / Etsy shop** when industry or narrator suggests it—later enhancement; flag in open decisions. |
| **Content Starter Pack — Bio / about** | S5, S4, S3 | **High impact:** spec should say bio may be **founder-led, team-led, or brand-led** per `brandNarrator`. |
| **Content Starter Pack — Social / captions** | S2, S3, S7, S5 | Bias hooks toward **product / local / maker** when narrator matches—generation rules, not necessarily new fields. |

**PDF implementation note (`PDF_GENERATION.md`):** Core assembly today emits **raw `originArchetype` ids** in at least one section. Any new story ids or narrator field should go through **label maps** in generation so PDFs never show internal enums.

---

## 5. Spec sync checklist (when implementing)

Use this as a PR checklist so nothing drifts:

- [ ] `packages/shared/src/form.ts` — add `brandNarrator` (and any new story option ids if added).
- [ ] `apps/web` — Step 1 or 5 UI, Step 5 deck copy, `steps.ts` prompts, `ReviewScreen` labels, `useFlowState` validation if required.
- [ ] `SCREEN_COPY_MAP.md` — Step 5 goals, survey-to-output row, remove sole “founder” framing where we mean “brand story angle.”
- [ ] `OUTPUT_TRANSLATION_SPEC.md` — canonical inputs §2; section matrix rows for Brand story + CSP bio; secondary inputs column.
- [ ] `DELIVERABLE_PRODUCTION_SPEC.md` — Brand Brief §5 goal/inputs; CSP § Brand bio inputs; optional Voice Playbook note.
- [ ] `IDENTITY_KIT_PRD.md` — short survey-to-output note if PRD is still the scope source of truth.
- [ ] `packages/generation` — fixtures + `coreAssembly.ts` (and future Pro prompts) for labels and narrator.
- [ ] Tests / snapshots that assert on form shape or PDF strings.

---

## 6. Phasing suggestion

1. **Schema + docs** — Add enum to form spec and update the three main specs (screen map, output translation, deliverable production) in one pass.
2. **UI** — Ship narrator selector + Step 5 prompt/deck copy changes + review labels.
3. **Generation** — Core PDF label fixes + narrator in section context; then Pro AI prompts.

---

## 7. Non-goals (for this refactor)

- Replacing the entire survey or adding many new required fields.
- Per-industry story decks **unless** we later prove we need them; **narrator × relabeled angles** is the first lever.
- Platform-specific social packs (TikTok vs. LinkedIn) as required scope—optional future row in deliverable open decisions only.

---

## 8. Open questions

- Exact **enum ids and user-facing labels** for `brandNarrator` (A/B test friendly: keep ids stable).
- Whether **Step 1** or **Step 5** is the better home for the narrator control (UX preference).
- Whether **creative_services** buyer archetypes should get a **“sells mostly to consumers”** variant list in a later pass (data-heavy; defer unless metrics say so).
