import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// AdMob configuration - replace with your actual Ad Unit IDs
const AD_CONFIG = {
  // Test IDs - replace with real ones from Google AdMob
  banner: {
    android: 'ca-app-pub-9239950445744298/1924174303', // Your real Android banner ID from AdMob
    ios: 'ca-app-pub-9239950445744298/3578384369' // Your real iOS banner ID from AdMob
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial ID - replace with real Android ID
    ios: 'ca-app-pub-9239950445744298/9952221024' // Your real iOS interstitial ad ID from AdMob
  },
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917', // Test rewarded ID - replace with real Android ID
    ios: 'ca-app-pub-9239950445744298/1776834647' // Your real iOS rewarded ad ID from AdMob
  }
};

class AdService {
  private isInitialized = false;
  private isMobile = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // Check if running on mobile platform
    this.isMobile = Capacitor.isNativePlatform();
    
    if (!this.isMobile) {
      console.log('AdMob not available on web platform');
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: [], // Empty for production
        initializeForTesting: false, // Production mode for real revenue
      });
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  async showBanner() {
    if (!this.isMobile || !this.isInitialized) return;

    try {
      const platform = Capacitor.getPlatform();
      const adId = platform === 'android' ? AD_CONFIG.banner.android : AD_CONFIG.banner.ios;

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false // Production mode for real revenue
      };

      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  async hideBanner() {
    if (!this.isMobile || !this.isInitialized) return;

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.isMobile || !this.isInitialized) return false;

    try {
      const platform = Capacitor.getPlatform();
      const adId = platform === 'android' ? AD_CONFIG.interstitial.android : AD_CONFIG.interstitial.ios;

      const options = {
        adId,
        isTesting: false // Production mode for real revenue
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.isMobile || !this.isInitialized) return false;

    try {
      const platform = Capacitor.getPlatform();
      const adId = platform === 'android' ? AD_CONFIG.rewarded.android : AD_CONFIG.rewarded.ios;

      const options: RewardAdOptions = {
        adId,
        isTesting: false // Production mode for real revenue
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      
      if (result) {
        console.log('User earned reward:', result);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return false;
    }
  }

  // Web fallback ads using Google AdSense or other web ad networks
  showWebBanner() {
    if (this.isMobile) return;
    
    // Placeholder for web banner implementation
    console.log('Web banner ad would show here');
    // You can integrate Google AdSense, Media.net, or other web ad networks here
  }

  showWebInterstitial(): Promise<boolean> {
    if (this.isMobile) return Promise.resolve(false);
    
    // Placeholder for web interstitial implementation
    console.log('Web interstitial ad would show here');
    return Promise.resolve(false);
  }
}

export const adService = new AdService();