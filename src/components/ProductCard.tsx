'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AddToList } from '@/components/AddToList';
import { formatCategoryName } from '@/lib/category-name';

export interface ProductCardData {
  id: string;
  name: string;
  imageUrl: string;
  imageAttribution?: { label: string; url: string; license: string } | null;
  sourceLocation?: string | null;
  newPrice: number;
  oldPrice: number;
  quantity: string;
  category: string;
  subCategory: string;
  discount: number;
  supplier: string;
  url: string;
  offers?: { store: string; name: string; price: number; url: string }[];
}

interface ProductCardProps {
  product: ProductCardData;
  showCategory?: boolean;
}

export function ProductCard({ product, showCategory = false }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const productUrl = product.url && product.url !== '#'
    ? product.url
    : product.offers?.find((offer) => offer.store === product.supplier)?.url;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-950/5">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.imageUrl && !imageFailed ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1" fill="currentColor" />
              <circle cx="18" cy="20" r="1" fill="currentColor" />
            </svg>
            <span className="text-xs">{formatCategoryName(product.subCategory) || 'Grocery'}</span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            Save {product.discount}%
          </span>
        )}
        {product.imageAttribution && (
          <a href={product.imageAttribution.url} target="_blank" rel="noopener noreferrer" className="absolute bottom-1 right-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] text-gray-600 underline shadow-sm">
            {product.imageAttribution.label}
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
          {showCategory ? (
            <span className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {formatCategoryName(product.category)}
            </span>
          ) : (
            <span className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-500">
              {product.supplier
                ? `${product.supplier}${product.sourceLocation ? ` · ${product.sourceLocation}` : ''}`
                : 'Available nearby'}
            </span>
          )}
          {showCategory && product.supplier && (
            <span className="max-w-[55%] truncate text-[11px] text-gray-500">
              {product.supplier}{product.sourceLocation ? ` · ${product.sourceLocation}` : ''}
            </span>
          )}
        </div>

        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-900 sm:text-[15px]">
          {product.name}
        </h2>
        <p className="mt-1 truncate text-xs text-gray-500">{product.quantity}</p>

        <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-bold tracking-tight text-gray-900">Rs. {product.newPrice}</span>
          {product.oldPrice > product.newPrice && (
            <span className="text-xs text-gray-400 line-through">Rs. {product.oldPrice}</span>
          )}
        </div>

        <div className="mt-auto space-y-2.5 pt-4">
          {productUrl && (
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-3 text-xs font-semibold text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              Visit store
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 4h6v6m0-6-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </a>
          )}
          <AddToList product={product} />
        </div>
      </div>
    </article>
  );
}
