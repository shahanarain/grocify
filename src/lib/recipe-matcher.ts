import { MOCK_CATALOG } from './mock-catalog';
import { CatalogProduct } from './catalog-types';

export interface MatchedProductSummary {
  canonicalId: string;
  title: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  cheapestStore: string;
  image: string | null;
  savingPct: number;
  storeCount: number;
}

export interface RecipeIngredientItem {
  name: string;
  quantity: number;
  unit: string;
  catalogKeyword: string;
  matchedProduct?: MatchedProductSummary | null;
}

export interface RecipeData {
  title: string;
  description: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: RecipeIngredientItem[];
  instructions: string[];
  estimatedGroceryTotal?: number;
  matchedCount?: number;
}

/**
 * Match recipe ingredients against the same catalog shown in Grocify.
 */
export async function matchIngredientsToCatalog(
  ingredients: Array<{ name: string; quantity: number | string; unit: string; catalogKeyword: string }>
): Promise<RecipeIngredientItem[]> {
  try {
    const catalog: CatalogProduct[] = MOCK_CATALOG;
    return ingredients.map((ing) => {
      const parsedQty = typeof ing.quantity === 'number' ? ing.quantity : parseFloat(String(ing.quantity)) || 1;
      const keyword = (ing.catalogKeyword || '').toLowerCase().trim();
      const ingName = (ing.name || '').toLowerCase().trim();
      const terms = [...new Set(`${keyword} ${ingName}`.split(/[^a-z0-9]+/).filter((term) => term.length > 2))];
      const candidate = catalog
        .map((product) => {
          const title = (product.title || '').toLowerCase();
          const searchText = `${title} ${product.brand || ''} ${product.subCategory || ''} ${(product.keywords || []).join(' ')}`.toLowerCase();
          const score = terms.reduce((total, term) => total + (title.includes(term) ? 3 : searchText.includes(term) ? 1 : 0), 0);
          return { product, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || a.product.minPrice - b.product.minPrice)[0]?.product;

      const matchedProduct: MatchedProductSummary | null = candidate
        ? {
            canonicalId: candidate.canonicalId,
            title: candidate.title,
            brand: candidate.brand,
            minPrice: candidate.minPrice || 0,
            maxPrice: candidate.maxPrice || candidate.minPrice || 0,
            cheapestStore: candidate.cheapestStore || 'Unknown',
            image: candidate.image || null,
            savingPct: candidate.savingPct || 0,
            storeCount: candidate.storeCount || 1,
          }
        : null;

      return {
        name: ing.name,
        quantity: parsedQty,
        unit: ing.unit || '',
        catalogKeyword: ing.catalogKeyword || ing.name,
        matchedProduct,
      };
    });
  } catch (error) {
    console.error('Failed to match ingredients to catalog:', error);
    return ingredients.map((ing) => ({
      name: ing.name,
      quantity: typeof ing.quantity === 'number' ? ing.quantity : parseFloat(String(ing.quantity)) || 1,
      unit: ing.unit || '',
      catalogKeyword: ing.catalogKeyword || ing.name,
      matchedProduct: null,
    }));
  }
}

