'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { AddToList } from '@/components/AddToList';
import Image from 'next/image';
import { formatCategoryName } from '@/lib/category-name';

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
  url: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  lastDocId: string | null;
}

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params.id as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState('');
  const [storeImage, setStoreImage] = useState('');
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false,
    lastDocId: null
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStoreAndProducts = async (isLoadMore = false) => {
      if (!user) return;

      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const token = await user.getIdToken();

        // Fetch store details (only on initial load)
        if (!isLoadMore) {
          const storeResponse = await fetch(`/api/stores/${storeId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!storeResponse.ok) {
            throw new Error('Failed to fetch store');
          }

          const storeData = await storeResponse.json();
          setStoreName(storeData.name);
          setStoreImage(storeData.imageUrl);
          setFollowers(storeData.followers || 0);
          setIsFollowing(storeData.isFollowing || false);
        }

        // Fetch products for this store with pagination
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        });

        if (isLoadMore && pagination.lastDocId) {
          params.append('lastDocId', pagination.lastDocId);
        }

        const productsResponse = await fetch(`/api/stores/${storeId}/products?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();

        if (isLoadMore) {
          setProducts(prev => [...prev, ...productsData.products]);
        } else {
          setProducts(productsData.products);
        }

        setPagination(productsData.pagination);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchStoreAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, storeId]);

  const handleFollowToggle = async () => {
    if (!user) return;

    setFollowLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/stores/${storeId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ follow: !isFollowing }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowers(data.followers);
    } catch (err: unknown) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasMore) {
      fetchStoreAndProducts(true, pagination.page + 1);
    }
  };

  const fetchStoreAndProducts = async (isLoadMore = false, page = pagination.page) => {
    if (!user) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const token = await user.getIdToken();

      // Fetch store details (only on initial load)
      if (!isLoadMore) {
        const storeResponse = await fetch(`/api/stores/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!storeResponse.ok) {
          throw new Error('Failed to fetch store');
        }

        const storeData = await storeResponse.json();
        setStoreName(storeData.name);
        setStoreImage(storeData.imageUrl);
        setFollowers(storeData.followers || 0);
        setIsFollowing(storeData.isFollowing || false);
      }

      // Fetch products for this store with pagination
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (isLoadMore && pagination.lastDocId) {
        params.append('lastDocId', pagination.lastDocId);
      }

      const productsResponse = await fetch(`/api/stores/${storeId}/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }

      const productsData = await productsResponse.json();

      if (isLoadMore) {
        setProducts(prev => [...prev, ...productsData.products]);
      } else {
        setProducts(productsData.products);
      }

      setPagination(productsData.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div>
            {/* Store Header with Follow Button */}
            <div className="bg-surface shadow rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {storeImage && (
                    <Image
                      src={storeImage}
                      alt={storeName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
                    <div className="flex items-center mt-1 space-x-4">
                      <p className="text-sm text-gray-500">{products.length} products</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {followers} followers
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'btn-primary'
                    }`}
                >
                  {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-surface overflow-hidden shadow-sm border border-gray-100 rounded-2xl card-lift"
                >
                  <div className="relative h-40 bg-white">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
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
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {formatCategoryName(product.category)}
                      </span>
                    </div>
                    {product.url && (
                      <div className="mt-3">
                        <a
                          href={product.url}
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
                    {!product.url && (
                      <div className="mt-3">
                        <AddToList product={product} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

            {products.length === 0 && !loading && (
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">This store has no products yet.</p>
              </div>
            )}
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
