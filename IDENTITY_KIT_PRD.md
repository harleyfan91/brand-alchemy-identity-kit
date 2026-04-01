# Brand Alchemy Identity Kit (Microsite) — Product Requirements Document

**Version:** 2.1 (Phase 1 UI in repo; docs synced with `apps/web`)  
**Owner:** Brand Alchemy LLC  
**Status:** Phase 1 front-end implemented; Phase 2 integrations pending  
**Primary domain:** `kit.brandalchemyllc.com`  
**Parent marketing site:** `brandalchemyllc.com`  
**Reference repo for brand parity:** `https://github.com/harleyfan91/brand-alchemy-llc-landing-page.git`

---

## 1) Executive Summary

The Brand Alchemy Identity Kit is a standalone, mobile-first microsite that collects business inputs through a guided flow, processes those inputs into a polished brand kit, and delivers four PDF documents by email after payment.

This product **must be built as a separate project and repository** from the main Brand Alchemy landing page.

---

## 2) Why This Is a Separate Repo

This product has materially different requirements from the landing-page site:

- Payment processing (Stripe checkout + webhooks)
- Server-side AI calls (Anthropic)
- PDF generation and file handling
- Transactional email (Resend)
- Session persistence and fulfillment workflows
- Higher operational risk (order state, retries, error handling)

### Boundary Decision

**Decision:** New standalone repo, separate deployment pipeline.

**Rationale:**
- Keeps marketing-site stability high
- Isolates secrets and webhook handling
- Allows independent release cadence
- Improves incident response and observability

---

## 3) Relationship to Existing Landing-Page Repo

The existing landing-page repo remains the brand marketing site.  
The Identity Kit repo is a product app linked from marketing CTAs.

### Required Connection Strategy

- The Identity Kit should visually match the landing page design language.
- Reuse design tokens/components by **copying a minimal set first** (safe and fast).
- If reuse expands, create a shared package later (optional future monorepo/package extraction).

### Initial Reuse from Existing Repo

Use the current repo (`brand-alchemy-llc-landing-page`) as a **style reference**, not as runtime dependency.

Pull the following into the new microsite:
- Brand typography usage patterns
- Spacing rhythm, border radius, shadows
- CTA style (black pill buttons)
- Core brand mark (`AlchemyMark`) component behavior

---

## 4) Product Overview

The microsite guides users through a 7-step intake and produces four foundational documents:

1. **Brand Brief** (1 page)
2. **Brand Style Guide** (2 pages)
3. **Voice & Content Playbook** (2-3 pages)
4. **30-Day Quick Start Checklist** (1 page)

The **Pro Kit** additionally includes a fifth deliverable:

5. **Content Starter Pack** (applied messaging + content prompts)

### Commercial Tiers

| | Core Kit | Pro Kit |
|---|---|---|
| **Price** | $49 | $99 |
| **Positioning** | Guided starter kit built from proven templates | AI-personalized kit with deeper strategy/voice tailoring |
| **Generation model** | Deterministic template assembly from user inputs | AI-generated first drafts conditioned on intake profile |
| **Color approach** | Guided palette and style selection from predefined systems | Same base selection plus deeper personalization from notes/references (Phase 2) |
| **Copy approach** | Structured template copy shaped by inputs | AI-drafted copy tuned to audience, voice, and positioning |
| **Output set** | 4 PDFs by email | 5 PDFs by email (Core set + Content Starter Pack) |
| **Post-pay edit (Phase 1)** | Editable fields | Editable fields |
| **Post-pay edit (Phase 2 target)** | Editable fields | Editable + section regenerate controls |

### AI-powered differentiation (buyer-visible definition)

For this product, "AI-powered" should mean:

- Intake responses are converted into prompt context and voice constraints.
- Draft output wording, structure, and emphasis adapt to the business profile (instead of only slot-filling templates).
- Optional Pro detail fields improve specificity in audience pain points, story framing, and tone.
- AI enables **applied outputs** that would be weak in static templates, especially the **Content Starter Pack**.
- Post-pay editing remains available to the user as final control.

### Deliverables by tier (detailed)

#### Core Kit

- **Brand Brief**
  - format: branded PDF
  - target length: 1 page
  - presentation: editorial strategy snapshot with strong headings and short text blocks
  - table of contents:
    - business summary
    - audience snapshot
    - core transformation / promise
    - values / positioning direction
    - brand story angle
    - high-level differentiation
- **Brand Style Guide**
  - format: branded PDF
  - target length: 2 pages
  - presentation: visual-first guide with swatches, visual direction cues, and short guidance notes
  - table of contents:
    - chosen palette
    - style direction
    - style principles
    - visual do / avoid guidance
    - practical usage notes
- **Voice & Content Playbook**
  - format: branded PDF
  - target length: 2-3 pages
  - presentation: text-forward playbook with examples, phrase cues, and guardrails
  - table of contents:
    - tone profile
    - voice guardrails
    - messaging themes
    - sample messaging direction
    - writing do / avoid guidance
- **30-Day Quick Start Checklist**
  - format: branded PDF
  - target length: 1 page
  - presentation: skimmable checklist / rollout plan
  - table of contents:
    - week 1 foundational actions
    - week 2 messaging updates
    - week 3 visual rollout
    - week 4 consistency checks

#### Pro Kit

- Includes all **Core Kit** deliverables with deeper AI personalization.
- **Content Starter Pack**
  - format: branded PDF
  - target length: 2 pages
  - presentation: practical, copy-forward asset designed to be reused in real channels
  - table of contents:
    - one-liner / brand summary
    - homepage headline / subheadline directions
    - short brand bio / about intro
    - social bio options
    - caption / post starter hooks
    - content pillar ideas
    - starter prompt ideas for ongoing content creation
    - CTA language suggestions

### Why the Content Starter Pack is Pro-only

- It requires synthesis across multiple inputs rather than single-field slot filling.
- It depends on audience pain points, tone, story, and differentiation working together.
- It creates immediately usable content assets, which is a clearer customer value unlock than simply \"more polished\" foundational documents.

---

## 5) Core UX Principles

- Mobile-first at 375px baseline
- One primary question/action per step on mobile
- Friendly, plain-language prompts
- No jargon without explanation
- Visual parity with Brand Alchemy main site
- Consistent use of the beta alchemy symbol (header, dividers, watermark)

---

## 6) User Journey (End-to-End)

1. User arrives at `kit.brandalchemyllc.com`
2. Chooses Core or Pro tier
3. Completes Steps 1-7 intake flow
4. Reviews all inputs
5. Pays via Stripe Checkout
6. System generates kit outputs
   - Core: deterministic template assembly
   - Pro: AI generation pipeline (with fallback)
7. User can edit output fields on Edit screen
8. User clicks "Send My Kit"
9. PDFs generated and emailed
10. Confirmation screen shown

---

## 7) Functional Scope by Phase

## Phase 1 — UI Skeleton (No External Integrations)

Goal: complete front-end shell and flow behavior with placeholders/stubs.

Deliverables:
- App scaffold, design system, all screens, all copy
- Step router and progress indicator
- Full form state shape
- Visual validation and navigation guards
- Review, Payment placeholder, Edit placeholder, Confirm

Out of phase:
- Real AI calls
- Real Stripe checkout
- Real PDF generation
- Real email delivery

### Phase 1 — Current repo snapshot (`apps/web`)

The following is implemented today (see also **`SCREEN_COPY_MAP.md`** section A):

- **Flow state:** `Screen` union (`landing` → `step` → `review` → `payment` → `processing` → `edit` → `confirm`); steps 1–7 without URL routing.
- **Layout:** Shared **max-w-xl** column; **Brand Alchemy** wordmark in a **compact strip above** the card on landing and all steps; **progress bar** is the **first** element inside the white card on step screens (landing: hero first, no progress).
- **Form model:** `IdentityKitForm` with `sessionId`, `orderId`, `paymentStatus`, `fulfillmentStatus`, timestamps per PRD §10.
- **Step 3:** Tone presets, five **snapped** voice sliders (0/25/50/75/100), optional Pro notes; **LiveRailStrip** with sample sentence from `buildVoicePreview` and static **`i.e.`** prefix styling.
- **Steps 5–6:** **SwipeableOptionDeck** with horizontal swipe + vertical scroll compatibility.
- **Review:** Per-step summary labels; **Edit** returns to the matching step then back to review; voice summaries use slider snap semantics.
- **Navigation UX:** **Scroll to top** on screen or step index change.
- **Placeholders:** Payment, processing, edit outputs, and confirm use stub copy and buttons (no Stripe, no real generation or email).

### Survey-to-output alignment snapshot

| Step | Signal today | Main outputs informed | Known weakness |
|---|---|---|---|
| Step 1 | Business basics | Brand Brief baseline, Quick Start context | No explicit transformation/value proposition field |
| Step 2 | Buyer archetype (+ optional Pro pain/outcomes) | Brand Brief audience sections, Voice Playbook targeting | High-value details optional and mostly Pro-only |
| Step 3 | Presets + snapped sliders (+ optional Pro notes) | Voice Playbook tone and sample language | No explicit required tone selection action |
| Step 4 | 2-4 values (+ optional Pro mission) | Brand Brief principles/messaging guardrails | Mission quality signal can be skipped |
| Step 5 | Story archetype (+ optional Pro story details) | Brand Brief narrative/story sections | Story depth optional |
| Step 6 | Palette + style (+ optional Pro notes) | Style Guide visual direction | Fine-grain visual intent optional |
| Step 7 | Optional competitors (+ optional Pro differentiation) | Brand Brief differentiation, Quick Start strategic actions | Differentiation not required |

### Phase 1.5 content refinement goals (before integrations)

- Clarify Core vs Pro on every conversion surface (landing, review, payment, edit) with outcome language rather than feature-only language.
- Strengthen high-signal prompts for messaging quality (customer pain/outcomes, differentiation, transformation).
- Add helper examples to improve response specificity without increasing cognitive load.
- Revisit requiredness for quality-critical fields (especially Pro) to avoid low-signal AI outputs.

### Proposed field-policy adjustments (draft)

| Step | Current state | Proposed adjustment |
|---|---|---|
| Step 1 | Business basics required | Add required transformation/value proposition field |
| Step 2 | Archetype required; pain/outcomes optional Pro | Keep optional in Core; require at least one depth field in Pro |
| Step 3 | No validation gate | Require explicit preset selection or slider interaction |
| Step 4 | Values required; mission optional Pro | Keep mission optional but improve helper guidance |
| Step 5 | Archetype required; story detail optional Pro | Improve helper prompts for origin specifics |
| Step 6 | Palette/style required; notes optional Pro | Keep optional with clearer examples |
| Step 7 | Competitors optional; differentiation optional Pro | Keep competitors optional; require differentiation in Pro |

## Phase 2 — Production Functionality

Goal: ship complete paid workflow with fulfillment.

Deliverables:
- Local persistence/session management
- Core output generation logic
- Pro AI integration (server-side only)
- Stripe checkout + webhook-driven fulfillment
- PDF generation service
- Email delivery service
- Error handling + retries/fallback
- Basic analytics events

---

## 8) Technical Architecture

## Frontend
- React + TypeScript + Vite
- Tailwind CSS
- Single-page step flow (no URL routing required in v1)

## Backend
- Node.js API layer (Express or equivalent lightweight server)
- Secure server-side integrations:
  - Anthropic API
  - Stripe API + webhook endpoint
  - Resend API
- Persistent order/session state (recommended: Postgres via Supabase/Neon, or equivalent managed DB)

## Processing Pattern
- Payment success triggers fulfillment job
- Core path: synchronous deterministic generation
- Pro path: parallel AI jobs where safe
- Store generated outputs by order/session ID
- Edit screen polls for completion state (v1)

---

## 9) Required Folder Structure (New Repo)

```text
identity-kit/
├── apps/
│   ├── web/                         # React app (customer UI)
│   │   ├── public/
│   │   └── src/
│   │       ├── components/
│   │       │   ├── branding/
│   │       │   │   ├── BrandWordmark.tsx
│   │       │   │   ├── AlchemySymbolStrip.tsx
│   │       │   │   └── LiveRailStrip.tsx
│   │       │   ├── flow/
│   │       │   │   ├── ProgressBar.tsx
│   │       │   │   ├── StepShell.tsx
│   │       │   │   ├── TierSelector.tsx
│   │       │   │   ├── PaymentPlaceholder.tsx
│   │       │   │   └── ProcessingScreen.tsx
│   │       │   ├── steps/
│   │       │   │   ├── Step1Snapshot.tsx
│   │       │   │   ├── Step2Customer.tsx
│   │       │   │   ├── Step3Personality.tsx
│   │       │   │   ├── Step4Values.tsx
│   │       │   │   ├── Step5Story.tsx
│   │       │   │   ├── Step6Aesthetic.tsx
│   │       │   │   └── Step7Industry.tsx
│   │       │   ├── review/
│   │       │   │   ├── ReviewScreen.tsx
│   │       │   │   ├── EditScreen.tsx
│   │       │   │   └── ConfirmScreen.tsx
│   │       │   └── ui/              # Button, TextArea, SwipeableOptionDeck, etc.
│   │       ├── data/
│   │       ├── hooks/
│   │       ├── utils/               # e.g. voicePreview.ts, voiceSliders.ts
│   │       ├── services/            # Client-side service wrappers (optional)
│   │       ├── types/
│   │       ├── App.tsx
│   │       └── main.tsx
│   └── api/                         # Node backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   │   ├── aiService.ts
│       │   │   ├── pdfService.ts
│       │   │   ├── emailService.ts
│       │   │   └── stripeService.ts
│       │   ├── jobs/
│       │   ├── db/
│       │   └── index.ts
│       └── package.json
├── package.json
├── pnpm-workspace.yaml              # optional if using pnpm monorepo style
└── README.md
```

Notes:
- A single-repo dual-app setup (`apps/web` + `apps/api`) is preferred for this product.
- This is still a **new standalone repository**, separate from the landing-page repository.

---

## 10) Canonical Data Model (Form + Output)

`IdentityKitForm` should remain the canonical user-input payload (as defined in v1 PRD), with these additions:

- `sessionId: string`
- `orderId: string | null`
- `paymentStatus: 'pending' | 'paid' | 'failed'`
- `fulfillmentStatus: 'not_started' | 'in_progress' | 'complete' | 'error'`
- `createdAt`, `updatedAt`

Generated output model:

- `standardOutputs` (deterministic)
- `aiOutputs` (Pro)
- `finalEditableOutputs` (source of truth for Edit screen + PDF generation)

---

## 11) Integrations and Contracts

## Anthropic (Pro)
- All model calls server-side only
- No API keys in browser bundle
- Prompt templates versioned in code
- Include retry/backoff and timeout strategy

## Stripe
- Create checkout session from selected tier
- Verify webhook signature
- Webhook event marks order paid and triggers fulfillment
- Idempotency key handling required

## Resend
- Send confirmation + final delivery email
- Attach all four PDFs
- Log send status by order ID

## PDF Generation
- Use `@react-pdf/renderer`
- Shared header/footer branding across all documents
- US Letter page size
- Enforce deterministic output for same final editable content

---

## 12) Environment Variables (Required)

```bash
# App URLs
WEB_APP_URL=https://kit.brandalchemyllc.com
API_BASE_URL=https://api.kit.brandalchemyllc.com

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STANDARD=
STRIPE_PRICE_PRO=

# Email
RESEND_API_KEY=
EMAIL_FROM=kit@brandalchemyllc.com

# Storage/DB
DATABASE_URL=

# Security/ops
SESSION_SECRET=
NODE_ENV=production
```

---

## 13) Security and Reliability Requirements

- Never expose provider secrets in frontend
- Validate and sanitize all user input
- Enforce payload limits for image upload
- Implement webhook signature verification
- Add idempotency protections on fulfillment pipeline
- Log critical lifecycle events by session/order ID
- Graceful fallback on AI or email failure:
  - Offer template output fallback
  - Offer manual PDF download if email fails

---

## 14) Analytics Requirements

Track at minimum:
- Tier selected
- Step completion per step
- Review reached
- Payment attempted/succeeded/failed
- Fulfillment complete/failed
- Send kit clicked

Rules:
- No PII in analytics payloads
- Use session/order IDs only

---

## 15) Success Metrics (Launch Targets)

| Metric | Target |
|---|---|
| Start to review completion | > 60% |
| Review to paid conversion | > 35% |
| Pro tier mix of paid orders | > 25% |
| Delivery email success | > 99% |
| Payment to delivery time | < 2 min Core, < 5 min Pro |

---

## 16) Definition of Done (Production)

Launch readiness requires:
- All flows function on iOS Safari + Chrome mobile + desktop
- Stripe test and live mode verified
- Webhook idempotency validated
- AI fallback path verified
- PDF rendering verified for all 4 docs
- Email delivery + attachment integrity verified
- Error states and retry behavior validated
- Basic observability dashboard available

---

## 17) Instructions for Agent: Create New Repo and Bootstrap

Use this section verbatim for implementation handoff.

## Step A — Create repository

1. Create a new GitHub repo named: `brand-alchemy-identity-kit`
2. Initialize locally in a new directory (not inside landing-page repo)
3. Add remote and push initial scaffold

Example commands:

```bash
mkdir brand-alchemy-identity-kit
cd brand-alchemy-identity-kit
git init
git branch -M main
git remote add origin https://github.com/<ORG_OR_USER>/brand-alchemy-identity-kit.git
```

## Step B — Bootstrap project structure

1. Create `apps/web` (Vite React TS + Tailwind)
2. Create `apps/api` (Node TypeScript service)
3. Add shared tooling (`eslint`, `prettier`, `tsconfig` conventions)
4. Add `.env.example` with all required variables
5. Commit scaffold and push

## Step C — Connect to existing landing-page repo for parity

Use existing repo only as visual/spec source:  
`https://github.com/harleyfan91/brand-alchemy-llc-landing-page.git`

Rules:
- Do not add runtime import dependency on that repo
- Copy only required brand UI patterns/components
- Keep Identity Kit independently deployable

## Step D — Link from marketing site

In main landing-page repo:
- Add CTA link(s) to `https://kit.brandalchemyllc.com`
- Optionally add UTM params for attribution tracking

## Step E — Deployment topology

- Deploy frontend to Vercel/Netlify
- Deploy API to Render/Fly/Railway (or equivalent)
- Configure Stripe webhook target to API endpoint
- Set DNS records for `kit.brandalchemyllc.com` and optional `api.kit.brandalchemyllc.com`

---

## 18) Non-Goals (Explicitly Out of Scope for v1)

- User accounts and persistent dashboard
- Re-download portal
- Team collaboration features
- Multi-language support
- White-label licensing workflow

---

## 19) Open Questions (Must Resolve Before Phase 2 Build)

- Final database provider decision (Supabase/Neon/etc.)
- Preferred backend host (Render/Fly/Railway/etc.)
- Whether Core generation occurs server-side for parity/logging
- Legal/privacy copy for intake + email consent language
- Refund/cancellation policy UX

---

## 20) Final Decision Record

For internal alignment:

- **Project type:** New standalone microsite
- **Repository strategy:** New repo (`brand-alchemy-identity-kit`)
- **Relationship to existing repo:** Brand/style reference + outbound CTA linkage only
- **Best-practice stance:** Separate systems for marketing site vs paid fulfillment product

