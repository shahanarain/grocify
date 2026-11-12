import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/login - Note: Firebase Admin SDK doesn't have a direct login method
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Note: Firebase Admin SDK doesn't have a direct login method
        // The frontend will handle login and send the ID token here for verification
        return NextResponse.json({ message: 'Login should be handled on the frontend' });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
