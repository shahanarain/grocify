import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/demo-database';

// DELETE /api/lists/[listId] - Delete a list
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ listId: string }> }
) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const userId = authResult.user!.uid;
        const { listId } = await params;

        // Delete all products in the list first
        const productsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .collection('products')
            .get();

        const batch = db.batch();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productsSnapshot.docs.forEach((doc: any) => {
            batch.delete(doc.ref);
        });

        // Delete the list
        batch.delete(db.collection('users').doc(userId).collection('lists').doc(listId));

        await batch.commit();

        return NextResponse.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Delete list error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
