# Cocktail Suggestion App

## Overview

This is a full-stack web application that provides personalized cocktail suggestions based on user mood and preferred liquor type. The app uses AI (OpenAI GPT-4o) to generate thoughtful cocktail recommendations with detailed recipes, ingredients, and presentation tips.

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
1. **Home Page** (`client/src/pages/home.tsx`): Main interface for mood/liquor selection and cocktail display
2. **UI Components**: Comprehensive set of reusable components from Shadcn/ui
3. **Query Client**: Centralized API request handling with error management
4. **Toast System**: User feedback for success/error states

### Backend Services
1. **OpenAI Service** (`server/services/openai.ts`): AI-powered cocktail suggestion generation
2. **Routes** (`server/routes.ts`): API endpoint definitions
3. **Storage Layer** (`server/storage.ts`): Database abstraction with in-memory fallback
4. **Vite Integration** (`server/vite.ts`): Development server setup

### Shared Schema
- Type-safe schema definitions using Zod
- Cocktail suggestion validation
- User authentication schemas
- Database table definitions

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

## User Preferences

Preferred communication style: Simple, everyday language.