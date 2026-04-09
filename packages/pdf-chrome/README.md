# `@identity-kit/pdf-chrome`

Shared **Brand Alchemy** PDF chrome for `@react-pdf/renderer`: Inter + Source Serif 4 registration, footer (symbol strip + wordmark), layout metrics, and fixed neutrals for body copy.

## Install

In a monorepo workspace or app that generates PDFs:

```bash
npm install @identity-kit/pdf-chrome @react-pdf/renderer react
```

### Asset dependency (symbol strip PNG)

This package resolves `alchemy-symbol-strip.png` from **`@identity-kit/brand-assets`** via `require.resolve`. Add that package alongside this one (same version / workspace link as in Identity Kit):

```bash
npm install @identity-kit/brand-assets
```

If `brand-assets` is missing, the footer still renders the **BRAND ALCHEMY** wordmark; the horizontal symbol strip is omitted.

## Usage

You can either import React-PDF directly from `@react-pdf/renderer`, or use the optional single-import surface from this package.

```ts
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
  registerBrandPdfFonts,
  pdfPageBottomPadding,
  PageFooterChrome,
} from '@identity-kit/pdf-chrome'
```

1. **Register fonts once** before any `renderToBuffer` / `pdf()` call (idempotent):

   ```ts
   import { registerBrandPdfFonts } from '@identity-kit/pdf-chrome'

   registerBrandPdfFonts()
   ```

2. **Reserve bottom space** so body content does not run under the fixed footer. Set each `Page` bottom padding to the shared metric (or use the alias):

   ```ts
   import { FOOTER_CHROME_HEIGHT, pdfPageBottomPadding } from '@identity-kit/pdf-chrome'

   const pageStyle = { paddingBottom: pdfPageBottomPadding } // same as FOOTER_CHROME_HEIGHT
   ```

3. **Render the footer** inside each page (sibling to flowing content):

   ```tsx
   import { PageFooterChrome } from '@identity-kit/pdf-chrome'

   <Page size="LETTER" style={pageStyle}>
     {/* body */}
     <PageFooterChrome />
   </Page>
   ```

   `BrandPdfFooter` is an alias for `PageFooterChrome`.

4. **Neutrals** for Inter/Source Serif body copy (not customer palette colors):

   ```ts
   import { BRAND_PDF_COLORS } from '@identity-kit/pdf-chrome'
   // BRAND_PDF_COLORS.black, .bodyText, .subText, .wordmarkGray
   ```

## Public API

| Export | Purpose |
|--------|---------|
| `registerBrandPdfFonts()` | Register Inter + Source Serif 4 (WOFF latin subsets from `@fontsource/*`). |
| `Document`, `Page`, `Text`, `View`, `Image`, `Link`, `StyleSheet`, `Font`, `renderToBuffer` | Re-exported React-PDF primitives/helpers for one-package imports. |
| `PageFooterChrome` / `BrandPdfFooter` | Fixed footer: symbol strip PNG + “BRAND ALCHEMY”. |
| `FOOTER_CHROME_HEIGHT`, `pdfPageBottomPadding` | Bottom padding for `Page` when footer is fixed. |
| `brandPdfFooterMetrics` | Object bundling strip/wordmark spacing numbers. |
| `BRAND_PDF_COLORS` | Fixed neutrals for PDF typography chrome. |
| `resolveBrandSymbolStripPngPath()` | Absolute path to strip PNG or `null` (advanced). |

## Migration from inlined `CoreKitDocuments` (Identity Kit)

**Removed** from `packages/generation/src/pdf/CoreKitDocuments.tsx`:

- Side-effect import of `./registerKitPdfFonts.js`
- `createRequire` block resolving `@identity-kit/brand-assets/alchemy-symbol-strip.png`
- Local `BRAND` literal and footer metric constants (`FOOTER_*`)
- `StyleSheet` entries `footerBrandRow`, `footerBrandText`, `footerStripWrap`, `footerStripImage`
- Local `PageFooterChrome` function component

**Replaced with:**

```ts
import { BRAND_PDF_COLORS, FOOTER_CHROME_HEIGHT, PageFooterChrome } from '@identity-kit/pdf-chrome'

const BRAND = BRAND_PDF_COLORS
```

Font registration moved to `renderCoreKitPdfs()` via `registerBrandPdfFonts()`.

## Publishing / consuming outside this repo

- **Workspace:** `packages/pdf-chrome` — package name `@identity-kit/pdf-chrome`.
- **npm / git:** Point your app’s `package.json` at the published tarball or git URL for this package; keep `@identity-kit/brand-assets` as a sibling dependency for the strip PNG.
