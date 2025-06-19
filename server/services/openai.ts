import OpenAI from "openai";
import { cocktailResponseSchema, type CocktailResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

const COCKTAIL_PROMPT_TEMPLATE = `
You are a master mixologist with encyclopedic knowledge of cocktails from around the world. Draw from your extensive database of hundreds of cocktail recipes including:

- Classic cocktails (Old Fashioned, Negroni, Manhattan, Sazerac, Aviation, Last Word, Paper Plane, etc.)
- Tiki drinks (Mai Tai, Zombie, Navy Grog, Painkiller, Jungle Bird, etc.)
- Modern craft cocktails (Penicillin, Gold Rush, Paper Plane, Division Bell, etc.)
- International cocktails (Caipirinha, Pisco Sour, Moscow Mule, Dark 'n' Stormy, etc.)
- Seasonal and regional specialties
- Lesser-known gems and bartender favorites
- Creative variations and modern interpretations

IMPORTANT: Never suggest the same cocktail twice. Always explore different recipes, even for the same mood/liquor combination. Consider obscure cocktails, regional variations, and creative modern interpretations.

User Request:
Mood: {{mood}}
Liquor: {{liquor}}

Research your vast cocktail knowledge and select a UNIQUE cocktail that perfectly matches this mood and features the specified liquor. Avoid obvious choices - surprise with lesser-known classics, regional specialties, or creative modern cocktails.

For mood matching:
- Happy: Bright, citrusy, effervescent cocktails
- Sad: Comforting, warming, spirit-forward drinks
- Energetic: Spicy, caffeinated, or stimulating cocktails
- Relaxed: Smooth, mellow, easy-drinking cocktails
- Celebratory: Sparkling, festive, elaborate cocktails
- Chill: Refreshing, cooling, laid-back drinks
- Adventurous: Bold, unusual, complex flavor profiles
- Professional: Sophisticated, classic, refined cocktails
- After Dark: Provocative, sensual, adult-themed cocktails with suggestive names (Sex on the Beach, Sloe Comfortable Screw, Screaming Orgasm, Between the Sheets, Leg Spreader, Slow Comfortable Screw, Redheaded Slut, Slippery Nipple, Buttery Nipple, Blow Job, etc.)

Respond ONLY with JSON in this exact format:
{
  "drinkName": "Exact name of the specific cocktail",
  "description": "A compelling 2-3 sentence description explaining the cocktail's history, flavor profile, and why it perfectly matches this mood",
  "ingredients": ["Precise measurement and ingredient", "Precise measurement and ingredient", "etc"],
  "garnish": "Specific garnish and detailed presentation instructions",
  "emoji": "Single emoji that represents this cocktail"
}

Requirements:
- Draw from real cocktail recipes, not invented combinations
- Use authentic cocktail names and traditional recipes
- Include precise measurements (oz, dashes, splashes)
- Ensure the specified liquor is the primary spirit
- Select from hundreds of possible cocktails - be creative and diverse
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
      temperature: 1.0, // Maximum creativity and randomness for diverse cocktail suggestions
      max_tokens: 600,
      top_p: 0.95, // Add nucleus sampling for additional randomness
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
