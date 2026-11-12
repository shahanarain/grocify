'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import Image from 'next/image';

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
  addedAt: Date | { toDate: () => Date };
}

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  const [list, setList] = useState<List | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showDeleteListConfirm, setShowDeleteListConfirm] = useState(false);
  const { user } = useAuth();

  // Calculate total price of all products in the list
  const totalPrice = products.reduce((sum, product) => sum + product.newPrice, 0);

  const fetchListAndProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const response = await fetch(`/api/lists/${listId}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('List not found');
        }
        throw new Error('Failed to fetch list');
      }

      const data = await response.json();
      setList(data.list);
      setProducts(data.products);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load list';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/lists/${listId}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove product');
      }

      setMessage('Product removed from list successfully!');
      await fetchListAndProducts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove product';
      setMessage(errorMessage);
    }
  };

  const handleDeleteList = async () => {
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

      router.push('/lists');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete list';
      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    fetchListAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, listId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (!list) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">List not found</h3>
            <p className="mt-1 text-sm text-gray-500">The list you are looking for does not exist.</p>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div>
          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message}
            </div>
          )}

          {/* List Header */}
          <div className="bg-surface shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{list.name}</h1>
                {list.description && (
                  <p className="mt-1 text-sm text-gray-600">{list.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {list.productCount} product{list.productCount !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/lists')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back to Lists
                </button>
                <button
                  onClick={() => setShowDeleteListConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete List
                </button>
              </div>
            </div>
          </div>

          {/* Total Price */}
          {products.length > 0 && (
            <div className="mb-6 flex justify-end">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Total: Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
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
                    <button
                      onClick={() => {
                        setProductToDelete(product.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove from list"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products in this list</h3>
              <p className="mt-1 text-sm text-gray-500">Add products from the Home or Stores page to get started.</p>
            </div>
          )}
        </div>
      </AppLayout>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove Product"
        message="Are you sure you want to remove this product from the list?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={() => {
          if (productToDelete) {
            handleRemoveProduct(productToDelete);
            setShowDeleteConfirm(false);
            setProductToDelete(null);
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        type="danger"
      />

      <ConfirmDialog
        isOpen={showDeleteListConfirm}
        title="Delete List"
        message="Are you sure you want to delete this entire list? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          handleDeleteList();
          setShowDeleteListConfirm(false);
        }}
        onCancel={() => setShowDeleteListConfirm(false)}
        type="danger"
      />
    </ProtectedRoute>
  );
}
