/**
 * Manual finish: Wave G Parts 5–7, Wave D retention gaps, G patches, Wave A B2 in ctaTemplates.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bankPath = join(root, 'packages/generation/dev/cta-phrase-banks/CTA_PHRASE_BANKS.md')
const waveG = readFileSync(join(root, 'packages/generation/dev/cta-phrase-banks/WAVE_G.md'), 'utf8')
const waveD = readFileSync(join(root, 'packages/generation/dev/cta-phrase-banks/WAVE_D.md'), 'utf8')
let bank = readFileSync(bankPath, 'utf8')

function tupleLine([a, b]) {
  return `["${a.replace(/"/g, '\\"')}", "${b.replace(/"/g, '\\"')}"],`
}

function parseIndustryBlock(waveText, headerPattern) {
  const esc = headerPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`### ${esc}\\s*\\n\`\`\`\\n([\\s\\S]*?)\`\`\``, 'm')
  const m = waveText.match(re)
  if (!m) return null
  return m[1]
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function buildIndustrySection(industry, lines) {
  return `\n### ${industry}\n\n\`\`\`\n${lines.join('\n')}\n\`\`\`\n`
}

// Part 5 — Google Business lead_gen per-industry
const gbLeadGen = bank.indexOf('## Goal: `lead_gen` — Google Business Directory')
if (gbLeadGen >= 0) {
  const goalEnd = bank.indexOf('# SURFACE: DIRECTORY — Yelp', gbLeadGen)
  const section = bank.slice(gbLeadGen, goalEnd)
  if (!section.includes('### trades_home\n')) {
    const industries = [
      'trades_home',
      'food_hospitality',
      'retail_maker',
      'health_wellness',
      'creative_pro',
      'professional_svc',
      'community',
    ]
    let insert = '\n'
    for (const ind of industries) {
      const lines = parseIndustryBlock(waveG, ind)
      if (lines?.length) insert += buildIndustrySection(ind, lines)
    }
    insert +=
      '\n### all other industries (catch-all — unmapped industries only)\n\n```\n' +
      section.match(/```\n([\s\S]*?)```/)?.[1]?.trim() +
      '\n```\n'
    const oldBlock = section.match(/```\n[\s\S]*?```/)?.[0] || ''
    const newSection = section.replace(oldBlock, insert.trim() + '\n')
    bank = bank.slice(0, gbLeadGen) + newSection + bank.slice(goalEnd)
    console.log('G Part 5: Google Business lead_gen per-industry')
  }
}

// Part 7 — ctaTemplates retention triplets
const retAny = '**any industry:** `["Pick up where we left off.", "See what\'s new since your last visit.", "Come back and let\'s continue."]`'
const triplets = []
const triRe = /^\*\*([^,]+), any:\*\* `(\[[^\`]+\])`/gm
let tm
while ((tm = triRe.exec(waveG)) !== null) {
  if (tm[1].includes('industry')) continue
  triplets.push(`**${tm[1].trim()}, any:** ${tm[2]}\n`)
}
if (bank.includes(retAny) && triplets.length) {
  bank = bank.replace(retAny, triplets.join('') + '\n' + retAny)
  console.log('G Part 7: retention triplets', triplets.length)
}

// G patches
bank = bank.replace('"this page is worth following."', '"this page is relevant to your work."')
bank = bank.replace('"Find something worth keeping."', '"Find something you\'ll actually keep."')
bank = bank.replace(
  '"We post when we have something worth sharing."',
  '"We post when we have something to say."',
)
console.log('G patches applied')

// Wave A B2 in ctaTemplates (restored tail may have old string)
bank = bank.replace(
  '["Book a free intro session.", "Tell us your goals.", "No commitment to get started."]',
  '["Book a free intro session.", "Tell us your goals.", "No commitment required."]',
)

// Wave D retention — append to social casual if ### exists with only 3 pairs
const socRet = bank.indexOf('## Goal: `retention` — Social Casual')
if (socRet >= 0) {
  const goalEnd = bank.indexOf('# SURFACE: SOCIAL — Professional', socRet)
  for (const ind of [
    'trades_home',
    'food_hospitality',
    'retail_maker',
    'health_wellness',
    'creative_pro',
    'professional_svc',
    'community',
  ]) {
    const lines = parseIndustryBlock(waveD, `SOCIAL > \`retention\` > \`${ind}\``)
    if (!lines) continue
    const indHeader = `### ${ind}`
    const idx = bank.indexOf(indHeader, socRet)
    if (idx < 0 || idx > goalEnd) {
      const body = buildIndustrySection(ind, lines)
      const catchIdx = bank.indexOf('```', socRet)
      const ins = bank.indexOf('\n---', catchIdx)
      bank = bank.slice(0, ins) + body + bank.slice(ins)
      console.log('D retention inserted', ind)
      continue
    }
    const indEnd = bank.indexOf('\n### ', idx + 1)
    const slice = bank.slice(idx, indEnd > idx ? indEnd : goalEnd)
    const fenceClose = slice.lastIndexOf('```')
    const inner = slice.slice(slice.indexOf('```') + 4, fenceClose)
    const toAdd = lines.filter((l) => !inner.includes(l.slice(0, 25)))
    if (toAdd.length && fenceClose > 0) {
      const absClose = idx + fenceClose
      bank = bank.slice(0, absClose) + '\n' + toAdd.join('\n') + '\n' + bank.slice(absClose)
      console.log('D retention appended', ind, toAdd.length)
    }
  }
}

writeFileSync(bankPath, bank, 'utf8')
console.log('finish-wave-g-d done')
