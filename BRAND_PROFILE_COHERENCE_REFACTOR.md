# Brand Profile Coherence Refactor Plan

**Status:** In progress — Phases 1–7 copy/logic shipped; Phase 2 PDF presentation polish still open (see Phase 2 checklist).  
**Companion specs:** `DELIVERABLE_PRODUCTION_SPEC.md`, `OUTPUT_TRANSLATION_SPEC.md`, `SURVEY_NARRATOR_REFACTOR.md`, `SCREEN_COPY_MAP.md`  
**Scope:** Core and Pro tiers. Does not require new intake steps or new required fields unless noted.

---

## Implementation checklist (master)

Use this for a quick read on what is done vs. still open. Each phase has a detailed checklist below.

- [x] **Phase 1** — Synthesis layer + typography coherence (`brandProfile`, context matrix, PDF wiring, tests)
- [ ] **Phase 2** — Color roles + logo strategy: **copy and placement done** · **skimmable layout / grouping todo** (see Phase 2 checklist)
- [x] **Phase 3** — Style principles + do/avoid narrator awareness (`stylePrinciplesNarratorAdditions`, `styleDoAvoidNarratorLines`, tests)
- [x] **Phase 4** — Voice ↔ Visual bridge (`voiceVisualBridge.ts`, Style Guide + Tone profile, tests)
- [x] **Phase 5** — Stage signal (Quick Start Week 1 preamble + Do / avoid stage line, `coreAssembly`, tests)
- [x] **Phase 6** — Quick Start Week 3 by `TouchpointCluster` (`WEEK3_ITEMS_BY_CLUSTER`, tests)
- [x] **Phase 7** — Industry verbiage layer (`industryProfiles.ts`, Voice Playbook wiring, tests)
- [ ] **Phase 8** — Before/after examples + imagery direction

---

## The Problem

The kit currently has two disconnected knowledge systems and several standalone gaps that undercut the product experience even when those systems work as designed.

**Disconnected systems:**

1. **The voice system** — driven by `brandNarrator` + `tonePreset` + `voiceSliders`. Produces meaningfully personalized Brand Brief, Voice Playbook, and Quick Start content. A solo maker and a local shop team get different output because the narrator model genuinely cross-references their priorities.

2. **The visual system** — driven exclusively by `selectedStyle` (4 values) and `selectedPalette` (6 values). Produces identical Style Guide content for any two brands that clicked the same visual options, regardless of industry, what they sell, where they show up, or who they are. Typography advice reads like it was written for website builders. Style principles don't know if the brand lives on a storefront sign, a product label, a slide deck, or an Instagram grid. The two systems never reference each other.

**Standalone gaps identified (in priority order):**

1. No logo or mark guidance — the single biggest unmet expectation for a "brand kit" customer.
2. The palette section shows colors but never explains how to use them — which is primary, which is accent, what ratio.
3. `stage` (idea / new / growing / established) is collected but barely used anywhere.
4. The industry verbiage layer is fully specced in `OUTPUT_TRANSLATION_SPEC.md §6` but not implemented — industry currently affects only one sentence in Messaging Themes and the Brand Brief overview line.
5. For `bold_graphic` and `organic_natural` styles, the embedded font specimens (Inter + Source Serif 4) are not the actual recommendation — and the kit currently shows them as primary without being honest about it.
6. The differentiation section is empty for most Core customers because Step 7 is optional — and differentiation is often the most important strategic question.
7. The Voice ↔ Visual bridge is one-directional — planned for Style Guide only; Voice Playbook currently has zero reference to the visual system.

**What we want instead:** Every section should feel like it was written for this specific brand, every practical question a customer brings to the document should be answered, and the two halves of the kit should feel like they came from the same place.

---

## Proposed Architecture: The BrandProfile Synthesis Layer

### Concept

Before any section is assembled, compute a `BrandProfile` struct from the intake form. This is a **derived object, not a new form field**. It synthesizes existing signals into named concepts that every generator function can ask questions of.

```typescript
type BrandProfile = {
  touchpoints: TouchpointCluster    // where this brand primarily shows up
  typography: TypographyContext      // which type guidance framing to use
  stageContext: StageContext         // what stage of brand development applies
  primaryChannelSet: string[]        // re-exposed from narrator for cross-section use
}
```

### How it is computed

```
BrandProfile = synthesize(
  form.step1.brandNarrator,
  form.step1.industry,
  form.step1.stage,
  form.step6.selectedStyle,
  form.step3.tonePreset
)
```

No model call. Pure deterministic lookup with fallbacks. No existing function is deleted — `BrandProfile` is additive and generators opt in incrementally.

---

## The Touchpoint Model

A **touchpoint cluster** describes where this brand's identity primarily lives. It gates typography guidance, style-do/avoid examples, and Quick Start rollout tasks.

### Defined clusters

| Cluster ID | Canonical touchpoints | Typical brand context |
|---|---|---|
| `physical_first` | Signage, packaging, labels, business cards, print | Local shop, contractor, food/bev physical, salon |
| `social_product` | Instagram, Etsy/marketplace, product packaging, brand website | Maker, product-led, DTC |
| `social_service` | LinkedIn, website/portfolio, email, proposals/decks | Solo expert, consultant, coach, photographer |
| `local_community` | Google Business, Facebook, email newsletter, local press, event flyers | Local team, nonprofit, community org |
| `digital_brand` | Brand website, Instagram, product photography, email | Product-led, growing DTC |

### Cluster assignment logic

The narrator is the primary signal. Industry overrides when it implies a meaningfully different primary touchpoint.

| Narrator | Default cluster | Industry override → `physical_first` | Industry override → `social_product` |
|---|---|---|---|
| `solo_expert` | `social_service` | `construction_trades`, `automotive`, `home_services` | — |
| `solo_maker` | `social_product` | `food_beverage` | — |
| `local_team` | `local_community` | `food_beverage`, `retail`, `home_services`, `automotive`, `fitness_sports` | `beauty_personal_care`, `pet_services` |
| `product_led` | `digital_brand` | `food_beverage` | `beauty_personal_care`, `health_wellness` |
| `mission_community` | `local_community` | — | — |

Fallback (no narrator set): `social_service`.

---

## The Stage Context Model

`stage` (idea / new / growing / established) currently appears in one Brand Brief line and nowhere else. It should shape how guidance is framed — starting from scratch vs. standardizing what already exists vs. protecting recognition that's been built.

### Defined stage contexts

| Stage value | `StageContext` | Framing intent |
|---|---|---|
| `idea` | `starting_fresh` | Everything is first-time. Start somewhere, start simple, start consistent. |
| `new` | `building_foundation` | The business exists but the brand is still forming. Get the basics right. |
| `growing` | `standardizing` | Channels exist but feel inconsistent. The job is to tighten, not restart. |
| `established` | `protecting_recognition` | There's equity in the current brand. Change carefully; evolve, don't replace. |

Stage context affects Quick Start framing and adds one stage-aware bullet to do/avoid.

---

## Phase 1 — Synthesis Layer + Typography Coherence

**Priority:** Highest. Typography is the most broken section. The synthesis layer is required for everything that follows.

### Phase 1 checklist

- [x] `packages/generation/src/deterministic/brandProfile.ts` — `TouchpointCluster`, `TypographyContext`, `StageContext`, `BrandProfile`, `touchpointClusterFromForm`, `computeBrandProfile`, cluster × industry table, fallbacks
- [x] Typography matrix (`typographyMatrix.ts`) — 5×4 section leads, per-face blurbs, licensing lines, stand-in honesty for `bold_graphic` / `organic_natural`, wordmark row notes, logo closing where contexts apply
- [x] `coreAssembly` wiring — specimens, recommendations body, re-exports
- [x] PDF — `CoreKitDocuments` specimen notes / typography section
- [x] Tests — cluster assignment, typography context, licensing, wordmark notes (`core-pdfs.test.ts`)

### New code

- `packages/generation/src/deterministic/brandProfile.ts`
  - `computeBrandProfile(form: IdentityKitForm): BrandProfile`
  - `TouchpointCluster` type, cluster assignment table (narrator × industry → cluster)
  - `TypographyContext` type, lookup (cluster → context)
  - `StageContext` type, lookup (stage → stageContext)

### Typography: `TypographyContext` values

| Touchpoint cluster | `TypographyContext` |
|---|---|
| `physical_first` | `physical_and_digital` |
| `social_product` | `social_and_packaging` |
| `social_service` | `professional_and_digital` |
| `local_community` | `community_and_local` |
| `digital_brand` | `social_and_digital` |

### Typography: section lead (top line, before specimens)

Keyed to `TypographyContext` + `selectedStyle`. Full matrix is 20 strings (5 contexts × 4 styles). Representative examples below; all 20 must be written during implementation.

**`physical_and_digital` / `clean_minimal`:**
> "Unless you already have brand fonts, Inter and Source Serif 4 can work as your starting pair — from business cards and signage to your website and social posts. Each block below shows your business name in regular, bold, and italic so you can see how they hold up before you commit."

**`physical_and_digital` / `organic_natural`:**
> "This direction calls for a warmer, more humanist face — Nunito Sans and Fraunces are strong fits. The blocks below use Inter and Source Serif 4 as embedded stand-ins so you can see the weight and role split; apply the same primary/supporting logic with your chosen faces. If Inter and Source Serif 4 feel right for now, they're a clean starting point."

**`physical_and_digital` / `bold_graphic`:**
> "This direction typically wants a stronger display sans — Space Grotesk and Archivo are both good options. The blocks below use Inter and Source Serif 4 as stand-ins; the role split is what matters. Use the same hierarchy with your actual display face in production."

**`social_and_packaging` / `clean_minimal`:**
> "Your brand name needs to work on a product label, a grid post, and a profile photo. The two faces below show your name in regular, bold, and italic — the bold cut especially, because that is often how your name looks at its most recognizable."

**`professional_and_digital` / `clean_minimal`:**
> "Unless you already have brand fonts, Inter and Source Serif 4 make a solid pair for the places you show up most — proposals, your website, email, and LinkedIn. Each block below renders your business name in regular, bold, and italic so you can see the range before committing."

**`professional_and_digital` / `luxe_refined`:**
> "Unless you already have brand fonts, Source Serif 4 and Inter are your elevated starting pair. Each block renders your business name in regular, bold, and italic — at this direction, you'll use most of the weight range sparingly."

**`community_and_local` / `clean_minimal`:**
> "These two faces cover the range from a flyer headline to an email newsletter to a Facebook post. Each block shows your business name in regular, bold, and italic — the bold weight is what most people read first on printed materials."

### Typography: per-face blurbs

Each specimen slot's `blurb` becomes context-aware. Blurbs answer: what is this face's job, where does it show up, and how should the weight ladder be used? **2–3 sentences, no bullets, marketer-to-peer tone.**

Context questions each blurb should answer per cluster:

**`physical_and_digital`:** Where does this face live on labels/signs/cards? Where digitally? Which weight at small print sizes?

**`social_and_packaging`:** How does this face work as a brand name / wordmark stand-in at small sizes? What happens on a product label vs. an Instagram caption?

**`professional_and_digital`:** What is this face's role in email vs. a proposal vs. a website headline?

**`community_and_local`:** How does this face work on a flyer or event graphic? What is its role in a newsletter?

**`social_and_digital`:** How does this face work as a content template baseline? Display vs. caption?

### Typography: "if only picking one" guidance

Each context carries a single `onlyOnePick` sentence integrated as the final line of the second specimen block's blurb — not a labeled section.

| Context | First face (primary) | "Only one" sentence |
|---|---|---|
| `physical_and_digital` | Inter | "If you need one face for everything from your sign to your social posts, bold Inter holds up at distance and small sizes better than most display serifs." |
| `physical_and_digital` | Serif | "If only one — Source Serif 4 regular for artisan products, Inter bold if your brand needs to read fast at distance." |
| `social_and_packaging` | Inter | "If only one face across your packaging and posts, Inter bold is the cleaner call at thumbnail scale." |
| `social_and_packaging` | Serif | "If only one — Source Serif 4 gives artisan and food products a crafted feeling; Inter works better if the brand is modern and efficient." |
| `professional_and_digital` | Inter | "If you are going to use one family for everything, Inter is the safer call — it reads well from email body copy to a slide title." |
| `community_and_local` | Inter | "If only one — Inter. It works on a flyer, a Facebook cover, and a newsletter without any of them looking wrong." |
| `social_and_digital` | Inter | "If only one, Inter — it handles every size on screen without feeling like a compromise." |
| `social_and_digital` | Serif | "If only one, Source Serif 4 regular for a more editorial presence; Inter if the brand is primarily information-forward." |

### Typography: logo / wordmark guidance

At `social_and_packaging` and `physical_and_digital` contexts — where a logo or wordmark is actively relevant — add a one-sentence note below the bold weight row of the primary specimen. This does not appear in `professional_and_digital`, `community_and_local`, or `social_and_digital` contexts.

**`social_and_packaging` primary specimen bold row note:**
> "The bold cut is a practical starting point for a wordmark — your name at its most recognizable. A custom mark can wait until you've validated that the brand is working."

**`physical_and_digital` primary specimen bold row note:**
> "At sign scale, bold Inter or bold Source Serif 4 (whichever is your primary) is a clean, readable wordmark starting point. Test your name at large size before committing to anything more complex."

**Broader logo strategy note** — added as a standalone closing line under the specimen stack (for both `social_and_packaging` and `physical_and_digital` contexts only, after licensing):

> "You do not need a custom logo mark to have a professional brand. Your business name set consistently in your primary typeface is a wordmark — and it is often more legible and versatile than a symbol, especially at the scale small businesses actually print and post things. When you are ready to work with a designer, everything in this Style Guide gives them exactly what they need."

For all other contexts, no logo guidance is shown — not because it does not matter, but because the framing is different (a consulting firm's logo question is less urgent than a food brand's label question), and generic logo strategy advice in the wrong context reads as filler.

### Typography: licensing line

Current line speaks to teams. Replace with 5 context-specific variants:

**`physical_and_digital`:**
> "Both fonts are free via Google Fonts. For printing and packaging, download the actual font files and use the same version across your digital and physical materials."

**`social_and_packaging`:**
> "Both fonts are free via Google Fonts. For packaging and labels, download the files directly — don't rely on a browser or app to serve them, because the rendered version may differ from what you approved."

**`professional_and_digital`:**
> "Both fonts are free via Google Fonts. Download them once, put them in your template files, and use that same version in every proposal, deck, and document you send."

**`community_and_local`:**
> "Both fonts are free via Google Fonts. Download them for your flyer templates and email headers — everything looks the same when it starts from the same files."

**`social_and_digital`:**
> "Both fonts are free via Google Fonts. Download them for your website and social templates so the same version shows up everywhere."

### Tests to update (Phase 1)

- Typography assertions should check `TypographyContext` computation, not just font name presence in body text
- Add fixtures for `food_beverage / solo_maker` (→ `physical_first` / `social_and_packaging`), `construction_trades / solo_expert` (→ `physical_first`), and `nonprofit_community / mission_community` (→ `local_community`) to cover cluster coverage

---

## Phase 2 — Color Application System + Logo Strategy

**Priority:** High. These are the two things a customer is most likely to notice are missing after reading the Style Guide. Both belong in this phase because they both answer "how do I use what the Style Guide is showing me?"

### Phase 2 checklist

**Done (content + logic)**

- [x] Per-palette color role copy + shared ratio guideline (`paletteColorRoles.ts`, keyed to Step 6 palette ids)
- [x] Style Guide PDF Palette section order: swatches → color roles → existing mood description (+ optional notes)
- [x] Visual direction block: logo strategy paragraph for all brands; softer variant when `stage === established`

**To do (formatting, skim UX, grouping)**

- [ ] **Palette (and adjacent Style Guide blocks)** — Early feedback: the vertical stack of long paragraphs feels like reading a book, not skimming a guide. Redesign for scanability: stronger visual grouping (e.g. role labels or short subheads for Primary / Supporting / Accent), break prose into shorter chunks, optional checklist-style lines where they help, or a compact two-column layout again if it improves hierarchy. Goal: answers “what do I do with these colors?” in seconds, details on a second read.
- [ ] **Visual direction + Typography** — Same principle where sections are dense: group related ideas, surface takeaways first, avoid uninterrupted walls of `sectionBodyText` when a label or bullet would be clearer.
- [ ] Spot-check regenerated PDFs (2–3 representative forms) after layout/copy tweaks.

### Color application system

Currently: the Palette section shows swatches and a mood description. It does not assign roles.

**Proposed change:** After the swatch row, add a short `colorRoles` block. This is a three-line paragraph, not a bullet list, and it is keyed per palette (not computed generically from swatch position, because "darkest = primary" is often wrong).

The roles are: **primary** (the dominant, most-used color), **supporting** (secondary areas and backgrounds), **accent** (the one thing per layout that catches the eye).

A ratio guideline follows: roughly 65–70% primary + neutral, 20–25% supporting, 5–10% accent. Not a hard rule — a directional anchor.

**Proposed copy per palette:**

`midnight_luxe`:
> "Your near-black is the primary — it carries the most weight and shows up in headers, dominant backgrounds, and anything that needs to feel premium and confident. The warm gold-tan is your accent — use it for the one element per layout that you want to feel like the point. The mid-dark navy sits between them as a supporting tone for layered sections and framing. As a rough guide: your darks carry most of every layout, the accent does the work of a highlighter."

`earthy_warmth`:
> "Your creamy off-white is your primary surface — the open space that lets the warmer tones breathe. Terracotta and caramel take turns as supporting and accent depending on how saturated you want a piece to feel: lean on the warmer terracotta as the accent for moments that need to pop, and use caramel for warmth without loudness. Keep the creamy neutral as the dominant space — earthy palettes lose their feeling the moment everything is saturated."

`ocean_calm`:
> "Your deep navy is the primary — it grounds the palette and signals confidence. The mid-blue is your supporting color for secondary sections, frames, and backgrounds that need presence without heaviness. The pale sky is your breathing room and light accent. These colors work best with clear contrast between layers — don't let two similarly toned blues sit next to each other without enough value difference to read distinctly."

`sunset_bold`:
> "Deep plum is your primary — it carries the palette's weight and keeps things from tipping into the bright-without-substance territory. Burnt orange and amber are your accent range: use one or the other per layout, not both, or the energy becomes noise. Your supporting role goes to whichever warm tone you are not using as the accent on that piece. This palette rewards restraint — the contrast does the work when you let one element lead."

`forest_deep`:
> "Your near-black forest green is the primary — it carries the depth that makes the rest of the palette feel grounded. Fresh sage is your accent: it works as a small pop of brightness against the deeper tones without going neon. The mid-forest green supports and connects. These colors feel most intentional when the darkest tones dominate and the sage is used deliberately, not scattered."

`minimal_light`:
> "Near-black is your primary for text, headers, and any element that needs to be clearly read. Cool mid-gray is your supporting tone — section dividers, secondary text, and framing. Off-white is your canvas. This palette works because it gets out of the way — keep it that way by resisting the urge to add a color that isn't in the system. One unexpected color, applied consistently, is an extension of a minimal palette. Three is visual noise."

### Color application placement in PDF

The `colorRoles` paragraph is rendered immediately after the swatch tiles, before the existing palette description prose. It is styled the same as `sectionBodyText` — no heading, no callout box, no special treatment. Just the next thing a person reads after they see the colors.

### Logo strategy

Phase 1 adds context-specific wordmark guidance in the Typography section. Phase 2 adds a short logo strategy note to the **Visual Direction** section — separate from typography — for all brands. This is a single paragraph that answers "what about my logo?" without requiring us to design one.

**Logo strategy paragraph for Visual Direction section:**

Default (no existing mark):
> "A note on your logo: you don't need a custom mark to build a recognizable brand. Many successful small businesses use their name set in their primary typeface as a wordmark, applied consistently across every surface. That is a real brand asset, and it scales from a business card to a sign to a social profile without the execution gaps that come with a symbol-based mark applied inconsistently. When you're ready to work with a designer on something custom, bring this Style Guide — it gives them your palette, your type direction, and your visual language in one document."

When the customer is at `established` stage, soften the "you don't need" framing:
> "A note on your logo: if you don't have a finalized mark yet, your name in your primary typeface is a strong, versatile starting point — especially during a period of brand standardization. When you're ready to invest in something custom, this Style Guide gives a designer your palette, type direction, and visual language in one document."

---

## Phase 3 — Style Guide Cross-Section Awareness

**Priority:** High. The Style Principles and Do/Avoid sections currently feel like they were written for an anonymous brand. This phase makes them feel specific.

### Phase 3 checklist

- [x] Style principles: two narrator bullets after style-based bullets (second line is touchpoint-oriented per narrator table)
- [x] Do / avoid: append one narrator-specific ✓ and one ✗ per narrator after style-based rules
- [x] Tests in `core-pdfs.test.ts` for `solo_expert` and `solo_maker` paths

### Style Principles

**Proposed change:** Expand from one narrator-addition bullet to two, where the second bullet references the touchpoint cluster.

| Narrator | Existing addition | Add (touchpoint-keyed second bullet) |
|---|---|---|
| `solo_expert` | "Every visual choice should reinforce the credibility of your work" | "Consistency between your website, LinkedIn, and the documents you share with clients is where a visual direction becomes a recognizable brand" |
| `solo_maker` | "Your visual style should make people feel the care in what you make" | "The same template energy that works in a grid post should carry through to your packaging, labels, and any materials someone holds in their hands" |
| `local_team` | "Consistent visuals across every touchpoint build local recognition fast" | "What your storefront looks like, what your social feed looks like, and what your printed materials look like should feel like they came from the same hand" |
| `product_led` | "The product is the hero — your visual system frames it, not competes with it" | "Your imagery, post templates, and website should all direct attention to the product — when the visual system is working, the product is always the most interesting thing in the frame" |
| `mission_community` | "Visual consistency builds trust; your audience needs to recognize you instantly" | "Accessible, readable design is part of the mission — if the layout is confusing or the hierarchy is unclear, people disengage before they understand what you're asking them to do" |

### Do / Avoid

**Proposed change:** Add one narrator-specific do and one narrator-specific don't to the existing style-based rules.

| Narrator | Add: do | Add: don't |
|---|---|---|
| `solo_expert` | "✓ Apply your palette and type consistently to any client-facing documents — proposals and follow-up emails are brand touchpoints too" | "✗ Avoid visual complexity that competes with credibility — the person should be the most recognizable thing, not the layout" |
| `solo_maker` | "✓ Photograph your work with intention — backdrop, lighting direction, and color feel should reflect your style direction every time" | "✗ Avoid overproduced or obviously stock imagery — it erases the handmade signal that makes this kind of brand worth anything" |
| `local_team` | "✓ Use real photos of your space, your team, or your work — that's the differentiator no competitor can copy" | "✗ Avoid generic stock photography that could be any business — customers recognize authenticity and trust it more than polish" |
| `product_led` | "✓ Keep your product the clearest element in every layout — white space and clean backgrounds are not empty space, they are frame" | "✗ Avoid layout clutter that competes with the product — if someone has to work to find what you're selling, you've already lost them" |
| `mission_community` | "✓ Keep hierarchy clear — your most important message should be impossible to miss, even on a quickly scrolled flyer or post" | "✗ Avoid visual styles that look corporate, exclusive, or polished in a way that creates distance from your community" |

---

## Phase 4 — Voice ↔ Visual Bridge (Bidirectional)

**Priority:** Medium-high. The two halves of the kit should reference each other. One bridge sentence per direction.

### Phase 4 checklist

- [x] Style Guide Visual direction: `styleDesc` → bridge (`tonePreset` × `selectedStyle`) → logo paragraph
- [x] Voice Playbook Tone profile: append closing sentence from same 12-way matrix (`voicePlaybookToneVisualClosing`)
- [x] `packages/generation/src/deterministic/voiceVisualBridge.ts` — full 12 × 2 strings; unknown tone/style falls back to `professional` × `clean_minimal`
- [x] Tests: fixture bridges + full grid length smoke

### Style Guide side (Visual direction block)

A computed bridge sentence appended to the `styleDesc` body, separated by a paragraph break. Keyed to `tonePreset` × `selectedStyle` — 12 combinations (3 × 4).

All 12 must be written. Samples below:

| tonePreset | selectedStyle | Bridge sentence |
|---|---|---|
| `friendly` | `clean_minimal` | "A warm, conversational voice and a clean visual direction reinforce each other — the design earns trust through space and simplicity; the words earn it by feeling like a person." |
| `friendly` | `bold_graphic` | "A warm tone balanced against a bold visual direction creates a useful contrast — the design has energy, the words make it feel approachable rather than aggressive." |
| `friendly` | `organic_natural` | "Warmth in both voice and visual direction is a consistent signal — the approachable tone and the handcrafted sensibility say the same thing through two different channels." |
| `friendly` | `luxe_refined` | "A warm voice inside a refined visual system creates welcome tension — the design is restrained, the words are human, and together they feel more accessible than either would alone." |
| `professional` | `clean_minimal` | "A polished voice and a minimal visual direction are natural partners — neither overexplains, and both signal competence through restraint." |
| `professional` | `bold_graphic` | "A direct, confident visual direction and a professional voice make a clear statement together — this is a brand that knows what it's doing and doesn't feel the need to prove it twice." |
| `professional` | `organic_natural` | "A professional voice inside an organic visual system creates a grounded sophistication — the warmth is in the visuals, the precision is in the language." |
| `professional` | `luxe_refined` | "Polished language and a refined visual system signal the same thing without repeating each other — precision in both the words and the design is the brand." |
| `bold` | `clean_minimal` | "A direct voice inside a minimal visual direction keeps the energy focused — there's nothing decorative to distract from the point." |
| `bold` | `bold_graphic` | "A direct, confident voice and a bold visual direction amplify each other — this brand is not subtle, and that is intentional." |
| `bold` | `organic_natural` | "A direct voice and an organic visual direction create productive tension — the words don't hedge, but the visuals feel grounded and human." |
| `bold` | `luxe_refined` | "A confident voice inside a refined visual system is a strong combination — the restraint is in the design; the directness is in the words. Neither softens the other." |

### Voice Playbook side (Tone profile block)

Add one sentence to the end of the Tone Profile paragraph that closes the loop to the visual direction. Keyed to `tonePreset` × `selectedStyle` — same 12 combinations. These should feel like the natural end of the paragraph, not a labeled addition.

Samples:

| tonePreset | selectedStyle | Closing sentence |
|---|---|---|
| `professional` | `luxe_refined` | "Your refined visual direction and polished voice are designed as a pair — when both are applied consistently, the brand signals quality without saying so." |
| `friendly` | `clean_minimal` | "Your clean visual system and warm voice work the same way — the design gets out of the way so the human connection can come through." |
| `bold` | `bold_graphic` | "Your direct voice and bold visual direction make the same statement — consistent application of both is what turns intention into recognition." |
| `friendly` | `bold_graphic` | "Your bold visual direction provides the energy; your warm voice makes it approachable — applied together they are attention-getting without being alienating." |
| `professional` | `organic_natural` | "Your organic visual direction brings the warmth; your professional voice brings the precision — that combination signals credibility without coldness." |

**Implementation note:** The table above showed five Voice Playbook closings as samples; all **12** combinations are implemented in `voiceVisualBridge.ts` (`VOICE_PLAYBOOK_TONE_VISUAL_CLOSING`). The seven not listed here were drafted to match the same voice and pairing logic.

---

## Phase 5 — Stage Signal

**Priority:** Medium. `stage` is one of the most meaningful signals in the intake and it is nearly invisible in the output.

### Phase 5 checklist

- [x] Quick Start Week 1: stage-aware preamble (`StageContext` via `computeBrandProfile`) before existing “Set up your brand on [channel] first.” line
- [x] Style Guide Do / avoid: one stage line after style + narrator rules (`✓` for `starting_fresh` / `building_foundation` / `standardizing`, `✗` for `protecting_recognition`)
- [x] Tests for `growing`, `idea`, and `established` paths

### Quick Start stage framing

Add a stage-aware preamble to the Week 1 header. Currently: "Set up your brand on [channel] first." Becomes stage-aware:

| StageContext | Week 1 preamble |
|---|---|
| `starting_fresh` | "You are building from scratch — that's an advantage. Start with one channel, do it right, and the rest can follow what you establish here." |
| `building_foundation` | "Your business exists; now the brand needs to catch up. Start with the channel where the most customers find you first." |
| `standardizing` | "You've got presence across channels — the job now is to make them feel like the same brand. Start where the gap is most visible." |
| `protecting_recognition` | "There's equity in what you've already built. Week 1 is about auditing for consistency, not starting over." |

### Do / Avoid stage bullet

Add one stage-aware bullet to the Do / Avoid section (the fifth bullet — one do or one don't depending on stage):

| StageContext | Bullet |
|---|---|
| `starting_fresh` | "✓ Start with one thing done consistently rather than five things done partially — a small brand that looks the same everywhere is more recognizable than a bigger brand that looks different on every platform" |
| `building_foundation` | "✓ Don't wait for everything to be perfect before putting the brand into market — consistency at 80% quality is more valuable than perfection that keeps getting pushed" |
| `standardizing` | "✓ Audit before you expand — make sure the channels you already have reflect your direction before adding new ones" |
| `protecting_recognition` | "✗ Avoid changes that read as a restart rather than an evolution — customers who already know you should recognize the brand after an update, not feel like they found a different company" |

---

## Phase 6 — Quick Start Full Touchpoint Awareness

**Priority:** Medium. Week 3 currently treats all brands identically. The other weeks are already reasonably narrator-aware.

### Phase 6 checklist

- [x] `week3Items` selects copy from `computeBrandProfile(form).touchpointCluster`
- [x] Five static lists (`physical_first`, `social_product`, `social_service`, `local_community`, `digital_brand`) matching this spec
- [x] Tests covering all five clusters (fixture `social_service` plus overrides for the other four)

### Week 3 (Visual rollout) by touchpoint cluster

**`physical_first`:**
- "Apply your palette to any printed materials you currently hand out — business cards, stickers, packaging inserts. Even one element updated consistently makes a difference."
- "Create a simple branded template for social posts using your palette and style direction — this becomes the pattern everything else follows."
- "Audit your storefront, vehicle, or any physical space customers encounter — does it reflect your palette and style direction?"
- "Check that your profile photo or avatar feels consistent with your visual direction across every platform where customers look you up."
- "Review any photos you've posted recently — do they feel like they came from the same brand?"

**`social_product`:**
- "Update your Instagram profile image, bio cover, and highlight icons to reflect your palette."
- "Create a simple branded post template using your palette and style direction — apply it to your next three posts before you evaluate whether it's working."
- "Check that your product photography feels consistent — does the backdrop and lighting match your style direction?"
- "Apply your palette to any packaging or label elements you control — labels, tissue paper, inserts, shipping stickers."
- "Audit your shop banner and listing images — do they feel like they came from the same brand?"

**`social_service`:**
- "Update your LinkedIn cover image with your palette colors — it is the largest branded canvas most professional services brands have."
- "Check that your website homepage reflects your palette — the hero section especially."
- "Create or update a simple branded slide template for any presentations or proposals you send."
- "Audit your profile image across every platform where clients find you — it should feel consistent with your visual direction."
- "Review 5 recent posts or pieces of content — do they feel visually consistent?"

**`local_community`:**
- "Update your Google Business profile cover photo with an image that reflects your palette and style direction."
- "Create a simple branded template for event flyers or social posts — even a basic Canva template with your colors is better than starting from scratch every time."
- "Check that your Facebook cover image and profile photo feel consistent with each other and with your visual direction."
- "Review any print materials you currently distribute — do they reflect your palette and style direction?"
- "Audit your Instagram or Facebook feed — does the visual feel consistent from post to post?"

**`digital_brand`:**
- "Audit your website homepage — does the hero section reflect your palette and style direction clearly?"
- "Create or update a branded post template for Instagram using your palette and style."
- "Check that your product or service imagery reflects your visual direction — backdrop, lighting mood, and color feel."
- "Review your email header or newsletter template — does it match your palette?"
- "Audit your social profiles for visual consistency — profile images, covers, and recent posts should feel like the same brand."

---

## Phase 7 — Industry Verbiage Layer

**Priority:** Medium-high in terms of output quality; medium in terms of effort. This phase is the largest single implementation task in the refactor.

### What exists today

`OUTPUT_TRANSLATION_SPEC.md §6` fully specifies the `industryProfile` schema with `preferred_terms`, `avoid_terms`, `compliance_flags`, and `tone_modifiers`. The spec names six priority industries to implement first. **None of it is implemented.** Industry currently affects only the Brand Brief overview line and one sentence in Messaging Themes.

### What this phase delivers

An `industryProfile` lookup table, implemented in `coreAssembly.ts` or a new `industryProfiles.ts`, that injects:

1. **Preferred vocabulary** into Messaging Themes and Sample Phrases — the words a customer in this industry actually uses rather than generic language
2. **Avoid terms** into the Voice Playbook QA gate — particularly compliance-relevant (health claims, legal promises, financial guarantees)
3. **Tone modifier** into the Tone Profile closing sentence — an industry-appropriate framing of what "consistent tone" means in practice

### Implementation priority

Start with the six industries named in the spec (`creative_services`, `consulting_coaching`, `health_wellness`, `legal_professional_services`, `technology`, `retail`), then `food_beverage`, `fitness_sports`, and `beauty_personal_care` as the next tier, then the remainder.

### Industry vocabulary examples (to write during implementation)

**`health_wellness`:**
- Prefer: "client outcomes," "well-being," "support," "evidence-based," "sustainable"
- Avoid: "cure," "instant results," "guaranteed," "fix"
- Tone modifier: "In health and wellness especially, credibility comes from specificity — what you help people achieve, not how fast."

**`food_beverage`:**
- Prefer: "ingredients," "made fresh," "sourced," "seasonal," "batch," "from scratch"
- Avoid: "processed," "mass-produced" (if artisan positioning), "industrial"
- Tone modifier: "Food brands earn trust through transparency — what's in it, where it came from, how it was made."

**`legal_professional_services`:**
- Prefer: "counsel," "representation," "guidance," "experience," "results"
- Avoid: "guarantee," "promise," "win," "no risk"
- Compliance flag: no outcome guarantees in any copy
- Tone modifier: "Legal brands build trust through precision — clear language, verifiable credentials, and the absence of hype."

**`fitness_sports`:**
- Prefer: "progress," "commitment," "results," "training," "community," "strength"
- Avoid: "transformation" as a weight-loss promise, "guaranteed results"
- Tone modifier: "Fitness brands are most credible when they show real people doing real work — energy is the voice, consistency is the message."

---

## Phase 8 — Before/After Examples + Imagery Direction (Future)

**Priority:** Lower — meaningful improvements, not blockers.

### Voice Playbook before/after examples

Currently: the Voice Playbook gives guardrails and sample phrases. Missing: concrete rewrites that show a customer what their voice looks and doesn't look like.

Each Voice Playbook should include two before/after pairs:
- One sentence rewritten from generic to on-brand
- One caption or post hook rewritten to match the tone profile

These are high-effort to generate deterministically and high-quality when done well — strong candidate for `ai_enhanced` mode in Pro, with a simpler template version in Core.

**Core template approach:** two static "Before/After" pairs keyed to `tonePreset`, with the business name inserted. Generic but directional.

**Example for `friendly` tone:**
- Before: "We are excited to announce our new service offering."
- After (with business name): "Here's something worth your attention — [businessName] just added [offer], and it's exactly what we've heard you asking for."

### Imagery direction

Currently: style do/avoid has one photography bullet per style. Should become a short imagery direction paragraph after Do/Avoid, keyed to `selectedStyle` and informed by `touchpointCluster`.

This paragraph answers: what should photographs of or for this brand look, feel, and be composed like? Not technique instructions — aesthetic direction.

---

## What NOT to Change

- **The narrator model** — well-built. `NarratorProfile` is the right foundation; everything here builds on top of it.
- **The Brand Brief** — the best-personalized section in the kit. Ordering, emphasis, and anchor sentence are solid.
- **Voice Playbook guardrails and sample phrases** — narrator-driven and working well; Phase 7 adds vocabulary without restructuring.
- **New intake fields** — this entire refactor computes from existing signals. No new required fields for Phases 1–6.
- **The palette and style visual descriptions** (`paletteDescriptions`, `styleDescriptions`) — deliberately editorial and global. They name the aesthetic; they don't need to also prescribe application.
- **PDF layout** — primary focus remains content and logic, but **targeted layout changes are in scope** when they improve scanability (see Phase 2 checklist: Palette / Visual direction / Typography grouping). Avoid unrelated visual redesign.

---

## Implementation Phase Summary

| Phase | Focus | Priority | Effort | New intake needed? |
|---|---|---|---|---|
| 1 | Synthesis layer + typography coherence + embedded font disclaimers | Highest | Medium | No |
| 2 | Color application system + logo / mark strategy | High | Low-Medium | No |
| 3 | Style Guide cross-section (style principles + do/avoid) | High | Low | No |
| 4 | Voice ↔ Visual bridge (bidirectional) | Medium-High | Low | No |
| 5 | Stage signal (Quick Start + do/avoid stage bullet) | Medium | Low | No |
| 6 | Quick Start full touchpoint awareness | Medium | Low | No |
| 7 | Industry verbiage layer | Medium-High | High | No |
| 8 | Before/after examples + imagery direction | Lower | Medium-High | No |

---

## What This Looks Like End-to-End (Food Brand Example)

**Scenario:** Playful food brand, founder story is central.

**Intake:** `industry: food_beverage`, `brandNarrator: solo_maker`, `selectedStyle: organic_natural`, `tonePreset: friendly`, `stage: new`

**Computed profile:**
- `touchpointCluster: physical_first` (food_beverage industry override)
- `typographyContext: physical_and_digital`
- `stageContext: building_foundation`

**Style Guide — Palette section:**
Earthy warmth swatches, then:
> "Your creamy off-white is your primary surface — the open space that lets the warmer tones breathe. Terracotta and caramel take turns as supporting and accent depending on how saturated you want a piece to feel: lean on the warmer terracotta for moments that need to pop, caramel for warmth without loudness. Keep the neutral dominant — earthy palettes lose their feeling the moment everything is saturated."

**Style Guide — Visual direction section:**
Existing organic_natural description, then bridge sentence:
> "Warmth in both voice and visual direction is a consistent signal — the approachable tone and the handcrafted sensibility say the same thing through two different channels."

Then, logo strategy note:
> "You don't need a custom mark to have a professional brand. Your business name set consistently in your primary typeface is a wordmark — and it is often more legible and versatile than a symbol, especially at the scale small businesses actually print and post things. When you're ready to work with a designer, everything in this Style Guide gives them exactly what they need."

**Style Guide — Typography section lead:**
> "This direction calls for a warmer, more humanist face — Nunito Sans and Fraunces are strong fits. The blocks below use Inter and Source Serif 4 as embedded stand-ins so you can see the weight and role split; apply the same primary/supporting logic with your chosen faces. If Inter and Source Serif 4 feel right for now, they're a clean starting point."

**Style Guide — Serif specimen blurb (context: physical_and_digital):**
> "Source Serif 4 gives artisan products a crafted, intentional feeling — especially in regular weight on a label or menu header. This is your founder-voice face: where the story lives, the serif shows up. The bold cut works for short display moments; avoid it at very small print sizes where it can feel heavy."

**Bold row, serif specimen:**
> "At sign scale, bold Source Serif 4 is a clean, readable wordmark starting point. Test your business name at large size before committing to anything more complex."

**Style Guide — Licensing:**
> "Both fonts are free via Google Fonts. For packaging and labels, download the files directly — don't rely on a browser or app to serve them, because the rendered version may differ from what you approved."

**Style Guide — Style Principles (organic_natural + solo_maker):**
- "Imperfection is intentional — it signals handmade care"
- "Natural textures and materials should feel at home in your imagery"
- "Warmth and approachability win over polish"
- "Your visual style should make people feel the care in what you make" *(narrator addition 1)*
- "The same template energy that works in a grid post should carry through to your packaging, labels, and any materials someone holds in their hands" *(narrator addition 2, touchpoint-keyed)*

**Style Guide — Do / Avoid (organic_natural + solo_maker additions):**
- ✓ "Photograph your work with intention — backdrop, lighting direction, and color feel should reflect your style direction every time"
- ✗ "Avoid overproduced or obviously stock imagery — it erases the handmade signal that makes this kind of brand worth anything"

**Voice Playbook — Tone Profile closing:**
> "Whether it's an Etsy listing, an Instagram post, or a packaging insert, the tone should feel consistent and recognizable as the same business every time. Your organic visual direction brings the warmth; your approachable voice reinforces it — together they signal a brand that's made by a real person who cares about what they're putting into the world."

**Quick Start — Week 1 preamble:**
> "Your business exists; now the brand needs to catch up. Start with the channel where the most customers find you first."

**Quick Start — Week 3 (physical_first cluster):**
- "Apply your palette to any printed materials you hand out — labels, inserts, stickers. Even one element updated consistently makes a difference."
- "Create a simple branded template for social posts using your palette and style direction."
- "Audit your packaging and product photography — does the backdrop and lighting feel consistent with your style direction?"
- "Check that your profile photo or avatar feels consistent with your visual direction across every platform where customers look you up."
- "Review any photos you've posted recently — do they feel like they came from the same brand?"

---

Compare this to the current output, which is word-for-word identical for a technology consulting firm that picked the same palette and style. The food brand and the consultant were always different customers. After these phases, the kit tells them that.

---

## Tone and Framing Principles for All Copy in This Refactor

These govern every new blurb, lead, bridge sentence, and guidance note written during implementation.

1. **Talk to one person, not a persona.** Say "your label" not "labels in this category." Say "your business name on a sign" not "signage applications."

2. **Name the concrete thing, not the abstract category.** "An Instagram post" not "social media." "A proposal" not "professional materials." "A product label" not "physical touchpoints."

3. **Answer the real question first.** Most customers reading the Typography section are asking "Is this right for me?" Answer that in the first sentence. Most customers reading the Palette section are asking "How do I use this?" Answer that in the first line after the swatches.

4. **No jargon without translation.** "Serif" and "sans" are fine — they're visible on the page. "Display type," "weight hierarchy," "typographic system" — replace or define.

5. **Avoid team/agency language.** "Your team," "across your organization," "brand guidelines" → "your materials," "everywhere you show up," "this kit."

6. **Keep it conversational but not casual.** The target register is `professional` at warmth 60/100. Not stiff. Not breezy. A knowledgeable person talking directly to someone they're trying to help.

7. **Be specific or be quiet.** A generic "use this for everything" is better than a wrong specific. If you can't name the actual use case, don't name one.

8. **Earn the reassurance, don't just offer it.** "You don't need a custom logo mark to have a professional brand" is only true if what follows makes a real case. Don't use reassuring language as a shortcut for reasoning.

9. **Respect the customer's intelligence.** They know their business. The copy should help them apply expertise they already have, not explain things they already understand.
