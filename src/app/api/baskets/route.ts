import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/firebase-admin';

// GET /api/baskets - list the user's Smart Baskets (lightweight; no item resolution).
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;

    const snapshot = await db
      .collection('users').doc(userId)
      .collection('baskets').orderBy('createdAt', 'desc').get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baskets = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ baskets });
  } catch (error) {
    console.error('Get baskets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/baskets - create a Smart Basket. Body: { name, canonicalIds?, source?, dealId? }.
// Used both for empty custom baskets and for "Take this deal" (pass the deal's canonicalIds).
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;
    const { name, canonicalIds, source, dealId } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Basket name is required' }, { status: 400 });
    }
    const ids: string[] = Array.isArray(canonicalIds)
      ? [...new Set(canonicalIds.filter((x) => typeof x === 'string' && x))]
      : [];

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc();
    const basketData = {
      name: name.trim(),
      source: source === 'deal' ? 'deal' : source === 'recipe' ? 'recipe' : 'custom',
      dealId: dealId || null,
      itemCount: ids.length,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(basketRef, basketData);
    ids.forEach((cid) =>
      batch.set(basketRef.collection('items').doc(cid), {
        canonicalId: cid,
        addedAt: FieldValue.serverTimestamp(),
      })
    );
    await batch.commit();

    return NextResponse.json({ basket: { id: basketRef.id, ...basketData } }, { status: 201 });
  } catch (error) {
    console.error('Create basket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
