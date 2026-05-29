# Brand Brief — Ideal customer (`brief.idealCustomer`)

**Status:** Pro-A v1 (structured snapshot).  
**Scope:** Brand Brief PDF only — not Strategy Memo behavioral audience.

---

## Purpose

Give the buyer a **scannable audience snapshot** in the Brand Brief: who they serve, what defines them, and what they care about. This is **`ai_enhanced`**: deterministic intake → structured AI rewrite → PDF body.

**Not in scope here:**

- Long behavioral essays (buying triggers, objections, resonant language) → **Strategy Memo §3** (Pro-E).
- Guide folio “who it’s for” one-liner → deterministic Summary (unchanged).

---

## Intake inputs (today)

| Field | Tier | Role in this section |
|-------|------|----------------------|
| `step2.customerArchetype` | Core (card id) | Primary audience label via `resolveBuyerArchetypeTitle` |
| `step2.painPoints` | Pro (optional) | Traits / friction |
| `step2.desiredOutcomes` | Pro (optional) | `caresAbout` |
| `step1.offer.audienceId` | Core | Secondary segment hint in fallback |
| `step1.businessDescription` | Pro (optional) | Business-model clarity for AI context |
| `step1.businessOperatingModel` | Core | Optional trait (e.g. on-site vs online) |

**Known intake gaps** (future work — not blocking v1):

- No freeform “describe your ideal customer” field; Step 2 is card-only while microcopy says “plain language.”
- B2B buyers (e.g. shop owners as **clients** of a design studio) may not match industry archetype cards — card + Pro depth must carry the segment.
- `painPoints` / `desiredOutcomes` are optional at checkout; fulfillment soft gates recommended (`INTAKE_CONTRACT.md`).
- No fields for decision-maker role, firmographics, or buying objections (Memo territory).

**Proposed enhancement (not implemented):** Curated audience research bank — blurb + five fixed persona slots (age, income, buying behavior, etc.) from trusted sources, deterministic PDF rows, optional Haiku snippet selection, quarterly source refresh with human review. Full design: [`docs/research/BRIEF_IDEAL_CUSTOMER_AUDIENCE_RESEARCH.md`](../research/BRIEF_IDEAL_CUSTOMER_AUDIENCE_RESEARCH.md).

---

## AI output schema

```ts
{
  summaryLine: string   // 1 sentence — who they are
  traits: string[]      // 2–4 concrete identifiers
  caresAbout: string[]  // 2–3 priorities / outcomes
  fieldsCited: string[]
}
```

**Prompt discipline:** direct labels, no narrative paragraphs, no invented demographics.

**PDF rendering** (`formatBriefIdealCustomerForPdf`):

```
{summaryLine}

What defines them
• …
• …

What they care about
• …
• …
```

---

## Fallback

When API is skipped or fails, `idealCustomerSnapshotFromIntake()` builds the same schema from intake only (no literary glue).

---

## Code map

| Piece | Path |
|-------|------|
| Schema | `packages/shared/src/ai/schemas/briefIdealCustomer.ts` |
| AI call | `packages/generation/src/ai/sections/briefIdealCustomer.ts` |
| PDF formatter | `packages/generation/src/deterministic/idealCustomerSnapshot.ts` |
| Intake fallback | same file — `idealCustomerSnapshotFromIntake()` |
| PDF override | `depthBriefBlocks(..., proOverrides.briefIdealCustomerBody)` |

---

## Drift note

`AI_INTEGRATION_PLAYBOOK.md` §12.9.1 still documents `{ rewrittenProse }` for section rewrites. **`brief.idealCustomer` uses the structured schema above** until the playbook is updated in a docs pass.
