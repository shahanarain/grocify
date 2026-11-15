import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const origin = 'https://shop.imtiaz.com.pk';
const productOutput = resolve(process.cwd(), 'src/lib/scraped-imtiaz.json');
const categoryOutput = resolve(process.cwd(), 'src/lib/imtiaz-categories.json');
const userAgent = 'GrocifyCatalogBot/1.0 (local product catalog import)';

async function getJson(path, params, headers) {
  const url = new URL(path, origin);
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  const response = await fetch(url, {
    headers: { 'user-agent': userAgent, accept: 'application/json', ...headers },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Imtiaz returned ${response.status} for ${path}`);
  const data = await response.json();
  if (data.status !== 200) throw new Error(`Imtiaz API error for ${path}: ${data.msg || 'unknown error'}`);
  return data;
}

function cleanText(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function quantityFrom(title, unit) {
  const match = title.match(/\b\d+(?:[.,]\d+)?\s?(?:kg|g|gm|gram|ltr|litre|liter|l|ml|pcs?|pieces?|pack|bags?)\b/i);
  if (match) return match[0].replace(/\s+/g, ' ').trim();
  return cleanText(unit) || '1 unit';
}

function stringList(value) {
  if (Array.isArray(value)) return value.map(cleanText).filter(Boolean);
  if (typeof value === 'string') return value.split(/[,|]/).map(cleanText).filter(Boolean);
  return [];
}

const pageResponse = await fetch(origin, {
  headers: { 'user-agent': userAgent, accept: 'text/html' },
  signal: AbortSignal.timeout(30000),
});
if (!pageResponse.ok) throw new Error(`Imtiaz shop returned ${pageResponse.status} for its homepage`);
const html = await pageResponse.text();
const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
if (!nextDataMatch) throw new Error('Could not read the online shop configuration from the homepage');
const nextData = JSON.parse(nextDataMatch[1]);
const shopConfig = nextData.props?.initialState?.config?.config;
if (!shopConfig?.restId || !shopConfig?.host || !shopConfig?.appName) {
  throw new Error('The online shop did not provide the expected public catalog configuration');
}

const apiHeaders = {
  'Host-Name': shopConfig.host,
  'Rest-Id': String(shopConfig.restId),
  'App-Name': shopConfig.appName,
};
const geofences = await getJson('/api/geofence', { restId: shopConfig.restId }, apiHeaders);
const cities = geofences.data?.cities || [];
const requestedCity = process.env.IMTIAZ_CITY || 'Karachi';
const city = cities.find((candidate) => cleanText(candidate.name).toLowerCase() === requestedCity.toLowerCase())
  || cities[0];
if (!city) throw new Error('Imtiaz did not return a public delivery city');

const branches = city.restaurant_branches || [];
const requestedBranchId = process.env.IMTIAZ_BRANCH_ID;
const branch = requestedBranchId
  ? branches.find((candidate) => String(candidate.id) === requestedBranchId)
  : branches.find((candidate) => Number(candidate.status) === 1) || branches[0];
if (!branch) throw new Error(`No Imtiaz delivery branch was returned for ${city.name}`);

const menuResponse = await getJson('/api/menu', {
  restId: shopConfig.restId,
  rest_brId: branch.id,
}, apiHeaders);
const menu = Array.isArray(menuResponse.data) ? menuResponse.data : [];
const productRows = [];
const categories = new Map();
const seenIds = new Set();
const branchArea = cleanText(branch.area?.name || branch.area_name || branch.name || city.name);

for (const menuCategory of menu) {
  for (const section of menuCategory.all_section || []) {
    const itemsInSection = [];
    for (const subSection of section.all_sub_section || []) {
      for (const item of subSection.dish || []) {
        const id = String(item.id || '').trim();
        const title = cleanText(item.name);
        const description = cleanText(item.description || item.desc || item.details || '');
        const price = Number(item.price);
        const image = cleanText(item.img_url);
        if (!id || !title || !Number.isFinite(price) || price <= 0 || !image || Number(item.status) === 0) continue;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const imageUrl = new URL(image, origin);
        if (imageUrl.hostname !== 'imtiaz-i.s3.ap-southeast-1.amazonaws.com') continue;
        const brand = cleanText(item.brand_name);
        const sourceSubcategory = cleanText(subSection.name);
        const isEdibleOilSection = cleanText(menuCategory.name).toLowerCase() === 'edible grocery'
          && cleanText(section.name).toLowerCase() === 'edible oil & ghee';
        const isGhee = sourceSubcategory.toLowerCase() === 'ghee'
          || /\bghee\b/i.test(title);
        const category = isEdibleOilSection ? 'Baking and Cooking' : cleanText(menuCategory.name) || 'Imtiaz';
        const subCategory = isEdibleOilSection
          ? (isGhee ? 'Ghee' : 'Cooking Oil')
          : cleanText(section.name) || sourceSubcategory || 'Other Products';
        const basePrice = Number(item.base_price) || price;
        const savingPct = basePrice > price ? Math.round(((basePrice - price) / basePrice) * 100) : 0;
        const keywords = [...new Set([
          ...stringList(item.search_tags),
          ...stringList(item.search_tags_portal),
          ...stringList(item.tag),
          menuCategory.name,
          section.name,
          subSection.name,
          brand,
        ].filter(Boolean).map((word) => word.toLowerCase()))];

        const product = {
          canonicalId: `imtiaz-${id}`,
          category,
          subCategory,
          sourceSubcategory,
          sourceCategory: cleanText(menuCategory.name),
          sourceSection: cleanText(section.name),
          sourceLocation: `${cleanText(city.name)} - ${branchArea}`,
          brand,
          quantity: quantityFrom(title, item.tp_uom),
          title,
          description,
          image: imageUrl.href,
          storeCount: 1,
          cheapestStore: 'Imtiaz',
          minPrice: price,
          maxPrice: Math.max(price, basePrice),
          savingPct,
          keywords,
          offers: [{
            store: 'Imtiaz',
            name: title,
            price,
            url: origin,
            inStock: Number(item.availability) !== 0,
          }],
        };
        productRows.push(product);
        itemsInSection.push(product);
      }
    }
    for (const product of itemsInSection) {
      const current = categories.get(product.category) || new Set();
      current.add(product.subCategory);
      categories.set(product.category, current);
    }
  }
}

if (!productRows.length) throw new Error('No Imtiaz products with names, images, and prices were returned');
const categoryRows = [...categories.entries()].map(([name, subCategories]) => ({
  name,
  subCategories: [...subCategories].sort((a, b) => a.localeCompare(b)),
}));

await mkdir(dirname(productOutput), { recursive: true });
const productTemp = `${productOutput}.tmp`;
const categoryTemp = `${categoryOutput}.tmp`;
await writeFile(productTemp, `${JSON.stringify(productRows, null, 2)}\n`, 'utf8');
await writeFile(categoryTemp, `${JSON.stringify(categoryRows, null, 2)}\n`, 'utf8');
await rename(productTemp, productOutput);
await rename(categoryTemp, categoryOutput);
console.log(`Imported ${productRows.length} Imtiaz products for ${city.name} (${branchArea}) across ${categoryRows.length} categories.`);
