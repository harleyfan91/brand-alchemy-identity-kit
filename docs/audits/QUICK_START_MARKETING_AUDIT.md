# Quick Start Checklist — marketing & UX audit (Phase A)

**Date:** 2026-05-27  
**Audience:** Product, copy, and engineering — read as a non-marketer customer would.  
**Program hub:** [`QUICK_START_REFACTOR.md`](./QUICK_START_REFACTOR.md)  
**Channel strategy:** [`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md) · **v1 matrix (review):** [`QUICK_START_CHANNEL_MATRIX.md`](./QUICK_START_CHANNEL_MATRIX.md)  
**Technical invariants:** [`packages/generation/src/deterministic/quickStartAudit.test.ts`](../../packages/generation/src/deterministic/quickStartAudit.test.ts)  
**Sample output dump:** `npm test -- src/deterministic/quickStartDump.test.ts` (see [`quickStartDump.test.ts`](../../packages/generation/src/deterministic/quickStartDump.test.ts))

---

## Executive summary

The Quick Start has a **sound skeleton**: start on the customer’s **#1 channel**, separate **copy (weeks 1–2)** from **visual rollout (week 3)**, then **audit (week 4)**. That matches how reputable small-business rollout guides describe the first 30 days (“front door” first, templates second, QA last).

It is **not yet trustworthy as a non-marketer’s playbook** because:

1. **Language** still sounds like internal assembly (“who/what/outcome lines”, “mirror your core positioning”, long `Brand Identity Guide → Summary` pointers).
2. **Channel framing** is inconsistent — Week 1–2 should **only execute on selected** touchpoints, but we wrongly inject **narrator fallbacks** as if the user chose them; Week 3–4 should **recommend omitted high-value surfaces** (e.g. Google for a walk-in café on IG+FB only) with advisory copy — see [`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md). Surface-fit still fails in places (e.g. “2–3 posts” on Google).
3. **`guideFocus` is ignored** — the intake answer about *why they bought the kit* does not change the checklist.
4. **Cognitive load** is high — ~7–8 ☐ lines per week plus three paragraphs of framing, with no “if overwhelmed, do these three.”
5. **Kit intro** names four PDFs before the customer has opened one — anxiety for non-marketers.

**Recommendation:** Treat Phase B as a **rewrite for plain language + phased channel strategy + fewer tasks**, not a rearrangement of the same bullets. Keep the four-week arc. **Weeks 1–2 = their list; Weeks 3–4 = our recommendations** where signals support it ([`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md)).

---

## Outside research — what good looks like (non-marketer lens)

Sources reviewed: [Magnt 30/60/90 rollout](https://magnt.com/blog/brand-rollout-plan-30-60-90), [Rae Design implementation roadmap](https://rae.design/blog/brand-implementation-checklist-for-small-business-owners), [Kittl minimum brand guidelines](https://www.kittl.com/blogs/brand-guidelines-for-small-business-bgt/), [OneStop NW checklist](https://onestopnw.com/small-business-branding-checklist-that-works/), [Fabrik brand onboarding](https://fabrikbrands.com/branding-matters/branding/brand-onboarding/), [Brandkit enablement steps](https://brandkit.com/asset-page/734281-how-to-create-a-complete-brand-kit-for-your-brand-a-step-by-step-guide).

### Patterns that repeat

| Pattern | Why it works for non-marketers |
|--------|--------------------------------|
| **Front door first** | Fix where strangers land (website hero, Google/profile, social bio) before worrying about every channel. |
| **Top touchpoints only** | “Top 10” or “first channel complete” — not 60+ touchpoints at once. |
| **Copy + visuals + habit** | Phase 1 visibility → Phase 2 templates/voice → Phase 3 maintenance/QA. |
| **Learn by doing** | One real task (update bio, send one email, one post) beats reading a 40-page guide. |
| **One cheat sheet** | Single place for colors, fonts, voice words — our **Brand Identity Guide** fills this role. |
| **Templates** | “One Canva/slide/email template” reduces repeated decisions. |
| **Owner + maintenance** | Who keeps the brand on track; quarterly skim — Week 4 is closest for us. |
| **Plain language** | “Update your Google listing” not “align positioning across touchpoints.” |

### Typical 30-day shape (industry)

| Days | Focus | Our closest week |
|------|--------|------------------|
| 1–30 | Profiles, homepage, bios, one template, primary CTA | Week 1 (+ part of 2) |
| 31–60 | Voice in email/sales, secondary channels, documented rules | Week 2 |
| 31–60 | Visual system on recurring assets | Week 3 |
| 61–90 | Deeper pages, channel checklist, monthly QA | Week 4 |

**Implication:** Our **week order is defensible**. Gaps are **wording**, **task/surface fit**, **honoring selected channels**, and **connecting to `guideFocus`**.

### What premium brand kits do after delivery

- Central **asset hub** (where files live) — we spread across 5 PDFs; intro must make that feel simple.
- **Walkthrough of the one guide** they’ll use daily — we say “start with Brand Identity Guide” (good) but immediately mention three depth PDFs (heavy).
- **Low-stakes first win in week one** — e.g. one bio paragraph pasted from Examples.
- **Enablement for helpers** — share guide PDF (we have this in Week 4; could be earlier for `give_clear_direction`).

---

## Our packaging (what we got right)

From [`DELIVERABLE_REDUNDANCY_MATRIX.md`](../product/DELIVERABLE_REDUNDANCY_MATRIX.md):

| Principle | Quick Start behavior | Verdict |
|-----------|---------------------|---------|
| Guide is canonical | Tasks point to Summary / Voice / Look / Examples; no pasted one-liner walls | ✅ |
| Quick Start owns **order** | Week-by-week sequencing | ✅ |
| Depth PDFs optional | Intro says guide first, depth when wanted | ✅ (tone needs simplification) |

**Generator strengths (technical audit):**

- First selected **touchpoint** drives primary channel copy.
- **Bucket-aware** kickoffs (directory complete-the-profile, marketplace audit listings, owned-site hero).
- **`primaryGoal`** changes kickoff (lead gen vs growth vs sales).
- **`stage`** changes Week 1 preamble (starting fresh vs protecting recognition).
- **Week 2** consistently cites **(Voice)** and Examples.
- **Persona regressions** exist for directory, marketplace-first, physical cluster.

---

## Read-through: four-week arc (logic)

```
Week 1  →  “Set up on {primary}”     Profile/summary/CTA/structure   Guide: Summary + Examples
Week 2  →  “Apply voice”             Rules + posts + cross-channel   Guide: Voice + Examples  
Week 3  →  “Roll out visuals”        Palette, covers, templates      Guide: Look
Week 4  →  “Audit”                   Consistency + share PDF         Guide: all
```

**Fit with customer goals (intake):**

| Customer goal | Week that does the real work | Match? |
|---------------|------------------------------|--------|
| Look more professional | Week 1 (profile) + Week 3 (visual) | ⚠️ Week 1 cites Summary only, not Voice |
| Sound more consistent | Week 2 | ✅ |
| Know what to fix first | Week 2 + Week 4 | ⚠️ No explicit “find worst line first” |
| Give clear direction | Week 4 share PDF | ⚠️ Weak handoff wording |

**Fit with `guideFocus`:** None — same checklist for all four focuses today.

---

## Persona spot-check (generated copy)

Dump command: `npm test -- src/deterministic/quickStartDump.test.ts`

### pc05 — Halverson Counsel (solo expert, LinkedIn only, lead gen)

**Works:** LinkedIn-first; lead-capture kickoff; Week 2 applies Voice to LinkedIn; established-stage preamble (“auditing, not starting over”).

**Fails non-marketer test:**

- Week 1: “who/what/outcome lines” — **not plain**; customer never saw that label on Summary.
- Week 1: “Refresh your **personal website**” — user selected **LinkedIn only** (narrator fallback in **Execute** week — should not appear until **Expand**, and only if website is a justified recommendation).
- Week 1: “booking or contact link” — may not match legal positioning.
- Week 3: “personal website homepage” — again, not a selected channel.
- Week 4 channel list: “LinkedIn, personal website, email” — **three channels, one selected**.

### pc04 — Bay Coast Studio (Google + Instagram, local team)

**Works:** Directory-first Week 1; imperative Google cover when directory selected; Instagram as secondary in user’s order.

**Fails:**

- Week 2: “rewrite your description and **update 2–3 posts**” on **Google** — most owners don’t “post” on Google like LinkedIn.
- Week 4: “Google, Instagram, **Google Business**, Facebook” — **duplicate/confusing labels** (fallback merge).

### pc08 — Studio Hold Print (Etsy + Instagram, marketplace-first)

**Works:** Commerce-shaped Week 1 for solo expert + Etsy; listing language; Week 3 product photography.

**Fails:**

- Week 1 goal kickoff: “**lead capture** … consult/quote” on **Etsy shop** — mismatched mechanic (shop = buy/browse).
- Week 2: “Publish one **lead-focused update** on Etsy” — awkward surface.

### community-org — Riverbank Food Share (Facebook + Website, audience growth)

**Works:** Growth kickoff Week 1; mission_community tasks (impact, CTA consistency).

**Fails:**

- Week 3: “**Claim or complete your Google Business profile**” — **not in touchpoints**. **Intent can be right** for a hybrid nonprofit with a physical presence; framing should be **Expand / optional** with *why*, not a mandatory ☐ mixed into visual tasks without context.
- Week 1: “Rewrite your **email newsletter** header” — email not selected (only website + facebook).

### lean-core — Maple & Pine (Instagram only, new stage)

Same class of issues as pc05: **LinkedIn + personal website + email** appear with **Instagram-only** selection.

### pc07b — Rail Bend Electric (website-first trades)

**Works:** Owned-channel Week 1 hero/CTA language.

**Fails:**

- Week 2: “Add a summary line … to your **Website profile, bio, or pinned post**” — websites don’t have “bio” or “pinned post.”

---

## Issue register (prioritized)

### P0 — Channel strategy (Execute vs Expand)

| ID | Issue | Example | Fix direction |
|----|--------|---------|----------------|
| C1 | **Execute** weeks use **narrator fallback** as imperative | pc05 → “personal website” in Week 1 | Weeks 1–2: `resolvePriorityChannelPlan` — **selected IDs only** |
| C2 | **Expand** recommendations missing or muddled with Execute | Coffee shop IG+FB only — no Google Maps nudge | Weeks 3–4: per [`QUICK_START_CHANNEL_MATRIX.md`](./QUICK_START_CHANNEL_MATRIX.md) **S1** — R1 `google_business` when social-only + walk-in |
| C3 | Recommended line uses **imperative** “update cover” tone | Google not selected | Advisory: claim / complete / verify — per `OUTPUT_TRANSLATION_SPEC` §2.4 |
| C4 | Week 4 audit list mixes selected + fallback | pc04 duplicate Google labels | Split **Your channels** (selected) vs **Worth adding when ready** (recommended) |
| C5 | Week 1 **email signature** when `email_newsletter` not selected | pc05, lean-core | Execute only if selected **or** email appears in `inferRecommended` in Expand weeks |

### P0 — Task doesn’t match surface (breaks credibility)

| ID | Issue | Fix direction |
|----|--------|----------------|
| S1 | Social “2–3 posts” copy applied to **Google / directory** | Bucket-specific Week 2 voice line: reviews, services, Q&A, photos |
| S2 | “Profile, bio, or pinned post” on **Website** | “Homepage hero + contact page” for `owned_channel` |
| S3 | Lead-gen **consult/quote** on **marketplace** | Commerce goal lines: shop link, listing clarity, trust badges |
| S4 | solo_maker Week 1 **Look** task before Week 3 visual week | Move cover/banner to Week 3 or label “quick win optional” |

### P1 — Language (non-marketer)

| ID | Copy | Suggested plain alternative |
|----|------|----------------------------|
| L1 | `Brand Identity Guide → Summary` | “Open your guide to **Summary** (page 1)” or “the Summary page in your Brand Identity Guide” |
| L2 | “who/what/outcome lines” | “the **What we do / Who it’s for / What changes** lines on Summary” |
| L3 | “mirror your core positioning” | “use the same business description” |
| L4 | “Apply voice rules” | “check drafts against **Rules** on the Voice page” |
| L5 | “brand positioning” | “how you describe your business” |
| L6 | Week 4 “skim all sections” | “re-read each page once; fix anything that sounds or looks off” |

### P1 — Product logic

| ID | Issue | Fix direction |
|----|--------|----------------|
| G1 | `guideFocus` not wired | Drive week emphasis, pointer text, optional “start here” callout |
| G2 | `guideFocus` vs `primaryGoal` can diverge | Single routing table documented in spec |
| G3 | Week 1 pointer omits **Voice** for profile polish | Add Voice to Week 1 pointer when `look_more_professional` |

### P2 — Cognitive load & habit

| ID | Issue | Fix direction |
|----|--------|----------------|
| M1 | 7–8 ☐ items/week | Cap at **4 required + 2 optional**; or “Minimum viable week” subsection |
| M2 | No time estimate | “About 1–2 hours” per week in lead |
| M3 | “30-Day” vs 4 thematic weeks | Subtitle: “Four weekly check-ins (~30 days)” |
| M4 | No “done looks like” | One concrete example per week (“e.g. LinkedIn About matches rule 2”) |
| M5 | Kit intro lists 4 PDFs immediately | Two sentences: guide + checklist; depth PDFs in Week 4 or appendix |

### P3 — Nice-to-have

| ID | Issue |
|----|--------|
| N1 | `hasExistingBrand` Week 1 “verify assets” beat (spec’d, not verified in Quick Start) |
| N2 | Asset folder / file naming (industry best practice) — out of scope for Core? |
| N3 | Monthly QA ritual after Week 4 |

---

## Recommended north-star (Phase B draft)

Keep **four weeks**, rename leads for clarity:

| Week | New lead (plain) | Minimum viable ☐ (3) |
|------|------------------|----------------------|
| **1 — Be clear where people find you** | Update {primary}: bio, headline, and main CTA using Summary + Examples. | (1) Paste one-line into headline (2) Rewrite About from Summary (3) One obvious CTA link |
| **2 — Sound the same** | Use Voice rules on {primary}; fix your last 2–3 pieces of copy. | (1) Voice rules check on About (2) One post or listing rewrite (3) Match {secondary} bio if you use it |
| **3 — Look the same** | Apply colors and type from Look to {primary} cover/banner and one template. | (1) Cover/banner colors (2) One post template (3) Profile photo consistent |
| **4 — Check and maintain** | Read the full guide once; fix stragglers; share with anyone who posts for you. | (1) Voice consistency skim (2) Color skim (3) Share guide PDF |

**Routing:**

- `look_more_professional` → emphasize Week 1 + 3; optional note Week 2 can wait if visual polish is urgent (product call).
- `sound_more_consistent` → start Week 2; Week 1 bios still prerequisite.
- `know_what_to_fix_first` → Week 2 opens with “read Rules, find one off-brand paragraph on {primary}.”
- `give_clear_direction` → Week 4 moved up in intro (“sharing with a VA?”) without skipping foundations.

---

## Alignment with our kit (customer journey)

| Step | Industry best practice | Our kit today | Gap |
|------|------------------------|---------------|-----|
| 1 | Read cheat sheet | Brand Identity Guide | ✅ Intro says start here |
| 2 | Fix #1 channel | Week 1 | ⚠️ Language + extra channels |
| 3 | Apply voice | Week 2 + Voice Playbook depth | ✅ |
| 4 | Apply visuals | Week 3 + Style depth | ✅ |
| 5 | Audit / hand off | Week 4 | ⚠️ Handoff weak for `give_clear_direction` |
| 6 | Ongoing QA | Not in kit | Optional Month 2 card |

---

## Phase B implementation checklist (engineering)

Use this after copy sign-off on the north-star table and **channel recommendation matrix** ([`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md) research backlog):

- [ ] `inferRecommendedTouchpoints(form)` + per-channel *why* snippets (industry × operating model pass)
- [ ] `resolvePriorityChannelPlan` for Weeks 1–2; keep `resolveChannelPlan` only where fallbacks needed for empty touchpoints
- [ ] Weeks 3–4: **Expand** subsection (≤2 advisory ☐) separate from Execute tasks
- [ ] Week 4: split audit lists — **Your channels** vs **Worth adding when ready**
- [ ] Bucket-specific Week 2 `voiceRefreshLine` (directory vs social vs marketplace vs owned)
- [ ] `quickStartWeekGuidePointer` + Week 1 tasks: plain labels; Voice in Week 1 when `look_more_professional`
- [ ] `guideFocus` module: week lead override + optional first bullet
- [ ] Trim to 4–6 ☐ per week; optional lines tagged
- [ ] Simplify `composeQuickStartKitIntro`
- [ ] Extend `quickStartAudit.test.ts` for channel-honesty and surface-fit
- [ ] Update `OUTPUT_TRANSLATION_SPEC.md` Quick Start rows
- [ ] Regenerate persona PDFs for visual QA

---

## Deferred (unchanged)

**Voice page footer → Quick Start Week *n*** remains blocked until P0/P1 fixes land. See [`QUICK_START_REFACTOR.md`](./QUICK_START_REFACTOR.md).

---

## Changelog

| Date | Note |
|------|------|
| 2026-05-27 | Phase A complete: outside research + persona read-through + issue register |
| 2026-05-27 | Channel strategy: Execute (W1–2) on selected; Expand (W3–4) with recommendations → `QUICK_START_CHANNEL_STRATEGY.md` |
