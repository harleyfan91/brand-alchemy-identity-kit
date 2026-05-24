# Identity Kit — Web app (`apps/web`)

React 19 + TypeScript + Vite + Tailwind. Single-page flow: no client-side URL router; `useFlowState` drives `screen`, chapter index, and micro-step index.

## Run

From repo root (recommended):

```bash
npm run dev:web
```

For Core PDF generation from the web flow:

```bash
npm run dev:api:built   # rebuild shared + generation + api
npm run dev:web
```

Or from this directory:

```bash
npm run dev
```

## Layout

| Path | Role |
|------|------|
| `src/App.tsx` | Screen router, step 3 live rail, generate-on-payment, scroll-to-top |
| `src/hooks/useFlowState.ts` | Form state, micro-step transitions, `IdentityKitForm` |
| `src/data/microStepSchema.ts` | Canonical micro-step / validation rule refs |
| `src/validation/microStepValidation.ts` | Per-micro-step gates |
| `src/components/flow/` | `StepShell`, `TierSelector`, `ProgressBar`, payment/processing |
| `src/components/steps/` | Step 1–7 chapter UIs |
| `src/components/review/` | Review, edit, confirm |
| `src/services/api.ts` | `POST /generate/core`, download URLs |

## Product copy

Step titles: `src/data/steps.ts`. Tiers: `src/data/tiers.ts`. Full UI map: repo root **`SCREEN_COPY_MAP.md`**.

## Deliverables (generation today)

Core **Generate Core PDFs** produces **five** files, including the **Brand Identity Guide** as the primary reference. See [PROJECT_OVERVIEW.md](../../PROJECT_OVERVIEW.md) and [GENERATION_PIPELINE.md](../../GENERATION_PIPELINE.md).

## Build

```bash
npm run build
```

Output: `dist/`. Typecheck: `tsc -b`.
