import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/demo-database';

// POST /api/auth/verify - Verify token and get user profile
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Get the shared demo profile
        const userDoc = await db.collection('users').doc(authResult.user!.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        return NextResponse.json({
            message: 'Token verified successfully',
            user: {
                uid: authResult.user!.uid,
                email: authResult.user!.email,
                ...userData,
            },
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
