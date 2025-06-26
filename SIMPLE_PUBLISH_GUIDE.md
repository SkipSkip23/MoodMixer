# Publish Mixly to App Store - Simple Steps

## What You Need
1. Mac with Xcode installed
2. Apple Developer account ($99/year)
3. Your project files

## Get Project Files (Pick ONE method)

### Method 1: GitHub
1. In Replit, click "Version Control" (left sidebar)
2. Connect GitHub account
3. Push to GitHub
4. On Mac: `git clone [your-github-url]`

### Method 2: Download Archive
1. Find `mixly-ios-project.tar.gz` in Replit files
2. Right-click → Download
3. Extract on Mac

### Method 3: Recreate (if others fail)
On Mac terminal:
```bash
mkdir mixly && cd mixly
git clone https://github.com/ionic-team/capacitor-admob-demo.git .
npm install
```

## Build for App Store

Once you have files on Mac:

```bash
cd your-project-folder/ios/App
open App.xcworkspace
```

## In Xcode (3 minutes)

1. **Change Bundle ID**: 
   - Select project → General → Bundle Identifier
   - Change to: `com.yourname.mixly`

2. **Set Signing**:
   - Signing & Capabilities → Team → Select your Apple Developer account

3. **Archive**:
   - Product → Archive
   - Upload to App Store

## App Store Connect Setup

1. Go to appstoreconnect.apple.com
2. Create new app:
   - Name: Mixly
   - Bundle ID: com.yourname.mixly
   - Category: Food & Drink
   - Age Rating: 17+ (alcohol content)

3. Upload screenshots (I can help create these)
4. Add description:
   "AI-powered cocktail recommendations based on your mood. Get personalized drink recipes and mixing instructions."

5. Submit for review

## Revenue Setup (Already Configured)
Your app has production AdMob IDs ready:
- iOS App: ca-app-pub-9239950445744298~6096572015
- Banner Ads: ca-app-pub-9239950445744298/3578384369
- Rewarded Videos: ca-app-pub-9239950445744298/1776834647

Revenue starts immediately after approval (1-7 days).

Which file transfer method works best for you?