import { Text, View } from '@react-pdf/renderer'

import {
  GuideDoAvoidPanel,
  GuideListBlock,
  wholeWordHyphenation,
  type CoreKitPdfStyles,
} from './CoreKitDocuments.js'
import { DeckOpenModule } from './LandscapeDeckLayout.js'
import { parseBulletLines, parseImageryEditorialBody } from './styleGuideImageryEditorial.js'

/** Folio 05 — editorial imagery principles + application scope (photos on Visual Reference spread). */
export function StyleGuideImageryApplicationDeckContent({
  styles: S,
  imageryBody,
  applicationBody,
  showVisualReferenceNote,
  visualReferenceFolio,
}: {
  styles: CoreKitPdfStyles
  imageryBody: string
  applicationBody: string
  showVisualReferenceNote?: boolean
  /** Folio label for the Visual Reference spread (e.g. "06") when shown on the next page. */
  visualReferenceFolio?: string
}) {
  const { lead, bullets: imageryBullets } = parseImageryEditorialBody(imageryBody)
  const applicationBullets = parseBulletLines(applicationBody)
  const avoidBullets = imageryBullets.filter((line) =>
    /\b(fight|avoid|never|not only|instead of|reads corporate|usually reads)\b/i.test(line),
  )
  const guidanceBullets = imageryBullets.filter((line) => !avoidBullets.includes(line))

  return (
    <View style={S.guideImageryEditorialRoot}>
      <View style={S.guideImageryEditorialRow}>
        <View style={S.guideImageryEditorialColPrimary}>
          <Text style={S.guideImagerySectionHeadline}>Imagery direction</Text>
          {lead ? (
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideImageryLead}>
              {lead}
            </Text>
          ) : null}
          <GuideDoAvoidPanel styles={S} dos={guidanceBullets} avoids={avoidBullets} />
        </View>

        <View style={S.guideImageryEditorialColSecondary}>
          <Text style={S.guideImagerySectionHeadline}>Application</Text>
          <GuideListBlock styles={S} items={applicationBullets} />
          <View style={S.guideImageryEditorialNote}>
            <DeckOpenModule styles={S} label="Photo reference">
              {showVisualReferenceNote && visualReferenceFolio ? (
                <View style={S.guideImageryNextSpreadRow}>
                  <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { flex: 1, paddingRight: 10 }]}>
                    Example photos on the Visual Reference spread.
                  </Text>
                  <View style={S.guideImageryNextSpreadCue}>
                    <Text style={S.guideImageryNextSpreadFolio}>{visualReferenceFolio}</Text>
                    <Text style={S.guideImageryNextSpreadArrow}>→</Text>
                  </View>
                </View>
              ) : (
                <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                  No sample photos here — principles only.
                </Text>
              )}
            </DeckOpenModule>
          </View>
        </View>
      </View>
    </View>
  )
}
