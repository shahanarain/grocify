import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const files = ['src/lib/mock-catalog.ts', 'src/lib/mock-catalog-extra.ts'];
const outputPath = path.join(root, 'src/lib/openfoodfacts-images.json');
const limit = Math.min(300, Math.max(1, Number.parseInt(process.env.OFF_ENRICH_LIMIT || '20', 10) || 20));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const textOf = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : null;
const prop = (node, name) => {
  if (!ts.isObjectLiteralExpression(node)) return null;
  const value = node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText().replaceAll("'", '').replaceAll('"', '') === name)?.initializer;
  return value ? textOf(value) : null;
};

const catalog = [];
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node) && prop(node, 'canonicalId')) {
      const canonicalId = prop(node, 'canonicalId');
      const title = prop(node, 'title');
      const brand = prop(node, 'brand');
      const quantity = prop(node, 'quantity');
      if (canonicalId && title && brand && quantity) catalog.push({ canonicalId, title, brand, quantity });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const normalize = (value) => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (value) => new Set(normalize(value).split(/\s+/).filter((word) => word.length > 2));
const quantity = (value) => {
  const match = value.toLowerCase().replace(',', '.').match(/(\d+(?:\.\d+)?)\s*(kg|g|ml|l|litre|liter|count|pieces?|pcs|tea ?bags?)/i);
  if (!match) return null;
  let amount = Number(match[1]);
  let unit = match[2].toLowerCase().replace(/litre|liter/, 'l').replace(/pieces?|pcs/, 'count').replace(/tea ?bags?/, 'count');
  if (unit === 'kg') { amount *= 1000; unit = 'g'; }
  if (unit === 'l') { amount *= 1000; unit = 'ml'; }
  return `${amount}${unit}`;
};
const overlap = (a, b) => {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  return [...left].filter((token) => right.has(token)).length / left.size;
};

const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const known = new Set(existing.map((entry) => entry.canonicalId));
const pending = catalog.filter((p) => !known.has(p.canonicalId) && !['fresh', ''].includes(normalize(p.brand)));
const candidates = pending.slice(0, limit);
console.log(`Checking ${candidates.length} of ${pending.length} unverified branded products. Open Food Facts search quota is 10 requests/minute.`);

for (let index = 0; index < candidates.length; index += 1) {
  const product = candidates[index];
  if (index > 0) await sleep(6200);
  const params = new URLSearchParams({ search_terms: `${product.brand} ${product.title} ${product.quantity}`, search_simple: '1', action: 'process', json: '1', page_size: '8', fields: 'product_name,brands,quantity,image_front_url,code,countries_tags' });
  let response;
  try {
    response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, {
      headers: { 'User-Agent': 'GrocifyDemo/1.0 (product-image-enrichment; contact: admin@grocify.local)' },
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    console.warn(`Could not reach Open Food Facts for ${product.canonicalId}: ${error.message}`);
    break;
  }
  if (!response.ok) {
    console.warn(`Search failed (${response.status}) for ${product.canonicalId}; continuing.`);
    continue;
  }
  const result = await response.json();
  const brandNeedle = normalize(product.brand);
  const expectedQuantity = quantity(product.quantity);
  const ranked = (result.products || []).flatMap((item) => {
    const name = item.product_name || '';
    const brands = normalize(item.brands || '');
    const itemQuantity = quantity(item.quantity || '');
    const imageUrl = item.image_front_url;
    if (!imageUrl || !item.code || !brands.includes(brandNeedle)) return [];
    if (expectedQuantity && itemQuantity !== expectedQuantity) return [];
    const score = overlap(`${product.brand} ${product.title}`, `${item.brands || ''} ${name}`);
    if (score < 0.65) return [];
    return [{ item, name, score, imageUrl }];
  }).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || (ranked[1] && best.score - ranked[1].score < 0.08)) {
    console.log(`No unambiguous image match: ${product.canonicalId}`);
    continue;
  }
  const image = new URL(best.imageUrl);
  if (image.hostname !== 'images.openfoodfacts.org') {
    console.warn(`Unexpected image host for ${product.canonicalId}; skipped.`);
    continue;
  }
  existing.push({
    canonicalId: product.canonicalId,
    imageUrl: image.href,
    sourceCode: best.item.code,
    sourceProductName: best.name,
    sourceBrand: best.item.brands,
    quantity: best.item.quantity || '',
    productUrl: `https://world.openfoodfacts.org/product/${best.item.code}`,
    license: 'CC BY-SA 3.0',
  });
  console.log(`Matched ${product.canonicalId} → ${best.name}`);
}

fs.writeFileSync(outputPath, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`Saved ${existing.length} reviewed image mappings to ${path.relative(root, outputPath)}.`);
