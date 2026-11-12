import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { auth, db, FieldValue } from '@/lib/firebase-admin';

// POST /api/auth/update-verification - Update email verification status
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const uid = authResult.user!.uid;

        // Get Firebase Auth user to check email verification
        const userRecord = await auth.getUser(uid);

        // Update Firestore with current verification status
        await db.collection('users').doc(uid).update({
            emailVerified: userRecord.emailVerified,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            message: 'Email verification status updated',
            emailVerified: userRecord.emailVerified,
        });
    } catch (error) {
        console.error('Update verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
