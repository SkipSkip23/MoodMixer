import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { cocktailSuggestionSchema, type CocktailResponse } from "@shared/schema";
import { getCocktailSuggestion } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cocktail suggestion endpoint
  app.post("/api/suggest-cocktail", async (req, res) => {
    try {
      // Validate request body
      const validatedData = cocktailSuggestionSchema.parse(req.body);
      
      // Get AI suggestion
      const cocktailSuggestion = await getCocktailSuggestion(
        validatedData.mood,
        validatedData.liquor
      );
      
      res.json(cocktailSuggestion);
    } catch (error) {
      console.error("Error getting cocktail suggestion:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request data",
          details: error.errors
        });
      }
      
      res.status(500).json({
        error: "Failed to get cocktail suggestion. Please try again."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
