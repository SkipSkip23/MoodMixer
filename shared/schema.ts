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

// Cocktail suggestion schemas
export const cocktailSuggestionSchema = z.object({
  mood: z.string().min(1, "Please select a mood"),
  liquor: z.string().min(1, "Please select a liquor type"),
});

export const cocktailResponseSchema = z.object({
  drinkName: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  garnish: z.string(),
  emoji: z.string(),
});

export type CocktailSuggestion = z.infer<typeof cocktailSuggestionSchema>;
export type CocktailResponse = z.infer<typeof cocktailResponseSchema>;
