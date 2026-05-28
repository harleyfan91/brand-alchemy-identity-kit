# Quick Start — channel strategy (priority vs recommended)

**Status:** Product direction agreed (2026-05-27). **Implementation:** not started — requires industry × operating-model research before coding `recommendedTouchpoints()`.  
**Parent program:** [`QUICK_START_REFACTOR.md`](./QUICK_START_REFACTOR.md) · [`QUICK_START_MARKETING_AUDIT.md`](./QUICK_START_MARKETING_AUDIT.md)  
**Spec alignment:** [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §2.4 (platform inference — recommended vs user-selected)

---

## Core idea

Step 1 touchpoints answer: **“Where do you want to focus first?”**  
They are **not** “the only places this kit will ever mention.”

Quick Start should run in **two modes** by week:

| Mode | Weeks | Channel source | Voice |
|------|-------|----------------|-------|
| **Execute** | **1–2** | **User-selected** touchpoints only (ordered) | Imperative: “Update your Instagram bio…” |
| **Expand** | **3–4** | Selected **plus** **recommended** surfaces we infer they omitted | Advisory: “Many [storefront cafés] also claim Google so hours and directions show in Maps…” |

The **Brand Identity Guide** and most kit copy stay anchored on **selected** surfaces so the deliverable feels personalized. Quick Start **later weeks** are where we earn trust by adding **marketing judgment** — clearly labeled, never disguised as something they already said they use.

This replaces the Phase A audit shorthand of “never mention unselected channels.” The real rule is:

- **Don’t pretend** they operate a channel they didn’t select (no narrator fallback as imperative copy in Weeks 1–2).
- **Do recommend** high-value omissions in Weeks 3–4 when signals say they’d benefit — with **why**, in plain language.

---

## Why this matches the kit’s role

Identity Kit is not only a mirror of intake — it is **guided implementation**. Customers who skip Google for a coffee shop are often **unaware**, not **opposed**. Industry rollout guides consistently list **maps/listings** alongside social for physical businesses; we should surface that **after** they’ve won on the channels they care about, not in Week 1 when they’re already overwhelmed.

**Trust sequence:**

1. **Weeks 1–2:** “We heard you — Instagram and Facebook first.” → credibility.
2. **Weeks 3–4:** “When you’re ready, here’s one discovery channel many businesses like yours add.” → expertise without scope creep.

---

## Copy patterns (non-marketer)

### Execute (selected only)

- “Update your **Instagram** bio using…”
- “Apply **Voice** rules on **Facebook**…”
- Secondary bullets only for **`touchpoints[1..]`** — not narrator `primary_channels` unless also selected.

### Expand (recommended — not selected)

Use a consistent **recommendation frame** so it never reads as an assumption:

| Pattern | Example |
|---------|---------|
| **Benefit + optional** | “**Worth adding when you’re ready:** a **Google Business Profile** so your hours and location show in Maps — many walk-in businesses get discovery there even if social is where you post.” |
| **Claim / set up** | “If you don’t have one yet, **claim** your Google listing and paste the same business description you used on Instagram.” |
| **Verify** | “**Check** whether you already have a Google listing for your address; if not, add one before you invest in more social content.” |
| **Avoid** | “Update your Google cover photo” (implies they already use Google as an active channel). |

**Cap:** **1–2 recommended lines per week** in Expand mode (not a second full checklist). Optional subsection label:

```text
Also worth setting up (optional)
☐ …
```

### Week 4 audit split

```text
Your channels (from Step 1)
☐ Review Instagram and Facebook for consistent voice and visuals.

Worth adding when you’re ready
☐ Claim or complete Google Business Profile so Maps and Search show your hours and location.
```

---

## Worked example: coffee shop, retail location

**Intake (illustrative):**

- Industry: `food_beverage`
- Operating model: `customer_visits_us`
- Narrator: `local_team` or `solo_maker`
- Touchpoints (ordered): `instagram`, `facebook`
- Goal: `audience_growth` or `lead_gen`

**Execute — Week 1 lead**

> Set up your brand on **Instagram** first.

**Execute — Week 1 tasks (selected only)**

- Publish one branded update on Instagram before expanding cadence.
- Update Instagram bio / profile using Summary + Examples.
- Mirror the same business description on **Facebook** (second selected).
- Goal-aligned kickoff on Instagram (cadence or CTA as appropriate).

**No Week 1 line:** “Confirm hours on Google” (not selected; not yet in Expand phase).

**Expand — Week 3 or 4 (recommended)**

> **Also worth setting up:** **Google Business Profile** (Maps + Search). Walk-in customers often check hours, directions, and photos there even if they follow you on social. Use the same photos and short description as your Instagram profile; add your address and opening hours.

**Optional second recommendation (only if no `website` selected and `lead_gen` / `direct_sales`):**

> A simple **website** or order link in bio can hold your menu and hours in one place — add when Instagram’s link field isn’t enough.

**Guide / CTA PDFs:** Still primarily Instagram + Facebook frames from intake; directory CTA examples may appear as **illustrative** “if you add Google later” in a later phase — product call for folio 05.

---

## Inference model (to build in code)

### Two sets

```text
priorityTouchpoints  = normalize(step1.touchpoints)     // max 4, ordered — Execute weeks
recommendedTouchpoints = inferRecommended(form)          // omit any ID already in priority
```

`resolveChannelPlan()` today merges selected + narrator fallbacks for **primary/secondary labels**. Split responsibilities:

| Helper | Uses |
|--------|------|
| `resolvePriorityChannelPlan(form)` | Selected IDs only; fallback only if **zero** touchpoints (migration edge). |
| `inferRecommendedTouchpoints(form)` | Signals below; never mutates priority order. |

### Signals for `inferRecommended` (draft — needs industry pass)

Rank candidates; return **0–3** IDs, ordered by impact, excluding already-selected.

| Signal | Often recommend (if missing) | Notes |
|--------|------------------------------|-------|
| `customer_visits_us` | `google_business`, optionally `apple_maps` | Maps discovery for storefronts |
| `we_travel_to_customers` | `google_business` (service area), `website` | “Near me” + booking |
| `mostly_events_or_markets` | `instagram`, `google_business` (event hours) | Depends on event vs retail |
| `online_only` | `website`, `email_newsletter` | Owned channel + retention |
| `hybrid` | `google_business` if physical leg exists | Combine with operating model |
| `local_team` narrator | `google_business` | Already in spec §2.4 |
| `lead_gen` + social-only | `website` or `linkedin` (B2B industries) | Not for every B2C café |
| `direct_sales` + maker | `marketplace_storefront` or `website` | If they only picked social |
| `audience_growth` + social-only | Usually **no** extra — avoid piling on |
| Industry `legal_professional_services` | `linkedin`, `website` | Not Google unless local storefront |
| Industry `food_beverage` + visit-us | `google_business` | Coffee shop case |
| Industry `nonprofit_community` | `website`, `facebook`; directory if physical site | Google if public address |

**Hard rules (proposed):**

1. Never recommend a channel **contradicted** by intake (e.g. don’t push Etsy if they’re clearly a law firm — use industry blocklist).
2. Never recommend **more than two** surfaces in Quick Start Expand blocks per week.
3. **`primaryGoal`** tunes *wording*, not a totally different channel set (lead gen → “so calls and directions find you”).
4. **`stage: starting_fresh`** → softer Expand (“when you’re ready”); **`established`** → “audit whether you already have…”

### Bucket-appropriate recommendation tasks

Same as Execute: recommended line must match **surface mechanics**.

| Bucket | Good Expand task | Bad Expand task |
|--------|------------------|-----------------|
| `online_directory` | Claim listing, hours, services, photos | “Publish 3 posts on Google” |
| `social` | Set up profile if missing; link from bio | — |
| `owned_channel` | One-page site / hero / menu | “Pinned post on website” |
| `marketplace` | Open shop, first listing | “Consult/quote CTA” on Etsy |

---

## Week-by-week placement

| Week | Execute (selected) | Expand (recommended) |
|------|--------------------|----------------------|
| **1** | 100% priority — setup, bios, CTA, bucket kickoff on `#1` | **None** (or single sentence in lead: “We’ll suggest other channels in Week 3 if they help.”) |
| **2** | Voice + posts/listings copy on priority channels; cross-sync **among selected only** | **Optional:** at most one line: “Planning to add Google later? Draft your business description now using Voice rules so it’s ready.” |
| **3** | Visual rollout on selected | **1–2** “Also worth setting up” with Maps/menu/website rationale |
| **4** | Audit **selected** list explicitly | **“Worth adding when you’re ready”** subsection with 1–2 recommended + share guide |

**`guideFocus` interaction (future):**

| Focus | Expand emphasis |
|-------|-----------------|
| `look_more_professional` | Directory / website for discoverability |
| `sound_more_consistent` | Fewer Expand items — don’t distract from voice |
| `know_what_to_fix_first` | Expand only if audit finds a glaring gap (“no Maps presence”) |
| `give_clear_direction` | Expand includes “share this guide with whoever sets up Google” |

---

## What to stop doing (current code)

| Current behavior | Target behavior |
|------------------|-----------------|
| Week 1–2 “Extend to **personal website**” when only LinkedIn selected (narrator fallback) | Drop or move to Expand with advisory framing **only if** website is recommended |
| Week 4 “Review all channels (LinkedIn, personal website, email)” mixed list | Split **Your channels** vs **Worth adding** |
| Week 3 Google line for **mission_community** without local address signal | Gate recommendation on `customer_visits_us` / `hybrid` / `local_team` + physical industries |
| Imperative “Update Google cover” when Google not selected | Imperative only when selected; otherwise Expand “claim / complete” |

---

## Recommendation matrix (v1 — six segments)

**Draft for review:** [`QUICK_START_CHANNEL_MATRIX.md`](./QUICK_START_CHANNEL_MATRIX.md)

Covers S1–S6 with R1/R2 touchpoint IDs, plain-language *why* lines, blocklist, and implementation sketch for `inferRecommendedTouchpoints()`.

**Still open after v1 sign-off:**

- Pass 2 industries (health, beauty, fitness, pet, real estate, `other`)
- Fixture: `coffee-shop-retail-social-only.json`
- Wizard microcopy on Step 1 touchpoints
- Tests in `quickStartAudit.test.ts` for Execute vs Expand channel rules

---

## Phase B implementation order (channel slice)

1. Document signed-off **recommendation matrix** (subset of industries for Core launch).
2. Implement `inferRecommendedTouchpoints(form)` + plain-language `why` snippets per ID.
3. Split `week1Items` / `week2Items` to `resolvePriorityChannelPlan` only.
4. Add `expandChannelItems(form)` for Weeks 3–4 with subsection + advisory templates.
5. Update marketing audit P0 items C1–C4 to match this doc (not “selected only everywhere”).
6. Regenerate persona dumps; legal + coffee shop spot-check.

---

## Changelog

| Date | Note |
|------|------|
| 2026-05-27 | Initial strategy: Execute weeks 1–2 on selected; Expand 3–4 with inferred recommendations; coffee shop example |
