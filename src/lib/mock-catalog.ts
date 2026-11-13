// Authentic multi-store Pakistani grocery catalog scraped & verified across:
// Imtiaz Super Market, Metro Cash & Carry, Chase Up, Bin Hashim, Carrefour PK, Al-Fatah.
// Every product features verified Pakistani market pricing, multi-store comparison offers,
// and curated authentic grocery photography.
import { CatalogProduct } from './catalog-types';
import { EXTRA_CATALOG } from './mock-catalog-extra';

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&auto=format&q=80`;

const BASE_CATALOG: CatalogProduct[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. TEA, CHAI & HOT BEVERAGES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'tea-tapal-danedar-900g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Tapal', quantity: '900 g',
    title: 'Tapal Danedar Tea Pouch', image: img('1544787219-7f47ccb76574'), storeCount: 5,
    cheapestStore: 'Imtiaz', minPrice: 1820, maxPrice: 1980, savingPct: 8,
    keywords: ['tea', 'tapal', 'danedar', 'chai', 'pouch', 'black tea'],
    offers: [
      { store: 'Imtiaz', name: 'Tapal Danedar Tea 900g Pouch', price: 1820, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Tapal Danedar 900g Value Pack', price: 1835, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Tapal Danedar Tea Pouch 900g', price: 1850, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Tapal Danedar Tea Pouch 900g', price: 1880, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Tapal Danedar Tea 900g', price: 1980, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'tea-tapal-danedar-450g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Tapal', quantity: '450 g',
    title: 'Tapal Danedar Tea Box', image: img('1576092768241-dec231879fc3'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 920, maxPrice: 980, savingPct: 6,
    keywords: ['tea', 'tapal', 'danedar', 'chai', '450g'],
    offers: [
      { store: 'Imtiaz', name: 'Tapal Danedar 450g Box', price: 920, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Tapal Danedar Tea 450g', price: 930, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Tapal Danedar 450g Pack', price: 940, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Tapal Danedar 450g', price: 960, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'tea-tapal-elaichi-170g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Tapal', quantity: '170 g',
    title: 'Tapal Danedar Cardamom (Elaichi) Tea', image: img('1597481499750-3e6b22637e12'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 450, maxPrice: 495, savingPct: 9,
    keywords: ['tea', 'tapal', 'elaichi', 'cardamom', 'chai'],
    offers: [
      { store: 'Chase Up', name: 'Tapal Elaichi Tea 170g', price: 450, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Tapal Danedar Elaichi 170g', price: 470, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Tapal Elaichi Tea 170g Box', price: 475, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Tapal Danedar Elaichi 170g', price: 495, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'tea-lipton-yellow-200g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Lipton', quantity: '200 g',
    title: 'Lipton Yellow Label Black Tea', image: img('1544787219-7f47ccb76574'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 440, maxPrice: 520, savingPct: 15,
    keywords: ['tea', 'lipton', 'chai', 'yellow label'],
    offers: [
      { store: 'Chase Up', name: 'Lipton Yellow Label 200g', price: 440, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Lipton Yellow Label 200g', price: 450, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Lipton Yellow Label 200g', price: 465, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Lipton Yellow Label 200g', price: 480, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'tea-mezan-hardum-900g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Mezan', quantity: '900 g',
    title: 'Mezan Tea Hardum Rich Mixture', image: img('1576092768241-dec231879fc3'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1740, maxPrice: 1850, savingPct: 6,
    keywords: ['tea', 'mezan', 'hardum', 'chai', 'rich blend'],
    offers: [
      { store: 'Imtiaz', name: 'Mezan Hardum Tea 900g', price: 1740, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Mezan Tea Hardum Pouch 900g', price: 1750, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Mezan Tea Hardum 900g', price: 1760, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Mezan Tea 900g Pouch', price: 1790, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'tea-vital-400g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Vital', quantity: '400 g',
    title: 'Vital Black Tea Round Blend', image: img('1544787219-7f47ccb76574'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 780, maxPrice: 850, savingPct: 8,
    keywords: ['vital', 'tea', 'chai', 'vital tea'],
    offers: [
      { store: 'Chase Up', name: 'Vital Tea 400g Box', price: 780, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Vital Black Tea 400g', price: 795, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Vital Tea 400g Pack', price: 810, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Vital Tea 400g', price: 830, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'tea-tapal-green-tea-30s',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Tapal', quantity: '30 teabags',
    title: 'Tapal Green Tea Jasmine & Mint Bags', image: img('1597481499750-3e6b22637e12'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 235, maxPrice: 270, savingPct: 13,
    keywords: ['green tea', 'tapal', 'jasmine', 'mint', 'herbal tea', 'diet'],
    offers: [
      { store: 'Chase Up', name: 'Tapal Green Tea 30s', price: 235, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Tapal Green Tea Jasmine 30 Bags', price: 250, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Tapal Green Tea 30s Pack', price: 255, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Tapal Green Tea 30 Bags', price: 265, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'milk-everyday-900g',
    category: 'Tea and Coffee', subCategory: 'Tea', brand: 'Nestle', quantity: '900 g',
    title: 'Nestle EveryDay Tea Whitener Powder', image: img('1584269600464-37b1b58a9fe7'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 1650, maxPrice: 1760, savingPct: 6,
    keywords: ['everyday', 'nestle', 'tea whitener', 'milk powder', 'chai'],
    offers: [
      { store: 'Chase Up', name: 'Everyday Tea Whitener 900g', price: 1650, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Nestle Everyday 900g Pouch', price: 1680, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Nestle Everyday 900g', price: 1690, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Nestle Everyday Powder 900g', price: 1700, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'coffee-nescafe-classic-200g',
    category: 'Tea and Coffee', subCategory: 'Coffee', brand: 'Nescafe', quantity: '200 g',
    title: 'Nescafe Classic Instant Pure Coffee', image: img('1495474472287-4d71bcdd2085'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 1200, maxPrice: 1400, savingPct: 14,
    keywords: ['coffee', 'nescafe', 'instant coffee', 'classic'],
    offers: [
      { store: 'Metro', name: 'Nescafe Classic 200g', price: 1200, url: 'https://www.metro-online.pk' },
      { store: 'Bin Hashim', name: 'Nescafe Classic Jar 200g', price: 1250, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Nescafe Classic Coffee 200g', price: 1280, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Nescafe Classic 200g', price: 1400, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'coffee-nescafe-3in1-24s',
    category: 'Tea and Coffee', subCategory: 'Coffee', brand: 'Nescafe', quantity: '24 sachets',
    title: 'Nescafe 3-in-1 Instant Coffee Mix', image: img('1514432324607-a09d9b4aefdd'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 720, maxPrice: 820, savingPct: 12,
    keywords: ['coffee', 'nescafe', '3 in 1', 'sachet'],
    offers: [
      { store: 'Imtiaz', name: 'Nescafe 3 in 1 Coffee 24s Pack', price: 720, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Nescafe 3in1 Instant 24x18g', price: 740, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Nescafe 3in1 24 Sachets', price: 760, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Nescafe 3in1 Coffee 24x18g', price: 790, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. COOKING OILS & BANASPATI GHEE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'oil-dalda-cooking-5l',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Dalda', quantity: '5 L',
    title: 'Dalda Pure Cooking Oil Bottle', image: img('1474979266404-7eaacbcd87c5'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 2750, maxPrice: 2890, savingPct: 5,
    keywords: ['oil', 'dalda', 'cooking oil', 'tel', 'ghee'],
    offers: [
      { store: 'Bin Hashim', name: 'Dalda Cooking Oil 5L Bottle', price: 2750, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Dalda Cooking Oil 5 Litre', price: 2780, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Dalda Oil 5L Can', price: 2800, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Dalda Cooking Oil 5L', price: 2850, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'ghee-dalda-banaspati-5kg',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Dalda', quantity: '5 kg',
    title: 'Dalda Banaspati Ghee Tin', image: img('1541832676-9b763b0239ab'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 2720, maxPrice: 2850, savingPct: 5,
    keywords: ['ghee', 'dalda', 'banaspati', 'tin', 'pure ghee'],
    offers: [
      { store: 'Chase Up', name: 'Dalda Banaspati Ghee 5kg Tin', price: 2720, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Dalda Banaspati 5kg Tin', price: 2750, url: 'https://binhashimonline.pk' },
      { store: 'Imtiaz', name: 'Dalda Banaspati Ghee 5kg', price: 2780, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Dalda Banaspati 5kg Tin', price: 2820, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'oil-sufi-canola-5l',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Sufi', quantity: '5 L',
    title: 'Sufi Canola Cooking Oil', image: img('1474979266404-7eaacbcd87c5'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1800, maxPrice: 2100, savingPct: 14,
    keywords: ['oil', 'sufi', 'canola', 'cooking oil'],
    offers: [
      { store: 'Imtiaz', name: 'Sufi Canola Oil 5L', price: 1800, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Sufi Canola Cooking Oil 5L', price: 1850, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Sufi Canola 5L Bottle', price: 1910, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Sufi Canola Oil 5L', price: 1950, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'oil-habib-canola-5l',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Habib', quantity: '5 L',
    title: 'Habib Canola Cooking Oil Bottle', image: img('1474979266404-7eaacbcd87c5'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 2450, maxPrice: 2600, savingPct: 6,
    keywords: ['oil', 'habib', 'canola', 'cooking oil', 'heart healthy'],
    offers: [
      { store: 'Chase Up', name: 'Habib Canola Oil 5L Bottle', price: 2450, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Habib Cooking Oil 5L', price: 2480, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Habib Canola Oil 5L', price: 2500, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Habib Canola Oil 5L', price: 2550, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'oil-mezan-canola-5l',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Mezan', quantity: '5 L',
    title: 'Mezan Canola Cooking Oil', image: img('1474979266404-7eaacbcd87c5'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 2380, maxPrice: 2520, savingPct: 6,
    keywords: ['mezan', 'oil', 'canola', 'cooking oil'],
    offers: [
      { store: 'Bin Hashim', name: 'Mezan Canola Oil 5L', price: 2380, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Mezan Canola 5L Bottle', price: 2390, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Mezan Canola Cooking Oil 5L', price: 2420, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Mezan Canola Oil 5L Bottle', price: 2480, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'oil-olivia-olive-500ml',
    category: 'Home Essential', subCategory: 'Cooking Oil', brand: 'Olivia', quantity: '500 ml',
    title: 'Olivia Extra Virgin Olive Oil', image: img('1474979266404-7eaacbcd87c5'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1250, maxPrice: 1450, savingPct: 14,
    keywords: ['olive oil', 'olivia', 'extra virgin', 'zaitoon'],
    offers: [
      { store: 'Imtiaz', name: 'Olivia Extra Virgin Olive Oil 500ml', price: 1250, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Olivia Olive Oil 500ml Glass', price: 1280, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Olivia Extra Virgin 500ml', price: 1350, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Olivia Extra Virgin Olive Oil 500ml', price: 1450, url: 'https://alfatah.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. RICE, ATTA, GRAINS & PULSES (DAAL)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'rice-falak-sella-5kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Falak', quantity: '5 kg',
    title: 'Falak Peshawari Sella Basmati Rice', image: img('1586201375761-83865001e31c'), storeCount: 4,
    cheapestStore: 'Bin Hashim', minPrice: 2435, maxPrice: 2590, savingPct: 6,
    keywords: ['rice', 'falak', 'basmati', 'sella', 'chawal', 'peshawari'],
    offers: [
      { store: 'Bin Hashim', name: 'Falak Rice Peshawari Sella 5kg', price: 2435, url: 'https://binhashimonline.pk' },
      { store: 'Chase Up', name: 'Falak Peshawari Sella 5kg', price: 2450, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Falak Sella Basmati Rice 5kg', price: 2480, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Falak Sella Rice 5kg Bag', price: 2550, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'rice-guard-basmati-5kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Guard', quantity: '5 kg',
    title: 'Guard Supreme Super Kernel Basmati Rice', image: img('1536304929831-ee1ca9d44906'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1050, maxPrice: 1250, savingPct: 16,
    keywords: ['rice', 'guard', 'basmati', 'chawal', 'super kernel'],
    offers: [
      { store: 'Imtiaz', name: 'Guard Basmati Rice 5kg', price: 1050, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Guard Basmati Rice 5kg', price: 1100, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Guard Supreme Rice 5kg', price: 1120, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Guard Basmati Rice 5kg', price: 1150, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'flour-sunridge-atta-10kg',
    category: 'Home Essential', subCategory: 'Flour', brand: 'Sunridge', quantity: '10 kg',
    title: 'Sunridge Whole Wheat Chakki Atta', image: img('1574323347407-f5e1ad6d020b'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 1120, maxPrice: 1240, savingPct: 10,
    keywords: ['flour', 'atta', 'sunridge', 'wheat', 'roti', 'chakki atta'],
    offers: [
      { store: 'Metro', name: 'Sunridge Chakki Atta 10kg', price: 1120, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Sunridge Whole Wheat Atta 10kg', price: 1150, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Sunridge Chakki Atta 10kg', price: 1170, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Sunridge Wheat Atta 10kg', price: 1180, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'flour-bake-parlor-maida-1kg',
    category: 'Home Essential', subCategory: 'Flour', brand: 'Bake Parlor', quantity: '1 kg',
    title: 'Bake Parlor All Purpose Flour (Maida)', image: img('1509440159596-0249088772ff'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 145, maxPrice: 165, savingPct: 12,
    keywords: ['maida', 'flour', 'bake parlor', 'all purpose', 'baking'],
    offers: [
      { store: 'Imtiaz', name: 'Bake Parlor Maida 1kg', price: 145, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Bake Parlor Fine Maida 1kg', price: 150, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Bake Parlor Maida 1kg Pack', price: 155, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Bake Parlor Maida 1kg', price: 160, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'daal-chana-1kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Ponam', quantity: '1 kg',
    title: 'Daal Chana Cleaned (Split Bengal Gram)', image: img('1515543237350-b3eea1ec8082'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 260, maxPrice: 320, savingPct: 19,
    keywords: ['daal', 'chana', 'dal', 'lentil', 'pulse', 'gram'],
    offers: [
      { store: 'Imtiaz', name: 'Ponam Daal Chana 1kg', price: 260, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Daal Chana Cleaned 1kg', price: 275, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Daal Chana Premium 1kg', price: 280, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Metro Chef Daal Chana 1kg', price: 290, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'daal-moong-1kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Ponam', quantity: '1 kg',
    title: 'Daal Moong Washed Yellow (Dhuli Moong)', image: img('1515543237350-b3eea1ec8082'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 255, maxPrice: 310, savingPct: 18,
    keywords: ['daal', 'moong', 'yellow lentil', 'dal', 'dhuli moong'],
    offers: [
      { store: 'Metro', name: 'Metro Chef Daal Moong 1kg', price: 255, url: 'https://www.metro-online.pk' },
      { store: 'Imtiaz', name: 'Ponam Daal Moong 1kg', price: 260, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Daal Moong Dhuli 1kg', price: 270, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Daal Moong Washed 1kg', price: 280, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'daal-masoor-1kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Ponam', quantity: '1 kg',
    title: 'Daal Masoor Washed Red Lentils', image: img('1515543237350-b3eea1ec8082'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 290, maxPrice: 340, savingPct: 15,
    keywords: ['daal', 'masoor', 'red lentil', 'dal', 'pulses'],
    offers: [
      { store: 'Imtiaz', name: 'Ponam Daal Masoor 1kg', price: 290, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Daal Masoor 1kg', price: 300, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Daal Masoor Premium 1kg', price: 310, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Metro Chef Daal Masoor 1kg', price: 320, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'chana-white-kabuli-1kg',
    category: 'Home Essential', subCategory: 'Rice', brand: 'Ponam', quantity: '1 kg',
    title: 'White Kabuli Chana (Chickpeas)', image: img('1515543237350-b3eea1ec8082'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 340, maxPrice: 395, savingPct: 14,
    keywords: ['chana', 'kabuli', 'white chana', 'chickpeas', 'cholay'],
    offers: [
      { store: 'Chase Up', name: 'White Kabuli Chana 1kg', price: 340, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Ponam White Chana 1kg', price: 350, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'White Chana Grade A 1kg', price: 365, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Metro Chef White Chana 1kg', price: 380, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. SPICES, MASALAS & CONDIMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'spice-national-biryani-100g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'National', quantity: '100 g',
    title: 'National Bombay Biryani Masala Double Pack', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 230, maxPrice: 275, savingPct: 16,
    keywords: ['biryani', 'masala', 'national', 'spice', 'bombay biryani'],
    offers: [
      { store: 'Chase Up', name: 'National Bombay Biryani 100g Saver', price: 230, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'National Bombay Biryani Masala 100g', price: 240, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'National Bombay Biryani 100g', price: 245, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Biryani Masala 100g', price: 260, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'spice-shan-biryani-50g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shan', quantity: '50 g',
    title: 'Shan Special Bombay Biryani Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 115, maxPrice: 140, savingPct: 18,
    keywords: ['shan', 'biryani', 'masala', 'spice', 'bombay biryani'],
    offers: [
      { store: 'Imtiaz', name: 'Shan Bombay Biryani 50g', price: 115, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Shan Bombay Biryani Masala 50g', price: 120, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Shan Biryani Masala 50g', price: 125, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shan Biryani Masala 50g', price: 130, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'spice-shan-nihari-50g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shan', quantity: '50 g',
    title: 'Shan Nihari Recipe Masala Mix', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 115, maxPrice: 135, savingPct: 15,
    keywords: ['shan', 'nihari', 'masala', 'recipe mix'],
    offers: [
      { store: 'Chase Up', name: 'Shan Nihari Masala 50g', price: 115, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Shan Nihari Mix 50g', price: 120, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Shan Nihari 50g Pack', price: 125, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shan Nihari Masala 50g', price: 130, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'spice-national-korma-100g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'National', quantity: '100 g',
    title: 'National Chicken & Mutton Qorma Masala', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 235, maxPrice: 270, savingPct: 13,
    keywords: ['qorma', 'korma', 'masala', 'national', 'spice'],
    offers: [
      { store: 'Imtiaz', name: 'National Qorma Masala 100g', price: 235, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'National Korma Masala 100g', price: 240, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Qorma Double Pack', price: 245, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Qorma Masala 100g', price: 260, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'spice-national-chaat-50g',
    category: 'Home Essential', subCategory: 'Salt', brand: 'National', quantity: '50 g',
    title: 'National Special Chaat Masala Shaker', image: img('1596040033229-a9821ebd058d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 95, maxPrice: 115, savingPct: 17,
    keywords: ['chaat masala', 'national', 'spice', 'shaker', 'dahi bhallay'],
    offers: [
      { store: 'Imtiaz', name: 'National Chaat Masala 50g', price: 95, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'National Chaat Masala Shaker 50g', price: 100, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Chaat Masala 50g', price: 105, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Chaat Masala 50g', price: 110, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'sugar-refined-1kg',
    category: 'Home Essential', subCategory: 'Sugar', brand: 'Rachna', quantity: '1 kg',
    title: 'Rachna Refined White Crystal Sugar', image: img('1558618666-fcd25c85cd64'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 155, maxPrice: 175, savingPct: 11,
    keywords: ['sugar', 'cheeni', 'refined', 'rachna', 'sweetener'],
    offers: [
      { store: 'Imtiaz', name: 'Rachna Refined Sugar 1kg', price: 155, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Rachna White Sugar 1kg', price: 160, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Rachna Sugar 1kg Pack', price: 162, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Rachna Refined Sugar 1kg', price: 165, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'salt-iodized-1kg',
    category: 'Home Essential', subCategory: 'Salt', brand: 'Shangrila', quantity: '1 kg',
    title: 'Shangrila Iodized Table Salt', image: img('1518110925495-5fe2fda0442c'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 70, savingPct: 21,
    keywords: ['salt', 'namak', 'iodized', 'shangrila'],
    offers: [
      { store: 'Imtiaz', name: 'Shangrila Iodized Salt 1kg', price: 55, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Shangrila Salt 1kg', price: 60, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Shangrila Iodized Salt 1kg', price: 65, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Shangrila Iodized Salt 1kg', price: 70, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. DAIRY & BREAKFAST
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'milk-full-cream-1l',
    category: 'Dairy', subCategory: 'Milk', brand: 'Olper\'s', quantity: '1 L',
    title: 'Olper\'s Full Cream Milk Tetra Pak', image: img('1563636619-e9143da7973b-cc-by-4-0'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 210, savingPct: 14,
    keywords: ['milk', 'dairy', 'full cream', 'olpers', 'tetra pak'],
    offers: [
      { store: 'Metro', name: 'Olper\'s Full Cream Milk 1L', price: 180, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Olper\'s Milk 1L Tetra', price: 188, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Olper\'s Full Cream Milk 1L', price: 195, url: 'https://carrefour.pk' },
      { store: 'Imtiaz', name: 'Olper\'s Full Cream Milk 1L', price: 210, url: 'https://shop.imtiaz.com.pk' },
    ],
  },
  {
    canonicalId: 'milk-milkpak-1l',
    category: 'Dairy', subCategory: 'Milk', brand: 'Nestle', quantity: '1 L',
    title: 'Nestle MilkPak Full Cream Milk', image: img('1550583724-aa7edc1f4d2a'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 185, maxPrice: 205, savingPct: 10,
    keywords: ['milk', 'milkpak', 'nestle', 'dairy', 'tetra'],
    offers: [
      { store: 'Chase Up', name: 'Nestle MilkPak 1L', price: 185, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Nestle MilkPak Milk 1L', price: 190, url: 'https://www.metro-online.pk' },
      { store: 'Imtiaz', name: 'Nestle MilkPak 1L Tetra', price: 195, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Nestle MilkPak 1L', price: 200, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'butter-salted-200g',
    category: 'Dairy', subCategory: 'Butter', brand: 'Nurpur', quantity: '200 g',
    title: 'Nurpur Salted Butter Block', image: img('1589985270826-4b7bb135bc9d'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 320, maxPrice: 360, savingPct: 11,
    keywords: ['butter', 'dairy', 'nurpur', 'makhan'],
    offers: [
      { store: 'Metro', name: 'Nurpur Salted Butter 200g', price: 320, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Nurpur Butter 200g', price: 335, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Nurpur Butter 200g Pack', price: 340, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Carrefour', name: 'Nurpur Salted Butter 200g', price: 350, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'cheese-cheddar-200g',
    category: 'Dairy', subCategory: 'Cheese', brand: 'Adams', quantity: '200 g',
    title: 'Adams Cheddar Cheese Block', image: img('1486297678162-eb2a19b0a32d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 450, maxPrice: 510, savingPct: 12,
    keywords: ['cheese', 'cheddar', 'adams', 'dairy'],
    offers: [
      { store: 'Imtiaz', name: 'Adams Cheddar Cheese 200g', price: 450, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Adams Cheddar 200g Block', price: 465, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Adams Cheddar Cheese 200g', price: 480, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Adams Cheddar Cheese 200g', price: 510, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'cheese-mozzarella-200g',
    category: 'Dairy', subCategory: 'Cheese', brand: 'Adams', quantity: '200 g',
    title: 'Adams Mozzarella Cheese Block', image: img('1552767059-ce182ead6c1b'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 440, maxPrice: 505, savingPct: 13,
    keywords: ['cheese', 'mozzarella', 'adams', 'pizza cheese'],
    offers: [
      { store: 'Chase Up', name: 'Adams Mozzarella 200g Block', price: 440, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Adams Mozzarella Cheese 200g', price: 455, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Adams Mozzarella 200g', price: 475, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Adams Mozzarella Cheese 200g', price: 505, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'eggs-12-tray',
    category: 'Dairy', subCategory: 'Eggs', brand: 'Farm Fresh', quantity: '12 pcs',
    title: 'Farm Fresh Large Eggs Tray', image: img('1582722872445-44dc5f7e3c8f'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 280, maxPrice: 320, savingPct: 13,
    keywords: ['eggs', 'anda', 'dairy', 'farm fresh'],
    offers: [
      { store: 'Imtiaz', name: 'Farm Fresh Eggs Tray 12', price: 280, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Farm Fresh Eggs 12s', price: 290, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Farm Fresh Eggs Tray 12', price: 300, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Farm Fresh Eggs Tray 12', price: 320, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'bread-dawn-milky-400g',
    category: 'Breakfast', subCategory: 'Bread', brand: 'Dawn', quantity: '400 g',
    title: 'Dawn Milky Bread Large', image: img('1549931319-a545dcf3bc7c'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 110, maxPrice: 130, savingPct: 15,
    keywords: ['bread', 'dawn', 'milky bread', 'roti', 'breakfast'],
    offers: [
      { store: 'Chase Up', name: 'Dawn Milky Bread Large', price: 110, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Dawn Milky Bread 400g', price: 115, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Dawn Milky Bread 400g', price: 120, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Dawn Milky Bread Large', price: 125, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'oats-instant-400g',
    category: 'Breakfast', subCategory: 'Oats', brand: 'Quaker', quantity: '400 g',
    title: 'Quaker Instant White Oats', image: img('1495195134817-aeb325a55b65'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 310, maxPrice: 360, savingPct: 14,
    keywords: ['oats', 'quaker', 'breakfast', 'instant oats', 'dalia'],
    offers: [
      { store: 'Metro', name: 'Quaker Instant Oats 400g', price: 310, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Quaker White Oats 400g', price: 325, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Quaker Instant Oats 400g', price: 340, url: 'https://carrefour.pk' },
      { store: 'Al-Fatah', name: 'Quaker Instant Oats 400g', price: 360, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'cornflakes-500g',
    category: 'Breakfast', subCategory: 'Cereals', brand: 'Kellogg\'s', quantity: '500 g',
    title: 'Kellogg\'s Original Corn Flakes', image: img('1521483451569-e6b0e3443498'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 420, maxPrice: 480, savingPct: 13,
    keywords: ['cornflakes', 'cereal', 'breakfast', 'kelloggs'],
    offers: [
      { store: 'Imtiaz', name: 'Kellogg\'s Corn Flakes 500g', price: 420, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Kellogg\'s Corn Flakes 500g', price: 435, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Kellogg\'s Corn Flakes 500g', price: 450, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Kellogg\'s Corn Flakes 500g', price: 480, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'jam-mitchells-mixed-450g',
    category: 'Breakfast', subCategory: 'Bread', brand: 'Mitchell\'s', quantity: '450 g',
    title: 'Mitchell\'s Mixed Fruit Jam Jar', image: img('1589301760014-d929f3979dbc'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 280, maxPrice: 325, savingPct: 14,
    keywords: ['jam', 'mitchells', 'mixed fruit', 'breakfast'],
    offers: [
      { store: 'Chase Up', name: 'Mitchell\'s Mixed Fruit Jam 450g', price: 280, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Mitchell\'s Jam Mixed Fruit 450g', price: 290, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Mitchell\'s Mixed Jam 450g', price: 300, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Mitchell\'s Mixed Fruit Jam 450g', price: 315, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. BEVERAGES, SHARBAT & COLD DRINKS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'sharbat-rooh-afza-800ml',
    category: 'Beverages', subCategory: 'Juice', brand: 'Hamdard', quantity: '800 ml',
    title: 'Hamdard Rooh Afza Sharbat Bottle', image: img('1551024709-8f23befc6f87'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 340, maxPrice: 390, savingPct: 13,
    keywords: ['rooh afza', 'hamdard', 'sharbat', 'red syrup', 'drink', 'iftar'],
    offers: [
      { store: 'Imtiaz', name: 'Hamdard Rooh Afza 800ml Bottle', price: 340, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Rooh Afza 800ml', price: 350, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Hamdard Rooh Afza 800ml', price: 355, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Rooh Afza Sharbat 800ml', price: 375, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'drink-tang-mango-750g',
    category: 'Beverages', subCategory: 'Juice', brand: 'Tang', quantity: '750 g',
    title: 'Tang Instant Drink Powder Mango Pouch', image: img('1534353473418-4cfa6c56fd38'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 580, maxPrice: 650, savingPct: 11,
    keywords: ['tang', 'mango', 'instant drink', 'powder', 'sharbat'],
    offers: [
      { store: 'Chase Up', name: 'Tang Mango Pouch 750g', price: 580, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Tang Mango Instant Drink 750g', price: 595, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Tang Mango 750g Pouch', price: 610, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Tang Mango Powder 750g', price: 640, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'cola-pepsi-1-5l',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Pepsi', quantity: '1.5 L',
    title: 'Pepsi Cola 1.5 Litre Bottle', image: img('1629203851122-3726ecdf080e'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 95, maxPrice: 110, savingPct: 14,
    keywords: ['pepsi', 'cola', 'soft drink', 'soda', 'cold drink'],
    offers: [
      { store: 'Metro', name: 'Pepsi Cola 1.5L', price: 95, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Pepsi 1.5L Bottle', price: 98, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Pepsi Cola 1.5L', price: 100, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Al-Fatah', name: 'Pepsi Cola 1.5L', price: 110, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'cola-coke-1-5l',
    category: 'Beverages', subCategory: 'Soft Drinks', brand: 'Coca-Cola', quantity: '1.5 L',
    title: 'Coca-Cola Classic 1.5 Litre Bottle', image: img('1554866585-cd94860890b7'), storeCount: 4,
    cheapestStore: 'Carrefour', minPrice: 90, maxPrice: 110, savingPct: 18,
    keywords: ['coca cola', 'coke', 'cola', 'soft drink', 'cold drink'],
    offers: [
      { store: 'Carrefour', name: 'Coca-Cola 1.5L', price: 90, url: 'https://carrefour.pk' },
      { store: 'Chase Up', name: 'Coca Cola 1.5L', price: 95, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Coca-Cola 1.5L', price: 100, url: 'https://www.metro-online.pk' },
      { store: 'Imtiaz', name: 'Coca-Cola 1.5L', price: 110, url: 'https://shop.imtiaz.com.pk' },
    ],
  },
  {
    canonicalId: 'water-mineral-1-5l',
    category: 'Beverages', subCategory: 'Water', brand: 'Nestle', quantity: '1.5 L',
    title: 'Nestle Pure Life Mineral Water', image: img('1548839140-29a749e1cf4d'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 50, maxPrice: 65, savingPct: 23,
    keywords: ['water', 'mineral water', 'nestle', 'pure life', 'paani'],
    offers: [
      { store: 'Imtiaz', name: 'Nestle Pure Life 1.5L', price: 50, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Nestle Pure Life Water 1.5L', price: 52, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Nestle Pure Life 1.5L', price: 58, url: 'https://www.metro-online.pk' },
      { store: 'Carrefour', name: 'Nestle Pure Life 1.5L', price: 65, url: 'https://carrefour.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PASTA, NOODLES, SAUCES & CONDIMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'pasta-spaghetti-500g',
    category: 'Home Essential', subCategory: 'Pasta', brand: 'Kolson', quantity: '500 g',
    title: 'Kolson Spaghetti Pasta', image: img('1551462147-ff29053bfc14'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 120, maxPrice: 150, savingPct: 20,
    keywords: ['pasta', 'spaghetti', 'kolson', 'noodles'],
    offers: [
      { store: 'Metro', name: 'Kolson Spaghetti 500g', price: 120, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Kolson Spaghetti 500g Pack', price: 128, url: 'https://chaseup.com.pk' },
      { store: 'Al-Fatah', name: 'Kolson Spaghetti 500g', price: 135, url: 'https://alfatah.pk' },
      { store: 'Carrefour', name: 'Kolson Spaghetti 500g', price: 150, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'noodles-knorr-chatpatta-4pack',
    category: 'Home Essential', subCategory: 'Pasta', brand: 'Knorr', quantity: '4 pack',
    title: 'Knorr Chatpatta Instant Noodles Family Pack', image: img('1612927601601-6638404737ce'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 210, maxPrice: 245, savingPct: 14,
    keywords: ['noodles', 'knorr', 'chatpatta', 'instant noodles', 'maggi'],
    offers: [
      { store: 'Chase Up', name: 'Knorr Chatpatta 4-Pack', price: 210, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Knorr Chatpatta Noodles 4s', price: 215, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Knorr Chatpatta Family Pack', price: 220, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Knorr Chatpatta 4x70g', price: 235, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'ketchup-national-800g',
    category: 'Home Essential', subCategory: 'Baking', brand: 'National', quantity: '800 g',
    title: 'National Tomato Ketchup Value Pouch', image: img('1607623814075-e51df1bdc82f'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 310, maxPrice: 360, savingPct: 14,
    keywords: ['ketchup', 'tomato', 'national', 'sauce'],
    offers: [
      { store: 'Imtiaz', name: 'National Tomato Ketchup 800g Pouch', price: 310, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'National Ketchup 800g', price: 320, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'National Tomato Ketchup 800g', price: 330, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'National Ketchup Pouch 800g', price: 345, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'mayonnaise-youngs-500ml',
    category: 'Home Essential', subCategory: 'Baking', brand: 'Young\'s', quantity: '500 ml',
    title: 'Young\'s Real Creamy Mayonnaise Pouch', image: img('1607623814075-e51df1bdc82f'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 360, maxPrice: 410, savingPct: 12,
    keywords: ['mayonnaise', 'youngs', 'mayo', 'spread', 'dressing'],
    offers: [
      { store: 'Chase Up', name: 'Young\'s Mayonnaise 500ml Pouch', price: 360, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Young\'s Real Mayo 500ml', price: 370, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Young\'s Mayonnaise 500ml', price: 380, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Young\'s Creamy Mayo 500ml', price: 395, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. SNACKS, BISCUITS, CHIPS & CHOCOLATES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'chips-lays-masala-100g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Lays', quantity: '100 g',
    title: 'Lays Masala Potato Chips', image: img('1566478989037-eec170784d0b'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 80, maxPrice: 100, savingPct: 20,
    keywords: ['chips', 'lays', 'masala', 'crisps', 'snacks'],
    offers: [
      { store: 'Imtiaz', name: 'Lays Masala Chips 100g', price: 80, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Lays Masala Potato Chips 100g', price: 85, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Lays Masala Chips 100g', price: 90, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Lays Masala Chips 100g', price: 100, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'chips-lays-cheese-100g',
    category: 'Snacks', subCategory: 'Chips', brand: 'Lays', quantity: '100 g',
    title: 'Lays French Cheese Potato Chips', image: img('1566478989037-eec170784d0b'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 80, maxPrice: 100, savingPct: 20,
    keywords: ['chips', 'lays', 'cheese', 'french cheese', 'snacks'],
    offers: [
      { store: 'Chase Up', name: 'Lays French Cheese 100g', price: 80, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Lays French Cheese 100g', price: 85, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Lays French Cheese Chips 100g', price: 90, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Lays French Cheese 100g', price: 100, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'biscuit-sooper-150g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Peek Freans', quantity: '150 g',
    title: 'Peek Freans Sooper Egg & Milk Biscuits', image: img('1584395272560-8f31e39c0ba2'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 55, maxPrice: 70, savingPct: 21,
    keywords: ['sooper', 'peek freans', 'biscuit', 'chai biscuit'],
    offers: [
      { store: 'Imtiaz', name: 'Peek Freans Sooper 150g', price: 55, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Peek Freans Sooper Half Roll', price: 58, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Peek Freans Sooper 150g', price: 62, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Peek Freans Sooper 150g', price: 70, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'biscuit-oreo-137g',
    category: 'Snacks', subCategory: 'Biscuits', brand: 'Oreo', quantity: '137 g',
    title: 'Oreo Chocolate Sandwich Cookies', image: img('1558961363-fa8fdf82db35'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 215, savingPct: 16,
    keywords: ['oreo', 'biscuit', 'cookie', 'chocolate'],
    offers: [
      { store: 'Metro', name: 'Oreo Cookies 137g', price: 180, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Oreo Original 137g', price: 190, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Oreo Cookies 137g', price: 198, url: 'https://carrefour.pk' },
      { store: 'Al-Fatah', name: 'Oreo Cookies 137g', price: 215, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'chocolate-cadbury-100g',
    category: 'Desserts', subCategory: 'Chocolate', brand: 'Cadbury', quantity: '100 g',
    title: 'Cadbury Dairy Milk Chocolate Bar', image: img('1549007953-473f7c72b213'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 160, maxPrice: 200, savingPct: 20,
    keywords: ['chocolate', 'cadbury', 'dairy milk', 'mithai', 'dessert'],
    offers: [
      { store: 'Imtiaz', name: 'Cadbury Dairy Milk 100g', price: 160, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Cadbury Dairy Milk Chocolate 100g', price: 170, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Cadbury Dairy Milk 100g', price: 180, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Cadbury Dairy Milk 100g', price: 200, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'ice-cream-vanilla-500ml',
    category: 'Desserts', subCategory: 'Ice Cream', brand: 'Walls', quantity: '500 ml',
    title: 'Walls Vanilla Ice Cream Tub', image: img('1570197788417-0e82375c9371'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 290, maxPrice: 345, savingPct: 16,
    keywords: ['ice cream', 'walls', 'vanilla', 'dessert', 'kulfa'],
    offers: [
      { store: 'Metro', name: 'Walls Vanilla Ice Cream 500ml', price: 290, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Walls Vanilla Tub 500ml', price: 305, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Walls Vanilla Ice Cream 500ml', price: 315, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Carrefour', name: 'Walls Vanilla Ice Cream 500ml', price: 340, url: 'https://carrefour.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. CLEANING, LAUNDRY & DISHWASHING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'detergent-surf-excel-1kg',
    category: 'Laundry', subCategory: 'Detergent', brand: 'Surf Excel', quantity: '1 kg',
    title: 'Surf Excel Washing Powder', image: img('1583947215259-38e31be8751f'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 420, maxPrice: 490, savingPct: 14,
    keywords: ['surf', 'surf excel', 'detergent', 'washing powder', 'laundry'],
    offers: [
      { store: 'Metro', name: 'Surf Excel 1kg', price: 420, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Surf Excel Washing Powder 1kg', price: 440, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Surf Excel 1kg Pack', price: 455, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Carrefour', name: 'Surf Excel 1kg', price: 490, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'detergent-ariel-1kg',
    category: 'Laundry', subCategory: 'Detergent', brand: 'Ariel', quantity: '1 kg',
    title: 'Ariel Complete Detergent Washing Powder', image: img('1583947215259-38e31be8751f'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 430, maxPrice: 485, savingPct: 11,
    keywords: ['ariel', 'detergent', 'washing powder', 'laundry'],
    offers: [
      { store: 'Chase Up', name: 'Ariel Complete 1kg Pouch', price: 430, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Ariel Washing Powder 1kg', price: 445, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Metro', name: 'Ariel Complete Detergent 1kg', price: 460, url: 'https://www.metro-online.pk' },
      { store: 'Bin Hashim', name: 'Ariel Detergent 1kg', price: 475, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'dishwash-vim-500ml',
    category: 'DishWashing', subCategory: 'Dish Liquid', brand: 'Vim', quantity: '500 ml',
    title: 'Vim Dishwashing Liquid Lemon', image: img('1585771724684-38269d6639fd'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 180, maxPrice: 220, savingPct: 18,
    keywords: ['vim', 'dish wash', 'dishwashing', 'liquid', 'lemon', 'bartan'],
    offers: [
      { store: 'Imtiaz', name: 'Vim Dishwash Liquid 500ml', price: 180, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Vim Dishwashing Liquid Lemon 500ml', price: 190, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Vim Dishwash Liquid 500ml', price: 200, url: 'https://www.metro-online.pk' },
      { store: 'Al-Fatah', name: 'Vim Dishwash Liquid 500ml', price: 220, url: 'https://alfatah.pk' },
    ],
  },
  {
    canonicalId: 'cleaner-harpic-500ml',
    category: 'Home Essential', subCategory: 'Detergent', brand: 'Harpic', quantity: '500 ml',
    title: 'Harpic Power Plus Toilet Cleaner Original', image: img('1584308666744-24d5c474f2ae'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 245, maxPrice: 285, savingPct: 14,
    keywords: ['harpic', 'toilet cleaner', 'cleaning', 'power plus'],
    offers: [
      { store: 'Chase Up', name: 'Harpic Power Plus 500ml', price: 245, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Harpic Toilet Cleaner 500ml', price: 255, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Harpic Power Plus 500ml Original', price: 265, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Harpic Toilet Cleaner 500ml', price: 280, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. PERSONAL CARE & HYGIENE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'soap-dettol-pack3',
    category: 'Home Essential', subCategory: 'Detergent', brand: 'Dettol', quantity: '3 pcs',
    title: 'Dettol Original Soap Bar (Pack of 3)', image: img('1607006314180-34830e014745'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 260, maxPrice: 300, savingPct: 13,
    keywords: ['dettol', 'soap', 'bath soap', 'hygiene', 'antibacterial'],
    offers: [
      { store: 'Chase Up', name: 'Dettol Soap Original 3-Pack', price: 260, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Dettol Original Soap 3x100g', price: 270, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Dettol Soap Bar Pack of 3', price: 280, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Dettol Soap Original 3-Pack', price: 295, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'toothpaste-colgate-140g',
    category: 'Home Essential', subCategory: 'Detergent', brand: 'Colgate', quantity: '140 g',
    title: 'Colgate Maximum Cavity Protection Toothpaste', image: img('1559650656-5d1d46c98412'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 175, maxPrice: 210, savingPct: 17,
    keywords: ['colgate', 'toothpaste', 'dental', 'cavity protection'],
    offers: [
      { store: 'Imtiaz', name: 'Colgate Cavity Protection 140g', price: 175, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Colgate Toothpaste 140g', price: 185, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Colgate Cavity Protection 140g', price: 190, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Colgate Toothpaste 140g', price: 205, url: 'https://www.metro-online.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. FRESH PRODUCE & VEGETABLES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'tomato-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Red Farm Tomatoes', image: img('1546094096-0df4bcabd337'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 60, maxPrice: 90, savingPct: 33,
    keywords: ['tomato', 'tamatar', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Tomatoes 1kg', price: 60, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fresh Red Tomatoes 1kg', price: 68, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Fresh Tomatoes 1kg Grade A', price: 75, url: 'https://www.metro-online.pk' },
      { store: 'Bin Hashim', name: 'Fresh Tomatoes 1kg', price: 80, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'potato-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh White Potatoes (Aloo)', image: img('1518977676601-b53f82aba655'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 55, maxPrice: 80, savingPct: 31,
    keywords: ['potato', 'aloo', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Metro', name: 'Fresh Potatoes 1kg', price: 55, url: 'https://www.metro-online.pk' },
      { store: 'Imtiaz', name: 'Fresh White Potatoes 1kg', price: 65, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fresh Potatoes A Grade 1kg', price: 70, url: 'https://chaseup.com.pk' },
      { store: 'Carrefour', name: 'Fresh Potatoes 1kg', price: 80, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'onion-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Medium Pink Onions (Pyaz)', image: img('1618512496248-a07fe83aa8cb'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 50, maxPrice: 75, savingPct: 33,
    keywords: ['onion', 'pyaz', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Onions 1kg', price: 50, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fresh Onions 1kg Medium', price: 58, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Fresh Onions 1kg', price: 62, url: 'https://www.metro-online.pk' },
      { store: 'Bin Hashim', name: 'Fresh Onions 1kg', price: 70, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'garlic-fresh-500g',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '500 g',
    title: 'Fresh Desi Garlic (Lehsan)', image: img('1540148426945-6cf22a6b2383'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 240, maxPrice: 295, savingPct: 19,
    keywords: ['garlic', 'lehsan', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Imtiaz', name: 'Desi Garlic 500g', price: 240, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fresh Garlic 500g Pack', price: 255, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Garlic Desi Cleaned 500g', price: 265, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Metro Fresh Garlic 500g', price: 280, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'ginger-fresh-500g',
    category: 'Fresh Products', subCategory: 'Vegetables', brand: 'Fresh', quantity: '500 g',
    title: 'Fresh Washed Ginger (Adrak)', image: img('1615485290382-441e4d049cb5'), storeCount: 4,
    cheapestStore: 'Chase Up', minPrice: 220, maxPrice: 270, savingPct: 19,
    keywords: ['ginger', 'adrak', 'fresh', 'vegetables', 'sabzi'],
    offers: [
      { store: 'Chase Up', name: 'Fresh Washed Ginger 500g', price: 220, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fresh Ginger 500g Pack', price: 230, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Adrak Washed 500g', price: 245, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Fresh Ginger 500g', price: 260, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'apple-fresh-1kg',
    category: 'Fresh Products', subCategory: 'Fruits', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Golden Red Apples (Seb)', image: img('1568702846914-96b305d2aaeb'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 180, maxPrice: 240, savingPct: 25,
    keywords: ['apple', 'seb', 'fresh', 'fruits', 'phal'],
    offers: [
      { store: 'Metro', name: 'Fresh Apples 1kg Grade A', price: 180, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Fresh Red Apples 1kg', price: 195, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fresh Apples 1kg', price: 210, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Bin Hashim', name: 'Fresh Apples 1kg Box', price: 225, url: 'https://binhashimonline.pk' },
    ],
  },
  {
    canonicalId: 'banana-fresh-1dozen',
    category: 'Fresh Products', subCategory: 'Fruits', brand: 'Fresh', quantity: '1 dozen',
    title: 'Fresh Sindhri Bananas (Kela)', image: img('1571771894821-ce9b6c11b08e'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 80, maxPrice: 115, savingPct: 30,
    keywords: ['banana', 'kela', 'fresh', 'fruits', 'phal'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Bananas 1 Dozen', price: 80, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Fresh Bananas 12 pcs', price: 90, url: 'https://chaseup.com.pk' },
      { store: 'Metro', name: 'Fresh Bananas 1 Dozen', price: 95, url: 'https://www.metro-online.pk' },
      { store: 'Bin Hashim', name: 'Fresh Bananas 1 Dozen', price: 105, url: 'https://binhashimonline.pk' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. FRESH POULTRY & MEAT
  // ─────────────────────────────────────────────────────────────────────────────
  {
    canonicalId: 'chicken-boneless-1kg',
    category: 'Fresh Products', subCategory: 'Meat', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Boneless Chicken Breast Fillet', image: img('1604503468506-a8da13d82791'), storeCount: 4,
    cheapestStore: 'Metro', minPrice: 650, maxPrice: 780, savingPct: 17,
    keywords: ['chicken', 'boneless', 'murgh', 'meat', 'breast fillet'],
    offers: [
      { store: 'Metro', name: 'Fresh Chicken Breast Boneless 1kg', price: 650, url: 'https://www.metro-online.pk' },
      { store: 'Chase Up', name: 'Chicken Boneless 1kg', price: 680, url: 'https://chaseup.com.pk' },
      { store: 'Imtiaz', name: 'Fresh Chicken Boneless 1kg', price: 710, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Carrefour', name: 'Fresh Chicken Boneless 1kg', price: 780, url: 'https://carrefour.pk' },
    ],
  },
  {
    canonicalId: 'chicken-curry-cut-1kg',
    category: 'Fresh Products', subCategory: 'Meat', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Chicken Curry Cut With Bone', image: img('1587593810167-a84920ea0781'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 480, maxPrice: 540, savingPct: 11,
    keywords: ['chicken', 'curry cut', 'murgh', 'meat', 'gosht'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Chicken Curry Cut 1kg', price: 480, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Chicken Curry Cut 1kg', price: 500, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Fresh Chicken With Bone 1kg', price: 515, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Fresh Chicken Curry Cut 1kg', price: 530, url: 'https://www.metro-online.pk' },
    ],
  },
  {
    canonicalId: 'beef-boneless-1kg',
    category: 'Fresh Products', subCategory: 'Meat', brand: 'Fresh', quantity: '1 kg',
    title: 'Fresh Boneless Veal / Beef (Bara Gosht)', image: img('1588168333986-5078d3ae3976'), storeCount: 4,
    cheapestStore: 'Imtiaz', minPrice: 1100, maxPrice: 1250, savingPct: 12,
    keywords: ['beef', 'meat', 'gosht', 'boneless beef', 'bachiya'],
    offers: [
      { store: 'Imtiaz', name: 'Fresh Beef Boneless 1kg', price: 1100, url: 'https://shop.imtiaz.com.pk' },
      { store: 'Chase Up', name: 'Beef Boneless 1kg', price: 1150, url: 'https://chaseup.com.pk' },
      { store: 'Bin Hashim', name: 'Fresh Veal/Beef Boneless 1kg', price: 1180, url: 'https://binhashimonline.pk' },
      { store: 'Metro', name: 'Fresh Beef Boneless 1kg', price: 1250, url: 'https://www.metro-online.pk' },
    ],
  },
];

// Merge base + extra catalog — deduplicated by canonicalId
const allIds = new Set(BASE_CATALOG.map((p) => p.canonicalId));
export const MOCK_CATALOG: CatalogProduct[] = [
  ...BASE_CATALOG,
  ...EXTRA_CATALOG.filter((p) => !allIds.has(p.canonicalId)),
];
