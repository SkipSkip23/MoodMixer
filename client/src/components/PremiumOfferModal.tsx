import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { adService } from "@/services/ads";

interface PremiumOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function PremiumOfferModal({ isOpen, onClose, userId }: PremiumOfferModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const upgradeMutation = useMutation({
    mutationFn: async (data: { uid: string; paymentMethod: string }) => {
      const response = await apiRequest("POST", "/api/upgrade-premium", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Premium Activated!",
        description: "You now have unlimited cocktail suggestions and no ads!",
      });
      // Hide all ads for premium users
      adService.hideBanner();
      onClose();
      // Refresh the page to update the UI
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleUpgrade = async () => {
    setIsProcessing(true);
    upgradeMutation.mutate({
      uid: userId,
      paymentMethod: 'mock' // Will be replaced with actual Stripe integration
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-amber-50 to-copper/5 border-2 border-amber-400/50">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🍸✨</div>
          <CardTitle className="text-2xl font-bold text-amber-800">
            Upgrade to Premium
          </CardTitle>
          <CardDescription className="text-amber-700">
            Unlock unlimited cocktail suggestions and remove all ads
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-slate-700">Unlimited daily cocktail suggestions</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-slate-700">No ads - clean experience</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-slate-700">Priority support</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-slate-700">Exclusive premium cocktail recipes</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-amber-800">$4.99</div>
            <div className="text-sm text-amber-600">one-time payment</div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing || upgradeMutation.isPending}
              className="w-full bg-gradient-to-r from-amber-500 to-copper hover:from-amber-600 hover:to-copper/80 text-white font-semibold py-3 text-lg"
            >
              {isProcessing || upgradeMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Upgrade Now - $4.99"
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              disabled={isProcessing || upgradeMutation.isPending}
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-xs text-center text-slate-500">
            One-time payment • Cancel anytime • 30-day money-back guarantee
          </div>
        </CardContent>
      </Card>
    </div>
  );
}