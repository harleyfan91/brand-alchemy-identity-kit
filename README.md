# Brand Alchemy Identity Kit

Monorepo for the **Identity Kit** microsite (`apps/web`) and API (`apps/api`): guided intake, review, checkout placeholder, and post-pay edit/confirm flows.

## Brand alignment

Parent brand (typography, neutrals, β△ mark, tokens) is owned by the **main marketing / umbrella** repository (`brand-alchemy-llc-landing-page-main` on this machine: `../brand-alchemy-llc-landing-page-main/`). Before changing web UI chrome or company-facing copy, read [**BRAND_SOURCE_OF_TRUTH.md**](../brand-alchemy-llc-landing-page-main/docs/BRAND_SOURCE_OF_TRUTH.md) there, plus `docs/BRAND_GUIDELINES.md` and `docs/BRAND_PLAYBOOK.md`. **`apps/web/src/brand-tokens.css`** is a synced copy of the umbrella `public/brand-tokens.css` — re-copy when that file changes.

**Customer voice & product line (all digital products):** Canonical system lives in the umbrella repo — [**docs/product-platform/**](../brand-alchemy-llc-landing-page-main/docs/product-platform/README.md). Do not duplicate SKU boundaries or `brand-context` schema here; identity-kit **implements** that contract (generation, PDFs, fulfillment). Kit-only assets (for example the PDF symbol strip) stay in **`@identity-kit/brand-assets`** unless promoted company-wide.

## Documentation

**Full index (root specs + `docs/` research and audits):** [docs/README.md](./docs/README.md).

### Start here

| Doc | Audience | Purpose |
|-----|----------|---------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Everyone | **Master overview:** repo map, shipped vs target deliverables, Brand Identity Guide as primary artifact, reading map |
| [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md) | Eng | **Inputs → logic → outputs:** intake contract, generation layers, API/CLI, guide IA |
| [PRODUCT.md](./PRODUCT.md) | PM, Eng | Product intent: ICP, tiers, non-goals, DoD, metrics, open research |
| [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) | Eng | Sequenced path from UI-complete → operational (Stripe, email, launch) |
| [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) | PM, Eng | Per-PDF production detail (including Brand Identity Guide) |
| [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) | Eng | Implementation contract; §3.3 path catalog; §10A guide rules |

### Day-to-day (UI, ops, PDF dev)

| Doc | Audience | Purpose |
|-----|----------|---------|
| [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) | PM, Eng | Screen copy + **current UI behavior** (keep in sync with `apps/web`) |
| [OPERATIONS.md](./OPERATIONS.md) | Eng | Stack, DNS, env vars, Stripe, ordered go-live checklist |
| [PDF_GENERATION.md](./PDF_GENERATION.md) | Eng | How PDFs are built today (local CLI + production-shaped library) |
| [STEP1_INDUSTRY_CATALOGS.md](./STEP1_INDUSTRY_CATALOGS.md) | PM, Eng | Step 1 industry wheel copy (sync with `step1ControlledOptions`) |

### Deep dives (`docs/`)

Research logs, typography strategy notes, and Core backlog / input-philosophy audits live under **[`docs/`](./docs/README.md)** — e.g. [docs/audits/CORE_PATH_CUSTOMIZATION_AUDIT.md](./docs/audits/CORE_PATH_CUSTOMIZATION_AUDIT.md), [docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md](./docs/research/NARRATOR_ROUTING_PHASE2_RESEARCH.md).

### Package-local

| Doc | Purpose |
|-----|---------|
| [packages/brand-assets/README.md](./packages/brand-assets/README.md) | **Symbol strip:** layout + generated `alchemy-symbol-strip.svg` |

### Suggested reading order

1. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) → [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md)  
2. [PRODUCT.md](./PRODUCT.md) → [PHASE_ROADMAP.md](./PHASE_ROADMAP.md)  
3. [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) → [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) §10A  
4. [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md)  
5. [OPERATIONS.md](./OPERATIONS.md), [PDF_GENERATION.md](./PDF_GENERATION.md)  
6. [docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md)  
7. [docs/research/](./docs/research/) for edge-case rationale

## Apps and packages

- **`apps/web`** — React, TypeScript, Vite, Tailwind. Micro-step intake, review, dev PDF generate on payment screen; no live Stripe/AI/email yet.
- **`apps/api`** — Express: `POST /generate/core`, session PDF downloads under `tmp/generated-kits/`.
- **`packages/shared`** — Shared TypeScript types (`IdentityKitForm`, etc.) consumed by `apps/web` and **`packages/generation`**.
- **`packages/generation`** — Core deterministic PDF pipeline (`@react-pdf/renderer`), fixtures, and tests. **No payments.**
- **`packages/brand-assets`** — Symbol strip sequence + center label (`@identity-kit/brand-assets`); generated **`alchemy-symbol-strip.svg`** for Google Slides and other tools. Run `npm run generate:brand-strip` after changing strip logic.

## Quick start

```bash
npm install
npm run dev:web    # Vite dev server
npm run dev:api    # API dev server
npm run dev:api:built   # Rebuild shared+generation+api, then run API from dist (best after schema/generation changes)
npm run dev:all    # web + api (use dev:api:built when testing Generate Core PDFs after generation changes)
npm run test:generation   # Core PDF tests (@react-pdf/renderer + fixture intake)
npm run generate:pdfs     # Write five Core PDFs under packages/generation/output/<persona>/ (gitignored); optional: npm run generate:pdfs -- established-pro
npm run generate:brand-strip  # Regenerate packages/brand-assets/alchemy-symbol-strip.svg
npm run build      # shared + generation + web + api (web needs platform-native CSS deps for Vite)
npm run lint       # all workspaces
```

If you hit `API request failed: 500` on the Generate Core PDF action in dev, it usually means web is running against a stale API build. Run `npm run dev:api:built` (rebuilds shared + generation + api) before retrying.

## User flow (current UI)

1. **Landing** — Choose Core ($79) or Pro ($149) tier; fixed bottom CTA widens slightly as the user scrolls (visual emphasis).
2. **Intake (chapters 1–7)** — Micro-step wizard (`microStepSchema.ts`); shared **step shell** with compact wordmark, progress, **Back** / **Continue**. Step 3 includes live voice preview rail; steps 5–6 use swipeable decks where applicable.
3. **Review** — Sections per chapter; **Edit** jumps back; voice axes summarized (low / balanced / high).
4. **Payment** — **Generate Core PDFs** calls `POST /generate/core` (Stripe planned).
5. **Processing** — Placeholder animation.
6. **Edit** — Draft text placeholders.
7. **Confirm** — Download links when generation succeeded (five PDFs for Core today).

**Navigation UX:** Changing **screen** or **step index** scrolls the window to the top (`useLayoutEffect` in `App.tsx`) so mobile users don’t land mid-page on the next step.

## Core vs Pro (current product direction)

| Dimension | Core Kit ($79) | Pro Kit ($149) |
|---|---|---|
| Generation style | Foundational strategy system assembled from guided inputs | Foundation plus AI-personalized drafts shaped by richer intake context |
| Input depth | Required fields + guided selectors | Same base inputs + **required Pro depth fields** (see validation in `useFlowState.ts`) + optional voice/visual notes and reference image filename |
| Voice output | Uses selected tone/preset + slider profile | Uses slider profile plus custom voice notes for deeper brand voice tailoring |
| Visual output | Guided palette/style choices from predefined systems | Same base choices plus notes intended to refine AI direction in later phases |
| Edit stage | Editable draft outputs before send | Editable draft outputs before send (section regenerate planned for Phase 2) |
| Deliverables | **Brand Identity Guide** (primary) + Quick Start + three **interim** legacy PDFs | Same + **Content Starter Pack** (planned) |

## Deliverables

**Shipped today (Core generate):** five PDFs — primary **`05-brand-identity-guide.pdf`**, plus interim Brief / Style / Voice and Quick Start. **Target packaging:** Guide + Quick Start (+ Pro Content Starter Pack).

Full tables, folio IA, and interim vs target notes: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) and [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md).

## What AI personalization adds

- Synthesizes signals across audience, tone, values, story, visual direction, and positioning inputs instead of filling static templates.
- Produces more brand-specific messaging tradeoffs, not just cleaner wording.
- Makes the **Content Starter Pack** possible because it can turn strategy inputs into usable copy starters.
- Keeps the user in control through post-pay editing, with Pro regenerate controls still planned for a later phase.

## Survey-to-output map

Intake → PDF mapping and micro-step validation: [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md). Legacy four-PDF section matrix: [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) §3. Brand Identity Guide intake roles: §10A.5.

### Phase 2 wiring plan (UI → generation → delivery)

**Build order:** [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) — PDFs + tests first, Pro AI, gate, then Stripe and email.

| Layer | Role |
|--------|------|
| **Intake** | `IdentityKitForm` + `microStepSchema.ts` / `microStepValidation.ts` |
| **Generation** | `GENERATION_PIPELINE.md`, `OUTPUT_TRANSLATION_SPEC.md`, `DELIVERABLE_PRODUCTION_SPEC.md` |
| **API (today)** | `POST /generate/core` writes five PDFs; fulfillment/email planned |
| **Delivery bundle** | Multiple PDFs per order — see deliverable spec |

## Environment

Copy `.env.example` (when present) into local `.env` / provider settings for API and web as needed.

## Repo layout

```text
identity-kit/
├── apps/
│   ├── web/          # Customer UI
│   └── api/          # Backend service
├── packages/
│   ├── shared/       # Shared types (IdentityKitForm)
│   ├── generation/   # Core PDF generation, fixtures, tests
│   └── brand-assets/ # Symbol strip source + generated SVG for decks/PDF
├── PROJECT_OVERVIEW.md
├── GENERATION_PIPELINE.md
├── PRODUCT.md
├── OPERATIONS.md
├── SCREEN_COPY_MAP.md
└── package.json      # npm workspaces
```
