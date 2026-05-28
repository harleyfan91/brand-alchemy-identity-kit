/**
 * Integrate WAVE_B..G copy into CTA_PHRASE_BANKS.md (transcription only).
 *
 * Usage:
 *   node scripts/integrate-cta-wave.mjs --wave B [--dry-run] [--manifest-only]
 *   node scripts/integrate-cta-wave.mjs --wave E --narrator-only
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const banksDir = join(root, 'packages/generation/dev/cta-phrase-banks')
const bankPath = join(banksDir, 'CTA_PHRASE_BANKS.md')

const args = process.argv.slice(2)
const waveArg = args.find((a) => a.startsWith('--wave='))?.slice(7) ?? args[args.indexOf('--wave') + 1]
const dryRun = args.includes('--dry-run')
const manifestOnly = args.includes('--manifest-only')
const narratorOnly = args.includes('--narrator-only')

if (!waveArg || !/^[B-G]$/i.test(waveArg)) {
  console.error('Usage: node scripts/integrate-cta-wave.mjs --wave B|C|D|E|F|G [--dry-run] [--manifest-only]')
  process.exit(1)
}

const WAVE = waveArg.toUpperCase()
const wavePath = join(banksDir, `WAVE_${WAVE}.md`)

const SURFACE_MARKERS = {
  WEBSITE: '# SURFACE: WEBSITE',
  EMAIL: '# SURFACE: EMAIL',
  SOCIAL: '# SURFACE: SOCIAL — Casual',
  'SOCIAL CASUAL': '# SURFACE: SOCIAL — Casual',
  LINKEDIN: '# SURFACE: SOCIAL — Professional (LinkedIn)',
  MARKETPLACE: '# SURFACE: MARKETPLACE',
  'GOOGLE BUSINESS': '# SURFACE: DIRECTORY — Google Business',
  YELP: '# SURFACE: DIRECTORY — Yelp',
}

const TUNED_NARRATORS = {
  trades_home: 'local_team',
  food_hospitality: 'solo_maker',
  retail_maker: 'product_led',
  health_wellness: 'local_team',
  creative_pro: 'solo_expert',
  professional_svc: 'solo_expert',
}

function parseTuplesFromBlock(block) {
  const tuples = []
  for (const line of block.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('//')) continue
    const s = t.endsWith(',') ? t.slice(0, -1) : t
    if (!s.startsWith('[')) continue
    try {
      const parsed = JSON.parse(s.replace(/\u2019/g, "'").replace(/\u201c|\u201d/g, '"'))
      if (Array.isArray(parsed) && parsed.length >= 2) {
        tuples.push([String(parsed[0]), String(parsed[1] ?? '')])
      } else if (Array.isArray(parsed) && parsed.length === 1) {
        tuples.push([String(parsed[0]), ''])
      }
    } catch {
      /* skip */
    }
  }
  return tuples
}

function tupleLine([a, b]) {
  return `["${a.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}", "${b.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"],`
}

function parsePathHeader(header, parentCtx = null) {
  const h = header.trim()
  if (/^####\s+(bold|friendly|professional)$/i.test(h)) {
    const tone = h.match(/^(bold|friendly|professional)$/i)?.[1].toLowerCase()
    return parentCtx ? { ...parentCtx, tone } : null
  }
  const narratorM = h.match(
    /^(WEBSITE|EMAIL|SOCIAL)\s*>\s*`([^`]+)`\s*>\s*`([^`]+)`\s*×\s*`([^`]+)`\s*>\s*(bold|friendly|professional)$/i,
  )
  if (narratorM) {
    return {
      surface: narratorM[1].toUpperCase() === 'SOCIAL' ? 'SOCIAL' : narratorM[1].toUpperCase(),
      goal: narratorM[2],
      industry: narratorM[3],
      narrator: narratorM[4],
      tone: narratorM[5].toLowerCase(),
      op: 'NEW_NARRATOR_LEAF',
    }
  }
  const m = h.match(
    /^(WEBSITE|EMAIL|SOCIAL|LINKEDIN|Marketplace|Google Business|Yelp|ctaTemplates)\s*>\s*`([^`]+)`(?:\s*>\s*`([^`]+)`)?(?:\s*>\s*(bold|friendly|professional))?/i,
  )
  const isNewLeafHeader = /new leaf|pairs\s*1[–-]\d/i.test(h)
  if (!m) return null
  let surface = m[1].toUpperCase()
  if (surface === 'MARKETPLACE') surface = 'MARKETPLACE'
  if (surface === 'GOOGLE BUSINESS') surface = 'GOOGLE BUSINESS'
  const goal = m[2]
  const industry = m[3] || null
  const tone = m[4]?.toLowerCase() || null
  const isNew = /NEW SECTION/i.test(h)
  const isSplit = /pairs\s*5[–-]8/i.test(h)
  const isSplitFirst = /pairs\s*1[–-]4/i.test(h)
  const isAppendRange = /pairs\s*4[–-]/i.test(h)
  let op = null
  if (isNew || isNewLeafHeader) op = 'NEW_LEAF'
  else if (isSplit || isSplitFirst) op = 'MERGE_SPLIT_LEAF'
  else if (isAppendRange || (industry && (tone || !m[4]))) op = 'APPEND'
  return {
    surface,
    goal,
    industry,
    tone,
    op,
    raw: h,
  }
}

function extractWaveOperations(waveText, waveLetter) {
  const ops = []
  const lines = waveText.replace(/\r\n/g, '\n').split('\n')
  let parentCtx = null
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const h3 = line.match(/^###\s+(.+)$/)
    const h4 = line.match(/^####\s+(.+)$/)
    if (h3) {
      const parsed = parsePathHeader(h3[1])
      if (parsed?.goal && parsed?.industry) {
        if (parsed.surface === 'WEBSITE' || parsed.surface === 'EMAIL' || parsed.surface === 'SOCIAL') {
          parentCtx = { surface: parsed.surface, goal: parsed.goal, industry: parsed.industry }
        }
        if (parsed.op) {
          let j = i + 1
          let newPairsLabel = ''
          const tuples = []
          let inFence = false
          let buf = []
          while (j < lines.length && !/^###\s+/.test(lines[j]) && !/^##\s+/.test(lines[j]) && !/^#\s+[A-Z]/.test(lines[j])) {
            const l = lines[j]
            if (/^\*\*New pairs/i.test(l.trim())) newPairsLabel = l.trim()
            if (l.trim().startsWith('```')) {
              if (!inFence) {
                inFence = true
                buf = []
              } else {
                tuples.push(...parseTuplesFromBlock(buf.join('\n')))
                inFence = false
                buf = []
              }
            } else if (inFence) buf.push(l)
            j++
          }
          if (parsed.op === 'NEW_NARRATOR_LEAF' && tuples.length > 0) {
            ops.push({ ...parsed, tuples, id: `${waveLetter}-N-${ops.length}`, newPairsLabel })
          } else if (
            tuples.length > 0 &&
            (newPairsLabel ||
              parsed.op === 'NEW_LEAF' ||
              parsed.op === 'MERGE_SPLIT_LEAF' ||
              parsed.op === 'APPEND' ||
              /NEW SECTION/i.test(h3[1]))
          ) {
            const op = /NEW SECTION/i.test(h3[1]) ? 'NEW_LEAF' : parsed.op || 'APPEND'
            ops.push({
              surface: parsed.surface,
              goal: parsed.goal,
              industry: parsed.industry,
              tone: parsed.tone,
              op,
              tuples,
              id: `${waveLetter}-${ops.length}`,
              newPairsLabel,
              raw: h3[1],
            })
          }
          i = j
          continue
        }
      } else if (parsed?.surface) {
        parentCtx = null
      }
    }
    if (h4) {
      const tone = h4[1].toLowerCase()
      if (parentCtx && ['bold', 'friendly', 'professional'].includes(tone)) {
        let j = i + 1
        let newPairsLabel = ''
        const tuples = []
        let inFence = false
        let buf = []
        while (j < lines.length && !/^####\s+/.test(lines[j]) && !/^###\s+/.test(lines[j])) {
          const l = lines[j]
          if (/^\*\*New pairs/i.test(l.trim())) newPairsLabel = l.trim()
          if (l.trim().startsWith('```')) {
            if (!inFence) {
              inFence = true
              buf = []
            } else {
              tuples.push(...parseTuplesFromBlock(buf.join('\n')))
              inFence = false
              buf = []
            }
          } else if (inFence) buf.push(l)
          j++
        }
        if (tuples.length > 0) {
          ops.push({
            ...parentCtx,
            tone,
            op: 'APPEND',
            tuples,
            id: `${waveLetter}-${ops.length}`,
            newPairsLabel,
            raw: `#### ${tone}`,
          })
        }
        i = j
        continue
      }
    }
    i++
  }
  return ops
}

function findSurfaceIndex(bank, surface) {
  const marker = SURFACE_MARKERS[surface]
  if (!marker) return -1
  return bank.indexOf(marker)
}

function findGoalIndex(bank, fromIdx, goal) {
  const slice = bank.slice(fromIdx)
  const re = new RegExp(`^## Goal: \\\`${goal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\\``, 'm')
  const m = slice.match(re)
  if (!m) return -1
  return fromIdx + m.index
}

function findIndustryIndex(bank, fromIdx, industry, endBound) {
  const slice = bank.slice(fromIdx, endBound)
  const re = new RegExp(`^### ${industry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm')
  const m = slice.match(re)
  if (!m) return -1
  return fromIdx + m.index
}

function findNextIndustryOrGoal(bank, fromIdx) {
  const slice = bank.slice(fromIdx + 1)
  const m = slice.match(/^### |^## Goal:|^# SURFACE:/m)
  return m ? fromIdx + 1 + m.index : bank.length
}

/** Exclusive end of current ## Goal section (next goal or surface). */
function findGoalSectionEnd(bank, goalIdx) {
  const slice = bank.slice(goalIdx + 1)
  const m = slice.match(/^## Goal:|^# SURFACE:/m)
  return m ? goalIdx + 1 + m.index : bank.length
}

function findToneBlock(bank, fromIdx, endIdx, tone) {
  if (!tone) {
    const fence = bank.slice(fromIdx, endIdx).match(/^```\n/m)
    if (!fence) return null
    const start = fromIdx + fence.index
    const closeFenceStart = bank.indexOf('```', start + 4)
    return { start, close: closeFenceStart + 3, insertAt: closeFenceStart, tone: null }
  }
  const slice = bank.slice(fromIdx, endIdx)
  const toneRe = new RegExp(`^\\*\\*${tone}:\\*\\*\\s*$`, 'm')
  const tm = slice.match(toneRe)
  if (!tm) return null
  const toneStart = fromIdx + tm.index
  const afterTone = toneStart + tm[0].length
  const fenceStart = bank.indexOf('```', afterTone)
  const closeFenceStart = bank.indexOf('```', fenceStart + 3)
  return { start: fenceStart, close: closeFenceStart + 3, insertAt: closeFenceStart, tone }
}

function findNarratorBlock(bank, fromIdx, endIdx, narrator) {
  const slice = bank.slice(fromIdx, endIdx)
  const re = new RegExp(`^\\*\\*narrator: ${narrator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*\\s*$`, 'm')
  const m = slice.match(re)
  if (!m) return null
  return fromIdx + m.index
}

function appendTuplesToFence(bank, insertAt, tuples) {
  const blockStart = bank.lastIndexOf('```', insertAt - 1)
  const inner = bank.slice(blockStart + 4, insertAt)
  const toAdd = []
  for (const t of tuples) {
    const line = tupleLine(t)
    if (!inner.includes(line.slice(0, 20))) toAdd.push(line)
  }
  if (toAdd.length === 0) return { bank, added: 0, status: 'ALREADY_APPLIED' }
  const insert = (inner.endsWith('\n') ? '' : '\n') + toAdd.join('\n') + '\n'
  const newBank = bank.slice(0, insertAt) + insert + bank.slice(insertAt)
  return { bank: newBank, added: toAdd.length, status: 'APPLIED' }
}

function replaceIndustrySection(bank, indIdx, industry, tonesWithTuples) {
  const endIdx = findNextIndustryOrGoal(bank, indIdx)
  let body = `### ${industry}\n\n`
  for (const { tone, tuples } of tonesWithTuples) {
    if (tone) {
      body += `**${tone}:**\n\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    } else {
      body += `\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    }
  }
  const newBank = bank.slice(0, indIdx) + body + bank.slice(endIdx)
  return {
    bank: newBank,
    status: 'APPLIED',
    added: tonesWithTuples.reduce((n, t) => n + t.tuples.length, 0),
  }
}

function replaceTodoLeaf(bank, goalIdx, industry, tonesWithTuples) {
  const goalEnd = findGoalSectionEnd(bank, goalIdx)
  const indIdx = findIndustryIndex(bank, goalIdx, industry, goalEnd)
  if (indIdx < 0) return { bank, status: 'NOT_FOUND', detail: 'industry' }
  const endIdx = findNextIndustryOrGoal(bank, indIdx)
  const section = bank.slice(indIdx, endIdx)
  if (!section.includes('// TODO')) {
    return { bank, status: 'AMBIGUOUS', detail: 'no TODO' }
  }
  let body = `### ${industry}\n\n`
  for (const { tone, tuples } of tonesWithTuples) {
    if (tone) {
      body += `**${tone}:**\n\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    } else {
      body += `\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    }
  }
  const newBank = bank.slice(0, indIdx) + body + bank.slice(endIdx)
  return { bank: newBank, status: 'APPLIED', added: tonesWithTuples.reduce((n, t) => n + t.tuples.length, 0) }
}

function insertNewLeaf(bank, goalIdx, industry, tone, tuples) {
  const endGoal = findNextIndustryOrGoal(bank, goalIdx)
  let insertAt = endGoal
  const indIdx = findIndustryIndex(bank, goalIdx, industry, endGoal)
  if (indIdx >= 0) {
    insertAt = findNextIndustryOrGoal(bank, indIdx)
  }
  let block = `\n### ${industry}\n\n`
  if (tone) {
    block += `**${tone}:**\n\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
  } else {
    block += `\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
  }
  block += '---\n\n'
  const newBank = bank.slice(0, insertAt) + block + bank.slice(insertAt)
  return { bank: newBank, status: 'APPLIED', added: tuples.length }
}

function ensureNarratorSubsection(bank, surface, goal, industry, narrator, tone, tuples) {
  const sIdx = findSurfaceIndex(bank, surface)
  if (sIdx < 0) return { bank, status: 'NOT_FOUND', detail: 'surface' }
  const gIdx = findGoalIndex(bank, sIdx, goal)
  if (gIdx < 0) return { bank, status: 'NOT_FOUND', detail: 'goal' }
  const endGoal = findGoalSectionEnd(bank, gIdx)
  const indIdx = findIndustryIndex(bank, gIdx, industry, endGoal)
  if (indIdx < 0) return { bank, status: 'NOT_FOUND', detail: 'industry' }
  const indEnd = findNextIndustryOrGoal(bank, indIdx)
  let section = bank.slice(indIdx, indEnd)
  const narrMarker = `**narrator: ${narrator}**`
  if (!section.includes(narrMarker)) {
    const insert = `\n${narrMarker}\n\n**${tone}:**\n\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    const newSection = section.trimEnd() + insert
    const newBank = bank.slice(0, indIdx) + newSection + bank.slice(indEnd)
    return { bank: newBank, status: 'APPLIED', added: tuples.length }
  }
  const narrIdx = findNarratorBlock(bank, indIdx, indEnd, narrator)
  if (narrIdx < 0) return { bank, status: 'NOT_FOUND', detail: 'narrator block' }
  const narrEnd = findNextIndustryOrGoal(bank, narrIdx)
  const tb = findToneBlock(bank, narrIdx, narrEnd, tone)
  if (!tb) {
    const ins = `\n**${tone}:**\n\`\`\`\n${tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
    const pos = narrEnd
    return { bank: bank.slice(0, pos) + ins + bank.slice(pos), status: 'APPLIED', added: tuples.length }
  }
  return appendTuplesToFence(bank, tb.insertAt, tuples)
}

function applyOp(bank, op) {
  if (op.op === 'NEW_NARRATOR_LEAF') {
    return ensureNarratorSubsection(bank, op.surface, op.goal, op.industry, op.narrator, op.tone, op.tuples)
  }
  const surface = op.surface
  const sIdx = findSurfaceIndex(bank, surface)
  if (sIdx < 0) return { bank, status: 'NOT_FOUND', detail: `surface ${surface}` }
  const gIdx = findGoalIndex(bank, sIdx, op.goal)
  if (gIdx < 0) return { bank, status: 'NOT_FOUND', detail: `goal ${op.goal}` }
  const goalEnd = findGoalSectionEnd(bank, gIdx)
  const indIdx = findIndustryIndex(bank, gIdx, op.industry, goalEnd)
  if (op.op === 'NEW_LEAF' && indIdx < 0) {
    return insertNewLeaf(bank, gIdx, op.industry, op.tone, op.tuples)
  }
  if (indIdx < 0) return { bank, status: 'NOT_FOUND', detail: `industry ${op.industry}` }
  const indEnd = findNextIndustryOrGoal(bank, indIdx)
  const section = bank.slice(indIdx, indEnd)
  if (op.op === 'NEW_LEAF' && section.includes('// TODO')) {
    const tones = op.tone ? [{ tone: op.tone, tuples: op.tuples }] : [{ tone: null, tuples: op.tuples }]
    return replaceIndustrySection(bank, indIdx, op.industry, tones)
  }
  if (op.op === 'NEW_LEAF' && op.tone) {
    const tb0 = findToneBlock(bank, indIdx, indEnd, op.tone)
    if (!tb0) {
      const ins = `\n**${op.tone}:**\n\`\`\`\n${op.tuples.map(tupleLine).join('\n')}\n\`\`\`\n\n`
      const newBank = bank.slice(0, indEnd) + ins + bank.slice(indEnd)
      return { bank: newBank, status: 'APPLIED', added: op.tuples.length }
    }
  }
  const tb = findToneBlock(bank, indIdx, indEnd, op.tone)
  if (!tb) return { bank, status: 'NOT_FOUND', detail: `tone ${op.tone || 'none'}` }
  if (op.op === 'NEW_LEAF') {
    const inner = bank.slice(tb.start + 4, tb.close - 3)
    if (inner.trim().length < 10 || inner.includes('// TODO')) {
      const newInner = op.tuples.map(tupleLine).join('\n') + '\n'
      const newBank = bank.slice(0, tb.start + 4) + newInner + bank.slice(tb.close)
      return { bank: newBank, status: 'APPLIED', added: op.tuples.length }
    }
  }
  return appendTuplesToFence(bank, tb.insertAt, op.tuples)
}

function extractWaveGOperations(waveText) {
  const ops = []
  let ctx = { surface: null, goal: null, part: null }
  const lines = waveText.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (/^## Part 1/.test(line)) {
      ctx = { surface: 'LINKEDIN', goal: null, part: '1' }
      i++
      continue
    }
    if (/^### 1A/.test(line)) {
      ctx.goal = 'lead_gen'
      i++
      continue
    }
    if (/^### 1B/.test(line)) {
      ctx.goal = 'audience_growth'
      i++
      continue
    }
    if (/^## Part 2A/.test(line)) {
      ctx = { surface: 'YELP', goal: 'direct_sales', part: '2A' }
      i++
      continue
    }
    if (/^## Part 2B/.test(line)) {
      ctx = { surface: 'YELP', goal: 'direct_sales', part: '2B' }
      i++
      continue
    }
    if (/^## Part 3/.test(line)) {
      ctx = { surface: 'MARKETPLACE', goal: 'lead_gen', part: '3' }
      i++
      continue
    }
    if (/^## Part 4/.test(line)) {
      ctx = { surface: 'GOOGLE BUSINESS', goal: 'direct_sales', part: '4' }
      i++
      continue
    }
    if (/^## Part 5/.test(line)) {
      ctx = { surface: 'GOOGLE BUSINESS', goal: 'lead_gen', part: '5' }
      i++
      continue
    }
    if (/^## Part 6/.test(line)) {
      ctx = { surface: 'SOCIAL', goal: 'retention', part: '6' }
      i++
      continue
    }
    if (/^## Part 7/.test(line)) {
      ctx = { surface: 'ctaTemplates', goal: 'retention', part: '7' }
      i++
      continue
    }
    const h3 = line.match(/^###\s+(.+)$/)
    const h4 = line.match(/^####\s+(.+)$/)
    if (h3 && ctx.part === '4') {
      const industry = h3[1].trim()
      let j = i + 1
      while (j < lines.length && !/^###\s+/.test(lines[j]) && !/^##\s+/.test(lines[j])) {
        const toneM = lines[j].match(/^\*\*(bold|friendly|professional):\*\*/)
        if (toneM) {
          const tone = toneM[1]
          let k = j + 1
          let buf = []
          let inFence = false
          while (
            k < lines.length &&
            !/^\*\*(bold|friendly|professional):\*\*/.test(lines[k]) &&
            !/^###\s+/.test(lines[k])
          ) {
            if (lines[k].trim().startsWith('```')) {
              if (!inFence) inFence = true
              else {
                const tuples = parseTuplesFromBlock(buf.join('\n'))
                if (tuples.length) {
                  ops.push({
                    id: `G-${ops.length}`,
                    surface: ctx.surface,
                    goal: ctx.goal,
                    industry,
                    tone,
                    op: 'NEW_LEAF',
                    tuples,
                    raw: `${industry} ${tone}`,
                  })
                }
                inFence = false
                buf = []
              }
            } else if (inFence) buf.push(lines[k])
            k++
          }
          j = k
          continue
        }
        j++
      }
      i = j
      continue
    }
    if (h3 && ctx.surface && ctx.part !== '1' && ctx.part !== '4') {
      const name = h3[1].trim()
      if (name !== '1A — `lead_gen`' && !name.startsWith('1B')) {
        let industry = name.replace(/\s*\(.*\)$/, '').trim()
        if (industry === 'all other industries') industry = 'default'
        let j = i + 1
        const tuples = []
        let inFence = false
        let buf = []
        while (j < lines.length && !/^###\s+/.test(lines[j]) && !/^##\s+/.test(lines[j])) {
          const l = lines[j]
          if (l.trim().startsWith('```')) {
            if (!inFence) {
              inFence = true
              buf = []
            } else {
              tuples.push(...parseTuplesFromBlock(buf.join('\n')))
              inFence = false
            }
          } else if (inFence) buf.push(l)
          j++
        }
        if (tuples.length > 0) {
          const isNew = ctx.part === '2B' || ctx.part === '4' || ctx.part === '5' || ctx.part === '6'
          ops.push({
            id: `G-${ops.length}`,
            surface: ctx.surface,
            goal: ctx.goal,
            industry,
            tone: null,
            op: isNew ? 'NEW_LEAF' : 'APPEND',
            tuples,
            raw: name,
          })
        }
        i = j
        continue
      }
    }
    if (h4 && ctx.surface === 'LINKEDIN') {
      let industry = h4[1].trim()
      if (industry.includes('/')) industry = 'default'
      let j = i + 1
      let buf = []
      let inFence = false
      const tuples = []
      while (j < lines.length && !/^####\s+/.test(lines[j]) && !/^###\s+/.test(lines[j]) && !/^##\s+/.test(lines[j])) {
        if (lines[j].trim().startsWith('```')) {
          if (!inFence) inFence = true
          else {
            tuples.push(...parseTuplesFromBlock(buf.join('\n')))
            inFence = false
            buf = []
          }
        } else if (inFence) buf.push(lines[j])
        j++
      }
      if (tuples.length) {
        ops.push({
          id: `G-${ops.length}`,
          surface: 'LINKEDIN',
          goal: ctx.goal,
          industry,
          tone: null,
          op: 'APPEND',
          tuples,
          raw: h4[1],
        })
      }
      i = j
      continue
    }
    if (ctx.part === '7' && /^\*\*([^,]+), any:\*\*/.test(line.trim())) {
      const ind = line.match(/^\*\*([^,]+), any:\*\*/)[1].trim().replace(/\s+/g, '_').toLowerCase()
      const tripleM = line.match(/`(\[[^\`]+\])`/)
      if (tripleM) {
        try {
          const triple = JSON.parse(tripleM[1].replace(/\u2019/g, "'"))
          ops.push({
            id: `G-T-${ops.length}`,
            surface: 'ctaTemplates',
            goal: 'retention',
            industry: ind,
            op: 'APPEND_TRIPLET',
            triple,
            raw: line,
          })
        } catch {
          /* skip */
        }
      }
    }
    i++
  }
  return ops
}

function applyGOp(bank, op) {
  if (op.op === 'APPEND_TRIPLET') {
    const marker = '# `ctaTemplates`'
    const idx = bank.indexOf(marker)
    if (idx < 0) return { bank, status: 'NOT_FOUND', detail: 'ctaTemplates' }
    const retIdx = bank.indexOf('## `retention`', idx)
    const line = `**${op.industry}, any:** \`${JSON.stringify(op.triple)}\`\n`
    const ins = bank.indexOf('---', retIdx)
    const pos = ins > retIdx ? ins : bank.length
    if (bank.includes(line.trim())) return { bank, status: 'ALREADY_APPLIED', added: 0 }
    return { bank: bank.slice(0, pos) + line + bank.slice(pos), status: 'APPLIED', added: 1 }
  }
  return applyOp(bank, op)
}

function extractPatches(waveText, waveLetter) {
  const patches = []
  if (waveLetter === 'D') {
    const fixes = waveText.match(/Recommended fix:\s*\n```\n([\s\S]*?)```/g)
    if (fixes) {
      const orig1 =
        '["Save this and follow. New things every week, everything made by hand."]'
      const repl1 =
        '["Save this and follow.", "New things every week, everything made by hand. Get them before they\'re gone."]'
      patches.push({ id: 'D-PREFACE-1', old: orig1, new: repl1 })
      patches.push({
        id: 'D-PREFACE-2',
        old: '["Link in bio to sign up!", "Takes 30 seconds."]',
        new: '["Tap the link and find your place in the work.", "Every kind of contribution matters."]',
      })
    }
  }
  if (waveLetter === 'G') {
    const checklist = [
      {
        id: 'G-PATCH-1',
        old: '"this page is worth following."',
        new: '"this page is relevant to your work."',
      },
      {
        id: 'G-PATCH-2',
        old: '"Find something worth keeping."',
        new: '"Find something you\'ll actually keep."',
      },
    ]
    patches.push(...checklist)
    const l1593 = {
      id: 'G-PATCH-3',
      old: '"We post when we have something worth sharing."',
      new: '"We post when we have something to say."',
    }
    patches.push(l1593)
  }
  return patches
}

function main() {
  if (!existsSync(wavePath)) {
    console.error('Missing', wavePath)
    process.exit(1)
  }
  const waveText = readFileSync(wavePath, 'utf8')
  let bank = readFileSync(bankPath, 'utf8')
  let ops =
    WAVE === 'G' ? extractWaveGOperations(waveText) : extractWaveOperations(waveText, WAVE)
  if (narratorOnly) ops = ops.filter((o) => o.op === 'NEW_NARRATOR_LEAF')

  const splitAcc = new Map()
  const results = []
  let totalAdded = 0

  for (const op of ops) {
    if (manifestOnly) {
      results.push({ ...op, status: 'PENDING', added: op.tuples?.length || 0 })
      continue
    }
    if (op.op === 'MERGE_SPLIT_LEAF') {
      const key = `${op.goal}|${op.industry}`
      if (!splitAcc.has(key)) splitAcc.set(key, {})
      splitAcc.get(key)[op.tone] = op.tuples
      results.push({ ...op, status: 'DEFERRED_SPLIT', added: op.tuples.length })
      continue
    }
    const r = WAVE === 'G' ? applyGOp(bank, op) : applyOp(bank, op)
    bank = r.bank
    totalAdded += r.added || 0
    results.push({ ...op, status: r.status, added: r.added || 0, detail: r.detail })
  }

  if (!manifestOnly && !dryRun && splitAcc.size > 0) {
    for (const [key, tones] of splitAcc) {
      const [goal, industry] = key.split('|')
      const sIdx = findSurfaceIndex(bank, 'MARKETPLACE')
      const gIdx = findGoalIndex(bank, sIdx, goal)
      const goalEnd = findGoalSectionEnd(bank, gIdx)
      const indIdx = findIndustryIndex(bank, gIdx, industry, goalEnd)
      const tonesArr = []
      if (tones.bold) tonesArr.push({ tone: 'bold', tuples: tones.bold })
      if (tones.friendly) tonesArr.push({ tone: 'friendly', tuples: tones.friendly })
      const r =
        indIdx >= 0
          ? replaceIndustrySection(bank, indIdx, industry, tonesArr)
          : { bank, status: 'NOT_FOUND', added: 0 }
      bank = r.bank
      totalAdded += r.added || 0
      results.push({ id: `F-SPLIT-${key}`, op: 'MERGE_SPLIT_LEAF', status: r.status, added: r.added || 0 })
    }
  }

  const patches = extractPatches(waveText, WAVE)
  for (const p of patches) {
    if (bank.includes(p.old)) {
      if (!manifestOnly) bank = bank.replace(p.old, p.new)
      results.push({ id: p.id, op: 'PATCH', status: bank.includes(p.old) && manifestOnly ? 'FOUND' : 'APPLIED', ...p })
    } else if (bank.includes(p.new)) {
      results.push({ id: p.id, op: 'PATCH', status: 'ALREADY_APPLIED', ...p })
    } else {
      results.push({ id: p.id, op: 'PATCH', status: 'NOT_FOUND', ...p })
    }
  }

  const applied = results.filter((r) => r.status === 'APPLIED').length
  const notFound = results.filter((r) => r.status === 'NOT_FOUND')

  if (!manifestOnly && !dryRun) {
    writeFileSync(bankPath, bank, 'utf8')
  }

  const manifestPath = join(banksDir, `WAVE_${WAVE}_INTEGRATION_MANIFEST.json`)
  writeFileSync(manifestPath, JSON.stringify({ wave: WAVE, totalAdded, results }, null, 2), 'utf8')

  console.log(`Wave ${WAVE}: ${ops.length} ops, ${totalAdded} tuples added, ${applied} applied, ${notFound.length} not found`)
  if (notFound.length) {
    for (const n of notFound.slice(0, 15)) {
      console.log(' NOT_FOUND:', n.id || n.op, n.detail || n.raw || n.old?.slice(0, 40))
    }
  }
  if (dryRun) console.log('(dry run — bank not written)')
}

main()
