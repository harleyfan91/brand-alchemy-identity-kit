# Core path customization audit

**Purpose:** End-to-end view of the Identity Kit intake → deterministic generation path, mapped from **generic** (one-size-fits-many) to **customized** (signals that narrow copy and channel advice). Use this to prioritize product work so outputs stay credible for segments such as **Etsy-forward makers** vs **LinkedIn-forward consultants**.

**Related specs:** `OUTPUT_TRANSLATION_SPEC.md` (translation layers), `DELIVERABLE_PRODUCTION_SPEC.md` (deliverable rules), `CORE_INPUT_REDESIGN_ANALYSIS.md` (deterministic input philosophy), `SCREEN_COPY_MAP.md` (UI copy inventory), `STEP1_INDUSTRY_CATALOGS.md` (industry wheel reference).

---

## 1. What we mean by generic vs customized

| End of spectrum | Meaning in this codebase | Examples |
|-----------------|-------------------------|----------|
| **Generic** | Same strings or templates for most users; fallbacks when a key is empty or unknown | Default stage framing, default narrator fallback, `DEFAULT_CATALOG` / `DEFAULT_INDUSTRY_VOICE`, typography stand-ins (Inter / Source Serif 4) |
| **Customized** | Output branches on **structured** fields the user set | Step 1 industry-specific wheel options, `week1Items` keyed by `brandNarrator`, `touchpointCluster` from narrator **+** industry, industry-aware buyer archetypes |

**Important:** “Customized” here is **rule-based**, not LLM-personalized (Core tier is deterministic assembly in `packages/generation`).

---

## 2. Core path map (intake → PDF)

Rough flow: **micro-step wizard** (`apps/web`) → **`IdentityKitForm`** (`packages/shared/src/form.ts`) → **generation** (`packages/generation/src/deterministic/*`, PDF render).

### 2.1 Spectrum by layer

| Layer | Location (primary) | Generic ↔ customized | Notes |
|-------|---------------------|-------------------------|-------|
| **Business name** | `step1.businessName` | Neutral fact | Drives anchors and specimens; not “industry logic.” |
| **Industry** | `step1.industry` | **Strong customization** for Step 1 wheels | `INDUSTRY_CATALOGS` in `apps/web` + `packages/shared` `step1ControlledOptions.ts`; `other` uses `DEFAULT_CATALOG`. |
| **Stage** | `step1.stage` | **Medium** | Drives `StageContext` → Quick Start preambles, one Style Guide do/avoid line (`stageContextFromStage` in `brandProfile.ts`). |
| **Brand narrator** | `step1.brandNarrator` | **Strong** for channel **archetypes** and Week 1–2 checklist *templates* | `narratorProfiles.ts`: `primary_channels`, `content_pillars`, CTA patterns, `week1Items` / `week2Items` in `coreAssembly.ts`. |
| **Offer + transformation** | Controlled IDs + optional Other | **Strong** in sentence assembly | Labels/descriptions from industry catalog; assembled lines in `coreAssembly.ts`. |
| **Buyer archetype** | `step2.customerArchetype` | **Medium** | Controlled ids map to display titles via `resolveBuyerArchetypeTitle` in `packages/shared/src/buyerArchetypes.ts` (catalog shared with the web wizard). |
| **Voice** | `step3` preset + sliders (+ optional notes Pro) | **Medium** | Tone copy and guardrails; sliders shape phrasing in places. |
| **Values / story / aesthetic / competitors** | Steps 4–7 | **Low–medium** in Core PDF today | Feeds brief sections, differentiation, visuals; less “channel routing” than narrator/industry. |
| **Touchpoint cluster** | Derived: `computeBrandProfile` → `touchpointCluster` | **Medium–strong** for **Week 3** visual rollout | `brandProfile.ts`: narrator first, **industry overrides** (e.g. `solo_expert` + construction → `physical_first`; `retail` in `PHYSICAL_OVERRIDE_INDUSTRY` for `local_team`). Week 3 **bullets** interpolate `resolveChannelPlan` labels so cluster shape does not hardcode the wrong network (e.g. Instagram when Etsy is primary). |
| **Typography framing** | `typographyContextFromCluster` → `typographyMatrix.ts` | **Medium** | `professional_and_digital` templates in `typographyMatrix.ts` still use “LinkedIn” as a placeholder string; **PDF assembly** replaces it with the resolved primary channel label so Etsy-first experts do not see LinkedIn in the Style Guide lead. |
| **Industry voice seasoning** | `industryProfiles.ts` | **Weak today (coverage)** | Only **some** industries have profiles; rest → `DEFAULT_INDUSTRY_VOICE`. Wired into Voice Playbook / assembly per `OUTPUT_TRANSLATION_SPEC` §6 intent. |

### 2.2 Where the kit already avoids “LinkedIn for everyone”

- **Week 1 actions** are keyed by **`NarratorId`** in `coreAssembly.ts` (`week1Items`): e.g. `solo_maker` → Etsy/listing-focused bullets; `solo_expert` → LinkedIn + website + email.
- **`primary_channels`** in `narratorProfiles.ts` orders channel language (e.g. solo_maker: Instagram, Pinterest, Etsy shop) and feeds Week 2 / Week 4 strings.
- **Week 3** uses **`touchpointCluster`** for *which* checklist family (e.g. `solo_maker` + most industries → **`social_product`**), while **`resolveChannelPlan(form)`** supplies channel names (Etsy vs Instagram, etc.) so static cluster copy cannot contradict ordered touchpoints.
- **Voice Playbook** separates recurring **messaging themes** (topic-level pillars) from **CTAs** (calls to action on the primary channel from touchpoints + `primaryGoal`), so themes are not mistaken for tone or for the closing ask.

So the **Etsy seller seeing LinkedIn** is less likely when they pick **`solo_maker`**. It **is** a risk if they pick **`solo_expert`** (service/consulting narrator) while selling on Etsy: Week 1 will still follow `solo_expert` (LinkedIn-first). That is a **narrator / positioning mismatch**, not a missing industry row.

---

## 3. “Main goals” — social vs website vs growth (are we capturing them?)

### 3.1 In the schema today

**Structured signals that now exist (Core):**

- **`step1.touchpoints[]`** — ordered, normalized multi-select (see `packages/shared/src/touchpoints.ts`); drives Week 1 anchor, channel-named copy, Voice Playbook CTAs on the primary channel, and related deterministic routing (with narrator fill-in when empty).
- **`step1.primaryGoal`** — `direct_sales` | `lead_gen` | `audience_growth` | `retention`; drives Voice Playbook CTA patterns and goal-aligned checklist language where wired.

**Still thin or implicit (no dedicated field for):**

- Relative *priority* of social vs site beyond touchpoint order (e.g. “website is legacy, TikTok is the bet”),
- Appetite to expand / pivot channels,
- A full “main goals” discovery questionnaire beyond goal + touchpoints.

The closest **additional** signals are:

| Signal | What it captures | What it does *not* capture |
|--------|-------------------|----------------------------|
| **`brandNarrator`** | Archetype of how the business shows up (expert / maker / local team / product / mission) | Fine-grained “I only sell on Etsy, no site” unless touchpoints reflect it. |
| **`narratorProfiles.primary_channels`** | Ordered default channels **per narrator** when touchpoints are missing or incomplete | User-specific truth when the user does not set touchpoints. |
| **`step1.industry` + wheels** | What they sell, to whom, how, before/after | Marketing strategy or channel budget. |
| **Pro freeform** (pain points, outcomes, notes) | Optional texture | Not structured for deterministic routing in Core today. |

So **channel + business goal** are partially first-class; the **initial discovery idea** (“really focused on social vs website” as narrative) can still gap if touchpoints are empty or narrator-heavy defaults win. Week 2 email signature and `professional_and_digital` typography are now **touchpoint-aware** where it mattered most; remaining narrator-default lines should still be reviewed when new narrators or industries ship.

### 3.2 Product direction (when you implement goals)

Without prescribing implementation here, the audit conclusion is:

1. **If** channel alignment matters for trust, add a **small structured slice** (e.g. primary touchpoint + “also active on” + optional “avoid recommending”) **or** infer with explicit confirmation in UI.
2. Pipe that signal into: Quick Start weeks, typography section leads where they name channels, and any “apply first” blocks — **after** narrator + industry, so rules stay deterministic.
3. Optionally surface **tradeoffs** (“double down vs expand”) as **templated** copy keyed off goal + stage, not freeform strategy.

Document cross-refs: `OUTPUT_TRANSLATION_SPEC.md` §6 (industry profile), checklist items in `DELIVERABLE_PRODUCTION_SPEC.md` re `primary_channels`.

### 3.3 Current execution direction (active)

This is now implemented as a **first-class alignment** foundation:

1. Spec contract: ordered `step1.touchpoints[]` (multi-select, rank by selection order).
2. Intake UX: visual, bucketed touchpoint selector with ranked badges (1-4), no separate primary field.
3. Deterministic resolver: generation resolves channels from normalized user-selected touchpoints first, then narrator defaults as fallback/fill.
4. Shared registry: canonical IDs/buckets/labels + alias normalization now live in `packages/shared/src/touchpoints.ts` and are consumed by web + generation.
5. Next checkpoint: keep `OUTPUT_TRANSLATION_SPEC.md` §2–3 aligned with schema; extend `touchpoints` / `primaryGoal` into every narrator-default paragraph that still reads generic; re-run generation fixtures when copy changes.

---

## 4. Gaps and misfire modes (prioritized)

| Risk | Why it happens | Mitigation direction |
|------|----------------|----------------------|
| Wrong channel tone (LinkedIn vs Etsy) | User selects **narrator** that does not match go-to-market | Onboarding copy + examples; optional validation when `industry` is `retail` / maker-heavy and narrator is `solo_expert` |
| Week 2 still assumes email + “posts” | Was partly generic | **Mitigated:** `week2Items` branches email signature on `email_newsletter`, bucket-aware “what I do” line, and marketplace vs post cadence copy. |
| Industry voice only on a subset | `INDUSTRY_VOICE` map incomplete | Expand `industryProfiles.ts` for high-traffic industries |
| `other` industry | `DEFAULT_CATALOG` + default voice | Acceptable; or prompt to pick closest industry |
| Typography “LinkedIn” in **professional_and_digital** | Template text in `typographyMatrix.ts` | **Mitigated in assembly:** primary channel label replaces “LinkedIn” when the PDF is built; keep cluster routing so retail/maker paths still land in **social_and_packaging** / **social_and_digital** where appropriate. |

---

## 5. Where to focus development (for more “customized kit”)

Ordered for **impact on perceived personalization** vs **scope**:

1. **Finish wiring `touchpoints` + `primaryGoal`** into Week 2–4, typography leads, and any remaining narrator-default lines — **Week 2–3 + typography leads shipped**; sweep remaining narrator-only paragraphs opportunistically.
2. **Narrator × industry guardrails in UI** — **partial:** soft hints on Step 1 (narrator) and Review when industry suggests maker/retail and narrator is `solo_expert`.
3. **Complete industry voice profiles** and ensure assembly always **consumes** `getIndustryVoiceProfile` where spec promises it.
4. **Tighten Week 2–4** strings to use `primaryChannelSet` / future user channel set with fewer generic assumptions.
5. **Archetypes** for industries still on fallback lists (if any) — Step 2 feel.

---

## 6. Maintenance checklist when adding inputs or industries

- [ ] `packages/shared` form types + web validation + initial state  
- [ ] `step1ControlledOptions` **web + shared** parity (`STEP1_INDUSTRY_CATALOGS.md`)  
- [ ] `industryLabels` in `coreAssembly.ts` (and review UI if duplicated)  
- [ ] `packages/shared/src/buyerArchetypes.ts` (buyer options + `resolveBuyerArchetypeTitle`) + optional `industryProfiles`  
- [ ] `touchpointClusterFromForm` if industry changes primary touchpoint  
- [ ] PDF / snapshot tests under `packages/generation` if output strings change  

---

*Last updated: touchpoints + primaryGoal in schema; buyer archetypes canonical in shared + PDF title resolution; Voice Playbook themes vs CTAs.*
