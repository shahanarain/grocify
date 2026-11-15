import { MOCK_CATALOG } from '@/lib/mock-catalog';

const SEARCH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'at', 'buy', 'cheapest', 'find', 'for', 'grocery', 'groceries',
  'i', 'me', 'of', 'on', 'please', 'product', 'products', 'show', 'some', 'the',
  'to', 'under', 'below', 'less', 'than', 'price', 'with', 'in', 'at', 'from',
]);

export function searchCatalog(message: string, maxResults = 12) {
  const normalized = message.toLowerCase().replace(/[^a-z0-9. ]/g, ' ');
  const maxPriceMatch = normalized.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?\s*)?(\d+(?:\.\d+)?)/);
  const minPriceMatch = normalized.match(/(?:above|over|more than)\s*(?:rs\.?\s*)?(\d+(?:\.\d+)?)/);
  const maxPrice = maxPriceMatch ? Number(maxPriceMatch[1]) : null;
  const minPrice = minPriceMatch ? Number(minPriceMatch[1]) : null;
  const tokens = normalized
    .split(/\s+/)
    .filter((token) => token.length > 1 && !SEARCH_STOP_WORDS.has(token) && !/^\d+(?:\.\d+)?$/.test(token));

  const matches = MOCK_CATALOG.map((product) => {
    const searchable = [product.title, product.brand, product.category, product.subCategory, ...(product.keywords || [])]
      .join(' ').toLowerCase();
    const matchedTokens = tokens.filter((token) => searchable.includes(token));
    let score = matchedTokens.length;
    if (tokens.length === 0) score = 1;
    if (maxPrice !== null && product.minPrice > maxPrice) score = 0;
    if (minPrice !== null && product.minPrice < minPrice) score = 0;
    return { product, score };
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.minPrice - b.product.minPrice)
    .slice(0, Math.min(Math.max(maxResults, 1), 20));

  return matches.map(({ product }) => ({
    id: product.canonicalId,
    name: product.title,
    newPrice: product.minPrice,
    supplier: product.cheapestStore,
    imageUrl: product.image || undefined,
    quantity: product.quantity,
    category: product.category,
    subCategory: product.subCategory,
  }));
}
