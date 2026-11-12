'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import Link from 'next/link';

interface List {
  id: string;
  name: string;
  description: string;
  productCount: number;
  totalPrice: number;
  createdAt: Date | { toDate: () => Date };
  updatedAt: Date | { toDate: () => Date };
}

// Product interface kept for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  addedAt: Date | { toDate: () => Date };
}

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  const fetchLists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await fetch('/api/lists', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }

      const data = await response.json();
      setLists(data.lists);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load lists';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!user || !newListName.trim()) return;

    setCreatingList(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName.trim(),
          description: newListDescription.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create list');
      }

      success('List created successfully!');
      setNewListName('');
      setNewListDescription('');
      setShowCreateForm(false);
      await fetchLists();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create list';
      showError(errorMessage);
    } finally {
      setCreatingList(false);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      success('List deleted successfully!');
      await fetchLists();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete list';
      showError(errorMessage);
    }
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Lists</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your shopping lists
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary px-4 py-2 rounded-xl flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create List
            </button>
          </div>

          {/* Create List Form */}
          {showCreateForm && (
            <div className="bg-surface rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New List</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    List Name *
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={creatingList}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={creatingList}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateList}
                    disabled={creatingList || !newListName.trim()}
                    className="btn-primary px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingList ? 'Creating...' : 'Create List'}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    disabled={creatingList}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <div key={list.id} className="bg-surface rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{list.name}</h3>
                        {list.description && (
                          <p className="text-sm text-gray-600 mb-2">{list.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {list.productCount} product{list.productCount !== 1 ? 's' : ''}
                        </p>
                        {list.productCount > 0 && (
                          <div className="mt-3 inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-medium">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Rs. {list.totalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setListToDelete(list.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete list"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/lists/${list.id}`}
                        className="flex-1 btn-primary text-sm font-medium py-2 px-3 rounded-xl text-center"
                      >
                        View List
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {lists.length === 0 && !loading && (
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No lists yet</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first shopping list to get started.</p>
            </div>
          )}
        </div>
      </AppLayout>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete List"
        message="Are you sure you want to delete this list? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (listToDelete) {
            handleDeleteList(listToDelete);
            setShowDeleteConfirm(false);
            setListToDelete(null);
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setListToDelete(null);
        }}
        type="danger"
      />
    </ProtectedRoute>
  );
}
