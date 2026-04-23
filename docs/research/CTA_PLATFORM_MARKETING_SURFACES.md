# CTA platform marketing surfaces research (intake coverage)

Purpose: preserve the marketing-surface research used to design in-context CTA frame families, with emphasis on **post/ad formats** (not profile setup checklists).

**Doc split:** this file may use shorthand for product thinking. The **normative shipped contract** for each frame (what appears on the PDF) lives in [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](../guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md) and must stay **screenshot-level** only.

Last updated: 2026-04-23

---

## Scope and method

- Platform universe comes from `packages/shared/src/touchpoints.ts` (`TouchpointId`).
- Focus is format-level marketing surfaces brands use to promote offers, services, products, and lead actions.
- We collapse platform-specific products into reusable shell families for deterministic, agnostic PDF rendering.

---

## Intake platform map (all touchpoints)

### Social

| Touchpoint | Common marketing surfaces (post/ad formats) |
|---|---|
| Instagram | feed post ads, story ads, reel ads, carousel ads, collection/shop formats |
| TikTok | in-feed video ads, Spark/native-post boosts, catalog/shop ad formats |
| LinkedIn | sponsored single image/video/carousel, thought-leader amplification, lead-gen forms |
| Facebook | feed/story/reel ads, carousel, link-preview posts, lead forms |
| YouTube | Shorts ads, in-feed video, in-stream formats, channel/community post promotion |
| Pinterest | standard pin, video pin, carousel pin, shopping pin, promoted pin |
| Threads | text-led posts, visual + text feed posts, promoted placements (region-dependent rollout) |

### Online Directory

| Touchpoint | Common marketing surfaces (post/ad formats) |
|---|---|
| Google Business (`google_business`) | profile posts (`Updates`/`Offers`/`Events`), local ad overlays, local-services lead surfaces |
| Apple Maps (`apple_maps`) | Business Connect showcase cards, action links on place cards |
| Bing Places (`bing_places`) | listing presence + Microsoft local/shop ad overlays (search/local inventory style) |
| Yelp | Yelp Ads placements, Yelp Connect updates, page-upgrade CTA/highlight modules |
| Nextdoor | business posts in neighborhood feed, local deals, display/video/carousel/lead-gen ads |
| TripAdvisor | sponsored placements, business-advantage enhanced listing modules, ad products by vertical |

### Marketplace

| Touchpoint | Common marketing surfaces (post/ad formats) |
|---|---|
| Etsy (`marketplace_storefront`) | Etsy Ads promoted listings, offsite ads |
| Amazon (`amazon_storefront`) | Sponsored Products, Sponsored Brands, sponsored video/store units |
| eBay (`ebay_storefront`) | Promoted Listings standard/advanced |
| Walmart (`walmart_marketplace`) | Sponsored Products, sponsored brand/video surfaces |
| Faire (`faire_wholesale`) | Promoted Listings |
| Depop (`depop_store`) | Boosted Listings |
| Poshmark (`poshmark_store`) | Promoted Closet |
| Shop (`shopify_marketplace`) | Shop Campaigns (Shop + network distribution) |

### Owned channel

| Touchpoint | Common marketing surfaces (post/ad formats) |
|---|---|
| Website | hero promo blocks, feature/promo bands, announcement bars, landing sections |
| Email newsletter | text-first campaigns, hero-image promos, offer/reminder snippets |
| Blog | featured article cards, newsletter capture CTAs, promo modules in content streams |

---

## Shared marketing-post throughlines (cross-platform)

Repeatable **on-screen** shapes when comparing platforms (for deciding how many frame families we need):

1. **Short promo card** — headline area, optional photo, body copy, one primary button or link row.
2. **Sponsored strip on a listing** — small “promoted” context, listing title line, stars or review count, action buttons.
3. **Photo-led unit** — large image first, then copy and CTA (common in map posts and promos).
4. **Lead-first unit** — call, message, book, or form-style ask without a shopping cart.
5. **Extra context line** — hours, distance, or reply-time style line under the title (optional).

These patterns inform which **separate frame ids** we add; they are not labels inside shipped shells.

---

## Directory frame families (visual target)

1. **`directory_post_offer_v1` (shipped)** — looks like a **single post** on a map or neighborhood feed: who posted, recency, short headline placeholders, wide photo strip, one flowing body field, then text actions (e.g. Call · Directions · Website).

2. **`directory_sponsored_listing_v1` (shipped)** — looks like a **listing row or card with paid prominence**: listing title, rating/review line, small sponsored disclosure, thumbnail + snippet placeholders, one merged body field, primary action chip plus a secondary text action. Playbook: [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](../guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).

Shared rules: neutral grays/strokes, one merged caption from backend `lines`, deterministic mapping, no third-party marks.

---

## Website frame families (visual target)

1. **`website_hero_cta_v1` (shipped)** — looks like an **above-the-fold promo hero** on a site or campaign landing page: site title row, wide hero image band, headline placeholders, one merged supporting line, neutral primary chip (e.g. View details). Playbook: [`docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md`](../guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md).

---

## Notes for implementation planning

- Goal-based copy variation remains backend-driven (`linesForSurface` and model composition), not component-specific copy branching.
- Frame variants should represent **surface geometry/chrome differences**, not goal text differences.
- If a platform has many ad products, we still map to the closest shared family unless there is clear repeated mismatch in visual semantics.
