# How PDF generation works (today)

Plain-language notes for anyone reviewing the repo or planning production.

**Overview:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) · **Pipeline detail:** [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md)

## Is this using an API?

**Yes for dev generate.** `apps/api` exposes:

- **`POST /generate/core`** — body `{ form: IdentityKitForm }`; renders **five** PDFs and returns download URLs under `tmp/generated-kits/<sessionId>/`.
- **`GET /generated/:sessionId/:fileName`** — download a written file.

The web payment screen calls this today (**Generate Core PDFs**). Stripe checkout and post-payment fulfillment are still planned ([PHASE_ROADMAP.md](./PHASE_ROADMAP.md)).

**Also available locally:**

- `npm run test:generation` — automated checks in Node.
- `npm run generate:pdfs` — CLI that writes **five** PDFs under `packages/generation/output/<persona>/` (gitignored). Example: `npm run generate:pdfs -- established-pro`.

Persona JSON: `packages/generation/src/fixtures/personas/`. See `npm run generate:pdfs -- --help`.

Use **`npm run dev:api:built`** when the web app hits a stale API after generation package changes.

## Is this only for testing?

**Split answer:**

- **`npm run generate:pdfs`** is a **developer convenience**: real renderer on fixture JSON for Preview.
- **`renderCoreKitPdfs(form)`** and **`renderBrandIdentityGuidePdf(form)`** are **production-shaped** library entry points (not mocks).

## What software builds the PDFs?

**`@react-pdf/renderer`** — React-style components → **`renderToBuffer`** in Node. No external PDF SaaS for Core.

## Where does the content come from?

For **Core** today:

1. Intake shape: `IdentityKitForm` (fixtures or live wizard).
2. **`migrateIdentityKitForm`** — schema backfill (`@identity-kit/shared`).
3. **Legacy four PDFs:** `coreAssembly.ts` → `renderCoreKitPdfs()` → Brief, Style Guide, Voice Playbook, Quick Start.
4. **Brand Identity Guide:** `buildBrandIdentityGuideModel()` → `renderBrandIdentityGuidePdf()` → `05-brand-identity-guide.pdf` (6 landscape pages).
5. Layout: `packages/generation/src/pdf/CoreKitDocuments.tsx`.

Path classes: [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) **§3.3–3.3.1**. Guide rules: **§10A**.

**Pro** (AI sections, Content Starter Pack PDF) is **not** implemented in generation yet.

## Limits and practical constraints

| Topic | Today |
|--------|--------|
| **External PDF API** | None — local/server `@react-pdf/renderer`. |
| **Anthropic / Claude** | Not in Core PDF generation yet. |
| **Page size** | US Letter; Brand Identity Guide uses **landscape** media box. |
| **Fonts** | Registered via `registerCoreKitPdfFonts()` — Inter, Source Serif 4, and recipe-driven Google faces (`@fontsource/*` WOFF). Not built-in Helvetica-only. |
| **Concurrency** | Dev generates a handful of PDFs per request; production needs queues/timeouts later. |

## Brand symbol strip (Slides, PDF headers, etc.)

See **`packages/brand-assets/README.md`** — `npm run generate:brand-strip` after strip edits.

## Related docs

- [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) — Brand Identity Guide + legacy PDFs
- [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) — intake → sections
- [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) — Stripe, email
- [PRODUCT.md](./PRODUCT.md) — tiers and DoD
