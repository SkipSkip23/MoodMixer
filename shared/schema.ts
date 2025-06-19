import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User usage tracking
export const userUsage = pgTable("user_usage", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  requestCount: integer("request_count").notNull().default(0),
  lastReset: text("last_reset").notNull(), // ISO date string
  watchedAd: boolean("watched_ad").notNull().default(false),
});

export const insertUserUsageSchema = createInsertSchema(userUsage).omit({
  id: true,
});

export type InsertUserUsage = z.infer<typeof insertUserUsageSchema>;
export type UserUsage = typeof userUsage.$inferSelect;

// Cocktail suggestion schemas
export const cocktailSuggestionSchema = z.object({
  mood: z.string().min(1, "Please select a mood"),
  liquor: z.string().min(1, "Please select a liquor type"),
  uid: z.string().min(1, "User ID required"),
  watchedAd: z.boolean().optional().default(false),
});

export const affiliateLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.enum(['liquor', 'ingredient', 'equipment']),
});

export const cocktailResponseSchema = z.object({
  drinkName: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  garnish: z.string(),
  emoji: z.string(),
  affiliateLinks: z.array(affiliateLinkSchema).optional(),
});

export const limitReachedResponseSchema = z.object({
  limitReached: z.literal(true),
  message: z.string(),
});

export type CocktailSuggestion = z.infer<typeof cocktailSuggestionSchema>;
export type CocktailResponse = z.infer<typeof cocktailResponseSchema>;
export type LimitReachedResponse = z.infer<typeof limitReachedResponseSchema>;
