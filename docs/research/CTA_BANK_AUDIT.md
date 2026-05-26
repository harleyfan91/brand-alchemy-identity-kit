# CTA Bank Audit (Pro-0 prerequisite)

**Status:** audit complete; expansion pending copywriter engagement.
**Framing:** **quality-first**, not volume-optimized. Where a quality choice and a cost choice diverge, this doc takes the quality choice and names the trade-off.

**Decision log:**
- **2026-05-26 — §4B locked.** Close Marketplace × `audience_growth` (retail_maker) and Marketplace × `retention` (retail_maker + trades_home). Document all other (surface, goal) gaps as intentional. TODO placeholders added to [`CTA_PHRASE_BANKS.md`](../../packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md); intentional-gap rules added to [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §4. Copywriter fills the placeholders when work begins.
- **2026-05-26 — §4C locked.** Option 1 (per-narrator variant pools) for the 6 industry × narrator pairs listed in §4C. Bank tree gains a `narrator` axis on those leaves only. AI handles the file-format / generator updates when copywriter work begins.
- **2026-05-26 — §4D locked.** 8 PC-* persona fixtures in `packages/generation/src/fixtures/personas/` (one per PC-01..PC-08) + 2 axis-regression fixtures in `axis-fixtures/` for PC-09 and PC-10. Existing `cta-mixed`, `community-org`, `lean-core`, `established-pro` fixtures stay as separate sanity personas. AI writes the 6 missing PC-* fixtures autonomously when expansion work begins.
- **2026-05-26 — §1.1 depth targets locked.** Tiered: tier 1 ≥ 8 pairs, tier 2 ≥ 6 pairs, tier 3 ≥ 4 pairs. Depth concentrates on the ~168 leaves that fire on every Pro kit (website/email/social-casual direct_sales+lead_gen); conserves on the long tail.
- **2026-05-26 — Core-quality bar reset; copywriter assessment landed.** §10's original framing positioned the bank as a "floor" beneath a Pro AI variation layer. Corrected: Core kits ship Folio 05 CTA examples from this deterministic bank without any AI variation (per [`PROJECT_OVERVIEW.md`](../../PROJECT_OVERVIEW.md) commercial tiers). The bank is the deliverable for Core buyers; the bar is senior-copywriter-grade at the leaf. Read-aloud quality assessment added as §12. Practical wave sequencing for the §8.1 W-track added as §13.
- **All audit decisions locked.** Remaining work tracked under §8 (W-track copywriter-side, A-track AI-side) and sequenced under §13.
**Scope:** [`packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md`](../../packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md) — the deterministic source that builds [`ctaPhraseBankPrescriptive.gen.ts`](../../packages/generation/src/deterministic/ctaPhraseBankPrescriptive.gen.ts) via [`scripts/gen-cta-phrase-banks.mjs`](../../packages/generation/scripts/gen-cta-phrase-banks.mjs).
**Charter:** [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §7.5 — "deterministic CTA bank itself must be genuinely good before Pro launches."

This doc inventories the current bank against §7.5's four audit questions, identifies every gap (structural, depth, narrator, rule-violation, templated-language), and hands the expansion work off to a copywriter with explicit quality criteria. Pro-0 cannot ship until this audit's gap list is closed and the per-leaf read-aloud sign-off (§7) passes.

---

## 1. Acceptance criteria (locked from §7.5, quality-first revision)

| # | Criterion | Operational test |
|---|---|---|
| **A1** | CTAs varied across industry × surface × narrator path classes | Variant pool per leaf meets the **tiered depth target** in §1.1 below. Narrator path class is modeled as a real dimension, not a post-process rewrite (see §4C). |
| **A2** | No path class produces templated CTAs | Per-leaf read-aloud against `CTA_COPY_RULES.md` §13 four-question check, during expansion (not at end). See §7. |
| **A3** | Prescriptive phrase banks deep enough | Tiered targets per §1.1, applied to every (surface, goal, industry-group, tone, narrator) leaf. |
| **A4** | Folio 05 CTAs read as brand statements, not generic buttons | Cross-persona snapshot test (§7) after expansion, with industry-consultant read-aloud per industry group. |

### 1.1 Tiered depth targets (replaces flat ≥6)

Quality compounds at the leaves the variant selector hits most often. Long-tail leaves benefit less from extra depth. The strategy doc's flat "≥6" target is replaced here with three tiers:

| Tier | Definition | Target |
|---|---|---:|
| **Tier 1 — high-traffic** | WEBSITE × every leaf · EMAIL × every leaf · SOCIAL Casual × `direct_sales`/`lead_gen` × every leaf | **≥ 8 pairs** |
| **Tier 2 — medium-traffic** | Directory Google × `direct_sales` · Marketplace × `direct_sales` · SOCIAL Casual × `audience_growth` · EMAIL `audience_growth` · WEBSITE/EMAIL `retention` | **≥ 6 pairs** |
| **Tier 3 — long-tail** | LinkedIn · Yelp · Directory `lead_gen` · Marketplace `lead_gen`/`retention` · SOCIAL Casual `retention` · all `ctaTemplates` fallback entries | **≥ 4 pairs** |

Folio 05 currently renders 2–3 surfaces per kit. Tier 1 fires on every Pro kit; Tier 3 might fire on 1 kit in 200. Tier 1 deserves the deepest variant pool.

---

## 2. Methodology

1. Read [`CTA_PHRASE_BANKS.md`](../../packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md) header-by-header (1908 lines).
2. Read [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) (560 lines) to internalize the normative rules.
3. Read [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A composition policy and §3.4 path-class influence matrix.
4. Built the structural tree (surface → goal → industry-group → tone) and counted leaves.
5. Ran rule-violation greps against banned vocab from [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §8.
6. Cross-referenced the strategy doc's "8 personas" wording against the spec's `PC-*` path-class list against the on-disk fixtures.

What this audit deliberately does **not** do: write or rewrite any CTA phrasing. That work is the copywriter's; this audit's job is to scope it and define the quality bar.

**What this audit deliberately does NOT do, that a fully thorough quality audit WOULD do:** read every existing pair aloud against §13 of `CTA_COPY_RULES.md`. The audit greps for banned patterns but presumes the existing 3 pairs per leaf are at acceptable quality. **They almost certainly aren't all at the new bar.** See §4E.

---

## 3. Bank structure inventory

The bank organizes phrases as a 4-dimensional tree: `surface → goal → industry_group → tone → variant_pool`. Some branches collapse a dimension (e.g., `retention` typically has no tone split). Each variant pool is currently 3 `[line1, line2]` pairs — the bank's stated minimum (line 11 of `CTA_PHRASE_BANKS.md`).

### 3.1 Surfaces and their goal coverage

| Surface | direct_sales | lead_gen | audience_growth | retention |
|---|---|---|---|---|
| WEBSITE | ✓ (3 tones) | ✓ (3 tones) | ✓ (3 tones) | ✓ (no tones) |
| EMAIL | ✓ (3 tones) | ✓ (3 tones) | ✓ (no tones) | ✓ (no tones) |
| SOCIAL — Casual (IG, TikTok, FB, Pinterest, Threads) | ✓ (3 tones) | ✓ (3 tones) | ✓ (3 tones) | ✓ (any-industry single block) |
| SOCIAL — Professional (LinkedIn) | **— (intentional gap, see §4B)** | ✓ (no tones) | ✓ (no tones) | **— (intentional gap, see §4B)** |
| DIRECTORY — Google Business (`post_offer`) | ✓ (3 named industries × 3 tones + catch-all) | ✓ (any-industry single block) | **— (intentional gap, see §4B)** | **— (intentional gap, see §4B)** |
| DIRECTORY — Yelp / TripAdvisor (`sponsored_listing`) | ✓ (3 named industries + catch-all, no tones) | **— (intentional gap, see §4B)** | **— (intentional gap, see §4B)** | **— (intentional gap, see §4B)** |
| MARKETPLACE | ✓ (`retail_maker` only, 3 tones) | ✓ (`retail_maker` + `trades_home`, no tones) | **— (real gap, close)** | **— (real gap, close)** |
| `ctaTemplates` (fallback) | ✓ | ✓ | ✓ | ✓ (any-industry single) |

### 3.2 Industry groups (per [`ctaIndustryGroups.ts`](../../packages/generation/src/deterministic/ctaIndustryGroups.ts) and bank §"Industry Groups")

`trades_home` · `food_hospitality` · `retail_maker` · `health_wellness` · `creative_pro` · `professional_svc` · `community` — 7 groups.

### 3.3 Tones (per [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §2)

`bold` · `friendly` · `professional` — 3 tones.

### 3.4 Narrator profiles (per [`narratorProfiles.ts`](../../packages/generation/src/deterministic/narratorProfiles.ts))

`solo_expert` · `solo_maker` · `local_team` · `product_led` · `mission_community` — 5 narrators. **Not currently modeled in the bank tree.** See §4C.

### 3.5 Leaf counts (current, single-narrator)

| Surface | Leaf count | Variants/leaf | Total variant pairs |
|---|---:|---:|---:|
| WEBSITE | 70 (7 × [3+3+3+1]) | 3 | 210 |
| EMAIL | 56 (7 × [3+3+1+1]) | 3 | 168 |
| SOCIAL — Casual | 64 (7 × [3+3+3] + 1 retention catch-all) | 3 | 192 |
| SOCIAL — Professional (LinkedIn) | 14 (7 × [0+1+1+0]) | 3 | 42 |
| DIRECTORY — Google Business | 11 (10 direct_sales + 1 lead_gen catch-all) | 3 | 33 |
| DIRECTORY — Yelp / TripAdvisor | 4 (direct_sales only, no tones) | 3 | 12 |
| MARKETPLACE | 5 (3 direct_sales tones for `retail_maker` + 2 lead_gen industries) | 3 | 15 |
| **Total variant-pool leaves** | **~224** | — | **~672 variant pairs** |
| `ctaTemplates` fallback | ~22 single-entry leaves (3 phrases per entry, not pool of pairs) | — | (separate format) |

---

## 4. Gap classification

Six gap categories, listed in suggested expansion priority. Each is hand-off-able to the copywriter with explicit quality criteria.

### 4A. Depth gap — every leaf is below target

**Status:** universal. Every existing variant-pool leaf is at 3 pairs. New tiered targets in §1.1: tier 1 ≥ 8, tier 2 ≥ 6, tier 3 ≥ 4.

**Volume (single-narrator, no rewrites):**

| Tier | Existing leaves | New target | Pairs to add |
|---|---:|---:|---:|
| Tier 1 — WEBSITE all + EMAIL all + SOCIAL Casual direct_sales/lead_gen | ~154 leaves | ≥ 8 | ~770 (+5 each) |
| Tier 2 — Directory Google direct_sales + Marketplace direct_sales + remaining audience_growth/retention | ~45 leaves | ≥ 6 | ~135 (+3 each) |
| Tier 3 — LinkedIn + Yelp + Directory lead_gen + Marketplace lead_gen | ~25 leaves | ≥ 4 | ~25 (+1 each) |
| **Subtotal** | **224** | — | **~930 net-new pairs** |

**Constraint:** every new pair must obey [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md). Tone consistency within a pair (§2.2), industry emotional register (§3), platform register (§4), brevity (§6), em-dash-as-period (§7), banned vocab (§8). Per-pair read-aloud test against §13 four-question check.

### 4B. Structural gaps — which to close, which to document as intentional

Most of the empty (surface, goal) cells in §3.1 are platform-native absences, not omissions. Closing them would *hurt* quality — we'd be inventing copy patterns that don't exist on the platform.

| Gap | Decision | Why |
|---|---|---|
| LinkedIn × `direct_sales` | **Keep gap, document as intentional** | LinkedIn isn't a transactional surface. "Buy now" copy doesn't sound like LinkedIn copy. |
| LinkedIn × `retention` | **Keep gap, document as intentional** | No native re-engage-past-customers mechanic on LinkedIn for SMBs. |
| Google Business × `audience_growth` | **Keep gap, document as intentional** | Google Business posts don't drive follows. |
| Google Business × `retention` | **Keep gap, document as intentional** | No native re-engagement mechanic on the listing. |
| Yelp × `lead_gen` / `audience_growth` / `retention` | **Keep all 3 gaps, document as intentional** | Yelp is pure discovery. No native reply/follow/re-engage on the surface. |
| **Marketplace × `audience_growth`** | **Close — `retail_maker` only** | Etsy supports shop follows. This is a real omission. ~8 new pairs (tier 1 target since it's a real conversion surface). |
| **Marketplace × `retention`** | **Close — `retail_maker` + `trades_home`** | Re-purchase is universal in marketplace. ~12 new pairs (tier 2). |

**Volume added by closing real gaps:** ~20 new pairs.
**Documentation work:** ~30 lines added to `CTA_COPY_RULES.md` documenting the intentional gaps. AI can do this once decisions are confirmed.

### 4B.1 Upstream surface-routing concern (separate work item)

Worth flagging because this audit surfaced it: if the deterministic surface routing in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A picks LinkedIn as a folio 05 surface for a buyer whose `primaryGoal` is `direct_sales` and whose top touchpoint is LinkedIn, the LinkedIn × direct_sales gap means the buyer falls through to `ctaTemplates` — which wasn't written with LinkedIn in mind either. Buyer ships a kit where their primary surface gets the generic fallback CTA.

**The fix isn't to fill the bank gap.** It's to tune the surface selection in §10A.6A to skip LinkedIn for `direct_sales` buyers (route to website + email instead, since LinkedIn isn't a direct_sales platform).

**Action:** open a separate `OUTPUT_TRANSLATION_SPEC.md` issue for the surface-selection refinement. Not blocking on Pro-0 bank expansion.

### 4C. Narrator-dimension gap — model narrator as a real bank axis

The bank currently picks first-person voice (`I` vs. `we`) based on industry default per [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §2.3. §7.5 explicitly names "industry × surface × **narrator path classes**" — narrator is a real dimension. The current bank doesn't model it.

**Three options considered:**

1. **Per-narrator variant pools** — bank tree gains a 5th dimension. Phrases are tuned to narrator × industry pairs specifically.
2. **Post-process `I/we`** at compose time — bank stays single-narrator, [`composeCtaSurfaceBlocks`](../../packages/generation/src/deterministic/ctaCompose.ts) rewrites pronouns when the buyer's narrator disagrees with industry default.
3. **Document the status quo** — accept that narrator is "industry-default-only."

**Recommendation: option 1.**

Quality reasoning:

- Option 2 produces Frankenstein copy. The existing `food_hospitality` voice is composed around a team narrator (`"We'd love to have you"`, `"Come find out how you can help"`). Mechanical pronoun substitution to `"I'd love to have you"` keeps the surface words but breaks the rhythm — the sentence was composed for plural. Solo food-hospitality CTAs need different *content*, not different pronouns.
- Option 3 leaves real mismatch awkwardness that violates §13 of the rules document ("would a local plumber actually say this?"). A 5-person plumbing shop reading `"I'll come take a look"` knows immediately that the kit doesn't fit them.
- Option 1 means the copywriter writes `solo_maker` × `food_hospitality` × `direct_sales` × `bold` as a distinct leaf from `local_team` × `food_hospitality` × `direct_sales` × `bold`. Different vocabulary, different framing, both authentic.

**Volume:** not every narrator × industry combination needs a tuned leaf. Most industries have a clear default that fits ~80% of buyers (e.g., `community` is almost always `mission_community`; `trades_home` is usually `solo_expert` or `local_team`). The audit recommends authoring tuned leaves **only where the divergence from the industry default is meaningful**:

| Industry | Default | Tuned leaves needed for |
|---|---|---|
| `trades_home` | `solo_expert` | `local_team` (5-person crew shape) |
| `food_hospitality` | `local_team` | `solo_maker` (single-cook/pop-up shape) |
| `retail_maker` | `solo_maker` | `product_led` (multi-product brand shape) |
| `health_wellness` | `solo_expert` | `local_team` (small practice shape) |
| `creative_pro` | `local_team` | `solo_expert` (single-creator shape) |
| `professional_svc` | `local_team` | `solo_expert` (single-practitioner shape) |
| `community` | `mission_community` | — (default fits all) |

That's **6 industry × narrator pairs needing tuned leaves**. Each pair × ~10 active (surface, goal, tone) combinations × tier-appropriate depth = ~360–480 additional pairs.

**Implementation note:** the bank file format gains a `narrator` axis (most leaves stay narrator-agnostic, only the 6 mismatched-narrator industries get a `narrator: local_team` or `narrator: solo_maker` etc. subsection). Generator script ([`scripts/gen-cta-phrase-banks.mjs`](../../packages/generation/scripts/gen-cta-phrase-banks.mjs)) and the variant selector both need updating. AI handles both.

### 4D. Fixture-vs-path-class count discrepancy

**Status:** the strategy doc says "all 8 personas" for the Pro-0 acceptance test ([`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §11 Pro-0). The spec defines **10** `PC-*` path classes ([`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §3.4). The repo has **5** on-disk fixtures.

Reading the influence matrix:

- `PC-01` through `PC-08` each have at least one **Strong** cell across the 4 document types — they're real persona shapes.
- `PC-09-tone-style-matrix` is **None** on Quick Start and **Light** on Brand Brief — it's a tone/style axis check, not a whole-business shape.
- `PC-10-existing-typeface-tier-gate` is **None** on three of four documents — it's a tier-gate regression.

**Recommendation:** the strategy doc's "8 personas" is right when it means "8 distinct business shapes for the full-kit acceptance test." `PC-09` and `PC-10` belong in a separate axis-regression list, not the full-PDF generation list.

Concrete action:

- 8 fixtures (one per `PC-01..PC-08`) for Pro-0 acceptance. 3 likely already map (`coffee-founder` ≈ PC-02, `community-org` ≈ PC-08, `cta-mixed` ≈ PC-04). **5 new fixtures to write.**
- `established-pro` and `lean-core` stay as Pro-tier sanity fixtures, not part of the PC matrix.
- `axis-fixtures/` folder for PC-09 and PC-10 (regression-only).
- Strategy doc updates to clarify the two-tier setup.

**Volume:** ~5 × 250 lines of structured JSON. **AI handles autonomously.**

**Add-on for narrator coverage (quality):** consider adding 2 more fixtures that exercise narrator × industry mismatch — e.g., `local_team-plumbing` (5-person trades shop) and `solo_maker-restaurant` (solo cook). These let the acceptance test exercise the §4C option-1 tuned leaves end-to-end.

### 4E. Existing-pair quality gap — the 672 current pairs weren't audited for quality

This is the gap the first version of this audit undersold.

**Status:** the existing 3 pairs per leaf were authored iteratively against `CTA_COPY_RULES.md` but never put through a §13 read-aloud audit at the full bank level. The grep scan in §5 below catches explicit rule violations (vocabulary, dashes, mechanics) — it does not catch:

- Pairs that technically obey the rules but read flat or templated.
- Pairs where line 2 is doing the wrong job (explaining line 1 instead of being a second ask, credibility signal, or warmth note per §12).
- Pairs that fail the §13 "would a local plumber actually say this?" smell test.
- Pairs that drift from the emotional register §3 even while using the right vocabulary §5.

**Quality implication:** during the expansion pass, the copywriter must **also audit and rewrite weak existing pairs**, not just add new ones to reach the tier target. Estimate: ~10–20% of the existing 672 pairs need replacement, not augmentation.

**Volume added by existing-pair audit + rewrites:** ~70–135 rewrites layered into the §4A expansion (no net change to leaf count, but ~10–20% of the existing pairs get swapped).

**Hand-off note for copywriter:** before writing new pairs at any leaf, read the 3 existing pairs aloud. Replace any that fail the §13 check. Then add new pairs to reach the tier target.

---

## 5. Rule-violation scan (current bank, explicit greps)

Greps run against the bank for every banned pattern in [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §8.

| Banned pattern | Hits in CTA strings | Status |
|---|---:|---|
| Em-dash (`—`) inside CTA string | 0 | Clean. (23 em-dashes in the file, all in prose intros / section headers — compliant.) |
| `Learn more` | **2** (lines 1518, 1524) | **Violations.** Both LinkedIn lead_gen ("DM to learn more."). §8 explicitly bans `Learn more` as vague. Copywriter rewrites. |
| `Get started` | 2 (lines 1308, 1850) | **Borderline.** "...to get started" as line-2 supporting clause. Read in context and decide. |
| `Click here` | 0 | Clean. |
| `now!` on plain action verbs | 0 | Clean. |
| `Either works` / `whichever is convenient` / `whatever you prefer` | 0 | Clean. |
| `I'll tell you if I can help` (or close variant) | **1** (line 869) | **Violation.** `creative_pro` lead_gen email friendly. §5 explicitly bans this gatekeeping framing. Copywriter rewrites line 1. |
| Business jargon (`leverage`, `synergy`, `touch base`, `seamless`, `optimize`, `robust`, `solutions`) | 0 | Clean. |
| Hollow enthusiasm (`Excited to share`, `we're thrilled`, `delighted to`) | 0 (sampled) | Likely clean; full grep recommended after expansion. |

**Confirmed violations to fix:** 3 (lines 869, 1518, 1524). Plus 2 borderline (lines 1308, 1850).

**The §13 read-aloud audit will find more.** Grep is a floor, not a ceiling.

---

## 6. Templated-language sniff (current bank, sampled)

Acceptance criterion A2 is "no path class produces templated CTAs." Audit's spot-checks flagged:

1. **`audience_growth` openers cluster.** "Follow for…" / "Subscribe for…" / "Reply 'YES' and I'll add you…" patterns repeat across surfaces and industries.
2. **`retention` paragraph openers cluster.** "Been a while since…" / "Ready to book your next…" / "Time for a check-in?" — three of seven retention email leaves open the same way.
3. **Marketplace tone variance.** The 3 tones inside `retail_maker` marketplace direct_sales feel close in voice (all maker-warm); `bold` and `friendly` are nearly interchangeable.
4. **Yelp/TripAdvisor "all other industries" catch-all.** A single 3-pair pool covers 4 industry groups. Reads generic for any of them.

**Note for the writing engagement:** these are subjective quality findings, addressed by the depth expansion if the writer is deliberate about variation. They aren't caught by grep — they need a human read pass against §13 of `CTA_COPY_RULES.md`.

---

## 7. Acceptance gate — what "complete" looks like

The Pro-0 gate has two parts: mechanical and editorial.

### 7.1 Mechanical gate (AI-verified)

- All 4A leaves meet their tier depth target (§1.1).
- All 4B Marketplace placeholders are filled.
- All 4C narrator-tuned leaves are present in the bank.
- All 4D fixtures exist on disk and load via `loadPersonaFixture`.
- All 5 confirmed rule violations are fixed.
- Rule-mechanical greps (banned vocab, em-dash, exclamation-mark rule per [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §7) pass on the full bank.
- `scripts/gen-cta-phrase-banks.mjs` regenerates [`ctaPhraseBankPrescriptive.gen.ts`](../../packages/generation/src/deterministic/ctaPhraseBankPrescriptive.gen.ts) cleanly.
- Cross-persona snapshot test runs without parse errors across all 8 `PC-*` fixtures.

AI runs and reports on this gate.

### 7.2 Editorial gate (out of AI scope)

A human read pass against [`CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) §13 four-question check, on every leaf and on the cross-persona folio 05 snapshot. The cadence, who does it, and how they verify is decided by whoever owns the writing engagement.

---

## 8. Expansion plan — work breakdown

The split below is **what each side delivers**, not how it's staffed. Copywriter-side workflow (one writer or many, sequencing, review process, sign-off cadence) is outside this audit's scope and is decided by whoever owns the writing engagement.

### 8.1 Copywriter-side deliverables

| ID | Work | Spec |
|---|---|---|
| **W1** | Audit existing pairs in every leaf against `CTA_COPY_RULES.md` §13 four-question check; replace any that fail. | ~672 existing pairs reviewed; ~70–135 estimated rewrites (10–20% of the bank). |
| **W2** | Expand every leaf to its tier target (§1.1). | ~930 net-new `[line1, line2]` pairs at flat tier targets; revised by decision in §12. |
| **W3** | Fix the 3 confirmed rule violations (lines 869, 1518, 1524 of `CTA_PHRASE_BANKS.md`) as the surrounding leaves are expanded. | Folded into W2. |
| **W4** | Read and decide the 2 borderline lines (1308, 1850). | Folded into W2. |
| **W5** | Write narrator-tuned variants for the 6 industry × narrator pairs in §4C. | ~360–480 pairs. |
| **W6** | Author copy for the 3 new Marketplace leaves placeholdered in `CTA_PHRASE_BANKS.md` (4B). | ~14–22 pairs depending on tier. |
| **W7** | Final sign-off against the §7 acceptance gate. | Whatever review process the writing engagement defines. |

### 8.2 AI-side deliverables (autonomous once W-track is in motion)

| ID | Work | Status |
|---|---|---|
| **A1** | Document intentional structural gaps in `CTA_COPY_RULES.md` §4 (LinkedIn × direct_sales, etc.). | ✅ Completed 2026-05-26. |
| **A2** | Add TODO placeholders to `CTA_PHRASE_BANKS.md` for the 3 new Marketplace leaves. | ✅ Completed 2026-05-26. |
| **A3** | Write 6 missing `PC-*` persona fixtures (PC-03, PC-04, PC-05, PC-06, PC-07B, PC-08). | ✅ Completed 2026-05-26. Files under `packages/generation/src/fixtures/personas/`; registered in `loadPersonaFixture.ts`; all 6 load and the `pc*` CLI ids are available via `npm run generate:pdfs -- <id>`. |
| **A4** | Write 2 axis-regression fixtures for PC-09 and PC-10 under `axis-fixtures/`. | ✅ Completed 2026-05-26. Files under `packages/generation/src/fixtures/axis-fixtures/`. Documentation-canonical; existing matrix tests in `core-pdfs.test.ts` reference these shapes. |
| **A5** | Add `narrator` axis to bank file format + generator script (`scripts/gen-cta-phrase-banks.mjs`); integrate copywriter's narrator-tuned leaves (§4C option 1 plumbing). | Pending — gated on W5 starting so the format and content land together. |
| **A6** | Build cross-persona snapshot test harness for folio 05 CTA blocks across all 8 `PC-*` fixtures. | Pending — gated on copywriter expansion landing (so the snapshots have real depth to lock in). Fixtures already in place. |
| **A7** | Open separate work item for §4B.1 surface-routing fix in `OUTPUT_TRANSLATION_SPEC.md` §10A.6A. | ✅ Completed 2026-05-26. Tracked in [`PHASE_ROADMAP.md`](../../PHASE_ROADMAP.md) "Quality / polish backlog" → "Folio 05 CTA surface routing — skip intentional-gap surfaces by goal." |
| **A8** | Re-run `scripts/gen-cta-phrase-banks.mjs` after each copywriter batch lands; confirm generator produces parse-clean output. | Recurring — runs as W2/W5/W6 batches commit. |
| **A9** | Run rule-mechanical greps (em-dash, banned vocab, exclamation-mark rule per §7) over every pasted-in copywriter batch. | Recurring — runs as W batches commit. |
| **A10** | Maintain this audit doc as decisions land and W work closes. | Recurring. |

---

## 9. Scope boundary — what the AI will and won't do

**The AI will:**
- Execute everything in §8.2 above.
- Run rule-mechanical checks (banned vocab, dash policy, exclamation-mark rule) on any new copy that arrives.
- Maintain this audit doc.
- Flag every spot in the bank where new copy is needed, with file/line references and the applicable rule citations from `CTA_COPY_RULES.md`.

**The AI will not:**
- Write any new `[line1, line2]` phrasing. Every entry in this bank is a brand-voice judgement call.
- Make decisions about who writes the copy, how they work, or how they verify their own work.
- Sign off on §7 acceptance.

---

## 10. Architectural quality ceiling — flagged for visibility

A deterministic bank ships the same CTAs to multiple businesses with the same input bundle. Two trades businesses with the same `step1.industry`, same `tonePreset`, same `primaryGoal`, same first touchpoint will see the **exact same CTAs**. Over time, two buyers seeing the same kit-CTA in different ZIP codes is a real possibility.

The current architecture (deterministic bank in Core; AI variations layered in Pro per `voice.ctaVariations`, when shipped) caps **per-buyer specificity** at what a finite bank can produce. Truly bespoke brand copy — fully tuned to a single buyer's voice, history, and offer — is hard to reach from a finite bank by construction. That's the architectural ceiling.

The **bank-quality bar**, however, is not "very good template." It is: would a senior copywriter approve this line for the kind of business this leaf describes? Core kits ship Folio 05 CTA examples directly from this bank with no AI variation layer (per [`PROJECT_OVERVIEW.md`](../../PROJECT_OVERVIEW.md) commercial tiers); the bank is the deliverable for Core buyers, not a fallback beneath an AI layer.

**Implications worth knowing:**

- The §1.1 tiered depth investment raises the floor of the bank's variant pool and lowers the odds that two buyers in the same `(industry, surface, goal, tone)` cell see the same line. It does not raise the ceiling on per-buyer specificity.
- For Core buyers, this bank **is** the CTA layer. Quality investment in the bank should reflect that — the read-aloud check in §12.3 sets the bar.
- For Pro buyers, the AI variation layer (`voice.ctaVariations`) is **additive on top of** an already-good bank — the path to per-buyer-specific copy, not a substitute for bank quality. A weak bank doesn't get fixed by an AI layer on top; it gets amplified.
- If the goal is exceptional-tier CTAs for Pro buyers at scale, the architecture decision to consider (separately from this audit) is whether Pro's *default* CTA path becomes AI-generated grounded on the bank + buyer signals + voice rules, with the bank as the grounding source. **That is a Pro-architecture decision, not a Pro-0 decision.** Not recommending it here. Flagging because "is this the best path?" has a different answer at the architecture level than at the bank-content level.

---

## 11. Open product-spec decision

Only one remaining decision falls inside this audit's scope (the rest — writing-engagement workflow — is outside scope):

**Depth target shape:** tiered (§1.1: tier 1 ≥ 8, tier 2 ≥ 6, tier 3 ≥ 4) or flat ≥ 6 across all leaves.

This shapes the copy-volume estimate that goes to whoever runs the writing engagement, and shapes how the §7.1 mechanical gate measures completion per leaf.

| Choice | Net-new pairs | Quality logic |
|---|---:|---|
| Tiered (audit recommendation) | ~980 | Concentrates depth on the ~168 leaves that fire on every Pro kit; conserves on long-tail leaves that fire 1 kit in 200. |
| Flat ≥ 6 | ~672 | Uniform target. Simpler to communicate. Treats every leaf as equally weighted. |
| Flat ≥ 8 | ~1,120 | Highest variant spread everywhere. Most volume for the same uniform target. |

Once this is locked, AI proceeds on A3, A4, A7 (per §8.2). A5 and A6 follow when copywriter work begins on W5 and W2 respectively.

---

## 12. Copywriter quality assessment (read-aloud)

Performed 2026-05-26 against `CTA_COPY_RULES.md` §13 four-question check. Distinct from §5 (grep-based mechanical violations) and §6 (templated-language sniff at the structural level). Findings here are qualitative copywriter-grade, and feed directly into the W1 read-aloud audit per §8.1.

### 12.1 Working well

- **Rules document is brand-grade.** `CTA_COPY_RULES.md` §3 (emotional register by industry) is sophisticated; when followed, the resulting copy clears the §13 bar. The distinction between trades_home competence/ease vs. food_hospitality desire/invitation vs. creative_pro collaborative curiosity is exactly the right way to model industry voice.
- **Platform-native vocabulary is correctly applied across surfaces.** Reply triggers on email, link-in-bio/DM/comment on casual social, Call/Message on directory, value-led framing on LinkedIn. No cross-platform vocabulary leaks observed.
- **Punctuation discipline holds.** No em dashes in CTA strings; period-vs-comma logic mostly followed.
- **`professional_svc` voice maintains gravity throughout.** No exclamation slips, no urgency language, complimentary-first-consultation pattern correctly applied.

### 12.2 Areas needing concentrated work

1. **`audience_growth` is the most formulaic surface across the bank.** Nearly every leaf follows the same two-sentence structure: `[Follow / subscribe for X, Y, Z]` + `[frequency promise]`. Pattern stacks visibly across industry and tone. At current 3-pair depth this is tolerable; at tier-1 depth (≥ 8) it will read as system output. Needs structural variation, not just volume. See §13 Wave C for the recommended creative rethink.

2. **Bold vs. friendly often blur together.** Across many leaves the tonal delta is one softener word ("together," "we'll") or one timeline-language shift, not two perceptibly different registers. Example, trades_home WEBSITE × `lead_gen`:
   - **bold:** "Tell us what needs doing and get a quote. We follow up within one business day."
   - **friendly:** "Tell us what's going on and we'll figure it out together. We'll get back to you the same day."

   The intended distinction (declarative + short for bold; warm + conversational for friendly) is not reliably present. Differentiation between these two tones is the highest-leverage quality move available short of structural rewrites — readers should perceive the difference on a single read, without seeing the label.

3. **`professional` tone slips into form-letter copy in several industries.** Selected examples that technically obey the rules but fail the §13 read-aloud check:
   - "We accommodate dietary requirements and can provide references." (food_hospitality LinkedIn lead_gen)
   - "We match contributors with opportunities that fit their capacity." (community WEBSITE direct_sales)
   - "We provide a written scope before any commitment." (creative_pro WEBSITE direct_sales)

   These read as HR/RFP language, not as a real restaurant or community organization speaking. The rules don't forbid this register; the §13 check catches it. The fix is voice-tuning per industry, not a new rule.

4. **`retention` is thin and pattern-heavy across surfaces.** Six of seven WEBSITE retention industries open on some variant of "been a while," "ready to come back," or "pick up where we left off." Email retention is better differentiated but still leans heavily on the same re-engage skeleton. Tier-2 depth on retention needs three or four distinct conceptual openers per industry before pair-writing begins.

5. **`community × direct_sales` has a register problem in places.** Example: `"Support the work. Volunteer or give, your call.", "It takes about 30 seconds."` "Your call" is transactional shorthand and "30 seconds" is friction-reduction copy borrowed from retail. Per §3 the community register is *belonging and purpose,* not efficiency — the entry is rules-compliant but emotionally off-register.

6. **"All other industries" catch-alls drop the quality floor.** Google Business covers `creative_pro`, `professional_svc`, `retail_maker`, and `community` with one shared 3-pair block; Yelp does the same. These fire on a non-trivial slice of directory surfaces and read generic to every industry they cover. §13 Wave G breaks these out per industry.

7. **Rule violations from §5 stand.** Lines 869, 1518, 1524 confirmed; lines 1308, 1850 borderline. Fold rewrites into the surrounding leaves during W2 / Wave A.

8. **Format anomaly at line 1393 of `CTA_PHRASE_BANKS.md`.** `["Save this and follow. New things every week, everything made by hand."]` parses as a single-element array, not a `[line1, line2]` pair (Social Casual `audience_growth` × `retail_maker` × bold). Copywriter confirms intent (add line2) or AI confirms generator behavior on single-line entries. Likely an authoring slip.

### 12.3 Quality bar — Core ships the bank

Per the §10 calibration and the decision-log entry above: Core kits render Folio 05 CTA examples directly from this deterministic bank with no AI variation layer. The bar for the bank is therefore not "good template that AI will elevate." The bar is:

> **Would a senior copywriter approve this line for the kind of business this leaf describes?**

The audit's §10 architectural-ceiling observation (determinism caps per-buyer specificity) still applies — but it caps *specificity,* not *quality.* The bank-quality floor sits substantially higher than §10 originally framed. §13 wave sequencing (below) is calibrated to that bar.

---

## 13. Wave sequencing for the W-track

The §8.1 W1–W7 table is the work breakdown — *what gets delivered.* This section sequences it into practical waves — *what gets delivered in what order.* Each wave maps to one or more W-track items.

| Wave | Focus | Maps to | Approx. net-new pairs |
|---|---|---|---:|
| **A** | Rule-violation fixes (§5) and per-leaf read-aloud audit + rewrites (§12) before any depth work begins | W1, W3, W4 | ~70–135 rewrites (net 0) |
| **B** | WEBSITE + EMAIL Tier-1 depth, every industry, every goal, every tone | W2 (Tier 1 subset) | ~770 |
| **C** | `audience_growth` creative rethink across WEBSITE, EMAIL, Social Casual — structural variation **before** depth | W2 (audience_growth subset) | folded into B / D |
| **D** | Social Casual × `direct_sales` and `lead_gen` Tier-1 depth; social casual retention catch-all expanded per-industry | W2 (Tier 1 social subset) | ~310 |
| **E** | Narrator-tuned variants for the 6 industry × narrator pairs in §4C | W5 | ~360–480 |
| **F** | Marketplace TODOs filled (§4B) + Tier-2 depth across Google Business `direct_sales`, Marketplace `direct_sales`, remaining `audience_growth`/`retention` | W2 (Tier 2) + W6 | ~155 |
| **G** | Tier-3 long tail (LinkedIn, Yelp, directory `lead_gen`, marketplace `lead_gen`) + per-industry breakout of "all other industries" catch-alls + `ctaTemplates` depth | W2 (Tier 3) | ~75 |

**Total:** ~1,670–1,790 pairs across W2 + W5 + W6. Reconciles with §11 (~980 for tiered depth) once Wave E (W5, narrator) is counted separately.

### 13.1 Sequencing rationale

- **A before B.** Adding depth to leaves that contain weak anchors produces a bank that's 8-deep in the same problems rather than 3-deep. Interleave the audit into the per-leaf workflow rather than running it as a separate up-front pass — it's faster to fix a leaf while the writer is already immersed in its industry and tone.
- **B before D before F before G.** Tier follows traffic. Tier 1 surfaces fire on every Pro kit; Tier 3 leaves fire roughly 1 kit in 200. Concentrated quality investment goes where the variant selector hits most often.
- **C interleaved with B.** The `audience_growth` formula problem (§12.2 #1) is not solved by additional volume on the existing structure. The creative work — *what are 3–4 different shapes of audience_growth CTA per industry?* — must happen before pair-writing starts, otherwise Wave B produces five more pairs of the same formula per leaf.
- **E after at least B and D land.** Narrator-tuned variants build on top of the established industry voice. Writing them before the industry voice is mature at depth risks both passes drifting against each other. The AI-side bank-file-format work (A5 in §8.2) lands together with Wave E content, not before.

### 13.2 Recommended starting batch

**Wave A + the first two industries in Wave B: `trades_home` and `food_hospitality`.**

Rationale: these two industries have the sharpest emotional-register contrast in the bank (competence/ease vs. desire/invitation), so the bold vs. friendly differentiation problem (§12.2 #2) surfaces and gets solved against the most testable cases first. Once tonal differentiation is solved on those two, the pattern carries through the remaining five with less risk of drift.

Wave C's creative work — *what is the specific payoff of following or subscribing, by industry, in language that's not generic "stay informed"?* — should run as research/exploration ahead of any `audience_growth` writing in Wave B, even on those first two industries.

### 13.3 Sign-off cadence

Per §7.2, the editorial gate is owned by whoever runs the writing engagement — not by the AI. The wave structure above is a recommended sequencing, not a process mandate. Whoever runs the engagement decides:

- One writer or many across waves
- Whether waves run strictly sequential or with overlap (B and C are explicitly interleaved; the rest can be parallelized at the writer's discretion)
- How read-aloud sign-off is performed per leaf and per wave
- When mechanical-gate runs (§7.1) trigger relative to wave completion

AI keeps the recurring A-track items running (A8, A9, A10) as each wave lands.
