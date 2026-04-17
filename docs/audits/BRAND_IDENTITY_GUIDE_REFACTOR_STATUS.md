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
- **Redo-style dummy** PDF remains a **parallel layout reference** (not a second production content taxonomy).
- **Parent-kit neutrals** for guide chrome and tinted cards; **customer palette** appears where it represents their system (e.g. palette swatches), not as global card washes.
- **Fixed PDF font stack** for guide narrative and chrome (**Inter** + **Source Serif 4**); **typography specimens** still use the customer’s registered faces.

### Model and signals

- `BrandIdentityGuideModel` with per-page **`GuideEditorialMeta`** (folio, nav, title, dek mode, layout id, densities, figure labels).
- **`guideFocus` → `signals.emphasis`** drives editorial choices on **voice / examples / look** pages (e.g. example density, visual occupancy).
- **`contentDensityBias`** merges stage + touchpoint breadth with **industry** (compliance trim set) and **voice sliders** (expressive vs. formal/direct), clamped to −1 / 0 / +1; drives sample caps, before/after pairs, and voice list caps.
- **Omission heuristics:** thin brand-story notes omitted for positioning deks; before/after pairs must meet minimum length; insubstantive pairs dropped; sparse bias trims voice rules and angles (2 vs 3 lines).
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

---

## How to read this

- **“Done”** = implemented in repo and covered at least by smoke/model/page-count tests where applicable.
- **“Not done”** = still valid roadmap; not a judgment on priority—product can sequence next.

Intake roles for this guide slice are documented in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.5.

**How to review PDF + content changes:** see [`GUIDE_PDF_REVIEW.md`](./GUIDE_PDF_REVIEW.md) (snapshot JSON beside each `generate:pdfs` run).

Last updated: 2026-04-17
