const FAQS = [
  {
    keywords: ['what is grocify', 'about grocify', 'what does grocify do'],
    answer: 'Grocify helps you browse grocery products, compare prices across stores, organize shopping lists, and plan baskets around your shopping needs.',
  },
  {
    keywords: ['compare prices', 'compare products', 'price comparison', 'cheapest price', 'cheaper'],
    answer: 'Open Compare or browse a category to explore grocery products and their prices. Product cards show available prices and stores so you can compare before shopping.',
  },
  {
    keywords: ['shopping list', 'create a list', 'create list', 'add to list', 'my lists', 'remove from list'],
    answer: 'Open Lists and choose Create List, or choose Add to List on a product card. Open a list to review its items and remove anything you no longer need.',
  },
  {
    keywords: ['smart basket', 'basket', 'cheapest store', 'split between stores'],
    answer: 'Smart Basket helps organize products and compare where to buy them. Open Baskets to create a basket, add products, and review the store options and totals.',
  },
  {
    keywords: ['follow a store', 'follow store', 'stores', 'store'],
    answer: 'Open Stores, choose a store, then select Follow. The store page shows its products and current follower count.',
  },
  {
    keywords: ['deals', 'discount', 'discounts', 'offers', 'sale'],
    answer: 'Open Deals from the navigation to browse available grocery deals and see the products included in each one.',
  },
  {
    keywords: ['inventory', 'restock', 'expiry', 'expiring', 'stock'],
    answer: 'Open Inventory to track items at home, update quantities, and review low-stock or upcoming-expiry reminders.',
  },
  {
    keywords: ['find a product', 'search products', 'search for', 'browse products', 'product search'],
    answer: 'Use the product search or browse Categories to find items. You can narrow your choices by category and compare prices on product cards.',
  },
  {
    keywords: ['sign up', 'signup', 'create account', 'log in', 'login', 'sign in', 'account', 'verify email'],
    answer: 'Use Sign Up to create an account or Log In if you already have one. Grocify may ask you to verify your email before continuing.',
  },
  {
    keywords: ['recipe', 'recipes', 'meal idea', 'cooking'],
    answer: 'Recipe generation needs the optional AI service. I can still help with Grocify FAQs and shopping questions without it. Try asking how to compare prices or create a list.',
  },
];

export const CHATBOT_FAQ_PROMPTS = [
  'How do I compare prices?',
  'How do I create a shopping list?',
  'How does Smart Basket work?',
  'How do I follow a store?',
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

export function getFaqAnswer(question: string): string {
  const normalizedQuestion = normalize(question);
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(normalizedQuestion)) {
    return 'Hi! I can help with Grocify FAQs. Ask me about comparing prices, shopping lists, Smart Basket, stores, deals, or inventory.';
  }

  let bestMatch: (typeof FAQS)[number] | undefined;
  let bestScore = 0;

  for (const faq of FAQS) {
    const score = faq.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalize(keyword);
      return normalizedQuestion.includes(normalizedKeyword)
        ? total + normalizedKeyword.length
        : total;
    }, 0);

    if (score > bestScore) {
      bestMatch = faq;
      bestScore = score;
    }
  }

  return bestMatch?.answer ?? 'I can answer questions about Grocify, price comparisons, shopping lists, Smart Basket, stores, deals, and inventory. Try asking one of those, such as “How do I create a shopping list?”';
}
