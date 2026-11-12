// Mock catalog data — used as a fallback when Firestore is not configured.
// This keeps the app fully functional for local development / demo mode.
// Images: stable Unsplash photo URLs (w=300&h=300&fit=crop&auto=format)
import { CatalogProduct } from './catalog-types';

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop&auto=format`;

export const MOCK_CATALOG: CatalogProduct[] = [
  // ── Dairy ───────────────────────────────────────────────────────────────────
  {
    canonicalId: 'milk-full-cream-1l',
    category: 'Dairy', subCategory: 'Milk', brand: 'Olper\'s', quantity: '1 L',
    title: 'Olper\'s Full Cream Milk', image: img('1563636619-e9143da7973b-cc-by-4-0'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 210, savingPct: 14,
    keywords: ['milk', 'dairy', 'full cream'],
    offers: [
      { store: 'Metro', name: 'Olper\'s Full Cream Milk 1L', price: 180, url: '#' },
      { store: 'Carrefour', name: 'Olper\'s Full Cream Milk 1L', price: 195, url: '#' },
      { store: 'Imtiaz', name: 'Olper\'s Full Cream Milk 1L', price: 210, url: '#' },
    ],
  },
  {
    canonicalId: 'milk-low-fat-1l',
    category: 'Dairy', subCategory: 'Milk', brand: 'Nestle', quantity: '1 L',
    title: 'Nestle Low Fat Milk', image: img('1550583724-aa7edc1f4d2a'), storeCount: 3,
    cheapestStore: 'Carrefour', minPrice: 190, maxPrice: 220, savingPct: 14,
    keywords: ['milk', 'dairy', 'low fat', 'nestle'],
    offers: [
      { store: 'Carrefour', name: 'Nestle Low Fat Milk 1L', price: 190, url: '#' },
      { store: 'Metro', name: 'Nestle Low Fat Milk 1L', price: 205, url: '#' },
      { store: 'Al-Fatah', name: 'Nestle Low Fat Milk 1L', price: 220, url: '#' },
    ],
  },
  {
    canonicalId: 'yogurt-plain-500g',
    category: 'Dairy', subCategory: 'Yogurt', brand: 'Nestle', quantity: '500 g',
    title: 'Nestle Plain Yogurt', image: img('1488477181893-da48b8f0bc69'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 150, maxPrice: 175, savingPct: 14,
    keywords: ['yogurt', 'dahi', 'dairy', 'nestle'],
    offers: [
      { store: 'Metro', name: 'Nestle Plain Yogurt 500g', price: 150, url: '#' },
      { store: 'Imtiaz', name: 'Nestle Plain Yogurt 500g', price: 165, url: '#' },
      { store: 'Carrefour', name: 'Nestle Plain Yogurt 500g', price: 175, url: '#' },
    ],
  },
  {
    canonicalId: 'butter-salted-200g',
    category: 'Dairy', subCategory: 'Butter', brand: 'Nurpur', quantity: '200 g',
    title: 'Nurpur Salted Butter', image: img('1589985270826-4b7bb135bc9d'), storeCount: 2,
    cheapestStore: 'Metro', minPrice: 320, maxPrice: 350, savingPct: 9,
    keywords: ['butter', 'dairy', 'nurpur'],
    offers: [
      { store: 'Metro', name: 'Nurpur Salted Butter 200g', price: 320, url: '#' },
      { store: 'Carrefour', name: 'Nurpur Salted Butter 200g', price: 350, url: '#' },
    ],
  },
  {
    canonicalId: 'cheese-cheddar-200g',
    category: 'Dairy', subCategory: 'Cheese', brand: 'Adams', quantity: '200 g',
    title: 'Adams Cheddar Cheese', image: img('1486297678162-eb2a19b0a32d'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 450, maxPrice: 510, savingPct: 12,
    keywords: ['cheese', 'cheddar', 'dairy', 'adams'],
    offers: [
      { store: 'Imtiaz', name: 'Adams Cheddar Cheese 200g', price: 450, url: '#' },
      { store: 'Metro', name: 'Adams Cheddar Cheese 200g', price: 480, url: '#' },
      { store: 'Carrefour', name: 'Adams Cheddar Cheese 200g', price: 510, url: '#' },
    ],
  },
  {
    canonicalId: 'eggs-12-tray',
    category: 'Dairy', subCategory: 'Eggs', brand: 'Farm Fresh', quantity: '12 pcs',
    title: 'Farm Fresh Eggs Tray (12)', image: img('1582722872445-44dc5f7e3c8f'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 280, maxPrice: 320, savingPct: 13,
    keywords: ['eggs', 'anda', 'dairy', 'farm fresh'],
    offers: [
      { store: 'Imtiaz', name: 'Farm Fresh Eggs Tray 12', price: 280, url: '#' },
      { store: 'Metro', name: 'Farm Fresh Eggs Tray 12', price: 300, url: '#' },
      { store: 'Al-Fatah', name: 'Farm Fresh Eggs Tray 12', price: 320, url: '#' },
    ],
  },

  // ── Beverages ────────────────────────────────────────────────────────────────
  {
    canonicalId: 'juice-orange-1l',
    category: 'Beverages', subCategory: 'Juice', brand: 'Shezan', quantity: '1 L',
    title: 'Shezan Orange Juice', image: img('1587049352846-4a222e784d38'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 130, maxPrice: 160, savingPct: 19,
    keywords: ['juice', 'orange', 'shezan', 'drink'],
    offers: [
      { store: 'Imtiaz', name: 'Shezan Orange Juice 1L', price: 130, url: '#' },
      { store: 'Metro', name: 'Shezan Orange Juice 1L', price: 145, url: '#' },
      { store: 'Carrefour', name: 'Shezan Orange Juice 1L', price: 160, url: '#' },
    ],
  },
  {
    canonicalId: 'cola-pepsi-1-5l',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Pepsi', quantity: '1.5 L',
    title: 'Pepsi Cola', image: img('1629203851122-3726ecdf080e'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 95, maxPrice: 110, savingPct: 14,
    keywords: ['pepsi', 'cola', 'soft drink', 'soda', 'cold drink'],
    offers: [
      { store: 'Metro', name: 'Pepsi Cola 1.5L', price: 95, url: '#' },
      { store: 'Imtiaz', name: 'Pepsi Cola 1.5L', price: 100, url: '#' },
      { store: 'Al-Fatah', name: 'Pepsi Cola 1.5L', price: 110, url: '#' },
    ],
  },
  {
    canonicalId: 'cola-coke-1-5l',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Coca-Cola', quantity: '1.5 L',
    title: 'Coca-Cola Classic', image: img('1554866585-cd94860890b7'), storeCount: 3,
    cheapestStore: 'Carrefour', minPrice: 90, maxPrice: 110, savingPct: 18,
    keywords: ['coca cola', 'coke', 'cola', 'soft drink', 'cold drink'],
    offers: [
      { store: 'Carrefour', name: 'Coca-Cola 1.5L', price: 90, url: '#' },
      { store: 'Metro', name: 'Coca-Cola 1.5L', price: 100, url: '#' },
      { store: 'Imtiaz', name: 'Coca-Cola 1.5L', price: 110, url: '#' },
    ],
  },
  {
    canonicalId: 'water-mineral-1-5l',
    category: 'Beverages', subCategory: 'Water', brand: 'Nestle', quantity: '1.5 L',
    title: 'Nestle Pure Life Water', image: img('1548839140-29a749e1cf4d'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 50, maxPrice: 65, savingPct: 23,
    keywords: ['water', 'mineral water', 'nestle', 'pure life'],
    offers: [
      { store: 'Imtiaz', name: 'Nestle Pure Life 1.5L', price: 50, url: '#' },
      { store: 'Metro', name: 'Nestle Pure Life 1.5L', price: 58, url: '#' },
      { store: 'Carrefour', name: 'Nestle Pure Life 1.5L', price: 65, url: '#' },
    ],
  },

  // ── Breakfast ────────────────────────────────────────────────────────────────
  {
    canonicalId: 'oats-instant-400g',
    category: 'Breakfast', subCategory: 'Oats', brand: 'Quaker', quantity: '400 g',
    title: 'Quaker Instant Oats', image: img('1495195134817-aeb325a55b65'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 310, maxPrice: 360, savingPct: 14,
    keywords: ['oats', 'quaker', 'breakfast', 'instant oats'],
    offers: [
      { store: 'Metro', name: 'Quaker Instant Oats 400g', price: 310, url: '#' },
      { store: 'Carrefour', name: 'Quaker Instant Oats 400g', price: 340, url: '#' },
      { store: 'Al-Fatah', name: 'Quaker Instant Oats 400g', price: 360, url: '#' },
    ],
  },
  {
    canonicalId: 'cornflakes-500g',
    category: 'Breakfast', subCategory: 'Cereals', brand: 'Kellogg\'s', quantity: '500 g',
    title: 'Kellogg\'s Corn Flakes', image: img('1521483451569-e6b0e3443498'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 420, maxPrice: 480, savingPct: 13,
    keywords: ['cornflakes', 'cereal', 'breakfast', 'kelloggs'],
    offers: [
      { store: 'Imtiaz', name: 'Kellogg\'s Corn Flakes 500g', price: 420, url: '#' },
      { store: 'Metro', name: 'Kellogg\'s Corn Flakes 500g', price: 450, url: '#' },
      { store: 'Carrefour', name: 'Kellogg\'s Corn Flakes 500g', price: 480, url: '#' },
    ],
  },
  {
    canonicalId: 'bread-sandwich-400g',
    category: 'Breakfast', subCategory: 'Bread', brand: 'Bake Parlor', quantity: '400 g',
    title: 'Bake Parlor Sandwich Bread', image: img('1549931319-a545dcf3bc7c'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 95, maxPrice: 120, savingPct: 21,
    keywords: ['bread', 'sandwich', 'bake parlor', 'white bread'],
    offers: [
      { store: 'Imtiaz', name: 'Bake Parlor Sandwich Bread 400g', price: 95, url: '#' },
      { store: 'Metro', name: 'Bake Parlor Sandwich Bread 400g', price: 108, url: '#' },
      { store: 'Al-Fatah', name: 'Bake Parlor Sandwich Bread 400g', price: 120, url: '#' },
    ],
  },

  // ── Tea and Coffee ───────────────────────────────────────────────────────────
  {
    canonicalId: 'tea-lipton-200g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Lipton', quantity: '200 g',
    title: 'Lipton Yellow Label Tea', image: img('1544787219-7f47ccb76574'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 450, maxPrice: 520, savingPct: 13,
    keywords: ['tea', 'lipton', 'chai', 'yellow label'],
    offers: [
      { store: 'Imtiaz', name: 'Lipton Yellow Label 200g', price: 450, url: '#' },
      { store: 'Metro', name: 'Lipton Yellow Label 200g', price: 480, url: '#' },
      { store: 'Carrefour', name: 'Lipton Yellow Label 200g', price: 520, url: '#' },
    ],
  },
  {
    canonicalId: 'coffee-nescafe-200g',
    category: 'Tea and Coffee', subCategory: 'Coffee', brand: 'Nescafe', quantity: '200 g',
    title: 'Nescafe Classic Instant Coffee', image: img('1495474472287-4d71bcdd2085'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 1200, maxPrice: 1400, savingPct: 14,
    keywords: ['coffee', 'nescafe', 'instant coffee', 'classic'],
    offers: [
      { store: 'Metro', name: 'Nescafe Classic 200g', price: 1200, url: '#' },
      { store: 'Al-Fatah', name: 'Nescafe Classic 200g', price: 1300, url: '#' },
      { store: 'Carrefour', name: 'Nescafe Classic 200g', price: 1400, url: '#' },
    ],
  },

  // ── Snacks ───────────────────────────────────────────────────────────────────
  {
    canonicalId: 'chips-lays-100g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Lays', quantity: '100 g',
    title: 'Lays Masala Chips', image: img('1566478989037-eec170784d0b'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 80, maxPrice: 100, savingPct: 20,
    keywords: ['chips', 'lays', 'crisps', 'masala', 'snacks'],
    offers: [
      { store: 'Imtiaz', name: 'Lays Masala Chips 100g', price: 80, url: '#' },
      { store: 'Metro', name: 'Lays Masala Chips 100g', price: 90, url: '#' },
      { store: 'Al-Fatah', name: 'Lays Masala Chips 100g', price: 100, url: '#' },
    ],
  },
  {
    canonicalId: 'biscuit-oreo-137g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Oreo', quantity: '137 g',
    title: 'Oreo Chocolate Sandwich Cookies', image: img('1558961363-fa8fdf82db35'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 215, savingPct: 16,
    keywords: ['oreo', 'biscuit', 'cookie', 'chocolate', 'snacks'],
    offers: [
      { store: 'Metro', name: 'Oreo Cookies 137g', price: 180, url: '#' },
      { store: 'Carrefour', name: 'Oreo Cookies 137g', price: 198, url: '#' },
      { store: 'Al-Fatah', name: 'Oreo Cookies 137g', price: 215, url: '#' },
    ],
  },
  {
    canonicalId: 'biscuit-peek-freans-150g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Peek Freans', quantity: '150 g',
    title: 'Peek Freans Sooper Biscuits', image: img('1584395272560-8f31e39c0ba2'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 70, savingPct: 21,
    keywords: ['sooper', 'peek freans', 'biscuit', 'snacks'],
    offers: [
      { store: 'Imtiaz', name: 'Peek Freans Sooper 150g', price: 55, url: '#' },
      { store: 'Metro', name: 'Peek Freans Sooper 150g', price: 62, url: '#' },
      { store: 'Al-Fatah', name: 'Peek Freans Sooper 150g', price: 70, url: '#' },
    ],
  },
  {
    canonicalId: 'nuts-peanuts-200g',
    category: 'Snacks', subCategory: 'Nuts', brand: 'Kolson', quantity: '200 g',
    title: 'Kolson Salted Peanuts', image: img('1567881130145-a16ea2a4e7cc'), storeCount: 2,
    cheapestStore: 'Metro', minPrice: 120, maxPrice: 145, savingPct: 17,
    keywords: ['peanuts', 'nuts', 'mungphali', 'snacks', 'kolson'],
    offers: [
      { store: 'Metro', name: 'Kolson Salted Peanuts 200g', price: 120, url: '#' },
      { store: 'Imtiaz', name: 'Kolson Salted Peanuts 200g', price: 145, url: '#' },
    ],
  },

  // ── Home Essential ───────────────────────────────────────────────────────────
  {
    canonicalId: 'rice-basmati-5kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Guard', quantity: '5 kg',
    title: 'Guard Basmati Rice', image: img('1536304929831-ee1ca9d44906'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 1050, maxPrice: 1250, savingPct: 16,
    keywords: ['rice', 'basmati', 'chawal', 'guard'],
    offers: [
      { store: 'Imtiaz', name: 'Guard Basmati Rice 5kg', price: 1050, url: '#' },
      { store: 'Metro', name: 'Guard Basmati Rice 5kg', price: 1150, url: '#' },
      { store: 'Al-Fatah', name: 'Guard Basmati Rice 5kg', price: 1250, url: '#' },
    ],
  },
  {
    canonicalId: 'flour-wheat-5kg',
    category: 'Home Essential', subCategory: 'Flour', brand: 'Sunridge', quantity: '5 kg',
    title: 'Sunridge Wheat Flour (Atta)', image: img('1574323347407-f5e1ad6d020b'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 580, maxPrice: 650, savingPct: 11,
    keywords: ['flour', 'atta', 'wheat', 'sunridge', 'maida'],
    offers: [
      { store: 'Metro', name: 'Sunridge Wheat Flour 5kg', price: 580, url: '#' },
      { store: 'Carrefour', name: 'Sunridge Wheat Flour 5kg', price: 615, url: '#' },
      { store: 'Imtiaz', name: 'Sunridge Wheat Flour 5kg', price: 650, url: '#' },
    ],
  },
  {
    canonicalId: 'sugar-refined-1kg',
    category: 'Home Essential', subCategory: 'Sugar', brand: 'Rachna', quantity: '1 kg',
    title: 'Rachna Refined Sugar', image: img('1558618666-fcd25c85cd64'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 155, maxPrice: 180, savingPct: 14,
    keywords: ['sugar', 'cheeni', 'refined', 'rachna'],
    offers: [
      { store: 'Imtiaz', name: 'Rachna Refined Sugar 1kg', price: 155, url: '#' },
      { store: 'Metro', name: 'Rachna Refined Sugar 1kg', price: 165, url: '#' },
      { store: 'Al-Fatah', name: 'Rachna Refined Sugar 1kg', price: 180, url: '#' },
    ],
  },
  {
    canonicalId: 'salt-iodized-1kg',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shangrila', quantity: '1 kg',
    title: 'Shangrila Iodized Salt', image: img('1518110925495-5fe2fda0442c'), storeCount: 2,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 70, savingPct: 21,
    keywords: ['salt', 'namak', 'iodized', 'shangrila'],
    offers: [
      { store: 'Imtiaz', name: 'Shangrila Iodized Salt 1kg', price: 55, url: '#' },
      { store: 'Metro', name: 'Shangrila Iodized Salt 1kg', price: 70, url: '#' },
    ],
  },
  {
    canonicalId: 'cooking-oil-5l',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Sufi', quantity: '5 L',
    title: 'Sufi Canola Cooking Oil', image: img('1474979266404-7eaacbcd87c5'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 1800, maxPrice: 2100, savingPct: 14,
    keywords: ['oil', 'cooking oil', 'canola', 'sufi', 'tel'],
    offers: [
      { store: 'Imtiaz', name: 'Sufi Canola Oil 5L', price: 1800, url: '#' },
      { store: 'Metro', name: 'Sufi Canola Oil 5L', price: 1950, url: '#' },
      { store: 'Carrefour', name: 'Sufi Canola Oil 5L', price: 2100, url: '#' },
    ],
  },
  {
    canonicalId: 'pasta-spaghetti-500g',
    category: 'Home Essential', subCategory: 'Pasta', brand: 'Kolson', quantity: '500 g',
    title: 'Kolson Spaghetti Pasta', image: img('1551462147-ff29053bfc14'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 120, maxPrice: 150, savingPct: 20,
    keywords: ['pasta', 'spaghetti', 'kolson', 'noodles'],
    offers: [
      { store: 'Metro', name: 'Kolson Spaghetti 500g', price: 120, url: '#' },
      { store: 'Al-Fatah', name: 'Kolson Spaghetti 500g', price: 135, url: '#' },
      { store: 'Carrefour', name: 'Kolson Spaghetti 500g', price: 150, url: '#' },
    ],
  },

  // ── Laundry ──────────────────────────────────────────────────────────────────
  {
    canonicalId: 'detergent-surf-1kg',
    category: 'Laundry', subCategory: 'Detergent', brand: 'Surf Excel', quantity: '1 kg',
    title: 'Surf Excel Washing Powder', image: img('1583947215259-38e31be8751f'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 420, maxPrice: 490, savingPct: 14,
    keywords: ['surf', 'surf excel', 'detergent', 'washing powder', 'laundry'],
    offers: [
      { store: 'Metro', name: 'Surf Excel 1kg', price: 420, url: '#' },
      { store: 'Imtiaz', name: 'Surf Excel 1kg', price: 455, url: '#' },
      { store: 'Carrefour', name: 'Surf Excel 1kg', price: 490, url: '#' },
    ],
  },
  {
    canonicalId: 'fabric-softener-1l',
    category: 'Laundry', subCategory: 'Fabric Softener', brand: 'Comfort', quantity: '1 L',
    title: 'Comfort Fabric Softener', image: img('1610557892470-55d9383080ea'), storeCount: 2,
    cheapestStore: 'Imtiaz', minPrice: 350, maxPrice: 400, savingPct: 13,
    keywords: ['comfort', 'fabric softener', 'laundry', 'softener'],
    offers: [
      { store: 'Imtiaz', name: 'Comfort Fabric Softener 1L', price: 350, url: '#' },
      { store: 'Metro', name: 'Comfort Fabric Softener 1L', price: 400, url: '#' },
    ],
  },

  // ── DishWashing ──────────────────────────────────────────────────────────────
  {
    canonicalId: 'dishwash-vim-500ml',
    category: 'DishWashing', subCategory: 'Dish Liquid', brand: 'Vim', quantity: '500 ml',
    title: 'Vim Dishwashing Liquid', image: img('1585771724684-38269d6639fd'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 180, maxPrice: 220, savingPct: 18,
    keywords: ['vim', 'dish wash', 'dishwashing', 'liquid', 'utensils'],
    offers: [
      { store: 'Imtiaz', name: 'Vim Dishwash Liquid 500ml', price: 180, url: '#' },
      { store: 'Metro', name: 'Vim Dishwash Liquid 500ml', price: 200, url: '#' },
      { store: 'Al-Fatah', name: 'Vim Dishwash Liquid 500ml', price: 220, url: '#' },
    ],
  },

  // ── Desserts ─────────────────────────────────────────────────────────────────
  {
    canonicalId: 'ice-cream-vanilla-500ml',
    category: 'Desserts', subCategory: 'Ice Cream', brand: 'Walls', quantity: '500 ml',
    title: 'Walls Vanilla Ice Cream', image: img('1570197788417-0e82375c9371'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 290, maxPrice: 340, savingPct: 15,
    keywords: ['ice cream', 'walls', 'vanilla', 'dessert', 'gelato'],
    offers: [
      { store: 'Metro', name: 'Walls Vanilla Ice Cream 500ml', price: 290, url: '#' },
      { store: 'Imtiaz', name: 'Walls Vanilla Ice Cream 500ml', price: 315, url: '#' },
      { store: 'Carrefour', name: 'Walls Vanilla Ice Cream 500ml', price: 340, url: '#' },
    ],
  },
  {
    canonicalId: 'chocolate-cadbury-100g',
    category: 'Desserts', subCategory: 'Chocolate', brand: 'Cadbury', quantity: '100 g',
    title: 'Cadbury Dairy Milk Chocolate', image: img('1549007953-473f7c72b213'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 160, maxPrice: 200, savingPct: 20,
    keywords: ['chocolate', 'cadbury', 'dairy milk', 'dessert'],
    offers: [
      { store: 'Imtiaz', name: 'Cadbury Dairy Milk 100g', price: 160, url: '#' },
      { store: 'Metro', name: 'Cadbury Dairy Milk 100g', price: 180, url: '#' },
      { store: 'Al-Fatah', name: 'Cadbury Dairy Milk 100g', price: 200, url: '#' },
    ],
  },
  {
    canonicalId: 'custard-powder-300g',
    category: 'Desserts', subCategory: 'Baking', brand: 'Brown & Polson', quantity: '300 g',
    title: 'Brown & Polson Custard Powder', image: img('1488900128323-21503983d706'), storeCount: 2,
    cheapestStore: 'Metro', minPrice: 220, maxPrice: 260, savingPct: 15,
    keywords: ['custard', 'powder', 'dessert', 'baking', 'brown polson'],
    offers: [
      { store: 'Metro', name: 'Brown & Polson Custard Powder 300g', price: 220, url: '#' },
      { store: 'Carrefour', name: 'Brown & Polson Custard Powder 300g', price: 260, url: '#' },
    ],
  },

  // ── Fresh Products ───────────────────────────────────────────────────────────
  {
    canonicalId: 'tomato-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Tomatoes', image: img('1546094096-0df4bcabd337'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 60, maxPrice: 90, savingPct: 33,
    keywords: ['tomato', 'tamatar', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Tomatoes 1kg', price: 60, url: '#' },
      { store: 'Metro', name: 'Fresh Tomatoes 1kg', price: 75, url: '#' },
      { store: 'Al-Fatah', name: 'Fresh Tomatoes 1kg', price: 90, url: '#' },
    ],
  },
  {
    canonicalId: 'potato-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Potatoes', image: img('1518977676601-b53f82aba655'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 55, maxPrice: 80, savingPct: 31,
    keywords: ['potato', 'aloo', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Metro', name: 'Fresh Potatoes 1kg', price: 55, url: '#' },
      { store: 'Imtiaz', name: 'Fresh Potatoes 1kg', price: 65, url: '#' },
      { store: 'Carrefour', name: 'Fresh Potatoes 1kg', price: 80, url: '#' },
    ],
  },
  {
    canonicalId: 'onion-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Onions', image: img('1618512496248-a07fe83aa8cb'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 50, maxPrice: 75, savingPct: 33,
    keywords: ['onion', 'pyaz', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Onions 1kg', price: 50, url: '#' },
      { store: 'Metro', name: 'Fresh Onions 1kg', price: 62, url: '#' },
      { store: 'Al-Fatah', name: 'Fresh Onions 1kg', price: 75, url: '#' },
    ],
  },
  {
    canonicalId: 'apple-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Fruits', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Apples', image: img('1568702846914-96b305d2aaeb'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 240, savingPct: 25,
    keywords: ['apple', 'seb', 'fresh', 'fruits', 'phal'],
    offers: [
      { store: 'Metro', name: 'Fresh Apples 1kg', price: 180, url: '#' },
      { store: 'Imtiaz', name: 'Fresh Apples 1kg', price: 210, url: '#' },
      { store: 'Carrefour', name: 'Fresh Apples 1kg', price: 240, url: '#' },
    ],
  },
  {
    canonicalId: 'banana-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Fruits', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Bananas', image: img('1571771894821-ce9b6c11b08e'), storeCount: 3,
    cheapestStore: 'Imtiaz', minPrice: 80, maxPrice: 110, savingPct: 27,
    keywords: ['banana', 'kela', 'fresh', 'fruits', 'phal'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Bananas 1kg', price: 80, url: '#' },
      { store: 'Metro', name: 'Fresh Bananas 1kg', price: 95, url: '#' },
      { store: 'Al-Fatah', name: 'Fresh Bananas 1kg', price: 110, url: '#' },
    ],
  },
  {
    canonicalId: 'chicken-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Meat', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Chicken (Boneless)', image: img('1604503468506-a8da13d82791'), storeCount: 3,
    cheapestStore: 'Metro', minPrice: 650, maxPrice: 780, savingPct: 17,
    keywords: ['chicken', 'murgh', 'boneless', 'meat', 'gosht'],
    offers: [
      { store: 'Metro', name: 'Fresh Chicken Boneless 1kg', price: 650, url: '#' },
      { store: 'Imtiaz', name: 'Fresh Chicken Boneless 1kg', price: 710, url: '#' },
      { store: 'Carrefour', name: 'Fresh Chicken Boneless 1kg', price: 780, url: '#' },
    ],
  },
];

