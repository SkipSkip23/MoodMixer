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

export function generateAffiliateLinks(ingredients: string[]): AffiliateLink[] {
  const links: AffiliateLink[] = [];
  
  ingredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Extract liquor types for targeted affiliate links
    if (lowerIngredient.includes('vodka') || 
        lowerIngredient.includes('whiskey') || 
        lowerIngredient.includes('rum') || 
        lowerIngredient.includes('gin') || 
        lowerIngredient.includes('tequila') || 
        lowerIngredient.includes('brandy')) {
      
      // Drizly link for liquor delivery
      links.push({
        name: `Order ${ingredient} on Drizly`,
        url: `${affiliatePartners.drizly.baseUrl}?q=${encodeURIComponent(ingredient)}&ref=${affiliatePartners.drizly.partnerId}`,
        type: 'liquor'
      });
    }
    
    // Add Amazon link for bar equipment/accessories
    if (lowerIngredient.includes('shaker') || 
        lowerIngredient.includes('glass') || 
        lowerIngredient.includes('strainer')) {
      
      links.push({
        name: `Buy ${ingredient} on Amazon`,
        url: `${affiliatePartners.amazon.baseUrl}?k=${encodeURIComponent(ingredient)}&tag=${affiliatePartners.amazon.partnerId}`,
        type: 'equipment'
      });
    }
    
    // General ingredient search
    if (!lowerIngredient.includes('oz') && !lowerIngredient.includes('splash')) {
      links.push({
        name: `Find ${ingredient} at Total Wine`,
        url: `${affiliatePartners.totalwine.baseUrl}?text=${encodeURIComponent(ingredient)}&utm_source=${affiliatePartners.totalwine.partnerId}`,
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