import { Text, View } from '@react-pdf/renderer'
import { Document, Page } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'
import { PageFooterChrome } from '@identity-kit/pdf-chrome'

import { buildStrategyMemoPdfModel } from '../deterministic/strategyMemoScaffolds.js'
import { buildVoicePlaybookPage3Model } from '../deterministic/voicePlaybookPage3Scaffolds.js'
import {
  CspCaptionListBlock,
  CspCtaSurfaceGroupsBlock,
  CspProseSectionBlock,
} from './CspPdfBlocks.js'
import type { CoreKitPdfStyles, KitPdfTier } from './CoreKitDocuments.js'
import { getLandscapeDeckStyles, homeColor, getKitPdfStyles, wholeWordHyphenation } from './CoreKitDocuments.js'
import {
  DeckCard,
  DeckMessagingHierarchy,
  DeckOpenModule,
  DeckPage,
  DeckRoadmapSpread,
  DeckThreeColumnRow,
  DeckTwoColumnSpread,
  TensionPairBlock,
} from './LandscapeDeckLayout.js'

function ProKitNavHeader({
  styles: S,
  activeDocId,
  palette,
  tier,
}: {
  styles: CoreKitPdfStyles
  activeDocId: 'styleGuide' | 'voicePlaybook'
  palette: string
  tier: KitPdfTier
}) {
  return (
    <View style={S.headerChrome} fixed>
      <View style={{ height: 28, backgroundColor: homeColor(palette, activeDocId), opacity: 0.15 }} />
    </View>
  )
}

function onColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55 ? '#FFFFFF' : '#111111'
}

export function BrandStrategyMemoDocument({ form }: { form: IdentityKitForm }) {
  const S = getLandscapeDeckStyles()
  const model = buildStrategyMemoPdfModel(form)
  const name = form.step1.businessName

  return (
    <Document>
      <DeckPage
        styles={S}
        docTitle="Brand Strategy Memo"
        businessName={name}
        folio="01"
        spreadTitle="Brand archetype & jobs-to-be-done"
        framing={model.readerFraming}
      >
        <DeckTwoColumnSpread
          styles={S}
          left={
            <DeckOpenModule styles={S} label="Brand archetype">
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                {model.archetype.body}
              </Text>
            </DeckOpenModule>
          }
          right={
            <DeckOpenModule styles={S} label="Jobs-to-be-done">
              <DeckThreeColumnRow styles={S} columns={model.jtbd.map((d) => ({ headline: d.label, body: d.body }))} />
            </DeckOpenModule>
          }
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Strategy Memo"
        businessName={name}
        folio="02"
        spreadTitle="Audience & tensions"
      >
        <DeckTwoColumnSpread
          styles={S}
          left={
            <DeckOpenModule styles={S} label="Behavioral audience">
              <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                {model.behavioralAudience.body}
              </Text>
            </DeckOpenModule>
          }
          right={
            model.tensions.length > 0 ? (
              <View style={S.guidePanelStack}>
                {model.tensions.map((pair, index) => (
                  <View key={index}>
                    {index > 0 ? <View style={S.guidePanelStackGap} /> : null}
                    <TensionPairBlock styles={S} pair={pair} />
                  </View>
                ))}
              </View>
            ) : (
              <DeckCard styles={S} label="Strategic tension">
                <Text style={S.guideCardBody}>[No surfaced tensions]</Text>
              </DeckCard>
            )
          }
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Strategy Memo"
        businessName={name}
        folio="03"
        spreadTitle="Angle & messaging"
      >
        <DeckTwoColumnSpread
          styles={S}
          left={
            <DeckOpenModule styles={S} label="Contrarian angle">
              <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { fontWeight: 600, marginBottom: 6 }]}>
                {model.contrarianAngle.lead}
              </Text>
              {model.contrarianAngle.body !== model.contrarianAngle.lead ? (
                <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
                  {model.contrarianAngle.body.slice(model.contrarianAngle.lead.length).trim()}
                </Text>
              ) : null}
            </DeckOpenModule>
          }
          right={
            <DeckOpenModule styles={S} label="Messaging hierarchy">
              <DeckMessagingHierarchy
                styles={S}
                valueProp={model.messagingHierarchy.valueProp}
                pillars={model.messagingHierarchy.pillars}
                primaryMessage={model.messagingHierarchy.primaryMessage}
              />
            </DeckOpenModule>
          }
        />
      </DeckPage>

      <DeckPage
        styles={S}
        docTitle="Brand Strategy Memo"
        businessName={name}
        folio="04"
        spreadTitle="90-day roadmap"
      >
        <DeckRoadmapSpread styles={S} roadmap={model.roadmap} narrative={model.narrative} />
      </DeckPage>
    </Document>
  )
}

export { StyleGuideVisualReferencePages } from './VisualReferenceSpread.js'

/** Voice Playbook page 3 (Pro extensions). */
export function VoicePlaybookProPage3({
  form,
  styles: S,
  color,
  tier,
  palette,
}: {
  form: IdentityKitForm
  styles: CoreKitPdfStyles
  color: string
  tier: KitPdfTier
  palette: string
}) {
  if (tier !== 'pro') return null

  const model = buildVoicePlaybookPage3Model(form)

  return (
    <Page size="LETTER" style={S.page}>
      <ProKitNavHeader styles={S} activeDocId="voicePlaybook" palette={palette} tier={tier} />
      <View style={{ marginTop: 28 }}>
      <CspProseSectionBlock styles={S} heading={model.kitRef.heading} body={model.kitRef.body} color={color} />
      {model.emailTemplates.map((template) => (
        <View key={template.name}>
          <View style={[S.sectionBand, { backgroundColor: color }]}>
            <Text style={[S.sectionBandLabel, { color: onColor(color) }]}>
              {`EMAIL — ${template.name}`.toUpperCase()}
            </Text>
          </View>
          <View style={S.sectionBody}>
            <Text style={[S.bulletGroupLabel, { marginBottom: 4 }]}>Subject</Text>
            <Text style={[S.sectionBodyText, { marginBottom: 10 }]}>{template.subject}</Text>
            <Text style={[S.bulletGroupLabel, { marginBottom: 4 }]}>Body</Text>
            <Text style={S.sectionBodyText}>{template.body}</Text>
          </View>
        </View>
      ))}
      <View>
        <View style={[S.sectionBand, { backgroundColor: color }]}>
          <Text style={[S.sectionBandLabel, { color: onColor(color) }]}>BEFORE / AFTER REWRITES</Text>
        </View>
        <View style={S.sectionBody}>
          {model.beforeAfter.map((pair, i) => (
            <View key={i} style={{ marginBottom: 12 }}>
              <Text style={[S.bulletGroupLabel, { marginBottom: 4 }]}>{`Pair ${i + 1}`}</Text>
              <Text style={[S.sectionBodyText, { marginBottom: 4 }]}>
                <Text style={{ fontWeight: 700 }}>Before: </Text>
                {pair.before}
              </Text>
              <Text style={S.sectionBodyText}>
                <Text style={{ fontWeight: 700 }}>After: </Text>
                {pair.after}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <CspCtaSurfaceGroupsBlock
        styles={S}
        cta={
          model.ctaGroups.length > 0
            ? { kind: 'surfaces', groups: model.ctaGroups }
            : { kind: 'pending' }
        }
        color={color}
      />
      </View>
      <PageFooterChrome />
    </Page>
  )
}
