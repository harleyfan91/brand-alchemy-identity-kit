# Identity Kit — operations and deployment

Single runbook for **recommended stack**, **domains/DNS**, **environment variables**, **Stripe webhooks**, and **ordered bootstrap**. For **development sequencing** (when to add Stripe vs PDF tests), use [PHASE_ROADMAP.md](./PHASE_ROADMAP.md).

---

## Recommended stack

| Layer | Choice |
|-------|--------|
| Frontend | Cloudflare Pages — project root `apps/web` |
| API | Render Web Service — service root `apps/api` |
| Database | Supabase (Postgres) |
| Payments | Stripe Checkout + webhooks |
| Email | Resend |
| DNS | Existing zone `brandalchemyllc.com` |

**Rationale:** Low setup complexity for a first launch, webhook-friendly API host, fast static edge for the UI, clean split between marketing site and fulfillment product.

---

## Domains and URLs

| Surface | URL |
|---------|-----|
| Marketing site | `https://brandalchemyllc.com` |
| Kit frontend | `https://kit.brandalchemyllc.com` |
| Kit API | `https://api.kit.brandalchemyllc.com` |

No new apex domain required.

---

## DNS (Cloudflare)

1. **`kit.brandalchemyllc.com`**  
   - Type: `CNAME` → Cloudflare Pages hostname (e.g. `project.pages.dev`)  
   - Proxy: enabled (orange cloud) unless Pages docs say otherwise.

2. **`api.kit.brandalchemyllc.com`**  
   - Type: `CNAME` → Render service hostname (e.g. `identity-kit-api.onrender.com`)  
   - Proxy: **DNS only** initially for easier webhook debugging; revisit after stable.

Ensure SSL/TLS mode supports HTTPS end-to-end (typically Full/Strict).

---

## Environment variables

**Frontend (`apps/web`, Cloudflare Pages)**

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `https://api.kit.brandalchemyllc.com` |

**Backend (`apps/api`, Render)**

| Variable | Purpose |
|----------|---------|
| `WEB_APP_URL` | `https://kit.brandalchemyllc.com` |
| `API_BASE_URL` | `https://api.kit.brandalchemyllc.com` |
| `DATABASE_URL` | Supabase pooled Postgres connection string |
| `SESSION_SECRET` | Session signing |
| `NODE_ENV` | `production` |
| `ANTHROPIC_API_KEY` | Pro AI (server only) |
| `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` | Checkout |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `STRIPE_PRICE_STANDARD` / `STRIPE_PRICE_PRO` | Price IDs for Core / Pro |
| `RESEND_API_KEY` | Transactional email |
| `EMAIL_FROM` | e.g. `kit@brandalchemyllc.com` |

Copy from `.env.example` when present; never commit secrets.

---

## Stripe webhooks

- Endpoint: `https://api.kit.brandalchemyllc.com/<your-webhook-route>`  
- Subscribe at minimum to `checkout.session.completed` (plus `checkout.session.expired`, `payment_intent.payment_failed` as useful).  
- Store signing secret in `STRIPE_WEBHOOK_SECRET`.

**Reliability:** verify signature on every event; idempotency by event ID + order ID; log with `sessionId` / `orderId`.

---

## Core vs Pro generation placement

**Recommendation:** run **both** Core and Pro generation **server-side** in the fulfillment pipeline for operational parity, logging, retries, and auditability. Align implementation with [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) stage 1–3 before hard-wiring checkout.

---

## Ordered setup checklist

Use in order; each block has a short verification.

### 0) Prep

- [ ] Repo contains `apps/web` and `apps/api`.
- [ ] Admin access: Cloudflare zone, Render, Supabase, Stripe, Resend.
- [ ] Secrets stored in a vault/password manager.

### 1) Supabase

- [ ] Create or select Supabase project.
- [ ] Copy `DATABASE_URL` for the API.
- [ ] Create tables (minimum): `sessions`, `orders`, `outputs`; optional `events` for audit.
- [ ] Indexes on `session_id`, `order_id`, `payment_status`, `fulfillment_status`.
- [ ] Verify API can read/write from local or staging.

### 2) Render (API)

- [ ] New Web Service from repo; root `apps/api`; build/start for Node + TypeScript.
- [ ] Env: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`.
- [ ] Deploy; `GET /health` returns 200 on public URL.

### 3) Cloudflare Pages (web)

- [ ] Project from repo; root `apps/web`; Vite `dist` output.
- [ ] `VITE_API_BASE_URL` → Render API URL for first pass.
- [ ] Deploy; app loads.

### 4) Custom domains + DNS

- [ ] Pages: custom domain `kit.brandalchemyllc.com` + DNS per Pages instructions.
- [ ] Render: custom domain `api.kit.brandalchemyllc.com` + CNAME to service.
- [ ] Wait for SSL; `https://kit.brandalchemyllc.com` loads; `https://api.kit.brandalchemyllc.com/health` returns 200.

### 5) Production URLs on both services

- [ ] Pages: `VITE_API_BASE_URL=https://api.kit.brandalchemyllc.com`
- [ ] Render: `WEB_APP_URL`, `API_BASE_URL` set to final kit/API URLs.
- [ ] Redeploy both; CORS/origin checks pass.

### 6) Stripe (test mode)

- [ ] Products/prices: Core ($79), Pro ($149).
- [ ] Stripe env vars on Render (keys + price IDs).
- [ ] Checkout session endpoint implemented.
- [ ] Webhook endpoint + `STRIPE_WEBHOOK_SECRET`; test payment marks order paid; duplicate events do not double-fulfill.

### 7) Resend

- [ ] Verified sender/domain.
- [ ] `RESEND_API_KEY`, `EMAIL_FROM` on Render.
- [ ] Test send; log failures with `orderId`.

### 8) Fulfillment pipeline

- [ ] Webhook triggers fulfillment **once** (idempotent).
- [ ] Core: deterministic generation + persist artifacts.
- [ ] Pro: AI with retries/backoff/timeout + deterministic fallback.
- [ ] PDFs: one file per deliverable — **4** PDFs Core, **5** Pro (see [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md)).
- [ ] Email includes all attachments for the purchased tier.

### 9) Observability

- [ ] Log: checkout created, payment result, fulfillment start/complete/fail, email sent/fail — correlated by `sessionId` / `orderId`.
- [ ] Structured errors for AI, PDF, email, webhooks; simple dashboard or saved queries for failures.

### 10) Go-live gate

- [ ] Mobile + desktop smoke (iOS Safari, Chrome).
- [ ] Stripe live keys; webhook idempotency in live-like test.
- [ ] AI fallback tested (Pro).
- [ ] PDF attachment integrity for all tier-appropriate documents.
- [ ] Legal/privacy + refund/cancellation copy approved and live.

**Day 1 exit (minimal):** kit + API on final subdomains, DB connected, Stripe **test** checkout + webhook moves order to paid state.

---

## Launch order (minimal risk summary)

1. API on Render with health only.  
2. Supabase connected.  
3. Stripe test products + checkout + webhook verified.  
4. Frontend on Pages with API URL.  
5. End-to-end test purchase (test card).  
6. Resend wired; test delivery with attachments.  
7. Production keys; repeat smoke tests.

---

## Decision log

| Topic | Decision |
|-------|----------|
| Web host | Cloudflare Pages |
| API host | Render |
| Database | Supabase |
| Domains | `kit` + `api.kit` under `brandalchemyllc.com` |
| Core generation | Server-side (recommended) |
| Legal / refund copy | Complete before calling launch “done” — track in [PRODUCT.md](./PRODUCT.md) open decisions |
