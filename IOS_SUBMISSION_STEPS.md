# iOS App Store Submission - Step by Step

## 1. Build iOS App
Run these commands in your terminal:

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 2. Configure in Xcode
When Xcode opens:

1. **Select your app target** (App folder in left sidebar)
2. **Signing & Capabilities tab:**
   - Team: Select your Apple Developer account
   - Bundle Identifier: `com.yourname.mixly` (replace "yourname" with your developer name)
3. **General tab:**
   - Display Name: `Mixly`
   - Version: `1.0.0`
   - Build: `1`
   - Minimum Deployments: iOS 13.0

## 3. Test on Device
1. Connect your iPhone
2. Select your device in Xcode
3. Click Run button to test
4. Verify ads work properly (banner at bottom, rewarded videos for extra cocktails)

## 4. Archive for App Store
1. **Product menu → Archive**
2. Wait for build to complete
3. **Window → Organizer** to see archives
4. Click **Distribute App**
5. Choose **App Store Connect**
6. Follow upload wizard

## 5. App Store Connect
Go to https://appstoreconnect.apple.com:

1. **My Apps → + → New App**
2. **Platform:** iOS
3. **Name:** Mixly - AI Cocktail Suggestions
4. **Bundle ID:** Same as Xcode (com.yourname.mixly)
5. **Language:** English

## 6. App Information
**Category:** Food & Drink
**Age Rating:** 17+ (Frequent/Intense Alcohol, Tobacco, or Drug Use or References)

**Description:**
```
Discover your perfect cocktail with AI-powered suggestions! Mixly creates personalized drink recommendations based on your mood and preferred spirits.

Features:
• AI-powered cocktail suggestions using advanced algorithms
• Mood-based recommendations for any occasion
• Professional bartender recipes with detailed instructions
• Ingredient shopping links for convenient purchasing
• Safe drinking reminders with ride-sharing integration
• Premium unlimited suggestions available

Whether you're feeling adventurous, celebratory, or want to chill, Mixly has the perfect cocktail for every moment. Our AI learns from hundreds of classic and modern cocktails to suggest drinks you'll love.

Free version includes 3 daily suggestions with optional ads for bonus cocktails. Premium subscribers get unlimited access.
```

**Keywords:** cocktail, drinks, bartender, AI, recipes, mixology, spirits, alcohol

## 7. Pricing
- **Price:** Free
- **In-App Purchases:** Add $4.99/month premium subscription

## 8. Submit for Review
1. Upload your build from Xcode
2. Add screenshots (you'll need iPhone 6.7" screenshots)
3. Submit for review

**Review time:** Usually 1-7 days

Your app is technically ready - all ad revenue streams are configured and will start earning immediately upon approval.