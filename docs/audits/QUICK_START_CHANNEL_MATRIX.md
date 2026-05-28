# Quick Start — channel recommendation matrix (Phase A.5)

**Status:** v1.2 — **implemented in code** (`quickStartRecommendations.ts`). PDF shows **selected + ≤2 advisory** only; six-slot queue is internal. **Yelp** and **Pinterest** to segment-gated Tier 1. Six industry segments; expand industries after sign-off.  
**Implements:** [`QUICK_START_CHANNEL_STRATEGY.md`](./QUICK_START_CHANNEL_STRATEGY.md) (Execute Weeks 1–2 on selected touchpoints; Expand Weeks 3–4 with recommendations).  
**Program:** [`QUICK_START_REFACTOR.md`](./QUICK_START_REFACTOR.md)  
**Source of truth for IDs:** [`packages/shared/src/touchpoints.ts`](../../packages/shared/src/touchpoints.ts) — **24** touchpoints in Step 1 (same list as intake UI).

---

## How to read this doc

| Concept | Meaning |
|---------|---------|
| **Tier 1** | Highest reach / intent for US small businesses — default **first** Expand picks when missing and segment allows. |
| **Tier 2** | Strong situational — next in queue after Tier 1 for that segment. |
| **Tier 3** | Valid for some businesses — recommend only when **segment + gates** match; never default for broad S2. |
| **Quick Start R1 / R2** | What we **show** in Weeks 3–4 today: **first two** IDs from the filtered queue (max 2). |
| **Full queue** | All tier-eligible IDs for that customer, in order — used for “consider later,” depth docs, or future Week 4 overflow. |
| **Tier 1 core (positions 1–6)** | **Internal only** — priority order for code (`considerLater`, future depth). **Not** six checklist rows. |
| **Customer-facing Expand** | **Selected channels (Execute) + up to 2 advisory lines (R1/R2)** on Weeks 3–4 only. |

**Gates (all segments):**

- Omit any ID already in `step1.touchpoints` (normalized, max 4).
- **Quick Start PDF:** max **2** Expand recommendations (R1 + R2) so the checklist stays small.
- **System catalog:** every intake touchpoint has tier + segment rules — we can recommend **any** of the 24 when context fits; we do not show all 24 at once.
- Use **advisory** framing only in Expand — see copy templates at end.
- **`audience_growth`:** max **one** Expand recommendation unless local physical discovery (Tier 1 `google_business`) still applies.

**LinkedIn note:** LinkedIn is **not** a frequent default recommendation. ~45–65% of SMBs use it, but mostly **B2B and professional** niches — not cafés, trades, or most consumer retail. It lives in **Tier 3** with strict gates (see [catalog](#full-intake-platform-catalog-24-options)).

---

## Full intake platform catalog (24 options)

Every row is a touchpoint customers can select in Step 1. The matrix must be able to recommend **each** when appropriate — tier controls **priority**, not eligibility.

### Social (7)

| ID | UI label | Tier | Role (plain language) | Recommend when (summary) | Usually not for |
|----|----------|------|------------------------|---------------------------|-----------------|
| `facebook` | Facebook | **1** | Broadest SMB social reach; community + events | Missing and segment uses social; local/community (S1, S5) | Pure B2B expert with no consumer audience |
| `instagram` | Instagram | **1** | Visual brand, discovery, DMs | Missing; food, retail, creative, makers (S1, S3, S6) | — |
| `tiktok` | TikTok | **2** | Short video; younger audiences; momentum | Food, retail, creative, audience_growth; under ~45 audience | Professional services, established conservative brands |
| `pinterest` | Pinterest | **1**† | Visual **search** for gifts, home, style | S6 makers, S3 wedding/home niches, giftable S1 retail | B2B legal, trades emergency search |
| `youtube` | YouTube | **2** | Long-form trust, how-to, proof | Education, trades explainers, product demos | Single-location café with no video capacity |
| `linkedin` | LinkedIn | **3** | **B2B** networking, hiring, expert credibility | S2 **only** when B2B professional industry + `lead_gen` / credibility goal | Food, retail walk-in, trades, most nonprofits, S6 shops |
| `threads` | Threads | **3** | Casual text social; low SMB adoption | Rarely lead Expand; optional if already on Meta ecosystem | Default recommendation for any segment |

### Online directory (6)

| ID | UI label | Tier | Role | Recommend when | Usually not for |
|----|----------|------|------|----------------|-----------------|
| `google_business` | Google | **1** | Primary local discovery (Maps/Search) | See social table — **always first directory** if local | Remote-only with no service area |
| `yelp` | Yelp | **1**† | Reviews for local services & food | S1 food, S4 trades — after Google claimed, often R2 | B2B remote consulting |
| `apple_maps` | Apple Maps | **2** | Secondary maps (iPhone users) | After `google_business` claimed; local physical | Before Google exists |
| `nextdoor` | Nextdoor | **2** | Neighborhood word-of-mouth | S4 residential trades, S5 local nonprofit | National online-only brands |
| `bing_places` | Bing Places | **3** | Secondary search engine listings | Optional “also claim Bing” in depth/overflow; not Quick Start R1 | As first recommendation |
| `tripadvisor` | TripAdvisor | **3** | Tourism / hospitality reviews | S1 **only** if tourism/hospitality sub-type (hotel, tour, destination dining) | Neighborhood café, law firm |

### Marketplace (8)

| ID | UI label | Tier | Role | Recommend when | Usually not for |
|----|----------|------|------|----------------|-----------------|
| `marketplace_storefront` | Etsy | **1** (S6) | Handmade / creative commerce | S6 default shop; social-only makers | Law, trades |
| `amazon_storefront` | Amazon | **2** | Mass retail discovery | Product-led retail, established SKU business | Local services |
| `shopify_marketplace` | Shop | **2** | Owned storefront (Shopify) | S6 scaling off Etsy/social; `direct_sales` | — |
| `ebay_storefront` | eBay | **3** | Auction / resale | Collectibles, resale, parts (niche) | Brand-new local café |
| `depop_store` | Depop | **3** | Fashion resale / vintage | Apparel makers, Gen Z fashion | B2B services |
| `poshmark_store` | Poshmark | **3** | Apparel resale | Fashion-only sellers | — |
| `walmart_marketplace` | Walmart | **3** | Mass marketplace scale | Existing wholesale SKU ops | Solo local services |
| `faire_wholesale` | Faire | **3** | Wholesale to retailers | Makers selling B2B wholesale | Consumer-facing café |

### Owned channel (3)

| ID | UI label | Tier | Role | Recommend when | Usually not for |
|----|----------|------|------|----------------|-----------------|
| `website` | Website | **1** | Credibility, conversion, menu/booking | Most segments if missing | — |
| `email_newsletter` | Email newsletter | **1** | Retention, owned audience — you own the list | Most segments after `website` (or with it); S2 online, S5 donors | Pure discovery play with no site yet (defer one week) |
| `blog` | Blog | **3** | SEO + depth over time | Content/education businesses willing to write | “Just need logo and Instagram” |

### Tier summary (cross-platform)

† **Segment-gated Tier 1:** `yelp`, `pinterest` — full Tier 1 priority only where the segment table says so; otherwise Tier 2.

| Tier | Count | IDs |
|------|-------|-----|
| **1** | 8 universal + 2 gated | **Universal:** `website`, `email_newsletter`, `google_business`, `facebook`, `instagram`, `marketplace_storefront` (S6-primary). **Gated:** `yelp` (S1 food, S4), `pinterest` (S1 giftable retail, S3, S6) |
| **2** | 7 | `tiktok`, `youtube`, `apple_maps`, `nextdoor`, `amazon_storefront`, `shopify_marketplace` (+ `yelp` / `pinterest` outside gated segments) |
| **3** | 10 | `linkedin`, `threads`, `bing_places`, `tripadvisor`, `blog`, `ebay_storefront`, `depop_store`, `poshmark_store`, `walmart_marketplace`, `faire_wholesale` |

**Research basis (SMB adoption, directional):** Email is among the **highest-ROI owned channels** (~52%+ SMB use; often cited as top retention/conversion after website). Facebook ~71–86% and Instagram ~62–79% for social; **Yelp** still matters for food and home services review behavior even when Google leads; **Pinterest** behaves like visual search for makers and gift retail. Google dominates local “near me.” LinkedIn remains **B2B subset** only. Sources: [ElectroIQ SMB social 2025](https://electroiq.com/stats/social-media-for-business-statistics/), [Gitnux SMB social](https://gitnux.org/small-business-social-media-statistics/), [Zipdo marketing channels](https://zipdo.co/small-business-marketing-budget-statistics/).

### Tier 1 core — first six recommendation slots (system queue)

After `excludeSelected`, the engine fills **up to six** positions from segment-ordered Tier 1, then Tier 2, then gated Tier 3. **PDF:** positions 1–2 only. **Overflow / Week 4:** 3–6 prefer remaining **Tier 1** before dropping to Tier 2.

| Slot | Default priority (reordered per segment) | Skip when |
|------|------------------------------------------|-----------|
| 1 | `website` **or** `google_business` (local discovery first for S1/S4) | Already selected |
| 2 | The other of website / Google | Segment ineligible (e.g. S2 `online_only` → no Google) |
| 3 | `email_newsletter` | Already selected; defer if no `website` and segment is S2/S6 commerce-only (optional soft gate) |
| 4 | Missing **Tier 1 social** (`instagram` / `facebook`) | Both selected |
| 5 | **`yelp`** (S1 food, S4) **or** **`pinterest`** (S3, S6, giftable S1) **or** `marketplace_storefront` (S6) | Gate fails |
| 6 | Second slot from row 5 **or** `email_newsletter` if slot 3 was skipped **or** remaining T1 (`marketplace_storefront`, extra social) | — |

**Rationale:** Owned channels (`website`, `email`) and local proof (`Google`, `Yelp`) outrank “nice to have” social experiments (`tiktok`) in the **first six** system slots — even though Quick Start still **displays** only two Expand lines.

**Audit gap (previous v1):** The first matrix draft did **not** assess all 24 intake options — it jumped to segment R1/R2 with implicit platforms and a short “blocklist.” This section is the complete inventory.

### Where each intake option is assessed

| Bucket | All 24 IDs assessed in |
|--------|-------------------------|
| Catalog (tier + when / not) | Every row in tables above |
| Segment tier queues | S1–S6 sections — ordered missing-ID queues |
| Gates / overflow | LinkedIn, TripAdvisor, niche marketplaces, `considerLater` |

| ID | Primary segment(s) | Typical tier in Quick Start |
|----|-------------------|----------------------------|
| `facebook`, `instagram` | S1, S5, S6 | 1 |
| `google_business` | S1, S4, S5 (physical), S2 (local office) | 1 |
| `website` | All | 1 |
| `marketplace_storefront` | S6 | 1 (S6) |
| `email_newsletter` | All (esp. S2, S5) | 1 |
| `yelp` | S1 food, S4 | 1† |
| `pinterest` | S1 giftable, S3, S6 | 1† |
| `tiktok`, `youtube` | S1, S3, S6 | 2 |
| `apple_maps`, `nextdoor` | S1, S4, S5 | 2 |
| `amazon_storefront`, `shopify_marketplace` | S6 | 2 |
| `linkedin` | S2, S3 (B2B), S5 (rare) | **3** |
| `threads`, `bing_places`, `blog` | Any (overflow) | 3 |
| `tripadvisor` | S1 hospitality gate | 3 |
| `ebay`, `depop`, `poshmark`, `walmart`, `faire` | S6 category gates | 3 |

Nothing in intake is “never recommend” — only **lower priority** or **gated** until context fits.

---

## Intake → segment routing

| Segment | `step1.industry` values | Primary signals |
|---------|-------------------------|-----------------|
| **S1 — Food & retail (walk-in)** | `food_beverage`, `retail` | Requires physical customer access — see operating model gate below |
| **S2 — Professional services** | `legal_professional_services`, `consulting_coaching`, `finance`, `education`, `technology` | B2B / expertise-led; remote or relationship selling |
| **S3 — Creative & portfolio** | `creative_services`, `photography_media` | Visual proof, portfolio, founder-led marketing |
| **S4 — Trades & home services** | `home_services`, `construction_trades`, `automotive` | Local service area, trust, reviews, “near me” |
| **S5 — Nonprofit & community** | `nonprofit_community` | Mission, programs, volunteers/donors; local discovery if public address |
| **S6 — Ecommerce & maker** | `retail` (online-only), any industry with **marketplace-first** touchpoint | Shop/listing discovery, visual search, owned checkout |

**Not in v1 matrix (add in pass 2):** `health_wellness`, `beauty_personal_care`, `fitness_sports`, `pet_services`, `real_estate`, `other` — see [Extensions](#extensions-after-sign-off).

**Physical vs online gate (S1 vs S6 for `retail`):**

| `businessOperatingModel` | Route `retail` to |
|--------------------------|-----------------|
| `customer_visits_us`, `mostly_events_or_markets` | **S1** |
| `hybrid` (retail with storefront) | **S1** (recommend owned web second; not marketplace) |
| `online_only`, `we_travel_to_customers` (mobile retail rare) | **S6** |

---

## Global operating-model overlay

Applied **after** segment defaults; can promote or demote recommendations.

| Operating model | Promote (if missing) | Demote / skip |
|-----------------|----------------------|---------------|
| `customer_visits_us` | `google_business` → **R1** for S1, S4, S5 (physical) | — |
| `we_travel_to_customers` | `google_business` (service area), `website` | Yelp before Google for trades (optional R2) |
| `online_only` | `website`, `email_newsletter` (Tier 1 core slots 1–3) | `google_business` for S2 pure remote |
| `retention` (goal) | Promote `email_newsletter` to slot 3 in Tier 1 core | — |
| `hybrid` | `google_business` if any physical leg; else segment default | — |
| `mostly_events_or_markets` | `instagram` or `facebook` if none selected; `google_business` for event hours | Heavy marketplace push |

---

## Global goal overlay

Adjusts **wording** and **second-slot** priority; does not override S1 physical → Google rule.

| `primaryGoal` | Expand emphasis |
|---------------|-----------------|
| `lead_gen` | Discovery surfaces (Google, website) — “so inquiries find you”; LinkedIn only if Tier 3 gates pass |
| `direct_sales` | Shop/listing/website checkout — “so buying is obvious” |
| `audience_growth` | **Fewer** Expand rows; prefer zero–one recommendation |
| `retention` | **`email_newsletter` Tier 1** — often R2 when `website` selected; competes with Yelp/Pinterest only when segment-gated |

---

## S1 — Food & retail (walk-in)

**Examples:** Café, bakery, restaurant, boutique with storefront, tasting room.  
**Research basis:** Local food discovery is dominated by **Google Maps / GBP** for high-intent “near me” visits; social drives vibe and loyalty but rarely replaces maps for first visit ([restaurant local SEO summaries](https://magnt.com/blog/brand-rollout-plan-30-60-90), [GBP for restaurants](https://restaurantvelocity.com/blog/google-business-profile-restaurant/)).

### Tier queue (S1, missing only)

| Priority | ID |
|----------|-----|
| T1 | `google_business` (if physical / walk-in) |
| T1 | `website` |
| T1 | `email_newsletter` (loyalty, catering list, regulars) |
| T1 | `facebook` or `instagram` (whichever social missing; prefer missing visual platform) |
| T1 | `yelp` (`food_beverage`, sit-down / review-driven) |
| T1 | `pinterest` (giftable `retail`, bakery, boutique — not default for quick-service café) |
| T2 | `tiktok` (younger demographic / audience_growth) |
| T2 | `apple_maps` |
| T3 | `tripadvisor` (tourism/hospitality gate only) |

### Matrix (typical R1 / R2)

| Customer selected (typical) | R1 | R2 |
|---------------------------|----|----|
| Social only (IG, FB, TikTok) | `google_business` | `website` |
| Social + `website` | `google_business` | `email_newsletter` or `yelp` |
| `google_business` only | `instagram` or `facebook` | `website` |
| Marketplace only (pop-up / Etsy + physical) | `google_business` | `instagram` |

### Why lines (plain language)

| Touchpoint | Why line |
|------------|----------|
| `google_business` | Most people check **Google Maps** for hours, directions, and reviews before they visit — even if they found you on social. |
| `website` | A simple site or menu page helps people who want allergens, catering, or booking without scrolling your feed. |
| `email_newsletter` | An **email list** lets you tell regulars about hours, specials, and events without fighting social algorithms. |
| `yelp` | For sit-down food businesses, some guests still read **Yelp** reviews before their first visit — worth claiming after Google. |
| `pinterest` | **Pinterest** helps gift and style shoppers discover bakeries, boutiques, and makers before they visit. |

### Worked example — coffee shop, IG + Facebook only

- **Execute W1–2:** Instagram + Facebook only.  
- **Expand W3:** `google_business` — *“Worth adding when you’re ready: a Google Business Profile so your hours, address, and photos show in Maps and Search.”*  
- **Expand W4 (optional R2):** `website` or `email_newsletter` (regulars / catering) — `yelp` in `considerLater` (slots 3–6) for sit-down restaurants.

---

## S2 — Professional services

**Examples:** Law, accounting, consulting, coaching, agency, SaaS services, training.  
**Research basis:** **Website** = credibility and conversion for almost all professional firms. **Google** when there is a local office or service area. **LinkedIn** is powerful for **B2B professional** subsets but is **Tier 3** here — not a default second slot for every lawyer or coach ([B2B lead gen 2026](https://www.involvedigital.com/insights/b2b-lead-generation-professional-services-2026)).

### Tier queue (missing IDs only, in order)

| Priority | ID | When included |
|----------|-----|-------------|
| T1 | `website` | Almost always if missing |
| T1 | `google_business` | `customer_visits_us`, `hybrid`, `we_travel_to_customers` |
| T1 | `email_newsletter` | After site (or R2 when `online_only`); nurture + retention |
| T2 | `facebook` | Consumer-facing pros (tax prep, financial advisor local) |
| T2 | `youtube` | `education`, training, complex services |
| T3 | `linkedin` | **Gate:** industry ∈ {`legal_professional_services`, `consulting_coaching`, `finance`, `technology`} **and** (`solo_expert` narrator **or** `lead_gen`) **and** not `audience_growth`-only |
| T3 | `instagram` | Consumer-facing creative pros only — rare in S2 |

**Quick Start display:** first two from queue → usually **`website` + `google_business`** (if local) or **`website` + `email_newsletter`** (if `online_only`). **LinkedIn** never R1/R2 — Tier 3 overflow only after Tier 1 core slots 1–6 satisfied.

### Matrix (simplified R1 / R2 for PDF)

| Operating model | R1 | R2 | Third+ (overflow / depth) |
|-----------------|----|----|---------------------------|
| `online_only` | `website` | `email_newsletter` | `facebook`, then `linkedin` if B2B gate |
| `hybrid` / local office | `website` | `google_business` | `email_newsletter`, `linkedin` if B2B gate |
| `customer_visits_us` | `website` | `google_business` | `apple_maps`, `bing_places` |
| `we_travel_to_customers` | `website` | `google_business` | — |

### Why lines

| Touchpoint | Why line |
|------------|----------|
| `website` | Clients almost always check a **website** before they reach out — yours should match the guide’s Summary and Voice. |
| `google_business` | If clients visit an office, **Google** helps “near me” searches show your hours and location. |
| `linkedin` | **If you sell to other businesses or professionals**, LinkedIn can reinforce credibility — optional after your site is solid. |
| `email_newsletter` | An **email list** helps you stay in touch with prospects who aren’t ready to hire yet. |

### Worked example — pc05 legal, LinkedIn only

- **Execute:** LinkedIn only.  
- **Expand R1:** `website` (Tier 1).  
- **Expand R2:** `email_newsletter` (Tier 1 owned) — **not** a second social platform by default.  
- **LinkedIn:** already selected — do not recommend again.  
- **Do not** recommend Google (`online_only`, no walk-in office).

---

## S3 — Creative & portfolio

**Examples:** Designer, photographer, studio, agency, videographer.  
**Research basis:** **Portfolio website** = hiring standard; **Instagram** = discovery and process; **Pinterest** for visual search niches ([portfolio vs social](https://elyspace.com/blog/importance-of-portfolio-website-for-freelancers-and-creators/)).

### Tier queue (S3)

| Priority | ID |
|----------|-----|
| T1 | `website` |
| T1 | `instagram` (if missing) |
| T1 | `pinterest` (visual search niches) |
| T1 | `email_newsletter` (inquiries, waitlist, client updates) |
| T2 | `tiktok` (process / reels) |
| T2 | `youtube` (portfolio films) |
| T3 | `linkedin` | B2B creative agencies only (`creative_services` + commercial client gate) |
| T3 | `google_business` | Studio with walk-in appointments only |

### Matrix (typical R1 / R2)

| Selected pattern | R1 | R2 |
|------------------|----|----|
| Instagram only | `website` | `pinterest` |
| Instagram + TikTok | `website` | `pinterest` |
| `website` only | `instagram` | `facebook` or `tiktok` |
| Marketplace (creative goods) | Route to **S6** | — |

### Why lines

| Touchpoint | Why line |
|------------|----------|
| `website` | A **portfolio site** (or strong portfolio page) lets clients see case studies — not just your latest posts. |
| `instagram` | **Instagram** fits showing work-in-progress and style when you don’t post there yet. |
| `pinterest` | **Pinterest** works like visual search — useful if clients plan weddings, interiors, or gifts. |
| `linkedin` | **LinkedIn** helps when your clients are businesses hiring creatives, not consumers. |

### Operating model

| Model | Add |
|-------|-----|
| `customer_visits_us` (studio) | `google_business` as R2 — “so clients can find your studio location” |

---

## S4 — Trades & home services

**Examples:** Plumber, electrician, HVAC, landscaper, cleaner, auto shop.  
**Research basis:** **GBP** is primary lead channel for home services; citations and reviews matter; Nextdoor optional ([contractor GBP guides](https://watsonco.marketing/blog/2026/04/google-business-profile-contractors-guide/)).

### Tier queue (S4)

| Priority | ID |
|----------|-----|
| T1 | `google_business` |
| T1 | `website` |
| T1 | `yelp` |
| T1 | `email_newsletter` (repeat customers, seasonal reminders) |
| T2 | `nextdoor` |
| T2 | `facebook` |
| T2 | `apple_maps` |
| T3 | `bing_places` |
| T3 | `youtube` (how-to / trust videos) |

### Matrix (typical R1 / R2)

| Selected pattern | R1 | R2 |
|------------------|----|----|
| Social only | `google_business` | `website` |
| `google_business` only | `website` | `yelp` |
| `website` only | `google_business` | `yelp` or `nextdoor` |

### Why lines

| Touchpoint | Why line |
|------------|----------|
| `google_business` | Homeowners often search **“near me” on Google** — your profile is where calls and directions start. |
| `website` | A short **website** with services, service area, and proof photos backs up what Google shows. |
| `yelp` | Some homeowners still check **Yelp** for trades — worth claiming if you serve residential clients. |
| `nextdoor` | **Nextdoor** can help local neighborhoods find you when you do residential work. |

### Industry notes

| Industry | R2 preference |
|----------|---------------|
| `automotive` | `google_business` + `website`; optional `yelp` |
| `construction_trades` | Photos of completed jobs on GBP; `website` for commercial bids |
| `home_services` | `yelp` Tier 1; `nextdoor` Tier 2 — pick one for **PDF R2**, both can appear in slots 3–6 |

---

## S5 — Nonprofit & community

**Examples:** Food bank, community org, arts nonprofit, mutual aid, local charity.  
**Research basis:** **Website** = programs + donate/volunteer; **GBP** for local service discovery; **Facebook** for community; email for retention ([nonprofit local SEO](https://laurelweb.co/blog/seo-for-nonprofits), [local nonprofit marketing](https://strategicconnection.net/local-nonprofit-marketing)).

### Tier queue (S5)

| Priority | ID |
|----------|-----|
| T1 | `website` |
| T1 | `email_newsletter` |
| T1 | `facebook` (if missing) |
| T1 | `google_business` (if physical programs / distribution site) |
| T2 | `instagram` |
| T2 | `nextdoor` (local programs) |
| T3 | `linkedin` | Workforce / corporate partners only — rare |

### Matrix (typical R1 / R2)

| Selected pattern | R1 | R2 |
|------------------|----|----|
| Facebook only | `website` | `google_business` (if physical) |
| `website` only | `facebook` | `google_business` (if physical) |
| Social + website | `google_business` (if physical) | `email_newsletter` (Tier 1 — donors/volunteers) |

### Physical gate

Recommend `google_business` only when **any** of:

- `businessOperatingModel` ∈ `customer_visits_us`, `hybrid`, `mostly_events_or_markets`
- Programs mention distribution site / food access / walk-in (future: structured field)
- User selected any `online_directory` touchpoint

Otherwise: R1 = `website`, R2 = `facebook` or `email_newsletter`.

### Why lines

| Touchpoint | Why line |
|------------|----------|
| `google_business` | People searching for **local help** (food, shelter, services) often start on **Google Maps**. |
| `website` | A clear **website** helps donors and volunteers understand programs and take action. |
| `facebook` | **Facebook** still works for community updates, events, and sharing impact stories. |
| `email_newsletter` | An **email list** helps you reach supporters without relying on algorithms. |

### Fix for current generator issue

`community-org` (Facebook + website, hybrid): **R1** = `google_business` (hybrid + food access story) is correct — keep in **Expand** with physical-program *why*, not buried in Week 3 visual checklist without label.

---

## S6 — Ecommerce & maker

**Examples:** Etsy/Amazon shop, handmade goods, POD, Depop, Shopify.  
**Research basis:** **Pinterest** = visual search traffic to shops; **Instagram** = brand; owned **website** when scaling off marketplace ([Etsy + Pinterest](https://help.erank.com/blog/9-steps-for-marketing-your-etsy-shop-on-pinterest/)).

### Tier queue (S6)

| Priority | ID |
|----------|-----|
| T1 | `marketplace_storefront` (Etsy) if no shop |
| T1 | `website` |
| T1 | `instagram` |
| T1 | `pinterest` |
| T1 | `email_newsletter` (launch list, repeat buyers) |
| T2 | `tiktok` |
| T2 | `shopify_marketplace` |
| T2 | `amazon_storefront` (scaled product) |
| T3 | `depop_store`, `poshmark_store`, `ebay_storefront`, `faire_wholesale`, `walmart_marketplace` | Category-specific |
| T3 | `google_business` | Pop-up / studio pickup only |

### Matrix (typical R1 / R2)

| Selected pattern | R1 | R2 |
|------------------|----|----|
| Marketplace + Instagram | `pinterest` | `website` |
| Marketplace only | `instagram` | `pinterest` |
| Instagram only (no shop) | `marketplace_storefront` | `website` |
| `website` + Instagram | `pinterest` | `tiktok` or `shopify_marketplace` |

### Marketplace-first intake

If `touchpoints[0]` bucket = `marketplace`, treat as **S6** regardless of `solo_expert` narrator (already in code for cluster).

### Why lines

| Touchpoint | Why line |
|------------|----------|
| `pinterest` | **Pinterest** works like a search engine for gift and style ideas — strong for driving shop views over time. |
| `instagram` | **Instagram** helps people follow your brand between new listings or drops. |
| `website` | Your own **website** lets you own customer relationships outside marketplace fees. |
| `marketplace_storefront` | An **Etsy/shop** profile gives buyers a trusted place to browse and buy if you only post on social today. |

### Goal tweaks

| Goal | Emphasis |
|------|----------|
| `direct_sales` | R1 pinterest or shop clarity — not “consult/quote” |
| `lead_gen` | Rare for pure S6; use `website` capture |

---

## LinkedIn recommendation gates (explicit)

Recommend `linkedin` in Expand **only if all** pass:

1. Not already in `step1.touchpoints`.
2. Segment **S2** (professional services) **or** S3 with B2B-agency gate **or** S5 workforce/corporate partners (rare).
3. Industry ∈ `legal_professional_services`, `consulting_coaching`, `finance`, `technology`, `education` (B2B training) — **not** default for `creative_services` unless commercial-client gate.
4. **Not** industry ∈ `food_beverage`, walk-in `retail`, `home_services`, `construction_trades`, `automotive`, `nonprofit_community` (default).
5. `primaryGoal` ∈ `lead_gen`, `give_clear_direction` — skip for pure `audience_growth` unless LinkedIn already selected.
6. Tier 1 queue for that customer already satisfied (`website` recommended or selected) — **LinkedIn is never Quick Start R1.**

**Product copy:** *“If most of your clients are other businesses, LinkedIn can support credibility — after your website and core profiles are in place.”*

---

## Platforms we rarely lead in Quick Start R1/R2

These stay **recommendable** (Tier 3 or `considerLater`) — we do **not** ban IDs:

| ID | Why we rarely lead Quick Start |
|----|--------------------------------|
| `linkedin` | B2B niche; see gates above |
| `threads` | Low SMB adoption; redundant with Instagram/Facebook for most |
| `bing_places` | Follow-on after Google, not first discovery |
| `blog` | Long commitment; better in depth Voice/SEO docs |
| `tripadvisor` | Narrow hospitality slice of S1 |
| Secondary marketplaces (`ebay`, `depop`, `poshmark`, `walmart`, `faire`) | Category-specific (S6 gates) |

**Not in intake:** `snapchat` and other channels are out of scope until added to `touchpoints.ts`.

**Narrator fallback is not a recommendation** — never use `primary_channels` from narrator profile as Expand IDs.

---

## Recommendation resolution algorithm (for implementation)

```text
function recommendableTouchpointQueue(form): TouchpointId[]
  segment = resolveSegment(form)
  queue = SEGMENT_TIER_QUEUES[segment]     // ordered T1 → T2 → T3 IDs
  queue = applyOperatingModelPromotions(queue, form)  // e.g. visit-us → google first
  queue = applyGoalResort(queue, form)     // direct_sales → shop/marketplace up
  queue = filterTier3Gates(queue, form)    // linkedin, tripadvisor, niche marketplaces
  return excludeSelected(queue, form.step1.touchpoints)

function quickStartExpandRecommendations(form): { r1, r2, considerLater }
  queue = recommendableTouchpointQueue(form)
  tier1Core = queue.filter(isTier1ForSegment(form))       // up to 6 slots — see Tier 1 core table
  if audience_growth_cap(form): tier1Core = maybeCapToOne(tier1Core)  // unless google T1 local
  return {
    r1: tier1Core[0],
    r2: tier1Core[1],
    considerLater: tier1Core.slice(2, 6).concat(queue.slice(6)),  // slots 3–6 = remaining T1, then T2/T3
  }
```

- **`considerLater`:** positions **3–6** draw from remaining **Tier 1** (`email`, `yelp`, `pinterest`, etc.) before Tier 2 — satisfies “recommend all platforms” without checklist overload.
- Each ID: `whyLine[id]` from [catalog](#full-intake-platform-catalog-24-options) + segment override.

### Code matrix shape (implemented scaffold)

`quickStartRecommendations.ts` now uses a matrix-shaped routing scaffold (`SEGMENT_MATRIX`) so the routing rules are data-first:

- `industryGroups`: maps industry families to S1–S6
- `retailByOperatingModel`: splits `retail` into S1 vs S6
- `otherByNarrator`: routes `other` by narrator first
- `otherLocalOperatingModels`: local fallback to S4 for `other`

This keeps pass-2 depth additive (append row/rule) instead of branching ad hoc conditionals.

### Subtype layer (implemented)

On top of segment routing, `quickStartRecommendations.ts` now applies a subtype priority layer:

- `beauty_local_service` vs `beauty_online_portfolio`
- `wellness_local_clinic`
- `fitness_local_studio`
- `pet_local_service`
- `real_estate_local`
- `other_local_service` / `other_digital_default`

Each subtype can reorder Tier 1/Tier 2 priorities (e.g., local beauty promotes Google + website ahead of Pinterest), while still honoring selected-touchpoint exclusion and global caps.

Second-pass subtype depth now also covers existing segments:

- **S1 food local:** review-driven (`google` + `yelp` early) vs social-first variants
- **S2 professional:** online B2B expert (`linkedin` promoted after website/email) vs local advisor (`google` + website)
- **S6 commerce:** marketplace-first (Etsy/marketplace -> Instagram/Pinterest first) vs DTC-first (website/email first)

---

## Segment × operating model (quick reference)

| Segment | Physical / local (`customer_visits_us`, hybrid) | `online_only` |
|---------|---------------------------------------------------|---------------|
| **S1** | T1 core: Google → website → email → social → Yelp (food) / Pinterest (gift retail) | T1: website → email → Instagram/Facebook |
| **S2** | T1: website → Google → **email** | T1: website → **email** (not LinkedIn) |
| **S3** | T1: website → Instagram → Pinterest → email | same |
| **S4** | T1: Google → website → **Yelp** → email | T1: website → Google → email |
| **S5** | T1: website → **email** → Facebook → Google (physical) | T1: website → email → Facebook |
| **S6** | T1: shop → website → Instagram → **Pinterest** → email | T1: shop → website → **Pinterest** → email |

---

## Expand copy templates (by bucket)

| Bucket | Template |
|--------|----------|
| `online_directory` | **Worth adding when you’re ready:** claim or complete your **{label}** listing so {why} — use the same photos and short description as {primarySelected}. |
| `social` | **Worth adding when you’re ready:** set up **{label}** so people who discover you on {primarySelected} can follow your work there too. |
| `owned_channel` | **Worth adding when you’re ready:** a simple **{label}** {why} — you can start with one page from your guide Summary. |
| `marketplace` | **Worth adding when you’re ready:** open a **{label}** shop so buyers have a clear place to purchase, not just DM requests. |

**Imperative forbidden** when ID ∉ touchpoints: no “Update your Google cover” → use “Claim or complete…”

---

## Week placement (recap)

| Week | Selected | Recommended |
|------|----------|-------------|
| 1–2 | 100% | None (optional footnote in W1 lead: “Later weeks may suggest other high-impact channels.”) |
| 3 | Execute visual on selected | **Also worth setting up** — 1–2 lines |
| 4 | Audit selected | **Worth adding when you’re ready** — same 1–2 lines if not done + audit selected |

---

## Review checklist (for product sign-off)

For each segment, confirm:

- [ ] **All 24** intake touchpoints appear in the [catalog](#full-intake-platform-catalog-24-options) with tier + “recommend when” — none are hard-blocked
- [ ] Each segment **tier queue** can surface any ID in that segment when gates pass (overflow via `considerLater`)
- [ ] R1/R2 choices match how a **non-marketer** in that business would nod along
- [ ] Coffee shop / IG-only → Google in Expand, not Week 1
- [ ] Lawyer LinkedIn-only → **website** in Expand R1, **not** Google (online_only) and **not** a second LinkedIn nudge
- [ ] LinkedIn is **not** default R2 for broad professional services — only after website + B2B gates
- [ ] **Email** surfaces in Tier 1 core (slots 3–6 or R2) for S2 online, S5, and post-website S1/S4 — not buried in Tier 2
- [ ] **Yelp** / **Pinterest** only lead when segment gates match (food/trades vs makers/creative)
- [ ] Etsy shop → Pinterest or website, not lead-gen consult language
- [ ] `audience_growth` does not pile on three new channels
- [ ] Copy is advisory, bucket-correct, ≤2 recommendations on the PDF; full queue available in product logic

---

## Extensions (pass-2 routing implemented)

| Pack | Industries | Routing + likely R1/R2 themes |
|------|------------|------------------------------|
| **Health & wellness** | `health_wellness`, `fitness_sports` | Route to **S4** (local service trust): Google + website; email as next tier |
| **Beauty / personal care** | `beauty_personal_care` | Route to **S3** (visual/portfolio): website + Instagram/Pinterest |
| **Real estate** | `real_estate` | Route to **S4**: Google + website; keep Yelp de-prioritized for this subcase |
| **Pet services** | `pet_services` | Route to **S4**: Google + website; Nextdoor as local follow-on |
| **`other`** | `other` | Route by narrator + operating model: `mission_community` → S5, `product_led`/marketplace-first → S6, `solo_maker` → S3, local operating models → S4, else S2 |

---

## Research log (external)

| Segment | Sources consulted |
|---------|-------------------|
| S1 | Magnt 30/60/90; restaurant GBP guides; Instagram vs Google budget split articles |
| S2 | Involve Digital B2B professional services 2026; Searchlab service channel ROI table |
| S3 | Portfolio website guides; Instagram for creatives |
| S4 | Contractor GBP optimization (Watson, BKND, SevenWired) |
| S5 | Laurel Web nonprofit SEO; Strategic Connection local nonprofit |
| S6 | eRank / Pintzy Etsy + Pinterest guides |

---

## Changelog

| Date | Note |
|------|------|
| 2026-05-27 | v1 matrix: six segments, OM + goal overlays, blocklist, algorithm sketch, copy templates |
| 2026-05-27 | v1.1: full 24-touchpoint catalog; Tier 1/2/3; LinkedIn demoted to Tier 3 + gates; `considerLater` queue |
| 2026-05-27 | v1.2: `email_newsletter` universal Tier 1; `yelp` / `pinterest` segment-gated Tier 1; **Tier 1 core** first-six slot logic; segment queues S1–S6 updated |
| 2026-05-27 | Phase B: `inferQuickStartExpandRecommendations`, Weeks 3–4 Expand block, `resolvePriorityChannelPlan` (no narrator fallback when touchpoints set) |
| 2026-05-28 | Pass-2 routing in code: explicit handling for `health_wellness`, `beauty_personal_care`, `fitness_sports`, `pet_services`, `real_estate`, `other` |
