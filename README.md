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
