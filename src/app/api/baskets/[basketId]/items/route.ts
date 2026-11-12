import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/firebase-admin';

// POST /api/baskets/[basketId]/items - add a catalog product to the basket. Body: { canonicalId }.
export async function POST(
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
    const { canonicalId } = await request.json();

    if (!canonicalId) {
      return NextResponse.json({ error: 'canonicalId is required' }, { status: 400 });
    }

    const catalogDoc = await db.collection('catalogProducts').doc(canonicalId).get();
    if (!catalogDoc.exists) {
      return NextResponse.json({ error: 'Catalog product not found' }, { status: 404 });
    }

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc(basketId);
    if (!(await basketRef.get()).exists) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }

    const itemRef = basketRef.collection('items').doc(canonicalId);
    if ((await itemRef.get()).exists) {
      return NextResponse.json({ error: 'Item already in basket' }, { status: 400 });
    }

    const batch = db.batch();
    batch.set(itemRef, { canonicalId, addedAt: FieldValue.serverTimestamp() });
    batch.update(basketRef, { itemCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() });
    await batch.commit();

    return NextResponse.json({ message: 'Added to basket' });
  } catch (error) {
    console.error('Add basket item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/baskets/[basketId]/items?canonicalId=... - remove an item from the basket.
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
    const canonicalId = request.nextUrl.searchParams.get('canonicalId');

    if (!canonicalId) {
      return NextResponse.json({ error: 'canonicalId is required' }, { status: 400 });
    }

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc(basketId);
    const itemRef = basketRef.collection('items').doc(canonicalId);
    if (!(await itemRef.get()).exists) {
      return NextResponse.json({ error: 'Item not in basket' }, { status: 404 });
    }

    const batch = db.batch();
    batch.delete(itemRef);
    batch.update(basketRef, { itemCount: FieldValue.increment(-1), updatedAt: FieldValue.serverTimestamp() });
    await batch.commit();

    return NextResponse.json({ message: 'Removed from basket' });
  } catch (error) {
    console.error('Remove basket item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/baskets/[basketId]/items - swap an item for an alternative substitution.
// Body: { removeCanonicalId, addCanonicalId }
export async function PUT(
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
    const { removeCanonicalId, addCanonicalId } = await request.json();

    if (!removeCanonicalId || !addCanonicalId) {
      return NextResponse.json({ error: 'removeCanonicalId and addCanonicalId are required' }, { status: 400 });
    }

    const basketRef = db.collection('users').doc(userId).collection('baskets').doc(basketId);
    if (!(await basketRef.get()).exists) {
      return NextResponse.json({ error: 'Basket not found' }, { status: 404 });
    }

    const removeRef = basketRef.collection('items').doc(removeCanonicalId);
    const addRef = basketRef.collection('items').doc(addCanonicalId);

    const batch = db.batch();
    batch.delete(removeRef);
    batch.set(addRef, { canonicalId: addCanonicalId, addedAt: FieldValue.serverTimestamp() });
    batch.update(basketRef, { updatedAt: FieldValue.serverTimestamp() });
    await batch.commit();

    return NextResponse.json({ message: 'Item swapped successfully' });
  } catch (error) {
    console.error('Swap item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
