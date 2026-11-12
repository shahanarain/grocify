import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db } from '@/lib/firebase-admin';

// GET /api/auth/profile - Get user profile
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const userDoc = await db.collection('users').doc(authResult.user!.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const userData = userDoc.data();

        return NextResponse.json({
            user: {
                uid: authResult.user!.uid,
                email: authResult.user!.email,
                ...userData,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
