# Pro output persistence and memory — architecture recommendation

**Status:** Design memo (pre–Pro-A).  
**Audience:** Pro-A (AI plumbing), Stage 4 persistence, Pro-I export.  
**Related:** [`AI_INTEGRATION_PLAYBOOK.md`](./AI_INTEGRATION_PLAYBOOK.md), [`PRO_FULFILLMENT_ORCHESTRATION.md`](./PRO_FULFILLMENT_ORCHESTRATION.md), [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1.2, [`INTAKE_CONTRACT.md`](../audits/INTAKE_CONTRACT.md).

---

## 1. Are Pro “analysis” documents fully AI-driven?

**No.** Pro fulfillment is a **hybrid** by design. The deterministic compiler owns strategy (narrator, palette, style, path class, section order, CTA composition policy). AI improves voice, specificity, and analyst-style sections within those boundaries. Every AI section has a **deterministic fallback** (scaffold-and-refine).

### Deliverable mix (from Mode Matrix)

| Deliverable / section | Mode | Deterministic role | AI role |
|----------------------|------|--------------------|---------|
| Brand Brief, Style Guide, Voice p1–2, Quick Start, Brand Identity Guide (shared) | `ai_enhanced` | Full section scaffold from intake + rules | Rewrite scaffold in buyer voice |
| Content Starter Pack (7 text sections) | `ai_only` | Stubs on failure only | Generate paste-ready copy |
| Voice Playbook p3 (email, before/after, CTA variations) | `ai_only` | CTA **anchor** from deterministic folio 05 | Variations + templates |
| Brand Strategy Memo (§1–§8) | `ai_only` | Skip / omit rules only | Opus strategist sections |
| Brand Audit (conditional) | `ai_only` + vision | None for prose | Multimodal analysis |
| Style Guide Pro pages 3–4 (moodboard) | Mixed | Palette call-outs, layout, bank shortlist | Ranker + caption (Haiku) |

**Implication:** “Learning” should target **structured section outputs** and **derived brand context**, not raw prompt transcripts. The PDF is the buyer artifact; the database is the machine artifact.

---

## 2. What industry practice recommends (2025–2026)

External synthesis (RAG vs fine-tuning vs memory layers):

| Approach | Best for Identity Kit? | Why |
|----------|------------------------|-----|
| **Dump prior outputs into every prompt** | No (default) | Unbounded token growth; cache busting; stale contradictions |
| **RAG over past kits** | Later (Pro-I+) | Retrieve **top-k relevant** snippets per call; auditable; GDPR-friendly deletion per order |
| **Fine-tuning on past outputs** | Not v1 | Needs hundreds–thousands of curated examples; retrain cost; poor fit for per-business facts |
| **Episodic + semantic memory tiers** | Yes (phased) | Store immutable fulfillment artifacts (episodic); distill small stable facts (semantic); retrieve selectively |
| **Within-kit dependency graph** | Yes (v1) | Later sections read **structured prior section JSON**, not re-prompt from scratch |
| **Prompt caching (Anthropic)** | Yes (v1) | Cache **static** system prefix (persona, contracts, industry/narrator profiles); keep **per-kit** data in variable suffix |

**Default product pattern for SaaS content generation:**  
1. Persist **structured outputs** per section with schema version + `fieldsCited`.  
2. Use **within-fulfillment** references (Memo §6 reads §4–§5 JSON).  
3. Add **cross-fulfillment** memory only via retrieval (embed summaries, top-3 chunks) or a compact **brand context export** — not full PDF text in the prompt.

References: [RAG vs fine-tuning decision frameworks](https://www.scaledbydesign.com/blog/ai-fine-tuning-vs-rag-decision), [production agent memory tiers](https://dev.to/sapotacorp/memory-in-production-agents-what-most-tutorials-skip-faj), [Anthropic prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching).

---

## 3. Recommended architecture for Identity Kit

### 3.1 Three memory scopes

```
┌─────────────────────────────────────────────────────────────────┐
│ A. Static prefix (cached) — same for all kits in a fulfillment   │
│    Persona, voice contracts, banned vocab, task templates,       │
│    industry/narrator profile tables                              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│ B. Per-kit working set (variable suffix, bounded)                │
│    migrateIdentityKitForm snapshot + buildPromptContext blocks   │
│    + structured outputs from earlier sections THIS fulfillment   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│ C. Cross-kit memory (optional, retrieval-bounded) — Pro-I+         │
│    Prior order summaries, user edits, brand-context.json export  │
│    Never inject full prior PDFs by default                       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Persist on every Pro fulfillment (v1 — with Stage 4 DB)

| Store | Contents | Used for |
|-------|----------|----------|
| `orders.intake_snapshot` | Full `IdentityKitForm` JSON (post-migration) | Re-runs, support, export |
| `kit_section_outputs` (new) | One row per Section ID: `section_id`, `schema_version`, `output_json`, `fields_cited[]`, `model`, `status` (`ok` \| `fallback_shipped` \| `skipped`) | PDF assembly, re-generate single section, downstream context |
| `ai_call_logs` | Tokens, model, `section_name`, errors (playbook §9) | Cost, debugging |
| `kit_fulfillment_events` | Timeline for processing UI (orchestration doc §6) | Buyer-facing progress |
| Object storage | PDFs + uploads (`pro-uploads`) | Delivery |

**Do not** store full prompt strings as the primary learning surface (optional debug flag only). Store **outputs** — they are smaller, schema-validated, and what PDFs actually use.

Suggested `kit_section_outputs` shape:

```sql
create table public.kit_section_outputs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  section_id text not null,           -- stable Mode Matrix id, e.g. strategyMemo.tensions
  schema_version text not null,       -- e.g. tensions@v1
  output_json jsonb not null,
  fields_cited text[] not null default '{}',
  status text not null check (status in ('ok','fallback_shipped','skipped')),
  created_at timestamptz not null default now(),
  unique (order_id, section_id)
);
```

### 3.3 Within-kit learning (implement in Pro-A / Pro-E)

**Problem:** Strategy Memo §6 (messaging hierarchy) should align with §4 (tensions) without re-deriving from intake alone.

**Pattern:** Orchestrator runs sections in **dependency tiers** (parallel inside tier):

| Tier | Examples | Context passed |
|------|----------|----------------|
| 0 | Core scaffolds (deterministic) | Intake only |
| 1 | Core `ai_enhanced` rewrites, CSP, Voice p3 | Intake + scaffolds |
| 2 | Memo §1–§5 | Intake + optional tier-1 JSON summaries |
| 3 | Memo §6–§7 | Intake + **full JSON** for §4–§5 (compact, &lt;500 tokens) |
| 4 | Memo §8 | Intake + substance check on §6 + differentiation/origin branches |
| 5 | Brand Audit | Intake + vision + **locked selections** + optional Memo tensions one-liner |

Task prompt addition (bounded):

```text
Prior sections from this fulfillment (structured, authoritative — do not contradict):
{{priorSectionJson}}
```

**Cap:** Inject at most **N tokens** of prior-section JSON per call (e.g. 800–1200). Prefer field-specific slices (e.g. only `strategyMemo.tensions` for §6), not the whole kit.

This is **not** prompt bloat if scoped per Section ID — it replaces re-explaining intake and prevents Memo internal inconsistency.

### 3.4 Cross-kit learning (defer to Pro-I unless needed earlier)

| Feature | Mechanism | Prompt impact |
|---------|-----------|----------------|
| **Regenerate one section** (Pro-I) | Reload `intake_snapshot` + existing `kit_section_outputs` for other sections; re-run one Section ID | Variable suffix = intake + non-regenerated section JSON |
| **Core → Pro upgrade** | New order linked to `source_order_id`; copy intake; blank Pro-only fields | Same as fresh Pro |
| **brand-context.json export** (Pro-I) | Deterministic assembly from `kit_section_outputs` + intake | **Zero** prompt cost — buyer-facing artifact |
| **“Sounds like last time”** (future) | Embed **one paragraph summary** per completed order; retrieve top-1 by `user_id` + business name similarity | +100–200 tokens max |

**Do not** paste prior Strategy Memo full text into every new kit. If the same business buys again, retrieve a **compressed summary** (LLM-generated once at fulfillment end, ~150 words) into `brand_episodic_summaries` and only inject when `order.source_order_id` or same `businessName` + owner id matches.

### 3.5 What to record from each AI call

Minimum (already in playbook direction):

- `output_json` (parsed schema)
- `fields_cited`
- `status` + `error_class`
- Token usage in `ai_call_logs`

Optional for quality loops (ops / eval, not buyer prompts):

- Prompt hash + schema version (reproducibility)
- Walker failure reasons
- Human edit diff if post-delivery editor ships (Pro-I)

### 3.6 Anti-patterns

| Anti-pattern | Why avoid |
|--------------|-----------|
| Append every prior kit’s PDF text to system prompt | Cache miss, cost, contradictions |
| Fine-tune on customer outputs without review | Hallucinated proof becomes “truth” |
| Global “learning” across tenants without ACL | Privacy / GDPR |
| Storing only PDFs, not section JSON | Cannot re-run §6 without re-running entire kit |
| Using motivation + originSummary as duplicate AI signals | Redundant, noisy (see intake contract) |

---

## 4. Phased rollout

| Phase | Memory capability | Milestone |
|-------|-------------------|-----------|
| **Pro-A** | Persist `kit_section_outputs` + `ai_call_logs`; `buildPromptContext`; within-kit prior-section JSON for dependent calls | AI plumbing |
| **Pro-E** | Memo tier 2–4 dependencies; Audit reads Memo tensions slice | Strategy Memo gate |
| **Stage 4 DB** | `intake_snapshot` on `orders` | Persistence |
| **Pro-I** | `brand-context.json` export; single-section regenerate; optional episodic summary table | Backlog |
| **Pro-I+** | Vector retrieval over summaries for repeat buyers | Only if product demands it |

---

## 5. Answers to common product questions

**Q: Should we store the full transcription of each analysis?**  
**A:** Store **structured section JSON** (and PDFs for humans). Transcripts are for debugging only.

**Q: How does the AI “learn” without growing the prompt?**  
**A:** (1) Within-kit: pass compact prior-section JSON. (2) Across kits: retrieval of short summaries or explicit export file, not full history. (3) Product learning: improve prompts, schemas, and deterministic scaffolds using `ai_call_logs` + eval fixtures — not per-user prompt accumulation.

**Q: Are Strategy Memo and Brand Audit purely AI?**  
**A:** Prose is `ai_only` with deterministic **omission/fallback** rules. Layout, section presence, buyer selection lock, and moodboard grid are deterministic.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-05-28 | Initial memo: hybrid deliverable model, persistence schema, memory tiers, phased rollout |
