import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const generationPackageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Committed optimized JPEGs only — no `_incoming/` or raw downloads. */
export const IMAGE_BANK_ROOT = join(generationPackageRoot, 'dev', 'image-bank')
export const IMAGE_BANK_ASSETS_DIR = join(IMAGE_BANK_ROOT, 'assets')
export const IMAGE_BANK_METADATA_PATH = join(IMAGE_BANK_ROOT, 'metadata.v1.json')
export const IMAGE_BANK_MANIFEST_PATH = join(IMAGE_BANK_ROOT, 'manifest.json')

/** Long edge for PDF + vision tagging — originals often 4000px+; we never persist those. */
export const IMAGE_BANK_LONG_EDGE_PX = 1600

export const IMAGE_BANK_JPEG_QUALITY_START = 82
export const IMAGE_BANK_JPEG_QUALITY_MIN = 65
export const IMAGE_BANK_JPEG_QUALITY_STEP = 4

/** Hard cap per asset — quality steps down before dimensions shrink. */
export const IMAGE_BANK_MAX_BYTES = 250 * 1024

/** Warn when an asset exceeds this after processing. */
export const IMAGE_BANK_WARN_BYTES = 200 * 1024

/** Relative `src` prefix written into metadata (stable across machines). */
export const IMAGE_BANK_SRC_PREFIX = 'packages/generation/dev/image-bank/assets'
