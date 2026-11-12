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

        // Demo tokens are only for local development; never accept them in production.
        if (process.env.NODE_ENV !== 'production' && (token === 'demo-token-grocify-user-123' || token.startsWith('demo-'))) {
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
