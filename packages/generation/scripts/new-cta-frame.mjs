#!/usr/bin/env node
/**
 * Scaffold a new CTA in-context frame stub under src/pdf/ctaFrames/frames/.
 *
 * Usage (from packages/generation):
 *   npm run new-cta-frame -- --id=social_story_v2
 *
 * Appends a checklist line to docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const generationRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(generationRoot, '..', '..')
const framesDir = path.join(generationRoot, 'src', 'pdf', 'ctaFrames', 'frames')
const playbookPath = path.join(repoRoot, 'docs', 'guides', 'CTA_IN_CONTEXT_FRAME_LIBRARY.md')

const argv = process.argv.slice(2)
const idArg = argv.find((a) => a.startsWith('--id='))
const id = idArg?.slice('--id='.length)?.trim()

if (!id) {
  console.error('Usage: npm run new-cta-frame -- --id=my_frame_v1')
  process.exit(1)
}

if (!/^[a-z0-9]+(_[a-z0-9]+)*_v[0-9]+$/.test(id)) {
  console.error('frameId must look like: social_feed_v1 (snake_case + _vN)')
  process.exit(1)
}

fs.mkdirSync(framesDir, { recursive: true })

const componentName = id
  .split('_')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('')

const outFile = path.join(framesDir, `${id}.tsx`)

if (fs.existsSync(outFile)) {
  console.error(`Already exists: ${outFile}`)
  process.exit(1)
}

const stub = `/**
 * ${id} — CTA in-context frame (see docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).
 * TODO: implement layout; register in ctaFrames/registry.tsx and types.ts; map in pickPresentation.ts
 */
import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { CoreKitPdfStyles } from '../../CoreKitDocuments.js'
import type { CtaFrameBaseProps } from '../types.js'

export function ${componentName}Frame(props: CtaFrameBaseProps): ReactElement {
  const { styles: S, businessName, lines, hyphenationCallback } = props
  return (
    <View style={{ borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 8, padding: 10 }}>
      <Text style={S.guideCardLabel}>TODO FRAME ${id}</Text>
      <Text hyphenationCallback={hyphenationCallback} style={S.guideCardBody}>
        {businessName}
      </Text>
      {lines.map((line, i) => (
        <Text key={i} hyphenationCallback={hyphenationCallback} style={S.guideListText}>
          {line}
        </Text>
      ))}
    </View>
  )
}
`

fs.writeFileSync(outFile, stub, 'utf8')
console.log(`Wrote ${path.relative(repoRoot, outFile)}`)

const logLine = `- [ ] Register \`${id}\` in types.ts, registry.tsx, pickPresentation.ts; fill ${path.relative(repoRoot, outFile)}`

if (fs.existsSync(playbookPath)) {
  let md = fs.readFileSync(playbookPath, 'utf8')
  if (md.includes(`\`${id}\``)) {
    console.log('Playbook already mentions', id)
  } else if (md.includes('- (none yet)')) {
    md = md.replace('- (none yet)', logLine)
    fs.writeFileSync(playbookPath, md, 'utf8')
    console.log(`Updated scaffold log in ${path.relative(repoRoot, playbookPath)}`)
  } else {
    md = md.replace(/## Scaffold log\n/, `## Scaffold log\n\n${logLine}\n`)
    fs.writeFileSync(playbookPath, md, 'utf8')
    console.log(`Appended scaffold note to ${path.relative(repoRoot, playbookPath)}`)
  }
} else {
  console.warn('Playbook not found:', playbookPath)
}
