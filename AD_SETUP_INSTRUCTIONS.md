# Mixly - Complete Project Export Instructions

## Getting Your Project to Mac

### Method 1: GitHub (Recommended)
1. **In Replit**: Click "Version Control" in left sidebar
2. **Connect GitHub**: Follow prompts to link your GitHub account
3. **Push Project**: Click "Push to GitHub" - creates public repository
4. **On Mac**: 
   ```bash
   git clone https://github.com/yourusername/your-repo-name
   cd your-repo-name
   ```

### Method 2: Direct File Download
1. **Download Archive**: Right-click `mixly-ios-project.tar.gz` → Download
2. **Extract on Mac**: Double-click to extract
3. **Navigate**: `cd App` then `open App.xcworkspace`

### Method 3: Manual Recreation
If both methods fail, create fresh project on Mac:

```bash
# Install tools
npm install -g @capacitor/cli

# Create project
mkdir mixly-app && cd mixly-app
npm init -y
npm install @capacitor/core @capacitor/ios @capacitor-community/admob

# Initialize with exact settings
npx cap init "Mixly" "com.yourname.mixly"
npx cap add ios
```

## Critical Configuration Files

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.mixly',
  appName: 'Mixly',
  webDir: 'dist/public',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9239950445744298~6096572015',
      initializeForTesting: false
    }
  }
};
export default config;
```

### iOS Info.plist Additions
Add to `ios/App/App/Info.plist`:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-9239950445744298~6096572015</string>
```

## Production AdMob IDs (Ready for Revenue)

**iOS Units:**
- App: ca-app-pub-9239950445744298~6096572015
- Banner: ca-app-pub-9239950445744298/3578384369
- Rewarded: ca-app-pub-9239950445744298/1776834647
- Interstitial: ca-app-pub-9239950445744298/9952221024

**Android Units:**
- App: ca-app-pub-9239950445744298~3501798093
- Banner: ca-app-pub-9239950445744298/1924174303
- Rewarded: ca-app-pub-9239950445744298/5080820681
- Interstitial: ca-app-pub-9239950445744298/0298010960

## Once on Mac

### Build Process
```bash
# Install dependencies
npm install

# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios
```

### Xcode Setup
1. **Signing**: Select your Apple Developer team
2. **Bundle ID**: Change to `com.yourname.mixly`
3. **Test**: Run on real device to verify ads display
4. **Archive**: Product → Archive for App Store

## Revenue Streams Active
Your app generates income through:
- Banner ads: $0.50-2.00 per 1000 views
- Rewarded videos: $10-40 per 1000 completions  
- Interstitial ads: $3-8 per 1000 views
- Premium subscriptions: $4.99/month
- Affiliate commissions: 3-8% on purchases

Revenue begins immediately after App Store approval.

## App Store Details
- **Category**: Food & Drink
- **Age Rating**: 17+ (Alcohol content)
- **Price**: Free with in-app purchases
- **Description**: AI-powered cocktail recommendations based on mood

Which download method would you like to try first?