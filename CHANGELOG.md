# Changelog

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
