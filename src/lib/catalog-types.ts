// Shared types for the cross-store canonical catalog (catalogProducts collection,
// produced by the DataEngine matcher) and the Smart Basket feature built on top of it.

export interface Offer {
  store: string;
  name: string;
  price: number;
  url: string;
}

export interface CatalogProduct {
  canonicalId: string;
  category: string;
  subCategory: string;
  brand: string;
  quantity: string;
  title: string;
  image: string | null;
  storeCount: number;
  cheapestStore: string;
  minPrice: number;
  maxPrice: number;
  savingPct: number;
  offers: Offer[];
  keywords?: string[];
}

// A curated, auto-generated deal (a themed basket of catalog products).
export interface Deal {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  items: CatalogProduct[];
  basketTotal: number;   // sum of each item's cheapest price (multi-store)
  basketMax: number;     // sum of each item's most expensive price
  totalSaving: number;   // basketMax - basketTotal
  savingPct: number;
}

// One store's slice of a basket when buying each item at its cheapest store.
export interface StoreSlice {
  store: string;
  items: { canonicalId: string; title: string; price: number }[];
  subtotal: number;
}

// Buying the whole basket at a single store (one-stop convenience option).
export interface SingleStoreOption {
  store: string;
  coverage: number;  // how many of the basket's items this store carries
  total: number;     // cost of the items it carries, at this store
}

// Recommended cheaper alternative substitution
export interface ProductSubstitution {
  currentProductId: string;
  currentTitle: string;
  currentBrand: string;
  currentPrice: number;
  subCategory: string;
  suggestedProduct: {
    canonicalId: string;
    title: string;
    brand: string;
    minPrice: number;
    cheapestStore: string;
    image: string | null;
  };
  savingAmount: number;
  savingPct: number;
}

// Buying across at most 2 stores (balanced convenience and savings)
export interface TwoStoreOption {
  stores: [string, string];
  coverage: number;
  total: number;
  split: {
    store1: { name: string; items: { canonicalId: string; title: string; price: number }[]; subtotal: number };
    store2: { name: string; items: { canonicalId: string; title: string; price: number }[]; subtotal: number };
  };
}
