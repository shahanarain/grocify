import { NextRequest } from 'next/server';

export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
}

const DEMO_TOKEN = 'demo-token-grocify-user-123';

export async function verifyToken(request: NextRequest): Promise<{ user?: AuthUser; error?: string; status?: number }> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return { error: 'No token provided', status: 401 };
  if (token !== DEMO_TOKEN) return { error: 'Invalid demo token', status: 401 };

  return {
    user: { uid: 'demo-user-1', email: 'demo@grocify.com', name: 'Demo User' },
  };
}
