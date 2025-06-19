// Affiliate link generation service for cocktail ingredients
// Future support for Amazon, Instacart, Drizly partnerships

interface AffiliateLink {
  name: string;
  url: string;
  type: 'liquor' | 'ingredient' | 'equipment';
}

// Mock affiliate links structure - ready for partner integration
const affiliatePartners = {
  drizly: {
    baseUrl: "https://drizly.com/search",
    partnerId: "mixly_partner", // Future partner ID
  },
  amazon: {
    baseUrl: "https://amazon.com/s",
    partnerId: "mixly-20", // Future Amazon associate ID
  },
  totalwine: {
    baseUrl: "https://totalwine.com/search/all",
    partnerId: "mixly", // Future partner tracking
  }
};

// Helper function to clean ingredient names by removing quantities
function cleanIngredientName(ingredient: string): string {
  // Remove quantities like "2 oz", "1/2 cup", "3 dashes", "splash of", etc.
  const cleaned = ingredient
    .replace(/^\d+(\.\d+)?(\s)?(oz|ounces?|cup|cups?|tsp|teaspoons?|tbsp|tablespoons?|ml|dash|dashes?|splash|splashes?|drops?)\s+(of\s+)?/i, '')
    .replace(/^(a\s+)?(splash\s+of\s+|dash\s+of\s+|few\s+drops\s+of\s+)/i, '')
    .replace(/^\d+\/\d+\s+(oz|cup|tsp|tbsp)\s+(of\s+)?/i, '')
    .trim();
  
  return cleaned || ingredient; // Return original if cleaning resulted in empty string
}

export function generateAffiliateLinks(ingredients: string[]): AffiliateLink[] {
  const links: AffiliateLink[] = [];
  
  ingredients.forEach(ingredient => {
    const cleanedIngredient = cleanIngredientName(ingredient);
    const lowerIngredient = cleanedIngredient.toLowerCase();
    
    // Extract liquor types for targeted affiliate links
    if (lowerIngredient.includes('vodka') || 
        lowerIngredient.includes('whiskey') || 
        lowerIngredient.includes('whisky') || 
        lowerIngredient.includes('rum') || 
        lowerIngredient.includes('gin') || 
        lowerIngredient.includes('tequila') || 
        lowerIngredient.includes('brandy') ||
        lowerIngredient.includes('bourbon') ||
        lowerIngredient.includes('scotch')) {
      
      // Total Wine link for liquor (primary partner)
      links.push({
        name: `Order ${cleanedIngredient}`,
        url: `${affiliatePartners.totalwine.baseUrl}?text=${encodeURIComponent(cleanedIngredient)}&utm_source=${affiliatePartners.totalwine.partnerId}`,
        type: 'liquor'
      });
    }
    
    // Add Amazon link for bar equipment/accessories
    else if (lowerIngredient.includes('shaker') || 
        lowerIngredient.includes('glass') || 
        lowerIngredient.includes('strainer') ||
        lowerIngredient.includes('jigger') ||
        lowerIngredient.includes('muddler')) {
      
      links.push({
        name: `Buy ${cleanedIngredient}`,
        url: `${affiliatePartners.amazon.baseUrl}?k=${encodeURIComponent(cleanedIngredient)}&tag=${affiliatePartners.amazon.partnerId}`,
        type: 'equipment'
      });
    }
    
    // General ingredient search for mixers, syrups, etc.
    else if (cleanedIngredient.length > 2) { // Avoid very short ingredient names
      links.push({
        name: `Find ${cleanedIngredient}`,
        url: `${affiliatePartners.totalwine.baseUrl}?text=${encodeURIComponent(cleanedIngredient)}&utm_source=${affiliatePartners.totalwine.partnerId}`,
        type: 'ingredient'
      });
    }
  });
  
  // Remove duplicates and limit to top 3 most relevant
  const uniqueLinks = links.filter((link, index, self) => 
    index === self.findIndex(l => l.name === link.name)
  ).slice(0, 3);
  
  return uniqueLinks;
}

// Banner ad configuration for frontend integration
export const adConfig = {
  admob: {
    // Google AdMob configuration for React Native/Cordova apps
    bannerId: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // Future AdMob unit ID
    rewardedId: "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ", // Future rewarded ad unit ID
    testMode: true // Set to false in production
  },
  web: {
    // Web-based ad network configuration
    googleAdsense: {
      publisherId: "ca-pub-XXXXXXXXXXXXXXXX", // Future AdSense publisher ID
      slotId: "YYYYYYYYYY" // Future ad slot ID
    }
  }
};

// Track ad interactions for analytics
export function trackAdInteraction(adType: 'banner' | 'rewarded', userId: string) {
  // Future analytics integration
  console.log(`Ad interaction tracked: ${adType} for user ${userId}`);
  
  // This would integrate with analytics services like:
  // - Google Analytics
  // - Mixpanel  
  // - Facebook Analytics
  // - Custom analytics endpoint
}