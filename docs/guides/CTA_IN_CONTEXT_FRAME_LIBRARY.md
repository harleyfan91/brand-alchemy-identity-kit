# CTA in-context frame library (Brand Identity Guide PDF)

Normative playbook for **vector “in context” shells** around folio 05 surface CTAs: what we imitate, what we never do, naming, mapping, QA, and how to add a frame without drifting.

**Code:** [`packages/generation/src/pdf/ctaFrames/`](../../packages/generation/src/pdf/ctaFrames/)  
**Scaffold:** `npm run new-cta-frame -- --id=my_frame_v1` (from `packages/generation`)  
**Browser preview:** [`packages/generation/dev/cta-frames/README.md`](../../packages/generation/dev/cta-frames/README.md) (`npm run dev:cta-frames`)  
**Product spec cross-link:** [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A (Examples / CTAs)

---

## North star: social families we imitate

We are **not** building a client-facing explainer card. We are building a **silent skeleton of one feed-style post**: the same *kinds* of regions a reader would see in a real app (avatar, name row, optional subline chrome, media block, **one** caption body, action affordances), with **generic** strokes and grays only.

- **In scope:** One continuous **caption** as a single paste field. The model may still emit **up to two strings** in `GuideCtaSurfaceBlock.lines`; the frame **must** merge them into **one** `Text` node using a **single space** (never `\n\n` for merge). That matches one caption field on the relevant surface.
- **In scope:** **Which channels the copy targets** is communicated by the **folio nested module label** (same string as `presentation.platformSummary`). The **card does not** repeat platform explainer copy inside the shell.
- **Important:** `platformSummary` can list **multiple** networks (e.g. LinkedIn and Instagram), but `frameId` represents one social family at a time.

Current social frame families:
- `social_feed_v1` — feed post shell (horizontal feed media or compact square feed media via `socialFeedVariant`).
- `social_story_v1` — 9:16 story shell (no feed action bar).
- `social_reel_cover_v1` — 9:16 reel/short-video cover shell (with short footer chrome).
- `social_grid_photo_v1` — square-first grid-photo shell (fuller photo area).

Out of scope: DMs inbox, ads manager, or pixel-perfect clones of trademarked UIs.

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
| **`presentation` extras (`social`)** | `platformSummary` = nested module label (which channels were picked). `socialSurfaceFamily` chooses feed/story/reel/grid. `socialFeedVariant` applies only when `frameId === social_feed_v1` (feed-specific media silhouette). |
| **Renderer** | React PDF (`@react-pdf/renderer`) only; **PNG/SVG underlays** optional later—still no PSD in repo for runtime. |

`frameId` values are enumerated in [`packages/generation/src/pdf/ctaFrames/types.ts`](../../packages/generation/src/pdf/ctaFrames/types.ts) as `CtaFrameId`.

### Social frame footprints (normative, pt)

Constants live in [`socialFeedLayout.ts`](../../packages/generation/src/pdf/ctaFrames/socialFeedLayout.ts) (import in the frame and in the dev explorer so numbers stay aligned).

| Element | Measurement |
|---------|-------------|
| Post card | `social_feed_v1`: **`width: '100%'`** of the nested module (feed-family wide shell). `social_story_v1` / `social_reel_cover_v1` / `social_grid_photo_v1`: fixed **mobile-like shell widths** (`SOCIAL_STORY_CARD_WIDTH_PT`, `SOCIAL_REEL_CARD_WIDTH_PT`, `SOCIAL_GRID_CARD_WIDTH_PT`), centered. |
| `social_feed_v1` (`professional_network_feed`) | **~1.91:1** horizontal slot: fixed `SOCIAL_PRO_MEDIA_WIDTH_PT` × `SOCIAL_PRO_MEDIA_HEIGHT_PT`, centered. |
| `social_feed_v1` (`creator_visual_feed`) | **1:1** compact square slot: `SOCIAL_CREATOR_MEDIA_PT` × `SOCIAL_CREATOR_MEDIA_PT`, centered. |
| `social_story_v1` | **9:16** vertical media: `SOCIAL_VERTICAL_MEDIA_WIDTH_PT` × `SOCIAL_VERTICAL_MEDIA_HEIGHT_PT`, centered. |
| `social_reel_cover_v1` | Same **9:16** vertical media + fixed reel footer `SOCIAL_REEL_FOOTER_HEIGHT_PT`. |
| `social_grid_photo_v1` | **1:1** square-first media (same `SOCIAL_CREATOR_MEDIA_PT`), centered, with feed action row. |

**Pagination:** If you change these constants, re-run `core-pdfs` Brand Identity Guide page-count tests.

---

## Expansion matrix (surface × tone → frame)

| Surface (`GuideCtaSurfaceId`) | `socialTone` | `frameId` | Status |
|-------------------------------|--------------|-----------|--------|
| `social` | first social id = `linkedin` | `social_feed_v1` | **Shipped (v0)** — `professional_network_feed` geometry |
| `social` | first social id = `facebook` | `social_story_v1` | **Shipped (v0)** — 9:16 story shell |
| `social` | first social id = `tiktok` / `youtube` | `social_reel_cover_v1` | **Shipped (v0)** — 9:16 reel/shorts shell |
| `social` | first social id = `instagram` / `pinterest` / `threads` | `social_grid_photo_v1` | **Shipped (v0)** — square-first grid shell |
| `email` | n/a | *(none)* | Use `GuideListBlock` until `email_snippet_v1` |
| `website` | n/a | *(none)* | List fallback |
| `marketplace` | n/a | *(none)* | List fallback |
| `directory` | n/a | *(none)* | List fallback |

### Planned follow-ups (repeat scaffold + matrix row)

1. `email_snippet_v1` — inbox / message chrome for `email` surface.
2. `social_pro_card_v1` — wider “professional post” card for advanced LinkedIn variants.
3. `marketplace_listing_v1` — product-card/listing chrome for marketplace surfaces.

Each addition: run `new-cta-frame`, implement component, register in [`registry.tsx`](../../packages/generation/src/pdf/ctaFrames/registry.tsx), extend [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts), add tests, update this matrix + OUTPUT_TRANSLATION_SPEC §10A.6A.

---

## Engineering workflow

1. **Scaffold** — `npm run new-cta-frame -- --id=foo_bar_v1` (creates `src/pdf/ctaFrames/frames/<id>.tsx` if you use the script; you may instead add `src/pdf/ctaFrames/<Name>Frame.tsx` by hand next to `SocialFeedCardFrame.tsx` if you prefer).
2. **Implement** — Fill the component; follow **Hard guardrails** and **Anti-patterns** above.
3. **Register** — [`registry.tsx`](../../packages/generation/src/pdf/ctaFrames/registry.tsx) switch + [`types.ts`](../../packages/generation/src/pdf/ctaFrames/types.ts) `CTA_FRAME_IDS` / `isCtaFrameId` / `GuideCtaPresentation` if new props.
4. **Map** — [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts) (pure; no imports from `brandIdentityGuideModel.ts` to avoid cycles).
5. **Model** — [`composeCtaSurfaceBlocks`](../../packages/generation/src/deterministic/brandIdentityGuideModel.ts) attaches `presentation` (`frameId` plus surface-specific fields). Social nested **label** uses the same touchpoint labels as `platformSummary`.
6. **PDF** — [`CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx) calls `renderCtaFrame`; falls back to `GuideListBlock` when `frameId` missing or unregistered.
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
- [ ] **Page budget** — `core-pdfs` Brand Identity Guide fixture still meets the expected **page count** (no accidental +1 page from `wrap={false}` or oversized blocks).
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
