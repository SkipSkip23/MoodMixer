import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CocktailSuggestion, CocktailResponse } from "@shared/schema";

const moods = [
  { id: "happy", name: "Happy", emoji: "😊" },
  { id: "sad", name: "Sad", emoji: "😢" },
  { id: "energetic", name: "Energetic", emoji: "⚡" },
  { id: "relaxed", name: "Relaxed", emoji: "😌" },
  { id: "celebratory", name: "Celebratory", emoji: "🎉" },
  { id: "thoughtful", name: "Thoughtful", emoji: "💭" },
  { id: "adventurous", name: "Adventurous", emoji: "🔥" },
  { id: "professional", name: "Professional", emoji: "💼" },
];

const liquors = [
  { id: "vodka", name: "Vodka" },
  { id: "whiskey", name: "Whiskey" },
  { id: "rum", name: "Rum" },
  { id: "gin", name: "Gin" },
  { id: "tequila", name: "Tequila" },
  { id: "brandy", name: "Brandy" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedLiquor, setSelectedLiquor] = useState<string>("");
  const [cocktailResult, setCocktailResult] = useState<CocktailResponse | null>(null);
  const { toast } = useToast();

  const suggestCocktailMutation = useMutation({
    mutationFn: async (data: CocktailSuggestion) => {
      const res = await apiRequest("POST", "/api/suggest-cocktail", data);
      return res.json();
    },
    onSuccess: (data: CocktailResponse) => {
      setCocktailResult(data);
      // Scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById("cocktail-result");
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
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

    suggestCocktailMutation.mutate({
      mood: selectedMood,
      liquor: selectedLiquor,
    });
  };

  const handleTryAnother = () => {
    setSelectedMood("");
    setSelectedLiquor("");
    setCocktailResult(null);
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
              Cocktail Mood
            </h1>
          </div>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect cocktail for your mood, crafted by AI and inspired by your taste
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
                  onClick={() => setSelectedMood(mood.id)}
                  className={`group relative p-4 h-auto rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border ${
                    selectedMood === mood.id
                      ? "bg-gradient-to-br from-amber-warm to-gold-deep text-slate-900 border-amber-warm"
                      : "bg-gradient-to-br from-slate-700 to-slate-600 hover:from-amber-warm hover:to-gold-deep text-amber-100 hover:text-slate-900 border-slate-600 hover:border-amber-warm"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <span className="text-sm font-medium">{mood.name}</span>
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
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-slate-600/50 flex items-center justify-center">
                      🥃
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
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-warm to-gold-deep hover:from-gold-deep hover:to-copper text-slate-900 font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              {suggestCocktailMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Magic...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-3 group-hover:animate-pulse">✨</span>
                  Get My Cocktail
                </span>
              )}
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
            Powered by AI • Crafted with care
          </p>
          <p className="text-sm">
            Drink responsibly. Must be 21+ to consume alcohol.
          </p>
        </div>
      </footer>
    </div>
  );
}
