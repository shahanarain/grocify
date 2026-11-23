import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { MOCK_CATALOG } from '@/lib/mock-catalog';

// GET /api/catalog - browse the cross-store canonical catalog (catalogProducts).
// Filters: category | subCategory | search | minStores | sort | limit | offset.
// Falls back to local MOCK_CATALOG when Firestore is not configured.
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const sp = request.nextUrl.searchParams;
    const category = sp.get('category');
    const subCategory = sp.get('subCategory');
    const search = sp.get('search')?.trim().toLowerCase();
    const sort = sp.get('sort') || 'savings';
    const minStores = Math.max(parseInt(sp.get('minStores') || '2', 10) || 2, 2);
    const parsedLimit = parseInt(sp.get('limit') || '24', 10);
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 60) : 24;
    const offset = Math.max(parseInt(sp.get('offset') || '0', 10) || 0, 0);

    // Try Firestore first; fall back to mock data when Admin SDK is not configured.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = [];
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = await import('@/lib/demo-database') as any;
      const snapshot = await admin.db.collection('catalogProducts').get();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firestoreItems = snapshot.docs.map((doc: any) => ({ canonicalId: doc.id, ...doc.data() }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const comparable = firestoreItems.filter((p: any) => (p.storeCount || 0) >= minStores);
      if (comparable.length > 0) {
        items = comparable;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items = MOCK_CATALOG.filter((p: any) => (p.storeCount || 0) >= minStores);
      }
    } catch {
      // Firestore not configured — use local mock data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items = MOCK_CATALOG.filter((p: any) => (p.storeCount || 0) >= minStores);
    }

    // Apply category or subCategory filter with normalizer support
    if (category && category !== 'all') {
      const normCat = category.toLowerCase().replace(/[^a-z0-9]/g, '');
      items = items.filter((p: any) => {
        const pCat = (p.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return pCat === normCat || pCat.includes(normCat) || normCat.includes(pCat);
      });
    } else if (subCategory) {
      const normSub = subCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
      items = items.filter((p: any) => {
        const pSub = (p.subCategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return pSub === normSub || pSub.includes(normSub) || normSub.includes(pSub);
      });
    }

    if (search && search.length >= 2) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items = items.filter((p: any) =>
        (p.title || '').toLowerCase().includes(search) ||
        (p.brand || '').toLowerCase().includes(search) ||
        (p.keywords || []).some((k: string) => k.includes(search))
      );
    }

    const sorters: Record<string, (a: any, b: any) => number> = { // eslint-disable-line @typescript-eslint/no-explicit-any
      savings: (a, b) => (b.savingPct || 0) - (a.savingPct || 0),
      'price-low': (a, b) => (a.minPrice || 0) - (b.minPrice || 0),
      'price-high': (a, b) => (b.minPrice || 0) - (a.minPrice || 0),
      stores: (a, b) => (b.storeCount || 0) - (a.storeCount || 0),
    };
    items.sort(sorters[sort] || sorters.savings);

    const total = items.length;
    const page = items.slice(offset, offset + limit);

    return NextResponse.json({
      products: page,
      pagination: { total, offset, limit, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error('Get catalog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
