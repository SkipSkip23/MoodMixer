# Mixly Ad Setup Instructions

## Replace Test Ad IDs with Real Ones

Once you get your real Ad Unit IDs from Google AdMob, update these files:

### File: client/src/services/ads.ts
Replace lines 7-18 with your real Ad Unit IDs:

```javascript
const AD_CONFIG = {
  banner: {
    android: 'YOUR_ANDROID_BANNER_AD_UNIT_ID',
    ios: 'YOUR_IOS_BANNER_AD_UNIT_ID'
  },
  interstitial: {
    android: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID', 
    ios: 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID'
  },
  rewarded: {
    android: 'YOUR_ANDROID_REWARDED_AD_UNIT_ID',
    ios: 'YOUR_IOS_REWARDED_AD_UNIT_ID'
  }
};
```

### Also update these settings for production:
- Line 39: Change `initializeForTesting: true` to `initializeForTesting: false`
- Line 60: Change `isTesting: true` to `isTesting: false`

## Revenue Potential
- Banner ads: $0.50-$2.00 per 1000 views
- Rewarded video ads: $10-$40 per 1000 completions  
- Interstitial ads: $3-$8 per 1000 views
- With 1000 daily users: $50-200/day potential revenue