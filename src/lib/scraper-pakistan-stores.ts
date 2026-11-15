/**
 * Shared types and normalization helpers for retailer product ingestion.
 * The only currently verified crawl source is Al-Fatah's public product pages.
 */

export interface ScrapedStoreOffer {
  store: string;
  name: string;
  price: number;
  oldPrice?: number;
  url: string;
  inStock?: boolean;
  storeLogo?: string;
}

export interface ScrapedProduct {
  canonicalId: string;
  title: string;
  brand: string;
  category: string;
  subCategory: string;
  quantity: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  storeCount: number;
  cheapestStore: string;
  savingPct: number;
  offers: ScrapedStoreOffer[];
  keywords: string[];
}

export interface StoreScraperConfig {
  name: string;
  baseUrl: string;
  sitemapUrl: string;
}

export const PAKISTAN_STORES: Record<string, StoreScraperConfig> = {
  alfatah: {
    name: 'Al-Fatah',
    baseUrl: 'https://alfatah.pk',
    sitemapUrl: 'https://alfatah.pk/sitemap.xml',
  },
};

/**
 * Normalizes scraped product titles to extract quantity, brand, and clean title.
 */
export function normalizeScrapedProduct(rawTitle: string, brand?: string): { cleanTitle: string; quantity: string } {
  const quantityRegex = /(\d+(?:\.\d+)?\s*(?:kg|g|l|ml|pcs|piece|tray|pack|gm|ltr))/i;
  const match = rawTitle.match(quantityRegex);
  const quantity = match ? match[1].toLowerCase() : '1 unit';

  let cleanTitle = rawTitle;
  if (match) {
    cleanTitle = cleanTitle.replace(match[0], '').replace(/\(\s*\)/g, '').trim();
  }
  return { cleanTitle, quantity };
}

/**
 * Computes cross-store price comparison across scraped offers.
 */
export function aggregateStoreOffers(
  canonicalId: string,
  title: string,
  brand: string,
  category: string,
  subCategory: string,
  quantity: string,
  image: string,
  offers: ScrapedStoreOffer[],
  keywords: string[] = []
): ScrapedProduct {
  const validOffers = offers.filter((o) => o.price > 0).sort((a, b) => a.price - b.price);
  const minPrice = validOffers.length > 0 ? validOffers[0].price : 0;
  const maxPrice = validOffers.length > 0 ? validOffers[validOffers.length - 1].price : 0;
  const cheapestStore = validOffers.length > 0 ? validOffers[0].store : 'Metro';
  const savingPct = maxPrice > minPrice ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0;

  return {
    canonicalId,
    title,
    brand,
    category,
    subCategory,
    quantity,
    image,
    minPrice,
    maxPrice,
    storeCount: validOffers.length,
    cheapestStore,
    savingPct,
    offers: validOffers,
    keywords: [...new Set([...keywords, title.toLowerCase(), brand.toLowerCase(), category.toLowerCase(), subCategory.toLowerCase()])],
  };
}
