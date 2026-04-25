# CTA in-context frame library (Brand Identity Guide PDF)

Normative playbook for **vector “in context” shells** around folio 05 surface CTAs: what we imitate, what we never do, naming, mapping, QA, and how to add a frame without drifting.

**Code:** [`packages/generation/src/pdf/ctaFrames/`](../../packages/generation/src/pdf/ctaFrames/)  
**Scaffold:** `npm run new-cta-frame -- --id=my_frame_v1` (from `packages/generation`)  
**Browser preview:** [`packages/generation/dev/cta-frames/README.md`](../../packages/generation/dev/cta-frames/README.md) (`npm run dev:cta-frames`)  
**Product spec cross-link:** [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A (Examples / CTAs). Folio 05 **surface counts and vertical budget**: [Folio 05 layout budget](#folio-05-layout-budget-brand-identity-guide).

---

## North star: channel families we imitate

We are **not** building a client-facing explainer card. We are building a **silent skeleton of one feed-style post**: the same *kinds* of regions a reader would see in a real app (avatar, name row, optional subline chrome, media block, **one** caption body, action affordances), with **generic** strokes and grays only.

- **In scope:** One continuous **caption** as a single paste field. The model may still emit **up to two strings** in `GuideCtaSurfaceBlock.lines`; the frame **must** merge them into **one** `Text` node using a **single space** (never `\n\n` for merge). That matches one caption field on the relevant surface.
- **In scope:** **Which channels the copy targets** is communicated by the **folio nested module label** (same string as `presentation.platformSummary`). The **card does not** repeat platform explainer copy inside the shell.
- **Important:** `platformSummary` can list **multiple** networks (e.g. LinkedIn and Instagram), but `frameId` represents one social family at a time.

Current shipped frame families:
- `email_text_only_v1` — desktop-width text-led email shell.
- `email_image_v1` — desktop-width email shell with hero image slot.
- `marketplace_listing_v1` — generic listing card (square photo, title lines, price and rating, CTA line).
- `directory_post_offer_v1` — local business **post** card: name and time, short headline placeholders, wide photo strip, one merged body, text actions (Call · Directions · Website).
- `directory_sponsored_listing_v1` — **sponsored listing** card: disclosure line, title, rating row, square thumbnail + snippet placeholders, one merged body, primary action chip + secondary text action.
- `social_feed_v1` — feed post shell (horizontal feed media or compact square feed media via `socialFeedVariant`).
- `social_story_v1` — 9:16 story shell (no feed action bar).
- `social_reel_cover_v1` — 9:16 reel/short-video cover shell (with short footer chrome).
- `social_grid_photo_v1` — square-first grid-photo shell (fuller photo area).
- `social_pin_standard_v1` — Pinterest standard pin shell (2:3) with short on-media CTA copy.
- `social_carousel_v1` — 4:5 portrait carousel shell (slide indicators).
- `social_link_preview_v1` — feed post with headline/snippet/thumbnail link card.
- `social_text_only_v1` — text-led social shell with no media slot.
- `website_hero_cta_v1` — homepage or landing hero: title row, hero image band, headline placeholders, merged body, neutral primary chip.

Strategy and platform-by-platform notes live only in [`docs/research/CTA_PLATFORM_MARKETING_SURFACES.md`](../research/CTA_PLATFORM_MARKETING_SURFACES.md). Shipped frame contracts in **this** doc stay **screenshot-level** (what you would point at on a screen), not internal signal names.

Out of scope: ads-manager UIs, inbox-management screens, or pixel-perfect clones of trademarked products.

---

## Hard guardrails (must follow)

1. **Silent shell** — No instructional headings inside the frame (no “PAGE OR PROFILE NAME”, “POST (FEED)”, “SOCIAL POST”, “Where this fits…”, or channel-specific tutorial lines). Chrome is **only** what a real post would show (name, tiny meta, media, caption, icons).
2. **One caption field** — Join `lines` into **one** string for display: trim, collapse internal whitespace, `join(' ')`. Do not render `lines.map` as separate caption blocks. Do not use paragraph breaks between composer lines to “separate” CTAs; that reads as two posts.
3. **No fake truncation** — `businessName` wraps naturally. Do not ellipsize the name to fake a layout.
4. **Pagination** — The Brand Identity Guide must stay on its **contracted page count** (legacy fixture test asserts page count). Avoid `wrap={false}` on tall modules unless you have verified the block always fits the remaining page body; prefer a **compact** shell and/or splittable layout.
5. **No third-party marks** — No Meta, LinkedIn, Google, or other logos; no trademarked UI chrome copied from apps.
6. **Determinism** — `pickCtaFrameId` / presentation mapping is **pure** (no I/O). Same inputs → same `frameId` and `presentation` fields.
7. **Reader vocabulary** — New user-visible strings must pass the same hygiene as the rest of the guide (banned terms list in `core-pdfs.test.ts`, em-dash density rules in OUTPUT_TRANSLATION_SPEC).
8. **Style parity** — Any `S.*` key used in a frame must exist in **`createCoreKitStyles`** in `CoreKitDocuments.tsx` **and** in **`explorerStyles.ts`** for the dev explorer.
9. **Fixed geometry (`social_feed_v1`)** — **Media** slots use **explicit pt width × height** from [`socialFeedLayout.ts`](../../packages/generation/src/pdf/ctaFrames/socialFeedLayout.ts), **centered** in the column, so horizontal vs square aspects never stretch to the wrong silhouette. The post **card** stays **`width: '100%'`** of the Examples column so caption wrapping matches shipped pagination tests.

---

## Anti-patterns we explicitly reject (drift checklist)

| Anti-pattern | Why it fails | Correct approach |
|--------------|--------------|------------------|
| Labels like “CAPTION” / “NEXT STEP” inside the card | Reads as a worksheet, not a post | Remove; use real-post regions only |
| `\n\n` (or multiple `Text`) between `lines[0]` and `lines[1]` | Looks like **two captions** | Single `Text`, `join(' ')` |
| Long “Where this fits: LinkedIn · Instagram…” **inside** the shell | Tutorial noise | Put channel context in the **nested module title** only |
| `wrap={false}` on a tall card “so it stays together” | Can force an **extra PDF page** | Measure against Examples spread; shrink shell or allow wrap |
| Excessive sample `businessName` in dev only “for QA” | Sets wrong visual expectation | Use a realistic short name; long names are still supported via wrap |
| One aspect ratio claimed for “LinkedIn and Instagram” in the same preview | IG grid is **square**; LinkedIn feed image is **wide** | Use **two variants** (see `SocialFeedVariant`) or two dev previews; label copy must match geometry |
| Fixed **narrow** card width in the shipped PDF | Caption wraps more lines and can **add a page** | Keep card **`width: '100%'`**; fix **media** pt only (centered) |

---

## Goals (library-wide)

- Show CTAs **in a recognizable surface context** (feed card, story, email, etc.) using **generic UI** only: no Meta / LinkedIn / Google marks, no PSD at runtime.
- Keep output **deterministic**: mapping from model signals to `frameId` is pure logic, covered by tests.
- Grow **incrementally**: ship one frame + mapping row, then add the next from the expansion matrix.

---

## Frame contract

Each shipped frame has:

| Field | Rule |
|--------|------|
| **`frameId`** | `snake_case` + `_vN` suffix (e.g. `social_feed_v1`). Bump `vN` when layout or copy slots change incompatibly. |
| **Aspect / footprint** | Document intended width behavior (full column vs fixed height) in this file under the frame’s subsection when added. |
| **Copy slots (`social_feed_v1`)** | Up to two composed strings in `lines` → **one caption body** in the PDF: trim, internal whitespace normalized, **`join(' ')`** into a single `Text`. Same semantics as one caption field on a real network. |
| **Max density** | Composer still caps at **≤2** strings per surface (de-dupe, tone). The frame displays them as **one** caption. |
| **`presentation` extras** | Social uses `platformSummary` and `socialSurfaceFamily` (feed/story/reel/grid/pin_standard/carousel/link_preview/text_only), with `socialFeedVariant` only on `social_feed_v1`. Email uses `emailSurfaceFamily` (`text_only`/`image`). Marketplace uses `marketplaceSurfaceFamily: 'listing'`. Directory uses `directorySurfaceFamily`: `post_offer` for `directory_post_offer_v1`, `sponsored_listing` for `directory_sponsored_listing_v1` (machine tags; not rendered in the shell). Website uses `websiteSurfaceFamily: 'hero'` for `website_hero_cta_v1`. |
| **Renderer** | React PDF (`@react-pdf/renderer`) only; **PNG/SVG underlays** optional later—still no PSD in repo for runtime. |

`frameId` values are enumerated in [`packages/generation/src/pdf/ctaFrames/types.ts`](../../packages/generation/src/pdf/ctaFrames/types.ts) as `CtaFrameId`.

### Shipped frame footprints (normative, pt)

Constants live in [`socialFeedLayout.ts`](../../packages/generation/src/pdf/ctaFrames/socialFeedLayout.ts) (import in the frame and in the dev explorer so numbers stay aligned).

| Element | Measurement |
|---------|-------------|
| Post card | `social_feed_v1`: **`width: '100%'`** of the nested module (feed-family wide shell). `social_story_v1` / `social_reel_cover_v1`: **same** outer shell width (`SOCIAL_STORY_CARD_WIDTH_PT` = `SOCIAL_REEL_CARD_WIDTH_PT`). `social_grid_photo_v1`: `SOCIAL_GRID_CARD_WIDTH_PT`, centered. |
| `social_feed_v1` (`professional_network_feed`) | **~1.91:1** horizontal slot: fixed `SOCIAL_PRO_MEDIA_WIDTH_PT` × `SOCIAL_PRO_MEDIA_HEIGHT_PT`, centered. |
| `social_feed_v1` (`creator_visual_feed`) | **1:1** compact square slot: `SOCIAL_CREATOR_MEDIA_PT` × `SOCIAL_CREATOR_MEDIA_PT`, centered. |
| `social_story_v1` | One **full-bleed** canvas `SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT` pt tall × full inner width (`padding: 0`); **no** separate bottom margin. Height equals reel’s **whole** shell (reel 9:16 stage + below-stage actions). Caption `SOCIAL_SHELL_CAPTION_FONT_SIZE_PT`. Shell radius 8 pt (`guideCard`). |
| `social_reel_cover_v1` | **9:16** stage `SOCIAL_VERTICAL_MEDIA_WIDTH_PT` × `SOCIAL_VERTICAL_MEDIA_HEIGHT_PT` + below-stage actions (`SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT`); **same** outer width and **same total height** as story. Caption dock (`SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT`); `SocialActionsRow` inset. Same caption font size as story. |
| `social_grid_photo_v1` | **1:1** square-first media (same `SOCIAL_CREATOR_MEDIA_PT`), centered, with feed action row. |
| `social_pin_standard_v1` | **2:3** standard pin media: `SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT` × `SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT`, with short on-media CTA copy (visual-first, not long directive text). |
| `social_carousel_v1` | **4:5** carousel slide media: `SOCIAL_CAROUSEL_MEDIA_WIDTH_PT` × `SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT`, with slide dots. |
| `social_link_preview_v1` | Feed card with structured link-preview block and thumbnail (`SOCIAL_LINK_PREVIEW_THUMB_PT`). |
| `social_text_only_v1` | Narrow mobile text shell (`SOCIAL_TEXT_ONLY_CARD_WIDTH_PT`) with no media slot. |
| `marketplace_listing_v1` | Generic marketplace listing card with image slot (`MARKETPLACE_LISTING_IMAGE_PT` square), title/meta placeholders, price/rating row, and short CTA line. |
| `email_text_only_v1` | Desktop-width email shell (`EMAIL_CARD_FULL_WIDTH`) with sender/subject/preheader, text skeleton, and CTA row. |
| `email_image_v1` | Desktop-width email shell (`EMAIL_CARD_FULL_WIDTH`) with hero image placeholder (`EMAIL_IMAGE_MEDIA_HEIGHT_PT`) and CTA row. |
| `directory_post_offer_v1` | Full-column card (`EMAIL_CARD_FULL_WIDTH`): business name + time, two gray headline lines, wide image strip (`DIRECTORY_POST_MEDIA_HEIGHT_PT` pt tall), merged body text, then Call · Directions · Website as plain text. |
| `directory_sponsored_listing_v1` | Full-column card (`EMAIL_CARD_FULL_WIDTH`): Sponsored disclosure, title, rating row, square thumb (`DIRECTORY_SPONSORED_THUMB_PT` pt) + three snippet bars, merged body, **Call** chip plus **Website** as secondary text (matches common call-led sponsored rows; live ads vary by platform and advertiser goal). |
| `website_hero_cta_v1` | Full-column shell (`EMAIL_CARD_FULL_WIDTH`): site title row with tiny nav placeholders, hero band (`WEBSITE_HERO_MEDIA_HEIGHT_PT` pt tall), two headline bars, merged body, neutral **View details** chip. |

**Pagination:** If you change these constants, re-run `core-pdfs` Brand Identity Guide page-count tests.

---

## Folio 05 layout budget (Brand Identity Guide)

Normative **counts** and **vertical budget** for the shipped PDF (`BrandIdentityGuideDocument` in [`CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx)), so new frames or copy do not silently blow folio **05** (Examples) off the six-page contract.

### How many nested CTA surfaces (min / max)

| Path | In-context frames shown |
|------|---------------------------|
| **No touchpoints** (`examples.ctaSurfaces` empty) | **0** — folio 05 uses **`examples.ctaTemplates`** only (`GuideListBlock`, no vector shells). |
| **Touchpoints selected** (`examples.ctaSurfaces` non-empty) | **1…N** nested modules under one parent **Calls to action**, each body either **`renderCtaFrame`** (when `presentation.frameId` is set) or a plain list. |

**Hard cap on N** (implemented in [`brandIdentityGuideModel.ts`](../../packages/generation/src/deterministic/brandIdentityGuideModel.ts)):

| `signals.contentDensityBias` | `maxCtaSurfaces` → **maximum** nested surfaces |
|------------------------------|-----------------------------------------------|
| `-1` (sparse) | **2** |
| `0` or `1` | **3** |

`pickSurfaces` orders candidates **website** (from `website` / `blog`) → **email** (`email_newsletter`) → **directory** → **marketplace** → **social**, then **`slice(0, max)`** so high-priority buckets win when the customer selected many channels.

**Fewer than N blocks in practice:** `composeCtaSurfaceBlocks` **skips** a surface if, after de-dupe, **`lines.length === 0`** (`continue`). So the array length is **≤** the cap, not always equal to it. Tests assert `examples.ctaSurfaces.length <= 3` ([`core-pdfs.test.ts`](../../packages/generation/src/core-pdfs.test.ts)).

### Where the stack sits on the page (PDF)

On folio 05, content order is:

1. **Sample lines** (`GuideOpenModule`).
2. **Calls to action** — if `ctaSurfaces.length > 0`: outer module, then **each surface** in a nested `GuideOpenModule` with **`marginTop: 12`** between siblings (first surface has no extra top margin). **16 pt** margin above the whole CTA block from the sample module.
3. **Split rail** — before/after (main) + Do/avoid (side), with **16 pt** top margin from the CTA region.

All of that lives on **one** `GuideSpreadPage` unless react-pdf wraps content to the next page. There is **no** dedicated “reserve this many pt” constant today; height is the **sum of real frame subtrees** plus module chrome.

### Reserving vertical space (what to budget per frame)

Use **footprints** in the table above plus [`socialFeedLayout.ts`](../../packages/generation/src/pdf/ctaFrames/socialFeedLayout.ts). Important magnitudes:

- **Tallest routine family:** **Story** (`social_story_v1`) and **reel** (`social_reel_cover_v1`) share **`SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT`** — the 9:16 **stage** height (`SOCIAL_VERTICAL_MEDIA_HEIGHT_PT`, from `SOCIAL_VERTICAL_MEDIA_WIDTH_PT`) **plus** below-stage chrome (`SOCIAL_STORY_REEL_BELOW_STAGE_TOTAL_PT`). That device column dominates the nested module before captions and card padding.
- **Shorter full-width cards:** **Website hero** (`WEBSITE_HERO_MEDIA_HEIGHT_PT`), **directory post** strip (`DIRECTORY_POST_MEDIA_HEIGHT_PT`), **email image** hero (`EMAIL_IMAGE_MEDIA_HEIGHT_PT` — frame exists; default email routing is still text-first in [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts)).
- **Feed / grid / pin / carousel / link preview / text-only:** see the same footprint table; most are **shorter** than story/reel for the media slot, but caption + action rows still add height.

**Worst-case mental model:** up to **three** nested modules, each potentially **story/reel-class height**, plus **three** module titles, **sample lines**, and the **split rail**. That combination is the stress case for **overflow, awkward page breaks, or +1 page** if frames grow or `wrap={false}` is added carelessly on tall subtrees.

### Product / engineering mitigations (when layout breaks)

Pick one or combine; each should update this doc + §10A.6A after behavior changes:

1. **Page-break policy** — Allow the CTA parent or nested modules to **split across pages** (`wrap` / structure) instead of keeping the entire Examples stack unbreakable.
2. **Continue / second spread** — When `ctaSurfaces.length > 1` **and** any selected `frameId` is in a **tall** family, continue CTAs on a **continuation region** or a second Examples page (IA impact: six-page kit contract).
3. **Density-aware shells** — e.g. a **compact** variant for story/reel when not the only surface (new `frameId` bump or layout branch; must stay deterministic and tested).
4. **Cap surfaces when frames are tall** — tighten `maxCtaSurfaces` or reorder drops when total estimated height exceeds a budget (requires a **pure height estimator** or conservative rule keyed off `frameId`).

### Slot model direction (agreed v1 plan)

For folio 05, move from pure spacing-driven stacking to a **slot-driven layout contract**. This is a plan-level contract for upcoming implementation; current shipped behavior remains the spacing model above until code changes land.

#### 1) Standardized frame size classes (component contract first)

Tag each frame family with one slot class:

| Slot class | Intent | Typical families |
|-----------|--------|------------------|
| `mobile_tall` | Tall phone-like post/reel/story blocks | `social_story_v1`, `social_reel_cover_v1` |
| `desktop_wide` | Full-column, wider cards | `website_hero_cta_v1`, `email_text_only_v1`, `email_image_v1`, `directory_post_offer_v1`, `directory_sponsored_listing_v1` |
| `compact_chip` | Smaller card/chip/listing footprints | `social_pin_standard_v1`, `social_text_only_v1`, `social_link_preview_v1`, `marketplace_listing_v1`, some feed/grid variants if compacted |

If a frame cannot fit one class cleanly, refactor frame geometry before template wiring. This keeps template logic stable.

#### 2) Folio templates (layout composition second)

Provide a small deterministic template set for 1-2 surfaces (with sparse defaults) and 3-surface mixes where room allows.

| Template id (planned) | Slot mix |
|-----------------------|----------|
| `two_mobile` | `mobile_tall + mobile_tall` |
| `mobile_plus_desktop` | `mobile_tall + desktop_wide` |
| `desktop_plus_compact` | `desktop_wide + compact_chip` |
| `single_desktop` | `desktop_wide` only |
| `single_mobile` | `mobile_tall` only |

#### 3) Deterministic selection policy

- Keep `pickSurfaces` as the **surface selection** gate (order + cap).
- Add a pure **template chooser** that consumes selected surfaces + mapped frame families + density.
- If no safe template fits the estimated slot budget, apply deterministic fallback in order: compact variant (if available) -> reduce surface count -> continuation behavior (if product approves).

#### 4) Test and migration guardrails

- Update `core-pdfs` page-count + folio-05-specific layout assertions before enabling slot mode by default.
- Keep `presentation.frameId` behavior deterministic; slot/template metadata should be additive and machine-facing.
- Document every new frame with its slot class in this playbook and keep OUTPUT spec §10A.6A in sync.

**Guardrail:** Hard guardrail §4 (pagination) and `core-pdfs` **page count** assertions apply to the **whole** guide, not per frame — any layout change must re-run those tests.

---

## Expansion matrix (surface × tone → frame)

| Surface (`GuideCtaSurfaceId`) | `socialTone` | `frameId` | Status |
|-------------------------------|--------------|-----------|--------|
| `social` | first social id = `linkedin` | `social_link_preview_v1` | **Shipped (v0)** — professional link-preview style |
| `social` | first social id = `facebook` | `social_story_v1` | **Shipped (v0)** — 9:16 story shell |
| `social` | first social id = `tiktok` / `youtube` | `social_reel_cover_v1` | **Shipped (v0)** — 9:16 reel/shorts shell |
| `social` | first social id = `instagram` | `social_grid_photo_v1` | **Shipped (v0)** — square-first grid shell |
| `social` | first social id = `pinterest` | `social_pin_standard_v1` | **Shipped (v0)** — 2:3 standard pin shell |
| `social` | explicit carousel context | `social_carousel_v1` | **Shipped (v0)** — 4:5 carousel shell (secondary for Pinterest) |
| `social` | first social id = `threads` | `social_text_only_v1` | **Shipped (v0)** — text-led shell |
| `marketplace` | any marketplace touchpoint selected | `marketplace_listing_v1` | **Shipped (v0)** — generic listing card shell |
| `email` | default | `email_text_only_v1` | **Shipped (v0)** — text-led email shell |
| `email` | explicit image-email context (future signal) | `email_image_v1` | **Shipped (v0)** — hero-image email shell |
| `website` | n/a | `website_hero_cta_v1` | **Shipped (v0)** — promotional hero shell |
| `directory` | first directory id = `google_business` / `apple_maps` / `nextdoor` | `directory_post_offer_v1` | **Shipped (v0)** — local post card |
| `directory` | first directory id = `yelp` / `tripadvisor` / `bing_places` | `directory_sponsored_listing_v1` | **Shipped (v0)** — sponsored listing card |

### Planned follow-ups (repeat scaffold + matrix row)

Examples of future rows: explicit signal to prefer `email_image_v1` over `email_text_only_v1`; additional website interior shells beyond hero; social carousel routing when intake encodes explicit carousel context.

Each addition: run `new-cta-frame`, implement component, register in [`registry.tsx`](../../packages/generation/src/pdf/ctaFrames/registry.tsx), extend [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts), add tests, update this matrix + OUTPUT_TRANSLATION_SPEC §10A.6A.

---

## Engineering workflow

1. **Scaffold** — `npm run new-cta-frame -- --id=foo_bar_v1` (creates `src/pdf/ctaFrames/frames/<id>.tsx` if you use the script; you may instead add `src/pdf/ctaFrames/<Name>Frame.tsx` by hand next to `SocialFeedCardFrame.tsx` if you prefer).
2. **Implement** — Fill the component; follow **Hard guardrails** and **Anti-patterns** above.
3. **Register** — [`registry.tsx`](../../packages/generation/src/pdf/ctaFrames/registry.tsx) switch + [`types.ts`](../../packages/generation/src/pdf/ctaFrames/types.ts) `CTA_FRAME_IDS` / `isCtaFrameId` / `GuideCtaPresentation` if new props.
4. **Map** — [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts) (pure; no imports from `brandIdentityGuideModel.ts` to avoid cycles).
5. **Model** — [`composeCtaSurfaceBlocks`](../../packages/generation/src/deterministic/brandIdentityGuideModel.ts) attaches `presentation` (`frameId` plus surface-specific fields). Social nested **label** uses the same touchpoint labels as `platformSummary`.
6. **PDF** — [`CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx) calls `renderCtaFrame`; falls back to `GuideListBlock` when `frameId` missing or unregistered. Folio 05 **stack height** and surface **min/max counts**: [Folio 05 layout budget](#folio-05-layout-budget-brand-identity-guide).
7. **Explorer** — If the frame uses new styles, extend [`explorerStyles.ts`](../../packages/generation/dev/cta-frames/explorerStyles.ts) and document sample props in [`App.tsx`](../../packages/generation/dev/cta-frames/App.tsx).
8. **Tests** — [`pickPresentation.test.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.test.ts) for mapping; [`core-pdfs.test.ts`](../../packages/generation/src/core-pdfs.test.ts) for page count, presentation fields, and reader-string bans.
9. **Spec** — OUTPUT_TRANSLATION_SPEC §10A.6A stays aligned with this doc.

---

## Dev explorer (browser, does not touch shipped PDFs)

From repo root: `npm run dev:cta-frames` (or the same script inside `packages/generation`). Details: [`packages/generation/dev/cta-frames/README.md`](../../packages/generation/dev/cta-frames/README.md).

- **One short `PDFViewer` per `frameId`** so the browser plugin does not shrink a multi-page doc in the iframe.
- **HTML chrome is OK** above the iframe (e.g. “Sample is for: LinkedIn · Instagram”) because that is **dev-only** and does not ship in the PDF.

---

## QA checklist (per new or changed frame)

- [ ] **North star** — Does this still read as the real surface, not a lesson card?
- [ ] **Caption rule** — If multiple `lines`, merged with **`join(' ')`** in **one** `Text`.
- [ ] Long `businessName` (40+ chars) **wraps** in the name row (no fake ellipsis).
- [ ] **Page budget** — `core-pdfs` Brand Identity Guide fixture still meets the expected **page count** (no accidental +1 page from `wrap={false}` or oversized blocks). For folio 05 stacks, check [Folio 05 layout budget](#folio-05-layout-budget-brand-identity-guide) when adding or enlarging frames.
- [ ] Long composed caption still readable at print sizes.
- [ ] No banned reader vocabulary (`touchpoint`, `rollout`, etc.) in any new reader-visible string; include new `presentation` string values in reader-facing scans if they appear in the model.
- [ ] At most **one** em dash per paragraph unit in any **new** strings (prefer `.` / `;` / `,`).
- [ ] No third-party logos or trademarked UI clones.
- [ ] **Explorer parity** — `explorerStyles.ts` updated if new `S.*` keys are used.

---

## Scaffold log

_Appended automatically by `npm run new-cta-frame` (manual edits OK)._

- (none yet)


---

## Explicit non-goals (v0)

- No Photoshop smart-object PSD in the runtime path.
- No “official” Instagram / LinkedIn API template pulls.
- No random layout or non-deterministic asset selection.
