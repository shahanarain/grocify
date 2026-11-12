'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/Layout';
import Link from 'next/link';

// Full category hierarchy
const CATEGORY_HIERARCHY = [
    {
        name: "Baking and Cooking",
        subCategories: [
            "Cooking Oil",
            "Flour & Meals",
            "Food Color & Essence",
            "Ghee",
            "Home Baking",
            "Mayonnaise,ketchups & Spreads",
            "Noodles and Pasta/Macroni",
            "Noodles, Pasta And Soup",
            "Olive Oil",
            "Pulses,Grains and Lentils",
            "Rice",
            "Salad Dressings",
            "Sauces,olive,vinegar,Pickles And paste",
            "Seasonings",
            "Soups and Crackers",
            "Spices,recipes and Easy Cook",
            "Sugar,Salts And Pepper"
        ]
    },
    {
        name: "Beverages",
        subCategories: [
            "Energy, Soda and Soft Drinks",
            "Flavoring Syrup, Powder and Squash",
            "Juices",
            "Juices And Syrups",
            "Juices, Malts & Smoothies",
            "Squash And Syrups",
            "Water"
        ]
    },
    {
        name: "Breakfast",
        subCategories: [
            "Breads, Buns and Dough",
            "Cheese & Spread",
            "Eggs",
            "Jam, Honey & Spreads",
            "Oatmeals, Porridge & Cereals"
        ]
    },
    {
        name: "Candies And BubbleGum",
        subCategories: [
            "Bubble Gum",
            "Candies And Jellies",
            "MarshMallows",
            "Oil And Ghee"
        ]
    },
    {
        name: "Dairy",
        subCategories: [
            "Butter and Margarine",
            "Cheese And Creams",
            "Flavored Milk",
            "Liquid Milk",
            "Non Dairy Milk",
            "Yogurt"
        ]
    },
    {
        name: "Desserts",
        subCategories: [
            "Cake Mixing, Baking And Add Ones",
            "Cakes, Syrups and Toppings",
            "Icecreams",
            "Jelly and Custard",
            "Traditional"
        ]
    },
    {
        name: "DishWashing",
        subCategories: [
            "Powder,Soap And Liquid",
            "Scrubs and Sponges"
        ]
    },
    {
        name: "Food Staples",
        subCategories: [
            "Branded Spices",
            "Confectionery",
            "Mayonise And Paste",
            "Pulses and Lentils",
            "Salt",
            "Sauces And Ketchups",
            "Sugar",
            "Un Branded Spices"
        ]
    },
    {
        name: "Fresh Products",
        subCategories: [
            "Beef",
            "Chicken",
            "Fruits",
            "Mutton",
            "Vegetables"
        ]
    },
    {
        name: "Frozen Foods",
        subCategories: [
            "Canned,Tin & Packaged Food",
            "Instant, Ready Meals And Snacks",
            "Paratha And Breads"
        ]
    },
    {
        name: "Home Essential",
        subCategories: [
            "Air Freshners and Home Fragrance",
            "Bedsheets",
            "Buckets,Bins,Broom,mops and Brushes",
            "Cell & Battery",
            "Detergent Powder and Soaps",
            "Dish Washing and  Kitchenware",
            "Disposable & Foil",
            "Fabrics Softeners,Stain Remover and Bleach",
            "Food Storage",
            "Hangers and Accessories",
            "Home Decor",
            "Household Cleaners",
            "Mats",
            "Polishes and Shoe care",
            "Repellents,Pest Control & Insecticides",
            "Toilet roll,Towels,Wipes and Tissues",
            "Tools and Solutions"
        ]
    },
    {
        name: "Laundry",
        subCategories: [
            "Buckets and Brushes",
            "Detergent Powder and Soaps",
            "Fabrics Softeners and Bleach",
            "Toilet And Surface"
        ]
    },
    {
        name: "Rice and Flour",
        subCategories: [
            "Flour",
            "Rice"
        ]
    },
    {
        name: "Snacks",
        subCategories: [
            "Biscuit,Cookies,Wafers and cakes",
            "Candies, Mints and Bubblegum",
            "Chips, Crips, Snacks and Nimco",
            "Chocolate & Sweets",
            "Dry Fruits and Dates",
            "Icecreams",
            "Jellies And Marshmallows",
            "Mouth Fresheners",
            "Popcorn",
            "Salsas and Dips"
        ]
    },
    {
        name: "Tea and Coffee",
        subCategories: [
            "Tea Whitener and Sweetener",
            "Tea and Coffee"
        ]
    }
];

// Colors for category cards
const CATEGORY_COLORS = [
    'from-orange-400 to-orange-600',
    'from-blue-400 to-blue-600',
    'from-yellow-400 to-yellow-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
    'from-purple-400 to-purple-600',
    'from-teal-400 to-teal-600',
    'from-amber-400 to-amber-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-lime-400 to-lime-600',
    'from-rose-400 to-rose-600',
    'from-emerald-400 to-emerald-600',
    'from-violet-400 to-violet-600',
    'from-fuchsia-400 to-fuchsia-600',
    'from-sky-400 to-sky-600',
];

export default function CategoriesPage() {
    return (
        <ProtectedRoute>
            <AppLayout>
                <div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Browse products by category
                        </p>
                    </div>

                    {/* Categories List */}
                    <div className="space-y-8">
                        {CATEGORY_HIERARCHY.map((category, categoryIndex) => (
                            <div key={category.name} className="bg-surface rounded-lg shadow-sm overflow-hidden">
                                {/* Category Header */}
                                <div className={`bg-gradient-to-r ${CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length]} px-6 py-4`}>
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        {category.name}
                                    </h2>
                                    <p className="text-white text-opacity-80 text-sm mt-1">
                                        {category.subCategories.length} subcategories
                                    </p>
                                </div>

                                {/* Subcategories Grid */}
                                <div className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {category.subCategories.map((subCategory) => (
                                            <Link
                                                key={subCategory}
                                                href={`/categories/${encodeURIComponent(category.name)}/${encodeURIComponent(subCategory)}`}
                                                className="group block p-4 bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200"
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-700 line-clamp-2">
                                                        {subCategory}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AppLayout>
        </ProtectedRoute>
    );
}
