# Intake-to-Signal Model Memo

## Purpose

This memo steps back from the current deliverable structure and asks a more basic product question:

**Are we collecting the right inputs for the kind of brand guide we actually want to deliver?**

The short answer is:

- the current intake is useful for generation logic
- the current output model is too eager to expose that logic directly
- the product should shift from **field-to-section translation** toward **input-to-signal translation**

For this audience, the brand guide should feel **edited**, **selective**, and **calm**.  
It should not feel like a compressed internal spec.

---

## Working thesis

The current system is still too close to this pattern:

`question asked -> field captured -> section justified -> output shown`

That is not how most useful small-business brand guides work.

The more effective pattern is:

`question asked -> confidence / routing / styling signal captured -> only the most useful guidance appears`

This matters because the product is for:

- solo founders
- small business owners
- people with little or no marketing training
- people who want a fast reference, not a full strategic manual

That audience needs:

- fewer visible concepts
- stronger prioritization
- more examples
- less theory

---

## What the research suggests

### 1. Small-business guides are usually selective

The strongest small-business examples and templates repeatedly favor:

- one-page or short multi-page guides
- visual keywords
- color, type, and imagery direction
- a short summary of who the brand is
- a small amount of voice guidance
- quick application cues

They explicitly warn against:

- long strategy sections
- too many rules
- including every possible brand element in v1
- documents that are harder to use than the work they are supposed to simplify

### 2. Enterprise brand systems are a different category

Frontify-style guidance is useful as a reference point for structure, governance, and digital presentation, but it is built for:

- teams
- agencies
- ongoing asset management
- live digital portals
- more experienced users

That is not the same job as the PDF kit we are creating.

### 3. Presentation is part of the product, not just the format

The example PDF the user provided succeeds because it is:

- one container
- visually calm
- sectioned but not over-explained
- selective about what gets page space

Its usefulness comes partly from what it leaves out.

---

## Product shift to make

Move from:

- **documentation mindset**

To:

- **editorial mindset**

In practice, that means the system should decide:

1. what should be shown
2. what should only shape the tone or layout
3. what should be omitted when confidence is weak

The goal is not to prove that the intake was thorough.  
The goal is to produce a guide the customer will actually use.

---

## Three classes of inputs

Every intake field should be assigned one primary role:

### 1. `surface`

The customer should directly see it in the guide because it creates reusable clarity.

Examples:

- one-sentence brand summary
- audience snapshot
- core transformation
- visual keywords
- palette
- type direction
- voice traits

### 2. `signal`

The customer usually should **not** see the field itself.  
Instead, it should shape:

- section order
- example choice
- touchpoint emphasis
- tone density
- page count / detail level
- visual styling
- whether something is omitted

### 3. `drop_or_defer`

The field is either too weak, too internal, too noisy, or too advanced for the base guide.

It may still be useful for:

- future Pro features
- internal routing
- post-purchase editing
- later digital experiences

But it should not drive visible PDF real estate by default.

---

## Recommended field classification

## Step 1: Business snapshot

| Current input | Recommendation | Why |
|---|---|---|
| `businessName` | `surface` | Always needed and low-noise. |
| `offer.offerId` | `surface` | Core to the one-line business summary. |
| `offer.offerOther` | `surface` only when needed | Fallback only; avoid spotlighting niche phrasing unless it improves clarity. |
| `offer.audienceId` | `signal` + partial `surface` | Useful for summary copy, but the raw category should usually be translated into plain-language audience language. |
| `offer.audienceOther` | `signal` + partial `surface` | Same as above. |
| `offer.deliveryId` | `signal` | Helpful for examples and application context; not always worth explicit space. |
| `offer.deliveryOther` | `signal` | Same. |
| `transformation.beforeId` | `signal` + partial `surface` | Use to shape the transformation statement, not as a visible input artifact. |
| `transformation.afterId` | `signal` + partial `surface` | Same. |
| `transformation.mechanismId` | `signal` | Important for internal assembly; often too detailed for direct display. |
| `industry` | `signal` | Better for vocabulary, examples, compliance, and imagery shaping than for a visible labeled block. |
| `stage` | `signal` | Strong candidate for density and confidence control, not display. |
| `brandNarrator` | `signal` | Should influence voice, story emphasis, and page sequencing, not appear explicitly. |
| `businessOperatingModel` | `signal` | Strong application and visual context signal; not a customer-facing concept. |
| `touchpoints` | `signal` + partial `surface` | Use for "apply this first" and CTA examples, but do not expose as a survey artifact. |
| `primaryGoal` | `signal` | Better as CTA and rollout emphasis than as a visible section. |

### Step 1 notes

This step is currently doing too much visible work in the output.  
It should remain central to generation, but more of it should drive:

- which examples appear
- where the guide points the customer first
- how tactical the guide feels
- whether the output leans storefront, service, creator, local, or digital

not whether each sub-choice becomes visible prose.

---

## Step 2: Customer

| Current input | Recommendation | Why |
|---|---|---|
| `customerArchetype` | `surface` | Useful if translated into a plain-language audience snapshot. |
| `painPoints` | `signal` or Pro `surface` | Good for richer copy, but usually too verbose for Core PDF display. |
| `desiredOutcomes` | `signal` or Pro `surface` | Best used to sharpen promise, examples, and templates. |

### Step 2 notes

The customer section should probably output **one clear audience sentence**, not a mini persona.  
Pain points and desired outcomes should mostly sharpen the quality of that line, not create more visible blocks.

---

## Step 3: Voice

| Current input | Recommendation | Why |
|---|---|---|
| `tonePreset` | `surface` + `signal` | Good for naming the voice at a high level. |
| `voiceSliders` | `signal` | Better for shading examples and sentence style than for direct display of many dimensions. |
| `customVoiceNotes` | Pro `signal` + selective `surface` | Valuable for refinement, but should not automatically create more explanation. |

### Step 3 notes

The guide does not need to show five labeled tone axes.  
Those are system inputs, not the best customer-facing presentation layer.

Better visible output:

- 3 voice traits
- 3 writing rules
- 3 sample lines

The slider system should still exist internally, but mostly as a shaping mechanism.

---

## Step 4: Values

| Current input | Recommendation | Why |
|---|---|---|
| `values` | `surface` in compressed form | Good as 3 short values or traits, not a long section. |
| `missionStatement` | Pro `signal` | Usually too long and strategy-heavy for the base guide. |

### Step 4 notes

Values are useful when compressed into:

- 3 short words or phrases
- maybe one sentence of interpretation if confidence is high

They should not automatically become a strategy block.

---

## Step 5: Story

| Current input | Recommendation | Why |
|---|---|---|
| `originArchetype` | `signal` | Better as a trust/story emphasis cue than a visible label. |
| `originSummary` | Pro `signal` + optional `surface` | Surface only when it produces a concise, credible story note. |
| `motivation` | Pro `signal` | Better for tone and applied copy than for a dedicated PDF section. |

### Step 5 notes

Story is one of the easiest places to create filler.  
For this audience, story should only surface when it gives genuine clarity or credibility.

Good default rule:

- if the story is short, concrete, and useful, include one story note
- if not, use story inputs only as hidden style and trust signals

---

## Step 6: Visual direction

| Current input | Recommendation | Why |
|---|---|---|
| `selectedPalette` | `surface` | Core visible output. |
| `selectedStyle` | `surface` + `signal` | Core visible output and also layout / imagery signal. |
| `existingTypeface` | Pro `surface` when strong | Worth surfacing only if it improves continuity. |
| `colorMoodNotes` | Pro `signal` | Better for refinement than direct display. |
| `styleNotes` | Pro `signal` | Same. |
| `referenceUploadName` | `drop_or_defer` | File metadata should not become visible guidance. |

### Step 6 notes

This is the strongest current section because it naturally maps to guide output.

It also suggests an important design principle:

some inputs should control **presentation density**.

For example:

- a visually simple style could yield a more spacious, shorter guide
- a richer or more expressive style could justify slightly more imagery and examples

That is a better use of some visual inputs than forcing more prose.

---

## Step 7: Stand out

| Current input | Recommendation | Why |
|---|---|---|
| `competitors` | `signal` or Pro `surface` | Often more useful for differentiation shaping than for a visible comparison block. |
| `differentiation` | Pro `surface` when strong | Worth surfacing if concise and credible; otherwise use as refinement only. |

### Step 7 notes

Competitor comparison is a classic example of a useful intake that often becomes mediocre visible output.

For Core:

- use it to sharpen positioning and examples
- avoid giving it guaranteed page space

For Pro:

- surface a differentiator only if it is short and genuinely specific

---

## Summary classification by role

### Best `surface` candidates

- `businessName`
- translated offer summary
- translated audience snapshot
- translated transformation statement
- 3 values / traits
- `tonePreset` translated into voice traits
- `selectedPalette`
- `selectedStyle`
- `existingTypeface` when relevant
- one concise differentiator when confidence is high

### Best `signal` candidates

- `industry`
- `stage`
- `brandNarrator`
- `businessOperatingModel`
- `touchpoints`
- `primaryGoal`
- `voiceSliders`
- `painPoints`
- `desiredOutcomes`
- `missionStatement`
- `originArchetype`
- `originSummary`
- `motivation`
- `colorMoodNotes`
- `styleNotes`
- `competitors`

### Best `drop_or_defer` candidates

- `referenceUploadName` as visible output
- raw origin taxonomy labels
- raw narrator labels
- raw operating model labels
- raw slider labels
- visible competitor pills in Core by default
- any weak story or mission copy that is only present because the field exists

---

## What the guide should actually show

The main guide should probably show only the following content families:

1. **Brand summary**
   - what the business is
   - who it is for
   - what it helps them do

2. **Brand feel**
   - 3 voice traits
   - 3 visual keywords
   - 3 values or guiding traits

3. **Visual system**
   - palette
   - type
   - imagery feel
   - simple application cues

4. **Writing system**
   - do / avoid
   - sample phrases
   - CTA direction

5. **Apply it first**
   - top touchpoint
   - top use cases
   - quick implementation guidance

That is enough for a credible, useful PDF.

---

## What should change in the survey

The current survey is not wrong, but it is still optimized for **collecting strategic detail**, not necessarily for creating the most useful **selective guide**.

The next version should separate three kinds of questions:

### 1. Questions that create visible copy

Keep these concise and high-value.

Examples:

- What do you sell?
- Who is it for?
- What result do you help create?
- Which brand feel fits best?
- Which visual direction fits best?

### 2. Questions that shape presentation

These should help the system decide what kind of guide to create.

Examples:

- Where do customers usually discover you first?
- Where will you use this guide first?
- What do you need help with most right now?
  - looking more professional
  - sounding more consistent
  - making my pages and posts feel cohesive
  - knowing what to update first

These questions can shape:

- page emphasis
- examples shown
- action-plan ordering
- density of explanation

### 3. Questions that enrich only when confidence is high

These should not automatically earn space in the PDF.

Examples:

- founder story
- motivation
- detailed mission
- competitor references
- nuanced differentiation

These are optional enrichers, especially for Pro.

---

## Questions worth rewriting

### Replace taxonomic questions with output-oriented questions where possible

Some current fields are useful internally but do not sound natural as customer-facing logic.

Examples:

- `brandNarrator`
- `businessOperatingModel`
- some archetype-style story fields

Instead of asking only for internal taxonomy, consider a more natural user-facing version whose answer can still map to internal routing.

Example reframes:

- Instead of raw narrator framing:  
  "What do customers trust most about your business?"
  - me personally
  - my craft / product quality
  - our team
  - the product itself
  - the mission behind it

- Instead of raw operating-model framing:  
  "Where do customers usually experience you first?"
  - at my location
  - at their location
  - online
  - at events / markets
  - a mix

These are easier for non-marketers and still provide strong routing signals.

### Add a density / use-case question

This is currently missing and would likely improve the PDF more than some existing detail fields.

Suggested question:

- "What do you most want this guide to help you do first?"
  - update my website
  - make my social presence look more consistent
  - hand clearer direction to a designer
  - sound more professional in writing
  - know what to fix first

This could determine:

- which examples surface
- whether voice or visual gets more space
- how tactical the Quick Start becomes

### Add visual-keyword capture or derivation

Many short brand guides rely on 3 visual keywords rather than more elaborate design explanation.

That can be derived from current fields, but it may be worth explicitly collecting or confirming.

Suggested prompt:

- "Which three visual words should people feel when they see your brand?"

Examples:

- clean
- warm
- handcrafted
- polished
- bold
- understated

This is often more usable in the guide than a longer narrative style explanation.

---

## Output rules to add

If the system adopts a signal-first model, it also needs stronger editorial rules.

### Rule 1: Omission is allowed

If a section is weak, generic, or redundant, omit it.

### Rule 2: Signals can shape density

Examples:

- newer businesses may need more "apply this first" help
- more established businesses may benefit from slightly stronger differentiation language
- visually expressive selections may justify richer imagery treatment
- simpler businesses may get a more minimal, lower-density guide

### Rule 3: One field does not guarantee one block

No field should earn visible real estate just because it exists.

### Rule 4: Examples beat explanation

Prefer:

- sample line
- mini do / avoid
- practical application cue

Over:

- abstract explanatory paragraph

### Rule 5: Visible output should be reusable

If the customer cannot:

- copy it
- skim it
- hand it to someone
- apply it quickly

then it probably should not be in the main guide.

---

## Proposed next design direction

The product should aim for:

- a **short main guide**
- a **separate action sheet**
- a **separate Pro template pack**

But the bigger change is underneath:

- visible output becomes narrower
- hidden signals become smarter
- weak sections are omitted instead of filled

That is the path that best matches:

- the provided PDF example
- small-business brand-guide norms
- the non-marketer audience
- the product goal of making execution easier

---

## Recommended next steps

1. Update the packaging refactor plan so it no longer assumes every major input family deserves direct guide space.
2. Add a formal `surface / signal / drop_or_defer` classification to the product specs.
3. Review each current survey step and mark:
   - which questions are for visible output
   - which are routing signals
   - which are Pro enrichers
4. Rewrite user-facing question copy for taxonomic fields so they sound natural and outcome-oriented.
5. Add editorial QA rules that explicitly permit omission and reward low-density output.

---

## Recommendation

Do not just refactor the PDFs.

Refactor the product around this principle:

**The intake exists to help us make better editorial decisions, not to guarantee that every captured idea appears in the guide.**
