# Pro smoke fixtures

Lean **Pro-tier** intakes for local PDF preview (`npm run generate:pro-pdfs`) and live API smoke tests (`npm run test:pro-smoke`). These are **not** Core personas.

## Design rules

1. **Wizard-faithful ids** — `customerArchetype` must be a card id from `packages/shared/src/buyerArchetypes.ts`, not free-text prose.
2. **Aligned Step 1** — `industry`, offer builder ids, and transformation ids must come from `step1ControlledOptions.ts` for that industry (use `other` only when the catalog truly cannot fit).
3. **Pro depth filled** — `businessDescription`, `painPoints`, and `desiredOutcomes` should be substantive so AI smoke tests reflect realistic Pro intake.
4. **One business model per fixture** — avoid mixing B2B service copy with a B2C retail `industry` label.

## Fixtures

| Id | Business | Industry | Archetype card | API use |
|----|----------|----------|----------------|---------|
| `text` | Harbor Lane Studio — B2B brand design studio for indie retailers | `creative_services` | `rebrand_ready_team` | `brief.idealCustomer` |
| `vision` | Northwind Roasters — cafe + small wholesale | `food_beverage` | `daily_regular` | Brand Audit vision smoke |

See [`docs/specs/BRIEF_IDEAL_CUSTOMER.md`](../../../../docs/specs/BRIEF_IDEAL_CUSTOMER.md) for Brief Ideal customer output shape.
