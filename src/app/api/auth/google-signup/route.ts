import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { auth, db, FieldValue } from '@/lib/firebase-admin';

// POST /api/auth/google-signup - Create/retrieve profile for Google sign-in users
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const uid = authResult.user!.uid;
        const email = authResult.user!.email;

        // Get user from Firebase Auth to get display name and photo
        const userRecord = await auth.getUser(uid);
        const name = userRecord.displayName || authResult.user!.name || 'Google User';
        const photoURL = userRecord.photoURL || null;

        // Check if user already exists
        const userDoc = await db.collection('users').doc(uid).get();

        if (userDoc.exists) {
            return NextResponse.json({
                message: 'User already exists',
                user: {
                    uid,
                    email,
                    ...userDoc.data(),
                },
            });
        }

        // Create new user profile for Google sign-in
        await db.collection('users').doc(uid).set({
            uid,
            name,
            email,
            photoURL,
            role: 'user',
            emailVerified: true, // Google emails are already verified
            createdAt: FieldValue.serverTimestamp(),
            provider: 'google',
        });

        return NextResponse.json({
            message: 'Google user profile created successfully',
            user: {
                uid,
                email,
                name,
                photoURL,
                role: 'user',
                provider: 'google',
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Google signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
