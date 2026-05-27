# Waves B–G integration — outstanding items (rollup)

**Date:** 2026-05-27  
**Final report:** [`WAVES_B_G_INTEGRATION_REPORT.md`](./WAVES_B_G_INTEGRATION_REPORT.md)  
**All items closed:** 2026-05-27

---

## Carried from Wave A

### A17 — CLOSED ✅
- **Location:** EMAIL > `direct_sales` > `food_hospitality` > friendly > variant 1
- **Issue:** Em dash in line2 of replacement pair fails `ctaPhraseBankPolicy`
- **Resolution (2026-05-27):** Line2 updated in `WAVE_A.md` and `CTA_PHRASE_BANKS.md` to `"Dinner in or takeout. I'll handle the details."` (period replaces em dash, per `CTA_COPY_RULES.md` §em-dash). Gen.ts regenerated; `ctaPhraseBankPolicy` passes.

---

## Policy / mechanical

### POLICY-EM-DASH — CLOSED ✅
- **Issue:** `ctaPhraseBankPolicy` fails on paste-ready lines containing U+2014 em dash in Wave A/B/C tuples
- **Resolution (2026-05-27):** All 97 em-dash occurrences in tuple lines across `CTA_PHRASE_BANKS.md` replaced using `scripts/fix-em-dashes.mjs` (period or comma per `CTA_COPY_RULES.md` §em-dash). Gen.ts regenerated via `gen-cta-phrase-banks.mjs`. `ctaPhraseBankPolicy` passes (2 tests pass, 0 failures).
- **Script:** `scripts/fix-em-dashes.mjs` — auditable mapping of all replacements; safe to re-run if future waves introduce em dashes.

---

## Deferred copy (no fenced deliverable)

### C-COMMUNITY-WEB-LEADGEN — CLOSED (resolved in integration) ✅
- **Source:** `WAVE_C.md` ~line 1142 — community WEBSITE `direct_sales` > bold, pair 3 flagged off-register in audit (note: outstanding doc incorrectly labelled as `lead_gen`)
- **Original flagged pair:** `"Support the work. Volunteer or give, your call."` / `"It takes about 30 seconds."` (transactional efficiency register, incorrect for community industry)
- **Resolution:** The flagged pair is not present in the current live bank. It was replaced by correct-register pairs during Wave B/C base-bank expansion. Current community WEBSITE direct_sales bold section has 8 pairs; all use cause-urgency and invitation register as specified in `CTA_COPY_RULES.md` §3. No further action required.

---

## Volume notes (non-blocking)

- Wave B/C/D/F: applied tuple counts slightly below footer totals where tuples were already present (`ALREADY_APPLIED` / duplicate detection).
- Reconcile via per-wave `WAVE_*_INTEGRATION_MANIFEST.json` if audit needs exact pair counts.
