// Lightweight in-memory fixed-window rate limiter.
//
// NOTE: state lives in the process memory of a single instance. On a
// multi-instance / serverless deployment (e.g. Vercel) each instance keeps its
// own counters, so this bounds abuse on a warm instance but is not a global
// guarantee. For strict, cross-instance limits move this to a shared store
// (Upstash Redis, Firestore, etc.) — the call sites below won't need to change.

interface Window {
    count: number;
    resetAt: number;
}

const buckets = new Map<string, Window>();

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

/**
 * Allow up to `limit` requests per `windowMs` for a given key (e.g. a user id).
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || now >= existing.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
        };
    }

    existing.count += 1;
    return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

// Periodically drop expired buckets so the map doesn't grow unbounded.
// `unref` so this timer never keeps the process alive on its own.
if (typeof setInterval === 'function') {
    const cleanup = setInterval(() => {
        const now = Date.now();
        for (const [key, win] of buckets) {
            if (now >= win.resetAt) buckets.delete(key);
        }
    }, 60_000);
    (cleanup as unknown as { unref?: () => void }).unref?.();
}
