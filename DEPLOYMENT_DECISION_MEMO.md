# Identity Kit Deployment Decision Memo (v1)

## Recommended Stack (Start Here)

- Frontend: Cloudflare Pages (`apps/web`)
- Backend API: Render Web Service (`apps/api`)
- Database: Supabase (Postgres)
- Payments: Stripe Checkout + Stripe Webhooks
- Email: Resend
- DNS/Domain: Existing `brandalchemyllc.com` with subdomains

Why this stack:

- Low setup complexity for a first production launch
- Strong support for webhook-based backends (Render)
- Fast static hosting and global edge delivery (Cloudflare Pages)
- Clean separation between marketing site and paid fulfillment system

## Domain and URL Plan

Use your existing domain. No new domain purchase required.

- Marketing site: `https://brandalchemyllc.com`
- Identity Kit frontend: `https://kit.brandalchemyllc.com`
- Identity Kit API: `https://api.kit.brandalchemyllc.com`

## DNS Records (Cloudflare)

Create/update these DNS entries in Cloudflare:

1. `kit.brandalchemyllc.com`
   - Type: `CNAME`
   - Target: your Cloudflare Pages assigned domain (e.g., `project.pages.dev`)
   - Proxy: Enabled (orange cloud)

2. `api.kit.brandalchemyllc.com`
   - Type: `CNAME`
   - Target: your Render service domain (e.g., `identity-kit-api.onrender.com`)
   - Proxy: DNS only recommended initially for webhook troubleshooting clarity

Notes:

- If you later verify webhook stability, you can evaluate proxying API traffic.
- Ensure SSL/TLS mode in Cloudflare is set appropriately (typically Full/Strict).

## Environment Variable Map

Frontend (`apps/web`, Cloudflare Pages):

- `VITE_API_BASE_URL=https://api.kit.brandalchemyllc.com`

Backend (`apps/api`, Render):

- `WEB_APP_URL=https://kit.brandalchemyllc.com`
- `API_BASE_URL=https://api.kit.brandalchemyllc.com`
- `ANTHROPIC_API_KEY=...`
- `STRIPE_PUBLIC_KEY=...`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_WEBHOOK_SECRET=...`
- `STRIPE_PRICE_STANDARD=...`
- `STRIPE_PRICE_PRO=...`
- `RESEND_API_KEY=...`
- `EMAIL_FROM=kit@brandalchemyllc.com`
- `DATABASE_URL=...` (Supabase pooled connection string)
- `SESSION_SECRET=...`
- `NODE_ENV=production`

## Stripe Webhook Configuration

In Stripe dashboard:

- Create webhook endpoint pointing to:
  - `https://api.kit.brandalchemyllc.com/<your-webhook-route>`
- Subscribe to required events at minimum:
  - `checkout.session.completed`
  - `checkout.session.expired` (optional but useful)
  - `payment_intent.payment_failed` (optional for diagnostics)
- Copy webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

Webhook reliability checklist:

- Verify signature on every event
- Idempotency guard by event ID + order ID
- Log lifecycle events with `sessionId`/`orderId`

## Rendering/Processing Placement Decision

Core generation should run server-side (recommended), same as Pro fulfillment pipeline.

Benefits:

- Operational parity between Core and Pro paths
- Better logging, retries, and incident handling
- Deterministic output and auditability for paid orders

## Launch Order (Minimal Risk)

1. Deploy API to Render with health endpoint only.
2. Connect Supabase and verify DB connectivity.
3. Configure Stripe test mode products/prices and checkout session creation.
4. Configure Stripe webhook endpoint and verify signed event handling.
5. Deploy frontend to Cloudflare Pages with API URL wired.
6. Validate end-to-end test purchase (test card).
7. Add Resend and verify email send + attachment delivery.
8. Enable production keys and repeat smoke tests in live mode.

## Decision Log (Current)

- Hosting: Cloudflare Pages (web) + Render (api)
- Database: Supabase
- Domain: existing `brandalchemyllc.com` with `kit` and `api.kit` subdomains
- Core generation location: server-side
- Legal/privacy and refund/cancellation copy: research TODO before Phase 2 completion

