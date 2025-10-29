import z from "zod";

export const RecipeSchema = z.object({
  id: z.number(),
  photo_url: z.string().nullable(),
  ingredients: z.string(),
  recipe_title: z.string(),
  recipe_description: z.string(),
  cooking_time: z.string(),
  difficulty: z.string(),
  dietary_tags: z.string(),
  instructions: z.string(),
  dish_image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const AnalyzePhotoRequestSchema = z.object({
  image_data: z.string(), // base64 encoded image
  dietary_preference: z.string().optional(),
});

export const GenerateRecipeResponseSchema = z.object({
  ingredients: z.array(z.string()),
  recipes: z.array(z.object({
    title: z.string(),
    description: z.string(),
    cooking_time: z.string(),
    difficulty: z.string(),
    dietary_tags: z.array(z.string()),
    instructions: z.array(z.string()),
  })),
});

export type GenerateRecipeResponse = z.infer<typeof GenerateRecipeResponseSchema>;
