'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { RecipeData, RecipeIngredientItem } from '@/lib/recipe-matcher';

interface RecipeCardProps {
  recipe: RecipeData;
  onBasketCreated?: (basketId: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onBasketCreated }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [servings, setServings] = useState<number>(recipe.servings || 4);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  // Track indices of checked ingredients (default all checked)
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(
    new Set(recipe.ingredients.map((_, idx) => idx))
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [createdBasketId, setCreatedBasketId] = useState<string | null>(null);

  const baseServings = recipe.servings || 4;
  const multiplier = servings / baseServings;

  const toggleIngredient = (idx: number) => {
    setCheckedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Format scaled quantity nicely
  const formatQuantity = (qty: number) => {
    const scaled = qty * multiplier;
    if (Number.isInteger(scaled)) return scaled.toString();
    if (scaled < 0.1) return scaled.toFixed(2);
    return scaled.toFixed(1).replace(/\.0$/, '');
  };

  // Calculate total for checked matched products
  const selectedMatchedTotal = recipe.ingredients
    .filter((_, idx) => checkedIndices.has(idx))
    .reduce((sum, ing) => sum + (ing.matchedProduct?.minPrice || 0), 0);

  const selectedCanonicalIds = recipe.ingredients
    .filter((ing, idx) => checkedIndices.has(idx) && ing.matchedProduct?.canonicalId)
    .map((ing) => ing.matchedProduct!.canonicalId);

  const handleAddToBasket = async () => {
    if (!user) return;
    if (selectedCanonicalIds.length === 0) {
      showError('Please select at least one matched ingredient to add to your basket.');
      return;
    }

    setIsAdding(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/baskets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `Recipe: ${recipe.title} (${servings} servings)`,
          source: 'recipe',
          canonicalIds: selectedCanonicalIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create Smart Basket');
      }

      const data = await res.json();
      const basketId = data.basket.id;
      setCreatedBasketId(basketId);
      success(`Created Smart Basket with ${selectedCanonicalIds.length} ingredients!`);
      if (onBasketCreated) {
        onBasketCreated(basketId);
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to create basket');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-green-200 dark:border-green-800 shadow-md overflow-hidden text-gray-900 dark:text-gray-100 my-2">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-1">
              🍳 AI Smart Recipe
            </div>
            <h3 className="text-lg font-bold text-white">{recipe.title}</h3>
            {recipe.description && (
              <p className="text-xs text-green-100 mt-1 line-clamp-2">{recipe.description}</p>
            )}
          </div>
          {/* Servings Adjuster */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 shrink-0 text-center">
            <div className="text-[10px] text-green-100 font-medium uppercase tracking-wider mb-1">Servings</div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold text-sm transition"
                aria-label="Decrease servings"
              >
                -
              </button>
              <span className="font-bold text-sm w-4">{servings}</span>
              <button
                type="button"
                onClick={() => setServings((s) => Math.min(20, s + 1))}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold text-sm transition"
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Meta Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-green-100">
          <span className="flex items-center bg-white/10 px-2.5 py-1 rounded-lg">
            ⏱️ Prep: {recipe.prepTime}
          </span>
          <span className="flex items-center bg-white/10 px-2.5 py-1 rounded-lg">
            🔥 Cook: {recipe.cookTime}
          </span>
          <span className="flex items-center bg-white/10 px-2.5 py-1 rounded-lg">
            🛒 {recipe.ingredients.length} Ingredients
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('ingredients')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'ingredients'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-green-50/50 dark:bg-green-950/20'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Ingredients &amp; Cart ({checkedIndices.size}/{recipe.ingredients.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('steps')}
          className={`flex-1 py-2.5 text-center transition ${
            activeTab === 'steps'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500 bg-green-50/50 dark:bg-green-950/20'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Cooking Instructions ({recipe.instructions.length} steps)
        </button>
      </div>

      {/* Tab 1: Ingredients & Smart Basket */}
      {activeTab === 'ingredients' && (
        <div className="p-3 space-y-2">
          <p className="text-[11px] text-gray-500">
            Uncheck any ingredients you already have at home. Matched items show the lowest price across stores.
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {recipe.ingredients.map((ing: RecipeIngredientItem, idx: number) => {
              const isChecked = checkedIndices.has(idx);
              const matched = ing.matchedProduct;

              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition text-xs ${
                    isChecked
                      ? 'border-green-300 bg-green-50/60 dark:bg-green-950/20 dark:border-green-800'
                      : 'border-gray-200 bg-gray-50/60 opacity-60 dark:bg-gray-800/40 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(idx)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded text-green-600 focus:ring-green-500 h-4 w-4 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {formatQuantity(ing.quantity)} {ing.unit} {ing.name}
                      </div>
                      {matched ? (
                        <div className="text-[11px] text-green-700 dark:text-green-400 truncate flex items-center gap-1">
                          <span>✓ Matched:</span>
                          <span className="font-medium truncate">{matched.title}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400">Pantry item / Buy locally</div>
                      )}
                    </div>
                  </div>

                  {matched && (
                    <div className="shrink-0 text-right ml-2">
                      <div className="font-bold text-green-600 dark:text-green-400">Rs. {matched.minPrice}</div>
                      <div className="text-[10px] text-gray-500">at {matched.cheapestStore}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-[10px] text-gray-500">Selected Matched Total</div>
              <div className="text-base font-extrabold text-green-600 dark:text-green-400">
                Rs. {selectedMatchedTotal.toLocaleString()}
              </div>
            </div>

            {createdBasketId ? (
              <Link
                href={`/baskets/${createdBasketId}`}
                className="btn-primary text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center"
              >
                <span>🚀 Open Smart Basket</span>
                <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToBasket}
                disabled={isAdding || selectedCanonicalIds.length === 0}
                className="btn-primary text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center disabled:opacity-50"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5" />
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add {selectedCanonicalIds.length} Items to Smart Basket
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Cooking Steps */}
      {activeTab === 'steps' && (
        <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
          {recipe.instructions.map((step: string, idx: number) => {
            const isDone = completedSteps.has(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition text-xs ${
                  isDone
                    ? 'bg-green-50/50 border-green-200 line-through text-gray-400 dark:bg-green-950/10 dark:border-green-900'
                    : 'bg-surface border-gray-100 hover:border-gray-200 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    isDone ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1 leading-relaxed">{step}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

