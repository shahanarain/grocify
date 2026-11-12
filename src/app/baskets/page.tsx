'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

interface Basket {
  id: string;
  name: string;
  itemCount: number;
  source: 'deal' | 'custom' | 'recipe';
  dealId?: string | null;
}

export default function BasketsPage() {
  const { user } = useAuth();
  const { toasts, removeToast, error: showError } = useToast();
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const load = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBaskets(data.baskets || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const create = async () => {
    if (!user || !name.trim()) return;
    setCreating(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error('Failed to create basket');
      setName('');
      await load();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to create basket');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Smart Baskets</h1>
            <p className="mt-1 text-sm text-gray-500">Editable baskets that always show the cheapest store for each item.</p>
          </div>
          <Link href="/deals" className="btn-primary px-4 py-2 rounded-xl text-sm font-medium self-center">🔥 Browse Deals</Link>
        </div>

        {/* quick create */}
        <div className="mb-6 bg-surface rounded-lg shadow p-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="New basket name..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500"
          />
          <button onClick={create} disabled={creating || !name.trim()} className="btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50">
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        ) : baskets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No baskets yet.</p>
            <Link href="/deals" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-medium">Take a Smart Deal to start</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {baskets.map((b) => (
              <Link key={b.id} href={`/baskets/${b.id}`}
                className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-5 card-lift block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{b.name}</h3>
                  {b.source === 'deal' && (
                    <span className="text-[10px] uppercase tracking-wide bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Deal</span>
                  )}
                  {b.source === 'recipe' && (
                    <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">🍳 Recipe</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{b.itemCount} item{b.itemCount !== 1 ? 's' : ''}</p>
                <p className="mt-3 text-sm text-green-700 font-medium">View &amp; optimize →</p>
              </Link>
            ))}
          </div>
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </AppLayout>
    </ProtectedRoute>
  );
}
