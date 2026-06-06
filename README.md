# n8n-nodes-apivault-shopify-analyzer

An [n8n](https://n8n.io) community node for the **Shopify Store Analyzer** — deep intelligence on any Shopify store. A direct alternative to StoreLeads.app.

No login. Pay-as-you-go, no monthly subscription. The 9-source analysis runs server-side on [Apify](https://apify.com); this node is a thin connector you drive with your own Apify API token.

Built by **[apivault_labs](https://apify.com/apivault_labs)** — see [all our actors](https://apify.com/apivault_labs).

## What you get per store (40+ derived signals)

- **Revenue estimate** — monthly orders + revenue + annualized (visits × CR × AOV)
- **Traffic** (SimilarWeb) — monthly visits, ranks, bounce rate, sources, top countries, keywords
- **Products & AOV** — count, price range, vendors, types, top tags (niche), duplicate-description ratio
- **Product velocity** — new products in last 7/30/90 days
- **Tech stack & tracking IDs** — 60+ Shopify apps (Klaviyo, Judge.me, ReCharge, Gorgias…) + GTM/GA4/FB Pixel/TikTok/Hotjar for brand-network mapping
- **Shopify meta** — myshopify handle, currency, theme, Plus indicators, CDN store ID (age signal)
- **International expansion** — hreflang, currency/country switcher, expansion score 0-100
- **Active promo** — free-shipping threshold, promo codes, announcement bar, current discount %
- **Socials + contact** — handles, public emails and phones
- **Derived signals** — customer segment, marketing channel mix, **dropshipper risk score**
- Optional **brand age** (Wayback + SSL) and **competitor comparison report**

## Installation

In your n8n instance:

1. Go to **Settings → Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-apivault-shopify-analyzer`
4. Confirm and install

## Credentials

This node uses an **Apify API token**:

1. Create a free account at [apify.com](https://apify.com)
2. Go to **Apify Console → Settings → Integrations** and copy your **API token**
3. In n8n, create new **Apify API** credentials and paste the token

A free Apify account includes monthly usage credits.

## Usage

- **Shopify Store URLs** — one or more store homepages (one per line, or comma-separated; max 100 per run)
- **Competitor Comparison Report** — premium cross-store benchmarking when analyzing 2+ stores (billed once per run as a separate event)
- **Revenue Estimate Settings** — conversion rate, product sample size
- **Extraction Layers** — toggle any of the 15 layers (tech stack, traffic, revenue, promo, brand age…)
- **Advanced** — concurrency, timeout

## Pricing

Billed per store through Apify (pay-per-event): **$10 / 1,000 stores** ($0.01 each). The optional competitor comparison report is billed once per run as a separate premium event, only when a report is produced.

## Use cases

- **Competitor analysis** — benchmark revenue, traffic, AOV and tech against rivals
- **Dropshipping research** — spot dropshipper risk and product velocity
- **B2B prospecting for app/agency vendors** — find stores missing key tools
- **Market research** — segment, channel mix and international expansion at scale

## Resources

- [Shopify Store Analyzer actor on Apify](https://apify.com/apivault_labs/shopify-store-analyzer)
- [All actors by apivault_labs](https://apify.com/apivault_labs)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

## Keywords

`shopify-scraper` `shopify-analyzer` `ecommerce-intelligence` `competitor-analysis` `revenue-estimate` `tech-stack-detection` `storeleads-alternative` `lead-generation` `dropshipping` `n8n` `apify`
