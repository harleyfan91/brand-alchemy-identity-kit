# Moodboard bank — persona smoke gate

**Status:** Pipeline **PASS** · Industry tags **FAIL** (3 gaps)  
**Date:** 2026-05-31  
**CLI:** `npm run image-bank-persona-smoke` (no AI)

---

## Gates

| Gate | Rule | Result |
|------|------|--------|
| **Persona spread** | 8 fixtures → deterministic shortlist ≥6 → `vr_6/8/9` photo picks | **PASS** |
| **Industry tags** | ≥2 tagged assets per `industrySuitability` enum | **FAIL** (3 thin) |

Phase 1 (36 style×scene cells) is complete. Persona smoke validates that the **deterministic matcher** can fill Pro Visual Reference spreads for representative kits before we scale the bank.

---

## Industry coverage (37 assets)

| Tag | Count | Target | Status |
|-----|------:|--------|--------|
| `hospitality_food` | 10 | ≥2 | ✓ |
| `makers_artisans` | 12 | ≥2 | ✓ |
| `creative_agency` | 4 | ≥2 | ✓ |
| `lifestyle_consumer` | 7 | ≥2 | ✓ |
| `b2b_tech` | 2 | ≥2 | ✓ |
| `professional_services` | 1 | ≥2 | ✗ |
| `retail_commerce` | 1 | ≥2 | ✗ |
| `wellness_healthcare` | 0 | ≥2 | ✗ |

10 assets are industry-agnostic (untagged) — valid; broadening uses them when sector tags miss.

---

## Deterministic dry-run (8 fixtures)

All fixtures run `buildVisualReferenceShortlist` → `assignDeterministicRankerPicks` → `resolveStyleGuideVisualReferenceModel` with **no AI**.

| Fixture | Industry → tags | Pool | Shortlist | Layout | Spread |
|---------|-----------------|-----:|----------:|--------|--------|
| `pro-smoke:text` | creative_services → creative_agency, makers | 26 | 30 | vr_9 | ✓ |
| `pro-smoke:vision` | food_beverage → hospitality_food | 20 | 30 | vr_9 | ✓ |
| `coffee-founder` | food_beverage → hospitality_food | 20 | 30 | vr_9 | ✓ |
| `established-pro` | consulting → professional, b2b_tech | 13 | 30 | vr_9 | ✓ |
| `pc05-regulated-legal` | legal → professional_services | 11 | 30 | vr_9 | ✓ |
| `pc06-retail` | retail → retail_commerce, makers | 23 | 30 | vr_9 | ✓ |
| `pc07b-trades-travel` | construction → lifestyle, professional | 18 | 30 | vr_9 | ✓ |
| `pc08-social-product` | creative → creative_agency, makers | 26 | 30 | vr_9 | ✓ |

**Note:** Pro-smoke fixtures (`text`, `vision`) are tier `pro` in `fixtures/pro-smoke/`. Persona fixtures are coerced to `pro` for this gate only.

---

## Batch 006 — close industry gaps (~6–8 assets)

Add **2 tagged assets each** for thin sectors (MVP-grounded, same preflight → QA → ingest workflow):

| Priority | Tag | Sourcing direction |
|----------|-----|-------------------|
| 1 | `wellness_healthcare` | Spa calm, clinic interior, fitness detail — no clinical stock clichés |
| 2 | `professional_services` | Neutral office/architecture, hands on documents — not handshake/laptop generic |
| 3 | `retail_commerce` | Shop floor, product display, packaging still life — no readable logos |

After ingest: `npm run image-bank-persona-smoke` should exit 0.

---

## Commands

```bash
npm run image-bank-persona-smoke          # human report, exit 1 on gate fail
npm run image-bank-persona-smoke -- --json
npm test -- --run src/image-bank/personaSmoke.test.ts
```
