import { storage } from "../storage";
import type { UserUsage, InsertUserUsage } from "@shared/schema";

const DAILY_LIMIT = 3;

export async function checkUsageLimit(uid: string, watchedAd: boolean = false): Promise<{
  canMakeRequest: boolean;
  limitReached?: boolean;
  message?: string;
  showPremiumOffer?: boolean;
  availableAdBonus?: number;
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
        adsWatched: 0,
        isPremium: false,
        premiumExpiry: null,
        showPremiumOffer: false
      };
      userUsage = await storage.createUserUsage(newUsage);
    }
    
    // Check if premium subscription is active
    if (userUsage.isPremium && userUsage.premiumExpiry && new Date() < userUsage.premiumExpiry) {
      return { canMakeRequest: true }; // Premium users have unlimited access
    }
    
    // Check if we need to reset the counter (new day)
    const lastResetDate = userUsage.lastReset.split('T')[0];
    if (lastResetDate !== today) {
      userUsage = await storage.updateUserUsage(uid, {
        requestCount: 0,
        lastReset: today,
        adsWatched: 0
      });
    }
    
    // Calculate effective limit based on ads watched
    // Base: 3 requests
    // First ad: +2 requests (total 5)
    // Second ad: +1 request (total 6)
    let effectiveLimit = DAILY_LIMIT;
    if (userUsage.adsWatched >= 1) effectiveLimit += 2;
    if (userUsage.adsWatched >= 2) effectiveLimit += 1;
    
    // If user just watched an ad, increment the counter and recalculate
    if (watchedAd && userUsage.adsWatched < 2) {
      const newAdsWatched = userUsage.adsWatched + 1;
      await storage.updateUserUsage(uid, { adsWatched: newAdsWatched });
      
      // Recalculate effective limit with new ad count
      effectiveLimit = DAILY_LIMIT;
      if (newAdsWatched >= 1) effectiveLimit += 2;
      if (newAdsWatched >= 2) effectiveLimit += 1;
      
      return { canMakeRequest: true };
    }
    
    // Check if user has reached their current limit
    if (userUsage.requestCount >= effectiveLimit) {
      // Determine what bonus is available
      let availableAdBonus = 0;
      let message = "";
      
      if (userUsage.adsWatched === 0) {
        availableAdBonus = 2;
        message = "You've hit your 3-drink limit for today. Watch an ad to unlock 2 more!";
      } else if (userUsage.adsWatched === 1) {
        availableAdBonus = 1;
        message = "You've used your bonus drinks! Watch another ad to unlock 1 more.";
      } else {
        message = "You've reached your maximum daily limit. Upgrade to Premium for unlimited cocktails!";
      }
      
      return {
        canMakeRequest: false,
        limitReached: true,
        showPremiumOffer: true, // Always show premium option when limit is reached
        availableAdBonus,
        message
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