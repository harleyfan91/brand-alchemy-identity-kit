# Identity Kit — project overview

**Start here** for what this repository is, what it produces today, and where detailed specs live.

**Product intent (ICP, tiers, DoD, metrics):** [PRODUCT.md](./PRODUCT.md)  
**Inputs → logic → outputs:** [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md)

---

## Executive summary

The **Brand Alchemy Identity Kit** is a standalone, mobile-first product: guided intake, deterministic PDF generation (Core today), and a planned path to Stripe checkout, email delivery, and Pro AI enhancement.

Customers are solo founders and small business owners who need **skimmable brand standards** they can use when posting, updating a site, or briefing a contractor — not agency-grade brand ops.

---

## Repository map

| Path | Role |
|------|------|
| [`apps/web`](./apps/web) | React intake wizard, review, payment/generate placeholder, confirm downloads |
| [`apps/api`](./apps/api) | Express API: sessions, `POST /generate/core`, static PDF download paths |
| [`packages/shared`](./packages/shared) | `IdentityKitForm`, intake migration, touchpoint registry, palette helpers |
| [`packages/generation`](./packages/generation) | Deterministic copy + `@react-pdf/renderer` PDFs, fixtures, tests |
| [`packages/brand-assets`](./packages/brand-assets) | Symbol strip and document-type marks |
| [`packages/pdf-chrome`](./packages/pdf-chrome) | Shared PDF footer/chrome helpers (optional for kit PDFs) |

Monorepo scripts: see [README.md](./README.md) Quick start.

---

## Primary customer artifact: Brand Identity Guide

The **Brand Identity Guide** (`05-brand-identity-guide.pdf`) is the **main reference document** we are optimizing for. It re-slices the same intake as the older Brief / Style / Voice PDFs into one **editorial, landscape** guide.

| Property | Value |
|----------|--------|
| **Format** | Branded PDF, US Letter **landscape** |
| **Reader sections** | 5 nav tabs: Summary · Look · Personality · Voice · Examples |
| **Physical pages** | **6** (Look = two pages: **02a** Color + **02b** Typography) |
| **Chrome fonts** | Inter + Source Serif 4 (kit parent neutrals for cards/chrome) |
| **Customer palette** | On swatches, wordmark color blocks, and hero accents — not global PDF chrome |

Folio-level layout and copy rules: [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) §10A, [docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md).

---

## Deliverables: shipped today vs target packaging

### Shipped today (engineering / dev generate path)

Core generation produces **five** PDF files per intake (same pipeline for CLI and `POST /generate/core`):

| File | Status | Role |
|------|--------|------|
| `04-quick-start.pdf` | **Primary (action)** | Week-by-week checklist; points to guide folios — start here |
| `05-brand-identity-guide.pdf` | **Primary (reference)** | Canonical at-a-glance brand (6 pages) — natural next step after Quick Start |
| `01-brand-brief.pdf` | **Deep dive** | Strategy depth; REF + expand; does not repeat guide Summary/Personality in full |
| `02-style-guide.pdf` | **Deep dive** | Visual principles and imagery; REF Look for swatches/type |
| `03-voice-playbook.pdf` | **Deep dive** | Voice lab; REF guide for paste-ready Examples |

**Pro-only Content Starter Pack** is specified but **not implemented** in `packages/generation` yet.

Customer journey: **Quick Start → Brand Identity Guide → optional deep dives**. See [docs/product/DELIVERABLE_REDUNDANCY_MATRIX.md](./docs/product/DELIVERABLE_REDUNDANCY_MATRIX.md).

### Target packaging (product direction)

From [docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md](./docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_PLAN.md):

| Tier | Customer-facing PDFs | Notes |
|------|----------------------|--------|
| **Core** | Brand Identity Guide + 30-Day Quick Start | ~6 + 1 pages |
| **Pro** | Same + Content Starter Pack | Applied copy asset, separate from foundational guide |

All five Core PDFs still generate on `POST /generate/core`; Confirm UI groups **Start here** (Quick Start + Guide) vs **Deep dive** (Brief, Style, Voice).

---

## Commercial tiers (summary)

| | Core Kit | Pro Kit |
|---|----------|---------|
| **Price** | $79 | $149 |
| **Generation (today)** | Deterministic from structured intake | Same base path; AI-enhanced sections planned |
| **PDFs (today)** | 5 files (guide + 4 legacy/quick start) | Same + Content Starter Pack when built |
| **Checkout (today)** | Payment screen triggers **generate** in dev; Stripe planned | Same |

Detail: [PRODUCT.md](./PRODUCT.md).

---

## Customer journey (current UI)

1. **Landing** — Choose Core or Pro tier.  
2. **Intake** — Micro-step wizard across 7 chapters (see [`apps/web/src/data/microStepSchema.ts`](./apps/web/src/data/microStepSchema.ts)); not a single screen per “step” only.  
3. **Review** — Edit any chapter; tier-aware copy.  
4. **Payment** — Placeholder checkout; **Generate Core PDFs** calls the API (not live Stripe yet).  
5. **Processing** — Placeholder animation.  
6. **Edit** — Draft text placeholders (post-pay wiring planned).  
7. **Confirm** — Download links when generation succeeded.

Screen copy and behavior: [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md).

---

## Reading map

Read in this order when onboarding to the repo:

1. **This file** — scope and shipped vs target outputs.  
2. [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md) — intake contract, logic layers, PDF entry points, QA.  
3. [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) — per-PDF production detail (including Brand Identity Guide).  
4. [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) — implementation contract; §3.3 path catalog; §10A guide rules.  
5. [docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md](./docs/audits/BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md) — folio-by-folio shipped vs gaps.  
6. [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) — sequencing to Stripe, email, Pro AI.  
7. [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) — UI copy and validation.  
8. [PDF_GENERATION.md](./PDF_GENERATION.md) — local CLI vs API generate.  
9. [docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md](./docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md) — folio 05 in-context CTA shells (when working on Examples).

Research and backlog audits: [docs/README.md](./docs/README.md).

---

## Relationship to the marketing site

Visual and tone alignment with Brand Alchemy; tokens synced per [README.md](./README.md) brand alignment section. No runtime dependency on the marketing repo — separate deploy and secrets.
