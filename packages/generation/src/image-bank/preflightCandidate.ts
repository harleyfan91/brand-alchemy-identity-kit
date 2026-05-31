import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { processImageBankAsset } from './processAsset.js'

/** Reject obvious non-image/error responses before Sharp. */
export const IMAGE_BANK_PREFLIGHT_MIN_DOWNLOAD_BYTES = 5_000

export type ImageBankPreflightCandidateInput = {
  id?: string
  url: string
  /** Optional curator note — echoed in output, not validated. */
  note?: string
}

export type ImageBankPreflightResult = {
  id: string
  url: string
  note?: string
  ok: boolean
  reason?: string
  downloadBytes?: number
  widthPx?: number
  heightPx?: number
  orientation?: 'portrait' | 'landscape'
  processedBytes?: number
  jpegQuality?: number
  /** Set when --save-dir writes a processed preview JPEG for visual QA. */
  savedPath?: string
}

export type PreflightImageBankCandidateOptions = {
  id?: string
  note?: string
  saveDir?: string
}

/**
 * Download → dimension check → ingest-style resize/compress dry-run.
 * Does not write to the bank; optional preview JPEG for human/agent visual QA.
 */
export async function preflightImageBankCandidate(
  url: string,
  download: (sourceUrl: string) => Promise<Buffer>,
  options: PreflightImageBankCandidateOptions = {},
): Promise<ImageBankPreflightResult> {
  const id = options.id ?? url
  const base: ImageBankPreflightResult = { id, url, note: options.note, ok: false }

  let downloadBuffer: Buffer
  try {
    downloadBuffer = await download(url)
  } catch (err) {
    return {
      ...base,
      reason: err instanceof Error ? err.message : String(err),
    }
  }

  const downloadBytes = downloadBuffer.length
  if (downloadBytes < IMAGE_BANK_PREFLIGHT_MIN_DOWNLOAD_BYTES) {
    return {
      ...base,
      downloadBytes,
      reason: `Download too small (${downloadBytes} bytes) — likely 404 or error page`,
    }
  }

  try {
    const processed = await processImageBankAsset(downloadBuffer)
    const result: ImageBankPreflightResult = {
      ...base,
      ok: true,
      downloadBytes,
      widthPx: processed.widthPx,
      heightPx: processed.heightPx,
      orientation: processed.orientation,
      processedBytes: processed.bytes,
      jpegQuality: processed.jpegQuality,
    }

    if (options.saveDir) {
      const safeId = id.replace(/[^a-zA-Z0-9._-]+/g, '_')
      await mkdir(options.saveDir, { recursive: true })
      const savedPath = join(options.saveDir, `${safeId}.jpg`)
      await writeFile(savedPath, processed.buffer)
      result.savedPath = savedPath
    }

    return result
  } catch (err) {
    return {
      ...base,
      downloadBytes,
      reason: err instanceof Error ? err.message : String(err),
    }
  }
}

export async function preflightImageBankCandidates(
  candidates: ImageBankPreflightCandidateInput[],
  download: (sourceUrl: string) => Promise<Buffer>,
  options: { saveDir?: string } = {},
): Promise<ImageBankPreflightResult[]> {
  const results: ImageBankPreflightResult[] = []
  for (const [index, candidate] of candidates.entries()) {
    const id = candidate.id ?? `candidate_${index + 1}`
    results.push(
      await preflightImageBankCandidate(candidate.url, download, {
        id,
        note: candidate.note,
        saveDir: options.saveDir,
      }),
    )
  }
  return results
}

export function summarizePreflightResults(results: ImageBankPreflightResult[]): {
  passed: number
  failed: number
} {
  const passed = results.filter((row) => row.ok).length
  return { passed, failed: results.length - passed }
}
