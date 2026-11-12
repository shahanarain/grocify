import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/demo-database';

// PATCH /api/inventory/[itemId] - Update pantry item quantity or settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;
    const { itemId } = await params;

    const body = await request.json();
    const itemRef = db.collection('users').doc(userId).collection('inventory').doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Item not found in inventory' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (typeof body.quantity === 'number') {
      updates.quantity = Math.max(0, body.quantity);
    } else if (typeof body.delta === 'number') {
      const current = doc.data()?.quantity || 0;
      updates.quantity = Math.max(0, current + body.delta);
    }

    if (typeof body.minThreshold === 'number') {
      updates.minThreshold = Math.max(0, body.minThreshold);
    }

    if (body.expiryDate !== undefined) {
      updates.expiryDate = body.expiryDate ? String(body.expiryDate).trim() : null;
    }

    if (body.name && typeof body.name === 'string') {
      updates.name = body.name.trim();
    }

    if (body.unit && typeof body.unit === 'string') {
      updates.unit = body.unit.trim();
    }

    if (body.notes !== undefined) {
      updates.notes = String(body.notes).trim();
    }

    await itemRef.update(updates);

    return NextResponse.json({ message: 'Item updated successfully', updates });
  } catch (error) {
    console.error('Update inventory item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/inventory/[itemId] - Remove an item from home pantry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userId = authResult.user!.uid;
    const { itemId } = await params;

    const itemRef = db.collection('users').doc(userId).collection('inventory').doc(itemId);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Item not found in inventory' }, { status: 404 });
    }

    await itemRef.delete();

    return NextResponse.json({ message: 'Item deleted from inventory' });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

