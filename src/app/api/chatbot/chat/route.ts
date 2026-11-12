import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-middleware';
import { rateLimit } from '@/lib/rate-limit';
import { matchIngredientsToCatalog, RecipeData } from '@/lib/recipe-matcher';
import OpenAI from 'openai';

// Initialize OpenAI client - will be set when first request comes in
let openai: OpenAI | null = null;

const initializeOpenAI = () => {
    if (!openai && process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('OpenAI client initialized successfully');
    }
};

// POST /api/chatbot/chat - Chat with AI for recipes and grocery queries
export async function POST(request: NextRequest) {
    try {
        const authResult = await verifyToken(request);
        if (authResult.error) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Limit OpenAI-backed calls per user: 15 requests per minute.
        const limit = rateLimit(`chatbot:${authResult.user!.uid}`, 15, 60_000);
        if (!limit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please slow down.' },
                { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
            );
        }

        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Cap message length to bound OpenAI token usage / cost per request.
        if (message.length > 500) {
            return NextResponse.json({ error: 'Message is too long (max 500 characters)' }, { status: 400 });
        }

        // Initialize OpenAI if not already done
        initializeOpenAI();

        // Check if OpenAI is available
        if (!openai) {
            return NextResponse.json({
                error: 'Chatbot service is not available. Please configure OpenAI API key.'
            }, { status: 503 });
        }

        // System prompt supporting both Recipe Generation & Firebase queries
        const systemPrompt = `You are Grocify AI, an expert AI grocery & culinary assistant for the Grocify grocery comparison platform.

Your task is to understand user requests and respond in JSON with one of three formats:

1. RECIPE GENERATION & MEAL PLANNING:
When the user asks for a recipe, meal idea, cooking instructions, or what to make with ingredients (e.g. "give me a chicken biryani recipe for 4", "healthy pasta dinner", "how to cook dal makhani", "breakfast recipe"):
Return JSON:
{
  "type": "recipe",
  "recipe": {
    "title": "Recipe Title",
    "description": "Short appetizing summary (1-2 sentences)",
    "servings": 4,
    "prepTime": "15 mins",
    "cookTime": "25 mins",
    "ingredients": [
      {
        "name": "Full ingredient description (e.g. Chicken breast boneless, Basmati Rice, etc.)",
        "quantity": 500,
        "unit": "g",
        "catalogKeyword": "simple supermarket keyword for matching (e.g. chicken, rice, milk, butter, oil, pasta, onion, garlic, cheese, eggs)"
      }
    ],
    "instructions": [
      "Step 1: Clear, concise instruction...",
      "Step 2: ..."
    ]
  },
  "explanation": "Brief conversational intro to the recipe"
}

CRITICAL RULES FOR RECIPES:
- "catalogKeyword" MUST be a single simple grocery term that supermarket catalogs use (e.g. chicken, milk, butter, oil, rice, pasta, tea, eggs, cheese, flour, yogurt, soap).
- "quantity" MUST be a numeric value (e.g. 500, 2, 0.5) so it can scale with servings.
- "unit" is the measurement (g, kg, ml, cup, tbsp, tsp, piece, cloves).

2. GROCERY SEARCH & FIRESTORE QUERIES:
When user asks to search or browse products/stores directly (e.g. "show breakfast products", "find products under 100", "show Diamond store products", "products with discount"):
Available collections:
- products: { id, name, imageUrl, newPrice, oldPrice, quantity, category, subCategory, discount, supplier, status, createdAt, url }
- stores: { id, name, imageUrl, followers, status }
Available operators: ==, !=, <, <=, >, >=, in, not-in, array-contains

Return JSON:
{
  "type": "query",
  "query": {
    "where": [{"field": "category", "operator": "==", "value": "Breakfast"}],
    "orderBy": [{"field": "newPrice", "direction": "asc"}],
    "limit": 20
  },
  "collection": "products",
  "explanation": "brief explanation of the query"
}

3. GENERAL ADVICE / COOKING TIPS:
For general cooking tips, ingredient substitutes, or storage questions:
Return JSON:
{
  "type": "message",
  "message": "Helpful, concise advice..."
}

Always output valid JSON.`;

        // Generate response using OpenAI
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.4,
            max_tokens: 1200,
            response_format: { type: "json_object" },
        });

        const aiResponse = completion.choices[0]?.message?.content;

        if (!aiResponse) {
            return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
        }

        try {
            const parsed = JSON.parse(aiResponse);

            if (parsed.error) {
                return NextResponse.json({
                    type: 'error',
                    message: parsed.error,
                    query: null,
                });
            }

            // Handle Recipe generation
            if (parsed.type === 'recipe' && parsed.recipe) {
                const recipe = parsed.recipe;
                const matchedIngredients = await matchIngredientsToCatalog(recipe.ingredients || []);

                const estimatedGroceryTotal = matchedIngredients.reduce((sum, item) => {
                    return sum + (item.matchedProduct?.minPrice || 0);
                }, 0);

                const matchedCount = matchedIngredients.filter((i) => i.matchedProduct !== null).length;

                const fullRecipe: RecipeData = {
                    title: recipe.title || 'Custom Recipe',
                    description: recipe.description || '',
                    servings: Number(recipe.servings) || 4,
                    prepTime: recipe.prepTime || '15 mins',
                    cookTime: recipe.cookTime || '25 mins',
                    ingredients: matchedIngredients,
                    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
                    estimatedGroceryTotal,
                    matchedCount,
                };

                return NextResponse.json({
                    type: 'recipe',
                    message: parsed.explanation || `Here is a recipe for ${fullRecipe.title}:`,
                    recipe: fullRecipe,
                });
            }

            // Handle Firebase product query
            if (parsed.type === 'query' && parsed.query) {
                return NextResponse.json({
                    type: 'query',
                    message: `I'll help you find: ${parsed.explanation || 'products'}`,
                    query: parsed.query,
                    collection: parsed.collection || 'products',
                    explanation: parsed.explanation,
                });
            }

            // Handle general text message
            return NextResponse.json({
                type: 'message',
                message: parsed.message || parsed.explanation || aiResponse,
                query: null,
            });

        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return NextResponse.json({
                type: 'message',
                message: aiResponse,
                query: null,
            });
        }

    } catch (error) {
        console.error('Chatbot error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
