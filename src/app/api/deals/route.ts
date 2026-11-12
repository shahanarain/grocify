import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/firebase-admin';
import { CatalogProduct, Deal } from '@/lib/catalog-types';

// Themed basket recipes. Each picks the best-value catalog product per subcategory;
// any subcategory with no cross-store match is silently skipped, so recipes stay
// robust as the catalog changes.
const RECIPES: { id: string; name: string; emoji: string; blurb: string; subCategories: string[] }[] = [
  {
    id: 'weekly-essentials', name: 'Weekly Essentials', emoji: '🛒',
    blurb: 'The staples every home runs out of — at the lowest price across all stores.',
    subCategories: ['Liquid Milk', 'Eggs', 'Breads, Buns and Dough', 'Tea', 'Butter and Margarine', 'Yogurt', 'Detergent Powder and Soaps'],
  },
  {
    id: 'breakfast-run', name: 'Breakfast Run', emoji: '🍳',
    blurb: 'Everything for the breakfast table, sourced cheapest.',
    subCategories: ['Breads, Buns and Dough', 'Eggs', 'Jam, Honey & Spreads', 'Oatmeals, Porridge & Cereals', 'Butter and Margarine', 'Tea'],
  },
  {
    id: 'cleaning-cupboard', name: 'Cleaning Cupboard', emoji: '🧽',
    blurb: 'Stock the cleaning shelf and save on every item.',
    subCategories: ['Detergent Powder and Soaps', 'Powder, Soap And Liquid', 'Air Fresheners and Home Fragrance', 'Toilet roll, Towels, Wipes and Tissues', 'Household Cleaners'],
  },
  {
    id: 'chai-time', name: 'Chai Time', emoji: '☕',
    blurb: 'Chai and biscuits, for less.',
    subCategories: ['Tea', 'Biscuits, Cookies, Wafers and Cakes', 'Liquid Milk'],
  },
];

// GET /api/deals - auto-generated deals computed live from catalogProducts.
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const snapshot = await db.collection('catalogProducts').get();
    const all: CatalogProduct[] = snapshot.docs.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc: any) => ({ canonicalId: doc.id, ...doc.data() })
    );
    const eligible = all.filter((p) => (p.storeCount || 0) >= 2);

    // "Biggest Savings" rail: highest savingPct, ignoring trivially cheap items.
    const topSavings = eligible
      .filter((p) => p.minPrice > 30 && p.savingPct > 0)
      .sort((a, b) => b.savingPct - a.savingPct)
      .slice(0, 12);

    // Best-value pick per subcategory (highest savingPct, tie-break by store count).
    const bestIn = (sc: string): CatalogProduct | null => {
      const candidates = eligible
        .filter((p) => p.subCategory === sc)
        .sort((a, b) => b.savingPct - a.savingPct || b.storeCount - a.storeCount);
      return candidates[0] || null;
    };

    const baskets: Deal[] = RECIPES.map((r) => {
      const items = r.subCategories.map(bestIn).filter(Boolean) as CatalogProduct[];
      const basketTotal = items.reduce((s, i) => s + i.minPrice, 0);
      const basketMax = items.reduce((s, i) => s + i.maxPrice, 0);
      const totalSaving = basketMax - basketTotal;
      return {
        id: r.id, name: r.name, emoji: r.emoji, blurb: r.blurb, items,
        basketTotal, basketMax, totalSaving,
        savingPct: basketMax > 0 ? Math.round((totalSaving / basketMax) * 100) : 0,
      };
    }).filter((d) => d.items.length >= 2);

    return NextResponse.json({ topSavings, baskets });
  } catch (error) {
    console.error('Get deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
