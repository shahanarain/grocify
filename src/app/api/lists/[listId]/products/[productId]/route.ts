import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/firebase-admin';

// DELETE /api/lists/[listId]/products/[productId] - Remove product from list
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ listId: string; productId: string }> }
) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const userId = authResult.user!.uid;
        const { listId, productId } = await params;

        // Remove product from list
        await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .collection('products')
            .doc(productId)
            .delete();

        // Update list product count
        await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .update({
                productCount: FieldValue.increment(-1),
                updatedAt: FieldValue.serverTimestamp(),
            });

        return NextResponse.json({ message: 'Product removed from list successfully' });
    } catch (error) {
        console.error('Remove product from list error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
