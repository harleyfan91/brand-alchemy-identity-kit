# CTA in-context frame library (Brand Identity Guide PDF)

Normative playbook for **vector “in context” shells** around folio 05 surface CTAs: naming, mapping, QA, and how to add a frame without reinventing process.

**Code:** [`packages/generation/src/pdf/ctaFrames/`](../../packages/generation/src/pdf/ctaFrames/)  
**Scaffold:** `npm run new-cta-frame -- --id=my_frame_v1` (from `packages/generation`)  
**Product spec cross-link:** [OUTPUT_TRANSLATION_SPEC.md](../../OUTPUT_TRANSLATION_SPEC.md) §10A.6A (Examples / CTAs)

### Dev gallery (web)

In development, run the web app and open **`/?dev=cta-frames`** (or use the link under **Dev only: PDF tooling** on the landing page). That route lazy-loads a full-page `PDFViewer` backed by `CtaFrameDevGalleryDocument` (narrow import `@identity-kit/generation-gallery` so the web bundle does not pull Node-only PDF render entrypoints). Inter is registered in the browser via `apps/web/src/dev/registerCtaGalleryPdfFonts.ts` to match guide weights. Production builds omit that route chunk when `import.meta.env.DEV` is false.

---

## Goals

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
| **Copy slots** | Which `GuideCtaSurfaceBlock.lines` indices map to which UI region (caption vs CTA). Default: line 0 = body, line 1 = primary CTA. |
| **Max density** | Prefer ≤2 lines (matches composer cap). Long `businessName` must ellipsize in the chrome header row. |
| **Renderer** | React PDF (`@react-pdf/renderer`) only; **PNG/SVG underlays** optional later—still no PSD in repo for runtime. |

`frameId` values are enumerated in [`packages/generation/src/pdf/ctaFrames/types.ts`](../../packages/generation/src/pdf/ctaFrames/types.ts) as `CtaFrameId`.

---

## Expansion matrix (surface × tone → frame)

| Surface (`GuideCtaSurfaceId`) | `socialTone` | `frameId` | Status |
|-------------------------------|--------------|-----------|--------|
| `social` | `casual` | `social_feed_v1` | **Shipped (v0)** |
| `social` | `professional` | `social_feed_v1` | **Shipped (v0)** — same shell until `social_pro_card_v1` exists |
| `email` | n/a | *(none)* | Use `GuideListBlock` until `email_snippet_v1` |
| `website` | n/a | *(none)* | List fallback |
| `marketplace` | n/a | *(none)* | List fallback |
| `directory` | n/a | *(none)* | List fallback |

### Planned follow-ups (repeat scaffold + matrix row)

1. `social_story_v1` — 9:16 story-style shell; prefer for casual-only or split A/B by `socialTone` once designed.
2. `email_snippet_v1` — inbox / message chrome for `email` surface.
3. `social_pro_card_v1` — wider “professional post” card when `socialTone === 'professional'`.

Each addition: run `new-cta-frame`, implement component, register in [`registry.tsx`](../../packages/generation/src/pdf/ctaFrames/registry.tsx), extend [`pickPresentation.ts`](../../packages/generation/src/pdf/ctaFrames/pickPresentation.ts), add tests, update this matrix + OUTPUT_TRANSLATION_SPEC.

---

## Engineering workflow

1. **Scaffold** — `npm run new-cta-frame -- --id=foo_bar_v1`
2. **Implement** — fill in the generated `.tsx` under `src/pdf/ctaFrames/frames/`
3. **Register** — `registry.tsx` switch + export `CTA_FRAME_IDS` / `isCtaFrameId` in `types.ts` if new id
4. **Map** — `pickPresentation.ts` (pure; no imports from `brandIdentityGuideModel.ts` to avoid cycles)
5. **Model** — `composeCtaSurfaceBlocks` attaches `presentation: { frameId }` when a frame applies
6. **PDF** — [`CoreKitDocuments.tsx`](../../packages/generation/src/pdf/CoreKitDocuments.tsx) calls `renderCtaFrame`; falls back to `GuideListBlock` when `frameId` missing or unregistered
7. **Tests** — unit test mapping; `core-pdfs` / reader strings as needed
8. **Spec** — OUTPUT_TRANSLATION_SPEC §10A.6A one-line pointer to this doc

---

## QA checklist (per new frame)

- [ ] Long `businessName` (40+ chars) does not overflow header row.
- [ ] Two long CTA lines still readable at print sizes.
- [ ] No banned reader vocabulary (`touchpoint`, `rollout`, etc.).
- [ ] At most **one** em dash per paragraph unit in any **new** strings (prefer `.` / `;` / `,`).
- [ ] No third-party logos or trademarked UI clones.

---

## Scaffold log

_Appended automatically by `npm run new-cta-frame` (manual edits OK)._

- (none yet)


---

## Explicit non-goals (v0)

- No Photoshop smart-object PSD in the runtime path.
- No “official” Instagram / LinkedIn API template pulls.
- No random layout or non-deterministic asset selection.
