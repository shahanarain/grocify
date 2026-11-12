import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/demo-database';
import { matchIngredientsToCatalog } from '@/lib/recipe-matcher';

// POST /api/inventory/quick-restock - Automatically compile low-stock pantry items into a Smart Basket
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;

    // Fetch all inventory items
    const snapshot = await db.collection('users').doc(userId).collection('inventory').get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allItems = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Filter to low stock items
    const lowStockItems = allItems.filter((item: any) => {
      const min = typeof item.minThreshold === 'number' ? item.minThreshold : 1;
      return (item.quantity || 0) <= min;
    });

    if (lowStockItems.length === 0) {
      return NextResponse.json({
        error: 'No low-stock items detected in your pantry inventory.',
      }, { status: 400 });
    }

    // Match low stock items against catalog
    const ingredientsToMatch = lowStockItems.map((item: any) => ({
      name: item.name,
      quantity: 1,
      unit: item.unit || 'pcs',
      catalogKeyword: item.name,
    }));

    const matched = await matchIngredientsToCatalog(ingredientsToMatch);
    const canonicalIds = matched
      .filter((m) => m.matchedProduct?.canonicalId)
      .map((m) => m.matchedProduct!.canonicalId);

    if (canonicalIds.length === 0) {
      return NextResponse.json({
        error: 'Could not match low-stock items to store products. Try renaming items with standard grocery names.',
      }, { status: 404 });
    }

    // Create a new Smart Basket for restock
    const basketRef = db.collection('users').doc(userId).collection('baskets').doc();
    const basketData = {
      name: `Pantry Restock (${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })})`,
      source: 'custom',
      dealId: null,
      itemCount: canonicalIds.length,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(basketRef, basketData);
    canonicalIds.forEach((cid) => {
      batch.set(basketRef.collection('items').doc(cid), {
        canonicalId: cid,
        addedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    return NextResponse.json({
      message: 'Created Smart Basket for low-stock pantry items',
      basketId: basketRef.id,
      restockedCount: canonicalIds.length,
      totalLowStock: lowStockItems.length,
    });
  } catch (error) {
    console.error('Quick restock error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

