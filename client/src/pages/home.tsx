import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CocktailSuggestion, CocktailResponse, LimitReachedResponse } from "@shared/schema";
import { adService } from "@/services/ads";
import PremiumOfferModal from "@/components/PremiumOfferModal";

const moods = [
  { id: "happy", name: "Happy", emoji: "😊" },
  { id: "sad", name: "Sad", emoji: "😢" },
  { id: "energetic", name: "Energetic", emoji: "⚡" },
  { id: "relaxed", name: "Relaxed", emoji: "😌" },
  { id: "celebratory", name: "Celebratory", emoji: "🎉" },
  { id: "chill", name: "Chill", emoji: "😎" },
  { id: "adventurous", name: "Adventurous", emoji: "🔥" },
  { id: "professional", name: "Professional", emoji: "💼" },
  { id: "afterdark", name: "After Dark", emoji: "🌙", special: true },
];

const liquors = [
  { id: "vodka", name: "Vodka", emoji: "🍸" },
  { id: "whiskey", name: "Whiskey", emoji: "🥛" },
  { id: "rum", name: "Rum", emoji: "🍹" },
  { id: "gin", name: "Gin", emoji: "🍸" },
  { id: "tequila", name: "Tequila", emoji: "🌵" },
  { id: "brandy", name: "Brandy", emoji: "🍷" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedLiquor, setSelectedLiquor] = useState<string>("");
  const [cocktailResult, setCocktailResult] = useState<CocktailResponse | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [limitMessage, setLimitMessage] = useState<string>("");
  const [availableAdBonus, setAvailableAdBonus] = useState<number>(0);
  const [watchedAd, setWatchedAd] = useState<boolean>(false);
  const [showPremiumOffer, setShowPremiumOffer] = useState<boolean>(false);
  const [showAfterDarkConfirm, setShowAfterDarkConfirm] = useState<boolean>(false);
  const { toast } = useToast();

  // Generate or retrieve user ID and initialize ads
  useEffect(() => {
    let uid = localStorage.getItem("mixly_user_id");
    if (!uid) {
      uid = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mixly_user_id", uid);
    }
    setUserId(uid);

    // Initialize ad service
    adService.initialize().then(() => {
      // Show banner ad after initialization
      adService.showBanner();
    });
  }, []);

  const suggestCocktailMutation = useMutation({
    mutationFn: async (data: CocktailSuggestion) => {
      const res = await apiRequest("POST", "/api/suggest", data);
      return res.json();
    },
    onSuccess: (data: CocktailResponse | LimitReachedResponse) => {
      if ('limitReached' in data) {
        setLimitReached(true);
        setLimitMessage(data.message);
        setAvailableAdBonus(data.availableAdBonus || 0);
        if (data.showPremiumOffer) {
          setShowPremiumOffer(true);
        }
        toast({
          title: "Daily Limit Reached",
          description: data.message,
          variant: "destructive",
        });
      } else {
        setCocktailResult(data);
        setLimitReached(false);
        
        // Show interstitial ad after every 2nd successful request
        const requestCount = parseInt(localStorage.getItem("mixly_request_count") || "0") + 1;
        localStorage.setItem("mixly_request_count", requestCount.toString());
        
        if (requestCount % 2 === 0) {
          adService.showInterstitial();
        }
        
        // Scroll to result
        setTimeout(() => {
          const resultElement = document.getElementById("cocktail-result");
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get cocktail suggestion. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetSuggestion = () => {
    if (!selectedMood || !selectedLiquor) {
      toast({
        title: "Selection Required",
        description: "Please select both a mood and a liquor type.",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not available. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    suggestCocktailMutation.mutate({
      mood: selectedMood,
      liquor: selectedLiquor,
      uid: userId,
      watchedAd: watchedAd,
    });
  };

  const handleWatchAd = async () => {
    try {
      // Initialize ads service
      await adService.initialize();
      
      // Show rewarded ad
      const adWatched = await adService.showRewardedAd();
      
      if (adWatched) {
        setWatchedAd(true);
        setLimitReached(false);
        toast({
          title: "Ad Watched!",
          description: "You earned extra cocktail suggestions for today.",
        });
        
        // Show premium offer after watching rewarded ad
        setTimeout(() => {
          setShowPremiumOffer(true);
        }, 2000);
      } else {
        toast({
          title: "Ad Not Completed",
          description: "Please watch the full ad to unlock more suggestions.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Fallback for web or ad failure
      setWatchedAd(true);
      setLimitReached(false);
      toast({
        title: "Ad Watched!",
        description: "You can now make one more cocktail request today.",
      });
      
      // Show premium offer after watching rewarded ad (fallback)
      setTimeout(() => {
        setShowPremiumOffer(true);
      }, 2000);
    }
  };

  const handleTryAnother = () => {
    setSelectedMood("");
    setSelectedLiquor("");
    setCocktailResult(null);
    setLimitReached(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-warm/20 to-copper/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-amber-warm text-4xl mr-3 animate-float">🍸</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-cream">
              Mixly
            </h1>
          </div>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect cocktail for your mood and taste preferences
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Main Form */}
        <Card className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-amber-warm/20">
          {/* Mood Selection */}
          <div className="mb-12">
            <h2 className="font-display text-3xl font-semibold text-cream mb-6 text-center">
              <span className="text-burgundy mr-3">❤️</span>
              How are you feeling?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant="outline"
                  onClick={() => {
                    if (mood.special) {
                      setShowAfterDarkConfirm(true);
                    } else {
                      setSelectedMood(mood.id);
                    }
                  }}
                  className={`group relative p-4 h-auto rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border ${
                    mood.special 
                      ? selectedMood === mood.id
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/30"
                        : "bg-gradient-to-br from-slate-800 to-slate-700 hover:from-purple-600 hover:to-pink-600 text-purple-200 hover:text-white border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30"
                      : selectedMood === mood.id
                        ? "bg-gradient-to-br from-amber-warm to-gold-deep text-slate-900 border-amber-warm"
                        : "bg-gradient-to-br from-slate-700 to-slate-600 hover:from-amber-warm hover:to-gold-deep text-amber-100 hover:text-slate-900 border-slate-600 hover:border-amber-warm"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <span className="text-sm font-medium">{mood.name}</span>
                    {mood.special && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        21+
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Liquor Selection */}
          <div className="mb-12">
            <h2 className="font-display text-3xl font-semibold text-cream mb-6 text-center">
              <span className="text-copper mr-3">🍷</span>
              Choose your spirit
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {liquors.map((liquor) => (
                <Button
                  key={liquor.id}
                  variant="outline"
                  onClick={() => setSelectedLiquor(liquor.id)}
                  className={`group relative p-6 h-auto rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border ${
                    selectedLiquor === liquor.id
                      ? "bg-gradient-to-br from-copper to-burgundy text-cream border-copper"
                      : "bg-gradient-to-br from-slate-700 to-slate-600 hover:from-copper hover:to-burgundy text-amber-100 hover:text-cream border-slate-600 hover:border-copper"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-slate-600/50 flex items-center justify-center text-2xl">
                      {liquor.emoji}
                    </div>
                    <span className="text-sm font-medium">{liquor.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleGetSuggestion}
              disabled={suggestCocktailMutation.isPending}
              className="group relative px-8 py-4 bg-gradient-to-r from-gold-deep to-amber-warm hover:from-amber-warm hover:to-gold-deep text-blue-900 font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              {suggestCocktailMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Magic...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-3 group-hover:animate-pulse">🍹</span>
                  Mix My Cocktail
                </span>
              )}
            </Button>
          </div>
        </Card>

        {/* Daily Limit Reached Notice */}
        {limitReached && (
          <Card className="mt-8 bg-gradient-to-br from-burgundy/90 to-slate-800 rounded-3xl shadow-2xl p-8 border border-burgundy/30">
            <div className="text-center">
              <div className="text-5xl mb-4">🚫</div>
              <h3 className="font-display text-3xl font-bold text-cream mb-4">
                Daily Limit Reached
              </h3>
              <p className="text-lg text-amber-100 mb-6 max-w-md mx-auto">
                {limitMessage}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {availableAdBonus > 0 && (
                  <Button
                    onClick={handleWatchAd}
                    className="px-6 py-3 bg-gradient-to-r from-amber-warm to-gold-deep text-slate-900 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="mr-2">📺</span>
                    Watch Ad for {availableAdBonus} More
                  </Button>
                )}
                
                <Button
                  onClick={() => setShowPremiumOffer(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">⭐</span>
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Ride Share Section - Always Visible */}
        <Card className="mt-8 bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-warm/20">
          <div className="text-center mb-6">
            <h3 className="font-display text-2xl font-semibold text-cream mb-2">
              <span className="text-amber-warm mr-3">🚗</span>
              Need a Safe Ride Home?
            </h3>
            <p className="text-amber-100">
              Enjoy your cocktail responsibly. Get a ride when you need one.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/deeplink/uber?fallback=true");
                  const data = await res.json();
                  window.open(data.deepLink, "_blank");
                } catch (error) {
                  window.open("https://m.uber.com/ul/", "_blank");
                }
              }}
              variant="outline"
              className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-amber-100 border-slate-600 hover:border-amber-warm/50 rounded-xl"
            >
              <span className="mr-2">🚖</span>
              Get Uber
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const res = await fetch("/api/deeplink/lyft?fallback=true");
                  const data = await res.json();
                  window.open(data.deepLink, "_blank");
                } catch (error) {
                  window.open("https://www.lyft.com/app", "_blank");
                }
              }}
              variant="outline"
              className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-amber-100 border-slate-600 hover:border-amber-warm/50 rounded-xl"
            >
              <span className="mr-2">🚗</span>
              Get Lyft
            </Button>
          </div>
        </Card>

        {/* Cocktail Result */}
        {cocktailResult && (
          <Card id="cocktail-result" className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-amber-warm/30 animate-glow">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{cocktailResult.emoji}</div>
              <h3 className="font-display text-4xl font-bold text-cream mb-4">
                {cocktailResult.drinkName}
              </h3>
              <p className="text-lg text-amber-100 leading-relaxed max-w-2xl mx-auto">
                {cocktailResult.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div className="bg-slate-700/50 rounded-2xl p-6 border border-amber-warm/20">
                <h4 className="font-display text-2xl font-semibold text-copper mb-4 flex items-center">
                  <span className="mr-3">📋</span>
                  Ingredients
                </h4>
                <ul className="space-y-2">
                  {cocktailResult.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center text-amber-100">
                      <span className="text-gold-deep mr-3">✓</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Garnish & Instructions */}
              <div className="bg-slate-700/50 rounded-2xl p-6 border border-amber-warm/20">
                <h4 className="font-display text-2xl font-semibold text-copper mb-4 flex items-center">
                  <span className="mr-3">⭐</span>
                  Garnish & Serving
                </h4>
                <div className="text-amber-100 space-y-3">
                  <p className="flex items-start">
                    <span className="text-gold-deep mr-3 mt-1">🍃</span>
                    <span>{cocktailResult.garnish}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-gold-deep mr-3 mt-1">🥃</span>
                    <span>Serve in appropriate glassware</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-gold-deep mr-3 mt-1">🌡️</span>
                    <span>Serve at optimal temperature</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Affiliate Links Section */}
            {cocktailResult.affiliateLinks && cocktailResult.affiliateLinks.length > 0 && (
              <div className="mt-8">
                <h4 className="font-display text-2xl font-semibold text-copper mb-4 text-center flex items-center justify-center">
                  <span className="mr-3">🛒</span>
                  Get Your Ingredients
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {cocktailResult.affiliateLinks.map((link, index) => (
                    <Button
                      key={index}
                      onClick={() => window.open(link.url, '_blank')}
                      variant="outline"
                      className="p-4 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-amber-100 border-slate-600 hover:border-amber-warm/50 rounded-xl h-auto w-full"
                    >
                      <div className="text-center w-full">
                        <div className="text-sm font-medium mb-1 break-words whitespace-normal leading-tight">{link.name}</div>
                        <div className="text-xs text-amber-100/70 capitalize">{link.type}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 text-center space-x-4">
              <Button
                onClick={handleTryAnother}
                className="px-6 py-3 bg-gradient-to-r from-copper to-burgundy text-cream font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2">🔄</span>
                Try Another
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.share?.({
                    title: cocktailResult.drinkName,
                    text: cocktailResult.description,
                  }).catch(() => {
                    // Fallback to copying to clipboard
                    navigator.clipboard?.writeText(
                      `${cocktailResult.drinkName}\n\n${cocktailResult.description}\n\nIngredients:\n${cocktailResult.ingredients.join('\n')}`
                    );
                    toast({
                      title: "Copied!",
                      description: "Recipe copied to clipboard",
                    });
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-500 text-amber-100 font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-amber-warm/30"
              >
                <span className="mr-2">📤</span>
                Share Recipe
              </Button>
            </div>
          </Card>
        )}
      </main>

      <footer className="mt-20 py-12 text-center text-amber-100/60">
        <div className="container mx-auto px-4">
          <p className="flex items-center justify-center mb-4">
            <span className="text-amber-warm mr-2">🍸</span>
            Crafted with care • Perfect cocktails for every mood
          </p>
          <p className="text-sm">
            Drink responsibly. Must be 21+ to consume alcohol.
          </p>
        </div>
      </footer>

      {/* Premium Offer Modal */}
      <PremiumOfferModal
        isOpen={showPremiumOffer}
        onClose={() => setShowPremiumOffer(false)}
        userId={userId}
      />

      {/* After Dark Confirmation Dialog */}
      <AlertDialog open={showAfterDarkConfirm} onOpenChange={setShowAfterDarkConfirm}>
        <AlertDialogContent className="bg-slate-800 border-purple-500/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cream flex items-center">
              <span className="text-purple-400 mr-3">🌙</span>
              Mixly After Dark
            </AlertDialogTitle>
            <AlertDialogDescription className="text-amber-100">
              You're about to enter our adult-themed cocktail collection featuring provocative and suggestive drink names. 
              This content is intended for mature audiences (21+) only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="bg-slate-600 text-amber-100 hover:bg-slate-500 border-slate-500">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setSelectedMood("afterdark");
                setShowAfterDarkConfirm(false);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              I'm 21+ - Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
