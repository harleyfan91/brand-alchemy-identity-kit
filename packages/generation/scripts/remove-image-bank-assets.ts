#!/usr/bin/env tsx
/**
 * Remove one or more image bank assets by imageId.
 *   npm run remove-image-bank-assets -- batch011_refined_pattern_gradient batch011_refined_texture_curves
 */

import { removeImageBankAsset } from '../src/image-bank/ingest.js'

const ids = process.argv.slice(2)
if (ids.length === 0) {
  console.error('Usage: tsx scripts/remove-image-bank-assets.ts <imageId> [...]')
  process.exit(1)
}

for (const imageId of ids) {
  const ok = await removeImageBankAsset(imageId)
  console.log(ok ? `Removed ${imageId}` : `Not found: ${imageId}`)
}
