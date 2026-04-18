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

**Scope:** `05-brand-identity-guide.pdf` (five landscape spreads, folios **01–05**).  
**Legacy baseline:** the three Core kit PDFs assembled from the same **`IdentityKitForm`** today — **Brand Brief**, **Voice Playbook**, **Style Guide** (`brandBriefBlocks`, `voicePlaybookBlocks`, `styleGuideBlocks` in `packages/generation/src/deterministic/coreAssembly.ts`). The guide does **not** use a parallel dummy schema; it **re-slices** those deterministic blocks (plus a few direct fields) through **`buildBrandIdentityGuideModel`** and `BrandIdentityGuideDocument`.

**Ideal north star:** [`BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) (five content families, omission-first, signal-first) plus field roles in [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md) and [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.

### Folio 01 — Brand Summary

| | |
|--|--|
| **Old (in legacy kit)** | Brand Brief spread across many headings: **Brand overview**, **Ideal customer** (archetype + pain/outcomes), **Core transformation**, **Values**, **Brand story angle**, **Differentiation**, **Brand anchor** — long prose, field-aligned sections. |
| **New (guide today)** | Editorial **hero rail**: anchor **quote**, primary **touchpoint** line, **trait pills** + optional **differentiator** in rail, **fact list** (what we do / who it’s for / core shift). `summary.focusLead` exists in the model for cross-page fallbacks but is **not** a headline on page 01. Copy is trimmed from the same brief blocks, not rewritten from scratch. |
| **Omitted vs legacy** | Full **story** chapter on page 1, long **ideal customer** body, **competitor** narrative, weak **differentiator** (model omits when generic), strategy-style **overview** length, explicit **archetype** / taxonomy labels (per plan). |
| **Toward ideal** | Stronger use of **`primaryGoal`**, **stage**, and **touchpoint breadth** as *signals* for summary emphasis (not just density on other pages); optional one-line “first win” when `know_what_to_fix_first`; non-marketer QA pass (plan §QA). |

### Folio 02 — Positioning and Trust

| | |
|--|--|
| **Old (in legacy kit)** | **Brand story angle** and **Differentiation** lived as full Brief sections; trust scattered in overview/customer copy. |
| **New (guide today)** | **Focus lead** (`guideFocus`), optional **story** paragraph only if the story note passes a **word-count** threshold, **trust** rail + **figure mat** footer; if story is dropped: **application framing dek** + **snapshot rows** (who / core shift / first surface) from the same brief surfaces. Optional **collaborator** copy when emphasis is handoff. |
| **Omitted vs legacy** | Thin **founder story** (no fake arc), no forced **“about us”** section, no **archetype** labels on the page (plan). |
| **Toward ideal** | **Credibility / contrast** lines when differentiation and industry allow (without overclaiming); clearer use of **`competitors` / pain** as *signals* for whether to show contrast at all; align copy with full **`surface` / `signal` / `drop_or_defer`** contract when that work lands. |

### Folio 03 — Voice

| | |
|--|--|
| **Old (in legacy kit)** | Voice Playbook: **Tone profile**, **Voice guardrails**, **Messaging themes**, **Sample phrases**, **CTAs**, **Writing do / avoid**, **Before / after** — often long, section-per-field. |
| **New (guide today)** | **Traits** strip (from preset + sliders), three columns: **Rules**, **Angles**, **CTAs** (capped by `contentDensityBias` + list caps), **bottom band** (“How to use this page”) from **`guideFocus` + primary touchpoint**. Body text still originates from the same playbook assembly, then **trimmed** in the guide model. |
| **Omitted vs legacy** | **Five-axis tone dashboard** and long **tone taxonomy** prose (plan); full-length guardrail lists; **Pro `customVoiceNotes`** not surfaced in Core guide PDF path today. |
| **Toward ideal** | Bottom band **gated or enriched** by signals (sparse vs rich), **primaryGoal**-shaped CTA coaching beyond list extraction, optional **intake-driven** micro-dek; Pro path for **custom voice notes** if product keeps that split. |

### Folio 04 — Voice in Practice (Examples)

| | |
|--|--|
| **Old (in legacy kit)** | Sample phrases, do/avoid, before/after as **large** Voice Playbook sections; weaker examples could still consume space. |
| **New (guide today)** | **Split rail** fixed layout: **sample phrases**, **do / avoid**, **before / after** when pairs are **substantive**; caps from **`emphasis`** + **`contentDensityBias`**; sparse runs **shorter lists**, not a different grid. |
| **Omitted vs legacy** | **Insubstantive** before/after lines, extra pairs when cap is 1, long avoid lists (capped). |
| **Toward ideal** | Explicit **trim order** and **budgets** across examples vs theory (plan + §10A.6); **touchpoint cluster** and **industry** shaping *which* examples surface, not only how many; channel-relevant labels per plan “keep every example channel-relevant.” |

### Folio 05 — Look (Visual direction and application)

| | |
|--|--|
| **Old (in legacy kit)** | Style Guide: **Palette**, **Visual direction**, **Typography**, **Style principles**, **Do / avoid**, **Imagery direction**, **Where to apply this first** — each a section. |
| **New (guide today)** | **Visual system board**: palette strip + prose/mood, **visual summary / keywords**, **typography** lead + **specimens**, **imagery** line, **application** bullets + **application lead** (`guideFocus` + touchpoint); **`emphasis`** adjusts visual occupancy. |
| **Omitted vs legacy** | Dedicated **logo standards** chapter (plan: no logo page without assets); long **style principles** essay compressed into keywords/summary where the model pulls shorter surfaces. |
| **Toward ideal** | **Layout fine-tuning** (status); stronger hidden routing from **`businessOperatingModel`** + **touchpoint set** for “where first” copy; optional richer **imagery** block when signals allow; align **visual keyword** sourcing with open product decision in plan if we change style pipeline. |

### Cross-page (kit-level)

| **Theme** | **Current** | **Ideal (from audits)** |
|-----------|-------------|-------------------------|
| **Data path** | Same form → same deterministic blocks → **guide model** → PDF. | Optional dedicated **assembler** module (plan) if we want a clearer boundary between “kit sections” and “guide regions.” |
| **Intake** | Many fields already **surface** in assembly; **few** fields drive **guide-specific** caps and emphasis today (`guideFocus`, stage/touch/industry/sliders bias). | Memo: most listed fields also drive **visibility** and **cut order**; full **`surface` / `signal` / `drop_or_defer`** in specs across deliverables. |
| **Omission** | Story threshold, before/after minimum length, differentiator generic filter, density caps. | Systematic **compression** when redundant across pages; broader **QA** rules (plan). |

---

## How to read this

- **“Done”** = implemented in repo and covered at least by smoke/model/page-count tests where applicable.
- **“Not done”** = still valid roadmap; not a judgment on priority—product can sequence next.

Intake roles for this guide slice are documented in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.5.

Last updated: 2026-04-18
