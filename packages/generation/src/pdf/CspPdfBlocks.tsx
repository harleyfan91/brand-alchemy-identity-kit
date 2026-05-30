import { Text, View } from '@react-pdf/renderer'

import {
  CSP_CTA_INTENT_LABELS,
  type ContentStarterPdfModel,
  type CspCtaSurfaceGroup,
  type CspOneLinerOption,
} from '../deterministic/contentStarterPdfModel.js'
import type { CoreKitPdfStyles } from './CoreKitDocuments.js'

function onColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.55 ? '#FFFFFF' : '#111111'
}

function CspSectionBand({
  styles: S,
  heading,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  color: string
}) {
  const textColor = onColor(color)
  return (
    <View style={[S.sectionBand, { backgroundColor: color }]}>
      <Text style={[S.sectionBandLabel, { color: textColor }]}>{heading.toUpperCase()}</Text>
    </View>
  )
}

function CspQuietSubhead({ styles: S, label }: { styles: CoreKitPdfStyles; label: string }) {
  return (
    <Text style={[S.bulletGroupLabel, { marginTop: 10, marginBottom: 6 }]}>{label.toUpperCase()}</Text>
  )
}

function CspProseBlock({ styles: S, text }: { styles: CoreKitPdfStyles; text: string }) {
  return <Text style={S.sectionBodyText}>{text}</Text>
}

function CspKitRefBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading={heading} color={color} />
      <View style={S.sectionBody}>
        <CspProseBlock styles={S} text={body} />
      </View>
    </View>
  )
}

export function CspOneLinerOptionsBlock({
  styles: S,
  options,
  color,
}: {
  styles: CoreKitPdfStyles
  options: CspOneLinerOption[]
  color: string
}) {
  return (
    <>
      {options.map((option) => (
        <View key={option.angle} style={S.phraseCalloutRow}>
          <View style={[S.phraseCalloutBorder, { backgroundColor: color }]} />
          <View style={{ flex: 1 }}>
            <Text style={S.bulletGroupLabel}>{option.label.toUpperCase()}</Text>
            <Text style={[S.sectionBodyText, { fontWeight: 400 }]}>{option.text}</Text>
          </View>
        </View>
      ))}
    </>
  )
}

export function CspBrandSummariesBlock({
  styles: S,
  summaries,
  color,
}: {
  styles: CoreKitPdfStyles
  summaries: ContentStarterPdfModel['summaries']
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading="Brand summaries" color={color} />
      <View style={S.sectionBody}>
        <CspOneLinerOptionsBlock styles={S} options={summaries.oneLiners} color={color} />
        <CspQuietSubhead styles={S} label="Elevator pitch" />
        <CspProseBlock styles={S} text={summaries.elevator} />
        <CspQuietSubhead styles={S} label="Brand paragraph" />
        <CspProseBlock styles={S} text={summaries.paragraph} />
      </View>
    </View>
  )
}

export function CspHomepageRoutesBlock({
  styles: S,
  routes,
  color,
}: {
  styles: CoreKitPdfStyles
  routes: ContentStarterPdfModel['homepage']['routes']
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading="Homepage messaging" color={color} />
      <View style={S.sectionBody}>
        {routes.map((route, index) => (
          <View key={index} style={{ marginBottom: index < routes.length - 1 ? 12 : 0 }}>
            <Text style={S.bulletGroupLabel}>{`Route ${index + 1}`}</Text>
            <Text style={[S.sectionBodyText, { fontWeight: 600, marginBottom: 4 }]}>{route.headline}</Text>
            <Text style={S.sectionBodyText}>{route.subhead}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export function CspProseSectionBlock({
  styles: S,
  heading,
  body,
  color,
}: {
  styles: CoreKitPdfStyles
  heading: string
  body: string
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading={heading} color={color} />
      <View style={S.sectionBody}>
        <CspProseBlock styles={S} text={body} />
      </View>
    </View>
  )
}

export function CspCaptionListBlock({
  styles: S,
  captions,
  color,
}: {
  styles: CoreKitPdfStyles
  captions: string[]
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading="Caption starters" color={color} />
      <View style={S.sectionBody}>
        {captions.map((caption, index) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Text style={[S.sectionBodyText, { width: 12, flexShrink: 0 }]}>•</Text>
            <Text style={[S.sectionBodyText, { flex: 1 }]}>{caption}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export function CspPillarCardBlock({
  styles: S,
  pillar,
  accentColor,
}: {
  styles: CoreKitPdfStyles
  pillar: ContentStarterPdfModel['pillars'][number]
  accentColor: string
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[S.sectionBodyText, { fontWeight: 700, marginBottom: 4 }]}>{pillar.name}</Text>
      <Text style={[S.sectionBodyText, { marginBottom: 6 }]}>{pillar.oneLine}</Text>
      {pillar.prompts.map((prompt, index) => (
        <View key={index} style={{ flexDirection: 'row', marginBottom: 4, paddingLeft: 4 }}>
          <View style={{ width: 2, backgroundColor: accentColor, marginRight: 8, flexShrink: 0 }} />
          <Text style={[S.sectionBodyText, { flex: 1, fontSize: 9.5 }]}>{prompt}</Text>
        </View>
      ))}
    </View>
  )
}

export function CspContentPillarsBlock({
  styles: S,
  pillars,
  color,
}: {
  styles: CoreKitPdfStyles
  pillars: ContentStarterPdfModel['pillars']
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading="Content pillars" color={color} />
      <View style={S.sectionBody}>
        {pillars.map((pillar) => (
          <CspPillarCardBlock key={pillar.name} styles={S} pillar={pillar} accentColor={color} />
        ))}
      </View>
    </View>
  )
}

function CspCtaSurfaceGroupView({
  styles: S,
  group,
  color,
}: {
  styles: CoreKitPdfStyles
  group: CspCtaSurfaceGroup
  color: string
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[S.bulletGroupLabel, { marginBottom: 6 }]}>{group.surfaceLabel.toUpperCase()}</Text>
      <View style={[S.phraseCalloutRow, { marginBottom: 8 }]}>
        <View style={[S.phraseCalloutBorder, { backgroundColor: color }]} />
        <View style={{ flex: 1 }}>
          <Text style={[S.bulletGroupLabel, { marginBottom: 4 }]}>Anchor</Text>
          <Text style={[S.sectionBodyText, { fontWeight: 600 }]}>{group.anchorCta}</Text>
        </View>
      </View>
      {group.variations.length === 0 ? (
        <Text style={[S.sectionBodyText, { fontSize: 9, marginTop: 4, fontStyle: 'italic' }]}>
          Pro fulfillment adds 3–4 alternative phrasings per intent (shared with Voice Playbook page 3).
        </Text>
      ) : (
        group.variations.map((variation, index) => (
          <View key={index} style={S.kvRow}>
            <Text style={S.kvLabel}>{CSP_CTA_INTENT_LABELS[variation.intent]}</Text>
            <Text style={S.kvValue}>{variation.text}</Text>
          </View>
        ))
      )}
    </View>
  )
}

export function CspCtaSurfaceGroupsBlock({
  styles: S,
  cta,
  color,
}: {
  styles: CoreKitPdfStyles
  cta: ContentStarterPdfModel['cta']
  color: string
}) {
  return (
    <View>
      <CspSectionBand styles={S} heading="Calls to action" color={color} />
      <View style={S.sectionBody}>
        {cta.kind === 'pending' ? (
          <CspProseBlock
            styles={S}
            text={
              'Your anchor CTAs are in the Brand Identity Guide → Examples. ' +
              'Pro fulfillment adds alternative phrasings per channel (shared with Voice Playbook page 3).'
            }
          />
        ) : (
          cta.groups.map((group) => (
            <CspCtaSurfaceGroupView key={group.surfaceLabel} styles={S} group={group} color={color} />
          ))
        )}
      </View>
    </View>
  )
}

export function ContentStarterPage1Body({
  styles: S,
  model,
  color,
}: {
  styles: CoreKitPdfStyles
  model: ContentStarterPdfModel
  color: string
}) {
  return (
    <>
      <CspKitRefBlock
        styles={S}
        heading={model.kitRef.heading}
        body={model.kitRef.body}
        color={color}
      />
      <CspBrandSummariesBlock styles={S} summaries={model.summaries} color={color} />
      <CspHomepageRoutesBlock styles={S} routes={model.homepage.routes} color={color} />
    </>
  )
}

export function ContentStarterPage2Body({
  styles: S,
  model,
  color,
}: {
  styles: CoreKitPdfStyles
  model: ContentStarterPdfModel
  color: string
}) {
  return (
    <>
      <CspProseSectionBlock styles={S} heading="Short social bio" body={model.bioShort} color={color} />
      <CspProseSectionBlock styles={S} heading="Long bio / About" body={model.bioLong} color={color} />
      <CspCaptionListBlock styles={S} captions={model.captions} color={color} />
      <CspContentPillarsBlock styles={S} pillars={model.pillars} color={color} />
      <CspCtaSurfaceGroupsBlock styles={S} cta={model.cta} color={color} />
    </>
  )
}
