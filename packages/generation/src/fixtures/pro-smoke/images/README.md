# Pro smoke test images

Committed JPEGs for `npm run test:pro-smoke` vision call only. Images are read from disk and sent to Anthropic as base64 (production Brand Audit uses signed Supabase URLs).

| File | Role in smoke test | Source |
|------|-------------------|--------|
| `logo.jpg` | Stand-in for buyer logo upload | [Unsplash — coffee/latte](https://unsplash.com/photos/person-pouring-coffee-on-mug-PO8WohlsYLC) |
| `reference.jpg` | Stand-in for reference mood image | [Unsplash — cafe scene](https://unsplash.com/photos/people-sitting-on-chair-in-front-of-table-while-holding-mugs-during-daytime-ITirOtF4UrM) |

Replace these files if you need different visual fixtures; update `../assets.json` if filenames or media types change.
