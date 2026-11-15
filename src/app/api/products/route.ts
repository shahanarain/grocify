import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { MOCK_CATALOG } from '@/lib/mock-catalog';
import { normalizeCategoryParams } from '@/lib/category-normalizer';

// Converts a CatalogProduct / offer to the Product shape expected by pages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function catalogToProduct(p: any) {
  const imgUrl = p.image || p.imageUrl || '';
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
    imageAttribution: p.imageAttribution || null,
    sourceLocation: p.sourceLocation || null,
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
      // Show products with verified retailer photos first so the first page
      // users see contains actual product images where the catalog has them.
      items.sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)));
      return NextResponse.json({
        products: items.slice(0, limit),
        pagination: { limit, total: items.length, hasMore: false, lastDocId: null },
        isSearchResult: true,
      });
    }

    // 3. Apply category and subcategory as real filters. The previous fallback
    // chain could return an entire category (or the whole catalog) when a
    // subcategory alias had no exact match, making category links look broken.
    if (rawSubCategory) {
      const directMatches = rawCategory
        ? items.filter((p) =>
            (p.category || '').toLowerCase() === rawCategory.toLowerCase() &&
            (p.subCategory || '').toLowerCase() === rawSubCategory.toLowerCase()
          )
        : [];

      if (directMatches.length > 0) {
        // The Imtiaz catalog uses its own first-party taxonomy. Honor an exact
        // pair before applying aliases intended for the hand-curated catalog.
        items = directMatches;
      } else {
        // Enforce the requested aisle as well as the legacy normalized
        // subcategory. Words like “toilet” and “foil” were mistaken for “oil”
        // by old imported category metadata.
        if (norm.subCategories.some((sc) => sc.toLowerCase() === 'cooking oil')) {
          items = items.filter((p) => /\b(oil|ghee)\b/i.test(p.name || ''));
        }

        const categoryMatches = norm.categories.length
          ? items.filter((p) => norm.categories.some(
              (c) => c.toLowerCase() === (p.category || '').toLowerCase()
            ))
          : items;

        const exactSubMatches = categoryMatches.filter((p) =>
          norm.subCategories.some(
            (sc) => sc.toLowerCase() === (p.subCategory || '').toLowerCase()
          )
        );

        if (exactSubMatches.length > 0) {
          const requestedSub = rawSubCategory.toLowerCase();
          const specificity = requestedSub.includes('olive oil')
            ? 'olive'
            : requestedSub.includes('ghee')
              ? 'ghee'
              : ['chicken', 'beef', 'mutton'].find((term) => requestedSub.includes(term));
          const specificMatches = specificity
            ? exactSubMatches.filter((p) => {
                const searchable = `${p.name || ''} ${p.brand || ''} ${(p.keywords || []).join(' ')}`.toLowerCase();
                return searchable.includes(specificity);
              })
            : [];
          items = specificMatches.length > 0 ? specificMatches : exactSubMatches;
        } else {
          // Some retailer imports carry broad subcategories such as “Other
          // Grocery”. Use the normalizer's domain terms against names/keywords,
          // while keeping the category constraint. An unmatched subcategory
          // now correctly returns no products instead of unrelated products.
          const genericTerms = new Set([
            'and', 'the', 'for', 'with', 'home', 'fresh', 'products', 'food', 'staples',
            'baking', 'cooking', 'essential', 'essentials', 'category', 'grocery',
          ]);
          const terms = norm.keywords.filter((term) => term.length >= 3 && !genericTerms.has(term));
          items = categoryMatches.filter((p) => {
            const searchable = `${p.name || ''} ${p.brand || ''} ${(p.keywords || []).join(' ')}`.toLowerCase();
            return terms.some((term) => searchable.includes(term));
          });
        }
      }
    } else if (rawCategory && rawCategory !== 'all') {
      items = items.filter((p) =>
        norm.categories.some(
          (c) => c.toLowerCase() === (p.category || '').toLowerCase()
        ) || (p.category || '').toLowerCase() === rawCategory.toLowerCase()
      );
    }

    // 4. Price bounds filter
    if (minPrice !== null) items = items.filter((p) => p.newPrice >= minPrice);
    if (maxPrice !== null) items = items.filter((p) => p.newPrice <= maxPrice);

    items.sort((a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)));

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
