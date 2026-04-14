# Identity Kit — product source of truth

**Owner:** Brand Alchemy LLC  
**Kit frontend:** `https://kit.brandalchemyllc.com` (target)  
**Marketing site:** `https://brandalchemyllc.com`  
**Style reference (not a runtime dependency):** landing-page repo used for tokens and visual parity — see root [README.md](./README.md) brand alignment section.

This document is the **authoritative place for product intent**: who the kit is for, what ships in each tier, boundaries, launch targets, and unresolved research. It does **not** replace detailed specs — use the links in [Canonical companion documents](#canonical-companion-documents).

---

## Executive summary

The Identity Kit is a standalone, mobile-first product that guides users through intake, generates a polished **brand kit** (PDFs), and is designed to deliver by email after payment and fulfillment.

The kit **must** remain a **separate repository and deployment** from the marketing landing site: payments, webhooks, PDF generation, optional AI (Pro), email, and order state carry higher operational risk and a different release cadence than marketing.

---

## Why a separate repo (boundary)

- Payment processing (Stripe Checkout + webhooks)
- Server-side AI (Anthropic) for Pro — keys and prompts never in the browser bundle
- PDF generation and attachment handling
- Transactional email (Resend)
- Session/order persistence and fulfillment retries

**Decision:** Standalone repo, isolated secrets, independent deploys, clearer incident response.

---

## Relationship to the marketing site

- Visual and tone alignment with Brand Alchemy; tokens synced per README.
- Marketing CTAs link to the kit URL; optional UTM params for attribution.
- No runtime import of the landing-page codebase — copy minimal UI patterns, optional future shared package.

---

## Ideal customer and non-goals

### Who it is for

- Solo founders and small business owners who know their trade but **little or nothing about marketing**.
- They need confidence, clarity, and documents they can **skim later** when posting, updating a site, or briefing a contractor.

### Who it is not for

- Agencies or in-house brand teams expecting brand ops, governance workflows, or corporate-manual depth. Language stays **approachable**.

### Outcomes to stress in copy (plain language)

Consistency where customers see them, one voice across channels, less time deciding what to say or which colors, faster DIY or contractor work because **standards exist**. Avoid framework jargon unless paired with a one-line translation.

### v1 non-goals (explicitly out of scope)

- User accounts and persistent customer dashboard
- Re-download portal
- Team collaboration inside the product
- Multi-language kit output
- White-label licensing workflow

---

## Commercial tiers (summary)

| | Core Kit | Pro Kit |
|---|----------|---------|
| **Price** | $79 | $149 |
| **Positioning** | Foundational brand layer that makes downstream execution easier | Foundation plus ready-to-use messaging assets and deeper strategy/voice tailoring |
| **Generation** | Deterministic assembly from structured intake | Hybrid: deterministic scaffolds + AI-enhanced / Pro-only sections — see [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) |
| **Deliverables** | 4 PDFs | Same 4 + **Content Starter Pack** (5th PDF) |
| **Post-pay edit (current)** | Editable draft fields | Same |
| **Post-pay (target)** | Editable | Editable + section regenerate for Pro (Phase 2) |

**Why Content Starter Pack is Pro-only:** it requires synthesis across multiple inputs (not single-field slots), depends on audience, tone, story, and differentiation together, and produces **immediately reusable** channel copy — a distinct value step beyond “more polished” base PDFs.

**Per-PDF goals, section lists, and input matrices:** [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md).

---

## AI-powered (buyer-visible meaning)

- Intake becomes prompt context and voice constraints.
- Draft wording, structure, and emphasis adapt to the business profile, not only slot filling.
- Pro-only fields deepen audience, story, and tone.
- AI justifies **applied** outputs (especially the Content Starter Pack).
- Users keep final control via post-pay editing.

---

## UX and document design principles

- Mobile-first (375px baseline); one primary action per screen where possible.
- Plain-language prompts; no unexplained jargon.
- PDFs optimized for **skimming**: strong headings, short blocks, clear section labels.

### Reference patterns (intent, not UI spec)

- **Section-at-a-glance:** Named pillars (story, voice, type, color, imagery, etc.) visible early; detail stays scannable. Across PDFs, recurring headers help the kit feel like **one system**.
- **Narrative flow:** “Who we are” can read as one continuous story inside the Brand Brief when that fits the brand — one long read with anchors, not appendix density.

Detail of **current screens and micro-steps:** [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md).

---

## Target user journey (production)

1. Arrive at kit URL  
2. Choose Core or Pro  
3. Complete intake (chapters / micro-steps)  
4. Review inputs  
5. Pay (Stripe Checkout)  
6. Fulfillment generates outputs (Core deterministic; Pro hybrid + fallback)  
7. Optional edit of draft outputs  
8. Confirm send  
9. PDFs emailed; confirmation shown  

**Implementation order and building blocks:** [PHASE_ROADMAP.md](./PHASE_ROADMAP.md).

---

## Security, reliability, and analytics (requirements)

**Security / reliability**

- Never expose provider secrets in the frontend bundle.
- Validate and sanitize user input; enforce upload size limits.
- Verify Stripe webhook signatures; idempotent fulfillment by event/order.
- Log critical lifecycle events by session/order ID.
- Graceful degradation: template fallback on AI failure; manual PDF path if email fails.

**Analytics (minimum event set)**

- Tier selected; step completion; review reached; payment attempted/succeeded/failed; fulfillment complete/failed; send kit clicked.
- **Rules:** no PII in analytics payloads; use session/order IDs only.

---

## Success metrics (launch targets)

| Metric | Target |
|--------|--------|
| Start → review completion | > 60% |
| Review → paid | > 35% |
| Pro share of paid orders | > 25% |
| Delivery email success | > 99% |
| Payment → delivery time | < 2 min Core, < 5 min Pro |

---

## Definition of Done (production launch)

- Flows work on iOS Safari, Chrome mobile, and desktop.
- Stripe test and live verified; webhook idempotency validated.
- AI fallback path verified (Pro).
- PDF rendering verified for **all** customer-facing documents: **four** for Core, **five** for Pro (including Content Starter Pack).
- Email delivery and attachment integrity verified.
- Error and retry UX validated; basic observability in place.

---

## Research and open decisions

**Resolved**

- **Database:** Supabase (Postgres) — confirmed for this product.

**Still open or TBD before launch**

- API hosting provider final choice (e.g. Render vs Fly vs Railway) — see [OPERATIONS.md](./OPERATIONS.md) for current recommendation.
- Legal / privacy copy for intake and email consent.
- Refund and cancellation policy UX and copy.
- Optional: whether Core generation must always run server-side for parity/logging (recommended stance documented in operations memo — enforce in architecture when wiring fulfillment).
- Channel alignment v1 is now shipped: `step1.touchpoints[]` (ordered, top-4) is first-class and drives Quick Start + "apply first" guidance before narrator fallback.

**Deferred product questions** (from historical survey/narrator planning — revisit if metrics warrant)

- Optional **consumer vs B2B** signal for narrow verticals (e.g. creative_services archetypes); narrator + industry may suffice.
- Platform-specific social packs (e.g. TikTok vs LinkedIn) as a future deliverable row, not required for v1.

---

## Canonical companion documents

| Document | Role |
|----------|------|
| [docs/README.md](./docs/README.md) | Index of **docs/research/** and **docs/audits/** (deep dives; specs stay at repo root) |
| [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) | On-screen copy and **current** UI behavior |
| [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) | Per-PDF sections, inputs, Core vs Pro |
| [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) | Intake → sections, deterministic rules, Pro modes |
| [PDF_GENERATION.md](./PDF_GENERATION.md) | How PDFs are built in-repo today |
| [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) | Sequencing from UI-complete → operational |
| [OPERATIONS.md](./OPERATIONS.md) | Stack, DNS, env map, ordered setup checklist |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](./docs/audits/CORE_PATH_CUSTOMIZATION_AUDIT.md) | Generic vs customized generation path and Core PDF backlog hub |
| [CORE_INPUT_REDESIGN_ANALYSIS.md](./docs/audits/CORE_INPUT_REDESIGN_ANALYSIS.md) | Deterministic Core input philosophy |
| [STEP1_INDUSTRY_CATALOGS.md](./STEP1_INDUSTRY_CATALOGS.md) | Step 1 industry wheel copy reference |

---

## Decision record (internal)

- **Product type:** Standalone kit microsite.
- **Repo strategy:** Dedicated monorepo (`identity-kit`); not embedded in the marketing repo.
- **Relationship to marketing:** Visual reference + outbound links only; no runtime coupling.
