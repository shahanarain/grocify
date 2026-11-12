'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  minThreshold: number;
  expiryDate?: string | null;
  notes?: string;
  barcode?: string | null;
}

interface InventoryStats {
  totalCount: number;
  lowStockCount: number;
  expiringSoonCount: number;
}

const PANTRY_CATEGORIES = [
  'All',
  'Dairy',
  'Beverages',
  'Food Staples',
  'Breakfast',
  'Baking and Cooking',
  'Snacks',
  'Fresh Products',
  'Home Essential',
  'Other',
];

export default function InventoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toasts, removeToast, success, error: showError } = useToast();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalCount: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'expiring'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    unit: 'pcs',
    category: 'Food Staples',
    minThreshold: '1',
    expiryDate: '',
    notes: '',
  });

  // Delete Item state
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isRestocking, setIsRestocking] = useState(false);

  const loadInventory = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load inventory');
      const data = await res.json();
      setItems(data.items || []);
      setStats(data.stats || { totalCount: 0, lowStockCount: 0, expiringSoonCount: 0 });
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Error loading inventory');
    } finally {
      setLoading(false);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const updateQuantity = async (itemId: string, delta: number) => {
    if (!user) return;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );

    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
    } catch {
      showError('Failed to update quantity');
      await loadInventory();
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          quantity: parseFloat(formData.quantity) || 1,
          unit: formData.unit.trim(),
          category: formData.category,
          minThreshold: parseFloat(formData.minThreshold) || 1,
          expiryDate: formData.expiryDate || null,
          notes: formData.notes.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add item');
      }

      success(`Added ${formData.name} to pantry!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        quantity: '1',
        unit: 'pcs',
        category: 'Food Staples',
        minThreshold: '1',
        expiryDate: '',
        notes: '',
      });
      await loadInventory();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete item');
      success('Item removed from pantry');
      await loadInventory();
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleQuickRestock = async () => {
    if (!user) return;
    setIsRestocking(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/inventory/quick-restock', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Restock failed');
      }

      success(`Created Smart Basket with ${data.restockedCount} items!`);
      router.push(`/baskets/${data.basketId}`);
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Auto-restock failed');
    } finally {
      setIsRestocking(false);
    }
  };

  // Filtered items logic
  const now = new Date();
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const filteredItems = items.filter((item) => {
    // Mode filter
    if (filterMode === 'low') {
      const min = item.minThreshold ?? 1;
      if (item.quantity > min) return false;
    } else if (filterMode === 'expiring') {
      if (!item.expiryDate) return false;
      const exp = new Date(item.expiryDate);
      if (isNaN(exp.getTime()) || exp > threeDaysFromNow) return false;
    }

    // Category filter
    if (categoryFilter !== 'All' && item.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Header Section */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>📦</span> Home Pantry &amp; Inventory
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track household groceries, monitor expiry dates, and auto-replenish low supplies at the lowest price.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            {stats.lowStockCount > 0 && (
              <button
                type="button"
                onClick={handleQuickRestock}
                disabled={isRestocking}
                className="btn-primary text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center shadow-sm disabled:opacity-50"
              >
                {isRestocking ? (
                  'Building Basket...'
                ) : (
                  <>
                    <span className="mr-1.5">⚡</span>
                    Auto-Restock Low Stock ({stats.lowStockCount})
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-surface border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center shadow-sm transition"
            >
              <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Pantry Item
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div
            onClick={() => setFilterMode('all')}
            className={`p-4 rounded-2xl border cursor-pointer transition shadow-sm ${
              filterMode === 'all'
                ? 'bg-surface border-green-500 ring-2 ring-green-500/20'
                : 'bg-surface border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Stocked Items</div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{stats.totalCount}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Tracked in home pantry</div>
          </div>

          <div
            onClick={() => setFilterMode('low')}
            className={`p-4 rounded-2xl border cursor-pointer transition shadow-sm ${
              filterMode === 'low'
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-surface border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span>Low-Stock Alerts</span>
              <span>⚠️</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {stats.lowStockCount}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">At or below minimum threshold</div>
          </div>

          <div
            onClick={() => setFilterMode('expiring')}
            className={`p-4 rounded-2xl border cursor-pointer transition shadow-sm ${
              filterMode === 'expiring'
                ? 'bg-red-50 dark:bg-red-950/20 border-red-500 ring-2 ring-red-500/20'
                : 'bg-surface border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider font-semibold flex items-center justify-between">
              <span>Expiring Soon</span>
              <span>⏰</span>
            </div>
            <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              {stats.expiringSoonCount}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Within next 72 hours</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-3.5 mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex-1 min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pantry items..."
              className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 bg-surface focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {PANTRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            {(filterMode !== 'all' || categoryFilter !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setFilterMode('all');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Inventory Item Cards */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
            <div className="text-4xl mb-3">🧺</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">No items found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {filterMode === 'low'
                ? 'Great news! None of your pantry items are running low right now.'
                : filterMode === 'expiring'
                ? 'No items approaching expiration within the next 3 days.'
                : 'Start tracking your pantry inventory by adding your first household grocery item.'}
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-4 btn-primary text-xs font-semibold py-2 px-4 rounded-xl"
            >
              + Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const min = item.minThreshold ?? 1;
              const isLow = item.quantity <= min;
              const expDate = item.expiryDate ? new Date(item.expiryDate) : null;
              const isExpiring = expDate && !isNaN(expDate.getTime()) && expDate <= threeDaysFromNow;
              const isExpired = expDate && !isNaN(expDate.getTime()) && expDate < now;

              return (
                <div
                  key={item.id}
                  className={`bg-surface rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition ${
                    isLow
                      ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20'
                      : 'border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <div>
                    {/* Status Badges Header */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      {isExpired ? (
                        <span className="text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full">
                          🔴 Expired
                        </span>
                      ) : isExpiring ? (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 px-2 py-0.5 rounded-full">
                          ⏰ Expiring Soon
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded-full">
                          ✓ In Stock
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</h3>
                    {item.notes && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.notes}</p>}

                    {/* Expiry Date Display */}
                    {item.expiryDate && (
                      <div className="text-[11px] text-gray-500 mt-1 flex items-center">
                        <span className="mr-1">📅 Expiry:</span>
                        <span className={isExpiring ? 'font-bold text-red-600' : 'text-gray-700 dark:text-gray-300'}>
                          {item.expiryDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Counter & Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400">Min Alert: {item.minThreshold} {item.unit}</div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {item.quantity} {item.unit}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center text-sm transition"
                        title="Consume 1 unit"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-950/60 hover:bg-green-200 text-green-700 dark:text-green-300 font-bold flex items-center justify-center text-sm transition"
                        title="Add 1 unit"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-surface rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Add Pantry Item</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Product / Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Basmati Rice, Milk, Cooking Oil..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Current Quantity *
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="pcs, kg, liters, g"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {PANTRY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Low-Stock Alert At
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={formData.minThreshold}
                      onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. kept in freezer, brand preference"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary py-2.5 px-4 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Add to Pantry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={Boolean(itemToDelete)}
          title="Delete Pantry Item"
          message="Are you sure you want to remove this item from your pantry inventory?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            if (itemToDelete) handleDeleteItem(itemToDelete);
          }}
          onCancel={() => setItemToDelete(null)}
          type="danger"
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </AppLayout>
    </ProtectedRoute>
  );
}

