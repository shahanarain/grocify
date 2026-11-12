import { NextRequest } from 'next/server';
import { auth } from './firebase-admin';

export interface AuthUser {
    uid: string;
    email?: string;
    name?: string;
}

export async function verifyToken(request: NextRequest): Promise<{ user?: AuthUser; error?: string; status?: number }> {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { error: 'No token provided', status: 401 };
        }

        const token = authHeader.split(' ')[1];

        const hasFirebaseAdminCredentials = Boolean(
            process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_PROJECT_ID !== 'your-project-id' &&
            process.env.FIREBASE_PRIVATE_KEY &&
            !process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE') &&
            process.env.FIREBASE_CLIENT_EMAIL
        );
        const demoModeEnabled = process.env.NODE_ENV !== 'production' ||
            (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && !hasFirebaseAdminCredentials);

        // In production, accept only the fixed demo token and only when the
        // deployment explicitly enables sample-data demo mode without Firebase.
        if (demoModeEnabled && token === 'demo-token-grocify-user-123') {
            return {
                user: {
                    uid: 'demo-user-1',
                    email: 'demo@grocify.com',
                    name: 'Demo User',
                }
            };
        }

        const decodedToken = await auth.verifyIdToken(token);
        return {
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                name: decodedToken.name,
            }
        };
    } catch (error) {
        console.error('Token verification error:', error);
        return { error: 'Invalid token', status: 401 };
    }
}
