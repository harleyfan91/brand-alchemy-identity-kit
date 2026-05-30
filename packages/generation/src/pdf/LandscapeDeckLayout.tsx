import type { ReactNode } from 'react'
import { Page, Text, View } from '@react-pdf/renderer'

import type { TensionPair } from '../deterministic/landscapeDeckTypes.js'
import {
  GuideFigureMat,
  LANDSCAPE_PDF_SIZE,
  wholeWordHyphenation,
  type CoreKitPdfStyles,
} from './CoreKitDocuments.js'

export { LANDSCAPE_PDF_SIZE }

function DeckTopChrome({
  styles: S,
  docTitle,
  businessName,
}: {
  styles: CoreKitPdfStyles
  docTitle: string
  businessName: string
}) {
  return (
    <View style={S.guideTopChrome} fixed>
      <View style={S.guideTopTitleRow}>
        <Text style={S.guideNavItemActive}>{docTitle}</Text>
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideTopBusinessName}>
          {businessName}
        </Text>
      </View>
    </View>
  )
}

function DeckSpreadHeader({
  styles: S,
  folio,
  title,
}: {
  styles: CoreKitPdfStyles
  folio: string
  title: string
}) {
  return (
    <View style={S.guideSpreadHeader}>
      <View style={S.guideFolioRow}>
        <Text style={S.guideFolioNumber}>{folio}</Text>
        <View style={S.guideFolioTitleWrap}>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSpreadTitle}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  )
}

export function DeckReaderFraming({ styles: S, body }: { styles: CoreKitPdfStyles; body: string }) {
  return (
    <View
      style={[
        S.guideCard,
        {
          marginBottom: 14,
          backgroundColor: '#F8FAFC',
          borderColor: '#E4E4E7',
        },
      ]}
    >
      <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { fontStyle: 'italic' }]}>
        {body}
      </Text>
    </View>
  )
}

export function DeckCard({
  styles: S,
  label,
  children,
  tintColor,
  flex,
}: {
  styles: CoreKitPdfStyles
  label?: string
  children: ReactNode
  tintColor?: string
  flex?: number
}) {
  return (
    <View
      style={[
        tintColor ? S.guideTintCard : S.guideCard,
        tintColor ? { backgroundColor: `${tintColor}1F` } : {},
        flex ? { flex } : {},
      ]}
      wrap={false}
    >
      {label ? <Text style={S.guideCardLabel}>{label.toUpperCase()}</Text> : null}
      {children}
    </View>
  )
}

export function DeckOpenModule({
  styles: S,
  label,
  children,
}: {
  styles: CoreKitPdfStyles
  label: string
  children: ReactNode
}) {
  return (
    <View>
      <Text style={S.guideOpenLabel}>{label.toUpperCase()}</Text>
      {children}
    </View>
  )
}

export function DeckThreeColumnRow({
  styles: S,
  columns,
}: {
  styles: CoreKitPdfStyles
  columns: Array<{ headline: string; body: string }>
}) {
  return (
    <View style={S.guideEditorialThreeCol}>
      {columns.map((col, index) => (
        <View key={col.headline} style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch' }}>
          {index > 0 ? (
            <View style={S.guideEditorialRule}>
              <View style={S.guideEditorialRuleLine} />
            </View>
          ) : null}
          <View style={S.guideSampleCol}>
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSampleHeadline}>
              {col.headline}
            </Text>
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideSampleBody}>
              {col.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export function TensionPairBlock({
  styles: S,
  pair,
}: {
  styles: CoreKitPdfStyles
  pair: TensionPair
}) {
  return (
    <DeckCard styles={S} label="Strategic tension">
      <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { marginBottom: 8 }]}>
        {pair.tension}
      </Text>
      <Text style={[S.guideMiniHeader, { marginBottom: 4 }]}>RESOLUTION</Text>
      <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
        {pair.resolution}
      </Text>
    </DeckCard>
  )
}

export function DeckNumberedList({
  styles: S,
  items,
}: {
  styles: CoreKitPdfStyles
  items: string[]
}) {
  return (
    <>
      {items.map((item, index) => (
        <View key={`${index}-${item}`} style={S.guideListItem}>
          <Text style={S.guideListIndex}>{String(index + 1).padStart(2, '0')}</Text>
          <Text hyphenationCallback={wholeWordHyphenation} style={S.guideListText}>
            {item}
          </Text>
        </View>
      ))}
    </>
  )
}

export function DeckTwoColumnSpread({
  styles: S,
  left,
  right,
  leftFlex = 1,
  rightFlex = 1,
}: {
  styles: CoreKitPdfStyles
  left: ReactNode
  right: ReactNode
  leftFlex?: number
  rightFlex?: number
}) {
  return (
    <View style={S.guideColumns}>
      <View style={{ flex: leftFlex }}>{left}</View>
      <View style={S.guideColumnGap} />
      <View style={{ flex: rightFlex }}>{right}</View>
    </View>
  )
}

export function DeckObservationPanel({
  styles: S,
  observations,
}: {
  styles: CoreKitPdfStyles
  observations: Array<{ label: string; body: string }>
}) {
  if (observations.length === 0) {
    return (
      <GuideFigureMat
        styles={S}
        label="Asset observation"
        body="[Scaffold] Upload logo, reference image, hex colors, or a website URL to populate observations."
        tall
      />
    )
  }

  return (
    <View style={S.guidePanelStack}>
      {observations.map((obs, index) => (
        <View key={obs.label}>
          {index > 0 ? <View style={S.guidePanelStackGap} /> : null}
          <GuideFigureMat styles={S} label={obs.label} body={obs.body} />
        </View>
      ))}
    </View>
  )
}

export function DeckMessagingHierarchy({
  styles: S,
  valueProp,
  pillars,
  primaryMessage,
}: {
  styles: CoreKitPdfStyles
  valueProp: string
  pillars: Array<{ label: string; body: string }>
  primaryMessage: string
}) {
  return (
    <View style={S.guidePanelStack}>
      <DeckCard styles={S} label="Value proposition">
        <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
          {valueProp}
        </Text>
      </DeckCard>
      <View style={S.guidePanelStackGap} />
      {pillars.map((pillar) => (
        <View key={pillar.label}>
          <DeckCard styles={S} label={pillar.label}>
            <Text hyphenationCallback={wholeWordHyphenation} style={S.guideCardBody}>
              {pillar.body}
            </Text>
          </DeckCard>
          <View style={S.guidePanelStackGap} />
        </View>
      ))}
      <DeckCard styles={S} label="Primary message">
        <Text hyphenationCallback={wholeWordHyphenation} style={[S.guideCardBody, { fontWeight: 600 }]}>
          {primaryMessage}
        </Text>
      </DeckCard>
    </View>
  )
}

export function DeckPage({
  styles: S,
  docTitle,
  businessName,
  folio,
  spreadTitle,
  framing,
  children,
}: {
  styles: CoreKitPdfStyles
  docTitle: string
  businessName: string
  folio: string
  spreadTitle: string
  framing?: string
  children: ReactNode
}) {
  return (
    <Page size={LANDSCAPE_PDF_SIZE} style={S.guideLandscapePage}>
      <DeckTopChrome styles={S} docTitle={docTitle} businessName={businessName} />
      <View style={S.guideSpread}>
        <DeckSpreadHeader styles={S} folio={folio} title={spreadTitle} />
        {framing ? <DeckReaderFraming styles={S} body={framing} /> : null}
        {children}
      </View>
    </Page>
  )
}
