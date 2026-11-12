import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/firebase-admin';

async function getListProduct(productId: string) {
    const productDoc = await db.collection('products').doc(productId).get();
    if (productDoc.exists) return { id: productDoc.id, ...productDoc.data() };

    // Catalog pages identify products canonically; resolve those IDs too.
    const catalogDoc = await db.collection('catalogProducts').doc(productId).get();
    if (!catalogDoc.exists) return null;
    const catalog = catalogDoc.data();
    return {
        id: productId,
        name: catalog?.title,
        newPrice: catalog?.minPrice,
        oldPrice: catalog?.maxPrice,
        imageUrl: catalog?.image,
        supplier: catalog?.cheapestStore,
        discount: catalog?.savingPct,
        quantity: catalog?.quantity,
        category: catalog?.category,
        subCategory: catalog?.subCategory,
        url: catalog?.offers?.find((offer: { store: string }) => offer.store === catalog?.cheapestStore)?.url,
    };
}

// GET /api/lists/[listId]/products - Get products in a list
export async function GET(
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

        // Check if list exists
        const listDoc = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .get();

        if (!listDoc.exists) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        // Get product references from the list
        const productRefsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .collection('products')
            .orderBy('addedAt', 'desc')
            .get();

        if (productRefsSnapshot.empty) {
            return NextResponse.json({
                list: {
                    id: listDoc.id,
                    ...listDoc.data()
                },
                products: []
            });
        }

        // Fetch actual product data from main products collection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productIds = productRefsSnapshot.docs.map((doc: any) => doc.id);
        const productsPromises = productIds.map(async (productId) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listRefDoc = productRefsSnapshot.docs.find((doc: any) => doc.id === productId);
            const product = await getListProduct(productId);
            return product ? { ...product, addedAt: listRefDoc?.data()?.addedAt } : null;
        });

        const products = (await Promise.all(productsPromises)).filter(Boolean);

        return NextResponse.json({
            list: {
                id: listDoc.id,
                ...listDoc.data()
            },
            products
        });
    } catch (error) {
        console.error('Get list products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/lists/[listId]/products - Add product to list
export async function POST(
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
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Check if product exists in main products collection
        const productDoc = await db.collection('products').doc(productId).get();
        const catalogDoc = productDoc.exists
            ? null
            : await db.collection('catalogProducts').doc(productId).get();
        if (!productDoc.exists && !catalogDoc?.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Check if list exists
        const listDoc = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .get();

        if (!listDoc.exists) {
            return NextResponse.json({ error: 'List not found' }, { status: 404 });
        }

        // Check if product already exists in list
        const existingProductDoc = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .collection('products')
            .doc(productId)
            .get();

        if (existingProductDoc.exists) {
            return NextResponse.json({ error: 'Product already exists in this list' }, { status: 400 });
        }

        // Add product reference to list (only store productId and addedAt)
        await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .collection('products')
            .doc(productId)
            .set({
                productId,
                addedAt: FieldValue.serverTimestamp(),
            });

        // Update list product count
        await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .doc(listId)
            .update({
                productCount: FieldValue.increment(1),
                updatedAt: FieldValue.serverTimestamp(),
            });

        return NextResponse.json({
            message: 'Product added to list successfully',
            productCount: (listDoc.data()?.productCount || 0) + 1
        });
    } catch (error) {
        console.error('Add product to list error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
