import imtiazCategories from './imtiaz-categories.json';

const BASE_CATEGORY_HIERARCHY = [
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
            "MarshMallows"
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

const mergedCategories = new Map<string, { name: string; subCategories: string[] }>(
    BASE_CATEGORY_HIERARCHY.map((category) => [category.name, { ...category, subCategories: [...category.subCategories] }]),
);

for (const category of imtiazCategories as { name: string; subCategories: string[] }[]) {
    const existing = mergedCategories.get(category.name);
    if (!existing) {
        mergedCategories.set(category.name, { name: category.name, subCategories: [...category.subCategories] });
        continue;
    }
    for (const subCategory of category.subCategories) {
        if (!existing.subCategories.includes(subCategory)) existing.subCategories.push(subCategory);
    }
}

export const CATEGORY_HIERARCHY = [...mergedCategories.values()];
