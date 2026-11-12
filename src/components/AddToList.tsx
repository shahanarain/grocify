'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { ToastContainer } from './Toast';

interface List {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: Date | { toDate: () => Date };
  updatedAt: Date | { toDate: () => Date };
}

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

interface AddToListProps {
  product: Product;
  onSuccess?: () => void;
}

export const AddToList: React.FC<AddToListProps> = ({ product, onSuccess }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();

  useModalDismiss(showModal, () => setShowModal(false));

  const fetchLists = async () => {
    if (!user) return;

    try {
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
    } catch (error) {
      console.error('Fetch lists error:', error);
    }
  };

  const handleAddToList = async (listId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/lists/${listId}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product to list');
      }

      success('Product added to list successfully!');
      setShowModal(false);

      if (onSuccess) {
        onSuccess();
      }

      // Refresh lists to update product counts
      await fetchLists();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to list';
      showError(errorMessage);
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

      const data = await response.json();

      // Add product to the newly created list
      await handleAddToList(data.list.id);

      setNewListName('');
      setNewListDescription('');
      setShowCreateForm(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create list';
      showError(errorMessage);
    } finally {
      setCreatingList(false);
    }
  };

  const openModal = async () => {
    setShowModal(true);
    await fetchLists();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-surface border border-green-600 text-green-700 text-xs font-medium py-2 px-3 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add to List
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-to-list-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 id="add-to-list-title" className="text-lg font-semibold text-gray-900">Add to List</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close dialog"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Product: {product.name}</p>
            </div>

            {!showCreateForm ? (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Select a list:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleAddToList(list.id)}
                        disabled={loading}
                        className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="font-medium text-gray-900">{list.name}</div>
                        <div className="text-xs text-gray-500">{list.productCount} products</div>
                        {list.description && (
                          <div className="text-xs text-gray-400 mt-1">{list.description}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full btn-primary py-2 px-4 rounded-xl"
                >
                  Create New List
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
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

                <div className="mb-4">
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
                    className="flex-1 btn-primary py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingList ? 'Creating...' : 'Create & Add'}
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
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};
