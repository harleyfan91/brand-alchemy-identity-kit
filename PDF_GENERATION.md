# How PDF generation works (today)

Plain-language notes for anyone reviewing the repo or planning production.

## Is this using an API?

**Not yet for PDFs.** Right now, PDFs are built **on your computer** when you run:

- `npm run test:generation` — runs automated checks in Node.
- `npm run generate:pdfs` — writes four PDF files into `packages/generation/output/` (that folder is gitignored).

There is **no HTTP endpoint** in `apps/api` that creates PDFs yet. The **future** plan (see `PHASE_ROADMAP.md`) is: after checkout, your **backend** will run the same kind of generation code (or call a worker), then attach the files to email. Today’s code is the **first version** of that generator, developed and tested **without** Stripe or a public API.

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

## Related docs

- **What each PDF should contain:** `DELIVERABLE_PRODUCTION_SPEC.md`
- **How intake maps to sections (Core vs Pro):** `OUTPUT_TRANSLATION_SPEC.md`
- **Why multiple PDF files vs one big file:** `DELIVERABLE_PRODUCTION_SPEC.md` — “Delivery bundle format”
- **When API, Stripe, and email plug in:** `PHASE_ROADMAP.md`
- **Original product note on PDF stack:** `IDENTITY_KIT_PRD.md` (PDF / `@react-pdf/renderer`)
