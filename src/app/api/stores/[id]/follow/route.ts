import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { db, FieldValue } from '@/lib/demo-database';
import { MockTransaction } from '@/lib/mock-firestore';

// POST /api/stores/[id]/follow - Follow/Unfollow a store
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id: storeId } = await params;
        const userId = authResult.user!.uid;
        const { follow } = await request.json();

        if (typeof follow !== 'boolean') {
            return NextResponse.json({ error: '`follow` must be a boolean' }, { status: 400 });
        }

        const storeRef = db.collection('stores').doc(storeId);
        const followedStoreRef = db
            .collection('users')
            .doc(userId)
            .collection('followedStores')
            .doc(storeId);

        // Run the read + counter update in a transaction so the followers count
        // can't drift: following twice (or unfollowing when not following) must
        // be a no-op for the counter rather than double-counting / going negative.
        const followers = await db.runTransaction(async (tx: MockTransaction) => {
            const storeDoc = await tx.get(storeRef);
            if (!storeDoc.exists) {
                return null;
            }

            const alreadyFollowing = (await tx.get(followedStoreRef)).exists;
            const currentFollowers = storeDoc.data()?.followers || 0;

            if (follow && !alreadyFollowing) {
                tx.set(followedStoreRef, {
                    storeId,
                    followedAt: FieldValue.serverTimestamp(),
                });
                tx.update(storeRef, { followers: FieldValue.increment(1) });
                return currentFollowers + 1;
            }

            if (!follow && alreadyFollowing) {
                tx.delete(followedStoreRef);
                // Guard against ever going below zero.
                tx.update(storeRef, {
                    followers: FieldValue.increment(currentFollowers > 0 ? -1 : 0),
                });
                return Math.max(0, currentFollowers - 1);
            }

            // No state change — counter stays as-is.
            return currentFollowers;
        });

        if (followers === null) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: follow ? 'Store followed successfully' : 'Store unfollowed successfully',
            isFollowing: follow,
            followers,
        });
    } catch (error) {
        console.error('Follow store error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
