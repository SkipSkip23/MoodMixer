import { storage } from "../storage";
import type { UserUsage, InsertUserUsage } from "@shared/schema";

const DAILY_LIMIT = 3;

export async function checkUsageLimit(uid: string, watchedAd: boolean = false): Promise<{
  canMakeRequest: boolean;
  limitReached?: boolean;
  message?: string;
}> {
  try {
    let userUsage = await storage.getUserUsage(uid);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // If no usage record exists, create one
    if (!userUsage) {
      const newUsage: InsertUserUsage = {
        uid,
        requestCount: 0,
        lastReset: today,
        watchedAd: false
      };
      userUsage = await storage.createUserUsage(newUsage);
    }
    
    // Check if we need to reset the counter (new day)
    const lastResetDate = userUsage.lastReset.split('T')[0];
    if (lastResetDate !== today) {
      userUsage = await storage.updateUserUsage(uid, {
        requestCount: 0,
        lastReset: today,
        watchedAd: false
      });
    }
    
    // Check if user has reached the limit
    if (userUsage.requestCount >= DAILY_LIMIT) {
      // If user watched an ad, allow one more request
      if (watchedAd && !userUsage.watchedAd) {
        await storage.updateUserUsage(uid, { watchedAd: true });
        return { canMakeRequest: true };
      }
      
      return {
        canMakeRequest: false,
        limitReached: true,
        message: "You've hit your 3-drink limit for today. Watch an ad to unlock more!"
      };
    }
    
    return { canMakeRequest: true };
  } catch (error) {
    console.error("Error checking usage limit:", error);
    // On error, allow the request to avoid blocking users
    return { canMakeRequest: true };
  }
}

export async function incrementUsageCount(uid: string): Promise<void> {
  try {
    const userUsage = await storage.getUserUsage(uid);
    if (userUsage) {
      await storage.updateUserUsage(uid, {
        requestCount: userUsage.requestCount + 1
      });
    }
  } catch (error) {
    console.error("Error incrementing usage count:", error);
  }
}