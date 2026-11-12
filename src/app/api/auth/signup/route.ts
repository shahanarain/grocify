import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { auth, db, FieldValue } from '@/lib/firebase-admin';

// POST /api/auth/signup - Creates Firestore profile for authenticated user
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { uid, email, name } = authResult.user!;

        if (!uid || !email) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
        }

        // Check if profile already exists
        const userDoc = await db.collection('users').doc(uid).get();

        if (userDoc.exists) {
            return NextResponse.json({
                message: 'User profile already exists',
                user: {
                    uid,
                    email,
                    ...userDoc.data(),
                },
            });
        }

        // Get display name from Firebase Auth user
        const userRecord = await auth.getUser(uid);
        const displayName = userRecord.displayName || name || 'User';

        // Store user profile in Firestore
        await db.collection('users').doc(uid).set({
            uid,
            name: displayName,
            email,
            role: 'user',
            emailVerified: false,
            createdAt: FieldValue.serverTimestamp(),
            provider: 'email',
        });

        return NextResponse.json({
            message: 'User profile created successfully',
            user: {
                uid,
                email,
                name: displayName,
                role: 'user',
            },
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
