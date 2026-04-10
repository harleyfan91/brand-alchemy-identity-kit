# Brand Alchemy Identity Kit

Monorepo for the **Identity Kit** microsite (`apps/web`) and API (`apps/api`): guided intake, review, checkout placeholder, and post-pay edit/confirm flows.

## Brand alignment

Parent brand (typography, neutrals, β△ mark, tokens) is owned by the **main marketing / umbrella** repository. Before changing web UI chrome or company-facing copy, read [**BRAND_SOURCE_OF_TRUTH.md**](https://github.com/YOUR_ORG/YOUR_UMBRELLA_REPO/blob/main/docs/BRAND_SOURCE_OF_TRUTH.md) there, plus `docs/BRAND_GUIDELINES.md` and `docs/BRAND_PLAYBOOK.md` in the same repo. **`apps/web/src/brand-tokens.css`** is a synced copy of the umbrella `public/brand-tokens.css` — re-copy when that file changes. Kit-only assets (for example the PDF symbol strip) stay in **`@identity-kit/brand-assets`** unless promoted company-wide.

## Documentation

| Doc | Purpose |
|-----|---------|
| [PRODUCT.md](./PRODUCT.md) | **Product source of truth:** ICP, tiers, non-goals, principles, DoD, metrics, security/analytics requirements, open research |
| [OPERATIONS.md](./OPERATIONS.md) | Stack, DNS, env vars, Stripe webhooks, ordered setup and go-live checklist |
| [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) | Screen copy + **current UI behavior** (kept in sync with the app) |
| [DELIVERABLE_PRODUCTION_SPEC.md](./DELIVERABLE_PRODUCTION_SPEC.md) | Detailed spec for every customer deliverable: format, pages, contents, inputs, and Core/Pro differences |
| [OUTPUT_TRANSLATION_SPEC.md](./OUTPUT_TRANSLATION_SPEC.md) | Implementation-level mapping from intake inputs to section outputs, including Core deterministic rules, Pro prompting, industry verbiage, and QA gates |
| [PDF_GENERATION.md](./PDF_GENERATION.md) | **How PDFs are built today:** local Node + `@react-pdf/renderer`, no PDF API yet, limits and how this connects to future backend |
| [packages/brand-assets/README.md](./packages/brand-assets/README.md) | **Symbol strip:** shared layout + generated `alchemy-symbol-strip.svg` for Slides, PDFs, and Figma |
| [PHASE_ROADMAP.md](./PHASE_ROADMAP.md) | **After Phase 1 UI:** sequenced path to operational (API, Stripe, PDF, email, Pro image pipeline, launch gate) |
| [CORE_PATH_CUSTOMIZATION_AUDIT.md](./CORE_PATH_CUSTOMIZATION_AUDIT.md) | Generic vs customized generation path and channel-alignment gaps |
| [CORE_INPUT_REDESIGN_ANALYSIS.md](./CORE_INPUT_REDESIGN_ANALYSIS.md) | Deterministic Core input philosophy |
| [STEP1_INDUSTRY_CATALOGS.md](./STEP1_INDUSTRY_CATALOGS.md) | Step 1 industry wheel copy reference (sync with `step1ControlledOptions.ts`) |

## Apps and packages

- **`apps/web`** — React, TypeScript, Vite, Tailwind. Phase 1: full client UI, form state, validation guards, no live Stripe/AI/email.
- **`apps/api`** — Node + TypeScript + Express scaffold for future integrations.
- **`packages/shared`** — Shared TypeScript types (`IdentityKitForm`, etc.) consumed by `apps/web` and **`packages/generation`**.
- **`packages/generation`** — Core deterministic PDF pipeline (`@react-pdf/renderer`), fixtures, and tests. **No payments.**
- **`packages/brand-assets`** — Symbol strip sequence + center label (`@identity-kit/brand-assets`); generated **`alchemy-symbol-strip.svg`** for Google Slides and other tools. Run `npm run generate:brand-strip` after changing strip logic.

## Quick start

```bash
npm install
npm run dev:web    # Vite dev server
npm run dev:api    # API dev server
npm run test:generation   # Core PDF tests (@react-pdf/renderer + fixture intake)
npm run generate:pdfs     # Write four Core PDFs under packages/generation/output/<persona>/ (gitignored); optional: npm run generate:pdfs -- coffee-founder
npm run generate:brand-strip  # Regenerate packages/brand-assets/alchemy-symbol-strip.svg
npm run build      # shared + generation + web + api (web needs platform-native CSS deps for Vite)
npm run lint       # all workspaces
```

## User flow (current UI)

1. **Landing** — Choose Core ($79) or Pro ($149) tier; fixed bottom CTA widens slightly as the user scrolls (visual emphasis).
2. **Steps 1–7** — Shared **step shell**: compact **Brand Alchemy** wordmark in the strip above the white card; **progress bar** (**“Step X of 7”** only, right-aligned) is the first block inside the card, then title, prompt, symbol/rail strip, step content, **Back** / **Continue**.
3. **Step 3 (Brand Personality)** — Tone presets, five voice sliders on a **0 / 25 / 50 / 75 / 100** grid (with a subtle center tick at 50). After engaging presets or sliders, a **live rail** shows an **`i.e.`** prefix (muted gray) plus a **sample sentence** and mood-colored gradient flash (`buildVoicePreview` in `apps/web/src/utils/voicePreview.ts`). Pro-only optional voice notes.
4. **Steps 5 & 6** — **SwipeableOptionDeck** for origin story and visual options: horizontal swipe changes the active card; **vertical scrolling** still scrolls the page (`touch-action` + gesture direction check).
5. **Review** — Sections per step; **Edit** jumps back into that step; voice axes summarized using the same snap semantics as the sliders (low / balanced / high).
6. **Payment** — Placeholder copy (Stripe called out as future).
7. **Processing** — Placeholder “generating” state with stub progress animation.
8. **Edit** — Four editable output fields (draft placeholders).
9. **Confirm** — Delivery confirmed messaging and support line.

**Navigation UX:** Changing **screen** or **step index** scrolls the window to the top (`useLayoutEffect` in `App.tsx`) so mobile users don’t land mid-page on the next step.

## Core vs Pro (current product direction)

| Dimension | Core Kit ($79) | Pro Kit ($149) |
|---|---|---|
| Generation style | Foundational strategy system assembled from guided inputs | Foundation plus AI-personalized drafts shaped by richer intake context |
| Input depth | Required fields + guided selectors | Same base inputs + **required Pro depth fields** (see validation in `useFlowState.ts`) + optional voice/visual notes and reference image filename |
| Voice output | Uses selected tone/preset + slider profile | Uses slider profile plus custom voice notes for deeper brand voice tailoring |
| Visual output | Guided palette/style choices from predefined systems | Same base choices plus notes intended to refine AI direction in later phases |
| Edit stage | Editable draft outputs before send | Editable draft outputs before send (section regenerate planned for Phase 2) |
| Deliverables | Brand Brief, Style Guide, Voice Playbook, 30-Day Quick Start | Same 4 foundational deliverables, plus a Pro-only **Content Starter Pack** |

## Deliverables by tier

### Core Kit

- **Brand Brief**
  - Format: 1-page branded PDF, editorial/text-forward with concise strategy blocks.
  - Includes: business snapshot, ideal customer snapshot, transformation/promise, values, origin angle, and competitor-informed positioning cues.
- **Brand Style Guide**
  - Format: 2-page branded PDF, more visual than text-heavy.
  - Includes: palette, visual direction, style principles, and practical usage guidance.
- **Voice & Content Playbook**
  - Format: 2-3 page branded PDF, text-forward with examples.
  - Includes: tone profile, voice guardrails, sample messaging direction, and content cues.
- **30-Day Quick Start Checklist**
  - Format: 1-page action PDF, checklist-style and easy to skim.
  - Includes: prioritized actions for applying the new brand across messaging and visuals.

### Pro Kit

- Everything in **Core**, but with deeper AI personalization across audience, positioning, story, and voice.
- **Content Starter Pack**:
  - Format: 2-page branded PDF, copy-forward and immediately usable.
  - Includes: homepage messaging directions, brand bio/about intro, social bio options, caption starters, content pillars, prompts, and CTA suggestions.

## Deliverable asset detail

### Brand Brief

- Target format: branded PDF
- Target length: 1 page
- Visual style: editorial summary; mostly text with strong hierarchy, not a dense report
- Table of contents:
  - Brand overview
  - Ideal customer
  - Core transformation / promise
  - Values and positioning cues
  - Brand story angle
  - Differentiation snapshot

### Brand Style Guide

- Target format: branded PDF
- Target length: 2 pages
- Visual style: visual-first; color, spacing, and direction examples supported by short text
- Table of contents:
  - Palette overview
  - Visual direction summary
  - Style principles
  - Do / avoid guidance
  - Practical usage notes

### Voice & Content Playbook

- Target format: branded PDF
- Target length: 2-3 pages
- Visual style: text-forward with pullouts, examples, and short comparison blocks
- Table of contents:
  - Tone profile
  - Voice guardrails
  - Messaging themes
  - Sample phrases / language cues
  - Writing do / avoid guidance

### 30-Day Quick Start Checklist

- Target format: branded PDF
- Target length: 1 page
- Visual style: checklist / action plan, highly skimmable
- Table of contents:
  - Week 1 foundational actions
  - Week 2 messaging updates
  - Week 3 visual rollout
  - Week 4 consistency checks

### Content Starter Pack (Pro)

- Target format: branded PDF
- Target length: 2 pages
- Visual style: text-forward and practical; built to be copied into real channels
- Table of contents:
  - One-liner / brand summary
  - Homepage messaging directions
  - Brand bio / about intro
  - Social bio options
  - Caption starters
  - Content pillar prompts
  - CTA suggestions

## What AI personalization adds

- Synthesizes signals across audience, tone, values, story, visual direction, and positioning inputs instead of filling static templates.
- Produces more brand-specific messaging tradeoffs, not just cleaner wording.
- Makes the **Content Starter Pack** possible because it can turn strategy inputs into usable copy starters.
- Keeps the user in control through post-pay editing, with Pro regenerate controls still planned for a later phase.

## Survey-to-output map (current)

- **Step 1 (Business Snapshot)** captures business basics plus required customer transformation, informing core positioning across all deliverables.
- **Step 2 (Your Buyer)** informs audience messaging sections in Brand Brief and Voice Playbook (Pro requires at least one depth field: pain points or desired outcomes).
- **Step 3 (Brand Personality)** informs tone guidance and sample voice direction in Voice Playbook (tone preset required).
- **Step 4 (Core Values)** informs positioning/value narrative in Brand Brief and messaging guardrails.
- **Step 5 (Brand Story)** informs origin narrative and about-style sections in Brand Brief.
- **Step 6 (Visual Direction)** informs palette/style sections in the Style Guide.
- **Step 7 (Stand Out)** informs competitor framing in Core and direct differentiation language in Pro (Brand Brief and Quick Start; Pro differentiation required).

### Phase 2 wiring plan (UI → generation → delivery)

**Build order:** **`PHASE_ROADMAP.md`** — Core deterministic PDFs + **tests first**, then **Anthropic (Claude) for Pro**, **pause at a gate**, then **Stripe payments** and the rest. Do not block PDF work on payment integration.

| Layer | Role |
|--------|------|
| **Intake (`IdentityKitForm`)** | Single source of truth for tier and step fields; validation in `getStepValidationErrors` gates Continue. Pro adds filename-only reference upload (`step6.referenceUploadName`) for future color extraction. |
| **Generation** | `OUTPUT_TRANSLATION_SPEC.md` — section modes, Core templates, Pro prompts, QA gates; `DELIVERABLE_PRODUCTION_SPEC.md` — per-PDF sections and inputs. |
| **API** | Persist session/order, enqueue fulfillment job, call model + PDF renderer, attach assets to email (scaffold in `apps/api`). |
| **Delivery bundle** | **Multiple PDFs** (one file per deliverable), not one merged file — see `DELIVERABLE_PRODUCTION_SPEC.md` (“Delivery bundle format”). |
| **Post-pay edit** | Phase 1: four plain text blobs in `App.tsx` / `EditScreen` (Content Starter Pack **not** yet a fifth field — add when PDF pipeline ships). |
| **Confirm copy** | `ConfirmScreen` uses tier to show **4 vs 5** PDFs. |

## Environment

Copy `.env.example` (when present) into local `.env` / provider settings for API and web as needed.

## Repo layout

```text
identity-kit/
├── apps/
│   ├── web/          # Customer UI
│   └── api/          # Backend service
├── packages/
│   ├── shared/       # Shared types (IdentityKitForm)
│   ├── generation/   # Core PDF generation, fixtures, tests
│   └── brand-assets/ # Symbol strip source + generated SVG for decks/PDF
├── PRODUCT.md
├── OPERATIONS.md
├── SCREEN_COPY_MAP.md
└── package.json      # npm workspaces
```
