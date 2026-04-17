# Deterministic Customization System Model

## Decision: Build on current system, do not restart

Current docs and tests already contain most of the right pieces:
- `OUTPUT_TRANSLATION_SPEC.md` has canonical input contract, section mapping, field usage strength, deterministic rules, and the **Path Class Catalog** (**§3.3**) plus prescriptive **Path recipes** (**§3.3.1**). **To-do:** whenever Core routing or canonical review paths change, update §3.3 / §3.3.1 first, then tests.
- `DELIVERABLE_PRODUCTION_SPEC.md` has per-deliverable section intent and input expectations.
- `packages/generation/src/core-pdfs.test.ts` encodes many path-level behavioral guardrails.

The issue is not missing logic; it is missing **one canonical map** that connects:
1) each intake variable,  
2) each section/output block, and  
3) path/routing effects + deterministic precedence.

Restarting would risk losing verified behavior and matrix coverage. Better approach: keep current architecture and formalize this model.

---

## Mental model: three-layer deterministic compiler

Treat generation as a deterministic compiler with three explicit layers.

1. **Input normalization layer (facts)**
   - Convert intake fields into normalized facts and profile signals.
   - Output: a stable `NormalizedFacts` object (no prose yet).
   - Examples: resolved offer/audience labels, tone buckets, narrator profile, touchpoint cluster, primary channel.

2. **Section planning layer (decisions)**
   - For each PDF section, decide:
     - template/variant id,
     - required vs fallback facts,
     - route/scenario id (if applicable),
     - constraints (length, style, banned patterns),
     - conflict resolution notes.
   - Output: a `SectionPlan` per section.

3. **Section realization layer (copy)**
   - Render deterministic text from `SectionPlan`.
   - Apply final language constraints and safety checks.
   - Output: final section text/blocks.

This structure keeps output deterministic while still customized because customization happens through controlled routing and constrained templates, not randomness.

---

## Canonical mapping framework

Use these four artifacts together as the single source of truth:

1. **Field registry**
   - Every intake field with:
     - status (`strong`, `light`, `pro_only`, `unused`),
     - normalization rule,
     - default/fallback behavior when absent.

2. **Section contract table**
   - Every output section with:
     - owner file/function,
     - required facts,
     - fallback facts,
     - route ids / variant ids,
     - hard constraints (word count, formatting, tone).

3. **Path influence matrix**
   - Rows = important path signals (narrator, industry, goal, touchpoint cluster, stage, tone).
   - Columns = sections.
   - Cell value = `none`, `light`, `strong`, plus route/variant notes.

4. **Coverage matrix (tests)**
   - Map each path class and each section contract to explicit test IDs in `core-pdfs.test.ts`.
   - Include known contradiction paths and expected deterministic tradeoffs.

---

## Deterministic precedence contract (must be explicit)

For every section, document precedence in this order:

1. factual correctness and safety  
2. scenario/route selection  
3. section intent  
4. tone/style shaping  
5. optional enrichers

When signals conflict (example: narrator-model mismatch), resolve by rule instead of implicit behavior and label the result as:
- `expected_tradeoff` (accepted),
- `needs_rule` (gap),
- `bug` (unexpected regression).

---

## What is already strong vs what is missing

**Strong now**
- Field-level usage inventory in `OUTPUT_TRANSLATION_SPEC.md` section 3.1.
- Section-level mapping matrix in `OUTPUT_TRANSLATION_SPEC.md` section 3.
- Deliverable/section purpose and format in `DELIVERABLE_PRODUCTION_SPEC.md`.
- Broad matrix-style regression tests in `core-pdfs.test.ts`.

**Missing now**
- Single input->facts->route->section trace for each major section.
- Explicit precedence/conflict policy per section.
- Test-to-contract traceability (which test guards which section rule).
- A compact “path class catalog” that names canonical path combinations.

---

## Practical implementation plan (incremental, no rewrite)

1. Add a `Path Class Catalog` (8-12 canonical combinations) and version it.
2. Add a `Section Contract Ledger` (one row per section block) with owner + route ids.
3. Add a `Traceability Index` that links section contracts to test names.
4. Mark each uncovered contract as `missing_test`.
5. Add/adjust tests only for uncovered contracts.
6. Keep docs/spec/tests in lockstep when behavior changes.

---

## Keep vs restart criteria

Only restart if at least one is true:
- deterministic rendering cannot be explained by explicit route/template rules,
- contract drift is too high to map incrementally,
- tests cannot reliably pin key path classes.

Current state does not meet restart criteria. Recommendation is **build on existing system**, but enforce this model so future tuning is systematic rather than piecemeal.
