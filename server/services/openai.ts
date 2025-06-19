import OpenAI from "openai";
import { cocktailResponseSchema, type CocktailResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

const COCKTAIL_PROMPT_TEMPLATE = `
You are an expert bartender and cocktail specialist. Suggest a cocktail based on the user's mood and preferred liquor type.

Mood: {{mood}}
Liquor: {{liquor}}

Please provide a thoughtful cocktail recommendation that complements the specified mood. Consider flavor profiles, complexity, and the emotional/psychological effects of different ingredients.

Respond ONLY with JSON in this exact format (no additional text):
{
  "drinkName": "Name of the cocktail",
  "description": "A compelling 2-3 sentence description of the cocktail and why it fits the mood",
  "ingredients": ["Ingredient 1 with measurement", "Ingredient 2 with measurement", "etc"],
  "garnish": "Description of garnish and presentation",
  "emoji": "Single emoji that represents this cocktail"
}

Make sure the cocktail is:
- Realistic and achievable with common bar ingredients
- Appropriately matched to the mood (energetic = caffeinated/stimulating, relaxed = smooth/mellow, etc.)
- Features the specified liquor as the primary spirit
- Includes proper measurements for all ingredients
- Has an appealing and relevant name
`;

export async function getCocktailSuggestion(mood: string, liquor: string): Promise<CocktailResponse> {
  try {
    const prompt = COCKTAIL_PROMPT_TEMPLATE
      .replace('{{mood}}', mood)
      .replace('{{liquor}}', liquor);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0].message?.content;
    if (!assistantMessage) {
      throw new Error("No response from OpenAI");
    }

    const parsedResponse = JSON.parse(assistantMessage);
    
    // Validate the response matches our expected schema
    const validatedResponse = cocktailResponseSchema.parse(parsedResponse);
    
    return validatedResponse;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate cocktail suggestion");
  }
}
