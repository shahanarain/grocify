/**
 * Normalizes user-facing category and subcategory names from the UI
 * to the canonical product categories and subcategories in the catalog.
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

  // Match subcategory patterns
  if (sub.includes('milk')) {
    subCategories.push('Milk');
    categories.push('Dairy');
  } else if (sub.includes('yogurt') || sub.includes('dahi')) {
    subCategories.push('Yogurt');
    categories.push('Dairy');
  } else if (sub.includes('butter') || sub.includes('margarine')) {
    subCategories.push('Butter');
    categories.push('Dairy');
  } else if (sub.includes('cheese') || sub.includes('cream')) {
    subCategories.push('Cheese');
    categories.push('Dairy');
  } else if (sub.includes('egg') || sub.includes('anda')) {
    subCategories.push('Eggs');
    categories.push('Dairy', 'Breakfast');
  } else if (sub.includes('juice') || sub.includes('syrup') || sub.includes('squash') || sub.includes('smoothie')) {
    subCategories.push('Juice');
    categories.push('Beverages');
  } else if (sub.includes('soda') || sub.includes('soft drink') || sub.includes('cola') || sub.includes('energy') || sub.includes('pepsi')) {
    subCategories.push('Soft Drinks');
    categories.push('Beverages');
  } else if (sub.includes('water') || sub.includes('paani')) {
    subCategories.push('Water');
    categories.push('Beverages');
  } else if (sub.includes('oat') || sub.includes('cereal') || sub.includes('porridge') || sub.includes('cornflake')) {
    subCategories.push('Oats', 'Cereals');
    categories.push('Breakfast');
  } else if (sub.includes('bread') || sub.includes('bun') || sub.includes('dough') || sub.includes('paratha')) {
    subCategories.push('Bread');
    categories.push('Breakfast');
  } else if (sub.includes('jam') || sub.includes('honey') || sub.includes('spread')) {
    subCategories.push('Bread', 'Butter');
    categories.push('Breakfast', 'Dairy');
  } else if (sub.includes('tea') || sub.includes('chai')) {
    subCategories.push('Tea');
    categories.push('Tea and Coffee');
  } else if (sub.includes('coffee')) {
    subCategories.push('Coffee');
    categories.push('Tea and Coffee');
  } else if (sub.includes('chip') || sub.includes('crisp') || sub.includes('snack') || sub.includes('nimco') || sub.includes('popcorn')) {
    subCategories.push('Chips');
    categories.push('Snacks');
  } else if (sub.includes('biscuit') || sub.includes('cookie') || sub.includes('wafer') || sub.includes('cake')) {
    subCategories.push('Biscuits');
    categories.push('Snacks');
  } else if (sub.includes('nut') || sub.includes('peanut') || sub.includes('dry fruit') || sub.includes('date')) {
    subCategories.push('Nuts');
    categories.push('Snacks');
  } else if (sub.includes('chocolate') || sub.includes('candy') || sub.includes('candies') || sub.includes('gum') || sub.includes('jelly') || sub.includes('marshmallow')) {
    subCategories.push('Chocolate');
    categories.push('Desserts', 'Snacks');
  } else if (sub.includes('rice') || sub.includes('chawal') || sub.includes('pulse') || sub.includes('grain') || sub.includes('lentil')) {
    subCategories.push('Rice');
    categories.push('Home Essential', 'Rice and Flour', 'Baking and Cooking');
  } else if (sub.includes('flour') || sub.includes('atta') || sub.includes('meal') || sub.includes('maida')) {
    subCategories.push('Flour');
    categories.push('Home Essential', 'Rice and Flour', 'Baking and Cooking');
  } else if (sub.includes('sugar') || sub.includes('cheeni') || sub.includes('sweetener')) {
    subCategories.push('Sugar');
    categories.push('Home Essential', 'Food Staples', 'Baking and Cooking');
  } else if (sub.includes('salt') || sub.includes('namak') || sub.includes('pepper') || sub.includes('spice')) {
    subCategories.push('Salt');
    categories.push('Home Essential', 'Food Staples', 'Baking and Cooking');
  } else if (sub.includes('oil') || sub.includes('ghee') || sub.includes('tel')) {
    subCategories.push('Cooking Oil');
    categories.push('Home Essential', 'Baking and Cooking');
  } else if (sub.includes('pasta') || sub.includes('spaghetti') || sub.includes('noodle') || sub.includes('macroni')) {
    subCategories.push('Pasta');
    categories.push('Home Essential', 'Baking and Cooking');
  } else if (sub.includes('detergent') || sub.includes('powder') || sub.includes('soap') || sub.includes('wash')) {
    subCategories.push('Detergent');
    categories.push('Laundry', 'Home Essential');
  } else if (sub.includes('softener') || sub.includes('bleach')) {
    subCategories.push('Fabric Softener');
    categories.push('Laundry');
  } else if (sub.includes('dish') || sub.includes('utensil') || sub.includes('sponge') || sub.includes('scrub')) {
    subCategories.push('Dish Liquid');
    categories.push('DishWashing');
  } else if (sub.includes('icecream') || sub.includes('ice cream') || sub.includes('gelato')) {
    subCategories.push('Ice Cream');
    categories.push('Desserts');
  } else if (sub.includes('custard') || sub.includes('baking') || sub.includes('dessert')) {
    subCategories.push('Baking', 'Chocolate');
    categories.push('Desserts');
  } else if (sub.includes('vegetable') || sub.includes('tamatar') || sub.includes('tomato') || sub.includes('potato') || sub.includes('aloo') || sub.includes('onion') || sub.includes('pyaz')) {
    subCategories.push('Vegetables');
    categories.push('Fresh Products');
  } else if (sub.includes('fruit') || sub.includes('apple') || sub.includes('banana') || sub.includes('seb') || sub.includes('kela')) {
    subCategories.push('Fruits');
    categories.push('Fresh Products');
  } else if (sub.includes('chicken') || sub.includes('beef') || sub.includes('mutton') || sub.includes('meat') || sub.includes('gosht')) {
    subCategories.push('Meat');
    categories.push('Fresh Products');
  }

  // Also extract individual meaningful words as keywords
  const words = `${rawCategory || ''} ${rawSubCategory || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with'].includes(w));

  keywords.push(...words);

  // If no specific subcategory matched, add the raw words as subcategory candidates
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

