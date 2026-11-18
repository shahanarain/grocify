This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Partner and user guide

See [PARTNER_USER_GUIDE.md](PARTNER_USER_GUIDE.md) for a complete walkthrough of the app, its demo limitations, and how product and price data are collected and used.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Refresh retailer product data

The catalog currently includes a bounded Al-Fatah import. Its scraper reads the public product catalog, observes `robots.txt`, waits between page requests, and saves official product images and prices in `src/lib/scraped-alfatah.json`. The app imports that snapshot into its demo catalog.

```bash
npm run scrape:alfatah
```

The default scan limit is 1,000 catalog entries. Set `SCRAPE_LIMIT` (up to 1,000) and optionally `SCRAPE_DELAY_MS` (minimum 500 ms) to adjust the crawl. Prices and availability are a snapshot.

## Refresh Imtiaz product data

The Imtiaz import reads the public online shop menu and includes product names, official images, current prices, and the shop's category/subcategory names. The shop returns location-specific pricing; the default snapshot uses its Karachi delivery branch. Set `IMTIAZ_CITY` or `IMTIAZ_BRANCH_ID` to choose another branch exposed by the shop.

```bash
npm run scrape:imtiaz
```

The import writes `src/lib/scraped-imtiaz.json` and `src/lib/imtiaz-categories.json`; the app merges these products and categories into the catalog.

Open Food Facts can fill some missing pack shots through a separate, reviewable mapping. Its volunteer database has incomplete Pakistan coverage, so the enrichment script only records strong brand/name/quantity matches and never replaces retailer images. It defaults to 20 lookups per run to stay within its public search limit:

```bash
npm run enrich:openfoodfacts
```

Set `OFF_ENRICH_LIMIT` (maximum 300) to change the batch size. Mapped images show a credit link to the Open Food Facts product page; images use CC BY-SA 3.0 and reuse must preserve attribution and share-alike terms. See [Open Food Facts API documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/) and [reuse conditions](https://support.openfoodfacts.org/help/en-gb/12-api-data-reuse/94-are-there-conditions-to-use-the-api).

## Optional chatbot tracing

The chatbot can send model-call traces to LangSmith without replacing Groq or OpenAI. Add a newly generated LangSmith key to the server environment and set `LANGSMITH_TRACING=true` and `LANGSMITH_PROJECT=grocify-chatbot`. Tracing is off by default. When enabled, prompts and model responses are sent to LangSmith, so avoid enabling it for sensitive user conversations unless that data handling is acceptable.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
