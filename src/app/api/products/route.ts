import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { MOCK_CATALOG } from '@/lib/mock-catalog';
import { normalizeCategoryParams } from '@/lib/category-normalizer';

// Fallback image helper
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop&auto=format';

// Converts a CatalogProduct / offer to the Product shape expected by pages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function catalogToProduct(p: any) {
  const imgUrl = p.image || p.imageUrl || DEFAULT_IMAGE;
  return {
    id: p.canonicalId || p.id,
    name: p.title || p.name,
    brand: p.brand || '',
    category: p.category || '',
    subCategory: p.subCategory || '',
    newPrice: typeof p.minPrice === 'number' ? p.minPrice : (p.newPrice || 0),
    oldPrice: typeof p.maxPrice === 'number' ? p.maxPrice : (p.oldPrice || 0),
    image: imgUrl,
    imageUrl: imgUrl,
    quantity: p.quantity || '1 unit',
    status: 1,
    supplier: p.cheapestStore || p.supplier || 'Metro',
    storeCount: p.storeCount || 1,
    savingPct: p.savingPct || p.discount || 0,
    discount: p.savingPct || p.discount || 0,
    offers: p.offers || [],
    url: p.url || '#',
    createdAt: p.createdAt || new Date(),
  };
}

// GET /api/products - Get paginated products with smart search and normalized category filters.
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const searchParams = request.nextUrl.searchParams;

    // Validate and clamp limit (1..50)
    const parsedLimit = parseInt(searchParams.get('limit') || '12', 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 50) : 12;

    const lastDocId = searchParams.get('lastDocId');
    const search = searchParams.get('search')?.trim().toLowerCase();
    const rawCategory = searchParams.get('category');
    const rawSubCategory = searchParams.get('subCategory');
    const supplier = searchParams.get('supplier');

    const parsePrice = (raw: string | null): number | null => {
      if (raw === null) return null;
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : null;
    };
    const minPrice = parsePrice(searchParams.get('minPrice'));
    const maxPrice = parsePrice(searchParams.get('maxPrice'));

    // Normalize category and subcategory from the request
    const norm = normalizeCategoryParams(rawCategory, rawSubCategory);

    // Build the candidate product list from the catalog
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = MOCK_CATALOG.map(catalogToProduct);

    // 1. Supplier filter
    if (supplier) {
      items = items.filter((p) => p.supplier?.toLowerCase() === supplier.toLowerCase());
    }

    // 2. Search query filter
    if (search && search.length >= 2) {
      items = items.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
        return (
          name.includes(search) ||
          brand.includes(search) ||
          cat.includes(search) ||
          sub.includes(search)
        );
      });
      return NextResponse.json({
        products: items.slice(0, limit),
        pagination: { limit, total: items.length, hasMore: false, lastDocId: null },
        isSearchResult: true,
      });
    }

    // 3. Category & SubCategory filter with multi-level fallback
    if (rawSubCategory) {
      // First try matching normalized subcategories
      let subMatches = items.filter((p) =>
        norm.subCategories.some(
          (sc) => sc.toLowerCase() === (p.subCategory || '').toLowerCase()
        )
      );

      // If no subcategory match, try matching subcategory keywords against product name or brand
      if (subMatches.length === 0 && norm.keywords.length > 0) {
        subMatches = items.filter((p) => {
          const name = (p.name || '').toLowerCase();
          const sub = (p.subCategory || '').toLowerCase();
          return norm.keywords.some((kw) => name.includes(kw) || sub.includes(kw));
        });
      }

      // If still no direct match, check if any products match the category
      if (subMatches.length === 0 && norm.categories.length > 0) {
        subMatches = items.filter((p) =>
          norm.categories.some(
            (c) => c.toLowerCase() === (p.category || '').toLowerCase()
          )
        );
      }

      // If we found targeted matches, use them; otherwise keep items to avoid empty dead-end
      if (subMatches.length > 0) {
        items = subMatches;
      }
    } else if (rawCategory && rawCategory !== 'all') {
      // Category-only filter
      const catMatches = items.filter((p) =>
        norm.categories.some(
          (c) => c.toLowerCase() === (p.category || '').toLowerCase()
        ) || (p.category || '').toLowerCase() === rawCategory.toLowerCase()
      );
      if (catMatches.length > 0) {
        items = catMatches;
      }
    }

    // 4. Price bounds filter
    if (minPrice !== null) items = items.filter((p) => p.newPrice >= minPrice);
    if (maxPrice !== null) items = items.filter((p) => p.newPrice <= maxPrice);

    const total = items.length;
    const startIdx = lastDocId ? items.findIndex((p) => p.id === lastDocId) + 1 : 0;
    const page = items.slice(startIdx, startIdx + limit);

    return NextResponse.json({
      products: page,
      pagination: {
        limit,
        total,
        hasMore: startIdx + limit < total,
        lastDocId: page.length > 0 ? page[page.length - 1].id : null,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
