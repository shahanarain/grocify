'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { CompareCard } from '@/components/CompareCard';
import { AddToBasket } from '@/components/AddToBasket';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { CatalogProduct, Deal } from '@/lib/catalog-types';

export default function DealsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toasts, removeToast, error: showError } = useToast();
  const [topSavings, setTopSavings] = useState<CatalogProduct[]>([]);
  const [baskets, setBaskets] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/deals', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setTopSavings(data.topSavings || []);
        setBaskets(data.baskets || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const takeDeal = async (deal: Deal) => {
    if (!user) return;
    setTaking(deal.id);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deal.name,
          source: 'deal',
          dealId: deal.id,
          canonicalIds: deal.items.map((i) => i.canonicalId),
        }),
      });
      if (!res.ok) throw new Error('Failed to take deal');
      const data = await res.json();
      router.push(`/baskets/${data.basket.id}`);
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to take deal');
      setTaking(null);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Deals</h1>
            <p className="mt-1 text-sm text-gray-500">
              Ready-made money-saving baskets. Take one, then add or remove anything you like.
            </p>
          </div>
          <Link href="/baskets" className="btn-primary px-4 py-2 rounded-xl text-sm font-medium self-center">
            🧺 My Baskets
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        ) : (
          <>
            {/* Curated smart baskets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {baskets.map((deal) => (
                <div key={deal.id} className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="p-5 flex items-start justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <div className="pr-3">
                      <h2 className="text-lg font-bold text-gray-900">{deal.emoji} {deal.name}</h2>
                      <p className="text-xs text-gray-600 mt-1">{deal.blurb}</p>
                    </div>
                    {deal.savingPct > 0 && (
                      <div className="shrink-0 text-center bg-red-500 text-white rounded-xl px-3 py-2 shadow">
                        <div className="text-lg font-extrabold leading-none">{deal.savingPct}%</div>
                        <div className="text-[10px] uppercase tracking-wide">off</div>
                      </div>
                    )}
                  </div>

                  {/* item thumbnails */}
                  <div className="p-4 flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {deal.items.map((it) => (
                        <div key={it.canonicalId} className="relative w-14 h-14 bg-white rounded-lg border border-gray-100 overflow-hidden" title={it.title}>
                          {it.image ? (
                            <Image src={it.image} alt={it.title} fill className="object-contain p-1" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[9px] text-gray-300">{it.brand}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-gray-500">{deal.items.length} items · cheapest across stores</div>
                        <div className="text-2xl font-bold text-green-600">Rs. {deal.basketTotal.toLocaleString()}</div>
                        {deal.totalSaving > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="line-through">Rs. {deal.basketMax.toLocaleString()}</span>{' '}
                            <span className="text-red-600 font-semibold">save Rs. {deal.totalSaving.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => takeDeal(deal)}
                        disabled={taking === deal.id}
                        className="btn-primary px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                      >
                        {taking === deal.id ? 'Taking...' : 'Take this deal →'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Biggest savings rail */}
            {topSavings.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">🔥 Biggest Savings Right Now</h2>
                <p className="text-sm text-gray-500 mb-4">Products with the widest price gap between stores.</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {topSavings.map((p) => (
                    <CompareCard key={p.canonicalId} product={p} action={<AddToBasket product={p} />} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </AppLayout>
    </ProtectedRoute>
  );
}
