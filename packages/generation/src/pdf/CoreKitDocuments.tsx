import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { IdentityKitForm } from '@identity-kit/shared'

import {
  brandBriefBlocks,
  quickStartBlocks,
  styleGuideBlocks,
  voicePlaybookBlocks,
} from '../deterministic/coreAssembly.js'

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 18, marginBottom: 16, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 12 },
  h: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  p: { lineHeight: 1.4 },
})

function SectionedPage({
  title,
  blocks,
}: {
  title: string
  blocks: { heading: string; body: string }[]
}) {
  return (
    <Page size="LETTER" style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      {blocks.map((b) => (
        <View key={b.heading} style={styles.section} wrap={false}>
          <Text style={styles.h}>{b.heading}</Text>
          <Text style={styles.p}>{b.body}</Text>
        </View>
      ))}
    </Page>
  )
}

export function BrandBriefDocument({ form }: { form: IdentityKitForm }) {
  return (
    <Document>
      <SectionedPage title="Brand Brief" blocks={brandBriefBlocks(form)} />
    </Document>
  )
}

export function StyleGuideDocument({ form }: { form: IdentityKitForm }) {
  return (
    <Document>
      <SectionedPage title="Brand Style Guide" blocks={styleGuideBlocks(form)} />
    </Document>
  )
}

export function VoicePlaybookDocument({ form }: { form: IdentityKitForm }) {
  return (
    <Document>
      <SectionedPage title="Voice & Content Playbook" blocks={voicePlaybookBlocks(form)} />
    </Document>
  )
}

export function QuickStartDocument({ form }: { form: IdentityKitForm }) {
  return (
    <Document>
      <SectionedPage title="30-Day Quick Start Checklist" blocks={quickStartBlocks(form)} />
    </Document>
  )
}
