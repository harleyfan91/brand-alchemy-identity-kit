# Typography strategy — research basis and Identity Kit alignment

**Purpose:** Capture branding- and marketing-adjacent typography practice, how it maps to this product’s deterministic Core path, and sensible **next steps** toward per-kit font recommendations (see [CORE_PATH_CUSTOMIZATION_AUDIT.md](CORE_PATH_CUSTOMIZATION_AUDIT.md) §7.4 and Phase 2 in **Phased execution**).

**Audience:** Product and engineering when designing the font “recipe” layer and PDF/wizard copy.

---

## 1. How industry practice thinks about type (layers)

Practice guides and type education tend to stack decisions like this:

1. **Jobs and hierarchy** — Most real brand systems use **two typefaces** (sometimes a third for code or a narrow accent role). Each face has a **job**: display / headline vs body / UI vs fine print. Pairings aim for **contrast without conflict** (e.g. different classification or clear weight/width contrast), not two near-identical sans serifs fighting each other.

2. **Text vs display** — **Text** faces are tuned for long reading at small sizes (open spacing, stroke and detail that hold at low sizes). **Display** faces trade some of that for personality and impact at large sizes; used small, details can clog or dazzle. The right question for the kit is not “which font is on-brand?” alone but “**which font for which job at which size?**”

3. **Medium and touchpoint** — **Print**, **signage**, **social crops**, and **long-form screens** imply different legibility floors: small previews and legal lines favor **clear, robust** shapes and conservative contrast; heroes and posters can carry more expressive display choices **if** tested at intended size and distance.

4. **Accessibility and performance** — Marketing “best practice” here overlaps **WCAG** (contrast, resizing) and **performance** (font subsetting, variable fonts, fallbacks). These constrain *weights* and *sizes* on primary surfaces as much as they pick a family name.

5. **Brand personality** — Adjectives (“trustworthy,” “modern,” “craft”) are used everywhere to suggest serif vs sans, high vs low contrast, geometric vs humanist. Treat these as **directional priors** for shortlisting, not proof of a single correct font; the same strategy can be executed with several credible pairs.

**Takeaway for the kit:** The strongest, most defensible automation is **role + medium + legibility constraints → category rules → named pairs**, with voice/industry as **lighter** seasoning on top.

---

## 2. How this maps to Identity Kit today

**Pipeline (summary):** Wizard → `IdentityKitForm` → `computeBrandProfile` / `touchpointCluster` / `typographyContextFromCluster` → copy and specimen **plans** in [`packages/generation/src/deterministic/coreAssembly.ts`](packages/generation/src/deterministic/coreAssembly.ts) and [`packages/generation/src/deterministic/typographyMatrix.ts`](packages/generation/src/deterministic/typographyMatrix.ts) → PDF in [`packages/generation/src/pdf/CoreKitDocuments.tsx`](packages/generation/src/pdf/CoreKitDocuments.tsx).

**Signals that already align well with the layers above**

| Signal | Why it matters for type |
|--------|-------------------------|
| **Ordered touchpoints** + **touchpoint cluster** | Proxy for **dominant reading size**, static vs motion, print vs screen share — closest thing we have to “where type must survive.” |
| **`step6.selectedStyle`** | Already drives **display vs supporting** roles and specimen **plans**; natural home for “which recipe row” when recipes exist. |
| **`step1.stage`** | Reasonable prior for **conservative vs expressive** pairing risk (established brands may tolerate less typographic drama in body). |
| **`step1.primaryGoal`** | Influences **scannability vs depth** (e.g. lead-gen and social-heavy flows stress short headline legibility). |
| **`step6.existingTypeface`** | **Continuity-first** path already exists in prose; a recipe layer should **honor** this (complement or “map roles onto what you use”) before proposing a greenfield pair. |

**Signals that are weaker alone for picking fonts**

| Signal | Caveat |
|--------|--------|
| **Industry id** | Many verticals span premium, DTC, and corporate sub-positioning; industry → one font is easy to get wrong without more structure. |
| **Voice sliders / tone preset** | Great for **copy** and maybe **display** expressiveness; poor sole driver for body/UI fonts. |

**Current gap (Phase 2 / §7.4 intent):** Specimens and licensing copy are still rendered with **Inter / Source Serif 4** stand-ins in the PDF; **named recommendations** now have a deterministic data layer (below). Wiring copy + specimens to recipes is a **separate** follow-up once the PDF truth model (embed vs labeled stand-in vs name-only) is chosen.

---

## 2b. Implementation: `typographyRecipes.ts` (data layer, unwired)

**Module:** [`packages/generation/src/deterministic/typographyRecipes.ts`](packages/generation/src/deterministic/typographyRecipes.ts)  
**Tests:** [`packages/generation/src/deterministic/typographyRecipes.test.ts`](packages/generation/src/deterministic/typographyRecipes.test.ts)

**What it contains**

- **`FONT_SHORTLIST`** — Curated `FontEntry` rows (Google Fonts `family` strings, `classification`, `roles`, `variable`, tags, internal `notes`).
- **`FONT_RECIPES`** — Ordered list of `TypographyRecipe` rows. Each recipe has optional `styleMatch`, `toneMatch` (non-empty tone only; recipes with `toneMatch` do not apply when `tonePreset === ''`), `stageTier` (`any` | `early` | `established`), optional `clusterFilter` (`screen_heavy` | `not_screen_heavy`), optional `clusterIds` (exact `TouchpointCluster` subset), a **`TypographyPair`** (two font ids + human-readable role labels), **`pattern`:** `contrast` | `system`, and **`archetypeLabel`:** `pairing` | `single_family_hierarchy` for future PDF/wizard copy.
- **`getRecipeForProfile(form)`** — Uses `computeBrandProfile(form)` for `touchpointCluster`. Unknown `selectedStyle` → fallback recipe (Playfair Display + Inter, contrast). Among eligible recipes, **highest score** wins; **ties** break by **lowest index** in `FONT_RECIPES` (documented in the module header comment).
- **`isScreenHeavyCluster(cluster)`** — Today: `digital_brand` and `social_service` count as screen-heavy; adjust in one place if product redefines blended clusters.
- **`shouldPreferSystemPairing(form)`** — Helper for future wiring: `clean_minimal` + screen-heavy cluster, or `existingTypeface` substring matches a **variable** shortlist family.
- **`getExistingTypefaceGuidance(text)`** — Best-effort substring match to shortlist families + short complement hint; generic copy when unmatched.

**UX meaning of the two patterns**

| `archetypeLabel` | Reader-facing idea | PDF sections (future) |
|------------------|---------------------|------------------------|
| `pairing` | Two complementary typefaces | Section A = family one (weights); section B = family two (weights). |
| `single_family_hierarchy` | One typeface, two roles | Same family in both sections with different **weight/size role** guidance (system). |

**Checkpoint before PDF wiring**

Run **6–8 persona / core fixtures** through recipes, then **manually** open generated Style Guides (or storybook PDFs) at **final print/screen sizes** to confirm legibility and that the chosen **truth model** (embed vs stand-in vs name-only) matches what the page promises. Do this **before** or in lockstep with changing [`TypographySpecimenSlot`](packages/generation/src/deterministic/coreAssembly.ts) / [`TypographySectionBlock`](packages/generation/src/pdf/CoreKitDocuments.tsx) — not only after a large PDF refactor.

---

## 3. Planned next steps (research → product → build)

Ordered for dependency and risk:

1. **Recipe grid spec (product)** — Initial grid lives in `typographyRecipes.ts` (`FONT_RECIPES`); refine cells and scores with designer review. Cap the number of rows the team will own and maintain.

2. **Legibility and licensing constraints (research)** — For each candidate pair: Google Fonts / OFL (or other) **license** fit for PDF embed + web; **glyph coverage** for customer languages if relevant; **minimum recommended weights** for primary touchpoint (social vs long-form).

3. **Spike: PDF truth model (engineering)** — Align §7.4 options: **embed** recommended fonts, **labeled stand-in** with named recommendation, or **name-only** + specimen as teaching ladder — pick one default per tier and document in [DELIVERABLE_PRODUCTION_SPEC.md](DELIVERABLE_PRODUCTION_SPEC.md) / audit §7.4 when decided.

4. **Wizard and copy alignment** — Ensure Step 6 and review screens do not **promise** a font the PDF cannot show, once the truth model is chosen.

5. **Validation** — Internal review of 6–8 **persona fixtures** (touchpoint-heavy vs web-heavy vs packaging-heavy); optional lightweight user read tests (“does this feel chosen for me?”).

6. **Traceability** — When recipes ship, add a short row to the audit **placeholder register** (§7.2) for “font recipe id” if new ids are introduced.

---

## 4. Reference reading (outside this repo)

Use for internal conviction and spec wording, not as legal advice:

- **Roles, pairing, and restraint:** Practical pairing writeups (contrast, two-font systems, test in context).
- **Text vs display:** Monotype/Fonts.com Fontology and similar **text vs display** primers; CreativePro on display vs text usage.
- **Constraints:** [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) contrast and resize; [Butterick’s *Practical Typography*](https://practicaltypography.com/) for craft and common mistakes.

---

## 5. Related internal documents

- [`packages/generation/src/deterministic/typographyRecipes.ts`](packages/generation/src/deterministic/typographyRecipes.ts) — Recipe data layer (this doc §2b).
- [CORE_PATH_CUSTOMIZATION_AUDIT.md](CORE_PATH_CUSTOMIZATION_AUDIT.md) — Phase 2 scope, §7.2 register, §7.3 specimens reference, §7.4 per-kit recommendations.
- [OUTPUT_TRANSLATION_SPEC.md](OUTPUT_TRANSLATION_SPEC.md) — Translation and voice/industry intent.
- [PDF_GENERATION.md](PDF_GENERATION.md) — How PDFs are produced locally and in CI.

*Last updated: adds unwired `typographyRecipes` module + tests; PDF/specimen wiring still pending §7.4 spike (embed vs stand-in vs name-only).*
