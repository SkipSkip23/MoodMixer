# Complete Mixly App Store Submission Package

## Download Your iOS Project Files

### Option 1: Direct Download from Replit
1. Navigate to the `ios/App/` folder in the file browser
2. Right-click on the `App` folder and select "Download"
3. This downloads your complete iOS project as a zip file

### Option 2: Connect to GitHub
1. In Replit, click "Version Control" (left sidebar)
2. Click "Create a Git repository"
3. Connect your GitHub account
4. Push the project to GitHub
5. Clone on your Mac: `git clone [your-github-repo-url]`

### Option 3: Manual Setup (If downloads fail)
Create a new Capacitor project on your Mac with these exact settings:

```bash
# Install Capacitor
npm install -g @capacitor/cli

# Create project
mkdir mixly-app
cd mixly-app
npm init -y
npm install @capacitor/core @capacitor/ios @capacitor-community/admob
npx cap init Mixly com.yourname.mixly
npx cap add ios
```

## Essential Configuration Files

### 1. capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.mixly',
  appName: 'Mixly',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9239950445744298~6096572015',
      initializeForTesting: false
    }
  }
};

export default config;
```

### 2. iOS Info.plist Updates
Add to `ios/App/App/Info.plist`:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-9239950445744298~6096572015</string>
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
<key>SKAdNetworkItems</key>
<array>
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>cstr6suwn9.skadnetwork</string>
    </dict>
</array>
```

### 3. Build and Sync Commands
```bash
# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

## Complete Revenue Configuration (Production Ready)

### iOS AdMob Units
- App ID: `ca-app-pub-9239950445744298~6096572015`
- Banner: `ca-app-pub-9239950445744298/3578384369`
- Rewarded Video: `ca-app-pub-9239950445744298/1776834647`
- Interstitial: `ca-app-pub-9239950445744298/9952221024`

### Android AdMob Units
- App ID: `ca-app-pub-9239950445744298~3501798093`
- Banner: `ca-app-pub-9239950445744298/1924174303`
- Rewarded Video: `ca-app-pub-9239950445744298/5080820681`
- Interstitial: `ca-app-pub-9239950445744298/0298010960`

## App Store Submission Checklist

### Before Submitting
- [ ] Test on real device (ads should show)
- [ ] Verify all cocktail suggestions work
- [ ] Test premium upgrade flow
- [ ] Confirm affiliate links work
- [ ] Test "After Dark" mode

### App Store Connect Setup
- [ ] Create new app with Bundle ID: `com.yourname.mixly`
- [ ] Age Rating: 17+ (Frequent/Intense Alcohol Use)
- [ ] Category: Food & Drink
- [ ] Price: Free (with in-app purchases)

### App Description
```
Mixly - AI Cocktail Suggestions

Discover perfect cocktails based on your mood with AI-powered recommendations. Get personalized drink recipes, ingredient lists, and professional mixing tips.

Features:
• AI-powered cocktail suggestions
• Mood-based recommendations
• Detailed recipes and ingredients
• Premium unlimited access
• Responsible drinking reminders

Perfect for cocktail enthusiasts and home bartenders!
```

### Keywords
cocktail, drink, recipe, bartender, AI, mood, alcohol, mixing, drinks, bar

## Revenue Streams Active
1. **Banner Ads**: $0.50-$2.00 per 1000 views
2. **Rewarded Videos**: $10-$40 per 1000 completions
3. **Interstitial Ads**: $3-$8 per 1000 views
4. **Premium Subscriptions**: $4.99/month recurring
5. **Affiliate Commissions**: 3-8% on ingredient purchases

Your app will start generating revenue immediately after App Store approval.

## Next Steps
1. Get project files using one of the methods above
2. Open `App.xcworkspace` in Xcode
3. Configure signing with your Apple Developer account
4. Test on device
5. Archive and upload to App Store Connect
6. Submit for review (typically 1-7 days)

Revenue generation begins the moment your app goes live!