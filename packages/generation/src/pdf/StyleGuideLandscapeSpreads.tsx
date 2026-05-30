import type { IdentityKitForm } from '@identity-kit/shared'

import type { KitContentBlock } from '../deterministic/depthDocCommon.js'
import {
  StyleGuideImageryApplicationDeckContent,
  StyleGuidePaletteDeckContent,
  StyleGuidePrinciplesGuardrailsDeckContent,
  StyleGuideTypographyPairingDeckContent,
  StyleGuideTypographyUsageDeckContent,
  StyleGuideVisualDirectionDeckContent,
  getLandscapeDeckStyles,
  homeColor,
  type KitPdfTier,
} from './CoreKitDocuments.js'
import { DeckPage, DeckReaderFraming } from './LandscapeDeckLayout.js'
import type { VisualReferencePhotoCount } from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { StyleGuideVisualReferencePages } from './VisualReferenceSpread.js'

/** Core Style Guide landscape spreads before Pro moodboard folios. */
export const CORE_STYLE_GUIDE_SPREAD_COUNT = 6

function padFolio(n: number): string {
  return String(n).padStart(2, '0')
}

function blockByHeading(blocks: KitContentBlock[], heading: string): KitContentBlock {
  const block = blocks.find((b) => b.heading === heading)
  if (!block) {
    throw new Error(`Style Guide missing block: ${heading}`)
  }
  return block
}

function optionalBlock(blocks: KitContentBlock[], heading: string): KitContentBlock | undefined {
  return blocks.find((b) => b.heading === heading)
}

export function StyleGuideLandscapeSpreads({
  form,
  blocks,
  tier,
  visualReferencePhotoCount,
}: {
  form: IdentityKitForm
  blocks: KitContentBlock[]
  tier: KitPdfTier
  /** Pro visual reference layout tier (6 / 8 / 9 bank photos). Defaults to 9. */
  visualReferencePhotoCount?: VisualReferencePhotoCount
}) {
  const S = getLandscapeDeckStyles()
  const color = homeColor(form.step6.selectedPalette, 'styleGuide')
  const businessName = form.step1.businessName
  const kitRef = optionalBlock(blocks, 'How this document relates to your kit')
  const palette = blockByHeading(blocks, 'Palette')
  const visualDirection = blockByHeading(blocks, 'Visual direction')
  const typography = blockByHeading(blocks, 'Typography')
  const stylePrinciples = blockByHeading(blocks, 'Style principles')
  const doAvoid = blockByHeading(blocks, 'Do / avoid')
  const imagery = blockByHeading(blocks, 'Imagery direction')
  const visualApplication = blockByHeading(blocks, 'Visual application')

  return (
    <>
      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(1)}
        spreadTitle="Your colors"
      >
        {kitRef ? <DeckReaderFraming styles={S} body={kitRef.body} /> : null}
        <StyleGuidePaletteDeckContent styles={S} palette={form.step6.selectedPalette} body={palette.body} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(2)}
        spreadTitle="Visual direction"
      >
        <StyleGuideVisualDirectionDeckContent
          styles={S}
          body={visualDirection.body}
          color={color}
          form={form}
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(3)}
        spreadTitle="Typography — pairing"
      >
        <StyleGuideTypographyPairingDeckContent styles={S} form={form} color={color} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(4)}
        spreadTitle="Typography — usage"
      >
        <StyleGuideTypographyUsageDeckContent styles={S} body={typography.body} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(5)}
        spreadTitle="Principles & guardrails"
      >
        <StyleGuidePrinciplesGuardrailsDeckContent
          styles={S}
          principlesBody={stylePrinciples.body}
          doAvoidBody={doAvoid.body}
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Style Guide"
        businessName={businessName}
        folio={padFolio(6)}
        spreadTitle="Imagery & application"
      >
        <StyleGuideImageryApplicationDeckContent
          styles={S}
          imageryBody={imagery.body}
          applicationBody={visualApplication.body}
        />
      </DeckPage>

      <StyleGuideVisualReferencePages
        form={form}
        tier={tier}
        folioOffset={CORE_STYLE_GUIDE_SPREAD_COUNT}
        visualReferencePhotoCount={visualReferencePhotoCount}
      />
    </>
  )
}
