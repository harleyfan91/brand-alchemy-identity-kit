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

**Out of scope:** prompt content per section (see [`STRATEGIST_MEMO_PROMPTING.md`](./STRATEGIST_MEMO_PROMPTING.md) when written), moodboard ranking (see [`MOODBOARD_BANK_CURATION.md`](./MOODBOARD_BANK_CURATION.md) when written), brand-context.json export (Pro-I backlog).

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

---

## 12. Open decisions for Pro-A kickoff

Decisions deferred until the sprint actually starts; not blockers for this playbook.

1. **Where the AI calls execute** — Next.js server route in `apps/web` vs Supabase Edge Function vs a dedicated worker (e.g. inngest, trigger.dev). Edge Functions hit Deno cold-start; Next.js routes share infra; a worker is overkill for v1. **Recommendation: Next.js API route inside `apps/web` calling the `packages/generation` AI module, with a background-job queue (Supabase pg_boss or similar) for the fan-out so the order-status page doesn't block on 90s of Claude calls.**

2. **Sync vs background fulfillment** — does the buyer wait on the page (sync) or get an email when done (background)? `PRO_KIT_STRATEGY.md` §10 says under 90s is the target. **Recommendation: background with optimistic processing screen** — UX is better, retries are cleaner, doesn't tie a buyer to a tab.

3. **Anthropic account tier** — start on default tier; request tier-3 the moment we see real Pro volume. No blocker for Pro-A.

4. **Zod vs Typebox vs hand-rolled JSON schemas** — Zod is most ergonomic; Typebox produces cleaner JSON schemas; hand-rolled gives total control. **Recommendation: Zod + `zod-to-json-schema`.** We already use Zod patterns elsewhere; consistency wins.

5. **Whether to ship Haiku 4.5 as a fallback path day one** — Camentra's experience suggests Haiku is good enough for moodboard ranker / caption work at ~10% of Sonnet cost. **Recommendation: use Haiku for `moodboard_ranker` and `moodboard_caption` from day one; Sonnet everywhere else; Opus only for Strategy Memo.** Bakes the cost structure into the call-class defaults.

6. **Cache TTL for prompt caching** — Anthropic's `ephemeral` cache lasts ~5 minutes. For a single kit fulfillment that's plenty (whole kit completes in <90s). If we ever batch multiple kits with the same industry/narrator, consider the 1-hour cache tier. **Recommendation: stay on ephemeral for v1.**

---

## 13. Camentra files referenced

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

## 14. Summary

The Camentra codebase is a working production blueprint for the Claude vision + structured-output integration Identity Kit needs in Pro-A. Keep its multimodal request shape, schema discipline, sanitizers, refusal/error mapping, and migration patterns. Fix its five gaps (prompt caching, explicit temperature, correct refusal stop_reason, SDK-driven retry, URL-based image source). Structure differently from day one: per-section files, a single `callClaude` adapter with call-class defaults, Zod-derived schemas, typed errors with a scaffold-and-refine dispatcher, and `ai_call_logs` for cost telemetry.

That's Pro-A done correctly.
