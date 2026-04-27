import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

function parsePaletteOptions(source: string): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const matches = source.matchAll(/\{ id: '([^']+)', name: '[^']+', swatches: \[([^\]]+)\], tags: \[[^\]]+\] \}/g)
  for (const m of matches) {
    const id = m[1]
    const swatches = m[2]!.split(',').map((s) => s.trim().replace(/'/g, ''))
    out.set(id, swatches)
  }
  return out
}

function parseSimpleColorMap(source: string, mapName: string): Map<string, string[]> {
  const start = source.indexOf(`const ${mapName}: Record<string, string[]> = {`)
  if (start < 0) return new Map()
  const end = source.indexOf('\n}\n', start)
  const block = source.slice(start, end)
  const out = new Map<string, string[]>()
  const entries = block.matchAll(/^\s*([a-z0-9_]+):\s*\[([^\]]+)\],?$/gim)
  for (const m of entries) {
    const id = m[1]!
    const swatches = m[2]!.split(',').map((s) => s.trim().replace(/'/g, ''))
    out.set(id, swatches)
  }
  return out
}

function parseRowMapKeys(source: string, mapName: string): Set<string> {
  const start = source.indexOf(`const ${mapName}: Record<string, PaletteRow[]> = {`)
  if (start < 0) return new Set()
  const end = source.indexOf('\n}\n', start)
  const block = source.slice(start, end)
  return new Set(Array.from(block.matchAll(/^\s*([a-z0-9_]+):\s*\[/gim), (m) => m[1]!))
}

function parseStringMapKeys(source: string, mapName: string): Set<string> {
  const start = source.indexOf(`export const ${mapName}: Record<string, string> = {`)
  if (start < 0) return new Set()
  const end = source.indexOf('\n}\n', start)
  const block = source.slice(start, end)
  return new Set(Array.from(block.matchAll(/^\s*([a-z0-9_]+):/gim), (m) => m[1]!))
}

describe('palette parity: web and generation stay synchronized', () => {
  const thisFile = fileURLToPath(import.meta.url)
  const pkgRoot = path.resolve(path.dirname(thisFile), '..')
  const repoRoot = path.resolve(pkgRoot, '..', '..')

  const webVisualDirectionPath = path.join(repoRoot, 'apps', 'web', 'src', 'data', 'visualDirection.ts')
  const generationPdfPath = path.join(pkgRoot, 'src', 'pdf', 'CoreKitDocuments.tsx')
  const generationGuideModelPath = path.join(pkgRoot, 'src', 'deterministic', 'brandIdentityGuideModel.ts')
  const generationAssemblyPath = path.join(pkgRoot, 'src', 'deterministic', 'coreAssembly.ts')

  const webSource = fs.readFileSync(webVisualDirectionPath, 'utf8')
  const pdfSource = fs.readFileSync(generationPdfPath, 'utf8')
  const guideSource = fs.readFileSync(generationGuideModelPath, 'utf8')
  const assemblySource = fs.readFileSync(generationAssemblyPath, 'utf8')

  const webPalettes = parsePaletteOptions(webSource)
  const pdfSwatchMap = parseSimpleColorMap(pdfSource, 'paletteSwatchColors')
  const guideRowKeys = parseRowMapKeys(guideSource, 'guidePaletteRows')
  const descriptionKeys = parseStringMapKeys(assemblySource, 'paletteDescriptions')

  it('covers all web palette IDs in generation maps', () => {
    const missingInPdf = [...webPalettes.keys()].filter((id) => !pdfSwatchMap.has(id))
    const missingInGuideRows = [...webPalettes.keys()].filter((id) => !guideRowKeys.has(id))
    const missingInDescriptions = [...webPalettes.keys()].filter((id) => !descriptionKeys.has(id))

    expect(missingInPdf).toEqual([])
    expect(missingInGuideRows).toEqual([])
    expect(missingInDescriptions).toEqual([])
  })

  it('keeps swatch ordering and hex values in sync with web', () => {
    const mismatches: string[] = []
    for (const [id, swatches] of webPalettes.entries()) {
      const generationSwatches = pdfSwatchMap.get(id)
      if (!generationSwatches) continue
      if (JSON.stringify(swatches) !== JSON.stringify(generationSwatches)) {
        mismatches.push(id)
      }
    }
    expect(mismatches).toEqual([])
  })
})

