# Identity Kit — Web app (`apps/web`)

React 19 + TypeScript + Vite + Tailwind. Single-page flow: no client-side URL router; `useFlowState` drives `screen` and `stepIndex`.

## Run

From repo root (recommended):

```bash
npm run dev:web
```

Or from this directory:

```bash
npm run dev
```

## Layout

| Path | Role |
|------|------|
| `src/App.tsx` | Screen router, step 3 live rail wiring, scroll-to-top on navigation |
| `src/hooks/useFlowState.ts` | Form state, validation, step transitions, `IdentityKitForm` |
| `src/components/flow/` | `StepShell`, `TierSelector`, `ProgressBar`, payment/processing placeholders |
| `src/components/steps/` | Step 1–7 screens |
| `src/components/review/` | Review, edit, confirm |
| `src/components/ui/` | Shared UI including `SwipeableOptionDeck` |
| `src/components/branding/` | Wordmark, symbol strip, `LiveRailStrip` |
| `src/data/` | `steps.ts` (titles/prompts), `tiers.ts`, archetypes |
| `src/utils/voicePreview.ts` | Sample sentence + mood from voice sliders |
| `src/utils/voiceSliders.ts` | Snap grid helpers for sliders and review labels |

## Product copy

Step titles and one-line prompts live in `src/data/steps.ts`. Tier names and bullets in `src/data/tiers.ts`. For a full copy and behavior map, see repo root **`SCREEN_COPY_MAP.md`**.

## Product definition notes

- **Core Kit**: 4 foundational deliverables — Brand Brief, Style Guide, Voice & Content Playbook, and 30-Day Quick Start Checklist.
- **Pro Kit**: the same 4 foundational deliverables with deeper AI personalization, plus a **Content Starter Pack**.
- Placeholder payment/processing/edit remain until backend work; the **post–Phase 1 execution outline** is **`PHASE_ROADMAP.md`** at the repo root (with `IDENTITY_KIT_PRD.md`, `DELIVERABLE_PRODUCTION_SPEC.md`, `OUTPUT_TRANSLATION_SPEC.md`).

## Build

```bash
npm run build
```

Output: `dist/`. Typecheck: `tsc -b`.
