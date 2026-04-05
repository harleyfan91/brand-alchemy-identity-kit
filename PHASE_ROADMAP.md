# Phase roadmap — UI complete → operational

This is the **sequenced execution outline** from the current Phase 1 UI through a **production-ready** Identity Kit. It ties together existing specs; it does not replace them.

**Authoritative sources**

| Topic | Document |
|----------|----------|
| Product scope, integrations, DoD | `IDENTITY_KIT_PRD.md` |
| Per-PDF content and bundle format | `DELIVERABLE_PRODUCTION_SPEC.md` |
| Intake → sections, Core vs Pro generation | `OUTPUT_TRANSLATION_SPEC.md` |
| Infra, DNS, providers | `DAY1_SETUP_CHECKLIST.md`, `DEPLOYMENT_DECISION_MEMO.md` |
| Screen behavior | `SCREEN_COPY_MAP.md` |

---

## Where we are

**Phase 1 (done):** `apps/web` — full intake flow, validation, review teaser, tier-aware copy, placeholders for payment / processing / generation / email.

**Exit criteria:** Phase 1 matches §16 “Definition of Done” only for **UX and form completeness**; no live Stripe, DB, AI, PDF, or email.

---

## Recommended implementation order (development)

**Payments and checkout are intentionally last** among product-critical work. Build and **validate PDF output in tests** before Stripe, webhooks, or production email.

| Stage | What | Outcome |
|--------|------|--------|
| **1 — Core deterministic + PDFs** | Implemented in **`packages/generation`**: fixture `packages/generation/src/fixtures/core-sample.json`, `renderCoreKitPdfs()` using **`renderToBuffer`** from `@react-pdf/renderer`. **Commands:** `npm run test:generation`, `npm run generate:pdfs` (writes PDFs under `packages/generation/output/<persona>/`; optional persona after `--`). Extend deterministic builders in `src/deterministic/` as specs tighten. | Repeatable Core PDFs; failing tests block merges. |
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

- **Database:** Orders, sessions, fulfillment status, stored intake snapshot (JSON), optional `events` audit table (`DAY1_SETUP_CHECKLIST.md`).
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

**Done when:** Given a fixture intake JSON, worker produces **4** or **5** PDFs matching tier.

### 2D — Email + delivery

- **Resend:** Transactional send with **all** PDF attachments; subject/body from `SCREEN_COPY_MAP` / PRD patterns.
- **Failure handling:** Retry policy; dead-letter or manual queue; user-safe error state (PRD graceful fallback).

**Done when:** Test order receives email with correct attachment count and names.

### 2E — Web app integration

- Replace **Payment** placeholder with Checkout redirect or embedded flow.
- **Processing:** Poll or short-interval status until fulfillment ready (or optimistic + email).
- **Edit:** Load persisted post-generation drafts; **add fifth field for Pro** Content Starter Pack when pipeline exists (see `README.md` Phase 2 wiring).
- **Confirm:** Already tier-aware for PDF count; wire to real completion.

**Done when:** Happy path works end-to-end in staging without dev tools.

### 2F — Pro image pipeline (can follow 2C or parallelize)

- **Upload:** Store file (S3/Supabase) from Step 6; **reference Camentra patterns** for analysis API (PRD).
- **Color extraction:** Feed extracted palette into Style Guide / generation context; fall back to selected palette if analysis fails.

**Done when:** Pro order with upload uses extracted colors in outputs or logs explicit fallback.

### Camentra free trial (post-purchase email — not kit content)

Every purchaser (Core and Pro) receives a free Camentra trial delivered via the post-purchase fulfillment email. This is a value-add companion to the kit, not a pitch inside the PDFs.

- **Kit content scope:** Style Guide and any narrator-conditioned visual guidance should give aesthetic direction only (mood, backdrop style, palette application). Photography how-to is out of scope for kit outputs.
- **Email trigger:** Include Camentra trial link + short context line in the fulfillment email alongside the kit download. Copy should frame it as a companion tool, not upsell language.
- **Implementation:** Wire trial link into email template during block 2D (email delivery). No changes to PDF generation pipeline required.

### 2G — Observability, analytics, compliance

- **Analytics:** Events per PRD §14 (tier, step completion, review, payment, fulfillment) — no PII.
- **Ops:** Logs correlated by `order_id` / `session_id`; health checks for deploy.
- **Legal:** Privacy/consent copy for intake + email; refund/cancellation UX (PRD §19 open questions — resolve before launch).

**Done when:** You can answer “what failed for order X?” from logs alone.

---

## Launch gate

Use **`IDENTITY_KIT_PRD.md` §16 Definition of Done (Production)** as the final checklist: mobile browsers, Stripe test+live, webhook idempotency, AI fallback, **all** PDFs (including Pro fifth), email integrity, error/retry UX, basic observability.

---

## Optional later (not required for first operational)

- Per-section **regenerate** for Pro (post-pay).
- Customer **re-download** portal.
- Combined “single download” ZIP of all PDFs.

---

## Open decisions before heavy build

See **`IDENTITY_KIT_PRD.md` §19** (DB host, API host, Core vs server-side generation parity, legal copy).
