'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { ProductCard, ProductCardData } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { formatCategoryName } from '@/lib/category-name';

interface Product extends ProductCardData {
    createdAt: Date | { toDate: () => Date };
}

interface PaginationInfo {
    limit: number;
    total: number;
    hasMore: boolean;
    lastDocId: string | null;
}

function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-surface">
            <div className="aspect-square animate-pulse bg-gray-100" />
            <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
            </div>
        </div>
    );
}

export default function SubCategoryProductsPage() {
    const params = useParams<{ category: string; subCategory: string }>();
    const router = useRouter();
    // Decode a residual encoded segment once for both display and API filtering.
    const category = formatCategoryName(params.category);
    const subCategory = formatCategoryName(params.subCategory);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<PaginationInfo>({
        limit: 20,
        total: 0,
        hasMore: false,
        lastDocId: null,
    });

    const { user } = useAuth();

    const fetchProducts = useCallback(async (isLoadMore = false) => {
        if (!user) return;

        try {
            setError('');
            if (isLoadMore) setLoadingMore(true);
            else setLoading(true);

            const token = await user.getIdToken();
            const queryParams = new URLSearchParams({
                limit: pagination.limit.toString(),
                category,
                subCategory,
            });

            if (isLoadMore && pagination.lastDocId) {
                queryParams.set('lastDocId', pagination.lastDocId);
            }

            const response = await fetch(`/api/products?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Could not load products. Please try again.');

            const data = await response.json();
            if (!Array.isArray(data.products) || !data.pagination) {
                throw new Error('The product response was invalid. Please try again.');
            }

            setProducts((current) => isLoadMore ? [...current, ...data.products] : data.products);
            setPagination(data.pagination);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Could not load products. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [user, category, subCategory, pagination.limit, pagination.lastDocId]);

    useEffect(() => {
        fetchProducts();
        // A new category route should always start from its first page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, category, subCategory]);

    const description = `Browse ${subCategory} in ${category} and compare available products and prices.`;

    return (
        <ProtectedRoute>
            <AppLayout>
                <main className="mx-auto w-full max-w-7xl pb-10">
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            <li className="shrink-0">
                                <Link href="/categories" className="font-medium text-green-700 transition-colors hover:text-green-800 hover:underline">
                                    Categories
                                </Link>
                            </li>
                            <li aria-hidden="true" className="text-gray-300">/</li>
                            <li className="min-w-0 max-w-[42vw] truncate text-gray-500 sm:max-w-none">
                                <span title={category}>{category}</span>
                            </li>
                            <li aria-hidden="true" className="text-gray-300">/</li>
                            <li aria-current="page" className="min-w-0 max-w-[42vw] truncate font-medium text-gray-900 sm:max-w-none">
                                <span title={subCategory}>{subCategory}</span>
                            </li>
                        </ol>
                    </nav>

                    <header className="mb-7 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                                {category}
                            </p>
                            <h1 className="break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {subCategory}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                                {description}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                            <p className="text-sm text-gray-500" aria-live="polite">
                                {loading ? 'Loading products…' : (
                                    <><span className="font-semibold text-gray-900">{pagination.total}</span> {pagination.total === 1 ? 'product' : 'products'}</>
                                )}
                            </p>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-surface px-3.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M19 12H5m0 0 7 7m-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>
                        </div>
                    </header>

                    {loading ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                            {Array.from({ length: 10 }, (_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    ) : error ? (
                        <section role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                            <h2 className="text-base font-semibold text-rose-900">We couldn’t load these products</h2>
                            <p className="mt-1 text-sm text-rose-700">{error}</p>
                            <button
                                type="button"
                                onClick={() => fetchProducts()}
                                className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
                            >
                                Try again
                            </button>
                        </section>
                    ) : products.length === 0 ? (
                        <section className="rounded-2xl border border-dashed border-gray-300 bg-surface px-5 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="10" cy="20" r="1" fill="currentColor" />
                                    <circle cx="18" cy="20" r="1" fill="currentColor" />
                                </svg>
                            </div>
                            <h2 className="mt-4 text-lg font-semibold text-gray-900">No products here yet</h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                                We couldn’t find products in {subCategory}. Explore another category to keep browsing.
                            </p>
                            <Link href="/categories" className="mt-5 inline-flex items-center rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800">
                                Browse categories
                            </Link>
                        </section>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                                {products.map((product) => <ProductCard key={product.id} product={product} />)}
                            </div>

                            {pagination.hasMore && (
                                <div className="mt-9 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => fetchProducts(true)}
                                        disabled={loadingMore}
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-surface px-5 text-sm font-semibold text-gray-700 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loadingMore ? 'Loading more…' : 'Load more products'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </AppLayout>
        </ProtectedRoute>
    );
}
