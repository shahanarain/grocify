import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/demo-database';
import {
  CatalogProduct,
  StoreSlice,
  SingleStoreOption,
  TwoStoreOption,
  ProductSubstitution,
} from '@/lib/catalog-types';

// GET /api/baskets/[basketId] - resolve a basket's items from catalogProducts and
// compute the multi-store-vs-single-store optimization that powers the basket view.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ basketId: string }> }
) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;
    const { basketId } = await params;

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc(basketId);
    const basketDoc = await basketRef.get();
    if (!basketDoc.exists) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }

    const itemRefs = await basketRef.collection('items').orderBy('addedAt', 'desc').get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canonicalIds = itemRefs.docs.map((d: any) => d.id);

    // Resolve each canonical item from the catalog (drop any that were deleted).
    const products = (
      await Promise.all(
        canonicalIds.map(async (cid) => {
          const snap = await db.collection('catalogProducts').doc(cid).get();
          return snap.exists ? ({ canonicalId: snap.id, ...snap.data() } as CatalogProduct) : null;
        })
      )
    ).filter(Boolean) as CatalogProduct[];

    const optimization = await optimize(products);

    return NextResponse.json({
      basket: { id: basketDoc.id, ...basketDoc.data() },
      items: products,
      optimization,
    });
  } catch (error) {
    console.error('Get basket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/baskets/[basketId] - delete a basket and all its item refs.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ basketId: string }> }
) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;
    const { basketId } = await params;

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc(basketId);
    const items = await basketRef.collection('items').get();
    const batch = db.batch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.docs.forEach((d: any) => batch.delete(d.ref));
    batch.delete(basketRef);
    await batch.commit();

    return NextResponse.json({ message: 'Basket deleted' });
  } catch (error) {
    console.error('Delete basket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Compute where-to-buy economics and alternative substitutions for a basket.
async function optimize(items: CatalogProduct[]) {
  const multiStoreTotal = items.reduce((s, i) => s + (i.minPrice || 0), 0);
  const basketMax = items.reduce((s, i) => s + (i.maxPrice || 0), 0);
  const totalSaving = basketMax - multiStoreTotal;

  // Buying each item at its own cheapest store -> grouped by store.
  const sliceMap = new Map<string, StoreSlice>();
  for (const i of items) {
    const store = i.cheapestStore || i.offers?.[0]?.store || 'Unknown';
    if (!sliceMap.has(store)) sliceMap.set(store, { store, items: [], subtotal: 0 });
    const slice = sliceMap.get(store)!;
    slice.items.push({ canonicalId: i.canonicalId, title: i.title, price: i.minPrice });
    slice.subtotal += i.minPrice || 0;
  }
  const storeSplit = [...sliceMap.values()].sort((a, b) => b.subtotal - a.subtotal);

  // One-stop option: for each store, what does it carry and at what total?
  const stores = new Set<string>();
  items.forEach((i) => i.offers?.forEach((o) => stores.add(o.store)));
  const singleStoreOptions: SingleStoreOption[] = [...stores].map((store) => {
    let coverage = 0;
    let total = 0;
    for (const i of items) {
      const offer = i.offers?.find((o) => o.store === store);
      if (offer) {
        coverage += 1;
        total += offer.price;
      }
    }
    return { store, coverage, total };
  }).sort((a, b) => b.coverage - a.coverage || a.total - b.total);

  // Balanced 2-Store Option: find the best pair of stores (S1, S2)
  const storeList = [...stores];
  let twoStoreOption: TwoStoreOption | null = null;
  if (storeList.length >= 2 && items.length >= 2) {
    for (let i = 0; i < storeList.length; i++) {
      for (let j = i + 1; j < storeList.length; j++) {
        const s1 = storeList[i];
        const s2 = storeList[j];
        let coverage = 0;
        let total = 0;
        const split1: { canonicalId: string; title: string; price: number }[] = [];
        const split2: { canonicalId: string; title: string; price: number }[] = [];

        for (const it of items) {
          const o1 = it.offers?.find((o) => o.store === s1);
          const o2 = it.offers?.find((o) => o.store === s2);
          if (!o1 && !o2) continue;

          coverage += 1;
          if (o1 && (!o2 || o1.price <= o2.price)) {
            total += o1.price;
            split1.push({ canonicalId: it.canonicalId, title: it.title, price: o1.price });
          } else if (o2) {
            total += o2.price;
            split2.push({ canonicalId: it.canonicalId, title: it.title, price: o2.price });
          }
        }

        if (
          !twoStoreOption ||
          coverage > twoStoreOption.coverage ||
          (coverage === twoStoreOption.coverage && total < twoStoreOption.total)
        ) {
          twoStoreOption = {
            stores: [s1, s2],
            coverage,
            total,
            split: {
              store1: { name: s1, items: split1, subtotal: split1.reduce((s, x) => s + x.price, 0) },
              store2: { name: s2, items: split2, subtotal: split2.reduce((s, x) => s + x.price, 0) },
            },
          };
        }
      }
    }
  }

  // Look for substitutions for products that have a subCategory
  const existingIds = new Set(items.map((i) => i.canonicalId));
  const subCategories = [...new Set(items.map((i) => i.subCategory).filter(Boolean))];
  const substitutions: ProductSubstitution[] = [];

  if (subCategories.length > 0) {
    try {
      const candidateSnaps = await Promise.all(
        subCategories.slice(0, 5).map((sc) =>
          db.collection('catalogProducts').where('subCategory', '==', sc).limit(10).get()
        )
      );

      const candidates = candidateSnaps.flatMap((snap) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        snap.docs.map((d: any) => ({ canonicalId: d.id, ...d.data() } as CatalogProduct))
      );

      for (const it of items) {
        if (!it.subCategory) continue;
        const cheaperAlternatives = candidates
          .filter(
            (c) =>
              c.subCategory === it.subCategory &&
              c.canonicalId !== it.canonicalId &&
              !existingIds.has(c.canonicalId) &&
              c.minPrice < it.minPrice
          )
          .sort((a, b) => a.minPrice - b.minPrice);

        if (cheaperAlternatives.length > 0) {
          const bestAlt = cheaperAlternatives[0];
          const savingAmount = it.minPrice - bestAlt.minPrice;
          if (savingAmount >= 15) {
            substitutions.push({
              currentProductId: it.canonicalId,
              currentTitle: it.title,
              currentBrand: it.brand || '',
              currentPrice: it.minPrice,
              subCategory: it.subCategory,
              suggestedProduct: {
                canonicalId: bestAlt.canonicalId,
                title: bestAlt.title,
                brand: bestAlt.brand || '',
                minPrice: bestAlt.minPrice,
                cheapestStore: bestAlt.cheapestStore,
                image: bestAlt.image,
              },
              savingAmount,
              savingPct: Math.round((savingAmount / it.minPrice) * 100),
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to compute substitutions:', e);
    }
  }

  return {
    multiStoreTotal,
    basketMax,
    totalSaving,
    savingPct: basketMax > 0 ? Math.round((totalSaving / basketMax) * 100) : 0,
    storesToVisit: storeSplit.length,
    storeSplit,
    singleStoreOptions,
    twoStoreOption,
    substitutions: substitutions.slice(0, 4),
  };
}
