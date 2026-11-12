import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/demo-database';

async function getListProduct(productId: string) {
    const productDoc = await db.collection('products').doc(productId).get();
    if (productDoc.exists) return productDoc.data();

    // Catalog pages use canonical IDs while store pages use individual offer IDs.
    const catalogDoc = await db.collection('catalogProducts').doc(productId).get();
    if (!catalogDoc.exists) return null;
    const catalog = catalogDoc.data();
    return {
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

// GET /api/lists - Get user's lists
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const userId = authResult.user!.uid;

        const listsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .orderBy('createdAt', 'desc')
            .get();

        const lists = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            listsSnapshot.docs.map(async (doc: any) => {
                const listData = doc.data();

                // Get products in this list to calculate total
                const productsSnapshot = await db
                    .collection('users')
                    .doc(userId)
                    .collection('lists')
                    .doc(doc.id)
                    .collection('products')
                    .get();

                if (productsSnapshot.empty) {
                    return {
                        id: doc.id,
                        ...listData,
                        totalPrice: 0
                    };
                }

                // Fetch actual product data to get prices
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const productIds = productsSnapshot.docs.map((doc: any) => doc.id);
                const productsPromises = productIds.map(async (productId) => {
                    return getListProduct(productId);
                });

                const products = (await Promise.all(productsPromises)).filter(Boolean);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const totalPrice = products.reduce((sum: number, product: any) => sum + (product?.newPrice || 0), 0);

                return {
                    id: doc.id,
                    ...listData,
                    totalPrice
                };
            })
        );

        return NextResponse.json({ lists });
    } catch (error) {
        console.error('Get lists error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/lists - Create a new list
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const userId = authResult.user!.uid;
        const { name, description } = await request.json();

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'List name is required' }, { status: 400 });
        }

        const listData = {
            name: name.trim(),
            description: description?.trim() || '',
            productCount: 0,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        const listRef = await db
            .collection('users')
            .doc(userId)
            .collection('lists')
            .add(listData);

        return NextResponse.json({
            message: 'List created successfully',
            list: {
                id: listRef.id,
                ...listData
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Create list error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
