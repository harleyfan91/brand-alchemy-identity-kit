# Identity Kit documentation index

Specs and roadmap stay at the **repository root** so links from code reviews, issues, and external notes stay stable. **Research logs** and **audits / philosophy** live under `docs/` so the root stays scannable.

## Repository root (authoritative / living)

| Document | Audience | Role |
|----------|----------|------|
| [PRODUCT.md](../PRODUCT.md) | PM, Eng | Product source of truth: ICP, tiers, DoD, metrics, open research |
| [PHASE_ROADMAP.md](../PHASE_ROADMAP.md) | Eng | Sequencing: UI complete → PDFs → persistence → Stripe → email → launch |
| [DELIVERABLE_PRODUCTION_SPEC.md](../DELIVERABLE_PRODUCTION_SPEC.md) | PM, Eng | Per-PDF structure, pages, inputs, Core vs Pro |
| [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md) | Eng | Intake → sections; deterministic vs AI; input contract; **§3.3–3.3.1** Path Class Catalog + recipes (update when Core routing changes) |
| [SCREEN_COPY_MAP.md](../SCREEN_COPY_MAP.md) | PM, Eng | On-screen copy and current UI behavior |
| [OPERATIONS.md](../OPERATIONS.md) | Eng | Stack, DNS, env, Stripe, bootstrap |
| [PDF_GENERATION.md](../PDF_GENERATION.md) | Eng | How PDFs are built locally vs production-shaped entry |
| [STEP1_INDUSTRY_CATALOGS.md](../STEP1_INDUSTRY_CATALOGS.md) | PM, Eng | Step 1 industry wheel copy (sync with `step1ControlledOptions`) |

## `docs/research/` (design history and edge cases)

| Document | Status (short) |
|----------|----------------|
| [BUSINESS_OPERATING_MODEL_RESEARCH.md](./research/BUSINESS_OPERATING_MODEL_RESEARCH.md) | Shipped in product; doc = taxonomy + rationale |
| [CTA_COMPOSITION_MARKETING_RESEARCH_2026-04.md](./research/CTA_COMPOSITION_MARKETING_RESEARCH_2026-04.md) | External research synthesis for CTA quality, conversion mechanics, and platform realism |
| [NARRATOR_ROUTING_PHASE2_RESEARCH.md](./research/NARRATOR_ROUTING_PHASE2_RESEARCH.md) | Partial; some rules shipped, §4 checkout field still planned |
| [NARRATOR_PLATFORM_RESEARCH.md](./research/NARRATOR_PLATFORM_RESEARCH.md) | Superseded snapshot; see Phase 2 doc |
| [typography_strategy_phase2.md](./research/typography_strategy_phase2.md) | Research / alignment toward per-kit type |

## `docs/audits/` (backlog and input philosophy)

| Document | Role |
|----------|------|
| [BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md](./audits/BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) | Packaging refactor plan: main guide + supporting docs, page plan, and implementation scope |
| [CTA_COMPOSITION_UPDATE_PLAN.md](./audits/CTA_COMPOSITION_UPDATE_PLAN.md) | Sequenced plan for deterministic CTA composition upgrades (signals, tactics, tests) |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](./audits/CORE_PATH_CUSTOMIZATION_AUDIT.md) | Generic vs customized path; roadmap §5; shipping §6; PDF backlog §7 |
| [CORE_INPUT_REDESIGN_ANALYSIS.md](./audits/CORE_INPUT_REDESIGN_ANALYSIS.md) | Deterministic Core input philosophy and field inventory |
| [INTAKE_TO_SIGNAL_MODEL_MEMO.md](./audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md) | Rethink memo: which inputs should surface, stay hidden as signals, or be deferred |

## Suggested reading order

1. [PRODUCT.md](../PRODUCT.md) → [PHASE_ROADMAP.md](../PHASE_ROADMAP.md)
2. [DELIVERABLE_PRODUCTION_SPEC.md](../DELIVERABLE_PRODUCTION_SPEC.md)
3. [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md)
4. [SCREEN_COPY_MAP.md](../SCREEN_COPY_MAP.md)
5. [OPERATIONS.md](../OPERATIONS.md), [PDF_GENERATION.md](../PDF_GENERATION.md)
6. [CORE_PATH_CUSTOMIZATION_AUDIT.md](./audits/CORE_PATH_CUSTOMIZATION_AUDIT.md) (what to build next on Core quality)
7. Research files under [docs/research/](./research/) for “why” behind edge-case rules

## Package-local docs

- [packages/brand-assets/README.md](../packages/brand-assets/README.md) — symbol strip
- [packages/pdf-chrome/README.md](../packages/pdf-chrome/README.md) — PDF Chrome helper
- [apps/web/README.md](../apps/web/README.md) — web app

Do not merge [PRODUCT.md](../PRODUCT.md) with [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md): one is intent and scope, the other is implementation contract.
