'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Store {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  status: number;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const { user } = useAuth();
  const router = useRouter();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchStores = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/stores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        setStores(data.stores);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stores';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [user]);

  // Group stores by first letter
  const groupedStores = stores.reduce((acc, store) => {
    const firstLetter = store.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(store);
    return acc;
  }, {} as Record<string, Store[]>);

  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter);
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
              <p className="mt-1 text-sm text-gray-500">Browse and compare stores</p>
            </div>

            {/* Alphabet Navigation */}
            <div className="mb-6 bg-surface rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {alphabet.map((letter) => {
                  const hasStores = groupedStores[letter]?.length > 0;
                  return (
                    <button
                      key={letter}
                      onClick={() => scrollToLetter(letter)}
                      disabled={!hasStores}
                      className={`w-8 h-8 rounded-md font-medium transition-colors ${hasStores
                        ? selectedLetter === letter
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stores grouped by letter */}
            {Object.keys(groupedStores).sort().map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{letter}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {groupedStores[letter].map((store) => (
                    <div
                      key={store.id}
                      onClick={() => router.push(`/stores/${store.id}`)}
                      className="bg-surface overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <div className="relative h-32 bg-gray-200">
                        <Image
                          src={store.imageUrl}
                          alt={store.name}
                          fill
                          className="object-cover"
                        />

                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-2">{store.name}</h3>
                        <div className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span className="text-xs">{store.followers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {stores.length === 0 && (
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No stores</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a store.</p>
              </div>
            )}
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
