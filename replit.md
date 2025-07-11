# Cocktail Suggestion App

## Overview

This is a full-stack web application called "Mixly" that provides personalized cocktail suggestions based on user mood and preferred liquor type. The app uses AI (OpenAI GPT-4o) to generate thoughtful cocktail recommendations with detailed recipes, ingredients, and presentation tips. The app includes freemium features with usage limits, affiliate monetization, and ride-sharing integration for responsible drinking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom cocktail-themed color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **AI Integration**: OpenAI API for cocktail suggestions
- **Session Management**: In-memory storage (development) with support for PostgreSQL sessions

### Database Design
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **Schema Management**: Drizzle Kit for migrations
- **Current Tables**:
  - `users`: Basic user authentication schema with username/password
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Frontend Components
1. **Home Page** (`client/src/pages/home.tsx`): Main interface with mood/liquor selection, usage tracking, ad system, and ride-sharing integration
2. **UI Components**: Comprehensive set of reusable components from Shadcn/ui
3. **Query Client**: Centralized API request handling with error management
4. **Toast System**: User feedback for success/error states
5. **User Tracking**: Local storage-based user identification for usage limits

### Backend Services
1. **OpenAI Service** (`server/services/openai.ts`): AI-powered cocktail suggestion generation
2. **Usage Service** (`server/services/usage.ts`): Daily usage limits and ad-watching logic
3. **Affiliate Service** (`server/services/affiliate.ts`): Partner link generation for ingredients
4. **Routes** (`server/routes.ts`): API endpoints including `/suggest`, `/health`, `/version`, and deep links
5. **Storage Layer** (`server/storage.ts`): Database abstraction with user usage tracking
6. **Vite Integration** (`server/vite.ts`): Development server setup

### Shared Schema
- Type-safe schema definitions using Zod
- Cocktail suggestion validation with user ID and ad-watching flags
- User authentication and usage tracking schemas
- Database table definitions for users and usage limits
- Affiliate link schema definitions

### Mixly Features
1. **Usage Limits**: 3 cocktail suggestions per day per user
2. **Ad Monetization**: Watch-ad-to-unlock additional requests
3. **Deep Links**: Uber and Lyft integration for responsible drinking
4. **Affiliate Links**: Drizly, Amazon, and Total Wine partner integration ready
5. **Analytics Ready**: Ad interaction tracking and user behavior monitoring

## Data Flow

1. **User Input**: User selects mood and liquor type on the frontend
2. **API Request**: Frontend sends POST request to `/api/suggest-cocktail`
3. **Validation**: Server validates request using Zod schemas
4. **AI Processing**: OpenAI service generates cocktail suggestion based on mood/liquor
5. **Response**: Structured cocktail data returned to frontend
6. **Display**: React component renders cocktail details with smooth scrolling

## External Dependencies

### AI Integration
- **OpenAI API**: GPT-4o model for cocktail suggestions
- **Configuration**: Environment variable `OPENAI_API_KEY`
- **Response Format**: Structured JSON with drink name, description, ingredients, garnish, and emoji

### Database
- **Neon Database**: Serverless PostgreSQL
- **Configuration**: Environment variable `DATABASE_URL`
- **ORM**: Drizzle with automatic schema synchronization

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Icon system
- **React Hook Form**: Form handling with validation

## Deployment Strategy

### Development
- **Environment**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Hot Reload**: Vite dev server with HMR
- **Port Configuration**: Local port 5000, external port 80
- **Command**: `npm run dev`

### Production
- **Build Process**: 
  1. Vite builds client assets to `dist/public`
  2. ESBuild bundles server code to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit
- **Start Command**: `npm run start`
- **Static Assets**: Served from `dist/public`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment specification (development/production)

## Changelog

Changelog:
- June 19, 2025. Initial setup
- June 19, 2025. Integrated Mixly features: usage limits (3 drinks/day), ad monetization support, deep links for Uber/Lyft, affiliate links for ingredients, user tracking with localStorage
- June 19, 2025. Added comprehensive ad revenue system: Google AdMob integration with banner ads, rewarded video ads, and interstitial ads. Set up Capacitor for native iOS/Android app store distribution with proper ad monetization ready for production deployment.
- June 19, 2025. Fixed affiliate link display to show clean ingredient names (e.g., "Order Tequila" instead of "Order 2 oz Tequila"). Set Total Wine as primary partner for ingredient purchases.
- June 19, 2025. Implemented graduated ad bonus system: Base 3 requests + 2 more after 1st ad + 1 more after 2nd ad. Premium upgrade offers shown at every limit stage for maximum conversion.
- June 19, 2025. Added "Mixly After Dark" mode with provocative cocktail names and special purple/pink styling for adult-themed content. Direct access without age verification.
- June 25, 2025. Configured real AdMob integration with production App ID (ca-app-pub-9239950445744298~6096572015) and iOS banner ad unit for live revenue generation. Disabled test mode for actual earnings.
- June 25, 2025. Added iOS rewarded video ad unit (ca-app-pub-9239950445744298/1776834647) for high-value ad revenue. Rewarded ads integrated with graduated bonus system for maximum user engagement and earnings.
- June 25, 2025. Completed iOS interstitial ad unit (ca-app-pub-9239950445744298/9952221024) for full-screen ad revenue. All three iOS ad types now configured for maximum monetization potential.
- June 25, 2025. Added Android banner ad unit (ca-app-pub-9239950445744298/1924174303) and Android App ID (ca-app-pub-9239950445744298~3501190093) for cross-platform banner ad revenue.
- June 25, 2025. Completed Android rewarded video ad unit (ca-app-pub-9239950445744298/5080820681) for cross-platform high-value ad revenue. Updated Android App ID to ca-app-pub-9239950445744298~3501798093.
- June 25, 2025. Finalized Android interstitial ad unit (ca-app-pub-9239950445744298/0298010960) completing full cross-platform ad monetization. All revenue streams now active for both iOS and Android platforms.

## User Preferences

Preferred communication style: Simple, everyday language.