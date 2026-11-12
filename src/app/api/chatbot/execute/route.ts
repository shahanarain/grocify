import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/lib/firebase-admin';

interface WhereCondition {
    field: string;
    operator: string;
    value: unknown;
}

interface OrderByCondition {
    field: string;
    direction: 'asc' | 'desc';
}

interface Query {
    where?: WhereCondition[];
    orderBy?: OrderByCondition[];
    limit?: number;
    startAfter?: string;
}

interface Product {
    id: string;
    name?: string;
    [key: string]: unknown;
}

// Only these collections may be queried via the chatbot. The `users` collection
// (and any other internal collection) is intentionally excluded so an
// authenticated client cannot exfiltrate other users' data through this endpoint.
const ALLOWED_FIELDS: Record<string, ReadonlySet<string>> = {
    products: new Set([
        'name', 'imageUrl', 'newPrice', 'oldPrice', 'quantity', 'category',
        'subCategory', 'discount', 'supplier', 'status', 'createdAt', 'url',
    ]),
    stores: new Set(['name', 'imageUrl', 'followers', 'status']),
};

const VALID_OPERATORS = new Set(['==', '!=', '<', '<=', '>', '>=', 'in', 'not-in', 'array-contains', 'array-contains-any']);

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

// POST /api/chatbot/execute - Execute a restricted Firebase query
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Limit query executions per user: 30 requests per minute.
        const rl = rateLimit(`chatbot-execute:${authResult.user!.uid}`, 30, 60_000);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please slow down.' },
                { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
            );
        }

        const { query, collection } = await request.json() as { query: Query; collection: string };

        if (!query || !collection) {
            return NextResponse.json({ error: 'Query and collection are required' }, { status: 400 });
        }

        // Whitelist the collection — never allow arbitrary/internal collections.
        const allowedFields = ALLOWED_FIELDS[collection];
        if (!allowedFields) {
            return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
        }

        const isAllowedField = (field: unknown): field is string =>
            typeof field === 'string' && allowedFields.has(field);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let firestoreQuery: any = db.collection(collection);

        // Apply query conditions
        if (query.where) {
            for (const condition of query.where) {
                if (!isAllowedField(condition.field)) {
                    return NextResponse.json({ error: 'Invalid query field' }, { status: 400 });
                }
                if (!VALID_OPERATORS.has(condition.operator)) {
                    return NextResponse.json({ error: 'Invalid query operator' }, { status: 400 });
                }
                firestoreQuery = firestoreQuery.where(condition.field, condition.operator, condition.value);
            }
        }

        if (query.orderBy) {
            for (const order of query.orderBy) {
                if (!isAllowedField(order.field)) {
                    return NextResponse.json({ error: 'Invalid orderBy field' }, { status: 400 });
                }
                const direction = order.direction === 'desc' ? 'desc' : 'asc';
                firestoreQuery = firestoreQuery.orderBy(order.field, direction);
            }
        }

        // Always cap the number of documents read.
        const limit = Math.min(
            Number.isInteger(query.limit) && query.limit! > 0 ? query.limit! : DEFAULT_LIMIT,
            MAX_LIMIT,
        );
        firestoreQuery = firestoreQuery.limit(limit);

        if (query.startAfter) {
            const lastDoc = await db.collection(collection).doc(query.startAfter).get();
            if (lastDoc.exists) {
                firestoreQuery = firestoreQuery.startAfter(lastDoc);
            }
        }

        const snapshot = await firestoreQuery.get();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let results: Product[] = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        // If no results and we have text-based queries, try a broader search
        if (results.length === 0 && query.where) {
            const textFields = query.where.filter((condition: WhereCondition) =>
                condition.field === 'name' && (condition.operator === '>=' || condition.operator === '<=')
            );

            if (textFields.length > 0) {
                console.log('No results found, trying broader search...');
                // Try a simpler approach - get all products and filter in memory
                const allProductsSnapshot = await db.collection(collection).limit(100).get();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const allProducts: Product[] = allProductsSnapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Filter products that contain the search term
                const searchTerm = String(textFields[0].value).toLowerCase();
                results = allProducts.filter((product: Product) =>
                    product.name && product.name.toLowerCase().includes(searchTerm)
                );
            }
        }

        return NextResponse.json({
            results,
            count: results.length,
            hasMore: snapshot.docs.length === limit
        });

    } catch (error) {
        console.error('Query execution error:', error);
        return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 });
    }
}
