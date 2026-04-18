# Brand Identity Guide refactor — status

This note captures **what is implemented today** versus **what remains**, aligned with:

- [`BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md)
- [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md)

Companion spec language lives in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) (§10A Editorial Guide Layout Rules).

---

## Done (shipped in code)

### Product / packaging

- Core kit includes a dedicated **Brand Identity Guide** PDF (`05-brand-identity-guide.pdf`).
- **Five-page** target for that document, enforced by generation tests (`countPdfPages`).

### Layout and presentation

- Landscape **editorial shell** with reusable blocks: folio + title, optional dek, hero rail, voice columns, sample row, visual board, figure mats, palette board, type specimens.
- **Page 01 summary:** `Page` + `guideSpread` use an explicit **column flex chain**; `HeroRailSpread` is wrapped in a **flex-grow root** so the hero row and footer row share vertical space; summary quote sits in a **column stack** with a **min-height quote panel** so content no longer collapses into a thin overlapping strip.
- **Redo-style dummy** PDF remains a **parallel layout reference** (not a second production content taxonomy).
- **Parent-kit neutrals** for guide chrome and tinted cards; **customer palette** appears where it represents their system (e.g. palette swatches), not as global card washes.
- **Fixed PDF font stack** for guide narrative and chrome (**Inter** + **Source Serif 4**); **typography specimens** still use the customer’s registered faces.

### Model and signals

- `BrandIdentityGuideModel` with per-page **`GuideEditorialMeta`** (folio, nav, title, dek mode, layout id, densities, figure labels).
- **`guideFocus` → `signals.emphasis`** drives editorial choices on **voice / examples / look** pages (e.g. example density, visual occupancy).
- **`contentDensityBias`** merges stage + touchpoint breadth with **industry** (compliance trim set) and **voice sliders** (expressive vs. formal/direct), clamped to −1 / 0 / +1; drives sample caps, before/after pairs, and voice list caps.
- **Omission heuristics:** thin brand-story notes omitted for positioning deks; before/after pairs must meet minimum length; insubstantive pairs dropped; sparse bias trims voice rules and angles (2 vs 3 lines).
- **Examples page:** always **split rail** (main + side column); sparse signals shorten lists and pairs only, not the layout grid.
- **Content caps** in the model (e.g. sample phrase counts by emphasis, fewer avoid lines, shorter application bullet lists).

### Quality

- Tests for guide PDF render, **page count**, and model/editorial metadata (including emphasis routing).

---

## Not done yet (vs the two audit docs)

### Refactor plan — broader scope

1. **Intake contract:** Full **`surface` / `signal` / `drop_or_defer`** classification across all specs and all generation paths (not only the Brand Identity Guide).
2. **Content model:** Systematic **omission** and **compression** when material is weak or redundant (beyond current caps).
3. **Assembly story:** A clear **combined-guide assembler** layer (by content family / editorial regions) if we still want that as an explicit module; today logic lives in **`buildBrandIdentityGuideModel` + PDF**.
4. **Density policy:** Stronger **budgets** modulated by stage, touchpoint, and use-case signals; explicit **trim order** (examples vs. explanation).
5. **QA:** Broader checks for graceful omission, Quick Start / Pro behavior, and **non-marketer** review criteria.
6. **Open product decisions** in the plan (Core vs Pro page parity, collaborator blocks, visual keyword source, new questions, optional master PDF export).

### Intake-to-signal memo

- **Most intake fields** listed as signals (industry, stage, sliders, pain points, competitors, etc.) are **not yet** fully wired to **visibility** and **cut order**; **`emphasis` from guide focus** is the main implemented hook.

### Layout / content follow-ups (product)

- **Page 03 Voice:** **bottom band** below the three-column grid — deterministic “How to use this page” copy from `guideFocus` + primary touchpoint (can later be gated or enriched by signals / intake).
- **Page 05 Look:** directionally balanced; **fine-tune** spacing and type-board proportions only.

---

## Page-by-page: legacy → current → ideal

**Document:** `05-brand-identity-guide.pdf` (folios **01–05**).

**Legacy baseline:** **Brand Brief**, **Voice Playbook**, **Style Guide** — same `IdentityKitForm`, assembled in `coreAssembly.ts` (`brandBriefBlocks`, `voicePlaybookBlocks`, `styleGuideBlocks`). The guide **re-slices** that material in `buildBrandIdentityGuideModel` + `BrandIdentityGuideDocument`; it is not a separate dummy pipeline.

**Ideal north star:** [Refactor plan](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) · [Intake memo](./INTAKE_TO_SIGNAL_MODEL_MEMO.md) · [OUTPUT_TRANSLATION_SPEC](../../OUTPUT_TRANSLATION_SPEC.md) §10A.

Each folio below uses the same four-part checklist so you can scan one page at a time.

---

### Folio 01 — Brand Summary

**1. Legacy kit** (where this content lived)

- Brand Brief headings: **Brand overview**, **Ideal customer** (archetype + pain/outcomes), **Core transformation**, **Values**, **Brand story angle**, **Differentiation**, **Brand anchor** — long, section-per-field prose.

**2. Guide today** (what ships on page 01)

- Hero **quote** (anchor), **primary touchpoint** caption, **trait pills**, optional **differentiator** line, **fact list** (what we do / who it’s for / core shift).
- `summary.focusLead` is in the model for **other pages’ fallbacks**, not a headline here.

**3. Omitted vs legacy**

- Full **story** on page 1, long **ideal customer** body, **competitor** narrative, weak **differentiator**, strategy-length **overview**, explicit **archetype** labels (per plan).

**4. Gaps to ideal**

- Use **`primaryGoal`**, **stage**, **touchpoint breadth** as *signals* for summary emphasis, not only for caps on later pages.
- Optional “first win” line when `guideFocus` is `know_what_to_fix_first`.
- Plan-style **non-marketer QA** for this spread.

---

### Folio 02 — Positioning and Trust

**Editorial contract:** [OUTPUT_TRANSLATION_SPEC §10A.7](../../OUTPUT_TRANSLATION_SPEC.md#10a7-positioning-page-folio-02-editorial-contract).

**1. Legacy kit**

- **Brand story angle** and **Differentiation** as full Brief sections; “trust” implied in overview / customer copy, not a dedicated spread.

**2. Guide today**

- **Focus lead** from `guideFocus`, optional **story** (only if note passes word-count threshold).
- Rail **trust note**; footer **figure mat** (collaborator body when emphasis is handoff).
- If story omitted: **application dek** + **snapshot rows** (who / core shift / first surface) from the same brief material.

**3. Omitted vs legacy**

- Thin **founder arc**, forced **about us**, **archetype** labels on the page.

**4. Gaps to ideal**

- Enforce §10A.7 **one-trust-cue** rule in the model (story ∥ differentiator ∥ collaborator ∥ generic) and suppress duplicates with page 01 fact list.
- **`competitors` / pain / outcomes** as *signals* for whether a trust cue appears at all.
- Full **`surface` / `signal` / `drop_or_defer`** in spec + code when that program ships.

---

### Folio 03 — Voice

**1. Legacy kit**

- Voice Playbook: **Tone profile**, **Voice guardrails**, **Messaging themes**, **Sample phrases**, **CTAs**, **Writing do / avoid**, **Before / after** — long blocks.

**2. Guide today**

- **Traits** strip; columns **Rules** · **Angles** · **CTAs** (list caps + `contentDensityBias`).
- **Bottom band** — “How to use this page” (deterministic: `guideFocus` + primary touchpoint).
- Copy still comes from playbook assembly, then **trimmed** in the guide model.

**3. Omitted vs legacy**

- **Five-axis dashboard** and long taxonomy prose; full guardrail length; **Pro `customVoiceNotes`** not on Core guide PDF path.

**4. Gaps to ideal**

- Gate or **enrich** bottom band from signals / intake (not only `guideFocus`).
- **`primaryGoal`** shaping CTA *coaching*, not only extracted lines.
- Pro surfacing for **custom voice notes** if product keeps that split.

---

### Folio 04 — Voice in Practice (Examples)

**Quality rubric:** [OUTPUT_TRANSLATION_SPEC §10A.8](../../OUTPUT_TRANSLATION_SPEC.md#10a8-before--after-example-quality-rubric-folio-04).

**1. Legacy kit**

- Same Voice Playbook: **Sample phrases**, **Writing do / avoid**, **Before / after** as large sections; weak lines could still fill space.

**2. Guide today**

- Fixed **split rail**: sample phrases, do/avoid, before/after **if substantive**.
- Caps from **`emphasis`** + **`contentDensityBias`**; sparse = **shorter lists**, same grid.

**3. Omitted vs legacy**

- **Short / weak** before–after pairs; extra pairs when cap is 1; long avoid lists (capped).

**4. Gaps to ideal**

- Enforce §10A.8 **quality rubric** (same scenario, different pattern, channel label) in the guide model, not only length check.
- On zero qualifying pairs, **extend sample phrases to upper cap** instead of leaving the block thin.
- **Touchpoint cluster** + **industry** choose *which* labels and After patterns, not only how many.

---

### Folio 05 — Look (visual direction + application)

**1. Legacy kit**

- Style Guide: **Palette**, **Visual direction**, **Typography**, **Style principles**, **Do / avoid**, **Imagery direction**, **Where to apply this first**.

**2. Guide today**

- **Board layout**: palette + prose/mood, **visual summary / keywords**, **typography** lead + **specimens**, **imagery**, **application** bullets + **application lead** (`guideFocus` + touchpoint).
- **`emphasis`** tweaks visual occupancy.

**3. Omitted vs legacy**

- Standalone **logo standards** chapter (no assets → no chapter); long **style principles** compressed into summary/keywords where the model pulls short surfaces.

**4. Gaps to ideal**

- **Layout polish** (spacing, type board proportions).
- Stronger use of **`businessOperatingModel`** + **touchpoint set** for “where first.”
- Optional richer **imagery** when signals allow; resolve **visual keyword** sourcing vs plan open questions.

---

### Whole guide (cross-cutting)

**Data path**

- **Now:** Form → deterministic kit blocks → **`buildBrandIdentityGuideModel`** → PDF.
- **Ideal:** Optional explicit **assembler** between kit blocks and guide regions (plan).

**Intake → guide behavior**

- **Now:** Most fields feed **assembly**; **guide-specific** caps/emphasis mainly from **`guideFocus`**, **`contentDensityBias`** (stage, touchpoints, industry, sliders).
- **Ideal:** Memo list: more fields drive **visibility** and **cut order**; full **`surface` / `signal` / `drop_or_defer`** across deliverables in specs.

**Omission / QA**

- **Now:** Story threshold, before/after length, generic differentiator filter, list caps.
- **Ideal:** Cross-page **compression** when redundant; broader **QA** rules (plan).

---

## How to read this

- **“Done”** = implemented in repo and covered at least by smoke/model/page-count tests where applicable.
- **“Not done”** = still valid roadmap; not a judgment on priority—product can sequence next.

Intake roles for this guide slice are documented in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.5.

Last updated: 2026-04-18 (page 02 editorial contract + page 04 example rubric added in spec §10A.7/§10A.8)
