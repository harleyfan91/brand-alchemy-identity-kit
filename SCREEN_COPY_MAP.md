# Identity Kit Screen-by-Screen Copy Map

This document serves two roles: **(A)** the **current product UI** as implemented in `apps/web` (keep this section updated when copy or behavior changes), and **(B)** a **planning inventory** for future copy slots and states.

---

## A) Current implementation (sync with `apps/web`)

### Global chrome (landing + steps)

- **Brand wordmark:** “Brand Alchemy” — **compact** uppercase treatment in the **slim strip above** the white card (`text-zinc-600`, smaller type on mobile). Not inside the card on landing or steps.
- **Card:** `max-w-xl`, rounded white panel on `zinc-50` page background; landing and steps share the same outer column layout.
- **Tier labels (data):** “Core Kit” / “Pro Kit” (`apps/web/src/data/tiers.ts`).
- **Progress (steps only):** Row label **“Progress”** with **“Step {n} of 7”** and a filled track (`ProgressBar.tsx`). **First block inside the card** on step screens; landing has **no** progress row — first block is the hero headline.
- **Primary actions:** Black / zinc primary buttons; step footer: **“Back”** / **“Continue”** (Continue disabled when step invalid).
- **Navigation behavior:** On **screen** or **step index** change, the window **scrolls to top** (mobile wizard pattern).

### Landing + tier selection

- **Headline:** “Build your brand kit in minutes”
- **Subhead:** “Guided, simple, and done-for-you options for building a polished brand kit fast.”
- **Tier content:** Matches `tierOptions` in `tiers.ts` (Pro listed first in UI, Core second).
- **CTA:** “Start My Identity Kit” (fixed near bottom; width grows slightly with scroll progress).
- **Symbol strip:** `AlchemySymbolStrip` below hero, above tier cards.

### Tier promise matrix (product direction)

| Dimension | Core Kit | Pro Kit |
|---|---|---|
| Price | $49 | $99 |
| Positioning | Guided starter brand kit built from proven templates | AI-personalized strategy and voice tailored to the business |
| Draft generation | Template-based assembly from intake selections | AI draft generation with stronger personalization intent |
| Input depth | Required step fields + selectors | Same base fields + optional deeper context fields |
| Voice differentiation | Slider/preset-led tone profile | Slider/preset profile plus optional custom voice notes |
| Visual differentiation | Guided palette/style selection | Same selections plus optional notes for deeper direction |
| Edit behavior (today) | Editable outputs before send | Editable outputs before send |
| Edit behavior (planned) | No regenerate controls | Regenerate controls planned in Phase 2 |
| Deliverables | 4 documents (Brand Brief, Style Guide, Voice Playbook, Quick Start) | Same 4 foundational documents plus a **Content Starter Pack** |

### Deliverables matrix (target offer)

| Deliverable | Core Kit | Pro Kit |
|---|---|---|
| Brand Brief | Foundational positioning, audience summary, values, story direction | Same document with deeper AI-personalized strategy and differentiation |
| Brand Style Guide | Palette + style direction from guided selections | Same document with stronger personalization from richer context |
| Voice & Content Playbook | Tone guidance and messaging direction | Same document with deeper voice nuance and audience-specific language |
| 30-Day Quick Start Checklist | Guided action plan for applying the brand | Same document with more tailored priorities and messaging actions |
| Content Starter Pack | Not included | Included: homepage messaging directions, short bio/about intro, social bio options, caption hooks, content pillars, starter prompts, CTA suggestions |

### Deliverable asset specs (target)

| Asset | Format | Target pages | Content shape |
|---|---|---|---|
| Brand Brief | Branded PDF | 1 | Editorial strategy summary |
| Brand Style Guide | Branded PDF | 2 | Visual-first guide with short explanatory text |
| Voice & Content Playbook | Branded PDF | 2-3 | Text-forward playbook with examples and guardrails |
| 30-Day Quick Start Checklist | Branded PDF | 1 | Action checklist / rollout plan |
| Content Starter Pack (Pro) | Branded PDF | 2 | Practical copy starter asset |

### Deliverable table of contents (target)

- **Brand Brief**
  - Brand overview
  - Ideal customer
  - Core transformation / promise
  - Values and positioning cues
  - Brand story angle
  - Differentiation snapshot
- **Brand Style Guide**
  - Palette overview
  - Visual direction summary
  - Style principles
  - Do / avoid guidance
  - Practical usage notes
- **Voice & Content Playbook**
  - Tone profile
  - Voice guardrails
  - Messaging themes
  - Sample phrases / language cues
  - Writing do / avoid guidance
- **30-Day Quick Start Checklist**
  - Week 1 foundational actions
  - Week 2 messaging updates
  - Week 3 visual rollout
  - Week 4 consistency checks
- **Content Starter Pack (Pro)**
  - One-liner / brand summary
  - Homepage messaging directions
  - Brand bio / about intro
  - Social bio options
  - Caption starters
  - Content pillar prompts
  - CTA suggestions

### AI personalization value (target)

- Uses combined intake context across **audience + offer + tone + values + story + visual direction + differentiation**.
- Produces outputs that are harder to templatize well, especially messaging systems and ready-to-use content starters.
- Creates practical copy starters, not just strategy language, which is why the **Content Starter Pack** belongs in Pro.
- Depends on richer context quality, which is why some Pro fields should become more strongly guided or required in the next survey pass.

### Intake steps (titles & prompts)

Source: `apps/web/src/data/steps.ts`

| Step | Title | Prompt |
|------|--------|--------|
| 1 | Business Snapshot | Tell us the basics about your business. |
| 2 | Your Buyer | Who usually buys from your business? |
| 3 | Brand Personality | Set the tone and voice your brand communicates in. |
| 4 | Core Values | Pick the values you want your brand to lead with. |
| 5 | Brand Story | Choose the origin story that fits you best. |
| 6 | Visual Direction | Choose your palette and visual style direction. |
| 7 | Stand Out | Name the brands your customers might compare you to. |

### Survey signal -> output map

| Step | Primary signal captured today | Output sections informed | Current gap risk |
|---|---|---|---|
| 1. Business Snapshot | Business basics + required customer transformation outcome | Brand Brief foundation; Quick Start context | Transformation clarity still depends on user specificity |
| 2. Your Buyer | Buyer archetype (+ Pro pain/outcomes depth fields) | Brand Brief audience and Voice Playbook messaging targets | Pro requires at least one depth field; Core remains lighter |
| 3. Brand Personality | Preset + snapped voice sliders (+ optional Pro notes) | Voice Playbook tone profile and examples | Tone preset is required; slider-only intent may still be coarse |
| 4. Core Values | 2-4 selected values (+ optional Pro mission) | Brand Brief values section and messaging principles | Mission statement can be skipped even for Pro |
| 5. Brand Story | Story archetype (+ optional Pro origin/motivation) | Brand Brief story and founder narrative sections | Story depth optional, mostly archetype shorthand |
| 6. Visual Direction | Palette and style selections (+ optional Pro notes) | Style Guide palette + style direction sections | Notes/reference context optional, can stay shallow |
| 7. Stand Out | Optional competitors (+ required Pro differentiation) | Brand Brief differentiation + Quick Start positioning actions | Core differentiation can still be lightweight |

### Step 3 — Voice UI and live rail

- **Preset legend:** “Start with a tone preset, then refine with sliders”
- **Presets:** Friendly and conversational / Professional and polished / Bold and direct
- **Sliders:** Formality, Energy, Directness, Warmth, Playfulness — endpoints labeled per axis; values snap to **0, 25, 50, 75, 100** (`step={25}`); subtle **center tick** at 50; no mid-track “Balanced/High” text.
- **Pro:** Optional “describe your ideal voice” textarea.
- **Live rail (replaces default symbol strip while on step 3):** After the user touches presets or sliders, `LiveRailStrip` animates in. Static gray prefix **`i.e.`**; sample sentence uses mood gradient flash on change; logic in `voicePreview.ts` + snap helpers in `voiceSliders.ts`.

### Steps 5 & 6 — Carousels

- **SwipeableOptionDeck** for origin stories (step 5) and palette (step 6); separate deck for style direction (step 6). Chevrons, slide counter, dot indicators; tap card to select.
- **Touch:** `touch-manipulation`; horizontal swipe only when horizontal movement **clearly exceeds** vertical (page can scroll vertically from the deck).

### Validation (Continue enabled)

Implemented in `getStepValidationErrors` / `isStepValid` (`useFlowState.ts`):

| Step | Gate |
|------|------|
| 1 | Business name, offer, transformation, industry, stage required |
| 2 | Customer archetype required; Pro requires at least pain points or desired outcomes |
| 3 | Tone preset required |
| 4 | At least **two** values |
| 5 | Origin archetype required |
| 6 | Palette + style required |
| 7 | Pro differentiation required |

Error line copy uses **“This field is required.”** or values-specific message for step 4.

### Content refinement targets (next pass)

- Add one explicit **value proposition** prompt in step 1 (what transformation/result the business creates).
- Make at least one **messaging-quality** field strongly encouraged (or required for Pro), such as customer pains/outcomes.
- Add helper examples for story and differentiation prompts to increase signal quality.
- Consider requiring a non-default tone action in step 3 before continue, or defaulting tone preset visibly.
- Keep Core simple, but avoid Core copy that implies the same depth as Pro personalization.
- Add / clarify prompts that directly improve the future **Content Starter Pack**, especially transformation, audience pains, proof angles, and differentiation.

### Proposed survey copy/validation revisions

| Step | Proposed copy/helper update | Requiredness recommendation |
|---|---|---|
| 1 | Add field: “What change do you help customers achieve?” with a concrete example placeholder. | Required for Core + Pro |
| 2 | Upgrade helper text with examples of pain/outcome phrasing (before -> after language). | Keep optional for Core; strongly encourage or require at least one for Pro |
| 3 | Add microcopy: “Choose a starting tone so your playbook has a clear baseline.” | Require preset selection or first slider interaction |
| 4 | Add mission statement helper example tied to customer impact. | Optional Core; strongly encouraged Pro |
| 5 | Replace vague placeholders with prompts for turning point + why now. | Optional Core; encourage Pro with stronger helper text |
| 6 | Clarify what notes should include (textures, references, words to avoid). | Optional both, but emphasize quality impact for Pro |
| 7 | Add helper examples for competitor and differentiation entries. | Keep competitors optional; require differentiation for Pro in next iteration |

### Review

- **Headline:** “Review your responses before checkout”
- **Primary CTA:** “Continue to Secure Checkout”
- **Voice lines:** Axis labels map snap values: ≤25 → low label, ≥75 → high label, else balanced (`snapVoiceValue` + same endpoints as step 3).

### Payment (placeholder)

- **Eyebrow:** “Secure Checkout”
- **Title:** “Ready to generate your {Core Kit \| Pro Kit}”
- **Body:** Tier-specific promise (Core: guided template drafts, Pro: AI-personalized drafts + Content Starter Pack), then Stripe placeholder note.
- **Actions:** “Review my answers” / “Continue”

### Processing (placeholder)

- **Eyebrow:** “Generating”
- **Title:** “We are building your kit now”
- **Body:** “Great choice. Your {tier} is being prepared now and this usually takes just a few minutes.”
- **CTA:** “Open my draft kit”

### Edit (post-pay placeholder)

- **Title:** “Make final edits to your Identity Kit”
- **CTA:** “Send My Kit”

### Confirm

- **Eyebrow:** “Delivery Confirmed”
- **Title:** “Your Identity Kit is on the way”
- **Body:** “We emailed your 4 branded PDF documents. If you do not see them within a few minutes, check your spam/promotions folder.”
- **Support:** “Need help? Contact support@brandalchemyllc.com”
- **CTA:** “Start New Kit”

---

## B) Planning reference (v1 inventory)

The sections below remain useful for **future copy**, **email**, **errors**, and **analytics** specs. Prefer **section A** for “what the app does today.”

## Global System Copy (brand-level)

- Product framing: “Brand Alchemy Identity Kit” / Brand Alchemy
- Tier labels: "Core Kit", "Pro Kit"
- Primary CTA style: black pill button visual parity
- Progress text format: "Step X of 7" (see **ProgressBar** implementation)
- Session-safe language: avoid promises that imply guaranteed outcomes

## Screen 1: Landing + Tier Selection

### Purpose

Get users into the intake flow with clear tier selection.

### Required Text Slots

- Hero headline
- Hero subheadline
- Core tier card title
- Core tier price + short descriptor
- Pro tier card title
- Pro tier price + short descriptor
- Tier comparison bullets (3-5 each)
- Primary CTA text (start flow)
- Secondary trust text (delivery timing)
- Footer note for policy links (placeholder in v1)

### Suggested v1 Starter Copy

- Headline: "Build your brand kit in minutes"
- Subheadline: "Guided, simple, and done-for-you options for building a polished brand kit fast."
- Pro descriptor: "AI-personalized brand strategy and voice tailored to your business"
- Pro bullets:
  - "AI drafts tuned to your audience, offer, and positioning"
  - "Voice calibrated from slider profile and custom notes"
  - "Visual direction refined with your style and mood input"
  - "4 polished PDF brand documents"
- Core descriptor: "A guided starter brand kit built from proven templates"
- Core bullets:
  - "Template-based drafts shaped by your survey responses"
  - "Guided palette and style selection workflow"
  - "Four editable draft documents before delivery"
  - "Fast setup for a polished brand foundation"
- CTA: "Start My Identity Kit"

## Intake Flow: Steps 1-7

Each step should include:

- Step title
- One-sentence prompt
- Field labels
- Placeholder text
- Helper text
- Validation error text
- Back / Continue button labels

### Step 1: Snapshot

- Goal: collect high-level business snapshot
- Copy needs: business name, offer, expanded industry list, current stage

### Step 2: Customer

- Goal: define buyer profile (the user's customer, not the business owner)
- Copy needs: industry-specific buyer archetypes, pain points (Pro), desired outcomes (Pro)

### Step 3: Personality

- Goal: choose brand voice/personality
- Copy needs: adjective pickers with plain-language emotional descriptions, tone examples

### Step 4: Values

- Goal: identify core values and promises
- Copy needs: values selectors, mission framing, trust commitments

### Step 5: Story

- Goal: gather founder/business backstory
- Copy needs: origin summary, motivation, transformation narrative

### Step 6: Aesthetic

- Goal: visual direction inputs
- Copy needs: color/mood preferences, style references in plain language, optional upload filename
- Error/limit copy needed for file size/type constraints

### Step 7: Stand Out

- Goal: capture competitive context
- Copy needs: competitor references, differentiation statement (Pro)

## Review Screen

_Implemented headline and CTA: **§ A**._

### Purpose

Allow users to verify and edit all inputs before payment.

### Required Text Slots

- Review headline
- Section labels for each step
- "Edit" action labels per section
- Payment expectation text
- Primary CTA to proceed to payment
- Secondary note on fulfillment time by tier

### Suggested v1 Starter Copy

- Headline: "Review your responses before checkout"
- Primary CTA: "Continue to Secure Checkout"

## Payment State

_Placeholder payment screen copy: **§ A** (differs slightly from starter copy below)._

### Purpose

Hand off to Stripe and bring user back with clear status.

### Required Text Slots

- Pre-checkout instruction text
- Stripe redirect/loading text
- Return success text
- Return cancel text
- Return failure text with retry CTA

### Suggested v1 Starter Copy

- Pre-checkout: "You are one step away from generating your Identity Kit."
- Retry CTA: "Try Payment Again"

## Processing / Generation State

_Placeholder processing screen: **§ A**._

### Purpose

Set expectations while outputs are generated.

### Required Text Slots

- "Generating..." headline
- Tier-specific status subtext
- Estimated timing text (Core under 2 min, Pro under 5 min target)
- Failure fallback status copy
- Polling/in-progress reassurance text

### Suggested v1 Starter Copy

- Headline: "We are building your kit now"
- Subtext: "This usually takes a couple of minutes. You can stay on this page."

## Edit Screen (Post-Pay)

_Implemented: **§ A**._

### Purpose

Let users finalize generated outputs before PDF/email delivery.

### Required Text Slots

- Edit headline
- Section tabs/labels for 4 documents
- Field-level helper text
- Save status text
- Regenerate controls (Pro only)
- Primary CTA: send kit

### Suggested v1 Starter Copy

- Headline: "Make final edits to your Identity Kit"
- Primary CTA: "Send My Kit"

## Send + Confirmation Screen

_Implemented confirm screen (incl. support line): **§ A**._

### Purpose

Confirm successful delivery and set next expectation.

### Required Text Slots

- Success headline
- Confirmation body copy
- Delivery timing reminder
- Support contact line
- Optional CTA back to parent site

### Suggested v1 Starter Copy

- Headline: "Your Identity Kit is on the way"
- Body: "We emailed your 4 branded PDF documents to your inbox."

## Email Templates

At minimum create copy specs for:

- Payment confirmation email
- Final kit delivery email (with 4 PDF attachments)
- Delivery failure/retry notification (internal or user-facing fallback)

Required text elements:

- Subject line
- Preview text
- Greeting
- Main body
- Support line
- Legal footer placeholder

## Error States Copy Inventory

Define explicit copy for:

- Required field missing
- Invalid format
- Upload too large / unsupported type
- Network request failed
- Payment canceled
- Payment failed
- Fulfillment failed
- Email delivery failed

## Legal/Policy Surfaces (Research TODO)

Placeholders only in v1 scaffold:

- Privacy policy link label and route target
- Consent language near submit/payment actions
- Refund/cancellation policy link label and route target
- Email consent wording at delivery step

## Analytics Event Labels (Copy Adjacent)

Use event names aligned to PRD requirements:

- tier_selected
- step_completed_step_1 ... step_completed_step_7
- review_reached
- payment_attempted
- payment_succeeded
- payment_failed
- fulfillment_completed
- fulfillment_failed
- send_kit_clicked

