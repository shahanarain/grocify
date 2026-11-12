import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/firebase-admin';

// GET /api/stores/[id]/products - Get products for a specific store
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id: storeId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const lastDocId = searchParams.get('lastDocId');

        // Query products where supplier matches store name
        const storeDoc = await db.collection('stores').doc(storeId).get();

        if (!storeDoc.exists) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const storeName = storeDoc.data()?.name;

        let query = db
            .collection('products')
            .where('supplier', '==', storeName)
            .where('status', '==', 1) // Only active products
            .orderBy('createdAt', 'desc')
            .limit(limit);

        // If we have a lastDocId, start after that document
        if (lastDocId) {
            const lastDoc = await db.collection('products').doc(lastDocId).get();
            if (lastDoc.exists) {
                query = query.startAfter(lastDoc);
            }
        }

        const productsSnapshot = await query.get();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const products = productsSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Don't fetch all products just to count - use hasMore to indicate if there are more
        // This is much more efficient for free tier
        const hasMore = productsSnapshot.docs.length === limit;

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total: hasMore ? products.length + 1 : products.length, // Approximate - we don't know exact total
                hasMore,
                lastDocId: productsSnapshot.docs.length > 0 ? productsSnapshot.docs[productsSnapshot.docs.length - 1].id : null
            }
        });
    } catch (error) {
        console.error('Get store products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
