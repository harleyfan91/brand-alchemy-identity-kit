# Pro API smoke tests

Lean, **credit-conscious** live Anthropic tests. These are **not** part of the default CI suite.

## Commands

| Command | API cost | What runs |
|---------|----------|-----------|
| `npm run test:generation` | **None** (mocked) | Full generation unit tests — safe to run anytime |
| `npm run test:pro-smoke` | **~2 Sonnet calls** | Pro smoke integration tests only |
| `npm run generate:pro-pdfs -- text\|vision` | **0–1 Sonnet call** | Five Pro PDFs from pro-smoke fixture; Brief Ideal customer uses AI when key is set |
| `npm run generate:pro-pdfs -- text --no-ai` | **None** | Same PDFs; Brief stays deterministic (`--no-ai` from repo root — npm eats `--dry-run`) |

Requires `ANTHROPIC_API_KEY` or `ANTHROPIC_API_KEY_2` in repo-root `.env` (Anthropic Console key label can differ).

```bash
npm run test:pro-smoke
npm run generate:pro-pdfs -- text
npm run generate:pro-pdfs -- vision --no-ai
```

## Fixtures (not personas)

Pro smoke fixtures live in `packages/generation/src/fixtures/pro-smoke/` — separate from Core PDF personas.

| Fixture | File | API call | Images |
|---------|------|----------|--------|
| **Text-only** | `text.json` | `brief.idealCustomer` rewrite (1× Sonnet text) | None |
| **Vision** | `vision.json` + `images/*.jpg` | `brandAudit.whatWeSaw` smoke (1× Sonnet multimodal) | Local JPEGs (base64) |

Load in code:

```ts
import { loadProSmokeFixture, loadProSmokeImagePayload } from './fixtures/loadProSmokeFixture.js'

const textForm = loadProSmokeFixture('text')
const visionForm = loadProSmokeFixture('vision')
const images = loadProSmokeImagePayload()
```

### Test images (`fixtures/pro-smoke/images/`)

Small committed JPEGs (Unsplash). Read from disk and embedded as base64 — avoids Anthropic URL fetch failures in smoke tests. Production Brand Audit still uses signed Supabase URLs.

See `fixtures/pro-smoke/images/README.md` for attribution.

**Fixture design:** pro-smoke JSON uses wizard card ids and aligned Step 1 builders — see `fixtures/pro-smoke/README.md` and [`docs/specs/BRIEF_IDEAL_CUSTOMER.md`](../specs/BRIEF_IDEAL_CUSTOMER.md).

## Core vs Pro personas

| Id | Tier | Used for |
|----|------|----------|
| `established-pro` | **Core** | Core PDF QA (`npm run generate:pdfs -- established-pro`) — no live AI |
| `pro-smoke/text` | Pro | Live text smoke; `npm run generate:pro-pdfs -- text` |
| `pro-smoke/vision` | Pro | Live vision smoke; `npm run generate:pro-pdfs -- vision` (v1: vision images not wired into PDFs yet) |

After smoke tests look good, test **your own intake** through the full wizard — that path is not automated yet.

## What is not included

- Full kit fulfillment (~26 calls) — Pro-E+ orchestration
- Strategy Memo (Opus) — separate, expensive
- Custom intake JSON — manual / future CLI

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Tests skipped | Missing `ANTHROPIC_API_KEY` |
| Vision test fails, text passes | Image files missing under `fixtures/pro-smoke/images/` |
| `source: scaffold` | Safety refusal, schema parse, or truncation — check console `ai` logs |
