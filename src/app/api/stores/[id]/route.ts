import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/firebase-admin';

// GET /api/stores/[id] - Get single store
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;
        const storeDoc = await db.collection('stores').doc(id).get();

        if (!storeDoc.exists) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const storeData = storeDoc.data();
        const userId = authResult.user!.uid;

        // Check if user is following this store
        const followDoc = await db
            .collection('users')
            .doc(userId)
            .collection('followedStores')
            .doc(id)
            .get();

        return NextResponse.json({
            id: storeDoc.id,
            ...storeData,
            isFollowing: followDoc.exists,
        });
    } catch (error) {
        console.error('Get store error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
