'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { CompareCard } from '@/components/CompareCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import {
  CatalogProduct,
  StoreSlice,
  SingleStoreOption,
  TwoStoreOption,
  ProductSubstitution,
} from '@/lib/catalog-types';

interface Optimization {
  multiStoreTotal: number;
  basketMax: number;
  totalSaving: number;
  savingPct: number;
  storesToVisit: number;
  storeSplit: StoreSlice[];
  singleStoreOptions: SingleStoreOption[];
  twoStoreOption?: TwoStoreOption | null;
  substitutions?: ProductSubstitution[];
}
interface Basket { id: string; name: string; itemCount: number; source: string; }

export default function BasketDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const basketId = params.id as string;
  const { toasts, removeToast, success, error: showError } = useToast();

  const [basket, setBasket] = useState<Basket | null>(null);
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [opt, setOpt] = useState<Optimization | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'multi' | 'two' | 'single'>('multi');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [swappingId, setSwappingId] = useState<string | null>(null);

  // add-item search
  const [searchQ, setSearchQ] = useState('');
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/baskets/${basketId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Basket not found');
      const data = await res.json();
      setBasket(data.basket);
      setItems(data.items);
      setOpt(data.optimization);
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to load basket');
    } finally {
      setLoading(false);
    }
  }, [user, basketId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const removeItem = async (canonicalId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/baskets/${basketId}/items?canonicalId=${encodeURIComponent(canonicalId)}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove');
      await load();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  };

  const addItem = async (canonicalId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/baskets/${basketId}/items`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ canonicalId }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to add'); }
      success('Added to basket');
      setResults((r) => r.filter((p) => p.canonicalId !== canonicalId));
      await load();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const swapItem = async (removeCanonicalId: string, addCanonicalId: string) => {
    if (!user) return;
    setSwappingId(removeCanonicalId);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/baskets/${basketId}/items`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeCanonicalId, addCanonicalId }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to swap item');
      }
      success('Swapped for cheaper alternative!');
      await load();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to swap item');
    } finally {
      setSwappingId(null);
    }
  };

  const runSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || searchQ.trim().length < 2) return;
    setSearching(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/catalog?search=${encodeURIComponent(searchQ.trim())}&limit=8`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const existing = new Set(items.map((i) => i.canonicalId));
      setResults((data.products || []).filter((p: CatalogProduct) => !existing.has(p.canonicalId)));
    } finally {
      setSearching(false);
    }
  };

  const deleteBasket = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch(`/api/baskets/${basketId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      router.push('/baskets');
    } catch {
      showError('Failed to delete basket');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute><AppLayout>
        <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" /></div>
      </AppLayout></ProtectedRoute>
    );
  }

  const bestSingle = opt?.singleStoreOptions[0];

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Header */}
        <div className="bg-surface shadow rounded-lg p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{basket?.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/baskets')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Back</button>
            <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 mb-6">This basket is empty. Search below to add products.</div>
        ) : opt && (
          /* ---- Optimizer panel ---- */
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-green-100">Smart total</div>
                <div className="text-3xl font-extrabold">Rs. {opt.multiStoreTotal.toLocaleString()}</div>
                {opt.totalSaving > 0 && (
                  <div className="text-sm text-green-100">
                    vs <span className="line-through">Rs. {opt.basketMax.toLocaleString()}</span> ·{' '}
                    <span className="font-semibold text-white">save Rs. {opt.totalSaving.toLocaleString()} ({opt.savingPct}%)</span>
                  </div>
                )}
              </div>
              {/* toggle */}
              <div className="bg-white/15 rounded-xl p-1 flex text-xs sm:text-sm font-medium">
                <button
                  onClick={() => setView('multi')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    view === 'multi' ? 'bg-white text-green-700 font-bold shadow' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Cheapest per item
                </button>
                <button
                  onClick={() => setView('two')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    view === 'two' ? 'bg-white text-green-700 font-bold shadow' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Best 2 Stores
                </button>
                <button
                  onClick={() => setView('single')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    view === 'single' ? 'bg-white text-green-700 font-bold shadow' : 'text-white hover:bg-white/10'
                  }`}
                >
                  One-stop shop
                </button>
              </div>
            </div>

            {view === 'multi' ? (
              <div>
                <p className="text-sm text-green-100 mb-3">
                  Buy each item at its cheapest store — visit <b className="text-white">{opt.storesToVisit} store{opt.storesToVisit !== 1 ? 's' : ''}</b>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {opt.storeSplit.map((s) => (
                    <div key={s.store} className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{s.store}</span>
                        <span className="text-sm">Rs. {s.subtotal.toLocaleString()}</span>
                      </div>
                      <ul className="space-y-1">
                        {s.items.map((it) => (
                          <li key={it.canonicalId} className="text-xs text-green-50 flex justify-between gap-2">
                            <span className="truncate">{it.title}</span><span>Rs. {it.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : view === 'two' ? (
              <div>
                <p className="text-sm text-green-100 mb-3">
                  Balanced trip: visit just <b>2 stores</b> while capturing most of your savings:
                </p>
                {opt.twoStoreOption ? (
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-base text-white">
                          {opt.twoStoreOption.stores[0]} + {opt.twoStoreOption.stores[1]}
                        </span>
                        <div className="text-xs text-green-100 mt-0.5">
                          Covers {opt.twoStoreOption.coverage}/{items.length} items
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-white">
                          Rs. {opt.twoStoreOption.total.toLocaleString()}
                        </div>
                        {opt.twoStoreOption.total > opt.multiStoreTotal && (
                          <div className="text-[11px] text-green-100">
                            +Rs. {(opt.twoStoreOption.total - opt.multiStoreTotal).toLocaleString()} vs {opt.storesToVisit} stores
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center justify-between font-semibold mb-2 text-sm">
                          <span>{opt.twoStoreOption.split.store1.name}</span>
                          <span>Rs. {opt.twoStoreOption.split.store1.subtotal.toLocaleString()}</span>
                        </div>
                        <ul className="space-y-1">
                          {opt.twoStoreOption.split.store1.items.map((it) => (
                            <li key={it.canonicalId} className="text-xs text-green-50 flex justify-between gap-2">
                              <span className="truncate">{it.title}</span><span>Rs. {it.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center justify-between font-semibold mb-2 text-sm">
                          <span>{opt.twoStoreOption.split.store2.name}</span>
                          <span>Rs. {opt.twoStoreOption.split.store2.subtotal.toLocaleString()}</span>
                        </div>
                        <ul className="space-y-1">
                          {opt.twoStoreOption.split.store2.items.map((it) => (
                            <li key={it.canonicalId} className="text-xs text-green-50 flex justify-between gap-2">
                              <span className="truncate">{it.title}</span><span>Rs. {it.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-green-100">Items already fit within a single store, or need more items to optimize across 2 stores.</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-green-100 mb-3">Prefer one trip? Buy everything at a single store:</p>
                <div className="space-y-2">
                  {opt.singleStoreOptions.slice(0, 5).map((o, i) => {
                    const full = o.coverage === items.length;
                    const extra = o.total - opt.multiStoreTotal;
                    return (
                      <div key={o.store} className={`rounded-xl p-3 flex items-center justify-between ${i === 0 ? 'bg-white text-green-800' : 'bg-white/10'}`}>
                        <div>
                          <span className="font-semibold">{o.store}</span>
                          <span className={`ml-2 text-xs ${i === 0 ? 'text-green-600' : 'text-green-100'}`}>
                            carries {o.coverage}/{items.length} items{full ? '' : ' (rest unavailable here)'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">Rs. {o.total.toLocaleString()}</div>
                          {full && extra > 0 && <div className="text-[11px] text-red-500">+Rs. {extra.toLocaleString()} vs multi-store</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {bestSingle && bestSingle.coverage === items.length && (
                  <p className="text-xs text-green-100 mt-3">
                    💡 One-stop at <b className="text-white">{bestSingle.store}</b> costs Rs. {(bestSingle.total - opt.multiStoreTotal).toLocaleString()} more,
                    but saves you {opt.storesToVisit - 1} extra trip{opt.storesToVisit - 1 !== 1 ? 's' : ''}.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Intelligent Cheaper Alternatives & Substitutions */}
        {opt?.substitutions && opt.substitutions.length > 0 && (
          <div className="bg-surface rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5 shadow-sm mb-6">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">💡</span>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Intelligent Product Substitutions
              </h2>
              <span className="text-[10px] uppercase font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded-full">
                Save More
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Switch higher-priced products in your basket for cheaper verified alternatives in the same category:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opt.substitutions.map((sub) => (
                <div
                  key={`${sub.currentProductId}-${sub.suggestedProduct.canonicalId}`}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">Currently in basket:</div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {sub.currentTitle}
                      </div>
                      <div className="text-xs text-gray-400">Rs. {sub.currentPrice}</div>
                    </div>
                    <div className="shrink-0 text-center px-2 py-1 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 rounded-lg text-xs font-bold">
                      Save Rs. {sub.savingAmount}
                    </div>
                  </div>

                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 flex items-center justify-between gap-2 mt-1">
                    <div className="min-w-0 text-xs">
                      <div className="text-green-700 dark:text-green-400 font-semibold truncate">
                        ✓ {sub.suggestedProduct.title}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Rs. {sub.suggestedProduct.minPrice} at {sub.suggestedProduct.cheapestStore}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => swapItem(sub.currentProductId, sub.suggestedProduct.canonicalId)}
                      disabled={swappingId === sub.currentProductId}
                      className="btn-primary text-xs font-semibold py-1.5 px-3 rounded-lg shrink-0 disabled:opacity-50"
                    >
                      {swappingId === sub.currentProductId ? 'Swapping...' : 'Swap Item'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add items */}
        <div className="bg-surface rounded-lg shadow p-4 mb-6">
          <form onSubmit={runSearch} className="flex gap-2">
            <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Add an item — search the catalog (min 2 chars)..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500" />
            <button type="submit" disabled={searching} className="btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50">
              {searching ? '...' : 'Search'}
            </button>
          </form>
          {results.length > 0 && (
            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
              {results.map((p) => (
                <div key={p.canonicalId} className="flex items-center justify-between gap-3 p-2 border border-gray-100 rounded-lg">
                  <div className="min-w-0">
                    <div className="text-sm text-gray-900 truncate">{p.title}</div>
                    <div className="text-xs text-gray-500">Rs. {p.minPrice} at {p.cheapestStore} · {p.storeCount} stores · save {p.savingPct}%</div>
                  </div>
                  <button onClick={() => addItem(p.canonicalId)} className="btn-primary px-3 py-1.5 rounded-lg text-xs shrink-0">Add</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item cards */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((p) => (
              <CompareCard key={p.canonicalId} product={p}
                action={
                  <button onClick={() => removeItem(p.canonicalId)}
                    className="w-full bg-surface border border-red-300 text-red-600 text-xs font-medium py-2 px-3 rounded-md hover:bg-red-50 transition-colors">
                    Remove
                  </button>
                } />
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmDelete}
          title="Delete Basket"
          message="Delete this basket? This cannot be undone."
          confirmText="Delete" cancelText="Cancel"
          onConfirm={() => { setConfirmDelete(false); deleteBasket(); }}
          onCancel={() => setConfirmDelete(false)}
          type="danger"
        />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </AppLayout>
    </ProtectedRoute>
  );
}
