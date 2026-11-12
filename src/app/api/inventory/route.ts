import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/firebase-admin';

// GET /api/inventory - List user's home pantry items with stock & expiry statistics
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;

    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('inventory')
      .orderBy('updatedAt', 'desc')
      .get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    const now = new Date();
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    let lowStockCount = 0;
    let expiringSoonCount = 0;

    for (const item of items) {
      const min = typeof item.minThreshold === 'number' ? item.minThreshold : 1;
      if (item.quantity <= min) {
        lowStockCount++;
      }

      if (item.expiryDate) {
        const exp = new Date(item.expiryDate);
        if (!isNaN(exp.getTime()) && exp <= threeDaysFromNow) {
          expiringSoonCount++;
        }
      }
    }

    return NextResponse.json({
      items,
      stats: {
        totalCount: items.length,
        lowStockCount,
        expiringSoonCount,
      },
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/inventory - Add a new item to home pantry inventory
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;

    const body = await request.json();
    const { name, quantity, unit, category, minThreshold, expiryDate, notes, barcode } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const parsedQty = Math.max(0, typeof quantity === 'number' ? quantity : parseFloat(quantity) || 1);
    const parsedMin = Math.max(0, typeof minThreshold === 'number' ? minThreshold : parseFloat(minThreshold) || 1);

    const itemData = {
      name: name.trim(),
      quantity: parsedQty,
      unit: (unit || 'pcs').trim(),
      category: (category || 'Other').trim(),
      minThreshold: parsedMin,
      expiryDate: expiryDate ? String(expiryDate).trim() : null,
      notes: notes ? String(notes).trim() : '',
      barcode: barcode ? String(barcode).trim() : null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('inventory')
      .add(itemData);

    return NextResponse.json(
      { message: 'Item added to inventory', item: { id: docRef.id, ...itemData } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add inventory item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

