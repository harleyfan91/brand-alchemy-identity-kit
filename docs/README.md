# Identity Kit documentation index

Specs and roadmap stay at the **repository root** so links from code reviews, issues, and external notes stay stable. **Research logs** and **audits / philosophy** live under `docs/` so the root stays scannable.

## Repository root (authoritative / living)

| Document | Audience | Role |
|----------|----------|------|
| [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) | Everyone | **Start here:** repo map, shipped vs target deliverables, Brand Identity Guide, reading map |
| [GENERATION_PIPELINE.md](../GENERATION_PIPELINE.md) | Eng | Inputs → logic → outputs; API/CLI; guide IA summary |
| [PRODUCT.md](../PRODUCT.md) | PM, Eng | Product source of truth: ICP, tiers, DoD, metrics, open research |
| [PHASE_ROADMAP.md](../PHASE_ROADMAP.md) | Eng | Sequencing: UI complete → PDFs → persistence → Stripe → email → launch |
| [DELIVERABLE_PRODUCTION_SPEC.md](../DELIVERABLE_PRODUCTION_SPEC.md) | PM, Eng | Per-PDF structure, pages, inputs (incl. Brand Identity Guide) |
| [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md) | Eng | Intake → sections; deterministic vs AI; **§3.3–3.3.1** Path Class Catalog; **§10A** guide layout |
| [docs/DETERMINISTIC_CUSTOMIZATION_MODEL.md](./DETERMINISTIC_CUSTOMIZATION_MODEL.md) | Eng | Three-layer compiler mental model (companion to pipeline doc) |
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
| [AI_INTEGRATION_PLAYBOOK.md](./research/AI_INTEGRATION_PLAYBOOK.md) | Sprint-prep for Pro-A: Claude vision + structured outputs adapter contract, lessons from a sibling production codebase, Pro-A acceptance criteria |
| [PRO_FULFILLMENT_ORCHESTRATION.md](./research/PRO_FULFILLMENT_ORCHESTRATION.md) | Per-kit fulfillment lifecycle: webhook handoff, fan-out across the ~26 Section IDs, walker chain, per-PDF assemblers, state machine, 4-layer failure semantics, `kit_fulfillment_events` schema |
| [BRIEF_IDEAL_CUSTOMER_AUDIENCE_RESEARCH.md](./research/BRIEF_IDEAL_CUSTOMER_AUDIENCE_RESEARCH.md) | **Proposed:** Ideal customer blurb + five research-bank fact slots, cost model, quarterly trusted-source refresh |

## `docs/specs/` (section contracts)

| Document | Role |
|----------|------|
| [BRIEF_IDEAL_CUSTOMER.md](./specs/BRIEF_IDEAL_CUSTOMER.md) | Brand Brief Ideal customer — structured snapshot (`brief.idealCustomer`) |
| [CONTENT_STARTER_PACK.md](./specs/CONTENT_STARTER_PACK.md) | Pro Content Starter Pack — hybrid scaffold + AI (implements umbrella platform contract) |

**Customer voice & product line (canonical — umbrella repo, do not fork):**  
[`../brand-alchemy-llc-landing-page-main/docs/product-platform/`](../brand-alchemy-llc-landing-page-main/docs/product-platform/README.md)

## `docs/product/` (packaging and redundancy)

| Document | Role |
|----------|------|
| [DELIVERABLE_REDUNDANCY_MATRIX.md](./product/DELIVERABLE_REDUNDANCY_MATRIX.md) | Which PDF owns what; REF / GAP rules vs Brand Identity Guide |

## `docs/audits/` (backlog and input philosophy)

| Document | Role |
|----------|------|
| [BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md](./audits/BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md) | Packaging refactor plan: main guide + supporting docs, page plan, and implementation scope |
| [CTA_COMPOSITION_UPDATE_PLAN.md](./audits/CTA_COMPOSITION_UPDATE_PLAN.md) | Sequenced plan for deterministic CTA composition upgrades (signals, tactics, tests) |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](./audits/CORE_PATH_CUSTOMIZATION_AUDIT.md) | Generic vs customized path; roadmap §5; shipping §6; PDF backlog §7 |
| [CORE_INPUT_REDESIGN_ANALYSIS.md](./audits/CORE_INPUT_REDESIGN_ANALYSIS.md) | Deterministic Core input philosophy and field inventory |
| [PRO_KIT_STRATEGY.md](./audits/PRO_KIT_STRATEGY.md) | Pro tier scope, packaging, intake field audit, AI deviation budget, upgrade ladder |
| [INTAKE_TO_SIGNAL_MODEL_MEMO.md](./audits/INTAKE_TO_SIGNAL_MODEL_MEMO.md) | Rethink memo: which inputs should surface, stay hidden as signals, or be deferred |
| [BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) | **Living:** folio-by-folio shipped vs gaps for the guide PDF |

## `docs/guides/` (generation maintenance)

| Document | Role |
|----------|------|
| [CTA_IN_CONTEXT_FRAME_LIBRARY.md](./guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md) | Folio 05 in-context CTA shells: geometry, slot classes, layout budget |
| [PALETTE_EXPANSION_RUBRIC.md](./guides/PALETTE_EXPANSION_RUBRIC.md) | Palette library expansion criteria |
| [PALETTE_SYNC_VALIDATION_CHECKLIST.md](./guides/PALETTE_SYNC_VALIDATION_CHECKLIST.md) | Cross-package palette parity checks |
| Other `PALETTE_*.md` in this folder | Pre-merge distinctness, candidates, blue-lane targets |

## Suggested reading order

1. [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) → [GENERATION_PIPELINE.md](../GENERATION_PIPELINE.md)
2. [PRODUCT.md](../PRODUCT.md) → [PHASE_ROADMAP.md](../PHASE_ROADMAP.md)
3. [DELIVERABLE_PRODUCTION_SPEC.md](../DELIVERABLE_PRODUCTION_SPEC.md) → [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md) §10A
4. [BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md)
5. [SCREEN_COPY_MAP.md](../SCREEN_COPY_MAP.md)
6. [OPERATIONS.md](../OPERATIONS.md), [PDF_GENERATION.md](../PDF_GENERATION.md)
7. [CORE_PATH_CUSTOMIZATION_AUDIT.md](./audits/CORE_PATH_CUSTOMIZATION_AUDIT.md)
8. [docs/research/](./research/) for edge-case rationale

## Package-local docs

- [packages/brand-assets/README.md](../packages/brand-assets/README.md) — symbol strip
- [packages/pdf-chrome/README.md](../packages/pdf-chrome/README.md) — PDF Chrome helper
- [apps/web/README.md](../apps/web/README.md) — web app

Do not merge [PRODUCT.md](../PRODUCT.md) with [OUTPUT_TRANSLATION_SPEC.md](../OUTPUT_TRANSLATION_SPEC.md): one is intent and scope, the other is implementation contract. Use [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) + [GENERATION_PIPELINE.md](../GENERATION_PIPELINE.md) as the onboarding pair above both.
