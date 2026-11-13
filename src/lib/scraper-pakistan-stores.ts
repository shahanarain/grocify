/**
 * Grocify+ Pakistan Grocery Stores Web Scraper & Aggregator
 * Supports live scraping / price fetching from major Pakistani supermarket chains:
 *  - Imtiaz Super Market (imtiaz.com.pk)
 *  - Metro Cash & Carry Pakistan (metro-online.pk)
 *  - Chase Up (chaseup.com.pk)
 *  - Bin Hashim Supermarket (binhashimonline.pk)
 *  - Carrefour Pakistan (carrefour.pk)
 *  - Al-Fatah Department Store (alfatah.pk)
 */

export interface ScrapedStoreOffer {
  store: string;
  name: string;
  price: number;
  oldPrice?: number;
  url: string;
  inStock: boolean;
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
  searchEndpoint: string;
  headers: Record<string, string>;
}

export const PAKISTAN_STORES: Record<string, StoreScraperConfig> = {
  imtiaz: {
    name: 'Imtiaz',
    baseUrl: 'https://shop.imtiaz.com.pk',
    searchEndpoint: 'https://shop.imtiaz.com.pk/api/products/search',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
    },
  },
  metro: {
    name: 'Metro',
    baseUrl: 'https://www.metro-online.pk',
    searchEndpoint: 'https://www.metro-online.pk/api/search',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  },
  chaseup: {
    name: 'Chase Up',
    baseUrl: 'https://chaseup.com.pk',
    searchEndpoint: 'https://chaseup.com.pk/search',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  },
  binhashim: {
    name: 'Bin Hashim',
    baseUrl: 'https://binhashimonline.pk',
    searchEndpoint: 'https://binhashimonline.pk/search',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
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
