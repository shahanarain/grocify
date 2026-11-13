'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { AddToList } from '@/components/AddToList';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    imageUrl: string;
    newPrice: number;
    oldPrice: number;
    quantity: string;
    category: string;
    subCategory: string;
    discount: number;
    supplier: string;
    createdAt: Date | { toDate: () => Date };
    url: string;
    offers?: { store: string; name: string; price: number; url: string }[];
}

interface PaginationInfo {
    limit: number;
    total: number;
    hasMore: boolean;
    lastDocId: string | null;
}

export default function SubCategoryProductsPage() {
    const params = useParams();
    const router = useRouter();
    // Next.js has already decoded dynamic route params.
    const category = params.category as string;
    const subCategory = params.subCategory as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<PaginationInfo>({
        limit: 20,
        total: 0,
        hasMore: false,
        lastDocId: null
    });

    const { user } = useAuth();

    const fetchProducts = useCallback(async (isLoadMore = false) => {
        if (!user) return;

        try {
            setError('');
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const token = await user.getIdToken();
            const queryParams = new URLSearchParams({
                limit: pagination.limit.toString(),
                category: category,
                subCategory: subCategory,
            });

            if (isLoadMore && pagination.lastDocId) {
                queryParams.append('lastDocId', pagination.lastDocId);
            }

            const response = await fetch(`/api/products?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            if (!Array.isArray(data.products) || !data.pagination) {
                throw new Error('The product response was invalid');
            }

            if (isLoadMore) {
                setProducts(prev => [...prev, ...data.products]);
            } else {
                setProducts(data.products);
            }

            setPagination(data.pagination);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
            setError(errorMessage);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [user, category, subCategory, pagination.limit, pagination.lastDocId]);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, category, subCategory]);

    const handleLoadMore = () => {
        if (!loadingMore && pagination.hasMore) {
            fetchProducts(true);
        }
    };

    return (
        <ProtectedRoute>
            <AppLayout>
                <div>
                    {/* Breadcrumb */}
                    <nav className="mb-4">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link href="/categories" className="text-green-600 hover:text-green-700">
                                    Categories
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <span className="text-gray-600">{category}</span>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <span className="text-gray-900 font-medium">{subCategory}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{subCategory}</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {category} • {products.length} products
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No products available in this subcategory.
                            </p>
                            <Link
                                href="/categories"
                                className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Browse other categories
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {products.map((product) => {
                                    const productUrl = product.url && product.url !== '#'
                                        ? product.url
                                        : product.offers?.find((offer) => offer.store === product.supplier)?.url;

                                    return (
                                    <div
                                        key={product.id}
                                        className="bg-surface overflow-hidden shadow-sm border border-gray-100 rounded-2xl card-lift"
                                    >
                                        <div className="relative h-40 bg-gray-50 flex items-center justify-center">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-2"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
                                                    <span className="text-3xl mb-1">🛒</span>
                                                    <span>{product.subCategory || 'Grocery'}</span>
                                                </div>
                                            )}
                                            {product.discount > 0 && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    -{product.discount}%
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-2">{product.quantity}</p>
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-lg font-bold text-green-600">
                                                    Rs. {product.newPrice}
                                                </span>
                                                {product.oldPrice > 0 && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        Rs. {product.oldPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">{product.supplier}</span>
                                            </div>
                                            {productUrl && (
                                                <div className="mt-3">
                                                    <a
                                                        href={productUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full btn-primary text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center mb-2"
                                                    >
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Visit Site
                                                    </a>
                                                    <AddToList product={product} />
                                                </div>
                                            )}
                                            {!productUrl && (
                                                <div className="mt-3">
                                                    <AddToList product={product} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            {/* Load More Button */}
                            {pagination.hasMore && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-3 btn-primary rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingMore ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Loading...
                                            </div>
                                        ) : (
                                            'Load More Products'
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Products Count */}
                            <div className="mt-6 text-center text-sm text-gray-500">
                                Showing {products.length} of {pagination.total} products
                            </div>
                        </>
                    )}
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
