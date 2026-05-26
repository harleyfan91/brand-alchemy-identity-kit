# Identity Kit — product source of truth

**Owner:** Brand Alchemy LLC  
**Kit frontend:** `https://kit.brandalchemyllc.com` (target)  
**Marketing site:** `https://brandalchemyllc.com`  
**Style reference (not a runtime dependency):** landing-page repo used for tokens and visual parity — see root [README.md](./README.md) brand alignment section.

This document is the **authoritative place for product intent**: who the kit is for, what ships in each tier, boundaries, launch targets, and unresolved research.

**Repository overview (shipped vs target PDFs, reading map):** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md). **Generation pipeline:** [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md).

It does **not** replace detailed specs — use the links in [Canonical companion documents](#canonical-companion-documents).

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
| **Deliverables (today)** | 5 PDFs: **Brand Identity Guide** + Quick Start + 3 interim legacy PDFs | 7 PDFs (8 with existing-brand inputs): the 5 Core PDFs (with the Pro Style Guide extended by a Visual Reference Spread on pages 3–4 — the merged former moodboard PDF) + **Content Starter Pack** + **Brand Strategy Memo** + **Brand Audit** (conditional). See [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) Asset Summary. |
| **Deliverables (target)** | Brand Identity Guide + Quick Start | Same + Content Starter Pack |
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

## Pro fulfillment policy

The Pro kit is a fulfillment product, not a service contract. The buyer paid $149 for a deliverable; we either deliver it (full or honestly-degraded) or we do not charge them. This section defines the buyer experience for every documented Pro fulfillment outcome. Per-layer failure semantics live in [`docs/research/PRO_FULFILLMENT_ORCHESTRATION.md`](./docs/research/PRO_FULFILLMENT_ORCHESTRATION.md) §5; this section is the product-policy view of the same matrix.

This section locks the policy decision (notify y/n, refund y/n, deliver/replace/omit) per scenario. Final buyer-facing wording lives in [`SCREEN_COPY_MAP.md`](./SCREEN_COPY_MAP.md), authored during Pro-C. Italicized strings below are example phrasing to convey intent — not locked copy.

### Failure scenarios → buyer experience

| Scenario | Buyer experience | PDFs delivered | Buyer notification (intent) | Refund |
|---|---|---|---|---|
| All AI calls succeed | Full Pro kit | 8 (or 9 with existing brand) | Standard delivery email | None |
| Strategy Memo §8 narrative skipped (insufficient substance) | Memo ships with §1–§7 only | 8 | None — silent collapse | None |
| Strategy Memo 1–2 sections fail | Memo ships shorter | 8 | None — silent collapse | None |
| Strategy Memo ≥3 sections fail (catastrophic) | Deterministic Brand Identity Guide ships in Memo's place | 7 (Memo replaced) | Notify + offer manual re-run path. *e.g. "depth analysis was unavailable — reply to re-run manually within 24h"* | None automatic; ops discretion |
| Brand Audit §1 vision call fails | Audit PDF omitted | 7 | Notify + invite better image. *e.g. "couldn't analyze the uploaded image — reply with a clearer image to receive your Brand Audit"* | None |
| Existing-brand uploads missing (`hasExistingBrand = false`) | No Audit by design | 7 | None — conditional by design | None |
| Moodboard ranker fails | Deterministic top-6 + deterministic caption ship in Style Guide Pro Visual Reference Spread | 7 | None — silent fallback | None |
| Moodboard pipeline catastrophic failure (ranker fails AND fallback <6 AND caption fails) | Pro Visual Reference Spread omitted; Style Guide ships at 2-page Core length | 7 | None — silent fallback | None |
| Core section rewrites all fall back to deterministic | Pro reads similarly to Core for shared 5 PDFs | 7 | None — buyer sees specificity loss but content ships | None automatic; ops alert |
| Catastrophic — ≥3 PDFs fail | No delivery | 0 | Apologize + confirm refund + offer retry. *e.g. "We hit a snag — your purchase is fully refunded"* | Full refund automatic |
| Catastrophic — orchestrator times out (300s hard) | No delivery | 0 | Same as above | Full refund automatic |

### Ops alert thresholds

- Any `kit.failed` event → page on-call within 5 minutes.
- Any single section's failure rate > 20% in a rolling 1-hour window → ops alert.
- Any walker's rejection rate > 30% over 24h → review prompts / banlists.
- Total Anthropic spend > 2× the [`PRO_KIT_STRATEGY.md`](./docs/audits/PRO_KIT_STRATEGY.md) §1.4 budget over 24h → page on-call.

### Communication policy (intent — final wording in `SCREEN_COPY_MAP.md`)

- **Standard delivery:** confirms kit ready, lists attachments, Camentra trial link per [`PHASE_ROADMAP.md`](./PHASE_ROADMAP.md) §2D.
- **Degraded delivery:** same as standard **plus** brief honest acknowledgement of the specific gap and a manual re-run path. Honesty over silence.
- **Catastrophic:** empathetic acknowledgement, refund confirmation, optional retry offer.
- All buyer-facing emails route from `EMAIL_FROM`; ops never appears in From line.

### Recovery paths

- **Single-PDF re-run** (e.g. buyer replies with a better logo): ops job, manual, ≤ 24h SLA. Orchestrator is idempotent — re-runs replace prior outputs.
- **Full kit re-run:** same SLA. Ops decision when failure mode identified + fixed.
- **Refund + start over:** ops decision; buyer initiates by replying to the catastrophic-failure email.

### Why these policies

The kit is a fulfillment product, not a service contract. The buyer paid $149 for a deliverable; we either deliver it (full or honestly-degraded) or we don't charge them. Silent partial delivery erodes trust; over-refunding for cosmetically smaller PDFs erodes margin. The matrix above is the line we hold.

---

## Success metrics (launch targets)

| Metric | Target |
|--------|--------|
| Start → review completion | > 60% |
| Review → paid | > 35% |
| Pro share of paid orders | > 25% |
| Core → Pro upgrade conversion (within 30 days) | 5–10% per [`PRO_KIT_STRATEGY.md`](./docs/audits/PRO_KIT_STRATEGY.md) §9.3 |
| Delivery email success | > 99% |
| Payment → delivery time | < 2 min Core, < 5 min Pro |

---

## Definition of Done (production launch)

- Flows work on iOS Safari, Chrome mobile, and desktop.
- Stripe test and live verified; webhook idempotency validated.
- AI fallback path verified (Pro).
- PDF rendering verified for **all** customer-facing documents: **five** for Core today (Brand Identity Guide + Quick Start + three interim legacy PDFs); **six** for Pro when Content Starter Pack ships (target packaging may drop legacy three — see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)).
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
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Master overview: repo, shipped vs target deliverables, reading map |
| [GENERATION_PIPELINE.md](./GENERATION_PIPELINE.md) | Inputs → logic → outputs; API/CLI; guide IA summary |
| [docs/README.md](./docs/README.md) | Index of **docs/research/** and **docs/audits/** (deep dives; specs stay at repo root) |
| [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) | On-screen copy and **current** UI behavior |
| [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) | Per-PDF sections, inputs, Core vs Pro |
| [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) | Intake → sections, deterministic rules, Pro modes; **§3.3–3.3.1** = Path Class Catalog + recipes (to-do when updating Core paths) |
| [PDF_GENERATION.md](./PDF_GENERATION.md) | How PDFs are built in-repo today |
| [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) | Sequencing from UI-complete → operational |
| [OPERATIONS.md](./OPERATIONS.md) | Stack, DNS, env map, ordered setup checklist |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](./docs/audits/CORE_PATH_CUSTOMIZATION_AUDIT.md) | Generic vs customized generation path and Core PDF backlog hub |
| [CORE_INPUT_REDESIGN_ANALYSIS.md](./docs/audits/CORE_INPUT_REDESIGN_ANALYSIS.md) | Deterministic Core input philosophy |
| [STEP1_INDUSTRY_CATALOGS.md](./STEP1_INDUSTRY_CATALOGS.md) | Step 1 industry wheel copy reference |
| [docs/research/PRO_FULFILLMENT_ORCHESTRATION.md](./docs/research/PRO_FULFILLMENT_ORCHESTRATION.md) | Per-kit fulfillment lifecycle; complements the per-call playbook |

---

## Decision record (internal)

- **Product type:** Standalone kit microsite.
- **Repo strategy:** Dedicated monorepo (`identity-kit`); not embedded in the marketing repo.
- **Relationship to marketing:** Visual reference + outbound links only; no runtime coupling.
