# Identity Kit Output Translation Spec (Hybrid Model)

This spec defines how intake inputs are translated into final deliverable sections for Core and Pro tiers.

The generation approach is intentionally **hybrid**:

- deterministic baseline sections for consistency
- AI-enhanced sections where personalization adds measurable value
- Pro-only AI sections for premium, applied content outputs

It is the implementation companion to:

- `DELIVERABLE_PRODUCTION_SPEC.md` (asset structure and page plans)
- `IDENTITY_KIT_PRD.md` (scope/phases/architecture)
- `SCREEN_COPY_MAP.md` (UI copy and input intent)

---

## 1) Translation Pipeline Overview

1. **Collect + validate input payload**
   - Source: canonical `IdentityKitForm`
   - Enforce required fields and Pro-only quality gates
2. **Normalize inputs**
   - trim whitespace
   - collapse repeated spaces
   - map enum IDs to display labels
   - snap voice slider values to canonical grid (0/25/50/75/100)
3. **Build section context objects**
   - one context object per deliverable section
4. **Generate section drafts**
   - Core: deterministic templates and rule-based phrasing
   - Pro: prompt-based generation with constraints
5. **Run output QA checks**
   - length bounds
   - style/tone constraints
   - prohibited language checks
6. **Assemble final editable outputs**
   - store by section/document
   - render into branded PDFs

---

## 1.1) Generation Modes

Each section must declare one mode:

- `deterministic`
  - template/rule generated
  - no model call required
- `ai_enhanced`
  - deterministic scaffold first
  - model refines specificity and voice under strict constraints
- `ai_only`
  - model-generated section with no deterministic equivalent
  - used for Pro-only assets (for now: Content Starter Pack)

## 1.2) Section Mode Matrix

| Document | Section | Core mode | Pro mode |
|---|---|---|---|
| Brand Brief | Brand overview | deterministic | deterministic |
| Brand Brief | Ideal customer | deterministic | ai_enhanced |
| Brand Brief | Core transformation/promise | deterministic | ai_enhanced |
| Brand Brief | Values/positioning cues | deterministic | ai_enhanced |
| Brand Brief | Brand story angle | deterministic | ai_enhanced |
| Brand Brief | Differentiation snapshot | deterministic | ai_enhanced |
| Brand Style Guide | Palette overview | deterministic | deterministic |
| Brand Style Guide | Visual direction summary | deterministic | ai_enhanced |
| Brand Style Guide | Style principles | deterministic | ai_enhanced |
| Brand Style Guide | Do/avoid guidance | deterministic | deterministic |
| Voice & Content Playbook | Tone profile | deterministic | deterministic |
| Voice & Content Playbook | Voice guardrails | deterministic | ai_enhanced |
| Voice & Content Playbook | Messaging themes | deterministic | ai_enhanced |
| Voice & Content Playbook | Sample phrases/language cues | deterministic | ai_enhanced |
| Voice & Content Playbook | Writing do/avoid guidance | deterministic | ai_enhanced |
| 30-Day Quick Start Checklist | Week-by-week checklist | deterministic | ai_enhanced (prioritization/order) |
| Content Starter Pack (Pro) | All sections | n/a | ai_only |

---

## 2) Canonical Input Contract (Current)

From `IdentityKitForm`:

- Step 1: `businessName`, `offer`, `transformation`, `industry`, `stage`, `brandNarrator`
- Step 2: `customerArchetype`, `painPoints`, `desiredOutcomes`
- Step 3: `tonePreset`, `voiceSliders`, `customVoiceNotes`
- Step 4: `values`, `missionStatement`
- Step 5: `originArchetype`, `originSummary`, `motivation`
- Step 6: `selectedPalette`, `selectedStyle`, `colorMoodNotes`, `styleNotes`, `referenceUploadName`
- Step 7: `competitors`, `differentiation`

Validation assumptions (already in flow):

- Step 1 required fields include `transformation`
- Step 2 Pro requires at least one: `painPoints` or `desiredOutcomes`
- Step 3 requires `tonePreset`
- Step 7 Pro requires `differentiation`

---

## 3) Section Mapping Matrix

| Document | Section | Primary inputs | Secondary inputs |
|---|---|---|---|
| Brand Brief | Brand anchor sentence | S1 businessName + transformation, S2 customerArchetype, S3 tonePreset | S1 brandNarrator |
| Brand Brief | Brand overview | S1 businessName, offer, industry, stage | S4 values |
| Brand Brief | Ideal customer | S2 customerArchetype, painPoints, desiredOutcomes | S1 industry |
| Brand Brief | Core transformation/promise | S1 transformation, offer | S2 desiredOutcomes |
| Brand Brief | Values/positioning cues | S4 values, missionStatement | S3 tonePreset |
| Brand Brief | Brand story angle | S5 originArchetype, originSummary, motivation | S1 stage, S1 brandNarrator |
| Brand Brief | Differentiation snapshot | S7 differentiation, competitors | S2 painPoints |
| Style Guide | Palette overview | S6 selectedPalette | S6 colorMoodNotes |
| Style Guide | Visual direction summary | S6 selectedStyle, styleNotes | S4 values |
| Style Guide | Practical usage notes | S6 style + notes | S1 brandNarrator, S1 industry |
| Style Guide | Do/avoid guidance | S6 style + notes | S3 tone |
| Voice Playbook | Tone profile | S3 tonePreset, voiceSliders | S3 customVoiceNotes |
| Voice Playbook | Voice guardrails | S3 + S4 values | S2 audience |
| Voice Playbook | Messaging themes | S1 transformation, S2 audience | S7 differentiation, S1 brandNarrator |
| Voice Playbook | Email voice application (Pro) | S3 voice, S1 brandNarrator | S2 audience |
| Quick Start | Week-by-week checklist | S1-S7 full context | Tier, S1 brandNarrator |
| Content Starter Pack (Pro) | One-liner + summary | S1 transformation, S2 outcomes, S7 differentiation | S3 tone |
| Content Starter Pack (Pro) | Homepage directions | S1 offer + transformation, S2 audience | S4 values |
| Content Starter Pack (Pro) | Social/caption/CTA set | S2, S3, S7 | S5 story, S1 brandNarrator |
| Content Starter Pack (Pro) | Content pillar prompts | S1 brandNarrator, S1 industry | S1 transformation |
| Content Starter Pack (Pro) | CTA suggestions | S1 brandNarrator, S3 tonePreset | S1 industry |

---

## 4) Core Tier Translation Rules (Deterministic)

Core output should be template-driven, with controlled variation by industry, tone, and selected options.

### 4.1 Rule Format

Each section uses:

- `template_id`
- `required_inputs`
- `fallback_inputs`
- `max_words`
- `style_flags`

Example:

```text
brand_brief.core_promise
template_id: bb_core_promise_v1
required_inputs: step1.transformation
fallback_inputs: step1.offer, step2.desiredOutcomes
max_words: 35
style_flags: [plain_language, no_hype, benefit_forward]
```

### 4.2 Core Fallback Strategy

If a section’s preferred input is missing/weak:

1. use fallback field(s)
2. reduce specificity but keep structure
3. avoid invented claims

If still weak, use neutral scaffold:

- “This brand helps [audience] achieve [outcome] through [offer].”

### 4.3 Core Language Constraints

- No unverifiable superlatives
- No fabricated metrics
- Keep sentences short and literal
- Prefer plain verbs over abstract jargon

### 4.4 Deterministic Scaffold Rules for Pro

For sections marked `ai_enhanced`, generate a deterministic scaffold first:

- required anchor facts (must mention)
- section intent sentence
- length bounds
- style flags

Model output must preserve scaffold anchors and only improve specificity/voice.

---

## 5) Pro Tier Translation Rules (Prompted Enhancements + Pro-only AI)

Pro uses AI generation per section with strict constraints.

### 5.1 Prompt Package Structure

For each section, pass:

- `business_context` (S1)
- `audience_context` (S2)
- `voice_context` (S3)
- `values_context` (S4)
- `story_context` (S5)
- `visual_context` (S6, when relevant)
- `positioning_context` (S7)
- `industry_profile` (from industry layer)
- `constraints` (length, style, prohibited language)

### 5.2 Prompt Contract Example (ai_enhanced)

```text
Task: Generate one concise brand summary paragraph.
Length: 30-45 words.
Tone: match tonePreset + sliders.
Requirements:
- mention transformation outcome
- reflect ideal customer context
- include differentiation cue if available
Avoid:
- hype claims
- generic filler phrases
```

### 5.3 Pro Quality Uplift Targets

Compared to Core, Pro output should show:

- stronger specificity
- clearer voice consistency
- better synthesis across steps
- practical copy that can be used with minimal edits

### 5.4 ai_enhanced Constraints

For `ai_enhanced` sections:

- preserve deterministic scaffold anchors
- improve clarity/specificity/tone fit
- do not add unsupported claims
- stay within section length bounds

### 5.5 ai_only Rules (Pro-only Assets)

For `ai_only` sections:

- require stronger context confidence (audience + transformation + tone + differentiation)
- if confidence is low:
  - reduce number of options
  - avoid speculative specificity
  - fall back to safer phrasing patterns

---

## 6) Industry Verbiage Layer

Define an `industry_profile` object keyed by `step1.industry`.

## 6.1 Industry Profile Schema

```json
{
  "industry_id": "health_wellness",
  "preferred_terms": ["client outcomes", "well-being", "support plan"],
  "avoid_terms": ["hack", "instant cure", "guaranteed results"],
  "tone_modifiers": ["reassuring", "credible", "clear"],
  "cta_patterns": ["Book a consultation", "Start your plan"],
  "compliance_flags": ["no medical claims"]
}
```

### 6.2 Industry Adaptation Rules

- Inject preferred terms in messaging sections where natural.
- Block avoid terms and compliance-unsafe claims.
- Adjust CTA suggestions per industry pattern.
- If no profile exists (`other`), use neutral baseline lexicon.

### 6.3 Photography / visual capture guidance — scope boundary

Kit outputs (Style Guide "Practical usage notes" and any narrator-conditioned visual guidance) should give **style direction** — mood, backdrop feel, lighting adjective, palette application — but **must not include photography how-to instructions or technique**. Customers receive a free Camentra trial via a post-purchase email; hands-on photography guidance is handled there. Keep all visual application bullets at the level of aesthetic direction, not camera operation.

### 6.4 Initial Industry Pack Priority

Start with highest-impact categories:

- creative_services
- consulting_coaching
- health_wellness
- legal_professional_services
- technology
- retail

---

## 6A) Narrator Profile Layer

Define a `narratorProfile` object keyed by `step1.brandNarrator`. Works in parallel with `industryProfile` — industry seasons the vocabulary, narrator shapes the structure and channel emphasis.

### 6A.1 Narrator Profile Schema

```json
{
  "narrator_id": "solo_maker",
  "content_pillars": [
    "Process and making",
    "Materials and ingredients",
    "Finished reveals",
    "Behind the scenes",
    "Customer stories"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop the collection",
    "See how it's made",
    "Limited batch — get yours",
    "Made to order — shop now"
  ],
  "primary_channels": ["Instagram", "Pinterest", "Etsy shop"],
  "brand_brief_emphasis": "story_then_values",
  "tone_of_voice_themes": ["craft", "process", "maker pride"],
  "email_tone_pattern": "warm and personal"
}
```

### 6A.2 Full Narrator Profile Dictionary

**`solo_expert`** — the owner is the credential

```json
{
  "narrator_id": "solo_expert",
  "content_pillars": [
    "Client results and transformations",
    "My expertise and background",
    "Tips and education",
    "Behind the process",
    "FAQs and common questions"
  ],
  "cta_type": "book_or_consult",
  "cta_patterns": [
    "Book a free consultation",
    "Let's talk",
    "Schedule a session",
    "See my work"
  ],
  "primary_channels": ["LinkedIn", "personal website", "email"],
  "brand_brief_emphasis": "story_then_transformation",
  "tone_of_voice_themes": ["credibility", "care", "personal expertise"],
  "email_tone_pattern": "professional and personal"
}
```

**`solo_maker`** — the craft and maker are the brand

```json
{
  "narrator_id": "solo_maker",
  "content_pillars": [
    "Process and making",
    "Materials and ingredients",
    "Finished reveals",
    "Behind the scenes",
    "Customer stories"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop the collection",
    "See how it's made",
    "Limited batch — get yours",
    "Made to order — shop now"
  ],
  "primary_channels": ["Instagram", "Pinterest", "Etsy shop"],
  "brand_brief_emphasis": "story_then_values",
  "tone_of_voice_themes": ["craft", "process", "maker pride"],
  "email_tone_pattern": "warm and personal"
}
```

**`local_team`** — shop or crew; community trust leads

```json
{
  "narrator_id": "local_team",
  "content_pillars": [
    "Team and faces",
    "Community connection",
    "Day-in-the-life",
    "Customer shout-outs",
    "Local events and updates"
  ],
  "cta_type": "visit_or_call",
  "cta_patterns": [
    "Visit us at [location]",
    "Call us today",
    "Book online",
    "Stop by and say hi"
  ],
  "primary_channels": ["Google Business", "Instagram", "Facebook"],
  "brand_brief_emphasis": "transformation_then_customer",
  "tone_of_voice_themes": ["community", "reliability", "neighborhood warmth"],
  "email_tone_pattern": "friendly and local"
}
```

**`product_led`** — brand and product speak before the person

```json
{
  "narrator_id": "product_led",
  "content_pillars": [
    "Ingredients, materials, or features",
    "Before and after",
    "How and why it works",
    "Ritual or everyday use",
    "Customer proof and reviews"
  ],
  "cta_type": "browse_or_buy",
  "cta_patterns": [
    "Shop now",
    "Try it today",
    "See the difference",
    "Find your fit"
  ],
  "primary_channels": ["Instagram", "brand website", "product packaging"],
  "brand_brief_emphasis": "transformation_then_differentiation",
  "tone_of_voice_themes": ["brand sensibility", "product proof", "clarity"],
  "email_tone_pattern": "brand-forward and clean"
}
```

**`mission_community`** — cause or collective comes first

```json
{
  "narrator_id": "mission_community",
  "content_pillars": [
    "Impact stories",
    "How we help",
    "Community voices",
    "Calls to action and events",
    "Behind the work"
  ],
  "cta_type": "support_or_join",
  "cta_patterns": [
    "Get involved",
    "Support the mission",
    "Join us",
    "See the impact"
  ],
  "primary_channels": ["Facebook", "email newsletter", "local press"],
  "brand_brief_emphasis": "values_then_transformation",
  "tone_of_voice_themes": ["mission", "community", "shared purpose"],
  "email_tone_pattern": "warm and cause-driven"
}
```

### 6A.3 Narrator Adaptation Rules

- Use `content_pillars` as the source set for CSP content pillar prompts; flavor with `industry` vocabulary and `transformation` language.
- Use `cta_type` to determine the *action category* for CTA suggestions; use `tonePreset` and sliders to determine *phrasing*.
- Use `primary_channels` to anchor Week 1 Quick Start actions to the highest-priority touchpoint.
- Use `brand_brief_emphasis` to weight section order/focus in Brand Brief generation.
- Use `email_tone_pattern` as a modifier when generating email voice application templates (Pro Voice Playbook).
- When `brandNarrator` is empty/unknown, default to `solo_expert` behavior as the safest neutral fallback.

### 6A.4 Combined Narrator × Industry Signal

Neither signal alone is sufficient. Apply them in order:

1. `narratorProfile` sets structure (what sections emphasize, what CTA type, what channels, what pillar categories)
2. `industryProfile` sets vocabulary (preferred terms, avoid terms, compliance flags)
3. `transformation` and `offer` (S1) provide the specific business language that makes it feel personal

---

## 7) Tone Translation Rules

Tone signals come from:

- `tonePreset`
- 5 snapped sliders
- optional `customVoiceNotes`

Map slider bands to style directives:

- Formality high -> concise, direct, low colloquialism
- Warmth high -> empathetic framing and relational cues
- Directness high -> shorter sentences, action-forward phrasing
- Playfulness high -> lighter wording (without gimmick tone)

When conflicting directives occur, order precedence:

1. Explicit `customVoiceNotes`
2. `tonePreset`
3. slider-derived modifiers

---

## 8) Section Length + Format Constraints

| Section type | Min words | Max words | Output form |
|---|---:|---:|---|
| One-liner | 8 | 16 | single sentence |
| Short summary paragraph | 20 | 45 | paragraph |
| Strategy block | 30 | 70 | paragraph |
| Bullet item | 4 | 18 | bullet |
| CTA suggestion | 2 | 8 | short phrase |
| Caption hook | 5 | 18 | one-liner |

Hard rule: if generation exceeds max words, trim by priority (retain core meaning over style flourishes).

---

## 9) QA Gates (Pre-PDF)

Run per section:

1. **Completeness**
   - section has non-empty output
2. **Length**
   - within section bounds
3. **Style compliance**
   - tone constraints followed
4. **Industry compliance**
   - no banned terms for selected industry
5. **Claim safety**
   - no fabricated guarantees/metrics
6. **Readability**
   - clear sentence structure; avoid jargon clusters
7. **Duplication**
   - avoid repeating same sentence across documents
8. **Mode compliance**
   - deterministic sections include required scaffold anchors
   - ai_enhanced sections preserve anchors
   - ai_only sections pass stricter confidence checks

If any gate fails:

- Core: deterministic fallback rewrite
- Pro:
  - ai_enhanced: one repair pass, else deterministic scaffold fallback
  - ai_only: one repair pass, else safe minimal fallback variant

---

## 10) Editable Output Assembly

The editable layer should store each document as sectioned content, not a single blob.

Suggested shape:

```json
{
  "brandBrief": {
    "brandOverview": "...",
    "idealCustomer": "...",
    "corePromise": "...",
    "valuesPositioning": "...",
    "storyAngle": "...",
    "differentiation": "..."
  }
}
```

Why:

- better edit experience
- easier regeneration per section in future Pro flow
- cleaner PDF rendering and QA targeting

---

## 11) Implementation Checklist

**Order:** Implement **Core deterministic PDFs + tests** first, then **Anthropic (Claude) for Pro sections**, then payment and email (`PHASE_ROADMAP.md` — Recommended implementation order).

- [ ] Define section templates for Core (`core_templates/*.ts`)
- [ ] Define section mode matrix in code (`sectionModes.ts`)
- [ ] Define deterministic scaffold builders for `ai_enhanced` sections
- [ ] Define Pro prompt builders by section (`pro_prompts/*.ts`)
- [ ] Add industry profile dictionary (`industry_profiles.ts`)
- [ ] Add narrator profile dictionary (`narrator_profiles.ts`) — five entries matching §6A.2
- [ ] Wire `narratorProfile` into messaging themes generation (content pillar category set)
- [ ] Wire `narratorProfile` into CSP content pillar prompts (draw from `content_pillars` field)
- [ ] Wire `narratorProfile` into CSP CTA suggestions (`cta_type` drives action category, `tonePreset` drives wording)
- [ ] Wire `narratorProfile.primary_channels` into Quick Start Week 1 actions
- [ ] Wire `narratorProfile.brand_brief_emphasis` into Brand Brief section weight/ordering
- [ ] Wire `narratorProfile.email_tone_pattern` into Voice Playbook email template generation (Pro)
- [ ] Add output QA validator (`validateOutput.ts`)
- [ ] Add repair/fallback path per section
- [ ] Persist sectioned editable outputs
- [ ] Wire section renderer to PDF service (one export job per deliverable PDF; see `DELIVERABLE_PRODUCTION_SPEC.md` — **Delivery bundle format**)

---

## 12) Open Questions

- Should Pro one-liner return 1 or 3 options?
- Should Content Starter Pack be 2 pages fixed or 2-3 pages flexible?
- Should any Core sections receive “lite AI rewrite” in Phase 2?
- Which industries require stricter compliance term filters at launch?
