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
    let usedMock = false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = await import('@/lib/firebase-admin') as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = admin.db.collection('catalogProducts');
      if (category && category !== 'all') {
        query = query.where('category', '==', category);
      } else if (subCategory) {
        query = query.where('subCategory', '==', subCategory);
      }
      const snapshot = await query.limit(400).get();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firestoreItems = snapshot.docs.map((doc: any) => ({ canonicalId: doc.id, ...doc.data() }));
      if (firestoreItems.length > 0) {
        items = firestoreItems;
      } else {
        items = [...MOCK_CATALOG];
        usedMock = true;
      }
    } catch {
      // Firestore not configured — use local mock data
      items = [...MOCK_CATALOG];
      usedMock = true;
    }

    // Apply category filter when using mock data (Firestore filters via query)
    if (usedMock) {
      if (category && category !== 'all') {
        items = items.filter((p) => p.category === category);
      } else if (subCategory) {
        items = items.filter((p) => p.subCategory === subCategory);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items = items.filter((p: any) => (p.storeCount || 0) >= minStores);

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
