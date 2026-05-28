# WAVE_A Integration Flags

**Date:** 2026-05-27  
**Summary:** 26 / 27 rows fully clear. **A17** applied verbatim; **deferred revision** (owner will update copy later).

See [WAVE_A_INTEGRATION_MANIFEST.md](./WAVE_A_INTEGRATION_MANIFEST.md) for the full checklist.

---

### A17 — DEFERRED (owner revision later)

**Status:** In live bank; `ctaPhraseBankPolicy` fails until **Replacement** in [WAVE_A.md](./WAVE_A.md) is revised and re-transcribed.

- **Location:** EMAIL > `direct_sales` > `food_hospitality` > friendly > variant 1
- **Issue:** LOGIC — em dash in paste-ready line2 (`CTA_COPY_RULES.md` §7)
- **In bank (line ~715):** `"Dinner in or takeout — I'll handle the details."`
- **When revising:** Update the fenced **Replacement** block under A17 in `WAVE_A.md`, then one-row re-transcribe (exact match on current tuple → new tuple). Regenerate with `node scripts/gen-cta-phrase-banks.mjs` and re-run `npm run test:generation -- ctaPhraseBankPolicy`.
- **Integrator rule:** No AI rewrite of line2 in the bank until `WAVE_A.md` Replacement is updated.
