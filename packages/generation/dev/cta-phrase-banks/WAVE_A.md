# Wave A — Copywriter Deliverable

**Date:** 2026-05-26
**Copywriter wave:** A (fix-and-audit, per `CTA_BANK_AUDIT.md` §13)
**Maps to W-track items:** W1, W3, W4

## How to use this document

This document is the copywriter's handoff. It is not a direct edit to `CTA_PHRASE_BANKS.md`. A separate AI pass will apply these replacements to the bank file once this deliverable is reviewed.

Each entry is organized as:

- **Location** — exact surface > goal > industry > tone > variant position in the bank
- **Original** — the exact string currently in the bank
- **Failure** — the specific quality problem (rule cited where applicable)
- **Replacement** — paste-ready copy to substitute

All replacements are written to the same `[line1, line2]` format as the bank. All pass the §13 four-question check, the §8 banned-vocabulary list, the §7 punctuation rules, the §3 emotional register for the industry, and the §12 line2 rules (line2 is a second CTA, credibility signal, or warmth note — never an explanation of line1).

---

## Part 1 — Confirmed §5 violations

These are the three confirmed rule violations from `CTA_BANK_AUDIT.md` §5. Priority fixes.

---

### V1 — EMAIL > `lead_gen` > `trades_home` > friendly > variant 3

**Original:**
```
["Hit reply with the details and I'll tell you if we're the right fit.", "Always happy to answer questions first."]
```
**Failure:** "I'll tell you if we're the right fit" — gatekeeping framing. Positions the business as evaluator. Per `CTA_COPY_RULES.md` §8 and the pattern explicitly banned in §3 ("I'll tell you if I can help" — wrong register regardless of industry; signals the reader is being screened, not helped).

**Replacement:**
```
["Hit reply with the job details and I'll put together a free estimate.", "No visit required for a ballpark. Just tell me what you've got."]
```
Register check: reply trigger ✓, first-person singular (trades default) ✓, honest/practical ✓, no gatekeeping ✓, "no visit required" is a trades-specific ease signal ✓.

---

### V2 — LINKEDIN > `lead_gen` > `retail_maker` > variant 3

**Original:**
```
["We supply independent retailers and corporate gifting programs. DM to learn more.", "Trade pricing and minimums available on request."]
```
**Failure:** "DM to learn more" — "Learn more" is explicitly banned in `CTA_COPY_RULES.md` §8 (vague; replaces it with a specific action).

**Replacement:**
```
["We supply independent retailers and corporate gifting programs. DM with your buying volume and product category.", "Trade pricing and minimums available on request."]
```
Register check: LinkedIn professional tone ✓, no exclamation ✓, specific next-step ask ("buying volume and product category" gives the sender something concrete to reply with) ✓, "Learn more" removed ✓.

---

### V3 — LINKEDIN > `lead_gen` > `health_wellness` > variant 1

**Original:**
```
["Interested in corporate wellness programs or employer partnerships? DM to learn more.", "We work with HR and wellness leads to tailor programs."]
```
**Failure:** "DM to learn more" — same §8 violation. "Learn more" is banned.

**Replacement:**
```
["Exploring corporate wellness options for your team? DM with your team size and what you're hoping to improve.", "We work with HR and wellness leads to tailor programs."]
```
Register check: LinkedIn professional tone ✓, question opener retained (effective for LinkedIn lead_gen) ✓, specific DM prompt replaces vague ask ✓, line2 unchanged (it was correct) ✓.

---

## Part 2 — Borderlines and grammar errors

---

### B1 — SOCIAL CASUAL > `lead_gen` > `creative_pro` > friendly > variant 3

**Original:**
```
["Send a DM with the basics and we'll pick it up from there.", "No formal process to get started."]
```
**Failure:** "to get started" in line2 — banned vocabulary per `CTA_COPY_RULES.md` §8 ("Get started: vague, overused. Replace with the specific action"). Here it appears as a supporting clause but the vagueness is the same. Decision: replace line2 only; line1 is good.

**Replacement:**
```
["Send a DM with the basics and we'll pick it up from there.", "No brief required. Just tell us what you're working on."]
```
"No brief required. Just tell us what you're working on." — removes the banned phrase and replaces it with a specific and collaborative-register note that fits creative_pro well.

---

### B2 — `ctaTemplates` > `lead_gen` > `health_wellness`, bold > entry 3

**Original:**
```
["Book a free intro session.", "Tell us your goals.", "No commitment to get started."]
```
**Failure:** "to get started" in entry 3 — same pattern as B1.

**Replacement:**
```
["Book a free intro session.", "Tell us your goals.", "No commitment required."]
```
"No commitment required" is tighter and removes the vague filler without changing the meaning.

---

### G1 — EMAIL > `direct_sales` > `creative_pro` > professional > variant 1

**Original:**
```
["Please reply with your scope and timeline. We will respond with proposal in two days.", "All proposals include a written scope, timeline, and fixed fee."]
```
**Failure:** grammar — "respond with proposal" is missing the article "a."

**Replacement:**
```
["Please reply with your scope and timeline. We will respond with a proposal within two days.", "All proposals include a written scope, timeline, and fixed fee."]
```
Also changed "in two days" to "within two days" for precision (avoids implying exactly day 2 rather than up to 2 days).

---

### G2 — EMAIL > `lead_gen` > `creative_pro` > friendly > variant 3

**Original:**
```
["Send a reply with what you need and I'll get back to you in day.", "Happy to answer early questions. Next step in one day."]
```
**Failure:** grammar — "in day" is missing the article "a."

**Replacement:**
```
["Send a reply with what you need and I'll get back to you within a day.", "Happy to answer early questions. Next step in one day."]
```
---

## Part 3 — Read-aloud audit replacements

Organized by surface in bank order. All entries were read aloud against `CTA_COPY_RULES.md` §13 four-question check.

---

### WEBSITE surface

---

**A1 — WEBSITE > `direct_sales` > `food_hospitality` > friendly > variant 1**

**Original:**
```
["Come in or order from home. We'd love to have you.", "We'd love to have you."]
```
**Failure:** Line2 is a verbatim repeat of the closing clause of line1. Per `CTA_COPY_RULES.md` §12, line2 is a second CTA, credibility signal, or warmth note — not an echo of line1.

**Replacement:**
```
["Come in or order from home. We'd love to have you.", "Something new is on the menu this week."]
```
Line2 is now a specific hook — timely, invitation register, gives the reader a reason to act now rather than later.

---

**A2 — WEBSITE > `direct_sales` > `food_hospitality` > friendly > variant 2**

**Original:**
```
["Reserve a table or grab takeout, whatever fits your evening.", "We're open all week."]
```
**Failure:** "whatever fits your evening" echoes the indifference register banned for `food_hospitality` in §3 and §8 ("either works," "whichever is convenient," "whatever you prefer" — all communicate indifference, and are particularly damaging in hospitality where warmth is the conversion driver).

**Replacement:**
```
["Reserve for dinner or order ahead for pickup.", "Come hungry. We'll take care of the rest."]
```
"Come hungry" is desire/invitation register — the reader is being pulled, not accommodated. "We'll take care of the rest" is warm without being hollow.

---

**A3 — WEBSITE > `direct_sales` > `health_wellness` > friendly > variant 2**

**Original:**
```
["Schedule something that's just for you.", "First appointment is always a good one."]
```
**Failure:** "a good one" in line2 is vague — it doesn't tell the reader what's good about it, passes no information, and doesn't function as a credibility or ease signal.

**Replacement:**
```
["Schedule something that's just for you.", "New clients always welcome. We'll handle the details."]
```
"We'll handle the details" is a specific ease signal — it tells the reader what the practitioner takes off their plate.

---

**A4 — WEBSITE > `direct_sales` > `community` > bold > variant 1**

**Original:**
```
["Get involved. Start here.", "Every contribution matters."]
```
**Failure:** "Every contribution matters" is community-sector boilerplate. It passes no specific information and could be used verbatim by any nonprofit anywhere. Fails the §13 check: "If you removed the industry and context, could this line be from anyone? If yes, not specific enough."

**Replacement:**
```
["Get involved. Start here.", "Volunteer, give, or partner with us."]
```
Line2 gives three concrete paths — actionable, specific to the three modes of community involvement, no filler.

---

**A5 — WEBSITE > `direct_sales` > `community` > bold > variant 3**

**Original:**
```
["Support the work. Volunteer or give, your call.", "It takes about 30 seconds."]
```
**Failure:** Two register problems in one pair. "Your call" is transactional shorthand borrowed from retail. "It takes about 30 seconds" is a friction-reduction mechanic from e-commerce (checkout UX, app onboarding). Neither belongs in community copy, which per §3 communicates belonging and purpose, not efficiency and neutrality.

**Replacement:**
```
["Show up for the work. Volunteer, donate, or partner.", "We'll help you find the right way in."]
```
"Show up for the work" is purpose-register — active, values-led. "The right way in" is community wayfinding language: it acknowledges that getting involved can feel unclear and offers a guide, not a form.

---

**A6 — WEBSITE > `direct_sales` > `community` > friendly > variant 2**

**Original:**
```
["Join us and see what we're working on.", "Every person makes a difference."]
```
**Failure:** "Every person makes a difference" is another community cliché. Same §13 failure as A4.

**Replacement:**
```
["Join us and see what we're working on.", "Come once and see what it feels like."]
```
"Come once and see what it feels like" is a low-commitment, genuine invitation. It acknowledges that getting involved is a real decision, meets the reader where they are, and lets the work speak — which is exactly the community register in §3.

---

**A7 — WEBSITE > `direct_sales` > `community` > professional > variant 2**

**Original:**
```
["Review our programs and contact us to explore involvement.", "We match contributors with opportunities that fit their capacity."]
```
**Failure:** "We match contributors with opportunities that fit their capacity" — HR/RFP language. "Contributors" and "capacity" are corporate-sector vocabulary. No community organization actually talks to its volunteers this way. Fails the §13 smell test: "Is there any word here that the business owner would never use themselves?"

**Replacement:**
```
["Review our programs and contact us to explore involvement.", "We will respond with options that fit your interests and schedule."]
```
"Interests and schedule" is human language. "Capacity" is not.

---

**A8 — WEBSITE > `direct_sales` > `community` > professional > variant 3**

**Original:**
```
["Explore volunteer and giving opportunities.", "We will follow up to match you with the right program."]
```
**Failure:** "match you with the right program" is system-adjacent — reads like an automated intake response. Minor, but it fails the brand-voice bar when the fix is simple.

**Replacement:**
```
["Explore volunteer and giving opportunities.", "We will respond within two business days to connect you with the right team."]
```
"Connect you with the right team" is warmer and human. Adds the response timeline, which is appropriate for professional community tone.

---

**A9 — WEBSITE > `audience_growth` > `trades_home` > professional > variant 2**

**Original:**
```
["Sign up for our newsletter to stay informed on seasonal tips and completed projects.", "Seasonal tips and project highlights, monthly."]
```
**Failure:** Line2 is a compressed restatement of line1 — it names the same content categories ("seasonal tips," "projects") and adds only the frequency. Per §12, line2 should add something line1 doesn't already contain.

**Replacement:**
```
["Sign up for our newsletter to stay informed on seasonal tips and completed projects.", "One email a month. No advertising content, ever."]
```
Line2 now carries the frequency promise and a quality signal ("no advertising content") that isn't in line1.

---

**A10 — WEBSITE > `audience_growth` > `food_hospitality` > professional > variant 2**

**Original:**
```
["Sign up for our newsletter to stay informed about upcoming events and featured menus.", "Events, menus, and what's new each week."]
```
**Failure:** Same line2 repeat issue as A9.

**Replacement:**
```
["Sign up for our newsletter to stay informed about upcoming events and featured menus.", "Published weekly, without fail."]
```
Line2 is now purely the delivery commitment — consistent, reliable, no repeat of content categories.

---

**A11 — WEBSITE > `audience_growth` > `health_wellness` > professional > variant 3**

**Original:**
```
["Sign up for our newsletter to receive curated wellness guidance from our team.", "Practical guidance from our team, weekly."]
```
**Failure:** "from our team" appears in both lines — line2 opens by repeating the source already named in line1.

**Replacement:**
```
["Sign up for our newsletter to receive curated wellness guidance from our team.", "Evidence-based, plainly written, one issue per week."]
```
Line2 adds new descriptors (evidence-based, plain writing style) and the frequency — none of which were in line1.

---

**A12 — WEBSITE > `audience_growth` > `retail_maker` > bold > variant 3**

**Original:**
```
["Follow the shop. New things weekly, small batches.", "Follow before they sell out."]
```
**Failure:** Line2 opens with "Follow" — the same action verb that opens line1. Both lines are directing the same action, and the second use reads as a pressure tactic rather than a second distinct CTA or credibility signal.

**Replacement:**
```
["Follow the shop. New things weekly, small batches.", "First to follow, first to shop."]
```
"First to follow, first to shop" is alliterative, energetic, and communicates the actual value of following (priority access) without repeating the imperative.

---

**A13 — WEBSITE > `audience_growth` > `retail_maker` > friendly > variant 2**

**Original:**
```
["Sign up for early access to new collections, we sell out quickly!", "One email per drop, promise."]
```
**Failure:** Exclamation mark on the website surface. Per `CTA_COPY_RULES.md` §7, exclamation marks for `retail_maker` are earned on casual social only. Website is not in the earned contexts list. Additionally the comma splice in line1 reads slightly rushed.

**Replacement:**
```
["Sign up for early access to new collections. We sell out quickly.", "One email per drop, promise."]
```
Exclamation removed. Comma splice resolved with a period. The urgency signal ("We sell out quickly") is factual for retail_maker and acceptable without the exclamation per §9.

---

**A14 — WEBSITE > `audience_growth` > `professional_svc` > friendly > variant 3**

**Original:**
```
["Sign up and get one useful update a month.", "People tell us it's the only newsletter they actually open."]
```
**Failure:** Line2 makes an unverifiable social proof claim. Per `CTA_COPY_RULES.md` §9, fabricated social proof is banned ("Fake social proof: 'Thousands of happy customers are waiting.'"). This is softer but structurally the same — making a third-party validation claim that can't be verified.

**Replacement:**
```
["Sign up and get one useful update a month.", "Plain language on things that actually affect you."]
```
Line2 is now a genuine value description — specific, honest, no claim requiring external validation.

---

**A15 — WEBSITE > `retention` > `community` > variant 1**

**Original:**
```
["Still with us? We'd love to reconnect.", "There's always more to do and more ways to help."]
```
**Failure:** "There's always more to do and more ways to help" is unfocused filler — true of every community org, adds nothing specific, fails the §13 specificity check.

**Replacement:**
```
["Still with us? We'd love to reconnect.", "New programs have launched since you were last here."]
```
Line2 gives a specific reason to come back — something has changed. This is the honest re-engagement hook for community retention.

---

**A16 — WEBSITE > `retention` > `food_hospitality` > variant 1**

**Original:**
```
["Come back and see what's changed.", "New menu items added every month."]
```
**Failure:** "New menu items added every month" is a generic baseline claim — any restaurant with a seasonal menu could say this, and it doesn't create desire or specificity. Line1 ("Come back and see what's changed") and line2 are doing roughly the same job without enough distinction. The pair lacks the invitation energy §3 requires for food_hospitality retention.

**Replacement:**
```
["It's been a while. We'd love to see you again.", "The menu has changed. Come find your new favorite."]
```
Line1 opens with warmth and an acknowledgment of time, not a directive. Line2 gives a specific payoff ("your new favorite") that creates anticipation — the reader imagines finding something new. Both lines now do different jobs.

---

### EMAIL surface

---

**A17 — EMAIL > `direct_sales` > `food_hospitality` > friendly > variant 1**

**Original:**
```
["Reply and I'll grab you a table or set up a takeout order, whichever works.", "Either way, we've got you."]
```
**Failure:** "whichever works" in line1 and "Either way" in line2 — double indifference register. Per §3, food_hospitality copy must communicate desire and invitation. The reader should feel wanted, not accommodated. Both of these phrases communicate neutrality.

**Replacement:**
```
["Hit reply and tell me what sounds good.", "Dinner in or takeout — I'll handle the details."]
```
"Tell me what sounds good" invites the reader to express a preference (warmth). "I'll handle the details" is hospitality warmth — the host takes over from there. No neutrality.

---

### SOCIAL CASUAL surface

---

**A18 — SOCIAL CASUAL > `direct_sales` > `food_hospitality` > friendly > variant 2**

**Original:**
```
["Tap the link to book a table or grab takeout tonight.", "Either way, we've got you."]
```
**Failure:** "Either way, we've got you." — same indifference register problem as A17, on the social surface.

**Replacement:**
```
["Tap the link to book a table or order ahead for tonight.", "We'd love to see you."]
```
"We'd love to see you" is the correct food_hospitality register — genuine, warm, inviting.

---

**A19 — SOCIAL CASUAL > `audience_growth` > `retail_maker` > bold > variant 3**

**Original:**
```
["Save this and follow. New things every week, everything made by hand."]
```
**Failure:** This is a single-element array — missing line2. The bank format requires `[line1, line2]` pairs. This is an authoring slip (noted in `CTA_BANK_AUDIT.md` §12.2 #8). Both constituent phrases are good; they just need to be properly split.

**Replacement:**
```
["Save this and follow.", "New things every week, everything made by hand."]
```
Line1 is the action. Line2 is the payoff — the reason to follow. Clean split, no content change.

---

**A20 — SOCIAL CASUAL > `audience_growth` > `health_wellness` > bold > variant 1**

**Original:**
```
["Follow for one practical tip a week!", "No fluff, just what works."]
```
**Failure:** Exclamation mark not in earned contexts. Per §7, health_wellness exclamation marks are earned for booking CTAs on casual social (`lead_gen`). Audience_growth on casual social is not in the earned contexts list for health_wellness.

**Replacement:**
```
["Follow for one practical tip a week.", "No fluff, just what works."]
```
The line works well without the exclamation — the clarity and specificity ("one practical tip a week") carry the energy without needing punctuation to inject it.

---

## Part 4 — What held up under read-aloud

For calibration during Wave B expansion, these sections of the bank are at or near the quality bar set in §12.3 and can anchor the writing engagement:

**`trades_home` WEBSITE and EMAIL (direct_sales, lead_gen):** The existing 18 pairs across these goals are largely solid. The bold/professional distinction is clearer here than in other industries. Particularly strong: website direct_sales professional (expectation-setting is specific and honest), email direct_sales bold (reply triggers work naturally).

**`professional_svc` across all surfaces:** The tone rules for this group (`CTA_COPY_RULES.md` §10) are well-observed throughout. No exclamation slips, no urgency, free-consultation mechanic consistently applied. These entries can serve as the quality benchmark for the professional tone across all industries.

**`creative_pro` WEBSITE audience_growth:** Among the strongest audience_growth entries in the bank — the studio newsletter framing ("things that didn't make the portfolio," "when we have something real to share") breaks the generic follow/subscribe/frequency formula and has genuine voice. Use these as a model for how to break the formula in other industries during Wave C.

**Email audience_growth (reply triggers, all industries):** The per-industry differentiation using reply mechanics is well-executed. These 21 entries are largely clean and can be used as models when Wave B expands email depth.

**LinkedIn audience_growth (all industries):** Strong as a section. The value-led framing before the follow ask is consistently correct for the platform. These don't need significant rework.

---

## Part 5 — Observations to carry into Wave B

These are not fixes for Wave A (the existing copy is passable) but patterns that should be avoided when writing new pairs in Waves B and D.

1. **The `audience_growth` formula problem is systemic.** Before writing any new audience_growth pairs in Wave B, identify 3–4 structurally different shapes of follow/subscribe CTA per industry. The current formula (follow/subscribe for X, Y, Z + frequency promise) will be even more visible at tier-1 depth (≥8 pairs). `creative_pro` website audience_growth is the model for what breaking the formula looks like.

2. **Bold vs. friendly needs more daylight.** In many leaves the tonal delta between bold and friendly is a single softener ("together," "we'll") rather than a perceptibly different register. Wave B expansion should lean into the structural difference: bold uses fragments, short declaratives, and sentence-final confidence; friendly uses questions, conversational connectors, and warmth closes. Readers should feel the difference without seeing the label.

3. **`email > trades_home > lead_gen > friendly > variant 1` has borderline gatekeeping energy.** Original: "Reply with what's going on and I'll give you an honest read. / If it sounds like a fit, I'll send a free quote." The "if it sounds like a fit" is less flagrant than the V1 violation but subtly implies screening. Not replaced in Wave A (the conditional can be read as authentic — a trades business doesn't take every job). Monitor in Wave B and decide whether the expansion pairs can provide alternatives.

4. **`community direct_sales` is the hardest mapping in the bank.** Getting the belonging-and-purpose register right while still asking for a specific action is genuinely difficult. Wave B pairs for community should do the creative work on this before writing volume — what does a bold community CTA actually sound like if it's not using retail or nonprofit-jargon vocabulary?

5. **`retention` pairs across surfaces lack tonal and conceptual variety.** The existing base is acceptable but thin. Wave B retention pairs need 3–4 distinct conceptual openers per industry (not all "been a while / pick up where we left off / ready to come back") before hitting depth targets.

---

*This document is complete. Apply replacements to `CTA_PHRASE_BANKS.md` by exact string match on the Original, substituting the Replacement in the same variant position. Do not add or remove surrounding entries. After application, run `scripts/gen-cta-phrase-banks.mjs` and confirm parse-clean output. Then run the §7.1 mechanical grep checks.*
