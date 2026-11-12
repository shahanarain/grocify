import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/firebase-admin';

// GET /api/stores - Get all stores
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const storesSnapshot = await db.collection('stores').get();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stores = storesSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            stores,
            count: stores.length
        });
    } catch (error) {
        console.error('Get stores error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
