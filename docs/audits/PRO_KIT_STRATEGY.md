# Pro Kit Strategy — $149 scope

**Status:** Strategy / decision memo for the $149 Pro tier. Supersedes earlier drafts (`PRO_KIT_STRATEGY_V2.md` retired on merge). When decisions land, mirror them into [`PRODUCT.md`](../../PRODUCT.md), [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md), [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md), and [`PHASE_ROADMAP.md`](../../PHASE_ROADMAP.md).

**Companion docs:**
- [`PRODUCT.md`](../../PRODUCT.md) — current tier framing and Pro promise.
- [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) — per-PDF Core vs Pro section matrix.
- [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §1.2, §2.2, §5.
- [`CORE_INPUT_REDESIGN_ANALYSIS.md`](./CORE_INPUT_REDESIGN_ANALYSIS.md) — deterministic Core input philosophy this doc deliberately extends for Pro.
- [`INTAKE_TO_SIGNAL_MODEL_MEMO.md`](./INTAKE_TO_SIGNAL_MODEL_MEMO.md) — signal / surface / deferred input model.
- [`INTAKE_CONTRACT.md`](./INTAKE_CONTRACT.md) — live field inventory, consumers, validation vs spec, drift register.
- [`../research/PRO_OUTPUT_PERSISTENCE_AND_MEMORY.md`](../research/PRO_OUTPUT_PERSISTENCE_AND_MEMORY.md) — hybrid AI/deterministic deliverables, `kit_section_outputs`, within-kit vs cross-kit memory (no prompt bloat).

---

## §0 TL;DR

1. **Pro is a $149 tier where AI analyzes the buyer's business like a strategist would, integrates the brand they already have, and writes the applied copy they actually need.** Not a brand template. Not a logo generator. An analysis kit.

2. **Pro = 7 PDFs to Core's 5** (8 when existing brand is provided). The shared 5 Core PDFs ship with AI-rewritten prose plus a Pro Visual Reference Spread on the Style Guide; the Pro-only net-new files are the Content Starter Pack and the Brand Strategy Memo, plus a conditional Brand Audit when the buyer uploads an existing brand. (The curated moodboard work — image bank, ranker, caption — still ships, but now lives inside the Style Guide as Pro pages 3–4 rather than as a standalone PDF; this dropped the bundle from 8/9 to 7/8 files.)

3. **Four levers carry the value:**
   - **A — AI rewrites Core prose.** Every reader-facing paragraph in the shared 5 PDFs is rewritten to be specifically about this business.
   - **B — High-signal inputs.** Deep business description, voice samples, mood adjective chips, and an existing-brand track (logo, reference image, hex inputs, optional URL).
   - **C — Applied-copy deliverables.** Content Starter Pack and Voice Playbook page 3 (email templates, before/after rewrites, CTA variations).
   - **D — Strategist analysis.** Brand Strategy Memo (archetype, JTBD, behavioral audience, tensions, contrarian angle, messaging hierarchy with proof points, 90-day roadmap, conditional brand narrative) and Brand Audit when an existing brand is provided.

4. **Visuals come from a curated, owned image bank — not from AI image generation.** AI's role on the moodboard is selection and captioning, not creation. The buyer gets guaranteed-quality imagery at zero marginal cost and no IP exposure.

5. **The deterministic Core compiler stays in charge of strategy.** Narrator, palette, style, path-class routing, section ordering, page counts, and CTA composition policy remain deterministic. AI improves voice, specificity, and analysis within those boundaries. Every AI output has a deterministic fallback path.

6. **Cost envelope sustains ~92% gross margin at $149.** ~$3–4 in Anthropic calls (Sonnet 4.5 with prompt caching + Opus for the Strategy Memo's 8 sections incl. messaging hierarchy), ~$0.10 storage, ~$4.77 Stripe fees, ~$2 dispute reserve. Total marginal ~$12.10.

7. **Implementation order:** Pro-0 (CTA bank audit) → Pro-A (AI plumbing) → Pro-B (CSP + Voice page 3 + CTA variations) → Pro-C (new intake) → Pro-D (existing-brand track) → Pro-E (Strategy Memo) → Pro-F (Brand Audit) → Pro-G (moodboard bank + Pro Visual Reference Spread on Style Guide) → Pro-H (upgrade ladder). Pro-I is v1.5 backlog.

---

## §1 Where we are right now

### 1.1 What Core delivers today (production-ready)

Five PDFs from a deterministic compiler over `IdentityKitForm`. Three-layer model (input normalization → section planning → realization, per [`DETERMINISTIC_CUSTOMIZATION_MODEL.md`](../DETERMINISTIC_CUSTOMIZATION_MODEL.md)). Strong structured signals (narrator × industry × touchpoints × goal × operating model × tone × stage). Path Class Catalog ([`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §3.3) pins canonical combinations to tests. Constrained Core inputs — no AI repair layer, by design ([`CORE_INPUT_REDESIGN_ANALYSIS.md`](./CORE_INPUT_REDESIGN_ANALYSIS.md) §4.5).

### 1.2 What "Pro" is today (mostly stub)

In code today, "Pro" means:
1. Eight extra intake fields across steps 2–7 (`painPoints`, `desiredOutcomes`, `customVoiceNotes`, `missionStatement`, `originSummary`, `motivation`, `existingTypeface`, `colorMoodNotes`, `styleNotes`, `referenceUploadName`, `differentiation`).
2. Inline deterministic concatenation of those fields into Core templates (no AI synthesis runs anywhere).
3. A documented but unbuilt Content Starter Pack PDF + Voice page 3 extensions.

`ANTHROPIC_API_KEY` is in `.env.example` but no AI client, prompt registry, or Pro fulfillment path exists.

### 1.3 The pricing gap problem at $149

Core $79 → Pro $149. $70 premium. Today's Pro promise (one extra PDF + "more polished base") doesn't defend that gap. Buyers won't pay $70 more for appended textareas in Core templates.

The strategy in this doc is to make Pro feel **categorically different** at the same $149 price: same skeleton on shared PDFs, but every paragraph AI-rewritten to be specifically about this business, two new Pro-only PDFs (Content Starter Pack + Brand Strategy Memo), a third when existing-brand inputs are present (Brand Audit), and an intake that visibly integrates whatever brand the user already has.

### 1.4 The $149 cost envelope (the constraint that shapes everything below)

| Line item | Cost |
|---|---|
| Stripe fees (3% + $0.30) | ~$4.77 |
| Anthropic — section rewrites (Sonnet 4.5, ~12 sections w/ prompt caching) | ~$1.50 |
| Anthropic — Content Starter Pack (Sonnet 4.5, ~8 sections) | ~$0.80 |
| Anthropic — Voice page 3 extensions (Sonnet 4.5, ~3 calls) | ~$0.30 |
| Anthropic — Brand Strategy Memo (**Opus 4.5**, 8 sections incl. messaging hierarchy + conditional narrative, premium model deliberate) | ~$1.80 |
| Anthropic — Brand Audit, conditional (Sonnet 4.5 with vision, ~30-50% of kits) | ~$0.40 avg |
| Supabase storage (logo + 1-2 reference images per Pro kit) | ~$0.05 |
| Ops buffer (retries, repair passes, observability) | ~$0.50 |
| Refund / dispute reserve (~1-2%) | ~$2.00 |
| **Total marginal cost** | **~$12.10** |
| **Gross margin on $149** | **~$137 (~92%)** |

This is the budget. Every scope decision below traces back to it. Items get cut when they push us toward 80% margin without proportional differentiation.

---

## §2 Four levers

The Pro value lands across four levers. Each defines where AI is allowed to act and what it produces.

| Lever | Definition | Examples in Pro at $149 | Risk |
|---|---|---|---|
| **A. Push existing inputs harder** | AI rewrites Core's deterministic prose using all intake signals | Every `ai_enhanced` section in §1.2 Mode Matrix | Lowest — scaffold-and-refine; deterministic fallback always |
| **B. Add the new inputs that matter** | New Pro fields that materially change AI output quality | Deep business description, voice samples, existing-brand track | Medium — must produce something credible even when skipped |
| **C. Ship `ai_only` deliverables already in spec** | New deliverables that are applied versions of existing thinking | Content Starter Pack PDF, Voice page 3 (email templates, before/after) | Medium-high — quality is the entire value |
| **D. AI as brand strategist** | Analytical deliverables deterministic logic can't produce | Brand Strategy Memo PDF, Brand Audit PDF (conditional) | High — must read like a strategist wrote it, not like AI babble |

**Visuals operate on a fifth pattern — curation, not generation.** The Brand Moodboard PDF uses a curated, owned/licensed image bank. AI's role is ranking candidates from the bank and writing the caption; AI never generates images. This is a Lever C / D pattern (judgment within deterministic constraints), not image generation. See §7.3.4 and §8.6.

**The principle:** AI improves voice, specificity, and analysis. AI does not change strategy — narrator, palette, style, and path-class routing stay deterministic. AI does not generate visual assets.

---

## §3 The goal of the Pro kit

Pro is the kit a small business buys when they want an **AI brand strategist** in addition to a brand template. Four sub-promises:

1. **"It reads my answers like a strategist would."** (Lever A) — every Brief / Style Guide / Voice Playbook section is rewritten by AI so the prose is specifically about this business. No Pro kit produces a sentence that could have come from any other Pro kit with the same narrator × industry combination.

2. **"It works with the brand I already have."** (Lever B) — logo upload, reference image upload, hex inputs, and an optional website URL integrate into the kit rather than asking the user to start from scratch. The single biggest blind spot in Core.

3. **"It hands me copy I can paste."** (Lever C) — Content Starter Pack (3 brand summaries, bios, caption starters, content pillars, paste-ready CTAs) plus Voice Playbook page 3 (email templates, before/after rewrites). Core PDFs are reference guides. These are working assets.

4. **"It tells me what a real strategist would say."** (Lever D) — a Brand Strategy Memo with archetype articulation, JTBD framing, behavioral audience description, tensions in the inputs, contrarian positioning angle, a messaging hierarchy that translates the analysis into paste-ready value prop + pillars + proof points, a 90-day prioritized roadmap, and a conditional brand narrative (Problem Story or Manifesto, whichever the inputs support). When existing-brand inputs are provided, a Brand Audit memo as well.

This is what makes $149 read as obvious value relative to $79 Core.

---

## §4 What deterministic logic structurally excluded — and what $149 Pro can unlock

Core's deterministic system is excellent at structure, routing, anchoring, and consistency. It deliberately excludes things that require judgment, synthesis, and per-business articulation. Those exclusions are Pro's opportunity. The ones we can address inside the $149 envelope:

| What's excluded today | Why Core can't do it | What $149 Pro unlocks |
|---|---|---|
| **Brand archetype articulation** (Mark + Pearson / Aaker / Jungian) | Five narrator profiles cover structure; can't reason about archetype combinations | Single AI call grounded in narrator + values + originSummary + tone + voice samples articulates archetype profile with reasoning |
| **Jobs-to-be-Done framing** | Requires synthesis across audience + transformation + offer + emotional signals | Per-section AI call produces functional / emotional / social JTBD framings |
| **Behavioral audience description** | Step 2 archetype card renders deterministically; can't describe buying triggers, objections, language | AI produces ~120 words grounded in archetype + painPoints + desiredOutcomes + voice |
| **Tensions in the brand inputs** | Deterministic compiler resolves conflicts silently via precedence rules; never surfaces them | AI strategist surfaces 2-3 tensions ("`local_team` operating model doesn't match the digital-only touchpoints") with one-line resolutions. **This is the killer section.** |
| **Contrarian positioning angle** | Industry voice profile gives a baseline register; can't reason about defensible deviation | AI grounds in industry profile + competitors to suggest a defensible non-default angle |
| **Structured messaging hierarchy** (value prop + pillars + proof points + primary message) | Deterministic compiler renders prose per-section; can't assemble a top-down hierarchy that ties value prop → pillars → proof points across the kit | AI synthesizes the prior analysis into a sales-deck-ready messaging hierarchy, with each proof point cited to a specific intake field (matches the discipline pattern from the tensions section) |
| **Diagnostic problem story** (vs aspirational manifesto) | Core has a single deterministic story angle; can't reason about whether a market-problem narrative or values-led manifesto better fits these inputs | AI picks Problem Story or Manifesto based on which input set is substantive; ships at most one |
| **Prioritized 90-day roadmap** | Quick Start is fixed 4-week; can't reason about what this specific brand most needs | AI produces three items in priority order with reasoning, grounded in the rest of the kit's analysis, each tied to a messaging pillar it activates |
| **Brand audit when existing brand exists** | No vision pipeline; can't reason about uploaded logo / reference image / website | Claude with vision reads uploaded logo + reference image (and URL as text context) to produce "what we saw / what's working / where tension is / what to do" |
| **Voice samples → voice calibration** | No mechanism for "your business writes like X" | When voiceSamples are provided, AI synthesizes them into actionable voice guidance better than abstract sliders can |
| **Vision-aware text gen** | No vision pipeline | When logo or reference image is uploaded, Brand Audit prose receives those images as multimodal input |
| **Bespoke palette seeded from reference image** | Copy/role logic keys on named palette IDs; freeform palettes break downstream copy | Hybrid: extract palette from uploaded image as a *seed*; snap to nearest named palette for copy purposes; show actual extracted hexes in intake UI as confirmation |
| **Curated visual direction** (moodboards) | Deterministic logic can't pick images intelligently from a corpus — would always pick by simple rule (e.g. first match) and feel un-curated | AI ranks candidates from a tagged image bank using the kit's palette + style + mood + narrator + reference image (when uploaded). Quality is guaranteed by human curation of the bank; variety is guaranteed by AI ranking. See §7.3.4. |

These are the unlocks that justify $149. Everything below is the wiring.

---

## §5 Audit of existing Pro-only intake fields

| Field | Status | Pro behavior change |
|---|---|---|
| `step2.painPoints` | **Keep** | Reframe label ("What's frustrating about the current options your customers have?"); AI prompt context only; stop inlining into deterministic output |
| `step2.desiredOutcomes` | **Keep** | Reframe label; AI prompt context only |
| `step3.customVoiceNotes` | **Keep** | Reframe to constraints-only ("Anything you specifically want the voice to sound like, or to avoid?"); pair with new `voiceSamples` field |
| `step4.missionStatement` | **Keep** | Reframe label to "Mission — bigger picture (optional)"; AI prompt anchor for folio 03 storyNote + Brief story angle |
| `step5.originSummary` | **Keep** | AI prompt anchor for story angle, storyNote, About-page bio |
| `step5.motivation` | **Drop** | Absorbed by deep description (§6.2) + missionStatement |
| `step6.existingTypeface` | **Keep, behind gate** | Already wired; promote into existing-brand track (§6.3) |
| `step6.colorMoodNotes` | **Merge** into `visualNotes` | — |
| `step6.styleNotes` | **Merge** into `visualNotes` | — |
| `step6.referenceUploadName` | **Replace** with real upload pipeline | See §6.3.2 |
| `step7.differentiation` | **Keep** | AI anchor for Brief differentiation block + CSP one-liner variant 3 |

Net: one drop, two merges, one replacement, six keep-with-rewire. Intake doesn't grow longer; it grows smarter.

---

## §6 New Pro inputs

Three new input categories. Together they answer the user scenarios the brief asked about: already-established brand, existing colors via image, deep freeform business description.

### §6.1 Design principles
- **One rich field beats five thin fields.** Non-marketing users will answer one 300-character "tell me about your business" textarea more reliably than seven separate 50-character prompts.
- **Optionality is informational, not punitive.** The kit produces credible output even if every Pro-only field is skipped — deterministic Core path is the fallback. Pro sells what AI **adds** when fields are filled.
- **Conditional disclosure.** Existing-brand inputs only appear when the user opts into that track.
- **Industry-aware placeholders, narrator-aware labels.** Already a pattern; extend it.

### §6.2 The deep business description (`step1.businessDescription`)

**New Pro-only micro-step inserted between Business Basics and Your Buyer.**

**Prompt:** *"In your own words, tell us about your business — what you do, who it's for, what's important about how you do it. Two to four sentences is plenty."*

**Why it's the single most valuable Pro input:**
- Captures the language the founder actually uses — the missing piece for AI voice work.
- Lowest-effort path for a non-marketing user to give us context. No slot to fit into.
- Industry-standard pattern (DXPR, Narrato, Canva Brand Kit Builder, Microsoft Designer all anchor on a rich brand description or sample doc).

**Use in generation:** primary `business_context` block in every Pro prompt package. Improves Brief, Style Guide, Voice Playbook, Strategy Memo, and CSP. Does **not** replace structured inputs — narrator / industry / touchpoints / etc. still route the kit. Description fills in language, not strategy.

**Validation:** Soft-required. 40–600 characters. Soft warning at <40; hard cut at 600. Light PII / profanity moderation.

### §6.3 The existing-brand track (Step 6 gating + conditional fields)

**Gating micro-step:** "Do you already have a brand you want this kit to build on, or are you starting fresh?"
- *Starting fresh* → current Step 6 flow (palette picker, style grid).
- *Already have a brand* → reveal the existing-brand fields below; palette picker remains but is seeded by extracted colors.

#### §6.3.1 Logo upload (`step6.logoUpload`)
- File input (PNG / JPG / SVG, ≤4MB).
- Storage: Supabase Storage bucket (`identity-kit-uploads/<orderId>/logo.*`), signed URLs only.
- Use: not rendered into PDFs by default. Instead:
  - Color extraction (`color-thief` or `node-vibrant`, server-side) feeds palette seed.
  - Style Guide Practical Usage + Quick Start gain a one-line "use your existing logo on [primary touchpoint]" instead of recommending wordmark creation.
  - Folio 02b (Typography) mutes the wordmark color blocks when a logo is present.
  - In Pro-F (Brand Audit), the logo is included as multimodal input to the Brand Audit prompt.
- Failure: graceful fallback to no-logo path; no silent degradation.

#### §6.3.2 Reference image (`step6.referenceImage`)
Replaces the current `referenceUploadName` stub.
- Same pipeline as logo. Up to two images for v1.
- Primary use: color extraction (stored separately as `referenceExtractedColors[]` to preserve the distinction from logo extraction) — surfaced as additive suggestions in the hex chips picker, never auto-fills.
- Secondary use: multimodal input to Style Guide and Strategy Memo prompts.
- **Tertiary use: moodboard tag extraction.** At fulfillment time a pre-ranker `moodboard.referenceTagExtractor` call reads the reference image and emits bank-vocabulary tags (palette family, style register, scene type, mood adjective). Those tags augment the deterministic tag matcher's inputs at lower weight than the buyer's explicit `moodAdjectives[]` chips — see [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8.1. Effect: moodboards from buyers who upload a reference image lean visually closer to that reference without being constrained by it.
- Palette UX: surface extracted hexes inline ("we found these colors — keep, replace, or pick the closest named palette below"). PDF swatch row always uses the **named palette** for copy quality (palette names matter for downstream copy; freeform palettes break `paletteColorRoles.ts` / `friendlyColorName`). Optional v2: exact-extracted-palette mode; defer.

#### §6.3.3 Optional brand colors — three hex inputs
Shown when "Already have a brand" is selected. Auto-fill from `referenceImage` extraction if present. Same snap-to-nearest-named-palette logic.

#### §6.3.4 Optional brand website URL
Single text input, validated as URL. **v1 use:** plain prompt context only ("This business has a website at example.com — match its tone register where appropriate"). **No scraping in v1.** v2 revisits Brandprint / Dembrandt patterns.

#### §6.3.5 Existing typeface (already exists)
`step6.existingTypeface` moves behind the existing-brand gate; current `typographyHonorsExistingTypeface` wiring stays.

### §6.4 Voice samples (`step3.voiceSamples[]`)

**New Pro-only micro-step.** Up to three short text fields:
- "An Instagram caption you've written"
- "A paragraph from your website or About"
- "An email you've sent to a customer"

Each optional, 280-char max. Light moderation.

**Why:** highest-leverage AI input outside the business description. Difference between "warm and friendly" as a slider and *your actual voice.* DXPR and Narrato build their entire brand-voice products around this pattern.

**Use:** pure prompt context for Voice Playbook (tone profile, messaging themes, sample phrases, email templates, before/after) and CSP (caption starters, bio variants). Never inlined verbatim in deterministic output.

### §6.5 Mood adjective chips (`step6.moodAdjectives`)

3–5 chips from a controlled vocabulary. Required for Pro (default empty allowed, but UI nudge: "pick at least 3 to sharpen your moodboard").

**Controlled vocabulary (16 chips):** *warm, cool, refined, raw, calm, energetic, playful, austere, organic, geometric, vintage, futuristic, premium, accessible, soft, sharp.*

**Why structured chips, not freeform:** moodboard selection needs concrete adjectives that map to image bank tags. Freeform text is too ambiguous to rank against. Chips also guard against brand-safety issues (no "sexy / aggressive / edgy" unless we explicitly add them).

**Use in generation:**
- Primary signal for moodboard image selection (§7.3.4 + §8.6).
- Secondary signal for Strategy Memo (informs archetype articulation and contrarian-angle prose).
- Secondary signal for Style Guide prose (`ai_enhanced` visual direction summary).

**Validation:** at least one chip required for Pro fulfillment; soft warning if fewer than 3.

### §6.6 Summary table

| New field | Home | Required? | Build cost | Primary consumers |
|---|---|---|---|---|
| `step1.businessDescription` | New micro-step in Step 1 | Soft-required | Tiny | Every Pro section + Strategy Memo |
| `step6.hasExistingBrand` (gate) | First micro-step of Step 6 | Required (yes/no) | Small | Routes rest of Step 6 |
| `step6.logoUpload` | Conditional | Optional | **Medium** (upload + storage + extraction) | Style Guide notes, Quick Start, folio 02b, Brand Audit |
| `step6.referenceImage` (replaces stub) | Conditional | Optional | Same pipeline | Palette seed, Style Guide, Strategy Memo |
| `step6.brandColors` (3 hex) | Conditional | Optional | Small | Palette seed |
| `step6.existingTypeface` | Conditional (existing field) | Optional | Tiny | Typography continuity copy |
| `step6.brandWebsiteUrl` | Conditional | Optional | Tiny | AI prompt context |
| `step6.visualNotes` (merges colorMoodNotes + styleNotes) | Step 6 | Optional | Tiny | Style Guide, Strategy Memo |
| `step3.voiceSamples[]` | New micro-step in Step 3 | Optional | Small | Voice Playbook, CSP |
| `step6.moodAdjectives[]` | New micro-step in Step 6 | Required (≥1) | Tiny | Style Guide (visual direction + Pro Visual Reference Spread selection), Strategy Memo |

Net intake impact: +1 micro-step in Step 1 (business description), +1 micro-step in Step 3 (voice samples). Step 6 stays roughly the same length (gate replaces what were three Pro textareas). Pro intake total time target: ≤8 minutes.

---

## §7 Pro deliverables at $149

### §7.1 Shared PDFs — IA stays identical to Core

The Brand Identity Guide six-page contract enforced by `core-pdfs.test.ts` stands. The four legacy deep-dive PDFs keep their section orders and page counts. AI rewrites **prose inside sections** only. AI is **not** allowed to:
- skip or reorder documented sections,
- change page count,
- change routing decisions (narrator / palette / style / path class),
- introduce invented facts.

This keeps Pro PDFs **visually indistinguishable from Core PDFs at a glance** — the buyer is paying for *specificity*, not *more design.*

### §7.2 What's allowed on shared PDFs (the deviation budget)

| Allowed deviation | Where | Why it's safe |
|---|---|---|
| AI rewrites of section prose | Every `ai_enhanced` section in §1.2 Mode Matrix | Scaffold-and-refine anchors enforce structure; deterministic fallback on AI failure |
| Voice Playbook page 3 (email templates + before/after rewrites) | `03-voice-playbook.pdf` page 3, Pro-only | Page additions allowed within flow-based deep-dive PDFs (not page-count-pinned) |
| Folio 03 personality enrichment | Brand Identity Guide folio 03 only | Already specified §10A.7.1; Core-safe fallback in place |
| Typography continuity copy when `existingTypeface` is set | Style Guide + folio 02b | Already wired; deterministic, not AI |
| Logo / reference acknowledgement copy | Style Guide Practical Usage + Quick Start Week 1/3 | Single-sentence additions gated on upload presence, deterministic |

### §7.3 New Pro-only PDFs

Four net-new PDFs ship with $149 Pro (three always; one conditional on existing-brand inputs):

#### `06-content-starter-pack.pdf`
Already specified in [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) §5. All sections `ai_only`. Build per existing spec; no new structural decisions here.

The CSP gains a new Pro-only section: **CTA variations.** For each primary touchpoint, AI generates 3–4 alternative CTA phrasings ("punchier," "quieter," "transformation-led," "differentiator-led"), grounded in the intake and using the deterministic folio 05 CTA as the anchor reference. The canonical folio 05 CTA stays deterministic — Pro doesn't change CTA composition policy. This section just gives Pro buyers paste-ready alternatives the deterministic system doesn't produce. See `OUTPUT_TRANSLATION_SPEC.md` §10A.6A for the composition policy that anchors these variations.

#### `07-brand-strategy-memo.pdf` — the new differentiator
**Purpose:** the "AI brand strategist sat across the table from you for 30 minutes" deliverable. Pro-only. 4–5 landscape pages (eight sections; the conditional brand narrative pulls the count toward 5 when it ships, toward 4 when omitted).

**Sections:**
1. **Brand archetype** — ~80 words. "Your brand reads primarily as Caregiver with Sage elements." Why it matters in practice. Grounded in narrator + values + originSummary + tone + voiceSamples. **Mark + Pearson 12-archetype framework** (most widely understood by designers and strategists). Map narrators to default archetype priors deterministically; AI refines.
2. **Jobs-to-be-Done framing** — three short paragraphs (functional / emotional / social job). Grounded in customer archetype + painPoints + desiredOutcomes + transformation.
3. **Behavioral audience description** — ~120 words. Buying triggers, information needs, common objections, resonant language. Replaces bland "they want a premium brand" patterns.
4. **Tensions in your brand inputs** — 2–3 short bullets. "You selected `local_team` operating model but only digital touchpoints." "Your tone is bold but your story is reserved." Each with a one-line resolution recommendation. **This is the killer section** — no one else does this and it builds enormous trust.
5. **Contrarian positioning angle** — ~80 words. Grounded in industry voice profile + competitors. "Most accountants lean 'reliable.' Your inputs suggest you could credibly lean 'plain-spoken' — here's why it's defensible and how to do it."
6. **Messaging hierarchy** — ~180 words structured as the bridge from analysis to deployment. Translates the prior five sections into paste-ready strategic language:
   - **Value proposition statement** (1 sentence): specific, comparative, provable. Answers "what does the customer get, what problem does it solve, why should they believe we can deliver it" — in the customer's language, not the brand's. Grounded in transformation + offer + differentiation + behavioral audience.
   - **3–4 messaging pillars**, each with: a one-line value statement (benefit + audience), and 1–2 proof points cited from intake (testimonial language, process specifics, transformation data, voice sample phrasing, existing-brand audit observations). Pillars are derived top-down from the value prop, not assembled bottom-up from features.
   - **Primary message**: the single most differentiating claim, anchored on the contrarian angle. The one line every channel returns to.
   - **Discipline:** each proof point must cite the specific intake field that grounds it (matches the tensions section pattern). Pillars where no proof point can be found get **demoted, not invented** — three solid pillars beats four aspirational ones. This guards against hallucinated proof.
7. **90-day prioritized roadmap** — three items, in order, with reasoning. Beyond the Quick Start's fixed 4-week structure. Each item references which messaging pillar(s) it activates.
8. **Brand narrative** (optional, conditional — one of two patterns, AI picks based on input substance, both can be skipped when material is thin):
   - **Problem Story** (~150 words, diagnostic): what's wrong with the market, why existing solutions fall short, what this business is doing differently. Anchored on differentiation + competitors + painPoints + transformation. Causal, not aspirational. Drives the About page, homepage hero, and pitch-deck "why we exist" slide. **Ships when differentiation + competitor inputs are substantive.**
   - **Brand Manifesto** (~150 words, aspirational): the "what we believe" statement that's quote-pull-ready. Anchored on values + missionStatement + originSummary. **Ships when values + originSummary are substantive.**
   - **Selection logic:** if both source sets are substantive, ship the **Problem Story** (more universally useful per 2026 strategist-deliverable norms — toimi.pro, themarketingjuice.com); if only one is substantive, ship that one; if neither, omit the section. Never ship both — they compete rhetorically.

**Why this PDF justifies $149 relative to $79 Core:** every other PDF in the kit gives the user *outputs*. The Strategy Memo gives them *analysis* — judgment, framing, recommendations, and the messaging language to deploy them. That's what hiring a brand strategist actually buys you.

**Model:** Claude Opus 4.5+ for this PDF specifically (premium model for premium output, ~$1.80/kit across eight sections — acceptable cost for the deliverable that carries the price point). Everything else uses Sonnet 4.5.

#### `08-brand-audit.pdf` — conditional, when existing brand provided
**Purpose:** only generated when the user provided existing-brand inputs (logo upload, reference image, hex inputs, or website URL). Pro-only. 2 landscape pages.

**Sections:**
1. **What we saw** — short observation paragraphs about the uploaded logo (visual character, what it signals), reference image (mood, palette tendencies), voice samples (current voice register, vocabulary patterns), website URL (as text context). Multimodal Claude call — logo + reference image as image input alongside text.
2. **Where it's serving you** — what's working given the strategic direction the rest of the kit recommends.
3. **Where there's tension** — honest assessment. "Your logo reads luxe-refined but your voice samples are playful — pick a lane." Use folio 03 honesty pattern (no fake praise).
4. **Recommendations** — 3-4 prioritized actions to either reinforce or evolve.

**Why this matters:** the user with an existing brand is the highest-stakes Pro buyer. They don't want a kit that pretends they're starting fresh. The Brand Audit is the single most differentiated thing the kit can do for them.

#### Pro Visual Reference Spread — every Pro kit (Style Guide pages 3–4)
**Purpose:** a curated mood-and-direction reference for the buyer to share with collaborators, photographers, designers, or to internalize as visual North Star. Pro-only. Ships as pages 3–4 of `02-style-guide.pdf` rather than as a standalone PDF — same image bank, same ranker + caption pipeline, same failure paths; just one less file in the buyer's bundle and the visual handoff lands in the same document as the visual rules. See [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) §2 for the per-page layout contract.

**Sections:**
1. **Image grid** — 6–9 curated photographs/textures selected from the bank.
2. **Caption** — ~80-word AI-written caption explaining the mood the board represents, anchored in the kit's named palette and style preset. Tone matches the rest of the Pro voice.
3. **Palette call-outs** — small footer block tying the moodboard back to the kit's named palette (3–5 swatches) so the buyer can see how the visual direction connects to the rest of the kit.

**AI's role (no generation):**
- Rank a shortlist of 20–30 bank candidates (produced by deterministic tag matching) and pick the final 6–9.
- Optionally use vision to bias ranking toward visual similarity when a reference image is uploaded.
- Write the caption grounded in palette + style + mood adjectives + narrator profile.

**The curated bank — tag matrix:**

Every image in the bank carries three **primary** tags (required) and zero or more **secondary** tags (optional refinements).

**Primary tags (required, one value per image from each set):**

| Dimension | Values | Notes |
|---|---|---|
| **Palette family** (8) | `warm-earth`, `cool-minimal`, `bold-saturated`, `soft-organic`, `deep-moody`, `bright-fresh`, `muted-sophisticated`, `clean-monochrome` | Each named palette from `PALETTE_OPTIONS` maps deterministically into one of these families |
| **Style register** (6) | `refined`, `raw`, `warm`, `sharp`, `playful`, `austere` | Maps from Step 6 style preset selection |
| **Scene type** (6) | `texture` (materials, abstract surfaces), `object` (still-life, products, single subject), `environment` (places, spaces, settings), `people` (hands at work, candid moments — never faces unless model-released), `lighting` (mood-driven light/dark studies), `pattern` (abstract / geometric repeating) | Drives variety on the moodboard — every board pulls a mix of scene types |

**Secondary tags (optional, refines ranking):**

| Dimension | Values | Notes |
|---|---|---|
| **Mood adjectives** (16) | Same controlled vocab as `step6.moodAdjectives`: `warm, cool, refined, raw, calm, energetic, playful, austere, organic, geometric, vintage, futuristic, premium, accessible, soft, sharp` | Zero or more per image |
| **Industry suitability** (8) | `professional_services`, `hospitality_food`, `makers_artisans`, `wellness_healthcare`, `retail_commerce`, `creative_agency`, `b2b_tech`, `lifestyle_consumer` | Zero or more — many images are industry-agnostic |
| **Narrator alignment** (5) | `solo_maker`, `solo_expert`, `local_team`, `growing_co`, `established_org` | Zero or more — most images are narrator-agnostic; tag only when an image is *especially* aligned (e.g. a hands-at-work shot tags `solo_maker`) |
| **License** (3) | `unsplash`, `pexels`, `licensed_stock` | Tracking only — drives attribution/license compliance, not selection |

**Bank sizing math:**
- Primary coverage requirement: every (palette family × scene type) combination has at least 5 images.
- 8 palettes × 6 scene types = **48 combinations × 5 images = 240 images minimum.**
- Recommended v1 launch target: **240–300 images.**
- Rationale: gives the ranker a candidate pool of ~5-10 images for any common tag combination; accepts thin coverage on rare combinations (which fall back to broader-tag candidates).

**Scene type distribution within the bank (recommended weights):**
- `texture` — 30% (most flexible, cheapest to source, works across kits)
- `object` — 20%
- `environment` — 20%
- `lighting` — 10%
- `pattern` — 10%
- `people` — 10% (hardest to source ethically; model releases / no-face shots preferred)

**Sourcing strategy:**
- **Unsplash + Pexels** for the v1 bulk. Both explicitly allow commercial use; CC0 or equivalent licensing. Attribution recommended but not required for most images.
- **One mid-tier stock library** (Adobe Stock, Shutterstock, or similar) for ~15–20% of the bank to cover gaps Unsplash/Pexels can't fill (especially for `licensed_stock` "premium feel" shots in `cool-minimal`, `muted-sophisticated`, and `deep-moody` palettes).
- **No custom commissions in v1.** Revisit if the bank ages noticeably.

**Refresh policy:**
- 10% rotation per quarter (~24 new images / ~24 retired). Retire images where per-kit usage frequency exceeds a threshold (set in observability) to prevent saturation.
- Track which palette × scene combos are running thin and prioritize new sourcing there.

**Failure path:**
- If the deterministic selector returns fewer than 6 candidates for a kit's tag set, broaden the search (drop the style register tag first, then drop mood adjective tags, then drop scene type weighting) until ≥6 candidates exist.
- If AI ranking fails (API error), ship the deterministic top-6 selected by tag-match score.
- If the bank has been depleted for a tag combination (post-rotation oversight), ship a deterministic minimum: 6 broadly-on-palette images from `texture` and `pattern` (the most kit-agnostic scene types).

### §7.4 Pro vs Core deliverable matrix

| File | Core | Pro |
|---|---|---|
| `01-brand-brief.pdf` | ✓ | ✓ (AI-rewritten prose) |
| `02-style-guide.pdf` | ✓ (2 pages) | ✓ (3–4 pages: + Pro Visual Reference Spread — curated image grid + AI caption + palette call-outs) |
| `03-voice-playbook.pdf` | ✓ (2 pages) | ✓ (3 pages: + email templates + before/after) |
| `04-quick-start.pdf` | ✓ | ✓ (AI-prioritized prose) |
| `05-brand-identity-guide.pdf` | ✓ | ✓ (AI-rewritten section prose) |
| `06-content-starter-pack.pdf` | ✗ | ✓ (incl. CTA variations section) |
| `07-brand-strategy-memo.pdf` | ✗ | ✓ |
| `08-brand-audit.pdf` (conditional) | ✗ | ✓ (when existing-brand inputs present) |

Core = 5 PDFs. Pro = 7 PDFs (8 with existing-brand inputs). Categorically richer bundle.

*Numbering note:* Pro previously included a standalone `09-brand-moodboard.pdf`. The moodboard's AI-driven image selection + caption now ships as the Pro Visual Reference Spread inside `02-style-guide.pdf` — see §7.3.4 above for the rationale.

### §7.5 Core prerequisite — CTA bank audit

Because Pro does not change CTA composition policy (the canonical CTAs on folio 05 stay deterministic), the **deterministic CTA bank itself must be genuinely good before Pro launches.** This is Core work, not Pro work, but it's a Pro launch prerequisite.

Required audit pass on `OUTPUT_TRANSLATION_SPEC.md` §10A.6A composition policy:
- Are CTAs varied enough across industry × surface × narrator path classes?
- Does any path class produce CTAs that read as templated?
- Are the prescriptive phrase banks deep enough? (Aim for ≥6 distinct phrases per surface-family per industry-group.)
- Do CTAs on folio 05 read as brand statements or as generic action buttons?

This audit is its own work item, separate from Pro phases. Treat as Phase Pro-0 (precedes Pro-A) or as a parallel Core-2 polish stream.

---

## §8 The AI architecture (recommendation, not yet built)

### §8.1 Provider, models, SDK

Anthropic (per `PRODUCT.md`). Claude Structured Outputs (`output_config.format` with `json_schema`) generally available on Sonnet 4.5 / Opus 4.5 / Haiku 4.5 as of Jan 2026 — constrains output to schema-valid JSON, eliminates parse-failure path.

Model selection:
- **Sonnet 4.5** for `ai_enhanced` section rewrites, CSP, Voice page 3, Brand Audit. Best cost/quality balance with prompt caching.
- **Opus 4.5+** for the Brand Strategy Memo specifically. ~$1.50/kit cost increment is acceptable for the deliverable that anchors the price point.
- **Vision (Sonnet 4.5)** for the Brand Audit when logo or reference image is uploaded.

### §8.2 Scaffold-and-refine, not raw generation

Per `OUTPUT_TRANSLATION_SPEC.md` §4.4 and §5.4. For every `ai_enhanced` section:
1. Deterministic layer builds a scaffold (required anchors, section intent, length bounds, style flags).
2. AI receives scaffold + intake context and rewrites *within the anchors*.
3. AI failure → ship the scaffold.
4. Hallucination → claim-safety pass strips fabricated metrics/superlatives, then single repair pass; if still failing → ship scaffold.

For `ai_only` sections (CSP, Voice page 3, Strategy Memo, Brand Audit):
1. Confidence gating per `OUTPUT_TRANSLATION_SPEC.md` §5.5.
2. Low confidence → reduce options / fall back to safe phrasing / drop optional sections (e.g. the conditional Brand Narrative — Problem Story or Manifesto — and any messaging-hierarchy pillar whose proof points fail the citation check).
3. AI failure on a required `ai_only` section → ship a deterministic minimal variant rather than a missing page.

### §8.3 Prompt grounding (brand memory pattern)

Every Pro prompt receives the same structured context:
```
business_context    // step1 + businessDescription + offer / transformation
audience_context    // step2 + customerArchetype + painPoints + desiredOutcomes
voice_context       // step3 + tonePreset + voiceSliders + customVoiceNotes + voiceSamples
values_context      // step4 + values + missionStatement
story_context       // step5 + originArchetype + originSummary
visual_context      // step6 + palette/style + existingTypeface + visualNotes + extracted_colors + logoRef + referenceImageRef
positioning_context // step7 + competitors + differentiation
industry_profile    // industryProfiles.ts row
narrator_profile    // narratorProfiles.ts row
constraints         // length, style, banned vocab, prohibited claims
```

Section-by-section calls (not document-by-document) — smaller schemas avoid grammar-too-large failures, easier to retry per section. **Prompt caching** on the static prefix (constraints, industry/narrator profile, schema) yields up to 90% savings across the ~12 calls per kit.

**Prompt instructional layer** — the persona, voice contracts, citation discipline, refusal protocol, and per-section task templates that wrap the context blocks above live in [`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12. That doc is the source of truth for prompt *content*; this section is the source of truth for prompt *context structure*.

### §8.4 Quality safeguards on AI output

- **Section walker** (banned vocab, em-dash budget, no fabricated metrics) extends from `core-pdfs.test.ts` to AI output. Full walker registry contract in [`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12.10.
- **Strategy Memo specific guardrails:** strict per-section word budgets (rambling is the failure mode); require each tension / JTBD claim / messaging-hierarchy proof point to cite the specific intake field grounding it (the discipline pattern that prevents fabricated proof); messaging pillars without a citable proof point get demoted rather than padded with invented evidence; banned-vocab walker tuned for strategist-jargon avoidance ("authentic," "leverage," "synergy," "growth opportunities"); narrative-section selector validates that either the differentiation+competitor branch (Problem Story) or the values+originSummary branch (Manifesto) clears a substance threshold before either ships — if neither clears, the section is omitted, not faked.
- **Fixture testing:** ship 8-10 persona fixtures (extending `established-pro.json`). Generate Strategy Memos for each. Manually review every section. Refine prompts until every memo would convince a designer that a real strategist wrote it. **Budget this as a multi-week prompt engineering investment, not a single-PR exercise.** This is the single biggest gating risk in the product.

### §8.5 Per-fulfillment cost summary

Already in §1.4. Comfortably inside $149 with ~92% gross margin.

### §8.6 Moodboard selection (no image generation)

The Pro Visual Reference Spread (Style Guide pages 3–4 per §7.3.4) is `ai_only` in the sense that AI writes the caption and ranks candidates, but **no AI image generation occurs.** The pipeline below feeds those Style Guide pages — previously it fed a standalone `09-brand-moodboard.pdf`, but the contract is unchanged:

0. **(Conditional) Reference image tag extraction.** When `existingBrand.referenceImageRef` is present, a vision-enabled Haiku 4.5 call reads the reference and emits bank-vocabulary tags (`palette family`, `style register`, `scene type`, `mood adjective`). These augment step 1's matcher inputs at lower weight than the buyer's explicit `moodAdjectives[]` chips. Failure: drop silently and continue.
1. **Deterministic tag matcher** takes the kit's tags (palette family, style register, mood adjectives, narrator profile, industry group) plus any `referenceImageTags` from step 0, and queries the bank metadata file for matching images.
2. **Ranker** receives the shortlist (20–30 candidates) plus the full kit context. Returns 6–9 selected image IDs with scene-type variety enforced (no more than 3 of any one scene type per board). Uses Sonnet 4.5 with structured output (image IDs + brief reasoning per pick for debugging).
3. **When a reference image is uploaded** (existing-brand track), the ranker is **also** given the reference as multimodal input and asked to bias selection toward visually similar candidates. The reference image therefore plays two complementary roles: shaping *which* candidates make the shortlist (step 0) and tie-breaking among similarly-scored candidates inside it (step 2). Vision-aware ranking; still no generation. See [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8.4 for the locked contract.
4. **Caption writer** produces an ~80-word caption grounded in the selected images' tags + kit palette + style + mood adjectives. Walker applies (banned vocab, length budget).
5. **PDF layout** is deterministic — fixed grid template, palette call-out block follows kit's named palette.

**Cost:** ~$0.10/kit (one ranker call + one caption call, both Sonnet 4.5 with cached static prefix). Negligible compared to image generation.

**Failure path:** if the ranker fails, ship the deterministic top-6 by tag-match score with a generic caption variant. The buyer still gets the Pro Visual Reference Spread on the Style Guide. If the entire moodboard pipeline catastrophically fails (ranker fails AND fallback returns < 6 AND caption fails), the spread is omitted cleanly and the Style Guide ships at its 2-page Core length — see [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8.5.

### §8.7 CTA variations (in CSP)

The CTA variations section uses a different pattern than the rest of CSP: the deterministic folio 05 CTA is included in the prompt as an **anchor reference**, and AI is asked to produce 3–4 alternative phrasings *in the same brand voice* but with stated variation goals ("more direct," "quieter and more inviting," etc.). Walker applies (claim-safety hardest here — no fabricated offers, no overstated outcomes). Surface-by-surface call, one per primary touchpoint.

**Architecture (locked).** One call per surface under Section ID `voice.ctaVariations`. The CSP page 2 CTA section assembler reads from this same output — there is no separate CSP CTA call, no separate prompt file, and no independent Sonnet invocation for CSP CTAs. The structured output flows once through the walker chain and renders verbatim in both the Voice Playbook page 3 and CSP page 2. This single-source contract guarantees the two PDFs cannot disagree on CTA variations for the same surface — see [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A.1 for the locked render-alias contract.

**Cost:** ~$0.15/kit (3–4 surfaces × 1 prompt each, generated once and rendered in both PDFs). Already inside the §1.4 envelope under "CSP."

---

## §9 The Core → Pro upgrade ladder

### §9.1 Mid-flow upgrade on the Review screen

Non-blocking upgrade card on `ReviewScreen.tsx` when `tier === 'core'`. Copy: *"Want this kit to use AI to integrate your existing brand and write applied copy? Upgrade to Pro for +$70."*

On accept:
1. `form.tier` → `pro` via existing `updateForm` flow.
2. Wizard routes back to the first Pro-only micro-step the user hasn't completed.
3. Wizard treats user as Pro for the remainder.
4. Payment uses `STRIPE_PRICE_PRO` instead of `STRIPE_PRICE_STANDARD`.

### §9.2 Post-purchase rerun-as-Pro

After Core fulfillment delivery, include a 30-day Upgrade-to-Pro link. Pay only the **differential** ($70) — no double-charge.

Flow:
1. Signed magic-link from email → authenticated "Welcome back" interstitial.
2. Loads persisted `IdentityKitForm` from Supabase.
3. Pre-fills every Pro-only micro-step as blank-but-skippable; user fills in what they want or hits "regenerate as Pro now."
4. Differential payment charges `STRIPE_PRICE_PRO_UPGRADE_DIFF = $70`.
5. Pro pipeline re-runs against the same form; Pro outputs replace Core outputs; CSP + Strategy Memo (+ Brand Audit if existing-brand uploaded) added.

Operationally requires: persisted intake in Supabase (already roadmap), signed magic-link route, second Stripe price, idempotency check on webhook handler.

### §9.3 Cohort assumption

Pro buyer never buys a Core kit (correct as baseline). The actual question is **Core → Pro conversion rate**. Target 5–10% within 30 days once the ladder ships. Differential at $70 covers Pro fulfillment cost cleanly even at low conversion.

---

## §10 Risks and quality safeguards

| Risk | Mitigation |
|---|---|
| **AI hallucination introduces fake claims, metrics, social proof** | Scaffold + `ai_enhanced` anchors + claim-safety walker + structured outputs. Reject + fall back on failure. Strategy Memo: require each tension / JTBD claim / messaging-hierarchy proof point to cite the intake field grounding it; pillars without citable proof get demoted, not padded. Brand-narrative selector requires substance threshold on its source inputs before shipping either Problem Story or Manifesto. |
| **Pro AI contradicts the buyer's locked direction** — e.g. Strategy Memo §4 surfaces a tension that reads as "your style is wrong, try a different one," or `ai_enhanced` Style Guide prose softens a `bold_graphic` kit. Buyer holds Core deterministic Style Guide + Pro AI Memo at the same time and the two undermine each other; the badge-vs-no-badge confusion this question is trying to solve. | **Prompt-level lock:** `# BUYER SELECTION LOCK` block in the shared base system prompt ([`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12.8) names `selectedPalette` / `selectedStyle` / `tonePreset` / `brandNarrator` by resolved ID and forbids recommending changes. Per-section prompts in §12.9.1 / §12.9.4 / §12.9.5 reinforce with invalid-framing examples. **Walker-level:** `kit_contradiction_walker` rejects outputs containing rejection-list phrases (see [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.7.0) and retries with lower temperature once before falling back. **Fixture test:** Pro acceptance suite asserts (i) no rejection-list phrases in Memo §4 / §5; (ii) Brand Audit §3 / §4 recommendations cite `existingBrand.*` fields only; (iii) per-style fixtures confirm Style Guide rewrites stay in-register. **Document-level framing:** Memo + Audit open with a template-rendered "this works alongside / bridges to your kit" sentence so the reader knows the documents don't contradict before reading the body. |
| **Strategy Memo reads like AI babble** | Opus 4.5 for this PDF specifically. Strict per-section word budgets. Walker on output (banned strategist-jargon vocab). **Multi-week prompt engineering investment with fixture review.** Single biggest quality risk in the product. |
| **Brand Audit hurts the buyer's feelings** when we observe tensions in their existing brand | Phrase tensions as "worth resolving," not "wrong." Audit explicitly says "these are observations, not criticisms; brand consistency is hard and most small businesses have at least one tension." |
| **Voice drift across a 10-section Pro kit (campaign-fade)** | Re-send voice context in every section prompt; do not rely on conversation memory. Optional v2: BRAND-style Fidelity scoring with threshold. |
| **Pro PDFs visually indistinguishable from Core, undermining perceived value** | Pro sold on reading specific to this business, not on looking different. Brand Strategy Memo and Brand Audit are net-new PDFs the buyer holds in hand; the Pro Visual Reference Spread (Style Guide pages 3–4) is visibly absent from Core. Marketing copy emphasizes *"kit that reads my answers like a strategist would"* + *"two to three extra PDFs and a Pro-only visual reference spread the buyer doesn't get in Core."* |
| **Logo / reference upload adds operational surface** | Supabase Storage with 4MB cap, allowlisted MIME, signed-URL access only. Defer virus scanning to post-launch hardening. Refuse known-bad extensions client-side. |
| **Color extraction picks wrong dominant colors on busy images** | Treat extraction as **seed**, not truth — show extracted hexes; let user confirm or pick from named palette. PDFs always render named palette object (copy quality reasons). |
| **AI takes longer than fulfillment SLA (`< 5 min Pro`)** | Run sections in parallel (Anthropic SDK supports concurrency); cache static prefix; bound each section ~500 output tokens. ~12 parallel Sonnet 4.5 calls + 1 Opus call stays under 90s. Queue + processing screen for retries. |
| **Pro intake length scares off buyers** | Audit + new fields net +2 micro-steps. Step 6 stays flat. Target ≤8 min total Pro intake; under the 10-min danger zone. |
| **Pro upgrade ladder gets exploited** | Differential at $70 covers marginal Pro work; no real exploit. Idempotent webhook prevents double-charge on retries. |
| **Existing-brand track confuses users unsure if their brand "counts"** | Gating copy: *"Do you already have a brand you want this kit to build on, or are you starting fresh?"* — not *"Do you have a logo?"* Tooltip with examples (logo, website, fonts, Instagram presence). |

---

## §11 Implementation phases

Sequenced for risk and value. Maps to `PHASE_ROADMAP.md` Stage 2 / 2C.

**Status legend:** `Complete` = phase ship gate met (any deferred sub-tasks listed below the table); `In progress` = active work in flight; `Pending` = not started.

| Phase | Status | Scope | Ship gate |
|---|---|---|---|
| **Pro-0** (Core prereq, parallel) | Pending | CTA bank audit per §7.5 — expand prescriptive phrase banks, add path-class variety, retest folio 05 across all 8 personas | All 8 personas produce non-templated, on-brand CTAs |
| **Pro-A** | Pending | AI plumbing: Anthropic client + prompt registry + structured outputs + scaffold-and-refine helper + claim-safety walker on AI output. First `ai_enhanced` Brief/Voice section produces meaningfully different Pro output. **Implementation contract:** [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) — required reading; covers the `callClaude` adapter, call-class defaults, prompt-caching structure, typed-error dispatcher, Zod-derived schemas, and §11 acceptance criteria. **Visual grounding contract:** the `visual_context` block on every Pro AI prompt must include `selectedPalette` + `selectedStyle` + `moodAdjectives[]` at minimum per [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.9.3, plus optional `existingTypeface` / `visualNotes` / `existingBrand.*` when present. | `established-pro` fixture produces a Pro Brand Brief meaningfully different from Core; all §11 acceptance criteria in the playbook met. **Visual grounding test:** a fixture that omits any of `selectedPalette`, `selectedStyle`, `moodAdjectives` from the visual context payload fails the Pro-A acceptance suite. |
| **Pro-B** | Pending | Content Starter Pack PDF + Voice Playbook page 3 + **CTA variations section in CSP**. Confidence gating per §5.5. | All three deliverables generate cleanly across 8 personas |
| **Pro-C** | **Complete** | New intake: `businessDescription` (Step 1), `voiceSamples[]` (Step 3), `moodAdjectives[]` (Step 6), audit cleanup (drop `motivation`, merge `colorMoodNotes`+`styleNotes` → `visualNotes`, reframe labels per §5). Update `OUTPUT_TRANSLATION_SPEC.md` §2.2 + §5.1. | Pro intake completes in ≤8 min on test users |
| **Pro-D** ¹ | **Complete** | Existing-brand track: `hasExistingBrand` gate, logo + reference image upload (Supabase Storage + signed URLs + size/MIME validation), `color-thief` extraction surfaced in intake UI, palette seeding + nearest-named-palette snap, conditional acknowledgement copy in Style Guide / Quick Start / folio 02b | Test users with existing brand see it visibly integrated; users without see no change in flow |
| **Pro-E** | Pending | Brand Strategy Memo PDF (Lever D). Opus 4.5. Eight sections: archetype, JTBD, behavioral audience, tensions, contrarian angle, **messaging hierarchy with proof-point citation discipline**, 90-day roadmap, **conditional brand narrative (Problem Story or Manifesto, selector validates substance)**. Multi-week prompt engineering with fixture review. Walker on output. | Memo passes designer-grade review across all 8 fixtures; messaging-hierarchy proof points all trace to real intake fields; no fixture ships both Problem Story and Manifesto. **Gate that determines whether Pro launches.** |
| **Pro-F** | Pending | Brand Audit PDF (conditional on existing-brand uploads; multimodal Claude) | Audit produces credible observations across logo-uploaded fixtures |
| **Pro-G** | Pending | **Curated moodboard bank + Pro Visual Reference Spread on Style Guide** (§7.3.4): source 240–300 images from Unsplash/Pexels + mid-tier stock, build tagging schema + metadata file, implement deterministic tag matcher + AI ranker + caption writer, **layout pages 3–4 of `02-style-guide.pdf` as the Pro Visual Reference Spread** (gated on `tier === 'pro'`, same conditional-page pattern as Voice Playbook page 3), set up usage frequency observability. **Style influence contract:** `selectedStyle` is a required input to both the deterministic tag matcher (`style register` axis, [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.8.1 step 1) and the AI ranker / caption prompts; the spread must not render if `selectedStyle` is empty. | All 8 fixtures produce coherent Pro Visual Reference Spreads on the Style Guide; no scene-type or industry combination is uncovered. **Style coverage test:** for each of the four `selectedStyle` values, every fixture produces a spread whose selected images cite the matching `style register` tag in the ranker reasoning at least 50% of the time, demonstrating that the field actually influenced selection rather than being passively passed through. **Render gate test:** a Core fixture rendering `02-style-guide.pdf` ships at 2 pages with no spread; the same fixture flipped to `tier === 'pro'` ships at 3–4 pages with the spread present. |
| **Pro-H** | Pending | Upgrade ladder: mid-flow Review-screen upgrade + post-purchase magic-link differential upgrade. `STRIPE_PRICE_PRO_UPGRADE_DIFF` env. Idempotent webhook. | Both upgrade paths work end-to-end |
| **Pro-I (v1.5 backlog)** | Pending | URL scrape, post-pay section regenerate, BRAND scoring, expanded moodboard bank, structured `brand-context.json` export (MRBS-lite — every Pro buyer gets a machine-readable brand context they can paste into ChatGPT / Claude / Cursor / Gemini for consistent downstream AI output; watches the Mavic AI / BrandKity MCP / MRBS standards trend), Studio tier (if validated) | Each ships independently when intake or buyer-feedback data justifies |

¹ = phase met its ship gate but carries deferred sub-tasks tagged to a later phase; see "Deferred sub-tasks" below.

### §11.1 Phase carryover — deferred sub-tasks

When a phase ships its primary ship gate but defers a slice of scope (intentionally, with a downstream phase as the natural home), capture it here. Keeps deferred work visible without blocking the phase from being marked `Complete`.

- **Pro-D → Pro-E:** `/uploads/sign` + `/uploads/confirm` Supabase endpoints. The intake UI writes a `pending:` placeholder path; the locked endpoint contract lives in [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) §5.6.0. Pro-E (and Pro-F's Brand Audit, which actually consumes the uploaded images) needs the real endpoints, so they ship together.
- **Pro-D → Pro-E:** Deterministic acknowledgement copy injection — Style Guide practical-usage line, Quick Start week 1 line, and folio 02b color-block muting when `existingBrand.logoRef` is present. Bundled with the Pro-E fixture-review pass so all logo-aware copy lands in one coherent sweep.

### §11.2 Recently shipped

- **Pro-C** — New intake fields landed in commit `5d9145f`.
- **Pro-D** — Existing-brand track + palette snap + style-step empty-state preview landed in commit `d178244`.

**Cuttable order if scope must shrink further:** Pro-I deferred; Pro-G can ship as a 1.1 update if bank curation takes longer than expected (Pro launches as 6 PDFs / 7 with existing brand — Style Guide stays at its 2-page Core length; Pro Visual Reference Spread added in 1.1); Pro-H upgrade ladder can ship 1-2 weeks post-Pro launch. Pro-E remains the deliverable that justifies the price gap to Core — cutting deeper than that isn't viable.

---

## §12 Open questions

1. **Should `businessDescription` be required or soft-required?** Required gives more reliable AI output; soft-required preserves "Pro is forgiving" positioning. **Recommendation: soft-required** with UI nudge ("Pro works much better with this filled in").
2. **Where in the wizard does `businessDescription` live?** New Step 1 micro-step `c1_s7` after the transformation builder, or as a Pro-only screen between Landing and Step 1? **Recommendation: new Step 1 micro-step `c1_s7`** — natural "now tell us in your own words" closer to the structured Step 1 inputs.
3. **Brand archetype framework — Jungian 12, Mark+Pearson, Aaker, or custom?** **Recommendation: Mark + Pearson 12-archetype** — most widely understood by designers and strategists. Map narrators to default archetype priors deterministically; AI refines.
4. **How aggressive can the Brand Audit be?** Can it say a logo is bad / the brand is in conflict? **Recommendation: yes but framed as "worth revisiting" / "tension to resolve" — honest, not sycophantic, not cruel.**
5. **Do we offer the Strategy Memo for Core as a paid add-on?** Tempting but breaks "Core = deterministic" promise. **Recommendation: no.** Memo stays Pro-only.
6. **Should Pro PDFs visually differ from Core (Pro accent color, Pro badge in footer)?** **Recommendation: no.** Customer wants artifacts to feel like their brand, not paid-tier badging. Internal markers live in metadata, not on the page.
7. **How does the differential upgrade interact with refund policy?** If Core delivered successfully and differential-Pro fails, refund the differential, the full Pro price, or replace the Pro work? **Recommendation: differential refund + retained Core delivery.** Document in refund policy when written.
8. **Pro intake upper bound?** Core targets ~5 min. **Recommendation: ≤8 min for Pro.** Audit + new fields stay inside that.

---

## §13 Mapping back to existing docs

When this strategy lands:

| Doc | Change required |
|---|---|
| [`PRODUCT.md`](../../PRODUCT.md) | Replace "AI-powered (buyer-visible meaning)" stub with §3 positioning. Add Core → Pro upgrade conversion target. Add Pro intake-time target (≤8 min). Confirm $149 single-tier Pro pricing. Update Pro deliverable list to 7 PDFs (8 with existing brand). |
| [`DELIVERABLE_PRODUCTION_SPEC.md`](../../DELIVERABLE_PRODUCTION_SPEC.md) | Add full sections for `07-brand-strategy-memo.pdf` and `08-brand-audit.pdf`. Extend §2 Brand Style Guide with the Pro Visual Reference Spread (pages 3–4, gated on `tier === 'pro'`). §8 is a redirect to the merged spread. Clarify Core vs Pro section subnotes to reflect `ai_enhanced` mode is the lever (not "Pro section gets longer"). |
| [`OUTPUT_TRANSLATION_SPEC.md`](../../OUTPUT_TRANSLATION_SPEC.md) | §1.2 Mode Matrix gains rows for new sections (incl. Strategy Memo messaging hierarchy + conditional brand narrative). §2.2 Pro fields gain `businessDescription`, `voiceSamples`, `moodAdjectives`, existing-brand track. §5.1 prompt-package structure gains the new context blocks. Add §5.6 "Existing brand integration," §5.7 "Strategy Memo composition rules" (covers per-section word budgets, proof-point citation discipline for messaging hierarchy, and Problem-Story-vs-Manifesto substance-threshold selector), and §5.8 "Moodboard bank selection contract." Add §10A.6A.1 "Pro CTA variations" subsection. |
| [`PHASE_ROADMAP.md`](../../PHASE_ROADMAP.md) | Add Stage 2 / 2C Phases Pro-0 through Pro-H. Pro-I as v1.5 backlog. |
| [`SCREEN_COPY_MAP.md`](../../SCREEN_COPY_MAP.md) | Copy for new micro-steps (deep description, voice samples, mood adjectives, existing-brand gate). Review-screen upgrade card copy. Post-purchase upgrade email + interstitial copy. |
| `.env.example` | Add `STRIPE_PRICE_PRO_UPGRADE_DIFF`. |
| New doc `docs/research/EXISTING_BRAND_EXTRACTION_RESEARCH.md` | Optional. Color extraction library comparison (color-thief vs node-vibrant). URL scrape options for v1.5. Not blocking. |
| ~~New doc `docs/research/STRATEGIST_MEMO_PROMPTING.md`~~ | **Superseded.** All Strategy Memo per-section prompts, banned-vocab additions, word budgets, citation discipline, and brand-narrative selector logic now live in [`AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) §12.9.4. Re-introduce only if the Memo prompts grow beyond what fits cleanly in the playbook. |
| [`docs/research/AI_INTEGRATION_PLAYBOOK.md`](../research/AI_INTEGRATION_PLAYBOOK.md) | **Shipped (this doc).** Sprint-prep playbook for Pro-A. Captures the Claude vision + structured-output integration pattern from a sibling production codebase (Camentra), the five must-fix changes when porting, the `callClaude` adapter contract, call-class defaults, schema-from-TypeScript pattern, cost telemetry schema, parallelization strategy, and Pro-A acceptance criteria. Read before starting Pro-A. |
| [`docs/research/PRO_FULFILLMENT_ORCHESTRATION.md`](../research/PRO_FULFILLMENT_ORCHESTRATION.md) | **Shipped.** Per-kit fulfillment lifecycle: webhook handoff, idempotent fulfillment task, fan-out across the ~26 Section IDs, walker chain, per-PDF assemblers, Storage upload, email. Locks orchestrator location (Next.js API route + `pg_boss`), state machine, 4-layer failure semantics, `kit_fulfillment_events` schema for the processing screen, and per-kit timeouts. Complements the per-call playbook above. |
| New doc `docs/research/MOODBOARD_BANK_CURATION.md` | **Recommended.** Source library comparison, tagging schema details, target bank size, selection algorithm, refresh cadence, observability for usage frequency. Useful to scope before Pro-G. |
| New doc `docs/research/CTA_BANK_AUDIT.md` | **Recommended.** Captures Pro-0 prerequisite work. Inventory of current phrase banks per industry × surface × narrator; gaps to fill before Pro launch. |

---

## §14 The argument

Pro is a single $149 tier where AI analyzes the business like a strategist would, integrates the existing brand if there is one, writes the applied copy the buyer actually needs, and ships a curated visual reference inside the Style Guide.

Seven PDFs (eight with existing brand). 92% gross margin. The Strategy Memo is the differentiator that no competitor at this price point ships.

That's the argument. Everything above is the wiring.