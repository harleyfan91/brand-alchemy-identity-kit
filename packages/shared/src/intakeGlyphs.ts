/**
 * Intake glyph taxonomy and migration mappings.
 *
 * Purpose:
 * - Define a single semantic glyph ID layer for intake UI.
 * - Keep renderer decisions (strip symbol vs secondary custom glyph SVG) out of option data.
 * - Provide a no-runtime-risk migration path before swapping UI components.
 *
 * Note:
 * - This file is intentionally not wired into UI yet.
 * - It is a planning/staging artifact for the glyph migration.
 */

import type { BrandNarrator } from './form.js'

/** Priority 1: glyphs from the canonical alchemical strip set. */
export type StripGlyphId = 'sun' | 'mercury' | 'fire' | 'sulfur' | 'air' | 'salt' | 'earth'

/** Priority 2: secondary custom glyphs (use only when strip semantics are weak). */
export type SecondaryGlyphId =
  | 'spark_clarity'
  | 'compass_direction'
  | 'heart_trust'
  | 'chat_voice'
  | 'check_confidence'
  | 'target_focus'
  | 'shield_reliability'
  | 'lightbulb_idea'

export type IntakeGlyphId = StripGlyphId | SecondaryGlyphId

/**
 * File: apps/web/src/data/narratorOptions.ts
 * Exact per-option mappings (priority: strip glyphs first).
 */
export const NARRATOR_GLYPH_MAP: Partial<Record<BrandNarrator, IntakeGlyphId>> = {
  solo_expert: 'sun',
  solo_maker: 'earth',
  local_team: 'salt',
  product_led: 'fire',
  mission_community: 'air',
}

/**
 * File: packages/shared/src/buyerArchetypes.ts
 * Current archetypes use legacy Unicode icons. This table maps those legacy symbols
 * to semantic strip glyph IDs for first-pass migration.
 */
export type LegacyBuyerIcon = '◎' | '◉' | '↗' | '◇' | '✦' | '◈'

export const LEGACY_BUYER_ICON_TO_GLYPH: Record<LegacyBuyerIcon, IntakeGlyphId> = {
  '◎': 'sun',
  '◉': 'salt',
  '↗': 'fire',
  '◇': 'earth',
  '✦': 'air',
  '◈': 'mercury',
}

/**
 * Explicit overrides by buyer archetype id when needed.
 * Keep empty initially; add entries only where icon-level mapping feels semantically off.
 */
export const BUYER_GLYPH_OVERRIDES: Record<string, IntakeGlyphId> = {}

/**
 * Resolve glyph for a buyer archetype from the legacy icon and optional id override.
 */
export function resolveBuyerGlyphId(archetypeId: string, legacyIcon: string): IntakeGlyphId {
  const override = BUYER_GLYPH_OVERRIDES[archetypeId]
  if (override) return override

  const mapped = LEGACY_BUYER_ICON_TO_GLYPH[legacyIcon as LegacyBuyerIcon]
  return mapped ?? 'earth'
}

