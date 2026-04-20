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

### Retired spread subtitle (`deck`) — Brand Identity Guide PDF only

As of **2026-04-21**, `GuideSpreadHeader` no longer renders `editorial.deck` under the folio + title row on any spread. **`deck` and `dekMode` remain on `BrandIdentityGuideModel`** for contract tests, future UI, and other PDFs; only the Brand Identity Guide layout changed.

| Spread | Model path | Representative `deck` content (authoring intent) |
|--------|--------------|-----------------------------------------------------|
| Folio **02b** *Your typography* | `model.visual.typography.editorial.deck` | *How your brand name looks in color, and the typefaces it sits in.* — orients the reader to the split between wordmark-in-palette and typeface specimen. |
| Folio **03** *Personality* | `model.positioning.editorial.deck` | Story-present vs default variants from `positioningDek(guideFocus)` (e.g. feel + credibility framing when there is no `storyNote`). |
| Folio **04** *Voice* | `model.voice.editorial.deck` | *Pick this up when you need the brand to sound like itself in a hurry.* — when-to-use framing for the voice page. |
| Folio **05** *Examples* | `model.examples.editorial.deck` | *Lines you can copy into your site, posts, and emails.* — sets expectation for sample lines + CTAs. |

**Reassessment:** if any of the above should return reader-visible, prefer a **labeled body band** (existing `GuideOpenModule` / card patterns) or a **single guide-wide “how to use this kit”** page rather than repeating a subtitle under every title.

**Wordmark color blocks — research (low-contrast cross-mixes):** WCAG treats **logotypes** differently from body text (contrast rules are often discussed in the context of text and UI components; many teams still **test logo treatments** on white, near-white, dark, and mid-gray because real placements vary). Common brand-manual practice is to foreground **legible, approved** combinations first; **low-contrast** or **busy-background** uses usually appear under **misuse / don’t** sections or with an explicit accessibility caveat, not as anonymous “good” swatches. Our stack keeps a **1.5:1 floor** so we never show an effectively illegible pair as a positive example; mixing “color from column A × color from column B” is already what the ranked pair list does — the **chromatic-reverse skip** only removes redundant *inversions* of the same two hexes, not cross-hue mixes.

**Black / white text or fills not in the palette:** Most mature identity systems still ship **full-color**, **single-color (often black or white ink)**, and sometimes **reversed** lockups because sponsorship, newsprint, fax, embroidery, and favicons strip color. That is normal **reprographics** practice, not “cheating” the palette — it is a separate **ink / substrate** layer from **marketing color**. On a **palette-only** page (like our 02b wordmark column), restricting foreground/background to **swatches the customer already chose** keeps the artifact honest (“your system only”) and avoids inventing `#000000` / `#FFFFFF` they did not pick. If product later wants a **monochrome row** (black or white wordmark on brand fields), that is usually an explicit third rail labeled *one-color reproduction*, not silently mixed into WCAG-ranked palette pairs.

---

### Folio 02a / 02b — Look (Color + Typography)

The Look section spans two physical pages (`02a` Color, `02b` Typography) sharing the *Look* nav highlight and the internal section id `look`. Deterministic contract in [OUTPUT_TRANSLATION_SPEC §10A.12](../../OUTPUT_TRANSLATION_SPEC.md#10a12-visual-section-page-split-color-and-typography).

**1. Legacy kit**

- Style Guide: **Palette**, **Visual direction**, **Typography**, **Style principles**, **Do / avoid**, **Imagery direction**, **Where to apply this first**.

**2. Guide today**

- **Folio 02a — Your colors:**
  - **Two-column spread** (mirrors the redo-dummy `color` reference): a `flex 0.34` narrow column on the left, a `flex 1` wide column on the right, separated by a hairline left border. The page renders **without a deck** (`editorial.dekMode === 'none'`); the title alone owns the header.
  - **Narrow column (summary + visual keywords):** `model.visual.summary` is composed deterministically by `composeColorSummary` in `packages/generation/src/deterministic/colorSummary.ts` and renders as **two short paragraphs** (`systemCharacter` then `usageDiscipline`) in larger body type (`guideColorSummaryParagraph`). Both paragraphs are written without the lowercase "accent" leftover from the retired role taxonomy and hold at most one em-dash across the combined block (the v3 sweep retired the role-jargon and tightened em-dash density to match the new project-wide writing rule). Below that, **Visual keywords** uses the same pattern as folio 01 *Core values* and folio 04 *Traits*: `GuideOpenModule` small caps label + comma-separated `visualKeywords` in `guideInlineTraits` (display family). The legacy `summary.voiceBridge` and `summary.imagery` fields are retired. The standalone `visualCaption` and `imageryDirection` lines are **not surfaced** on this page either; both fields remain on the model for non-guide consumers.
  - **Wide column (palette):** `GuideEqualSwatchRow` from `visual.swatches` — no `PALETTE` label, no chrome above the swatches. Tiles are **taller**, **square-cornered**, and **flush** (no gutter between columns). Each swatch shows the deterministic friendly name (`friendlyColorName`) and the uppercase hex stacked inside, with the foreground readable per `onColor`. Adjacent tiles overlap by 1pt (`marginLeft: -1` on every tile after the first) so react-pdf's sub-pixel rounding can't expose a hairline page-background seam between cells; before this fix the row read as having faint borders or "not-quite-touching" tiles depending on the palette. No role labels and no flex-weighted widths — `paletteRoleLines` / `paletteRolesProse` / `paletteMood` are no longer surfaced on the guide path. The legacy Style Guide PDF still consumes `paletteColorRolesParagraph` from `coreAssembly.ts` for backwards compatibility.
- **Folio 02b — Your typography:**
  - **Two stacked bands:** full-width duo **top band** (`GuideTypefaceSpecimen` `stack`); **bottom band** split **~30 / 70** — **left rail** (`model.visual.typography.wordmarkBandRail` from `composeTypographyWordmarkRail`) stacks **fonts-first intro**, **wordmark grid explainer**, then **compact Google Fonts links** (`GuideWordmarkRailDownloads`, same specimen URLs as `typographyDownloadLinks`) + **licensing** line from `typographyFooterParts`; **right column** + vertical hairline hosts the **2x2** `GuideWordmarkColorBlocks` `grid` inside `GuideOpenModule` `fillHeight`. Top band / bottom band separated by `0.5pt #EEEEF2` horizontal rule. The retired caption under the title (`typography.lead` / `typographySectionLeads` first sentence) was removed so copy is not duplicated or channel-first before font names.
  - **Typeface specimen (top band):** `GuideTypefaceSpecimen` renders one column per `visual.typography.typefaceSpecimens` entry — role eyebrow + face label, then a standard **weight ladder** (*Light* / *Regular* / *SemiBold* / *Bold* / *Italic*, each word set in that weight or style), then a single **`Aa`** pair in regular weight. The brand name is intentionally **not** used as the type sample.
  - **Wordmark in color (bottom band, right ~70%):** **Up to four** blocks from `wordmarkColorBlocks` as a **2x2 tile matrix**; slot mapping and seam overlap unchanged from the 2026-04-23 grid work. `paletteContrastBlocks` rules unchanged. Narrower grid column vs full-page grid keeps tiles taller than a single full-width row.

**3. Omitted vs legacy**

- Standalone **logo standards** chapter (no assets → no chapter); long **style principles** compressed into keywords and caption.
- The duplicate `paletteMood` sentence, the prose-form `paletteRolesProse` paragraph, **and** (on the guide path) the per-role `paletteRoleLines` — folio 02a now drops role prescription entirely.
- The labeled **"Application reference"** placeholder block — `applicationLead`, `applicationBullets`, the `normalizeApplicationBullet` rewriter, and `focusApplicationLead` were all removed when 02a started rendering its swatches directly.
- The wordmark exploration strip, the weight & style ladder, and the brand name as the typeface sample on 02b — replaced by the contrast-ranked wordmark color blocks and a **weight-ladder + `Aa`** typeface specimen (no pangram / full alphabet row). `WordmarkExplorationStrip`, `computeWordmarkExplorationTiles`, and `GuideTypeSpecimenModule` remain in the codebase for legacy callers; only the 02b call sites are removed.

**4. Gaps to ideal**

- ~~Layout polish on 02b's typeface specimen~~ — addressed by the 2026-04-20 spread editorial polish (top-anchored columns, hairline separator, scaled title, 4-block wordmark stack).
- Optional richer **imagery** on 02a when signals allow.
- **Industry visual signal — deferred.** Add a short `visual_signal: string` field per row in `industryProfiles.ts` (priority industries first), then surface one optional sentence inside `model.visual.summary` on folio 02a when `signals.contentDensityBias >= 0` and the summary is still under the word budget. Example targets: *legal_professional_services* → *"In legal and professional services, restraint signals credibility before personality."*, *food_beverage* → *"In food and beverage, warmth and texture do most of the appetite work."* Skipped in the current pass to avoid generic filler; gated on authoring industry-specific lines that are clearly distinctive.
- **Audience / narrator as a third `usageDiscipline` axis — deferred.** The Para 2 dictionary is currently keyed by `(tonePreset × selectedStyle)`, giving 12 cells. Adding `narratorId` (or a small audience archetype bucket) as a third axis would expand the dictionary to roughly 48–72 hand-authored cells. Deferred until we see whether the v2 reads well without it; the audience signal is already represented structurally because `tonePreset` is shaped upstream by the audience intake.

---

### Folio 03 — Personality

**Editorial contract:** [OUTPUT_TRANSLATION_SPEC §10A.7](../../OUTPUT_TRANSLATION_SPEC.md#10a7-personality-page-folio-03-editorial-contract) + deterministic contract [§10A.13](../../OUTPUT_TRANSLATION_SPEC.md#10a13-personality-page-folio-03-deterministic-content-contract). Reader nav label on the page is **Personality** (retired: *Trust & story*, *Position & trust*).

**1. Legacy kit**

- **Brand story angle** and **Differentiation** as full Brief sections; "personality" / "trust" / "feel" implied in overview / customer / values copy, not a dedicated spread.

**2. Guide today**

- **Two-column spread** (reuses the 02a shell — `guideTwoColumnSpreadRow` / `guideTwoColumnNarrowCol` / `guideTwoColumnWideCol`, renamed from the original 02a-only `guideColorSpread*` triad so both pages can share one layout). Narrow left column (`flex 0.34`) holds the personality summary blocks; wide right column (`flex 1`) with a hairline left border holds the focus/story/quote stack and the trust cue.
- **Narrow column:**
  - **Feel** — `positioning.feelAdjectives` (3 adjectives from `tonePreset` + sliders) rendered as a comma-joined inline list under a small-caps *Feel* label. Same pattern as folio 02a *Visual keywords* and folio 01 *Core values*. The prose form `feelLine` is retained on the model as a signal-only fallback for non-PDF consumers and for the generic trust-cue body fallback in `selectPositioningTrustCue`; it is **not** rendered on folio 03.
  - **Editorial triplet (preferred branch)** — `positioning.editorialTriplet` (`Vision`, `Mission`, `Promise`) composed by `composePersonalityEditorialTriplet` in [`packages/generation/src/deterministic/personalityEditorialTriplet.ts`](../../packages/generation/src/deterministic/personalityEditorialTriplet.ts). Sources are intake-first (mission/motivation/origin when concrete) then narrator×tone templates. Slot-intent checks (`vision` outcome, `mission` process, `promise` reliability), anti-dup overlap guards against summary/trust-cue/visual-summary lines, and a hard punctuation budget of **max one em-dash across all three lines combined**.
  - **Fallback branch** — **What it stands for** (`positioning.standsForLine`) from `composePersonalityStandsFor` when triplet confidence fails or sparse mode is active.
- **Wide column:**
  - **Focus lead** (`positioning.focusLead`) as the top paragraph.
  - Exactly one framing body below:
    - **Story paragraph** (`storyNote`) when the brand-story note passes the word-count threshold, **or**
    - **One-line brand statement** (`positioning.oneLine`, mirror of `summary.oneLine`) rendered as a pull quote when no story qualifies. When `storyNote` is present, `oneLine` is omitted.
  - **One trust cue** rendered inline at the bottom (no separate side rail), selected by `selectPositioningTrustCue`: `differentiator` (when substantive) > `collaborator` (when `emphasis === 'handoff'`, labeled *For someone helping you*) > plain `generic` fallback.
- **`editorial.navLabel`** is `'Personality'`; **`title`** stays `'How your brand should come across'` (reads as the long form of *Personality* and satisfies the §10A.11 title-slot rule). **`editorial.figureLabel`** is no longer populated on folio 03 (was used by the retired `HeroRailSpread` side rail).
- **No application snapshot**, no *first surface* / *core shift* / *primary touchpoint* rows; no values / traits block (kept on folio 01 to avoid duplication); no *Who it's for* audience anchor (kept in the folio 01 fact list).

**3. Omitted vs legacy**

- Thin **founder arc**, forced **about us**, **archetype** labels on the page; also the retired snapshot table and any second trust cue.
- The former `HeroRailSpread` render is replaced by the shared two-column shell, giving the page 4–5 content units instead of the prior 2–3.
- `positioning.feelLine` as a rendered prose sentence — retained on the model as a signal-only fallback, not shown on the page.

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

Last updated: 2026-04-28 (folio **03** density pass: implemented the deferred **Vision / Mission / Promise** branch as `positioning.editorialTriplet` composed by new deterministic helper `composePersonalityEditorialTriplet` in `packages/generation/src/deterministic/personalityEditorialTriplet.ts`. Composer is intake-first (`missionStatement` / `motivation` / concrete `originSummary`) with narrator×tone template fallback, then slot-intent validation and anti-dup overlap rejection against `summary.oneLine`, `summary.whatWeDo`, `summary.whoItsFor`, `trustCue.body`, and visual summary lines. Added global punctuation guard `enforceGlobalEmDashBudget` with a hard cap of **one em-dash across all three triplet lines total**. PDF render now shows **Vision / Mission / Promise** in folio 03 narrow column when triplet exists, otherwise falls back to `standsForLine`. In the same pass, Brand Identity Guide header chrome font mapping switched to Inter by setting guide `displayFamily` to `Inter` in `kitDocumentFonts.ts`, so folio numbers and spread titles now share Inter in `GuideSpreadHeader`.)

Last updated: 2026-04-27 (folio **03** broadened from *Trust & story* to *Personality*: reused the 02a two-column shell (`guideTwoColumnSpreadRow` / `guideTwoColumnNarrowCol` / `guideTwoColumnWideCol`, renamed from the 02a-only `guideColorSpread*` triad so both pages share one layout — values unchanged so 02a still renders identically). Narrow column now carries two new blocks: **Feel** (`positioning.feelAdjectives`, a 3-item inline list derived from `tonePreset` + sliders by the new `positioningFeelAdjectives` helper — same visual pattern as folio 01 *Core values* and 02a *Visual keywords*) and **What it stands for** (`positioning.standsForLine`, single concise sentence composed by `composePersonalityStandsFor` in the new [`packages/generation/src/deterministic/personalityStandsFor.ts`](../../packages/generation/src/deterministic/personalityStandsFor.ts) — priority qualifying `step4.missionStatement` > qualifying `step5.motivation` > narrator-keyed fallback from `STANDS_FOR_BY_NARRATOR` with five entries, omitted when `signals.contentDensityBias === -1`). Wide column keeps `focusLead` + story/quote + one trust cue, but the trust cue now renders inline at the bottom of the wide column instead of as a separate side rail (`HeroRailSpread` retired on this page; still in use on folio 01). `editorial.navLabel` changed from `'Trust & story'` to `'Personality'`; `editorial.title` kept as `'How your brand should come across'` (long form of *Personality*, passes the §10A.11 title-slot rule). `editorial.figureLabel` dropped from the folio 03 population (field stays on the `GuideEditorialMeta` type for other surfaces). `positioning.feelLine` retained on the model as a signal-only fallback for non-PDF consumers and the generic trust-cue body fallback; **not** rendered on folio 03. Spec: §10A.7 fully rewritten as the *Personality* contract; §10A.9 nav label audit row updated to *Personality*; §10A.10 reader-IA order + reader-purpose sentence + "sparsest page" paragraph rewritten (folio 03 is no longer the sparsest page); new §10A.13 *Personality page (folio 03) deterministic content contract* added (mirrors §10A.12's structure). Deferred: **Vision / Mission / Promise editorial triplet** — richer 3-slot labeled block keyed by narrator × tone that would supersede the v1 single-sentence `standsForLine`; tracked in [`BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md`](./BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) Page 2 and this Folio 03 gap list.)

Last updated: 2026-04-26 (02b options framing + additive tone guardrails: rail templates now open with reader-first phrasing (*\"This set of fonts...\"*) instead of clinical *\"type system\"* language, and `wordmarkIntro` now frames the color-name examples as **approved options** with one preferred default (strongest pair) plus context-dependent alternates, not a recommendation to use multiple variants. Narrative keeps the “recognizable without a custom logo in every placement” point while avoiding the older “logo lockup” wording. Added new **additive** rules in `OUTPUT_TRANSLATION_SPEC.md` §1.0.1 for folio 02b rail micro-style (options framing, preferred-default hierarchy, banned mechanical terms, CTA wording, no helper mini-header). Existing rules were retained; none removed.)

Last updated: 2026-04-25 (02b rail narrative polish: rewrote `composeTypographyWordmarkRail` to use deterministic **style-keyed editorial templates** instead of mechanical component copy. New contract: para 1 explains **why** chosen typefaces/roles fit; para 2 explains **what the wordmark studies represent**, including the “recognizable without a full logo lockup” narrative when type and palette stay consistent. Kept deterministic branches for Pro `existingTypeface`, two-family, and same-family systems. Rendering polish: `GuideWordmarkRailDownloads` dropped the extra helper mini-header and link CTA now reads exactly **“Download on Google Fonts”**. 30/70 layout unchanged. Spec §10A.12/2a updated; tests updated for narrative assertions + CTA wording.)

Last updated: 2026-04-24 (folio **02b** bottom band **30/70 rail**: replaced `visual.typography.lead` with `visual.typography.wordmarkBandRail` composed by `composeTypographyWordmarkRail` in `typographyWordmarkRail.ts` — fonts-first intro (specimen slots / same-family / Pro existing-typeface), wordmark grid explainer, then compact per-family Google Fonts links + licensing. PDF: `guideTypographyBottomRailCol` / `guideTypographyBottomGridCol`, `GuideWordmarkRailDownloads`. Spec §10A.12 + §10A.5 step6 row; `core-pdfs.test.ts` walker + two rail tests.)

Last updated: 2026-04-23 (02b bands + 2x2 wordmark grid + title-row cap-height fix: rebuilt folio **02b** as **two stacked bands** instead of left/right columns. **Top band** = full-width duo `GuideTypefaceSpecimen` `stack` (each face column gets ~340pt instead of being squeezed into a 432pt left half); `guideTypeSpecimenStackFace.fontSize` bumped 26 → 28 to match the wider band. **Bottom band** = new `GuideWordmarkColorBlocks` `grid` variant: a **2x2 tile matrix** mapped deterministically `blocks[0]`→top-left, `blocks[1]`→top-right, `blocks[2]`→bottom-left, `blocks[3]`→bottom-right so the highest-contrast pair anchors the reading entry point and reading order is left-to-right, top-to-bottom. Each tile is `flex: 1`; column-1 tiles get `marginLeft: -1` and row-1 tiles get `marginTop: -1` (same seam-fix as 02a swatches). Wider cells (~340pt vs the legacy ~208pt column) let the brand-name sample read at the legacy `fontSize: 22` instead of the column variant's 18pt override. Bands separated by a `0.5pt #EEEEF2` top border on the bottom band — the 02a vertical hairline rotated to a horizontal rule. Removed `guideTypographySplit{Row,Left,Gutter,Right}`; added `guideTypographyTopBand` + `guideTypographyBottomBand`; `guideTypographySplitBand` kept as the column wrapper. The legacy `column` variant of `GuideWordmarkColorBlocks` stays in the file (no longer wired to 02b) so we can revert without a contract change. **Title-row fix:** `guideFolioNumber.fontFamily` switched from `bodyFamily` (Inter 700) to `displayFamily` (Source Serif 4 700) so the folio digits and the page title share the same cap-height envelope; weight contrast (700 vs 400) preserves the folio as a marker. Spec §10A.12 02b row, contract item #6a, and §10A.5 `wordmarkColorBlocks` row updated; this audit's Folio 02b bullet rewritten for the bands + 2x2 grid.)

Last updated: 2026-04-22 (folio **02b** wordmark column regression: restored **flush, equal-height** color bands by giving the right rail `GuideOpenModule` a new **`fillHeight`** prop so the module root is `flex: 1` / `minHeight: 0` and the wordmark stack receives real column height; each tile is again **`flex: 1`** with **`marginTop: -1`** on every band after the first (vertical analogue of the 02a swatch overlap) instead of short `minHeight` tiles + 2pt gaps. Spec §10A.12 02b row + this audit’s Folio 02b bullet updated; research note extended on **black/white / monochrome** lockups vs palette-only pages.)

Last updated: 2026-04-21 (spread header + wordmark polish: **`guideFolioNumber` now matches `guideSpreadTitle` at 32pt / lineHeight 1.04** (folio stays body 700, title stays display 400). **Retired `editorial.deck` from the Brand Identity Guide PDF** — `GuideSpreadHeader` renders folio + title only; removed `deck` prop from `GuideSpreadPage` / `GuideSpreadHeader`, deleted `deckFromMeta` and the unused `guideSpreadDeck` style. Model fields `editorial.deck` + `dekMode` unchanged for tests and future surfaces; added **Retired spread subtitle (`deck`)** inventory table + WCAG/wordmark research note in this file; §10A.11 + §10A.12 + §10A.5 `wordmarkColorBlocks` row updated in `OUTPUT_TRANSLATION_SPEC.md`. **Folio 02b wordmark stack:** fixed react-pdf overlap by replacing `flex: 1` per cell with **`minHeight: landscapeLayoutV(84)`** and **2pt** `marginBottom` gaps; **`paletteContrastBlocks`** now skips **chromatic reverses** (same two hexes swapped as bg/fg) so the column is not two inversions of the same pair. `core-pdfs.test.ts` asserts no reverse pairs among the four blocks and in the `paletteContrastBlocks` fixture test.)

Last updated: 2026-04-17 (content-utility pass: reader IA reordered to **Summary → Look → Trust & story → Voice → Examples**; added `summary.oneLine` paste-able brand statement rendered on folio 01 and as a pull quote on folio 03 when no story qualifies; compressed folio 02 Look to a single feel block + scannable palette role lines (`paletteRoleLines`) with retired `paletteMood` / `paletteRolesProse`; added `typography.applications` to the model; moved CTA patterns from folio 04 Voice to folio 05 Examples as copy-ready `ctaTemplates` shaped by `primaryGoal`; new unit tests for each; spec §10A.5 table reshuffled and §10A.10 ordering rationale added).

Last updated: 2026-04-17 (title-voice pass: rewrote the four meta-instructional page titles into reader-owned noun phrases — *Your visual system* (folio 02), *How your brand should come across* (folio 03), *How your brand sounds* (folio 04), *Your brand voice in use* (folio 05); promoted the “use this page when…” framing into the existing `deck` slot on Voice and Examples (`dekMode: 'full'`); rewrote `positioningDek` variants and the story-present deck to drop the *Use this page to…* preamble; added the title-slot banned-vocab list to §10A.9 plus a new §10A.11 “Page-copy slot rule (title vs dek vs body)”; new `core-pdfs.test.ts > guide page titles read as reader-owned labels, not instructions` regression guard).

Last updated: 2026-04-17 (Color/Typography split: Look section now spans two physical pages — **02a *Your colors*** (palette panel + caption + keywords + new `GuideColorInUse` "show, don't tell" composition) and **02b *Your typography*** (`WordmarkExplorationStrip` hero + new `GuideTypeWeightLadder` rendering the brand name in display/subhead/body italic at descending sizes + reused `GuideTypeSpecimenModule` face row); both pages share the *Look* nav highlight and the `look` section id. Removed the labeled "Application reference" placeholder along with `applicationLead`, `applicationBullets`, `normalizeApplicationBullet`, and `focusApplicationLead`. Added `model.visual.typography.editorial` (folio 02b), `wordmarkBrandName`, and `weightLadder` (3 deterministic rows, brand name as the only sample text). New `core-pdfs.test.ts` unit assertions for the 02a/02b folio split, the weight-ladder shape, and the application-reference removal; `countPdfPages` now asserts 6. Spec updates: §10A.5 IA table split Look into 02a/02b, §10A.10 added a "Why Look spans two physical pages" rationale paragraph plus a 02a/02b row in the navigation-label table, and a new §10A.12 "Visual section page split (Color and Typography)" deterministic content contract.

Last updated: 2026-04-17 (Color/Typography refactor: dropped role-prescriptive copy from folio 02a — `paletteRoleLines` is no longer surfaced on the guide path; folio 02a now renders one row of equally-sized swatches via the new `GuideEqualSwatchRow`, fed by `model.visual.swatches: Array<{ hex; name }>` where each `name` comes from a new deterministic `friendlyColorName(hex)` helper (e.g. *Deep Navy*, *Pale Sky*, *Off White*). Folio 02b drops `WordmarkExplorationStrip` and the weight & style ladder — replaced by **`GuideWordmarkColorBlocks`** (three brand-name color blocks ranked by WCAG contrast with the highest-contrast pair in the middle slot) and **`GuideTypefaceSpecimen`** (one column per face showing pangram in regular / bold / italic + an alphabet/numerals row; the brand name is no longer the typeface sample). Added new `paletteContrastBlocks` helper in `brandIdentityGuideModel.ts` and a shared `colorContrast.ts` module with `contrastRatio(fg, bg)` consumed by both the model and the renderer. Removed `wordmarkBrandName`, `weightLadder`, and `composeWeightLadder`. Updated `core-pdfs.test.ts`: replaced `paletteRoleLines` / `weightLadder` / `wordmarkBrandName` assertions with new `swatches` / `wordmarkColorBlocks` / `typefaceSpecimens` assertions; added unit tests for `friendlyColorName` and `paletteContrastBlocks`; refreshed the banned-vocab walker for the new fields and added a new guard that 02a strings drop the role nouns *Primary / Supporting / Accent / Canvas*. Spec updates: §10A.5 row for `step6 palette + style` and the derived rows rewritten to reference `swatches` + `wordmarkColorBlocks` + `typefaceSpecimens`; §10A.10 reader-purpose lines shortened on 02a/02b; §10A.12 deterministic content contract rewritten to match the new components.

Last updated: 2026-04-19 (Look polish: folio **02a** stacks `visualCaption` / keywords / `imageryDirection` **above** the palette and doubles `GuideEqualSwatchRow` swatch band height. Folio **02b** `GuideTypefaceSpecimen` now uses a standard **weight ladder** (*Light* / *Regular* / *SemiBold* / *Bold* / *Italic* — each label in that weight) plus **`Aa` only**; removed pangram and full alphabet/numerals from the model (`typefaceSpecimens` is `faceLabel` + `pdfFamily` + `roleEyebrow` only). Spec §10A.5 / §10A.12 and this audit section updated; `core-pdfs.test.ts` typeface specimen assertion renamed.)

Last updated: 2026-04-19 (02a two-column refactor: folio **02a** now renders a **two-column spread** mirroring the redo-dummy `color` reference — narrow `flex 0.34` narrative column on the left, wide `flex 1` palette column on the right separated by a hairline left border. New `model.visual.summary` field (`paletteFeel` + `voiceBridge` + optional `imagery`) composed deterministically by `composeVisualSummary` in `brandIdentityGuideModel.ts` from `paletteDescriptions[paletteId]`, an audience snippet derived from the ideal-customer body, the existing `styleGuideVisualVoiceBridge(tonePreset, selectedStyle)` line, and (when `signals.contentDensityBias >= 0` and the running word count stays under ~110) the first sentence of `styleGuideImageryDirectionBody`. The 3 visual keyword chips moved **below** the summary inside the narrow column; the standalone `visualCaption` and `imageryDirection` lines are no longer surfaced on this page (both fields kept on the model for non-guide consumers). Added new styles `guideColorSpreadRow` / `guideColorNarrativeCol` / `guideColorPaletteCol` / `guideColorSummaryParagraph` / `guideColorPaletteLabel`. Spec §10A.12 row for 02a + content contract item #1/#1a + new deferred-industry-signal item #7 updated; new `core-pdfs.test.ts > visual.summary composes from palette description and voice/visual bridge` regression guard; existing 02a banned-vocab walker extended to walk `model.visual.summary`. Industry-driven `visual_signal` line on `industryProfiles.ts` is **deferred** and tracked under Folio 02a "Gaps to ideal".)

Last updated: 2026-04-20 (02 spread editorial polish: scaled the shared spread title (`guideSpreadTitle`) from 22pt / lineHeight 1.06 to **32pt / lineHeight 1.04** across every guide page; kept `guideFolioNumber` at 22pt so the folio reads as a small editorial mark next to a much larger title; bumped `guideSpreadHeader.marginBottom` 15 → 18 to give the larger title room before the body band. Folio **02b** redesigned: **bumped `wordmarkColorBlocks` from 3 → up to 4** (`paletteContrastBlocks` in `brandIdentityGuideModel.ts` now `slice(0, 4)` and returns strict descending contrast order, no middle-pin reorder; the highest-contrast pair anchors the top of the stack). The `GuideWordmarkColorBlocks` `column` variant drops the fixed `landscapeLayoutV(122)` block height and uses `flex: 1` so all four blocks share the right-column height equally; `guideWordmarkColumnBlockFull` `paddingVertical` reduced 20 → 14. Vertical alignment changed from `'center'` to `'flex-start'` on both `guideTypographySplitLeft` and `guideTypographySplitRight` so the typeface specimen anchors directly to the title baseline (matching folio 02a) and the wordmark stack grows downward through the band. Added a `0.5pt #EEEEF2` left border + `paddingLeft: 14` to `guideTypographySplitRight` mirroring the 02a `guideColorPaletteCol` hairline; reduced `guideTypographySplitGutter.minWidth` 28 → 14 (the rule now does the visual work the gutter was carrying); bumped `guideTypographySplitLeft.paddingRight` 8 → 12 so the typeface specimen doesn't crash into the new rule. Tests: `core-pdfs.test.ts` line 189 bumped to `toBe(4)`; the `wordmarkColorBlocks` assertion renamed to `> visual.typography.wordmarkColorBlocks renders four contrast-ranked palette pairs in descending contrast order` (asserts descending order across all 4 blocks, drops the middle-slot assertion); `paletteContrastBlocks` unit test renamed to `> paletteContrastBlocks returns up to four pairs in descending contrast order` (asserts length ≤ 4, descending order, and that the top pair on the `[#000, #FFF, #777, #222244]` fixture is `#000`/`#FFF`). Spec updates: `OUTPUT_TRANSLATION_SPEC.md` §10A.5 rows for `step6 palette + style`, `step1.businessName`, and `Derived: visual.typography.wordmarkColorBlocks`; §10A.12 row for 02b in the "What renders" table rewritten to describe the top-anchored typeface column + 4-block hairline-separated wordmark column; contract item #2 rewritten for the 4-block descending-order rule; contract item #6a added documenting the project-wide spread title scale; the test reference in §10A.12 renamed.)

Last updated: 2026-04-19 (02a tile gaps + project-wide em-dash policy + retired "accent" leftover: three small corrections to the v2 cohesive-summary refactor. (1) **Swatch tile gaps:** `GuideEqualSwatchRow` now applies `marginLeft: -1` to every tile after the first so adjacent `flex: 1` cells overlap by 1pt. Without this, react-pdf's sub-pixel rounding intermittently exposed a 1pt page-background seam between cells, which read as "borders on some tiles" or "tiles not quite touching" depending on the palette. Folio 02b is unaffected because its blocks are intentionally spaced. (2) **Lowercase "accent" retired from 02a copy:** `tonalArcSentence` in `colorSummary.ts` no longer ends with *"opens space for the accent"* (now *"opens the page up"*); all 12 `COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE` entries were rewritten to substitute concrete descriptive language (*the deepest tones*, *the boldest tone*, *the brightest swatch*, *the punctuation color*, *the loudest hue*) for "the accent" / "an accent". The `paletteDescriptions['midnight_luxe']` entry in `coreAssembly.ts` swaps *"warm gold-tan accent"* for *"warm gold-tan highlight"*. The 02a-only `roleNouns` regex was already banning the capitalized form; the v3 sweep adds a `\baccent\b` (case-insensitive) guard alongside it on `model.visual.summary.systemCharacter` and `model.visual.summary.usageDiscipline`. (3) **Project-wide em-dash policy:** added a "Writing rules" subsection (§1.0.1) in `OUTPUT_TRANSLATION_SPEC.md` and an em-dash ≤1-per-paragraph guard inside the existing `'reader-visible guide strings contain no banned vocabulary'` walker in `core-pdfs.test.ts`; "paragraph" splits on `\n+` and on sentence boundaries (`(?<=[.!?])\s+(?=[A-Z"'])`). Rewrote 27 `paletteDescriptions` + 4 `styleDescriptions` in `coreAssembly.ts`, all 12 `STYLE_GUIDE_VOICE_VISUAL_BRIDGE` entries in `voiceVisualBridge.ts`, the 5 multi-em-dash `typographySectionLeads` entries in `typographyMatrix.ts`, the multi-em-dash entries in `phase8Content.ts` STYLE_IMAGERY_CORE / CLUSTER_IMAGERY_TAIL, the two multi-em-dash entries in `paletteColorRoles.ts`, and the typography "complement existing" / footer / section-lead helpers in `coreAssembly.ts`. Single-em-dash bullet lines elsewhere were left alone — the rule allows one. New 02a-specific assertion confirms the combined `systemCharacter` + `usageDiscipline` block holds at most one em-dash. Spec §10A.12 row for 02a + contract item #1/#1a updated to reflect the closer change, the marginLeft tile fix, and the new writing rules. Tests: 159/159 passing; lint matches the known pre-existing baseline.)

Last updated: 2026-04-19 (02a cohesive summary v2: rewrote the folio **02a** narrow-column summary into a redo-style two-paragraph schema. `model.visual.summary` is now `{ systemCharacter, usageDiscipline }`. The previous `paletteFeel` / `voiceBridge` / `imagery` fields are retired — the audience-stapling sentence (*"It frames {audience} so the brand reads as ..."*) was producing run-on grammar because the upstream `idealCustomerBriefBody` is multi-sentence with no separator, and the `voiceBridge` + standalone `imagery` lines read as off-topic on a colors-only page. New `composeColorSummary` in `packages/generation/src/deterministic/colorSummary.ts` composes (a) `systemCharacter` = `paletteDescriptions[canonicalPaletteId(paletteId)]` + a templated tonal-arc closer that names the palette's deepest / mid / lightest swatches (ranked by relative luminance via `colorContrast.ts` helpers) and reads them through a style-driven adjective from a new `COLOR_SUMMARY_STYLE_ADJECTIVES` map (`clear` / `graphic` / `warm` / `restrained`), and (b) `usageDiscipline` = verbatim entry from a new hand-authored `COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE` dictionary (3 tones × 4 styles = 12 entries; lowercase descriptive role words only). 27 palettes × 12 voice-style cells ≈ 324 distinct deterministic summaries grounded in real signals. Layout cleanup: removed the `PALETTE` mini-header label from the wide column and the `guideColorPaletteLabel` style from `createCoreKitStyles`; set `editorial.dekMode = 'none'` so folio 02a no longer renders the *"The colors that make up your brand."* deck (title alone owns the header). `composeVisualSummary` and the `audienceSnippetForVisualSummary` / `wordCount` helpers in `brandIdentityGuideModel.ts` were deleted; `composeColorSummary` is re-exported from the model file for backwards-compatible test imports. Updated `core-pdfs.test.ts`: rewrote the summary unit test as `> visual.summary composes system character + usage discipline` (asserts palette-description prefix, tonal-arc closer, exact dictionary match, role-noun ban, word-count caps), added `> visual.editorial drops the page deck on folio 02a`, and updated both 02a banned-vocab walkers to read the new `systemCharacter` / `usageDiscipline` fields. Spec §10A.12 row for 02a + contract item #1/#1a + new deferred audience-axis item #8 updated; the inline `step6 palette + style` row in §10A.5 also rewritten to reflect the new layout. Audience / narrator as a third `usageDiscipline` axis is **deferred** and tracked under Folio 02a "Gaps to ideal".)
