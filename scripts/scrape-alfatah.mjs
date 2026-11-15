import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const origin = 'https://alfatah.pk';
const outputPath = resolve(process.cwd(), 'src/lib/scraped-alfatah.json');
const userAgent = 'GrocifyCatalogBot/1.0 (+https://grocify.app; public product catalog indexing)';
const scanLimit = Math.min(Math.max(Number.parseInt(process.env.SCRAPE_LIMIT || '1000', 10) || 1000, 1), 1000);
const delayMs = Math.min(Math.max(Number.parseInt(process.env.SCRAPE_DELAY_MS || '1000', 10) || 1000, 500), 10000);

async function getResponse(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': userAgent, accept: 'application/json,text/plain,*/*' },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}

function robotsAllows(robots, url) {
  const path = new URL(url).pathname;
  let inWildcardGroup = false;
  let applies = false;
  const rules = [];
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.split('#')[0].trim();
    if (!line) continue;
    const [rawKey, ...valueParts] = line.split(':');
    const key = rawKey.trim().toLowerCase();
    const value = valueParts.join(':').trim();
    if (key === 'user-agent') {
      inWildcardGroup = value === '*';
      applies ||= inWildcardGroup;
    } else if (inWildcardGroup && (key === 'allow' || key === 'disallow') && value) {
      rules.push({ allow: key === 'allow', path: value });
    }
  }
  if (!applies) return false;
  const matches = rules.filter((rule) => path.startsWith(rule.path)).sort((a, b) => b.path.length - a.path.length);
  return !matches[0] || matches[0].allow;
}

function mapTaxonomy(productType, title) {
  const text = `${productType} ${title}`.toLowerCase();
  if (/\b(ball?oon|toy|party supply|foil craft|fringe curtain)\b/.test(title.toLowerCase())) {
    return { category: 'Home Essential', subCategory: 'Home Decor' };
  }
  if (/\bfoil\b/.test(title.toLowerCase())) {
    return { category: 'Home Essential', subCategory: 'Disposable & Foil' };
  }
  if (/\btoilet brush\b/.test(title.toLowerCase())) {
    return { category: 'Home Essential', subCategory: 'Buckets,Bins,Broom,mops and Brushes' };
  }
  if (/tea|chai/.test(text)) return { category: 'Tea and Coffee', subCategory: 'Tea' };
  if (/coffee/.test(text)) return { category: 'Tea and Coffee', subCategory: 'Coffee' };
  if (/milk|dairy|butter|cheese|yogurt|yoghurt|lassi|cream/.test(text)) {
    const subCategory = /butter/.test(text) ? 'Butter' : /cheese|cream/.test(text) ? 'Cheese' : /yogurt|yoghurt|lassi/.test(text) ? 'Yogurt' : 'Milk';
    return { category: 'Dairy', subCategory };
  }
  if (/cereal|oat|bread|breakfast|honey|jam/.test(text)) return { category: 'Breakfast', subCategory: 'Cereals' };
  if (/biscuit|cookie|chips|nimko|snack|popcorn|chocolate|candy|sweet|cracker/.test(text)) {
    return { category: 'Snacks', subCategory: /biscuit|cookie/.test(text) ? 'Biscuits' : /chocolate|candy|sweet/.test(text) ? 'Chocolate' : 'Chips' };
  }
  if (/soft drink|soda|cola|beverage|drink|juice|water|syrup/.test(text)) {
    return { category: 'Beverages', subCategory: /water/.test(text) ? 'Water' : /juice|syrup/.test(text) ? 'Juice' : 'Soft Drinks' };
  }
  if (/rice|flour|atta/.test(text)) return { category: 'Rice and Flour', subCategory: /rice/.test(text) ? 'Rice' : 'Flour' };
  if (/\boil\b|\bghee\b|spice|masala|salt|sugar|sauce|vinegar|pasta|noodle/.test(text)) {
    return { category: 'Baking and Cooking', subCategory: /\boil\b|\bghee\b/.test(text) ? 'Cooking Oil' : 'Cooking Essentials' };
  }
  if (/detergent|washing|laundry|fabric/.test(text)) return { category: 'Laundry', subCategory: 'Detergent' };
  if (/cleaner|cleaning|dish|sponge|tissue|soap|shampoo|toothpaste|freshener/.test(text)) {
    return { category: /dish|sponge/.test(text) ? 'DishWashing' : 'Home Essential', subCategory: 'Household Cleaners' };
  }
  if (/fruit|vegetable|chicken|beef|mutton|meat|fish|egg|bakery|fresh/.test(text)) return { category: 'Fresh Products', subCategory: 'Fresh Foods' };
  return { category: 'Food Staples', subCategory: productType || 'Other Grocery' };
}

function isGrocery(product) {
  const text = `${product.title} ${product.product_type} ${(product.tags || []).join(' ')}`.toLowerCase();
  if (/\b(ball?oon|toy|party supply|foil craft|fringe curtain|toilet brush)\b/i.test(String(product.title || ''))) return true;
  return /grocery|food|rice|atta|flour|milk|dairy|tea|coffee|\boil\b|\bghee\b|sugar|salt|spice|masala|biscuit|cookie|snack|drink|beverage|juice|water|meat|chicken|beef|mutton|fish|fruit|vegetable|bread|bakery|egg|pasta|noodle|sauce|soup|frozen|cleaning|detergent|soap|shampoo|toothpaste|tissue|baby|diaper|pet food|cat food|dog food|cereal|oat|butter|cheese|yogurt|yoghurt|lassi|popcorn|nimko/i.test(text);
}

function toCatalogProduct(source) {
  const title = String(source.title || '').trim();
  const variants = Array.isArray(source.variants) ? source.variants : [];
  const variantPrices = variants.map((variant) => Number(variant.price)).filter((value) => value > 0);
  const priceInCents = Number(source.price_min ?? source.price ?? (variantPrices.length ? Math.min(...variantPrices) : 0));
  const price = priceInCents / 100;
  const images = Array.isArray(source.images) ? source.images : [];
  const imageValue = source.featured_image || images[0] || null;
  const image = typeof imageValue === 'string'
    ? imageValue.startsWith('//') ? `https:${imageValue}` : imageValue
    : imageValue?.src || null;
  const productType = String(source.product_type || source.type || '').trim();
  const brand = String(source.vendor || '').trim().replace(/alfatah/i, '').trim();
  const taxonomy = mapTaxonomy(productType, title);
  const handle = String(source.handle || source.id || '').trim();
  const quantityMatch = title.match(/\b\d+(?:\.\d+)?\s?(?:kg|g|gm|gram|l|ltr|ml|pcs?|pieces?|pack)\b/i);
  const variantOldPrices = variants.map((variant) => Number(variant.compare_at_price)).filter((value) => value > 0);
  const oldPriceInCents = Number(source.compare_at_price_min ?? source.compare_at_price ?? (variantOldPrices.length ? Math.max(...variantOldPrices) : 0));
  const oldPrice = oldPriceInCents / 100;
  const url = `${origin}/products/${encodeURIComponent(handle)}`;
  if (!title || !handle || !Number.isFinite(price) || price <= 0 || !image) return null;

  return {
    canonicalId: `alfatah-${handle}`,
    title,
    brand,
    ...taxonomy,
    quantity: quantityMatch?.[0] || '1 unit',
    image,
    minPrice: price,
    maxPrice: price,
    storeCount: 1,
    cheapestStore: 'Al-Fatah',
    savingPct: oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0,
    offers: [{ store: 'Al-Fatah', name: title, price, ...(oldPrice > price ? { oldPrice } : {}), url, inStock: variants.length ? variants.some((variant) => variant.available) : true }],
    keywords: [...new Set([title, brand, productType, ...(source.tags || [])].filter(Boolean).map((item) => String(item).toLowerCase()))],
  };
}

const robotsResponse = await getResponse(`${origin}/robots.txt`);
const robots = await robotsResponse.text();
const catalogEndpoint = `${origin}/products.json`;
if (!robotsAllows(robots, catalogEndpoint)) {
  throw new Error('robots.txt does not permit access to the public product catalog endpoint.');
}

const products = [];
const seen = new Set();
for (let page = 1; (page - 1) * 250 < scanLimit; page += 1) {
  const response = await getResponse(`${catalogEndpoint}?limit=250&page=${page}`);
  const body = await response.json();
  const sourceProducts = Array.isArray(body.products) ? body.products : [];
  if (sourceProducts.length === 0) break;
  for (const source of sourceProducts) {
    if (!isGrocery(source)) continue;
    const product = toCatalogProduct(source);
    if (!product || seen.has(product.canonicalId)) continue;
    seen.add(product.canonicalId);
    products.push(product);
  }
  console.log(`Catalog page ${page}: scanned ${Math.min(page * 250, scanLimit)} / ${scanLimit}; collected ${products.length} products`);
  if (sourceProducts.length < 250 || page * 250 >= scanLimit) break;
  await new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
}

if (products.length === 0) throw new Error('No grocery products with official images were collected; existing data was left untouched.');
await mkdir(dirname(outputPath), { recursive: true });
const tempPath = `${outputPath}.tmp`;
await writeFile(tempPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
await rename(tempPath, outputPath);
console.log(`Saved ${products.length} Al-Fatah grocery products to ${outputPath}`);
