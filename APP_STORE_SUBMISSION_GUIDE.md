# Mixly App Store Submission Guide

## Part 2: Apple App Store Submission

### Prerequisites
1. Apple Developer Account ($99/year) - https://developer.apple.com
2. Mac computer with Xcode installed
3. iOS device for testing

### Step 1: Prepare iOS Build
```bash
# Build for iOS
npm run build
npx cap add ios
npx cap sync ios
```

### Step 2: Open in Xcode
```bash
npx cap open ios
```

### Step 3: Configure App in Xcode
1. Select your app target
2. Update Bundle Identifier: `com.yourname.mixly`
3. Set Version: `1.0.0`
4. Set Build: `1`
5. Configure signing with your Apple Developer account

### Step 4: Create App Store Connect Record
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Platform: iOS
4. Name: "Mixly - AI Cocktail Suggestions"
5. Bundle ID: Match your Xcode bundle ID
6. Category: Food & Drink

### Step 5: App Store Listing Requirements
- **App Name**: Mixly - AI Cocktail Suggestions
- **Subtitle**: Personalized cocktails based on your mood
- **Description**: 
```
Discover your perfect cocktail with AI-powered suggestions! Mixly creates personalized drink recommendations based on your mood and preferred spirits.

Features:
• AI-powered cocktail suggestions
• Mood-based recommendations  
• Professional bartender recipes
• Ingredient shopping links
• Ride-sharing integration for safe drinking
• Premium unlimited suggestions

Whether you're feeling adventurous, celebratory, or just want to chill, Mixly has the perfect cocktail for every moment.
```

- **Keywords**: cocktail, drinks, bartender, AI, recipes, mixology, spirits
- **Screenshots**: Need 6.5" iPhone screenshots (1284x2778 pixels)
- **App Icon**: 1024x1024 pixels

### Step 6: Age Rating & Content
- Age Rating: 17+ (due to alcohol content)
- Content Warnings: Alcohol/Tobacco content

## Part 3: Google Play Store Submission

### Prerequisites
1. Google Play Console Account ($25 one-time fee)
2. Android device for testing

### Step 1: Prepare Android Build
```bash
# Build for Android
npm run build
npx cap add android
npx cap sync android
```

### Step 2: Generate Signed APK
```bash
npx cap open android
```
In Android Studio:
1. Build → Generate Signed Bundle/APK
2. Choose "Android App Bundle"
3. Create/use keystore for signing
4. Build release bundle

### Step 3: Create Play Console App
1. Go to https://play.google.com/console
2. Create new app
3. App name: "Mixly - AI Cocktail Suggestions"
4. Default language: English
5. Category: Food & Drink

### Step 4: Store Listing
- **Short description**: AI-powered cocktail suggestions based on your mood
- **Full description**: Same as iOS description above
- **Screenshots**: Need phone screenshots (16:9 ratio recommended)
- **Feature graphic**: 1024x500 pixels
- **App icon**: 512x512 pixels

### Step 5: Content Rating
- Complete content rating questionnaire
- Expect "Mature 17+" due to alcohol content

### Step 6: Upload APK/Bundle
1. Go to Release → Production
2. Upload your signed bundle
3. Complete release details
4. Submit for review

## Revenue Projections
- **Free users**: 3 cocktails/day with ads
- **Premium users**: $4.99/month for unlimited
- **Ad revenue**: $50-200/day with 1000+ users
- **Affiliate commissions**: 3-8% on ingredient purchases

## Launch Timeline
- iOS review: 1-7 days
- Android review: 1-3 days
- Total launch time: 1-2 weeks after submission