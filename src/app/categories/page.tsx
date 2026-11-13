'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import Link from 'next/link';
import { CATEGORY_HIERARCHY } from '@/lib/category-hierarchy';

// Full category hierarchy


// Colors for category cards
const CATEGORY_COLORS = [
    'from-orange-400 to-orange-600',
    'from-blue-400 to-blue-600',
    'from-yellow-400 to-yellow-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
    'from-purple-400 to-purple-600',
    'from-teal-400 to-teal-600',
    'from-amber-400 to-amber-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-lime-400 to-lime-600',
    'from-rose-400 to-rose-600',
    'from-emerald-400 to-emerald-600',
    'from-violet-400 to-violet-600',
    'from-fuchsia-400 to-fuchsia-600',
    'from-sky-400 to-sky-600',
];

export default function CategoriesPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Browse products by category
                        </p>
                    </div>

                    {/* Categories List */}
                    <div className="space-y-8">
                        {CATEGORY_HIERARCHY.map((category, categoryIndex) => (
                            <div key={category.name} className="bg-surface rounded-lg shadow-sm overflow-hidden">
                                {/* Category Header */}
                                <div className={`bg-gradient-to-r ${CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length]} px-6 py-4`}>
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        {category.name}
                                    </h2>
                                    <p className="text-white text-opacity-80 text-sm mt-1">
                                        {category.subCategories.length} subcategories
                                    </p>
                                </div>

                                {/* Subcategories Grid */}
                                <div className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {category.subCategories.map((subCategory) => (
                                            <Link
                                                key={subCategory}
                                                href={`/categories/${encodeURIComponent(category.name)}/${encodeURIComponent(subCategory)}`}
                                                className="group block p-4 bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200"
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-700 line-clamp-2">
                                                        {subCategory}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
