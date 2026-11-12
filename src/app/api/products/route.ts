import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { MOCK_CATALOG } from '@/lib/mock-catalog';

// Converts a CatalogProduct to the legacy `products` shape expected by the home page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function catalogToProduct(p: any) {
  return {
    id: p.canonicalId,
    name: p.title,
    brand: p.brand,
    category: p.category,
    subCategory: p.subCategory,
    newPrice: p.minPrice,
    oldPrice: p.maxPrice,
    image: p.image || null,
    status: 1,
    supplier: p.cheapestStore,
    storeCount: p.storeCount,
    savingPct: p.savingPct,
    offers: p.offers,
  };
}

// GET /api/products - Get paginated products with optional search and filters.
// Tries Firestore first; falls back to MOCK_CATALOG when Admin SDK is not configured.
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
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const supplier = searchParams.get('supplier');

    const parsePrice = (raw: string | null): number | null => {
      if (raw === null) return null;
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : null;
    };
    const minPrice = parsePrice(searchParams.get('minPrice'));
    const maxPrice = parsePrice(searchParams.get('maxPrice'));

    // ── Try Firestore ─────────────────────────────────────────────────────────
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = await import('@/lib/firebase-admin') as any;
      const db = admin.db;

      if (search && search.length >= 2) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let q: any = db.collection('products').where('status', '==', 1);
        if (category && category !== 'all') q = q.where('category', '==', category);
        if (supplier) q = q.where('supplier', '==', supplier);
        q = q.orderBy('createdAt', 'desc').limit(200);
        const snap = await q.get();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const products = snap.docs
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((d: any) => ({ id: d.id, ...d.data() }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.name?.toLowerCase().includes(search));
        return NextResponse.json({
          products,
          pagination: { limit, total: products.length, hasMore: false, lastDocId: null },
          isSearchResult: true,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = db.collection('products').where('status', '==', 1);
      if (category && category !== 'all') query = query.where('category', '==', category);
      if (subCategory) query = query.where('subCategory', '==', subCategory);
      if (supplier) query = query.where('supplier', '==', supplier);
      if (minPrice !== null) query = query.where('newPrice', '>=', minPrice);
      if (maxPrice !== null) query = query.where('newPrice', '<=', maxPrice);
      query = query.orderBy('createdAt', 'desc').limit(limit);

      if (lastDocId) {
        const lastDoc = await db.collection('products').doc(lastDocId).get();
        if (lastDoc.exists) query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      if (products.length > 0) {
        return NextResponse.json({
          products,
          pagination: {
            limit,
            total: 11457,
            hasMore: snapshot.docs.length === limit,
            lastDocId: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null,
          },
        });
      }
      // Fall through to mock if Firestore returned 0 results
    } catch {
      // Firestore not configured — use mock data below
    }

    // ── Mock data fallback ────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = MOCK_CATALOG.map(catalogToProduct);

    if (search && search.length >= 2) {
      items = items.filter(
        (p) => p.name?.toLowerCase().includes(search) || p.brand?.toLowerCase().includes(search)
      );
    }
    if (category && category !== 'all') items = items.filter((p) => p.category === category);
    if (subCategory) items = items.filter((p) => p.subCategory === subCategory);
    if (supplier) items = items.filter((p) => p.supplier === supplier);
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
