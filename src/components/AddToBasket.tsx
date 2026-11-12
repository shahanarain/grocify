'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { ToastContainer } from './Toast';
import { CatalogProduct } from '@/lib/catalog-types';

interface Basket {
  id: string;
  name: string;
  itemCount: number;
}

interface AddToBasketProps {
  product: CatalogProduct;
  onSuccess?: () => void;
}

// Mirrors AddToList, but adds a canonical catalog product to a Smart Basket.
export const AddToBasket: React.FC<AddToBasketProps> = ({ product, onSuccess }) => {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  useModalDismiss(showModal, () => setShowModal(false));

  const fetchBaskets = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch baskets');
      const data = await res.json();
      setBaskets(data.baskets);
    } catch (err) {
      console.error(err);
    }
  };

  const addTo = async (basketId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/baskets/${basketId}/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ canonicalId: product.canonicalId }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to add to basket');
      }
      success('Added to basket!');
      setShowModal(false);
      onSuccess?.();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to add to basket');
    } finally {
      setLoading(false);
    }
  };

  const createAndAdd = async () => {
    if (!user || !newName.trim()) return;
    setCreating(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), canonicalIds: [product.canonicalId] }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to create basket');
      }
      success('Basket created with item!');
      setNewName('');
      setShowCreate(false);
      setShowModal(false);
      onSuccess?.();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to create basket');
    } finally {
      setCreating(false);
    }
  };

  const open = async () => {
    setShowModal(true);
    await fetchBaskets();
  };

  return (
    <>
      <button
        onClick={open}
        className="w-full bg-surface border border-green-600 text-green-700 text-xs font-medium py-2 px-3 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Basket
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add to Smart Basket</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{product.title}</p>

            {!showCreate ? (
              <div>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                  {baskets.length === 0 && <p className="text-sm text-gray-400">No baskets yet — create one below.</p>}
                  {baskets.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => addTo(b.id)}
                      disabled={loading}
                      className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="font-medium text-gray-900">{b.name}</div>
                      <div className="text-xs text-gray-500">{b.itemCount} items</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowCreate(true)} className="w-full btn-primary py-2 px-4 rounded-xl">
                  Create New Basket
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Basket name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                  disabled={creating}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={createAndAdd}
                    disabled={creating || !newName.trim()}
                    className="flex-1 btn-primary py-2 px-4 rounded-xl disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create & Add'}
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    disabled={creating}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};
