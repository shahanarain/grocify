import { db } from './firebase-admin';
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
 * Matches recipe ingredients to cross-store canonical products in catalogProducts.
 */
export async function matchIngredientsToCatalog(
  ingredients: Array<{ name: string; quantity: number | string; unit: string; catalogKeyword: string }>
): Promise<RecipeIngredientItem[]> {
  try {
    // Fetch canonical catalog products (up to 500 for matching)
    const snapshot = await db.collection('catalogProducts').limit(500).get();
    const catalog: CatalogProduct[] = snapshot.docs.map((doc: any) => ({
      canonicalId: doc.id,
      ...doc.data(),
    }));

    return ingredients.map((ing) => {
      const parsedQty = typeof ing.quantity === 'number' ? ing.quantity : parseFloat(String(ing.quantity)) || 1;
      const keyword = (ing.catalogKeyword || '').toLowerCase().trim();
      const ingName = (ing.name || '').toLowerCase().trim();

      // Find best match in catalog
      let candidate: CatalogProduct | undefined = catalog.find((p) => {
        const title = (p.title || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const subCat = (p.subCategory || '').toLowerCase();
        const keywords = (p.keywords || []).map((k: string) => k.toLowerCase());

        return (
          (keyword && (title.includes(keyword) || subCat.includes(keyword) || keywords.includes(keyword))) ||
          (ingName && title.includes(ingName))
        );
      });

      // If no candidate, match with individual tokens
      if (!candidate && keyword) {
        const tokens = keyword.split(/\s+/).filter((t) => t.length >= 3);
        candidate = catalog.find((p) => {
          const title = (p.title || '').toLowerCase();
          return tokens.some((t) => title.includes(t));
        });
      }

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

