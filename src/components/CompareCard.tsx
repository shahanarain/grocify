'use client';

import { useState } from 'react';
import { CatalogImage } from '@/components/CatalogImage';
import { CatalogProduct } from '@/lib/catalog-types';
import { formatCategoryName } from '@/lib/category-name';

const CATEGORY_EMOJI: Record<string, string> = {
  'Dairy': '🥛',
  'Beverages': '🥤',
  'Breakfast': '🥣',
  'Tea and Coffee': '☕',
  'Snacks': '🍟',
  'Home Essential': '🏠',
  'Laundry': '🧺',
  'DishWashing': '🍽️',
  'Desserts': '🍨',
  'Fresh Products': '🥦',
  'Baking and Cooking': '🍳',
  'Food Staples': '🌾',
  'Frozen Foods': '🧊',
  'Rice and Flour': '🍚',
  'Candies And BubbleGum': '🍬',
};
const categoryEmoji = (cat: string) => CATEGORY_EMOJI[cat] ?? '🛒';

const CATEGORY_BACKUP_IMAGES: Record<string, string> = {
  'Tea and Coffee': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&auto=format',
  'Dairy': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format',
  'Beverages': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&auto=format',
  'Breakfast': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format',
  'Snacks': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
  'Home Essential': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop&auto=format',
  'Laundry': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=400&fit=crop&auto=format',
  'DishWashing': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop&auto=format',
  'Desserts': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&auto=format',
  'Fresh Products': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop&auto=format',
  'Baking and Cooking': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
  'Food Staples': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
  'Rice and Flour': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format',
  'Candies And BubbleGum': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop&auto=format',
  'Frozen Foods': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop&auto=format',
};

interface CompareCardProps {
  product: CatalogProduct;
  // Optional action rendered at the bottom of the card (e.g. add/remove basket button).
  action?: React.ReactNode;
}

export const CompareCard: React.FC<CompareCardProps> = ({ product, action }) => {
  const [open, setOpen] = useState(false);
  const offers = [...(product.offers || [])].sort((a, b) => a.price - b.price);
  const imageSrc = product.image || (product as unknown as { imageUrl?: string }).imageUrl || null;
  const backupSrc = CATEGORY_BACKUP_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&auto=format';

  return (
    <div className="bg-surface overflow-hidden shadow-sm border border-gray-100 rounded-2xl card-lift flex flex-col">
      <div className="relative h-36 bg-gray-50">
        <CatalogImage
          src={imageSrc}
          alt={product.title}
          className="absolute inset-0 h-full w-full object-contain p-2"
          backupSrc={backupSrc}
          fallback={(
            <div className="flex flex-col items-center justify-center h-full gap-1" aria-label="Product image unavailable">
              <span className="text-4xl">{categoryEmoji(product.category)}</span>
              <span className="text-[10px] text-gray-400">{formatCategoryName(product.subCategory)}</span>
            </div>
          )}
        />
        {product.savingPct > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
            Save {product.savingPct}%
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
          {product.storeCount} stores
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">{product.title}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.quantity}</p>

        {/* Cheapest price headline */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-green-600">Rs. {product.minPrice}</span>
          {product.maxPrice > product.minPrice && (
            <span className="text-xs text-gray-400 line-through">Rs. {product.maxPrice}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">
          cheapest at <span className="font-semibold text-gray-700">{product.cheapestStore}</span>
        </p>

        {/* Expandable per-store comparison */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center mb-2"
        >
          <svg
            className={`w-3 h-3 mr-1 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {open ? 'Hide' : 'Compare'} {offers.length} prices
        </button>

        {open && (
          <div className="space-y-1 mb-2">
            {offers.map((o, idx) => {
              const isCheapest = idx === 0;
              const pct = product.maxPrice > 0 ? Math.round((o.price / product.maxPrice) * 100) : 100;
              return (
                <a
                  key={`${o.store}-${idx}`}
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-lg px-2 py-1 border ${isCheapest ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-gray-50'} hover:shadow-sm transition`}
                  title={o.name}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isCheapest ? 'text-green-800' : 'text-gray-700'}`}>
                      {o.store} {isCheapest && '★'}
                    </span>
                    <span className={`font-semibold ${isCheapest ? 'text-green-700' : 'text-gray-600'}`}>Rs. {o.price}</span>
                  </div>
                  {/* price bar */}
                  <div className="mt-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                    <div className={`h-full ${isCheapest ? 'bg-green-500' : 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {action && <div className="mt-auto pt-1">{action}</div>}
      </div>
    </div>
  );
};
