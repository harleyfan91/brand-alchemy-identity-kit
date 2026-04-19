# Brand Identity Guide refactor — status

This note captures **what is implemented today** versus **what remains**, aligned with:

- [`BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md)
- [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md)

Companion spec language lives in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) (§10A Editorial Guide Layout Rules).

---

## Done (shipped in code)

### Product / packaging

- Core kit includes a dedicated **Brand Identity Guide** PDF (`05-brand-identity-guide.pdf`).
- **Six-page** target for that document — Look renders as two physical pages (**02a Color** + **02b Typography**) sharing the *Look* nav entry; the other four sections are one page each. Enforced by generation tests (`countPdfPages` asserts `=== 6`).

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

- **Folio 04 Voice:** **bottom band** below the two-column grid — deterministic “How to use this page” copy from `guideFocus` + primary touchpoint (can later be gated or enriched by signals / intake).
- **Folio 02 Look:** directionally balanced; **fine-tune** spacing and type-board proportions only. Consider a richer imagery sample when signals allow.

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

**2. Guide today** (what ships on folio 01)

- Hero **one-line quote** (`summary.oneLine`, paste-able “{Business} helps {audience}. {Transformation}.”) — falls back to the full anchor when the one-line composer cannot derive a sentence.
- **Trait pills**, optional **differentiator** line, and **fact list** (what we do / who it’s for / what changes for them).
- The previous *“Primary touchpoint”* caption has been **removed** from the hero. `primaryTouchpoint` is kept as a `signal` that shapes later-page copy, not as a reader-visible label.
- `summary.focusLead` is in the model for **other pages’ fallbacks**, not a headline here.

**3. Omitted vs legacy**

- Full **story** on folio 01, long **ideal customer** body, **competitor** narrative, weak **differentiator**, strategy-length **overview**, explicit **archetype** labels (per plan).
- The trailing *“The voice stays …”* clause of the anchor is stripped from the one-line hero quote (it repeats information already in the Voice spread).

**4. Gaps to ideal**

- Use **`stage`** and **touchpoint breadth** as *signals* for summary emphasis, not only for caps on later pages.
- Optional “first win” line when `guideFocus` is `know_what_to_fix_first`.
- Plan-style **non-marketer QA** for this spread.

---

### Folio 02a / 02b — Look (Color + Typography)

The Look section spans two physical pages (`02a` Color, `02b` Typography) sharing the *Look* nav highlight and the internal section id `look`. Deterministic contract in [OUTPUT_TRANSLATION_SPEC §10A.12](../../OUTPUT_TRANSLATION_SPEC.md#10a12-visual-section-page-split-color-and-typography).

**1. Legacy kit**

- Style Guide: **Palette**, **Visual direction**, **Typography**, **Style principles**, **Do / avoid**, **Imagery direction**, **Where to apply this first**.

**2. Guide today**

- **Folio 02a — Your colors:**
  - **Copy first:** `visualCaption` (one-sentence summary) + `visualKeywords` (≤3 chips) + `imageryDirection` caption render **above** the palette so the page reads like a standard brand guide (narrative, then swatches).
  - **Equal-swatch row:** `GuideEqualSwatchRow` renders one row of equally-sized swatches (`flex: 1` per block) from `visual.swatches`, at **double** the previous band height so the palette is the visual hero. Each swatch shows the deterministic friendly name (`friendlyColorName`, e.g. *Deep Navy*, *Pale Sky*) and the uppercase hex stacked inside, with the foreground readable per `onColor`. No role labels and no flex-weighted widths — `paletteRoleLines` / `paletteRolesProse` / `paletteMood` are no longer surfaced on the guide path. The legacy Style Guide PDF still consumes `paletteColorRolesParagraph` from `coreAssembly.ts` for backwards compatibility.
- **Folio 02b — Your typography:**
  - **Wordmark in color:** `GuideWordmarkColorBlocks` renders three equally-sized blocks from `visual.typography.wordmarkColorBlocks`. Each block fills its background with a palette color and centers the brand name in a contrasting palette color. Pairs are ranked by WCAG contrast ratio (shared `contrastRatio` helper in `colorContrast.ts`); the highest-contrast pair sits in the middle slot, the next two on the outsides. Pairs below 1.5:1 are filtered out. Hex captions sit underneath each block.
  - **Typeface specimen:** `GuideTypefaceSpecimen` renders one column per `visual.typography.typefaceSpecimens` entry — role eyebrow + face label, then a standard **weight ladder** (*Light* / *Regular* / *SemiBold* / *Bold* / *Italic*, each word set in that weight or style), then a single **`Aa`** pair in regular weight. The brand name is intentionally **not** used as the type sample.

**3. Omitted vs legacy**

- Standalone **logo standards** chapter (no assets → no chapter); long **style principles** compressed into keywords and caption.
- The duplicate `paletteMood` sentence, the prose-form `paletteRolesProse` paragraph, **and** (on the guide path) the per-role `paletteRoleLines` — folio 02a now drops role prescription entirely.
- The labeled **"Application reference"** placeholder block — `applicationLead`, `applicationBullets`, the `normalizeApplicationBullet` rewriter, and `focusApplicationLead` were all removed when 02a started rendering its swatches directly.
- The wordmark exploration strip, the weight & style ladder, and the brand name as the typeface sample on 02b — replaced by the contrast-ranked wordmark color blocks and a **weight-ladder + `Aa`** typeface specimen (no pangram / full alphabet row). `WordmarkExplorationStrip`, `computeWordmarkExplorationTiles`, and `GuideTypeSpecimenModule` remain in the codebase for legacy callers; only the 02b call sites are removed.

**4. Gaps to ideal**

- **Layout polish** (column widths and tile spacing on 02b's typeface specimen).
- Optional richer **imagery** on 02a when signals allow.

---

### Folio 03 — Trust & story

**Editorial contract:** [OUTPUT_TRANSLATION_SPEC §10A.7](../../OUTPUT_TRANSLATION_SPEC.md#10a7-trust--story-page-folio-03-editorial-contract). Reader nav label on the page is **Trust & story** (not *Position & trust*).

**1. Legacy kit**

- **Brand story angle** and **Differentiation** as full Brief sections; “trust” implied in overview / customer copy, not a dedicated spread.

**2. Guide today**

- **Focus lead** from `guideFocus`, followed by exactly one framing body:
  - **Story paragraph** (`storyNote`) when the brand-story note passes the word-count threshold, **or**
  - **Feel line + one-line brand statement** — when no story qualifies, a short tone-preset + slider driven `feelLine` sits under the focus lead, and the paste-able `positioning.oneLine` (mirror of `summary.oneLine`) renders as a pull quote. The pair is the only permitted backfill; no snapshot, no rows.
- **One trust cue** rendered in the rail, selected by `selectPositioningTrustCue`: `differentiator` (when substantive) > `collaborator` (when `emphasis === 'handoff'`, labeled *For someone helping you*) > plain `generic` fallback.
- **No application snapshot**, no *first surface* / *core shift* / *primary touchpoint* rows. The previous snapshot table and page footer figure are **removed**.

**3. Omitted vs legacy**

- Thin **founder arc**, forced **about us**, **archetype** labels on the page; also the retired snapshot table and any second trust cue.

**4. Gaps to ideal**

- **`competitors` / pain / outcomes** as *signals* for whether a differentiator trust cue is surfaced at all.
- Full **`surface` / `signal` / `drop_or_defer`** in spec + code when that program ships.

---

### Folio 04 — Voice

**1. Legacy kit**

- Voice Playbook: **Tone profile**, **Voice guardrails**, **Messaging themes**, **Sample phrases**, **CTAs**, **Writing do / avoid**, **Before / after** — long blocks.

**2. Guide today**

- **Traits** strip; **two** columns — **Rules** · **What to talk about** (list caps + `contentDensityBias`). The previous abstract “Calls to action” column was **removed** from Voice; copy-ready CTA templates now live on folio 05 (Examples) as `examples.ctaTemplates`.
- *What to talk about* is only rendered when `messagingAngles.length > 0`; empty headers no longer appear. The column uses `extractColonLeadLines` to parse upstream `narratorMessagingThemes` prose.
- **Bottom band** — plain-language “how to use this page” copy from `guideFocus` + primary touchpoint (no *guardrails*, *off-brand*, *quick-start*, or *angles* terminology).
- Copy still comes from playbook assembly, then **trimmed and deduped** in the guide model — no literal string appears on both folio 04 `voice.rules` and folio 05 `examples.doLines`.

**3. Omitted vs legacy**

- **Five-axis dashboard** and long taxonomy prose; full guardrail length; the abstract Voice CTA column (superseded by copy-ready CTA templates on Examples); **Pro `customVoiceNotes`** not on Core guide PDF path.

**4. Gaps to ideal**

- Gate or **enrich** bottom band from signals / intake (not only `guideFocus`).
- Pro surfacing for **custom voice notes** if product keeps that split.

---

### Folio 05 — Examples (Voice in practice)

**Quality rubric:** [OUTPUT_TRANSLATION_SPEC §10A.8](../../OUTPUT_TRANSLATION_SPEC.md#10a8-before--after-example-quality-rubric-folio-05).

**1. Legacy kit**

- Same Voice Playbook: **Sample phrases**, **Writing do / avoid**, **Before / after** as large sections; weak lines could still fill space.

**2. Guide today**

- **Sample lines** row at top.
- **CTA templates** (`examples.ctaTemplates`) — 2–3 copy-ready CTA lines shaped by `primaryGoal` (`direct_sales` / `lead_gen` / `audience_growth` / `retention`), rendered under sample phrases. Replaces the previous abstract CTA column on Voice.
- Fixed **split rail**: before/after **only when pairs qualify under §10A.8** · Do / avoid.
- Rubric enforced by `isQualifyingBeforeAfterPair`: generic-label filter, meta-commentary filter, and normalized Levenshtein edit-distance floor (synonym-only rephrases are dropped).
- When zero pairs qualify, the model raises `effectiveMaxSamplePhrases` to the upper cap (6) and the empty before/after figure-mat placeholder is **not rendered**.
- Caps from **`emphasis`** + **`contentDensityBias`** still apply to surviving content; sparse = **shorter lists**, same grid.

**3. Omitted vs legacy**

- **Short / weak** before–after pairs; extra pairs when cap is 1; long avoid lists (capped); any pair whose label is generic or whose After is a synonym-only rephrase; the abstract “CTA patterns” from the legacy Voice column (replaced by copy-ready `ctaTemplates`).

**4. Gaps to ideal**

- **Touchpoint cluster** + **industry** choose *which* labels and After patterns, not only how many.
- Second `primaryGoal`-shaped CTA band (short vs medium vs long) if follow-up research supports the need.

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

Last updated: 2026-04-17 (content-utility pass: reader IA reordered to **Summary → Look → Trust & story → Voice → Examples**; added `summary.oneLine` paste-able brand statement rendered on folio 01 and as a pull quote on folio 03 when no story qualifies; compressed folio 02 Look to a single feel block + scannable palette role lines (`paletteRoleLines`) with retired `paletteMood` / `paletteRolesProse`; added `typography.applications` to the model; moved CTA patterns from folio 04 Voice to folio 05 Examples as copy-ready `ctaTemplates` shaped by `primaryGoal`; new unit tests for each; spec §10A.5 table reshuffled and §10A.10 ordering rationale added).

Last updated: 2026-04-17 (title-voice pass: rewrote the four meta-instructional page titles into reader-owned noun phrases — *Your visual system* (folio 02), *How your brand should come across* (folio 03), *How your brand sounds* (folio 04), *Your brand voice in use* (folio 05); promoted the “use this page when…” framing into the existing `deck` slot on Voice and Examples (`dekMode: 'full'`); rewrote `positioningDek` variants and the story-present deck to drop the *Use this page to…* preamble; added the title-slot banned-vocab list to §10A.9 plus a new §10A.11 “Page-copy slot rule (title vs dek vs body)”; new `core-pdfs.test.ts > guide page titles read as reader-owned labels, not instructions` regression guard).

Last updated: 2026-04-17 (Color/Typography split: Look section now spans two physical pages — **02a *Your colors*** (palette panel + caption + keywords + new `GuideColorInUse` "show, don't tell" composition) and **02b *Your typography*** (`WordmarkExplorationStrip` hero + new `GuideTypeWeightLadder` rendering the brand name in display/subhead/body italic at descending sizes + reused `GuideTypeSpecimenModule` face row); both pages share the *Look* nav highlight and the `look` section id. Removed the labeled "Application reference" placeholder along with `applicationLead`, `applicationBullets`, `normalizeApplicationBullet`, and `focusApplicationLead`. Added `model.visual.typography.editorial` (folio 02b), `wordmarkBrandName`, and `weightLadder` (3 deterministic rows, brand name as the only sample text). New `core-pdfs.test.ts` unit assertions for the 02a/02b folio split, the weight-ladder shape, and the application-reference removal; `countPdfPages` now asserts 6. Spec updates: §10A.5 IA table split Look into 02a/02b, §10A.10 added a "Why Look spans two physical pages" rationale paragraph plus a 02a/02b row in the navigation-label table, and a new §10A.12 "Visual section page split (Color and Typography)" deterministic content contract.

Last updated: 2026-04-17 (Color/Typography refactor: dropped role-prescriptive copy from folio 02a — `paletteRoleLines` is no longer surfaced on the guide path; folio 02a now renders one row of equally-sized swatches via the new `GuideEqualSwatchRow`, fed by `model.visual.swatches: Array<{ hex; name }>` where each `name` comes from a new deterministic `friendlyColorName(hex)` helper (e.g. *Deep Navy*, *Pale Sky*, *Off White*). Folio 02b drops `WordmarkExplorationStrip` and the weight & style ladder — replaced by **`GuideWordmarkColorBlocks`** (three brand-name color blocks ranked by WCAG contrast with the highest-contrast pair in the middle slot) and **`GuideTypefaceSpecimen`** (one column per face showing pangram in regular / bold / italic + an alphabet/numerals row; the brand name is no longer the typeface sample). Added new `paletteContrastBlocks` helper in `brandIdentityGuideModel.ts` and a shared `colorContrast.ts` module with `contrastRatio(fg, bg)` consumed by both the model and the renderer. Removed `wordmarkBrandName`, `weightLadder`, and `composeWeightLadder`. Updated `core-pdfs.test.ts`: replaced `paletteRoleLines` / `weightLadder` / `wordmarkBrandName` assertions with new `swatches` / `wordmarkColorBlocks` / `typefaceSpecimens` assertions; added unit tests for `friendlyColorName` and `paletteContrastBlocks`; refreshed the banned-vocab walker for the new fields and added a new guard that 02a strings drop the role nouns *Primary / Supporting / Accent / Canvas*. Spec updates: §10A.5 row for `step6 palette + style` and the derived rows rewritten to reference `swatches` + `wordmarkColorBlocks` + `typefaceSpecimens`; §10A.10 reader-purpose lines shortened on 02a/02b; §10A.12 deterministic content contract rewritten to match the new components.

Last updated: 2026-04-19 (Look polish: folio **02a** stacks `visualCaption` / keywords / `imageryDirection` **above** the palette and doubles `GuideEqualSwatchRow` swatch band height. Folio **02b** `GuideTypefaceSpecimen` now uses a standard **weight ladder** (*Light* / *Regular* / *SemiBold* / *Bold* / *Italic* — each label in that weight) plus **`Aa` only**; removed pangram and full alphabet/numerals from the model (`typefaceSpecimens` is `faceLabel` + `pdfFamily` + `roleEyebrow` only). Spec §10A.5 / §10A.12 and this audit section updated; `core-pdfs.test.ts` typeface specimen assertion renamed.)
