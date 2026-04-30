# CTA composition marketing research (2026-04)

## Purpose

This research note validates and extends the CTA composition direction for Brand Identity Guide folio 05.

Goal: confirm what should change in deterministic CTA generation so output is both:

- brand-appropriate and reader-clear
- conversion-aware and platform-realistic

This is a synthesis doc, not a normative spec. Normative behavior should be defined in:

- `OUTPUT_TRANSLATION_SPEC.md` (section 10A.6A and related rows)
- `docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md` (frame and layout contracts)

---

## Scope

This pass focused on:

- social CTA best practices
- paid marketing CTA best practices
- platform-specific guidance (Meta, LinkedIn, TikTok, YouTube, Pinterest)
- offer-type patterns (ecommerce, lead-gen, local services)

The question was not "how to design buttons." The question was "how should deterministic CTA copy be composed so it reflects effective marketing tactics."

---

## Source quality and confidence

### High-confidence sources used

- NN/g: ["Get Started" Stops Users](https://www.nngroup.com/articles/get-started/)
- NN/g: [Better Link Labels: 4Ss for Encouraging Clicks](https://www.nngroup.com/articles/better-link-labels/)
- Meta Business Help:
  - [Best practices to make your ad more engaging](https://www.facebook.com/business/help/370852930116232)
  - [Available call-to-action buttons in Meta Ads Manager](https://www.facebook.com/business/help/410873986524407)
- Google Ads Help:
  - [Optimize your ads and landing pages](https://support.google.com/google-ads/answer/6238826?hl=en)
- YouTube Ads / Google:
  - [ABCDs of effective video ads](https://business.google.com/us/resources/articles/abcds-of-effective-video-ads/)
- TikTok For Business Help:
  - [Creative best practices for performance ads](https://ads.tiktok.com/help/article/creative-best-practices)
- Pinterest Business:
  - [Creative best practices for Pinterest ads](https://business.pinterest.com/creative-best-practices/)
  - [Lower-funnel creative best practices](https://business.pinterest.com/blog/lower-funnel-creative-best-practices/)
- LinkedIn Ads glossary:
  - [Call to Actions: Types, Best Practices & Strategies](https://business.linkedin.com/advertise/resources/marketing-terms/cta)

### Medium-confidence sources used

- LinkedIn docs were partially thin or gated in this pass:
  - [LinkedIn ad creative best practices](https://www.linkedin.com/help/lms/answer/a420488)
  - Conversation-ad PDF fetch was unavailable in this run.
- Litmus:
  - [Don't Be A Robot: How To Write Email Copy Like A Human](https://www.litmus.com/blog/dont-be-a-robot-how-to-write-email-copy-like-a-human)

### Low-confidence / deprioritized

- generic agency/blog roundups were used only for pattern triangulation, not as primary evidence.

---

## Core findings (what is validated)

1. **Specific CTAs outperform generic CTAs.**
   - NN/g strongly supports avoiding ambiguous "Get started"-style language when the next step is more specific.
   - Implication: CTA lines should carry clear information scent (what action and what result), not only action verbs.

2. **Objective and conversion-path alignment matters.**
   - Meta and Google both emphasize matching CTA to campaign goal and destination behavior.
   - Implication: `primaryGoal` should shape not just tone but conversion mechanics and next-step clarity.

3. **Message match between CTA and destination is critical.**
   - Google guidance explicitly ties conversion performance to ad/landing relevance.
   - Implication: generated lines should describe realistic next action that can plausibly happen on that surface.

4. **Platform-native semantics are performance-relevant.**
   - TikTok, Pinterest, and YouTube guidance all reinforce format-native creative and direct direction.
   - Implication: social CTA lines should differ by platform family and interaction mode, not just "casual vs professional."

5. **Lower-funnel CTAs should be direct and action-forward.**
   - Pinterest lower-funnel guidance explicitly recommends direct purchase/action language.
   - Implication: for high-intent goals (`direct_sales`, some `lead_gen`), current neutral phrasing can be underpowered.

6. **Testing and variation are mandatory, not optional.**
   - All major platforms emphasize continuous creative iteration.
   - Implication: deterministic system should support testable variants via fixture matrix and path-class checks.

7. **Human tone is a quality requirement, not just style preference.**
   - Litmus and NN/g evidence both support writing that sounds natural to one person, avoids jargon/meta language, and sets immediate truthful expectations.
   - Implication: CTA copy should avoid analyst/system phrasing in reader-visible output even when composition logic is complex under the hood.

---

## Gap analysis vs current system

Current CTA composition in `brandIdentityGuideModel.ts` is strongest in:

- goal routing (`primaryGoal`)
- surface routing (`website` / `email` / `directory` / `marketplace` / `social`)
- basic social tone split (`professional` vs `casual`)
- dedupe and list caps

Main gap areas:

1. **Too little offer mechanic composition**
   - weak support for urgency, risk reversal, proof, incentive framing
2. **Too little surface-depth nuance**
   - not enough difference between awareness vs consideration vs action asks
3. **Insufficient signal use**
   - underuses operating model, offer/delivery, pain/outcome, and some industry constraints
4. **Limited expectation setting**
   - some good lines exist ("reply within a day"), but this is not systematic
5. **Potential over-correction from "avoid vague"**
   - clarity guardrails are good; conversion levers are not yet equally formalized

---

## Recommended policy changes

### Keep

- anti-vague rule as a baseline
- dedupe discipline across examples sections
- deterministic structure and capped output density

### Add

1. **CTA composition slots**
   - `action`
   - `value_outcome`
   - `friction_reducer`
   - `trust_or_risk_guard`
   - `urgency_or_timing` (conditional, truthful only)

2. **Signal precedence**
   - primary: `primaryGoal`, surface, touchpoint details/order
   - secondary: operating model, delivery mode, offer category
   - tertiary: industry constraints, stage, voice modulation
   - enrichment: pain/outcomes for specificity

3. **Intent-tier logic**
   - discovery-safe CTA variants
   - consideration CTA variants
   - action/transaction CTA variants

4. **Compliance-aware persuasion policy**
   - for sensitive industries, bias away from pressure language; keep clarity and legitimacy cues

5. **Expectation-setting requirement**
   - at least one CTA per surface should clarify "what happens next" when plausible

### Adapt

- revise "avoid vague CTA" rule to:
  - avoid empty/generic labels
  - allow concise generic verbs only when paired with concrete outcome or next-step context

### Remove / de-emphasize

- over-index on "clean but generic" lines in high-intent contexts
- one-size-fits-all social CTA lines for distinct platform families

---

## Practical implications for folio 05

1. Keep frame and layout contracts stable.
2. Upgrade content composition first (`linesForSurface` and helpers).
3. Increase platform family specificity in copy, not just in frame selection.
4. Add stricter quality checks:
   - action clarity
   - value clarity
   - next-step plausibility
   - non-spam persuasion compliance

---

## Applied implementation principles (2026-04 v2 pass)

This research is now directly mapped into model behavior with explicit deterministic rules:

1. **Layered deterministic composition**
   - Composition runs as: signal routing (`primaryGoal`, surface, touchpoint family, operating/offer context, industry/stage/tone modulation) -> slot assembly (action, value/outcome, expectation/trust) -> stable variant selection -> dedupe/caps.
2. **Stable variation, no randomness**
   - CTA variants are chosen via stable hashing over an invariant signal fingerprint, so same inputs remain reproducible while different fixtures spread across larger phrase banks.
3. **Guardrails before selection**
   - Every phrase bank entry is pre-vetted against prohibited tactics and meta-language restrictions before deterministic selection occurs.
4. **Human tone as a hard requirement**
   - Variant banks prefer natural cadence, contractions when appropriate, and channel-native wording patterns for email/social while preserving clarity and truthful expectation setting.
5. **Quality gates in tests**
   - Cross-fixture diversity and channel-idiom tests are required alongside determinism, banned-vocabulary, dedupe, and six-page regression checks.

---

## Open research follow-ups

1. Pull more official LinkedIn gated guidance for Conversation Ads and document constraints.
2. Define a deterministic policy for urgency language:
   - allowed phrases
   - required conditions
   - prohibited pseudo-scarcity patterns
3. Build an offer-type taxonomy map:
   - ecommerce vs appointment vs quote/request-info vs community-growth
4. Validate output against real fixture cohorts (not only default sample).

---

## Recommendation

Proceed with CTA engine updates as:

1. **clarity baseline** (already mostly present),
2. **conversion mechanics layer** (missing today),
3. **platform and offer realism layer** (partially present, should be expanded),
4. **compliance-safe persuasion guardrails** (missing as explicit policy).

This keeps the system deterministic while making CTA outputs more aligned with real marketing performance patterns.
