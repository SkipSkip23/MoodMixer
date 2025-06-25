# Get Mixly iOS Project to Your Mac - Complete Guide

## Method 1: Direct Replit Download (Recommended)
1. In Replit file browser, navigate to `ios/App/`
2. Right-click on the `App` folder
3. Select "Download" - this will download the entire iOS project as a zip file
4. Extract the zip on your Mac
5. Open Terminal and navigate to the extracted folder
6. Run: `open App.xcworkspace`

## Method 2: Manual File Recreation
If download doesn't work, I'll help you recreate the essential files:

### Step 1: Create New iOS Project
```bash
# On your Mac, install Capacitor CLI
npm install -g @capacitor/cli

# Create new directory
mkdir mixly-ios
cd mixly-ios

# Initialize Capacitor
npm init -y
npm install @capacitor/core @capacitor/ios @capacitor-community/admob
npx cap init Mixly com.yourdomain.mixly
npx cap add ios
```

### Step 2: Key Configuration Files

#### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourdomain.mixly',
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

#### iOS Info.plist Updates
Add these keys to ios/App/App/Info.plist:
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-9239950445744298~6096572015</string>
<key>SKAdNetworkItems</key>
<array>
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>cstr6suwn9.skadnetwork</string>
    </dict>
</array>
```

## Method 3: Replit Git Export
1. In Replit, go to the Shell tab
2. Run these commands:
```bash
git add .
git commit -m "Complete Mixly iOS project"
```
3. Connect to GitHub through Version Control panel
4. Push to your GitHub repository
5. Clone on your Mac: `git clone [your-repo-url]`

## Method 4: Individual File Transfer
I can show you each critical file's content that you can copy manually:

### Essential iOS Files Needed:
- `ios/App/App.xcworkspace` (main Xcode workspace)
- `ios/App/App/Info.plist` (app configuration)
- `ios/App/Podfile` (dependencies)
- `capacitor.config.ts` (Capacitor configuration)

## Once You Have the Files on Mac:

### Step 1: Open in Xcode
```bash
cd ios/App
open App.xcworkspace
```

### Step 2: Configure Signing
1. Select your project in Xcode navigator
2. Under "Signing & Capabilities":
   - Set Team to your Apple Developer account
   - Change Bundle Identifier to: `com.yourname.mixly`

### Step 3: Build Web Assets
In your main project directory:
```bash
npm install
npm run build
npx cap sync ios
```

### Step 4: Test and Archive
1. Select "Any iOS Device" as build target
2. Product → Archive
3. Upload to App Store Connect

## Ad Revenue Configuration (Already Set Up)
Your app has all production AdMob IDs configured:
- iOS App ID: ca-app-pub-9239950445744298~6096572015
- Banner Ad: ca-app-pub-9239950445744298/3578384369
- Rewarded Video: ca-app-pub-9239950445744298/1776834647
- Interstitial: ca-app-pub-9239950445744298/9952221024

## Troubleshooting
If you encounter issues:
1. Make sure you have latest Xcode installed
2. Verify Apple Developer account is active
3. Clean build folder: Product → Clean Build Folder
4. Ensure all pods are installed: `cd ios/App && pod install`

Which method would you like to try first?