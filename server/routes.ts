import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { cocktailSuggestionSchema, premiumUpgradeSchema, type CocktailResponse } from "@shared/schema";
import { getCocktailSuggestion } from "./services/openai";
import { checkUsageLimit, incrementUsageCount } from "./services/usage";
import { generateAffiliateLinks } from "./services/affiliate";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Version endpoint
  app.get("/api/version", (req, res) => {
    res.json({ version: "1.0.0", name: "Mixly API" });
  });

  // Cocktail suggestion endpoint (renamed from suggest-cocktail to match Mixly spec)
  app.post("/api/suggest", async (req, res) => {
    try {
      // Validate request body
      const validatedData = cocktailSuggestionSchema.parse(req.body);
      
      // Check usage limits
      const usageCheck = await checkUsageLimit(validatedData.uid, validatedData.watchedAd);
      
      if (!usageCheck.canMakeRequest) {
        return res.json({
          limitReached: true,
          message: usageCheck.message,
          showPremiumOffer: usageCheck.showPremiumOffer
        });
      }
      
      // Get AI suggestion
      const cocktailSuggestion = await getCocktailSuggestion(
        validatedData.mood,
        validatedData.liquor
      );
      
      // Generate affiliate links for ingredients
      const affiliateLinks = generateAffiliateLinks(cocktailSuggestion.ingredients);
      
      // Increment usage count
      await incrementUsageCount(validatedData.uid);
      
      res.json({
        ...cocktailSuggestion,
        affiliateLinks
      });
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

  // Deep link endpoints for ride sharing
  app.get("/api/deeplink/uber", (req, res) => {
    const fallback = req.query.fallback === 'true';
    
    // Uber deep link format
    const uberDeepLink = "uber://";
    const uberWebLink = "https://m.uber.com/ul/";
    const appStoreLink = "https://apps.apple.com/app/uber/id368677368";
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.ubercab";
    
    res.json({
      deepLink: uberDeepLink,
      webLink: uberWebLink,
      appStore: appStoreLink,
      playStore: playStoreLink,
      fallback: fallback
    });
  });

  app.get("/api/deeplink/lyft", (req, res) => {
    const fallback = req.query.fallback === 'true';
    
    // Lyft deep link format
    const lyftDeepLink = "lyft://";
    const lyftWebLink = "https://www.lyft.com/app";
    const appStoreLink = "https://apps.apple.com/app/lyft/id529379082";
    const playStoreLink = "https://play.google.com/store/apps/details?id=me.lyft.android";
    
    res.json({
      deepLink: lyftDeepLink,
      webLink: lyftWebLink,
      appStore: appStoreLink,
      playStore: playStoreLink,
      fallback: fallback
    });
  });

  // Premium subscription endpoint
  app.post("/api/upgrade-premium", async (req, res) => {
    try {
      const validatedData = premiumUpgradeSchema.parse(req.body);
      const { uid, paymentMethod } = validatedData;

      // For now, we'll simulate a successful payment
      // Later this can be replaced with actual Stripe integration
      if (paymentMethod === 'mock') {
        // Set premium status for 1 year
        const premiumExpiry = new Date();
        premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1);

        await storage.updateUserUsage(uid, {
          isPremium: true,
          premiumExpiry: premiumExpiry,
          showPremiumOffer: false
        });

        res.json({
          success: true,
          message: "Premium subscription activated! Enjoy unlimited cocktail suggestions.",
          premiumExpiry: premiumExpiry.toISOString()
        });
      } else {
        res.status(400).json({
          error: "Stripe integration not yet configured. Please try again later."
        });
      }
    } catch (error) {
      console.error("Premium upgrade error:", error);
      res.status(500).json({
        error: "Failed to process premium upgrade. Please try again."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
