# Intake UX Refactor Notes

Purpose: document the intake UX direction (mobile-first, chapter/micro-steps, output-adjacent previews) and keep a **clear split** between what is **implemented in code now** versus the **original research baseline** used to justify the refactor.

## How to read this document

| Section | Meaning |
|--------|---------|
| **Implementation (live now)** | What the web app actually does after the micro-step migration. |
| **Baseline UX inventory** | Snapshot of the **old** 7-step-per-screen shell and field groupings, kept for comparison and copy review. It is **not** a description of the current progress UI or navigation granularity. |

---

## Implementation (live now)

**Runtime:** `MICRO_STEP_SCHEMA` in `apps/web/src/data/microStepSchema.ts` drives intake navigation. `useFlowState` advances **chapter + micro-step** (tier-aware). Progress in `StepShell` / `ProgressBar` shows labels like `Business Basics 2 of 9` plus optional `Chapter N of 7` context, not a single `Step X of 7` bar for the whole intake.

**Validation:** `apps/web/src/validation/microStepValidation.ts` — micro-step scoped rules aligned with `validationRuleRef` on schema fields.

**Rendering:** `App.tsx` maps each active micro-step id to existing step components with **section visibility props** (e.g. only business name on `c1_s1`), rather than one full step per screen. Chapter 1 now uses a **controlled sentence-composer** for Step 1: users fill one slot at a time from curated options while a sentence shell stays visible. Offer is built from `offer` -> `audience` -> optional `delivery`, and transformation is built from `before` -> `after` -> `mechanism`, with short `Something else` fallbacks only when the option library does not fit. Chapter 3 keeps tone preset + sliders together on one main screen so the live rail remains useful without over-splitting the interaction. Visual Direction now uses a compact at-a-glance style tile grid instead of swipe browsing.

**Review:** Chapter “Edit” jumps to the **first micro-step** of that chapter; completing the chapter returns to review. Review includes a **Your kit includes…** summary card.

**Polish shipped in this pass:** reassurance copy on high-stakes screens, Visual Direction preview cards, compact mobile style tiles, the controlled Step 1 slot-builder refactor for offer/transformation, Step 1 input `autoComplete` / `enterKeyHint` on key fields, and mobile-safe control sizing to avoid awkward focus zoom without disabling browser zoom.

**Live copy rules:** keep one primary instruction per screen, ask questions in literal customer-facing language instead of strategy shorthand, let component copy explain mechanics only when needed, use reassurance only on high-stakes subjective choices, and make optional fields explain the unlock instead of restating the question. When the shell prompt already states the full question, use short functional slot labels (for example Industry, Stage, Offer, Audience, Before, After, Mechanism) and avoid visible duplicate subheaders above the controls. Output-adjacent moments should show progress, not add another layer of explanation.

**Still open:** more “choices taking shape” moments per chapter, sticky actions / keyboard tuning after device testing, and richer review / confirm presentation around generated file links.

**Testing the web app:** from repo root run `npm run dev:web` for the UI only, or run both `npm run dev:web` and `npm run dev:api` to exercise live Core PDF generation. Open the printed local URL and walk landing → intake → review. Use browser devtools responsive mode for mobile width.

**PDFs:** The web intake **does** generate real **Core** kit PDFs in development when `apps/api` is running. The browser flow submits `IdentityKitForm` to the dev API, which calls the deterministic renderer in `packages/generation` and returns downloadable files on confirm. This pass does **not** wire Pro generation, payment, or any AI cleanup for Core.

**Style choices in PDFs (scoped):** We are **not** restyling entire documents per palette or style preset—that would be too heavy to maintain. The plan is a **dedicated section in the Brand Style Guide** (the natural home for visual direction) that renders a **reusable visual block**: a compact representation of the customer’s **chosen palette + style direction**, driven by the same **preset IDs and shared configuration** as the web app (`PALETTE_OPTIONS` / style presets in `apps/web/src/data/visualDirection.ts`, with generation importing equivalent data or a shared package). That block is a **component** you drop into the Style Guide layout: as you add colors or style presets, you extend the config and the component’s variants—not every page of every PDF. Other deliverables and the rest of the Style Guide keep the current structure and typography; this section is additive.

---

## Baseline UX inventory (pre–micro-step research snapshot)

The sections below describe the **original** experience: one **step index** (1–7) per screen, a single `Step X of 7` progress bar, and all fields for that step visible together. That layout was the starting point for the refactor analysis. **It no longer matches the live progress UI or per-screen field split**, but it remains useful for copy, validation parity, and stakeholder comparison.

### Baseline screen list (conceptual)

The web app runs as a single wizard in `apps/web/src/App.tsx` with these **screens** (unchanged at a high level):

1. Landing
2. Step 1: Business Snapshot *(was one screen; now split into micro-steps in chapter 1)*
3. Step 2: Your Buyer
4. Step 3: Brand Personality
5. Step 4: Core Values
6. Step 5: Brand Story
7. Step 6: Visual Direction
8. Step 7: Stand Out
9. Review
10. Payment
11. Processing
12. Edit
13. Confirm

**Original intake shell (per step, before micro-steps):**

- single centered card
- `Step X of 7` progress bar *(replaced by chapter + micro-step progress)*
- title + prompt
- Brand Alchemy strip or step-specific rail
- fields/content
- bottom Back / Continue actions

**Primary files (updated since baseline; schema is canonical for flow):**

- `apps/web/src/App.tsx` — micro-step routing and prompts
- `apps/web/src/hooks/useFlowState.ts` — chapter / micro-step state
- `apps/web/src/components/flow/StepShell.tsx` — schema-driven progress props
- `apps/web/src/data/microStepSchema.ts` — canonical micro-step definitions
- `apps/web/src/data/steps.ts` — legacy titles only; prompts are largely overridden in-app per micro-step

## Baseline step-by-step inventory (field groupings)

### Landing

Component: `apps/web/src/components/flow/TierSelector.tsx`

Baseline content:

- Core / Pro tier toggle
- price label
- bullet list of included deliverables
- fixed bottom CTA: `Start My Identity Kit`

Baseline UX notes:

- Strong value explanation, but visually text-heavy
- Reads more like a pricing card than the beginning of a guided exercise
- Fixed CTA is good for mobile momentum

### Step 1: Business Snapshot

Component: `apps/web/src/components/steps/Step1Snapshot.tsx`

Prompt: "Tell us the basics about your business."

Baseline questions:

1. Business name
2. What industry are you in?
3. Business stage
4. When customers find you, what leads?
5. What do you offer?
6. What change do you help customers achieve?

Validation:

- all 6 items required

Baseline UX notes:

- This is the densest "plain form" step
- Good logical content, but the screen is a long vertical stack
- The narrator choice introduces some variety, but the overall feel is still static

### Step 2: Your Buyer

Component: `apps/web/src/components/steps/Step2Customer.tsx`

Prompt: "Who usually buys from your business?"

Baseline questions:

1. Pick the buyer who shows up most often
2. Pro only: Biggest customer pain points
3. Pro only: Desired customer outcomes

Validation:

- buyer archetype required
- Pro requires at least one of pain points or desired outcomes

Baseline UX notes:

- Better than step 1 because selection cards create rhythm
- Pro version becomes text-heavier again once the textareas appear
- The helper text is useful, but the step still feels form-like rather than guided

### Step 3: Brand Personality

Component: `apps/web/src/components/steps/Step3Personality.tsx`

Prompt: "Set the tone and voice your brand communicates in."

Baseline questions:

1. Start with a tone preset, then refine with sliders
2. Formality slider
3. Energy slider
4. Directness slider
5. Warmth slider
6. Playfulness slider
7. Pro only: describe your ideal voice

Validation:

- tone preset required

Baseline UX notes:

- Most interactive step because it has the live rail and sliders
- Also one of the highest-cognitive-load steps because 5 sliders appear at once
- Feels closer to "settings" than "guided personality shaping"

### Step 4: Core Values

Component: `apps/web/src/components/steps/Step4Values.tsx`

Prompt: "Pick the values you want your brand to lead with."

Baseline questions:

1. Select 2-4 core values
2. Pro only: mission statement

Validation:

- at least 2 values required

Baseline UX notes:

- Clean and simple
- Works fairly well on mobile already
- Still visually repetitive because the cards are compact and mostly text-based

### Step 5: Brand Story

Component: `apps/web/src/components/steps/Step5Story.tsx`

Prompt: "Choose the origin story that fits you best."

Baseline questions:

1. Select an origin story archetype from a swipe deck
2. Pro only: tell the story you want on your About page
3. Pro only: what drives this brand?

Validation:

- origin archetype required

Baseline UX notes:

- One of the stronger steps because the deck format creates pacing
- Good place for richer storytelling or visual support
- Pro textareas create a drop back into plain intake mode after the more dynamic choice UI

### Step 6: Visual Direction

Component: `apps/web/src/components/steps/Step6Aesthetic.tsx`

Prompt: "Choose your palette and visual style direction."

Baseline questions:

1. Pro only: upload a reference image
2. Choose a starting color palette
3. Fonts you already use (optional)
4. Choose your visual style direction
5. Pro only: color and mood notes
6. Pro only: style notes

Validation:

- palette required
- style direction required

Baseline UX notes:

- High-value step but still flatter than it should be
- Palette picker currently reads like a stacked option list, not a visual gallery
- Strongest candidate for **output-adjacent** mini moodboards (how each palette/style reads in kit-like fragments), not generic decorative photos

### Step 7: Stand Out

Component: `apps/web/src/components/steps/Step7Industry.tsx`

Prompt: "Name the brands your customers might compare you to."

Baseline questions:

1. Add competitor names (optional)
2. Pro only: What makes you different?

Validation:

- Pro differentiation required
- competitors optional

Baseline UX notes:

- Functional but visually plain
- The chip pattern for competitors is useful
- Could feel anticlimactic as a final intake step

## Baseline structural strengths

- Existing 7-step breakdown is already much better than a single long page
- Progress indicator is always visible
- Flow resets scroll on step change for mobile
- Single-column layout is appropriate for small screens
- Stronger interaction patterns already exist in the product:
  - card selection
  - swipe deck
  - live voice rail
  - fixed CTA on landing

## Baseline structural weaknesses

- Each step uses nearly the same shell and visual rhythm, so the journey feels repetitive
- Some steps contain too many questions for one mobile screen, especially steps 1, 3, and 6
- Several high-value emotional decisions are presented as plain controls instead of guided choices
- Visual variety is concentrated in only a few moments rather than used intentionally throughout the journey
- Continue action sits at the bottom of long cards, which can slow mobile progression
- There is no explicit time estimate or chapter framing up front

## Recommended Refactor Direction

Core principle: keep the 7 high-level topics, but treat them as chapters rather than literal one-screen steps.

Instead of:

- 7 large step cards

Shift toward:

- 7 chapters
- 14-20 smaller mobile-first screens
- mostly 1 primary question per screen
- occasional 2-question screens when the pair is tightly related

This keeps the current information model but changes the pacing.

**Tangible output, not “just a form.”** The intake produces a real deliverable: brand kit PDFs. The UX should reflect that throughout the journey, not only on landing. As users move forward, they should feel like they are **building** something, not merely filling out fields. The **live voice rail in Step 3** (`LiveRailStrip` in `App.tsx`) is the existing proof of concept: choices immediately influence something visible. **Design directive:** extend that idea across chapters — **every chapter should include at least one moment where the user can see their choices taking shape** (preview text, sample snippet, mini layout, swatch applied to a mock card, etc.). The exact pattern can vary by chapter; the bar is “output-adjacent feedback,” not decoration alone.

## Proposed Mobile-First Screen Map

### Chapter 0: Landing

Keep:

- tier choice
- fixed CTA

Refactor:

1. Add a stronger promise of outcome
2. Reduce bullet density on first view
3. Consider one hero image, collage, or "kit preview" visual
4. Add lightweight expectation-setting such as "about 3 minutes"

### Chapter 1: Business Basics

Chapter 1 now looks like this (implemented direction):

1. Business name
2. Industry + stage
3. What leads when customers find you?
4. Offer builder: What you provide / Who it's for / optional How it's delivered
5. Transformation builder: Before / After / Through

Why:

- better mobile pacing
- easier to answer
- clearer sense of forward motion

### Chapter 2: Buyer

Step 2 could become (target direction):

1. Choose your primary buyer archetype
2. Pro only: pain points
3. Pro only: desired outcomes

Why:

- lets the archetype choice stand on its own
- avoids putting a selection task and two writing tasks on one screen

### Chapter 3: Voice

Step 3 could become (target direction):

1. Choose a tone preset and refine it with all voice sliders on one screen
2. Pro only: custom voice notes

Why:

- lowers cognitive load
- keeps the live rail meaningful
- makes the step feel more like a guided voice exercise without adding extra navigation

### Chapter 4: Values

Step 4 could become (target direction):

1. Select core values
2. Pro only: mission statement

Why:

- current structure is already close to good
- only light changes needed

### Chapter 5: Story

Step 5 could become (target direction):

1. Choose the origin story direction
2. Pro only: origin summary
3. Pro only: motivation

Why:

- preserves the swipe deck as a strong moment
- gives writing fields more breathing room

### Chapter 6: Visual Direction

Step 6 could become (target direction):

1. Choose a palette
2. Choose a style direction from an at-a-glance grid
3. Optional existing typefaces
4. Pro only: reference image
5. Pro only: color/mood notes
6. Pro only: style notes

Why:

- this is the chapter that benefits most from visual pacing
- palette and style deserve dedicated screens
- natural home for **output-adjacent** previews (brand-application mocks and mini moodboards), not generic decoration

### Chapter 7: Positioning

Step 7 could become (target direction):

1. Add competitors
2. Pro only: what makes you different?

Why:

- creates a cleaner finish
- lets differentiation feel like a final positioning statement, not an afterthought

## Visual Design Recommendations

### 1. Increase rhythm between screens

Not every screen should look identical. Keep one design system, but vary:

- density
- component type
- image presence
- header treatment

Examples:

- question screen
- gallery-choice screen
- story card screen
- interstitial chapter screen

### 2. Step 6 imagery: output-adjacent examples, not decorative mood photos

Generic stock or “vibe” photography is a poor fit here. **Imagery in Step 6 should show what a brand built on each palette or style direction actually looks like in practice** — e.g. simplified logo lockup, social tile, business card strip, or headline + body sample **using that palette and style**, so the user is choosing **kit-relevant outcomes**, not browsing unrelated mood boards.

Avoid imagery that only signals emotion without tying to the PDF deliverables.

### 3. Make the visual chapter stronger

Step 6 is currently the best place to break monotony and to reinforce the “building your kit” principle.

**Palette and style cards should function as mini moodboards with real brand-application examples** — not only color swatches and labels. Each option should hint at how that choice will read in the generated kit (typography pairing, contrast, density, or a tiny mocked “page fragment”).

Additional upgrades:

- selected-state previews that echo kit output
- optional “this feels like…” framing tied to deliverable tone, not abstract adjectives alone

### 4. Progress: expose sub-step progress directly (recommendation)

The baseline `Step X of 7` bar is clear at a high level, but **not motivating enough** when a single step number hides many micro-screens (hence chapter + micro-step progress in the live app).

**Recommendation:** show **chapter + sub-step progress in the UI** (e.g. `Voice 2 of 4`, `Visual Direction 1 of 3`). That framing:

- sets expectations before long chapters
- reduces surprise at chapter transitions
- matches the proposed chapter / micro-screen model

`Step 3 of 7` can remain as a secondary breadcrumb if useful, but **sub-step progress should be first-class**, not an afterthought.

## Interaction Recommendations

### 1. Prefer one primary question per screen

This is the clearest mobile-first improvement.

Benefits:

- lower cognitive load
- easier validation
- easier branching later
- more momentum on phones

**Mobile keyboard behavior** is a separate risk area. Steps with **multiple text inputs** (especially Step 1) need explicit attention to:

- **`input type` and `inputMode`** so the OS shows the right keyboard (email, tel where relevant, etc.)
- **Placeholder and helper copy** that reduces blank-page anxiety without replacing labels (NN/g-style: labels above fields, placeholders as hints)
- **Layout and scroll behavior** when the keyboard covers the bottom half of the screen — primary actions, error messages, and the active field should remain reachable; consider sticky footers, scroll-into-view on focus, or splitting fields across screens so one text input dominates the viewport when the keyboard is open

### 2. Use sticky next actions on longer screens

Landing already benefits from a fixed CTA.

Consider extending this pattern to longer intake screens where the main action is otherwise below the fold.

### 3. Use conditional disclosure more aggressively

Examples:

- show advanced voice refinement only after preset selection
- expand helper content only when relevant
- keep optional Pro fields separate or collapsed until reached

### 4. Reduce "flat list" patterns

Best candidates:

- palette picker
- tier bullet list
- dense textarea stacks in Pro flows

## Reassurance and Trust Copy

The target user is often a **small business owner** who may worry about answering “wrong.” **Micro-copy is as important as screen pacing** for completion and quality of answers.

Guidelines:

- **Each chapter** should include **at least one reassurance line** where stakes feel high — especially **values, story, and visual direction**. Examples of intent (adapt tone to brand voice):
  - “You can refine this after you see your kit.”
  - “This guides the output — it’s not a final decision.”
- **Validation errors** should feel **helpful, not punitive** — specific, next-step oriented, and where possible framed as “we need this to generate X” rather than “invalid.”
- **Optional fields** must be **explicitly labeled optional**, with a **short note on what they unlock** (e.g. richer copy in the Content Pack, stronger differentiation in the Brief) so users understand the tradeoff without guilt.

## Recommended First Refactor Targets

If we want the highest UX lift without redesigning everything at once:

1. `TierSelector`
2. `Step1Snapshot`
3. `Step3Personality`
4. `Step6Aesthetic`

Why these first:

- they define the first impression
- they contain the heaviest cognitive load
- they offer the biggest opportunity for mobile-first pacing, **output-adjacent previews**, and the “choices taking shape” directive (especially Step 3 rail + Step 6 moodboards)

## Delivery Experience

The flow in this document continues through **Review → Payment → Processing → Edit → Confirm**. **Post-payment fulfillment and file delivery** are **out of scope** for the intake refactor itself but are a **product dependency**: whatever we promise during intake should align with what happens next.

**Review (before payment)** should function as a summary of **what the user built**, not only a dry data confirmation. Consider a **“Your kit includes…”** summary card that **mirrors the tier deliverables list from landing**, but **personalized** with concrete inputs (e.g. business name, tone preset chosen, palette selected, style direction) so the user sees the connection between answers and PDF outputs before they pay.

## Outside review findings

1. Should we keep the current 7-step mental model in the UI, or expose smaller chapter/sub-step progress directly? **Recommendation:** **expose sub-step progress directly** (e.g. `Voice 2 of 4`). It is more motivating than `Step 3 of 7` alone and prepares users for chapter transitions instead of surprising them. Aligns with **Visual Design Recommendations → §4**.
2. How far should we go toward one-question-per-screen versus grouped micro-screens?
3. Which steps most need imagery versus purely better pacing?
4. Should the mobile experience and desktop experience use the same screen structure, or should desktop merge some screens? **Recommendation:** **desktop should merge related micro-screens** where it improves efficiency. One-question-per-screen on large viewports **wastes space** and can feel **patronizing**. Treat the **chapter model as universal**; **screen-splitting is a mobile-specific optimization** — desktop layouts should **recombine** related micro-screens (e.g. industry + stage, or paired sliders) when density stays comfortable.
5. Is the best first milestone a shell-level refactor, or a focused redesign of steps 1, 3, and 6?

## Suggested Next Artifact

After review, the next useful deliverable would be a screen map with:

- current screen count
- proposed screen count
- required vs optional fields
- where output-adjacent / preview screens enter the flow (especially Step 6)
- which screens are shared across Core and Pro
