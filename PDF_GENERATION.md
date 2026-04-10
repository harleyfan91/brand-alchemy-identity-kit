# How PDF generation works (today)

Plain-language notes for anyone reviewing the repo or planning production.

## Is this using an API?

**Not yet for PDFs.** Right now, PDFs are built **on your computer** when you run:

- `npm run test:generation` — runs automated checks in Node.
- `npm run generate:pdfs` — local **CLI** that writes four PDF files under `packages/generation/output/<persona>/` (gitignored). Optional persona: `npm run generate:pdfs -- coffee-founder` (see `npm run generate:pdfs -- --help`). Persona JSON lives in `packages/generation/src/fixtures/personas/`.

There is **no HTTP endpoint** in `apps/api` that creates PDFs yet. The **future** plan (see `PHASE_ROADMAP.md`) is: after checkout, your **backend** will run the same kind of generation code (or call a worker), then attach the files to email. Today’s code is the **first version** of that generator, developed and tested **without** Stripe or a public API.

## Is this only for testing?

**Split answer:**

- **`npm run generate:pdfs`** is a **developer convenience**: it runs the real renderer on **fixture JSON** and drops files on disk so you can open them in Preview. It is **not** what customers hit in production.
- **`renderCoreKitPdfs(form)`** (same layout + deterministic copy) **is** what we intend to call from the **backend or worker** after checkout, passing each customer’s `IdentityKitForm`.

So: the **CLI is dev/QA**; the **library entry point is production-shaped**—not a separate mock pipeline.

## Should we refine the look and layout now or wait for an API?

**Refining the PDFs is independent of the API.** Adding Stripe or an HTTP endpoint only changes **when and where** the code runs (after payment, on your backend). It does **not** replace the PDF layout code. So:

- **Worth doing now:** Typography, spacing, headings, brand colors (where supported), section structure, and anything that matches `DELIVERABLE_PRODUCTION_SPEC.md`—because you’ll keep iterating on the same files (`CoreKitDocuments.tsx`, styles, and later shared branding).
- **Reasonable to defer:** Final logo embeds, custom licensed fonts, or heavy illustration work—still done in the same stack later; no need to wait on an API for those either.

**Practical order:** get **content and section structure** right first (aligned with the specs), then **visual polish** so what customers receive feels on-brand. Neither step is blocked by having a PDF API.

## What software builds the PDFs?

We use the open-source library **`@react-pdf/renderer`**. It lets us describe each document with **React-style components** (pages, text, layout) and then **render to a PDF file in memory** in Node. The important entry point in our code is **`renderToBuffer`** (it returns a real PDF byte buffer). We do **not** call an external “PDF SaaS” API for the Core path.

## Where does the content come from?

For **Core** today:

1. A **sample survey** is stored as JSON: `packages/generation/src/fixtures/core-sample.json` (same data shape as the real app: `IdentityKitForm`).
2. **Deterministic templates** in `packages/generation/src/deterministic/coreAssembly.ts` turn those answers into section headings and paragraphs.
3. **PDF layout** lives in `packages/generation/src/pdf/CoreKitDocuments.tsx` (one small document per deliverable).
4. **`renderCoreKitPdfs()`** in `packages/generation/src/pdf/renderCoreKitPdfs.tsx` produces **four separate PDFs** (Brand Brief, Style Guide, Voice & Content Playbook, 30-Day Quick Start).

**Pro** (AI-assisted sections, fifth “Content Starter Pack” PDF) is **not** implemented in this package yet—that comes next per `OUTPUT_TRANSLATION_SPEC.md` and `PHASE_ROADMAP.md`.

## Limits and practical constraints

| Topic | Today |
|--------|--------|
| **External API / rate limits** | None for Core PDFs—everything runs locally with `@react-pdf/renderer`. |
| **Anthropic / Claude** | Not involved in Core PDF generation yet. |
| **Page size** | US Letter (set in the PDF components). |
| **How big / how complex** | Very large documents or huge images could make generation slower or use more memory; our v1 kits are intentionally short (see `DELIVERABLE_PRODUCTION_SPEC.md`). |
| **Fonts** | We use built-in PDF fonts (e.g. Helvetica) unless we later register custom fonts in code. |
| **Concurrency** | The CLI and tests generate a handful of PDFs per run; production will need sensible **queues/timeouts** when many orders run at once (not specified in code yet). |

## Brand symbol strip (Slides, PDF headers, etc.)

The horizontal symbol row is defined in **`packages/brand-assets`**: one TypeScript source for **order** (`symbolStrip.ts`), a **generated** vector file **`alchemy-symbol-strip.svg`**, and a **`alchemy-symbol-strip.png`** (same graphic, for Slides and tools without SVG). Regenerate both after edits: `npm run generate:brand-strip`. See **`packages/brand-assets/README.md`**.

## Related docs

- **What each PDF should contain:** `DELIVERABLE_PRODUCTION_SPEC.md`
- **How intake maps to sections (Core vs Pro):** `OUTPUT_TRANSLATION_SPEC.md`
- **Why multiple PDF files vs one big file:** `DELIVERABLE_PRODUCTION_SPEC.md` — “Delivery bundle format”
- **When API, Stripe, and email plug in:** `PHASE_ROADMAP.md`
- **Product context:** `PRODUCT.md` (deliverables, tiers); stack detail in this file and `OPERATIONS.md`.
