/**
 * One-off generator: reads prescriptive CTA_PHRASE_BANKS.md and emits
 * packages/generation/src/deterministic/ctaPhraseBankPrescriptive.gen.ts
 *
 * Run: node scripts/gen-cta-phrase-banks.mjs
 * Optional: node scripts/gen-cta-phrase-banks.mjs /path/to/alt.md
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const mdPath =
  process.argv[2] || join(root, 'packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md')

let text = readFileSync(mdPath, 'utf8')
// Normalize line endings
text = text.replace(/\r\n/g, '\n')

/** @type {{ surface: string, goal: string | null, industry: string | null, voice: string | null, tuples: [string,string][], triple?: string[] }[]} */
const chunks = []

function normIndustry(id) {
  if (!id) return id
  const s = String(id).replace(/\s+/g, '_').toLowerCase()
  return s === 'professional_svc' ? 'regulated_services' : s
}

let surface = 'website'
let goal = null
let industry = null
/** When set, one code block is duplicated for each industry (shared ### heading with `/`). */
let industryExpansion = null
let voice = null
let narrator = null
let inCode = false
let codeBuf = []

function flushCode() {
  if (!inCode || codeBuf.length === 0) return
  const block = codeBuf.join('\n')
  codeBuf = []
  inCode = false
  const tuples = []
  for (const line of block.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('//')) continue
    const s = t.endsWith(',') ? t.slice(0, -1) : t
    if (!s.startsWith('[')) continue
    try {
      const parsed = JSON.parse(
        s
          .replace(/\u2019/g, "'")
          .replace(/\u201c|\u201d/g, '"')
          .replace(/ — /g, ' \u2014 ')
          .replace(/'/g, "'"),
      )
      if (Array.isArray(parsed) && parsed.length >= 2 && typeof parsed[0] === 'string') {
        tuples.push([parsed[0], parsed[1] ?? ''])
      }
    } catch {
      try {
        // eslint-disable-next-line no-eval -- build script only
        const parsed = (0, eval)(`(${s})`)
        if (Array.isArray(parsed) && parsed.length >= 2) tuples.push([String(parsed[0]), String(parsed[1] ?? '')])
      } catch {
        console.warn('skip line', s.slice(0, 80))
      }
    }
  }
  if (tuples.length > 0) {
    const targets = industryExpansion?.length ? industryExpansion : [industry]
    for (const ind of targets) {
      chunks.push({ surface, goal, industry: normIndustry(ind), voice, narrator, tuples })
    }
  }
}

for (const line of text.split('\n')) {
  const L = line.trimEnd()

  if (L.startsWith('# SURFACE:')) {
    flushCode()
    const rest = L.replace(/^# SURFACE:\s*/, '').trim()
    if (rest.startsWith('WEBSITE')) surface = 'website'
    else if (rest.startsWith('EMAIL')) surface = 'email'
    else if (rest.includes('SOCIAL') && rest.includes('Casual')) surface = 'social_casual'
    else if (rest.includes('LinkedIn') || rest.includes('Professional')) surface = 'social_linkedin'
    else if (rest.includes('Google Business') || rest.includes('directory_post_offer')) surface = 'directory_google'
    else if (rest.includes('Yelp') || rest.includes('TripAdvisor')) surface = 'directory_yelp'
    else if (rest.startsWith('MARKETPLACE')) surface = 'marketplace'
    else surface = rest.toLowerCase().replace(/\s+/g, '_')
    goal = null
    industry = null
    voice = null
    continue
  }

  if (L.startsWith('# `ctaTemplates`') || L.includes('`ctaTemplates` — Three')) {
    flushCode()
    surface = 'cta_templates'
    goal = null
    industry = null
    voice = null
    narrator = null
    continue
  }

  const ctaSecGoal = L.match(/^## `([^`]+)`\s*$/)
  if (ctaSecGoal && surface === 'cta_templates') {
    flushCode()
    goal = ctaSecGoal[1]
    industry = null
    voice = null
    continue
  }

  const goalM = L.match(/^## Goal:\s*`([^`]+)`/)
  if (goalM) {
    flushCode()
    goal = goalM[1]
    industry = null
    voice = null
    narrator = null
    continue
  }

  const subGoal = L.match(/^## Goal:\s*`([^`]+)`\s+—/)
  if (subGoal) {
    flushCode()
    goal = subGoal[1]
    industry = null
    voice = null
    narrator = null
    continue
  }

  if (/^### /.test(L) && !L.includes('**')) {
    flushCode()
    const name = L.replace(/^###\s*/, '').trim()
    if (name.includes('/')) {
      industryExpansion = name
        .split(/\s*\/\s*/)
        .map((x) => normIndustry(x.replace(/\s+/g, '_').toLowerCase()))
      industry = industryExpansion[0]
    } else {
      industryExpansion = null
      if (name === 'all other industries') industry = 'default'
      else industry = name.replace(/\s+/g, '_').toLowerCase()
    }
    voice = null
    narrator = null
    continue
  }

  const narrM = L.match(/^\*\*narrator:\s*([a-z_]+)\*\*\s*$/i)
  if (narrM) {
    flushCode()
    narrator = narrM[1].toLowerCase()
    continue
  }

  if (L.startsWith('**bold:**')) {
    flushCode()
    voice = 'bold'
    continue
  }
  if (L.startsWith('**friendly:**')) {
    flushCode()
    voice = 'friendly'
    continue
  }
  if (L.startsWith('**professional:**')) {
    flushCode()
    voice = 'professional'
    continue
  }

  if (L.startsWith('```')) {
    if (!inCode) {
      inCode = true
      codeBuf = []
    } else {
      flushCode()
    }
    continue
  }

  if (inCode) {
    codeBuf.push(L)
  }

  // ctaTemplates one-line rows: **trades_home, bold:** `["a","b","c"]`
  const tmpl = L.match(/^\*\*([^*]+)\*\*\s*`([^`]+)`/)
  if (tmpl && surface === 'cta_templates') {
    const header = tmpl[1].trim()
    const tupleStr = tmpl[2]
    const parts = header.split(',').map((s) => s.trim())
    let ind = 'default'
    let vc = 'any'
    if (parts[0]?.toLowerCase() === 'any industry') {
      ind = 'any'
    } else if (parts.length >= 2) {
      ind = parts[0].replace(/\s+/g, '_').toLowerCase()
      const vpart = parts[1].toLowerCase().replace(/:\s*$/, '')
      if (vpart.includes('bold') && vpart.includes('friendly')) vc = 'bold_friendly'
      else if (vpart.includes('friendly') && vpart.includes('professional')) vc = 'friendly_professional'
      else if (vpart === 'bold') vc = 'bold'
      else if (vpart === 'friendly') vc = 'friendly'
      else if (vpart === 'professional') vc = 'professional'
      else if (vpart === 'any') vc = 'any'
    } else if (parts[0]) {
      ind = parts[0].replace(/\s+/g, '_').toLowerCase()
    }
    let triple
    try {
      triple = JSON.parse(tupleStr.replace(/\u2019/g, "'").replace(/\u201c|\u201d/g, '"').replace(/ — /g, ' \u2014 '))
    } catch {
      try {
        triple = (0, eval)(`(${tupleStr})`)
      } catch (e) {
        console.warn('template parse', header, e)
      }
    }
    if (Array.isArray(triple) && triple.length >= 3) {
      chunks.push({
        surface: 'cta_templates',
        goal,
        industry: normIndustry(ind),
        voice: vc,
        tuples: [],
        triple: triple.map(String),
      })
    }
  }
}

flushCode()

const outPath = join(root, 'packages/generation/src/deterministic/ctaPhraseBankPrescriptive.gen.ts')
const header = `/* eslint-disable */
/**
 * AUTO-GENERATED by scripts/gen-cta-phrase-banks.mjs — do not edit by hand.
 * Source: prescriptive CTA_PHRASE_BANKS.md (verbatim strings).
 */
export type PrescriptiveChunk = {
  surface: string
  goal: string | null
  industry: string | null
  voice: string | null
  narrator: string | null
  tuples: Array<[string, string]>
  triple?: readonly string[]
}

export const PRESCRIPTIVE_CTA_CHUNKS: PrescriptiveChunk[] = `

function escStr(s) {
  return JSON.stringify(s)
}

let body = '[\n'
for (const ch of chunks) {
  if (ch.triple) {
    body += `  { surface: ${escStr(ch.surface)}, goal: ${ch.goal == null ? 'null' : escStr(ch.goal)}, industry: ${ch.industry == null ? 'null' : escStr(ch.industry)}, voice: ${ch.voice == null ? 'null' : escStr(ch.voice)}, narrator: ${ch.narrator == null ? 'null' : escStr(ch.narrator)}, tuples: [], triple: ${JSON.stringify(ch.triple)} },\n`
  } else {
    const tup = ch.tuples.map(([a, b]) => `[${escStr(a)}, ${escStr(b)}]`)
    body += `  { surface: ${escStr(ch.surface)}, goal: ${ch.goal == null ? 'null' : escStr(ch.goal)}, industry: ${ch.industry == null ? 'null' : escStr(ch.industry)}, voice: ${ch.voice == null ? 'null' : escStr(ch.voice)}, narrator: ${ch.narrator == null ? 'null' : escStr(ch.narrator)}, tuples: [${tup.join(', ')}] },\n`
  }
}
body += ']\n'

writeFileSync(outPath, header + body + '\n', 'utf8')
console.log('Wrote', outPath, 'chunks', chunks.length)
