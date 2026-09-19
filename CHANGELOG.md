# Changelog

## 0.1.3

- Added a ready-to-import competitor monitoring workflow.
- Simplified setup by keeping infrastructure settings managed by the Actor.

## 0.1.2

- New options: **Track Changes Between Runs** (competitor monitoring — diff of
  new/removed products, traffic & revenue moves, apps installed, promos) and
  **Deep Contact Crawl** (find an email on the contact/about pages when the
  homepage shows none — better lead contacts).
- The **Competitor Comparison Report** is now included for every multi-store
  run at no extra event (was a separate premium add-on) — on by default.
- Output now also includes store health score, lead score, growth signals,
  best-sellers, Meta Ad Library link, payment/BNPL stack, upsell opportunities
  and primary niche (no node change required — returned by the Actor).

## 0.1.0

- Initial release.
- `Shopify Store Analyzer` node: deep intelligence on any Shopify store,
  9 public data sources combined.
- 40+ derived signals: revenue estimate, traffic (SimilarWeb), products & AOV,
  product velocity, collections, sitemap counts, tech stack (60+ apps) +
  tracking IDs (GTM/GA4/FB Pixel/TikTok/Hotjar), Shopify meta, international
  expansion, reviews aggregate, active promo, socials, contact, customer
  segment, marketing channel mix, dropshipper risk score.
- Optional brand age (Wayback + crt.sh) and premium competitor comparison
  report (billed once per run as a separate event).
- Configurable conversion rate + product sample size for the revenue model.
- `Apify API` credentials with token test against `/users/me`.
- Calls the `apivault_labs/shopify-store-analyzer` actor via
  `run-sync-get-dataset-items`.
