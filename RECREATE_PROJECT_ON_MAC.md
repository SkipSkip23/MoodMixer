# Build Mixly from Scratch on Your Mac

Since file downloads aren't working, I'll give you everything to recreate your complete Mixly app on your Mac.

## Step 1: Create Base Project

On your Mac terminal:

```bash
# Create project directory
mkdir mixly-app
cd mixly-app

# Initialize Node.js project
npm init -y

# Install Capacitor and dependencies
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor-community/admob
npm install react react-dom @types/react @types/react-dom
npm install vite @vitejs/plugin-react typescript
npm install express @types/express
npm install openai @types/node
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-button lucide-react
npm install @tanstack/react-query axios

# Initialize Capacitor
npx cap init "Mixly" "com.yourname.mixly"
npx cap add ios

# Initialize Tailwind
npx tailwindcss init -p
```

## Step 2: Package.json Scripts

Replace your package.json scripts section:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "tsx server/index.ts",
    "client": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Step 3: Project Structure

Create these folders and files:

```
mixly-app/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── services/
│       └── ads.ts
├── server/
│   ├── index.ts
│   └── routes.ts
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── capacitor.config.ts
```

## Step 4: Core Configuration Files

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.mixly',
  appName: 'Mixly',
  webDir: 'dist',
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

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

### tailwind.config.js
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          50: '#F3F0FF',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9'
        }
      }
    },
  },
  plugins: [],
};
```

## Step 5: Essential Source Files

### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mixly - AI Cocktail Suggestions</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: 262 83% 58%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --primary: 262 83% 58%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

### src/App.tsx
```typescript
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adService } from './services/ads';

interface CocktailResponse {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  garnish: string;
  emoji: string;
}

export default function App() {
  const [mood, setMood] = useState('');
  const [liquor, setLiquor] = useState('');
  const [cocktail, setCocktail] = useState<CocktailResponse | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [watchedAds, setWatchedAds] = useState(0);

  const cocktailMutation = useMutation({
    mutationFn: async (data: { mood: string; liquor: string }) => {
      const response = await fetch('/api/suggest-cocktail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCocktail(data);
      setUsageCount(prev => prev + 1);
    }
  });

  const handleWatchAd = async () => {
    const success = await adService.showRewardedAd();
    if (success) {
      setWatchedAds(prev => prev + 1);
    }
  };

  const canMakeRequest = usageCount < 3 || (watchedAds > 0 && usageCount < 5) || (watchedAds > 1 && usageCount < 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">🍸 Mixly</h1>
          <p className="text-purple-600">AI-Powered Cocktail Suggestions</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling?
              </label>
              <select 
                value={mood} 
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select your mood...</option>
                <option value="happy">😊 Happy & Celebratory</option>
                <option value="relaxed">😌 Relaxed & Chill</option>
                <option value="adventurous">🚀 Adventurous & Bold</option>
                <option value="romantic">💕 Romantic & Intimate</option>
                <option value="sophisticated">🎩 Sophisticated & Classy</option>
                <option value="afterdark">😈 After Dark</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Liquor
              </label>
              <select 
                value={liquor} 
                onChange={(e) => setLiquor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose your spirit...</option>
                <option value="vodka">🥃 Vodka</option>
                <option value="gin">🍸 Gin</option>
                <option value="rum">🥥 Rum</option>
                <option value="whiskey">🥃 Whiskey</option>
                <option value="tequila">🌵 Tequila</option>
                <option value="wine">🍷 Wine</option>
              </select>
            </div>

            {!canMakeRequest && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm mb-3">
                  Daily limit reached! Watch an ad to unlock more suggestions.
                </p>
                <button
                  onClick={handleWatchAd}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                >
                  Watch Ad for More Cocktails
                </button>
              </div>
            )}

            <button
              onClick={() => cocktailMutation.mutate({ mood, liquor })}
              disabled={!mood || !liquor || !canMakeRequest || cocktailMutation.isPending}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {cocktailMutation.isPending ? 'Creating...' : 'Get My Cocktail 🍹'}
            </button>
          </div>
        </div>

        {cocktail && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{cocktail.emoji}</div>
              <h2 className="text-2xl font-bold text-purple-800">{cocktail.name}</h2>
              <p className="text-gray-600 mt-2">{cocktail.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ingredients:</h3>
                <ul className="space-y-1">
                  {cocktail.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">• {ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
                <ol className="space-y-1">
                  {cocktail.instructions.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Garnish:</h3>
                <p className="text-gray-700">{cocktail.garnish}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Requests used: {usageCount}/3 {watchedAds > 0 && `(+${watchedAds * 2} bonus)`}</p>
          <p className="mt-2">Drink responsibly 🚗</p>
        </div>
      </div>
    </div>
  );
}
```

## Step 6: Ad Service

### src/services/ads.ts
```typescript
import { AdMob, BannerAdOptions, RewardAdOptions } from '@capacitor-community/admob';

class AdService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await AdMob.initialize({
        initializeForTesting: false,
        testingDevices: []
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  async showBanner() {
    await this.initialize();
    
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-9239950445744298/3578384369',
      adSize: 'BANNER',
      position: 'BOTTOM_CENTER',
      margin: 0,
    };

    await AdMob.showBanner(options);
  }

  async showRewardedAd(): Promise<boolean> {
    await this.initialize();
    
    try {
      const options: RewardAdOptions = {
        adId: 'ca-app-pub-9239950445744298/1776834647'
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      return result.rewarded;
    } catch (error) {
      console.error('Rewarded ad failed:', error);
      return false;
    }
  }
}

export const adService = new AdService();
```

## Step 7: Server Setup

### server/index.ts
```typescript
import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('dist'));

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### server/routes.ts
```typescript
import { Express } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-key-here'
});

export function registerRoutes(app: Express) {
  app.post('/api/suggest-cocktail', async (req, res) => {
    try {
      const { mood, liquor } = req.body;
      
      const prompt = `Create a cocktail suggestion for someone feeling ${mood} who prefers ${liquor}. 
      ${mood === 'afterdark' ? 'Make it provocative and seductive with an adult theme.' : ''}
      Return JSON with: name, description, ingredients array, instructions array, garnish, emoji.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const cocktail = JSON.parse(response.choices[0].message.content || '{}');
      res.json(cocktail);
    } catch (error) {
      console.error('OpenAI error:', error);
      res.status(500).json({ error: 'Failed to generate cocktail' });
    }
  });
}
```

## Step 8: Build and Deploy

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Sync with Capacitor
npx cap sync

# Open in Xcode
npx cap open ios
```

## Step 9: iOS Configuration in Xcode

1. **Bundle Identifier**: Set to `com.yourname.mixly`
2. **Signing**: Select your Apple Developer team
3. **Info.plist**: Add AdMob App ID:
   ```xml
   <key>GADApplicationIdentifier</key>
   <string>ca-app-pub-9239950445744298~6096572015</string>
   ```

## Production Ad Units Ready
- Banner: ca-app-pub-9239950445744298/3578384369
- Rewarded: ca-app-pub-9239950445744298/1776834647
- Interstitial: ca-app-pub-9239950445744298/9952221024

Your app will generate revenue immediately after App Store approval!