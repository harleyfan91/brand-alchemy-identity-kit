# Phase roadmap — UI complete → operational

This is the **sequenced execution outline** from the current Phase 1 UI through a **production-ready** Identity Kit. It ties together existing specs; it does not replace them.

**Authoritative sources**

| Topic | Document |
|----------|----------|
| Project overview, shipped vs target PDFs | `PROJECT_OVERVIEW.md` |
| Inputs → outputs pipeline | `GENERATION_PIPELINE.md` |
| Product scope, DoD, metrics, open research | `PRODUCT.md` |
| Per-PDF content and bundle format | `DELIVERABLE_PRODUCTION_SPEC.md` |
| Intake → sections, Core vs Pro generation | `OUTPUT_TRANSLATION_SPEC.md` (Path Class Catalog + recipes: **§3.3–3.3.1** — update when Core routing changes) |
| Infra, DNS, env, ordered setup | `OPERATIONS.md` |
| Screen behavior | `SCREEN_COPY_MAP.md` |

---

## Where we are

> **Pro phase status (Pro-0 → Pro-I) lives in [`docs/audits/PRO_KIT_STRATEGY.md`](docs/audits/PRO_KIT_STRATEGY.md) §11.** That table is the canonical tracker for Pro implementation phases (status column + deferred sub-tasks callout). The Stage 1-7 framing below predates the Pro phase split and is retained for the wider Phase-1-to-production view.

**Phase 1 (done):** `apps/web` — micro-step intake, validation, review, tier-aware copy; payment screen triggers **dev PDF generate** via API.

**Stage 1 (partial):** `packages/generation` — five Core PDFs including **Brand Identity Guide** (6 pages); `npm run test:generation`; `POST /generate/core`; CLI `npm run generate:pdfs`.

**Not done yet:** Live Stripe, DB persistence, Pro AI / Content Starter Pack PDF, transactional email, production fulfillment.

**Exit criteria for full production:** `PRODUCT.md` Definition of Done (not Phase 1 UX completeness alone).

---

## Recommended implementation order (development)

**Payments and checkout are intentionally last** among product-critical work. Build and **validate PDF output in tests** before Stripe, webhooks, or production email.

| Stage | What | Outcome |
|--------|------|--------|
| **1 — Core deterministic + PDFs** | **`packages/generation`**: `renderCoreKitPdfs()` (four legacy PDFs) + `renderBrandIdentityGuidePdf()` (primary guide). **Commands:** `npm run test:generation`, `npm run generate:pdfs` (five files under `packages/generation/output/<persona>/`), `POST /generate/core`. | Repeatable Core PDFs; failing tests block merges. Guide + legacy overlap until packaging cut. |
| **2 — Pro + Claude** | Same pipeline: hybrid rules + Anthropic for Pro-only / `ai_enhanced` sections (**server-side only**). Tests: **mock** Claude in unit tests; optional **integration** test behind `ANTHROPIC_API_KEY` when you want real calls. **Five** PDFs for Pro including Content Starter Pack. | Pro path verified without touching payments. |
| **3 — Gate** | Manual review of fixture PDFs; green test suite. **Pause** here before payment work. | Confidence that the product is the PDFs, not the checkout. |
| **4 — Foundation (persistence)** | Database, API shell, store intake snapshot + generated artifact references (`2A` below). | Orders can be recorded; still no Stripe required for local PDF runs. |
| **5 — Payments** | Stripe Checkout + webhooks (`2B`). | Money path works in test mode. |
| **6 — Email + web wiring** | Resend, replace UI placeholders, processing state (`2D`, `2E`). | End-to-end customer path. |
| **7 — Pro image pipeline + ops** | Upload storage, color extraction, analytics, compliance (`2F`, `2G`). | Full launch readiness. |

**Rule of thumb:** If it does not yet need a card, **do not** add Stripe. Core PDFs and Claude can live entirely in a **worker package + `npm test`** until you deliberately wire the paid flow.

---

## Phase 2 — Production building blocks (reference)

The sections below describe **capabilities**, not the order above. Use the **Recommended implementation order** table for sequencing.

### 2A — Foundation

- **Database:** Orders, sessions, fulfillment status, stored intake snapshot (JSON), optional `events` audit table (see `OPERATIONS.md` §1 Supabase).
- **API:** `apps/api` — health route, env validation, DB connection, structured logging.
- **Contracts:** `IdentityKitForm` + order metadata as the persisted payload; version field if schema evolves.
- **Web:** `VITE_API_BASE_URL` — health check from client (optional smoke).

**Done when:** API deploys, DB migrates, and a test order row round-trips.

### 2B — Payments

- **Stripe:** Checkout Session for Core vs Pro price IDs; success/cancel URLs; **webhook** for `checkout.session.completed` (and related events).
- **Idempotency:** Webhook handler safe under retries; order idempotent key.
- **State:** `paymentStatus` / `fulfillmentStatus` transitions defined in code.

**Done when:** Test mode: full path from UI → Stripe → webhook → DB shows `paid`.

### 2C — Generation + PDF

- **Core:** Deterministic template assembly per `OUTPUT_TRANSLATION_SPEC.md` (scaffolds, anchors).
- **Pro:** Hybrid model — **same** scaffolds where specified; `ai_enhanced` / `ai_only` sections per matrix; Anthropic **server-side only**.
- **PDF:** `@react-pdf/renderer` (or chosen stack), **one PDF file per deliverable** (`DELIVERABLE_PRODUCTION_SPEC.md` — Delivery bundle format).
- **Artifacts:** Store PDF buffers or object storage keys on `orders` / `outputs`.

**Done when:** Given a fixture intake JSON, worker produces all PDFs for the tier (**five** for Core today: guide + Quick Start + three interim legacy; **six** for Pro when Content Starter Pack ships).

### 2D — Email + delivery

- **Resend:** Transactional send with **all** PDF attachments; subject/body from `SCREEN_COPY_MAP` and product patterns in `PRODUCT.md` (security / reliability).
- **Failure handling:** Retry policy; dead-letter or manual queue; user-safe error state (`PRODUCT.md` graceful fallback requirements).

**Done when:** Test order receives email with correct attachment count and names.

### 2E — Web app integration

- Replace **Payment** placeholder with Checkout redirect or embedded flow.
- **Processing:** Poll or short-interval status until fulfillment ready (or optimistic + email).
- **Edit:** Load persisted post-generation drafts; **add fifth field for Pro** Content Starter Pack when pipeline exists (see `README.md` Phase 2 wiring).
- **Confirm:** Already tier-aware for PDF count; wire to real completion.

**Done when:** Happy path works end-to-end in staging without dev tools.

### Intake roadmap — operating model + Pro service radius (with 2E / web)

Not a separate phase gate; ships through the web app when schema work lands. **Not blocking** Core deterministic PDFs.

- **Operating model (business presence):** Required enum on Business Basics (`c1_s2`) — how customers meet the business vs online-only, etc. See [`docs/research/BUSINESS_OPERATING_MODEL_RESEARCH.md`](docs/research/BUSINESS_OPERATING_MODEL_RESEARCH.md). Shared Core + Pro; drives deterministic cluster and copy refactors in `brandProfile.ts` / `coreAssembly.ts`.
- **Pro — service radius / service area (follow-on):** When operating model implies **travel to customers** (or equivalent), Pro intake may add an optional **service radius** or structured service-area capture (miles/km, regions, or “serves X area”) for richer local SEO, directory completeness, and map-adjacent copy. Core can omit in v1 or use free text later. Spec in `OUTPUT_TRANSLATION_SPEC.md` when implemented; does not replace the single operating-model enum.

### 2F — Pro image pipeline (can follow 2C or parallelize)

- **Upload:** Store file (S3/Supabase) from Step 6; **reference Camentra patterns** for analysis API (historical PRD note — patterns in external repo when implementing).
- **Color extraction:** Feed extracted palette into Style Guide / generation context; fall back to selected palette if analysis fails.

**Done when:** Pro order with upload uses extracted colors in outputs or logs explicit fallback.

### Camentra free trial (post-purchase email — not kit content)

Every purchaser (Core and Pro) receives a free Camentra trial delivered via the post-purchase fulfillment email. This is a value-add companion to the kit, not a pitch inside the PDFs.

- **Kit content scope:** Style Guide and any narrator-conditioned visual guidance should give aesthetic direction only (mood, backdrop style, palette application). Photography how-to is out of scope for kit outputs.
- **Email trigger:** Include Camentra trial link + short context line in the fulfillment email alongside the kit download. Copy should frame it as a companion tool, not upsell language.
- **Implementation:** Wire trial link into email template during block 2D (email delivery). No changes to PDF generation pipeline required.

### 2G — Observability, analytics, compliance

- **Analytics:** Events per `PRODUCT.md` (Analytics requirements) — no PII.
- **Ops:** Logs correlated by `order_id` / `session_id`; health checks for deploy.
- **Legal:** Privacy/consent copy for intake + email; refund/cancellation UX (`PRODUCT.md` — Research and open decisions).

**Done when:** You can answer “what failed for order X?” from logs alone.

---

## Quality / polish backlog

PDF layout and output-quality work to schedule after the core pipeline is stable (migrated from historical refactor tracking).

### PDF skim / layout (Style Guide)

- [ ] **Palette (and adjacent Style Guide blocks)** — Tighten scanability: stronger grouping (e.g. role labels or short subheads for Primary / Supporting / Accent), shorter chunks, checklist-style lines where helpful. Goal: “what do I do with these colors?” in seconds.
- [ ] **Visual direction (+ Typography where dense)** — Clarify the job of the section (imagery, logo note, voice ↔ visual bridge); reduce uninterrupted walls of body text where subheads or bullets help.
- [ ] Spot-check regenerated PDFs (2–3 representative forms) after layout/copy tweaks.

### Output value audit (Core + Pro)

- [ ] **Align product promise with shipped reality** — Until Pro generation exists, buyer-facing copy should not overstate Core vs Pro PDF differences beyond the Content Starter Pack promise and documented direction.
- [ ] **Fix intake → generation mismatches** before deeper copy tuning (e.g. fixtures vs true-Core payloads; value IDs in UI vs generation).
- [ ] **Raise the consultative floor** in weaker Brief blocks — Ideal customer, Differentiation, Brand story angle should add judgment, not only reformatted intake.
- [ ] **Re-run the audit** on true-Core fixtures and, later, shipped Pro outputs.

### Wizard navigation (browser Back + exit path)

- [ ] **Hash-sync for browser Back / Forward / refresh.** Add `useHistorySync` hook (~30 lines) that pushes `window.history.pushState({ microStepId })` on every step transition and mounts a `popstate` listener. Add `goToMicroStepById(id: string)` to `useFlowState` that looks up the step in `tierMicroSteps` and jumps to it. Handle the landing and review screens with `#landing` / `#review` sentinel entries. On page load, read `window.location.hash` — if it resolves to a known step, restore position; otherwise start fresh. Specification: [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) Global chrome navigation behavior.
- [ ] **Exit button (× in `StepShell` header).** Add `onExit?: () => void` prop to `StepShell`. Wire in `App.tsx`: when form data is empty navigate directly to landing; when data is present show a one-line confirm dialog. Copy: *"Your progress won't be saved. Leave anyway?"* with **Keep Working** (dismiss) and **Leave** (call `onExit`) actions. No progress is auto-saved in v1 (no DB persistence yet). Implementation touches: `StepShell.tsx`, `App.tsx`, `useFlowState.ts` (new `exitToLanding()` method).

These are UX-completeness items, not blocking for the Core PDF or Stripe gate.

---

## Launch gate

Use **`PRODUCT.md` — Definition of Done (production launch)** as the final checklist: mobile browsers, Stripe test+live, webhook idempotency, AI fallback, **all** PDFs for the tier (four Core, five Pro), email integrity, error/retry UX, basic observability.

---

## Optional later (not required for first operational)

- Per-section **regenerate** for Pro (post-pay).
- Customer **re-download** portal.
- Combined “single download” ZIP of all PDFs.

---

## Open decisions before heavy build

See **`PRODUCT.md` — Research and open decisions** (API host, legal/privacy, refund UX, optional Core server-side parity). Stack defaults and setup order: **`OPERATIONS.md`**.
