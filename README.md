# Brand Alchemy Identity Kit

Monorepo for the **Identity Kit** microsite (`apps/web`) and API (`apps/api`): guided intake, review, checkout placeholder, and post-pay edit/confirm flows.

## Documentation

| Doc | Purpose |
|-----|---------|
| [IDENTITY_KIT_PRD.md](./IDENTITY_KIT_PRD.md) | Product requirements, architecture, phases |
| [SCREEN_COPY_MAP.md](./SCREEN_COPY_MAP.md) | Screen copy + **current UI behavior** (kept in sync with the app) |
| [PROJECT_KICKOFF_NOTES.md](./PROJECT_KICKOFF_NOTES.md) | Decisions and open research |
| [DAY1_SETUP_CHECKLIST.md](./DAY1_SETUP_CHECKLIST.md) | Infra and deploy checklist |
| [DEPLOYMENT_DECISION_MEMO.md](./DEPLOYMENT_DECISION_MEMO.md) | Hosting and domain notes |

## Apps

- **`apps/web`** — React, TypeScript, Vite, Tailwind. Phase 1: full client UI, form state, validation guards, no live Stripe/AI/PDF/email.
- **`apps/api`** — Node + TypeScript + Express scaffold for future integrations.

## Quick start

```bash
npm install
npm run dev:web    # Vite dev server
npm run dev:api    # API dev server
npm run build      # all workspaces
npm run lint       # all workspaces
```

## User flow (current UI)

1. **Landing** — Choose Core ($49) or Pro ($99) tier; fixed bottom CTA widens slightly as the user scrolls (visual emphasis).
2. **Steps 1–7** — Shared **step shell**: compact **Brand Alchemy** wordmark in the strip above the white card; **progress bar** (“Progress” / “Step X of 7”) is the first block inside the card, then title, prompt, symbol/rail strip, step content, **Back** / **Continue**.
3. **Step 3 (Brand Personality)** — Tone presets, five voice sliders on a **0 / 25 / 50 / 75 / 100** grid (with a subtle center tick at 50). After engaging presets or sliders, a **live rail** shows an **`i.e.`** prefix (muted gray) plus a **sample sentence** and mood-colored gradient flash (`buildVoicePreview` in `apps/web/src/utils/voicePreview.ts`). Pro-only optional voice notes.
4. **Steps 5 & 6** — **SwipeableOptionDeck** for origin story and visual options: horizontal swipe changes the active card; **vertical scrolling** still scrolls the page (`touch-action` + gesture direction check).
5. **Review** — Sections per step; **Edit** jumps back into that step; voice axes summarized using the same snap semantics as the sliders (low / balanced / high).
6. **Payment** — Placeholder copy (Stripe called out as future).
7. **Processing** — Placeholder “generating” state with stub progress animation.
8. **Edit** — Four editable output fields (draft placeholders).
9. **Confirm** — Delivery confirmed messaging and support line.

**Navigation UX:** Changing **screen** or **step index** scrolls the window to the top (`useLayoutEffect` in `App.tsx`) so mobile users don’t land mid-page on the next step.

## Core vs Pro (current product direction)

| Dimension | Core Kit ($49) | Pro Kit ($99) |
|---|---|---|
| Generation style | Guided template assembly from survey selections | AI-personalized drafts shaped by richer intake context |
| Input depth | Required fields + guided selectors | Same base inputs + optional nuance fields for messaging, voice, story, and visual notes |
| Voice output | Uses selected tone/preset + slider profile | Uses slider profile plus custom voice notes for deeper brand voice tailoring |
| Visual output | Guided palette/style choices from predefined systems | Same base choices plus notes intended to refine AI direction in later phases |
| Edit stage | Editable draft outputs before send | Editable draft outputs before send (section regenerate planned for Phase 2) |
| Deliverables | Brand Brief, Style Guide, Voice Playbook, 30-Day Quick Start | Same 4 foundational deliverables, plus a Pro-only **Content Starter Pack** |

## Deliverables by tier

### Core Kit

- **Brand Brief**: foundational positioning, audience summary, values, brand story direction, and differentiation basics.
- **Brand Style Guide**: palette choice, visual direction, and practical style guidance.
- **Voice & Content Playbook**: tone profile, messaging direction, and sample voice cues.
- **30-Day Quick Start Checklist**: prioritized actions to start applying the brand right away.

### Pro Kit

- Everything in **Core**, but with deeper AI personalization across audience, positioning, story, and voice.
- **Content Starter Pack**:
  - homepage headline / subheadline directions
  - short brand bio / about intro
  - social bio options
  - caption / post starter hooks
  - content pillar ideas and starter prompts
  - CTA language suggestions

## What AI personalization adds

- Synthesizes signals across audience, tone, values, story, visual direction, and differentiation instead of filling static templates.
- Produces more brand-specific messaging tradeoffs, not just cleaner wording.
- Makes the **Content Starter Pack** possible because it can turn strategy inputs into usable copy starters.
- Keeps the user in control through post-pay editing, with Pro regenerate controls still planned for a later phase.

## Survey-to-output map (current)

- **Step 1 (Business Snapshot)** informs core business context across all four deliverables.
- **Step 2 (Your Buyer)** informs audience messaging sections in Brand Brief and Voice Playbook.
- **Step 3 (Brand Personality)** informs tone guidance and sample voice direction in Voice Playbook.
- **Step 4 (Core Values)** informs positioning/value narrative in Brand Brief and messaging guardrails.
- **Step 5 (Brand Story)** informs origin narrative and about-style sections in Brand Brief.
- **Step 6 (Visual Direction)** informs palette/style sections in the Style Guide.
- **Step 7 (Stand Out)** informs differentiation language and competitor framing in Brand Brief and Quick Start.

## Environment

Copy `.env.example` (when present) into local `.env` / provider settings for API and web as needed.

## Repo layout

```text
identity-kit/
├── apps/
│   ├── web/          # Customer UI
│   └── api/          # Backend service
├── IDENTITY_KIT_PRD.md
├── SCREEN_COPY_MAP.md
└── package.json      # npm workspaces
```
