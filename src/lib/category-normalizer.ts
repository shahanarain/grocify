/**
 * Normalizes user-facing category and subcategory names from the UI
 * to the canonical product categories and subcategories in the catalog.
 * Covers every entry in CATEGORY_HIERARCHY from src/app/categories/page.tsx
 */

interface NormalizedCategoryResult {
  categories: string[];
  subCategories: string[];
  keywords: string[];
}

export function normalizeCategoryParams(
  rawCategory?: string | null,
  rawSubCategory?: string | null
): NormalizedCategoryResult {
  const cat = (rawCategory || '').trim().toLowerCase();
  const sub = (rawSubCategory || '').trim().toLowerCase();

  const subCategories: string[] = [];
  const categories: string[] = [];
  const keywords: string[] = [];

  // ─── DAIRY ───
  if (sub.includes('liquid milk') || sub === 'milk') {
    subCategories.push('Milk');
    categories.push('Dairy');
  } else if (sub.includes('flavored milk') || sub.includes('flavoured milk')) {
    subCategories.push('Milk');
    categories.push('Dairy');
    keywords.push('flavored', 'milk', 'dairy');
  } else if (sub.includes('yogurt') || sub.includes('dahi')) {
    subCategories.push('Yogurt');
    categories.push('Dairy');
  } else if (sub.includes('butter') || sub.includes('margarine')) {
    subCategories.push('Butter');
    categories.push('Dairy');
  } else if (sub.includes('cheese') || sub.includes('cream') || sub.includes('spread')) {
    subCategories.push('Cheese');
    categories.push('Dairy');
  } else if (sub.includes('non dairy') || sub.includes('nondairy')) {
    subCategories.push('Milk');
    categories.push('Dairy');
    keywords.push('milk', 'dairy');
  } else if (sub.includes('egg') || sub.includes('anda')) {
    subCategories.push('Eggs');
    categories.push('Dairy', 'Breakfast');

  // ─── BEVERAGES ───
  } else if (sub.includes('energy') || sub.includes('soda') || sub.includes('soft drink') || sub.includes('cola')) {
    subCategories.push('Soft Drinks');
    categories.push('Beverages');
  } else if (sub.includes('juice') || sub.includes('malt') || sub.includes('smoothie') || sub.includes('juices')) {
    subCategories.push('Juice');
    categories.push('Beverages');
  } else if (sub.includes('squash') || sub.includes('syrup') || sub.includes('flavoring') || sub.includes('powder')) {
    subCategories.push('Juice');
    categories.push('Beverages');
    keywords.push('squash', 'syrup', 'sharbat', 'rooh afza');
  } else if (sub.includes('water') || sub.includes('paani')) {
    subCategories.push('Water');
    categories.push('Beverages');

  // ─── BREAKFAST ───
  } else if (sub.includes('oat') || sub.includes('porridge') || sub.includes('cereal') || sub.includes('cornflake')) {
    subCategories.push('Oats', 'Cereals');
    categories.push('Breakfast');
  } else if (sub.includes('bread') || sub.includes('bun') || sub.includes('dough')) {
    subCategories.push('Bread');
    categories.push('Breakfast');
  } else if (sub.includes('jam') || sub.includes('honey') || (sub.includes('spread') && !sub.includes('cheese'))) {
    subCategories.push('Bread', 'Butter');
    categories.push('Breakfast', 'Dairy');
    keywords.push('jam', 'honey', 'spread');

  // ─── TEA & COFFEE ───
  } else if (sub.includes('tea whitener') || sub.includes('sweetener') || sub.includes('whitener')) {
    subCategories.push('Tea', 'Milk');
    categories.push('Tea and Coffee', 'Dairy');
    keywords.push('tea', 'whitener', 'sweetener');
  } else if (sub.includes('tea') || sub.includes('chai')) {
    subCategories.push('Tea');
    categories.push('Tea and Coffee');
  } else if (sub.includes('coffee')) {
    subCategories.push('Coffee');
    categories.push('Tea and Coffee');

  // ─── SNACKS ───
  } else if (sub.includes('chip') || sub.includes('crisp') || sub.includes('nimco') || sub.includes('popcorn') || sub.includes('snack')) {
    subCategories.push('Chips');
    categories.push('Snacks');
  } else if (sub.includes('biscuit') || sub.includes('cookie') || sub.includes('wafer')) {
    subCategories.push('Biscuits');
    categories.push('Snacks');
  } else if (sub.includes('cake') && !sub.includes('baking') && !sub.includes('mix')) {
    subCategories.push('Biscuits');
    categories.push('Snacks');
  } else if (sub.includes('nut') || sub.includes('peanut') || sub.includes('dry fruit') || sub.includes('date')) {
    subCategories.push('Nuts');
    categories.push('Snacks');
  } else if (sub.includes('chocolate') || sub.includes('sweet') || sub.includes('sweets')) {
    subCategories.push('Chocolate');
    categories.push('Desserts', 'Snacks');
  } else if (sub.includes('jellie') || sub.includes('marshmallow')) {
    subCategories.push('Chocolate', 'Jelly and Custard');
    categories.push('Snacks', 'Desserts', 'Candies And BubbleGum');
  } else if (sub.includes('mouth freshener') || sub.includes('mint')) {
    subCategories.push('Chips');
    categories.push('Snacks');
    keywords.push('mint', 'polo', 'mouth freshener');
  } else if (sub.includes('salsa') || sub.includes('dip')) {
    subCategories.push('Chips');
    categories.push('Snacks');
    keywords.push('dip', 'salsa');
  } else if (sub.includes('icecream') || sub.includes('ice cream') || sub.includes('gelato')) {
    subCategories.push('Ice Cream');
    categories.push('Desserts', 'Snacks');

  // ─── DESSERTS ───
  } else if (sub.includes('custard') || sub.includes('jelly') || sub.includes('jello')) {
    subCategories.push('Jelly and Custard');
    categories.push('Desserts');
    keywords.push('rafhan', 'custard', 'jelly', 'national');
  } else if (sub.includes('cake mixing') || sub.includes('baking') || sub.includes('add one')) {
    subCategories.push('Baking', 'Chocolate');
    categories.push('Desserts', 'Home Essential');
    keywords.push('cake', 'mix', 'rafhan', 'baking');
  } else if (sub.includes('cake') && (sub.includes('syrup') || sub.includes('topping'))) {
    subCategories.push('Baking', 'Chocolate');
    categories.push('Desserts');
  } else if (sub.includes('traditional')) {
    subCategories.push('Jelly and Custard', 'Chocolate');
    categories.push('Desserts');
    keywords.push('halwa', 'kheer', 'dessert');

  // ─── BAKING & COOKING ───
  } else if (sub.includes('cooking oil') || sub.includes('olive oil')) {
    subCategories.push('Cooking Oil');
    categories.push('Home Essential', 'Baking and Cooking');
  } else if (sub.includes('ghee') || (sub.includes('oil') && sub.includes('ghee'))) {
    subCategories.push('Cooking Oil');
    categories.push('Home Essential', 'Baking and Cooking');
    keywords.push('ghee', 'dalda');
  } else if (sub.includes('flour') || sub.includes('atta') || sub.includes('maida') || sub.includes('meal')) {
    subCategories.push('Flour');
    categories.push('Home Essential', 'Rice and Flour', 'Baking and Cooking');
  } else if (sub.includes('rice') || sub.includes('chawal')) {
    subCategories.push('Rice');
    categories.push('Home Essential', 'Rice and Flour', 'Baking and Cooking');
  } else if (sub.includes('pulse') || sub.includes('grain') || sub.includes('lentil') || sub.includes('dal')) {
    subCategories.push('Rice');
    categories.push('Baking and Cooking', 'Food Staples');
    keywords.push('dal', 'lentil', 'pulse', 'chana', 'masoor', 'moong');
  } else if (sub.includes('sugar') || sub.includes('cheeni') || sub.includes('sweetener')) {
    subCategories.push('Sugar');
    categories.push('Home Essential', 'Food Staples', 'Baking and Cooking');
  } else if (sub.includes('salt') || sub.includes('namak') || sub.includes('pepper')) {
    subCategories.push('Salt');
    categories.push('Home Essential', 'Food Staples', 'Baking and Cooking');
  } else if (sub.includes('spice') || sub.includes('masala') || sub.includes('recipe') || sub.includes('easy cook') || sub.includes('seasoning')) {
    subCategories.push('Salt');
    categories.push('Home Essential', 'Food Staples');
    keywords.push('shan', 'national', 'masala', 'spice', 'biryani', 'karahi');
  } else if (sub.includes('pasta') || sub.includes('spaghetti') || sub.includes('noodle') || sub.includes('macaroni') || sub.includes('macroni') || sub.includes('soup')) {
    subCategories.push('Pasta');
    categories.push('Home Essential', 'Baking and Cooking');
  } else if (sub.includes('sauce') || sub.includes('ketchup') || sub.includes('pickle') || sub.includes('achar') || sub.includes('vinegar') || sub.includes('paste') || sub.includes('olive')) {
    subCategories.push('Salt', 'Baking');
    categories.push('Food Staples', 'Baking and Cooking', 'Home Essential');
    keywords.push('ketchup', 'sauce', 'national', 'shangrila', 'pickle', 'achar');
  } else if (sub.includes('mayonnaise') || sub.includes('mayo') || sub.includes('salad dressing')) {
    subCategories.push('Baking');
    categories.push('Home Essential', 'Baking and Cooking', 'Food Staples');
    keywords.push('mayonnaise', "young's", 'mayo');
  } else if (sub.includes('food color') || sub.includes('essence') || sub.includes('home baking')) {
    subCategories.push('Baking');
    categories.push('Desserts', 'Baking and Cooking');
    keywords.push('baking', 'cake', 'color', 'essence');

  // ─── FOOD STAPLES ───
  } else if (sub.includes('branded spice') || sub.includes('unbranded spice')) {
    subCategories.push('Salt');
    categories.push('Food Staples', 'Home Essential');
    keywords.push('shan', 'national', 'masala', 'spice');
  } else if (sub.includes('confectionery')) {
    subCategories.push('Chocolate', 'Biscuits');
    categories.push('Food Staples', 'Snacks', 'Desserts');
  } else if (sub.includes('mayonise') || sub.includes('paste') && cat.includes('food')) {
    subCategories.push('Baking');
    categories.push('Food Staples');
    keywords.push('mayo', 'paste', 'sauce');

  // ─── LAUNDRY ───
  } else if (sub.includes('detergent') || sub.includes('washing powder') || sub.includes('washing soap')) {
    subCategories.push('Detergent');
    categories.push('Laundry', 'Home Essential');
  } else if (sub.includes('fabric') || sub.includes('softener') || sub.includes('bleach')) {
    subCategories.push('Fabric Softener');
    categories.push('Laundry');
  } else if (sub.includes('bucket') || sub.includes('brush') && cat.includes('laundry')) {
    subCategories.push('Detergent');
    categories.push('Laundry');
    keywords.push('bucket', 'brush', 'laundry');
  } else if (sub.includes('toilet') && (sub.includes('surface') || cat.includes('laundry'))) {
    subCategories.push('Household Cleaners', 'Dish Liquid');
    categories.push('Home Essential', 'DishWashing');
    keywords.push('toilet', 'surface', 'harpic');

  // ─── DISHWASHING ───
  } else if (sub.includes('dish') || sub.includes('utensil') || sub.includes('liquid') || sub.includes('powder') && cat.includes('dish')) {
    subCategories.push('Dish Liquid');
    categories.push('DishWashing', 'Home Essential');
  } else if (sub.includes('scrub') || sub.includes('sponge')) {
    subCategories.push('Dish Liquid');
    categories.push('DishWashing');
    keywords.push('scotch brite', 'sponge', 'scrub');

  // ─── HOME ESSENTIAL ───
  } else if (sub.includes('air freshner') || sub.includes('fragrance') || sub.includes('freshener')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
    keywords.push('freshener', 'air', 'mortein');
  } else if (sub.includes('insecticide') || sub.includes('repellent') || sub.includes('pest')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
    keywords.push('mortein', 'insect', 'spray', 'pest');
  } else if (sub.includes('tissue') || sub.includes('towel') || sub.includes('wipe') || sub.includes('toilet roll')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
    keywords.push('tissue', 'rose petal', 'towel');
  } else if (sub.includes('household cleaner') || sub.includes('surface cleaner')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
    keywords.push('harpic', 'cleaner', 'surface');
  } else if (sub.includes('polish') || sub.includes('shoe')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
  } else if (sub.includes('disposable') || sub.includes('foil') || sub.includes('food storage')) {
    subCategories.push('Household Cleaners');
    categories.push('Home Essential');
  } else if (sub.includes('detergent powder') && cat.includes('home')) {
    subCategories.push('Detergent');
    categories.push('Home Essential', 'Laundry');

  // ─── CANDIES & BUBBLE GUM ───
  } else if (sub.includes('bubble gum') || sub.includes('bubblegum')) {
    subCategories.push('Bubble Gum');
    categories.push('Candies And BubbleGum', 'Snacks');
    keywords.push('chiclets', 'gum', 'bubble gum');
  } else if (sub.includes('candies') || sub.includes('jelly') || sub.includes('jellie') || sub.includes('toffee')) {
    subCategories.push('Candies And Jellies');
    categories.push('Candies And BubbleGum', 'Snacks');
    keywords.push('candy', 'toffee', 'polo', 'fruittella');
  } else if (sub.includes('marshmallow')) {
    subCategories.push('Chocolate');
    categories.push('Candies And BubbleGum', 'Snacks');

  // ─── FROZEN FOODS ───
  } else if (sub.includes('paratha') || (sub.includes('bread') && cat.includes('frozen'))) {
    subCategories.push('Bread');
    categories.push('Frozen Foods', 'Breakfast');
    keywords.push('paratha', 'dawn', 'frozen', 'bread');
  } else if (sub.includes('instant') || sub.includes('ready meal') || sub.includes('snack') && cat.includes('frozen')) {
    subCategories.push('Meat', 'Pasta');
    categories.push('Frozen Foods');
    keywords.push("k&n's", 'nuggets', 'strips', 'frozen', 'instant');
  } else if (sub.includes('canned') || sub.includes('tin') || sub.includes('packaged')) {
    subCategories.push('Pasta', 'Baking');
    categories.push('Frozen Foods', 'Home Essential');
    keywords.push('canned', 'tin', 'packaged');

  // ─── FRESH PRODUCTS ───
  } else if (sub.includes('vegetable') || sub.includes('tamatar') || sub.includes('aloo') || sub.includes('pyaz') || sub.includes('sabzi')) {
    subCategories.push('Vegetables');
    categories.push('Fresh Products');
  } else if (sub.includes('fruit') || sub.includes('apple') || sub.includes('banana') || sub.includes('mango') || sub.includes('aam')) {
    subCategories.push('Fruits');
    categories.push('Fresh Products');
  } else if (sub.includes('chicken') || sub.includes('beef') || sub.includes('mutton') || sub.includes('meat') || sub.includes('gosht') || sub.includes('lamb')) {
    subCategories.push('Meat');
    categories.push('Fresh Products');
  }

  // ─── Extract meaningful words as keyword fallback ───
  const words = `${rawCategory || ''} ${rawSubCategory || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with'].includes(w));

  keywords.push(...words);

  // If no match, use raw values as fallback
  if (subCategories.length === 0 && rawSubCategory) {
    subCategories.push(rawSubCategory);
  }
  if (categories.length === 0 && rawCategory && rawCategory !== 'all') {
    categories.push(rawCategory);
  }

  return {
    categories: [...new Set(categories)],
    subCategories: [...new Set(subCategories)],
    keywords: [...new Set(keywords)],
  };
}
