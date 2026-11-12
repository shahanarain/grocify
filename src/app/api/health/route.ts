import { NextResponse } from 'next/server';

// GET /api/health - Health check endpoint.
// `node` exposes the runtime version to diagnose deploy issues (e.g. the
// jose/jwks-rsa ERR_REQUIRE_ESM error only occurs on Node < 20.19 / < 22.12).
export async function GET() {
    return NextResponse.json({ message: 'Grocify API is running!', node: process.version });
}
