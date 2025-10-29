import { Hono } from "hono";
import { cors } from "hono/cors";
import { AnalyzePhotoRequestSchema } from "@/shared/types";

interface ExtendedEnv extends Env {
  // Removed OpenAI dependency
}

const app = new Hono<{ Bindings: ExtendedEnv }>();

app.use("/*", cors());

// Health check endpoint
app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

// Mock recipes data for demo purposes
const mockRecipes = [
  {
    title: "Mediterranean Veggie Bowl",
    description: "A fresh and healthy bowl packed with Mediterranean flavors and colorful vegetables.",
    cooking_time: "25 minutes",
    difficulty: "Easy",
    dietary_tags: ["vegetarian", "healthy", "gluten-free"],
    instructions: [
      "Wash and chop all fresh vegetables into bite-sized pieces",
      "Heat olive oil in a large pan over medium heat",
      "Sauté the vegetables until tender but still crisp",
      "Season with herbs, salt, and pepper to taste",
      "Arrange in a bowl and drizzle with olive oil",
      "Garnish with fresh herbs and serve immediately"
    ]
  },
  {
    title: "Quick Stir-Fry Delight",
    description: "A fast and flavorful stir-fry that makes the most of your fresh ingredients.",
    cooking_time: "15 minutes",
    difficulty: "Easy",
    dietary_tags: ["quick & easy", "healthy"],
    instructions: [
      "Prepare all ingredients by washing and chopping",
      "Heat oil in a wok or large skillet over high heat",
      "Add firmer vegetables first, then softer ones",
      "Stir-fry for 3-5 minutes until vegetables are crisp-tender",
      "Add seasonings and sauce of choice",
      "Serve hot over rice or noodles"
    ]
  },
  {
    title: "Fresh Garden Salad",
    description: "A crisp and refreshing salad showcasing the natural flavors of fresh ingredients.",
    cooking_time: "10 minutes",
    difficulty: "Easy",
    dietary_tags: ["raw", "healthy", "vegan"],
    instructions: [
      "Thoroughly wash all leafy greens and vegetables",
      "Tear or chop greens into bite-sized pieces",
      "Slice or dice other vegetables as desired",
      "Combine all ingredients in a large salad bowl",
      "Prepare a simple vinaigrette with oil, vinegar, and seasonings",
      "Toss with dressing just before serving"
    ]
  }
];

const mockIngredients = [
  "Fresh tomatoes", "Leafy greens", "Bell peppers", "Onions", "Carrots",
  "Cucumbers", "Herbs", "Olive oil", "Garlic", "Lemon"
];

// Analyze photo and generate recipes (mock version)
app.post("/api/analyze-photo", async (c) => {
  try {
    const body = await c.req.json();
    const { image_data, dietary_preference } = AnalyzePhotoRequestSchema.parse(body);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter recipes based on dietary preference if provided
    let filteredRecipes = [...mockRecipes];
    if (dietary_preference) {
      filteredRecipes = mockRecipes.filter(recipe => 
        recipe.dietary_tags.some(tag => 
          tag.toLowerCase().includes(dietary_preference.toLowerCase())
        )
      );
      
      // If no matches, return all recipes
      if (filteredRecipes.length === 0) {
        filteredRecipes = mockRecipes;
      }
    }

    // Get random selection of ingredients
    const selectedIngredients = mockIngredients
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 5); // 5-8 ingredients

    // Store in database
    const db = c.env.DB;
    const timestamp = new Date().toISOString();

    for (const recipe of filteredRecipes) {
      await db
        .prepare(
          `INSERT INTO recipes (
          photo_url, ingredients, recipe_title, recipe_description,
          cooking_time, difficulty, dietary_tags, instructions,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          image_data,
          selectedIngredients.join(", "),
          recipe.title,
          recipe.description,
          recipe.cooking_time,
          recipe.difficulty,
          JSON.stringify(recipe.dietary_tags || []),
          JSON.stringify(recipe.instructions || []),
          timestamp,
          timestamp
        )
        .run();
    }

    return c.json({
      ingredients: selectedIngredients,
      recipes: filteredRecipes,
    });
  } catch (error: any) {
    console.error("Error analyzing photo:", error);
    
    return c.json(
      {
        error: error.message || "Failed to analyze photo. Please try again.",
        error_ar: "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.",
      },
      500
    );
  }
});

// Get recent recipes
app.get("/api/recipes", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db
      .prepare("SELECT * FROM recipes ORDER BY created_at DESC LIMIT 20")
      .all();

    return c.json({ recipes: result.results || [] });
  } catch (error: any) {
    console.error("Error fetching recipes:", error);
    return c.json({ error: "Failed to fetch recipes" }, 500);
  }
});

// Enhanced search recipes with better Arabic/English support
app.get("/api/search-recipes", async (c) => {
  try {
    const db = c.env.DB;
    const query = c.req.query('q');
    
    if (!query || query.trim().length < 1) {
      // Return popular recipes if no query
      const result = await db
        .prepare("SELECT * FROM recipes ORDER BY created_at DESC LIMIT 20")
        .all();
      return c.json({ recipes: result.results || [] });
    }
    const searchTerm = `%${query.toLowerCase()}%`;
    
    // Enhanced search that looks through all relevant fields
    const result = await db
      .prepare(`
        SELECT *, 
               CASE 
                 WHEN LOWER(recipe_title) LIKE ? THEN 10
                 WHEN LOWER(ingredients) LIKE ? THEN 8
                 WHEN LOWER(recipe_description) LIKE ? THEN 6
                 WHEN LOWER(dietary_tags) LIKE ? THEN 4
                 WHEN LOWER(difficulty) LIKE ? THEN 2
                 ELSE 1
               END as relevance_score
        FROM recipes 
        WHERE LOWER(recipe_title) LIKE ? 
           OR LOWER(recipe_description) LIKE ? 
           OR LOWER(ingredients) LIKE ?
           OR LOWER(dietary_tags) LIKE ?
           OR LOWER(difficulty) LIKE ?
           OR LOWER(cooking_time) LIKE ?
        ORDER BY relevance_score DESC, created_at DESC 
        LIMIT 15
      `)
      .bind(
        searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, // for relevance scoring
        searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm // for WHERE clause
      )
      .all();

    return c.json({ recipes: result.results || [] });
  } catch (error: any) {
    console.error("Error searching recipes:", error);
    return c.json({ error: "Failed to search recipes" }, 500);
  }
});

// Add new recipe
app.post("/api/add-recipe", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      title, 
      description, 
      ingredients, 
      instructions, 
      cooking_time, 
      difficulty, 
      dietary_tags, 
      photo_url 
    } = body;

    // Validate required fields
    if (!title || !ingredients || !instructions) {
      return c.json(
        { 
          error: "Missing required fields",
          error_ar: "يرجى ملء جميع الحقول المطلوبة"
        }, 
        400
      );
    }

    const db = c.env.DB;
    const timestamp = new Date().toISOString();

    // Convert arrays to strings for database storage
    const ingredientsStr = Array.isArray(ingredients) ? ingredients.join(", ") : ingredients;
    const instructionsStr = Array.isArray(instructions) ? JSON.stringify(instructions) : instructions;
    const dietaryTagsStr = Array.isArray(dietary_tags) ? JSON.stringify(dietary_tags) : JSON.stringify([]);

    const result = await db
      .prepare(`
        INSERT INTO recipes (
          photo_url, ingredients, recipe_title, recipe_description,
          cooking_time, difficulty, dietary_tags, instructions,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        photo_url || null,
        ingredientsStr,
        title,
        description || null,
        cooking_time || null,
        difficulty || "Easy",
        dietaryTagsStr,
        instructionsStr,
        timestamp,
        timestamp
      )
      .run();

    return c.json({ 
      success: true, 
      recipe_id: result.meta.last_row_id,
      message: "Recipe added successfully",
      message_ar: "تم إضافة الوصفة بنجاح"
    });
  } catch (error: any) {
    console.error("Error adding recipe:", error);
    return c.json(
      {
        error: error.message || "Failed to add recipe",
        error_ar: "فشل في إضافة الوصفة. يرجى المحاولة مرة أخرى.",
      },
      500
    );
  }
});

export default app;
