# Core path customization audit

**Status:** **Living backlog** — checklist hub for Core PDF customization, shipping gates, and typography program work.

**Purpose:** End-to-end view of the Identity Kit intake → deterministic generation path, mapped from **generic** (one-size-fits-many) to **customized** (signals that narrow copy and channel advice). Use this to prioritize product work so outputs stay credible for segments such as **Etsy-forward makers** vs **LinkedIn-forward consultants**.

**Also use this doc as the refactoring / output-quality backlog** for Core PDFs (what to consolidate next, which fallbacks exist, and where to edit when the pipeline changes).

**Related specs:** [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) (translation layers), [DELIVERABLE_PRODUCTION_SPEC.md](../../DELIVERABLE_PRODUCTION_SPEC.md) (deliverable rules), [CORE_INPUT_REDESIGN_ANALYSIS.md](./CORE_INPUT_REDESIGN_ANALYSIS.md) (deterministic input philosophy), [SCREEN_COPY_MAP.md](../../SCREEN_COPY_MAP.md) (UI copy inventory), [STEP1_INDUSTRY_CATALOGS.md](../../STEP1_INDUSTRY_CATALOGS.md) (industry wheel reference), [PHASE_ROADMAP.md](../../PHASE_ROADMAP.md) (PDF polish queue).

### How to use this document as the single checklist hub

Everything stays in **this one file** so roadmap, maintenance, and PDF refactors do not scatter across Slack-only notes. Different sections serve different **checklist jobs**:

| Section | Checklist job | How to track “done” |
|---------|----------------|---------------------|
| **§5** | **Roadmap backlog** — highest-impact kit customization work | Ordered items use `- [ ]` / `- [x]` (or strike the line and add a short “Done:” note with date/PR). |
| **§6** | **Shipping checklist** — whenever you add a field, industry, or catalog change | Complete **every** checkbox row before merging; add rows if new wiring appears. |
| **§7** | **PDF & copy refactor backlog** — dedupe, placeholders, typography product exploration | Use `- [ ]` under each subsection when a task exists; §7.2 is a **lookup table** (not a tick list). See **Phased execution** for **P1** vs **P2**. |
| **§2–4** | **Reference** — spectrum, risks, channel goals | Read when prioritizing; update tables if behavior changes. |

You can still mirror §5/§7 items into GitHub issues; **treat this doc as canonical** so the checklist does not live only in an issue description.

---

## Phased execution (checklist flags)

Two phases only — **no duplicate work** between them. Preproduction: nothing customer-facing has shipped, so **skip interim PDF patches** that Phase 2 would immediately replace (e.g. a one-off “specimens are illustrative” callout). Fold specimen truth, naming, and embed/stand-in decisions into **§7.4** when you build per-kit recommendations.

| Phase | Goal | What to ship (detail lives in §5 / §7) |
|-------|------|----------------------------------------|
| **Phase 1** | Style Guide **structure** — less repeated logo/wordmark prose | **§7.1** only: one primary logo/wordmark block (+ optional one-liner + tests / `VisualDirectionBlock` as needed). **No** separate specimen-disclaimer pass; **no** font recipe matrix; **no** full Week 2–4 sweep. |
| **Phase 2** | Kit **feels tailored** — routing, catalogs, **and** typography program in one track | **§5** (touchpoints/goal wiring sweep, UI guardrails, industry voice, Week 2–4 tightening, archetypes, Review Pro upsell). **§7.4** (research → spike → spec → recipe **coverage** + wizard/PDF parity + optional stand-in labeling). **Named recipes + PDF embed are shipped** (see §7.3); remaining §7.4 work is validation and polish, not greenfield wiring. |

**In the lists below:** **`[P1]`** = Phase 1 · **`[P2]`** = Phase 2.

---

## 1. What we mean by generic vs customized

| End of spectrum | Meaning in this codebase | Examples |
|-----------------|-------------------------|----------|
| **Generic** | Same strings or templates for most users; fallbacks when a key is empty or unknown | Default stage framing, default narrator fallback, `DEFAULT_CATALOG` / `DEFAULT_INDUSTRY_VOICE`; typography **fallback** recipe when no higher-specificity match (historically discussed as Inter/Source Serif stand-ins — **PDF specimens now embed the resolved recipe pair** from `typographyRecipes` + `registerCoreKitPdfFonts`) |
| **Customized** | Output branches on **structured** fields the user set | Step 1 industry-specific wheel options, `week1Items` keyed by `brandNarrator`, `touchpointCluster` from narrator **+** industry, industry-aware buyer archetypes |

**Important:** “Customized” here is **rule-based**, not LLM-personalized (Core tier is deterministic assembly in `packages/generation`).

---

## 2. Core path map (intake → PDF)

Rough flow: **micro-step wizard** (`apps/web`) → **`IdentityKitForm`** (`packages/shared/src/form.ts`) → **generation** (`packages/generation/src/deterministic/*`, PDF render).

### 2.1 Spectrum by layer

| Layer | Location (primary) | Generic ↔ customized | Notes |
|-------|---------------------|-------------------------|-------|
| **Business name** | `step1.businessName` | Neutral fact | Drives anchors and specimens; not “industry logic.” |
| **Industry** | `step1.industry` | **Strong customization** for Step 1 wheels | `INDUSTRY_CATALOGS` in `apps/web` + `packages/shared` `step1ControlledOptions.ts`; `other` uses `DEFAULT_CATALOG`. |
| **Stage** | `step1.stage` | **Medium** | Drives `StageContext` → Quick Start preambles, one Style Guide do/avoid line (`stageContextFromStage` in `brandProfile.ts`). |
| **Brand narrator** | `step1.brandNarrator` | **Strong** for channel **archetypes** and Week 1–2 checklist *templates* | `narratorProfiles.ts`: `primary_channels`, `content_pillars`, CTA patterns, `week1Items` / `week2Items` in `coreAssembly.ts`. |
| **Offer + transformation** | Controlled IDs + optional Other | **Strong** in sentence assembly | Labels/descriptions from industry catalog; assembled lines in `coreAssembly.ts`. |
| **Buyer archetype** | `step2.customerArchetype` | **Medium** | Controlled ids map to display titles via `resolveBuyerArchetypeTitle` in `packages/shared/src/buyerArchetypes.ts` (catalog shared with the web wizard). |
| **Voice** | `step3` preset + sliders (+ optional notes Pro) | **Medium** | Tone copy and guardrails; sliders shape phrasing in places. |
| **Values / story / aesthetic / competitors** | Steps 4–7 | **Low–medium** in Core PDF today | Feeds brief sections, differentiation, visuals; less “channel routing” than narrator/industry. |
| **Touchpoint cluster** | Derived: `computeBrandProfile` → `touchpointCluster` | **Medium–strong** for **Week 3** visual rollout | `brandProfile.ts`: narrator + industry **base** cluster, then if the user’s **#1 touchpoint** is a **marketplace** and the base is `social_service`, promote to **`social_product`** (does not override `physical_first` or `local_community`). Week 3 **bullets** interpolate `resolveChannelPlan` labels. |
| **Typography framing** | `typographyContextFromCluster` → `typographyMatrix.ts` + `typographyRecipes` / `coreAssembly` | **Medium** | Section **leads** in `typographyMatrix.ts`; **pair selection** via `getRecipeForProfile` (style, cluster, stage, tone, etc.). `professional_and_digital` source strings may still say “LinkedIn”; **assembly** substitutes the resolved primary channel label. **Core** kits append a short deterministic note that the shown pair is recipe-default and licensed incumbents can map to the same roles; **`step6.existingTypeface` is Pro-only** in intake (`microStepSchema` `c6_s3`) and only affects PDF continuity copy when `typographyHonorsExistingTypeface(form)`. |
| **Industry voice seasoning** | `industryProfiles.ts` | **Weak today (coverage)** | Only **some** industries have profiles; rest → `DEFAULT_INDUSTRY_VOICE`. Wired into Voice Playbook / assembly per `OUTPUT_TRANSLATION_SPEC` §6 intent. |

### 2.2 Where the kit already avoids “LinkedIn for everyone”

- **Week 1 intro and channel names** come from **`resolveChannelPlan`** (`coreAssembly.ts`): ordered `step1.touchpoints[0]` wins; narrator `primary_channels` fill gaps when touchpoints are empty or incomplete.
- **Week 1 checklist lines** use **`NarratorId`** templates in `week1Items`, with a **commerce branch** for `solo_expert` when the resolved **primary touchpoint bucket** is `marketplace` (shop/listing tasks instead of booking-first defaults).
- **`primary_channels`** in `narratorProfiles.ts` remains the **fallback** channel ordering when touchpoints are missing.
- **Week 3** uses **`touchpointCluster`** for *which* checklist family; cluster can promote **`social_service` → `social_product`** when the user’s primary touchpoint is a marketplace. **`resolveChannelPlan(form)`** still supplies surface labels inside bullets.
- **Voice Playbook** separates **messaging themes** from **CTAs**; Core **CTA** copy is driven by **`primaryGoal` + channel plan**, not `narratorProfile.cta_type`.

`Just me — I am the brand` (`solo_expert`) is **not** tied to consulting channels in the kit when the user ranks **marketplace** (or other surfaces) first; narrator shapes story/templates, touchpoints shape **where** copy applies.

---

## 3. “Main goals” — social vs website vs growth (are we capturing them?)

### 3.1 In the schema today

**Structured signals that now exist (Core):**

- **`step1.touchpoints[]`** — ordered, normalized multi-select (see `packages/shared/src/touchpoints.ts`); drives Week 1 anchor, channel-named copy, Voice Playbook CTAs on the primary channel, and related deterministic routing (with narrator fill-in when empty).
- **`step1.primaryGoal`** — `direct_sales` | `lead_gen` | `audience_growth` | `retention`; drives Voice Playbook CTA patterns and goal-aligned checklist language where wired.

**Still thin or implicit (no dedicated field for):**

- Relative *priority* of social vs site beyond touchpoint order (e.g. “website is legacy, TikTok is the bet”),
- Appetite to expand / pivot channels,
- A full “main goals” discovery questionnaire beyond goal + touchpoints.

The closest **additional** signals are:

| Signal | What it captures | What it does *not* capture |
|--------|-------------------|----------------------------|
| **`brandNarrator`** | Archetype of how the business shows up (expert / maker / local team / product / mission) | Fine-grained “I only sell on Etsy, no site” unless touchpoints reflect it. |
| **`narratorProfiles.primary_channels`** | Ordered default channels **per narrator** when touchpoints are missing or incomplete | User-specific truth when the user does not set touchpoints. |
| **`step1.industry` + wheels** | What they sell, to whom, how, before/after | Marketing strategy or channel budget. |
| **Pro freeform** (pain points, outcomes, notes) | Optional texture | Not structured for deterministic routing in Core today. |

So **channel + business goal** are partially first-class; the **initial discovery idea** (“really focused on social vs website” as narrative) can still gap if touchpoints are empty or narrator-heavy defaults win. Week 2 email signature and `professional_and_digital` typography are now **touchpoint-aware** where it mattered most; remaining narrator-default lines should still be reviewed when new narrators or industries ship.

### 3.2 Product direction (when you implement goals)

Without prescribing implementation here, the audit conclusion is:

1. **If** channel alignment matters for trust, add a **small structured slice** (e.g. primary touchpoint + “also active on” + optional “avoid recommending”) **or** infer with explicit confirmation in UI.
2. Pipe that signal into: Quick Start weeks, typography section leads where they name channels, and any “apply first” blocks — **after** narrator + industry, so rules stay deterministic.
3. Optionally surface **tradeoffs** (“double down vs expand”) as **templated** copy keyed off goal + stage, not freeform strategy.

Document cross-refs: `OUTPUT_TRANSLATION_SPEC.md` §6 (industry profile), checklist items in `DELIVERABLE_PRODUCTION_SPEC.md` re `primary_channels`.

### 3.3 Current execution direction (active)

This is now implemented as a **first-class alignment** foundation:

1. Spec contract: ordered `step1.touchpoints[]` (multi-select, rank by selection order).
2. Intake UX: visual, bucketed touchpoint selector with ranked badges (1-4), no separate primary field.
3. Deterministic resolver: generation resolves channels from normalized user-selected touchpoints first, then narrator defaults as fallback/fill.
4. Shared registry: canonical IDs/buckets/labels + alias normalization now live in `packages/shared/src/touchpoints.ts` and are consumed by web + generation.
5. Next checkpoint: keep `OUTPUT_TRANSLATION_SPEC.md` §2–3 aligned with schema; extend `touchpoints` / `primaryGoal` into every narrator-default paragraph that still reads generic; re-run generation fixtures when copy changes.

---

## 4. Gaps and misfire modes (prioritized)

| Risk | Why it happens | Mitigation direction |
|------|----------------|----------------------|
| Wrong channel tone (LinkedIn vs Etsy) | Historically narrator-only defaults | **Mitigated:** touchpoint order + cluster marketplace override + `solo_expert` commerce Week 1 / sample phrases when primary bucket is marketplace. Remaining edge cases (e.g. social-primary + marketplace secondary) → see [NARRATOR_ROUTING_PHASE2_RESEARCH.md](../research/NARRATOR_ROUTING_PHASE2_RESEARCH.md). |
| Week 2 still assumes email + “posts” | Was partly generic | **Mitigated:** `week2Items` branches email signature on `email_newsletter`, bucket-aware “what I do” line, and marketplace vs post cadence copy. |
| Industry voice only on a subset | `INDUSTRY_VOICE` map incomplete | Expand `industryProfiles.ts` for high-traffic industries |
| `other` industry | `DEFAULT_CATALOG` + default voice | Acceptable; or prompt to pick closest industry |
| Typography “LinkedIn” in **professional_and_digital** | Template text in `typographyMatrix.ts` | **Mitigated in assembly:** primary channel label replaces “LinkedIn” when the PDF is built; keep cluster routing so retail/maker paths still land in **social_and_packaging** / **social_and_digital** where appropriate. |

---

## 5. Where to focus development (for more “customized kit”)

Ordered for **impact on perceived personalization** vs **scope**. Check boxes as work ships; add notes inline when useful.

- [ ] `[P2]` **Finish wiring `touchpoints` + `primaryGoal`** into Week 2–4, typography leads, and any remaining narrator-default lines — **Week 2–3 + typography leads shipped**; sweep remaining narrator-only paragraphs opportunistically.
- [x] `[P2]` **Narrator × industry guardrails in UI** — **Removed** (industry-only hints dropped; channel fit is driven by touchpoints + generation rules above).
- [ ] `[P2]` **Complete industry voice profiles** and ensure assembly always **consumes** `getIndustryVoiceProfile` where spec promises it.
- [ ] `[P2]` **Tighten Week 2–4** strings to use `primaryChannelSet` / future user channel set with fewer generic assumptions.
- [ ] `[P2]` **Archetypes** for industries still on fallback lists (if any) — Step 2 feel.
- [x] `[P2]` **Per-kit type recommendations (v1 shipped)** — `typographyRecipes` + PDF embed/register + specimen layout; see §7.3–§7.4 for remaining research, recipe coverage, and wizard preview parity.
- [ ] `[P2]` **Core Review → Pro upsell (typography / brand depth)** — After Core completes, surface a **non-blocking** CTA on [`apps/web/src/components/review/ReviewScreen.tsx`](../../apps/web/src/components/review/ReviewScreen.tsx) (and inventory copy in `SCREEN_COPY_MAP.md`): e.g. upgrade to **Pro** for deeper analysis (existing fonts vs positioning, richer intake). Wire to real checkout/offer when ready; keep honest: Core stays deterministic recipe + kit typography; Pro adds fields + future AI analysis per [typography_strategy_phase2.md](../research/typography_strategy_phase2.md).

---

## 6. Maintenance checklist when adding inputs or industries

- [ ] `packages/shared` form types + web validation + initial state  
- [ ] `step1ControlledOptions` **web + shared** parity (`STEP1_INDUSTRY_CATALOGS.md`)  
- [ ] `industryLabels` in `coreAssembly.ts` (and review UI if duplicated)  
- [ ] `packages/shared/src/buyerArchetypes.ts` (buyer options + `resolveBuyerArchetypeTitle`) + optional `industryProfiles`  
- [ ] `touchpointClusterFromForm` if industry changes primary touchpoint  
- [ ] PDF / snapshot tests under `packages/generation` if output strings change  

---

## 7. PDF output refinement backlog (refactor notes)

Planned and tracking items that are **not** dependent on new intake fields unless called out. Use `- [ ]` below as implementation tasks; flip to `[x]` when merged. **`[P1]`** = Phase 1 · **`[P2]`** = Phase 2 (see **Phased execution**).

### 7.1 Style Guide — logo / wordmark guidance (planned: single section + light nudge) `[P1]`

- [x] `[P1]` Consolidate long-form logo/wordmark guidance to **one** primary block in the Style Guide PDF (see table below for current split).
- [x] `[P1]` Add optional **one-line** cross-reference elsewhere only if testing shows readers miss it. *(Skipped: Visual direction precedes Typography; no cross-ref added.)*
- [x] `[P1]` Update `packages/generation/src/core-pdfs.test.ts` and any layout assumptions in `VisualDirectionBlock` after copy moves.

**Context:** Logo/wordmark guidance used to repeat across Visual direction, Typography trail copy, and the specimen footnote. **Phase 1** leaves strategy in Visual direction only and keeps the specimen line typographic.

| Location | What the reader sees | Source (generation) |
|----------|----------------------|------------------------|
| **Visual direction** — third paragraph (italic in PDF) | Long block prefixed **“A note on your logo:”** (authoritative logo/wordmark strategy) | `visualDirectionLogoParagraph()` in `packages/generation/src/deterministic/coreAssembly.ts`; concatenated into `styleGuideBlocks` → `Visual direction` body |
| **Typography** — closing paragraph(s) | *(Removed in Phase 1.)* Licensing disclaimer only after downloads in PDF layout | Former duplicate lived in `typographyFooterParts()` / `coreAssembly.ts`; strategy is not repeated here |
| **Typography** — optional specimen footnote | One line under the primary weight stack for `physical_and_digital` \| `social_and_packaging`: **legibility / headline weight only** (no logo strategy) | `typographyWordmarkBoldRowNote()` in `typographyMatrix.ts` |

**PDF layout:** `VisualDirectionBlock` in `packages/generation/src/pdf/CoreKitDocuments.tsx` splits the Visual direction body on `\n\n` so the logo paragraph is visually separate. `TypographySectionBlock` still renders licensing + optional `trailParagraphs` after downloads (trail is empty for the default path after Phase 1).

**Done (Phase 1):** Authoritative long-form copy stays under **Visual direction**; Typography no longer appends a second logo strategy paragraph; specimen footnote is shortened to layout/legibility only; tests updated. Optional Typography cross-ref omitted (read order: Visual direction first).

Cross-ref: `PHASE_ROADMAP.md` (visual direction / logo note density).

---

### 7.2 Placeholder & fallback register (know what to update)

Use this table when adding palette ids, style ids, industries, or debugging “generic” PDF output.

| Situation | User-visible / PDF behavior | Primary code locations to update or review |
|-----------|----------------------------|-----------------------------------------------|
| **Unknown `step6.selectedPalette` id** (typo, old export, pre-alias id) | Grayscale swatches in PDF; generic color-role paragraph; palette line falls back to `Selected palette: <id>` | `getSwatches()` in `packages/generation/src/pdf/CoreKitDocuments.tsx`; `PALETTE_SWATCH_META` / `paletteSwatchColors` keys; `paletteColorRoles.ts` (`FALLBACK_ROLES`); `paletteDescriptions` + `canonicalPaletteId` path in `coreAssembly.ts` |
| **Legacy palette id** | Mapped to current id for swatches + copy | `packages/shared/src/paletteLegacy.ts` (`LEGACY_PALETTE_ID_ALIASES`); wizard + `updateForm` normalization in `apps/web` |
| **New canonical palette id** | Must stay in sync across web + PDF | `apps/web/src/data/visualDirection.ts` (`PALETTE_OPTIONS`, families); mirror swatches + meta in `CoreKitDocuments.tsx`; `paletteColorRoles.ts`; `paletteDescriptions` in `coreAssembly.ts` |
| **Unknown `step6.selectedStyle` id** | Style line in Style Guide uses `Style: <id>` style fallback | `styleDescriptions` + join site in `styleGuideBlocks` (`coreAssembly.ts`); `styleGuideVisualVoiceBridge` / `voicePlaybookToneVisualClosing` normalize unknowns in `voiceVisualBridge.ts` |
| **`step1.industry === 'other'`** | Default catalog + default industry voice | `DEFAULT_CATALOG` / industry catalogs in shared + web |
| **Industry has no `industryProfiles` entry** | `DEFAULT_INDUSTRY_VOICE` seasoning | `packages/generation/src/deterministic/industryProfiles.ts`; assembly call sites per `OUTPUT_TRANSLATION_SPEC.md` §6 |
| **Empty or sparse Step 4–5 fields** | Some assembled blocks use “not specified on intake” style fallbacks in helpers | `coreAssembly.ts` (e.g. customer profile, values, origin helpers — see tests in `core-pdfs.test.ts` “lean-core … not specified”) |
| **Typography template still says “LinkedIn” in source** | Replaced at assembly/PDF time for `professional_and_digital` where wired | `typographyMatrix.ts` + assembly notes in §2.1 / §4 above |
| **Web / checkout (out of Core PDF path)** | Payment, processing, edit screens still placeholder-tier | `apps/web` flow components; `apps/api` checkout URL stub — track in `PHASE_ROADMAP.md` / `SCREEN_COPY_MAP.md`, not Core PDF assembly |

---

### 7.3 Typography — specimens vs Step 6 inputs (reference only)

**Q: Which fonts render in the Style Guide PDF specimens?**

**Recipe-registered faces.** [`typographyRecipes.ts`](../../packages/generation/src/deterministic/typographyRecipes.ts) resolves a display/body pair from intake signals; [`registerCoreKitPdfFonts.ts`](../../packages/generation/src/pdf/registerCoreKitPdfFonts.ts) registers the shortlist; [`CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx) builds PDF text styles from `getKitPdfFontFamilies(form)` so specimens, labels, and downloads match the **resolved** families (not a single global Inter/Source Serif pair).

**What `step6.selectedStyle` and cluster/context change:** [`typographyMatrix.ts`](../../packages/generation/src/deterministic/typographyMatrix.ts) section **leads** plus recipe selection (style, touchpoint cluster, stage, tone, etc.) in `getRecipeForProfile` — role labels on specimens come from the recipe’s `primaryRole` / `secondaryRole`.

**Q: Does `step6.existingTypeface` change the specimens?**

**No — it does not swap embedded fonts.** It is **Pro-only in intake** (`microStepSchema` `c6_s3` tier `pro`). When **`form.tier === 'pro'`** and the field is non-empty, [`typographyHonorsExistingTypeface`](../../packages/generation/src/deterministic/coreAssembly.ts) is true: [`typographySectionLead`](../../packages/generation/src/deterministic/coreAssembly.ts) / [`typographyFooterParts`](../../packages/generation/src/deterministic/coreAssembly.ts) use continuity-first copy, the PDF shows a short **“you noted an existing typeface…”** line under specimens, and the optional wordmark note under the primary stack is suppressed. **Core** kits ignore this field for PDF behavior (even legacy JSON); Core typography uses the same matrix lead and specimens as when the field is unset.

**Preproduction note:** Future **Pro** AI kits can analyze named fonts vs positioning more deeply; Core stays rule-based as above.

---

### 7.4 Per-kit typography recommendations — research & product exploration `[P2]`

**Shipped (engineering):** A **font recipe** layer exists: [`typographyRecipes.ts`](../../packages/generation/src/deterministic/typographyRecipes.ts) maps intake signals to **named** display/body pairs; PDFs **embed** those families via [`registerCoreKitPdfFonts.ts`](../../packages/generation/src/pdf/registerCoreKitPdfFonts.ts) and kit styles from `getKitPdfFontFamilies(form)`. Section leads in `typographyMatrix.ts` still carry most **prose** variation by context × style.

**Remaining product work:** Validate perceived fit (user research), grow or refine the recipe grid, align **web wizard** type preview with PDF truth if needed, and ship **Pro-only** depth (existing-font continuity in PDF today; **future** LLM “font vs positioning” analysis — backlog in §5 Review upsell).

**Historical note:** Inter + Source Serif 4 were early **implementation** stand-ins; they are no longer the only rendered story once a recipe resolves.

**Research notes (practice → kit → next steps):** [typography_strategy_phase2.md](../research/typography_strategy_phase2.md).

**Thought starters for research (depth / signal mix — pick after user interviews):**

1. **Signal mix — which axes actually change recommendations?**
   - **Industry** (trust, regulation, craft, retail density) vs **visual style** (`clean_minimal`, `bold_graphic`, `organic_natural`, `luxe_refined`) vs **touchpoint / cluster** (IG-first vs web-first vs packaging-heavy).
   - **Narrator** (solo expert vs maker vs local) as a coarse prior when touchpoints are empty.
   - **Stage** (new vs established) — more conservative pairing vs more expressive?

2. **How many recipes can the team own?**  
   A tight grid (e.g. 4 styles × 4 clusters = 16 cells) vs a larger matrix — **maintainability** vs **perceived fit**.

3. **Legibility constraints by channel**  
   Small UI / social preview vs long-form blog vs print — does **primary touchpoint** cap display weight or x-height choices?

4. **Licensing & pipeline**  
   Google Fonts / OFL for safe PDF embed; what happens for **existing typeface** field (honor names only vs try to match catalog)?

5. **Honesty in output (part of §7.4 delivery, not a separate phase)**  
   If the PDF still uses **stand-ins** for some recipes, label them in the same change set that ships recipes; if you **embed** recipe fonts, register them in `CoreKitDocuments.tsx` per recipe. Avoid shipping an interim disclaimer alone.

6. **Fallback graph**  
   Unknown industry → default recipe; `other` industry → neutral recipe; missing touchpoints → narrator default recipe.

**Implementation touchpoints:** [`packages/generation/src/deterministic/typographyRecipes.ts`](../../packages/generation/src/deterministic/typographyRecipes.ts) (shortlist + `getRecipeForProfile`) is **wired** to PDF registration and specimens; legacy `typographySpecimenBlurbs` in `typographyMatrix.ts` remains unwired for section leads vs specimen blurbs — track any remaining matrix cleanup in §7.2 register.

- [ ] `[P2]` **Research:** validate signal priority (industry + style vs + touchpoints) with 5–8 target users.
- [ ] `[P2]` **Spike:** one vertical (e.g. `solo_maker` + `organic_natural` + `social_product`) with 2 alternate font pairs + designer review.
- [ ] `[P2]` **Spec:** add a short subsection to `DELIVERABLE_PRODUCTION_SPEC.md` or `OUTPUT_TRANSLATION_SPEC.md` once recipe rules stabilize.

---

*Last updated: **Phased execution** — P1 = §7.1 (done). **Typography:** recipe-driven PDF specimens + Core deterministic framing note; `existingTypeface` **Pro-only** intake + `typographyHonorsExistingTypeface`; §7.3–§7.4 refreshed. **Backlog:** §5 Review-page Pro upsell (typography / brand depth). Ongoing: §5 touchpoint sweep, industry voice, §7.4 research/spike/spec.*
