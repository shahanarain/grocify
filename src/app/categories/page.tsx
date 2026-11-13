'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import { CATEGORY_HIERARCHY } from '@/lib/category-hierarchy';
import { encodeCategorySlug, formatCategoryName } from '@/lib/category-name';

export default function CategoriesPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <main className="mx-auto w-full max-w-7xl pb-10">
                    <header className="mb-8 border-b border-gray-200 pb-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-green-700">Grocify catalogue</p>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shop by category</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                            Browse everyday essentials by aisle and find the products you need.
                        </p>
                    </header>

                    <div className="space-y-5 sm:space-y-6">
                        {CATEGORY_HIERARCHY.map((category) => (
                            <section key={category.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-surface shadow-sm">
                                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-4 sm:px-6">
                                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                                        {formatCategoryName(category.name)}
                                    </h2>
                                    <span className="text-xs font-medium text-gray-500 sm:text-sm">
                                        {category.subCategories.length} {category.subCategories.length === 1 ? 'subcategory' : 'subcategories'}
                                    </span>
                                </header>

                                <ul className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 sm:gap-3 sm:p-5 lg:grid-cols-3">
                                    {category.subCategories.map((subCategory) => (
                                        <li key={subCategory}>
                                            <Link
                                                href={`/categories/${encodeCategorySlug(category.name)}/${encodeCategorySlug(subCategory)}`}
                                                className="group flex min-h-12 items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                                            >
                                                <span className="min-w-0 break-words">{formatCategoryName(subCategory)}</span>
                                                <svg className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-green-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                </main>
            </AppLayout>
        </ProtectedRoute>
    );
}
