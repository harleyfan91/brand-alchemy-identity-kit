# Research: AI integration playbook (Pro-A scope reference)

**Status:** **Sprint-prep / forward-looking** — captures patterns learned from auditing a sibling production codebase (`/Users/mattjohnson/camentra`, an Expo / React Native app shipping Claude Haiku 4.5 vision in a Supabase Edge Function) and translates them into a working contract for the Pro Kit AI plumbing (`PRO_KIT_STRATEGY.md` Phase **Pro-A**).

**Date:** 2026-05-25  
**Source codebase audited:** Camentra production app (Supabase Edge Function `ai-photo-coach-v2`, Claude vision + structured outputs, ~12 months in production).

**Related:**
- [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §8 (AI architecture), §8.3 (prompt grounding), §8.4 (quality safeguards), §11 (Phases Pro-A through Pro-H).
- [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1.2 (Mode Matrix), §4.4 + §5.4 (scaffold-and-refine), §5.5 (confidence gating).
- [`PRODUCT.md`](../../PRODUCT.md) (Pro tier promise, AI-powered scope).

---

## 1. Executive summary

A sibling production codebase already runs Claude vision-with-structured-output against a long, rule-heavy system prompt. The **request shape, structured-output schema discipline, sanitization helpers, refusal handling, and migration shapes** transfer directly to Identity Kit Pro-A and represent a working baseline.

**However**, the sibling codebase has **five concrete correctness / cost gaps** that would silently break Identity Kit's economics or quality if copied verbatim:

1. **No prompt caching** — defeats the 92% margin target in `PRO_KIT_STRATEGY.md` §1.4.
2. **No explicit `temperature`** — defaults to 1.0, producing inconsistent analytical output.
3. **Wrong refusal `stop_reason`** — checks `"content_block_stop"`; Anthropic's actual value is `"refusal"`.
4. **No retry / backoff** — single `fetch`; one transient 529 kills a ~12-call kit fulfillment.
5. **Base64 image embedding** — wasteful when image already lives in Supabase Storage with a signed URL.

This document gives the working pattern, the five fixes, and a concrete adapter contract for the section-by-section calls Identity Kit needs.

**Prompt content** for the persona, voice contracts, guardrails, and per-section task templates lives in §12 of this doc. **Out of scope:** moodboard bank curation (see [`MOODBOARD_BANK_CURATION.md`](./MOODBOARD_BANK_CURATION.md) when written), brand-context.json export (Pro-I backlog).

---

## 2. What Camentra actually does

A single Supabase Edge Function (`supabase/functions/ai-photo-coach-v2/index.ts`, ~1815 lines) handles the entire flow:

1. Supabase auth check → reject 401 if no user.
2. Subscription check via `profiles.subscription_tier`, with RevenueCat direct API as fallback for race conditions after purchase.
3. Per-period rate limiting (daily for OpenAI traffic, weekly for Claude traffic) against an `ai_coach_usage` counter table.
4. Provider routing via in-code constant `COACH_VISION_PROVIDER: "openai" | "claude"`.
5. Single `fetch` to `https://api.anthropic.com/v1/messages` with multimodal content array and JSON-schema structured output.
6. Server-side sanitization: text normalization, word-boundary truncation, tool-name regex validation, length budgets.
7. Analytics row written to `ai_coach_logs` with full `jsonb` analysis + `model_used` text column.
8. Response includes the analysis plus the remaining-quota / `resetsAt` payload.

The client (`app/services/photoQuality/AIPhotoCoachService.ts`) preprocesses the image client-side (resize to 640px, JPEG-0.6 compress, base64), invokes via `supabase.functions.invoke`, applies its own redundant sanitization pass, and caches by `URI_contextType_industry_intent` key.

---

## 3. The core Claude vision call (the part to keep)

The actual API call sits at `ai-photo-coach-v2/index.ts:1521-1573`:

```ts
const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": anthropicKey!,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: image } },
        { type: "text", text: "Coach me on this photo to make it look intentional and professional." },
      ],
    }],
    output_config: { format: { type: "json_schema", schema: coachResponseSchema } },
  }),
})
```

Three things to note:

- **Multimodal content array** with image-then-text ordering. Anthropic recommends image first for vision tasks.
- **`output_config.format.type: "json_schema"`** — Claude's structured outputs interface. The schema disciplines below are what make this reliable.
- **`system` is a plain string.** This is correct for non-cached prompts but blocks prompt caching — see §6.1.

The response parsing:

```ts
const claudeData = await claudeRes.json()
const textBlock = claudeData.content?.find((b: { type: string }) => b.type === "text")
const rawJson = textBlock?.text ?? ""
const analysis = JSON.parse(rawJson) as AICoachResponse
```

Claude returns `content: [{ type: "text", text: "<json string>" }]` — even when using structured outputs, the JSON arrives as a string inside a text block, not as a parsed object.

---

## 4. Patterns to copy directly into `packages/generation/src/ai/`

These are net-positive patterns from Camentra that should land in Identity Kit's AI module.

### 4.1 Structured-output schema discipline

`ai-photo-coach-v2/index.ts:222-345`. The discipline:
- `additionalProperties: false` at **every level**, including nested objects.
- `maxLength` on every string property.
- `enum` for every closed set of values.
- `required: [...]` listing every property at every level.
- Description strings explain the field's purpose to the model.

Example shape worth copying:

```ts
{
  type: "object",
  properties: {
    overall: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          maxLength: 140,
          description: "Cohesive narrative, max 20 words.",
        },
      },
      required: ["summary"],
      additionalProperties: false,
    },
  },
  required: ["overall"],
  additionalProperties: false,
}
```

Without `additionalProperties: false` Claude will sometimes add helpful-but-uninvited fields. Without `maxLength` it ignores the word-count guidance in the prompt under load.

### 4.2 Sanitization helpers

`ai-photo-coach-v2/index.ts:187-219`. Lift these into `packages/generation/src/ai/sanitizers.ts` essentially verbatim:

```ts
const normalizeWhitespace = (value: string): string =>
  value.replace(/\s+/g, " ").trim()

const truncateAtWordBoundary = (value: string, maxChars: number): string => {
  if (value.length <= maxChars) return value
  const slice = value.slice(0, maxChars).trim()
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace >= Math.floor(maxChars * 0.7)) {
    return slice.slice(0, lastSpace).trim()
  }
  return slice
}

const truncateToWordLimit = (value: string, maxWords: number): string => {
  const words = value.split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return value
  return words.slice(0, maxWords).join(" ")
}

const sanitizeText = (value: unknown, maxChars: number): string => {
  if (typeof value !== "string") return ""
  const normalized = normalizeWhitespace(value)
  if (!normalized) return ""
  return truncateAtWordBoundary(normalized, maxChars)
}
```

The 70% rule (only break at word boundary if it falls at least 70% through the budget) prevents both mid-word cuts and absurdly-short truncations on long-word fields.

### 4.3 Refusal handling pattern

The shape is right — return 400 with a safety message, never parse as analysis — but the `stop_reason` value is wrong (§6.3 below).

### 4.4 Error code → user-message mapping

`ai-photo-coach-v2/index.ts:1558-1567` and the client's response-parsing block (`AIPhotoCoachService.ts:583-635`):

| Status | Translation |
|---|---|
| 401 | "Invalid API key. Please check your secrets." |
| 403 | "Pro subscription required." |
| 429 | "Rate limit exceeded — resets at {date}." |
| 5xx / 529 | "Service temporarily overloaded — retrying." (transient; should retry) |
| Network-error message patterns | "Connect to the internet to use {feature}, then try again." |

Identity Kit will need analogous mapping for fulfillment-time errors surfaced on the order status page.

### 4.5 Migration patterns

`supabase/migrations/20251207_create_ai_coach_*.sql`:
- RLS enabled, `auth.uid() = user_id` for select policies.
- Counter table separate from logs table.
- Logs use `jsonb` for full response + denormalized columns for fast aggregation (`context`, `model_used`, `strengths text[]`, `weaknesses text[]`).
- Added `model_used` later via `add column if not exists` — good pattern for non-breaking schema evolution.

### 4.6 Client-side image preprocessing

`AIPhotoCoachService.ts:686-703` uses `expo-image-manipulator` for resize+compress. Identity Kit needs the same idea for the existing-brand uploads (`step6.logoUpload`, `step6.referenceImage`), but server-side via `sharp` since the uploads land in Supabase Storage first.

Target dimensions for Brand Audit vision input: max 1568px on the long edge (Anthropic's documented sweet spot for vision tokens); JPEG 80; strip EXIF.

### 4.7 Provider toggle pattern (optional for Pro v1)

`COACH_VISION_PROVIDER: "openai" | "claude"` as an in-code constant rather than env var lets you flip provider via a deploy without rotating secrets. Cleaner than the dynamic env-var approach. Identity Kit can keep this pattern as a Pro-I (v1.5) escape hatch in case we need an OpenAI / Gemini fallback for cost.

---

## 5. Patterns to **not** copy

### 5.1 The 1815-line monolithic edge function

Camentra's `serve()` block handles auth, subscription, RevenueCat fallback, rate limiting, provider routing, AI call, sanitization, analytics, and response shaping in one file. Their own setup doc (`docs/features/ai-coach/CLAUDE_HAIKU_SETUP_AND_IMPLEMENTATION.md` §5.5) recommends an adapter pattern they then didn't follow.

Identity Kit ships ~12 different prompt packages per kit (`PRO_KIT_STRATEGY.md` §8.3). The monolithic shape won't survive that fan-out. Plan from day one as:

```
packages/generation/src/ai/
├── client.ts                 # single callClaude() adapter
├── sanitizers.ts             # truncate / normalize helpers
├── schemas/
│   ├── briefSection.ts       # JSON schemas per section type
│   ├── voicePage3.ts
│   ├── cspSection.ts
│   ├── strategyMemo.ts
│   └── brandAudit.ts
├── prompts/
│   ├── briefSection/         # static system prompts (cacheable) + per-section context builders
│   ├── voicePage3/
│   ├── csp/
│   ├── strategyMemo/
│   └── brandAudit/
└── errors.ts                 # typed errors (Refusal, Empty, Schema, Network, RateLimit)
```

### 5.2 Schema duplication across client + server

Camentra declares the same `EditNowAction`, `UseItForSuggestion`, etc. in both `index.ts` (server) and `AIPhotoCoachService.ts` (client) — and they've already drifted (`templateCategory: "portrait"` server-side vs `"people"` client-side). Identity Kit's `packages/shared` should own these types and the JSON schema should be **generated from** the TypeScript types (e.g. via `zod-to-json-schema` or `typebox`) so they can never drift.

### 5.3 Double sanitization (server + client)

Defensive in depth is fine, but Identity Kit's pipeline is server-only for generation. One canonical sanitization pass at the adapter boundary is enough.

### 5.4 Base64 image embedding

Mobile clients have local files with no URL; Camentra has to base64-embed. Identity Kit's existing-brand uploads land in Supabase Storage with signed URLs already — use Claude's URL image source instead (§6.4 below).

### 5.5 `console.log` only logging

Camentra has Sentry as a dependency but its edge function uses `console.log`. For Identity Kit's 12+ parallel calls per kit fulfillment, **plan structured logging with a `kitOrderId` correlation field from day one.** Without it, debugging a Pro fulfillment that produced a bad Brand Audit is going to be miserable.

---

## 6. Five must-fix changes when porting

### 6.1 Prompt caching on the static prefix

**Why it matters:** `PRO_KIT_STRATEGY.md` §8.3 explicitly assumes prompt caching to hit the 92% margin target — *"Prompt caching on the static prefix (constraints, industry/narrator profile, schema) yields up to 90% savings across the ~12 calls per kit."* Camentra's call shape ships **no** `cache_control` and concatenates dynamic context into the system prompt via template literals (`index.ts:1421-1429`), which defeats caching even when enabled.

**The fix is structural, not just a flag:**

```ts
// WRONG (Camentra-style — defeats caching)
system: `${BIG_STATIC_PROMPT}\nIndustry: ${userContext.industry}\nNarrator: ${narrator}...`

// RIGHT (Identity Kit pattern)
system: [
  {
    type: "text",
    text: BIG_STATIC_PROMPT,                     // identical across all 12 calls per kit
    cache_control: { type: "ephemeral" },
  },
]
messages: [{
  role: "user",
  content: [
    { type: "text", text: dynamicContextBlock }, // per-kit context: industry, narrator, intake fields
    ...(imageBlock ? [imageBlock] : []),         // optional image
    { type: "text", text: sectionInstruction },  // per-section instruction
  ],
}]
```

The static prompt should include: constraints, banned vocab, length budgets, output schema (referenced again in `output_config`), tone-of-voice guidance, industry profile (per industry — cache hits across kits for the same industry), narrator profile (per narrator), few-shot examples.

**Effective economics:** cached read is ~10% of base input cost. For a Strategy Memo at ~8 sections × ~4000 input tokens, that's $0.32 → $0.04 in input cost. Material.

### 6.2 Explicit `temperature` per call type

Camentra sets `max_tokens` but not `temperature`, so it defaults to 1.0. For analytical output (Strategy Memo tensions, Brand Audit observations) this produces noticeable run-to-run variance — likely a contributor to the elaborate self-check protocols in Camentra's system prompt (sections 6 and 13). Identity Kit should set temperature per call class:

| Call class | Temperature | Rationale |
|---|---|---|
| `ai_enhanced` section rewrites (Brief, Style Guide, Voice page 1–2) | 0.3 | Faithful to scaffold; minimize drift. |
| Strategy Memo: archetype, tensions, audience, hierarchy, roadmap | 0.3 | Analytical; consistency over flair. |
| Strategy Memo: contrarian angle, problem story | 0.5 | Strategic POV needs some bite. |
| Strategy Memo: manifesto (when shipped) | 0.7 | Aspirational; lean creative. |
| CSP: bios, content pillars, caption starters, CTA variations | 0.7 | Voice and creativity matter. |
| Voice page 3: email templates, before/after rewrites | 0.5 | Voice-faithful but readable. |
| Brand Audit observations | 0.3 | Empirical claims; consistency over flair. |
| Moodboard caption | 0.6 | Evocative but grounded. |

Bake these into per-section call configs so the `callClaude` adapter doesn't have to know.

### 6.3 Correct refusal detection

Camentra (`index.ts:1570-1573`):

```ts
refused =
  claudeData.stop_reason === "content_block_stop" ||   // ← this value doesn't exist
  !rawJson.trim() ||
  !rawJson.startsWith("{")
```

Claude's actual `stop_reason` values: `end_turn`, `max_tokens`, `stop_sequence`, `tool_use`, `pause_turn`, **`refusal`**. The current Camentra check only fires on empty/non-JSON responses (which are parse failures, not refusals).

```ts
// CORRECT for Identity Kit
if (response.stop_reason === "refusal") {
  throw new SafetyRefusalError("Model refused on safety grounds")
}
if (response.stop_reason === "max_tokens") {
  throw new TruncationError("Response truncated — increase max_tokens for this section")
}
```

### 6.4 Retry / backoff via the official Anthropic SDK

Camentra uses raw `fetch` with no retry. Anthropic's `529 Overloaded` and `5xx` are transient and meant to be retried. For Identity Kit's ~12 parallel calls per kit, one untimed retry kills the whole fulfillment.

**Use the official SDK** (`@anthropic-ai/sdk`) which has built-in retry with exponential backoff:

```ts
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  maxRetries: 3,                  // SDK default is 2; 3 is fine for our shape
  timeout: 60_000,                // 60s ceiling per call
})
```

Retries handle 408, 409, 429, and 5xx transparently. Anything you'd catch in the raw-fetch flow you still catch around the SDK call — it just stops surfacing the retryable cases.

### 6.5 URL-based image source for Brand Audit

Camentra base64-embeds because the mobile client has a local file. Identity Kit's images live in Supabase Storage already (`step6.logoUpload`, `step6.referenceImage`). Use Claude's URL source:

```ts
{
  type: "image",
  source: {
    type: "url",
    url: "https://<project>.supabase.co/storage/v1/object/sign/identity-kit-uploads/...",
  },
}
```

The signed URL needs to be valid for at least the duration of the Anthropic call (signed URLs default 1h is plenty). Anthropic fetches the image directly; no base64 step, smaller request body, faster requests.

**Server-side validation before sending:** dimension cap (max 8000×8000), size cap (5MB), MIME allowlist (`image/jpeg`, `image/png`, `image/webp`, `image/gif`). If the user uploaded SVG, rasterize to PNG via `sharp` first — Anthropic doesn't accept SVG.

---

## 7. The Identity Kit AI adapter contract

This is what `packages/generation/src/ai/client.ts` should expose.

### 7.1 Types

```ts
import type Anthropic from "@anthropic-ai/sdk"

type SectionModel =
  | "claude-sonnet-4-5"     // default — section rewrites, CSP, Voice p3, Audit
  | "claude-opus-4-5"       // Strategy Memo only
  | "claude-haiku-4-5"      // optional cheap-path for moodboard caption / ranker

type CacheableSystemBlock = {
  text: string                                        // the static system prompt
  cacheKey?: string                                   // optional human label for observability
}

type UserBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: ImageSource }            // URL preferred; base64 fallback

type ImageSource =
  | { type: "url"; url: string }
  | { type: "base64"; mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; data: string }

interface CallClaudeOpts<T> {
  /** Per-call class controls temperature, model, and max_tokens defaults. */
  callClass:
    | "section_rewrite"
    | "strategy_memo_analytical"
    | "strategy_memo_creative"
    | "csp_creative"
    | "voice_page3"
    | "brand_audit"
    | "moodboard_caption"
    | "moodboard_ranker"
  system: CacheableSystemBlock                        // ALWAYS cached
  userBlocks: UserBlock[]                             // dynamic context + optional image
  schema: Record<string, unknown>                     // JSON schema for output
  /** Optional overrides — usually leave to defaults from callClass. */
  model?: SectionModel
  maxTokens?: number
  temperature?: number
  /** Correlation id for structured logging across all calls in one kit fulfillment. */
  kitOrderId: string
  /** Section name for log labelling (e.g. "brief.idealCustomer"). */
  sectionName: string
}

interface CallClaudeResult<T> {
  data: T                                             // parsed + schema-validated response
  meta: {
    model: SectionModel
    inputTokens: number
    cachedInputTokens: number
    outputTokens: number
    stopReason: string
    elapsedMs: number
  }
}
```

### 7.2 Call class defaults

The adapter owns these defaults so call sites stay clean.

| `callClass` | Default model | Default max_tokens | Default temperature |
|---|---|---|---|
| `section_rewrite` | sonnet-4-5 | 600 | 0.3 |
| `strategy_memo_analytical` | opus-4-5 | 500 | 0.3 |
| `strategy_memo_creative` | opus-4-5 | 400 | 0.5–0.7 (per section) |
| `csp_creative` | sonnet-4-5 | 700 | 0.7 |
| `voice_page3` | sonnet-4-5 | 800 | 0.5 |
| `brand_audit` | sonnet-4-5 | 700 | 0.3 |
| `moodboard_caption` | sonnet-4-5 | 250 | 0.6 |
| `moodboard_ranker` | sonnet-4-5 | 400 | 0.2 |

Call sites only set `maxTokens` / `temperature` when overriding a default. Single source of truth for "what model runs which section."

### 7.3 The adapter body

```ts
export async function callClaude<T>(opts: CallClaudeOpts<T>): Promise<CallClaudeResult<T>> {
  const config = CALL_CLASS_DEFAULTS[opts.callClass]
  const model = opts.model ?? config.model
  const maxTokens = opts.maxTokens ?? config.maxTokens
  const temperature = opts.temperature ?? config.temperature

  const start = Date.now()
  logAiCall.start(opts.kitOrderId, opts.sectionName, { model, temperature })

  let response: Anthropic.Messages.Message
  try {
    response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: [
        {
          type: "text",
          text: opts.system.text,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: opts.userBlocks.map(toAnthropicBlock) }],
      output_config: {
        format: { type: "json_schema", schema: opts.schema },
      },
    })
  } catch (err) {
    logAiCall.error(opts.kitOrderId, opts.sectionName, err)
    throw mapAnthropicError(err)
  }

  if (response.stop_reason === "refusal") {
    throw new SafetyRefusalError(opts.sectionName)
  }
  if (response.stop_reason === "max_tokens") {
    throw new TruncationError(opts.sectionName, maxTokens)
  }

  const textBlock = response.content.find(b => b.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new EmptyResponseError(opts.sectionName)
  }

  let parsed: T
  try {
    parsed = JSON.parse(textBlock.text) as T
  } catch (err) {
    throw new SchemaParseError(opts.sectionName, textBlock.text, err)
  }

  const meta = {
    model,
    inputTokens: response.usage.input_tokens,
    cachedInputTokens: response.usage.cache_read_input_tokens ?? 0,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason ?? "unknown",
    elapsedMs: Date.now() - start,
  }
  logAiCall.success(opts.kitOrderId, opts.sectionName, meta)

  return { data: parsed, meta }
}
```

### 7.4 Typed errors

```ts
export class SafetyRefusalError extends Error { constructor(public section: string) { super(`Safety refusal in ${section}`) } }
export class TruncationError extends Error { constructor(public section: string, public maxTokens: number) { super(`Truncated at max_tokens=${maxTokens} in ${section}`) } }
export class EmptyResponseError extends Error { constructor(public section: string) { super(`Empty response in ${section}`) } }
export class SchemaParseError extends Error { constructor(public section: string, public raw: string, cause: unknown) { super(`Schema parse failed in ${section}`); this.cause = cause } }
export class AnthropicRateLimitError extends Error {}
export class AnthropicOverloadedError extends Error {}
export class AnthropicAuthError extends Error {}
```

Mapping is in `errors.ts`. The dispatcher (scaffold-and-refine in `OUTPUT_TRANSLATION_SPEC.md` §4.4 / §5.4) catches these and chooses fallback paths:

| Error | Fallback |
|---|---|
| `SafetyRefusalError` | Ship the deterministic scaffold for this section; flag for ops review. |
| `TruncationError` | Single retry with `maxTokens * 1.5`; if still truncates, ship scaffold. |
| `EmptyResponseError` | Single retry; if still empty, ship scaffold. |
| `SchemaParseError` | Single repair pass (resend with the failed output + "this output didn't match the schema"); if still fails, ship scaffold. |
| `AnthropicRateLimitError` | SDK already retried; if surfaced, queue and retry whole kit. |
| `AnthropicOverloadedError` | SDK already retried; degrade gracefully — ship deterministic Core fallback for this kit + ops alert. |
| `AnthropicAuthError` | Fail-fast; this is a config bug, not a runtime condition. |

---

## 8. Schema-from-TypeScript

Avoid the Camentra schema-drift problem by treating TypeScript as source of truth.

**Pattern (Zod):**

```ts
// packages/shared/src/ai/schemas/strategyMemo.ts
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const StrategyMemoSchema = z.object({
  archetype: z.object({
    primary: z.string().max(40),
    secondary: z.string().max(40).optional(),
    reasoning: z.string().max(600),
  }).strict(),
  jtbd: z.object({
    functional: z.string().max(280),
    emotional: z.string().max(280),
    social: z.string().max(280),
  }).strict(),
  // ... etc
}).strict()

export type StrategyMemo = z.infer<typeof StrategyMemoSchema>

export const StrategyMemoJsonSchema = zodToJsonSchema(StrategyMemoSchema, {
  target: "openApi3",
  $refStrategy: "none",
})
```

`.strict()` on every object compiles to `additionalProperties: false`. Then call sites just use:

```ts
import { StrategyMemoSchema, StrategyMemoJsonSchema, type StrategyMemo } from "@identity-kit/shared/ai/schemas/strategyMemo"

const result = await callClaude<StrategyMemo>({
  schema: StrategyMemoJsonSchema,
  // ...
})

// Runtime validation for belt-and-suspenders
const validated = StrategyMemoSchema.parse(result.data)
```

Schema and type can never drift; runtime validation catches the rare case where Claude violates the schema despite structured outputs.

---

## 9. Cost telemetry

Camentra logs `model_used` per analysis row but doesn't log token counts. For Identity Kit's $11.80 marginal-cost target, we need actual cost-per-kit visibility.

Add to the `ai_call_logs` table per kit fulfillment:

```sql
create table public.ai_call_logs (
  id uuid primary key default gen_random_uuid(),
  kit_order_id uuid not null references public.orders(id),
  section_name text not null,                          -- e.g. "brief.idealCustomer"
  call_class text not null,                            -- matches CallClaudeOpts.callClass
  model text not null,
  input_tokens integer not null,
  cached_input_tokens integer not null default 0,
  output_tokens integer not null,
  stop_reason text not null,
  elapsed_ms integer not null,
  error_class text,                                    -- typed error name when failed
  created_at timestamptz not null default now()
);
create index ai_call_logs_kit_order_id_idx on public.ai_call_logs(kit_order_id);
```

Then a per-kit cost rollup is a simple aggregate:

```sql
select kit_order_id,
       sum( input_tokens * input_rate(model)
          + cached_input_tokens * cached_rate(model)
          + output_tokens * output_rate(model)
       ) as cost_dollars
from public.ai_call_logs
group by kit_order_id;
```

This is the metric that tells us whether we're actually inside the $11.80 envelope. Without it, the cost claim in `PRO_KIT_STRATEGY.md` §1.4 stays theoretical.

---

## 10. Parallelization

`PRO_KIT_STRATEGY.md` §10 says: *"Run sections in parallel (Anthropic SDK supports concurrency); cache static prefix; bound each section ~500 output tokens. ~12 parallel Sonnet 4.5 calls + 1 Opus call stays under 90s."*

Two concurrency considerations the playbook should pin down:

**1. Tier-2 rate limits.** Anthropic's default tier-2 limits (~50 RPM for Sonnet, ~20 RPM for Opus at the time of writing) easily absorb 12 parallel calls per kit even at modest concurrency. But if Pro fulfillment volume grows, plan to request tier-3+ limits proactively — a queue of 5 simultaneous Pro fulfillments × 12 calls = 60 RPM before retries.

**2. Cache-warming order.** First call against a given (industry, narrator) combo populates the cache; subsequent calls in the same kit get the discount. For best economics:

```ts
// Sequential first call (warms cache for this kit's industry/narrator profile)
const firstSection = await callClaude({ sectionName: "brief.snapshot", ...})

// Parallel rest (all benefit from cache)
const [briefIdealCustomer, briefDifferentiation, voicePart1, voicePart2, ...] =
  await Promise.all([
    callClaude({ sectionName: "brief.idealCustomer", ...}),
    callClaude({ sectionName: "brief.differentiation", ...}),
    // ...
  ])
```

Cost saving: cached tokens are ~10% of base. Skip the warm-up and the first ~5 calls in the parallel batch all pay full input rate. Warm-up adds 1.5s of latency for ~$0.20 of cost savings per kit — worth it.

Strategy Memo (Opus) runs as its own sequential block since its system prompt is different from Sonnet sections and warming is per-prompt.

**Per-kit orchestration (where this fan-out runs).** Concurrency strategy above is the per-call view. The per-kit lifecycle — webhook handoff, idempotent fulfillment task, fan-out to ~26 Section IDs, walker chain, per-PDF assembler, Storage upload, email — is locked in [`PRO_FULFILLMENT_ORCHESTRATION.md`](./PRO_FULFILLMENT_ORCHESTRATION.md). That doc is the source of truth for orchestrator location, state machine, failure semantics across layers, and the `kit_fulfillment_events` schema. This §10 covers concurrency within the fan-out only.

---

## 11. Acceptance criteria — what "Pro-A done" means

Mapping to `PRO_KIT_STRATEGY.md` §11 Pro-A row (*"AI plumbing: Anthropic client + prompt registry + structured outputs + scaffold-and-refine helper + claim-safety walker on AI output. First `ai_enhanced` Brief/Voice section produces meaningfully different Pro output."*), expanded with the playbook's specifics:

- [ ] `@anthropic-ai/sdk` installed; `ANTHROPIC_API_KEY` wired from `.env` to the generation worker.
- [ ] `packages/generation/src/ai/client.ts` exports `callClaude<T>` per §7.3 above.
- [ ] Call-class defaults table per §7.2 lives in `client.ts` (not duplicated at call sites).
- [ ] Typed errors per §7.4 with mapping table; scaffold-and-refine dispatcher in `packages/generation/src/ai/dispatcher.ts` uses the mapping.
- [ ] System prompts use `cache_control: { type: "ephemeral" }`; dynamic context lives in user-message blocks only.
- [ ] Zod-derived schemas in `packages/shared/src/ai/schemas/`; runtime `.parse()` after structured-output JSON.parse.
- [ ] Sanitization helpers per §4.2 in `packages/generation/src/ai/sanitizers.ts`; banned-vocab walker extended for strategist jargon (`PRO_KIT_STRATEGY.md` §8.4).
- [ ] `ai_call_logs` migration applied with the schema in §9; every `callClaude` invocation writes a row.
- [ ] At least one `ai_enhanced` section (recommended: `brief.idealCustomer`) actually runs through the adapter on the `established-pro` fixture and produces output noticeably different from Core for the same intake.
- [ ] Refusal pathway tested with a deliberate safety prompt; produces `SafetyRefusalError`, dispatcher ships deterministic scaffold, kit completes.
- [ ] Truncation pathway tested with a deliberately tiny `maxTokens`; retry-with-1.5x fires, succeeds.
- [ ] Schema parse-error pathway tested by intentionally breaking the schema; repair pass fires, deterministic scaffold ships on second failure.
- [ ] Cost telemetry visible: a sample fulfillment's `ai_call_logs` rows aggregate to a sane per-kit cost figure (target <$4 in Anthropic for the AI portion of `PRO_KIT_STRATEGY.md` §1.4).
- [ ] Prompt registry directory exists at `packages/generation/src/ai/prompts/` per §12.11; `index.ts` exports the active version per call class; dispatcher imports from `index`, never directly from versioned files.
- [ ] `buildSystemPrompt.ts` renders the §12.8 template from the §12.3 canonical sources; snapshot test covers all 8 Pro fixtures × all call classes.
- [ ] Walker registry under `packages/generation/src/ai/walkers/` ships banned-vocab, word-budget, citation, em-dash, and scene-variety walkers per §12.10; CI fails on any walker failure for the `established-pro` fixture.

---

## 12. AI prompt instructional layer

This section is the source of truth for what goes *inside* the prompts — persona, voice, guardrails, citation discipline, refusal protocol, output format, and per-section task templates. §3–§9 above cover the **plumbing** (adapter, caching, structured outputs, retries); this section covers the **content** the plumbing sends. The voice and guardrail rules are inherited from canonical source files by injection at call time and are never duplicated as prose here — if a rule looks wrong, fix it in the source file and the prompt builder picks it up on the next run.

One clarification before the rest of the section: **"Brand Alchemy" is the parent company brand** (per [`.cursor/rules/brand-alchemy-visual.mdc`](../../.cursor/rules/brand-alchemy-visual.mdc) → sibling `BRAND_GUIDELINES.md`) and governs **product UI / app marketing chrome only**. **Customer kit voice comes from the buyer's intake** — tone preset × sliders × `customVoiceNotes` × narrator profile × industry profile. The prompt layer enforces the customer-kit voice contract; it has nothing to do with parent-brand marketing voice.

### §12.1 What this section is

§12.2–§12.7 define the shared base layer (persona, contracts, discipline, refusal, format). §12.8 is the assembled base system prompt template, cached on every call. §12.9 is the per-section task prompt catalog covering all ~26 Pro AI calls. §12.10 is the walker registry that turns the prompt rules into enforceable CI gates. §12.11 is the directory and versioning protocol. §12.12 records the two decisions locked at plan time and the one list that grows during fixture review.

### §12.2 Persona

Locked role statement — paste as the single role paragraph in every system prompt:

> You are an in-house brand strategist for one specific small business. You have just read this business's intake form. Your job is to write one section of one deliverable in their voice, grounded in their specific answers, on behalf of an Identity Kit Pro fulfillment pipeline. You are not a chatbot, a copywriter on a marketplace, a logo designer, or a marketing-advice columnist. You do not have your own taste — you have *this* brand's taste, expressed through the inputs you've been given.

What the model **is not** (anti-personas — these are the failure modes prompts collapse into when they go bad):

- Not a chatbot. Does not greet, apologize, or explain what it's about to do. Returns the structured payload.
- Not a thought-leader. Does not editorialize, predict industry trends, or volunteer opinions outside the section it was asked to write.
- Not a copy editor. Does not "improve" the inputs; grounds in them.
- Not a logo designer or art director. Visual decisions are already made by the deterministic compiler — does not propose, describe, or critique colors, fonts, or layouts outside the bounds of the specific call (e.g. Brand Audit, which has its own narrow brief).
- Not a consultant pitching the next engagement. No "next steps to discuss," no "schedule a follow-up," no upsell language.

### §12.3 Inherited contracts — single source of truth

The prompt builder reads voice and guardrail rules from canonical source files at call time and renders the voice-contracts block of the system prompt from them. The markdown of those contracts does not live in this doc — only the rule-to-source mapping does. This is what keeps deterministic Core and AI Pro from drifting apart.

| Voice / guardrail dimension | Canonical source | Injected into the prompt as |
|---|---|---|
| Global writing rules (reader-facing) | [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1.0.1 | Voice contracts block — bullet list |
| Reader-facing banned vocab | [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.9 + [`packages/generation/src/core-pdfs.test.ts`](../../packages/generation/src/core-pdfs.test.ts) `bannedPatterns` | Voice contracts block — rendered list, deduped |
| Title-slot bans + em-dash budget | [`packages/generation/src/core-pdfs.test.ts`](../../packages/generation/src/core-pdfs.test.ts) `bannedPatterns` walker | Voice contracts block — explicit rules |
| Tone preset adjectives + slider bucket words | [`packages/generation/src/deterministic/coreAssembly.ts`](../../packages/generation/src/deterministic/coreAssembly.ts) `toneProfileBody` / `voiceGuardrailsBody` | Brand context block — `{{toneProfileSentence}}` |
| Tone precedence (`customVoiceNotes` → preset → sliders) | [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §7 | Voice contracts block — explicit rule |
| Industry preferred terms + avoid terms + compliance | [`packages/generation/src/deterministic/industryProfiles.ts`](../../packages/generation/src/deterministic/industryProfiles.ts) | Brand context block — `{{industryVoiceProfile}}` + voice contracts block (avoid terms appended to banlist) |
| Narrator themes, sample phrases, CTA patterns | [`packages/generation/src/deterministic/narratorProfiles.ts`](../../packages/generation/src/deterministic/narratorProfiles.ts) | Brand context block — `{{narratorVoiceProfile}}` |
| CTA copy rules + paste-ready avoid list | [`packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md`](../../packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md) | Voice contracts block — added only on CTA-producing calls |
| Meta-commentary bans (no "as a brand," no "in a friendlier tone") | [`packages/generation/src/deterministic/brandIdentityGuideModel.ts`](../../packages/generation/src/deterministic/brandIdentityGuideModel.ts) before/after rubric | Voice contracts block — explicit rules |
| Strategist-jargon banlist (Memo + Audit only) | [`PRO_KIT_STRATEGY.md`](../audits/PRO_KIT_STRATEGY.md) §8.4 + §12.9 starter list below | Voice contracts block — appended only on Strategy Memo / Brand Audit calls |

### §12.4 Output discipline

Each rule below corresponds to a walker check in §12.10. The prompt teaches the rule; the walker enforces it.

1. **Specificity.** Every paragraph references at least one concrete fact from intake (named offer, named transformation, painPoint, customer archetype, industry-specific signal, voice-sample phrasing). A sentence that could ship verbatim in a different kit with the same narrator × industry is a failure mode.
2. **No meta-commentary.** Banned patterns: `as a brand`, `your brand reads`, `your positioning`, `we should sound`, `in a friendlier tone`, `archetype` (as a noun referring to the kit itself), `narrator`, `persona`. The model writes *as* the brand, never *about* it. Strategy Memo is the one exception — its sections are explicitly analytical-about-the-brand and the meta-commentary walker is disabled on those calls.
3. **No filler openers.** Banned at sentence and paragraph starts: `Excited to share`, `We are pleased to announce`, `In today's world`, `In this fast-paced`, `I just wanted to`, `Just wanted to follow up`, `Hope this finds you well`.
4. **Word budgets are hard caps.** Per-call budget in §12.9. Truncate at word boundary if the model overshoots — never pad to hit a minimum.
5. **Em-dash budget ≤ 1 per paragraph.** Inherited from the `core-pdfs.test.ts` walker.
6. **No fabricated metrics, superlatives, or social proof.** Banned: invented percentages, customer counts, awards, "industry-leading," "world-class," "best-in-class," "guaranteed." If the intake does not contain the number, claim, or proof, the output cannot contain it.
7. **No CTAs outside CTA-producing calls.** Core rewrites and Strategy Memo sections do not write CTAs. CTAs belong on folio 05 (deterministic) and the dedicated CTA-producing calls in §12.9.

### §12.5 Citation discipline

Every analytical claim, messaging pillar proof point, JTBD anchor, tension observation, and audit finding grounds in a specific intake field. The structured output for every AI call includes a `fieldsCited: string[]` array listing the intake field names (e.g. `["differentiation", "voiceSamples[2]", "painPoints[0]"]`) the section grounded in. If a claim cannot cite a field, it is **demoted, not invented** — the section ships shorter, with fewer pillars / fewer tensions / no narrative, never with fabricated proof.

**Field-name format:**

- Top-level field: `differentiation`
- Array element (zero-indexed): `voiceSamples[2]`
- Nested field: `existingBrand.colorMoodNotes`
- Multiple grounding fields: one entry each in `fieldsCited`

Walker enforcement (full registry in §12.10): `fieldsCited[]` is non-empty for every output; every field name resolves to a real field on the canonical `IdentityKitForm` Zod schema; for Strategy Memo §6 messaging hierarchy, every individual `proofPoints[]` entry includes a `fieldCited: string` — pillar-level citation is mandatory, not aggregate.

### §12.6 Refusal & insufficient-substance protocol

Two structured exits the model is taught.

**Safety refusal** — inputs that trigger Anthropic safety or request unsafe claims:

```json
{
  "refused": true,
  "reason": "<short, plain-English reason — e.g. 'requested medical efficacy claim without supporting documentation'>"
}
```

Pairs with the corrected `stop_reason === "refusal"` check in §6.3. Dispatcher catches `SafetyRefusalError`, ships the deterministic scaffold for that section, continues the rest of the kit.

**Insufficient substance** — optional sections only (Strategy Memo §8 narrative, Brand Audit when image quality is too low, moodboard caption when the bank shortlist is degraded):

```json
{
  "ship": false,
  "reason": "insufficient_substance",
  "fieldsChecked": ["differentiation", "competitors", "painPoints", "transformation"]
}
```

`fieldsChecked` lists the fields the model evaluated against the substance threshold; aids debugging when a section unexpectedly skips. Dispatcher omits the section from the PDF.

Two hard rules:

- Never return `{ "ship": false }` for a **required** section (Strategy Memo §1–§7, Core rewrites, CSP sections, Voice page 3, Brand Audit §1–§4, moodboard ranker). Required sections always ship — if the model cannot write them, the dispatcher ships the deterministic scaffold.
- Never return partial content alongside a refusal or skip. Return the structured exit only.

### §12.7 Output format contract

Closing rule of the shared base prompt:

> Respond with exactly the JSON object matching the provided schema. No preamble, no closing prose, no markdown fences, no commentary. The first character of your response is `{` and the last character is `}`. If you cannot produce a valid response, return the refusal or insufficient-substance shape per §12.6.

Belt-and-suspenders with `output_config.format: { type: "json_schema", ... }` from §4.1, but explicit instruction reduces the rate of pre- and post-amble tokens the schema constraint silently drops.

### §12.8 The shared base system prompt

The cacheable static prefix used by every Pro AI call. Block ordering is locked. The prompt builder (`packages/generation/src/ai/prompts/buildSystemPrompt.ts`) renders the `{{placeholder}}` blocks at call time from the canonical sources in §12.3. The per-section task prompt (§12.9) is sent as the user-message content block, **not** appended to the system prompt — keeping the system prompt fully cacheable. For vision calls, the image content block precedes the task-prompt text block in the user message per §3 multimodal ordering.

```text
# ROLE

You are an in-house brand strategist for one specific small business. You have
just read this business's intake form. Your job is to write one section of one
deliverable in their voice, grounded in their specific answers, on behalf of an
Identity Kit Pro fulfillment pipeline.

You are not a chatbot, a copywriter on a marketplace, a logo designer, or a
marketing-advice columnist. You do not have your own taste — you have *this*
brand's taste, expressed through the inputs you've been given.

# WHAT YOU ARE NOT
- Not a chatbot. Do not greet, apologize, or explain what you're about to do.
- Not a thought-leader. Do not editorialize or predict industry trends.
- Not a copy editor. Do not "improve" the inputs; ground in them.
- Not an art director. Visual decisions are already made; do not propose colors,
  fonts, or layouts outside the bounds of the specific call you were given.
- Not a consultant pitching the next engagement. No "next steps to discuss".

# BUYER SELECTION LOCK (no kit-contradiction rule)

The buyer has already chosen the kit's direction:
- selectedPalette  = {{selectedPaletteId}}
- selectedStyle    = {{selectedStyleId}}
- tonePreset       = {{tonePresetId}}
- brandNarrator    = {{brandNarratorId}}

These selections are LOCKED for every section you write. You may NOT:
- recommend the buyer change selectedPalette, selectedStyle, tonePreset, or
  brandNarrator;
- propose a "different direction" or imply that another preset would suit them
  better;
- frame tensions as reasons to reconsider the kit's foundational selections.

You MAY (and should):
- surface productive tensions WITHIN the chosen direction (e.g. "your bold tone
  invites confident phrasing; your origin story leans reserved — sharpening the
  origin's confidence would strengthen the tone you already chose");
- recommend evolving the buyer's EXISTING brand assets (logo, existing typeface,
  hex colors they uploaded) to better align with the kit's chosen direction —
  the Brand Audit's whole purpose is to bridge existing brand → chosen
  direction;
- surface application-level recommendations (touchpoint priority, channel mix,
  copy hierarchy) that work within the locked selections.

Every Pro buyer also receives the Core deterministic sections that codify these
selections (palette swatches, style principles, tone profile, narrator voice).
A reader holding the Style Guide and the Strategy Memo at the same time must
not see one document undermine the other.

# BRAND CONTEXT

## Business
{{businessContext}}            # step1 + businessDescription + offer + transformation

## Audience
{{audienceContext}}            # step2 + customerArchetype + painPoints + desiredOutcomes

## Voice (PRECEDENCE: customVoiceNotes > tonePreset > voiceSliders)
{{voiceContext}}               # step3 + tonePreset + sliders + customVoiceNotes + voiceSamples

## Values & origin
{{valuesContext}}              # step4 + values + missionStatement + step5 + originSummary

## Visual & positioning
{{visualPositioningContext}}   # step6 + step7 + competitors + differentiation

## Industry voice profile
{{industryVoiceProfile}}       # industryProfiles.ts row: preferredTerms, avoidTerms, toneModifier, complianceNote

## Narrator voice profile
{{narratorVoiceProfile}}       # narratorProfiles.ts row: themes, samplePhrases, ctaPatterns

# VOICE CONTRACTS

## Tone profile
{{toneProfileSentence}}        # rendered from coreAssembly.toneProfileBody()

## Writing rules
- Specificity: every paragraph references at least one concrete fact from BRAND CONTEXT.
- No meta-commentary about the brand itself (no "as a brand", "your positioning", "in a friendlier tone").
- No filler openers ("Excited to share", "In today's world", "Just wanted to").
- Word budget is a hard cap; truncate at word boundary if needed, never pad.
- <= 1 em-dash per paragraph.
- No fabricated metrics, superlatives, social proof, or guarantees.

## Banned vocab
{{bannedVocabList}}            # OUTPUT_TRANSLATION_SPEC §10A.9 + core-pdfs.test.ts bannedPatterns
                               # + industry avoidTerms + (Memo / Audit only:) strategist-jargon banlist

## Do / avoid (tone-conditioned)
{{toneDoAvoidLines}}           # coreAssembly.writingDoAvoidBody() + coreAssembly.voiceGuardrailsBody()

# CITATION DISCIPLINE

Every claim grounds in a specific intake field. Your structured output includes
a `fieldsCited: string[]` array of the intake field names you used. Field-name
format: `differentiation`, `voiceSamples[2]`, `existingBrand.colorMoodNotes`.

If a claim cannot cite a field, demote the claim: ship fewer pillars, fewer
tensions, no narrative. Never invent proof to hit a minimum count.

# REFUSAL & INSUFFICIENT-SUBSTANCE PROTOCOL

If an input requests unsafe content (illegal claims, fabricated efficacy,
guarantee language in regulated industries), return:
  { "refused": true, "reason": "<short plain reason>" }

If you are writing an OPTIONAL section (Strategy Memo §8 narrative, Brand Audit
with degraded image, moodboard caption with degraded bank) and inputs do not
clear the substance threshold, return:
  { "ship": false, "reason": "insufficient_substance", "fieldsChecked": [...] }

Required sections always ship — if you cannot write a required section, do your
best with the inputs you have. Never return partial content alongside a
refusal or skip.

# OUTPUT FORMAT

Respond with exactly the JSON object matching the provided schema. No preamble,
no closing prose, no markdown fences, no commentary. First character `{`, last
character `}`.
```

```text
<!-- cache breakpoint here: messages[0].content[0].cache_control = { type: "ephemeral" } -->
```

Everything above the cache-breakpoint marker is identical across all calls in a single kit fulfillment and benefits from prompt caching per §6.1.

### §12.9 Per-section task prompt catalog

Every Pro AI call belongs to one of six classes below. The catalog table is the at-a-glance contract for the entire Pro fulfillment; the sub-sections that follow give the task-prompt template, schema notes, banned-vocab additions, grounding requirements, and failure mode for each class.

| Call class | Model | Calls per kit | Words per call (cap) | Output schema (key fields) | `fieldsCited` | Strategist-jargon walker | Extras |
|---|---|---|---|---|---|---|---|
| Core section rewrites | Sonnet 4.5 | ~12 | ≤ 120 | `{ rewrittenProse, fieldsCited }` | yes | no | one parameterized template across all sections |
| CSP — brand summary one-liner | Sonnet 4.5 | 1 | ≤ 20 | `{ oneLiner, fieldsCited }` | yes | no | — |
| CSP — brand summary elevator | Sonnet 4.5 | 1 | ≤ 60 | `{ elevator, fieldsCited }` | yes | no | — |
| CSP — brand summary paragraph | Sonnet 4.5 | 1 | ≤ 120 | `{ paragraph, fieldsCited }` | yes | no | — |
| CSP — bio short | Sonnet 4.5 | 1 | ≤ 80 | `{ bio, fieldsCited }` | yes | no | — |
| CSP — bio long | Sonnet 4.5 | 1 | ≤ 180 | `{ bio, fieldsCited }` | yes | no | — |
| CSP — caption starters | Sonnet 4.5 | 1 | ≤ 200 (~8 × 25w) | `{ starters: { text, fieldsCited }[] }` | per starter | no | — |
| CSP — content pillars | Sonnet 4.5 | 1 | ≤ 120 (3–4 × 30w) | `{ pillars: { name, oneLine, fieldsCited }[] }` | per pillar | no | — |
| CSP — paste-ready CTAs | Sonnet 4.5 | 1 | n/a (6–8 × ≤ 8w) | `{ ctas: { surface, phrase, fieldsCited }[] }` | per CTA | no | inherits `CTA_COPY_RULES.md` |
| Voice page 3 — email templates | Sonnet 4.5 | 2–3 | ≤ 180 per template | `{ subject, body, fieldsCited }` | yes | no | one call per template (welcome, follow-up, …) |
| Voice page 3 — before/after rewrites | Sonnet 4.5 | 1 (4–5 pairs) | ≤ 500 total | `{ pairs: { before, after, fieldsCited }[] }` | per pair | no | "before" is generic, "after" is in-voice |
| Voice page 3 — CTA variations | Sonnet 4.5 | 3–4 (per surface) | n/a (3–4 × ≤ 8w per surface) | `{ surface, anchor, variations: { phrase, intent, fieldsCited }[] }` | yes | no | anchor = deterministic folio-05 CTA; inherits `CTA_COPY_RULES.md` |
| Strategy Memo §1 archetype | Opus 4.5 | 1 | ≤ 80 | `{ archetypePrimary, archetypeSecondary?, paragraph, fieldsCited }` | yes | yes | Mark + Pearson 12-archetype framework |
| Strategy Memo §2 JTBD | Opus 4.5 | 1 | ≤ 150 (3 × ~50w) | `{ functional, emotional, social, fieldsCited }` | yes | yes | — |
| Strategy Memo §3 behavioral audience | Opus 4.5 | 1 | ≤ 120 | `{ description, fieldsCited }` | yes | yes | — |
| Strategy Memo §4 tensions | Opus 4.5 | 1 | ≤ 75 (2–3 × ~25w) | `{ tensions: { observation, resolution, fieldsCited }[] }` | per tension | yes | min 2 tensions or demote to single best |
| Strategy Memo §5 contrarian angle | Opus 4.5 | 1 | ≤ 80 | `{ angle, defensibility, fieldsCited }` | yes | yes | — |
| Strategy Memo §6 messaging hierarchy | Opus 4.5 | 1 | ≤ 180 | `{ valueProposition, pillars: { name, valueLine, proofPoints: { text, fieldCited }[] }[], primaryMessage, fieldsCited }` | **per pillar AND per proof point** | yes | pillars without citable proof get demoted (3 solid > 4 aspirational) |
| Strategy Memo §7 90-day roadmap | Opus 4.5 | 1 | ≤ 120 (3 × ~40w) | `{ items: { title, reasoning, activatesPillars: string[], fieldsCited }[] }` | per item | yes | items reference pillar names from §6 |
| Strategy Memo §8 conditional narrative | Opus 4.5 | 1 | ≤ 150 or skip | `{ narrativeType: "problem_story" \| "manifesto" \| "skipped", body?, fieldsCited?, fieldsChecked?, reason? }` | when shipped | yes | substance threshold validated in walker |
| Brand Audit §1 what we saw | Sonnet 4.5 + vision | 1 (multimodal) | ≤ 160 (4 × ~40w) | `{ logoObservation?, referenceImageObservation?, voiceSamplesObservation?, websiteObservation?, fieldsCited }` | per observation | yes | image inputs via signed URL per §6.5 |
| Brand Audit §2 where it's serving you | Sonnet 4.5 | 1 | ≤ 100 | `{ paragraph, fieldsCited }` | yes | yes | grounded in §1 observations |
| Brand Audit §3 where there's tension | Sonnet 4.5 | 1 | ≤ 120 | `{ tensions: { observation, resolution, fieldsCited }[] }` | per tension | yes | "worth resolving" tone, never "wrong" |
| Brand Audit §4 recommendations | Sonnet 4.5 | 1 | ≤ 120 (3–4 × ~30w) | `{ recommendations: { action, rationale, priority: 1\|2\|3\|4, fieldsCited }[] }` | per item | yes | — |
| Moodboard ranker | Haiku 4.5 | 1 | ≤ 150 (6–9 × ~20w) | `{ picks: { imageId, reasoning }[] }` | no | no | input shortlist 20–30 IDs; scene-variety constraint enforced in walker |
| Moodboard caption | Haiku 4.5 | 1 | ≤ 80 | `{ caption, fieldsCited }` | yes | no | grounded in selected image IDs + palette + style + mood adjectives |

Every task prompt opens with the same persona-recall line — *"Per the brand context and voice contracts in your system prompt, write …"* This is the cheapest way to combat persona drift inside the call.

**Visual grounding reminder.** Every Pro task prompt receives `selectedPalette`, `selectedStyle`, and `moodAdjectives[]` via the system-prompt `{{visualPositioningContext}}` block (per [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.9.3). For sections where the visual register noticeably shapes the copy (Style Guide rewrites, Voice Playbook tone closer, Brand Identity Guide folio 02a/02b paragraphs, Strategy Memo archetype + contrarian angle, Brand Audit observations, Moodboard caption), the **task prompt body should additionally name `selectedStyle` explicitly** — e.g. *"this kit's selected style is `luxe_refined`; the copy should resonate with that register without naming it"*. Relying on the context block alone produces measurably more on-palette/style-agnostic prose; the explicit reference inside the task prompt anchors the language.

#### §12.9.1 Core section rewrites (Sonnet)

**Purpose.** For every `ai_enhanced` section in the shared 5 Core PDFs (Brand Brief, Style Guide, Voice Playbook pages 1–2, Quick Start, Brand Identity Guide), rewrite the deterministic scaffold prose so it reads as specifically about this business.

**Task prompt template:**

```text
Per the brand context and voice contracts in your system prompt, rewrite the
section identified by {{sectionId}} so it reads as specifically about this
business. The deterministic scaffold for this section is:

---
{{scaffoldProse}}
---

Stay within the section's intent (do not change the topic) and length (hard
cap {{wordCap}} words). Anchor every paragraph in at least one specific intake
fact from the brand context. The BUYER SELECTION LOCK in your system prompt
applies — your rewrite must remain consistent with the buyer's selectedStyle,
selectedPalette, tonePreset, and brandNarrator. A Style Guide rewrite for a
`bold_graphic` kit must still read as bold and graphic; a Voice Playbook
rewrite for a `warm_inviting` tone must not introduce a different register.
Return the rewritten prose plus the intake field names you grounded in.
```

**Schema.** `{ rewrittenProse: string, fieldsCited: string[] }`. `wordCap` is passed in per `sectionId` from the Mode Matrix.

**Banned-vocab additions.** None beyond the inherited list.

**Grounding requirements.** At least one fact from `business_context` / `audience_context` / `voice_context` per paragraph.

**Failure mode.** Dispatcher ships `scaffoldProse` (the deterministic baseline) on safety refusal, second schema-parse failure, or walker failure.

#### §12.9.2 Content Starter Pack (Sonnet) — 7 calls

**Purpose.** Paste-ready applied copy for the buyer to use immediately — brand summaries at three lengths, two bio lengths, caption starters, and content pillars. CSP page 2's CTA section is rendered from `voice.ctaVariations` (§12.9.3) rather than generated by an independent CSP CTA prompt — see the render-alias note below and [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A.1 for the locked single-source contract.

**Task prompt templates** (each opens with the locked persona-recall line):

- One-liner: *"… write a single sentence (≤ 20 words) that introduces this business in their voice."*
- Elevator: *"… write a ~60-word elevator pitch (3–4 sentences) in their voice."*
- Paragraph: *"… write a ~120-word business paragraph (one paragraph, multiple beats: who, for whom, what changes) in their voice."*
- Bio short: *"… write a ~80-word personal/business bio in their voice, suitable for a social-profile bio or speaker blurb."*
- Bio long: *"… write a ~180-word personal/business bio in their voice, suitable for an About page or media kit."*
- Caption starters: *"… write 8 caption-starter phrases the buyer can paste as the opener of social or email posts. Each ≤ 25 words. Vary openers; no two start the same way."*
- Content pillars: *"… propose 3–4 content pillars (a named theme plus a one-line value statement each) anchored in their audience, transformation, and voice. Each ≤ 30 words."*

**CTAs — render alias, not a prompt call.** The CSP page 2 CTA section renders the structured output of `voice.ctaVariations` (§12.9.3). No separate CSP CTA prompt exists; no `csp.ctas.v1.ts` file is created. The CSP page 2 assembler reads from the same `voice.ctaVariations` result object that the Voice Playbook page 3 assembler reads from — guaranteeing identical CTA variations across both PDFs per [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A.1.

**Schemas.** As in the catalog table. Every output field — even sub-array elements — carries its own `fieldsCited`.

**Banned-vocab additions.** None beyond the inherited list for the 7 CSP prompts above. The CTA variation walker chain (banned-vocab + `CTA_COPY_RULES.md` avoid list + em-dash-as-period rule) applies once on the `voice.ctaVariations` output and the result is trusted by both downstream renderers.

**Failure mode.** Dispatcher ships a deterministic single-sentence stub for the failing call so the CSP PDF still assembles. CTA failure is owned by §12.9.3 (`voice.ctaVariations`) — when that call fails for a surface, both CSP page 2 and Voice Playbook page 3 ship the deterministic anchor CTA only for that surface.

#### §12.9.3 Voice Playbook page 3 (Sonnet) — 3 call classes

**Purpose.** Pro-only Voice Playbook extensions — email templates, before/after rewrites, and CTA variations.

**Task prompt templates:**

- Email template: *"… write a {{templateName}} email (subject + body, body ≤ 180 words) in their voice, grounded in their audience and transformation."*
- Before/after rewrites: *"… write 4–5 before/after pairs. The 'before' is a generic phrasing (intentionally bland); the 'after' is the same idea rewritten in this brand's voice. Each pair grounds in different aspects of the brand context (testimonials, transformations, voice samples, tone preset)."*
- CTA variations: *"… given the deterministic anchor CTA for {{surfaceName}} ({{anchorCta}}), produce 3–4 alternative phrasings in the same brand voice but with explicit variation goals (more direct, quieter, more inviting, more confident). Each variation includes its intent. Inherit CTA_COPY_RULES.md."*

**Schemas.** Per catalog table.

**Banned-vocab additions.** CTA variations call inherits `CTA_COPY_RULES.md`.

**Failure mode.** Dispatcher omits the failing sub-section from page 3 — Pro Voice page 3 ships partial rather than blank.

#### §12.9.4 Brand Strategy Memo (Opus) — 8 calls

**Purpose.** The analytical deliverable that justifies the $149 price gap to Core. Eight sections, each its own Opus call. The strategist-jargon walker (banlist below) applies to all 8 calls; the meta-commentary walker is **disabled** here because these sections are explicitly analytical-about-the-brand.

**Task prompt templates** (each opens with: *"Per the brand context and voice contracts in your system prompt, write the {{sectionName}} section of this business's Brand Strategy Memo."*):

- **§1 archetype.** *"Use the Mark + Pearson 12-archetype framework. Identify the primary archetype and optionally a secondary. Write ~80 words explaining why this archetype reads true given the narrator, values, originSummary, tone, and voice samples — and what it means in practice for this business. Cite the intake fields you grounded in."*
- **§2 JTBD.** *"Write three short paragraphs (functional / emotional / social job-to-be-done), ~50 words each. Anchor in customerArchetype, painPoints, desiredOutcomes, transformation. Return separate fields per JTBD type."*
- **§3 behavioral audience.** *"Write a ~120-word behavioral description of the audience: buying triggers, information needs, common objections, resonant language. Anchor in customerArchetype + painPoints + desiredOutcomes + voiceSamples. Replace bland 'they want a premium brand' patterns with specifics."*
- **§4 tensions.** *"Surface 2–3 tensions in this business's brand inputs. Each tension has an observation (what's in conflict) and a one-line resolution recommendation. **Tensions are framed as opportunities to sharpen WITHIN the kit's locked selections (selectedPalette / selectedStyle / tonePreset / brandNarrator — see BUYER SELECTION LOCK in the system prompt), never as reasons to change those selections.** Examples of valid tension: 'local_team operating model but only digital touchpoints — opportunity: bring more of the in-person warmth into the digital channels you already chose,' 'bold tone but reserved origin story — opportunity: rewrite the origin in the bolder register the kit's tone profile commits to.' Examples of INVALID tension framing (will be rejected): 'your tone is too bold for your story — consider softening,' 'your palette doesn't match your audience — pick a different palette.' Each tension cites the specific intake fields whose conflict you're surfacing. If you cannot find 2 citable tensions, return 1; if you cannot find 1, return an empty array — never invent a tension."*
- **§5 contrarian angle.** *"Write ~80 words proposing a defensible contrarian positioning angle. Ground in industry voice profile + competitors. **The angle must be compatible with the kit's locked selections (see BUYER SELECTION LOCK) — it sharpens WHAT the buyer says to the market within their chosen palette/style/tone, not which palette/style/tone they should pick.** Format: most {industry} brands lean X; this business could credibly lean Y because Z. Include why it's defensible."*
- **§6 messaging hierarchy.** *"Write a ~180-word messaging hierarchy: value proposition statement (one specific, comparative, provable sentence in the customer's language), 3–4 messaging pillars (each: name + one-line value statement + 1–2 proof points), and a single primary message anchored on the contrarian angle. Every proof point cites the specific intake field grounding it. Pillars without citable proof points get demoted, not invented — three solid pillars beats four aspirational ones."*
- **§7 90-day roadmap.** *"Write three prioritized items, in order, ~40 words each: title + reasoning + which messaging pillars (by name from §6) it activates. Items are beyond the Quick Start's fixed 4-week structure — focus on what this business specifically should prioritize given its tensions and contrarian angle."*
- **§8 conditional narrative.** *"Decide whether to write a Problem Story, a Brand Manifesto, or skip the section. Substance thresholds: ship Problem Story when differentiation + at least one competitor are substantive (~150 words, diagnostic, anchored on differentiation + competitors + painPoints + transformation); ship Brand Manifesto when values + at least one of missionStatement/originSummary are substantive (~150 words, aspirational, anchored on values + missionStatement + originSummary). If both source sets clear the threshold, ship the Problem Story (more universally useful). If only one clears, ship that one. If neither clears, return ship: false with fieldsChecked listing all four checked fields. Never return both. Return narrativeType ∈ {problem_story, manifesto, skipped}."*

**Schemas.** Per catalog table. §6 messaging hierarchy and §8 narrative have the richest schemas — pillar-level and proof-point-level citation in §6; selector-discriminated union in §8.

**Banned-vocab additions.** Strategist-jargon banlist (below) applies to all 8 calls.

**Grounding requirements.** Every section requires citation. §4 tensions and §6 messaging hierarchy enforce per-item / per-proof-point citation.

**Failure mode.** Strategy Memo PDF fails as a unit only if ≥3 of 8 sections fail — otherwise failed sections are omitted from the PDF and the assembler adjusts pagination. If §1–§7 all fail, the dispatcher ships the deterministic Brand Identity Guide as a replacement and emails ops to investigate.

#### §12.9.5 Brand Audit (Sonnet + vision, conditional) — 4 calls

**Purpose.** Conditional Pro-only PDF, generated when the buyer provided existing-brand inputs (logo upload, reference image, hex inputs, or website URL).

**Task prompt templates:**

- **§1 what we saw** (multimodal): *"Per your system prompt and the attached image(s) and text references, write short observation paragraphs (~40 words each) on whichever of the following are provided: uploaded logo, reference image, voice samples, website URL as text context. Describe visual character / what it signals. Do not invent details not visible in the inputs."*
- **§2 where it's serving you:** *"Write ~100 words on what's working in the existing brand given the strategic direction the rest of this kit recommends. Anchor in your §1 observations and in the kit's named palette, style preset, narrator, and industry."*
- **§3 where there's tension:** *"Write ~120 words surfacing tensions between the **existing brand assets the buyer uploaded** (logo, reference image, hex inputs, URL) and the kit's locked direction (selectedPalette / selectedStyle / tonePreset — see BUYER SELECTION LOCK). The bridge always evolves the existing brand toward the locked direction, never the other way around — do not recommend changing the buyer's palette/style/tone selections. Phrase as 'worth resolving,' never 'wrong.' Use the folio 03 honesty pattern (no fake praise, no cruelty). Each tension has an observation + resolution recommendation, citing the intake fields."*
- **§4 recommendations:** *"Write 3–4 prioritized recommendations to evolve the **existing brand assets** so they align with the kit's chosen direction. Each recommendation acts on uploaded existing-brand inputs (logo, existing typeface, existing hex colors, URL-level surfaces) — not on the kit's locked palette/style/tone selections. Each recommendation has an action, a one-line rationale, a priority (1 highest), and the intake fields grounding it."*

**Schemas.** Per catalog table. §1 is multimodal — image content blocks precede the task-prompt text block.

**Banned-vocab additions.** Strategist-jargon banlist applies to all 4 calls.

**Grounding requirements.** Every section requires citation; §1 multimodal observations cite the image (`logoRef`, `referenceImageRef`) plus any text-grounding fields.

**Failure mode.** If §1 fails (vision call), the entire Brand Audit PDF is omitted with a logged warning — §2–§4 depend on §1 observations. If §1 succeeds and §2–§4 partially fail, ship a shorter Audit with the failed sections omitted.

#### §12.9.6 Moodboard ranker + caption (Haiku) — 2 calls

**Purpose.** AI ranks a deterministic shortlist of bank images and writes the caption for the **Pro Visual Reference Spread** that ships as pages 3–4 of `02-style-guide.pdf` (see [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) §2 and [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8). Section IDs (`moodboard.ranker`, `moodboard.caption`, `moodboard.referenceTagExtractor`) retain the `moodboard.*` namespace for prompt-registry and walker-telemetry stability even though the output destination is no longer a standalone moodboard PDF. No image generation. Haiku is sufficient and ~10% the cost of Sonnet per §12 open decision 5.

**Task prompt templates:**

- **Ranker:** *"You are selecting from a fixed bank — you cannot describe images outside the provided shortlist. Given the shortlist of {{shortlistLength}} candidate image IDs with their tags, plus the kit's palette family, style register, mood adjectives, narrator, and industry, select 6–9 image IDs for the buyer's moodboard. Enforce scene-type variety: no more than 3 images of any single scene type. For each pick, return a brief (≤ 20 words) reasoning citing the tags that drove the pick. {{visionInstructionIfReferenceImageProvided}}"*
- **Caption:** *"Write a ~80-word caption for the moodboard composed of the selected image IDs. Ground in the selected images' aggregate tags + kit palette + style + mood adjectives + narrator. Tone matches the rest of the Pro voice for this kit. Cite the intake fields you grounded in."*

**Schemas.** Per catalog table.

**Banned-vocab additions.** None beyond inherited.

**Grounding requirements.** Caption requires citation. Ranker returns image IDs + reasoning and does not produce reader-facing prose, so `fieldsCited` is omitted (the one call class without it).

**Failure mode.** Ranker failure → ship deterministic top-6 by tag-match score per `PRO_KIT_STRATEGY.md` §8.6. Caption failure → ship a deterministic caption variant from a pre-written bank keyed on palette × style.

#### Strategist-jargon banlist

Appended to the inherited banned-vocab list for Strategy Memo (§12.9.4) and Brand Audit (§12.9.5) calls only. Starter list:

```
authentic, leverage, synergy, growth opportunities, ecosystem,
holistic, robust, scalable, end-to-end, world-class, best-in-class,
industry-leading, cutting-edge, next-generation, disruptive,
transformative (as standalone adjective), reimagine, unlock potential,
journey (as metaphor for purchase/customer arc), space (as in "the wellness space"),
DNA (as metaphor for brand essence), north star (as cliché)
```

Lives in code at `packages/generation/src/ai/prompts/banlists.ts` (per §12.11). Grows naturally during fixture review (see §12.12).

### §12.10 Fixture testing — walker registry

The prompt teaches the rules; the walker enforces them. Nine walkers ship in Pro-A under `packages/generation/src/ai/walkers/`, each runs on AI output before PDF compile, CI fails on any walker failure for the `established-pro` fixture.

1. **Banned-vocab walker** — sources: `OUTPUT_TRANSLATION_SPEC.md` §10A.9 + `core-pdfs.test.ts` `bannedPatterns` + industry `avoidTerms` for the kit's industry + (Strategy Memo / Brand Audit only) strategist-jargon banlist. Fails if any banned token appears.
2. **Word-budget walker** — `wordCount(text) ≤ cap` for every text field per the §12.9 catalog. Failure triggers one retry with `temperature - 0.1` then the dispatcher fallback.
3. **Citation walker** — `fieldsCited.length >= 1` on every analytical and applied output; every field name resolves to a real field on the canonical `IdentityKitForm` Zod schema. Per-item citation enforced where the catalog calls out "per pillar / per tension / per proof point."
4. **Em-dash walker** — `<= 1 "—" per paragraph` (paragraphs split on `\n\n`). Re-uses the existing `core-pdfs.test.ts` rule.
5. **Schema walker** — Zod parse. Handled by the adapter per §7, listed here for completeness.
6. **Scene-variety walker** (moodboard ranker only) — no scene-type appears more than 3 times in `picks[]` per `PRO_KIT_STRATEGY.md` §8.6.
7. **Narrative-selector walker** (Strategy Memo §8 only) — if `narrativeType === "problem_story"`, `differentiation` and at least one `competitors` is in `fieldsCited`; if `manifesto`, `values` and one of `missionStatement | originSummary` is in `fieldsCited`; if `skipped`, `fieldsChecked` is present and reflects all four root sources.
8. **No-both walker** (Strategy Memo PDF assembly) — asserts the assembled Memo never includes both a Problem Story and a Manifesto for the same kit. Lives in the PDF assembler test, not in the prompt walker chain.
9. **Kit-contradiction walker** — runs on every prose-producing call class (all except `moodboard.ranker`). Rejects outputs containing rejection-list phrases that read as recommending the buyer change `selectedPalette` / `selectedStyle` / `tonePreset` / `brandNarrator`. Concrete rejection patterns and the full rule are locked in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.7.0. Failure triggers one retry with `temperature - 0.1` then the dispatcher fallback. Brand Audit §3 / §4 carry an additional structured assertion: every recommendation in `recommendations[]` must cite at least one `existingBrand.*` field in `fieldsCited` rather than a `step3.*` or `step6.*` selection field.

**Fixture matrix.** Eight Pro fixtures (one per canonical path class from `PRO_KIT_STRATEGY.md` §11 Pro-E). Each fixture ships golden structured-output snapshots for: all 12 Core section rewrites; all 8 CSP sections; all 3 Voice page 3 call classes; all 8 Strategy Memo sections; all 4 Brand Audit sections (on fixtures with existing-brand inputs, minimum 3 fixtures); the moodboard ranker + caption. Designer-grade review of all Strategy Memo outputs is the gate for Pro-E launch per `PRO_KIT_STRATEGY.md` §11.

### §12.11 Prompt change protocol — directory and versioning

```text
packages/generation/src/ai/
├─ client.ts                          # callClaude adapter (§7)
├─ dispatcher.ts                      # scaffold-and-refine + typed-error mapping (§7.4)
├─ sanitizers.ts                      # text normalization (§4.2)
├─ walkers/
│  ├─ bannedVocab.ts
│  ├─ wordBudget.ts
│  ├─ citation.ts
│  ├─ emDash.ts
│  └─ sceneVariety.ts
└─ prompts/
   ├─ buildSystemPrompt.ts            # renders §12.8 template from sources in §12.3
   ├─ buildSystemPrompt.test.ts       # snapshot tests for each path-class × call-class
   ├─ banlists.ts                     # STRATEGIST_JARGON_BANLIST + helpers to merge inherited lists
   ├─ index.ts                        # active-version registry; dispatcher reads from here
   ├─ coreRewrite.v1.ts
   ├─ csp.brandSummary.v1.ts          # oneLiner / elevator / paragraph
   ├─ csp.bio.v1.ts
   ├─ csp.captionStarters.v1.ts
   ├─ csp.contentPillars.v1.ts
   │   (no csp.ctas.v1.ts — CSP page 2 CTA section renders voicePage3.ctaVariations output; see §12.9.2 + OUTPUT_TRANSLATION_SPEC §10A.6A.1)
   ├─ voicePage3.emailTemplate.v1.ts
   ├─ voicePage3.beforeAfter.v1.ts
   ├─ voicePage3.ctaVariations.v1.ts
   ├─ strategyMemo.archetype.v1.ts
   ├─ strategyMemo.jtbd.v1.ts
   ├─ strategyMemo.behavioralAudience.v1.ts
   ├─ strategyMemo.tensions.v1.ts
   ├─ strategyMemo.contrarianAngle.v1.ts
   ├─ strategyMemo.messagingHierarchy.v1.ts
   ├─ strategyMemo.roadmap.v1.ts
   ├─ strategyMemo.narrative.v1.ts
   ├─ brandAudit.whatWeSaw.v1.ts
   ├─ brandAudit.whereServing.v1.ts
   ├─ brandAudit.whereTension.v1.ts
   ├─ brandAudit.recommendations.v1.ts
   ├─ moodboard.ranker.v1.ts
   └─ moodboard.caption.v1.ts
```

**Versioning rules:**

- Each prompt file is suffixed `.vN.ts`. `v1` ships in Pro-A.
- Promotion `v1 → v2` requires a side-by-side fixture-output diff across all 8 fixtures + designer/strategist review + CI green (all walkers pass).
- The cache-breakpoint marker in the base prompt (§12.8) stays in the same logical position across versions so re-versioning the base template does not silently invalidate every cached prefix mid-launch.
- The active version per call class is exported from `prompts/index.ts`. The dispatcher imports from `index`, never directly from versioned files.

### §12.12 Locked decisions and one ongoing list

Two decisions locked at plan time; one list stays naturally open and grows during fixture review.

1. **Persona wording (locked).** *"In-house brand strategist for one specific small business"* per §12.2. Alternatives considered and rejected: *"in-house marketer"* (Strategy Memo demands strategist register, not marketing-ops register), *"brand consultant"* (implies external/transactional), *"copywriter"* (too narrow for analytical sections).
2. **`fieldsCited[]` required on every output (locked).** Applied to analytical sections (Strategy Memo, Brand Audit) and applied-copy sections (Core rewrites, CSP, Voice page 3). Uniform schema, ~5 extra output tokens per call, future-proofs cost telemetry and any "show your work" UI affordance. The one call class without it is the moodboard ranker, which returns image IDs rather than reader-facing prose.
3. **Strategist-jargon banlist (ongoing).** Starter list of ~20 terms in §12.9. Expands during fixture review for Strategy Memo and Brand Audit — every time a designer or strategist flags a fixture output as "AI babble," the offending word(s) get added to `packages/generation/src/ai/prompts/banlists.ts`. This is the one prompt-content decision that is *expected* to grow.

---

## 13. Open decisions for Pro-A kickoff

Decisions deferred until the sprint actually starts; not blockers for this playbook.

1. ~~**Where the AI calls execute** — Next.js server route in `apps/web` vs Supabase Edge Function vs a dedicated worker (e.g. inngest, trigger.dev).~~ **Resolved in [`PRO_FULFILLMENT_ORCHESTRATION.md`](./PRO_FULFILLMENT_ORCHESTRATION.md) §8: Next.js API route in `apps/web` + Supabase `pg_boss` job queue.** See that doc for alternatives considered + rationale.

2. ~~**Sync vs background fulfillment**~~ **Resolved in [`PRO_FULFILLMENT_ORCHESTRATION.md`](./PRO_FULFILLMENT_ORCHESTRATION.md) §9.1: background with optimistic processing screen.**

3. **Anthropic account tier** — start on default tier; request tier-3 the moment we see real Pro volume. No blocker for Pro-A.

4. **Zod vs Typebox vs hand-rolled JSON schemas** — Zod is most ergonomic; Typebox produces cleaner JSON schemas; hand-rolled gives total control. **Recommendation: Zod + `zod-to-json-schema`.** We already use Zod patterns elsewhere; consistency wins.

5. **Whether to ship Haiku 4.5 as a fallback path day one** — Camentra's experience suggests Haiku is good enough for moodboard ranker / caption work at ~10% of Sonnet cost. **Recommendation: use Haiku for `moodboard_ranker` and `moodboard_caption` from day one; Sonnet everywhere else; Opus only for Strategy Memo.** Bakes the cost structure into the call-class defaults.

6. ~~**Cache TTL for prompt caching**~~ **Resolved in [`PRO_FULFILLMENT_ORCHESTRATION.md`](./PRO_FULFILLMENT_ORCHESTRATION.md) §9.2: stay on ephemeral for v1.**

---

## 14. Camentra files referenced

For the Pro-A implementer who wants to see the real working code these patterns came from:

| File | Lines | What it shows |
|---|---|---|
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 1521–1573 | The actual Claude vision API call shape. |
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 222–345 | JSON schema for structured output (template for our schemas). |
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 187–219 | Sanitization helpers to lift verbatim. |
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 1570–1573 | Refusal detection — pattern to keep, value to fix. |
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 1558–1567 | Error-code → user-message mapping. |
| `/Users/mattjohnson/camentra/supabase/functions/ai-photo-coach-v2/index.ts` | 1677–1692 | Race condition on counter (fix with `ON CONFLICT DO UPDATE`). |
| `/Users/mattjohnson/camentra/app/services/photoQuality/AIPhotoCoachService.ts` | 686–703 | Client-side image preprocessing pattern. |
| `/Users/mattjohnson/camentra/supabase/migrations/20251207_create_ai_coach_logs.sql` | — | Logs table migration shape (extend with token counts for IK). |
| `/Users/mattjohnson/camentra/supabase/migrations/20260307_ai_coach_logs_add_model_used.sql` | — | Non-breaking column-add pattern. |
| `/Users/mattjohnson/camentra/docs/features/ai-coach/CLAUDE_HAIKU_SETUP_AND_IMPLEMENTATION.md` | — | Cost analysis + per-period rate-limit framing. |
| `/Users/mattjohnson/camentra/docs/features/ai-coach/AI_COACH_VISION_API_RESEARCH.md` | — | Model + cost comparison across providers. |

---

## 15. Summary

The Camentra codebase is a working production blueprint for the Claude vision + structured-output integration Identity Kit needs in Pro-A. Keep its multimodal request shape, schema discipline, sanitizers, refusal/error mapping, and migration patterns. Fix its five gaps (prompt caching, explicit temperature, correct refusal stop_reason, SDK-driven retry, URL-based image source). Structure differently from day one: per-section files, a single `callClaude` adapter with call-class defaults, Zod-derived schemas, typed errors with a scaffold-and-refine dispatcher, and `ai_call_logs` for cost telemetry.

That's Pro-A done correctly.
