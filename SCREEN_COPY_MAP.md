# Identity Kit Screen-by-Screen Copy Map (v1)

This map translates the PRD flow into concrete text surfaces by screen/state.

## Global System Copy

- Brand: "Brand Alchemy Identity Kit"
- Tier labels: "Core Kit", "Pro Kit"
- Primary CTA style: black pill button visual parity
- Progress text format: "Step X of 7"
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

- Headline: "Build a complete brand identity kit in minutes."
- Subheadline: "Answer a few guided questions and get a polished 4-document kit delivered to your inbox."
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
- Copy needs: business name, offer, industry, current stage

### Step 2: Customer

- Goal: define audience profile
- Copy needs: buyer archetype, pain points, desired outcomes

### Step 3: Personality

- Goal: choose brand voice/personality
- Copy needs: adjective pickers, tone examples, "sounds like / doesn't sound like"

### Step 4: Values

- Goal: identify core values and promises
- Copy needs: values selectors, mission framing, trust commitments

### Step 5: Story

- Goal: gather founder/business backstory
- Copy needs: origin summary, motivation, transformation narrative

### Step 6: Aesthetic

- Goal: visual direction inputs
- Copy needs: color/mood preferences, style references, optional upload note
- Error/limit copy needed for file size/type constraints

### Step 7: Industry

- Goal: category context and competitors
- Copy needs: industry descriptor, competitor references, differentiation statement

## Review Screen

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

