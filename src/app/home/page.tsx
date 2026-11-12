'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { AddToList } from '@/components/AddToList';
import Image from 'next/image';

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
}

interface PaginationInfo {
  limit: number;
  total: number;
  hasMore: boolean;
  lastDocId: string | null;
}

// Category hierarchy from database
const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Baking and Cooking', label: 'Baking and Cooking' },
  { value: 'Beverages', label: 'Beverages' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Candies And BubbleGum', label: 'Candies & BubbleGum' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Desserts', label: 'Desserts' },
  { value: 'DishWashing', label: 'DishWashing' },
  { value: 'Food Staples', label: 'Food Staples' },
  { value: 'Fresh Products', label: 'Fresh Products' },
  { value: 'Frozen Foods', label: 'Frozen Foods' },
  { value: 'Home Essential', label: 'Home Essential' },
  { value: 'Laundry', label: 'Laundry' },
  { value: 'Rice and Flour', label: 'Rice and Flour' },
  { value: 'Snacks', label: 'Snacks' },
  { value: 'Tea and Coffee', label: 'Tea and Coffee' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    limit: 12,
    total: 0,
    hasMore: false,
    lastDocId: null
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const { user } = useAuth();

  const fetchProducts = useCallback(async (isLoadMore = false, searchParams?: { search?: string; category?: string }) => {
    if (!user) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else if (searchParams?.search) {
        setSearching(true);
      } else {
        setLoading(true);
      }

      const token = await user.getIdToken();
      // Use higher limit for search (30) vs normal browsing (12)
      const searchLimit = searchParams?.search ? 30 : pagination.limit;
      const params = new URLSearchParams({
        limit: searchLimit.toString(),
      });

      // Add search query if provided
      if (searchParams?.search) {
        params.append('search', searchParams.search);
        setIsSearchMode(true);
      }

      // Add category filter
      if (searchParams?.category && searchParams.category !== 'all') {
        params.append('category', searchParams.category);
      }

      if (isLoadMore && pagination.lastDocId && !searchParams?.search) {
        params.append('lastDocId', pagination.lastDocId);
      }

      const response = await fetch(`/api/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (isLoadMore) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }

      setPagination(data.pagination);

      if (data.isSearchResult) {
        setIsSearchMode(true);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearching(false);
    }
  }, [user, pagination.limit, pagination.lastDocId]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      fetchProducts(false, { search: searchQuery.trim(), category: selectedCategory });
    } else if (searchQuery.trim().length === 0) {
      // Reset to normal view
      setIsSearchMode(false);
      fetchProducts(false, { category: selectedCategory });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (searchQuery.trim().length >= 2) {
      fetchProducts(false, { search: searchQuery.trim(), category });
    } else {
      setIsSearchMode(false);
      fetchProducts(false, { category });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setIsSearchMode(false);
    fetchProducts();
  };

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasMore && !isSearchMode) {
      fetchProducts(true);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover products from all stores
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 bg-surface rounded-lg shadow p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name (min 2 characters)..."
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-gray-900 bg-surface"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={searching || (searchQuery.length > 0 && searchQuery.length < 2)}
                  className="px-6 py-2 btn-primary rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {searching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search
                    </>
                  )}
                </button>
              </div>

              {/* Search Tips */}
              {searchQuery.length === 1 && (
                <p className="text-xs text-amber-600">
                  Please enter at least 2 characters to search
                </p>
              )}
            </form>

            {/* Active Filters Display */}
            {(isSearchMode || selectedCategory !== 'all') && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {isSearchMode && searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchMode(false);
                        fetchProducts(false, { category: selectedCategory });
                      }}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Category: {selectedCategory}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearSearch}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-surface shadow rounded-lg overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              {/* Products Grid */}
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
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">{product.supplier}</span>
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

              {/* Load More Button - Only show when not in search mode */}
              {pagination.hasMore && !isSearchMode && (
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
                {isSearchMode ? (
                  `Found ${products.length} products`
                ) : (
                  `Showing ${products.length} of ${pagination.total} products`
                )}
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isSearchMode
                      ? 'Try a different search term or clear filters'
                      : 'No products are available at the moment.'
                    }
                  </p>
                  {isSearchMode && (
                    <button
                      onClick={handleClearSearch}
                      className="mt-4 text-green-600 hover:text-green-700 font-medium"
                    >
                      Clear search and filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}