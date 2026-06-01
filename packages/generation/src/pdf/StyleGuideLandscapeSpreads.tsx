import type { IdentityKitForm } from '@identity-kit/shared'

import type { KitContentBlock } from '../deterministic/depthDocCommon.js'
import {
  StyleGuideImageryApplicationDeckContent,
  StyleGuidePaletteDeckContent,
  StyleGuidePrinciplesGuardrailsDeckContent,
  StyleGuideTypographyPairingDeckContent,
  StyleGuideVisualDirectionDeckContent,
  getLandscapeDeckStyles,
  homeColor,
  type KitPdfTier,
} from './CoreKitDocuments.js'
import { DeckPage, DeckReaderFraming } from './LandscapeDeckLayout.js'
import { styleGuideNavItems } from './landscapeDeckNav.js'
import type { StyleGuideVisualReferenceModel } from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { StyleGuideVisualReferencePages } from './VisualReferenceSpread.js'

/** Core Style Guide landscape spreads before Pro moodboard folios. */
export const CORE_STYLE_GUIDE_SPREAD_COUNT = 5

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
  visualReferenceModel,
}: {
  form: IdentityKitForm
  blocks: KitContentBlock[]
  tier: KitPdfTier
  /** Fulfillment output, QA scaffold, or null to omit Pro visual reference folios. */
  visualReferenceModel?: StyleGuideVisualReferenceModel | null
}) {
  const S = getLandscapeDeckStyles()
  const color = homeColor(form.step6.selectedPalette, 'styleGuide')
  const businessName = form.step1.businessName
  const kitRef = optionalBlock(blocks, 'How this document relates to your kit')
  const palette = blockByHeading(blocks, 'Palette')
  const visualDirection = blockByHeading(blocks, 'Visual direction')
  const stylePrinciples = blockByHeading(blocks, 'Style principles')
  const doAvoid = blockByHeading(blocks, 'Do / avoid')
  const imagery = blockByHeading(blocks, 'Imagery direction')
  const visualApplication = blockByHeading(blocks, 'Visual application')
  const includeVisualReference = tier === 'pro' && visualReferenceModel != null
  const navItems = styleGuideNavItems(includeVisualReference)
  const docTitle = 'Brand Style Guide'

  return (
    <>
      <DeckPage
        styles={S}
        docTitle={docTitle}
        businessName={businessName}
        folio={padFolio(1)}
        spreadTitle="Your colors"
        navItems={navItems}
        activeNavId="colors"
      >
        {kitRef ? <DeckReaderFraming styles={S} body={kitRef.body} /> : null}
        <StyleGuidePaletteDeckContent styles={S} palette={form.step6.selectedPalette} body={palette.body} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle={docTitle}
        businessName={businessName}
        folio={padFolio(2)}
        spreadTitle="Visual direction"
        navItems={navItems}
        activeNavId="direction"
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
        docTitle={docTitle}
        businessName={businessName}
        folio={padFolio(3)}
        spreadTitle="Typography"
        navItems={navItems}
        activeNavId="typography"
      >
        <StyleGuideTypographyPairingDeckContent styles={S} form={form} color={color} />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle={docTitle}
        businessName={businessName}
        folio={padFolio(4)}
        spreadTitle="Principles & guardrails"
        navItems={navItems}
        activeNavId="principles"
      >
        <StyleGuidePrinciplesGuardrailsDeckContent
          styles={S}
          principlesBody={stylePrinciples.body}
          doAvoidBody={doAvoid.body}
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle={docTitle}
        businessName={businessName}
        folio={padFolio(5)}
        spreadTitle="Imagery & application"
        navItems={navItems}
        activeNavId="imagery"
      >
        <StyleGuideImageryApplicationDeckContent
          styles={S}
          imageryBody={imagery.body}
          applicationBody={visualApplication.body}
          showVisualReferenceNote={tier === 'pro' && visualReferenceModel != null}
          visualReferenceFolio={
            tier === 'pro' && visualReferenceModel != null ? padFolio(CORE_STYLE_GUIDE_SPREAD_COUNT + 1) : undefined
          }
        />
      </DeckPage>

      <StyleGuideVisualReferencePages
        form={form}
        tier={tier}
        folioOffset={CORE_STYLE_GUIDE_SPREAD_COUNT}
        model={visualReferenceModel}
        docTitle={docTitle}
        navItems={navItems}
      />
    </>
  )
}
