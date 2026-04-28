## Intake Glyph Migration Map

This is the concrete mapping plan for intake symbols before UI renderer changes.

- **Priority 1:** Alchemical strip symbols (`sun`, `mercury`, `fire`, `sulfur`, `air`, `salt`, `earth`)
- **Priority 2:** Secondary custom glyphs (use only as explicit overrides)

### Source of truth file

- `packages/shared/src/intakeGlyphs.ts`

---

## File-by-file mapping

### `apps/web/src/data/narratorOptions.ts`

| Narrator id | Label | Glyph id |
|---|---|---|
| `solo_expert` | Just me — I am the brand | `sun` |
| `solo_maker` | Me and my craft | `earth` |
| `local_team` | Our shop or small team | `salt` |
| `product_led` | The brand and what we make | `fire` |
| `mission_community` | A cause or community we serve | `air` |

### `packages/shared/src/buyerArchetypes.ts`

Current buyer options store legacy Unicode symbols. First-pass migration maps by symbol:

| Legacy icon | Glyph id |
|---|---|
| `◎` | `sun` |
| `◉` | `salt` |
| `↗` | `fire` |
| `◇` | `earth` |
| `✦` | `air` |
| `◈` | `mercury` |

Per-id exceptions (if any) will go in:

- `BUYER_GLYPH_OVERRIDES` in `packages/shared/src/intakeGlyphs.ts`

---

## Rollout notes

1. Keep intake data semantic (`glyphId`) and renderer-agnostic.
2. Swap `ArchetypeCard` from text symbols to custom SVG `IntakeGlyph`.
3. Keep touchpoint logos separate (brand logos are a different icon class).
4. Add overrides only where semantics need tuning; avoid broad exceptions.

