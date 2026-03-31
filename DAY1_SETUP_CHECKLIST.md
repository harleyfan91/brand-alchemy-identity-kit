# Identity Kit Day 1 Setup Checklist

Use this checklist in order. Do not skip ahead; each step unlocks the next.

## 0) Prep

- [ ] Confirm repo has `apps/web` and `apps/api` structure.
- [ ] Confirm you have admin access to:
  - Cloudflare zone for `brandalchemyllc.com`
  - Render account
  - Supabase project
  - Stripe account
  - Resend account
- [ ] Create a secure place to store secrets (password manager/vault).

## 1) Supabase (Database First)

- [ ] Create or choose Supabase project for Identity Kit.
- [ ] Copy Postgres connection string (`DATABASE_URL`) for server usage.
- [ ] Create initial core tables (minimum):
  - `sessions`
  - `orders`
  - `outputs`
  - `events` (optional but recommended for audit logs)
- [ ] Add indexes for:
  - `session_id`
  - `order_id`
  - `payment_status`
  - `fulfillment_status`
- [ ] Test DB connection locally from `apps/api`.

Verification:

- [ ] API can connect to DB and run a basic read/write health check.

## 2) Render (API Deploy)

- [ ] Create new Web Service on Render from repo.
- [ ] Set root/service path to `apps/api` (or configure build command accordingly).
- [ ] Configure build/start commands for Node TypeScript service.
- [ ] Add env vars now (minimum to boot):
  - `DATABASE_URL`
  - `SESSION_SECRET`
  - `NODE_ENV=production`
- [ ] Deploy initial API build.
- [ ] Confirm health endpoint returns 200.

Verification:

- [ ] Public API URL responds at `/health` with expected payload/status.

## 3) Cloudflare Pages (Web Deploy)

- [ ] Create Cloudflare Pages project from same repo.
- [ ] Set project root to `apps/web`.
- [ ] Configure build output for Vite (typically `dist`).
- [ ] Set env var:
  - `VITE_API_BASE_URL` to your Render API URL for first pass
- [ ] Deploy and verify web app loads.

Verification:

- [ ] Frontend loads and can call API health endpoint successfully.

## 4) Custom Domains + DNS

- [ ] In Cloudflare Pages, add custom domain:
  - `kit.brandalchemyllc.com`
- [ ] Add/verify CNAME DNS for `kit` as instructed by Pages.
- [ ] In Render, add custom domain:
  - `api.kit.brandalchemyllc.com`
- [ ] Add CNAME DNS for `api.kit` to Render service domain.
- [ ] Wait for SSL issuance on both domains.

Verification:

- [ ] `https://kit.brandalchemyllc.com` loads successfully.
- [ ] `https://api.kit.brandalchemyllc.com/health` returns 200.

## 5) Update Production URLs

- [ ] Update Cloudflare Pages env:
  - `VITE_API_BASE_URL=https://api.kit.brandalchemyllc.com`
- [ ] Update Render env:
  - `WEB_APP_URL=https://kit.brandalchemyllc.com`
  - `API_BASE_URL=https://api.kit.brandalchemyllc.com`
- [ ] Redeploy both services.

Verification:

- [ ] CORS and origin checks pass between final domains.

## 6) Stripe (Test Mode)

- [ ] Create product/prices:
  - Core ($49)
  - Pro ($99)
- [ ] Add Stripe env vars to Render:
  - `STRIPE_PUBLIC_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_STANDARD`
  - `STRIPE_PRICE_PRO`
- [ ] Implement/enable checkout session creation endpoint.
- [ ] Create Stripe webhook endpoint:
  - `https://api.kit.brandalchemyllc.com/<webhook-route>`
- [ ] Subscribe to:
  - `checkout.session.completed`
  - `checkout.session.expired` (recommended)
  - `payment_intent.payment_failed` (recommended)
- [ ] Add `STRIPE_WEBHOOK_SECRET` in Render.

Verification:

- [ ] Test checkout redirects correctly and returns to app.
- [ ] Webhook logs show valid signature verification.
- [ ] Paid test event marks order as `paid`.

## 7) Resend (Email Delivery)

- [ ] Verify sender domain or sender address in Resend.
- [ ] Add env vars to Render:
  - `RESEND_API_KEY`
  - `EMAIL_FROM=kit@brandalchemyllc.com` (or verified sender)
- [ ] Implement/enable send endpoint for delivery flow.

Verification:

- [ ] Test email received successfully from production-like environment.
- [ ] Bounce/error states are logged with `orderId`.

## 8) Fulfillment Pipeline Wiring

- [ ] Ensure webhook success triggers fulfillment exactly once.
- [ ] Core path:
  - deterministic content generation
  - output persistence
- [ ] Pro path:
  - AI generation with retries/backoff/timeout
  - fallback to deterministic templates on failure
- [ ] Generate all 4 PDFs via `@react-pdf/renderer`.
- [ ] Send final email with 4 attachments.

Verification:

- [ ] Core test order: payment to delivery under target (<2 min).
- [ ] Pro test order: payment to delivery under target (<5 min).
- [ ] Duplicate webhook event does not duplicate fulfillment.

## 9) Basic Observability (Must-Have Before Live)

- [ ] Log lifecycle events with `sessionId` and `orderId`:
  - checkout created
  - payment succeeded/failed
  - fulfillment started/completed/failed
  - email sent/failed
- [ ] Add structured error logging for AI, PDF, email, and webhook failures.
- [ ] Create a quick dashboard or saved queries for failed orders.

Verification:

- [ ] You can trace one order end-to-end from logs alone.

## 10) Go-Live Readiness Gate

- [ ] iOS Safari + Chrome mobile + desktop smoke tested.
- [ ] Stripe live keys configured and verified.
- [ ] Webhook idempotency confirmed in live-like test.
- [ ] AI fallback path manually tested.
- [ ] PDF attachment integrity verified for all 4 docs.
- [ ] Email delivery confirmed at real inbox providers.
- [ ] Legal/privacy + refund/cancellation copy approved and published.

## Day 1 Exit Criteria

Day 1 is successful when:

- Web and API are deployed on final subdomains
- DB is connected
- Stripe test checkout + webhook works
- A test order can move through payment and into fulfillment state transitions

