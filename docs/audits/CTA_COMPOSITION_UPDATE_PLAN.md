# CTA composition update plan

## Purpose

Turn folio 05 CTA generation into a deterministic, signal-rich recommendation engine that balances:

- brand voice and readability
- platform realism
- conversion-oriented marketing tactics

This plan assumes:

- frame/layout contracts stay mostly stable
- immediate focus is copy composition in `brandIdentityGuideModel.ts`

Research basis: `docs/research/CTA_COMPOSITION_MARKETING_RESEARCH_2026-04.md`.

---

## Current state (summary)

Implemented today:

- goal + surface-based CTA line generation
- social tone split (`professional` / `casual`)
- dedupe against sample phrases and neighboring CTA content
- deterministic caps and surface selection rules

Not yet implemented:

- full multi-signal CTA composition
- explicit conversion-mechanic slots (risk reversal, urgency policy, trust framing)
- intent-tier policy (discovery vs consideration vs action)
- systematic expectation-setting and offer realism rules

---

## Design principles for this update

1. **Deterministic first**  
   Same input should always yield same output.

2. **Signal precedence over ad-hoc phrase swaps**  
   Define explicit routing order and fallback behavior.

3. **Platform realism without mimicry**  
   Match action semantics of surfaces; avoid trademarked UI claims or deceptive specificity.

4. **Conversion-safe persuasion**  
   Encourage action with clarity, value, and friction reduction; avoid manipulative or unverifiable claims.

5. **Keep six-page contract stable**  
   Changes should not increase folio count or trigger layout overflow regressions.

---

## Proposed architecture changes

### 1) Introduce CTA composition strategy object

Add an internal strategy shape (deterministic, machine-facing), derived from form + signals:

- `intentTier`: `discover` | `consider` | `act`
- `surfaceActionMode`: e.g. `shop`, `book`, `message`, `apply`, `subscribe`, `call`
- `offerMode`: e.g. product purchase, consultation, quote, newsletter, retention update
- `riskProfile`: `standard` | `sensitive_industry`
- `voiceMode`: concise/formal/energetic modulation
- `frictionPolicy`: which reassurance patterns are allowed
- `urgencyPolicy`: allowed / disallowed / conservative

### 2) Replace static line tables with slot-driven templates

For each surface and goal family, compose lines from slot builders:

- action clause
- value clause
- next-step expectation clause
- optional trust/risk clause
- optional urgency clause (gated)

Keep final outputs to <=2 lines per surface unless product intentionally changes caps.

### 3) Expand signal inputs used by CTA composer

Use additional inputs where available:

- `businessOperatingModel`
- offer and delivery context
- `painPoints` and `desiredOutcomes` (light extraction)
- `industry` risk handling
- stage/content-density modulation
- touchpoint family details (not just bucket)

### 4) Explicit fallback hierarchy

If high-specificity composition fails:

1. surface+goal deterministic fallback line
2. goal-level generic but specific line
3. final neutral fallback (current behavior)

No empty modules, no duplicated neighboring lines.

---

## Phased execution

## Phase 1 — Spec + policy lock

Artifacts:

- Update `OUTPUT_TRANSLATION_SPEC.md` §10A.5 and §10A.6A with new CTA composition policy.
- Add compact "allowed persuasion tactics" and "prohibited tactics" lists.

Acceptance:

- policy is explicit on urgency/trust/risk handling
- signal precedence documented
- no ambiguity about what is deterministic vs future experimental

## Phase 2 — Code refactor (composition engine)

Targets:

- `packages/generation/src/deterministic/brandIdentityGuideModel.ts`

Tasks:

- extract strategy resolver helper(s)
- implement slot-based line builder per surface
- retain current dedupe and cap behavior
- preserve current `composeCtaSurfaceBlocks` data contract for renderer compatibility

Acceptance:

- no TS contract breaks for folio render path
- deterministic output stable for unchanged fixtures where behavior is intended to remain same

## Phase 3 — Test matrix expansion

Targets:

- `packages/generation/src/core-pdfs.test.ts`
- targeted deterministic unit tests in generation package

Add tests for:

- goal x surface x platform family behavior
- industry-sensitive copy constraints
- expectation-setting presence for relevant surface types
- dedupe and anti-generic checks
- page-count and overflow regression safety

Acceptance:

- all tests green
- six-page Brand Identity Guide contract preserved

## Phase 4 — Fixture review and calibration

Run curated fixture set across:

- ecommerce-first
- lead-gen services
- local directory-first
- audience-growth creator
- retention membership/business
- compliance-sensitive vertical

Acceptance:

- CTA lines read plausible to channel context
- conversion asks are concrete without spam tone
- no repeated weak fallback phrases across surfaces

---

## Guardrails (add / keep)

### Keep

- anti-vague language checks
- banned vocabulary checks
- dedupe normalization

### Add

- "specific next-step" rule for at least one CTA per surface
- restricted urgency claims unless verifiable
- no fabricated social proof or unsupported guarantees

### Do not add in this phase

- stochastic/AI-only CTA generation
- frame-routing overhauls
- major folio layout geometry changes

---

## Risks and mitigations

1. **Risk:** More specific CTAs may sound too "salesy" for some narrators.
   - **Mitigation:** voice modulation layer and industry-safe persuasion policy.

2. **Risk:** Added logic complexity makes outputs brittle.
   - **Mitigation:** strategy object + explicit fallback tiers + focused unit tests.

3. **Risk:** Content quality improves but layout overflows reappear.
   - **Mitigation:** maintain line caps and enforce existing page-count regression tests.

---

## Suggested first implementation slice

Start with high-impact, low-risk slice:

1. Introduce strategy resolver (without changing all text tables at once).
2. Upgrade `website` and `email` surfaces first (highest clarity opportunities).
3. Add tests for `direct_sales` and `lead_gen` paths.
4. Review fixture outputs.
5. Then roll same pattern into `directory`, `marketplace`, and `social`.

---

## Definition of done

- Specs updated and synced with implementation behavior.
- CTA composition uses documented signals and deterministic precedence.
- Surface lines are more action- and outcome-specific than current baseline.
- Six-page guide contract remains green.
- Status docs can mark "CTA composition sequencing item" as shipped for v1 policy scope.
