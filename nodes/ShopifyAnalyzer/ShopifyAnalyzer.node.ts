import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// Apify actor that does the real work (runs server-side, billed pay-per-event).
const ACTOR_ID = 'apivault_labs~shopify-store-analyzer';

export class ShopifyAnalyzer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shopify Store Analyzer',
		name: 'shopifyAnalyzer',
		icon: 'file:shopifyanalyzer.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["storeUrls"]}}',
		description:
			'Spy on any Shopify store: estimated revenue, traffic, brand age, tech stack, tracking IDs, promo codes, dropshipper risk, international expansion and 40+ derived signals.',
		defaults: {
			name: 'Shopify Store Analyzer',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'apifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Shopify Store URLs',
				name: 'storeUrls',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				required: true,
				placeholder: 'https://allbirds.com',
				description:
					'One or more Shopify store homepages (max 100 per run). Bare domains or full URLs. Separate multiple with a new line or comma.',
			},
			{
				displayName: 'Competitor Comparison Report (Premium)',
				name: 'generateComparison',
				type: 'boolean',
				default: false,
				description:
					'Whether to add a single cross-store benchmarking report when analyzing 2+ stores (rankings by traffic, revenue, AOV, discounting, expansion, shared tech). Billed once per run as a separate premium event, only when a report is produced.',
			},
			{
				displayName: 'Revenue Estimate Settings',
				name: 'revenueSettings',
				type: 'collection',
				placeholder: 'Add Setting',
				default: {},
				options: [
					{
						displayName: 'Conversion Rate (%)',
						name: 'conversionRate',
						type: 'number',
						typeOptions: { minValue: 0.1, maxValue: 10, numberPrecision: 2 },
						default: 2.5,
						description:
							'Used in revenue formula visits × CR × AOV. Industry default 2.5%. Fashion 1.5-2%, electronics 1%, impulse-buy 3-4%.',
					},
					{
						displayName: 'Product Sample Size',
						name: 'productSampleSize',
						type: 'number',
						typeOptions: { minValue: 0, maxValue: 2000 },
						default: 250,
						description:
							'How many products to sample for metrics. 0 = full catalog (hard-capped at 2000 to protect memory).',
					},
				],
			},
			{
				displayName: 'Extraction Layers',
				name: 'extraction',
				type: 'collection',
				placeholder: 'Add Extraction Layer',
				default: {},
				description: 'Toggle the extraction layers. All on-by-default layers run unless disabled here.',
				options: [
					{
						displayName: 'Products & AOV',
						name: 'extractProducts',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract product count, AOV, price range, vendors, types, top tags (niche), duplicate-description ratio',
					},
					{
						displayName: 'Product Velocity',
						name: 'extractVelocity',
						type: 'boolean',
						default: true,
						description: 'Whether to extract new products in last 7/30/90 days and oldest product date',
					},
					{
						displayName: 'Collections',
						name: 'extractCollections',
						type: 'boolean',
						default: true,
						description: 'Whether to extract collection count and top collections',
					},
					{
						displayName: 'Sitemap Counts',
						name: 'extractSitemap',
						type: 'boolean',
						default: true,
						description: 'Whether to extract real total pages/products/collections/blogs from sitemap.xml',
					},
					{
						displayName: 'Traffic (SimilarWeb)',
						name: 'extractTraffic',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract monthly visits, ranks, bounce rate, sources, top countries, keywords',
					},
					{
						displayName: 'Revenue Estimate',
						name: 'extractRevenueEstimate',
						type: 'boolean',
						default: true,
						description:
							'Whether to estimate monthly orders + revenue + annualized figure. Requires Traffic.',
					},
					{
						displayName: 'Tech Stack & Tracking IDs',
						name: 'extractTechStack',
						type: 'boolean',
						default: true,
						description:
							'Whether to detect 60+ Shopify apps (Klaviyo, Judge.me, ReCharge, Gorgias…) plus tracking IDs (GTM, GA4, FB Pixel, TikTok, Hotjar) for brand-network mapping',
					},
					{
						displayName: 'Social Links',
						name: 'extractSocials',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract Instagram/Facebook/Twitter/TikTok/YouTube/Pinterest/LinkedIn handles',
					},
					{
						displayName: 'Contact Info',
						name: 'extractContact',
						type: 'boolean',
						default: true,
						description: 'Whether to extract public emails and phones from the homepage',
					},
					{
						displayName: 'Shopify Meta',
						name: 'extractShopifyMeta',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract myshopify handle, currency, locale, theme, Shopify Plus indicators, CDN store ID (age signal)',
					},
					{
						displayName: 'International Expansion',
						name: 'extractInternational',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract hreflang languages, currency switcher, country selector, expansion score 0-100',
					},
					{
						displayName: 'Reviews Aggregate',
						name: 'extractReviewsAggregate',
						type: 'boolean',
						default: true,
						description: 'Whether to extract Schema.org aggregateRating from the homepage',
					},
					{
						displayName: 'Active Promo / Announcement Bar',
						name: 'extractPromo',
						type: 'boolean',
						default: true,
						description:
							'Whether to extract free-shipping threshold, active promo codes, announcement bar text, current discount %',
					},
					{
						displayName: 'Derived Signals',
						name: 'extractDerivedSignals',
						type: 'boolean',
						default: true,
						description:
							'Whether to compute customer segment, marketing channel mix, dropshipper risk score with reasons',
					},
					{
						displayName: 'Brand Age (Slower)',
						name: 'extractBrandAge',
						type: 'boolean',
						default: false,
						description:
							'Whether to derive brand age + founding year from earliest Wayback snapshot + SSL cert. Off by default — these external lookups are the slowest part of a run.',
					},
				],
			},
			{
				displayName: 'Advanced Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Max Concurrency',
						name: 'maxConcurrency',
						type: 'number',
						typeOptions: { minValue: 1, maxValue: 10 },
						default: 3,
						description: 'Parallel stores to analyze',
					},
					{
						displayName: 'Timeout per Request (Seconds)',
						name: 'timeout',
						type: 'number',
						typeOptions: { minValue: 10, maxValue: 180 },
						default: 30,
						description: 'HTTP timeout per request',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const rawUrls = this.getNodeParameter('storeUrls', i) as string;
				const storeUrls = rawUrls
					.split(/[\n,]+/)
					.map((u) => u.trim())
					.filter((u) => u.length > 0);

				if (storeUrls.length === 0) {
					throw new NodeOperationError(
						this.getNode(),
						'At least one Shopify store URL is required',
						{ itemIndex: i },
					);
				}

				const generateComparison = this.getNodeParameter(
					'generateComparison',
					i,
					false,
				) as boolean;
				const revenueSettings = this.getNodeParameter('revenueSettings', i, {}) as {
					conversionRate?: number;
					productSampleSize?: number;
				};
				const extraction = this.getNodeParameter('extraction', i, {}) as Record<string, boolean>;
				const advanced = this.getNodeParameter('advancedOptions', i, {}) as {
					maxConcurrency?: number;
					timeout?: number;
				};

				const body: Record<string, unknown> = {
					storeUrls,
					generateComparison,
					conversionRate: revenueSettings.conversionRate ?? 2.5,
					productSampleSize: revenueSettings.productSampleSize ?? 250,
					// extraction layers (defaults match the actor's input schema)
					extractProducts: extraction.extractProducts ?? true,
					extractVelocity: extraction.extractVelocity ?? true,
					extractCollections: extraction.extractCollections ?? true,
					extractSitemap: extraction.extractSitemap ?? true,
					extractTraffic: extraction.extractTraffic ?? true,
					extractRevenueEstimate: extraction.extractRevenueEstimate ?? true,
					extractTechStack: extraction.extractTechStack ?? true,
					extractSocials: extraction.extractSocials ?? true,
					extractContact: extraction.extractContact ?? true,
					extractShopifyMeta: extraction.extractShopifyMeta ?? true,
					extractInternational: extraction.extractInternational ?? true,
					extractReviewsAggregate: extraction.extractReviewsAggregate ?? true,
					extractPromo: extraction.extractPromo ?? true,
					extractDerivedSignals: extraction.extractDerivedSignals ?? true,
					extractBrandAge: extraction.extractBrandAge ?? false,
					// advanced
					maxConcurrency: advanced.maxConcurrency ?? 3,
					timeout: advanced.timeout ?? 30,
				};

				const options: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`,
					body,
					json: true,
				};

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'apifyApi',
					options,
				);

				const results = Array.isArray(response) ? response : [response];
				for (const result of results) {
					returnData.push({ json: result, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
