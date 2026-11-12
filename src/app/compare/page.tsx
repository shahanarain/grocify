'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { CompareCard } from '@/components/CompareCard';
import { AddToBasket } from '@/components/AddToBasket';
import { CatalogProduct } from '@/lib/catalog-types';
import Link from 'next/link';

const CATEGORIES = [
  'all', 'Dairy', 'Beverages', 'Breakfast', 'Tea and Coffee', 'Snacks',
  'Home Essential', 'Laundry', 'DishWashing', 'Desserts', 'Fresh Products',
];
const SORTS = [
  { value: 'savings', label: 'Biggest savings' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'stores', label: 'Most stores' },
];
const PAGE = 24;

export default function ComparePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('savings');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPage = useCallback(async (reset: boolean) => {
    if (!user) return;
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const token = await user.getIdToken();
      const nextOffset = reset ? 0 : offset;
      const params = new URLSearchParams({ sort, limit: String(PAGE), offset: String(nextOffset) });
      if (category !== 'all') params.set('category', category);
      if (query) params.set('search', query);
      const res = await fetch(`/api/catalog?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const products: CatalogProduct[] = data?.products ?? [];
      const pagination = data?.pagination ?? {};
      setProducts((prev) => (reset ? products : [...prev, ...products]));
      setTotal(pagination.total ?? products.length);
      setHasMore(pagination.hasMore ?? false);
      setOffset(nextOffset + PAGE);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, category, sort, query, offset]);

  // Refetch from the top whenever filters change.
  useEffect(() => {
    setOffset(0);
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, category, sort, query]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compare &amp; Save</h1>
            <p className="mt-1 text-sm text-gray-500">
              The same product across stores — see who&apos;s cheapest before you buy.
            </p>
          </div>
          <Link href="/deals" className="btn-primary px-4 py-2 rounded-xl text-sm font-medium self-center">
            🔥 See Smart Deals
          </Link>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-surface rounded-lg shadow p-4 flex flex-wrap gap-3 items-center">
          <form
            onSubmit={(e) => { e.preventDefault(); setQuery(search.trim()); }}
            className="flex-1 min-w-[220px] flex gap-2"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comparable products..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500"
            />
            <button type="submit" className="btn-primary px-4 py-2 rounded-lg text-sm">Search</button>
          </form>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-surface">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-surface">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-surface shadow rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-3 space-y-2"><div className="h-4 bg-gray-200 rounded w-5/6" /><div className="h-5 bg-gray-200 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No comparable products found for these filters.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((p) => (
                <CompareCard key={p.canonicalId} product={p} action={<AddToBasket product={p} />} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <button onClick={() => fetchPage(false)} disabled={loadingMore}
                  className="px-6 py-3 btn-primary rounded-xl font-medium disabled:opacity-50">
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
            <div className="mt-6 text-center text-sm text-gray-500">Showing {products.length} of {total} comparable products</div>
          </>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
