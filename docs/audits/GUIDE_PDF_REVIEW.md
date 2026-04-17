# How to review Brand Identity Guide updates

Use this when you want a **clear** read on whether work changed **layout**, **copy length**, or **what was removed**.

## 1. Regenerate sample PDFs (visual)

From the repo root:

```bash
npm run generate:pdfs
npm run generate:pdfs -- coffee-founder
npm run generate:pdfs -- established-pro
```

Artifacts (gitignored):

- `packages/generation/output/<persona>/05-brand-identity-guide.pdf` — **this is the main visual review file** (landscape, five pages).
- Same folder: `01`–`04` core kit PDFs if you need cross-document context.

**What to look for visually**

| Page (folio) | What usually changes when we “edit harder” |
|--------------|---------------------------------------------|
| 01 Summary | Trait count, differentiator line present/absent, quote rail density |
| 02 Positioning | Subtitle (dek) on/off when story is omitted; rail vs hero balance |
| 03 Voice | Fewer rules or angles (shorter columns) when `contentDensityBias` is sparse |
| 04 Examples | Fewer sample lines; before/after block replaced by gray “figure” mat when pairs drop |
| 05 Look | Mostly stable unless model trims bullets or palette block |

## 2. Diff the review snapshot (content / structure)

Each run also writes:

- `packages/generation/output/<persona>/guide-review-snapshot.json`

It is a **stable JSON summary**: list **counts**, **flags** (e.g. story on/off), **signals** (emphasis, density bias), and **text lengths** for long fields. When we shorten or remove model output, **counts** and **flags** usually move first; **textLengths** catch prose compression.

**Before / after a branch or commit**

```bash
cp packages/generation/output/default/guide-review-snapshot.json /tmp/guide-snapshot-before.json
# …checkout other branch or pull…
npm run generate:pdfs
diff /tmp/guide-snapshot-before.json packages/generation/output/default/guide-review-snapshot.json
```

Or use your editor’s diff on the two files.

**Quick interpret guide**

- `counts.samplePhrases` or `counts.beforeAfterPairs` dropped → examples page should look emptier or use the fallback mat.
- `flags.hasStoryNote` false → positioning page loses the deck subtitle path (check page 02).
- `signals.contentDensityBias` moved −1 / +1 → expect voice list caps and sample caps to follow (see `OUTPUT_TRANSLATION_SPEC.md` §10A.5–10A.6).

## 3. Automated guard

Generation tests still assert **five pages** for the default fixture PDF. That does not replace your eyeball pass; it only catches catastrophic overflow.

---

**Summary:** Open **`05-brand-identity-guide.pdf`** for visual truth; diff **`guide-review-snapshot.json`** for structured proof that content was shortened, removed, or reweighted.
