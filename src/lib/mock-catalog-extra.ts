// Extra authentic Pakistani products covering all UI subcategories
// Auto-merged into MOCK_CATALOG at runtime via mock-catalog.ts
import { CatalogProduct } from './catalog-types';

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&auto=format&q=80`;

export const EXTRA_CATALOG: CatalogProduct[] = [

  // ─────────────────────────────────────────────────────────────────────────────
  // SPICES & MASALAS (Spices,recipes and Easy Cook / Branded Spices)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'shan-biryani-mix-60g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shan', quantity: '60 g',
    title: 'Shan Special Bombay Biryani Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 95, maxPrice: 115, savingPct: 17,
    keywords: ['shan', 'biryani', 'masala', 'spice', 'bombay biryani'],
    offers: [
      { store: 'Imtiaz', name: 'Shan Bombay Biryani 60g', price: 95, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Shan Biryani Masala 60g', price: 99, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Shan Biryani Mix 60g', price: 100, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shan Bombay Biryani 60g', price: 105, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Shan Biryani Masala 60g', price: 115, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'national-karahi-masala-100g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'National', quantity: '100 g',
    title: 'National Karahi Gosht Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 110, maxPrice: 135, savingPct: 19,
    keywords: ['national', 'karahi', 'masala', 'spice', 'gosht'],
    offers: [
      { store: 'Bin Hashim', name: 'National Karahi Gosht 100g', price: 110, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'National Karahi Masala 100g', price: 115, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'National Karahi Gosht 100g', price: 125, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'National Karahi Masala 100g', price: 135, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'shan-nihari-masala-55g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shan', quantity: '55 g',
    title: 'Shan Nihari Masala Mix', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 85, maxPrice: 105, savingPct: 19,
    keywords: ['shan', 'nihari', 'masala', 'spice', 'recipe mix'],
    offers: [
      { store: 'Chase Up', name: 'Shan Nihari 55g', price: 85, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Shan Nihari Masala 55g', price: 90, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Shan Nihari Mix 55g', price: 95, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shan Nihari Masala 55g', price: 105, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'national-chaat-masala-100g',
    category: 'Food Staples', subCategory: 'Branded Spices', brand: 'National', quantity: '100 g',
    title: 'National Chaat Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 70, maxPrice: 90, savingPct: 22,
    keywords: ['national', 'chaat', 'masala', 'spice', 'chat masala'],
    offers: [
      { store: 'Imtiaz', name: 'National Chaat Masala 100g', price: 70, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'National Chaat Masala 100g', price: 75, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Chaat Masala 100g', price: 80, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Chaat Masala 100g', price: 90, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'shan-tikka-masala-50g',
    category: 'Food Staples', subCategory: 'Branded Spices', brand: 'Shan', quantity: '50 g',
    title: 'Shan Shami / Chicken Tikka Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 80, maxPrice: 100, savingPct: 20,
    keywords: ['shan', 'tikka', 'masala', 'spice', 'shami', 'chicken'],
    offers: [
      { store: 'Chase Up', name: 'Shan Tikka Masala 50g', price: 80, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Shan Tikka Masala 50g', price: 85, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Shan Tikka Masala 50g', price: 90, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shan Tikka Masala 50g', price: 100, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PULSES / GRAINS / LENTILS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'dal-chana-1kg',
    category: 'Baking and Cooking', subCategory: 'Rice', brand: 'Fresh', quantity: '1 kg',
    title: 'Chana Dal (Split Chickpeas)', image: img('1512621776951-a57ef3aa2609'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 320, maxPrice: 380, savingPct: 16,
    keywords: ['chana dal', 'pulse', 'lentil', 'chickpea', 'gram'],
    offers: [
      { store: 'Imtiaz', name: 'Chana Dal 1kg', price: 320, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Chana Dal 1kg', price: 335, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Chana Dal 1kg', price: 350, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Chana Dal 1kg', price: 380, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'masoor-dal-1kg',
    category: 'Baking and Cooking', subCategory: 'Rice', brand: 'Fresh', quantity: '1 kg',
    title: 'Masoor Dal (Red Lentils)', image: img('1512621776951-a57ef3aa2609'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 280, maxPrice: 340, savingPct: 18,
    keywords: ['masoor', 'dal', 'lentil', 'red lentil', 'pulse'],
    offers: [
      { store: 'Bin Hashim', name: 'Masoor Dal 1kg', price: 280, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Masoor Dal 1kg', price: 295, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Masoor Dal 1kg', price: 310, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Masoor Dal 1kg', price: 340, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mung-dal-1kg',
    category: 'Food Staples', subCategory: 'Pulses and Lentils', brand: 'Fresh', quantity: '1 kg',
    title: 'Moong Dal (Split Mung Beans)', image: img('1512621776951-a57ef3aa2609'), storeCount: 3,
    cheapestStore: 'Chase Up', minPrice: 310, maxPrice: 370, savingPct: 16,
    keywords: ['moong', 'mung', 'dal', 'lentil', 'pulse', 'green gram'],
    offers: [
      { store: 'Chase Up', name: 'Moong Dal 1kg', price: 310, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Moong Dal 1kg', price: 335, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Moong Dal 1kg', price: 370, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SAUCES, KETCHUPS & PICKLES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'national-ketchup-800g',
    category: 'Baking and Cooking', subCategory: 'Salt', brand: 'National', quantity: '800 g',
    title: 'National Tomato Ketchup', image: img('1546069901-5ec6a79120b0'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 220, maxPrice: 280, savingPct: 21,
    keywords: ['national', 'ketchup', 'tomato', 'sauce', 'chatni'],
    offers: [
      { store: 'Chase Up', name: 'National Tomato Ketchup 800g', price: 220, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Ketchup 800g', price: 230, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'National Tomato Ketchup 800g', price: 240, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'National Ketchup 800g', price: 260, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'National Tomato Ketchup 800g', price: 280, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'shangrila-chilli-sauce-320g',
    category: 'Food Staples', subCategory: 'Sauces And Ketchups', brand: 'Shangrila', quantity: '320 g',
    title: 'Shangrila Chilli Garlic Sauce', image: img('1546069901-5ec6a79120b0'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 155, maxPrice: 195, savingPct: 21,
    keywords: ['shangrila', 'chilli', 'garlic', 'sauce', 'hot sauce'],
    offers: [
      { store: 'Imtiaz', name: 'Shangrila Chilli Garlic 320g', price: 155, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Shangrila Chilli Sauce 320g', price: 165, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Shangrila Chilli Garlic 320g', price: 175, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shangrila Chilli Sauce 320g', price: 195, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'youngs-mayonnaise-500g',
    category: 'Baking and Cooking', subCategory: 'Baking', brand: "Young's", quantity: '500 g',
    title: "Young's Eggless Mayonnaise", image: img('1565299507177-7be9b08b8b8e'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 275, maxPrice: 330, savingPct: 17,
    keywords: ["young's", 'mayo', 'mayonnaise', 'sauce', 'eggless'],
    offers: [
      { store: 'Imtiaz', name: "Young's Eggless Mayo 500g", price: 275, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Young's Mayonnaise 500g", price: 285, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Young's Eggless Mayo 500g", price: 295, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Young's Mayonnaise 500g", price: 330, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'national-mango-pickle-320g',
    category: 'Food Staples', subCategory: 'Sauces And Ketchups', brand: 'National', quantity: '320 g',
    title: 'National Mixed Pickle (Achar)', image: img('1570197788417-0e82375c9371'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 185, maxPrice: 230, savingPct: 20,
    keywords: ['national', 'pickle', 'achar', 'mango', 'mixed pickle'],
    offers: [
      { store: 'Bin Hashim', name: 'National Mixed Pickle 320g', price: 185, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'National Achar 320g', price: 195, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'National Mixed Pickle 320g', price: 205, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'National Mixed Pickle 320g', price: 230, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHIPS, SNACKS & NIMCO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'lays-paprika-chips-100g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Lays', quantity: '100 g',
    title: "Lay's Paprika Flavoured Potato Chips", image: img('1566478989037-eec170784d0b'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 95, maxPrice: 120, savingPct: 21,
    keywords: ['lays', 'chips', 'paprika', 'crisps', 'snack'],
    offers: [
      { store: 'Imtiaz', name: "Lay's Paprika 100g", price: 95, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Lay's Paprika Chips 100g", price: 99, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Lay's Paprika 100g", price: 100, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Lay's Chips 100g", price: 110, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: "Lay's Paprika 100g", price: 120, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'nimco-mixture-200g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Nimco', quantity: '200 g',
    title: 'Nimco Mix (Daal Moth & Chanay)', image: img('1566478989037-eec170784d0b'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 120, maxPrice: 155, savingPct: 23,
    keywords: ['nimco', 'mixture', 'chanay', 'daal moth', 'snack', 'crispy'],
    offers: [
      { store: 'Chase Up', name: 'Nimco Mix 200g', price: 120, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Nimco Mixture 200g', price: 130, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Nimco Mix 200g', price: 135, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Nimco Mixture 200g', price: 155, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'kolson-corn-flakes-500g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Kolson', quantity: '75 g',
    title: 'Kolson Slanty Chilli Flavoured', image: img('1566478989037-eec170784d0b'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 50, maxPrice: 70, savingPct: 29,
    keywords: ['kolson', 'slanty', 'chilli', 'snack', 'crisp'],
    offers: [
      { store: 'Imtiaz', name: 'Kolson Slanty 75g', price: 50, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Kolson Slanty 75g', price: 55, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Kolson Slanty 75g', price: 60, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Kolson Slanty 75g', price: 70, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'peek-freans-sooper-115g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Peek Freans', quantity: '115 g',
    title: 'Peek Freans Sooper Biscuit', image: img('1558961363-fa8fdf82db35'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 60, maxPrice: 80, savingPct: 25,
    keywords: ['peek freans', 'sooper', 'biscuit', 'cookie', 'biscuits'],
    offers: [
      { store: 'Chase Up', name: 'Peek Freans Sooper 115g', price: 60, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Sooper Biscuit 115g', price: 65, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Peek Freans Sooper 115g', price: 68, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Sooper Biscuit 115g', price: 70, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Peek Freans Sooper 115g', price: 80, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'britannia-marie-200g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Britannia', quantity: '200 g',
    title: 'Britannia Marie Gold Biscuits', image: img('1558961363-fa8fdf82db35'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 85, maxPrice: 105, savingPct: 19,
    keywords: ['britannia', 'marie', 'biscuit', 'tea biscuit', 'gold'],
    offers: [
      { store: 'Imtiaz', name: 'Britannia Marie Gold 200g', price: 85, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Britannia Marie 200g', price: 90, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Britannia Marie Gold 200g', price: 95, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Britannia Marie Gold 200g', price: 105, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'cadbury-5star-40g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Cadbury', quantity: '40 g',
    title: 'Cadbury 5 Star Chocolate Bar', image: img('1606312619070-d47a4eed5c06'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 65, maxPrice: 85, savingPct: 24,
    keywords: ['cadbury', '5 star', 'chocolate', 'candy', 'bar'],
    offers: [
      { store: 'Imtiaz', name: 'Cadbury 5 Star 40g', price: 65, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Cadbury 5 Star 40g', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Cadbury 5 Star 40g', price: 75, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Cadbury 5 Star 40g', price: 85, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'kitkat-chocolate-45g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Nestle', quantity: '45 g',
    title: 'KitKat 4 Fingers Chocolate Wafer', image: img('1606312619070-d47a4eed5c06'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 80, maxPrice: 100, savingPct: 20,
    keywords: ['kitkat', 'nestle', 'chocolate', 'wafer', 'bar'],
    offers: [
      { store: 'Chase Up', name: 'KitKat 4 Fingers 45g', price: 80, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'KitKat Chocolate 45g', price: 85, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'KitKat 4 Fingers 45g', price: 90, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'KitKat Wafer 45g', price: 100, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DESSERTS — Jelly, Custard, Cake, Ice Cream
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'mitchells-jam-450g',
    category: 'Breakfast', subCategory: 'Bread', brand: "Mitchell's", quantity: '450 g',
    title: "Mitchell's Strawberry Jam", image: img('1587049352846-b0bf0a6e0f5b'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 320, maxPrice: 390, savingPct: 18,
    keywords: ["mitchell's", 'jam', 'strawberry', 'spread', 'jelly'],
    offers: [
      { store: 'Imtiaz', name: "Mitchell's Strawberry Jam 450g", price: 320, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Mitchell's Jam 450g", price: 335, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Mitchell's Strawberry 450g", price: 350, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Mitchell's Jam 450g", price: 390, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'rafhan-custard-powder-300g',
    category: 'Desserts', subCategory: 'Jelly and Custard', brand: 'Rafhan', quantity: '300 g',
    title: 'Rafhan Vanilla Custard Powder', image: img('1551024601-bec78aea704b'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 165, maxPrice: 210, savingPct: 21,
    keywords: ['rafhan', 'custard', 'vanilla', 'dessert', 'powder'],
    offers: [
      { store: 'Chase Up', name: 'Rafhan Custard Powder 300g', price: 165, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Rafhan Vanilla Custard 300g', price: 175, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Rafhan Custard Powder 300g', price: 180, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Rafhan Custard Powder 300g', price: 195, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Rafhan Custard 300g', price: 210, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'national-jelly-crystals-80g',
    category: 'Desserts', subCategory: 'Jelly and Custard', brand: 'National', quantity: '80 g',
    title: 'National Strawberry Jelly Crystals', image: img('1551024601-bec78aea704b'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 75, savingPct: 27,
    keywords: ['national', 'jelly', 'strawberry', 'crystals', 'dessert'],
    offers: [
      { store: 'Imtiaz', name: 'National Jelly Crystals 80g', price: 55, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'National Jelly 80g', price: 60, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Jelly Crystals 80g', price: 65, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Jelly 80g', price: 75, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'walls-cornetto-120ml',
    category: 'Desserts', subCategory: 'Icecreams', brand: 'Walls', quantity: '120 ml',
    title: "Wall's Cornetto Classic Ice Cream Cone", image: img('1563805958-d5c72cf0cce7'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 160, maxPrice: 200, savingPct: 20,
    keywords: ["wall's", 'walls', 'cornetto', 'ice cream', 'cone', 'gelato'],
    offers: [
      { store: 'Imtiaz', name: "Wall's Cornetto 120ml", price: 160, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Cornetto Classic 120ml', price: 170, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Wall's Cornetto 120ml", price: 175, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Wall's Cornetto Ice Cream 120ml", price: 200, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'igloo-ice-cream-1l',
    category: 'Snacks', subCategory: 'Icecreams', brand: 'Igloo', quantity: '1 L',
    title: 'Igloo Vanilla Ice Cream Tub', image: img('1563805958-d5c72cf0cce7'), storeCount: 3,
    cheapestStore: 'Chase Up', minPrice: 480, maxPrice: 560, savingPct: 14,
    keywords: ['igloo', 'ice cream', 'vanilla', 'tub', 'gelato'],
    offers: [
      { store: 'Chase Up', name: 'Igloo Vanilla Tub 1L', price: 480, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Igloo Vanilla Ice Cream 1L', price: 510, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Igloo Vanilla Tub 1L', price: 560, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'rafhan-cake-mix-500g',
    category: 'Desserts', subCategory: 'Cake Mixing, Baking And Add Ones', brand: 'Rafhan', quantity: '500 g',
    title: 'Rafhan Chocolate Cake Mix', image: img('1551024601-bec78aea704b'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 280, maxPrice: 345, savingPct: 19,
    keywords: ['rafhan', 'cake', 'mix', 'chocolate', 'baking', 'dessert'],
    offers: [
      { store: 'Bin Hashim', name: 'Rafhan Chocolate Cake Mix 500g', price: 280, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Rafhan Cake Mix 500g', price: 295, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Rafhan Choc Cake Mix 500g', price: 310, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Rafhan Cake Mix 500g', price: 345, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FROZEN FOODS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'k-and-ns-nuggets-400g',
    category: 'Frozen Foods', subCategory: 'Instant, Ready Meals And Snacks', brand: 'K&Ns', quantity: '400 g',
    title: "K&N's Chicken Nuggets", image: img('1562802378-6e399b4b5a35'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 480, maxPrice: 580, savingPct: 17,
    keywords: ["k&n's", 'nuggets', 'chicken', 'frozen', 'ready meal'],
    offers: [
      { store: 'Chase Up', name: "K&N's Nuggets 400g", price: 480, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: "K&N's Chicken Nuggets 400g", price: 510, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: "K&N's Nuggets 400g", price: 530, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "K&N's Chicken Nuggets 400g", price: 580, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'dawn-paratha-5pcs',
    category: 'Frozen Foods', subCategory: 'Paratha And Breads', brand: 'Dawn', quantity: '5 pcs',
    title: 'Dawn Frozen Paratha (Ready to Fry)', image: img('1601050690597-df0568f70950'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 185, maxPrice: 230, savingPct: 20,
    keywords: ['dawn', 'paratha', 'frozen', 'bread', 'ready to cook'],
    offers: [
      { store: 'Imtiaz', name: 'Dawn Frozen Paratha 5pcs', price: 185, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Dawn Paratha 5pcs', price: 195, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Dawn Frozen Paratha 5pcs', price: 205, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Dawn Paratha Ready to Fry 5pcs', price: 230, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'kns-chicken-strips-400g',
    category: 'Frozen Foods', subCategory: 'Instant, Ready Meals And Snacks', brand: 'K&Ns', quantity: '400 g',
    title: "K&N's Chicken Tempura Strips", image: img('1562802378-6e399b4b5a35'), storeCount: 3,
    cheapestStore: 'Chase Up', minPrice: 530, maxPrice: 620, savingPct: 15,
    keywords: ["k&n's", 'strips', 'tempura', 'frozen', 'chicken'],
    offers: [
      { store: 'Chase Up', name: "K&N's Tempura Strips 400g", price: 530, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: "K&N's Chicken Strips 400g", price: 560, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: "K&N's Tempura Strips 400g", price: 620, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mitchells-pizza-sauce-320g',
    category: 'Frozen Foods', subCategory: 'Canned,Tin & Packaged Food', brand: "Mitchell's", quantity: '320 g',
    title: "Mitchell's Pizza & Pasta Sauce (Tin)", image: img('1546069901-5ec6a79120b0'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 210, maxPrice: 260, savingPct: 19,
    keywords: ["mitchell's", 'pizza', 'pasta', 'sauce', 'tin', 'canned'],
    offers: [
      { store: 'Imtiaz', name: "Mitchell's Pizza Sauce 320g", price: 210, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Mitchell's Pasta Sauce 320g", price: 230, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: "Mitchell's Pizza & Pasta Sauce", price: 260, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LAUNDRY & DETERGENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'ariel-matic-3kg',
    category: 'Laundry', subCategory: 'Detergent Powder and Soaps', brand: 'Ariel', quantity: '3 kg',
    title: 'Ariel Matic Automatic Washing Powder', image: img('1558618666-fcd25c85cd64'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1650, maxPrice: 1950, savingPct: 15,
    keywords: ['ariel', 'matic', 'detergent', 'washing', 'powder', 'laundry'],
    offers: [
      { store: 'Imtiaz', name: 'Ariel Matic 3kg', price: 1650, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Ariel Automatic 3kg', price: 1720, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Ariel Matic 3kg', price: 1800, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Ariel Matic Washing Powder 3kg', price: 1950, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'surf-excel-5kg',
    category: 'Laundry', subCategory: 'Detergent Powder and Soaps', brand: 'Surf Excel', quantity: '5 kg',
    title: 'Surf Excel Surf Blue Washing Powder', image: img('1558618666-fcd25c85cd64'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 2200, maxPrice: 2700, savingPct: 19,
    keywords: ['surf excel', 'surf', 'detergent', 'washing', 'powder', 'blue'],
    offers: [
      { store: 'Chase Up', name: 'Surf Excel Blue 5kg', price: 2200, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Surf Excel 5kg Bag', price: 2300, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Surf Excel 5kg', price: 2400, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Surf Blue 5kg', price: 2550, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Surf Excel 5kg', price: 2700, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'comfort-fabric-softener-1l',
    category: 'Laundry', subCategory: 'Fabrics Softeners and Bleach', brand: 'Comfort', quantity: '1 L',
    title: 'Comfort Fabric Softener (Blue Skies)', image: img('1558618666-fcd25c85cd64'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 480, maxPrice: 590, savingPct: 19,
    keywords: ['comfort', 'fabric softener', 'softener', 'laundry', 'conditioner'],
    offers: [
      { store: 'Bin Hashim', name: 'Comfort Softener 1L', price: 480, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Comfort Fabric Softener 1L', price: 510, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Comfort Softener Blue 1L', price: 530, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Comfort Softener 1L', price: 590, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'bonus-washing-powder-2kg',
    category: 'Laundry', subCategory: 'Detergent Powder and Soaps', brand: 'Bonus', quantity: '2 kg',
    title: 'Bonus Triclean Washing Powder', image: img('1558618666-fcd25c85cd64'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 480, maxPrice: 590, savingPct: 19,
    keywords: ['bonus', 'triclean', 'detergent', 'washing', 'powder'],
    offers: [
      { store: 'Chase Up', name: 'Bonus Triclean 2kg', price: 480, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Bonus Washing Powder 2kg', price: 510, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Bonus Triclean 2kg', price: 530, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Bonus Washing Powder 2kg', price: 590, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HOME ESSENTIAL — Cleaners, Toilet & Surface
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'harpic-toilet-cleaner-500ml',
    category: 'Home Essential', subCategory: 'Household Cleaners', brand: 'Harpic', quantity: '500 ml',
    title: 'Harpic Power Plus Toilet Cleaner', image: img('1585771724684-38df0e7c8b4e'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 275, maxPrice: 350, savingPct: 21,
    keywords: ['harpic', 'toilet', 'cleaner', 'bathroom', 'surface'],
    offers: [
      { store: 'Imtiaz', name: 'Harpic Power Plus 500ml', price: 275, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Harpic Toilet Cleaner 500ml', price: 290, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Harpic Power Plus 500ml', price: 300, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Harpic 500ml', price: 325, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Harpic Power Plus 500ml', price: 350, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'surf-excel-dishwash-liquid-500ml',
    category: 'DishWashing', subCategory: 'Powder,Soap And Liquid', brand: 'Vim', quantity: '500 ml',
    title: 'Vim Active Gel Dish Wash', image: img('1585771724684-38df0e7c8b4e'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 165, maxPrice: 210, savingPct: 21,
    keywords: ['vim', 'dishwash', 'liquid', 'dish', 'gel'],
    offers: [
      { store: 'Chase Up', name: 'Vim Active Gel 500ml', price: 165, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Vim Dishwash 500ml', price: 175, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Vim Active Gel 500ml', price: 185, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Vim Dish Wash 500ml', price: 210, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'scotch-brite-sponge-scrub',
    category: 'DishWashing', subCategory: 'Scrubs and Sponges', brand: 'Scotch-Brite', quantity: '1 pc',
    title: 'Scotch-Brite Heavy Duty Scrub Sponge', image: img('1585771724684-38df0e7c8b4e'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 65, maxPrice: 90, savingPct: 28,
    keywords: ['scotch brite', 'sponge', 'scrub', 'dishwash', 'pad'],
    offers: [
      { store: 'Imtiaz', name: 'Scotch-Brite Scrub Sponge', price: 65, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Scotch-Brite Sponge', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Scotch-Brite Heavy Duty Sponge', price: 75, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Scotch-Brite Scrub 1pc', price: 90, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mortein-spray-300ml',
    category: 'Home Essential', subCategory: 'Repellents,Pest Control & Insecticides', brand: 'Mortein', quantity: '300 ml',
    title: 'Mortein Power Booster Insect Spray', image: img('1585771724684-38df0e7c8b4e'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 350, maxPrice: 440, savingPct: 20,
    keywords: ['mortein', 'insect', 'spray', 'mosquito', 'pest control', 'repellent'],
    offers: [
      { store: 'Imtiaz', name: 'Mortein Insect Spray 300ml', price: 350, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Mortein Power Spray 300ml', price: 370, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Mortein 300ml', price: 390, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Mortein Booster 300ml', price: 440, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'rose-petal-tissue-100pcs',
    category: 'Home Essential', subCategory: 'Toilet roll,Towels,Wipes and Tissues', brand: 'Rose Petal', quantity: '100 pcs',
    title: 'Rose Petal Facial Tissue Box', image: img('1584464383232-d4f03b53c688'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 110, maxPrice: 145, savingPct: 24,
    keywords: ['rose petal', 'tissue', 'facial tissue', 'kleenex', 'towel'],
    offers: [
      { store: 'Chase Up', name: 'Rose Petal Tissue Box 100pcs', price: 110, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Rose Petal Facial Tissue 100pcs', price: 118, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Rose Petal Tissue 100pcs', price: 125, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Rose Petal Facial Tissue 100pcs', price: 135, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Rose Petal Tissue Box 100pcs', price: 145, url: 'https://carrefour.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PERSONAL CARE / SOAP / SHAMPOO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'head-shoulders-shampoo-360ml',
    category: 'Home Essential', subCategory: 'Household Cleaners', brand: 'Head & Shoulders', quantity: '360 ml',
    title: 'Head & Shoulders Anti-Dandruff Shampoo', image: img('1526045612212-70cca1604154'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 580, maxPrice: 720, savingPct: 19,
    keywords: ['head shoulders', 'shampoo', 'hair', 'anti dandruff', 'personal care'],
    offers: [
      { store: 'Imtiaz', name: 'H&S Anti-Dandruff 360ml', price: 580, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Head & Shoulders 360ml', price: 610, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'H&S Shampoo 360ml', price: 650, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Head & Shoulders 360ml', price: 720, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'lux-beauty-soap-6pack',
    category: 'Home Essential', subCategory: 'Household Cleaners', brand: 'Lux', quantity: '6 × 90 g',
    title: 'Lux Soft Rose Beauty Soap (6 Pack)', image: img('1526045612212-70cca1604154'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 420, maxPrice: 540, savingPct: 22,
    keywords: ['lux', 'soap', 'beauty', 'bath', 'rose'],
    offers: [
      { store: 'Chase Up', name: 'Lux Soft Rose 6pk', price: 420, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Lux Beauty Soap 6pk', price: 445, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Lux Soap 6×90g', price: 460, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Lux Soft Rose 6pk', price: 500, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Lux Beauty Soap 6pk', price: 540, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'colgate-toothpaste-150g',
    category: 'Home Essential', subCategory: 'Detergent', brand: 'Colgate', quantity: '150 g',
    title: 'Colgate Maximum Cavity Protection Toothpaste', image: img('1526045612212-70cca1604154'), storeCount: 5,
    cheapestStore: 'Bin Hashim', minPrice: 185, maxPrice: 240, savingPct: 23,
    keywords: ['colgate', 'toothpaste', 'dental', 'teeth', 'cavity', 'personal care'],
    offers: [
      { store: 'Bin Hashim', name: 'Colgate Cavity Protection 150g', price: 185, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Colgate Maximum Protection 150g', price: 195, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Colgate Toothpaste 150g', price: 205, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Colgate Cavity Protection 150g', price: 220, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Colgate Toothpaste 150g', price: 240, url: 'https://carrefour.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BEVERAGES — Flavoring Syrup, Rooh Afza, Water
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'rooh-afza-800ml',
    category: 'Beverages', subCategory: 'Juice', brand: 'Hamdard', quantity: '800 ml',
    title: 'Rooh Afza Sharbat (Original)', image: img('1621263343409-b97f80b9a1d5'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 455, maxPrice: 540, savingPct: 16,
    keywords: ['rooh afza', 'hamdard', 'sharbat', 'syrup', 'squash', 'sherbet'],
    offers: [
      { store: 'Imtiaz', name: 'Rooh Afza 800ml', price: 455, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Rooh Afza Sharbat 800ml', price: 470, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Rooh Afza 800ml', price: 485, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Rooh Afza Sharbat 800ml', price: 505, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Rooh Afza 800ml', price: 540, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'ribena-squash-500ml',
    category: 'Beverages', subCategory: 'Juice', brand: 'Ribena', quantity: '500 ml',
    title: 'Ribena Blackcurrant Squash', image: img('1621263343409-b97f80b9a1d5'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 490, maxPrice: 580, savingPct: 16,
    keywords: ['ribena', 'squash', 'blackcurrant', 'juice', 'syrup'],
    offers: [
      { store: 'Metro', name: 'Ribena Blackcurrant 500ml', price: 490, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Ribena Squash 500ml', price: 530, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Ribena Blackcurrant 500ml', price: 580, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'nestle-pure-life-water-1-5l',
    category: 'Beverages', subCategory: 'Water', brand: 'Nestle', quantity: '1.5 L',
    title: 'Nestle Pure Life Mineral Water (6 Pack)', image: img('1548839140-29a749e1cf4d'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 350, maxPrice: 450, savingPct: 22,
    keywords: ['nestle', 'pure life', 'water', 'mineral water', 'drinking water'],
    offers: [
      { store: 'Imtiaz', name: 'Nestle Pure Life 1.5L ×6', price: 350, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Nestle Water 1.5L ×6', price: 370, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Nestle Pure Life ×6', price: 385, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Nestle Water 6-pack 1.5L', price: 410, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Nestle Pure Life 1.5L ×6', price: 450, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'sprite-500ml',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Sprite', quantity: '500 ml',
    title: 'Sprite Lemon Lime Carbonated Drink', image: img('1621263343409-b97f80b9a1d5'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 70, maxPrice: 90, savingPct: 22,
    keywords: ['sprite', 'cola', 'soda', 'soft drink', 'carbonated', 'lemon lime'],
    offers: [
      { store: 'Chase Up', name: 'Sprite 500ml', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Sprite 500ml Bottle', price: 75, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Sprite 500ml', price: 78, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Sprite 500ml', price: 90, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'fanta-orange-1-5l',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Fanta', quantity: '1.5 L',
    title: 'Fanta Orange Carbonated Drink', image: img('1621263343409-b97f80b9a1d5'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 115, maxPrice: 145, savingPct: 21,
    keywords: ['fanta', 'orange', 'soda', 'cola', 'soft drink', 'carbonated'],
    offers: [
      { store: 'Imtiaz', name: 'Fanta Orange 1.5L', price: 115, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fanta 1.5L', price: 120, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Fanta Orange 1.5L', price: 128, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Fanta 1.5L', price: 145, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BREAKFAST — Eggs, Jam, Honey, Cereals
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'quaker-oats-500g',
    category: 'Breakfast', subCategory: 'Oats', brand: 'Quaker', quantity: '500 g',
    title: 'Quaker Oats Original Rolled Oats', image: img('1495195134817-26e82a0f8e70'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 310, maxPrice: 390, savingPct: 21,
    keywords: ['quaker', 'oats', 'cereal', 'porridge', 'breakfast', 'oatmeal'],
    offers: [
      { store: 'Chase Up', name: 'Quaker Oats 500g', price: 310, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Quaker Rolled Oats 500g', price: 325, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Quaker Oats 500g', price: 345, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Quaker Original Oats 500g', price: 390, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'kelloggs-cornflakes-500g',
    category: 'Breakfast', subCategory: 'Cereals', brand: "Kellogg's", quantity: '500 g',
    title: "Kellogg's Corn Flakes Original", image: img('1495195134817-26e82a0f8e70'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 420, maxPrice: 530, savingPct: 21,
    keywords: ["kellogg's", 'cornflakes', 'corn flakes', 'cereal', 'breakfast'],
    offers: [
      { store: 'Imtiaz', name: "Kellogg's Corn Flakes 500g", price: 420, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Kellogg's Cornflakes 500g", price: 445, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Kellogg's Corn Flakes 500g", price: 465, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Kellogg's Cornflakes 500g", price: 530, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'national-honey-250g',
    category: 'Breakfast', subCategory: 'Jam, Honey & Spreads', brand: 'National', quantity: '250 g',
    title: 'National Pure Honey', image: img('1587049352846-b0bf0a6e0f5b'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 480, maxPrice: 580, savingPct: 17,
    keywords: ['national', 'honey', 'pure honey', 'breakfast', 'spread'],
    offers: [
      { store: 'Bin Hashim', name: 'National Pure Honey 250g', price: 480, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'National Honey 250g', price: 510, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'National Pure Honey 250g', price: 535, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'National Honey 250g', price: 580, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'olpers-cream-200ml',
    category: 'Dairy', subCategory: 'Cheese', brand: "Olper's", quantity: '200 ml',
    title: "Olper's Dairy Cream", image: img('1559598467-f8b76c8155d0'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 165, maxPrice: 210, savingPct: 21,
    keywords: ["olper's", 'cream', 'dairy', 'whipping cream', 'milk'],
    offers: [
      { store: 'Chase Up', name: "Olper's Cream 200ml", price: 165, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: "Olper's Dairy Cream 200ml", price: 175, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: "Olper's Cream 200ml", price: 185, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Olper's Dairy Cream 200ml", price: 210, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'olpers-yogurt-400g',
    category: 'Dairy', subCategory: 'Yogurt', brand: "Olper's", quantity: '400 g',
    title: "Olper's Plain Dahi (Yogurt)", image: img('1559598467-f8b76c8155d0'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 155, maxPrice: 195, savingPct: 21,
    keywords: ["olper's", 'yogurt', 'dahi', 'dairy', 'plain'],
    offers: [
      { store: 'Imtiaz', name: "Olper's Dahi 400g", price: 155, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: "Olper's Yogurt 400g", price: 165, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: "Olper's Dahi 400g", price: 175, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: "Olper's Yogurt 400g", price: 195, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FRESH PRODUCE — More Vegetables & Fruits
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'tomatoes-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Tomatoes (Tamatar)', image: img('1546470427-15d6cfa40f92'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 60, maxPrice: 100, savingPct: 40,
    keywords: ['tomato', 'tamatar', 'vegetable', 'fresh', 'sabzi'],
    offers: [
      { store: 'Bin Hashim', name: 'Fresh Tomatoes 1kg', price: 60, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Fresh Tomatoes 1kg', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fresh Tomatoes 1kg', price: 80, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Fresh Tomatoes 1kg', price: 100, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'potatoes-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Potatoes (Aloo)', image: img('1518977676681-5d59bf59781b'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 90, savingPct: 39,
    keywords: ['potato', 'aloo', 'vegetable', 'fresh', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Potatoes 1kg', price: 55, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Fresh Aloo 1kg', price: 60, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Fresh Potatoes 1kg', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Fresh Potatoes 1kg', price: 90, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'onions-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Onions (Pyaz)', image: img('1518977676681-5d59bf59781b'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 50, maxPrice: 85, savingPct: 41,
    keywords: ['onion', 'pyaz', 'vegetable', 'fresh', 'sabzi'],
    offers: [
      { store: 'Chase Up', name: 'Fresh Onions 1kg', price: 50, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Fresh Pyaz 1kg', price: 60, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Fresh Onions 1kg', price: 65, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Fresh Onions 1kg', price: 85, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mango-chaunsa-1kg',
    category: 'Fresh Products', subCategory: 'Fruits', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Chaunsa Mango (Aam)', image: img('1601493430367-e34b5a5c9f7c'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 180, maxPrice: 250, savingPct: 28,
    keywords: ['mango', 'chaunsa', 'aam', 'fruit', 'fresh'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Chaunsa Mango 1kg', price: 180, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Chaunsa Mango 1kg', price: 210, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Fresh Chaunsa 1kg', price: 250, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mutton-bone-in-1kg',
    category: 'Fresh Products', subCategory: 'Meat', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Mutton With Bone (Bakra Gosht)', image: img('1588168333986-5078d3ae3976'), storeCount: 3,
    cheapestStore: 'Chase Up', minPrice: 1500, maxPrice: 1750, savingPct: 14,
    keywords: ['mutton', 'gosht', 'bakra', 'meat', 'bone', 'lamb'],
    offers: [
      { store: 'Chase Up', name: 'Fresh Mutton 1kg', price: 1500, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fresh Mutton With Bone 1kg', price: 1600, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Fresh Mutton 1kg', price: 1750, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FOOD STAPLES — Sugar, Salt, Pasta expansions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'tata-salt-800g',
    category: 'Food Staples', subCategory: 'Salt', brand: 'Tata', quantity: '800 g',
    title: 'Tata Rock Salt (Himalayan Pink Salt)', image: img('1518977676681-5d59bf59781b'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 95, maxPrice: 130, savingPct: 27,
    keywords: ['tata', 'salt', 'himalayan', 'rock salt', 'pink salt', 'namak'],
    offers: [
      { store: 'Metro', name: 'Tata Rock Salt 800g', price: 95, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Tata Himalayan Salt 800g', price: 110, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Tata Rock Salt 800g', price: 130, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'bake-parlor-spaghetti-500g',
    category: 'Home Essential', subCategory: 'Pasta', brand: 'Bake Parlor', quantity: '500 g',
    title: 'Bake Parlor Spaghetti Pasta', image: img('1551462613-a7249dd1a3fc'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 155, maxPrice: 195, savingPct: 21,
    keywords: ['bake parlor', 'spaghetti', 'pasta', 'noodle', 'macaroni'],
    offers: [
      { store: 'Chase Up', name: 'Bake Parlor Spaghetti 500g', price: 155, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Bake Parlor Pasta 500g', price: 165, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Bake Parlor Spaghetti 500g', price: 170, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Bake Parlor Spaghetti 500g', price: 195, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'knorr-chicken-noodles-66g',
    category: 'Home Essential', subCategory: 'Pasta', brand: 'Knorr', quantity: '66 g',
    title: 'Knorr Chicken Noodles (Ready in 3 mins)', image: img('1551462613-a7249dd1a3fc'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 55, maxPrice: 75, savingPct: 27,
    keywords: ['knorr', 'noodles', 'instant', 'chicken', 'soup noodles'],
    offers: [
      { store: 'Chase Up', name: 'Knorr Chicken Noodles 66g', price: 55, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Knorr Noodles 66g', price: 58, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Knorr Chicken Noodles 66g', price: 60, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Knorr Noodles 66g', price: 68, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Knorr Chicken Noodles', price: 75, url: 'https://carrefour.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CANDIES, BUBBLE GUM & CONFECTIONERY
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'polo-mints-29g',
    category: 'Candies And BubbleGum', subCategory: 'Candies And Jellies', brand: 'Polo', quantity: '29 g',
    title: 'Polo Mints (The Mint With a Hole)', image: img('1606312619070-d47a4eed5c06'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 40, maxPrice: 60, savingPct: 33,
    keywords: ['polo', 'mint', 'candy', 'mints', 'fresh breath'],
    offers: [
      { store: 'Imtiaz', name: 'Polo Mints 29g', price: 40, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Polo Mints 29g', price: 45, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Polo Mints 29g', price: 50, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Polo Mints 29g', price: 60, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'chiclets-bubblegum-18pcs',
    category: 'Candies And BubbleGum', subCategory: 'Bubble Gum', brand: 'Chiclets', quantity: '18 pcs',
    title: 'Chiclets Fruit Flavoured Bubble Gum', image: img('1606312619070-d47a4eed5c06'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 35, maxPrice: 55, savingPct: 36,
    keywords: ['chiclets', 'bubble gum', 'gum', 'candy', 'chewing gum'],
    offers: [
      { store: 'Chase Up', name: 'Chiclets Fruit 18pcs', price: 35, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Chiclets Bubble Gum 18pcs', price: 40, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Chiclets 18pcs', price: 45, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Chiclets Fruit Gum 18pcs', price: 55, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'fruittella-candy-100g',
    category: 'Candies And BubbleGum', subCategory: 'Candies And Jellies', brand: 'Fruittella', quantity: '100 g',
    title: 'Fruittella Mixed Fruit Candy', image: img('1606312619070-d47a4eed5c06'), storeCount: 3,
    cheapestStore: 'Chase Up', minPrice: 85, maxPrice: 115, savingPct: 26,
    keywords: ['fruittella', 'candy', 'fruit', 'toffee', 'sweet'],
    offers: [
      { store: 'Chase Up', name: 'Fruittella Mixed Fruit 100g', price: 85, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fruittella Candy 100g', price: 95, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Fruittella Mixed Fruit 100g', price: 115, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RICE AND FLOUR EXPANSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'falak-basmati-5kg',
    category: 'Rice and Flour', subCategory: 'Rice', brand: 'Falak', quantity: '5 kg',
    title: 'Falak Super Basmati Rice', image: img('1536304929831-ee1ca9d44906'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 1450, maxPrice: 1750, savingPct: 17,
    keywords: ['falak', 'basmati', 'rice', 'chawal', 'super basmati'],
    offers: [
      { store: 'Imtiaz', name: 'Falak Basmati Rice 5kg', price: 1450, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Falak Super Basmati 5kg', price: 1510, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Falak Basmati 5kg', price: 1560, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Falak Super Basmati 5kg', price: 1650, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Falak Basmati Rice 5kg', price: 1750, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'sunridge-atta-10kg',
    category: 'Rice and Flour', subCategory: 'Flour', brand: 'Sunridge', quantity: '10 kg',
    title: 'Sunridge Whole Wheat Flour (Atta)', image: img('1574323347407-e45ef2b8b5f4'), storeCount: 5,
    cheapestStore: 'Chase Up', minPrice: 1350, maxPrice: 1650, savingPct: 18,
    keywords: ['sunridge', 'atta', 'flour', 'wheat', 'chakki atta'],
    offers: [
      { store: 'Chase Up', name: 'Sunridge Atta 10kg', price: 1350, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Sunridge Wheat Flour 10kg', price: 1400, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Sunridge Atta 10kg', price: 1440, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Sunridge Flour 10kg', price: 1550, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Sunridge Atta 10kg', price: 1650, url: 'https://carrefour.pk' },
    ],
  },
];
